/* ---------- HERO 3D SCENE: wireframe icosahedron core + orbiting nodes + particles ---------- */
(function(){
  var canvas = document.getElementById('hero-canvas');
  if(!canvas || !window.THREE) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth/canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);
  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var maroon = 0x9E2226;
  var maroonLight = 0xC7484C;
  var cream = 0xFAF8ED;

  function size(){
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if(!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }

  // core wireframe icosahedron
  var coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
  var coreMat = new THREE.MeshBasicMaterial({color:maroon, wireframe:true, transparent:true, opacity:.85});
  var core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // inner solid faint core for depth
  var innerMat = new THREE.MeshBasicMaterial({color:0x2A1D18, transparent:true, opacity:.5});
  var inner = new THREE.Mesh(new THREE.IcosahedronGeometry(2.06, 1), innerMat);
  scene.add(inner);

  // orbit rings (torus) representing multi-discipline
  var ringGroup = new THREE.Group();
  [3.1, 3.6, 4.1].forEach(function(r, i){
    var ringGeo = new THREE.TorusGeometry(r, 0.006, 8, 90);
    var ringMat = new THREE.MeshBasicMaterial({color: i===1? maroonLight : cream, transparent:true, opacity: i===1?.5:.16});
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI/2 + i*0.35;
    ring.rotation.y = i * 0.6;
    ring.userData.speed = 0.0015 + i*0.0009;
    ring.userData.axis = i % 2 === 0 ? 'y' : 'x';
    ringGroup.add(ring);
  });
  scene.add(ringGroup);

  // orbiting nodes on middle ring (skills: dev / design / business)
  var nodes = [];
  var nodeGeo = new THREE.SphereGeometry(0.05, 12, 12);
  var nodeMat = new THREE.MeshBasicMaterial({color: maroonLight});
  for(var i=0;i<3;i++){
    var node = new THREE.Mesh(nodeGeo, nodeMat);
    node.userData.angle = (i/3) * Math.PI * 2;
    node.userData.radius = 3.6;
    nodes.push(node);
    scene.add(node);
  }

  // ambient particle field
  var particleCount = window.innerWidth < 700 ? 220 : 500;
  var pGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(particleCount*3);
  for(var p=0;p<particleCount;p++){
    var r = 6 + Math.random()*9;
    var theta = Math.random()*Math.PI*2;
    var phi = Math.acos((Math.random()*2)-1);
    positions[p*3] = r*Math.sin(phi)*Math.cos(theta);
    positions[p*3+1] = r*Math.sin(phi)*Math.sin(theta);
    positions[p*3+2] = r*Math.cos(phi) - 4;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var pMat = new THREE.PointsMaterial({color:cream, size:0.028, transparent:true, opacity:.35});
  var particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  size();
  window.addEventListener('resize', size);

  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function(e){
    mouseX = (e.clientX/window.innerWidth - .5);
    mouseY = (e.clientY/window.innerHeight - .5);
  });

  var clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();

    if(!reduce){
      core.rotation.y = t * 0.18;
      core.rotation.x = t * 0.09;
      inner.rotation.copy(core.rotation);
      ringGroup.children.forEach(function(ring){
        ring.rotation[ring.userData.axis] += ring.userData.speed;
      });
      nodes.forEach(function(node, i){
        var a = node.userData.angle + t*0.25 + i*2;
        node.position.set(Math.cos(a)*node.userData.radius, Math.sin(a*0.6)*0.6, Math.sin(a)*node.userData.radius);
      });
      particles.rotation.y = t * 0.015;
      scene.rotation.y += (mouseX*0.25 - scene.rotation.y) * 0.02;
      scene.rotation.x += (-mouseY*0.15 - scene.rotation.x) * 0.02;
    }
    renderer.render(scene, camera);
  }
  animate();
})();

/* ---------- ABOUT 3D SCENE: smaller rotating schematic node ---------- */
(function(){
  var canvas = document.getElementById('about-canvas');
  if(!canvas || !window.THREE) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0,0,6);
  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function size(){
    var w = canvas.clientWidth, h = canvas.clientHeight || canvas.clientWidth;
    if(!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }

  var geo = new THREE.IcosahedronGeometry(1.7, 0);
  var mat = new THREE.MeshBasicMaterial({color:0x9E2226, wireframe:true});
  var mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  var dotGeo = new THREE.SphereGeometry(0.035, 10, 10);
  var dotMat = new THREE.MeshBasicMaterial({color:0xC7484C});
  var dots = [];
  geo.attributes.position.count && (function(){
    var posAttr = geo.attributes.position;
    var used = 0;
    for(var i=0;i<posAttr.count && used<8;i+=Math.floor(posAttr.count/8)){
      var d = new THREE.Mesh(dotGeo, dotMat);
      d.position.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      scene.add(d);
      dots.push(d);
      used++;
    }
  })();

  size();
  var ro = new ResizeObserver(size);
  ro.observe(canvas);

  var clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    if(!reduce){
      var t = clock.getElapsedTime();
      mesh.rotation.y = t*0.35;
      mesh.rotation.x = t*0.2;
      dots.forEach(function(d, i){ d.position.applyAxisAngle(new THREE.Vector3(0.3,1,0.1).normalize(), 0.0055); });
    }
    renderer.render(scene, camera);
  }
  animate();
})();

/* ---------- SHARED LAZY 3D SCENE HELPER ----------
   Creates a renderer only when its canvas first enters the viewport,
   and pauses the render loop whenever the section scrolls out of view.
*/
function createLazyScene(canvasId, opts){
  var canvas = document.getElementById(canvasId);
  if(!canvas || !window.THREE) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var inited = false, renderer, scene, camera, clock, rafId = null;

  function resize(){
    var w = canvas.clientWidth, h = canvas.clientHeight || w;
    if(!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(opts.fov || 45, 1, 0.1, 100);
    renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    clock = new THREE.Clock();
    opts.setup(scene, camera, THREE);
    resize();
    window.addEventListener('resize', resize);
    inited = true;
  }

  function loop(){
    rafId = requestAnimationFrame(loop);
    var t = clock.getElapsedTime();
    if(!reduceMotion){ opts.animate(t, scene, camera, THREE); }
    renderer.render(scene, camera);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        if(!inited) init(); else resize();
        if(!rafId) loop();
      } else if(rafId){
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }, {threshold:0.05});
  io.observe(canvas);
}

/* ---------- SKILLS SCENE: modular grid of assembling wireframe cubes ---------- */
createLazyScene('skills-canvas', {
  fov:50,
  setup:function(scene, camera){
    camera.position.set(0, 0, 15);
    var group = new THREE.Group();
    var cols = 7, rows = 4;
    var spacing = 2.1;
    for(var i=0;i<cols;i++){
      for(var j=0;j<rows;j++){
        var size = 0.4 + Math.random()*0.3;
        var geo = new THREE.BoxGeometry(size, size, size);
        var color = Math.random() > 0.6 ? 0x9E2226 : 0x2A1D18;
        var mat = new THREE.MeshBasicMaterial({color:color, wireframe:true, transparent:true, opacity:0.32});
        var cube = new THREE.Mesh(geo, mat);
        cube.position.set(
          (i - (cols-1)/2) * spacing + (Math.random()-0.5)*0.6,
          (j - (rows-1)/2) * spacing + (Math.random()-0.5)*0.6,
          (Math.random()-0.5)*4
        );
        cube.userData.speedX = 0.15 + Math.random()*0.3;
        cube.userData.speedY = 0.1 + Math.random()*0.25;
        cube.userData.bobSpeed = 0.4 + Math.random()*0.5;
        cube.userData.bobOffset = Math.random()*Math.PI*2;
        cube.userData.baseY = cube.position.y;
        group.add(cube);
      }
    }
    scene.add(group);
    scene.userData.group = group;
  },
  animate:function(t, scene){
    var group = scene.userData.group;
    group.children.forEach(function(cube){
      cube.rotation.x = t * cube.userData.speedX;
      cube.rotation.y = t * cube.userData.speedY;
      cube.position.y = cube.userData.baseY + Math.sin(t*cube.userData.bobSpeed + cube.userData.bobOffset) * 0.15;
    });
    group.rotation.y = Math.sin(t*0.05) * 0.1;
  }
});

/* ---------- SERVICES SCENE: rotating stack of layered rings ---------- */
createLazyScene('services-canvas', {
  fov:45,
  setup:function(scene, camera){
    camera.position.set(0, 0.5, 6.5);
    var group = new THREE.Group();
    var count = 6;
    for(var i=0;i<count;i++){
      var radius = 1.1 + i*0.14;
      var geo = new THREE.TorusGeometry(radius, 0.018, 8, 60);
      var color = i % 2 === 0 ? 0x9E2226 : 0xC7484C;
      var mat = new THREE.MeshBasicMaterial({color:color, transparent:true, opacity:0.65 - i*0.06});
      var ring = new THREE.Mesh(geo, mat);
      ring.position.y = (i - count/2) * 0.22;
      ring.rotation.x = Math.PI/2.3;
      ring.userData.spin = 0.08 + i*0.03;
      group.add(ring);
    }
    group.rotation.z = 0.25;
    scene.add(group);
    scene.userData.group = group;
  },
  animate:function(t, scene){
    var group = scene.userData.group;
    group.rotation.y = t * 0.22;
    group.children.forEach(function(ring, i){
      ring.position.y = ((i - group.children.length/2) * 0.22) + Math.sin(t*0.6 + i)*0.03;
    });
  }
});

/* ---------- PROJECTS SCENE: constellation network linking 3 project nodes ---------- */
createLazyScene('projects-canvas', {
  fov:50,
  setup:function(scene, camera){
    camera.position.set(0, 0, 11);
    var group = new THREE.Group();
    var nodePositions = [
      new THREE.Vector3(-5, 2.2, -1),
      new THREE.Vector3(0.5, -1.6, 1),
      new THREE.Vector3(5, 1.8, -2)
    ];
    var nodes = [];
    var nodeGeo = new THREE.IcosahedronGeometry(0.16, 0);
    nodePositions.forEach(function(pos, i){
      var mat = new THREE.MeshBasicMaterial({color:0xC7484C, wireframe:true, transparent:true, opacity:0.9});
      var node = new THREE.Mesh(nodeGeo, mat);
      node.position.copy(pos);
      node.userData.phase = i * 2.1;
      nodes.push(node);
      group.add(node);
    });
    var lineMat = new THREE.LineBasicMaterial({color:0xFAF8ED, transparent:true, opacity:0.14});
    for(var i=0;i<nodePositions.length;i++){
      for(var j=i+1;j<nodePositions.length;j++){
        var lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
        group.add(new THREE.Line(lineGeo, lineMat));
      }
    }
    var starCount = 180;
    var starGeo = new THREE.BufferGeometry();
    var starPos = new Float32Array(starCount*3);
    for(var s=0;s<starCount;s++){
      starPos[s*3] = (Math.random()-0.5)*16;
      starPos[s*3+1] = (Math.random()-0.5)*8;
      starPos[s*3+2] = (Math.random()-0.5)*6 - 2;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    var starMat = new THREE.PointsMaterial({color:0xFAF8ED, size:0.02, transparent:true, opacity:0.3});
    group.add(new THREE.Points(starGeo, starMat));

    scene.add(group);
    scene.userData.group = group;
    scene.userData.nodes = nodes;
  },
  animate:function(t, scene){
    scene.userData.nodes.forEach(function(node){
      var s = 1 + Math.sin(t*1.4 + node.userData.phase) * 0.28;
      node.scale.setScalar(s);
      node.rotation.y = t * 0.4;
    });
    scene.userData.group.rotation.y = Math.sin(t*0.06) * 0.12;
  }
});

/* ---------- EDU/VISION SCENE: rising double-helix strand (growth timeline) ---------- */
createLazyScene('eduvision-canvas', {
  fov:40,
  setup:function(scene, camera){
    camera.position.set(0, 0, 7);
    var group = new THREE.Group();
    var steps = 26;
    var dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
    var matA = new THREE.MeshBasicMaterial({color:0x9E2226});
    var matB = new THREE.MeshBasicMaterial({color:0xC7484C});
    var strandA = [], strandB = [];
    for(var i=0;i<steps;i++){
      var yy = (i - steps/2) * 0.22;
      var angle = i * 0.55;
      var dA = new THREE.Mesh(dotGeo, matA);
      dA.position.set(Math.cos(angle)*0.55, yy, Math.sin(angle)*0.55);
      var dB = new THREE.Mesh(dotGeo, matB);
      dB.position.set(Math.cos(angle+Math.PI)*0.55, yy, Math.sin(angle+Math.PI)*0.55);
      group.add(dA); group.add(dB);
      strandA.push(dA); strandB.push(dB);
      if(i>0){
        var rungGeo = new THREE.BufferGeometry().setFromPoints([dA.position, dB.position]);
        var rungMat = new THREE.LineBasicMaterial({color:0x9E2226, transparent:true, opacity:0.18});
        group.add(new THREE.Line(rungGeo, rungMat));
      }
    }
    scene.add(group);
    scene.userData.group = group;
  },
  animate:function(t, scene){
    scene.userData.group.rotation.y = t * 0.35;
  }
});

/* ---------- FOOTER SCENE: slow-rotating wireframe globe with pulsing contact nodes ---------- */
createLazyScene('footer-canvas', {
  fov:45,
  setup:function(scene, camera){
    camera.position.set(0, 0, 8.5);
    var group = new THREE.Group();
    var globeGeo = new THREE.IcosahedronGeometry(2.6, 2);
    var globeMat = new THREE.MeshBasicMaterial({color:0xFAF8ED, wireframe:true, transparent:true, opacity:0.14});
    var globe = new THREE.Mesh(globeGeo, globeMat);
    group.add(globe);

    var innerGeo = new THREE.IcosahedronGeometry(2.55, 1);
    var innerMat = new THREE.MeshBasicMaterial({color:0x9E2226, wireframe:true, transparent:true, opacity:0.22});
    group.add(new THREE.Mesh(innerGeo, innerMat));

    var markers = [];
    var markerGeo = new THREE.SphereGeometry(0.05, 10, 10);
    var markerMat = new THREE.MeshBasicMaterial({color:0xC7484C});
    for(var i=0;i<7;i++){
      var m = new THREE.Mesh(markerGeo, markerMat);
      var phi = Math.acos(1 - 2*Math.random());
      var theta = Math.random()*Math.PI*2;
      m.position.set(2.62*Math.sin(phi)*Math.cos(theta), 2.62*Math.sin(phi)*Math.sin(theta), 2.62*Math.cos(phi));
      m.userData.phase = Math.random()*Math.PI*2;
      markers.push(m);
      group.add(m);
    }
    group.rotation.x = 0.25;
    scene.add(group);
    scene.userData.group = group;
    scene.userData.markers = markers;
  },
  animate:function(t, scene){
    scene.userData.group.rotation.y = t * 0.06;
    scene.userData.markers.forEach(function(m){
      m.scale.setScalar(1 + Math.sin(t*1.6 + m.userData.phase) * 0.6);
    });
  }
});
