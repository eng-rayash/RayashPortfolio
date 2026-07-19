/**
 * scenes/projects.js — Projects Dark Constellation
 * Drifting star field with slow icosahedron + maroon accent
 */

import * as THREE from 'three';

export function initProjectsScene() {
  const canvas = document.getElementById('projects-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const W = canvas.offsetWidth || 800;
  const H = canvas.offsetHeight || 600;
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.z = 16;
  renderer.setSize(W, H);

  // --- Stars ---
  const count = 140;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xFAF8ED, size: 0.065, transparent: true, opacity: 0.2 });
  scene.add(new THREE.Points(geo, mat));

  // --- Maroon accent dots ---
  const aCount = 60;
  const aPos = new Float32Array(aCount * 3);
  for (let i = 0; i < aCount; i++) {
    aPos[i * 3]     = (Math.random() - 0.5) * 28;
    aPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    aPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const aGeo = new THREE.BufferGeometry();
  aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
  const aMat = new THREE.PointsMaterial({ color: 0x9E2226, size: 0.1, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(aGeo, aMat));

  // --- Central wireframe icosahedron ---
  const icoGeo = new THREE.IcosahedronGeometry(3.5, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x9E2226, wireframe: true, transparent: true, opacity: 0.1 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // --- Three project node spheres ---
  const nodePositions = [[-5, 2, 0], [0, -3, 1], [5, 1.5, -1]];
  const nodes = nodePositions.map((p) => {
    const nGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const nMat = new THREE.MeshBasicMaterial({ color: 0xC7484C, transparent: true, opacity: 0.85 });
    const mesh = new THREE.Mesh(nGeo, nMat);
    mesh.position.set(...p);
    scene.add(mesh);

    // Ring around node
    const rGeo = new THREE.TorusGeometry(0.28, 0.01, 6, 32);
    const rMat = new THREE.MeshBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.45 });
    const rMesh = new THREE.Mesh(rGeo, rMat);
    mesh.add(rMesh);
    return mesh;
  });

  // --- Connection lines between nodes ---
  nodePositions.forEach((a, i) => {
    const b = nodePositions[(i + 1) % nodePositions.length];
    const linePts = [new THREE.Vector3(...a), new THREE.Vector3(...b)];
    const lGeo = new THREE.BufferGeometry().setFromPoints(linePts);
    const lMat = new THREE.LineBasicMaterial({ color: 0x9E2226, transparent: true, opacity: 0.18 });
    scene.add(new THREE.Line(lGeo, lMat));
  });

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

    ico.rotation.y = t * 0.07;
    ico.rotation.x = t * 0.04 + my * 0.08;

    nodes.forEach((n, i) => {
      n.scale.setScalar(1 + Math.sin(t * 1.4 + i * 1.2) * 0.2);
      n.children[0].rotation.y = t * 1.5;
    });

    camera.position.x += (mx * 1.8 - camera.position.x) * 0.03;
    camera.position.y += (my * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
