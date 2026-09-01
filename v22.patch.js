(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
/* v22: reliable differential-chip routing + mobile-safe reasoning sheet */
.dx-detail-modal{padding:10px 10px calc(10px + env(safe-area-inset-bottom))!important;overscroll-behavior:contain}
.dx-detail-sheet{width:min(760px,100%)!important;max-height:min(72dvh,650px)!important;overflow:auto!important;-webkit-overflow-scrolling:touch!important;border-radius:18px 18px 14px 14px!important;padding:0 18px calc(18px + env(safe-area-inset-bottom))!important;overscroll-behavior:contain}
#dxDetailClose{position:sticky!important;top:10px!important;z-index:20!important;float:right!important;margin:10px 0 4px 10px!important;background:#fff!important;box-shadow:0 2px 10px rgba(11,46,79,.12)!important}
#dxDetailTitle{padding-top:18px!important;padding-right:78px!important;min-height:44px}
#dxDetailBody{clear:both;padding-bottom:4px}
@media(max-width:620px){
 .dx-detail-modal{align-items:flex-end!important;padding-left:7px!important;padding-right:7px!important}
 .dx-detail-sheet{max-height:68dvh!important;border-radius:16px 16px 10px 10px!important;padding-left:14px!important;padding-right:14px!important}
 #dxDetailTitle{font-size:18px!important;line-height:1.25!important;padding-right:70px!important}
 .dx-detail-section ul{padding-left:20px;margin-top:7px}
 .dx-detail-section li{margin-bottom:6px;line-height:1.4}
}
`;
document.head.appendChild(css);

function cleanLabel(s){return String(s||'').replace(/[›»>]+\s*$/,'').replace(/\s+/g,' ').trim().toLowerCase()}
function exactModuleForChip(el){
 const txt=cleanLabel(el.textContent);
 if(!txt)return null;
 // Exact display-label matching only. This avoids the previous broad substring
 // matching that could route several chips to one diagnosis.
 let m=modules.find(x=>cleanLabel(x.label)===txt);
 if(m)return m;
 // A small set of safe aliases for visible phenotype wording.
 const aliases={
  'inflammatory arthritis / possible seronegative peripheral spa phenotype':'seronegativeia',
  'early undifferentiated inflammatory arthritis':'earlyarthritis',
  'axial spondyloarthritis':'axspa',
  'osteoarthritis':'oa'
 };
 const key=aliases[txt];
 return key?modules.find(x=>x.key===key):null;
}
function stampVisibleDifferentialChips(){
 document.querySelectorAll('.candidate-chip-click,.chip,.pill,.tag,[class*="chip"],[class*="pill"]').forEach(el=>{
   const m=exactModuleForChip(el);if(!m)return;
   // Only stamp chips that are already behaving as candidate links, or live in Results.
   const results=el.closest('#results');
   if(!results&&!el.classList.contains('candidate-chip-click'))return;
   el.dataset.dxKeyExact=m.key;
 });
}

// Capture phase intentionally runs before the legacy v18 handler. If a chip has
// an exact diagnosis mapping, stop the older broad-match handler and open the
// correct rationale instead.
document.addEventListener('click',function(e){
 const el=e.target.closest('.candidate-chip-click,[data-dx-key-exact]');if(!el)return;
 const m=exactModuleForChip(el);if(!m)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 showDifferentialDetail(m.key);
},true);
document.addEventListener('keydown',function(e){
 if(e.key!=='Enter'&&e.key!==' ')return;
 const el=e.target.closest('.candidate-chip-click,[data-dx-key-exact]');if(!el)return;
 const m=exactModuleForChip(el);if(!m)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 showDifferentialDetail(m.key);
},true);

const mo=new MutationObserver(stampVisibleDifferentialChips);mo.observe(document.body,{subtree:true,childList:true});
setTimeout(stampVisibleDifferentialChips,100);setTimeout(stampVisibleDifferentialChips,500);

// Keep background page from moving behind the sheet on iPhone and restore it on close.
function syncModalState(){
 const modal=document.getElementById('dxDetailModal');
 const open=!!modal?.classList.contains('open');
 document.documentElement.style.overflow=open?'hidden':'';
 document.body.style.overflow=open?'hidden':'';
 if(open){const sheet=modal.querySelector('.dx-detail-sheet');if(sheet)sheet.scrollTop=0}
}
const bodyMo=new MutationObserver(()=>syncModalState());bodyMo.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});

try{sourceDecks.push(['Differential interaction v22','Exact diagnosis-to-chip routing prevents multiple purple differential links opening the same rationale. The mobile reasoning sheet is height-limited, internally scrollable and keeps its Close control visible on iPhone.']);renderSources()}catch(e){console.warn('v22 differential interaction patch',e)}
})();