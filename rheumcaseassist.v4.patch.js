(function(){
'use strict';

/* v4 fixes two issues:
   1) v2 shuffled the correct answer before storing index 0, which could mark the wrong option as correct.
   2) the explanation control was inserted after the whole feedback container, below Continue and often hidden by mobile nav.
*/

const css=document.createElement('style');
css.textContent=`
.rca4-explainBtn{width:100%;border:1.5px solid var(--teal);background:#f7fbfb;color:var(--navy);border-radius:11px;padding:11px 12px;font-weight:900;text-align:left;margin:9px 0 6px}.rca4-explainBtn .chev{float:right;color:var(--teal)}
.rca4-explain{display:none;border:1px solid var(--line);border-radius:12px;background:#fff;padding:12px 13px;margin:0 0 10px;font-size:12.8px;line-height:1.5}.rca4-explain.open{display:block}
.rca4-box{border-radius:9px;padding:9px 10px;margin:7px 0}.rca4-good{background:#edf8f2}.rca4-bad{background:#fff3f2}.rca4-principle{background:#eef6f8}.rca4-good b{color:var(--green)}.rca4-bad b{color:var(--red)}.rca4-principle b{color:var(--teal)}
`;
document.head.appendChild(css);

function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function clean(s){return String(s||'').replace(/\s+/g,' ').trim()}

/* Keep the correct option at original index 0, but still randomise the distractors.
   renderStep() already shuffles the displayed buttons while preserving data-orig,
   so learners still see the correct option in a random visual position. */
try{
  distract=function(correct,type){
    const banks={
      history:['Order a broad autoimmune panel immediately before clarifying the history','Focus only on pain severity and analgesia use','Defer associated-system questions until after imaging'],
      exam:['Limit examination to the single most painful joint','Perform no examination if inflammatory markers are raised','Examine only for tender points'],
      tests:['Order ANA, ANCA, RF, ACPA, HLA-B27 and myositis antibodies in every case','Repeat all blood tests before obtaining any focused sample or imaging','Request whole-body CT as the first investigation'],
      interpret:['Treat any positive autoantibody as diagnostic regardless of phenotype','Assume normal inflammatory markers exclude inflammatory rheumatic disease','Choose the diagnosis solely from age and sex'],
      management:['Start long-term immunosuppression before resolving major infection risk','Use treatment response alone as the diagnostic test','Delay all management until every possible investigation is complete'],
      monitor:['Monitor symptoms only; objective disease activity and toxicity checks are unnecessary','Stop follow-up once symptoms improve','Repeat broad autoantibody panels routinely to measure treatment response']
    };
    const ds=[...(banks[type]||banks.interpret)];
    for(let i=ds.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ds[i],ds[j]]=[ds[j],ds[i]]}
    return [correct,...ds].slice(0,4);
  };
}catch(e){console.warn('RCA v4 distract override failed',e)}

function explainCopy(q,correct,chosen,reveal){
  const t=(q+' '+correct+' '+reveal).toLowerCase();
  let why='This option best answers the decision being asked at this stage and is most likely to change the differential diagnosis or management.';
  let principle='Choose the option that answers the immediate clinical question with the highest diagnostic or safety yield.';
  if(/additional history|history would most improve/.test(t)){
    why='The strongest next step is to clarify the history that changes pre-test probability before ordering investigations. Chronology, speed of onset, inflammatory behaviour, previous attacks, fever/infection risk, psoriasis or nail disease, uveitis, IBD, preceding GI/GU infection, family history and medication/comorbidity clues can markedly re-rank the differential.';
    principle='In rheumatology, a focused history often determines which tests are worth ordering. Tests should answer a clinical question rather than generate the question.';
  } else if(/safety|urgent|red flag/.test(t)){
    why='This is strongest because a time-critical mimic or organ-threatening complication must be identified before routine diagnostic refinement.';
    principle='Address immediate threats first; diagnostic refinement comes second.';
  } else if(/examination/.test(t)){
    why='This examination strategy tests the suspected syndrome while deliberately looking for findings that support or contradict the leading diagnoses.';
    principle='Examination should discriminate between competing diagnoses, not simply document pain.';
  } else if(/investigation|work.?up|test|order/.test(t)){
    why='This is the most useful investigation strategy because it is targeted to the leading discriminator and is most likely to change diagnosis or management.';
    principle='Before ordering a test, ask what result you expect and what you would do differently if it is positive or negative.';
  } else if(/interpret/.test(t)){
    why='The result should be interpreted in the context of the phenotype rather than treated as diagnostic in isolation.';
    principle='Serology, inflammatory markers and imaging modify probability; they do not replace clinical context.';
  } else if(/most likely diagnosis|diagnosis/.test(t)){
    why='This diagnosis best integrates the chronology, examination and objective investigations while leaving the fewest important findings unexplained.';
    principle='Commit only after considering supporting features, contradictory features and dangerous mimics.';
  } else if(/management|treat|therapy/.test(t)){
    why='This option best matches treatment intensity to the disease severity, dominant domain, organ involvement and safety considerations presented in the case.';
    principle='Treat severity and organ threat, not just the diagnostic label.';
  }

  let whyChosen='';
  if(chosen && clean(chosen)!==clean(correct)){
    whyChosen='The option you selected is understandable, but it is less useful at this stage because it either narrows the assessment too early, delays a higher-yield discriminator, or does not directly answer the immediate clinical question.';
    if(/focus only on pain severity/i.test(chosen)) whyChosen='Pain severity and analgesia use matter for symptom control, but they do not sufficiently distinguish crystal arthritis, infection, inflammatory arthritis or mechanical disease. The case needs discriminating historical features first.';
    if(/defer associated-system questions/i.test(chosen)) whyChosen='Deferring associated-system questions can miss the key clues that separate reactive arthritis, psoriatic arthritis, axial/peripheral SpA and other inflammatory disorders before imaging is ordered.';
    if(/broad autoimmune panel/i.test(chosen)) whyChosen='A broad autoimmune panel before defining the phenotype creates a high risk of incidental positive results and may distract from the more informative history and examination.';
  }
  return {why,whyChosen,principle};
}

function installExplain(){
  const fbWrap=document.getElementById('rca2Fb');
  if(!fbWrap) return;
  const fb=fbWrap.querySelector('.rca2-feedback');
  if(!fb || fbWrap.querySelector('.rca4-explainBtn')) return;
  const card=fb.closest('.rca2-card');
  if(!card) return;
  const q=clean(card.querySelector('.rca2-q')?.textContent);
  const reveal=clean(card.querySelector('.rca2-reveal')?.textContent);
  const correct=clean(card.querySelector('.rca2-opt.good')?.textContent);
  const chosen=clean(card.querySelector('.rca2-opt.bad')?.textContent)||correct;
  if(!q||!correct) return;

  /* Remove the older v3 explanation if it was inserted elsewhere. */
  card.parentElement?.querySelectorAll('.rca3-explainBtn,.rca3-explain').forEach(x=>x.remove());

  const r=explainCopy(q,correct,chosen,reveal);
  const btn=document.createElement('button');
  btn.type='button';
  btn.className='rca4-explainBtn';
  btn.innerHTML='💡 Explain why this answer is better <span class="chev">⌄</span>';
  const panel=document.createElement('div');
  panel.className='rca4-explain';
  panel.innerHTML='<div class="rca4-box rca4-good"><b>Why this answer is stronger</b><br>'+esc(r.why)+'</div>'+
    (r.whyChosen?'<div class="rca4-box rca4-bad"><b>Why your selected answer is weaker</b><br>'+esc(r.whyChosen)+'</div>':'')+
    '<div class="rca4-box rca4-principle"><b>Clinical reasoning principle</b><br>'+esc(r.principle)+'</div>';

  const next=fbWrap.querySelector('.rca2-next');
  if(next){fbWrap.insertBefore(btn,next);fbWrap.insertBefore(panel,next)}
  else {fbWrap.append(btn,panel)}

  btn.onclick=()=>{
    const open=panel.classList.toggle('open');
    btn.querySelector('.chev').textContent=open?'⌃':'⌄';
    if(open) setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),60);
  };
}

let timer;
const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(installExplain,40)});
obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
document.addEventListener('click',e=>{if(e.target.closest('.rca2-opt'))setTimeout(installExplain,30)},true);
setTimeout(installExplain,250);
})();