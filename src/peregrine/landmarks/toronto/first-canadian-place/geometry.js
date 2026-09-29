import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { SITE, TOWER, site } from './first-canadian-place-site.js';
import { wordGeometry, roundelGeometry, markGeometry, WORD_ADVANCE } from './first-canadian-place-logo.js';

// First Canadian Place, as it stands since the 2009-2012 recladding: a slab of white frit
// glass spandrels between narrow dark window strips, a square pocket cut out of each
// corner and glazed bronze, a plain white mechanical band carrying the BMO wordmark and
// roundel on every face, a rooftop penthouse and two broadcast masts. The podium wings and
// the bank pavilion at King and Bay stay provider geometry (see footprint.js).
// Frame: +X east, +Y up, +Z south. Authoring axes (u, v) are rotated by SITE.angle.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const { hu, hv, notchU: nu, notchV: nv } = SITE, T = TOWER;
  const put = (g, mat) => b.put(g, mat);
  // A box in site axes: size is [along u, up, along v]; rot turns it in the (u, v) plane.
  const box = (mat, u, y, v, w, h, d, rot = 0) => b.box(mat, site(u, y, v), [w, h, d], -(SITE.angle + rot));
  const bar = (mat, a, c, w, d = w, round = false) => b.bar(mat, site(...a), site(...c), w, d, 0, round);

  const floorH = (T.roof - T.crown - T.base) / T.floors, spandrelH = floorH - T.windowH;
  const windowTop = T.roof - T.crown;
  const bays = (len) => Math.max(1, Math.round(len / T.bay));

  // The four flat faces between the corner pockets. n is the outward normal, r the direction
  // a viewer facing the face sees as "right", c the face centre, all in (u, v).
  // right x up = outward for every face.
  const FACES = [
    { name: 'south', n: [0, 1], r: [1, 0], c: [0, hv], len: 2 * (hu - nu) },
    { name: 'east', n: [1, 0], r: [0, -1], c: [hu, 0], len: 2 * (hv - nv) },
    { name: 'north', n: [0, -1], r: [-1, 0], c: [0, -hv], len: 2 * (hu - nu) },
    { name: 'west', n: [-1, 0], r: [0, 1], c: [-hu, 0], len: 2 * (hv - nv) },
  ];
  for (const f of FACES) f.rot = Math.atan2(f.r[1], f.r[0]);
  // Box on a face: a along r from the face centre, d along the outward normal.
  const onFace = (mat, f, a, y, d, w, h, t) => box(mat, f.c[0] + f.r[0] * a + f.n[0] * d, y, f.c[1] + f.r[1] * a + f.n[1] * d, w, h, t, f.rot);
  // Any geometry drawn in face-local (x right, y up, z outward) coordinates.
  const placeOnFace = (g, f, a, y, d = 0) => {
    const [rx, , rz] = site(f.r[0], 0, f.r[1]), [nx, , nz] = site(f.n[0], 0, f.n[1]);
    const [tx, , tz] = site(f.c[0] + f.r[0] * a + f.n[0] * d, 0, f.c[1] + f.r[1] * a + f.n[1] * d);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(new THREE.Vector3(rx, 0, rz), new THREE.Vector3(0, 1, 0), new THREE.Vector3(nx, 0, nz)).setPosition(tx, y, tz));
    return g;
  };
  // A vertical prism over a (u, v) outline, base to top.
  const prism = (outline, y0, y1, mat) => {
    const shape = new THREE.Shape(outline.map(([u, v]) => new THREE.Vector2(u, -v)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); g.rotateY(-SITE.angle); put(g, mat);
  };
  const quad = (p0, p1, p2, p3, mat, outward) => {
    // Wound so its normal points toward `outward` (a world-space direction).
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...p0, ...p1, ...p2, ...p3], 3));
    g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals();
    const n = g.attributes.normal;
    if (n.getX(0) * outward[0] + n.getY(0) * outward[1] + n.getZ(0) * outward[2] < 0) g.setIndex([0, 2, 1, 0, 3, 2]);
    g.computeVertexNormals(); put(g, mat);
  };

  // --- window core: dark glass, recessed behind the white spandrels; corner pockets cut out ---
  const recess = near ? T.recess : T.farStandoff, inset = near ? 0.4 : T.farStandoff;
  const a = hu - recess, c = hv - recess, pu = hu - nu - inset, pv = hv - nv - inset;
  const core = [];
  const corners = [[1, -1], [1, 1], [-1, 1], [-1, -1]]; // NE, SE, SW, NW in loop order
  for (const [su, sv] of corners) {
    const p1 = [su * pu, sv * c], p2 = [su * pu, sv * pv], p3 = [su * a, sv * pv];
    core.push(...(su * sv < 0 ? [p1, p2, p3] : [p3, p2, p1]));
  }
  prism(core, 0, T.roof - 0.4, 'glass');

  // --- corner pockets: two bronze curtain-wall faces each, full height ---------------------
  for (const [su, sv] of corners) {
    // Wall A runs along v at the end of the flat u-face's neighbour; wall B runs along u at the pocket back.
    const walls = [
      { n: [su, 0], c: [su * (hu - nu), sv * (hv - nv / 2)], len: nv },
      { n: [0, sv], c: [su * (hu - nu / 2), sv * (hv - nv)], len: nu },
    ];
    for (const w of walls) {
      const rot = Math.atan2(w.n[0], -w.n[1]); // local x along the wall, perpendicular to its normal
      const th = near ? 0.3 : T.farStandoff - 0.1, ox = w.n[0] * -th / 2, oy = w.n[1] * -th / 2; // plate outer face on the wall line
      box('bronze', w.c[0] + ox, T.roof / 2 - 0.2, w.c[1] + oy, w.len, T.roof - 0.4, th, rot);
      if (!near) continue;
      const fx = w.n[0] * 0.06, fy = w.n[1] * 0.06;
      for (let i = 0; i < T.floors; i++) box('mullion', w.c[0] + fx, T.base + i * floorH + T.windowH + 0.06, w.c[1] + fy, w.len - 0.1, 0.14, 0.06, rot);
      const count = Math.round(w.len / T.bay);
      for (let k = 1; k < count; k++) {
        const s = -w.len / 2 + (k / count) * w.len;
        box('mullion', w.c[0] + fx + Math.cos(rot) * s, (T.base + windowTop) / 2, w.c[1] + fy + Math.sin(rot) * s, 0.07, windowTop - T.base, 0.06, rot);
      }
    }
  }

  // --- white edge fins framing every pocket ---------------------------------------------
  for (const f of FACES) for (const end of [-1, 1]) {
    onFace('frit', f, end * (f.len / 2 - 0.3), (T.base + T.roof) / 2, -0.2, 0.6, T.roof - T.base, 0.9);
  }

  // --- the facade: one spandrel band per floor per face ------------------------------------
  for (let i = 0; i < T.floors; i++) {
    const yc = T.base + i * floorH + T.windowH + spandrelH / 2;
    for (const f of FACES) {
      if (near) { onFace('frit', f, 0, yc, -0.25, f.len - 1.2, spandrelH, 0.5); continue; }
      const y0 = yc - spandrelH / 2, y1 = yc + spandrelH / 2, half = f.len / 2 - 0.6, [nx, , nz] = site(f.n[0], 0, f.n[1]);
      const P = (s, y) => site(f.c[0] + f.r[0] * s, y, f.c[1] + f.r[1] * s);
      quad(P(-half, y0), P(half, y0), P(half, y1), P(-half, y1), 'frit', [nx, 0, nz]);
    }
  }
  // Plain white mechanical band under the roof.
  for (const f of FACES) onFace('frit', f, 0, T.roof - T.crown / 2, -0.25, f.len - 1.2, T.crown, 0.5);
  // The lobby storeys are glazed; the stone piers between are pale.
  if (near) for (const f of FACES) {
    const count = Math.round(f.len / 6);
    for (let k = 0; k <= count; k++) onFace('concrete', f, -f.len / 2 + 0.6 + (k / count) * (f.len - 1.2), T.base / 2, -0.1, 0.9, T.base, 0.6);
  }

  // --- vertical mullions across spandrels and window strips (near) -------------------------
  if (near) for (const f of FACES) {
    const n = bays(f.len - 1.2);
    for (let k = 1; k < n; k++) {
      onFace('mullion', f, -(f.len - 1.2) / 2 + (k / n) * (f.len - 1.2), (T.base + windowTop) / 2, 0.02, 0.09, windowTop - T.base, 0.14);
    }
  }

  // --- a few lit offices, visible only at night (glow is the average shaded window colour by day) -
  if (near) {
    const lit = (i, k, j) => ((i * 7919 + k * 104729 + j * 1299709) >>> 0) % 100 < 3;
    for (let fi = 0; fi < FACES.length; fi++) {
      const f = FACES[fi], n = bays(f.len - 1.2), w = (f.len - 1.2) / n, [nx, , nz] = site(f.n[0], 0, f.n[1]);
      for (let i = 0; i < T.floors; i++) for (let k = 0; k < n; k++) {
        if (!lit(i, k, fi)) continue;
        const y0 = T.base + i * floorH + 0.12, a0 = -(f.len - 1.2) / 2 + k * w + 0.12, a1 = a0 + w - 0.24;
        const P = (s, y) => site(f.c[0] + f.r[0] * s + f.n[0] * (-T.recess + 0.06), y, f.c[1] + f.r[1] * s + f.n[1] * (-T.recess + 0.06));
        quad(P(a0, y0), P(a1, y0), P(a1, y0 + T.windowH - 0.24), P(a0, y0 + T.windowH - 0.24), 'glow', [nx, 0, nz]);
      }
    }
  }

  // --- roof, penthouse, equipment, masts -----------------------------------------------
  prism(core.map(([u, v]) => [u * (hu - 0.6) / hu, v * (hv - 0.6) / hv]), T.roof - 0.5, T.roof, 'roof');
  const P = T.penthouse, ph = T.top - 0.3 - T.roof;
  box('frit', P.u, T.roof + ph / 2, P.v, P.w, ph, P.d);
  box('roof', P.u, T.top - 0.15, P.v, P.w + 0.4, 0.3, P.d + 0.4);
  const top = T.top; // the penthouse cap tops out at the published architectural height
  if (near) {
    for (const [du, dv, w, h, d] of [[-7, -5, 4.5, 1.8, 3], [-1, -6, 3.5, 1.4, 2.6], [5, 4, 5, 1.6, 3.2], [-9, 4, 2.4, 2.4, 2.4]]) box('metal', P.u + du, top + h / 2, P.v + dv, w, h, d);
  }
  const mast = (u, v, y0, y1, w0, w1, legs = 0.14) => {
    if (!near) legs = Math.max(legs, 0.36); // thicker legs keep the needle visible at distance
    const panels = near ? Math.max(3, Math.round((y1 - y0) / 4.2)) : 3;
    const w = (y) => w0 + (w1 - w0) * (y - y0) / (y1 - y0);
    for (let p = 0; p < panels; p++) {
      const ya = y0 + (y1 - y0) * p / panels, yb = y0 + (y1 - y0) * (p + 1) / panels, wa = w(ya) / 2, wb = w(yb) / 2;
      for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) bar('metal', [u + su * wa, ya, v + sv * wa], [u + su * wb, yb, v + sv * wb], legs);
      if (!near) continue;
      const ring = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
      for (let s = 0; s < 4; s++) {
        const [au, av] = ring[s], [bu, bv] = ring[(s + 1) % 4];
        bar('metal', [u + au * wb, yb, v + av * wb], [u + bu * wb, yb, v + bv * wb], 0.08);
        bar('metal', [u + au * wa, ya, v + av * wa], [u + bu * wb, yb, v + bv * wb], 0.06);
      }
    }
  };
  // Two comparable masts, about 16 m apart: a slim lattice mast with panel antennas to the 355 m tip,
  // and a heavier lattice mast carrying a white FM antenna tube.
  const A = T.mastA, B = T.mastB, aw0 = 2.6, aw1 = 1.7;
  mast(A.u, A.v, top, A.top - 8, aw0, aw1);
  bar('metal', [A.u, A.top - 8, A.v], [A.u, A.top, A.v], near ? 0.22 : 0.4, 0.22, true);
  mast(B.u, B.v, top, B.top - 16, 2.9, 2.1, 0.16);
  bar('paint', [B.u, B.top - 16, B.v], [B.u, B.top, B.v], 0.55, 0.55, true);
  if (near) {
    // Panel antennas on the slim lattice mast.
    for (let k = 0; k < 8; k++) {
      const y = top + 8 + k * 5, w = aw0 + (aw1 - aw0) * (y - top) / (A.top - 8 - top);
      box('paint', A.u + w / 2 + 0.25, y, A.v, 0.3, 2.4, 0.8);
    }
  }

  // --- BMO wordmark and roundel on every face ------------------------------------------
  const yLogo = T.roof - T.crown / 2 - 0.2, L = T.logo;
  for (const f of FACES) {
    const left = -f.len / 2 + L.inset;
    if (near) {
      const word = wordGeometry('BMO', L.textH, L.depth);
      for (const g of word.parts) { placeOnFace(g, f, left, yLogo - L.textH / 2, 0.05); put(g, 'sign'); }
    } else {
      const g = new THREE.BoxGeometry(L.textH * WORD_ADVANCE, L.textH, L.depth); g.translate(L.textH * WORD_ADVANCE / 2, 0, L.depth / 2);
      placeOnFace(g, f, left, yLogo, 0.05); put(g, 'sign');
    }
    const textW = L.textH * WORD_ADVANCE, rx = left + textW + L.gap + L.roundel / 2;
    const disc = roundelGeometry(L.roundel, L.depth, near); placeOnFace(disc, f, rx, yLogo, 0.05); put(disc, 'lamp');
    if (near) for (const mark of markGeometry(L.roundel * 0.9, L.depth * 0.6)) { placeOnFace(mark, f, rx, yLogo + 0.05, 0.05 + L.depth); put(mark, 'light'); }
  }

  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return root;
}
