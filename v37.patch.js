(function(){
'use strict';
const css=document.createElement('style');
css.textContent=`
/* v37 mobile case-player scrolling */
#cases{
  padding-bottom:calc(190px + env(safe-area-inset-bottom))!important;
  overflow-y:auto!important;
  -webkit-overflow-scrolling:touch;
  scroll-padding-bottom:190px;
}
#cases .rdx-case-player,
#cases .rdx-case-player .card{
  padding-bottom:calc(120px + env(safe-area-inset-bottom));
}
#cases .rdx-next{
  scroll-margin-bottom:150px;
  margin-bottom:26px;
}
#cases .rdx-feedback{
  scroll-margin-bottom:170px;
}
@media(max-width:620px){
  #cases .rdx-opt{font-size:12.75px;line-height:1.38;padding:10px 11px;margin:7px 0}
  #cases .rdx-q{font-size:15px;line-height:1.35;margin:10px 0}
  #cases .rdx-feedback{font-size:12.5px;line-height:1.45;padding:10px 11px}
  #cases .rdx-case-vignette{font-size:12.5px;line-height:1.45;padding:10px 11px}
  #cases .rdx-case-banner{padding:12px}
  #cases .rdx-next{font-size:13px;padding:12px}
}
`;
document.head.appendChild(css);

function ensureNextVisible(){
 const cases=document.getElementById('cases');
 if(!cases||cases.classList.contains('hidden'))return;
 const btn=[...cases.querySelectorAll('.rdx-next')].filter(b=>b.offsetParent!==null).pop();
 if(!btn)return;
 const r=btn.getBoundingClientRect();
 const nav=[...document.querySelectorAll('.tabs,.tabbar,.bottomnav')].find(n=>n.offsetParent!==null);
 const navTop=nav?nav.getBoundingClientRect().top:(window.innerHeight-92);
 const safeBottom=Math.min(navTop,window.innerHeight)-18;
 if(r.bottom>safeBottom){
   const amount=Math.min(r.bottom-safeBottom+24,260);
   window.scrollBy({top:amount,behavior:'smooth'});
 }
}
let lastBtn=null,tm;
new MutationObserver(()=>{
 clearTimeout(tm);
 tm=setTimeout(()=>{
   const cases=document.getElementById('cases');
   const btn=cases?[...cases.querySelectorAll('.rdx-next')].filter(b=>b.offsetParent!==null).pop():null;
   if(btn&&btn!==lastBtn){lastBtn=btn;setTimeout(ensureNextVisible,80)}
 },60);
}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});

try{sourceDecks.push(['Case mobile layout v37','Case-player screens have extra safe-area scrolling beneath the fixed navigation, slightly more compact mobile text, and automatically bring the Next button above the navigation after feedback appears.']);renderSources()}catch(e){}
})();