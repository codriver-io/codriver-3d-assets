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
    roadEdges: [[-11.2, -3.4], [3.4, 11.2]], railGap: 3.3, arches: [3, 3], style: 'bir-hakeim', structuralLength: 237,
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

export function parisBridgeSpans(spec, frame=metricFrame(spec)) {
  const out=[];
  const add=(a,b,weights)=>{const sum=weights.reduce((v,w)=>v+w,0);let s=a;for(const w of weights){const end=s+(b-a)*w/sum;out.push([s,end]);s=end;}};
  if(spec.style==='bir-hakeim'){
    const island=frame.nodes[1].s;add(0,island-9,[30,54,30]);add(island+9,frame.length,[24,42,24]);
  }else if(spec.style==='neuf'){
    add(frame.nodes[0].s,frame.nodes[1].s,[1,1,1,1,1]);add(frame.nodes[2].s,frame.nodes[3].s,[1,1,1,1,1,1,1]);
  }else if(spec.style==='iena'||spec.style==='concorde')add(0,frame.length,[1,1,1,1,1]);
  return out;
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
  // Geometry authored in the bridge frame (x along the span, y up, z across it) is turned onto the
  // alignment at station s and lateral offset d.
  function put(mat, g, s, d, y, lift = 1) {
    const p = f.point(s, d, y), q = f.point(Math.min(f.length, s + .01), d, y), angle = Math.atan2(q[2] - p[2], q[0] - p[0]);
    g.rotateY(-angle); g.translate(...p); add(mat, g, lift);
  }
  function box(mat, s, d, y, ls, wd, ht, lift = 1) { put(mat, new THREE.BoxGeometry(ls, ht, wd), s, d, y, lift); }
  // The end ramps are S-curves climbing up to ~60 %, so a flat pier, abutment or wall cap would stand
  // proud of the roadway on its low side. Caps are therefore sheared to follow the deck underside.
  function skewTop(g, s, from, normals = true) {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) if (p.getY(i) >= from) p.setY(i, p.getY(i) + f.height(s + p.getX(i)) - f.height(s));
    if (normals) g.computeVertexNormals();
  }
  // Box from y0 up to y1 (top sheared with the deck), centred on station s.
  function column(mat, s, d, y0, y1, ls, wd, lift = 1) {
    const g = new THREE.BoxGeometry(ls, y1 - y0, wd); g.translate(0, (y0 + y1) / 2, 0); skewTop(g, s, y1 - .01); put(mat, g, s, d, 0, lift);
  }
  // Ellipsoid with semi-axes (sx along the span, sy up, sz across), pitched about the cross axis.
  function blob(mat, s, d, y, sx, sy, sz, pitch = 0, lift = 1, seg = near ? [8, 5] : [6, 4]) {
    const g = new THREE.SphereGeometry(1, seg[0], seg[1]); g.scale(sx, sy, sz); g.rotateZ(pitch); put(mat, g, s, d, y, lift);
  }
  function beam(mat, a, b, radius, lift = 1, sides = near ? 6 : 4) {
    const p = new THREE.Vector3(...f.point(...a)), q = new THREE.Vector3(...f.point(...b)), dir = q.clone().sub(p), len = dir.length();
    if (len < .001) return;
    // Far members are open tubes: their end caps are buried or sub-pixel.
    const g = new THREE.CylinderGeometry(radius, radius, len, sides, 1, !near);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
    g.translate(...p.add(q).multiplyScalar(.5).toArray()); add(mat, g, lift);
  }
  // Strip stations: a uniform grid, subdivided where the end ramps leave the chord by more than a few
  // centimetres. Deck, kerbs and parapets then follow f.height() through the S-curves, so a pier or
  // arch top built from the true height never pokes through a coarse far-LOD chord.
  const stationCache = new Map();
  function stations(s0, s1) {
    const key = `${s0}:${s1}`;
    if (stationCache.has(key)) return stationCache.get(key);
    const step = near ? 5 : 10, n = Math.ceil((s1 - s0) / step), tol = near ? .03 : .06, out = [s0];
    const refine = (a, b, depth) => {
      if (depth >= 5) return;
      const ha = f.height(a), hb = f.height(b);
      if (![.25, .5, .75].some(t => Math.abs(f.height(a + (b - a) * t) - (ha + (hb - ha) * t)) > tol)) return;
      const m = (a + b) / 2; refine(a, m, depth + 1); out.push(m); refine(m, b, depth + 1);
    };
    for (let i = 0; i < n; i++) { const a = s0 + (s1 - s0) * i / n, b = s0 + (s1 - s0) * (i + 1) / n; refine(a, b, 0); out.push(b); }
    stationCache.set(key, out); return out;
  }
  function strip(mat, s0, s1, d0, d1, dy, thickness = 0, shared = false) {
    // `shared` strips (lane dashes) reuse the carriageway's stations so they never cross its chords.
    const positions = [], indices = [], row = thickness ? 4 : 2, st = shared ? [s0, ...stations(0, f.length).filter(v => v > s0 && v < s1), s1] : stations(s0, s1);
    for (let i = 0; i < st.length; i++) {
      const s = st[i], y = f.height(s) + dy;
      for (const [d, h] of thickness ? [[d0, y], [d1, y], [d0, y - thickness], [d1, y - thickness]] : [[d0, y], [d1, y]]) positions.push(...f.point(s, d, h));
      if (!i) continue; const a = (i - 1) * row, b = i * row;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
      if (thickness) indices.push(a + 2, b + 2, a + 3, a + 3, b + 2, b + 3, a, b, a + 2, a + 2, b, b + 2, a + 1, a + 3, b + 1, a + 3, b + 3, b + 1);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); add(mat, g);
  }
  // Arch spandrels are open beneath the deck; there is no opaque wall over
  // the river. Each pier is independent for host-side terrain support fitting.
  function arch(s0, s1, d, rise, mat = 'stone', width = 1.1) {
    const n = near ? 20 : 10, positions = [], indices = [];
    for (let i = 0; i <= n; i++) {
      const s = s0 + (s1 - s0) * i / n, t = i / n;
      const top = f.height(s) - .55;
      const crown = Math.min(top-.35, 1.2 + rise * Math.sqrt(Math.max(0, 1 - (2 * t - 1) ** 2)));
      for (const dd of [d - width/2, d + width/2]) for (const y of [crown, top]) positions.push(...f.point(s, dd, y));
      if (!i) continue; const a = (i - 1) * 4, b = i * 4;
      // Opposite elevations require opposite winding. The soffit faces down.
      indices.push(a,a+1,b,a+1,b+1,b,a+2,b+2,a+3,a+3,b+2,b+3);
      // The extrados is buried in the deck slab, so only the soffit faces are emitted.
      indices.push(a,b,a+2,a+2,b,b+2);
    }
    const end=n*4;
    indices.push(0,2,1,1,2,3,end,end+1,end+2,end+1,end+3,end+2);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals(); add(mat, g);
  }
  function pier(s) {
    const top=Math.max(.8,f.height(s)-.6),weight=y=>Math.max(0,Math.min(1,y/top));
    column('stone',s,0,0,top,3.6,spec.width-1,weight);
    for(const side of [-1,1]){
      const g=new THREE.CylinderGeometry(1.8,2.2,top,near?16:8);
      g.translate(0,top/2,0);skewTop(g,s,top-.01,false);put('stone',g,s,side*(half-.6),0,weight);
      const cap=new THREE.BoxGeometry(4.2,.5,3.4);cap.translate(0,top-.15,0);skewTop(cap,s,-1e9);put('trim',cap,s,side*(half-.3),0,weight);
    }
  }
  const masonry = ['neuf', 'iena', 'concorde'].includes(spec.style);
  const clamp01 = v => Math.max(0, Math.min(1, v));
  function lamp(s, d, ornate = false) {
    const y = f.height(s), top = y + (ornate ? 5.6 : 4.2), foot = masonry ? y + 1.08 : y;
    if (ornate) {
      // Alexandre III candelabrum: carved pedestal, dark shaft, gilded scrolled arms, three globes.
      box('trim', s, d, foot + .45, .8, .8, .9);
      beam('rail', [s, d, foot + .85], [s, d, top - 1.5], .1);
      beam('gold', [s, d, top - 1.5], [s, d, top - .3], .07);
      for (const side of [-1, 1]) {
        beam('gold', [s, d, top - 1.5], [s, d + side * .55, top - 1.2], .06);
        beam('gold', [s, d + side * .55, top - 1.2], [s, d + side * 1.0, top - .8], .06);
        const g = new THREE.SphereGeometry(.22, 8, 5); g.translate(...f.point(s, d + side * 1.0, top - .55)); add('trim', g);
      }
      const g = new THREE.SphereGeometry(.27, 8, 5); g.translate(...f.point(s, d, top)); add('trim', g);
      return;
    }
    box(masonry ? 'trim' : 'rail', s, d, foot + .23, .55, .55, .5);
    beam('rail', [s, d, foot + .45], [s, d, top], .085);
    const g = new THREE.SphereGeometry(.20, near ? 10 : 6, 6); g.translate(...f.point(s, d, top)); add('trim', g);
  }
  // Equestrian block (horse, rider, plinth-free): ~330 triangles near, ~140 far at any scale k.
  // dir = +1 faces +s, -1 faces -s. Thin members are 4-sided prisms.
  function equestrian(mat, s, d, y0, k, dir, lift = 1) {
    const L = u => s + u * k * dir, thin = near ? 4 : undefined;
    blob(mat, L(0), d, y0 + 2.05 * k, 1.35 * k, .55 * k, .48 * k, 0, lift);
    for (const [u, side] of [[.85, -1], [.85, 1], [-.85, -1], [-.85, 1]]) beam(mat, [L(u), d + side * .26 * k, y0 + 1.75 * k], [L(u), d + side * .26 * k, y0], .1 * k, lift, thin);
    beam(mat, [L(1.0), d, y0 + 2.35 * k], [L(1.55), d, y0 + 3.15 * k], .22 * k, lift);
    blob(mat, L(1.85), d, y0 + 3.2 * k, .42 * k, .17 * k, .15 * k, -.55 * dir, lift, near ? [6, 4] : [5, 3]);
    beam(mat, [L(-1.25), d, y0 + 2.3 * k], [L(-1.75), d, y0 + 1.2 * k], .07 * k, lift, thin);
    beam(mat, [L(-.1), d, y0 + 2.5 * k], [L(.05), d, y0 + 3.45 * k], .24 * k, lift, thin);
    blob(mat, L(.08), d, y0 + 3.75 * k, .17 * k, .17 * k, .17 * k, 0, lift, near ? [6, 4] : [5, 3]);
    beam(mat, [L(.05), d + .15 * k, y0 + 3.3 * k], [L(.75), d + .3 * k, y0 + 3.0 * k], .07 * k, lift, thin);
  }
  // Gilded winged horse with its Fame rider on a stone plinth (Alexandre III pylons): ~300 triangles near.
  function pegasus(s, d, y0, dir) {
    const L = u => s + u * dir, y = y0 + .6, thin = near ? 4 : undefined, small = near ? [6, 4] : [5, 3];
    box('stone', s, d, y0 + .3, 3.2, 2.2, .6);
    blob('gold', L(0), d, y + 2.2, 1.6, .65, .55, .6 * dir, 1, small);
    for (const side of [-1, 1]) {
      beam('gold', [L(-1.1), d + side * .3, y + 1.8], [L(-1.5), d + side * .3, y], .12, 1, thin);
      beam('gold', [L(1.1), d + side * .3, y + 2.8], [L(2.0), d + side * .3, y + 3.3], .1, 1, thin);
      blob('gold', L(-.5), d + side * .5, y + 3.75, 1.35, .75, .07, -.5 * dir, 1, small);
    }
    beam('gold', [L(1.2), d, y + 3.1], [L(1.7), d, y + 4.2], .2);
    blob('gold', L(2.0), d, y + 4.4, .45, .17, .15, -.5 * dir, 1, small);
    beam('gold', [L(-1.5), d, y + 2.5], [L(-2.3), d, y + 1.5], .08, 1, thin);
    beam('gold', [L(.1), d, y + 2.7], [L(0), d, y + 3.7], .22, 1, thin);
    blob('gold', L(0), d, y + 4.0, .2, .2, .2, 0, 1, small);
    beam('gold', [L(.1), d, y + 3.6], [L(.9), d + .3, y + 5.0], .06, 1, thin);
  }
  // Standing sculpture in 'trim' stone: skirted body, torso, head and a raised arm (~110 triangles near).
  function figure(mat, s, d, y0, k, lift = 1) {
    const g = new THREE.CylinderGeometry(.3 * k, .7 * k, 1.7 * k, near ? 8 : 5, 1, !near); put(mat, g, s, d, y0 + .85 * k, lift);
    beam(mat, [s, d, y0 + 1.6 * k], [s, d, y0 + 2.6 * k], .36 * k, lift, near ? 6 : undefined);
    blob(mat, s, d, y0 + 3.0 * k, .3 * k, .32 * k, .3 * k, 0, lift, near ? [6, 4] : [5, 3]);
    beam(mat, [s, d + .25 * k, y0 + 2.5 * k], [s + .15 * k, d + .95 * k, y0 + 3.9 * k], .12 * k, lift, near ? 4 : undefined);
    beam(mat, [s, d - .25 * k, y0 + 2.4 * k], [s - .1 * k, d - .75 * k, y0 + 1.9 * k], .12 * k, lift, near ? 4 : undefined);
  }
  strip('deck', 0, f.length, -half, half, -.1, .55);
  if (!spec.pedestrian) for (const [a, b] of spec.roadEdges) strip('asphalt', 0, f.length, a, b, .025);
  for (const d of [-half + .45, half - .45]) {
    strip('trim', 0, f.length, d - .4, d + .4, .16, .25);
    if (masonry) {
      // Continuous dressed-stone parapet with a coping course, as on the real masonry bridges.
      strip('stone', 0, f.length, d - .27, d + .27, 1.0, .85);
      strip('trim', 0, f.length, d - .36, d + .36, 1.1, .12);
    } else {
      strip('rail', 0, f.length, d - .12, d + .12, 1.22, .18);
      // Bir-Hakeim's far LOD keeps the top rail only: the bars are sub-pixel at that distance.
      if (near || spec.style !== 'bir-hakeim') for (let s = 2; s < f.length - 2; s += near ? .8 : 2.5) box('rail', s, d, f.height(s) + .68, .08, .1, 1.04);
    }
    if (near) for (let s = 6; s < f.length - 5; s += spec.style === 'alexandre' ? 12 : 20) lamp(s, d, spec.style === 'alexandre');
    // Far masonry bridges keep bare lamp shafts (no heads) so the skyline above the parapet stays.
    else if (masonry) for (let s = 6; s < f.length - 5; s += 20) beam('rail', [s, d, f.height(s) + 1.08], [s, d, f.height(s) + 4.4], .12);
  }
  if (spec.style === 'alexandre') {
    const a = 23, b = f.length - 23;
    // Solid bank abutments receive the low steel arch. Keep their toes planted.
    for(const [start,end] of [[0,a],[b,f.length]]){
      const count=Math.ceil((end-start)/2);
      for(let i=0;i<count;i++){
        const s=start+(end-start)*(i+.5)/count,top=Math.max(.05,f.height(s)-.55);
        column('stone',s,0,0,top,(end-start)/count+.05,spec.width-.3,y=>Math.max(0,Math.min(1,y/top)));
      }
    }
    for (let rib=0;rib<(near?15:7);rib++) {
      const d=-half+1.5+(spec.width-3)*rib/((near?15:7)-1);
      for (let i = 0; i < (near ? 24 : 12); i++) {
        const s = a + (b - a) * i / (near ? 24 : 12), t = a + (b - a) * (i + 1) / (near ? 24 : 12);
        const y = x => 1.5 + 3.3 * Math.sqrt(Math.max(0, 1 - ((x - (a + b) / 2) / ((b - a) / 2)) ** 2));
        // The arch and its spandrel posts are painted cream in the reference, not teal.
        beam('paint', [s, d, y(s)], [t, d, y(t)], .24);
        beam('paint', [s, d, y(s)+.75], [t, d, y(t)+.75], .17);
        if(near)beam('paint',[s,d,y(s)],[t,d,y(t)+.75],.09);
        if (near && i % 2 === 0) beam('paint', [s, d, y(s)], [s, d, f.height(s) - .45], .13);
      }
    }
    for (const s of [4, f.length - 4]) for (const d of [-half + 3, half - 3]) {
      const base=f.height(s);
      box('stone',s,d,base+.6,4.8,4.8,1.2);
      box('stone', s, d, base+8.8, 3.4, 3.4, 17, y => Math.max(0, Math.min(1, y / 8)));
      box('trim', s, d, base+17.6, 4.1, 4.1, 1.1);
      for(const yy of [2,3,15.5,16.3])box('trim',s,d,base+yy,3.9,3.9,.3);
      // Four original gilded winged-horse groups (rearing body, wings, Fame rider) on stone plinths,
      // facing the river banks; simplified silhouettes, not copied sculpture.
      pegasus(s, d, base + 18.15, s < f.length / 2 ? -1 : 1);
    }
  } else {
    // Structural spans are independent of arbitrary intermediate map vertices.
    const spans=parisBridgeSpans(spec,f),supports=new Set();
    for(const [start,end] of spans){
      const a=start+1.8,b=end-1.8;
      if(spec.style==='bir-hakeim'){
        for(const d of [-half+.8,0,half-.8]){
          const n=near?24:12;
          for(let i=0;i<n;i++){
            const p=a+(b-a)*i/n,q=a+(b-a)*(i+1)/n;
            const archY=s=>Math.min(f.height(s)-1.2,1.1+4.4*Math.sqrt(Math.max(0,1-((s-(a+b)/2)/((b-a)/2))**2)));
            beam('steel',[p,d,archY(p)],[q,d,archY(q)],.27);
            beam('steel',[p,d,archY(p)+.65],[q,d,archY(q)+.65],.14);
            if(near||i%2===0)beam('steel',[p,d,archY(p)],[p,d,f.height(p)-.65],.10);
          }
        }
      }else{
        const rise=spec.style==='concorde'?3.2:4.7;
        arch(a,b,0,rise,'stone',spec.width-1.1);
        // Express the dressed arch ring on both elevations with radial joints.
        for(const d of [-half+.5,half-.5]){
          const n=near?26:12;
          const y=s=>Math.min(f.height(s)-.95,1.2+rise*Math.sqrt(Math.max(0,1-((s-(a+b)/2)/((b-a)/2))**2)));
          for(let i=0;i<n;i++){
            const p=a+(b-a)*i/n,q=a+(b-a)*(i+1)/n;
            beam('trim',[p,d,y(p)+.12],[q,d,y(q)+.12],.18);
            if(near)beam('trim',[p,d,y(p)],[p+(p-(a+b)/2)*.025,d,y(p)+.65],.045);
          }
        }
      }
      if(start>1)supports.add(start);if(end<f.length-1)supports.add(end);
    }
    for(const s of supports){
      pier(s);
      if(spec.style==='neuf')for(const sign of [-1,1]){
        // Pont Neuf's semicircular refuges project over the masonry cutwaters.
        // Half-moon bay outside the parapet line: its top sits 2 cm above the kerb course instead of
        // overlapping it, and its thickness reaches down onto the pier cap.
        const g=new THREE.CylinderGeometry(2.2,2.2,.9,near?16:8,1,false,sign>0?-Math.PI/2:Math.PI/2,Math.PI);
        skewTop(g,s,-1e9);put('stone',g,s,sign*(half-.2),f.height(s)-.27);
        for(let i=0;i<(near?16:8);i++){
          const t=i*Math.PI/(near?16:8),q=(i+1)*Math.PI/(near?16:8);
          beam('stone',[s+2.2*Math.cos(t),sign*(half-.2+2.2*Math.sin(t)),f.height(s+2.2*Math.cos(t))+1],[s+2.2*Math.cos(q),sign*(half-.2+2.2*Math.sin(q)),f.height(s+2.2*Math.cos(q))+1],.27);
        }
      }
      if(near&&spec.style==='iena')for(const sign of [-1,1]){
        const y=f.height(s)-1.5,d=sign*(half+.05);
        beam('trim',[s,d,y],[s,d,y+.7],.24);
        for(const side of [-1,1])beam('trim',[s,d,y+.5],[s+side*1.5,d,y+1.0],.17);
      }
    }
    // Abutments under the approaches, with no opaque wall across the channel. Their top stays below
    // the deck underside (the ramp starts at y=0), so no stone shows on the roadway at either end.
    for(const s of [1.8,f.length-1.8])box('stone',s,0,-.575,3.6,spec.width,.85,clamp01);
    if(spec.style==='neuf'){
      // Île de la Cité: the roadway crosses the island on earth fill held by dressed-stone retaining
      // walls, so the deck is grounded between the two piers instead of hovering as a bare slab.
      const a=f.nodes[1].s+1.8,b=f.nodes[2].s-1.8,count=Math.ceil((b-a)/6);
      for(let i=0;i<count;i++){
        const s=a+(b-a)*(i+.5)/count,top=Math.max(.8,f.height(s)-.6),weight=y=>clamp01(y/top);
        for(const sign of [-1,1]){
          column('stone',s,sign*(half-.8),0,top,(b-a)/count+.05,1.6,weight);
          box('trim',s,sign*(half-.35),top-.3,(b-a)/count+.05,.7,.3,weight);
        }
      }
      // Pilasters at every joint and a base course give the long retaining wall a masonry rhythm.
      for(let i=0;i<=count;i++){
        const s=a+(b-a)*i/count,top=Math.max(.8,f.height(s)-.6),weight=y=>clamp01(y/top);
        for(const sign of [-1,1])box('trim',s,sign*(half+.1),.5+(top-.8)/2,.7,.4,top-.8,weight);
      }
      for(const sign of [-1,1])box('trim',(a+b)/2,sign*(half+.1),.27,b-a,.4,.5,y=>0);
      // Henri IV on the island terrace, downstream (west) side: stone pedestal and bronze-coloured group.
      const sm=(f.nodes[1].s+f.nodes[2].s)/2,top=f.height(sm)+2.8,ped=y=>1;
      box('stone',sm,-8.6,top/2-.45,2.4,2.4,top+.7,ped);
      box('trim',sm,-8.6,top-.15,2.9,2.9,.3,ped);
      equestrian('trim',sm,-8.6,top,.8,1);
    }
    if(spec.style==='iena'){
      // The four equestrian groups (Gaulois, Grec, Romain, Arabe) stand on stone plinths at the
      // corners of both approaches. Plinth feet follow the ground, tops follow the deck.
      for(const s of [3.2,f.length-3.2])for(const sign of [-1,1]){
        const d=sign*(half-3.4),top=4.3,weight=y=>clamp01(y/top);
        box('stone',s,d,1.55,4.0,4.0,5.1,weight);
        box('trim',s,d,1.15,4.8,4.8,.5,weight);
        box('trim',s,d,4.05,4.6,4.6,.5,weight);
        equestrian('trim',s,d,top,1.3,s<f.length/2?-1:1);
      }
    }
  }

  if (spec.style === 'bir-hakeim') {
    const island = f.nodes[1].s;
    // Île aux Cygnes portico: paired side towers and an open road passage.
    // A solid block here would erase both road lanes and the central walk.
    for (const d of [-half - 1.2, half + 1.2]) {
      // Each flanking pier is a stepped masonry mass, not a plain box: two plinth steps, a shaft that
      // narrows above the road, a cornice, a pedestal and a standing figure (France renaissante).
      const w = y => Math.max(0, Math.min(1, y / 8));
      box('stone', island, d, .65, 9.2, 5.8, 1.3, w);
      box('stone', island, d, 1.95, 8.2, 4.9, 1.3, w);
      box('stone', island, d, 5.8, 7, 3.8, 6.4, w);
      box('stone', island, d, 12.6, 6.4, 3.4, 7.2, w);
      for (const y of [6.2, 9.1]) box('trim', island, d, y, 7.4, 4.2, .3, w); // string courses
      // Pilasters on both long faces of the lower shaft break up the plain wall.
      for (const sd of [-1, 1]) for (const ss of [-2.4, 0, 2.4]) box('trim', island + ss, d + sd * 2.0, 5.9, .55, .3, 6.2, w);
      box('trim', island, d, 16.7, 8, 4.5, 1.0);
      box('stone', island, d, 17.7, 4.2, 2.6, 1.0);
      figure('trim', island, d, 18.2, .9);
    }
    box('stone', island, 0, 15.2, 6.2, spec.width + 1.5, 1.5);
    strip('steel', 0, f.length, -5.3, 5.3, 9.4, .65); // elevated Métro deck only
    for (const d of [-3, 3]) strip('rail', 0, f.length, d - .055, d + .055, 9.55, .1);
    for (let s = 8; s < f.length - 7; s += near ? 6 : 12) { // far keeps every second column pair
      for (const d of [-2.65, 2.65]) {
        beam('steel', [s, d, f.height(s) + .2], [s, d, f.height(s) + 9.2], .20);
        box('steel',s,d,f.height(s)+.4,.7,.7,.8);box('steel',s,d,f.height(s)+8.5,.85,.85,.4);
        for(const side of [-1,1]){
          const n=near?6:3;for(let j=0;j<n;j++){
            const p=t=>[s+side*2.6*t,d,f.height(s)+5.8+3.1*Math.sqrt(Math.max(0,1-(1-t)**2))];
            beam('steel',p(j/n),p((j+1)/n),.12);
          }
        }
      }
      beam('steel', [s, -2.65, f.height(s) + 9], [s, 2.65, f.height(s) + 9], .22);
    }
  }
  if(spec.style==='bir-hakeim')for(const d of [-5.15,5.15]){
    strip('steel',0,f.length,d-.1,d+.1,10.8,1.7);
    for(let s=3;s<f.length-2;s+=near?1.5:12)box('rail',s,d,f.height(s)+10.95,.14,.3,.18);
  }
  if(near&&spec.style==='alexandre')for(const d of [-half+.2,half-.2])for(let s=26;s<f.length-25;s+=3){
    const y=f.height(s)-.4;beam('gold',[s-1,d,y],[s,d,y-.5],.06);beam('gold',[s,d,y-.5],[s+1,d,y],.06);
  }
  if (near && !spec.pedestrian) for (let s = 4; s < f.length - 4; s += 10) for (const [a, b] of spec.roadEdges) {
    const d = (a + b) / 2; strip('paint', s, Math.min(s + 4, f.length), d - .055, d + .055, .06, 0, true);
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
