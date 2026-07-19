/**
 * scenes/hero.js — Hero 3D Scene
 * Abstract morphing TorusKnot + particle field, mouse-reactive
 */

import * as THREE from 'three';

export function initHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // --- Setup ---
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const W = canvas.offsetWidth || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  camera.position.set(0, 0, 14);
  renderer.setSize(W, H);

  // --- Lighting ---
  scene.add(new THREE.AmbientLight(0xFAF8ED, 0.35));
  const dir = new THREE.DirectionalLight(0xC7484C, 1.4);
  dir.position.set(4, 6, 5);
  scene.add(dir);
  const point = new THREE.PointLight(0x9E2226, 0.8, 40);
  point.position.set(-5, -4, 3);
  scene.add(point);

  // --- Central TorusKnot ---
  const geo = new THREE.TorusKnotGeometry(2.4, 0.5, 200, 28, 3, 5);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x9E2226,
    metalness: 0.82,
    roughness: 0.12,
    emissive: 0x1A0A0A,
    emissiveIntensity: 0.15,
  });
  const torusKnot = new THREE.Mesh(geo, mat);
  scene.add(torusKnot);

  // --- Wireframe overlay ---
  const wGeo = new THREE.TorusKnotGeometry(2.42, 0.51, 120, 18, 3, 5);
  const wMat = new THREE.MeshBasicMaterial({ color: 0xC7484C, wireframe: true, transparent: true, opacity: 0.07 });
  scene.add(new THREE.Mesh(wGeo, wMat));

  // --- Outer ring ---
  const ringGeo = new THREE.TorusGeometry(5.5, 0.012, 6, 200);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.2 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 4;
  scene.add(ring);

  // --- Particles ---
  const count = 280;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 6 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(1 - 2 * Math.random());
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = 0.03 + Math.random() * 0.04;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xC7484C, size: 0.05, transparent: true, opacity: 0.6, sizeAttenuation: true });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // --- Mouse ---
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth)  * 2 - 1;
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

    // TorusKnot rotation
    torusKnot.rotation.x = t * 0.18 + my * 0.12;
    torusKnot.rotation.y = t * 0.28 + mx * 0.18;
    torusKnot.rotation.z = t * 0.09;
    torusKnot.scale.setScalar(1 + Math.sin(t * 0.9) * 0.04);

    // Outer ring
    ring.rotation.z = t * 0.05;
    ring.rotation.x = Math.PI / 4 + Math.sin(t * 0.3) * 0.1;

    // Particles drift
    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.025;

    // Camera subtle movement
    camera.position.x += (mx * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (my * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // Light pulse
    point.intensity = 0.8 + Math.sin(t * 1.2) * 0.3;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
