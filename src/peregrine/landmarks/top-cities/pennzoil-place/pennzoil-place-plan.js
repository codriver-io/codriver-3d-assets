// Pennzoil Place plan, in metres east/south about the outline centroid.
// Rings converted once from OSM (ways 580965929, 260511513, 260511516) with
// facade/geo.js lngToMercX / latToMercY / mercStretch at SPEC.origin.
// This module does not import the facade: the metres are the literal result.

import { SPEC } from './config.js';

// Published figures. 523 ft roof (Hines; Wikipedia infobox). 10 ft clear slot.
// 115 ft glass atrium. 45° is the building's own geometry (Hines history page).
export const RIDGE = 159.4104;
export const SLOT_FT = 3.048;
export const ATRIUM = 35.052;
export const FLOORS = 36;
export const PITCH = RIDGE / FLOORS; // 4.428 m, 36 bands on the tall street wall
export const ENTRY = 5.9; // greenhouse wall under the pyramid eave

// [x east, z south]. Louisiana (south tower) then Milam (north tower).
// Vertex 0 is the street/leg corner used below; order follows the OSM ring.
const LOUISIANA = [
  [9.4238, 53.4332],
  [-0.5009, -0.0445],
  [-31.5989, -20.9837],
  [-53.3810, 10.0633],
];
const MILAM = [
  [-9.9327, -52.8658],
  [-1.0517, -3.0390],
  [32.6168, 19.8482],
  [52.8721, -9.4956],
];
// Outline of way 580965929, for containment tests. Same conversion.
export const OUTLINE = [
  [-53.3810, 10.0633],
  [-31.5989, -20.9837],
  [-9.9327, -52.8658],
  [52.8721, -9.4956],
  [32.6168, 19.8482],
  [9.4238, 53.4332],
];

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function centroid(ring) {
  let x = 0, z = 0;
  for (const p of ring) { x += p[0]; z += p[1]; }
  return [x / ring.length, z / ring.length];
}

// Signed distance from p to the infinite line through a → b (left of a→b is positive).
function lineDist(p, a, b) {
  const d = sub(b, a), L = len(d) || 1;
  return (d[0] * (p[1] - a[1]) - d[1] * (p[0] - a[0])) / L;
}

// Longest edge is the street front. The edge most parallel to it is the slot.
function classify(ring) {
  const edges = ring.map((a, i) => {
    const b = ring[(i + 1) % ring.length];
    const d = sub(b, a);
    const bearing = (Math.atan2(d[0], -d[1]) * 180 / Math.PI + 360) % 360;
    return { i, a, b, length: len(d), bearing };
  });
  const street = edges.reduce((m, e) => (e.length > m.length ? e : m));
  let slot = null, best = 1e9;
  for (const e of edges) {
    if (e === street) continue;
    let diff = Math.abs(e.bearing - street.bearing);
    if (diff > 180) diff = 360 - diff;
    const parallel = Math.abs(diff - 180);
    if (parallel < best) { best = parallel; slot = e; }
  }
  return { ring, street, slot, cen: centroid(ring) };
}

function gapOf(la, mi) {
  const samples = [lineDist(mi.slot.a, la.slot.a, la.slot.b), lineDist(mi.slot.b, la.slot.a, la.slot.b)];
  return Math.abs(samples[0] + samples[1]) / 2;
}

function separate(la, mi) {
  // Work on copies so the module-level rings stay the mapped survey.
  const copy = (t) => ({
    cen: t.cen,
    street: { ...t.street, a: [...t.street.a], b: [...t.street.b] },
    slot: { ...t.slot, a: [...t.slot.a], b: [...t.slot.b] },
    ring: t.ring.map((p) => [...p]),
  });
  const A = copy(la), B = copy(mi);
  // Rebind slot/street endpoints onto the copied ring by nearest vertex.
  const bind = (tower, src) => {
    const near = (p) => tower.ring.reduce((m, q) => (len(sub(q, p)) < len(sub(m, p)) ? q : m));
    tower.slot = { ...tower.slot, a: near(src.slot.a), b: near(src.slot.b) };
    tower.street = { ...tower.street, a: near(src.street.a), b: near(src.street.b) };
  };
  bind(A, la); bind(B, mi);
  const move = (tower, metres) => {
    const { a, b } = tower.slot;
    const d = sub(b, a), L = len(d) || 1;
    let px = -d[1] / L, pz = d[0] / L;
    if (dot([px, pz], sub(tower.cen, mid(a, b))) < 0) { px = -px; pz = -pz; }
    const mv = [px * metres, pz * metres];
    for (const p of [a, b]) { p[0] += mv[0]; p[1] += mv[1]; }
  };
  for (let k = 0; k < 4; k++) {
    const gap = gapOf(A, B);
    const step = (SLOT_FT - gap) / 2;
    if (Math.abs(step) < 0.005) break;
    move(A, step); move(B, step);
  }
  return { louisiana: A, milam: B, gap: gapOf(A, B) };
}

function towerShape(tower) {
  const { slot, street } = tower;
  const signed = (p) => lineDist(p, slot.a, slot.b);
  const sign = Math.sign(signed(mid(street.a, street.b))) || 1;
  const dist = (p) => signed(p) * sign;
  const rise = Math.max(dist(street.a), dist(street.b));
  const eave = RIDGE - rise; // 45°: height gain equals perpendicular run
  const height = (p) => eave + dist(p);
  const outwardOf = (a, b) => {
    const d = sub(b, a), L = len(d) || 1;
    let px = -d[1] / L, pz = d[0] / L;
    if (dot([px, pz], sub(tower.cen, mid(a, b))) > 0) { px = -px; pz = -pz; }
    return [px, pz];
  };
  const bearing = (n) => (Math.atan2(n[0], -n[1]) * 180 / Math.PI + 360) % 360;
  const streetN = outwardOf(street.a, street.b);
  return {
    ring: tower.ring,
    slot, street,
    eave, rise,
    height,
    streetBearing: bearing(streetN),
    streetOut: streetN,
    slotOut: outwardOf(slot.a, slot.b),
    // The two edges that are neither the street nor the slot. Pairing a slot
    // end with the street end that does not share it draws the diagonals.
    legs: ringLegs(tower),
  };
}

function ringLegs(tower) {
  const { ring, street, slot } = tower;
  const same = (p, q) => p[0] === q[0] && p[1] === q[1];
  const isEdge = (a, b, edge) => (same(a, edge.a) && same(b, edge.b)) || (same(a, edge.b) && same(b, edge.a));
  const legs = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    if (isEdge(a, b, street) || isEdge(a, b, slot)) continue;
    legs.push({ a, b });
  }
  return legs;
}

let cached = null;

/** Solved plan: towers opened to a 10 ft throat, 45° eaves, two atrium courts. */
export function solve() {
  if (cached) return cached;
  const rawLa = classify(LOUISIANA.map((p) => [...p]));
  const rawMi = classify(MILAM.map((p) => [...p]));
  const opened = separate(rawLa, rawMi);
  const louisiana = towerShape(opened.louisiana);
  const milam = towerShape(opened.milam);
  // South court opens toward +z (Louisiana street corner); north court toward Milam's.
  // Throat is the two slot endpoints that face each other (the short overlap).
  const throat = closestPair(louisiana.slot, milam.slot);
  cached = courtsFromTopology(louisiana, milam, opened.gap, throat);
  return cached;
}

function closestPair(slotA, slotB) {
  const endsA = [slotA.a, slotA.b], endsB = [slotB.a, slotB.b];
  let best = null, bd = 1e9;
  for (const a of endsA) for (const b of endsB) {
    const d = len(sub(a, b));
    if (d < bd) { bd = d; best = { a, b, distance: d }; }
  }
  return best;
}

function courtsFromTopology(louisiana, milam, gap, throat) {
  // After the slot nudge, Louisiana ring order is still
  //   0 street/south corner, 1 throat, 2 far slot, 3 street/north corner
  // and Milam is
  //   0 street/north corner, 1 throat, 2 far slot, 3 street/east corner.
  // Those indices are exactly how classify + the original rings were built:
  // Louisiana slot is edge 1 (vert 1→2), street is edge 3 (vert 3→0).
  // Milam slot is edge 1 (vert 1→2), street is edge 3 (vert 3→0).
  const la = louisiana.ring, mi = milam.ring;
  // South cap is outline edge la[0]–mi[2]. North cap is mi[0]–la[2].
  // Each ridge end pairs with the outer corner on the SAME tower so the
  // ruled roof is not twisted: la[1]→la[0] (south) and la[1]→la[2] (north).
  const south = { name: 'south', ridgeA: la[1], ridgeB: mi[1], outerA: la[0], outerB: mi[2] };
  const north = { name: 'north', ridgeA: la[1], ridgeB: mi[1], outerA: la[2], outerB: mi[0] };
  return {
    ridge: RIDGE,
    slot: gap,
    atrium: ATRIUM,
    pitch: PITCH,
    entry: ENTRY,
    louisiana, milam,
    south, north,
    throat,
    outline: OUTLINE,
    origin: SPEC.origin,
  };
}
