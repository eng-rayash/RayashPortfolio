/**
 * scroll.js — Lenis Smooth Scroll + GSAP ScrollTrigger
 * Silky smooth scrolling with performance-optimized scroll-based animations
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initScroll() {
  // --- Lenis Smooth Scroll ---
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Connect Lenis to GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('progress');
  if (progressBar) {
    lenis.on('scroll', ({ progress }) => {
      gsap.set(progressBar, { scaleX: progress });
    });
  }

  // --- Nav Scrolled State ---
  const nav = document.getElementById('nav');
  if (nav) {
    lenis.on('scroll', ({ scroll }) => {
      if (scroll > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  // --- ScrollTrigger Refresh on resize ---
  window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });

  // --- Parallax for hero grid ---
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    gsap.to(heroGrid, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // --- Hero content subtle parallax ---
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: 60,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'center top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  // --- Section title parallax pinning ---
  document.querySelectorAll('.section-title:not(.split-title)').forEach((title) => {
    gsap.fromTo(title,
      { y: 18 },
      {
        y: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: title,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  });

  // --- Service rows stagger on scroll ---
  const serviceRows = document.querySelectorAll('.service-row');
  if (serviceRows.length) {
    gsap.fromTo(serviceRows,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-list',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // --- Project cards stagger ---
  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    gsap.fromTo(projectCards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.project-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // --- AI cards stagger ---
  const aiCards = document.querySelectorAll('.ai-card');
  if (aiCards.length) {
    gsap.fromTo(aiCards,
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.ai-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // --- About meta items count-up trigger ---
  const counterEls = document.querySelectorAll('.counter');
  counterEls.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.6,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate() { el.textContent = Math.round(this.targets()[0].textContent) + '+'; },
          }
        );
      },
    });
  });

  return lenis;
}

export function getLenis() {
  return lenis;
}

// Helper: smooth scroll to element
export function scrollTo(target, options = {}) {
  if (lenis) lenis.scrollTo(target, { duration: 1.2, ...options });
}
