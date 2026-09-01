(function(){
'use strict';
const style=document.createElement('style');
style.textContent=`
/* v26: consolidated clinical phenotype display */
#clinicalPhenotypeConsolidated{margin:2px 0 12px}
.phenotype-explainer{font-size:12px;line-height:1.45;color:var(--mute);margin:0 0 10px}
.phenotype-consolidated-row{display:grid;grid-template-columns:minmax(145px,220px) 1fr 72px;gap:14px;align-items:center;margin:10px 0}
.phenotype-consolidated-label{font-weight:800;color:var(--navy);line-height:1.25}
.phenotype-consolidated-track{height:9px;background:#e6edef;border-radius:999px;overflow:hidden}
.phenotype-consolidated-fill{height:100%;border-radius:999px}
.phenotype-consolidated-status{text-align:right;color:var(--mute);font-size:12px}
.phenotype-consolidated-note{font-size:11px;color:var(--mute);margin-top:3px;line-height:1.35}
@media(max-width:620px){
 .phenotype-consolidated-row{grid-template-columns:minmax(115px,145px) 1fr 58px;gap:8px;margin:9px 0}
 .phenotype-consolidated-label{font-size:12px}.phenotype-consolidated-status{font-size:11px}
}
`;
document.head.appendChild(style);

const statusRank={high:4,moderate:3,possible:2,low:1};
const statusWidth={high:82,moderate:56,possible:35,low:16};
const statusColor={high:'#15803d',moderate:'#c7671c',possible:'#5b4caf',low:'#15817e'};

function normText(s){return String(s||'').replace(/\s+/g,' ').trim()}
function findPhenotypeHeading(){
 return Array.from(document.querySelectorAll('h1,h2,h3,h4,div,section')).find(el=>{
   const t=normText(el.textContent).toLowerCase();
   return (t==='dominant phenotype'||t==='clinical phenotype') && el.children.length<4;
 });
}
function findCardAfterHeading(h){
 if(!h)return null;
 let n=h.nextElementSibling;
 while(n){
   if(n.classList?.contains('card'))return n;
   if(n.querySelector?.('.card'))return n.querySelector('.card');
   n=n.nextElementSibling;
 }
 return null;
}
function likelyRowFromStatus(statusEl,card){
 let n=statusEl;
 while(n&&n!==card){
   if(n.parentElement===card)return n;
   n=n.parentElement;
 }
 return null;
}
function extractOriginalRows(card){
 const rows=[];
 const seen=new Set();
 const statusEls=Array.from(card.querySelectorAll('*')).filter(el=>/^(High|Moderate|Possible|Low)$/i.test(normText(el.textContent)) && el.children.length===0);
 for(const sEl of statusEls){
   const row=likelyRowFromStatus(sEl,card);if(!row||seen.has(row))continue;
   const raw=normText(row.textContent);const status=normText(sEl.textContent).toLowerCase();
   let label=raw.replace(new RegExp('\\b'+status+'\\b','ig'),'').trim();
   label=label.replace(/[›»>]+$/,'').trim();
   if(!label||label.length>120)continue;
   seen.add(row);rows.push({row,label,status,rank:statusRank[status]||0});
 }
 return rows;
}
function familyFor(label){
 const x=label.toLowerCase();
 // Separate axial SpA pattern from peripheral inflammatory arthritis. Generic
 // inflammatory-arthritis/SpA buckets are intentionally merged into peripheral IA.
 if(/^spondyloarthritis$/.test(x)||/axial spondyloarthritis|axial spa|inflammatory axial/.test(x))return {key:'axial',label:'Inflammatory axial / spondyloarthritis phenotype'};
 if(/inflammatory arthritis|early arthritis|peripheral spa|seronegative.*arthritis/.test(x))return {key:'peripheral',label:'Peripheral inflammatory arthritis / synovitis phenotype'};
 if(/nociplastic|pain amplification|fibromyalgia/.test(x))return {key:'nociplastic',label:'Nociplastic / pain-amplification phenotype'};
 if(/mechanical|degenerative|osteoarthritis/.test(x))return {key:'mechanical',label:'Mechanical / degenerative pain phenotype'};
 if(/crystal|gout|cppd/.test(x))return {key:'crystal',label:'Crystal-arthritis phenotype'};
 if(/connective tissue|multisystem autoimmune|\bctd\b|lupus/.test(x))return {key:'ctd',label:'Connective-tissue / multisystem autoimmune phenotype'};
 if(/myositis|myopathy|muscle/.test(x))return {key:'myopathy',label:'Inflammatory myopathy phenotype'};
 if(/vascul|giant cell|large-vessel/.test(x))return {key:'vasculitic',label:'Vasculitic / vascular inflammatory phenotype'};
 if(/polymyalgia|\bpmr\b/.test(x))return {key:'pmr',label:'Polymyalgic shoulder/hip-girdle phenotype'};
 return {key:x.replace(/[^a-z0-9]+/g,'-'),label:label};
}
function consolidate(rows){
 const map=new Map();
 rows.forEach(r=>{
   const f=familyFor(r.label);const cur=map.get(f.key);
   if(!cur||r.rank>cur.rank)map.set(f.key,{...f,status:r.status,rank:r.rank,sources:[r.label]});
   else cur.sources.push(r.label);
 });
 let a=Array.from(map.values());
 // Background Low signals are generally not clinically useful when stronger,
 // genuinely supported patterns are present. This prevents unrelated disease-family
 // buckets (for example low large-vessel vasculitis) cluttering the phenotype panel.
 const meaningful=a.filter(x=>x.rank>=2);
 if(meaningful.length>=2)a=meaningful;
 else a=a.sort((p,q)=>q.rank-p.rank).slice(0,Math.max(2,meaningful.length));
 // Prefer distinct patterns in clinically useful order when scores tie.
 const priority={peripheral:8,axial:7,mechanical:6,nociplastic:5,crystal:4,ctd:3,myopathy:2,vasculitic:1,pmr:1};
 a.sort((p,q)=>q.rank-p.rank-(0)+(priority[q.key]||0)-(priority[p.key]||0));
 return a.slice(0,4);
}
function renderConsolidated(card,rows){
 const groups=consolidate(rows);if(!groups.length)return;
 let box=document.getElementById('clinicalPhenotypeConsolidated');
 if(!box){box=document.createElement('div');box.id='clinicalPhenotypeConsolidated';card.insertBefore(box,card.firstChild)}
 box.innerHTML='<div class="phenotype-explainer"><b>Clinical phenotype:</b> the broad pattern(s) present in the case, before assigning a named diagnosis. Closely related parent/child scoring categories are merged, and only the 3–4 strongest distinct patterns are shown.</div>'+groups.map(g=>{
   const pct=statusWidth[g.status]||20,col=statusColor[g.status]||'#15817e';
   return `<div class="phenotype-consolidated-row"><div><div class="phenotype-consolidated-label">${escapeHtml(g.label)}</div></div><div class="phenotype-consolidated-track"><div class="phenotype-consolidated-fill" style="width:${pct}%;background:${col}"></div></div><div class="phenotype-consolidated-status">${g.status.charAt(0).toUpperCase()+g.status.slice(1)}</div></div>`;
 }).join('');
 rows.forEach(r=>{r.row.style.display='none';r.row.dataset.v26Hidden='1'});
}
function apply(){
 const h=findPhenotypeHeading(),card=findCardAfterHeading(h);if(!h||!card)return;
 if(h.dataset.v26Title!=='1'){h.textContent='CLINICAL PHENOTYPE';h.dataset.v26Title='1'}
 const rows=extractOriginalRows(card).filter(r=>!r.row.closest('#clinicalPhenotypeConsolidated'));
 if(!rows.length)return;
 renderConsolidated(card,rows);
}
const mo=new MutationObserver(()=>{clearTimeout(window.__v26t);window.__v26t=setTimeout(apply,60)});
mo.observe(document.body,{subtree:true,childList:true,characterData:true});
setTimeout(apply,100);setTimeout(apply,450);setTimeout(apply,1000);
try{sourceDecks.push(['Phenotype consolidation v26','Clinical phenotype display is limited to 3–4 mutually distinct patterns. Duplicate and parent/child categories are merged before display, and low background disease-family signals are suppressed when stronger phenotypes are present.']);renderSources()}catch(e){console.warn('v26 phenotype consolidation',e)}
})();