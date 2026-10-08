import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import {
  PHI, world, WING, EAST, WEST, MID, EAST_U, WEST_U, MID_U, CLOCK, ASTRO,
} from './oslo-city-hall-plan.js';

const OUT = { s: [0, 0, 1], n: [0, 0, -1], e: [1, 0, 0], w: [-1, 0, 0] };

function sink(b) {
  const batches = new Map();
  function quad(mat, pts, face) {
    const outward = OUT[face];
    const [p0, p1, p2, p3] = pts;
    const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
    const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];
    const dot = (ay * bz - az * by) * outward[0] + (az * bx - ax * bz) * outward[1] + (ax * by - ay * bx) * outward[2];
    const order = dot >= 0 ? [p0, p1, p2, p3] : [p0, p3, p2, p1];
    let batch = batches.get(mat);
    if (!batch) { batch = { pos: [], idx: [] }; batches.set(mat, batch); }
    const base = batch.pos.length / 3;
    for (const p of order) batch.pos.push(p[0], p[1], p[2]);
    batch.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  function flush() {
    for (const [mat, batch] of batches) {
      if (!batch.idx.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(batch.pos, 3));
      g.setIndex(batch.idx);
      g.computeVertexNormals();
      b.put(g, mat);
    }
    batches.clear();
  }
  return { quad, flush };
}

function at(face, u, y, v, proud) {
  if (face === 's') return [u, y, -(v - proud)];
  if (face === 'n') return [u, y, -(v + proud)];
  if (face === 'e') return [u + proud, y, -v];
  return [u - proud, y, -v];
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const q = sink(b);
  const mass = (mat, u0, u1, v0, v1, y0, y1) => b.box(mat, [(u0 + u1) / 2, (y0 + y1) / 2, -((v0 + v1) / 2)], [u1 - u0, y1 - y0, v1 - v0]);

  function faceBox(mat, face, u, y, v, w, h, depth, outer) {
    const c = at(face, u, y, v, outer - depth / 2);
    b.box(mat, c, face === 'e' || face === 'w' ? [depth, h, w] : [w, h, depth]);
  }
  function faceQuad(mat, face, u, y, v, w, h, proud) {
    const c = at(face, u, y, v, proud);
    const hw = w / 2, hh = h / 2;
    const pts = face === 'e' || face === 'w'
      ? [[c[0], c[1] - hh, c[2] - hw], [c[0], c[1] - hh, c[2] + hw], [c[0], c[1] + hh, c[2] + hw], [c[0], c[1] + hh, c[2] - hw]]
      : [[c[0] - hw, c[1] - hh, c[2]], [c[0] + hw, c[1] - hh, c[2]], [c[0] + hw, c[1] + hh, c[2]], [c[0] - hw, c[1] + hh, c[2]]];
    q.quad(mat, pts, face);
  }
  function band(mat, face, fixed, a0, a1, y, height, outer, depth) {
    const a = (a0 + a1) / 2, w = Math.abs(a1 - a0);
    const u = face === 'e' || face === 'w' ? fixed : a;
    const v = face === 'e' || face === 'w' ? a : fixed;
    faceBox(mat, face, u, y, v, w, height, depth, outer);
  }
  // A window. `rich` frames are boxes (street faces); the far grid and the long
  // sides use quads. Mullions are near-only and stay inside the opening.
  function win(face, u, v, y, w, h, rich) {
    faceQuad('glass', face, u, y, v, w - 0.28, h - 0.28, 0.16);
    const ft = 0.16, fd = 0.14, outer = 0.52;
    if (rich) {
      faceBox('stone', face, u, y - h / 2 + ft / 2, v, w, ft, fd, outer);
      faceBox('stone', face, u, y + h / 2 - ft / 2, v, w, ft, fd, outer);
      faceBox('stone', face, face === 'e' || face === 'w' ? u : u - w / 2 + ft / 2, y, face === 'e' || face === 'w' ? v - w / 2 + ft / 2 : v, ft, h - ft * 2, fd, outer);
      faceBox('stone', face, face === 'e' || face === 'w' ? u : u + w / 2 - ft / 2, y, face === 'e' || face === 'w' ? v + w / 2 - ft / 2 : v, ft, h - ft * 2, fd, outer);
      if (near) {
        faceQuad('stone', face, u, y, v, 0.08, h - 0.46, 0.32);
        faceQuad('stone', face, u, y, v, w - 0.46, 0.08, 0.32);
      }
    } else if (near) {
      faceQuad('stone', face, u, y - h / 2 + ft / 2, v, w, ft, 0.30);
      faceQuad('stone', face, u, y + h / 2 - ft / 2, v, w, ft, 0.30);
      const jambV = face === 'e' || face === 'w';
      faceQuad('stone', face, jambV ? u : u - w / 2 + ft / 2, y, jambV ? v - w / 2 + ft / 2 : v, ft, h, 0.30);
      faceQuad('stone', face, jambV ? u : u + w / 2 - ft / 2, y, jambV ? v + w / 2 - ft / 2 : v, ft, h, 0.30);
    } else {
      faceQuad('glass', face, u, y, v, w, h, 0.22);
    }
  }
  function cols(face, fixed, a0, pitch, n, y0, y1, w, h, stepY, rich) {
    const rows = [];
    for (let y = y0; y <= y1 + 1e-6; y += stepY) rows.push(y);
    const use = near ? rows : rows.filter((_, i) => i % 2 === 0);
    for (let i = 0; i < n; i++) {
      const a = a0 + i * pitch;
      const u = face === 'e' || face === 'w' ? fixed : a;
      const v = face === 'e' || face === 'w' ? a : fixed;
      for (const y of use) win(face, u, v, y, w, h, rich && near);
    }
  }
  function slot(face, u, v, y0, y1, w) {
    const y = (y0 + y1) / 2, h = y1 - y0;
    faceQuad('glass', face, u, y, v, w, h, 0.16);
    faceBox('stone', face, face === 'e' || face === 'w' ? u : u - w / 2 - 0.16, y, face === 'e' || face === 'w' ? v - w / 2 - 0.16 : v, 0.32, h + 0.4, 0.16, 0.58);
    faceBox('stone', face, face === 'e' || face === 'w' ? u : u + w / 2 + 0.16, y, face === 'e' || face === 'w' ? v + w / 2 + 0.16 : v, 0.32, h + 0.4, 0.16, 0.58);
  }
  function disc(mat, face, u, y, v, r, segs, proud) {
    const c = at(face, u, y, v, proud);
    const pos = [c[0], c[1], c[2]], idx = [];
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const du = Math.cos(a) * r, dy = Math.sin(a) * r;
      if (face === 'e' || face === 'w') pos.push(c[0], c[1] + dy, c[2] + du);
      else pos.push(c[0] + du, c[1] + dy, c[2]);
    }
    for (let i = 1; i <= segs; i++) idx.push(0, i, i + 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const n = g.attributes.normal;
    const want = OUT[face];
    if (n.getX(0) * want[0] + n.getY(0) * want[1] + n.getZ(0) * want[2] < 0) {
      for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
      g.setIndex(idx); g.computeVertexNormals();
    }
    b.put(g, mat);
  }
  function hand(face, u, y, v, len, ang, proud) {
    const g = new THREE.BoxGeometry(0.18, len, 0.05);
    g.translate(0, len / 2 * 0.72, 0);
    if (face === 'e' || face === 'w') g.rotateX(ang); else g.rotateZ(ang);
    const c = at(face, u, y, v, proud);
    g.translate(c[0], c[1], c[2]);
    b.put(g, 'brass');
  }
  function clock(face, u, v, y, r) {
    const segs = near ? 28 : 14;
    disc('brass', face, u, y, v, r + 0.28, segs, 0.40);
    disc('glow', face, u, y, v, r, segs, 0.52);
    hand(face, u, y, v, r * 0.62, -0.7, 0.64);
    hand(face, u, y, v, r * 0.9, 0.55, 0.68);
    if (near) {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const du = Math.cos(a) * (r - 0.45), dy = Math.sin(a) * (r - 0.45);
        const uu = face === 'e' || face === 'w' ? u : u + du;
        const vv = face === 'e' || face === 'w' ? v + du : v;
        faceBox('brass', face, uu, y + dy, vv, 0.12, 0.42, 0.06, 0.60);
      }
    }
  }
  // A relief panel: a stone field with raised brass bars. The bars vary in
  // height so the panel reads as sculpture, not a painted sign.
  function frieze(face, u, y, v, w, h) {
    faceBox('stone', face, u, y, v, w, h, 0.16, 0.62);
    const n = 7;
    for (let i = 0; i < n; i++) {
      const du = -w * 0.36 + (w * 0.72 * i) / (n - 1);
      const hh = h * (0.45 + ((i * 3) % 5) * 0.08);
      const uu = face === 'e' || face === 'w' ? u : u + du;
      const vv = face === 'e' || face === 'w' ? v + du : v;
      faceBox('brass', face, uu, y - h * 0.08, vv, 0.55, hh, 0.1, 0.78);
    }
  }
  // Dark vertical recesses with brick piers in front, then blank brick to a flat top.
  function loggia(face, tower, y0, y1) {
    const fixed = face === 's' ? tower.v0 : face === 'n' ? tower.v1 : face === 'e' ? tower.u1 : tower.u0;
    const alongV = face === 'e' || face === 'w';
    const a0 = alongV ? tower.v0 + 1.8 : tower.u0 + 1.3;
    const a1 = alongV ? tower.v1 - 1.8 : tower.u1 - 1.3;
    const n = near ? (alongV ? 8 : 5) : (alongV ? 4 : 3);
    const y = (y0 + y1) / 2, h = y1 - y0;
    const place = (a) => alongV ? [fixed, a] : [a, fixed];
    for (let i = 0; i < n; i++) {
      const [u, v] = place(a0 + (a1 - a0) * (i + 0.5) / n);
      faceQuad('glass', face, u, y, v, ((a1 - a0) / n) * 0.58, h * 0.9, 0.06);
    }
    const pier = ((a1 - a0) / n) * 0.34;
    for (let i = 0; i <= n; i++) {
      const [u, v] = place(a0 + (a1 - a0) * i / n);
      faceBox('brick', face, u, y, v, pier, h + 0.2, 0.16, 0.36);
    }
  }

  // --- masses. Towers and the link overlap the wing by a few decimetres so the shared faces stay buried.
  mass('brick', WING.u0, WING.u1, WING.v0, WING.v1, 0, WING.roof - 0.15);
  // Flat roof, inset. A brick parapet stands proud of it on all four sides.
  mass('copper', WING.u0 + 1.7, WING.u1 - 1.7, WING.v0 + 1.9, WING.v1 - 1.5, WING.roof - 0.45, WING.roof);
  const lip = 0.08, thick = 1.25, y0 = WING.roof - 0.4;
  mass('brick', WING.u0 - lip, WING.u1 + lip, WING.v0 - lip, WING.v0 + thick, y0, WING.wall);
  mass('brick', WING.u0 - lip, WING.u1 + lip, WING.v1 - thick, WING.v1 + lip, y0, WING.wall);
  mass('brick', WING.u0 - lip, WING.u0 + thick, WING.v0 + thick, WING.v1 - thick, y0, WING.wall);
  mass('brick', WING.u1 - thick, WING.u1 + lip, WING.v0 + thick, WING.v1 - thick, y0, WING.wall);
  mass('brick', WEST.u0, WEST.u1, WEST.v0, WEST.v1, 0, WEST.h);
  mass('brick', EAST.u0, EAST.u1, EAST.v0, EAST.v1, 0, EAST.h);
  mass('brick', MID.u0, MID.u1, MID.v0, MID.v1, 0, MID.h);
  mass('stone', MID.u0 + 0.3, MID.u1 - 0.3, MID.v1 - 0.8, MID.v1 + 0.15, MID.h - 0.7, MID.h + 0.15);

  // Stone base and the harbour colonnade.
  band('stone', 's', WING.v0, WING.u0, WING.u1, 6.35, 0.7, 0.55, 0.28);
  // Continuous sills and lintels: a lower row, then the taller upper band, then parapet.
  for (const [y, h, outer] of [[7.7, 0.32, 0.4], [12.15, 0.34, 0.44], [14.7, 0.32, 0.4], [19.9, 0.46, 0.5]]) {
    band('stone', 's', WING.v0, WING.u0 + 0.3, WING.u1 - 0.3, y, h, outer, 0.16);
    band('stone', 'e', WING.u1, WING.v0 + 0.4, 39.4, y, h * 0.8, outer * 0.8, 0.14);
    band('stone', 'w', WING.u0, WING.v0 + 0.4, 39.4, y, h * 0.8, outer * 0.8, 0.14);
  }
  const piers = near ? 16 : 8;
  const span = WING.u1 - WING.u0 - 2.2;
  for (let i = 0; i < piers; i++) {
    const u = WING.u0 + 1.1 + (span * i) / (piers - 1);
    faceBox('stone', 's', u, 3.15, WING.v0, near ? 1.05 : 1.35, 5.5, 0.72, 0.9);
  }
  faceQuad('glass', 's', (WING.u0 + WING.u1) / 2, 3.2, WING.v0, WING.u1 - WING.u0 - 1.4, 4.8, 0.16);

  // Harbour frieze: a stone field with staggered brass uprights, not a flat panel.
  frieze('s', -8.3, 13.45, WING.v0, 9.6, 2.15);

  // Wing windows. South is the driver's view from Rådhusplassen: two tall rows
  // between the stone courses, not a grid of small squares. The parapet above is blank.
  const southStep = near ? 3.7 : 7.4;
  for (let u = WING.u0 + 2.6; u < WING.u1 - 1.4; u += southStep) {
    win('s', u, WING.v0, 9.9, 1.85, 3.55, near);
    win('s', u, WING.v0, 17.25, 1.95, 4.2, near);
  }
  cols('e', WING.u1, WING.v0 + 2.4, near ? 3.8 : 7.6, near ? 9 : 5, 9.2, 18.4, 1.55, 3.4, near ? 7.6 : 8, false);
  cols('w', WING.u0, WING.v0 + 2.4, near ? 3.8 : 7.6, near ? 9 : 5, 9.2, 18.4, 1.55, 3.4, near ? 7.6 : 8, false);

  // Towers. Short faces (harbour and plaza) carry the slot; the east harbour face carries the 8.6 m clock.
  const CROWN = { [EAST.h]: { y0: 57.2, y1: 62.3 }, [WEST.h]: { y0: 54.6, y1: 59.3 } };
  function towerShort(face, tower, withClock) {
    const uC = (tower.u0 + tower.u1) / 2;
    const v = face === 's' ? tower.v0 : tower.v1;
    const crown = tower === EAST ? CROWN[EAST.h] : CROWN[WEST.h];
    const yTop = crown.y0 - 1.2;
    const yLow = face === 's' ? 29.2 : 3.2;
    if (!withClock) slot(face, uC, v, yLow, yTop - 0.6, 2.9);
    const side = [-4.55, 4.55];
    const rows = [];
    for (let y = yLow + 1.3; y < yTop - 1.2; y += near ? 3.15 : 6.3) rows.push(y);
    for (const du of side) {
      for (const y of rows) {
        if (withClock && y > CLOCK.y - CLOCK.r - 0.8 && y < CLOCK.y + CLOCK.r + 0.6) continue;
        win(face, uC + du, v, y, 1.55, 2.15, true);
      }
    }
    if (withClock) {
      const below = rows.filter((y) => y < CLOCK.y - CLOCK.r - 1);
      const show = near ? below : below.filter((_, i) => i % 2 === 0);
      for (const y of show) win(face, uC, v, y, 1.7, 2.15, true);
    }
    band('stone', face, v, tower.u0 + 0.4, tower.u1 - 0.4, crown.y0 - 0.4, 0.32, 0.34, 0.14);
    band('stone', face, v, tower.u0 + 0.2, tower.u1 - 0.2, tower.h - 0.45, 0.4, 0.28, 0.14);
    band('brick', face, v, tower.u0 + 0.8, tower.u1 - 0.8, 1.15, 1.5, 0.28, 0.2);
    loggia(face, tower, crown.y0, crown.y1);
  }
  towerShort('s', WEST, false);
  towerShort('n', WEST, false);
  towerShort('s', EAST, true);
  towerShort('n', EAST, false);
  clock('s', CLOCK.u, CLOCK.v, CLOCK.y, CLOCK.r);

  function towerLong(face, tower) {
    const u = face === 'e' ? tower.u1 : tower.u0;
    const inner = (tower === WEST && face === 'e') || (tower === EAST && face === 'w');
    const crown = tower === EAST ? CROWN[EAST.h] : CROWN[WEST.h];
    const vCourt0 = MID.v1 + 1.1;
    const pitch = near ? 3.5 : 7;
    const yHi = crown.y0 - 1.4;
    const nCourt = Math.max(2, Math.floor((tower.v1 - 1.4 - vCourt0) / pitch));
    cols(face, u, vCourt0, pitch, nCourt, 3.4, yHi, 1.2, 2.2, near ? 3.2 : 6.4, false);
    if (!inner) cols(face, u, tower.v0 + 1.6, pitch, Math.max(2, Math.floor((MID.v1 - tower.v0 - 2) / pitch)), 3.4, yHi, 1.2, 2.2, near ? 3.2 : 6.4, false);
    else cols(face, u, tower.v0 + 1.6, pitch, Math.max(1, Math.floor((MID.v1 - tower.v0 - 2) / pitch)), MID.h + 1.4, yHi, 1.2, 2.2, near ? 3.2 : 6.4, false);
    band('stone', face, u, tower.v0 + 0.3, tower.v1 - 0.3, crown.y0 - 0.4, 0.3, 0.32, 0.14);
    band('stone', face, u, tower.v0 + 0.2, tower.v1 - 0.2, tower.h - 0.45, 0.38, 0.26, 0.12);
    loggia(face, tower, crown.y0, crown.y1);
  }
  towerLong('w', WEST);
  towerLong('e', WEST);
  towerLong('w', EAST);
  towerLong('e', EAST);

  // Courtyard link: entrance, the relief, the 5 m astronomical clock.
  const doorY = 5.4;
  faceQuad('glass', 'n', MID_U, doorY, MID.v1, 6.2, 7.4, 0.2);
  faceBox('stone', 'n', MID_U, 9.35, MID.v1, 8.2, 0.7, 0.35, 0.7);
  faceBox('stone', 'n', MID_U - 3.5, doorY, MID.v1, 0.7, 8.2, 0.4, 0.72);
  faceBox('stone', 'n', MID_U + 3.5, doorY, MID.v1, 0.7, 8.2, 0.4, 0.72);
  frieze('n', MID_U, 13.7, MID.v1, 11.2, 3.6);
  clock('n', ASTRO.u, ASTRO.v, ASTRO.y, ASTRO.r);
  for (const u of [MID_U - 10.2, MID_U - 7.4, MID_U + 7.4, MID_U + 10.2]) {
    const ys = near ? [4.2, 8.2, 17.4, 21.2, 26.4, 29.6] : [4.2, 17.4, 26.4];
    for (const y of ys) win('n', u, MID.v1, y, 1.45, 2.05, true);
  }
  mass('stone', -22.6, 6.6, 53.4, 71.4, 0, 1.05);

  // North approach steps, inset from the mapped stair parts.
  prism(b, 'stone', [[-23.4, 56], [-20.5, 56], [-20.5, 94.5], [-26.4, 94.5], [-26.4, 89.2], [-23.4, 89.2]], 0, 0.7);
  prism(b, 'stone', [[-23.2, 53.2], [-15.4, 53.2], [-15.4, 56.2], [-23.2, 56.2]], 0.55, 1.15);
  prism(b, 'stone', [[3.6, 56], [7.0, 56], [7.0, 89.2], [9.4, 89.2], [9.4, 94.5], [3.6, 94.5]], 0, 0.7);
  prism(b, 'stone', [[-2.6, 53.2], [6.6, 53.2], [6.6, 56.2], [-2.6, 56.2]], 0.55, 1.15);

  q.flush();
  const root = b.finish();
  root.rotation.y = PHI;
  root.userData.world = world;
  return root;
}

function prism(b, mat, ring, y0, y1) {
  const n = ring.length;
  const pos = [];
  for (const y of [y0, y1]) for (const [u, v] of ring) pos.push(u, y, -v);
  const idx = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    idx.push(i, j, j + n, i, j + n, i + n);
  }
  for (let i = 1; i < n - 1; i++) idx.push(n, n + i, n + i + 1);
  let cx = 0, cz = 0;
  for (const [u, v] of ring) { cx += u; cz += -v; }
  cx /= n; cz /= n;
  const ax = pos[3] - pos[0], az = pos[5] - pos[2];
  const bx = pos[(1 % n) * 3] - pos[0], bz = pos[(1 % n) * 3 + 2] - pos[2];
  // Side 0 normal (right-hand on i -> j -> j+n). Flip the whole shell if it points inward.
  const j = 1;
  const sx = pos[j * 3] - pos[0], sz = pos[j * 3 + 2] - pos[2];
  const tx = pos[(j + n) * 3] - pos[0], tz = pos[(j + n) * 3 + 2] - pos[2];
  const nx = sz * (pos[(0 + n) * 3 + 1] - pos[1]) - (pos[j * 3 + 1] - pos[1]) * tz;
  void ax; void az; void bx; void bz; void sx; void tx; void nx;
  const ey = pos[(0 + n) * 3 + 1] - pos[1];
  const nx0 = sz * ey - (pos[j * 3 + 1] - pos[1]) * tz;
  const nz0 = (pos[j * 3 + 1] - pos[1]) * tx - sx * ey;
  const mx = (pos[0] + pos[j * 3]) / 2 - cx, mz = (pos[2] + pos[j * 3 + 2]) / 2 - cz;
  if (nx0 * mx + nz0 * mz < 0) {
    for (let k = 0; k < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  b.put(g, mat);
}
