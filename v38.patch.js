(function(){
'use strict';
function openRequestedModule(){
  try{
    const p=new URLSearchParams(location.search);const k=p.get('module');if(!k)return;
    let tries=0;const t=setInterval(()=>{tries++;if(typeof window.openModule==='function'){clearInterval(t);window.openModule(k);setTimeout(()=>{const crit=document.getElementById('criteria');if(crit&&!document.getElementById('rdx38BackRheumSim')){const b=document.createElement('button');b.id='rdx38BackRheumSim';b.type='button';b.textContent='← Back to RheumSim';b.style.cssText='width:100%;margin:0 0 12px;padding:11px 12px;border:1.5px solid var(--teal);border-radius:10px;background:#fff;color:var(--teal);font-weight:850';b.onclick=()=>location.href='rheumsim.html';const a=crit.querySelector('.module-nav-intro')||crit.firstElementChild;crit.insertBefore(b,a)}},120)}else if(tries>25)clearInterval(t)},120)
  }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openRequestedModule);else openRequestedModule();
})();