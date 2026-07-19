/**
 * scenes/skills.js — 3D Tech Universe
 * Floating skill-labeled orbs orbiting in a galaxy formation
 */

import * as THREE from 'three';

const TECH_LABELS = [
  'React', 'Next.js', 'TypeScript', 'Three.js', 'GSAP',
  'Node.js', 'Flutter', 'Figma', 'PostgreSQL', 'Docker',
  'Python', 'Tailwind', 'Prisma', 'Redis', 'Vercel',
  'Blender', 'Git', 'REST API', 'AI/ML', 'Lenis',
];

const COLORS = [0x9E2226, 0xC7484C, 0x6E1519, 0xFAF8ED, 0xEDE8D6];

export function initSkillsScene() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const W = canvas.offsetWidth || 800;
  const H = canvas.offsetHeight || 500;
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.set(0, 2, 22);
  renderer.setSize(W, H);

  // --- Galaxy particles (background) ---
  const starCount = 140;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3]     = (Math.random() - 0.5) * 50;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x9E2226, size: 0.06, transparent: true, opacity: 0.3 });
  scene.add(new THREE.Points(starGeo, starMat));

  // --- Orbit rings ---
  const orbitRadii = [4, 6.5, 9, 11.5];
  orbitRadii.forEach((r, i) => {
    const geo = new THREE.TorusGeometry(r, 0.01, 6, 120);
    const mat = new THREE.MeshBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.12 + i * 0.03 });
    const torus = new THREE.Mesh(geo, mat);
    torus.rotation.x = Math.PI / 2 + (i * 0.15);
    torus.rotation.z = i * 0.25;
    scene.add(torus);
  });

  // --- Tech orbs ---
  const orbs = [];
  TECH_LABELS.forEach((label, i) => {
    const orbitIdx = i % orbitRadii.length;
    const r = orbitRadii[orbitIdx];
    const speed = 0.08 + orbitIdx * 0.05 + (i % 3) * 0.03;
    const phase = (i / TECH_LABELS.length) * Math.PI * 2;
    const tilt  = (orbitIdx % 2 === 0 ? 1 : -1) * (0.1 + orbitIdx * 0.08);

    const geo = new THREE.SphereGeometry(0.12 + orbitIdx * 0.04, 10, 10);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS[i % COLORS.length],
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geo, mat);

    // Glow ring around each orb
    const glowGeo = new THREE.TorusGeometry(0.18 + orbitIdx * 0.04, 0.008, 4, 24);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xC7484C, transparent: true, opacity: 0.35 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    mesh.add(glow);

    scene.add(mesh);
    orbs.push({ mesh, r, speed, phase, tilt, label });
  });

  // --- Central nucleus ---
  const coreGeo = new THREE.IcosahedronGeometry(1.1, 2);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x9E2226, wireframe: true, transparent: true, opacity: 0.55 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  const innerGeo = new THREE.SphereGeometry(0.75, 12, 12);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0x6E1519, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Mesh(innerGeo, innerMat));

  // --- Mouse ---
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // --- Resize ---
  const ro = new ResizeObserver(() => {
    const nW = canvas.offsetWidth, nH = canvas.offsetHeight;
    if (nW > 0 && nH > 0) {
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    }
  });
  ro.observe(canvas);

  // --- Animate ---
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    // Core rotation
    core.rotation.y = t * 0.3;
    core.rotation.x = t * 0.2 + my * 0.15;

    // Orbs orbit
    orbs.forEach(({ mesh, r, speed, phase, tilt }) => {
      const angle = t * speed + phase;
      mesh.position.x = Math.cos(angle) * r;
      mesh.position.y = Math.sin(angle) * r * tilt;
      mesh.position.z = Math.sin(angle) * r * 0.3;
      mesh.children[0].rotation.y = t * 2; // glow ring spin
    });

    // Scene gentle rotation following mouse
    scene.rotation.y += (mx * 0.08 - scene.rotation.y) * 0.03;
    scene.rotation.x += (-my * 0.05 - scene.rotation.x) * 0.03;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
