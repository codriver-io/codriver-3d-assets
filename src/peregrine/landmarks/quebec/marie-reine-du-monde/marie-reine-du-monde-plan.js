// Plan and levels of the Cathédrale Marie-Reine-du-Monde in BUILDING axes: x across the church (to the right of someone facing the façade),
// z along the nave toward the façade on boulevard René-Lévesque, origin on the dome axis, y up from the pavement.
// The figures come from the mapped outline (OSM way 21335240) and its building:part ways, read in these axes (rotated 123.5 degrees about the dome axis); heights
// are the OSM part heights where they exist (nave and transept roof halves 25 to 31 m, drum ring 33 m, dome part 63 m, lantern part 62 to 77 m, façade block 27 m,
// porch pediment 21 to 25 m, rear block 10 m, low blocks 15 m) and are otherwise estimated from photographs.

export const LEVELS = {
  eaves: 25.0, // cornice of the nave, transept and corner blocks (OSM part tops 25 m; roof parts rise 6 m from here to 31 m)
  ridge: 31.0,
  naveEaves: 26.5, // nave roof meets the aisle lean-to here
  facade: 27.0, // top of the façade cornice, under the statues (OSM part 1144585460: 27 m)
  platform: 1.8, // portico floor above the pavement: five risers of 0.36 m
  rear: 10.0, // rear block (OSM 10 m)
  low: 15.0, // low blocks beside the transept (OSM 15 m)
  tip: 77.0,
};

// Rear block (OSM 10 m, mapped as a 31.2 m x 26 m rectangle): modelled as a short straight run with a half-round apse (the chevet) at the back, inside the mapped rectangle.
// The back wall still stands at z = -50.4 on the axis; the polygon's corners at the back are cut by the apse (it sits inside the mapped outline).
export const REAR = { halfW: 15.6, zFront: -24.4, zBack: -50.4, segments: 8, rise: 4.2 }; // rise: height of the half-cone roof's apex over the 10 m wall tops

// Nave aisle walls (ashlar): 38.2 m wide between the façade block and the corner blocks, 45.8 m wide for the last 13.6 m.
export const NAVE = [[19.1, 56.3], [19.1, 37.8], [22.9, 37.8], [22.9, 24.2], [-22.9, 24.2], [-22.9, 37.8], [-19.1, 37.8], [-19.1, 56.3]];

// Crossing (fieldstone): the corner blocks, the transept arms with their three-sided ends, and the choir arm. Right half front to back, mirrored.
const CROSS_RIGHT = [[22.9, 24.2], [23.8, 24.2], [23.8, 23.0], [24.8, 23.0], [24.8, 8.0], [28.6, 8.0], [34.1, 4.9], [34.4, -3.6], [26.8, -8.2], [24.8, -8.2], [24.8, -22.2], [23.7, -22.2], [23.7, -23.4], [22.7, -23.4], [22.7, -24.4], [8.4, -24.4], [8.4, -34.0]];
// The left (-x) rear corner block is notched in the outline (x = -23.2 and -23.8 between z = -8.2 and -12.6); the right side is straight.
const LEFT_REAR = [[-26.8, -8.2], [-23.2, -8.2], [-23.2, -11.4], [-23.8, -11.4], [-23.8, -12.6], [-24.8, -12.6], [-24.8, -22.2]];
const CROSS_LEFT = [...CROSS_RIGHT.slice(0, 8).map(([x, z]) => [-x, z]), ...LEFT_REAR, ...CROSS_RIGHT.slice(11).map(([x, z]) => [-x, z])];
export const CROSS = [...CROSS_RIGHT, ...CROSS_LEFT.reverse()];

// Transept end: the three-sided apse-like closure (right arm), used for the roof fan and the end windows.
export const TRANSEPT_END = [[28.6, 8.0], [34.1, 4.9], [34.4, -3.6], [26.8, -8.2]];

export const SMALL_DOMES = [[17.8, 18.1], [-17.8, 18.1]]; // OSM dome parts 1144585448 and 1144585447 (radius about 4.6 m)
