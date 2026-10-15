// Runtime-only (Full 3D world): the Manzanares channel under the span, cut into the shared terrain
// lattice. The DEM (Terrarium, ~30 m) has no river channel here, so without this the ground stands
// at street grade under the whole bridge and buries the nine arches and their cutwaters. Asset
// authoring never imports this module; no DEM or absolute altitude is baked into a GLB.
//
// Between the two abutments the span crosses only water and pier strips: the canalised river (OSM
// relation 3615910, s 45.5-93.3) and the two Madrid Río pools under the side arches (relations
// 21595072, s 0-39.5, and 21595073, s 99.7-152.5), each pier on a 6 m strip between them. So every
// near-lattice node under the span, out to one lattice cell beyond each face, is lowered to the
// water: the river level the arch springing implies (RIVER, 9.2 m under the deck) plus WATER_UP.
// Never raised (a cutting only), never at a node of a triangle that holds the bank streets the
// deck lands on (the road continuation, full structure width, both ends), and no feather: every
// patch holds one lattice node, and the TIN supplies the slope between it and the untouched bank.
import { lngToMercX, latToMercY, mercYToLat, mercStretch } from '../../../facade/geo.js';
import { PROFILE as p, L, CENTER, HALF, RIVER } from './puente-de-segovia-profile.js';

// Water surface above the masonry's foot (the base course runs from RIVER to the springing 1 m up).
export const WATER_UP = 0.3;
// Bank streets kept: this far along the road beyond each joint, structure width plus this margin.
export const STREET_M = 60, STREET_MARGIN = 1;

const ox = lngToMercX(p.CHAMPLAIN.origin[0]), oy = latToMercY(p.CHAMPLAIN.origin[1]), S = p.STRETCH;
// Model (s, d) to Mercator; s beyond the joints runs on along the mapped road (the alignment).
const merc = (s, d = 0) => { const q = p.bridgePoint(s, d); return [ox + q.x * S, oy - q.z * S]; };
const local = (mx, my) => p.projectBridge((mx - ox) / S, (oy - my) / S);
/** The SW-NE TIN triangle holding a Mercator point (terrain/height-field.js#heightAt). */
export function triangleNodes(mx, my, step) {
  const x = mx / step, y = my / step, i = Math.floor(x), j = Math.floor(y);
  return x - i >= y - j ? [[i, j], [i + 1, j], [i + 1, j + 1]] : [[i, j], [i, j + 1], [i + 1, j + 1]];
}
/** Lattice nodes that must keep their DEM: every triangle under the bank streets at both joints. */
export function protectedNodes(step) {
  const out = new Set(), d0 = CENTER - HALF - STREET_MARGIN, d1 = CENTER + HALF + STREET_MARGIN;
  for (const [a, b] of [[-STREET_M, 0], [L, L + STREET_M]]) {
    for (let s = a; s <= b; s += 1) for (let d = d0; d <= d1 + 1e-6; d += 1) {
      for (const ij of triangleNodes(...merc(s, d), step)) out.add(ij.join(','));
    }
  }
  return out;
}
/** Candidate nodes: strictly between the joints, at most one lattice cell beyond either face. */
export function channelNodes(step) {
  const halo = step / S, keep = protectedNodes(step), out = [];
  const pts = [merc(0, CENTER - HALF - halo), merc(0, CENTER + HALF + halo), merc(L, CENTER - HALF - halo), merc(L, CENTER + HALF + halo)];
  const i0 = Math.floor(Math.min(...pts.map((q) => q[0])) / step), i1 = Math.ceil(Math.max(...pts.map((q) => q[0])) / step);
  const j0 = Math.floor(Math.min(...pts.map((q) => q[1])) / step), j1 = Math.ceil(Math.max(...pts.map((q) => q[1])) / step);
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
    const q = local(i * step, j * step);
    if (q.beyond || q.s <= 0 || q.s >= L) continue;
    if (q.lateral < CENTER - HALF - halo || q.lateral > CENTER + HALF + halo) continue;
    if (keep.has(`${i},${j}`)) continue;
    out.push({ i, j, s: q.s, lateral: q.lateral });
  }
  return out;
}

/**
 * The cutting as a landmarkZone footprint (terrain-footprints.js), or null while the DEM at the
 * joints or at any channel node is unknown. Heights: the deck rides a straight line between the
 * DEM at its two joints (the layer's groundControls), so the water at station s is that line plus
 * (RIVER + WATER_UP) model metres, converted to native DEM metres at the node.
 */
export function riverCut(terrain) {
  if (!terrain?.enabled || !terrain.mosaic || !terrain.near) return null;
  const step = terrain.near.step, z = terrain.near.demZ, k = terrain.k || 1;
  const west = merc(0), east = merc(L);
  const datumNative = terrain.mosaic.sample(...west, z);
  const bank = [terrain.bakedAt(...west), terrain.bakedAt(...east)];
  if (datumNative === null || datumNative === undefined || bank.some((h) => h === null || h === undefined)) return null;
  const terraces = [], audit = [];
  for (const n of channelNodes(step)) {
    const mx = n.i * step, my = n.j * step, before = terrain.mosaic.sample(mx, my, z);
    if (before === null || before === undefined) return null;
    const t = n.s / L, floorBaked = bank[0] + (bank[1] - bank[0]) * t + (RIVER + WATER_UP) * S;
    const floor = floorBaked / (mercStretch(mercYToLat(my)) * k);
    const after = Math.min(before, floor);
    if (before - after < 0.01) continue;
    const r = step * 0.04, ring = [[mx - r, my - r], [mx + r, my - r], [mx + r, my + r], [mx - r, my + r]];
    terraces.push({ ring, offsetM: (after - datumNative) * k, featherM: 0 });
    audit.push({ i: n.i, j: n.j, s: n.s, lateral: n.lateral, beforeM: before, afterM: after });
  }
  if (!terraces.length) return null;
  // The first terrace doubles as the zone's own ring; refs pin the datum to the west joint sample.
  return { ring: terraces[0].ring, refs: [west], terraces, featherM: 0, stretch: S,
    audit: { stepM: step / S, waterUpM: WATER_UP, nodes: audit } };
}
