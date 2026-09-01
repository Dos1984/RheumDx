(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
.dx-section-heading{margin:20px 0 10px;color:var(--teal);font-size:18px;font-weight:850;text-transform:uppercase;letter-spacing:.04em}.dx-section-subtitle{margin:-4px 0 12px;color:var(--mute);font-size:12px;line-height:1.45}
`;
document.head.appendChild(css);

function ensureDifferentialHeading(){
 const d=document.getElementById('differentials');if(!d)return;
 let h=document.getElementById('rankedDifferentialHeading');
 if(!h){
   h=document.createElement('div');
   h.id='rankedDifferentialHeading';
   h.innerHTML='<div class="dx-section-heading">Ranked differential diagnosis</div><div class="dx-section-subtitle">The leading diagnostic possibilities are ranked separately from the clinical phenotype. Tap a diagnosis to review the case-specific evidence for, evidence against, and the findings or tests that would help discriminate it.</div>';
   d.parentNode.insertBefore(h,d);
 }
}

const mo=new MutationObserver(()=>ensureDifferentialHeading());
mo.observe(document.body,{subtree:true,childList:true});
setTimeout(ensureDifferentialHeading,100);
try{sourceDecks.push(['Differential heading v24','Adds a clear Ranked differential diagnosis heading so disease candidates are visually separated from the Clinical phenotype section.']);renderSources()}catch(e){}
})();