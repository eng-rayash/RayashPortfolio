/**
 * scenes/ai-section.js — Neural Network Animation
 * Animated nodes connected by synaptic edges with signal propagation
 */

import * as THREE from 'three';

export function initAIScene() {
  const canvas = document.getElementById('ai-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const W = canvas.offsetWidth || 800;
  const H = canvas.offsetHeight || 500;
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.z = 18;
  renderer.setSize(W, H);

  // --- Neural network layers ---
  const layers = [3, 5, 5, 4, 2]; // nodes per layer
  const layerSpacing = 4.5;
  const nodeSpacing  = 2.2;
  const startX = -(layers.length - 1) * layerSpacing / 2;

  const nodes = [];
  const signals = []; // { mesh, start, end, t, speed }

  // --- Create nodes ---
  layers.forEach((count, li) => {
    const layer = [];
    const startY = -(count - 1) * nodeSpacing / 2;
    for (let ni = 0; ni < count; ni++) {
      const x = startX + li * layerSpacing;
      const y = startY + ni * nodeSpacing;

      const geo = new THREE.SphereGeometry(0.18 + li * 0.02, 12, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: li === 0 ? 0x6E1519 : li === layers.length - 1 ? 0xC7484C : 0x9E2226,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, (Math.random() - 0.5) * 1.2);
      mesh.userData = { phase: Math.random() * Math.PI * 2, baseOpacity: 0.9 };
      scene.add(mesh);
      layer.push(mesh);
    }
    nodes.push(layer);
  });

  // --- Create edges between adjacent layers ---
  const edges = [];
  for (let li = 0; li < nodes.length - 1; li++) {
    nodes[li].forEach((a) => {
      nodes[li + 1].forEach((b) => {
        const pts = [a.position.clone(), b.position.clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.12 });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        edges.push({ line, a, b, mat });
      });
    });
  }

  // --- Signal propagation dots ---
  function createSignal(a, b) {
    const geo = new THREE.SphereGeometry(0.065, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xC7484C, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return { mesh, start: a.position.clone(), end: b.position.clone(), t: 0, speed: 0.4 + Math.random() * 0.5 };
  }

  // Spawn initial signals
  function spawnSignals() {
    edges.forEach((edge) => {
      if (Math.random() < 0.25) {
        signals.push(createSignal(edge.a, edge.b));
      }
    });
  }
  spawnSignals();
  setInterval(spawnSignals, 1200);

  // --- Mouse ---
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
  function animate() {
    const t = clock.getElapsedTime();

    // Node pulse
    nodes.flat().forEach((n) => {
      const s = 1 + Math.sin(t * 1.2 + n.userData.phase) * 0.18;
      n.scale.setScalar(s);
      n.material.opacity = 0.7 + Math.sin(t * 1.6 + n.userData.phase) * 0.25;
    });

    // Edge flicker
    edges.forEach(({ mat }, i) => {
      mat.opacity = 0.08 + Math.sin(t * 0.8 + i * 0.3) * 0.06;
    });

    // Move signals
    for (let i = signals.length - 1; i >= 0; i--) {
      const sig = signals[i];
      sig.t += sig.speed * clock.getDelta() * 0.6;
      if (sig.t >= 1) {
        scene.remove(sig.mesh);
        signals.splice(i, 1);
        continue;
      }
      sig.mesh.position.lerpVectors(sig.start, sig.end, sig.t);
    }

    // Scene sway
    scene.rotation.y += (mx * 0.06 - scene.rotation.y) * 0.025;
    scene.rotation.x += (-my * 0.04 - scene.rotation.x) * 0.025;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
