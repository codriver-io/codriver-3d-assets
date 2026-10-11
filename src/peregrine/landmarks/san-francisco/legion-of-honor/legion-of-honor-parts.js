import * as THREE from 'three';

// Parts of the Legion of Honor in the mapped outline's plan metres (u toward the entrance arch, v to its right,
// y up from the Court of Honor floor). Plan numbers come from OSM relation 21115818 and its building:part ways;
// heights are the OSM tags minus the 3 m base below the court (see docs/3d-san-francisco-legion-of-honor.md).
export const AX = -17.8; // v of the building's axis of symmetry (arch, court, portico, rotunda)
export const WALL = 12.4, RIDGE = 14.2, RUN = 3.2; // wall top (cornice), low hip top (skylight deck), hip run
export const OUTLINE = [[-56, -48], [32, -48], [32, -35.5], [-16.9, -35.5], [-16.9, -24.1], [-13.1, -24.1], [-13.1, -11.5], [-16.9, -11.5], [-16.9, 0.1], [32, 0.1], [32, 12.4], [-56, 12.4]];
const OUTER = new Set([0, 1, 9, 10, 11]); // edges that face the outside (plinth, pilasters, belt course)
export const COL = { y0: 0, yb: 0.45, yc: 5.2, y1: 5.9, r0: 0.33, r1: 0.28, bw: 0.85, cw: 0.8 }; // colonnade order
export const POR = { y0: 0.45, yb: 0.95, yc: 7.3, y1: 8.1, r0: 0.5, r1: 0.43, bw: 1.25, cw: 1.15 }; // portico order
export const ARCH = { u0: 26.4, u1: 31.3, half: 5.35, open: 2.4, spring: 7.6, cornice: 11.6, top: 13 }; // entrance arch
export const ROTUNDA = { u: -54.5, v: AX, r: 7, drum: 12.6, ring: 13.4, domeR: 6.6, domeRise: 4.1, top: 18 };
export const PYRAMID = { u: 1.8, v: -17.9, half: 3.7, rise: 1 };
export const THINKER = { u: 7.4, v: AX, half: 0.65, plinthH: 1.6 }; // on the arch side of the pyramid, as in the Highsmith court photograph

// outward geometry of the outline edges
const area = OUTLINE.reduce((s, [u, v], i) => { const [u2, v2] = OUTLINE[(i + 1) % OUTLINE.length]; return s + (u * v2 - u2 * v); }, 0);
const edge = (i) => {
  const a = OUTLINE[i], b = OUTLINE[(i + 1) % OUTLINE.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]), t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  const nrm = area > 0 ? [t[1], -t[0]] : [-t[1], t[0]], c = OUTLINE[(i + 2) % OUTLINE.length], turn = t[0] * (c[1] - b[1]) - t[1] * (c[0] - b[0]);
  return { a, b, L, t, n: nrm, convexEnd: turn * area > 0 };
};
const EDGES = OUTLINE.map((_, i) => edge(i));

export function buildLegionOfHonor(k) {
  const { near } = k, { box } = k;

  // ---- axis-aligned strip along an outline edge: s0..s1 along it (from its start), p out from the wall, y0..y1
  function edgeBox(mat, i, s0, s1, p, y0, y1, back = 0, skip = []) {
    const { a, t, n } = EDGES[i], q = [a[0] + t[0] * s0 - n[0] * back, a[1] + t[1] * s0 - n[1] * back], r = [a[0] + t[0] * s1 + n[0] * p, a[1] + t[1] * s1 + n[1] * p];
    box(mat, Math.min(q[0], r[0]), Math.max(q[0], r[0]), y0, y1, Math.min(q[1], r[1]), Math.max(q[1], r[1]), skip);
  }
  // a band of constant section round the outline edges in `which`; corners are filled once (see docs)
  function band(mat, which, p, y0, y1, skip = []) {
    for (const i of which) {
      const e = EDGES[i], next = which.includes((i + 1) % OUTLINE.length);
      const ext = e.convexEnd ? p : (next ? -p : 0);
      edgeBox(mat, i, 0, e.L + ext, p, y0, y1, 0, skip);
    }
  }
  const allEdges = EDGES.map((_, i) => i), outer = [...OUTER];

  // ===================================================================== mass, plinth, cornice, pilasters
  function shell() {
    k.prism('stone', OUTLINE, 0, WALL);
    band('stone', allEdges.filter((i) => i !== 5), 0.5, 11.7, WALL); // cornice (the portico covers edge 5)
    if (!near) return;
    band('stone', outer, 0.35, 0, 1.2, ['ny']); // plinth
    band('stone', outer, 0.18, 6.9, 7.25); // belt course
    for (const i of [0, 10, 11]) { // pilasters, about every 6.2 m
      const e = EDGES[i];
      for (const s of k.spread(1.3, e.L - 1.3, 6.2)) {
        const [u, v] = [e.a[0] + e.t[0] * s, e.a[1] + e.t[1] * s];
        if (i === 11 && Math.abs(v - AX) < 8.4) continue; // the rotunda apse stands here
        edgeBox('stone', i, s - 0.75, s + 0.75, 0.3, 1.0, 11.9, 0.1);
      }
    }
    for (const i of [1, 9]) for (const s of [0.9, EDGES[i].L - 0.9]) edgeBox('stone', i, s - 0.7, s + 0.7, 0.3, 1.0, 11.9, 0.1);
  }

  // ===================================================================== roofs: low hips round segmented skylight decks
  function roofs() {
    const R = (u0, u1, v0, v1) => {
      k.hip('roof', near ? 'roof' : 'glass', u0, u1, v0, v1, WALL, RIDGE, RUN);
      if (!near) return;
      // the 1932 aerial shows dark glazed bays between pale bars; each bay is a low glass curb-box 0.7 m inside the deck edge
      const r = Math.min(RUN, (u1 - u0) / 2 - 0.4, (v1 - v0) / 2 - 0.4), d = [u0 + r, u1 - r, v0 + r, v1 - r], longU = d[1] - d[0] >= d[3] - d[2];
      const [L0, L1, W0, W1] = longU ? [d[0], d[1], d[2], d[3]] : [d[2], d[3], d[0], d[1]], bar = 0.55, m = 0.7;
      const n = Math.max(1, Math.round((L1 - L0 - 2 * m) / 7)), len = (L1 - L0 - 2 * m - (n - 1) * bar) / n, across = W1 - W0 > 12 ? 2 : 1, wid = (W1 - W0 - 2 * m - (across - 1) * bar) / across;
      for (let i = 0; i < n; i++) for (let j = 0; j < across; j++) {
        const a = L0 + m + i * (len + bar), w = W0 + m + j * (wid + bar);
        if (longU) box('glass', a, a + len, RIDGE - 0.1, RIDGE + 0.28, w, w + wid, ['ny']); else box('glass', w, w + wid, RIDGE - 0.1, RIDGE + 0.28, a, a + len, ['ny']);
      }
    };
    R(-56, -16.9, -48, -24.1); R(-52.3, -13.1, -24.1, -11.5); R(-56, -16.9, -11.5, 12.4);
    R(-16.9, 32, -48, -35.5); R(-16.9, 32, 0.1, 12.4);
  }

  // ===================================================================== colonnades round the Court of Honor
  function balustrade(alongU, at, a, b, y0 = 7.1) {
    if (!near) { alongU ? box('stone', a, b, y0, 8.2, at - 0.17, at + 0.17) : box('stone', at - 0.17, at + 0.17, y0, 8.2, a, b); return; }
    if (alongU) { box('stone', a, b, y0, y0 + 0.2, at - 0.2, at + 0.2, ['ny']); box('stone', a, b, 8.0, 8.2, at - 0.23, at + 0.23); } else { box('stone', at - 0.2, at + 0.2, y0, y0 + 0.2, a, b, ['ny']); box('stone', at - 0.23, at + 0.23, 8.0, 8.2, a, b); }
    for (const s of k.spread(a + 0.2, b - 0.2, 0.42)) {
      if (alongU) box('stone', s - 0.09, s + 0.09, y0 + 0.2, 8.0, at - 0.09, at + 0.09, ['py', 'ny']); else box('stone', at - 0.09, at + 0.09, y0 + 0.2, 8.0, s - 0.09, s + 0.09, ['py', 'ny']);
    }
  }
  const cols = (list, c = COL) => list.forEach(([u, v]) => k.column(u, v, c));
  const glowWall = (u0, v0, u1, v1, y0, y1, inside) => k.faces('glow', [[[u0, y0, v0], [u1, y0, v1], [u1, y1, v1], [u0, y1, v0]]], inside);

  function colonnades() {
    // entablature (frieze box, then a projecting cornice slab) over each strip; strips are OSM building:parts 1540327029/30
    box('stone', -17.1, 26.9, 5.9, 6.75, -35.7, -32.7); box('stone', -17.1, 26.55, 6.75, 7.1, -35.7, -32.35); // north
    box('stone', -17.1, 26.9, 5.9, 6.75, -2.7, 0.3); box('stone', -17.1, 26.55, 6.75, 7.1, -3.05, 0.3); // south
    box('stone', -17.1, -14.1, 5.9, 6.75, -32.7, -23.9); box('stone', -17.1, -13.75, 6.75, 7.1, -32.35, -23.9); // west, north half
    box('stone', -17.1, -14.1, 5.9, 6.75, -11.7, -2.7); box('stone', -17.1, -13.75, 6.75, 7.1, -11.7, -3.05); // west, south half
    box('stone', 26.9, 30.7, 5.9, 6.75, -35.7, -23.0); box('stone', 26.55, 31.05, 6.75, 7.1, -35.7, -23.0); // east screen, north
    box('stone', 26.9, 30.7, 5.9, 6.75, -12.6, 0.3); box('stone', 26.55, 31.05, 6.75, 7.1, -12.6, 0.3); // east screen, south
    // the rows of columns: pitch about 1.8 m, one row on each side, two in the east screens
    const N = k.spread(-14.65, 26.35, 1.8).map((u) => [u, -33.25]), S = k.spread(-14.65, 26.35, 1.8).map((u) => [u, -2.15]);
    const WN = k.spread(-31.4, -24.65, 1.8).map((v) => [-14.65, v]), WS = k.spread(-4.0, -10.95, 1.8).map((v) => [-14.65, v]);
    cols(N); cols(S); cols(WN); cols(WS);
    cols(k.spread(-34.7, -24.4, 1.8).map((v) => [30.15, v])); if (near) cols(k.spread(-31.4, -24.4, 1.8).map((v) => [26.35, v]));
    cols(k.spread(-11.5, -0.7, 1.8).map((v) => [30.15, v])); if (near) cols(k.spread(-11.5, -4.0, 1.8).map((v) => [26.35, v]));
    // balustrades along the roofs
    balustrade(true, -32.6, -14.15, 26.55); balustrade(true, -2.8, -14.15, 26.55);
    balustrade(false, -14.0, -32.35, -24.3); balustrade(false, -14.0, -11.3, -3.05);
    balustrade(false, 26.8, -35.4, -23.4); balustrade(false, 30.8, -35.4, -23.4); balustrade(false, 26.8, -12.4, 0.0); balustrade(false, 30.8, -12.4, 0.0);
    // the lit rear walls behind the columns
    glowWall(-16.9, -35.45, 26.9, -35.45, 0.05, 5.9, [0, 3, 0]); glowWall(-16.9, 0.05, 26.9, 0.05, 0.05, 5.9, [0, 3, -30]);
    glowWall(-16.85, -35.5, -16.85, -24.1, 0.05, 5.9, [-30, 3, -30]); glowWall(-16.85, -11.5, -16.85, 0.1, 0.05, 5.9, [-30, 3, -5]);
  }

  // ===================================================================== portico of the museum block (OSM part 1540337305)
  function portico() {
    const c = AX;
    box('stone', -13.3, -7.2, 0, 0.45, c - 6.5, c + 6.5, ['ny']); // steps
    cols(k.spread(-5.4, 5.4, 2.16).map((d) => [-8.5, c + d]), POR);
    box('stone', -13.3, -7.9, 8.1, 9.5, c - 6.25, c + 6.25); box('stone', -13.3, -7.4, 9.5, 10.0, c - 6.7, c + 6.7); // architrave + frieze, cornice
    box('stone', -13.3, -8.1, 10.0, 12.0, c - 6.0, c + 6.0); // attic
    glowWall(-13.05, c - 6.3, -13.05, c + 6.3, 0.05, 8.1, [-30, 4, c]);
    if (near) relief(-7.9, c - 4.6, c + 4.6, 8.55, 9.3, 0.12); // inscription band HONNEUR ET PATRIE
  }

  // shallow relief panel on a face looking +u at plane u = f: a 0.06 m frame plus a raised field inset by `m`, in stone
  function relief(f, v0, v1, y0, y1, m = 0.16) {
    box('stone', f, f + 0.06, y0, y1, v0, v1, ['nx']);
    box('stone', f + 0.03, f + 0.12, y0 + m, y1 - m, v0 + m, v1 - m, ['nx']);
  }

  // ===================================================================== entrance arch (OSM parts 1410202325, 1540333313/14)
  function arch() {
    const { u0, u1, half, open, spring, cornice, top } = ARCH, c = AX, depth = u1 - u0;
    const s = new THREE.Shape();
    s.moveTo(-half, 0); s.lineTo(-open, 0); s.lineTo(-open, spring); s.absarc(0, spring, open, Math.PI, 0, true); s.lineTo(open, 0); s.lineTo(half, 0); s.lineTo(half, cornice); s.lineTo(-half, cornice); s.closePath();
    k.extrudeU('stone', s, u0, depth, c);
    box('stone', u0 - 0.4, u1 + 0.45, cornice, cornice + 0.6, c - half - 0.5, c + half + 0.5); // cornice
    box('stone', u0 + 0.2, u1 - 0.2, cornice + 0.6, top, c - half + 0.2, c + half - 0.2); // attic
    for (const sg of [-1, 1]) { // the colonnade entablature wraps each pylon as a hood
      const a = c + sg * (open + 0.15), b = c + sg * (half + 0.3);
      box('stone', u0 - 0.4, u1 + 0.5, 6.0, 7.2, Math.min(a, b), Math.max(a, b));
    }
    if (!near) return;
    const ring = new THREE.Shape(); // archivolt: a half ring round the opening, proud of both faces
    ring.absarc(0, spring, open + 0.7, Math.PI, 0, true); ring.lineTo(open, spring); ring.absarc(0, spring, open, 0, Math.PI, false); ring.closePath();
    k.extrudeU('stone', ring, u1, 0.18, c); k.extrudeU('stone', ring, u0 - 0.18, 0.18, c);
    for (const sg of [-1, 1]) { // trumpeting-angel reliefs in the spandrels, ashlar courses on the pylon fronts
      const v0 = c + sg * 3.45, v1 = c + sg * 5.0;
      relief(u1, Math.min(v0, v1), Math.max(v0, v1), 8.6, 10.2);
      const a = c + sg * (open + 0.05), b = c + sg * (half - 0.05);
      for (let y = 0.9; y < 5.5; y += 0.65) box('stone', u1 - 0.1, u1 + 0.06, y, y + 0.07, Math.min(a, b), Math.max(a, b));
    }
  }

  // ===================================================================== wing end pavilions (east ends of the two wings)
  function pavilions() {
    for (const m of [1, -1]) { // m = 1: north pavilion, -1: its mirror across the axis
      const vv = (v) => (m === 1 ? v : 2 * AX - v), span = (a, b) => [Math.min(vv(a), vv(b)), Math.max(vv(a), vv(b))];
      const [p0, p1] = span(-47.6, -35.9);
      box('stone', 31.1, 31.8, WALL, 13.6, p0, p1); // attic parapet over the east front
      if (!near) continue;
      const [f0, f1] = span(-46.6, -36.9);
      relief(32, f0, f1, 9.0, 10.8, 0.2); // relief frieze
      const [w0, w1] = span(-39.7, -38.8), [x0, x1] = span(-38.1, -37.2);
      for (const [a, b] of [[w0, w1], [x0, x1]]) box('shade', 32, 32.12, 2.2, 6.4, a, b, ['nx']); // tall narrow windows
      const niche = new THREE.Shape(); // the arched niche at the outer end
      niche.moveTo(-1.2, 1.15); niche.lineTo(1.2, 1.15); niche.lineTo(1.2, 6.5); niche.absarc(0, 6.5, 1.2, 0, Math.PI, false); niche.closePath();
      k.extrudeU('shade', niche, 32, 0.12, vv(-44.4));
    }
  }

  // ===================================================================== rotunda: apse drum, cornice ring, dome, lantern
  function rotunda() {
    const { u, v, r, drum, ring, domeR, domeRise, top } = ROTUNDA, sides = near ? 20 : 12;
    const dg = new THREE.CylinderGeometry(r, r, drum, sides, 1, true); dg.translate(0, drum / 2, 0); k.placeAt('stone', dg, u, v);
    const rg = new THREE.CylinderGeometry(r + 0.3, r + 0.3, ring - drum, sides, 1, false); rg.translate(0, (ring + drum) / 2, 0); k.placeAt('stone', rg, u, v);
    k.dome('dome', u, v, ring, domeR, domeRise, 0.9);
    const lg = new THREE.CylinderGeometry(0.9, 0.9, top - ring - domeRise + 0.15, near ? 8 : 5, 1, false); lg.translate(0, (top + ring + domeRise - 0.15) / 2, 0); k.placeAt('stone', lg, u, v);
    if (!near) return;
    const win = new THREE.Shape(); // arched drum windows round the apse
    win.moveTo(-0.75, 0); win.lineTo(0.75, 0); win.lineTo(0.75, 2.3); win.absarc(0, 2.3, 0.75, 0, Math.PI, false); win.closePath();
    for (const deg of [-78, -52, -26, 0, 26, 52, 78]) {
      const a = (deg * Math.PI) / 180, du = -Math.cos(a), dv = Math.sin(a), g = new THREE.ExtrudeGeometry(win, { depth: 0.5, bevelEnabled: false, curveSegments: 6 });
      g.rotateY(Math.atan2(du, dv)); k.placeAt('glass', g, u + du * (r - 0.25), v + dv * (r - 0.25), 8.4);
    }
  }

  // ===================================================================== glass pyramid skylight and The Thinker in the court
  function court() {
    const { u, v, half, rise } = PYRAMID, P = [[u - half, 0, v], [u, 0, v - half], [u + half, 0, v], [u, 0, v + half]], apex = [u, rise, v];
    k.faces('glass', P.map((p, i) => [p, P[(i + 1) % 4], apex]), [u, -2, v]);
    const t = THINKER, y0 = t.plinthH, h = t.half; // Rodin: granite plinth (about 0.9 x the figure), seated bronze figure about 1.9 m
    box('stone', t.u - h, t.u + h, 0, y0, t.v - h, t.v + h, ['ny']);
    if (!near) return;
    const B = (u0, u1, ya, yb, v0, v1) => box('bronze', t.u + u0, t.u + u1, y0 + ya, y0 + yb, t.v + v0, t.v + v1, ['ny']);
    B(-0.5, 0.45, 0, 0.4, -0.42, 0.42); // the rock he sits on
    B(-0.3, 0.55, 0.4, 0.75, -0.38, 0.38); // thighs
    B(0.35, 0.6, 0.0, 0.45, -0.3, 0.3); // lower legs
    B(-0.35, 0.05, 0.75, 1.25, -0.28, 0.28); // back and hips
    B(-0.25, 0.3, 1.1, 1.6, -0.27, 0.27); // torso leaning forward
    B(0.2, 0.5, 0.7, 1.15, -0.5, -0.24); // right arm down to the left knee
    B(0.25, 0.5, 1.5, 1.85, -0.14, 0.14); // head bowed on the hand
  }

  return { shell, roofs, colonnades, portico, arch, pavilions, rotunda, court };
}
