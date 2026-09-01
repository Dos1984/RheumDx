(function(){
'use strict';
const style=document.createElement('style');
style.textContent=`
/* v23: independent per-diagnosis rationale routing */
.dx23-modal{position:fixed;inset:0;background:rgba(11,46,79,.5);display:none;align-items:flex-end;justify-content:center;z-index:11050;padding:10px 10px calc(10px + env(safe-area-inset-bottom));overscroll-behavior:contain}
.dx23-modal.open{display:flex}.dx23-sheet{width:min(760px,100%);max-height:min(72dvh,650px);overflow:auto;-webkit-overflow-scrolling:touch;background:#fff;border-radius:18px 18px 14px 14px;padding:0 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 24px 70px rgba(0,0,0,.28)}
.dx23-head{position:sticky;top:0;z-index:5;background:#fff;padding:14px 0 9px;border-bottom:1px solid var(--line);display:flex;align-items:flex-start;gap:10px}.dx23-head h3{margin:0;flex:1;line-height:1.25}.dx23-close{width:auto!important;padding:8px 12px!important;white-space:nowrap}.dx23-body{padding-top:9px}.dx23-section{margin-top:14px}.dx23-section>b{color:var(--teal)}
@media(max-width:620px){.dx23-modal{padding-left:7px;padding-right:7px}.dx23-sheet{max-height:68dvh;padding-left:14px;padding-right:14px}.dx23-head h3{font-size:18px}.dx23-section ul{padding-left:20px}.dx23-section li{margin-bottom:6px;line-height:1.4}}
`;
document.head.appendChild(style);

function clean(s){return String(s||'').replace(/[›»>]+\s*$/,'').replace(/\s+/g,' ').trim().toLowerCase()}
function moduleByVisibleLabel(label){
 const t=clean(label);if(!t)return null;
 let m=modules.find(x=>clean(x.label)===t);if(m)return m;
 const rules=[
  [/^rheumatoid arthritis(?:\s*\(ra\))?$/i,/rheumatoid arthritis/i],
  [/^reactive arthritis$/i,/reactive arthritis/i],
  [/^axial spondyloarthritis$/i,/axial spondyloarthritis|ankylosing/i],
  [/^early undifferentiated inflammatory arthritis$/i,/early undifferentiated inflammatory arthritis|inflammatory arthritis \/ early arthritis/i],
  [/^inflammatory arthritis \/ possible seronegative peripheral spa phenotype$/i,/seronegative peripheral spa|possible seronegative/i],
  [/^fibromyalgia \/ nociplastic pain phenotype$/i,/fibromyalgia/i],
  [/^osteoarthritis$/i,/osteoarthritis/i],
  [/^psoriatic arthritis$/i,/psoriatic arthritis/i],
  [/^gout$/i,/^gout$/i],
  [/^calcium pyrophosphate|^cppd/i,/calcium pyrophosphate|cppd/i]
 ];
 for(const [visible,moduleRe] of rules){if(visible.test(t)){m=modules.find(x=>moduleRe.test(x.label||''));if(m)return m}}
 return null;
}
function currentContext(){
 const age=parseInt(document.getElementById('age')?.value||'0',10)||0;
 let raw='';
 try{raw=(typeof originalAnalysisText!=='undefined'&&originalAnalysisText)||''}catch(e){}
 if(!raw)raw=document.getElementById('caseText')?.value||'';
 const t=typeof norm==='function'?norm(raw):String(raw).toLowerCase();
 let scored=[];try{scored=computeScored(t,age)||[]}catch(e){}
 return{age,raw,t,scored}
}
function ensureModal(){if(document.getElementById('dx23Modal'))return;const el=document.createElement('div');el.id='dx23Modal';el.className='dx23-modal';el.innerHTML='<div class="dx23-sheet" role="dialog" aria-modal="true" aria-labelledby="dx23Title"><div class="dx23-head"><h3 id="dx23Title">Differential diagnosis</h3><button type="button" class="btn secondary dx23-close">Close</button></div><div id="dx23Body" class="dx23-body"></div></div>';el.addEventListener('click',e=>{if(e.target===el)close23()});el.querySelector('.dx23-close').onclick=close23;document.body.appendChild(el)}
function close23(){document.getElementById('dx23Modal')?.classList.remove('open');document.documentElement.style.overflow='';document.body.style.overflow=''}
function caseAgainst(m,text,age){let out=[];try{if(typeof caseSpecificAgainst==='function')out.push(...(caseSpecificAgainst(m,text,age)||[]))}catch(e){}
 const k=(m.key||'').toLowerCase(),x=String(text||'');
 if(/rheumatoid/i.test(m.label||'')){
  if(!/(rf|rheumatoid factor|anti[- ]?ccp|acpa)/i.test(x))out.push('RF/ACPA status is not supplied, so seropositive or seronegative RA cannot yet be established.');
  if(/asymmetric|dactylitis|enthesitis|psoriasis|uveitis|ibd|crohn|ulcerative colitis/i.test(x))out.push('Prominent SpA-pattern features would make RA a less complete explanation.');
 }
 if(/reactive arthritis/i.test(m.label||'')){
  if(!/(diarrh|gastro|genitour|ureth|chlam|infection.{0,25}(week|day)|recent infection)/i.test(x))out.push('No clear antecedent gastrointestinal or genitourinary infection is documented.');
 }
 if(k==='axspa'||/axial spondyloarthritis/i.test(m.label||'')){
  if(age>=45)out.push('Clarify whether the back pain began before age 45; later onset lowers the typical axial SpA probability.');
  if(/activit(?:y|ies).{0,20}(worse|exacerbat)|(worse|exacerbat).{0,20}activit(?:y|ies)/i.test(x))out.push('Activity-provoked back pain is a mechanical feature and argues against a purely inflammatory axial explanation.');
 }
 return typeof uniq==='function'?uniq(out):[...new Set(out)]
}
window.openDifferentialRationaleV23=function(moduleKey){
 ensureModal();const ctx=currentContext();const m=modules.find(x=>x.key===moduleKey);if(!m)return;
 const scored=ctx.scored.find(x=>x.key===m.key);const d=scored||m;const score=Number(d.score||0);const hits=(d.hits||[]).map(h=>'Case feature detected: '+h);const supp=(typeof uniq==='function'?uniq([...hits,...(m.support||[])]):[...new Set([...hits,...(m.support||[])])]).slice(0,6);const ag=(typeof uniq==='function'?uniq([...caseAgainst(m,ctx.t,ctx.age),...(m.against||[])]):[...new Set([...caseAgainst(m,ctx.t,ctx.age),...(m.against||[])])]).slice(0,7);const miss=(m.missing||[]).slice(0,6);
 document.getElementById('dx23Title').textContent=m.label;
 const like=typeof likelihood==='function'?likelihood(score):'';const klass=typeof cls==='function'?cls(score):'';
 document.getElementById('dx23Body').innerHTML=`<div class="like ${klass}">${escapeHtml(like)}${like?' · ':''}${score}/100 heuristic signal</div><div class="dx23-section"><b>FOR — why this diagnosis is possible</b><ul>${supp.length?supp.map(x=>`<li>${escapeHtml(x)}</li>`).join(''):'<li>No strong disease-specific positive feature has yet been supplied.</li>'}</ul></div><div class="dx23-section"><b>AGAINST / ATYPICAL — why it may be less likely</b><ul>${ag.length?ag.map(x=>`<li>${escapeHtml(x)}</li>`).join(''):'<li>No major contradiction has been identified from the supplied information; missing information is not negative evidence.</li>'}</ul></div><div class="dx23-section"><b>What would help discriminate it</b><ul>${miss.length?miss.map(x=>`<li>${escapeHtml(x)}</li>`).join(''):'<li>Clarify chronology, objective examination and disease-specific investigations.</li>'}</ul></div><div class="dx-actions"><button class="btn secondary" type="button" id="dx23ModuleBtn">Open module & diagnostic tests</button></div>`;
 document.getElementById('dx23ModuleBtn').onclick=()=>{close23();openModule(m.key)};
 const modal=document.getElementById('dx23Modal');modal.classList.add('open');modal.querySelector('.dx23-sheet').scrollTop=0;document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
};

function targetChip(e){const el=e.target.closest('.candidate-chip-click,[data-dx-key-exact],.chip,.pill,.tag,[class*="chip"],[class*="pill"]');if(!el||!el.closest('#results'))return null;const m=moduleByVisibleLabel(el.textContent);return m?{el,m}:null}
// Run before all legacy handlers and bypass the v18/v22 routing entirely.
document.addEventListener('click',e=>{const hit=targetChip(e);if(!hit)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openDifferentialRationaleV23(hit.m.key)},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const hit=targetChip(e);if(!hit)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openDifferentialRationaleV23(hit.m.key)},true);

try{sourceDecks.push(['Differential rationale routing v23','Each visible ranked differential now resolves independently from its own displayed diagnosis label and renders a fresh case-specific FOR / AGAINST / discriminator panel, bypassing the older shared-chip event handler.']);renderSources()}catch(e){console.warn('v23 routing patch',e)}
})();