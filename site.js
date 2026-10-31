(function(){
  var f=document.getElementById('quote-form'),st=document.getElementById('quote-status');
  if(!f) return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=null;
    f.querySelectorAll('[required]').forEach(function(el){
      var ok=el.value.trim()!=='' && (el.type!=='email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
      el.classList.toggle('invalid',!ok); if(!ok && !bad) bad=el;
    });
    if(bad){st.className='status err';st.textContent='Please fill in the highlighted fields.';bad.focus();return;}
    var btn=f.querySelector('.submit');btn.disabled=true;btn.textContent='Sending...';st.className='status';st.textContent='';
    fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f)))})
      .then(function(r){return r.json().then(function(j){return {ok:r.ok&&j.success!==false,j:j};});})
      .then(function(res){
        if(res.ok){if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:'quote-form-sent',title:'Quote form sent',event:true});f.reset();st.className='status ok';st.textContent="Thanks! Your request is in. We'll reply by email within two business days.";}
        else throw new Error(res.j&&res.j.message);
      })
      .catch(function(){st.className='status err';st.innerHTML='Something went wrong. Please email us at <a href="mailto:enquiries@strangelyserious.com">enquiries@strangelyserious.com</a>.';})
      .finally(function(){btn.disabled=false;btn.textContent='Send request';});
  });
  f.addEventListener('input',function(e){e.target.classList.remove('invalid');});
  var type=f.querySelector('[name=project_type]'),note=document.getElementById('audit-note');
  function syncNote(){note.hidden=type.value!=='AI search visibility audit';}
  type.addEventListener('change',syncNote);
  f.addEventListener('reset',function(){setTimeout(syncNote,0);});
})();
