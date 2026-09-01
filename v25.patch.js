(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
.phenotype-explainer{margin:4px 0 10px;padding:9px 11px;border-left:4px solid var(--teal);background:#f5fbfb;border-radius:8px;color:var(--mute);font-size:12px;line-height:1.45}
.inline-dx-heading{margin:14px 0 7px;padding-top:12px;border-top:1px solid var(--line);color:var(--teal);font-size:14px;font-weight:850;text-transform:uppercase;letter-spacing:.04em}
.inline-dx-explainer{margin:0 0 9px;color:var(--mute);font-size:12px;line-height:1.45}
#rankedDifferentialHeading{display:none!important}
@media(max-width:620px){.phenotype-explainer,.inline-dx-explainer{font-size:11.5px}.inline-dx-heading{font-size:13px}}
`;
document.head.appendChild(css);

function textEq(el,needle){return ((el&&el.textContent)||'').replace(/\s+/g,' ').trim().toLowerCase()===needle.toLowerCase()}
function findHeadingByText(root,needle){
 const els=root.querySelectorAll('h1,h2,h3,h4,.section-title,.minihead,div');
 for(const el of els){if(textEq(el,needle))return el}
 return null;
}
function ensurePhenotypeExplanation(){
 const results=document.getElementById('results')||document.body;
 const heading=findHeadingByText(results,'DOMINANT PHENOTYPE')||findHeadingByText(results,'CLINICAL PHENOTYPE');
 if(!heading||document.getElementById('phenotypeExplainer'))return;
 const note=document.createElement('div');note.id='phenotypeExplainer';note.className='phenotype-explainer';
 note.innerHTML='<b>Clinical phenotype</b> describes the pattern of illness seen in the case — for example peripheral synovitis, inflammatory axial features or pain amplification. It is not itself the final diagnosis.';
 heading.insertAdjacentElement('afterend',note);
}
function ensureInlineDifferentialHeading(){
 const results=document.getElementById('results')||document.body;
 const chips=[...results.querySelectorAll('.candidate-chip-click,[data-dx-key-exact]')].filter(el=>el.offsetParent!==null);
 if(!chips.length)return;
 const first=chips[0];
 let row=first.parentElement;
 while(row&&row!==results){
   const count=row.querySelectorAll('.candidate-chip-click,[data-dx-key-exact]').length;
   if(count>=2)break;
   row=row.parentElement;
 }
 if(!row||row===results)return;
 if(row.previousElementSibling&&row.previousElementSibling.id==='inlineDifferentialBlock')return;
 const block=document.createElement('div');block.id='inlineDifferentialBlock';
 block.innerHTML='<div class="inline-dx-heading">Ranked differential diagnosis</div><div class="inline-dx-explainer"><b>Differential diagnosis</b> lists the named conditions that could explain the phenotype. They are ranked as working possibilities; tap each diagnosis to review the case-specific reasons for and against it and what would help distinguish it.</div>';
 row.parentNode.insertBefore(block,row);
}
function apply(){ensurePhenotypeExplanation();ensureInlineDifferentialHeading()}
const mo=new MutationObserver(apply);mo.observe(document.body,{subtree:true,childList:true});
setTimeout(apply,100);setTimeout(apply,500);
try{sourceDecks.push(['Phenotype vs differential labels v25','Adds concise explanatory text for Clinical phenotype and places Ranked differential diagnosis immediately above the clickable disease candidates within the same results panel.']);renderSources()}catch(e){}
})();