/**
 * scenes/footer.js — Rotating Wireframe Globe + Pulsing Contact Nodes
 */

import * as THREE from 'three';

export function initFooterScene() {
  const canvas = document.getElementById('footer-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const W = canvas.offsetWidth || 800;
  const H = canvas.offsetHeight || 600;
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
  camera.position.set(0, 0, 10);
  renderer.setSize(W, H);

  const group = new THREE.Group();

  // --- Globe layers ---
  [2.8, 2.75, 2.6].forEach((r, i) => {
    const geo = new THREE.IcosahedronGeometry(r, i === 2 ? 1 : 2);
    const mat = new THREE.MeshBasicMaterial({
      color: i === 1 ? 0x9E2226 : 0xFAF8ED,
      wireframe: true,
      transparent: true,
      opacity: i === 1 ? 0.22 : i === 0 ? 0.09 : 0.06,
    });
    group.add(new THREE.Mesh(geo, mat));
  });

  // --- Latitude / Longitude rings ---
  [0, Math.PI / 4, Math.PI / 2, -Math.PI / 4].forEach((tilt) => {
    const rGeo = new THREE.TorusGeometry(2.82, 0.008, 4, 100);
    const rMat = new THREE.MeshBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.14 });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = tilt;
    group.add(ring);
  });

  // --- Contact node markers ---
  const markers = [];
  const contactPts = 7;
  for (let i = 0; i < contactPts; i++) {
    const phi   = Math.acos(1 - 2 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const r = 2.85;

    const mGeo = new THREE.SphereGeometry(0.06, 10, 10);
    const mMat = new THREE.MeshBasicMaterial({ color: 0xC7484C });
    const m = new THREE.Mesh(mGeo, mMat);
    m.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    m.userData.phase = Math.random() * Math.PI * 2;
    markers.push(m);
    group.add(m);

    // Ping ring
    const pgGeo = new THREE.TorusGeometry(0.1, 0.008, 4, 20);
    const pgMat = new THREE.MeshBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.55 });
    const pg = new THREE.Mesh(pgGeo, pgMat);
    pg.lookAt(0, 0, 0);
    m.add(pg);
  }

  group.rotation.x = 0.3;
  scene.add(group);

  // --- Mouse ---
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth)  * 2 - 1;
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
  function animate() {
    const t = clock.getElapsedTime();

    group.rotation.y = t * 0.08;
    group.rotation.x = 0.3 + my * 0.08;

    markers.forEach((m) => {
      const s = 1 + Math.sin(t * 1.8 + m.userData.phase) * 0.65;
      m.scale.setScalar(s);
      m.children[0].rotation.z = t * 2;
    });

    camera.position.x += (mx * 1.2 - camera.position.x) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
