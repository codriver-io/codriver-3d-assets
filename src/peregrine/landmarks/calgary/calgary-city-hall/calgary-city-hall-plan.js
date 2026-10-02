// Plan and heights of Calgary City Hall in building axes: u along the north front (east), v into the building (south),
// metres from the centroid of the mapped outline (OSM way 37829977, snapped to its rectilinear walls). The measured outline
// is axis-aligned in these axes to within +-0.2 m (the building stands 2.079 degrees off the grid).

// Main walls, clockwise (north edge west to east): the 36 x 27.7 m block, the west gabled bay and the rear porch.
// The projecting clock-tower base (u -9.0..3.8, v to -16.2) and the flat-roofed east wing are separate masses.
export const RING_BODY = [
  [-17.9, -13.85], [18.45, -13.85], [18.45, 13.8], [2.8, 13.8], [2.8, 16.2], [-9.0, 16.2], [-9.0, 13.8],
  [-17.9, 13.8], [-17.9, 2.7], [-22.2, 2.7], [-22.2, -2.8], [-17.9, -2.8],
];
export const FRONT_V = -13.85; // north wall plane
// The east wing filling the mapped 2.6 x 9.5 m bump on the east wall: a plain two-storey box, flat roof edge at `top`.
export const EAST_ANNEX = { u0: 18.0, u1: 20.6, v0: -4.2, v1: 5.3, top: 8.9 };
export const ANNEX_ROWS = [[2.2, 2.3], [5.5, 2.3]]; // [sill y, height] of the two window rows on its east face

export const TOWER = {
  cu: -2.6, cv: -11.6, // centre of the shaft
  base: { u0: -9.0, u1: 3.8, v0: -16.2, v1: -12.4 }, // projecting base block (12.8 m wide, 2.35 m beyond the wall)
  half: 4.2, // shaft half-width (8.4 m square), front face at v = -15.8
  stage: 4.0, // clock stage half-width
};

// Heights, metres above local grade.
export const Y = {
  plinth: 1.6, // top of the rusticated base, entrance floor
  balcony: 6.95, // top of the balcony slab over the first-floor veranda
  cornice: 12.4, // top of the wall; the cornice crowns it at 12.0-12.8
  eave: 12.7, plateau: 17.7, // roof eave (inside the cornice) and the flat top of the steep hip
  baseTop: 7.9, // tower base block, belt course top
  shaftTop: 21.8, stageBottom: 22.4, stageTop: 26.3, corniceTop: 26.9, apex: 32.0, finial: 32.7,
  dial: 24.35, dialR: 1.45,
};
export const ROOF_RUN = 5.0; // horizontal run of the steep hip (45 degrees)
export const EAVE_OVER = 0.6;
export const CORNICE_OUT = 0.75;

// Window rows on a plain wall.
export const ROWS = {
  basement: { y: 0.5, h: 0.85, w: 1.1 },
  first: { y: 2.8, h: 3.1, w: 1.5 },
  second: { y: 7.9, h: 3.0, w: 1.7 },
};
