/**
 * animations.js — Reveal + SplitType Text Animations
 * IntersectionObserver-based reveals + GSAP-powered character animations
 */

import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Intersection Observer for .reveal elements ---
export function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

  if (!window.IntersectionObserver) {
    revealEls.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // Stagger siblings of the same type
        const parent = el.parentNode;
        const siblings = Array.from(parent.children).filter((c) =>
          c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-scale')
        );
        const idx = siblings.indexOf(el);
        const delay = Math.min(idx * 90, 400);

        setTimeout(() => el.classList.add('in'), delay);
        io.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach((el) => io.observe(el));
}

// --- SplitType Title Animations ---
export function initSplitText() {
  const titles = document.querySelectorAll('.split-title');

  titles.forEach((title) => {
    // Split into words and chars
    const split = new SplitType(title, { types: 'words,chars' });

    // Set initial state
    gsap.set(split.chars, { y: '110%', opacity: 0 });

    // Animate on scroll
    ScrollTrigger.create({
      trigger: title,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(split.chars, {
          y: '0%',
          opacity: 1,
          duration: 0.75,
          stagger: 0.022,
          ease: 'power3.out',
        });
      },
    });
  });
}

// --- Hero title line animation ---
export function initHeroTitle() {
  const lines = document.querySelectorAll('.hero-title .split-line');
  if (!lines.length) return;

  gsap.set(lines, { y: '105%', opacity: 0 });
  gsap.to(lines, {
    y: '0%',
    opacity: 1,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.5,
  });
}

// --- Skills tag hover ripple ---
export function initTagRipple() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach((tag) => {
    tag.addEventListener('mouseenter', () => {
      gsap.fromTo(tag,
        { scale: 1 },
        { scale: 1.05, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }
      );
    });
  });
}

// --- Portrait ring glow pulse ---
export function initPortraitGlow() {
  const ring = document.querySelector('.portrait-ring');
  if (!ring) return;
  gsap.to(ring, {
    boxShadow: '0 0 70px rgba(158,34,38,.45), 0 0 120px rgba(158,34,38,.15)',
    duration: 2.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

// --- Hero stats count up (fallback if ScrollTrigger not used) ---
export function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let start = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = target + '+';
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start) + '+';
          }
        }, 35);
        io.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => io.observe(el));
}
