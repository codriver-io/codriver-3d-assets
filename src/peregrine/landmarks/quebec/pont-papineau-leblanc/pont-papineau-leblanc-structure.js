import {
  PROFILE as p, TOP, MAIN_SPAN, SIDE_SPAN, STAYED, PYLON_ABOVE, PYLON_S, MID_S, STAYED_START, STAYED_END,
  BRIDGE_START, BRIDGE_END, DECK_HALF, KERB, MEDIAN, ROAD_EDGES, PVI_S, VC,
} from './pont-papineau-leblanc-profile.js';

// Structural layout shared by the geometry, the views and the tests. Heights are metres above local y = 0
// (the water) on the authored (flat-map) profile; stations and laterals are the profile's frame (s north-west
// to south-east, d + south-west). Published values are named in pont-papineau-leblanc-profile.js; everything
// here is estimated from photographs unless it says otherwise.
export const h = p.deckHeight;

// ---- Pylons and stays --------------------------------------------------------------------------------
/** Pylon: one steel box column in the median, 1.8 m x 1.8 m (published), its top PYLON_ABOVE (38.4 m,
 * published) above the deck. */
export const PYLON_W = 1.8;
export const pylonTop = (s) => h(s) + PYLON_ABOVE;
/**
 * Stays: a fan in the median plane, two stays each side of each pylon (photographs: two stays per side in
 * elevation; published: four bundles of 12 cables, anchored every 140-170 ft along the deck). Each stay is
 * drawn as two parallel cables either side of the median (a bundle on each face of the pylon). Anchors
 * (estimated, intervals 43-51 m): 47 and 95 m into the main span (51 m between the outer pair at mid-span),
 * 43 and 85 m into each side span (5 m short of the end piers). The outer stays leave the pylon 1.2 m below
 * its top, the inner ones 3.4 m below.
 */
export const STAY_D = 0.45;
export const STAYS = PYLON_S.flatMap((ps, k) => {
  const toMid = k === 0 ? 1 : -1;
  return [
    { pylon: ps, s: ps + toMid * 47, drop: 3.4, side: 'main' },
    { pylon: ps, s: ps + toMid * 95, drop: 1.2, side: 'main' },
    { pylon: ps, s: ps - toMid * 43, drop: 3.4, side: 'back' },
    { pylon: ps, s: ps - toMid * 85, drop: 1.2, side: 'back' },
  ];
});
/** Stay anchor on the deck: inside the median barrier, 0.5 m above the road. */
export const ANCHOR_UP = 0.5;

// ---- Cross-section ---------------------------------------------------------------------------------
/** Orthotropic steel deck plate under the pavement, cantilevered to the parapets. */
export const PLATE_TOP = -0.27;
export const PLATE = 0.45;
/** Edge girder (fascia) under the cantilever tips. */
export const FASCIA_IN = 13.0;
export const FASCIA_BOT = -1.35;
/** Two-cell trapezoidal box girder (weathering steel), its bottom 3.7 m under the road so the clearance over
 * the water is the published 7.6 m: top 17 m wide, bottom 12 m. */
export const BOX_TOP_HALF = 8.5;
export const BOX_BOT_HALF = 6.0;
export const BOX_BOT = -(TOP - 7.6);
/** Transverse cantilever ribs under the deck plate, from the box webs to the fascia (near only). */
export const RIB_STEP = 4.75;
/** End spans (end pier to abutment, ~11-14 m): four shallow plate girders, 1.4 m deep under the plate. */
export const END_GIRDER_D = [-9.6, -3.2, 3.2, 9.6];
export const END_GIRDER = 1.4;
/** Parapets and the median. */
export const PARAPET_TOP = 1.05;
/** On the bridge: a 0.55 m concrete curb under a steel rail (top PARAPET_TOP) on posts every 3 m. */
export const CURB_TOP = 0.55;
export const MEDIAN_SLAB = 0.2;
export const MEDIAN_WALL = 0.6;
export const MEDIAN_TOP = 0.9;

// ---- Supports --------------------------------------------------------------------------------------
/** End piers of the cable-stayed unit and the abutments at the mapped bridge ends. */
export const END_PIER_S = [STAYED_START, STAYED_END];
export const ABUTMENT_S = [BRIDGE_START, BRIDGE_END];
/** Main piers under the pylons: round concrete shafts flaring to a cap under the box (photograph 4). */
export const PIER_R0 = 3.2;
export const PIER_R1 = 4.6;

export {
  TOP, MAIN_SPAN, SIDE_SPAN, STAYED, PYLON_ABOVE, PYLON_S, MID_S, STAYED_START, STAYED_END, BRIDGE_START,
  BRIDGE_END, DECK_HALF, KERB, MEDIAN, ROAD_EDGES, PVI_S, VC,
};
