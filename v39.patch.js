(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
.rdx39-special{border-left:5px solid var(--teal);background:#f8fbfb}.rdx39-special h3{margin:0 0 7px;color:var(--navy)}.rdx39-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.rdx39-box{border:1px solid var(--line);border-radius:10px;padding:9px;background:#fff;font-size:12px;line-height:1.45}.rdx39-box b{display:block;color:var(--teal);margin-bottom:4px}@media(max-width:620px){.rdx39-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(css);
function hasModule(k){return Array.isArray(window.modules)&&modules.some(m=>m.key===k)}
const MODS=[
{
 key:'igg4rd',label:'IgG4-related disease (IgG4-RD)',group:'Systemic fibroinflammatory disease',
 support:[
  'Multisystem immune-mediated fibroinflammatory disease with tumefactive enlargement, lymphoplasmacytic inflammation and progressive fibrosis.',
  'Typical sites include pancreas/biliary tree, major salivary/lacrimal glands, orbit, kidney, lungs, aorta/retroperitoneum, meninges and thyroid.',
  'Characteristic pathology: dense lymphoplasmacytic infiltrate, storiform fibrosis and obliterative phlebitis; increased IgG4-positive plasma cells are supportive but not diagnostic.',
  'Serum IgG4 may be normal in genuine disease and elevated in several mimics; no single serological, radiological or pathological finding establishes the diagnosis.'
 ],
 against:[
  'Prominent recurrent fever, rapid radiological progression, cavitation/necrosis, marked eosinophilia, PR3/MPO-ANCA, strong disease-specific CTD antibodies, granulomatous inflammation or necrotising vasculitis should prompt an alternative diagnosis.',
  'Radiologically suspicious malignancy or infection must be adequately investigated before attributing a lesion to IgG4-RD.',
  'A high IgG4 concentration does not by itself establish IgG4-RD.'
 ],
 mimics:['Pancreatic adenocarcinoma / cholangiocarcinoma','Lymphoma','Granulomatosis with polyangiitis / ANCA-associated vasculitis','Sjögren disease','Multicentric Castleman disease','Erdheim-Chester disease / Rosai-Dorfman disease','Sarcoidosis','Tuberculosis or fungal infection'],
 tests:['FBC with differential, renal/liver profile, ESR/CRP','Urinalysis and urine protein quantification','Total immunoglobulins and IgG subclasses including serum IgG4','C3/C4; consider IgE and eosinophils','Targeted ANCA, ANA/ENA/dsDNA, cryoglobulins, SPEP/free light chains according to differential','Cross-sectional imaging of involved organs; consider CT chest/abdomen/pelvis or PET-CT to map multiorgan disease and identify a biopsy target','Biopsy of an appropriate involved site when malignancy/infection or another mimic remains plausible; request IgG4 immunostaining and morphology review'],
 missing:['Previous pancreatitis, painless jaundice or biliary strictures?','Painless bilateral submandibular/parotid/lacrimal swelling or orbital disease?','Previous retroperitoneal fibrosis, hydronephrosis or unexplained renal dysfunction?','Pulmonary lesions, periaortitis/aortitis, pachymeningitis, hypophysitis or thyroid fibrosis?','Previous biopsy/resection for a presumed tumour?','Features suggesting malignancy, infection, GPA, Sjögren disease, Castleman disease or histiocytosis?'],
 criteria:'2019 ACR/EULAR classification: characteristic typical-organ entry → apply exclusion criteria → score 8 weighted inclusion domains; ≥20 points classifies as IgG4-RD for research. Classification ≠ diagnosis and mimics must still be excluded.',
 v15:{pattern:'Clinicopathological multisystem fibroinflammatory disease, often with painless tumefactive organ enlargement. Think pancreas/biliary tree, salivary/lacrimal glands, kidney, retroperitoneum/aorta, lung and orbit; integrate clinical, serological, radiological and tissue data.',mimics:['Pancreatic/biliary malignancy','Lymphoma','GPA/ANCA vasculitis','Sjögren disease','Castleman disease','Erdheim-Chester/Rosai-Dorfman','Sarcoidosis','Infection'],first:['FBC/eosinophils, renal/liver profile, ESR/CRP','Urinalysis + urine protein quantification','IgG subclasses including serum IgG4','C3/C4 and phenotype-directed mimic testing','Cross-sectional imaging of affected and potentially occult organs'],conditional:['FDG-PET/CT to map disease and select biopsy site where useful','Biopsy of an appropriate involved site with morphology + IgG4 immunostaining','MRCP/EUS for pancreatobiliary disease; renal/vascular/orbital imaging as phenotype dictates'],guard:'IgG4-RD is not a diagnosis of “high serum IgG4”. Normal IgG4 does not exclude it; elevated IgG4 is not specific. Morphology and clinical context outweigh IgG4-positive cell counts alone.'}
},
{
 key:'aosd',label:"Adult-onset Still's disease (AOSD)",group:'Systemic autoinflammatory disease',
 support:['Systemic autoinflammatory syndrome characterised by high-spiking quotidian fever, inflammatory arthralgia/arthritis, transient salmon-pink rash and often sore throat.','Neutrophilic leukocytosis, markedly raised inflammatory markers and hyperferritinaemia are common but not individually diagnostic.','Serositis, lymphadenopathy, hepatosplenomegaly and liver enzyme abnormalities can occur.','Macrophage activation syndrome (MAS)/secondary HLH is a major life-threatening complication.'],
 against:['AOSD is a diagnosis of exclusion: infection, malignancy and alternative rheumatic/autoinflammatory disease must be addressed.','Ferritin is supportive but nonspecific and can be very high in infection, malignancy, HLH/MAS and other inflammatory states.','Persistent fever with falling cell counts, rapidly rising ferritin, liver injury, hypertriglyceridaemia, coagulopathy or falling fibrinogen should trigger urgent evaluation for MAS rather than being assumed to be an uncomplicated flare.'],
 mimics:['Bacterial/viral infection including endocarditis','Lymphoma or other malignancy','SLE / systemic vasculitis','Drug reaction','Schnitzler syndrome','Other autoinflammatory syndromes','VEXAS in an older patient with cytopenias','Primary/secondary HLH'],
 tests:['FBC with differential, CRP/ESR, ferritin, renal and liver profile','Blood cultures and targeted infection screen based on presentation','RF/ACPA, ANA and phenotype-directed autoimmune tests','Glycosylated ferritin if locally available','ECG/echocardiography for suspected pericarditis; troponin/echo/cardiac MRI for myocarditis where indicated','CT/PET, lymph-node or marrow assessment when malignancy/occult infection remains plausible','If MAS suspected: serial FBC, ferritin, LFTs, triglycerides, fibrinogen/coagulation and specialist HLH/MAS assessment'],
 missing:['Is fever ≥39°C and quotidian, with return toward baseline between spikes?','Does the evanescent rash appear with fever?','Sore throat/pharyngitis, inflammatory arthritis or myalgia?','Lymphadenopathy, splenomegaly, pleuritis/pericarditis or myocarditis?','Have infection, endocarditis and malignancy been reasonably excluded?','Any cytopenias, persistent fever, extreme ferritin rise, liver injury, hypertriglyceridaemia or low fibrinogen suggesting MAS?'],
 criteria:'Yamaguchi and Fautrel criteria can support classification/structured reasoning but do not replace clinical diagnosis. Yamaguchi requires exclusion of infection, malignancy and other rheumatic disease.',
 v15:{pattern:'Systemic autoinflammatory phenotype with quotidian high-spiking fever, inflammatory arthralgia/arthritis, fever-associated evanescent salmon rash and often pharyngitis, supported by neutrophilic leukocytosis and hyperferritinaemia after exclusion of mimics.',mimics:['Infection/endocarditis','Lymphoma/malignancy','SLE/vasculitis','Drug reaction','Schnitzler/other autoinflammatory disease','VEXAS in appropriate older patient','HLH/MAS'],first:['FBC with differential, CRP/ESR, ferritin, renal/liver profile','Septic/infection screen including blood cultures where appropriate','Focused examination for rash, synovitis, nodes, organomegaly and serositis'],conditional:['Glycosylated ferritin if available','RF/ACPA/ANA/ANCA according to differential','CT/PET or tissue assessment when infection/malignancy remains plausible','MAS work-up: serial FBC/ferritin/LFT, triglycerides, fibrinogen/coagulation; specialist escalation'],guard:'Do not diagnose AOSD from ferritin alone. A falling platelet/WBC count, persistent fever, rapidly rising ferritin, liver dysfunction, hypertriglyceridaemia or low fibrinogen should trigger urgent MAS/HLH assessment.'}
}];
try{
 if(Array.isArray(window.modules)){
  for(const m of MODS){if(!hasModule(m.key))modules.push(m);else Object.assign(modules.find(z=>z.key===m.key),m)}
  if(typeof window.renderCriteria==='function')window.renderCriteria();
 }
}catch(e){console.warn('v39 module update',e)}
function specialistCards(text){
 const x=String(text||'').toLowerCase(),out=[];
 const igg4=[/igg4/,/autoimmune pancreatitis/,/painless jaundice/,/submandibular/,/lacrimal/,/retroperitoneal fibrosis/,/periaort/,/sausage.{0,20}pancreas/,/storiform/,/obliterative phlebitis/,/pachymening/].reduce((n,r)=>n+(r.test(x)?1:0),0);
 if(igg4>=2)out.push({title:'IgG4-related disease',key:'igg4rd',why:'Consider when there is a painless tumefactive/multiorgan fibroinflammatory pattern — particularly pancreas/biliary tree, bilateral salivary/lacrimal glands, kidney, retroperitoneum/aorta, lung or orbit.',against:'Prominent fever, rapid progression, cavitation/necrosis, PR3/MPO-ANCA, granulomatous or necrotising pathology, monoclonality, or an inadequately investigated mass should push toward a mimic.',discriminate:'Serum IgG4 supports but does not diagnose. Cross-sectional imaging plus an appropriately targeted biopsy may be decisive, particularly to exclude malignancy, infection, vasculitis or histiocytosis.'});
 const still=[/quotidian/,/salmon.{0,15}rash/,/still.?s/,/high.spik.{0,10}fever/,/ferritin/,/neutrophil/,/sore throat/,/pharyngitis/].reduce((n,r)=>n+(r.test(x)?1:0),0);
 if(still>=3)out.push({title:"Adult-onset Still's disease",key:'aosd',why:'Consider when high-spiking quotidian fever, inflammatory arthritis/arthralgia, evanescent salmon rash and pharyngitis occur with neutrophilic inflammation and hyperferritinaemia.',against:'Infection, endocarditis, lymphoma/malignancy, SLE/vasculitis and alternative autoinflammatory syndromes must remain visible until reasonably excluded.',discriminate:'Ferritin is supportive, not diagnostic. Persistent fever with cytopenias, rapidly rising ferritin, liver injury, hypertriglyceridaemia or falling fibrinogen is a MAS/HLH red flag and needs urgent reassessment.'});
 return out;
}
function injectSpecialist(text){
 const host=document.getElementById('differentials');if(!host)return;
 host.querySelectorAll('.rdx39-special').forEach(e=>e.remove());
 const cards=specialistCards(text);if(!cards.length)return;
 const anchor=host.querySelector('.card.dx,.rdx-dx-accordion')||host.firstElementChild;
 cards.reverse().forEach(c=>{const d=document.createElement('div');d.className='card rdx39-special';d.innerHTML=`<h3>${c.title}</h3><div class="small"><b>Specialist differential update</b></div><div class="rdx39-grid"><div class="rdx39-box"><b>Why it fits</b>${c.why}</div><div class="rdx39-box"><b>What argues against / important mimics</b>${c.against}</div></div><div class="rdx39-box" style="margin-top:8px"><b>What discriminates it</b>${c.discriminate}</div><button type="button" class="btn secondary" style="margin-top:9px;width:100%" onclick="openModule('${c.key}')">Open disease-pattern module →</button>`;if(anchor)host.insertBefore(d,anchor);else host.appendChild(d)});
}
try{
 if(typeof window.renderDifferentials==='function'){const old=window.renderDifferentials;window.renderDifferentials=function(sc,t,a){const r=old.apply(this,arguments);setTimeout(()=>injectSpecialist(t),20);return r}}
 else if(typeof renderDifferentials==='function'){const old=renderDifferentials;renderDifferentials=function(sc,t,a){const r=old.apply(this,arguments);setTimeout(()=>injectSpecialist(t),20);return r}}
}catch(e){console.warn('v39 differential integration',e)}
try{
 if(Array.isArray(window.sourceDecks)){
  sourceDecks.push(['IgG4-RD update v39','Uploaded 2019 ACR/EULAR classification criteria, 2026 teaching material, contemporary differential-diagnosis framing and 2025 treatment evidence.']);
  sourceDecks.push(["Adult-onset Still's disease update v39",'Uploaded BMJ/teaching material plus current EULAR/PReS diagnostic-management framing, including MAS/HLH safety recognition.']);
  if(typeof window.renderSources==='function')renderSources();
 }
}catch(e){}
})();