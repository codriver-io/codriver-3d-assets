import { CHURCH_RING, SANCTUARY_RING, FINIAL_RING, TOWER_RING, WALKWAY_RING, SCHOOL_RING, EAST_RING } from './westminster-abbey-mission-rings.js';
import { edgeNormal } from './westminster-abbey-mission-parts.js';

export { CHURCH_RING, SANCTUARY_RING, FINIAL_RING, TOWER_RING, WALKWAY_RING, SCHOOL_RING, EAST_RING };

// Heights (m), estimated from the one reference photo and the OSM storey tags (see the doc).
export const BASE_H = 4.3; // the church stands on an open undercroft of piers round a recessed brick core; its slab sits at the porch deck
export const WALL_H = 15; // church wall to the roof slab
export const SANCT_RISE = 1.1; // the central sanctuary roof stands this far above the wall tops
export const FINIAL_TOP = WALL_H + SANCT_RISE + 2.4;
export const EAVE_H = 10.4; // three storeys of 3.47 m
export const ROOF_RISE = 1.9; // low red hip over the wings
export const TOWER_H = 28; // apex of the arch, before the cross
export const CROSS_H = 3.2;
export const WIN = { w: 1.5, h: 8.6, y0: 4.9 }; // lancet over the entrance canopy

// Centre and size of the bell tower (OSM way 90078880, 6.5 x 5.94 m)
const tx = TOWER_RING.map((p) => p[0]), tz = TOWER_RING.map((p) => p[1]);
export const TOWER = {
  cx: (Math.min(...tx) + Math.max(...tx)) / 2, cz: (Math.min(...tz) + Math.max(...tz)) / 2,
  w: Math.max(...tx) - Math.min(...tx), d: Math.max(...tz) - Math.min(...tz),
};

// Entrance canopy on the north arm of the church (x from -0.5 to 13.8, z from -16 to -11.4, deck at 4.3-4.7 m).
export const PORCH = { x0: -0.5, x1: 13.8, z0: -16.0, z1: -11.4, y0: 4.3, y1: 4.7, colZ: -15.6, colX: [0.2, 3.5, 6.9, 10.2, 13.3] };

// Covered walkway from the cloister to the tower: deck 3.3-3.6 m, columns each side.
export const WALKWAY = { x0: 28.8, x1: 34.8, z0: -58, z1: -19, y0: 3.3, y1: 3.6, colX: [29.2, 34.4], colZ: [-52, -45.5, -39, -32.5, -26] };

// Lancet windows: one face of every saw-tooth bay, picked by the turn into the next edge so they pinwheel round the plan.
export function churchWindows() {
  const out = [], n = CHURCH_RING.length;
  for (let i = 0; i < n; i++) {
    const [x0, z0] = CHURCH_RING[i], [x1, z1] = CHURCH_RING[(i + 1) % n];
    if (Math.hypot(x1 - x0, z1 - z0) < 2) continue;
    const a = edgeNormal(CHURCH_RING, i), c = edgeNormal(CHURCH_RING, (i + 1) % n);
    if (a[0] * c[1] - a[1] * c[0] > 0.3) out.push(i);
  }
  return out;
}
