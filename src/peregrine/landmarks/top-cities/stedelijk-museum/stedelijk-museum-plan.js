// Stedelijk Museum, Museumplein 10, Amsterdam. Local metres, east/up/south,
// origin = centroid of OSM way 44508819. Mercator frame matches facade/geo.js
// (EARTH_R 6378137, divide by mercStretch) so the mesh sits on the red rings.
// Polygons are building:part ways; see footprint.js for the same ids.

export const LEVEL = {
  eave: 14,       // OSM height on way 754299893; cornice, matched by the tub roof
  ridge: 20.6,    // estimated: steep slate over the 33.9 m wing, under the 24 m towers
  tower: 24,      // OSM height, roof:height 10, ways 754299894–897
  spire: 28,      // OSM height, roof:height 14, way 754299889 (north risalit)
  tubTop: 13.62,  // canopy at the cornice; 38 cm under the brick cap so the faces do not share a plane
  tubSoffit: 12.4,
  glassMid: 3.9,  // low point of the bathtub hem, above the lobby. The curve is estimated.
  glassCorner: 5.5,
  screen: 17,     // OSM height on the glass part (way 754299890); the letter wall
};

// Proud of the backing face. Near clears the 20 cm layered-face gap; far the 50 cm one.
export const PROUD = { near: 0.28, far: 0.58 };

// Way 754299893, the 1895 Weissman block, ~95.6 m × 33.9 m, long axis bearing 66.4°.
export const HISTORIC = [[-58.01, -14.03], [29.61, -52.3], [42.66, -21.04], [-44.96, 17.23]];

// Way 754299892, the bathtub roof. Edge 0 lies ~2 m south of the Weissman south wall;
// the other three vertices are the ~41 m canopy (published figure: about 40 m).
export const ROOF = [[-46.68, 17.93], [45.13, -22.33], [60.78, 15.62], [38.8, 25.26], [-30.35, 55.59]];

// Way 754299890, the glazed ground floor under the canopy.
export const GLASS = [[45.62, -11.63], [52.96, 6.19], [-31.62, 43.53], [-39.41, 25.98], [-2.68, 9.73]];

// Corner turrets, ways 754299896 / 894 / 895 / 897 (N, E, S, W).
export const TOWERS = {
  n: [[29.71, -57.01], [34.22, -47.01], [24.21, -42.49], [19.7, -52.49]],
  e: [[40.63, -32.31], [45.13, -22.33], [35.12, -17.8], [30.62, -27.8]],
  s: [[-51.11, 7.83], [-41.03, 3.42], [-36.6, 13.53], [-46.68, 17.93]],
  w: [[-61.66, -16.73], [-51.58, -21.15], [-47.15, -11.04], [-57.23, -6.62]],
};

// Way 754299889, the north risalit. Two vertices sit ~7 m outside the north wall.
export const PAVILION = [[-23.41, -36.99], [-10.97, -42.38], [-5.52, -29.8], [-17.97, -24.41]];

export function area(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}
export function ccw(ring) {
  const r = ring.slice();
  return area(r) < 0 ? r.reverse() : r;
}
export function center(ring) {
  let x = 0, z = 0;
  for (const p of ring) { x += p[0]; z += p[1]; }
  return [x / ring.length, z / ring.length];
}
export function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
export function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
export function mul(a, s) { return [a[0] * s, a[1] * s]; }
export function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
export function len(a) { return Math.hypot(a[0], a[1]); }
export function unit(a) { const l = len(a) || 1; return [a[0] / l, a[1] / l]; }
export function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }

// Outward horizontal normal of a CCW edge (positive shoelace in x/z).
export function outward(dx, dz) {
  return unit([dz, -dx]);
}

export function toward(mid, dir, point) {
  return dot(dir, sub(point, mid)) > 0 ? dir : mul(dir, -1);
}

// Pull the canopy's back edge into the Weissman south wall so the slab meets
// brick, and notch the east tip for the letter screen.
export function tubPlan() {
  const H = ccw(HISTORIC);
  const roof = ccw(ROOF);
  const glass = ccw(GLASS);
  const hc = center(H);
  const rc = center(roof);
  let south = 0, best = -Infinity;
  for (let i = 0; i < H.length; i++) {
    const a = H[i], b = H[(i + 1) % H.length];
    const mid = lerp(a, b, 0.5);
    const d = dot(unit(sub(rc, hc)), sub(mid, hc));
    if (d > best) { best = d; south = i; }
  }
  const wallA = H[south], wallB = H[(south + 1) % H.length];
  const wdir = unit(sub(wallB, wallA));
  const win = toward(lerp(wallA, wallB, 0.5), outward(wdir[0], wdir[1]), hc);
  // 0.7 m inside the brick, so the canopy fascia is buried past the far-LOD gap.
  const embed = 0.7;
  const backA = add(wallA, mul(win, embed));
  const backB = add(wallB, mul(win, embed));
  let canopyM = 0;
  for (const p of roof) {
    const d = Math.abs((p[0] - wallA[0]) * wdir[1] - (p[1] - wallA[1]) * wdir[0]);
    if (d > canopyM) canopyM = d;
  }
  // The letter wall closes the east end of the canopy, the corner in the
  // Van Baerlestraat photographs, not the southernmost vertex.
  let tip = roof[0];
  for (const p of roof) if (p[0] > tip[0]) tip = p;
  const nearer = (q) => roof.reduce((m, p) => (len(sub(p, q)) < len(sub(m, q)) ? p : m), roof[0]);
  const iB = roof.indexOf(nearer(wallB));
  const iA = roof.indexOf(nearer(wallA));
  const walk = (step) => {
    const out = [];
    let i = iB;
    for (let k = 0; k < roof.length; k++) {
      i = (i + step + roof.length) % roof.length;
      if (i === iA) break;
      out.push(roof[i]);
    }
    return out;
  };
  const fwd = walk(1);
  const via = fwd.includes(tip) ? fwd : walk(-1);
  const chain = [backB, ...via, backA];
  const ti = chain.indexOf(tip);
  const prev = chain[Math.max(0, ti - 1)];
  const next = chain[Math.min(chain.length - 1, ti + 1)];
  // Prefer the edge at the tip whose street face looks most nearly east.
  const candidates = [prev, next].filter((p) => p && p !== tip);
  let anchor = prev, face = [1, 0], bestEast = -Infinity;
  for (const other of candidates) {
    const d = unit(sub(tip, other));
    const away = mul(toward(lerp(other, tip, 0.5), outward(d[0], d[1]), rc), -1);
    if (away[0] > bestEast) { bestEast = away[0]; anchor = other; face = away; }
  }
  const dir = unit(sub(tip, anchor));
  const edgeLen = len(sub(tip, anchor));
  const screenLen = Math.min(15.5, Math.max(8, edgeLen - 4));
  const start = add(tip, mul(dir, -screenLen));
  const inward = mul(face, -1);
  const thick = 3.1;
  const innerS = add(start, mul(inward, thick));
  const innerT = add(tip, mul(inward, thick));
  const roofRing = [];
  for (const p of chain) {
    if (p === tip && anchor === prev) roofRing.push(start, innerS, innerT, tip);
    else if (p === tip && anchor === next) roofRing.push(tip, innerT, innerS, start);
    else roofRing.push(p);
  }
  const notch = new Set([
    edgeKey(start, innerS), edgeKey(innerS, innerT), edgeKey(innerT, tip),
  ]);
  const backKey = edgeKey(backA, backB);
  const shell = [];
  let cur = null;
  for (let i = 0; i < roofRing.length; i++) {
    const a = roofRing[i], b = roofRing[(i + 1) % roofRing.length];
    const key = edgeKey(a, b);
    if (notch.has(key) || key === backKey) {
      if (cur) shell.push(cur);
      cur = null;
    } else {
      if (!cur) cur = [a];
      cur.push(b);
    }
  }
  if (cur) shell.push(cur);
  if (shell.length > 1 && shell[0][0] === shell[shell.length - 1].at(-1)) {
    const head = shell.shift();
    shell[shell.length - 1] = shell[shell.length - 1].concat(head.slice(1));
  }
  return {
    historic: H,
    roof: roofRing,
    glass,
    shell,
    screen: { outer: [start, tip], inner: [innerS, innerT], out: face, along: dir, thick },
    southWall: [wallA, wallB],
    canopyM,
    northIndex: (south + 2) % H.length,
  };
}

function edgeKey(a, b) {
  const k = (p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
  const ka = k(a), kb = k(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

// Scattered STEDELIJK / MUSEUM / AMSTERDAM, the Thonik cloud on the east screen.
// Positions are fractions of the screen width and metres up the face.
export const LETTERS = [
  // STEDELIJK, a shallow arch across the top
  ['S', 0.08, 14.15], ['T', 0.18, 14.45], ['E', 0.28, 14.62], ['D', 0.38, 14.7],
  ['E', 0.48, 14.62], ['L', 0.58, 14.45], ['I', 0.67, 14.28], ['J', 0.75, 14.05], ['K', 0.85, 13.75],
  // MUSEUM
  ['M', 0.20, 11.85], ['U', 0.31, 11.7], ['S', 0.41, 11.62], ['E', 0.51, 11.7], ['U', 0.61, 11.85], ['M', 0.72, 12.05],
  // AMSTERDAM, wider and lower, the last M kicked up the right side
  ['A', 0.08, 9.55], ['M', 0.18, 9.15], ['S', 0.30, 8.75], ['T', 0.40, 8.55],
  ['E', 0.50, 8.5], ['R', 0.60, 8.6], ['D', 0.70, 8.9], ['A', 0.82, 9.55], ['M', 0.90, 10.7],
];
