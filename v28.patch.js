(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
/* v28 authoritative phenotype-card rebuild */
#v28PhenotypeBlock{margin:0 0 12px}
.v28-pheno-explainer,.v28-dx-explainer{font-size:12px;line-height:1.45;color:var(--mute);margin:4px 0 10px}
.v28-pheno-row{display:grid;grid-template-columns:minmax(165px,235px) 1fr 72px;gap:12px;align-items:center;margin:9px 0}
.v28-pheno-label{font-weight:800;color:var(--navy);line-height:1.25}
.v28-pheno-track{height:9px;background:#e6edef;border-radius:999px;overflow:hidden}
.v28-pheno-fill{height:100%;border-radius:999px}
.v28-pheno-status{text-align:right;color:var(--mute);font-size:12px}
#v28DifferentialBlock{margin:14px 0 8px;padding-top:12px;border-top:1px solid var(--line)}
#v28DifferentialBlock .title{color:var(--teal);font-size:14px;font-weight:850;text-transform:uppercase;letter-spacing:.04em;margin-bottom:5px}
.v28-legacy-row{display:none!important}
#clinicalPhenotypeConsolidated,#inlineDifferentialBlock,#phenotypeExplainer,#rankedDifferentialHeading{display:none!important}
@media(max-width:620px){.v28-pheno-row{grid-template-columns:minmax(118px,150px) 1fr 58px;gap:8px}.v28-pheno-label{font-size:12px}.v28-pheno-status,.v28-pheno-explainer,.v28-dx-explainer{font-size:11px}}
`;
document.head.appendChild(css);
const rank={high:4,moderate:3,possible:2,low:1};
const width={high:82,moderate:56,possible:35,low:16};
const colour={high:'#15803d',moderate:'#c7671c',possible:'#5b4caf',low:'#15817e'};
function txt(el){return String(el?.textContent||'').replace(/\s+/g,' ').trim()}
function statusLeaves(card){return [...card.querySelectorAll('*')].filter(el=>el.children.length===0&&/^(High|Moderate|Possible|Low)$/i.test(txt(el)))}
function statusCount(el){return [...el.querySelectorAll('*')].filter(x=>x.children.length===0&&/^(High|Moderate|Possible|Low)$/i.test(txt(x))).length}
function rowForStatus(s,card){
 let cur=s;
 while(cur&&cur.parentElement&&cur.parentElement!==card){
   const p=cur.parentElement;
   const n=statusCount(p);
   if(n>1)break;
   if(p.querySelector('.candidate-chip-click,[data-dx-key-exact]'))break;
   cur=p;
 }
 return cur===s?s.parentElement:cur;
}
function family(label){const x=label.toLowerCase();
 if(/^spondyloarthritis$/.test(x)||/axial spondyloarthritis|axial spa|inflammatory axial/.test(x))return['axial','Inflammatory axial / spondyloarthritis phenotype'];
 if(/inflammatory arthritis|early arthritis|peripheral spa|seronegative.*arthritis/.test(x))return['peripheral','Peripheral inflammatory arthritis / synovitis phenotype'];
 if(/nociplastic|pain amplification|fibromyalgia/.test(x))return['nociplastic','Nociplastic / pain-amplification phenotype'];
 if(/mechanical|degenerative|osteoarthritis/.test(x))return['mechanical','Mechanical / degenerative pain phenotype'];
 if(/crystal|gout|cppd/.test(x))return['crystal','Crystal-arthritis phenotype'];
 if(/connective tissue|multisystem autoimmune|\bctd\b|lupus/.test(x))return['ctd','Connective-tissue / multisystem autoimmune phenotype'];
 if(/myositis|myopathy|muscle/.test(x))return['myopathy','Inflammatory myopathy phenotype'];
 if(/vascul|giant cell|large-vessel/.test(x))return['vasculitic','Vasculitic / vascular inflammatory phenotype'];
 if(/polymyalgia|\bpmr\b/.test(x))return['pmr','Polymyalgic shoulder/hip-girdle phenotype'];
 return[x.replace(/[^a-z0-9]+/g,'-'),label];
}
function consolidate(items){
 const map=new Map();
 items.forEach(it=>{const [key,label]=family(it.label);const old=map.get(key);if(!old||it.rank>old.rank)map.set(key,{key,label,status:it.status,rank:it.rank});});
 let a=[...map.values()];const meaningful=a.filter(x=>x.rank>=2);if(meaningful.length)a=meaningful;
 const pri={peripheral:9,axial:8,mechanical:7,nociplastic:6,crystal:5,ctd:4,myopathy:3,vasculitic:2,pmr:1};
 a.sort((a,b)=>b.rank-a.rank||((pri[b.key]||0)-(pri[a.key]||0)));
 return a.slice(0,4);
}
function chipWrapper(card){
 const chips=[...card.querySelectorAll('.candidate-chip-click,[data-dx-key-exact]')].filter(x=>x.offsetParent!==null);
 if(!chips.length)return null;let cur=chips[0];
 while(cur.parentElement&&cur.parentElement!==card){const p=cur.parentElement;if(p.querySelectorAll('.candidate-chip-click,[data-dx-key-exact]').length===chips.length&&!statusLeaves(p).length)cur=p;else break;}
 return cur.parentElement===card?cur:chips[0].parentElement;
}
function headingNear(card){
 let p=card.previousElementSibling;for(let i=0;i<4&&p;i++,p=p.previousElementSibling){if(/dominant phenotype|clinical phenotype/i.test(txt(p)))return p}
 return null;
}
function rebuild(){
 const results=document.getElementById('results');if(!results)return;
 const chips=[...results.querySelectorAll('.candidate-chip-click,[data-dx-key-exact]')].filter(x=>x.offsetParent!==null);if(chips.length<2)return;
 const card=chips[0].closest('.card');if(!card||!chips.every(c=>card.contains(c)))return;
 const leaves=statusLeaves(card);if(!leaves.length)return;
 const items=[];const rows=new Set();
 leaves.forEach(s=>{const st=txt(s).toLowerCase();const row=rowForStatus(s,card);if(!row||row===card)return;let label=txt(row).replace(new RegExp('\\b'+st+'\\b','ig'),'').replace(/[›»>]+$/,'').trim();if(!label||label.length>100)return;rows.add(row);items.push({label,status:st,rank:rank[st]||0});});
 if(!items.length)return;
 const groups=consolidate(items);if(!groups.length)return;
 rows.forEach(r=>r.classList.add('v28-legacy-row'));
 const old=document.getElementById('v28PhenotypeBlock');if(old)old.remove();
 const ph=document.createElement('div');ph.id='v28PhenotypeBlock';
 ph.innerHTML='<div class="v28-pheno-explainer"><b>Clinical phenotype</b> describes the broad pattern of illness before a named diagnosis is assigned. Overlapping parent/child scoring categories are merged, and only the strongest distinct patterns are shown.</div>'+groups.map(g=>`<div class="v28-pheno-row"><div class="v28-pheno-label">${escapeHtml(g.label)}</div><div class="v28-pheno-track"><div class="v28-pheno-fill" style="width:${width[g.status]||20}%;background:${colour[g.status]||'#15817e'}"></div></div><div class="v28-pheno-status">${g.status[0].toUpperCase()+g.status.slice(1)}</div></div>`).join('');
 const firstRow=[...rows][0];card.insertBefore(ph,firstRow||card.firstChild);
 const cw=chipWrapper(card);if(cw){let dx=document.getElementById('v28DifferentialBlock');if(dx)dx.remove();dx=document.createElement('div');dx.id='v28DifferentialBlock';dx.innerHTML='<div class="title">Ranked differential diagnosis</div><div class="v28-dx-explainer"><b>Differential diagnosis</b> lists the named conditions that could explain the phenotype. Tap a diagnosis to review the case-specific evidence for and against it and what would help distinguish it.</div>';card.insertBefore(dx,cw)}
 const h=headingNear(card);if(h&&/dominant phenotype/i.test(txt(h)))h.textContent='CLINICAL PHENOTYPE';
}
let timer;const mo=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(rebuild,80)});mo.observe(document.body,{subtree:true,childList:true,characterData:true});
setTimeout(rebuild,120);setTimeout(rebuild,500);setTimeout(rebuild,1200);
try{sourceDecks.push(['Phenotype rebuild v28','Authoritative rebuild of the Results phenotype card: legacy overlapping score rows are hidden, parent/child phenotype families are merged to at most four distinct patterns, and the Ranked differential diagnosis heading is placed immediately above diagnosis chips.']);renderSources()}catch(e){console.warn('v28 phenotype rebuild',e)}
})();