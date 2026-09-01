(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
.case-entry-panel{margin-bottom:14px}.case-entry-title{font-weight:850;color:var(--navy);font-size:16px;margin-bottom:5px}.case-entry-help{font-size:12px;line-height:1.45;color:var(--mute);margin-bottom:10px}.case-entry-panel #caseText{min-height:220px}.case-entry-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}.case-demographics{margin-top:12px}.import-divider{height:1px;background:var(--line);margin:16px 0 12px}.input-import-panel{border:1px solid var(--line);border-radius:13px;background:#f9fcfc;overflow:hidden;margin-top:2px}.input-import-panel>summary{list-style:none;cursor:pointer;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:850;color:var(--navy);background:#f7fbfb}.input-import-panel>summary::-webkit-details-marker{display:none}.input-import-panel>summary::after{content:'＋';color:var(--teal);font-size:20px}.input-import-panel[open]>summary::after{content:'−'}.input-import-sub{display:block;font-size:11px;font-weight:600;color:var(--mute);margin-top:3px}.input-import-body{padding:0 12px 12px}.input-import-body .letter-tools{border:0;padding:10px 0 0;margin:0;background:transparent}.input-import-body .letter-tools>h3{display:none}.input-primary-card>.hint{display:none}.quick-entry-label{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;background:#eef7f6;color:var(--teal);font-size:11px;font-weight:800;margin-bottom:8px}@media(max-width:620px){.case-entry-panel #caseText{min-height:250px}.input-import-panel>summary{padding:13px}.input-import-body{padding:0 10px 10px}}
`;
document.head.appendChild(css);

function reorganiseInput(){
 const screen=document.getElementById('input');
 const box=document.getElementById('caseText');
 const tools=document.querySelector('.letter-tools');
 if(!screen||!box||!tools||box.dataset.v20Reordered==='1')return;
 const card=box.closest('.card');if(!card)return;
 card.classList.add('input-primary-card');
 box.dataset.v20Reordered='1';

 const dictBtn=document.getElementById('dictateCaseBtn');
 const dictRow=dictBtn?.parentElement;
 const dictNote=dictRow?.nextElementSibling;
 const demographics=card.querySelector('.input-grid');
 const originalHint=card.querySelector('.hint');

 const entry=document.createElement('section');entry.className='case-entry-panel';
 entry.innerHTML='<div class="quick-entry-label">STEP 1 · ENTER THE CASE</div><div class="case-entry-title">Clinical details</div><div class="case-entry-help">Type, paste or dictate the referral history, examination findings, blood results and imaging. You can also import or photograph a referral letter below.</div>';
 entry.appendChild(box);
 if(dictRow){dictRow.classList.add('case-entry-actions');dictRow.removeAttribute('style');entry.appendChild(dictRow)}
 if(dictNote)entry.appendChild(dictNote);
 if(demographics){demographics.classList.add('case-demographics');demographics.removeAttribute('style');entry.appendChild(demographics)}

 const divider=document.createElement('div');divider.className='import-divider';
 const importPanel=document.createElement('details');importPanel.className='input-import-panel';
 importPanel.innerHTML='<summary><span><span>Import / photograph a referral letter</span><span class="input-import-sub">Optional · choose existing images or take photos, then extract and review the text</span></span></summary><div class="input-import-body"></div>';
 importPanel.querySelector('.input-import-body').appendChild(tools);

 if(originalHint)card.insertBefore(entry,originalHint);else card.prepend(entry);
 card.appendChild(divider);card.appendChild(importPanel);

 // Make the existing image chooser wording clearer without changing its behaviour/listeners.
 const fileLabel=document.querySelector('.file-label');
 const input=document.getElementById('letterImages');
 if(fileLabel&&input){fileLabel.textContent='Choose / take photo(s)';fileLabel.appendChild(input)}
 const heading=document.getElementById('letterImportHeading');if(heading)heading.textContent='Letter image import';

 // If OCR has already been used, keep the import panel open so review controls remain visible.
 const reviewed=document.getElementById('ocrReviewWrap');
 if(reviewed&&!reviewed.classList.contains('hidden'))importPanel.open=true;
 const observer=new MutationObserver(()=>{if(reviewed&&!reviewed.classList.contains('hidden'))importPanel.open=true});
 if(reviewed)observer.observe(reviewed,{attributes:true,attributeFilter:['class']});
}

try{reorganiseInput();sourceDecks.push(['Input workflow v20','Mobile-first input layout: case text and dictation first, demographics immediately below, with optional letter/image import and camera/photo workflow beneath in a collapsible section.']);renderSources()}catch(e){console.warn('v20 input layout patch',e)}
})();