// Original, reusable metric geometry commissioned for Codriver (2026).
// Local frame: +X east, +Y up, +Z south. y=0 is a conceptual river/bank
// support datum, never a DEM or sea-level elevation. Coordinates are mapped
// approximations and are kept separate from the published structural lengths.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const origin = (lon, lat) => [lon, lat];
const ease = t => t * t * (3 - 2 * t);
const flat = ({ length, deck }) => [[0, 'start'], [Math.min(18, length * .12), deck], [length / 2, deck + .25], [Math.max(length - 18, length * .88), deck], [length, 'end']];

export const PARIS_BRIDGES = [
  { id: 'paris-pont-alexandre-iii', name: 'Pont Alexandre III', modelDir: 'bridges', terrainPolicy: 'bank-fit', origin: origin(2.31355, 48.86365),
    centerline: [[2.3134633, 48.8629734], [2.3136243, 48.8643112]], width: 40, deck: 7.5,
    roadEdges: [[-10, 10]], railGap: 0, arches: [1], style: 'alexandre', structuralLength: 160,
    profile: flat },
  { id: 'paris-pont-bir-hakeim', name: 'Pont de Bir-Hakeim', modelDir: 'bridges', terrainPolicy: 'bank-fit', origin: origin(2.28758, 48.85567),
    centerline: [[2.2866942, 48.8565888], [2.2876375, 48.8555794], [2.2884719, 48.8548030]], width: 25, deck: 7.2,
    roadEdges: [[-11.2, -3.4], [3.4, 11.2]], railGap: 3.3, arches: [2, 1], style: 'bir-hakeim', structuralLength: 237,
    profile: flat },
  { id: 'paris-pont-neuf', name: 'Pont Neuf', modelDir: 'bridges', terrainPolicy: 'bank-fit', origin: origin(2.34145, 48.85730),
    centerline: [[2.3405456, 48.8562229], [2.3410051, 48.8567498], [2.3414203, 48.8572051], [2.3423794, 48.8583786]], width: 21, deck: 7.8,
    roadEdges: [[-5.3, 5.3]], railGap: 0, arches: [5, 0, 7], style: 'neuf', structuralLength: 238,
    profile: flat },
  { id: 'paris-pont-iena', name: 'Pont d’Iéna', modelDir: 'bridges', terrainPolicy: 'bank-fit', origin: origin(2.29200, 48.85972),
    centerline: [[2.2911862, 48.8602128], [2.2924859, 48.8593666], [2.2926935, 48.8592248]], width: 35, deck: 7.5,
    roadEdges: [], railGap: 0, arches: [4, 1], style: 'iena', structuralLength: 155, pedestrian: true,
    profile: flat },
  { id: 'paris-pont-concorde', name: 'Pont de la Concorde', modelDir: 'bridges', terrainPolicy: 'bank-fit', origin: origin(2.31960, 48.86338),
    centerline: [[2.3191283, 48.8627480], [2.3196122, 48.8634034], [2.3200548, 48.8640023]], width: 34, deck: 7.2,
    roadEdges: [[-8.5, 8.5]], railGap: 0, arches: [2, 3], style: 'concorde', structuralLength: 153,
    profile: flat },
];

export const PARIS_BRIDGE_PALETTES = {
  light: { stone: '#d0c8b7', trim: '#eee2ca', deck: '#797874', asphalt: '#555d63', rail: '#626b6c', steel: '#6c857d', gold: '#d8ae52', paint: '#eee8d6' },
  dark: { stone: '#777c84', trim: '#a7a8a5', deck: '#555d63', asphalt: '#303c47', rail: '#9daab7', steel: '#748f91', gold: '#c8a050', paint: '#b9bdbe' },
};

// Metric coordinates use the same spherical Mercator projection as the host;
// the origin subtraction and latitude stretch happen once at host placement.
const R = 6378137;
const merc = ([lon, lat]) => [R * lon * Math.PI / 180, -R * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))];
export function metricFrame(spec) {
  const [ox, oz] = merc(spec.origin), stretch = 1 / Math.cos(spec.origin[1] * Math.PI / 180);
  const nodes = spec.centerline.map(ll => { const [x, z] = merc(ll); return { x: (x - ox) / stretch, z: (z - oz) / stretch }; });
  let length = 0;
  nodes.forEach((p, i) => { if (i) length += Math.hypot(p.x - nodes[i - 1].x, p.z - nodes[i - 1].z); p.s = length; });
  function point(s, d = 0, y = 0) {
    s = Math.max(0, Math.min(length, s)); let i = 1;
    while (i < nodes.length - 1 && nodes[i].s < s) i++;
    const a = nodes[i - 1], b = nodes[i], t = (s - a.s) / (b.s - a.s), tx = (b.x - a.x) / (b.s - a.s), tz = (b.z - a.z) / (b.s - a.s);
    return [a.x + (b.x - a.x) * t - tz * d, y, a.z + (b.z - a.z) * t + tx * d];
  }
  const knots = spec.profile({ length, deck: spec.deck });
  function height(s) {
    let i = 1; while (i < knots.length - 1 && knots[i][0] < s) i++;
    const a = knots[i - 1], b = knots[i], t = ease((Math.max(a[0], Math.min(b[0], s)) - a[0]) / (b[0] - a[0]));
    const v = x => typeof x === 'number' ? x : 0;
    return v(a[1]) + (v(b[1]) - v(a[1])) * t;
  }
  return { nodes, length, point, height };
}

export function createParisBridge(specOrId, { detail = 'near' } = {}) {
  const spec = typeof specOrId === 'string' ? PARIS_BRIDGES.find(v => v.id === specOrId) : specOrId;
  if (!spec) throw new Error('Unknown Paris bridge');
  const f = metricFrame(spec), near = detail === 'near', half = spec.width / 2;
  const groups = new Map();
  function add(mat, geometry, lift = 1) {
    geometry.deleteAttribute('uv');
    if (!geometry.index) geometry.setIndex(Array.from({ length: geometry.attributes.position.count }, (_, i) => i));
    const p = geometry.attributes.position;
    geometry.setAttribute('bridgeLift', new THREE.Float32BufferAttribute(Array.from({ length: p.count }, (_, i) => typeof lift === 'function' ? lift(p.getY(i)) : lift), 1));
    if (!groups.has(mat)) groups.set(mat, []); groups.get(mat).push(geometry);
  }
  function box(mat, s, d, y, ls, wd, ht, lift = 1) {
    const p = f.point(s, d, y), q = f.point(Math.min(f.length, s + .01), d, y), angle = Math.atan2(q[2] - p[2], q[0] - p[0]);
    const g = new THREE.BoxGeometry(ls, ht, wd); g.rotateY(-angle); g.translate(...p); add(mat, g, lift);
  }
  function beam(mat, a, b, radius, lift = 1) {
    const p = new THREE.Vector3(...f.point(...a)), q = new THREE.Vector3(...f.point(...b)), dir = q.clone().sub(p), len = dir.length();
    if (len < .001) return;
    const g = new THREE.CylinderGeometry(radius, radius, len, near ? 6 : 4);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
    g.translate(...p.add(q).multiplyScalar(.5).toArray()); add(mat, g, lift);
  }
  function strip(mat, s0, s1, d0, d1, dy, thickness = 0) {
    const positions = [], indices = [], step = near ? 5 : 10, n = Math.ceil((s1 - s0) / step), row = thickness ? 4 : 2;
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, y = f.height(s) + dy;
      for (const [d, h] of thickness ? [[d0, y], [d1, y], [d0, y - thickness], [d1, y - thickness]] : [[d0, y], [d1, y]]) positions.push(...f.point(s, d, h));
      if (!i) continue; const a = (i - 1) * row, b = i * row;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
      if (thickness) indices.push(a + 2, b + 2, a + 3, a + 3, b + 2, b + 3, a, b, a + 2, a + 2, b, b + 2, a + 1, a + 3, b + 1, a + 3, b + 3, b + 1);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); add(mat, g);
  }
  // Arch spandrels are open beneath the deck; there is no opaque wall over
  // the river. Each pier is independent for host-side terrain support fitting.
  function arch(s0, s1, d, rise, mat = 'stone') {
    const n = near ? 20 : 10, positions = [], indices = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, t = i / n;
      const crown = 1.2 + rise * Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2));
      const top = f.height(s) - .55;
      for (const dd of [d - .55, d + .55]) for (const y of [crown, top]) positions.push(...f.point(s, dd, y));
      if (!i) continue; const a = (i - 1) * 4, b = i * 4;
      for (const k of [0, 2]) indices.push(a + k, b + k, a + k + 1, a + k + 1, b + k, b + k + 1);
      indices.push(a, a + 2, b, a + 2, b + 2, b, a + 1, b + 1, a + 3, a + 3, b + 1, b + 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); add(mat, g);
  }
  strip('deck', 0, f.length, -half, half, -.1, .55);
  if (!spec.pedestrian) for (const [a, b] of spec.roadEdges) strip('asphalt', 0, f.length, a, b, .025);
  for (const d of [-half + .45, half - .45]) {
    strip('trim', 0, f.length, d - .4, d + .4, .16, .25);
    strip('rail', 0, f.length, d - .12, d + .12, 1.22, .18);
    if (near) for (let s = 3; s < f.length - 2; s += 5) box('rail', s, d, f.height(s) + .68, .17, .18, 1.13);
  }
  if (spec.style === 'alexandre') {
    const a = 23, b = f.length - 23;
    for (const d of [-half + 1.5, -half / 2, 0, half / 2, half - 1.5]) {
      for (let i = 0; i < (near ? 24 : 12); i++) {
        const s = a + (b - a) * i / (near ? 24 : 12), t = a + (b - a) * (i + 1) / (near ? 24 : 12);
        const y = x => 1.5 + 3.3 * Math.sqrt(Math.max(0, 1 - ((x - (a + b) / 2) / ((b - a) / 2)) ** 2));
        beam('steel', [s, d, y(s)], [t, d, y(t)], .32);
        if (near && i % 2 === 0) beam('steel', [s, d, y(s)], [s, d, f.height(s) - .45], .13);
      }
    }
    for (const s of [4, f.length - 4]) for (const d of [-half + 3, half - 3]) {
      box('stone', s, d, 8.8, 3.4, 3.4, 17, y => Math.max(0, Math.min(1, y / 8)));
      box('trim', s, d, 17.6, 4.1, 4.1, 1.1);
      // Four restrained winged figures: broad gold silhouettes, no copied sculpture.
      beam('gold', [s, d, 18], [s, d, 22.4], .48);
      for (const side of [-1, 1]) {
        beam('gold', [s, d, 21], [s + side * 1.5, d + side * 1.6, 24.3], .3);
        beam('gold', [s, d, 21], [s - side * 1.25, d + side * 1.7, 23.7], .2);
      }
    }
  } else {
    const cuts = f.nodes.map(v => v.s);
    for (let arm = 0; arm < spec.arches.length; arm++) {
      const a = cuts[arm], b = cuts[arm + 1], count = spec.arches[arm], bay = (b - a) / count;
      for (let i = 0; i < count; i++) {
        const start = a + i * bay + 1.45, end = a + (i + 1) * bay - 1.45;
        for (const d of [-half + .8, half - .8]) arch(start, end, d, spec.style === 'concorde' ? 3.2 : 4.7, spec.style === 'bir-hakeim' ? 'steel' : 'stone');
        if (i) {
          const s = a + i * bay;
          for (const d of [-half + 1, half - 1]) box('stone', s, d, 3.2, 3.2, 2.9, 6.4, y => Math.max(0, Math.min(1, y / 6.6)));
          if (spec.style === 'neuf') for (const d of [-half - .25, half + .25]) box('trim', s, d, 2.2, 4.4, 2.6, 3.1, 0);
        }
      }
    }
  }
  if (spec.style === 'bir-hakeim') {
    const island = f.nodes[1].s;
    // Île aux Cygnes portico: paired side towers and an open road passage.
    // A solid block here would erase both road lanes and the central walk.
    for (const d of [-half - 1.2, half + 1.2]) {
      box('stone', island, d, 8.2, 7, 3.8, 16.4, y => Math.max(0, Math.min(1, y / 8)));
      box('trim', island, d, 16.7, 8, 4.5, 1.0);
    }
    box('stone', island, 0, 15.2, 7, spec.width + 1.5, 1.5);
    strip('steel', 0, f.length, -5.3, 5.3, 9.4, .65); // elevated Métro deck only
    for (const d of [-3, 3]) strip('rail', 0, f.length, d - .055, d + .055, 9.55, .1);
    for (let s = 8; s < f.length - 7; s += near ? 8 : 16) {
      for (const d of [-4.6, 4.6]) {
        beam('steel', [s, d, f.height(s) + .2], [s, d, f.height(s) + 9.2], .23);
        beam('steel', [s, d, f.height(s) + 2.2], [s + 3, d, f.height(s) + 8.9], .13);
      }
      beam('steel', [s, -4.6, f.height(s) + 9], [s, 4.6, f.height(s) + 9], .22);
    }
  }
  if (near && !spec.pedestrian) for (let s = 4; s < f.length - 4; s += 10) for (const [a, b] of spec.roadEdges) {
    const d = (a + b) / 2; strip('paint', s, Math.min(s + 4, f.length), d - .055, d + .055, .045);
  }
  const root = new THREE.Group(); root.name = spec.name;
  root.userData = { landmark: spec.id, detail, units: 'metres', origin: spec.origin, frame: '+X east, +Y up, +Z south', yZero: 'local support datum; no terrain or sea-level baked' };
  for (const [name, geometries] of groups) {
    const merged = mergeGeometries(geometries); geometries.forEach(g => g.dispose());
    const material = new THREE.MeshStandardMaterial({ color: PARIS_BRIDGE_PALETTES.light[name], roughness: .82, metalness: name === 'steel' || name === 'gold' ? .38 : 0 }); material.name = name;
    const mesh = new THREE.Mesh(merged, material); mesh.name = `${spec.id}-${name}`; root.add(mesh);
  }
  return root;
}
