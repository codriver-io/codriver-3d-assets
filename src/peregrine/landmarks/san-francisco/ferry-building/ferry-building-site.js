import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';

// The facade frame. u runs along the Embarcadero toward the north-north-west end (bearing AXIS_DEG),
// v runs from the city front (Market Street, v < 0) to the bay (v > 0), y is up. It has the same
// handedness as the exported east / up / south and differs from it by ROTATION about y. The model is
// authored in this frame with the plan aligned to the axes and rotated once at the end (geometry.js).
// u = 0 is the middle of the 201.6 m block, v = 0 the middle of its 47.2 m depth.
export const AXIS_DEG = SPEC.axisBearing;
const beta = (AXIS_DEG * Math.PI) / 180;
export const ROTATION = Math.PI / 2 - beta; // rotateY(ROTATION): (u, v) -> (east, south)
const sB = Math.sin(beta), cB = Math.cos(beta);

const stretch = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oy = latToMercY(SPEC.origin[1]);

/** [lng, lat] -> [u, v] in the facade frame, metres (the same conversion the layer uses). */
export function toFacade(lng, lat) {
  const east = (lngToMercX(lng) - ox) / stretch, north = (latToMercY(lat) - oy) / stretch;
  return [east * sB + north * cB, east * cB - north * sB];
}
/** [u, v] -> [x east, z south] in the exported model frame. */
export const toWorld = (u, v) => [u * sB + v * cB, -u * cB + v * sB];

// ---- measured layout, facade frame, metres ----------------------------------------------------------
// Read off the mapped OSM outline (way 558731934, 24460886 and the tower parts), see
// docs/3d-san-francisco-ferry-building.md. (est.) marks a value read off photographs.
export const PLAN = {
  u0: -100.8, u1: 100.8,      // 201.6 m long (Wikipedia: 660 ft = 201 m)
  v0: -23.6, v1: 23.6,        // 47.2 m deep (156 ft = 47.5 m in the HABS/NRHP descriptions)
  pavU0: -20.9, pavU1: 22.4,  // central pavilion, 43.3 m wide, centred on u = 0.75
  pavV: -32.5,                // it stands 8.9 m proud of the wings toward Market Street
  towerU: 0.4, towerV: -18.65, // clock tower axis: 12.3 x 11.3 m first stage (OSM 404449724)
  canopyV: 26.6,              // bay-side walkway strip, 3 m wide (OSM 1189071405)
};
export const H = {
  wing: 14.0,        // cornice top of the city arcade (est., photographs)
  pavilion: 16.1,    // pavilion attic top (OSM building:part height=16.1)
  ridge: 17.5,       // Great Nave roof ridge (est.)
  pole: 75.0,        // flagpole tip, 245 ft (Wikipedia / Port of San Francisco)
};
