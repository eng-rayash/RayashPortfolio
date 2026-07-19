/**
 * main.js — Entry Point
 * Rayash Faisal Portfolio — Vite + Three.js + GSAP + Lenis
 */

// ---- Styles ----
import './style.css';

// ---- Modules ----
import { initCursor }    from './cursor.js';
import { initScroll }    from './scroll.js';
import { initReveal, initSplitText, initHeroTitle, initTagRipple, initPortraitGlow, initCounters } from './animations.js';
import { initEasterEgg } from './easter-egg.js';

// ---- 3D Scenes (lazy-loaded via IntersectionObserver) ----
import { initHeroScene }     from './scenes/hero.js';
import { initSkillsScene }   from './scenes/skills.js';
import { initProjectsScene } from './scenes/projects.js';
import { initAIScene }       from './scenes/ai-section.js';
import { initFooterScene }   from './scenes/footer.js';

// ---- About / EduVision scenes (inline, lighter) ----
import * as THREE from 'three';

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader   = document.getElementById('loader');
  const pctEl    = document.getElementById('loader-pct');
  const bar      = document.getElementById('loader-bar');
  if (!loader) return;

  let pct = 0;
  const inc = setInterval(() => {
    pct = Math.min(pct + Math.random() * 20, 92);
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    if (bar)   bar.style.width   = pct + '%';
  }, 70);

  window.addEventListener('load', () => {
    clearInterval(inc);
    if (pctEl) pctEl.textContent = '100%';
    if (bar)   bar.style.width   = '100%';
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
}

/* ============================================================
   PORTRAIT PLACEHOLDER
   ============================================================ */
function generatePortrait() {
  const img = document.getElementById('portrait-img');
  if (!img) return;

  const c   = document.createElement('canvas');
  c.width   = 420;
  c.height  = 420;
  const ctx = c.getContext('2d');

  // Background
  const grad = ctx.createRadialGradient(210, 190, 0, 210, 210, 210);
  grad.addColorStop(0, '#2A1D18');
  grad.addColorStop(1, '#1A120F');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 420, 420);

  // Subtle grid
  ctx.strokeStyle = 'rgba(250,248,237,0.035)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 420; i += 22) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 420); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(420, i); ctx.stroke();
  }

  // Glow ring
  const glowGrad = ctx.createRadialGradient(210, 210, 140, 210, 210, 200);
  glowGrad.addColorStop(0, 'rgba(158,34,38,0)');
  glowGrad.addColorStop(1, 'rgba(158,34,38,0.18)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath(); ctx.arc(210, 210, 200, 0, Math.PI * 2); ctx.fill();

  // Head silhouette
  ctx.fillStyle = '#9E2226';
  ctx.beginPath(); ctx.arc(210, 175, 68, 0, Math.PI * 2); ctx.fill();

  // Body silhouette
  ctx.fillStyle = '#2A1D18';
  ctx.beginPath(); ctx.ellipse(210, 330, 100, 70, 0, 0, Math.PI * 2); ctx.fill();

  // Face highlight
  ctx.fillStyle = 'rgba(199,72,76,0.45)';
  ctx.beginPath(); ctx.arc(210, 173, 65, 0, Math.PI * 2); ctx.fill();

  // Initials
  ctx.font = 'bold 88px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FAF8ED';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RF', 210, 175);

  // Corner marks
  ctx.strokeStyle = 'rgba(158,34,38,0.35)';
  ctx.lineWidth = 1.5;
  [[5,5,20,5,5,20],[415,5,395,5,415,20],[5,415,20,415,5,395],[415,415,395,415,415,395]].forEach(([x1,y1,x2,y2,x3,y3]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.moveTo(x1,y1); ctx.lineTo(x3,y3); ctx.stroke();
  });

  img.src = c.toDataURL('image/jpeg', 0.92);
}

/* ============================================================
   ABOUT SCENE — DNA Helix
   ============================================================ */
function initAboutScene() {
  const canvas = document.getElementById('about-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const W = canvas.offsetWidth || 330;
  const H = canvas.offsetHeight || 330;
  renderer.setSize(W, H);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 5);

  const group = new THREE.Group();
  const steps = 34;
  const dotGeo = new THREE.SphereGeometry(0.055, 10, 10);

  for (let i = 0; i < steps; i++) {
    const y = (i - steps / 2) * 0.22;
    const angle = i * 0.52;

    const mA = new THREE.MeshBasicMaterial({ color: 0x9E2226 });
    const mB = new THREE.MeshBasicMaterial({ color: 0xC7484C });

    const dA = new THREE.Mesh(dotGeo, mA);
    dA.position.set(Math.cos(angle) * 0.62, y, Math.sin(angle) * 0.62);

    const dB = new THREE.Mesh(dotGeo, mB);
    dB.position.set(Math.cos(angle + Math.PI) * 0.62, y, Math.sin(angle + Math.PI) * 0.62);

    group.add(dA, dB);

    if (i > 0) {
      const rGeo = new THREE.BufferGeometry().setFromPoints([dA.position.clone(), dB.position.clone()]);
      const rMat = new THREE.LineBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.16 });
      group.add(new THREE.Line(rGeo, rMat));
    }
  }
  scene.add(group);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  const ro = new ResizeObserver(() => {
    const nW = canvas.offsetWidth, nH = canvas.offsetHeight;
    if (nW > 0 && nH > 0) {
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    }
  });
  ro.observe(canvas);

  const clock = new THREE.Clock();
  (function loop() {
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.42;
    group.rotation.x = my * 0.2;
    camera.position.x = mx * 0.5;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
}

/* ============================================================
   EDUVISION SCENE — Flowing sine wave
   ============================================================ */
function initEduScene() {
  const canvas = document.getElementById('eduvision-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const W = canvas.offsetWidth || 40;
  const H = canvas.offsetHeight || 260;
  renderer.setSize(W, H);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.z = 6;

  const ptCount = 80;
  const pts  = [];
  const pts2 = [];
  for (let i = 0; i < ptCount; i++) {
    const x = (i / (ptCount - 1)) * 4 - 2;
    pts.push(new THREE.Vector3(x, 0, 0));
    pts2.push(new THREE.Vector3(x, 0, 0));
  }

  const geo  = new THREE.BufferGeometry().setFromPoints(pts);
  const geo2 = new THREE.BufferGeometry().setFromPoints(pts2);
  const line  = new THREE.Line(geo,  new THREE.LineBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.7 }));
  const line2 = new THREE.Line(geo2, new THREE.LineBasicMaterial({ color: 0xC7484C, transparent: true, opacity: 0.4 }));
  scene.add(line, line2);

  const ro = new ResizeObserver(() => {
    const nW = canvas.offsetWidth, nH = canvas.offsetHeight;
    if (nW > 0 && nH > 0) {
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    }
  });
  ro.observe(canvas);

  const clock = new THREE.Clock();
  (function loop() {
    const t = clock.getElapsedTime();
    pts.forEach((p, i)  => { p.y = Math.sin(i * 0.28 + t * 1.4) * 0.85; });
    pts2.forEach((p, i) => { p.y = Math.sin(i * 0.28 + t * 1.1 + 1.3) * 0.55; });
    geo.setFromPoints(pts);
    geo2.setFromPoints(pts2);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
}

/* ============================================================
   SERVICES SCENE — Orbiting rings
   ============================================================ */
function initServicesScene() {
  const canvas = document.getElementById('services-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(360, 360);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 10;

  const orbits = [2.0, 3.2, 4.4];
  const balls  = [];
  orbits.forEach((r, ri) => {
    const rGeo = new THREE.TorusGeometry(r, 0.012, 6, 100);
    scene.add(new THREE.Mesh(rGeo, new THREE.MeshBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.14 })));
    const n = ri * 2 + 2;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const geo = new THREE.SphereGeometry(0.09 + ri * 0.035, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: [0x9E2226, 0xC7484C, 0x6E1519][ri] });
      const m = new THREE.Mesh(geo, mat);
      m.userData = { r, angle, speed: 0.18 + ri * 0.07, dir: ri % 2 === 0 ? 1 : -1 };
      balls.push(m);
      scene.add(m);
    }
  });

  const clock = new THREE.Clock();
  (function loop() {
    const t = clock.getElapsedTime();
    balls.forEach((b) => {
      const { r, angle, speed, dir } = b.userData;
      const a = angle + t * speed * dir;
      b.position.x = Math.cos(a) * r;
      b.position.y = Math.sin(a) * r;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
}

/* ============================================================
   LAZY SCENE OBSERVER — Load only when in viewport
   ============================================================ */
function lazyInitScene(canvasId, initFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        initFn();
      }
    },
    { threshold: 0.01 }
  );
  io.observe(canvas);
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle  = document.getElementById('nav-toggle');
  const menu    = document.getElementById('mobile-menu');
  const close   = document.getElementById('mobile-close');
  const links   = document.querySelectorAll('.mobile-nav-link');

  function openMenu()  { menu.classList.add('open'); menu.setAttribute('aria-hidden','false'); toggle.setAttribute('aria-expanded','true'); toggle.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); toggle.setAttribute('aria-expanded','false'); toggle.classList.remove('open'); document.body.style.overflow = ''; }

  toggle?.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
  close?.addEventListener('click', closeMenu);
  links.forEach((l) => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

/* ============================================================
   SMOOTH ANCHOR SCROLL (for internal links)
   ============================================================ */
function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   BOOT — DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Core
  initLoader();
  generatePortrait();
  initCursor();
  initMobileMenu();
  initAnchorScroll();

  // Animations
  initReveal();
  initSplitText();
  initHeroTitle();
  initTagRipple();
  initPortraitGlow();
  initCounters();

  // Smooth scroll + GSAP ScrollTrigger
  initScroll();

  // Easter Egg Terminal
  initEasterEgg();

  // 3D Scenes (lazy)
  lazyInitScene('hero-canvas',     initHeroScene);
  lazyInitScene('about-canvas',    initAboutScene);
  lazyInitScene('skills-canvas',   initSkillsScene);
  lazyInitScene('services-canvas', initServicesScene);
  lazyInitScene('projects-canvas', initProjectsScene);
  lazyInitScene('ai-canvas',       initAIScene);
  lazyInitScene('eduvision-canvas',initEduScene);
  lazyInitScene('footer-canvas',   initFooterScene);
});
