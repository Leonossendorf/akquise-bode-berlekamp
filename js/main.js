/* Entwurf Bode | Berlekamp: Design-Schalter, Standort, Status, Schrift, Menü, Formulare (Demo, nichts wird versendet). */
(function(){
  var h=document.documentElement;
  function speichern(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

  /* Design-Schalter */
  function designAnwenden(d){
    h.setAttribute('data-design',d); speichern('bb-design',d);
    document.querySelectorAll('[data-design-wahl]').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-design-wahl')===d ? 'true':'false'); });
    document.querySelectorAll('[data-only]').forEach(function(el){ var zeig=el.getAttribute('data-only')===d; el.hidden=!zeig; el.setAttribute('aria-hidden', zeig?'false':'true'); });
    try{ var u=new URL(location.href); u.searchParams.set('design',d); history.replaceState(null,'',u); }catch(e){}
  }
  document.querySelectorAll('[data-design-wahl]').forEach(function(b){ b.addEventListener('click',function(){ designAnwenden(b.getAttribute('data-design-wahl')); }); });
  designAnwenden(h.getAttribute('data-design')||'klar');

  /* Standort */
  var ORTE={
    neuenkirchen:{name:'Neuenkirchen',tel:'05973 94 90-0',telHref:'tel:+4959739490',mail:'info@stb-neuenkirchen.de',wort:'img/wortmarke-neuenkirchen.png',wortAlt:'Bode | Berlekamp Steuerberater Partnerschaft mbB, Neuenkirchen',route:'https://www.google.com/maps/dir/?api=1&destination=Alphons-Hecking-Platz+11,+48485+Neuenkirchen'},
    metelen:{name:'Metelen',tel:'02556 98 97-0',telHref:'tel:+4925569897',mail:'info@stb-metelen.de',wort:'img/wortmarke-metelen.png',wortAlt:'Bode | Berlekamp | Schaper, Steuerberater Schaper & Partner mbB, Metelen',route:'https://www.google.com/maps/dir/?api=1&destination=Eper+Stra%C3%9Fe+6,+48629+Metelen'}
  };
  function standortAnwenden(s){
    var o=ORTE[s]; if(!o) return; h.setAttribute('data-standort',s); speichern('bb-standort',s);
    document.querySelectorAll('[data-standort-wahl]').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-standort-wahl')===s?'true':'false'); });
    document.querySelectorAll('[data-tel]').forEach(function(a){ a.href=o.telHref; a.textContent=o.tel; });
    document.querySelectorAll('[data-mail]').forEach(function(a){ a.href='mailto:'+o.mail; a.textContent=o.mail; });
    document.querySelectorAll('[data-wortmarke]').forEach(function(i){ var p=i.getAttribute('data-pfad')||''; i.src=p+o.wort; i.alt=o.wortAlt; });
    document.querySelectorAll('[data-route]').forEach(function(a){ a.href=o.route; });
    document.querySelectorAll('[data-ortname]').forEach(function(e){ e.textContent=o.name; });
  }
  document.querySelectorAll('[data-standort-wahl]').forEach(function(b){ b.addEventListener('click',function(){ standortAnwenden(b.getAttribute('data-standort-wahl')); }); });
  standortAnwenden(h.getAttribute('data-standort')||'neuenkirchen');

  /* Schrift größer */
  var sk=document.querySelector('.schrift');
  if(sk){ sk.setAttribute('aria-pressed', h.classList.contains('schrift-gross')?'true':'false');
    sk.addEventListener('click',function(){ var an=h.classList.toggle('schrift-gross'); sk.setAttribute('aria-pressed',an?'true':'false'); speichern('bb-schrift',an?'gross':'normal'); }); }

  /* Menü am Handy */
  var mk=document.querySelector('.menu-knopf'), nav=document.querySelector('.nav');
  if(mk&&nav){ mk.addEventListener('click',function(){ var offen=nav.classList.toggle('offen'); mk.setAttribute('aria-expanded',offen?'true':'false'); mk.textContent=offen?'Schließen':'Menü'; }); }

  /* Status „heute geöffnet“ (Zeitzone Europe/Berlin). Zeiten: Website stb-neuenkirchen.de, Stand 28.10.2026 */
  var ZEITEN={
    neuenkirchen:{1:[[8,0,12,0],[14,0,17,0]],2:[[8,0,12,0],[14,0,17,0]],3:[[8,0,12,0],[14,0,17,0]],4:[[8,0,12,0],[14,0,17,0]],5:[[8,0,13,0]]},
    metelen:{1:[[9,0,13,0]],2:[[9,0,13,0]],3:[[9,0,13,0]],4:[[9,0,13,0]],5:[[9,0,13,0]]}
  };
  var TAGE=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
  function jetztBerlin(){
    try{ var f=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
      var o={}; f.forEach(function(p){o[p.type]=p.value;}); var wd={'So.':0,'Mo.':1,'Di.':2,'Mi.':3,'Do.':4,'Fr.':5,'Sa.':6}[o.weekday]; if(wd===undefined) wd=new Date().getDay();
      return {tag:wd,min:parseInt(o.hour,10)*60+parseInt(o.minute,10)};
    }catch(e){ var d=new Date(); return {tag:d.getDay(),min:d.getHours()*60+d.getMinutes()}; }
  }
  function uhr(m){ return Math.floor(m/60)+':'+('0'+(m%60)).slice(-2); }
  function status(ort){
    var z=ZEITEN[ort], n=jetztBerlin(), heute=z[n.tag]||[];
    for(var i=0;i<heute.length;i++){ var a=heute[i][0]*60+heute[i][1], b=heute[i][2]*60+heute[i][3];
      if(n.min>=a&&n.min<b) return {offen:true,text:'geöffnet bis '+uhr(b)+' Uhr'};
      if(n.min<a) return {offen:false,text:'geschlossen, öffnet heute um '+uhr(a)+' Uhr'}; }
    for(var d=1;d<=7;d++){ var t=(n.tag+d)%7, s=z[t]; if(s&&s.length){ var a2=s[0][0]*60+s[0][1]; return {offen:false,text:'geschlossen, öffnet '+(d===1?'morgen':TAGE[t])+' um '+uhr(a2)+' Uhr'}; } }
    return {offen:false,text:'geschlossen'};
  }
  document.querySelectorAll('[data-status]').forEach(function(el){ var s=status(el.getAttribute('data-status')); el.classList.add(s.offen?'offen':'zu'); el.querySelector('.status-text').textContent=s.text; });

  /* Team-Filter */
  var tf=document.querySelector('.team-filter');
  if(tf){ tf.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; var w=b.getAttribute('data-filter');
    tf.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x===b?'true':'false'); });
    document.querySelectorAll('[data-orte]').forEach(function(p){ var ok=w==='alle'||p.getAttribute('data-orte').indexOf(w)>=0; p.hidden=!ok; }); }); }

  /* Formulare mit Weichen: Thema aus ?thema= oder #thema, Felder ein- und ausblenden, Demo-Bestätigung */
  document.querySelectorAll('form[data-demo]').forEach(function(form){
    var themaRadios=form.querySelectorAll('input[name="thema"]');
    function zeigen(){ var w=form.querySelector('input[name="thema"]:checked'); var t=w?w.value:'';
      form.querySelectorAll('[data-zeig]').forEach(function(el){ var liste=el.getAttribute('data-zeig').split(' '); var an=!!t&&liste.indexOf(t)>=0; el.classList.toggle('aktiv',an); el.querySelectorAll('input,textarea,select').forEach(function(i){ i.disabled=!an; }); }); }
    themaRadios.forEach(function(r){ r.addEventListener('change',zeigen); });
    var vor=null; try{ var m=location.search.match(/[?&]thema=([a-z]+)/); if(m) vor=m[1]; if(!vor&&location.hash){ var hm=location.hash.match(/thema=([a-z]+)/); if(hm) vor=hm[1]; } }catch(e){}
    if(vor){ var r=form.querySelector('input[name="thema"][value="'+vor+'"]'); if(r) r.checked=true; }
    zeigen();
    form.querySelectorAll('input[type=range]').forEach(function(rg){ var out=form.querySelector('output[for="'+rg.id+'"]'); if(out){ out.value=rg.value; rg.addEventListener('input',function(){ out.value=rg.value; }); } });
    form.addEventListener('submit',function(e){ e.preventDefault();
      var tel=form.querySelector('input[name="telefon"]'), mail=form.querySelector('input[name="email"]'), fehler=form.querySelector('.fehler');
      var ok=(tel&&tel.value.trim())||(mail&&mail.value.trim());
      if(!ok){ fehler.textContent='Bitte geben Sie eine Telefonnummer oder eine E-Mail-Adresse an, damit die Kanzlei antworten kann.'; fehler.hidden=false; (tel||mail).focus(); return; }
      fehler.hidden=true;
      var w=form.querySelector('input[name="thema"]:checked'); var t=w?w.value:'';
      var ziel = (t==='bewerbung'||form.hasAttribute('data-bewerbung')) ? 'frank.bode@stb-neuenkirchen.de (Frank Bode)' : 'info@stb-neuenkirchen.de';
      var box=form.parentNode.querySelector('.bestaetigung'); if(!box){ box=document.createElement('div'); box.className='bestaetigung'; box.setAttribute('role','status'); box.tabIndex=-1; form.parentNode.insertBefore(box,form.nextSibling); }
      box.innerHTML='<h3>Danke. Das ist ein Entwurf, es wurde nichts versendet.</h3><p>In der fertigen Seite ginge Ihre Nachricht jetzt an <strong>'+ziel+'</strong>. Die Kanzlei meldet sich zu den Öffnungszeiten, bei Rückruf-Wunsch im gewählten Zeitfenster.</p><p class="klein leise">Vertrauliche Unterlagen gehen nie über dieses Formular, sondern über die App oder die Belegzentrale.</p>';
      form.hidden=true; box.focus(); });
  });

  /* Kacheln, die ein Thema im Formular vorwählen */
  document.querySelectorAll('[data-thema-link]').forEach(function(a){ a.addEventListener('click',function(e){ var ziel=document.querySelector(a.getAttribute('href').split('?')[0].split('#')[0]==='' ? '#kontakt' : null); var form=document.querySelector('form[data-demo]');
    if(form && a.getAttribute('href').indexOf('#kontakt')>=0){ e.preventDefault(); var r=form.querySelector('input[name="thema"][value="'+a.getAttribute('data-thema-link')+'"]'); if(r){ r.checked=true; r.dispatchEvent(new Event('change')); } form.hidden=false; var b=form.parentNode.querySelector('.bestaetigung'); if(b) b.remove(); document.getElementById('kontakt').scrollIntoView({behavior:'smooth'}); setTimeout(function(){ (r||form).focus(); },400); } }); });
})();
