// Plan and heights of the Basilique-cathédrale Notre-Dame de Québec, authoring frame: u east along the nave from the west front,
// w south, origin at the centroid of the mapped outline (OSM way 103862161), before the final 1.3 deg turn onto the nave axis.
// Plan numbers come from the mapped outline and building parts; every height is estimated from photographs (docs/3d-quebec-notre-dame-de-quebec.md).
export const PLAN = {
  // the west front is a screen 3.2 m deep in front of the two towers (Baillairgé, 1843-44)
  centreFrontU: -41.2, sideFrontU: -40.8, towerFrontU: -38.0,
  wNorth: -16.3, wSouth: 11.0, bayN: -9.05, bayS: 3.55, // the pedimented centre bay (12.6 m, wider than the 10.3 m between the tower bases: it fronts them)
  sideTop: 8.6, centreTop: 12.8, pedimentBase: 13.4, pedimentApex: 16.5,
  atticTop: 20.2, blockTop: 24.6, crossTop: 28.3,
  // towers
  northTower: { u0: -38.0, u1: -29.4, w0: -16.0, w1: -7.9, top: 32.2, roofApex: 34.6 }, // 32.2 m to the cornice (was 26.4: about 1:1.5 to the belfry cross after the street photograph, not 1:1.8)
  southTower: { u0: -38.0, u1: -29.6, w0: 2.4, w1: 10.6, top: 14.6, roofApex: 16.4, shaftTop: 27.0, apothem: 3.9 },
  // nave and aisles
  nave: { u0: -37.9, u1: 14.7, w0: -7.9, w1: 5.0, eave: 16.5, ridge: 23.0 }, // w centre -1.45
  aisle: { u0: -29.7, uN1: 21.9, uS1: 24.4, wNorth: -17.6, wSouth: 15.4, eave: 12.0, high: 15.0 },
  apse: { cu: 14.7, cw: -1.45, r: 6.45 },
};
// where the belfry (octagonal shaft, cap, two lanterns, cross) stands: the south tower's axis
export const BELFRY = { cu: -33.8, cw: 6.5 };
