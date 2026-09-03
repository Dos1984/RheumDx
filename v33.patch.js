(function(){
'use strict';
const css=document.createElement('style');css.textContent=`
/* v33 hard rebuild of Results suggested work-up */
#rdxWorkupV33{margin:0}.rdx33-note{font-size:12px;line-height:1.45;color:var(--mute);margin:0 0 10px}.rdx33-group{margin:9px 0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fbfdfd}.rdx33-group>summary{list-style:none;cursor:pointer;padding:12px;font-weight:850;color:var(--navy);display:flex;gap:8px;align-items:center}.rdx33-group>summary::-webkit-details-marker{display:none}.rdx33-group>summary:after{content:'＋';margin-left:auto;color:var(--teal);font-size:18px}.rdx33-group[open]>summary:after{content:'−'}.rdx33-body{padding:0 10px 10px}.rdx33-item{width:100%;text-align:left;margin:6px 0!important}.rdx33-count{font-size:11px;color:var(--mute);font-weight:700}.rdx33-hide{display:none!important}@media(max-width:620px){.rdx33-group>summary{padding:10px}.rdx33-note{font-size:11.5px}}
`;document.head.appendChild(css);
function txt(e){return String(e&&e.textContent||'').replace(/\s+/g,' ').trim()}
function clean(s){return String(s||'').replace(/Click for sensitivity, specificity and interpretation caveats/ig,'').replace(/Tap for test performance and interpretation caveats where available/ig,'').replace(/^Test\s*\/\s*investigation:\s*/i,'').replace(/\s+/g,' ').trim()}
function key(s){return clean(s).toLowerCase().replace(/\b(and|with|including|plus)\b/g,' ').replace(/[^a-z0-9+\-/ ]/g,' ').replace(/\s+/g,' ').trim()}
function cat(s){const x=s.toLowerCase();
 if(/examin|joint count|skin|nail|enthes|dactyl|muscle power|blood pressure|pulse|range of motion|tender|swollen joint|neurolog|cardiorespiratory|abdomen|eye exam|document swollen joints/.test(x))return'Examination & bedside';
 if(/aspirat|arthrocent|synovial|gram stain|point.of.care|urine dip|bedside ultrasound/.test(x))return'Point-of-care & procedures';
 if(/urinal|urine\b|urine microscopy|protein:creatinine|protein\/creatinine|culture|naat|pcr|stool|blood culture|microbiolog/.test(x))return'Urine & microbiology';
 if(/x-ray|xray|radiograph|ultrasound|\bus\b|mri|ct\b|hrct|pet|cta|mra|dect|imaging|capillaroscopy/.test(x))return'Radiology / imaging';
 if(/pft|dlco|ecg|echo|echocardi|troponin|nt-probnp|lung function|spirom/.test(x))return'Physiology / organ assessment';
 if(/biopsy|histolog|tissue|emg|nerve conduction|bone marrow/.test(x))return'Tissue / specialised investigations';
 if(/fbc|cbc|esr|crp|rf|ccp|acpa|ana|ena|anca|antibod|complement|c3|c4|ck|aldolase|ferritin|urate|calcium|magnesium|phosphate|alp|pth|iron|tsh|renal|liver|creatin|eosinoph|ige|immunoglob|spep|hla-b27|blood/.test(x))return'Blood tests & immunology';
 return'Other investigations'}
function overlap(a,b){if(a===b)return true;const A=new Set(a.split(' ').filter(x=>x.length>2)),B=new Set(b.split(' ').filter(x=>x.length>2));let inter=0;A.forEach(x=>{if(B.has(x))inter++});const min=Math.min(A.size||1,B.size||1);return inter/min>=0.75}
function getHeading(){const r=document.getElementById('results');if(!r)return null;return [...r.querySelectorAll('h1,h2,h3,h4,.section-title,.minihead')].find(e=>/suggested work-?up/i.test(txt(e)))}
function getCard(h){if(!h)return null;let n=h.nextElementSibling;for(let i=0;i<6&&n;i++,n=n.nextElementSibling){if(n.classList&&n.classList.contains('card'))return n;const c=n.querySelector&&n.querySelector('.card');if(c)return c}return null}
function rebuild(){const h=getHeading(),card=getCard(h);if(!h||!card)return;const sourceButtons=[...card.querySelectorAll('button.test-link')].filter(b=>!b.closest('#rdxWorkupV33'));
 if(!sourceButtons.length)return;
 const items=[];
 for(const b of sourceButtons){const t=clean(txt(b));if(!t)continue;const k=key(t);if(!k)continue;let ex=items.find(z=>overlap(z.k,k));if(ex){if(t.length<ex.t.length){ex.t=t;ex.k=k;ex.onclick=b.getAttribute('onclick')||ex.onclick}continue}items.push({t,k,cat:cat(t),onclick:b.getAttribute('onclick')||''})}
 // Hide every legacy item/container in this card so only the grouped UI remains.
 sourceButtons.forEach(b=>b.classList.add('rdx33-hide'));
 ['#rdxSuggestedWorkupGrouped','#rdxWorkupV32'].forEach(sel=>{const x=card.querySelector(sel);if(x)x.classList.add('rdx33-hide')});
 // Also hide direct legacy children that are only wrappers for the old buttons.
 [...card.children].forEach(ch=>{if(ch.id==='rdxWorkupV33')return;const visibleBtns=ch.querySelectorAll&&ch.querySelectorAll('button.test-link').length;if(visibleBtns&&ch.querySelectorAll('.rdx33-hide').length===visibleBtns)ch.classList.add('rdx33-hide')});
 let wrap=card.querySelector('#rdxWorkupV33');if(wrap)wrap.remove();wrap=document.createElement('div');wrap.id='rdxWorkupV33';wrap.innerHTML='<div class="rdx33-note"><b>Suggested work-up:</b> duplicate and near-duplicate recommendations have been consolidated. Expand a category to review the relevant investigations.</div>';
 const order=['Examination & bedside','Point-of-care & procedures','Blood tests & immunology','Urine & microbiology','Radiology / imaging','Physiology / organ assessment','Tissue / specialised investigations','Other investigations'];
 for(const c of order){const arr=items.filter(x=>x.cat===c);if(!arr.length)continue;const d=document.createElement('details');d.className='rdx33-group';d.innerHTML=`<summary><span>${c}</span><span class="rdx33-count">${arr.length}</span></summary><div class="rdx33-body"></div>`;const body=d.querySelector('.rdx33-body');for(const it of arr){const b=document.createElement('button');b.type='button';b.className='test-link rdx33-item';b.innerHTML='<b>'+((typeof escapeHtml==='function')?escapeHtml(it.t):it.t)+'</b><br><span class="tiny">Tap for sensitivity, specificity and interpretation caveats where available</span>';if(it.onclick)b.setAttribute('onclick',it.onclick);body.appendChild(b)}wrap.appendChild(d)}
 card.insertBefore(wrap,card.firstChild);
}
let timer;const mo=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(rebuild,80)});mo.observe(document.body,{subtree:true,childList:true,characterData:true});setTimeout(rebuild,200);setTimeout(rebuild,700);setTimeout(rebuild,1500);
try{sourceDecks.push(['Suggested work-up hard rebuild v33','Results-page suggested work-up is rebuilt from the generated investigation buttons, near-duplicates are collapsed, legacy flat lists are hidden, and investigations are presented only within collapsible practical categories.']);renderSources()}catch(e){}
})();