/*
 * Hexforged — hex globe hero scene.
 *
 * A slowly turning world of hex tiles with corruption glowing through the
 * seams, embers of the forge drifting past. Built on the vendored Three.js
 * module; degrades gracefully (static frame / nothing) when WebGL or motion
 * is unavailable.
 */

import * as THREE from './vendor/three.module.js';

const PALETTE = {
  canvas: 0x111317,
  surface: 0x1c2025,
  raised: 0x292f35,
  border: 0x716960,
  amber: 0xe7ae49,
  amberLight: 0xffe4a0,
  teal: 0x0ac9d0,
  tealDark: 0x0e5f73,
  leather: 0x632908,
  corruptionBase: 0x302936,
  corruptionGrowth: 0x684d6d,
  corruptionEdge: 0xb39abb,
  corruptionLight: 0x9e77c5,
};

const RADIUS = 2.0;
const DETAIL = 6;
const CELL_GAP = 0.86;
const CORRUPTION_RATIO = 0.24;

/**
 * Weld the duplicated vertices of a PolyhedronGeometry into shared corners.
 *
 * @param {THREE.BufferGeometry} geo Source geometry (indexed or not).
 * @returns {{positions: Float32Array, faces: Array<[number, number, number]>}}
 */
function weld(geo) {
  const source = geo.index
    ? Array.from(geo.index.array)
    : [...Array(geo.attributes.position.count).keys()];
  const pos = geo.attributes.position.array;

  const keyOf = (i) =>
    `${pos[i * 3].toFixed(4)},${pos[i * 3 + 1].toFixed(4)},${pos[i * 3 + 2].toFixed(4)}`;

  const lookup = new Map();
  const positions = [];
  const remap = (i) => {
    const key = keyOf(i);
    if (!lookup.has(key)) {
      lookup.set(key, positions.length / 3);
      positions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    }
    return lookup.get(key);
  };

  const faces = [];
  for (let f = 0; f < source.length; f += 3) {
    faces.push([remap(source[f]), remap(source[f + 1]), remap(source[f + 2])]);
  }
  return { positions: Float32Array.from(positions), faces };
}

/**
 * Build the Goldberg dual: one hex/pentagon cell per welded vertex.
 *
 * @returns {{cells: Array<{center: THREE.Vector3, ring: THREE.Vector3[], neighbors: number[]}>}}
 */
function buildCells() {
  const { positions, faces } = weld(new THREE.IcosahedronGeometry(RADIUS, DETAIL));
  const vertexCount = positions.length / 3;
  const vertex = (i) => new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

  const centroids = faces.map(([a, b, c]) => vertex(a).add(vertex(b)).add(vertex(c)).divideScalar(3));

  // vertex -> incident faces
  const incident = Array.from({ length: vertexCount }, () => []);
  faces.forEach((face, f) => face.forEach((v) => incident[v].push(f)));

  // face -> face adjacency through shared edges (for the corruption flood)
  const faceNeighbors = faces.map(() => new Set());
  faces.forEach(([a, b, c], f) => {
    for (const g of new Set([...incident[a], ...incident[b], ...incident[c]])) {
      if (g !== f) faceNeighbors[f].add(g);
    }
  });

  const cells = [];
  for (let v = 0; v < vertexCount; v++) {
    const center = vertex(v);
    const n = center.clone().normalize();
    const reference = Math.abs(n.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const t1 = new THREE.Vector3().crossVectors(n, reference).normalize();
    const t2 = new THREE.Vector3().crossVectors(n, t1);

    const ordered = incident[v]
      .map((f) => {
        const d = centroids[f].clone().sub(center);
        return { f, angle: Math.atan2(d.dot(t2), d.dot(t1)) };
      })
      .sort((a, b) => a.angle - b.angle);

    const ring = ordered.map(({ f }) => centroids[f].clone().normalize().multiplyScalar(RADIUS * 1.002));
    cells.push({
      center: center.clone().normalize().multiplyScalar(RADIUS * 1.001),
      ring,
      faces: ordered.map(({ f }) => f),
    });
  }

  // cell adjacency: two cells touch when their faces share an edge
  const cellOfFace = new Map();
  cells.forEach((cell, i) => cell.faces.forEach((f) => cellOfFace.set(f, i)));
  cells.forEach((cell, i) => {
    const neighbors = new Set();
    cell.faces.forEach((f) => {
      faceNeighbors[f].forEach((g) => {
        const other = cellOfFace.get(g);
        if (other !== undefined && other !== i) neighbors.add(other);
      });
    });
    cell.neighbors = [...neighbors];
  });

  return { cells };
}

/** Assign base + corruption colors, flooding outward from a seeded region. */
function colorCells(cells) {
  const corrupted = new Set();
  const frontier = [Math.floor(Math.random() * cells.length)];
  const target = Math.floor(cells.length * CORRUPTION_RATIO);
  while (corrupted.size < target && frontier.length) {
    const i = frontier.splice(Math.floor(Math.random() * frontier.length), 1)[0];
    if (corrupted.has(i)) continue;
    corrupted.add(i);
    frontier.push(...cells[i].neighbors);
  }

  const cA = new THREE.Color(PALETTE.surface);
  const cB = new THREE.Color(PALETTE.raised);
  const cLeather = new THREE.Color(PALETTE.leather);
  const cCorA = new THREE.Color(PALETTE.corruptionBase);
  const cCorB = new THREE.Color(PALETTE.corruptionGrowth);
  const cCorGlow = new THREE.Color(PALETTE.corruptionLight);

  return cells.map((cell, i) => {
    const t = (Math.sin(cell.center.x * 12.9898 + cell.center.y * 78.233) * 43758.5453) % 1;
    const jitter = Math.abs(t);
    let color;
    if (corrupted.has(i)) {
      color = cCorA.clone().lerp(cCorB, jitter);
      if (jitter > 0.82) color.lerp(cCorGlow, 0.45);
    } else {
      color = cA.clone().lerp(cB, jitter);
      if (jitter > 0.9) color.lerp(cLeather, 0.28);
    }
    return { corrupted: corrupted.has(i), color };
  });
}

/** Assemble fill + edge geometries from the cells and their colors. */
function buildGlobe() {
  const { cells } = buildCells();
  const paint = colorCells(cells);

  const fillPos = [];
  const fillCol = [];
  const baseEdge = [];
  const corruptEdge = [];

  cells.forEach((cell, i) => {
    const ring = cell.ring.map((p) =>
      cell.center.clone().add(p.clone().sub(cell.center).multiplyScalar(CELL_GAP))
    );
    const { color, corrupted } = paint[i];

    for (let k = 0; k < ring.length; k++) {
      const a = ring[k];
      const b = ring[(k + 1) % ring.length];
      fillPos.push(cell.center.x, cell.center.y, cell.center.z, a.x, a.y, a.z, b.x, b.y, b.z);
      for (let v = 0; v < 3; v++) fillCol.push(color.r, color.g, color.b);

      const target = corrupted ? corruptEdge : baseEdge;
      target.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  });

  const group = new THREE.Group();

  const fillGeo = new THREE.BufferGeometry();
  fillGeo.setAttribute('position', new THREE.Float32BufferAttribute(fillPos, 3));
  fillGeo.setAttribute('color', new THREE.Float32BufferAttribute(fillCol, 3));
  fillGeo.computeVertexNormals();
  const fill = new THREE.Mesh(
    fillGeo,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.25, flatShading: true })
  );
  group.add(fill);

  const baseGeo = new THREE.BufferGeometry();
  baseGeo.setAttribute('position', new THREE.Float32BufferAttribute(baseEdge, 3));
  group.add(
    new THREE.LineSegments(
      baseGeo,
      new THREE.LineBasicMaterial({ color: PALETTE.amber, transparent: true, opacity: 0.16 })
    )
  );

  const corruptGeo = new THREE.BufferGeometry();
  corruptGeo.setAttribute('position', new THREE.Float32BufferAttribute(corruptEdge, 3));
  const corruptLines = new THREE.LineSegments(
    corruptGeo,
    new THREE.LineBasicMaterial({
      color: PALETTE.corruptionEdge,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(corruptLines);

  // Inner occluder keeps the far side from bleeding through the gaps.
  const occluder = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS * 0.985, 48, 32),
    new THREE.MeshBasicMaterial({ color: PALETTE.canvas })
  );
  group.add(occluder);

  return { group, corruptLines };
}

/** Embers of the forge drifting upward around the globe. */
function buildEmbers(count = 420) {
  const pos = new Float32Array(count * 3);
  const speed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = RADIUS * (1.3 + Math.random() * 2.4);
    const theta = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(theta) * r;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    pos[i * 3 + 2] = Math.sin(theta) * r;
    speed[i] = 0.15 + Math.random() * 0.5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: PALETTE.amber,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  return { points, speed };
}

/** Distant starfield. */
function buildStars(count = 1200) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(40 + Math.random() * 30);
    pos[i * 3] = v.x;
    pos[i * 3 + 1] = v.y;
    pos[i * 3 + 2] = v.z;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xf5eddf, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false })
  );
}

function init() {
  const canvas = document.getElementById('hexglobe');
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return; // WebGL unavailable — the CSS backdrop still carries the hero.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 120);
  camera.position.set(0, 0.35, 6.4);

  scene.add(new THREE.AmbientLight(PALETTE.tealDark, 1.4));
  const key = new THREE.DirectionalLight(PALETTE.amberLight, 2.4);
  key.position.set(-4, 3, 5);
  scene.add(key);
  const rim = new THREE.PointLight(PALETTE.teal, 30, 30);
  rim.position.set(4.5, -2, -3);
  scene.add(rim);
  const corruptionGlow = new THREE.PointLight(PALETTE.corruptionLight, 20, 12);
  corruptionGlow.position.set(2.5, -1.5, 2.5);
  scene.add(corruptionGlow);

  const { group, corruptLines } = buildGlobe();
  group.rotation.z = 0.18;
  scene.add(group);
  scene.add(buildStars());

  const { points: embers, speed: emberSpeed } = buildEmbers();
  scene.add(embers);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let parallaxX = 0;
  let parallaxY = 0;
  window.addEventListener('pointermove', (event) => {
    parallaxX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    parallaxY = (event.clientY / window.innerHeight - 0.5) * 0.25;
  }, { passive: true });

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / Math.max(clientHeight, 1);
    // Pull back on narrow viewports so the globe frames the content.
    camera.position.z = camera.aspect < 1 ? 6.4 / camera.aspect : 6.4;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 }).observe(canvas);

  const clock = new THREE.Clock();
  function frame() {
    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.elapsedTime;

    group.rotation.y += delta * 0.07;
    group.rotation.x += (parallaxY * 0.4 - group.rotation.x) * 0.03;
    camera.position.x += (parallaxX - camera.position.x) * 0.02;
    camera.lookAt(0, 0, 0);

    corruptLines.material.opacity = 0.45 + Math.sin(elapsed * 1.6) * 0.25;
    corruptionGlow.intensity = 16 + Math.sin(elapsed * 1.6) * 8;

    const pos = embers.geometry.attributes.position;
    for (let i = 0; i < emberSpeed.length; i++) {
      pos.array[i * 3 + 1] += emberSpeed[i] * delta;
      if (pos.array[i * 3 + 1] > 5) pos.array[i * 3 + 1] = -5;
    }
    pos.needsUpdate = true;

    renderer.render(scene, camera);
  }

  if (reduced) {
    renderer.render(scene, camera);
    return;
  }

  renderer.setAnimationLoop(() => {
    if (visible && !document.hidden) frame();
  });
}

init();
