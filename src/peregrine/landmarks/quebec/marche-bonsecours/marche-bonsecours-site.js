import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';

// The facade frame. u runs along the market toward the north-north-east end (bearing AXIS_DEG), v runs from rue Saint-Paul
// (v < 0, the portico side, facing west-north-west) to rue de la Commune and the Old Port (v > 0, facing east-south-east), y is up.
// It has the same handedness as the exported east / up / south and differs from it by ROTATION about y. The model is authored in this
// frame with the plan aligned to the axes and rotated once at the end (geometry.js). u = 0 is the middle of the 164 m block (the dome
// and portico axis), v = 0 the middle of its depth.
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

// ---- measured layout, facade frame, metres (read off OSM way 87389029; the outline is symmetric to about 0.3 m) ----------
export const PLAN = {
  uEnd: 82.1,                    // end walls (rue Bonsecours and rue du Marché-Bonsecours sides)
  front: -9.5, river: 9.8,       // main walls of the wings (19.3 m deep)
  endV0: -9.6, endV1: 10.1,      // the 3.8 m end bays are as deep as the wings
  pavU0: 63.1, pavU1: 78.3,      // end pavilions: 15.2 m long, 24 m deep
  pavV0: -11.9, pavV1: 12.1,
  blockU: 9.9, blockV1: 10.3,    // central block (and portico) 19.8 m wide; its river wall stands 0.5 m proud of the wings
  porticoV: -13.3,               // front edge of the portico platform (OSM outline)
  bumpFront: { u0: 29.9, u1: 43.3, v: -10.2 },       // the one 0.7 m bay on the Saint-Paul side (east half)
  bayRiverE: { u0: 30.3, u1: 43.9, v: 11.5 },        // projecting river bays, 13.6 m wide, 1.7 / 2.0 m proud (the west one is 11.6 to 12.0 mapped, 11.8 modelled)
  bayRiverW: { u0: -42.8, u1: -29.4, v: 11.8 }, // mapped 11.6 at the south end, 12.0 at the north end
  domeV: 0.4,                    // the drum is centred on the block
};
// (est.) from photographs; floor levels are rigid, the plinth absorbs the +-1.4 m of slope
export const H = {
  plinth: 1.7,          // top of the stone plinth = main floor level
  wing: 12.9,           // cornice top of the two-storey wings
  parapet: 13.4,
  pav: 15.0,            // three-storey end pavilions: cornice top
  pavRidge: 18.0,       // gable ridge of the pavilion roofs
  block: 18.8,          // central block cornice top
  portico: 12.6,        // portico cornice top
  pedimentApex: 15.6,
};
