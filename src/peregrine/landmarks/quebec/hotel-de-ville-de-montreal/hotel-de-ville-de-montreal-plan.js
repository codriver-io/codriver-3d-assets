// Plan and levels of the Hotel de Ville de Montreal in BUILDING AXES (metres): s runs along the rue Notre-Dame front to the
// right as seen from the street (bearing 29.45), d runs outward from the front (bearing 119.45), y is up from the front grade.
// s = 0 is the front's centre line; the model's origin lies AXIS_S metres to the left of it (the mapped outline's centroid).
// Mapped (OSM way 20919180 / 396654637, taken in these axes): width 69.5 m, depth 35.1 m, central pavilion 14.5 m wide with its stair
// out to d = 24.3, end pavilion 11.8 m wide and 2.2 m proud (right end), rear central bay 5.3 m deep, rear block 64.3 m x 19.8 m.
export const AXIS_S = -0.1;
export const BEARING = 29.45;
export const PLAN = {
  half: 34.7, halfMid: 33.0, // overall half width; half width of the recessed middle of each end wall
  wallF: 17.8, wallR: -17.5, // front wall plane (wings), rear wall plane
  penIn: 22.9, penFront: 19.8, penFrontBack: 11.5, penRearFront: -8.0, // end pavilions: inner edge, front face, depth ranges front/rear
  cenHalf: 7.25, cenFront: 20.9, // central pavilion: half width and front face
  stairHalf: 4.2, stairFront: 24.3, platform: 2.2, // stair: half width, foot, height of the doorsill
  rearHalf: 10.5, rearBack: -22.4, // rear central bay
  ext: { s0: -30.4, s1: 33.8, d0: -37.2, d1: -17.0, top: 4.8, floor: -2.5 }, // 1932-34 rear block and its terrace
  tower: { s: 0.0, d: 8.5 }, // campanile axis
};
export const L = {
  plinth: 0.9, belt: [4.8, 5.3], cor1: [9.6, 10.3], cor2: [13.2, 14.0], wallTop: 15.5, topCor: [15.5, 16.2], bal: [16.2, 17.0],
  roof: { i0: 0.9, y0: 16.2, i1: 3.8, y1: 22.8, i2: 9.0, y2: 24.4 }, // mansard: steep lower slope, shallow upper slope, flat cap
  win: { ground: [1.5, 2.9], first: [6.0, 3.2], second: [10.8, 2.1], attic: [14.3, 0.95] }, // [sill, height]
};
