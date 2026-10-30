/* Setzt das Design vor dem ersten Rendern: ?design=nuss|klar, sonst gemerkte Wahl, sonst klar. */
(function(){
  var h=document.documentElement; h.classList.remove('ohne-js'); var erlaubt={nuss:1,klar:1}, wahl=null;
  try{ var m=location.search.match(/[?&]design=(nuss|klar)/); if(m) wahl=m[1]; }catch(e){}
  /* Nur innerhalb des Tabs merken: jede neue Sitzung startet mit „Klar“ */
  try{ localStorage.removeItem('bb-design'); }catch(e){}
  if(!wahl){ try{ var g=sessionStorage.getItem('bb-design'); if(erlaubt[g]) wahl=g; }catch(e){} }
  if(!wahl) wahl='klar';
  h.setAttribute('data-design',wahl);
  try{ sessionStorage.setItem('bb-design',wahl); }catch(e){}
  var st=null; try{ st=localStorage.getItem('bb-standort'); }catch(e){}
  if(st==='metelen'||st==='neuenkirchen') h.setAttribute('data-standort',st);
  try{ if(localStorage.getItem('bb-schrift')==='gross') h.classList.add('schrift-gross'); }catch(e){}
})();
