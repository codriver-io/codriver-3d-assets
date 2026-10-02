import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Meshes, splitByVertices } from './scotia-plaza-mesh.js';
import { wall, polyEdges, pointInPoly, officeRows, evenRows } from './scotia-plaza-facade.js';
import { ROOF_Y, FLOOR, WING_Y, TOWER, CORE_ROOF, BANDS, WING_NW, WING_SE, HERITAGE } from './scotia-plaza-site.js';

const RIM = 0.55; // parapet height at the roof edge
let serial = 0; // a fresh tag per wall so lit windows do not repeat between walls
const outward = (poly, a, b) => {
  const dx = b[0] - a[0], dv = b[1] - a[1], len = Math.hypot(dx, dv), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const n = [dv / len, -dx / len];
  return pointInPoly([m[0] + n[0] * 0.3, m[1] + n[1] * 0.3], poly) ? [-n[0], -n[1]] : n;
};

// The tower: sawtooth corners, two 4 m facade bands and the stepped-chevron recess between floors 56 and 68.
function tower(M, near) {
  const wings = [WING_NW.poly, WING_SE.poly];
  for (const e of polyEdges(TOWER)) {
    if (Math.abs(e.a[0] - e.b[0]) < 1e-9 && e.len > 40) continue; // the two long band faces are built below
    const hiddenBelowWing = wings.some((w) => pointInPoly([(e.a[0] + e.b[0]) / 2 + e.n[0] * 0.3, (e.a[1] + e.b[1]) / 2 + e.n[1] * 0.3], w));
    const yLo = hiddenBelowWing ? WING_Y : 0;
    if (hiddenBelowWing) wall(M, near, { a: e.a, b: e.b, n: e.n, rows: [], yLo: 0, yHi: WING_Y, solid: true });
    wall(M, near, { a: e.a, b: e.b, n: e.n, rows: officeRows(yLo, ROOF_Y), yLo, yHi: ROOF_Y, tag: ++serial });
  }
  for (const band of Object.values(BANDS)) bandFace(M, near, band);
  // The deck sits half a metre below the wall tops, leaving a granite parapet; the glazed recess has none.
  M.get('roof').cap(CORE_ROOF, ROOF_Y - RIM, true);
  const granite = M.get('granite');
  for (const e of polyEdges(CORE_ROOF)) {
    if (Math.abs(e.a[0] - e.b[0]) < 1e-9 && e.len > 30) continue; // the two glazed core faces
    const inN = [-e.n[0], 0, -e.n[1]], P = (s, y, r) => [e.a[0] + e.t[0] * s + e.n[0] * r, y, e.a[1] + e.t[1] * s + e.n[1] * r];
    granite.quad(P(0, ROOF_Y - RIM, -0.35), P(e.len, ROOF_Y - RIM, -0.35), P(e.len, ROOF_Y, -0.35), P(0, ROOF_Y, -0.35), inN);  // inner face of the parapet
    granite.quad(P(0, ROOF_Y, 0), P(e.len, ROOF_Y, 0), P(e.len, ROOF_Y, -0.35), P(0, ROOF_Y, -0.35), [0, 1, 0]);               // its top
  }
}

function bandFace(M, near, band) {
  const { sgn, uOuter, uCore, vFrom, vTo, vEdges, tops } = band, n = [sgn, 0];
  const segs = [[vFrom, vEdges[0], ROOF_Y], ...tops.map((h, k) => [vEdges[k], vEdges[k + 1], h]), [vEdges[12], vTo, ROOF_Y]];
  for (const [v0, v1, top] of segs) wall(M, near, { a: [uOuter, v0], b: [uOuter, v1], n, rows: officeRows(0, top), yLo: 0, yHi: top, tag: ++serial });
  const granite = M.get('granite'), curtain = M.get('curtain'), lines = M.get('glass');
  const wallV = (y0, y1, v, nv) => granite.quad([uCore, y0, v], [uOuter, y0, v], [uOuter, y1, v], [uCore, y1, v], [0, 0, nv]);
  tops.forEach((h, k) => {
    const v0 = vEdges[k], v1 = vEdges[k + 1];
    granite.quad([uCore, h, v0], [uOuter, h, v0], [uOuter, h, v1], [uCore, h, v1], [0, 1, 0]);       // the strip's top: a ledge of the stepped chevron
    curtain.quad([uCore, h, v0], [uCore, h, v1], [uCore, ROOF_Y, v1], [uCore, ROOF_Y, v0], [sgn, 0, 0]); // the recessed glazing behind it, up to the roof
    if (k < 11 && h !== tops[k + 1]) h > tops[k + 1] ? wallV(tops[k + 1], h, vEdges[k + 1], 1) : wallV(h, tops[k + 1], vEdges[k + 1], -1);
    if (near) { // glazing bars: one per floor and one per bay, proud of the glass by 5 cm
      const u = uCore + sgn * 0.05;
      for (let y = ROOF_Y - FLOOR; y > h + 0.5; y -= FLOOR) lines.quad([u, y - 0.07, v0], [u, y - 0.07, v1], [u, y + 0.07, v1], [u, y + 0.07, v0], [sgn, 0, 0]);
      const below = Math.max(h, k > 0 ? tops[k - 1] : h);
      lines.quad([u, below, v0 - 0.06], [u, below, v0 + 0.06], [u, ROOF_Y, v0 + 0.06], [u, ROOF_Y, v0 - 0.06], [sgn, 0, 0]);
    }
  });
  wallV(tops[0], ROOF_Y, vEdges[0], 1);   // the full-height end bay beside the first step
  wallV(tops[11], ROOF_Y, vEdges[12], -1);
}

// The two six-level wings that fill the chamfered corners at the foot of the tower.
function wings(M, near) {
  for (const w of [WING_NW, WING_SE]) {
    for (const [a, b] of w.exposed) wall(M, near, { a, b, n: outward(w.poly, a, b), rows: officeRows(0, WING_Y), yLo: 0, yHi: WING_Y, tag: ++serial });
    M.get('roof').cap(w.poly, WING_Y, true);
  }
}

// 44 King Street West: OSM massing (a 25.6 m base and set-back tiers to 81, 98 and 115 m) in limestone.
function heritage(M, near) {
  const style = { mat: 'stone', bay: 3.2, winMin: 1.1, winMax: 1.6, winFrac: 0.42, rd: 0.5, reveals: 'l' };
  const rowsFor = (y0, y1) => y0 < 0.5
    ? [{ y0: 0, y1: 9.8, sill: 1.4, head: 8.6 }, ...evenRows(9.8, y1, 4.0)]
    : evenRows(y0, y1, 3.95);
  const volume = (poly, yLo, yHi) => {
    for (const e of polyEdges(poly)) {
      const hidden = pointInPoly([(e.a[0] + e.b[0]) / 2 + e.n[0] * 0.3, (e.a[1] + e.b[1]) / 2 + e.n[1] * 0.3], TOWER);
      wall(M, near, { ...style, a: e.a, b: e.b, n: e.n, rows: hidden ? [] : rowsFor(yLo, yHi), yLo, yHi, solid: hidden, tag: ++serial });
    }
    M.get('roof').cap(poly, yHi, true);
    // A cornice course at the head of every exposed wall: 0.7 m proud, 0.9 m deep.
    const stone = M.get('stone');
    for (const e of polyEdges(poly)) {
      if (pointInPoly([(e.a[0] + e.b[0]) / 2 + e.n[0] * 0.3, (e.a[1] + e.b[1]) / 2 + e.n[1] * 0.3], TOWER)) continue;
      const P = (s, y, r) => [e.a[0] + e.t[0] * s + e.n[0] * r, y, e.a[1] + e.t[1] * s + e.n[1] * r], N = [e.n[0], 0, e.n[1]];
      stone.quad(P(0, yHi - 0.9, 0.7), P(e.len, yHi - 0.9, 0.7), P(e.len, yHi + 0.1, 0.7), P(0, yHi + 0.1, 0.7), N);            // cornice face
      stone.quad(P(0, yHi + 0.1, 0.7), P(e.len, yHi + 0.1, 0.7), P(e.len, yHi + 0.1, 0), P(0, yHi + 0.1, 0), [0, 1, 0]);        // its top
      stone.quad(P(0, yHi - 0.9, 0), P(e.len, yHi - 0.9, 0), P(e.len, yHi - 0.9, 0.7), P(0, yHi - 0.9, 0.7), [0, -1, 0]);       // its soffit
    }
  };
  volume(HERITAGE.base.poly, 0, HERITAGE.base.top);
  for (const t of HERITAGE.tiers) volume(t.poly, t.from, t.to);
}

// Roof plant (estimated: photographs show a low, plain roof) and the two red logos.
function roofTop(M) {
  const metal = M.get('metal'), roof = M.get('roof'), deck = ROOF_Y - RIM;
  metal.box(-7.0, deck, -9.0, 5.0, deck + 2.6, 9.0);
  roof.box(-7.0, deck + 2.6, -9.0, 5.0, deck + 2.7, 9.0);
  metal.box(8.0, deck, -14.0, 12.0, deck + 1.6, -8.0);
  metal.box(-14.0, deck, 6.0, -10.0, deck + 1.6, 12.0);
}

function logo(M, { uPlane, sgn, vCenter, yCenter, height = 9.6, w = 1.3 }) {
  const r = (height - w) / 4, path = [];
  for (let a = 30; a <= 270; a += 10) path.push([r * Math.cos(a * Math.PI / 180), r + r * Math.sin(a * Math.PI / 180)]);
  for (let a = 80; a >= -150; a -= 10) path.push([r * Math.cos(a * Math.PI / 180), -r + r * Math.sin(a * Math.PI / 180)]);
  const sign = M.get('sign'), u = uPlane + sgn * 0.12;
  const pt = (s, y) => [u, yCenter + y, vCenter - sgn * s];
  // Offset every vertex of the centreline along the mean of its two segment normals so the
  // ribbon has clean joints (per-segment quads leave a tooth on every bend).
  const seg = path.slice(1).map(([x1, y1], i) => { const [x0, y0] = path[i], dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy); return [-dy / l, dx / l]; });
  const side = path.map(([x, y], i) => {
    const a = seg[Math.max(0, i - 1)], b = seg[Math.min(seg.length - 1, i)];
    let nx = a[0] + b[0], ny = a[1] + b[1]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    return [pt(x + nx * w / 2, y + ny * w / 2), pt(x - nx * w / 2, y - ny * w / 2)];
  });
  for (let i = 0; i + 1 < side.length; i++) sign.quad(side[i][0], side[i][1], side[i + 1][1], side[i + 1][0], [sgn, 0, 0]);
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  serial = 0;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), M = new Meshes();
  tower(M, near); wings(M, near); heritage(M, near); roofTop(M);
  // The mark sits on the full-height end bay of each band, three floors below the roof.
  logo(M, { uPlane: BANDS.west.uOuter, sgn: -1, vCenter: (BANDS.west.vEdges[12] + BANDS.west.vTo) / 2, yCenter: ROOF_Y - 11 });
  logo(M, { uPlane: BANDS.east.uOuter, sgn: 1, vCenter: (BANDS.east.vFrom + BANDS.east.vEdges[0]) / 2, yCenter: ROOF_Y - 11 });
  const phi = SPEC.siteAngleDeg * Math.PI / 180;
  // Near meshes are cut into chunks of under 65 000 vertices: 16-bit indices halve the index bytes.
  for (const [name, quads] of M) { const parts = near ? splitByVertices(quads.toGeometry(phi), 60000) : [quads.toGeometry(phi)]; parts.forEach((g, chunk) => b.put(g, name, chunk)); }
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // buildings carry no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level. The tower stands on grade; below-grade levels and the plaza are not modelled.';
  return root;
}
