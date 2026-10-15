// Procedural diagrid for 30 St Mary Axe. Plain arrays in, one BufferGeometry per material out.
// The glass radius follows the mapped part-rings up to the belly (OSM ways 1365317068–072) and a
// photographed egg taper above 70 m. The diagrid is a fully tiled diamond lattice; the six light
// wells form colour spirals, advancing about 0.85 bay per near course. Steel channels stand
// outside the glazing. The last 9 m have a finer crossing grid on the blue-grey glass lens.
import * as THREE from 'three';
import { SPEC } from './config.js';

export const BAYS = SPEC.bays;
export const HEIGHT = SPEC.height;
export const FLOOR_M = SPEC.floorM;
// Centreline of the steel's inner edge, and the lip out to the visible face, off the glass.
export const STEEL_LIFT = 0.50;
export const STEEL_LIP = 0.18;
export const MULLION_LIFT = 0.24;
const FOOT_Y = 0.02;
const BELLY_Y = 66; // widest, inside the mapped 53.5–70 m band (levels 13–17)
const LENS_Y = 171; // diagrid ends; the glazed ogive owns the last 9 m
// Kept so a degrees-per-metre reading of the helix can be named. isWell advances by bay.
const SPIRAL_DEG_PER_M = 2.15;

export const SPIRAL_RATE = SPIRAL_DEG_PER_M * Math.PI / 180;
const SPIRAL_PHASE = 0.55;

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => mul(a, 1 / Math.max(len(a), 1e-8));
const lerp = (a, b, t) => add(a, mul(sub(b, a), t));

// Glass skin radius. Keys are metres. Smoothstep between them cannot overshoot the belly.
// Outer steel face = glass + STEEL_LIFT + STEEL_LIP, kept inside the 28.35 m outline.
const GLASS_KEYS = [
  [0, 23.92],
  [8, 24.12],
  [20.5, 25.35],
  [37, 26.42],
  [53.5, 27.18],
  [BELLY_Y, 27.5],
  [90, 26.9],
  [112, 25.2],
  [132, 22.2],
  [148, 18.4],
  [158, 15.2],
  [166, 11.6],
  [LENS_Y, 8.2],
  [175, 5.6],
  [178, 3.8],
  [180, 2.35],
];

export function glassRadius(y) {
  const k = GLASS_KEYS;
  if (y <= k[0][0]) return k[0][1];
  if (y >= k[k.length - 1][0]) return k[k.length - 1][1];
  let i = 1;
  while (k[i][0] < y) i++;
  const [y0, r0] = k[i - 1], [y1, r1] = k[i];
  const t = (y - y0) / (y1 - y0);
  const s = t * t * (3 - 2 * t);
  return r0 + (r1 - r0) * s;
}

export function outerRadius(y) {
  return glassRadius(y) + STEEL_LIFT + STEEL_LIP;
}

// θ = 0 north (−z), increasing toward east (+x). Bearing, so the spiral can be named.
export function pointAt(y, theta, r = glassRadius(y)) {
  return [r * Math.sin(theta), y, -r * Math.cos(theta)];
}
export function radialAt(theta) {
  return [Math.sin(theta), 0, -Math.cos(theta)];
}

export function hash01(a, b) {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function wellAngle(s, y) {
  return SPIRAL_PHASE + s * (2 * Math.PI / 6) + y * SPIRAL_RATE;
}

// Six wells, each a 2-bay band. The band advances 0.85 bay every diamond course, so it
// stays a helix where the courses get short near the lens (a constant degrees-per-metre
// rate straightened out up there).
export function isWell(theta, row) {
  const bay = (theta / (2 * Math.PI)) * BAYS;
  const c0 = 0.45 + row * 0.85;
  let rel = (bay - c0) % 4;
  if (rel < 0) rel += 4;
  return rel < 1 || rel >= 3;
}

// Office diamonds are glass or glow. The upper glazing stays blue-grey. The ground
// course is the lobby, lit. Wells are never lit: they are the dark atria.
export function panelMaterial(theta, y, i, row) {
  if (isWell(theta, row)) return 'well';
  if (y > 158) return 'lens';
  if (row === 0) return 'glow';
  const floor = Math.round(y / FLOOR_M);
  // A minority of panes, clustered by floor, so night reads as lit offices and day stays one glass.
  const busyness = 0.16 + 0.5 * hash01(floor, 2);
  return hash01(i + 3, row + 9) < busyness ? 'glow' : 'glass';
}

function wrap(i) {
  return ((i % BAYS) + BAYS) % BAYS;
}

function buildLevels(detail) {
  const near = detail === 'near';
  const minStep = 2.2; // Keep upper courses short enough to preserve the bullet silhouette.
  const aspect = near ? 0.50 : 0.58; // half-diamond height / bay width; a full diamond is about square
  const levels = [FOOT_Y];
  let guard = 0;
  while (levels[levels.length - 1] < LENS_Y - 0.6 && guard++ < 80) {
    const y = levels[levels.length - 1];
    const bay = 2 * Math.PI * Math.max(glassRadius(y), 0.8) / BAYS;
    let step = Math.max(minStep, aspect * bay);
    // Land on the belly so near and far share the widest radius.
    if (y < BELLY_Y && y + step > BELLY_Y + 0.8) step = BELLY_Y - y;
    if (y + step > LENS_Y + 0.15) break;
    levels.push(+(y + step).toFixed(4));
  }
  if (levels[levels.length - 1] < LENS_Y - 0.8) levels.push(+(LENS_Y - 0.35).toFixed(4));
  // Diamond tops use even indices, so the last ring has to be even.
  if (((levels.length - 1) % 2) !== 0) levels.push(+(Math.min(LENS_Y + 0.45, levels[levels.length - 1] + 0.5)).toFixed(4));
  return levels;
}

function makeNode(k, i, levels) {
  const y = levels[k];
  const theta = (wrap(i) + (k % 2) * 0.5) * (2 * Math.PI / BAYS);
  const radial = radialAt(theta);
  const p = pointAt(y, theta);
  const outer = add(p, mul(radial, STEEL_LIFT + STEEL_LIP));
  return { k, i: wrap(i), y, theta, radial, p, outer };
}

// Levels, node-to-node steel edges and diamond panels. The mesh is built from this, and the
// tests measure it, so a shortened end can be shown to miss its joint.
export function layout(detail = 'near') {
  const levels = buildLevels(detail);
  const referenceLevels = detail === 'far' ? buildLevels('near') : levels;
  const colourCourse = y => {
    let k = 0;
    while (k + 1 < referenceLevels.length && referenceLevels[k + 1] < y) k++;
    const next = referenceLevels[Math.min(k + 1, referenceLevels.length - 1)];
    return (k + (y - referenceLevels[k]) / Math.max(0.01, next - referenceLevels[k]) - 1) / 2;
  };
  const cache = new Map();
  const node = (k, i) => {
    const key = k + ':' + wrap(i);
    let n = cache.get(key);
    if (!n) { n = makeNode(k, i, levels); cache.set(key, n); }
    return n;
  };
  const edges = [];
  for (let k = 0; k < levels.length - 1; k++) {
    for (let i = 0; i < BAYS; i++) {
      const targets = (k % 2 === 0) ? [i - 1, i] : [i, i + 1];
      for (const j of targets) {
        const a = node(k, i), b = node(k + 1, j);
        edges.push({
          aKey: a.k + ':' + a.i, bKey: b.k + ':' + b.i,
          a: a.outer, b: b.outer, foot: k === 0,
          mid: lerp(a.outer, b.outer, 0.5),
          length: len(sub(b.outer, a.outer)),
        });
      }
    }
  }
  const panels = [];
  let row = 0;
  for (let k = 0; k + 2 < levels.length; k++, row += 0.5) {
    for (let i = 0; i < BAYS; i++) {
      const bottom = node(k, i);
      const right = node(k + 1, i + (k % 2));
      const top = node(k + 2, i);
      const left = node(k + 1, i - 1 + (k % 2));
      const y = (bottom.y + top.y) / 2;
      const theta = bottom.theta;
      const material = panelMaterial(theta, y, i, detail === 'far' ? colourCourse(y) : row);
      const aim = spanPoint(bottom, left, right, top, 0.78, 0.5);
      panels.push({
        y, theta, material, row, i, height: top.y - bottom.y,
        corners: [bottom.p, right.p, top.p, left.p],
        bottom, left, right, top, aim,
      });
    }
  }
  const last = levels.length - 1;
  const noseRow = row;
  // Glass ogive above the last diamond course. No steel hoop: a ring of bars on a
  // one-metre radius turned into a cage.
  const y0 = levels[last];
  const bands = detail === 'near' ? 6 : 3;
  const noseYs = [y0];
  for (let s = 1; s <= bands; s++) noseYs.push(y0 + (HEIGHT - y0) * (s / bands));
  noseYs[noseYs.length - 1] = HEIGHT;
  const nose = noseYs.map((y) => {
    const ring = [];
    const r = Math.max(glassRadius(y), y >= HEIGHT - 0.05 ? 2.05 : 0);
    for (let i = 0; i < BAYS; i++) {
      const theta = (i + (last % 2) * 0.5) * (2 * Math.PI / BAYS);
      ring.push({ theta, y, p: pointAt(y, theta, r) });
    }
    return ring;
  });
  return { levels, edges, panels, nose, noseRow, nodes: [...cache.values()] };
}

function spanPoint(bottom, left, right, top, f, u) {
  let a, b;
  if (f <= 0.5) {
    const t = f / 0.5;
    a = lerp(bottom.p, left.p, t);
    b = lerp(bottom.p, right.p, t);
  } else {
    const t = (f - 0.5) / 0.5;
    a = lerp(left.p, top.p, t);
    b = lerp(right.p, top.p, t);
  }
  return lerp(a, b, u);
}

function mesh() { return { p: [], n: [], i: [] }; }

function addTri(m, a, b, c, outward) {
  let n = cross(sub(b, a), sub(c, a));
  const L = len(n);
  if (L < 1e-8) return;
  n = mul(n, 1 / L);
  if (dot(n, outward) < 0) { const t = b; b = c; c = t; n = mul(n, -1); }
  const base = m.p.length / 3;
  m.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  m.n.push(n[0], n[1], n[2], n[0], n[1], n[2], n[0], n[1], n[2]);
  m.i.push(base, base + 1, base + 2);
}

function addQuad(m, a, b, c, d, outward) {
  addTri(m, a, b, c, outward);
  addTri(m, a, c, d, outward);
}

// Closed channel: outer face, two lips and glass-facing back. Ends fuse at shared nodes.
// `extend` pushes each end along the bar so neighbouring members fuse at the node.
function addChannel(m, nodeA, nodeB, width, extendA, extendB) {
  const bar = sub(nodeB.outer, nodeA.outer);
  if (len(bar) < 0.2) return;
  const dir = norm(bar);
  let sideA = norm(cross(nodeA.radial, dir));
  let sideB = norm(cross(nodeB.radial, dir));
  if (len(cross(nodeA.radial, dir)) < 1e-4) sideA = norm(cross([0, 1, 0], dir));
  if (len(cross(nodeB.radial, dir)) < 1e-4) sideB = sideA;
  if (dot(sideA, sideB) < 0) sideB = mul(sideB, -1);
  const corners = (node, side) => {
    const hw = width / 2;
    const s = mul(side, hw);
    const inner = mul(node.radial, STEEL_LIFT);
    const outer = mul(node.radial, STEEL_LIFT + STEEL_LIP);
    return {
      i0: add(node.p, add(inner, s)),
      i1: add(node.p, sub(inner, s)),
      o0: add(node.p, add(outer, s)),
      o1: add(node.p, sub(outer, s)),
    };
  };
  const shift = (c, d) => {
    const o = mul(dir, d);
    return { i0: add(c.i0, o), i1: add(c.i1, o), o0: add(c.o0, o), o1: add(c.o1, o) };
  };
  const A = shift(corners(nodeA, sideA), -extendA);
  const B = shift(corners(nodeB, sideB), extendB);
  const outward = norm(add(nodeA.radial, nodeB.radial));
  addQuad(m, A.o0, B.o0, B.o1, A.o1, outward);
  addQuad(m, A.o0, A.i0, B.i0, B.o0, sideA);
  addQuad(m, A.o1, B.o1, B.i1, A.i1, mul(sideA, -1));
  addQuad(m, A.i0, A.i1, B.i1, B.i0, mul(outward, -1));
}

function addStrip(m, nodeA, nodeB, width) {
  const bar = sub(nodeB.outer, nodeA.outer);
  if (len(bar) < 0.2) return;
  const dir = norm(bar);
  let side = norm(cross(nodeA.radial, dir));
  if (len(side) < 0.2) side = norm(cross([0, 1, 0], dir));
  const hw = mul(side, width / 2);
  const A0 = add(nodeA.outer, hw), A1 = sub(nodeA.outer, hw);
  const B0 = add(nodeB.outer, hw), B1 = sub(nodeB.outer, hw);
  const outward = norm(add(nodeA.radial, nodeB.radial));
  addQuad(m, A0, B0, B1, A1, outward);
}

function addMullion(m, panel) {
  if (panel.material !== 'glass' && panel.material !== 'glow') return;
  if (panel.height < 3.4) return;
  const lifts = panel.height > 9 ? [0.34, 0.62] : [0.46];
  const radial = radialAt(panel.theta);
  const outward = radial;
  for (const f of lifts) {
    const a = spanPoint(panel.bottom, panel.left, panel.right, panel.top, f, 0.16);
    const b = spanPoint(panel.bottom, panel.left, panel.right, panel.top, f, 0.84);
    const lift = mul(radial, MULLION_LIFT);
    const up = [0, 0.07, 0];
    const A = add(a, lift), B = add(b, lift);
    addQuad(m, sub(A, up), sub(B, up), add(B, up), add(A, up), outward);
  }
}

function toGeometry(m) {
  const g = new THREE.BufferGeometry();
  // Weld equal position/normal pairs without smoothing the flat glazing or channel edges.
  const p = [], n = [], idx = [], vertices = new Map();
  for (const old of m.i) {
    const pos = m.p.slice(old * 3, old * 3 + 3), normal = m.n.slice(old * 3, old * 3 + 3);
    const key = [...pos, ...normal].map(v => v.toFixed(6)).join(',');
    let i = vertices.get(key);
    if (i === undefined) { i = p.length / 3; vertices.set(key, i); p.push(...pos); n.push(...normal); }
    idx.push(i);
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(n, 3));
  g.setIndex(idx);
  return g;
}

export function buildMeshes(detail = 'near') {
  const near = detail === 'near';
  const layoutRings = layout(detail);
  const { edges, panels, nodes } = layoutRings;
  const byNode = new Map(nodes.map((n) => [n.k + ':' + n.i, n]));
  const buckets = { glass: mesh(), lens: mesh(), well: mesh(), glow: mesh(), steel: mesh() };
  const width = near ? 0.32 : 0.42;
  for (const e of edges) {
    const a = byNode.get(e.aKey), b = byNode.get(e.bKey);
    // Keep the member narrower than the bay, or the lens closes into a steel lump.
    const bay = 2 * Math.PI * Math.max(glassRadius((a.y + b.y) / 2), 0.4) / BAYS;
    const w = Math.max(near ? 0.1 : 0.16, Math.min(width, bay * 0.18));
    if (near) addChannel(buckets.steel, a, b, w, e.foot ? 0.04 : 0.3, 0.3);
    else addStrip(buckets.steel, a, b, w);
  }
  for (const panel of panels) {
    const [p0, p1, p2, p3] = panel.corners;
    const outward = radialAt(panel.theta);
    const bucket = buckets[panel.material];
    addTri(bucket, p0, p1, p2, outward);
    addTri(bucket, p0, p2, p3, outward);
    if (near) addMullion(buckets.steel, panel);
  }
  // Close the half diamonds at the grade and lens boundaries. The alternating
  // diamond courses above tile the complete skin, rather than leaving open diamonds.
  const nodeMap = new Map(nodes.map((n) => [n.k + ':' + n.i, n]));
  const last = layoutRings.levels.length - 1;
  for (let i = 0; i < BAYS; i++) {
    const j = (i + 1) % BAYS;
    const low = [nodeMap.get('0:' + i), nodeMap.get('0:' + j), nodeMap.get('1:' + i)];
    const high = [nodeMap.get(last + ':' + i), nodeMap.get((last - 1) + ':' + i), nodeMap.get(last + ':' + j)];
    for (const [tri, row] of [[low, -0.25], [high, (last - 1) / 2]]) {
      const theta = (i + 0.5) * 2 * Math.PI / BAYS;
      const mat = panelMaterial(theta, tri[2].y, i, row);
      addTri(buckets[mat], ...tri.map(n => n.p), radialAt(theta));
    }
  }
  // The cap is one blue-grey glazed lens with a fine structural crossing grid.
  const { nose } = layoutRings;
  for (let s = 0; s < nose.length - 1; s++) {
    for (let i = 0; i < BAYS; i++) {
      const a = nose[s][i], b = nose[s][(i + 1) % BAYS];
      const c = nose[s + 1][i], d = nose[s + 1][(i + 1) % BAYS];
      const theta = Math.atan2(Math.sin(a.theta) + Math.sin(b.theta), Math.cos(a.theta) + Math.cos(b.theta));
      const outward = add(radialAt(theta), [0, 0.25, 0]);
      addTri(buckets.lens, a.p, b.p, d.p, outward);
      addTri(buckets.lens, a.p, d.p, c.p, outward);
      // Fine lens diagrid, on the same blue-grey glazing in both LODs.
      const lifted = n => ({ outer: add(n.p, mul(radialAt(n.theta), 0.22)), radial: radialAt(n.theta) });
      addStrip(buckets.steel, lifted(a), lifted(d), near ? 0.085 : 0.11);
      addStrip(buckets.steel, lifted(b), lifted(c), near ? 0.085 : 0.11);
    }
  }
  const lid = nose[nose.length - 1];
  for (let i = 0; i < BAYS; i++) addTri(buckets.lens, lid[i].p, lid[(i + 1) % BAYS].p, [0, HEIGHT, 0], [0, 1, 0]);
  // Channel width is perpendicular to a diagonal, so a foot can dip a few centimetres. Sit it on grade.
  const steel = buckets.steel;
  for (let i = 1; i < steel.p.length; i += 3) {
    if (steel.p[i] < 0.02) steel.p[i] = 0.02;
    if (steel.p[i] > HEIGHT) steel.p[i] = HEIGHT;
  }
  const out = {};
  for (const [name, m] of Object.entries(buckets)) if (m.i.length) out[name] = toGeometry(m);
  return out;
}
