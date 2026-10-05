// Palace of Westminster in the building frame. +x (u) runs along the river front toward Elizabeth Tower,
// compass bearing 10.19° (north-north-east). +z (v) runs out of the river front toward the Thames, bearing
// 100.19°. y is up. (0, 0) is the area centroid of relation/1567699's outer ring. `angle` is the rotateY that
// turns this frame onto east/up/south.
//
// Plan numbers are the mapped outlines converted to this frame (outer way 367642719, Elizabeth Tower way
// 123557148, Victoria Tower way 367642689, Westminster Hall way 367642704). Heights that are not named in
// PLAN as sourced are estimated from photographs; see docs/3d-top-cities-palace-of-westminster.md.
export const PLAN = {
  angle: (180 - 100.19) * Math.PI / 180,
  bearing: 100.19,
  // Elizabeth Tower (sourced): 12.2 m square base, dials 6.9 m at 54.9 m, tip 96.3 m.
  et: { u: 151.58, v: -27.07, half: 6.1, top: 96.3, dialY: 54.9, dialR: 3.45 },
  // Victoria Tower (sourced): 98.5 m to the flagstaff base, finial 22.3 m above that. Shaft size is the
  // mapped outline (24.8 m across the buttresses) with the wall inset.
  vt: { u: -118.2, v: -34.1, half: 10.0, staff: 98.5, finial: 120.8 },
  // Central Tower spire. Parliament.uk gives 91.4 m; the mapped lantern part tops at 78 m.
  ct: { u: 5.7, v: -11.5, top: 91.4 },
  // River front. The mapped river edge is straight but about 3.1° off the palace's long axis, so in this
  // frame it is the line v = frontV + slope * (u - frontU). Bay centres run from u0 to u1.
  river: { u0: -74, u1: 113, step: 5.2, winY: 8.4, winH: 7.2, wall: 26, ridge: 36.2, slope: -0.0549, frontV: 39.7, frontU: -94 },
  hall: { x0: 16, x1: 90, z: -76, wall: 16.5, ridge: 30, step: 8.2 },
};
