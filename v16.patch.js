(function(){
  function tidyHeader(){
    const h1=[...document.querySelectorAll('h1')].find(x=>/RheumDx Work-up Assistant/i.test(x.textContent||''));
    if(!h1) return;
    h1.textContent='RheumDx Diagnostic Assistant';
    const wrap=h1.parentElement;
    if(!wrap) return;

    const candidates=[...wrap.children].filter(el=>el!==h1 && !/RHEUMATOLOGY CLINICAL DECISION SUPPORT/i.test(el.textContent||''));
    const descriptive=candidates.filter(el=>{
      const t=(el.textContent||'').trim();
      return t.length>80 || /International criteria build|diagnostic\/work-up reasoning|Classification remains separate|Clinician use only/i.test(t);
    });
    if(!descriptive.length) return;

    const description=descriptive.map(el=>(el.textContent||'').trim()).filter(Boolean).join(' ');
    descriptive.forEach(el=>el.remove());

    const details=document.createElement('details');
    details.className='tool-description-details';
    const summary=document.createElement('summary');
    summary.textContent='About this diagnostic support tool';
    const body=document.createElement('div');
    body.className='tool-description-body';
    body.textContent=description;
    details.append(summary,body);
    h1.insertAdjacentElement('afterend',details);
  }

  const style=document.createElement('style');
  style.textContent=`
    .tool-description-details{margin-top:8px;color:#dbeaf0;font-size:14px;line-height:1.45}
    .tool-description-details summary{cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-weight:700;color:#dff4f3;list-style:none;padding:6px 0;user-select:none}
    .tool-description-details summary::-webkit-details-marker{display:none}
    .tool-description-details summary::after{content:'▾';font-size:12px;transition:transform .18s ease}
    .tool-description-details[open] summary::after{transform:rotate(180deg)}
    .tool-description-body{margin-top:6px;padding:10px 12px;border:1px solid rgba(255,255,255,.18);border-radius:10px;background:rgba(255,255,255,.06);color:#e8f0f3}
    @media(max-width:620px){.tool-description-details{font-size:13px}.tool-description-body{padding:9px 10px}}
  `;
  document.head.appendChild(style);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',tidyHeader,{once:true});
  else tidyHeader();
})();