import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit, insetRing, lancetPts, edgeNormal } from './westminster-abbey-mission-parts.js';
import {
  CHURCH_RING, SANCTUARY_RING, FINIAL_RING, SCHOOL_RING, EAST_RING, BASE_H, WALL_H, SANCT_RISE, FINIAL_TOP, EAVE_H, ROOF_RISE,
  TOWER_H, CROSS_H, WIN, TOWER, PORCH, WALKWAY, churchWindows,
} from './westminster-abbey-mission-plan.js';

// Westminster Abbey (Mission), BC. Original procedural mesh on the mapped OSM outlines (church 90078404,
// bell tower 90078880, covered walkway 385780101, wings 90078385 and 90078430). The plan is authored in the
// model frame directly (+x east, +z south), so nothing is rotated afterwards.

// The undercroft core: the mapped saw-tooth ring pulled in 1.2 m (miters clamped by insetRing), so the
// walls above overhang a recessed brick wall.
const CORE_RING = insetRing(CHURCH_RING, 1.2);
const PIER_PTS = insetRing(CHURCH_RING, 0.6);

function church(k) {
  const near = k.near;
  // open undercroft: concrete piers at the plan's corners round a recessed brick core, under the slab
  k.walls(near ? 'brick' : 'roof', CORE_RING, 0, BASE_H); // far: the brick joins the roof draw (same hue)
  k.capDown('concrete', CHURCH_RING, BASE_H);
  PIER_PTS.forEach(([px, pz], i) => {
    if (!near && i % 3) return;
    k.box('concrete', px, BASE_H / 2, pz, 0.4, BASE_H, 0.4);
  });
  if (near) CORE_RING.forEach((a, i) => { // dark glazing between the piers on the longer faces of the core
    const b = CORE_RING[(i + 1) % CORE_RING.length];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 2.6) k.rectOnEdge('recess', CORE_RING, i, 0.5, 0.7, 1.5, 2.6, 0.12);
  });
  k.walls('concrete', CHURCH_RING, BASE_H, WALL_H);
  k.cap('concrete', CHURCH_RING, WALL_H);
  // central sanctuary roof, one low step above the wall tops, and the finial
  k.walls('concrete', SANCTUARY_RING, WALL_H, WALL_H + SANCT_RISE);
  k.cap('concrete', SANCTUARY_RING, WALL_H + SANCT_RISE);
  const f = FINIAL_RING, fx = (f[0][0] + f[2][0]) / 2, fz = (f[0][1] + f[2][1]) / 2;
  k.spike('concrete', fx, fz, 0.55, WALL_H + SANCT_RISE, FINIAL_TOP);
  // tall lancet windows on one face of every bay; a mullion splits each in the near model
  const lancet = lancetPts(WIN.w, WIN.h, near ? 4 : 2);
  const surround = lancetPts(WIN.w + 0.7, WIN.h + 0.5, 4);
  const wins = churchWindows();
  for (const i of wins) {
    // concrete reveal, then clear dark glazing standing proud of it (>= 10 cm) with a mullion on top
    if (near) k.onEdge('trim', CHURCH_RING, i, 0.5, WIN.y0 - 0.2, surround, 0.12);
    k.onEdge('glow', CHURCH_RING, i, 0.5, WIN.y0, lancet, near ? 0.24 : 0.12);
    if (near) k.rectOnEdge('wall', CHURCH_RING, i, 0.5, WIN.y0, 0.1, WIN.h * 0.8, 0.34); // 'wall' not 'trim': trim < glow < trim would be a depth cycle
  }
  // doors under the entrance canopy, on the recessed core of the north arm
  const n = CORE_RING.length;
  for (let i = 0; i < n; i++) {
    const a = CORE_RING[i], b = CORE_RING[(i + 1) % n], nm = edgeNormal(CORE_RING, i);
    const mxx = (a[0] + b[0]) / 2, mzz = (a[1] + b[1]) / 2;
    if (nm[1] < -0.5 && mxx > PORCH.x0 + 0.5 && mxx < PORCH.x1 - 0.3 && mzz < -9 && Math.hypot(b[0] - a[0], b[1] - a[1]) > 2) {
      k.rectOnEdge('recess', CORE_RING, i, 0.5, 0.2, 1.5, 3.4, 0.14);
    }
  }
  // entrance canopy on slim columns
  const P = PORCH;
  k.box('concrete', (P.x0 + P.x1) / 2, (P.y0 + P.y1) / 2, (P.z0 + P.z1) / 2, P.x1 - P.x0, P.y1 - P.y0, P.z1 - P.z0);
  for (const x of P.colX) k.box('concrete', x, (P.y0 + 0.05) / 2, P.colZ, 0.4, P.y0 + 0.05, 0.4);
}

function tower(k) {
  const near = k.near, a = TOWER.w / 2, Ys = 13, H = TOWER_H, seg = near ? 9 : 5, TAPER_Y = 18, D = 4.4, TAPER = 0.35;
  const half = (y) => { const t = (y - Ys) / (H - Ys); return a * (1 - Math.pow(Math.min(1, Math.max(0, t)), 2.2)); };
  // depth of the slab at height y: constant to the screen, then slimming toward the apex (a fin from the side)
  const zHalf = (y) => (D / 2) * (1 - TAPER * Math.max(0, (y - TAPER_Y) / (H - TAPER_Y)));
  // outline: vertical shaft, then a pointed parabolic arch to the apex
  const pts = [new THREE.Vector2(-a, 0), new THREE.Vector2(a, 0), new THREE.Vector2(a, Ys)];
  for (let i = 1; i < seg; i++) { const y = Ys + (H - Ys) * (i / seg); pts.push(new THREE.Vector2(half(y), y)); }
  pts.push(new THREE.Vector2(0, H));
  for (let i = seg - 1; i >= 1; i--) { const y = Ys + (H - Ys) * (i / seg); pts.push(new THREE.Vector2(-half(y), y)); }
  pts.push(new THREE.Vector2(-a, Ys));
  const shape = new THREE.Shape(pts);
  // the bell opening goes right through the tower
  shape.holes.push(new THREE.Path(lancetPts(2.4, 5.0, near ? 5 : 3).map(([x, y]) => new THREE.Vector2(x, y + 19.8)).reverse()));
  const g = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false, curveSegments: 1 });
  g.translate(TOWER.cx, 0, TOWER.cz - D / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, TOWER.cz + (pos.getZ(i) - TOWER.cz) * (zHalf(pos.getY(i)) / (D / 2)));
  k.put(g, 'concrete');
  // arch moulding: a raised rib following the outline on both faces, 0.5 m wide, 12 cm proud
  const rib = (side, x0, x1, y0, y1) => { // one quad between two heights; x offsets are from the tower axis
    const z = (y) => TOWER.cz + side * (zHalf(y) + 0.12);
    const o = [[TOWER.cx + x0, y0, z(y0)], [TOWER.cx + x1, y0, z(y0)], [TOWER.cx + x1, y1, z(y1)], [TOWER.cx + x0, y1, z(y1)]];
    const flat = o.flat(), geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(flat, 3));
    geo.setIndex(side > 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
    k.put(geo, 'trim');
  };
  const ys = Array.from({ length: seg + 1 }, (_, i) => Ys + (H - 0.6 - Ys) * (i / seg));
  for (const side of [-1, 1]) {
    for (const sx of [-1, 1]) {
      rib(side, sx > 0 ? a - 0.5 : -a, sx > 0 ? a : -a + 0.5, 0, Ys); // the shaft's two edge ribs
      for (let i = 0; i < seg; i++) { // the arch's edge rib, following the parabola inward
        const w0 = half(ys[i]), w1 = half(ys[i + 1]), r = 0.5;
        const [ia, ib] = sx > 0 ? [[w0 - r, w0], [w1 - r, w1]] : [[-w0, -w0 + r], [-w1, -w1 + r]];
        if (w1 < r) continue;
        const z0 = TOWER.cz + side * (zHalf(ys[i]) + 0.12), z1 = TOWER.cz + side * (zHalf(ys[i + 1]) + 0.12);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute([
          TOWER.cx + ia[0], ys[i], z0, TOWER.cx + ia[1], ys[i], z0, TOWER.cx + ib[1], ys[i + 1], z1, TOWER.cx + ib[0], ys[i + 1], z1], 3));
        const up = (sx > 0) === (side > 0);
        geo.setIndex(up ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
        k.put(geo, 'trim');
      }
    }
  }
  // perforated screen low on both faces: a grid of small dark cells in the concrete (near), four coarse cells (far)
  for (const s of [-1, 1]) {
    const z = TOWER.cz + s * (D / 2 + 0.12);
    const cells = [];
    if (near) for (let r = 0; r < 9; r++) for (let c = -1; c <= 1; c++) cells.push([c * 0.95, 9.9 + r * 0.95, 0.62, 0.68]);
    else for (let r = 0; r < 3; r++) for (const c of [-0.8, 0.8]) cells.push([c, 10.3 + r * 2.7, 1.2, 1.7]);
    for (const [dx, cy, cw, ch] of cells) {
      const g2 = new THREE.PlaneGeometry(cw, ch);
      if (s < 0) g2.rotateY(Math.PI); // PlaneGeometry faces +z; the north face looks to -z
      g2.translate(TOWER.cx + dx, cy, z);
      k.put(g2, 'recess');
    }
  }
  // cross on the apex
  k.box('concrete', TOWER.cx, H - 0.2 + (CROSS_H + 0.2) / 2, TOWER.cz, 0.34, CROSS_H + 0.2, 0.34);
  k.box('concrete', TOWER.cx, H + 2.2, TOWER.cz, 1.7, 0.3, 0.3);
}

function walkway(k) {
  const W = WALKWAY;
  k.box('concrete', (W.x0 + W.x1) / 2, (W.y0 + W.y1) / 2, (W.z0 + W.z1) / 2, W.x1 - W.x0, W.y1 - W.y0, W.z1 - W.z0);
  for (const x of W.colX) for (const z of W.colZ) k.box('concrete', x, (W.y0 + 0.05) / 2, z, 0.35, W.y0 + 0.05, 0.35);
}

// Three-storey wings: cream walls, window rows, low red hip.
function wing(k, ring) {
  const near = k.near, n = ring.length;
  k.walls('wall', ring, 0, EAVE_H);
  const inner = insetRing(ring, 2.2);
  k.skirt('roof', ring, inner, EAVE_H, EAVE_H + ROOF_RISE);
  k.cap('roof', inner, EAVE_H + ROOF_RISE);
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 4) continue;
    for (let s = 0; s < 3; s++) {
      const y0 = s * (EAVE_H / 3) + 1.0;
      if (near) {
        const cnt = Math.floor((L - 1.6) / 3.1), pitch = 1 / (cnt + 0.0);
        for (let c = 0; c < cnt; c++) k.rectOnEdge('glass', ring, i, (c + 0.5) * pitch, y0, 1.3, 1.5, 0.12);
      } else if (L > 8) {
        const cnt = Math.floor((L - 1.6) / 6.2), pitch = 1 / cnt;
        for (let c = 0; c < cnt; c++) k.rectOnEdge('glass', ring, i, (c + 0.5) * pitch, y0, 2.4, 1.5, 0.15);
      }
    }
  }
}

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, detail === 'near');
  church(k);
  tower(k);
  walkway(k);
  wing(k, SCHOOL_RING);
  wing(k, EAST_RING);
  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.computeBoundingBox();
    o.geometry.computeBoundingSphere();
  });
  root.userData.elevationDatum = 'Rigid local foundation at y=0 for the whole abbey';
  return root;
}
