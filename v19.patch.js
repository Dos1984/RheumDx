(function(){
'use strict';
const style=document.createElement('style');
style.textContent=`
.module-nav-intro{margin:0 0 14px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:#f8fbfb}.module-group{margin:12px 0;border:1px solid var(--line);border-radius:14px;background:#fff;overflow:hidden}.module-group>summary{list-style:none;cursor:pointer;padding:15px 16px;font-weight:850;color:var(--navy);display:flex;align-items:center;justify-content:space-between;gap:10px;background:#f5fafa}.module-group>summary::-webkit-details-marker{display:none}.module-group>summary::after{content:'＋';font-size:20px;color:var(--teal);font-weight:700}.module-group[open]>summary::after{content:'−'}.module-group-body{padding:10px}.condition-item{margin:8px 0;border:1px solid var(--line);border-radius:12px;background:#fff;overflow:hidden}.condition-item>summary{list-style:none;cursor:pointer;padding:13px 14px;font-weight:800;color:var(--navy);display:flex;align-items:center;justify-content:space-between;gap:10px}.condition-item>summary::-webkit-details-marker{display:none}.condition-item>summary::after{content:'▾';color:var(--teal);font-size:16px;transform:rotate(-90deg);transition:transform .15s ease}.condition-item[open]>summary::after{transform:rotate(0)}.condition-body{padding:0 14px 14px}.condition-body ul{margin:6px 0 10px 20px;padding:0}.condition-body li{margin:5px 0;line-height:1.4}.condition-section{margin-top:11px;font-weight:800;color:var(--teal);font-size:12px;text-transform:uppercase;letter-spacing:.03em}.module-chip{display:inline-block;margin-right:7px;padding:4px 7px;border-radius:999px;background:#eef6f6;color:var(--teal);font-size:11px;font-weight:800}.module-count{font-size:12px;color:var(--muted);font-weight:700}.module-focus{outline:3px solid rgba(14,124,123,.22);scroll-margin-top:86px}@media(max-width:620px){.module-group>summary{padding:14px}.condition-item>summary{padding:12px}.condition-body{padding:0 12px 12px}}
`;
document.head.appendChild(style);

function catFor(m){
 const g=((m.group||'')+' '+(m.label||'')).toLowerCase();
 if(/connective|lupus|sjö|sjog|scler|mixed connective|overlap syndrome|raynaud/.test(g))return'Connective tissue disease';
 if(/vascul|giant cell|gca|takayasu|polyangiitis|granulomatosis|behcet|cryoglob|pan\b/.test(g))return'Vasculitis';
 if(/myositis|dermatomy|polymyos|antisynthet|muscle/.test(g))return'Inflammatory myopathy';
 if(/spondy|psoriatic|reactive|rheumatoid|inflammatory arthritis|early arthritis|seronegative|adult-onset still|still disease/.test(g))return'Inflammatory arthritis & spondyloarthritis';
 if(/gout|cppd|crystal/.test(g))return'Crystal arthritis';
 if(/osteoarthritis|mechanical|soft-tissue|regional pain/.test(g))return'Mechanical / degenerative & regional pain';
 if(/fibromyalgia|nociplastic|fatigue|me\/cfs/.test(g))return'Widespread pain / nociplastic syndromes';
 if(/polymyalgia|pmr/.test(g))return'Polymyalgia rheumatica & related syndromes';
 if(/sarcoid/.test(g))return'Sarcoidosis & multisystem mimics';
 return'Other rheumatology / mimics';
}
const order=['Inflammatory arthritis & spondyloarthritis','Connective tissue disease','Vasculitis','Inflammatory myopathy','Crystal arthritis','Polymyalgia rheumatica & related syndromes','Mechanical / degenerative & regional pain','Widespread pain / nociplastic syndromes','Sarcoidosis & multisystem mimics','Other rheumatology / mimics'];
function bullets(arr,max){return (arr||[]).filter(Boolean).slice(0,max||8).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}
function testButton(t){return `<button type="button" class="test-link" onclick='showTestEvidence(${JSON.stringify(t)})'><b>Test / investigation:</b> ${escapeHtml(t)}<br><span class="tiny">Click for sensitivity, specificity and interpretation caveats</span></button>`}

window.renderCriteria=function(){
 const target=document.getElementById('criteriaCards');if(!target)return;
 const usable=modules.filter(m=>m.key!=='urgent');
 const groups={};usable.forEach(m=>{const c=catFor(m);(groups[c]||(groups[c]=[])).push(m)});
 let html='<div class="module-nav-intro small"><b>Browse by disease family.</b> Expand an overarching category, then open an individual condition. Content is shown mainly in point form for rapid clinical review.</div>';
 for(const c of order){const list=groups[c]||[];if(!list.length)continue;
   html+=`<details class="module-group"><summary><span>${escapeHtml(c)}</span><span class="module-count">${list.length} module${list.length===1?'':'s'}</span></summary><div class="module-group-body">`;
   list.sort((a,b)=>(a.label||'').localeCompare(b.label||''));
   for(const m of list){const v=m.v15||{};const pattern=v.pattern||((m.support||[])[0]||'');const mimics=(m.mimics||v.mimics||[]);const first=v.first||[];const conditional=v.conditional||[];const generic=(m.tests||[]);
     html+=`<details class="condition-item" id="module-${m.key}"><summary><span><span class="module-chip">${escapeHtml(m.group||c)}</span>${escapeHtml(m.label)}</span></summary><div class="condition-body">`;
     if(pattern)html+=`<div class="condition-section">Diagnostic pattern</div><ul><li>${escapeHtml(pattern)}</li></ul>`;
     if((m.support||[]).length)html+=`<div class="condition-section">Features supporting</div><ul>${bullets((m.support||[]).filter(x=>x!==pattern),6)||'<li>No additional stored supporting points.</li>'}</ul>`;
     if((m.against||[]).length)html+=`<div class="condition-section">Features against / interpretive guardrails</div><ul>${bullets(m.against,6)}</ul>`;
     if(mimics.length)html+=`<div class="condition-section">Important mimics</div><ul>${bullets(mimics,7)}</ul>`;
     if((m.missing||[]).length)html+=`<div class="condition-section">Key questions / missing information</div><ul>${bullets(m.missing,7)}</ul>`;
     html+=`<div class="condition-section">Classification / diagnostic framework</div><ul><li>${escapeHtml(m.criteria||'Classification criteria may support standardisation but are not synonymous with diagnosis.')}</li></ul>`;
     if(first.length||conditional.length){if(first.length)html+=`<div class="condition-section">First-line / phenotype-defining investigations</div>${first.map(testButton).join('')}`;if(conditional.length)html+=`<div class="condition-section">Conditional / second-line investigations</div>${conditional.map(testButton).join('')}`}
     else if(generic.length)html+=`<div class="condition-section">Diagnostic tests / investigations</div>${generic.map(testButton).join('')}`;
     html+='</div></details>';
   }
   html+='</div></details>';
 }
 target.innerHTML=html;
};

window.openModule=function(key){
 showScreen('criteria',document.querySelectorAll('.tab')[2]);
 setTimeout(()=>{document.querySelectorAll('.module-focus').forEach(x=>x.classList.remove('module-focus'));const el=document.getElementById('module-'+key);if(!el)return;el.open=true;const parent=el.closest('.module-group');if(parent)parent.open=true;el.classList.add('module-focus');el.scrollIntoView({behavior:'smooth',block:'start'})},40)
};

try{renderCriteria();sourceDecks.push(['Module navigation v19','Disease modules grouped under overarching rheumatology categories with nested collapsible condition tabs and point-form diagnostic content.']);renderSources()}catch(e){console.warn('v19 module navigation patch',e)}
})();