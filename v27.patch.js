(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
/* v27: robust phenotype consolidation repair */
#clinicalPhenotypeConsolidatedV27{margin:0 0 12px}
.v27-pheno-note{font-size:12px;line-height:1.45;color:var(--mute);margin:0 0 10px}
.v27-pheno-row{display:grid;grid-template-columns:minmax(150px,220px) 1fr 72px;gap:12px;align-items:center;margin:10px 0}
.v27-pheno-label{font-weight:800;color:var(--navy);line-height:1.25}
.v27-pheno-track{height:9px;background:#e6edef;border-radius:999px;overflow:hidden}
.v27-pheno-fill{height:100%;border-radius:999px}
.v27-pheno-status{text-align:right;color:var(--mute);font-size:12px}
@media(max-width:620px){.v27-pheno-row{grid-template-columns:minmax(115px,145px) 1fr 58px;gap:8px}.v27-pheno-label{font-size:12px}.v27-pheno-status{font-size:11px}}
`;
document.head.appendChild(css);

const rank={high:4,moderate:3,possible:2,low:1};
const width={high:82,moderate:56,possible:35,low:16};
const colour={high:'#15803d',moderate:'#c7671c',possible:'#5b4caf',low:'#15817e'};
function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}
function heading(){return Array.from(document.querySelectorAll('h1,h2,h3,h4,div')).find(el=>{const t=clean(el.textContent).toLowerCase();return (t==='dominant phenotype'||t==='clinical phenotype')&&el.children.length<4})}
function cardAfter(h){if(!h)return null;let n=h.nextElementSibling;while(n){if(n.classList?.contains('card'))return n;const c=n.querySelector?.('.card');if(c)return c;n=n.nextElementSibling}return null}
function smallestRow(statusEl,card){
 let n=statusEl.parentElement,best=null;
 while(n&&n!==card){
   const r=n.getBoundingClientRect(),c=card.getBoundingClientRect(),txt=clean(n.textContent);
   if(r.width>c.width*.72&&r.height>14&&r.height<85&&txt.length<140)best=n;
   n=n.parentElement;
 }
 return best;
}
function rows(card){
 const out=[],seen=new Set();
 const sts=Array.from(card.querySelectorAll('*')).filter(el=>el.children.length===0&&/^(high|moderate|possible|low)$/i.test(clean(el.textContent)));
 for(const s of sts){const row=smallestRow(s,card);if(!row||seen.has(row)||row.closest('#clinicalPhenotypeConsolidatedV27'))continue;let label=clean(row.textContent).replace(new RegExp('\\b'+clean(s.textContent)+'\\b','ig'),'').trim();label=label.replace(/[›»>]+$/,'').trim();if(!label||label.length>120)continue;seen.add(row);out.push({row,label,status:clean(s.textContent).toLowerCase(),rank:rank[clean(s.textContent).toLowerCase()]||0})}
 return out;
}
function family(label){const x=label.toLowerCase();
 if(/^spondyloarthritis$/.test(x)||/axial spondyloarthritis|axial spa|inflammatory axial/.test(x))return {key:'axial',label:'Inflammatory axial / spondyloarthritis phenotype'};
 if(/inflammatory arthritis|early arthritis|peripheral spa|seronegative.*arthritis|arthritis\s*\/\s*spa/.test(x))return {key:'peripheral',label:'Peripheral inflammatory arthritis / synovitis phenotype'};
 if(/nociplastic|pain amplification|fibromyalgia/.test(x))return {key:'nociplastic',label:'Nociplastic / pain-amplification phenotype'};
 if(/mechanical|degenerative|osteoarthritis/.test(x))return {key:'mechanical',label:'Mechanical / degenerative pain phenotype'};
 if(/crystal|gout|cppd/.test(x))return {key:'crystal',label:'Crystal-arthritis phenotype'};
 if(/connective tissue|multisystem autoimmune|\bctd\b|lupus/.test(x))return {key:'ctd',label:'Connective-tissue / multisystem autoimmune phenotype'};
 if(/myositis|myopathy|muscle/.test(x))return {key:'myopathy',label:'Inflammatory myopathy phenotype'};
 if(/vascul|giant cell|large-vessel/.test(x))return {key:'vasculitic',label:'Vasculitic / vascular inflammatory phenotype'};
 if(/polymyalgia|\bpmr\b/.test(x))return {key:'pmr',label:'Polymyalgic shoulder/hip-girdle phenotype'};
 return {key:x.replace(/[^a-z0-9]+/g,'-'),label};}
function consolidate(rs){
 const map=new Map();
 rs.forEach(r=>{const f=family(r.label),cur=map.get(f.key);if(!cur||r.rank>cur.rank)map.set(f.key,{...f,status:r.status,rank:r.rank});});
 let a=Array.from(map.values());
 const meaningful=a.filter(x=>x.rank>=2);if(meaningful.length)a=meaningful;
 const p={peripheral:9,axial:8,mechanical:7,nociplastic:6,crystal:5,ctd:4,myopathy:3,vasculitic:2,pmr:1};
 a.sort((a,b)=>(b.rank-a.rank)||((p[b.key]||0)-(p[a.key]||0)));
 return a.slice(0,4);
}
function apply(){
 const h=heading(),card=cardAfter(h);if(!h||!card)return;
 h.textContent='CLINICAL PHENOTYPE';
 const rs=rows(card);if(!rs.length)return;
 const groups=consolidate(rs);if(!groups.length)return;
 let box=document.getElementById('clinicalPhenotypeConsolidatedV27');if(!box){box=document.createElement('div');box.id='clinicalPhenotypeConsolidatedV27';card.insertBefore(box,card.firstChild)}
 box.innerHTML='<div class="v27-pheno-note"><b>Clinical phenotype:</b> the broad clinical pattern(s) supported by the case. Duplicate and parent/child scoring categories are merged; only the strongest 3–4 distinct patterns are shown.</div>'+groups.map(g=>`<div class="v27-pheno-row"><div class="v27-pheno-label">${escapeHtml(g.label)}</div><div class="v27-pheno-track"><div class="v27-pheno-fill" style="width:${width[g.status]||20}%;background:${colour[g.status]||'#15817e'}"></div></div><div class="v27-pheno-status">${g.status.charAt(0).toUpperCase()+g.status.slice(1)}</div></div>`).join('');
 // Hide every legacy phenotype score row, including any rows previously missed by v26.
 rs.forEach(r=>{r.row.style.display='none';r.row.dataset.v27Hidden='1'});
 // Hide the earlier failed v26 consolidated panel to avoid duplicate displays.
 const old=document.getElementById('clinicalPhenotypeConsolidated');if(old)old.style.display='none';
}
const mo=new MutationObserver(()=>{clearTimeout(window.__v27t);window.__v27t=setTimeout(apply,80)});mo.observe(document.body,{subtree:true,childList:true,characterData:true});
[120,400,900,1600].forEach(t=>setTimeout(apply,t));
try{sourceDecks.push(['Phenotype consolidation repair v27','Robust DOM-based consolidation hides all legacy overlapping phenotype score rows and displays only 3–4 merged clinical patterns.']);renderSources()}catch(e){console.warn('v27 phenotype repair',e)}
})();