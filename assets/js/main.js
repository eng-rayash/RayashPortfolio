/* ---------- Portrait 3D Tilt ---------- */
(function(){
  var tilt = document.getElementById('portraitTilt');
  var wrap = document.querySelector('.hero-portrait');
  if(!tilt || !wrap) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;

  var maxTilt = 14; // degrees
  var current = {x:0, y:0};
  var target = {x:0, y:0};
  var raf = null;

  function apply(){
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;
    tilt.style.transform = 'rotateY(' + current.x.toFixed(2) + 'deg) rotateX(' + current.y.toFixed(2) + 'deg)';
    if(Math.abs(target.x - current.x) > 0.02 || Math.abs(target.y - current.y) > 0.02){
      raf = requestAnimationFrame(apply);
    } else {
      raf = null;
    }
  }

  function handleMove(clientX, clientY){
    var rect = wrap.getBoundingClientRect();
    var relX = (clientX - rect.left) / rect.width - 0.5;
    var relY = (clientY - rect.top) / rect.height - 0.5;
    target.x = relX * maxTilt * 2;
    target.y = -relY * maxTilt;
    if(!raf) raf = requestAnimationFrame(apply);
  }

  window.addEventListener('mousemove', function(e){ handleMove(e.clientX, e.clientY); });
  window.addEventListener('mouseleave', function(){ target.x = 0; target.y = 0; if(!raf) raf = requestAnimationFrame(apply); });
  window.addEventListener('deviceorientation', function(e){
    if(e.gamma == null || e.beta == null) return;
    target.x = Math.max(-maxTilt*2, Math.min(maxTilt*2, e.gamma));
    target.y = Math.max(-maxTilt, Math.min(maxTilt, (e.beta - 45) * -0.3));
    if(!raf) raf = requestAnimationFrame(apply);
  });
})();

/* ---------- Nav Scroll State & Scroll Progress Bar ---------- */
(function(){
  var nav = document.getElementById('nav');
  var progress = document.getElementById('progress');
  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop;
    if(nav) nav.classList.toggle('scrolled', y > 40);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? y / h : 0;
    if(progress) progress.style.transform = 'scaleX(' + pct + ')';
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

/* ---------- Reveal Animations on Scroll ---------- */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if(reduce){ els.forEach(function(e){e.classList.add('in');}); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, {threshold:.16, rootMargin:'0px 0px -60px 0px'});
  els.forEach(function(e){ io.observe(e); });
})();
