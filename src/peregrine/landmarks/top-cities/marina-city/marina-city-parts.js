// Procedural Marina City. Two identical corncob towers: 19 open parking decks
// with column-stacked arches (the real helix is the inner drive aisle, which
// does not show on the outside), then 40 residential floors whose balcony
// ring is the mapped 16-petal scallop. A saddle-roof theatre sits north of
// the west tower; the river restaurants are low pavilions with a bite where
// a tower passes through them. No photograph or texture is read here.
import * as THREE from 'three';
import { Earcut } from 'three/src/extras/Earcut.js';
import { TOWERS, THEATRE, PODIUMS, LEVELS, petalRadius, deckTop } from './marina-city-shape.js';

const PARK_NEAR = 144; // six samples per bay retain the round arch with room for soffits
const PARK_FAR = 48; // crown and pier only; the same crown and pier heights as near
const CROWN = 0.46; // slab thickness at an arch crown

// The balcony table's cusps are a single sample wide. An even ring misses
// them and the chord bridges the dent. Far uses every tip and cusp; near
// retains all 96 mapped samples for the rounded shoulders.
function featureAngles(tower) {
  const n = tower.radii.length;
  const ang = (i) => -Math.PI + ((i + 0.5) / n) * Math.PI * 2;
  const idx = [];
  for (let i = 0; i < n; i++) {
    const r = tower.radii[i];
    const prev = tower.radii[(i + n - 1) % n];
    const next = tower.radii[(i + 1) % n];
    const min = (r <= prev && r < next) || (r < prev && r <= next);
    const max = (r >= prev && r > next) || (r > prev && r >= next);
    if (min || max) idx.push(i);
  }
  return idx.map(ang);
}

function balconyAngles(tower, shoulders) {
  const feats = featureAngles(tower);
  if (!shoulders) return feats;
  return ringAngles(tower.radii.length, -Math.PI + Math.PI / tower.radii.length);
}

function tipAngles(tower) {
  const n = tower.radii.length;
  const ang = (i) => -Math.PI + ((i + 0.5) / n) * Math.PI * 2;
  const tips = [];
  for (let i = 0; i < n; i++) {
    const r = tower.radii[i];
    const prev = tower.radii[(i + n - 1) % n];
    const next = tower.radii[(i + 1) % n];
    if ((r >= prev && r > next) || (r > prev && r >= next)) tips.push(ang(i));
  }
  return tips;
}

// Predominantly silver/grey cars; a few subdued red cars per deck.
const CAR_MATS = ['carLight', 'carLight', 'carDark', 'carLight', 'carDark', 'carLight', 'carRed', 'carLight', 'carDark', 'carLight', 'carLight', 'carDark', 'carLight'];
// Four hulls whose boxes were checked against the restaurant and parking rings.
const BOATS = [
  { x: 6, z: 12, len: 8, beam: 2.4 },
  { x: 20, z: 6, len: 8, beam: 2.4 },
  { x: 30, z: 2, len: 7, beam: 2.2 },
  { x: -8, z: 18, len: 7, beam: 2.2 },
];

function ringAngles(count, phase) {
  const step = (Math.PI * 2) / count;
  const out = new Array(count);
  for (let i = 0; i < count; i++) out[i] = phase + i * step;
  return out;
}

class Batch {
  constructor() { this.pos = []; this.idx = []; }
  quad(pts) {
    const base = this.pos.length / 3;
    for (const p of pts) this.pos.push(p[0], p[1], p[2]);
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  flush(b, material) {
    if (!this.idx.length) return;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setIndex(this.idx);
    g.computeVertexNormals();
    b.put(g, material);
  }
}

// Closed vertical strip. Angles increase from +X toward +Z. Winding is the
// outward face: lower i, upper i, upper i+1, lower i+1.
function addVerticalRing(batch, cx, cz, angles, radiusAt, y0At, y1At) {
  const n = angles.length;
  const base = thisPos(batch);
  for (let i = 0; i < n; i++) {
    const th = angles[i];
    const r = radiusAt(i, th);
    const x = cx + r * Math.cos(th);
    const z = cz + r * Math.sin(th);
    batch.pos.push(x, y0At(i, th), z, x, y1At(i, th), z);
  }
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const l0 = base + i * 2, u0 = l0 + 1, l1 = base + j * 2, u1 = l1 + 1;
    batch.idx.push(l0, u0, u1, l0, u1, l1);
  }
}

function thisPos(batch) { return batch.pos.length / 3; }

// Horizontal annulus. `up` true faces +Y (outer i, inner i, inner i+1, outer i+1).
function addAnnulus(batch, cx, cz, angles, rIn, rOutAt, y, up, outerYAt = () => y, innerStride = 1) {
  const n = angles.length, m = n / innerStride;
  const base = thisPos(batch);
  for (let i = 0; i < n; i++) {
    const th = angles[i], ro = rOutAt(i, th);
    batch.pos.push(cx + ro * Math.cos(th), outerYAt(i, th), cz + ro * Math.sin(th));
  }
  for (let j = 0; j < m; j++) {
    const th = angles[j * innerStride];
    batch.pos.push(cx + rIn * Math.cos(th), y, cz + rIn * Math.sin(th));
  }
  // The scallop is concave: a simple fan crosses a throat and flips faces.
  // Triangulate the annulus with its inner hole in plan, then retain the curved
  // outer elevations. No overlapping or inward-facing triangles at the cusps.
  const flat = [];
  for (let i = 0; i < n + m; i++) flat.push(batch.pos[(base + i) * 3], batch.pos[(base + i) * 3 + 2]);
  const idx = Earcut.triangulate(flat, [n], 2);
  for (let i = 0; i < idx.length; i += 3) {
    let [a, b, c] = [idx[i], idx[i + 1], idx[i + 2]];
    const ny = (flat[b * 2 + 1] - flat[a * 2 + 1]) * (flat[c * 2] - flat[a * 2])
      - (flat[b * 2] - flat[a * 2]) * (flat[c * 2 + 1] - flat[a * 2 + 1]);
    if ((ny > 0) !== up) [b, c] = [c, b];
    batch.idx.push(base + a, base + b, base + c);
  }
}

function addFan(batch, cx, y, cz, angles, r, up) {
  const base = thisPos(batch);
  batch.pos.push(cx, y, cz);
  for (const th of angles) batch.pos.push(cx + r * Math.cos(th), y, cz + r * Math.sin(th));
  const n = angles.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (up) batch.idx.push(base, base + 1 + j, base + 1 + i);
    else batch.idx.push(base, base + 1 + i, base + 1 + j);
  }
}

function addOuterQuad(batch, cx, cz, th0, th1, r, y0, y1) {
  const p = (th, y) => [cx + r * Math.cos(th), y, cz + r * Math.sin(th)];
  batch.quad([p(th0, y0), p(th0, y1), p(th1, y1), p(th1, y0)]);
}

// Opening across one bay. u = 0 at the crown and 1 at the nearest pier.
// The fascia follows a semicircle so the bay reads as an arch; a chord
// from the quarter to the pier is what made the earlier rings into teeth.
function parkY0(theta, phase, yTop) {
  const bay = (Math.PI * 2) / LEVELS.parkBays;
  const a = Math.atan2(Math.sin(theta - phase), Math.cos(theta - phase));
  const f = a / bay - Math.floor(a / bay);
  const distCrown = f <= 0.5 ? f : 1 - f;
  const u = distCrown / 0.5;
  const arch = Math.sqrt(Math.max(0, 1 - u * u));
  const open = 0.18 + (LEVELS.parkPitch - 0.18 - CROWN) * arch;
  return yTop - (LEVELS.parkPitch - open);
}

function buildTower(batches, tower, near) {
  const { x, z, phase, parkR } = tower;
  const resAngles = balconyAngles(tower, near);
  const parkAngles = ringAngles(near ? PARK_NEAR : PARK_FAR, phase);
  const tips = tipAngles(tower);
  const radiusAt = (_i, th) => petalRadius(tower, th);
  const concrete = batches.concrete;
  const dark = batches.concreteDark;

  // Petal edges turn upward at their throats: a continuous curved concrete lip
  // over a deep glazed recess, rather than a flat blade over a pale core.
  const riseAt = (_i, th) => {
    const r = radiusAt(_i, th);
    return Math.max(0, Math.min(1, (19.65 - r) / 2.75)) ** 1.6;
  };
  for (let floor = 0; floor < LEVELS.resFloors; floor++) {
    // Far keeps complete alternate slabs, plus the roof's terminal slab,
    // rather than unsupported lips. Every window row below is still retained.
    if (!near && floor % 2 && floor !== LEVELS.resFloors - 1) continue;
    const y0 = LEVELS.resBase + floor * LEVELS.resPitch;
    const y1 = y0 + LEVELS.slab;
    addVerticalRing(concrete, x, z, resAngles, radiusAt, (i, th) => y0 + riseAt(i, th), (i, th) => y1 + riseAt(i, th));
    addAnnulus(concrete, x, z, resAngles, near ? LEVELS.slabInner : LEVELS.glassR - 0.1, radiusAt, y1, true, (i, th) => y1 + riseAt(i, th), near ? 6 : 2);
    if (near) {
      addAnnulus(dark, x, z, resAngles, LEVELS.slabInner, radiusAt, y0, false, (i, th) => y0 + riseAt(i, th), 6);
    }
  }

  const half = Math.PI / 16 - 0.008; // glaze the whole petal back, leave slim pier gaps
  for (let floor = 0; floor < LEVELS.resFloors - 1; floor++) {
    const y0 = LEVELS.resBase + floor * LEVELS.resPitch;
    const y1 = LEVELS.resBase + (floor + 1) * LEVELS.resPitch;
    if (y1 - y0 < 0.4) continue;
    for (let petal = 0; petal < tips.length; petal++) {
      const th = tips[petal];
      const lit = ((floor * 3 + petal * 2) % 11) < 2;
      addOuterQuad(lit ? batches.glow : batches.glass, x, z, th - half, th + half, LEVELS.glassR, y0, y1);
    }
  }

  for (let level = 0; level < LEVELS.parkFloors; level++) {
    const y1 = deckTop(level);
    const y0At = (_i, th) => parkY0(th, phase, y1);
    addVerticalRing(concrete, x, z, parkAngles, () => parkR, y0At, () => y1);
    if (near) {
      const deckA = ringAngles(48, phase);
      addAnnulus(dark, x, z, deckA, LEVELS.coreR, () => parkR, y1, true, () => y1, 2);
      addAnnulus(dark, x, z, deckA, LEVELS.coreR, () => parkR, y1 - 0.18, false, () => y1 - 0.18, 2);
    }
  }

  // Lobby drum, just inside the parking fascia, with a recessed glass band.
  const lobbyR = parkR - 0.22;
  const lobbyGlass = lobbyR - 0.28;
  const lobbyN = near ? 24 : 12;
  const lobbyA = ringAngles(lobbyN, phase);
  addVerticalRing(concrete, x, z, lobbyA, () => lobbyR, () => 0, () => 0.9);
  addVerticalRing(concrete, x, z, lobbyA, () => lobbyR, () => 3.35, () => LEVELS.lobbyTop);
  addVerticalRing(batches.glass, x, z, lobbyA, () => lobbyGlass, () => 1.15, () => 3.15);

  // Transition band between the garage and the first balcony. Inset so it
  // does not meet the parking lip or the first soffit.
  const beltR = parkR - 0.75;
  const beltA = ringAngles(near ? 24 : 12, phase);
  addVerticalRing(concrete, x, z, beltA, () => beltR, () => LEVELS.belt0 + 0.18, () => LEVELS.belt1 - 0.15);
  if (near) {
    const beltGlass = beltR - 0.28;
    for (let i = 0; i < beltA.length; i += 2) {
      const th = beltA[i];
      addOuterQuad(batches.glass, x, z, th - 0.09, th + 0.09, beltGlass, LEVELS.belt0 + 0.7, LEVELS.belt1 - 0.55);
    }
  }

  const coreN = near ? 12 : 8;
  addVerticalRing(dark, x, z, ringAngles(coreN, phase), () => LEVELS.coreR, () => 0.2, () => LEVELS.roof0 - 0.4);

  const lastTop = LEVELS.resBase + (LEVELS.resFloors - 1) * LEVELS.resPitch + LEVELS.slab;
  const roofR = LEVELS.slabInner - 0.1;
  const roofA = ringAngles(near ? 24 : 12, phase);
  addVerticalRing(concrete, x, z, roofA, () => roofR, () => lastTop + 0.04, () => LEVELS.roof1);
  addAnnulus(concrete, x, z, roofA, LEVELS.pentR + 0.12, () => roofR, LEVELS.roof1, true);

  const pentA = ringAngles(near ? 12 : 8, phase);
  addVerticalRing(concrete, x, z, pentA, () => LEVELS.pentR, () => LEVELS.pent0, () => LEVELS.pent1);
  addAnnulus(concrete, x, z, pentA, 0.85, () => LEVELS.pentR, LEVELS.pent1, true);

  const mastA = ringAngles(6, phase);
  addVerticalRing(batches.metal, x, z, mastA, () => 0.55, () => LEVELS.pent1, () => LEVELS.cap1);
  const lampA = ringAngles(8, phase);
  addVerticalRing(batches.lamp, x, z, lampA, () => 0.95, () => LEVELS.cap1, () => LEVELS.tip);
  addFan(batches.lamp, x, LEVELS.tip, z, lampA, 0.95, true);

  if (!near) return;
  for (let level = 0; level < LEVELS.parkFloors - 1; level++) {
    for (let bay = 0; bay < LEVELS.parkBays; bay++) {
      if ((bay + level) % 2 !== 1) continue;
      const th = phase + bay * (Math.PI * 2 / LEVELS.parkBays);
      const r = parkR - 2.6;
      const y = deckTop(level) + 0.7;
      batches.cars.push({
        mat: CAR_MATS[(bay * 3 + level) % CAR_MATS.length],
        center: [x + r * Math.cos(th), y, z + r * Math.sin(th)],
        angle: -th,
      });
    }
  }
}

function hypar(i, j, nu, nv) {
  const u = -1 + (2 * i) / (nu - 1);
  const v = -1 + (2 * j) / (nv - 1);
  const x = THEATRE.x0 + (THEATRE.x1 - THEATRE.x0) * ((u + 1) / 2);
  const z = THEATRE.z0 + (THEATRE.z1 - THEATRE.z0) * ((v + 1) / 2);
  return [x, 10 + 7.5 * u * v, z];
}

function buildTheatre(batches, near) {
  const nu = near ? 9 : 5;
  const nv = near ? 6 : 4;
  const verts = [];
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) verts.push(hypar(i, j, nu, nv));
  const roof = batches.roof;
  const base = thisPos(roof);
  for (const p of verts) roof.pos.push(p[0], p[1], p[2]);
  for (let j = 0; j < nv - 1; j++) {
    for (let i = 0; i < nu - 1; i++) {
      const a = base + j * nu + i;
      const c = a + nu;
      const d = c + 1;
      const b = a + 1;
      // (i,j), (i,j+1), (i+1,j+1), (i+1,j) faces +Y on this saddle.
      roof.idx.push(a, c, d, a, d, b);
    }
  }
  const wallOf = (i0, j0, i1, j1, glass) => {
    const p0 = hypar(i0, j0, nu, nv);
    const p1 = hypar(i1, j1, nu, nv);
    const batch = glass ? batches.glass : batches.concrete;
    const A0 = [p0[0], 0, p0[2]], B0 = [p1[0], 0, p1[2]];
    const dx = p1[0] - p0[0], dz = p1[2] - p0[2];
    const cx = (THEATRE.x0 + THEATRE.x1) / 2, cz = (THEATRE.z0 + THEATRE.z1) / 2;
    const midX = (p0[0] + p1[0]) / 2 - cx, midZ = (p0[2] + p1[2]) / 2 - cz;
    const nx = -dz, nz = dx;
    const outward = nx * midX + nz * midZ > 0;
    if (outward) batch.quad([A0, B0, p1, p0]);
    else batch.quad([A0, p0, p1, B0]);
  };
  for (let i = 0; i < nu - 1; i++) {
    wallOf(i, 0, i + 1, 0, false);
    wallOf(i, nv - 1, i + 1, nv - 1, true);
  }
  for (let j = 0; j < nv - 1; j++) {
    wallOf(0, j, 0, j + 1, false);
    wallOf(nu - 1, j, nu - 1, j + 1, false);
  }
}

function shoelace(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x, z] = ring[i], [x2, z2] = ring[(i + 1) % ring.length];
    a += x * z2 - x2 * z;
  }
  return a / 2;
}

function segDist(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const len = dx * dx + dz * dz;
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len)) : 0;
  return Math.hypot(px - ax - dx * t, pz - az - dz * t);
}

function clearsTowers(ax, az, bx, bz) {
  for (const t of TOWERS) {
    if (segDist(t.x, t.z, ax, az, bx, bz) < t.parkR + 0.55) return false;
  }
  return true;
}

function buildPodiumRoof(batch, ring, idx) {
  for (let t = 0; t < idx.length; t += 3) {
    const a = ring[idx[t]], b = ring[idx[t + 1]], c = ring[idx[t + 2]];
    if (!clearsTowers(a[0], a[1], b[0], b[1])) continue;
    if (!clearsTowers(b[0], b[1], c[0], c[1])) continue;
    if (!clearsTowers(c[0], c[1], a[0], a[1])) continue;
    const y = 3.12;
    const base = thisPos(batch);
    // Swap b and c so the face points up.
    batch.pos.push(a[0], y, a[1], c[0], y, c[1], b[0], y, b[1]);
    batch.idx.push(base, base + 1, base + 2);
  }
}

function buildPodiumWalls(batches, ring) {
  let cx = 0, cz = 0;
  for (const [x, z] of ring) { cx += x; cz += z; }
  cx /= ring.length; cz /= ring.length;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n];
    if (!clearsTowers(a[0], a[1], b[0], b[1])) continue;
    const dx = b[0] - a[0], dz = b[1] - a[1];
    const midX = (a[0] + b[0]) / 2 - cx, midZ = (a[1] + b[1]) / 2 - cz;
    const nx = -dz, nz = dx;
    const out = nx * midX + nz * midZ > 0 ? [nx, nz] : [-nx, -nz];
    const len = Math.hypot(out[0], out[1]) || 1;
    const ix = -out[0] / len, iz = -out[1] / len;
    const wall = (y0, y1, batch, inset) => {
      const A0 = [a[0] + ix * inset, y0, a[1] + iz * inset];
      const B0 = [b[0] + ix * inset, y0, b[1] + iz * inset];
      const A1 = [a[0] + ix * inset, y1, a[1] + iz * inset];
      const B1 = [b[0] + ix * inset, y1, b[1] + iz * inset];
      if (out === nx || true) {
        const trial = nx * midX + nz * midZ > 0;
        if (trial) batch.quad([A0, B0, B1, A1]);
        else batch.quad([A0, A1, B1, B0]);
      }
    };
    wall(0, 0.85, batches.concrete, 0);
    wall(1.1, 2.85, batches.glass, 0.28);
    wall(2.95, 3.12, batches.concrete, 0);
  }
}

function buildBoats(b) {
  for (const boat of BOATS) {
    b.box('carLight', [boat.x, 0.75, boat.z], [boat.len, 0.7, boat.beam]);
    b.box('carDark', [boat.x - boat.len * 0.1, 1.35, boat.z], [boat.len * 0.35, 0.5, boat.beam * 0.62]);
  }
}

export function buildMarinaCity(b, detail) {
  const near = detail !== 'far';
  const batches = {
    concrete: new Batch(),
    concreteDark: new Batch(),
    glass: new Batch(),
    glow: new Batch(),
    metal: new Batch(),
    lamp: new Batch(),
    roof: new Batch(),
    cars: [],
  };
  for (const tower of TOWERS) buildTower(batches, tower, near);
  buildTheatre(batches, near);
  for (const podium of PODIUMS) {
    const ring = shoelace(podium.ring) < 0 ? [...podium.ring].reverse() : podium.ring.slice();
    const data = [];
    for (const [x, z] of ring) data.push(x, z);
    const idx = Earcut.triangulate(data, null, 2);
    buildPodiumRoof(batches.concrete, ring, idx);
    buildPodiumWalls(batches, ring);
  }
  if (near) {
    for (const car of batches.cars) b.box(car.mat, car.center, [4.15, 1.4, 1.7], car.angle);
    buildBoats(b);
  }
  batches.concrete.flush(b, 'concrete');
  batches.concreteDark.flush(b, 'concreteDark');
  batches.glass.flush(b, 'glass');
  batches.glow.flush(b, 'glow');
  batches.metal.flush(b, 'metal');
  batches.lamp.flush(b, 'lamp');
  batches.roof.flush(b, 'roof');
}
