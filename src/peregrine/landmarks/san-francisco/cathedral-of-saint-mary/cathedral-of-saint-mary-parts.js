// Parts of the Cathedral of Saint Mary model. Everything is authored in the GRID frame (u east, v south,
// rotated 9.1 degrees from true; the mapped slab, block, tower and fins are all axis-aligned in it) and
// rotated into local metres by `ROT` when it is added, so the rotation is baked into the GLB.
import * as THREE from 'three';
import { SPEC } from './config.js';

const { towerHalf: Tw, finTip: Zf, finHalf: C, wallTop: Yw, finTop: Yf, crossBase: Yc, slabTop: Y0, slabBottom: Ys, blockHalf: Hb } = SPEC;
export const ROT = (SPEC.gridDeg * Math.PI) / 180;
export const SLAB = { u0: SPEC.slabU[0], u1: SPEC.slabU[1], v0: SPEC.slabV[0], v1: SPEC.slabV[1] };
// The plain annex south of the slab: outer ring and courtyards of OSM relation 7814696 in the grid frame (courtyard
// outlines squared off, see docs).
export const ANNEX = {
  ring: [[-37.7, 39.2], [39, 39.2], [38.9, 44.1], [38.9, 49.6], [53.7, 49.6], [53.7, 62], [53.6, 86.8], [-4.1, 86.7], [-52.7, 86.7], [-52.7, 83.7], [-52.7, 49.7], [-37.7, 49.7]],
  holes: [
    [[-45.4, 59.8], [-34.4, 59.7], [-34.4, 74.4], [-45.3, 74.4]],
    [[35.6, 59.8], [35.6, 74.6], [46.8, 74.5], [46.8, 59.7]],
    [[7, 40], [21.6, 40], [21.7, 64.4], [7, 64.3]], // the two large courtyards are mapped with ragged edges; squared off here
    [[-20.6, 40], [-5.9, 40], [-5.9, 64.3], [-20.4, 64.3]],
  ],
  height: SPEC.annexHeight, // OSM gives 18.9 m for the whole relation (the slab roof is 12.7 m); unverified, so a three-storey parish building
};
// Crest of each sloping flank: the half-width at which the flank blends into the flat wall, by height fraction s.
export const crestX = (s) => C + (Tw - C) * Math.pow(1 - s, 2.2);

/** Ruled grid surface: rows of [x,y,z] points, quads split into two triangles, degenerate ones dropped. */
export function gridGeometry(rows) {
  const nc = rows[0].length, pos = [], idx = [];
  for (const row of rows) for (const p of row) pos.push(...p);
  const area = (a, b, c) => {
    const ux = pos[3 * b] - pos[3 * a], uy = pos[3 * b + 1] - pos[3 * a + 1], uz = pos[3 * b + 2] - pos[3 * a + 2];
    const vx = pos[3 * c] - pos[3 * a], vy = pos[3 * c + 1] - pos[3 * a + 1], vz = pos[3 * c + 2] - pos[3 * a + 2];
    return Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
  };
  const tri = (a, b, c) => { if (area(a, b, c) > 1e-4) idx.push(a, b, c); };
  for (let j = 0; j < rows.length - 1; j++) for (let i = 0; i < nc - 1; i++) {
    const a = j * nc + i, b = a + 1, c = a + nc, d = c + 1;
    tri(a, b, d); tri(a, d, c);
  }
  // keep only the vertices a surviving triangle uses (a collapsed row would leave zero-normal strays)
  const used = [...new Set(idx)].sort((a, b) => a - b), remap = new Map(used.map((v, i) => [v, i]));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(used.flatMap((v) => [pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]]), 3));
  g.setIndex(idx.map((v) => remap.get(v))); g.computeVertexNormals();
  return g;
}
const mirrorX = (rows) => rows.map((row) => row.map(([x, y, z]) => [-x, y, z]).reverse());

/**
 * One face (the +z one) of the tower skin: a flat travertine wall at z = Tw whose half-width is Tw, with two sloping
 * flanks that spring from the fin and widen toward the base along a concave crest. Every row of a flank is a straight
 * line from the fin edge (x = C, z = Zf) to the crest (x = X(y), z = Tw), so the flank is a ruled, twisted surface.
 */
export function faceSurfaces({ rows = 20, cols = 8 } = {}) {
  const yb = Y0 - 0.1, sEnd = 0.88, ys = [];
  for (let j = 0; j <= rows; j++) ys.push(sEnd * j / rows);
  const slope = ys.map((s) => { const X = crestX(s), y = yb + s * (Yw - yb); return Array.from({ length: cols + 1 }, (_, i) => { const t = i / cols; return [C + (X - C) * t, y, Tw + (Zf - Tw) * (1 - t)]; }); });
  const wall = ys.map((s) => [[crestX(s), yb + s * (Yw - yb), Tw], [Tw, yb + s * (Yw - yb), Tw]]);
  wall.push([[C, Yw, Tw], [Tw, Yw, Tw]]);
  return { slopeR: gridGeometry(slope), slopeL: gridGeometry(mirrorX(slope)), wallR: gridGeometry(wall), wallL: gridGeometry(mirrorX(wall)) };
}

/** Extruded polygon in the (r, y) plane, `thick` metres thick, centred on lateral offset `lat`; axis 'z' runs the profile along the grid z. */
export function prism(profile, thick, lat, axis) {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(profile.map(([r, y]) => new THREE.Vector2(r, y))), { depth: thick, bevelEnabled: false });
  g.translate(0, 0, lat - thick / 2);
  if (axis === 'z') g.rotateY(-Math.PI / 2);
  return g;
}
const topAt = (tip, centre, r) => centre + (tip - centre) * Math.min(1, Math.abs(r) / Zf);
/** Blade profile: bottom at the slab, ends at +-r, top sloping from the fin tip down to the centre. */
export function bladeProfile({ r = Zf, tip = Yf, centre = Yc, bottom = Y0 - 0.15, drop = 0 } = {}) {
  const t = topAt(tip, centre, r) - drop;
  return [[-r, bottom], [r, bottom], [r, t], [0, centre - drop], [-r, t]];
}

/** The pyramid roof deck inside the wall-top rim, falling from the rim to the centre of the cross. */
export function roofDeck(half = Tw - 0.4, rim = Yw - 0.1, centre = Yc - 0.6) {
  const p = [[-half, rim, -half], [half, rim, -half], [half, rim, half], [-half, rim, half], [0, centre, 0]], idx = [];
  for (let i = 0; i < 4; i++) idx.push(i, 4, (i + 1) % 4);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p.flat(), 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/** Plain extruded mass for the annex: ring with courtyard holes in the grid frame, from y = 0 to `height`. */
export function annexMass() {
  const pt = ([u, v]) => new THREE.Vector2(u, -v); // shape plane (x, y) -> grid (u, v) with y = -v so that +extrude goes up after the rotation below
  const shape = new THREE.Shape(ANNEX.ring.map(pt));
  for (const h of ANNEX.holes) shape.holes.push(new THREE.Path(h.map(([u, v]) => pt([u, Math.max(v, ANNEX.ring[0][1] + 0.8)])))); // courtyards touch the mapped slab edge; keep a 0.8 m wall on that side
  const g = new THREE.ExtrudeGeometry(shape, { depth: ANNEX.height, bevelEnabled: false });
  g.rotateX(-Math.PI / 2); // (x, y, z) -> (x, z, -y): extrusion goes up, shape y = -v becomes grid z = v
  return g;
}

/** Flat quads (two triangles, one outward normal each): joints, mullions and windows that stand 0.05 to 0.1 m off a wall. */
export class QuadBatch {
  constructor() { this.pos = []; this.nrm = []; this.idx = []; }
  /** Quad from four corners [x,y,z] given counter-clockwise seen from outside; the normal is computed from them. */
  quad(a, b, c, d) {
    const n = new THREE.Vector3().subVectors(new THREE.Vector3(...b), new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...c), new THREE.Vector3(...a))).normalize();
    const i = this.pos.length / 3;
    for (const p of [a, b, c, d]) { this.pos.push(...p); this.nrm.push(n.x, n.y, n.z); }
    this.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  /** Axis-aligned quad on the +z face frame: x0..x1, y0..y1 at depth z, facing +z. */
  face(x0, y0, x1, y1, z) { this.quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]); }
  get empty() { return !this.idx.length; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3)); g.setIndex(this.idx);
    return g;
  }
}

/** One arm of the cross (r from the hub edge to the fin face), `thick` wide, centred on lateral offset `lat`; the top climbs from the hub to the fin tip. */
export function armPrism({ axis, sign, thick, lat, r0 = C, r1 = Zf, hubTop = Yc, tipTop = Yf, drop = 0, bottom = Y0 - 0.15, y0 = bottom }) {
  const top = (r) => hubTop + (tipTop - hubTop) * (r - C) / (Zf - C) - drop;
  const pts = [[r0, y0], [r1, y0], [r1, top(r1)], [r0, top(r0)]];
  const g = prism(pts, thick, lat, axis);
  if (sign < 0) g.rotateY(Math.PI);
  return g;
}

const inPoly = (p, ring) => { let on = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > p[1]) !== (zj > p[1]) && p[0] < ((xj - xi) * (p[1] - zi)) / (zj - zi) + xi) on = !on; } return on; };
/** Window quads (dark glass, 0.06 m off the wall) along every wall of the annex, three storeys, facing away from the annex mass. */
export function annexWindows({ pitch = 3.4, width = 1.9, rows = [[1.1, 2.7], [4.6, 6.2], [8.1, 9.7]], skipNorth = true } = {}) {
  const q = new QuadBatch(), north = ANNEX.ring[0][1];
  const walls = [[ANNEX.ring, false], ...ANNEX.holes.map((h) => [h.map(([u, v]) => [u, Math.max(v, north + 0.8)]), true])];
  for (const [ring, hole] of walls) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length], du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv);
      if (L < pitch + 0.5 || (skipNorth && Math.abs(a[1] - north) < 0.9 && Math.abs(b[1] - north) < 0.9)) continue;
      const t = [du / L, dv / L], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      let n = [t[1], -t[0]];
      const probe = [mid[0] + n[0] * 0.5, mid[1] + n[1] * 0.5], outside = hole ? inPoly(probe, ring) : !inPoly(probe, ring);
      if (!outside) n = [-n[0], -n[1]];
      const count = Math.floor((L - 1.2) / pitch);
      for (let k = 0; k < count; k++) {
        const s = (L - (count - 1) * pitch) / 2 + k * pitch, cx = a[0] + t[0] * s + n[0] * 0.06, cz = a[1] + t[1] * s + n[1] * 0.06;
        for (const [y0, y1] of rows) {
          const p0 = [cx - t[0] * width / 2, y0, cz - t[1] * width / 2], p1 = [cx + t[0] * width / 2, y0, cz + t[1] * width / 2];
          const p2 = [p1[0], y1, p1[2]], p3 = [p0[0], y1, p0[2]];
          // winding: keep the normal pointing along n
          const nx = -(p1[2] - p0[2]), nz = p1[0] - p0[0]; // (p1-p0) x up = (-dz, 0, dx)
          if (nx * n[0] + nz * n[1] > 0) q.quad(p0, p1, p2, p3); else q.quad(p1, p0, p3, p2);
        }
      }
    }
  }
  return q.geometry();
}
