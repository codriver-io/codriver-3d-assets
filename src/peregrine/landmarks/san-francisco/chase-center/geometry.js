import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTLINE, PROW_FIRST, PROW_LAST } from './chase-center-plan.js';
import { signLayout } from './chase-center-letters.js';

// Chase Center: a white aluminium-panel drum in three stepped horizontal bands on a timber-toned base,
// the east-facing glass PROW (a leaning curtain wall over a glazed lobby) under a roof visor with a
// timber soffit and white columns, a gently domed roof crowning at 38.1 m, and the CHASE CENTER sign.
// Everything is a radial inset of the mapped OSM outline (chase-center-plan.js), so the model is the
// mapped plan by construction. Authored directly in the exported frame: +X east, +Y up, +Z south.
//
// Profile rows (y, and how far INSIDE the mapped outline each part stands). The outline is the roof
// visor's edge: bands are tucked under it. The drum and the prow each have their own inset per row.
const PROW_LEAN = 3.5;               // glass top overhangs its base by this much
const Q_END = 6.5, Q_MID = 10.5;     // visor depth beyond the glass top line at the prow ends / middle
const GLASS_BASE_Y = 6.5, GLASS_TOP_Y = 26, VISOR_Y = 29, RIM_Y = 36, CROWN_Y = SPEC.height;
const ROOF_CROWN = 37.1;           // the dome's surface at the middle; the central plant block tops out at CROWN_Y
const PARAPET_H = 0.8;
const ROWS = [
  { y: 0, drum: 4.5, far: true },
  { y: 6.5, drum: 4.5, far: true },
  { y: 6.5, drum: 2.5, far: true },
  { y: 10.5, drum: 1.88, far: true },
  { y: 14, drum: 1.34, far: true },
  { y: 17.5, drum: 0.8, far: true },
  { y: 17.5, drum: 2.0, far: true },
  { y: 21, drum: 1.67 },
  { y: 24, drum: 1.38 },
  { y: 26, drum: 1.19 },
  { y: 29, drum: 0.9, far: true },
  { y: 29, drum: 0.3, far: true },
  { y: 36, drum: 3.0, far: true },
];
// Segment above each row: material and facing, for the drum chain, the prow chain and the two return edges
// where the prow meets the drum. null = nothing (the rows coincide).
const SEGS = [
  { drum: ['base', 'out'], prow: ['glow', 'out'], ret: ['base', 'out'] },
  { drum: ['skin_dark', 'down'], prow: null, ret: ['skin_dark', 'down'] },
  { drum: ['skin', 'out'], prow: ['glow', 'out'], ret: ['skin', 'out'] },
  { drum: ['skin', 'out'], prow: ['glass', 'out'], ret: ['skin', 'out'] },
  { drum: ['skin', 'out'], prow: ['glow', 'out'], ret: ['skin', 'out'] },
  { drum: ['skin', 'up'], prow: null, ret: ['skin', 'up'] },
  { drum: ['skin', 'out'], prow: ['glass', 'out'], ret: ['skin', 'out'] },
  { drum: ['skin', 'out'], prow: ['glass', 'out'], ret: ['skin', 'out'] },
  { drum: ['skin', 'out'], prow: ['glass', 'out'], ret: ['skin', 'out'] },
  { drum: ['skin', 'out'], prow: ['skin_dark', 'out'], ret: ['skin', 'out'] },
  { drum: ['skin_dark', 'down'], prow: ['timber', 'down'], ret: ['timber', 'down'] },
  { drum: ['skin', 'out'], prow: ['skin', 'out'], ret: ['skin', 'out'] },
];
const qOf = (t) => Q_END + (Q_MID - Q_END) * Math.sin(Math.PI * t);
// Inset of the prow at height y (glass lean) and at the profile rows above the glass.
const glassInset = (y, t) => qOf(t) + PROW_LEAN * Math.min(1, Math.max(0, (GLASS_TOP_Y - y) / (GLASS_TOP_Y - GLASS_BASE_Y)));
const prowInset = (i, y, t) => (i === 11 ? 0.3 : i === 12 ? 3.0 : glassInset(y, t));

// The ring: the mapped outline from the prow's first vertex round, subdivided so no edge is long.
function buildRing(near) {
  const n = OUTLINE.length, maxEdge = near ? 6.5 : 14, ring = [];
  const inProw = (i) => i >= PROW_FIRST && i <= PROW_LAST;
  for (let k = 0; k < n; k++) {
    const i = (PROW_FIRST + k) % n, j = (i + 1) % n, a = OUTLINE[i], b = OUTLINE[j];
    const group = inProw(i) ? 'prow' : 'drum';
    ring.push({ x: a[0], z: a[1], group, corner: true });
    if (inProw(i) === inProw(j)) { // a chain edge: subdivide
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.ceil(len / maxEdge);
      for (let s = 1; s < m; s++) ring.push({ x: a[0] + (b[0] - a[0]) * s / m, z: a[1] + (b[1] - a[1]) * s / m, group, corner: false });
    }
  }
  return ring;
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const rows = ROWS.map((r, i) => ({ ...r, i })).filter((r) => near || r.far);
  const farMat = (m) => (!near && m === 'roof' ? 'skin' : m);

  let ring = buildRing(near);
  if (!near) { // keep every second vertex of a chain, and always its ends
    const keep = [];
    ['prow', 'drum'].forEach((g) => {
      const vs = ring.filter((v) => v.group === g);
      vs.forEach((v, k) => { if (k === 0 || k === vs.length - 1 || k % 2 === 0) keep.push(v); });
    });
    ring = ring.filter((v) => keep.includes(v));
  }
  const prowV = ring.filter((v) => v.group === 'prow'), drumV = ring.filter((v) => v.group === 'drum');
  let total = 0; const cum = [0];
  for (let i = 1; i < prowV.length; i++) { total += Math.hypot(prowV[i].x - prowV[i - 1].x, prowV[i].z - prowV[i - 1].z); cum.push(total); }
  prowV.forEach((v, i) => { v.t = cum[i] / total; });
  drumV.forEach((v) => { v.t = 0; });
  ring.forEach((v) => { v.r = Math.hypot(v.x, v.z); });
  // The two mapped "notch" edges join the prow to the drum. Part of each, the part next to the drum, takes the
  // DRUM's profile (base, ledge, shadow gaps, slots) so the return walls are banded like the drum; only the short
  // remainder next to the glass is a plain transition wall.
  const lerpV = (a, c, f) => { const x = a.x + (c.x - a.x) * f, z = a.z + (c.z - a.z) * f; return { x, z, group: 'drum', t: 0, r: Math.hypot(x, z) }; };
  // mS must lie beyond where the glass end's deep radial inset projects onto the (almost radial) south notch edge, or the
  // inset ring folds back on itself there; mN is not constrained that way.
  const mS = lerpV(prowV[prowV.length - 1], drumV[0], 0.66), mN = lerpV(drumV[drumV.length - 1], prowV[0], 0.6);
  const drumPath = [mS, ...drumV, mN];
  ring = [...prowV, ...drumPath];
  // The notch edges run almost radially, so a radial inset would only slide their walls along themselves and show
  // no steps. The four vertices of the two drum-profile return pieces are therefore inset along the mitre of their
  // two edges instead (a true perpendicular offset), which gives those walls the drum's ledges and recessed base.
  ring.forEach((v, i) => {
    if (v !== mS && v !== mN && v !== drumV[0] && v !== drumV[drumV.length - 1]) return;
    const prev = ring[(i + ring.length - 1) % ring.length], next = ring[(i + 1) % ring.length];
    const nrm = (a, c) => { const ex = c.x - a.x, ez = c.z - a.z, L = Math.hypot(ex, ez) || 1; return [-ez / L, ex / L]; }; // inward normal of a counter-clockwise edge
    const n1 = nrm(prev, v), n2 = nrm(v, next), k = 1 + n1[0] * n2[0] + n1[1] * n2[1];
    v.mitre = [(n1[0] + n2[0]) / k, (n1[1] + n2[1]) / k];
  });

  const insetOf = (v, row) => (v.group === 'prow' ? prowInset(row.i, row.y, v.t) : row.drum);
  const insetPos = (v, d, y) => { if (v.mitre) return [v.x + v.mitre[0] * d, y, v.z + v.mitre[1] * d]; const f = (v.r - d) / v.r; return [v.x * f, y, v.z * f]; };
  const at = (v, row) => insetPos(v, insetOf(v, row), row.y);

  // ---- a strip of quads over consecutive ring vertices, between two profile rows ---------------------
  function emitGrid(mat, cols, facing, verts) {
    const pos = [], idx = [];
    for (const [lo, hi] of cols) pos.push(...lo, ...hi);
    let any = false;
    for (let c = 0; c + 1 < cols.length; c++) {
      const A = cols[c][0], B = cols[c + 1][0], C = cols[c + 1][1], D = cols[c][1];
      const ab = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], ac = [C[0] - A[0], C[1] - A[1], C[2] - A[2]], ad = [D[0] - A[0], D[1] - A[1], D[2] - A[2]];
      const cr = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const n1 = cr(ab, ac), n2 = cr(ac, ad);
      const area = Math.hypot(...n1) + Math.hypot(...n2);
      if (area < 1e-3) continue;
      const nn = [n1[0] + n2[0], n1[1] + n2[1], n1[2] + n2[2]];
      let want;
      if (facing === 'up') want = [0, 1, 0];
      else if (facing === 'down') want = [0, -1, 0];
      else {
        // outward is the right of the walk along the MAPPED edge (the inset points of a transition wall can fold back on
        // themselves, so their own direction is not a reliable reference); 'in' is the opposite side
        let ex = (B[0] - A[0]) + (C[0] - D[0]), ez = (B[2] - A[2]) + (C[2] - D[2]);
        if (verts) { ex = verts[c + 1].x - verts[c].x; ez = verts[c + 1].z - verts[c].z; }
        want = facing === 'in' ? [-ez, 0, ex] : [ez, 0, -ex];
      }
      const a = 2 * c, bb = 2 * c + 2, cc = 2 * c + 3, d = 2 * c + 1;
      const flip = nn[0] * want[0] + nn[1] * want[1] + nn[2] * want[2] < 0;
      // each triangle on its own: a quad whose rows meet at one end is a single triangle, never a sliver
      if (Math.hypot(...n1) > 1e-4) idx.push(...(flip ? [a, cc, bb] : [a, bb, cc]));
      if (Math.hypot(...n2) > 1e-4) idx.push(...(flip ? [a, d, cc] : [a, cc, d]));
      any = true;
    }
    if (!any) return;
    const remap = new Map(), used = [];
    const index = idx.map((v) => { if (!remap.has(v)) { remap.set(v, used.length / 3); used.push(pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]); } return remap.get(v); });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(used, 3));
    g.setIndex(index); g.computeVertexNormals(); b.put(g, farMat(mat), 0, 0);
  }

  // ---- the shell: four chains round the ring ---------------------------------------------------------
  const chains = [
    { verts: drumV, kind: 'drum' },
    { verts: [drumV[drumV.length - 1], mN], kind: 'drum' },
    { verts: [mN, prowV[0]], kind: 'ret' },
    { verts: prowV, kind: 'prow' },
    { verts: [prowV[prowV.length - 1], mS], kind: 'ret' },
    { verts: [mS, drumV[0]], kind: 'drum' },
  ];
  for (const { verts, kind } of chains) {
    for (let k = 0; k + 1 < rows.length; k++) {
      const spec = SEGS[rows[k].i][kind];
      if (!spec) continue;
      emitGrid(spec[0], verts.map((v) => [at(v, rows[k]), at(v, rows[k + 1])]), spec[1], verts);
    }
  }

  // ---- the roof: the rim ring rises to the crown in four rings and a fan ---------------------------------
  {
    const rim = rows[rows.length - 1], us = [0, 0.3, 0.6, 0.85, 0.96];
    const rings = us.map((u) => ring.map((v) => { const p = at(v, rim), f = 1 - u; return [p[0] * f, RIM_Y + (ROOF_CROWN - RIM_Y) * (1 - (1 - u) * (1 - u)), p[2] * f]; }));
    for (let k = 0; k + 1 < rings.length; k++) {
      const cols = rings[k].map((p, i) => [p, rings[k + 1][i]]); cols.push(cols[0]);
      // columns pair the rim (lo) with the next ring (hi); the 'out' facing test is replaced by 'up'
      emitGrid('roof', cols, 'up');
    }
    const last = rings[rings.length - 1], pos = [0, ROOF_CROWN, 0], idx = [];
    last.forEach((p) => pos.push(...p));
    for (let i = 0; i < last.length; i++) idx.push(0, 1 + i, 1 + ((i + 1) % last.length));
    // orient the fan up (sum of the triangles' y normals)
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    let up = 0;
    for (let i = 0; i < idx.length; i += 3) {
      const A = [pos[3 * idx[i]], pos[3 * idx[i] + 1], pos[3 * idx[i] + 2]], B = [pos[3 * idx[i + 1]], pos[3 * idx[i + 1] + 1], pos[3 * idx[i + 1] + 2]], C = [pos[3 * idx[i + 2]], pos[3 * idx[i + 2] + 1], pos[3 * idx[i + 2] + 2]];
      up += (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2]);
    }
    if (up < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
    g.setIndex(idx); g.computeVertexNormals(); b.put(g, farMat('roof'), 0, 0);
  }

  // ---- surface helpers on the glass prow ---------------------------------------------------------------
  // A point on the prow's glass at fraction t along the chain (north -> south) and height y, with the
  // wall frame: tangent toward the south, the leaning "up" and the outward normal.
  const lenAt = (y) => { // cumulative length of the glass line at height y
    const L = [0]; let s = 0;
    for (let i = 1; i < prowV.length; i++) {
      const a = at(prowV[i - 1], { y, drum: 0, i: 3 }), c = at(prowV[i], { y, drum: 0, i: 3 });
      s += Math.hypot(c[0] - a[0], c[2] - a[2]); L.push(s);
    }
    return L;
  };
  function glassAt(frac, y) { // fraction 0..1 of the glass line at height y, measured from the south end
    const L = lenAt(y), tot = L[L.length - 1], s = tot * (1 - frac); // distance from the north end
    let i = 1; while (i < L.length - 1 && L[i] < s) i++;
    const f = Math.min(1, Math.max(0, (s - L[i - 1]) / (L[i] - L[i - 1] || 1)));
    const row = { y, drum: 0, i: 3 };
    const p0 = at(prowV[i - 1], row), p1 = at(prowV[i], row);
    const p = [p0[0] + (p1[0] - p0[0]) * f, y, p0[2] + (p1[2] - p0[2]) * f];
    const ex = p1[0] - p0[0], ez = p1[2] - p0[2], el = Math.hypot(ex, ez) || 1;
    const south = new THREE.Vector3(ex / el, 0, ez / el);
    const out = new THREE.Vector3(p[0], 0, p[2]).normalize();
    const rightV = south.clone().negate();                       // reading left to right, seen from outside
    const up = new THREE.Vector3(out.x * PROW_LEAN / (GLASS_TOP_Y - GLASS_BASE_Y), 1, out.z * PROW_LEAN / (GLASS_TOP_Y - GLASS_BASE_Y)).normalize();
    const nrm = new THREE.Vector3().crossVectors(rightV, up).normalize();
    if (nrm.dot(out) < 0) nrm.negate();
    return { p: new THREE.Vector3(...p), right: rightV, up, nrm, total: tot };
  }
  const place = (geo, frame, local) => { // geo in local (right, up, normal) axes -> world
    const m = new THREE.Matrix4().makeBasis(frame.right, frame.up, frame.nrm);
    geo.applyMatrix4(m); geo.translate(frame.p.x, frame.p.y, frame.p.z);
    if (local) geo.translate(...local);
  };

  // ---- roof structure: parapet ring, radial ribs, skylight bands, plant units, central plant block ---------------
  {
    const rim = rows[rows.length - 1];
    // low parapet round the rim (outer face, top, inner face), 0.5 m thick
    const pt = (v, inset, y) => insetPos(v, inset, y);
    const loop = (fn) => { const cols = ring.map(fn); cols.push(cols[0]); return cols; };
    const closed = [...ring, ring[0]];
    emitGrid('roof', loop((v) => [pt(v, 3.0, RIM_Y), pt(v, 3.0, RIM_Y + PARAPET_H)]), 'out', closed);
    emitGrid('roof', loop((v) => [pt(v, 3.0, RIM_Y + PARAPET_H), pt(v, 3.5, RIM_Y + PARAPET_H)]), 'up');
    emitGrid('roof', loop((v) => [pt(v, 3.5, RIM_Y + PARAPET_H), pt(v, 3.5, RIM_Y)]), 'in', closed);

    // the dome's surface height anywhere on the roof (the rim ring scaled toward the origin)
    const rimPts = ring.map((v) => at(v, rim));
    const rimR = (x, z) => {
      const L = Math.hypot(x, z) || 1, dx = x / L, dz = z / L; let best = 1;
      for (let i = 0; i < rimPts.length; i++) {
        const a = rimPts[i], c = rimPts[(i + 1) % rimPts.length], ex = c[0] - a[0], ez = c[2] - a[2], den = dx * ez - dz * ex;
        if (Math.abs(den) < 1e-9) continue;
        const t = (a[0] * ez - a[2] * ex) / den, sP = (a[0] * dz - a[2] * dx) / den;
        if (t > 0 && sP >= 0 && sP <= 1 && t > best) best = t;
      }
      return best;
    };
    const roofY = (x, z) => { const k = Math.min(1, Math.hypot(x, z) / rimR(x, z)); return RIM_Y + (ROOF_CROWN - RIM_Y) * (1 - k * k); };
    const roofBox = (mat, x, z, sx, sh, sz, ang, embed = 0.3) => {
      const base = roofY(x, z) - embed, h = Math.min(sh, CROWN_Y - base);
      if (h < 0.2) return;
      const g = new THREE.BoxGeometry(sx, h, sz); g.rotateY(ang); g.translate(x, base + h / 2, z); b.put(g, mat, 0, 0);
    };
    // the central plant block crowns the roof at the mapped 38.1 m
    roofBox('skin_dark', 0, 0, near ? 11 : 12, CROWN_Y, near ? 8 : 9, 0.0, 0.3);
    if (near) {
      // radial ribs (seams) across the outer part of the dome
      const RIBS = 12;
      for (let k = 0; k < RIBS; k++) {
        const ph = (k + 0.4) * 2 * Math.PI / RIBS, cx = Math.cos(ph), cz = Math.sin(ph), R = rimR(cx, cz), piece = 8;
        for (let r0 = 0.5 * R; r0 + piece < 0.93 * R; r0 += piece) roofBox('steel', cx * (r0 + piece / 2), cz * (r0 + piece / 2), piece - 0.3, 0.4, 0.5, -ph, 0.15);
      }
      // skylight bands (lit floors seen from above) in the middle of the roof
      for (const x0 of [-26, -12, 12, 26]) {
        const half = x0 === 12 || x0 === -12 ? 34 : 24;
        for (let z0 = -half + 4; z0 <= half - 4; z0 += 8) roofBox('glow', x0, z0, 3, 0.6, 7.6, 0, 0.15);
      }
      // plant units between the ribs and the skylights
      const rnd = (i, j) => { const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); };
      for (let k = 0; k < 16; k++) {
        const ph = (k + 0.5 + 0.35 * (rnd(k, 1) - 0.5)) * 2 * Math.PI / 16, cx = Math.cos(ph), cz = Math.sin(ph), R = rimR(cx, cz), f = 0.55 + 0.3 * rnd(k, 2);
        roofBox(k % 3 === 0 ? 'skin_dark' : 'skin', cx * R * f, cz * R * f, 3 + 4 * rnd(k, 3), 1.0 + 0.8 * rnd(k, 4), 2.5 + 2.5 * rnd(k, 5), -ph, 0.3);
      }
    }
  }

  // ---- the panel slots: dark horizontal dashes staggered over the drum's two big bands (near only) -------
  if (near) {
    const rnd = (i, j) => { const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return x - Math.floor(x); };
    const chainLen = [0]; const lo0 = drumPath.map((v) => at(v, ROWS[2]));
    for (let i = 1; i < drumPath.length; i++) chainLen.push(chainLen[i - 1] + Math.hypot(lo0[i][0] - lo0[i - 1][0], lo0[i][2] - lo0[i - 1][2]));
    const totalLen = chainLen[chainLen.length - 1];
    const bands = [{ a: 2, b: 5, rowsN: 8 }, { a: 6, b: 10, rowsN: 8 }];
    const PW = 2.7, count = Math.floor(totalLen / PW);
    for (const band of bands) {
      for (let j = 1; j < band.rowsN; j += 2) {
        for (let c = 0; c < count; c++) {
          if (rnd(c, j + band.a) < 0.45) continue;
          const sPos = (c + 0.5 + (j % 4 === 1 ? 0 : 0.5)) * PW; if (sPos > totalLen - 1 || sPos < 1) continue;
          let i = 1; while (i < drumPath.length - 1 && chainLen[i] < sPos) i++;
          const f = (sPos - chainLen[i - 1]) / ((chainLen[i] - chainLen[i - 1]) || 1), yf = (j + 0.5) / band.rowsN;
          const surf = (row) => { const p0 = at(drumPath[i - 1], row), p1 = at(drumPath[i], row); return [p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f, p0[2] + (p1[2] - p0[2]) * f]; };
          const lo = surf(ROWS[band.a]), hi = surf(ROWS[band.b]);
          const p = new THREE.Vector3(lo[0] + (hi[0] - lo[0]) * yf, lo[1] + (hi[1] - lo[1]) * yf, lo[2] + (hi[2] - lo[2]) * yf);
          const t0 = at(drumPath[i - 1], ROWS[band.a]), t1 = at(drumPath[i], ROWS[band.a]);
          // the chain runs counter-clockwise on the x-z plane, so "right" seen from outside is its reverse and
          // right x up is the outward normal: a right-handed basis, so the box is not mirrored inside out
          const right = new THREE.Vector3(t0[0] - t1[0], 0, t0[2] - t1[2]).normalize();
          const up = new THREE.Vector3(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]).normalize();
          const nrm = new THREE.Vector3().crossVectors(right, up).normalize();
          // one hinged quad per slot: its top edge on the panel, its bottom edge 0.14 m proud, so it faces out and up
          const g = new THREE.BufferGeometry();
          g.setAttribute('position', new THREE.Float32BufferAttribute([-0.55, 0.07, -0.01, 0.55, 0.07, -0.01, 0.55, -0.07, 0.14, -0.55, -0.07, 0.14], 3));
          g.setIndex([0, 2, 1, 0, 3, 2]); g.computeVertexNormals();
          place(g, { right, up, nrm, p }); b.put(g, 'skin_dark', 0, 0);
        }
      }
    }
  }

  if (near) {
    // transoms: thin steel rails along the glass at each band edge (bottom face, front, top face)
    const rail = (y, w = 0.07, off = 0.16) => {
      const pt = (v, yy, o) => { const f = (v.r - (glassInset(yy, v.t) - o)) / v.r; return [v.x * f, yy, v.z * f]; };
      emitGrid('steel', prowV.map((v) => [pt(v, y - w, 0), pt(v, y - w, off)]), 'down');
      emitGrid('steel', prowV.map((v) => [pt(v, y - w, off), pt(v, y + w, off)]), 'out');
      emitGrid('steel', prowV.map((v) => [pt(v, y + w, off), pt(v, y + w, 0)]), 'up');
    };
    for (const y of [10.5, 14, 17.5, 21, 24]) rail(y);
    // glazed entrance bays low on the drum: the west entrance, the box office and the north (shop) side
    for (const [tx, tz] of [[-77.5, -12], [-62, -41.6], [-46, -75]]) {
      let bi = 0, bd = 1e9; drumV.forEach((v, i) => { const d = Math.hypot(v.x - tx, v.z - tz); if (d < bd) { bd = d; bi = i; } });
      const i0 = Math.max(0, bi - 1), i1 = Math.min(drumV.length - 1, bi + 1), p = at(drumV[bi], ROWS[0]);
      const a = at(drumV[i0], ROWS[0]), c = at(drumV[i1], ROWS[0]);
      const right = new THREE.Vector3(a[0] - c[0], 0, a[2] - c[2]).normalize(), up = new THREE.Vector3(0, 1, 0), nrm = new THREE.Vector3().crossVectors(right, up);
      const g = new THREE.BoxGeometry(10, 4.4, 0.3); g.translate(0, 0, 0.1);
      place(g, { right, up, nrm, p: new THREE.Vector3(p[0], 2.6, p[2]) }); b.put(g, 'glow', 0, 0);
    }
  }

  // ---- mullions, columns, sign (near and far keep columns; the rest is near only) ---------------------------
  const glassLen = lenAt(17)[prowV.length - 1];
  const cols = Math.round(glassLen / 11.5);
  for (let k = 0; k < cols; k++) {
    const fr = (k + 0.5) / cols, lo = glassAt(fr, 0.1), hi = glassAt(fr, GLASS_TOP_Y + 0.1);
    const lobby = new THREE.CylinderGeometry(0.6, 0.6, 7.2, near ? 8 : 5, 1, false);
    lobby.translate(lo.p.x, 3.6, lo.p.z); b.put(lobby, 'skin', 0, 0);
    if (near) {
      const upper = new THREE.CylinderGeometry(0.55, 0.55, VISOR_Y - GLASS_TOP_Y + 0.4, 8, 1, false);
      upper.translate(hi.p.x, (VISOR_Y + GLASS_TOP_Y) / 2, hi.p.z); b.put(upper, 'skin', 0, 0);
    }
  }
  if (near) {
    // mullions: thin steel ribs up the leaning glass, every ~3 m, skipping the column lines
    const nMull = Math.round(glassLen / 3.1);
    for (let k = 1; k < nMull; k++) {
      const fr = k / nMull, lo = glassAt(fr, GLASS_BASE_Y + 0.05), hi = glassAt(fr, GLASS_TOP_Y);
      const dir = hi.p.clone().sub(lo.p), len = dir.length();
      const frame = { right: lo.right, up: dir.clone().normalize(), nrm: lo.nrm.clone() };
      frame.nrm = new THREE.Vector3().crossVectors(frame.right, frame.up).normalize(); if (frame.nrm.dot(lo.nrm) < 0) frame.nrm.negate();
      const g = new THREE.BoxGeometry(0.13, len, 0.21); // from -0.05 (in the glass) to +0.16 proud
      g.translate(0, len / 2, 0.055); frame.p = lo.p; place(g, frame); b.put(g, 'steel', 0, 0);
    }
    // the sign: CHASE [logo] CENTER, glass-mounted, centred about a fifth of the way up from the south end
    const lay = signLayout(2.4), s0 = glassLen * 0.22 - lay.length / 2, signY = 17.0;
    // text runs from the south end toward the north (reading left to right seen from outside the prow)
    const place1 = (s, h) => glassAt((s0 + s) / glassLen, signY + h - 1.2);
    for (const st of lay.strokes) {
      const f = place1(st.s, st.h);
      const depth = st.a ? 0.3 : 0.36;
      const g = new THREE.BoxGeometry(st.w, st.ht, depth);
      if (st.a) g.rotateZ(st.a);
      g.translate(0, 0, depth / 2 - 0.05); place(g, f); b.put(g, 'sign', 0, 0);
    }
    const fl = place1(lay.logoAt, 1.2);
    const octa = new THREE.CylinderGeometry(lay.logoR, lay.logoR, 0.34, 8, 1, false);
    // axis to the wall normal, then spin the octagon flat-side-up
    octa.rotateX(Math.PI / 2); octa.rotateZ(Math.PI / 8); octa.translate(0, 0, 0.17 - 0.05); place(octa, fl); b.put(octa, 'logo', 0, 0);
  } else {
    // far: the sign as one lit bar so the entrance front still reads
    const f = glassAt(0.22, 17), g = new THREE.BoxGeometry(27, 2.2, 0.3);
    g.translate(0, 0, 0.1); place(g, f); b.put(g, 'sign', 0, 0);
  }
  return b.finish();
}
