(function(){
'use strict';
const css=document.createElement('style');css.textContent=`
.dx-clickable{cursor:pointer;transition:transform .12s ease,box-shadow .12s ease}.dx-clickable:active{transform:scale(.995)}.dx-clickable:hover{box-shadow:0 8px 24px rgba(11,46,79,.12)}
.dx-hint{font-size:12px;color:var(--teal);font-weight:700;margin-top:6px}.candidate-chip-click{cursor:pointer!important;position:relative}.candidate-chip-click:after{content:'  ›';font-weight:900}.candidate-chip-click:focus{outline:3px solid rgba(14,124,123,.25);outline-offset:2px}
.dx-detail-modal{position:fixed;inset:0;background:rgba(11,46,79,.48);display:none;align-items:flex-end;justify-content:center;z-index:10020;padding:12px}.dx-detail-modal.open{display:flex}.dx-detail-sheet{background:#fff;width:min(760px,100%);max-height:86vh;overflow:auto;border-radius:18px 18px 12px 12px;padding:18px;box-shadow:0 24px 70px rgba(0,0,0,.28)}.dx-detail-sheet h3{margin:0 0 6px}.dx-detail-section{margin-top:14px}.dx-detail-section b{color:var(--teal)}.rank-badge{display:inline-grid;place-items:center;min-width:30px;height:30px;border-radius:50%;background:var(--teal);color:#fff;font-weight:800;margin-right:8px}.oa-context{border-left:4px solid #d97706;background:#fff9ed;padding:10px 12px;border-radius:9px;margin-top:10px}
`;document.head.appendChild(css);

let lastRanked=[],lastText='',lastAge=0;
function specificAgainst(m,text,age){let out=[];const k=(m.key||'').toLowerCase(),x=norm(text||'');
 if(k==='oa'){
  if(/swollen joint|joint swelling|synovitis|knee swelling|ankle swelling|wrist swelling/i.test(x))out.push('Objective joint swelling/synovitis is not well explained by uncomplicated osteoarthritis and requires an inflammatory, crystal or infective explanation.');
  if(/morning stiffness|early morning stiffness/i.test(x))out.push('Prominent inflammatory-pattern morning stiffness is less typical of isolated osteoarthritis, especially when prolonged.');
  if(/\bcrp\b.{0,20}\b(?:[5-9]\d|\d{3,})\b|\besr\b.{0,20}\b(?:[4-9]\d|\d{3,})\b/i.test(x))out.push('Markedly raised inflammatory markers are not adequately explained by uncomplicated osteoarthritis.');
 }
 if(k==='pmr'&&age&&age<50)out.push('Age '+age+' is strongly against PMR; the usual diagnostic/classification phenotype begins at age 50 or older.');
 try{if(typeof caseSpecificAgainst==='function')out=uniq([...out,...caseSpecificAgainst(m,text,age)])}catch(e){}
 return uniq(out);
}
function ensureDetailModal(){if(document.getElementById('dxDetailModal'))return;const el=document.createElement('div');el.id='dxDetailModal';el.className='dx-detail-modal';el.innerHTML='<div class="dx-detail-sheet" role="dialog" aria-modal="true" aria-labelledby="dxDetailTitle"><button type="button" class="btn secondary" style="float:right;width:auto" id="dxDetailClose">Close</button><h3 id="dxDetailTitle">Differential diagnosis</h3><div id="dxDetailBody"></div></div>';el.addEventListener('click',e=>{if(e.target===el)el.classList.remove('open')});document.body.appendChild(el);document.getElementById('dxDetailClose').onclick=()=>el.classList.remove('open')}
window.showDifferentialDetail=function(key){ensureDetailModal();const m=lastRanked.find(x=>x.key===key)||modules.find(x=>x.key===key);if(!m)return;const idx=Math.max(0,lastRanked.findIndex(x=>x.key===m.key));const supp=uniq([...(m.hits||[]).map(h=>'Case feature detected: '+h),...(m.support||[])]).slice(0,6);const ag=uniq([...specificAgainst(m,lastText,lastAge),...(m.against||[])]).slice(0,7);const miss=(m.missing||[]).slice(0,6);let extra='';if(m.key==='oa'&&/\bosteoarthritis\b|\bOA\b/i.test(lastText))extra='<div class="oa-context"><b>Why OA remains visible:</b> a documented history of osteoarthritis increases the chance that some pain is degenerative or represents a coexisting mechanical component. It should not, however, be used to explain away objective inflammatory features.</div>';
 document.getElementById('dxDetailTitle').innerHTML=`<span class="rank-badge">${idx+1||''}</span>${escapeHtml(m.label)}`;
 document.getElementById('dxDetailBody').innerHTML=`<div class="like ${cls(m.score||0)}">${likelihood(m.score||0)} · ${m.score||0}/100 heuristic signal</div>${extra}<div class="dx-detail-section"><b>FOR — why this diagnosis is possible</b><ul>${supp.length?supp.map(x=>`<li>${escapeHtml(x)}</li>`).join(''):'<li>No strong disease-specific positive feature has yet been supplied.</li>'}</ul></div><div class="dx-detail-section"><b>AGAINST / ATYPICAL — why it may be less likely</b><ul>${ag.length?ag.map(x=>`<li>${escapeHtml(x)}</li>`).join(''):'<li>No major contradiction has been identified from the supplied data; missing information is not negative evidence.</li>'}</ul></div><div class="dx-detail-section"><b>What would help discriminate it</b><ul>${miss.length?miss.map(x=>`<li>${escapeHtml(x)}</li>`).join(''):'<li>Clarify chronology, examination findings and disease-specific investigations.</li>'}</ul></div><div class="dx-actions"><button class="btn secondary" type="button" onclick="document.getElementById('dxDetailModal').classList.remove('open');openModule('${m.key}')">Open module & diagnostic tests</button></div>`;
 document.getElementById('dxDetailModal').classList.add('open');
};

renderDifferentials=function(scored,text,age){
 lastText=text||'';lastAge=age||0;let ranked=scored.filter(m=>m.score>=10).slice(0,4);
 const peripheral=/(?:knee|ankle|wrist|elbow|mcp|pip).{0,15}(?:swelling|synovitis)|(?:swelling|synovitis).{0,15}(?:knee|ankle|wrist|elbow|mcp|pip)|swollen joint|joint swelling/i.test(text||'');
 if(peripheral){['earlyarthritis','seronegativeia'].forEach(k=>{const c=scored.find(m=>m.key===k);if(c&&!ranked.some(x=>x.key===k)){if(ranked.length>=4)ranked.pop();ranked.push(c)}})}
 const oaMention=/\bosteoarthritis\b|\bOA\b/i.test(text||'');const oa=scored.find(m=>m.key==='oa'||/osteoarthritis/i.test(m.label||''));
 if(oaMention&&oa&&!ranked.some(x=>x.key===oa.key)){
   oa.score=Math.max(oa.score||0,12);oa.hits=uniq([...(oa.hits||[]),'documented history of osteoarthritis']);
   if(ranked.length>=4)ranked.pop();ranked.push(oa);
 }
 ranked.sort((a,b)=>(b.score||0)-(a.score||0));
 if(ranked.length<3){for(const c of scored){if(!ranked.some(x=>x.key===c.key))ranked.push(c);if(ranked.length>=3)break}}
 ranked=ranked.slice(0,4);lastRanked=ranked;
 let html='<div class="card small"><b>Ranked working differential:</b> review the 3–4 leading candidates rather than accepting the first label. Tap any diagnosis to see the case-specific points FOR, AGAINST and the findings/tests that would discriminate it.</div>';
 ranked.forEach((m,i)=>{const supp=uniq([...(m.hits||[]).map(h=>'Case feature detected: '+h),...(m.support||[])]).slice(0,5),ag=uniq([...specificAgainst(m,text,age),...(m.against||[])]).slice(0,5),dis=(m.missing||[]).slice(0,4);html+=`<div class="card dx dx-clickable" role="button" tabindex="0" data-dx-key="${escapeHtml(m.key)}"><div class="dx-rank"><div class="dx-rank-num">${i+1}</div><div class="dx-rank-main"><h3 style="margin-top:0">${escapeHtml(m.label)}</h3><div class="like ${cls(m.score)}">${likelihood(m.score)} · ${m.score}/100 heuristic signal</div><div class="minihead">FOR</div><ul>${supp.map(x=>`<li>${escapeHtml(x)}</li>`).join('')||'<li>No strong disease-specific positive feature has yet been supplied.</li>'}</ul><div class="minihead">AGAINST / ATYPICAL</div><ul>${ag.map(x=>`<li>${escapeHtml(x)}</li>`).join('')||'<li>No major contradiction identified from the supplied information.</li>'}</ul><div class="dx-hint">Tap for full reasoning and discriminating tests ›</div></div></div></div>`});
 const h=document.getElementById('differentials');if(h){h.innerHTML=html;h.querySelectorAll('.dx-clickable').forEach(el=>{const go=()=>showDifferentialDetail(el.dataset.dxKey);el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})})}
};

function makeCandidateChipsClickable(){
 const labels=modules.map(m=>({m,txt:(m.label||'').trim().toLowerCase()})).filter(x=>x.txt);
 document.querySelectorAll('.chip,.pill,.tag,[class*="chip"],[class*="pill"]').forEach(el=>{
  if(el.dataset.dxBound)return;const tx=(el.textContent||'').trim().toLowerCase();const hit=labels.find(x=>tx===x.txt||tx.includes(x.txt)||x.txt.includes(tx));if(!hit)return;
  if(!lastRanked.some(x=>x.key===hit.m.key))return;el.dataset.dxBound='1';el.classList.add('candidate-chip-click');el.setAttribute('role','button');el.tabIndex=0;const go=()=>showDifferentialDetail(hit.m.key);el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})
 });
}
const mo=new MutationObserver(()=>makeCandidateChipsClickable());mo.observe(document.body,{subtree:true,childList:true});setTimeout(makeCandidateChipsClickable,200);
try{sourceDecks.push(['Clickable ranked differential v18','Leading 3–4 diagnoses are clinician-reviewable, with tap-to-open FOR / AGAINST reasoning and module links. Relevant known comorbidity such as osteoarthritis remains visible as a possible coexisting contributor while objective inflammatory features are explicitly counted against uncomplicated OA.']);renderSources()}catch(e){}
})();