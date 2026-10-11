// Site frame of the Pavillon Pierre-Lassonde, measured from OpenStreetMap way 487158604 (read 2026-10-04) and put in the model frame:
// +X east, +Y up, +Z south, origin = area centroid of the outline.
//
// Design frame (a, y, b): a runs along the building's long axis toward the south-east (bearing 139.34 degrees), away from Grande Allée; b runs
// toward the north-east (bearing 49.34), across it; y is up. (0, 0) is the south-west corner of the street end, the end of the top box that
// cantilevers over the plaza. The axis angle is the one that makes the eleven mapped vertices fall on the fewest distinct a and b lines (the plan
// is an orthogonal staircase; the best fit leaves 0.5 m at worst). Rotation is baked here: nothing downstream rotates the model.
export const P0 = [-52.93, -21.93]; // design (0, 0) in local metres (x east, z south)
export const A = [0.65157, 0.75859]; // unit vector of a (south-east)
export const B = [0.75859, -0.65157]; // unit vector of b (north-east)
export const F = (a, y, b) => [P0[0] + a * A[0] + b * B[0], y, P0[1] + a * A[1] + b * B[1]];
export const xzToAb = (x, z) => [(x - P0[0]) * A[0] + (z - P0[1]) * A[1], (x - P0[0]) * B[0] + (z - P0[1]) * B[1]];
export const GRID_DEG = Math.atan2(A[0], -A[1]) * 180 / Math.PI; // bearing of a

// Plan levels in design metres. The mapped outline is the staircase (0,0) (67.3,0) (67.3,4.5) (91.9,4.5) (91.9,58.25) (41,58.25) (41,40.8)
// (21,40.8) (21,25.3) (0,25.3).
export const PLAN = {
  nwEnd: 0, hall: 21.0, v1Start: 41.0, v3End: 42.5, v2End: 67.35, seEnd: 91.9, // along a
  sw: 0, wall: 4.5, v3Width: 25.3, yard: 32.3, v2Ne: 40.8, v1Ne: 58.25, // across b: the top box's side, the main wall line, the three NE faces
  conA: 21.3, // the concrete wall beside the presbytery stands 0.3 m inside the mapped line so it never shares a plane with the neighbour
};
// Heights (m above the plaza). Hall 12.5 m is sourced; the rest is estimated from photographs.
export const Y = { podium: 5.0, v1: 8.5, v2: 13.0, v3: 26.5, lantern: 29.6 };
