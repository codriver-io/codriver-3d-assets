// Amsterdam Centraal, facade frame. +u runs along the platforms from the west end toward
// De Oost (bearing AXIS_DEG, the long edges of Cuypersgebouw way 1239767708). +v runs
// toward the city, across Stationsplein (AXIS_DEG + 90). y is up. The same rotation the
// layer uses for footprints (mercator metres about SPEC.origin), so the mesh sits in the
// mapped rings. See docs/3d-top-cities-amsterdam-centraal.md.
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';

export const AXIS_DEG = 120.67;
const beta = (AXIS_DEG * Math.PI) / 180;
const sB = Math.sin(beta), cB = Math.cos(beta);
// rotateY(ROTATION) sends a box's local +X along +u and its local +Z along +v.
export const ROTATION = Math.PI / 2 - beta;

const stretch = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oy = latToMercY(SPEC.origin[1]);

/** [lng, lat] -> [u, v] metres. */
export function toFacade(lng, lat) {
  const east = (lngToMercX(lng) - ox) / stretch, north = (latToMercY(lat) - oy) / stretch;
  return [east * sB + north * cB, east * cB - north * sB];
}
/** [u, v] -> [x east, z south]. */
export const toWorld = (u, v) => [u * sB + v * cB, -u * cB + v * sB];
/** [x east, z south] -> [u, v]. */
export const fromWorld = (x, z) => [sB * x - cB * z, cB * x + sB * z];

// Heights in metres. OSM `height` is the top (AHN-style); roof:height is the roof below it.
// The wing part's roof:height 0.75 contradicts its own cross-gables and the photographs, so the
// wing eave is taken from the gable spring (22.45 − 4.65) instead. See the doc.
export const H = {
  wingEave: 17.8,
  wingRidge: 23.3,     // way 752653565
  gable: 22.45,        // wing cross-gables
  centerWall: 23.35,   // meets the wing ridge; OSM central wall is 29.25 − 6.8 = 22.45
  center: 29.25,       // central gable, ways 752653566 / 752653571 / 752653573
  towerEave: 26.25,    // 34.25 − roof:height 8
  tower: 34.25,        // ways 752653568 / 752653567, pyramidal apex
  finial: 36.65,       // iron crest above the apex (estimated, photographs)
  pavilion: 26,        // Koningspaviljoen, way 752328420
  west: 12,            // west gambrel, way 1239767723
  oostEave: 15,        // De Oost 20 − roof:height 5
  oost: 20,
  spring: 0.35,        // train-shed arch feet, just above grade
};

// Plan rectangles are inset from the OSM part bounds so trims stay inside the rings.
// u0, u1, v0 (track side), v1 (city side).
export const PLAN = {
  // Continuous Cuypers wing behind the towers, way 752653565 (u −86.2..77, v −26.8..−1.5)
  // plus the back strip to the headhouse's track wall (v −29.08).
  wing: { u0: -86.1, u1: 76.6, v0: -28.72, v1: -10.72 },
  // Towers, ways 752653568 and 752653567, inset ~0.18 m.
  westTower: { u0: -18.9, u1: -11.85, v0: -5.28, v1: 1.12 },
  eastTower: { u0: 19.14, u1: 26.2, v0: -5.26, v1: 1.22 },
  // Raised centre between the towers. The porch way 1240155432 reaches v 2.19; the mass stops inside it.
  center: { u0: -11.45, u1: 18.75, v0: -21.6, v1: 0.42 },
  // West gambrel, way 1239767723. The outline steps: v −18.8 west of u −132, v −16.8 until u −94.
  westCap: { u0: -146.5, u1: -131.55, v0: -28.55, v1: -19.35 },
  westLow: { u0: -131.7, u1: -94.5, v0: -28.55, v1: -17.25 },
  // Koningspaviljoen, way 1239767706. The city front is v ≈ −8.5; only the entrance bay reaches v 2.
  koning: { u0: 74.7, u1: 94.1, v0: -13.45, v1: -8.95 },
  koningRear: { u0: 90.3, u1: 99.7, v0: -28.45, v1: -13.2 },
  koningPorch: { u0: 83.15, u1: 86.65, v0: -8.8, v1: 1.65 },
  // De Oost, way 1239767701.
  oost: { u0: 100.6, u1: 216.6, v0: -28.45, v1: -12.55 },
};

// Wing cross-gables. `mapped` ones are OSM gabled parts (height 22.45); the others are the
// intermediate gables the facade photographs show between those larger bays.
export const GABLES = [
  { u0: -85.7, u1: -82.95, peak: H.gable, mapped: true },  // 1239767722
  { u0: -75.6, u1: -71.9, peak: 21.05, mapped: false },
  { u0: -67.2, u1: -63.5, peak: 21.05, mapped: false },
  { u0: -56.0, u1: -49.17, peak: H.gable, mapped: true },  // 1239767717
  { u0: -45.3, u1: -41.6, peak: 21.05, mapped: false },
  { u0: -37.25, u1: -30.41, peak: H.gable, mapped: true }, // 1239767716
  { u0: -26.4, u1: -22.7, peak: 21.05, mapped: false },
  { u0: 30.3, u1: 34.0, peak: 21.05, mapped: false },
  { u0: 37.74, u1: 44.54, peak: H.gable, mapped: true },   // 1240314142
  { u0: 48.7, u1: 52.4, peak: 21.05, mapped: false },
  { u0: 56.5, u1: 63.23, peak: H.gable, mapped: true },    // 1240314141
  { u0: 66.8, u1: 70.5, peak: 21.05, mapped: false },
];

// Platform sheds. Spans are the mapped rings inset so the arch, its thickness and the ribs
// stay inside. Zuidkap is the Eijmer shed: a near-semicircle on a 44 m span (published
// "bijna 45 m", "ongeveer 23 m"). Middle and north crowns are semicircles on their own spans.
export const SHEDS = {
  zuid: { u0: -143.5, u1: 149.5, v0: -71.9, v1: -29.55 },
  midden: { u0: -205.5, u1: 140.5, v0: -91.15, v1: -74.35 },
  noord: { u0: -204.5, u1: 139.5, v0: -127.7, v1: -93.85 },
};
export const shedRise = (shed) => (shed.v1 - shed.v0) * 0.5;
export const shedCrown = (shed) => H.spring + shedRise(shed);
