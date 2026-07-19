/**
 * cursor.js — Magnetic Custom Cursor
 * Smooth lerp movement + magnetic attraction to .magnetic elements
 */

export function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // --- State ---
  let mouse = { x: 0, y: 0 };
  let ringPos = { x: 0, y: 0 };
  let magnetTarget = null;
  let isVisible = false;

  // --- Track mouse ---
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '0.65';
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    ring.classList.add('hidden');
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    ring.classList.remove('hidden');
  });

  // --- Lerp utility ---
  const lerp = (a, b, t) => a + (b - a) * t;

  // --- Animation loop ---
  function tick() {
    // Dot: instant
    dot.style.transform = `translate(calc(${mouse.x}px - 50%), calc(${mouse.y}px - 50%))`;

    // Ring: lerp for smoothness
    ringPos.x = lerp(ringPos.x, mouse.x, 0.1);
    ringPos.y = lerp(ringPos.y, mouse.y, 0.1);
    ring.style.transform = `translate(calc(${ringPos.x}px - 50%), calc(${ringPos.y}px - 50%))`;

    requestAnimationFrame(tick);
  }
  tick();

  // --- Magnetic elements ---
  const magnetEls = document.querySelectorAll('.magnetic');

  magnetEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
      magnetTarget = el;
    });

    el.addEventListener('mousemove', (e) => {
      if (!magnetTarget) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const strength = 0.35;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
      magnetTarget = null;
      el.style.transform = '';
    });
  });

  // --- Cursor states on link/button hover ---
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (!el.classList.contains('magnetic')) ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
    });
  });

  // --- Text cursor for paragraphs ---
  document.querySelectorAll('p, blockquote').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('text'));
    el.addEventListener('mouseleave', () => ring.classList.remove('text'));
  });
}
