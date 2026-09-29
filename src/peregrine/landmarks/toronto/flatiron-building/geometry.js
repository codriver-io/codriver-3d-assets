import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { APEX, ARC, outline, wallFrame } from './flatiron-building-site.js';
import { sweepBand, arcBlock, cylinderSkin, capPolygon, onWall, wallPoint, wallAngle, archOutline } from './flatiron-building-parts.js';

// The Gooderham (Flatiron) Building, drawn in real metres around SPEC.origin
// (+X east, +Y up, +Z south) on the mapped wedge outline. Levels below are metres
// above grade and come from photographs measured against the published 16.7 m.
export const BRICK_IN = 0.4; // brick face sits this far inside the mapped footprint
export const RECESS = 0.5; // depth of the window recesses behind the brick face
export const LEVELS = {
  plinth: 2.0, // battered Ohio sandstone foundation
  windows: { f1: [2.6, 4.9], f2: [6.0, 8.2], f3: [9.9, 12.0], f4: [12.9, 15.0] },
  belt: [8.5, 9.3], // the string course that splits the north and south elevations
  archSpring: 14.5, archHoleBottom: 9.75,
  frieze: [15.45, 16.1], cornice: [16.0, 16.7], // 16.7 m is the published height
  mansardTop: 20.4, turretTop: 20.55, coneBase: 20.95, coneTip: 24.85, top: 26.0,
};
export const BAYS = { north: 11, south: 11, west: 4 }; // regular bays on each elevation
const SIDE_BAY = 1.7; // the single-window bay beside the apex on each long elevation
const ARM = 1.0; // solid corner pier at the west corners

const W = LEVELS.windows, L = LEVELS;
const deg = Math.PI / 180;
const lit = (a, b, c) => ((Math.imul(a + 1, 73856093) ^ Math.imul(b + 1, 19349663) ^ Math.imul(c + 1, 83492791)) >>> 0) % 4 === 0;

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, m) => b.put(g, m);
  const arcSteps = near ? 24 : 9;
  const ring = outline(BRICK_IN, arcSteps); // the brick face, clockwise from above
  const areaSign = (() => { let a = 0; for (let i = 0; i < ring.length; i++) { const p = ring[i], q = ring[(i + 1) % ring.length]; a += p[0] * q[1] - q[0] * p[1]; } return a >= 0 ? 1 : -1; })();
  const sweep = (m, profile, points = ring, opts = {}) => put(sweepBand(points, profile, { sign: areaSign, ...opts }), m);
  const R_b = APEX.r - BRICK_IN; // brick radius of the apex bows and the turret
  const frames = { north: wallFrame('north', BRICK_IN), south: wallFrame('south', BRICK_IN), west: wallFrame('west', BRICK_IN) };

  // Boxes and plates in wall-local (s along, y up, out from the brick face).
  const wbox = (m, F, s0, s1, y0, y1, o0, o1) => b.box(m, wallPoint(F, (s0 + s1) / 2, (y0 + y1) / 2, (o0 + o1) / 2), [s1 - s0, y1 - y0, o1 - o0], wallAngle(F));
  const wput = (g, m, F, s, out = 0) => put(onWall(g, F, s, out), m);

  // ---- massing: plinth, walls, string course, frieze, cornice, mansard, roof ----
  sweep('stone', [[0.35, 0], [0, L.plinth], [-RECESS, L.plinth]]);
  sweep(near ? 'recess' : 'brick', [[near ? -RECESS : 0, L.plinth], [near ? -RECESS : 0, L.frieze[1]]]);
  sweep('stone', [[-0.05, L.belt[0]], [0.33, L.belt[0]], [0.33, L.belt[0] + 0.2], [0.25, L.belt[0] + 0.36], [0.25, L.belt[1] - 0.24], [0.08, L.belt[1]], [-0.05, L.belt[1]]]);
  sweep('brick', [[-0.02, L.frieze[0]], [0.07, L.frieze[0]], [0.07, L.frieze[1]], [-0.02, L.frieze[1]]]);
  sweep('copper', [[0, L.cornice[0]], [0.32, L.cornice[0]], [0.4, L.cornice[0] + 0.12], [0.4, L.cornice[0] + 0.42], [0.3, L.cornice[0] + 0.55], [0.1, L.cornice[1]], [-0.1, L.cornice[1]]]);
  sweep('slate', [[-0.1, L.cornice[1]], [-1.5, L.mansardTop]]);
  put(capPolygon(outline(BRICK_IN + 1.5, arcSteps), L.mansardTop), 'roof');

  // ---- straight elevations: brick panels with true recessed openings ----
  function layout(name) {
    const F = frames[name], n = BAYS[name], items = [];
    let a, z;
    if (name === 'north') { a = SIDE_BAY; z = F.length - ARM; items.push({ s0: 0, s1: SIDE_BAY, type: 'side' }); }
    else if (name === 'south') { a = ARM; z = F.length - SIDE_BAY; items.push({ s0: F.length - SIDE_BAY, s1: F.length, type: 'side' }); }
    else { a = ARM; z = F.length - ARM; }
    const P = (z - a) / n;
    for (let i = 0; i < n; i++) items.push({ s0: a + i * P, s1: a + (i + 1) * P, type: 'bay', index: i });
    return { F, items, P, a, z };
  }
  const layouts = { north: layout('north'), south: layout('south'), west: layout('west') };

  const windowHoles = (w, type) => {
    const holes = [], cx = w / 2;
    if (type === 'side') {
      const hw = 0.36;
      for (const [y0, y1] of [W.f1, W.f2, W.f3, W.f4]) holes.push([[cx - hw, y0], [cx + hw, y0], [cx + hw, y1], [cx - hw, y1]]);
    } else {
      const hw = Math.min(0.85, 0.26 * w), aw = Math.min(0.9, 0.29 * w);
      holes.push([[cx - hw, W.f1[0]], [cx + hw, W.f1[0]], [cx + hw, W.f2[1]], [cx - hw, W.f2[1]]]);
      holes.push(archOutline(cx - aw, cx + aw, L.archHoleBottom, L.archSpring, 12));
    }
    return holes;
  };

  function bayPanel(F, item, wallIndex) {
    const w = item.s1 - item.s0;
    const y0 = L.plinth, y1 = L.frieze[1];
    const shape = new THREE.Shape([new THREE.Vector2(0, y0), new THREE.Vector2(w, y0), new THREE.Vector2(w, y1), new THREE.Vector2(0, y1)]);
    for (const h of windowHoles(w, item.type)) shape.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
    const g = new THREE.ExtrudeGeometry(shape, { depth: RECESS, bevelEnabled: false, steps: 1, curveSegments: 4 });
    g.translate(0, 0, -RECESS);
    wput(g, 'brick', F, item.s0);
  }

  // A double-hung window: dark frame plate, glass, meeting rail, stone sill. Wall-local.
  function windowRect(F, sc, y0, y1, width, material, sill = true, plane = -RECESS) {
    const o = plane;
    wbox('iron', F, sc - width / 2, sc + width / 2, y0, y1, o + 0.01, o + 0.04);
    wbox(material, F, sc - width / 2 + 0.07, sc + width / 2 - 0.07, y0 + 0.07, y1 - 0.07, o + 0.04, o + 0.06);
    if (near) {
      wbox('iron', F, sc - width / 2 + 0.05, sc + width / 2 - 0.05, (y0 + y1) / 2 - 0.03, (y0 + y1) / 2 + 0.03, o + 0.06, o + 0.09);
      if (width > 1.15) wbox('iron', F, sc - 0.03, sc + 0.03, y0 + 0.07, y1 - 0.07, o + 0.06, o + 0.09);
    }
    if (sill) wbox('stone', F, sc - width / 2 - 0.12, sc + width / 2 + 0.12, y0 - 0.13, y0, o, o + 0.3);
  }
  function windowArch(F, sc, y0, spring, width, material) {
    const o = -RECESS, rw = width / 2;
    let g = new THREE.ShapeGeometry(new THREE.Shape(archOutline(-rw, rw, y0, spring, 12).map(([x, y]) => new THREE.Vector2(x, y))));
    wput(g, 'iron', F, sc, o + 0.02);
    g = new THREE.ShapeGeometry(new THREE.Shape(archOutline(-rw + 0.07, rw - 0.07, y0 + 0.07, spring, 12).map(([x, y]) => new THREE.Vector2(x, y))));
    wput(g, material, F, sc, o + 0.035);
    if (near) {
      wbox('iron', F, sc - rw + 0.05, sc + rw - 0.05, spring - 0.03, spring + 0.03, o + 0.045, o + 0.075);
      wbox('iron', F, sc - 0.03, sc + 0.03, y0 + 0.07, spring + rw - 0.09, o + 0.045, o + 0.075);
    }
    wbox('stone', F, sc - rw - 0.12, sc + rw + 0.12, y0 - 0.13, y0, o, o + 0.3);
  }

  function hoodMould(F, sc, aw) {
    const rw = aw, spring = L.archSpring, ring1 = new THREE.Shape();
    ring1.absarc(0, spring, rw + 0.2, 0, Math.PI, false);
    ring1.lineTo(-rw, spring);
    ring1.absarc(0, spring, rw, Math.PI, 0, true);
    ring1.closePath();
    wput(new THREE.ExtrudeGeometry(ring1, { depth: 0.1, bevelEnabled: false, curveSegments: near ? 12 : 6 }), 'stone', F, sc, 0);
    for (const sd of [-1, 1]) wbox('stone', F, sc + sd * (rw + 0.1) - 0.11, sc + sd * (rw + 0.1) + 0.11, spring - 0.28, spring + 0.02, 0, 0.16);
  }

  if (near) {
    for (const [name, wallIndex] of [['north', 0], ['south', 1], ['west', 2]]) {
      const { F, items, P } = layouts[name];
      items.forEach((item) => {
        bayPanel(F, item, wallIndex);
        const sc = (item.s0 + item.s1) / 2, bay = item.type === 'side' ? -1 : item.index;
        const key = (floor) => (lit(wallIndex, bay, floor) ? 'glow' : 'glass');
        if (item.type === 'side') {
          [W.f1, W.f2, W.f3, W.f4].forEach(([y0, y1], f) => windowRect(F, sc, y0, y1, 0.72, key(f)));
        } else {
          const w = item.s1 - item.s0, hw = Math.min(0.85, 0.26 * w), aw = Math.min(0.9, 0.29 * w);
          windowRect(F, sc, W.f1[0], W.f1[1], hw * 2 - 0.16, key(0));
          windowRect(F, sc, W.f2[0], W.f2[1], hw * 2 - 0.16, key(1));
          windowRect(F, sc, W.f3[0], W.f3[1], aw * 2 - 0.5, key(2));
          windowArch(F, sc, W.f4[0], L.archSpring, aw * 2 - 0.5, key(3));
          hoodMould(F, sc, aw);
        }
      });
    }
    // Corner piers: solid brick round each west corner, mitred to the two walls.
    const unitv = (a, c) => { const dx = c[0] - a[0], dz = c[1] - a[1], l = Math.hypot(dx, dz); return [dx / l, dz / l]; };
    const at = (p, u, d) => [p[0] + u[0] * d, p[1] + u[1] * d];
    const last = ring.length - 1;
    for (const [corner, along, other] of [[ring[0], ring[1], ring[last]], [ring[last], ring[last - 1], ring[0]]]) {
      const pts = [at(corner, unitv(corner, along), ARM), corner, at(corner, unitv(corner, other), ARM)];
      sweep('brick', [[0, L.plinth], [0, L.frieze[1]]], pts, { closed: false });
    }
  } else {
    // Far: flat brick face with dark glass quads and no recesses.
    for (const name of ['north', 'south', 'west']) {
      const { F, items } = layouts[name];
      items.forEach((item) => {
        const sc = (item.s0 + item.s1) / 2, w = item.s1 - item.s0;
        const glass = (y0, y1, width) => wbox(lit(name.length, item.index ?? 9, Math.round(y0)) ? 'glow' : 'glass', F, sc - width / 2, sc + width / 2, y0, y1, -0.01, 0.03);
        if (item.type === 'side') for (const [y0, y1] of [W.f1, W.f2, W.f3, W.f4]) glass(y0, y1, 0.72);
        else { const hw = Math.min(0.85, 0.26 * w), aw = Math.min(0.9, 0.29 * w); glass(W.f1[0], W.f1[1], hw * 2 - 0.16); glass(W.f2[0], W.f2[1], hw * 2 - 0.16); glass(W.f3[0], W.f3[1], aw * 2 - 0.5); glass(W.f4[0], L.archSpring + 0.35, aw * 2 - 0.5); }
      });
    }
  }

  // ---- roof: gabled brick dormers with copper cheeks, chimneys ----
  // Four dormers on each long elevation (Heritage Toronto / Wikipedia), spaced as photographed.
  const DORMER_BAYS_FROM_WEST = [1, 3, 6, 9], CHIMNEY_FROM_WEST = [0.6, 2.4]; // bay indices / bay pitches from the west corner pier
  const sPos = (name, fromWest) => { // wall-local s for a distance from the west corner pier, in metres
    const { F, a, z } = layouts[name];
    return name === 'north' ? z - fromWest : a + fromWest;
  };
  function dormer(F, sc) {
    const y0 = L.cornice[1], w = 2.1, wallH = 2.1, peakH = 1.4, depth = 1.9, face = -0.2;
    const outline5 = (inset, base = 0) => new THREE.Shape([[-w / 2 + inset, y0 + base], [w / 2 - inset, y0 + base], [w / 2 - inset, y0 + wallH], [0, y0 + wallH + peakH - inset * 1.4], [-w / 2 + inset, y0 + wallH]].map(([x, y]) => new THREE.Vector2(x, y)));
    const cheeks = new THREE.ExtrudeGeometry(outline5(0), { depth, bevelEnabled: false });
    cheeks.translate(0, 0, face - depth);
    wput(cheeks, 'copper', F, sc);
    const plate = new THREE.ExtrudeGeometry(outline5(0.13, 0.0), { depth: 0.08, bevelEnabled: false });
    plate.translate(0, 0, face);
    wput(plate, 'brick', F, sc);
    if (near) {
      for (const sd of [-1, 1]) windowRect(F, sc + sd * 0.42, y0 + 0.55, y0 + 1.85, 0.5, lit(sc * 3 | 0, sd, 7) ? 'glow' : 'glass', false, face + 0.08);
      wbox('stone', F, sc - w / 2 + 0.05, sc + w / 2 - 0.05, y0 + 0.4, y0 + 0.5, face + 0.06, face + 0.2); // sill band
    }
    const tip = wallPoint(F, sc, y0 + wallH + peakH - 0.05, face - 0.1);
    const finial = new THREE.ConeGeometry(0.2, 0.85, near ? 8 : 4); finial.translate(tip[0], tip[1] + 0.4, tip[2]); put(finial, 'copper');
    if (near) { const spike = new THREE.CylinderGeometry(0.02, 0.05, 0.6, 5); spike.translate(tip[0], tip[1] + 1.1, tip[2]); put(spike, 'copper'); }
  }
  function chimney(F, sc) {
    wbox('brick', F, sc - 0.48, sc + 0.48, 17.2, 22.0, -1.95, -1.0);
    wbox('stone', F, sc - 0.6, sc + 0.6, 22.0, 22.22, -2.07, -0.88);
    if (near) wbox('iron', F, sc - 0.28, sc + 0.28, 22.22, 22.32, -1.75, -1.2);
  }
  for (const name of ['north', 'south']) {
    const { F, P, a, z } = layouts[name];
    const bays = DORMER_BAYS_FROM_WEST;
    for (const j of bays) dormer(F, name === 'north' ? z - (j + 0.5) * P : a + (j + 0.5) * P);
    for (const d of CHIMNEY_FROM_WEST) chimney(F, sPos(name, d * P));
  }

  // ---- near-only street-level and ornamental detail ----
  if (near) {
    // Frieze: a row of dentils and a band of interlace blocks all the way round (the "carved frieze").
    const alongRing = (spacing, cb) => {
      let carry = spacing / 2;
      for (let i = 0; i < ring.length; i++) {
        const p = ring[i], q = ring[(i + 1) % ring.length], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz), tx = dx / l, tz = dz / l;
        let d = carry;
        while (d < l) { cb(p[0] + tx * d, p[1] + tz * d, tx, tz, areaSign * tz, -areaSign * tx); d += spacing; }
        carry = d - l;
      }
    };
    const ornament = (m, y, size, off) => (x, z, tx, tz, nx, nz) => b.box(m, [x + nx * (off + size[2] / 2), y, z + nz * (off + size[2] / 2)], size, Math.atan2(-tz, tx));
    alongRing(0.3, ornament('stone', 15.6, [0.16, 0.15, 0.1], 0.07));
    let flip = 0;
    alongRing(0.44, (x, z, tx, tz, nx, nz) => { flip ^= 1; ornament('stone', flip ? 15.88 : 15.92, [0.3, flip ? 0.2 : 0.14, 0.08], 0.07)(x, z, tx, tz, nx, nz); });

    // Basement windows on the battered plinth, tilted to lie on it.
    const tilt = Math.atan(0.35 / L.plinth);
    for (const name of ['north', 'south', 'west']) {
      const { F, items } = layouts[name];
      for (const item of items) {
        const sc = (item.s0 + item.s1) / 2, yc = 1.0, out = 0.35 * (1 - yc / L.plinth);
        for (const [m, w, h, o] of [['iron', 1.0, 0.86, 0.03], [lit(4, item.index ?? 9, 0) ? 'glow' : 'glass', 0.86, 0.72, 0.045]]) {
          wput(new THREE.BoxGeometry(w, h, 0.04).rotateX(-tilt).translate(0, yc, out + o), m, F, sc);
        }
      }
    }
    // The apex door, on the axis of the turret, with a stone lintel.
    {
      const c = [Math.cos(ARC.mid), Math.sin(ARC.mid)], t = [-c[1], c[0]], r = R_b + 0.3, ang = Math.atan2(-t[1], t[0]);
      const at = (rr, y) => [APEX.c[0] + c[0] * rr, y, APEX.c[1] + c[1] * rr];
      b.box('iron', at(r, 1.2), [1.25, 1.9, 0.06], ang);
      b.box(lit(5, 5, 5) ? 'glow' : 'glass', at(r + 0.035, 1.15), [1.0, 1.55, 0.03], ang);
      b.box('stone', at(r - 0.05, 2.25), [1.6, 0.2, 0.36], ang);
      for (const sd of [-1, 1]) b.box('stone', [at(r - 0.05, 1.2)[0] + t[0] * sd * 0.72, 1.2, at(r - 0.05, 1.2)[2] + t[1] * sd * 0.72], [0.18, 2.0, 0.3], ang);
    }
    // The north entrance: stone doorcase with Corinthian-style columnettes and an ogee hood (Heritage: "elaborate hood mould with an ogee arch").
    {
      const { F, a, P } = layouts.north, sc = a + 3.5 * P, out0 = 0.5;
      const base = 2.3, rise = 0.85, half = 0.98, pts = [[-half, base]];
      for (let i = 1; i <= 16; i++) { const t = i / 16; pts.push([-half + half * t, base + rise * Math.pow(t, 1.3)]); } // rises to a point on the axis
      for (let i = 15; i >= 0; i--) pts.push([-pts[i + 1][0], pts[i + 1][1]]);
      pts.push([half, base]);
      const hood = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
      wput(new THREE.ExtrudeGeometry(hood, { depth: 0.22, bevelEnabled: false }), 'stone', F, sc, out0 - 0.22);
      wbox('iron', F, sc - 0.7, sc + 0.7, 0.35, 2.3, out0 - 0.02, out0 + 0.02);
      wbox(lit(6, 6, 6) ? 'glow' : 'glass', F, sc - 0.6, sc + 0.6, 0.45, 2.25, out0 + 0.02, out0 + 0.045);
      for (const sd of [-1, 1]) {
        wbox('stone', F, sc + sd * 0.88 - 0.12, sc + sd * 0.88 + 0.12, 0.3, 2.3, out0 - 0.28, out0);
        const col = new THREE.CylinderGeometry(0.075, 0.075, 1.95, 8); const p = wallPoint(F, sc + sd * 0.72, 1.3, out0 + 0.04); col.translate(...p); put(col, 'stone');
        wbox('stone', F, sc + sd * 0.72 - 0.11, sc + sd * 0.72 + 0.11, 2.22, 2.32, out0 - 0.06, out0 + 0.16); // capital
      }
      wbox('stone', F, sc - 1.15, sc + 1.15, 0.0, 0.3, out0 - 0.35, out0 + 0.1); // step
    }
    // Fire escapes: four landings and zigzag flights, black iron, on both long elevations.
    function fireEscape(F, sc) {
      const half = 1.15, depth = 1.05, rail = 1.0, landings = [2.75, 6.15, 10.0, 13.0];
      const bar = (a, c, w = 0.06) => b.bar('iron', wallPoint(F, ...a), wallPoint(F, ...c), w, w);
      for (const y of landings) {
        wbox('iron', F, sc - half, sc + half, y - 0.05, y + 0.02, 0, depth);
        wbox('iron', F, sc - half, sc + half, y + rail - 0.02, y + rail + 0.02, depth - 0.04, depth);
        wbox('iron', F, sc - half, sc + half, y + 0.5 - 0.015, y + 0.5 + 0.015, depth - 0.03, depth);
        for (const sd of [-1, 1]) {
          wbox('iron', F, sc + sd * half - 0.02, sc + sd * half + 0.02, y + rail - 0.02, y + rail + 0.02, 0, depth);
          wbox('iron', F, sc + sd * half - 0.015, sc + sd * half + 0.015, y + 0.5 - 0.015, y + 0.5 + 0.015, 0, depth);
        }
        for (const s of [-half, 0, half]) wbox('iron', F, sc + s - 0.02, sc + s + 0.02, y, y + rail, depth - 0.04, depth);
      }
      const tops = [...landings, 16.5];
      for (let k = 0; k < tops.length - 1; k++) {
        const dir = k % 2 === 0 ? 1 : -1, s0 = sc - dir * half, s1 = sc + dir * half, y0 = tops[k] + 0.02, y1 = tops[k + 1] + 0.02;
        bar([s0, y0, 0.25], [s1, y1, 0.25]); bar([s0, y0, 0.95], [s1, y1, 0.95]);
        bar([s0, y0 + 0.95, 1.0], [s1, y1 + 0.95, 1.0], 0.035);
        const n = Math.round(Math.hypot(s1 - s0, y1 - y0) / 0.28);
        for (let i = 1; i < n; i++) { const t = i / n; wbox('iron', F, s0 + (s1 - s0) * t - 0.13, s0 + (s1 - s0) * t + 0.13, y0 + (y1 - y0) * t - 0.03, y0 + (y1 - y0) * t, 0.22, 0.95); }
      }
      bar([sc + half - 0.3, 0.5, 0.35], [sc + half - 0.3, landings[0], 0.35], 0.04); bar([sc + half - 0.3, 0.5, 0.75], [sc + half - 0.3, landings[0], 0.75], 0.04);
      for (let y = 0.8; y < landings[0]; y += 0.32) wbox('iron', F, sc + half - 0.32, sc + half - 0.28, y, y + 0.03, 0.35, 0.75);
    }
    fireEscape(layouts.south.F, layouts.south.a + 6.5 * layouts.south.P);
    fireEscape(layouts.north.F, layouts.north.a + 7.5 * layouts.north.P);
  }

  // Roof lights on the slate slopes beside the turret (the pale panels in the photographs).
  if (near) {
    const slope = Math.atan(1.4 / (L.mansardTop - L.cornice[1]));
    for (const name of ['north', 'south']) {
      const { F } = layouts[name];
      for (const x of [3.3, 5.8]) {
        const s = name === 'north' ? x : F.length - x, t = 0.5, yc = L.cornice[1] + t * (L.mansardTop - L.cornice[1]), out = -0.1 - t * 1.4 + 0.035;
        wput(new THREE.BoxGeometry(1.1, 2.6, 0.04).rotateX(-slope).translate(0, yc, out), 'roof', F, s);
      }
    }
  }

  // ---- the round apex: four floors of curved bay windows ----
  const HALF = (ARC.to - ARC.from) / 2;
  const bowSteps = (p0, p1) => Math.max(1, Math.ceil(Math.abs(p1 - p0) / (near ? 0.11 : 0.3)));
  const bow = (m, r0, r1, phi0, phi1, y0, y1, opts = {}) => put(arcBlock({ c: APEX.c, rIn: r0, rOut: r1, a0: ARC.mid + phi0, a1: ARC.mid + phi1, y0, y1, steps: bowSteps(phi0, phi1), ...opts }), m);
  const skin = (m, r, phi0, phi1, y0, y1, topAt = null) => put(cylinderSkin({ c: APEX.c, r, a0: ARC.mid + phi0, a1: ARC.mid + phi1, y0, y1, topAt, steps: bowSteps(phi0, phi1) }), m);
  const pier = [-13 * deg, 13 * deg], winA = [13 * deg, 62 * deg], winB = [-62 * deg, -13 * deg];
  if (near) {
    for (const [p0, p1] of [pier, [62 * deg, HALF], [-HALF, -62 * deg]]) bow('brick', R_b - RECESS, R_b, p0, p1, L.plinth, L.frieze[1], { inner: false });
    const floors = [W.f1, W.f2, W.f3, W.f4];
    const bands = [[L.plinth, W.f1[0]], [W.f1[1], W.f2[0]], [W.f2[1], L.belt[0]], [L.belt[1], W.f3[0]], [W.f3[1], W.f4[0]], [W.f4[1], L.frieze[1]]];
    for (const [p0, p1] of [winA, winB]) {
      for (const [y0, y1] of bands) bow('brick', R_b - RECESS, R_b, p0, p1, y0, y1, { inner: false, caps: false });
      floors.forEach(([y0, y1], f) => {
        const pad = 0.02;
        skin('iron', R_b - RECESS + 0.015, p0 + pad, p1 - pad, y0, y1);
        const mat = lit(9, p0 > 0 ? 1 : 0, f) ? 'glow' : 'glass';
        skin(mat, R_b - RECESS + 0.03, p0 + 0.06, p1 - 0.06, y0 + 0.07, y1 - 0.07);
        bow('iron', R_b - RECESS + 0.03, R_b - RECESS + 0.07, p0 + 0.05, p1 - 0.05, (y0 + y1) / 2 - 0.03, (y0 + y1) / 2 + 0.03, { inner: false, caps: false });
        bow('stone', R_b - RECESS, R_b + 0.07, p0 - 0.03, p1 + 0.03, y0 - 0.13, y0, { inner: false, caps: false }); // sill
        bow('stone', R_b - RECESS, R_b + 0.05, p0 - 0.03, p1 + 0.03, y1, y1 + 0.18, { inner: false, caps: false }); // segmental hood
      });
    }
    for (const y of [5.2, 12.45]) bow('stone', R_b - 0.1, R_b + 0.14, -HALF, HALF, y, y + 0.26, { inner: false, caps: false });
  } else {
    bow('brick', R_b - 0.05, R_b, -HALF, HALF, L.plinth, L.frieze[1], { inner: false, caps: false, top: false, bottom: false });
    for (const [p0, p1] of [winA, winB]) for (const [y0, y1] of [W.f1, W.f2, W.f3, W.f4]) skin('glass', R_b + 0.02, p0 + 0.05, p1 - 0.05, y0, y1);
  }

  // ---- the turret ----
  const turretWindow = [8 * deg, 47 * deg], turretWindowB = [-47 * deg, -8 * deg];
  const ty0 = L.cornice[1], ty1 = 17.35, ty2 = 19.85, ty3 = L.turretTop;
  if (near) {
    bow('brick', R_b - 0.4, R_b, 0, Math.PI * 2, ty0, ty1, { inner: false, caps: false });
    bow('brick', R_b - 0.4, R_b, 0, Math.PI * 2, ty2, ty3, { inner: false, caps: false });
    bow('brick', R_b - 0.4, R_b, -8 * deg, 8 * deg, ty1, ty2, { inner: false });
    bow('brick', R_b - 0.4, R_b, 47 * deg, 313 * deg, ty1, ty2, { inner: false });
    skin('recess', R_b - 0.4, -47 * deg, 47 * deg, ty1, ty2);
    bow('stone', R_b - 0.1, R_b + 0.12, 0, Math.PI * 2, ty1 - 0.02, ty1 + 0.16, { inner: false, caps: false });
    for (const [p0, p1] of [turretWindow, turretWindowB]) {
      const rw = R_b * (p1 - p0) / 2, pc = (p0 + p1) / 2, y0 = 17.5, spring = 18.9;
      const top = (t) => { const x = (t - 0.5) * 2 * rw; return spring + Math.sqrt(Math.max(0, rw * rw - x * x)); };
      skin('iron', R_b - 0.4 + 0.015, p0, p1, y0, spring + rw, top);
      put(cylinderSkin({ c: APEX.c, r: R_b - 0.4 + 0.012, a0: ARC.mid + p0, a1: ARC.mid + p1, y0: ty2, y1: ty2, topAt: () => ty2, bottomAt: (t) => top(t), steps: bowSteps(p0, p1) }), 'brick'); // brick above the arched head
      skin(lit(11, p0 > 0 ? 1 : 0, 0) ? 'glow' : 'glass', R_b - 0.4 + 0.03, p0 + 0.05, p1 - 0.05, y0 + 0.07, spring + rw - 0.08, (t) => Math.max(y0 + 0.2, top(0.06 + t * 0.88) - 0.08));
      bow('iron', R_b - 0.4 + 0.03, R_b - 0.4 + 0.07, p0 + 0.04, p1 - 0.04, 18.2, 18.26, { inner: false, caps: false });
      bow('stone', R_b - 0.4, R_b + 0.06, p0 - 0.03, p1 + 0.03, y0 - 0.13, y0, { inner: false, caps: false });
      bow('stone', R_b - 0.1, R_b + 0.09, pc - 0.5 * (p1 - p0) - 0.05, pc + 0.5 * (p1 - p0) + 0.05, spring + rw + 0.02, spring + rw + 0.16, { inner: false, caps: false });
    }
  } else {
    put(new THREE.CylinderGeometry(R_b, R_b, ty3 - ty0, 14, 1, true).translate(APEX.c[0], (ty3 + ty0) / 2, APEX.c[1]), 'brick');
    for (const [p0, p1] of [turretWindow, turretWindowB]) skin('glass', R_b + 0.02, p0, p1, 17.5, 19.4);
  }
  const cone = new THREE.LatheGeometry([
    [R_b, ty3 - 0.1], [1.88, ty3 + 0.05], [1.9, ty3 + 0.18], [1.88, ty3 + 0.33], [1.78, L.coneBase],
    [1.5, 21.7], [1.11, 22.6], [0.73, 23.5], [0.4, 24.3], [0.16, L.coneTip],
    [0.2, 24.95], [0.2, 25.15], [0.09, 25.26], [0.06, 25.75], [0.0, L.top],
  ].map(([r, y]) => new THREE.Vector2(r, y)), near ? 40 : 14);
  cone.translate(APEX.c[0], 0, APEX.c[1]);
  put(cone, 'copper');

  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return root;
}
