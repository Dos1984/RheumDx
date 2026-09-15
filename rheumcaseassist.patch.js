(function(){
'use strict';

const STYLE=document.createElement('style');
STYLE.textContent=`
.rca-modebar{background:#fff;border:1px solid var(--line);border-radius:13px;padding:12px 13px;margin:10px 0 12px}.rca-modehead{display:flex;align-items:center;justify-content:space-between;gap:10px}.rca-modehead b{color:var(--navy);font-size:13px}.rca-switch{border:1px solid var(--line);background:#edf6f6;color:var(--teal);border-radius:999px;padding:7px 10px;font-size:11px;font-weight:850}.rca-switch.off{background:#fff;color:var(--muted)}.rca-modecopy{font-size:11.5px;color:var(--muted);line-height:1.4;margin-top:5px}.rca-branch{border-radius:12px;padding:12px 13px;margin:10px 0;border:1px solid var(--line);font-size:12.8px;line-height:1.5}.rca-branch.good{background:#edf8f2;border-left:5px solid var(--green)}.rca-branch.retry{background:#fff7e8;border-left:5px solid var(--amber)}.rca-branch .rca-kicker{font-size:10.5px;font-weight:900;letter-spacing:.6px;text-transform:uppercase;margin-bottom:4px}.rca-branch.good .rca-kicker{color:var(--green)}.rca-branch.retry .rca-kicker{color:var(--amber)}.rca-branch b{color:var(--navy)}.rca-branch ul{margin:6px 0 0 18px;padding:0}.rca-branch li{margin:4px 0}.rca-reflect{width:100%;border:1.5px solid var(--teal);background:#f7fbfb;color:var(--navy);border-radius:10px;padding:10px 12px;font-weight:800;text-align:left;margin:7px 0}.rca-reflect small{display:block;color:var(--muted);font-weight:600;margin-top:2px}.rca-mini{display:none;border:1px solid var(--line);border-radius:10px;padding:10px 11px;margin:6px 0 10px;background:#fff;font-size:12px;line-height:1.45}.rca-mini.open{display:block}.rca-pathbadge{display:inline-block;border-radius:999px;padding:3px 8px;font-size:10px;font-weight:850;margin-bottom:5px;background:#eef3f8;color:var(--navy)}
`;
document.head.appendChild(STYLE);

document.title='Rheum Case Assist — Rheumatology Case Learning';
let adaptive=true;

function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}
function section(){return document.getElementById('home')}
function addModeBar(){
 const home=section(); if(!home||document.getElementById('rcaModeBar')) return;
 const first=home.querySelector('.hero,.card'); if(!first) return;
 const box=document.createElement('div'); box.id='rcaModeBar'; box.className='rca-modebar';
 box.innerHTML=`<div class="rca-modehead"><b>Adaptive case branching</b><button type="button" id="rcaSwitch" class="rca-switch">On</button></div><div class="rca-modecopy">When enabled, investigation and management choices generate a short consequence branch before you move on — stronger choices unlock higher-yield information, while lower-yield choices show what may be delayed or missed.</div>`;
 first.insertAdjacentElement('afterend',box);
 box.querySelector('#rcaSwitch').onclick=()=>{adaptive=!adaptive;const b=box.querySelector('#rcaSwitch');b.textContent=adaptive?'On':'Off';b.classList.toggle('off',!adaptive)};
}

function branchType(q){
 const t=q.toLowerCase();
 if(/investig|test|blood|aspirat|urine|biopsy|work.?up|next.*test|order/.test(t)) return 'investigation';
 if(/image|x-?ray|mri|ct\b|ultrasound|radiograph|scan/.test(t)) return 'imaging';
 if(/treat|management|therapy|dmard|steroid|biologic|next step|urgent|start/.test(t)) return 'management';
 if(/diagnos|differential|most likely|phenotype|interpret/.test(t)) return 'diagnosis';
 return '';
}
function outcomeCopy(type,good){
 const goodMap={
  investigation:['High-yield branch unlocked','This choice is most likely to change the working differential or safely move the case forward.','Use the result to narrow competing diagnoses rather than ordering a broad untargeted panel.'],
  imaging:['Discriminating imaging branch unlocked','This imaging choice is well matched to the clinical question and should add meaningful anatomical or inflammatory information.','Interpret imaging in context — an abnormal image supports a phenotype but does not replace the clinical diagnosis.'],
  management:['Management branch unlocked','This choice addresses the dominant clinical problem while preserving safety and appropriate escalation.','Reassess response and toxicity rather than assuming the first treatment decision ends the case.'],
  diagnosis:['Diagnostic branch strengthened','This choice best integrates the pattern, chronology and objective findings available so far.','Keep a competing diagnosis active until its key discriminator has been addressed.']
 };
 const retryMap={
  investigation:['Lower-yield branch','This is a plausible test, but it is less likely to answer the immediate clinical question or may duplicate information already available.','Before proceeding, ask: what specific diagnosis will this result rule in, rule out, or change in management?'],
  imaging:['Imaging detour','This study may add information, but it is not the most direct imaging test for the current discriminator.','Consider whether another modality better demonstrates synovitis, sacroiliitis, crystal disease, vascular inflammation or organ involvement.'],
  management:['Management detour','This option is understandable, but it risks treating before the key diagnosis/safety issue has been sufficiently resolved.','Re-check urgent mimics, contraindications and whether disease severity or organ involvement changes treatment priority.'],
  diagnosis:['Differential remains open','The option fits part of the presentation but leaves important findings unexplained.','Return to the syndrome pattern and identify the single feature that most strongly separates the leading alternatives.']
 };
 return (good?goodMap:retryMap)[type] || (good?['Good clinical move','This choice keeps the case moving in a focused direction.','Continue to reassess as new information appears.']:['Useful learning branch','This option is plausible but not the strongest choice here.','Use the feedback to identify the missing discriminator before moving on.']);
}
function addBranch(btn){
 if(!adaptive) return;
 const player=document.getElementById('player'); if(!player||player.classList.contains('hidden')) return;
 const qEl=player.querySelector('.q'); if(!qEl) return;
 const type=branchType(clean(qEl.textContent)); if(!type) return;
 setTimeout(()=>{
   if(document.querySelector('.rca-branch')) return;
   const good=btn.classList.contains('good') || (!btn.classList.contains('bad') && /correct|strongest|nice work/i.test(clean(player.querySelector('.feedback')?.textContent)));
   const c=outcomeCopy(type,good);
   const panel=document.createElement('div');panel.className='rca-branch '+(good?'good':'retry');
   panel.innerHTML=`<div class="rca-kicker">${good?'✓ '+c[0]:'💡 '+c[0]}</div><div>${c[1]}</div><ul><li>${c[2]}</li></ul>`;
   const fb=player.querySelector('.feedback'); const anchor=fb||btn.closest('.card')||btn.parentElement;
   anchor.insertAdjacentElement('afterend',panel);
   if(type==='investigation'||type==='imaging') addReflect(panel,type,good);
   setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
 },80);
}
function addReflect(panel,type,good){
 const b=document.createElement('button'); b.type='button'; b.className='rca-reflect';
 b.innerHTML=`Pause & reflect<small>${type==='investigation'?'What result would make you change your leading diagnosis?':'What specific imaging feature are you expecting to see?'}</small>`;
 const m=document.createElement('div');m.className='rca-mini';
 m.innerHTML=good?'<span class="rca-pathbadge">Higher-yield path</span><br>Try to state the expected finding before continuing. This makes the next result an interpretation exercise rather than simple recognition.':'<span class="rca-pathbadge">Recovery path</span><br>Before continuing, identify the one investigation or imaging feature that would best discriminate the leading alternative diagnosis.';
 b.onclick=()=>m.classList.toggle('open');panel.appendChild(b);panel.appendChild(m);
}

document.addEventListener('click',e=>{const btn=e.target.closest('.opt');if(btn)addBranch(btn)},true);

function relabel(){
 document.querySelectorAll('h1,h2,p,div,span').forEach(el=>{
   if(el.children.length===0 && /RheumSim/.test(el.textContent||'')) el.textContent=(el.textContent||'').replace(/RheumSim/g,'Rheum Case Assist');
 });
 addModeBar();
}
let tm;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(relabel,80)}).observe(document.body,{subtree:true,childList:true});
setTimeout(relabel,200);
})();