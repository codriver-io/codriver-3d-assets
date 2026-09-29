// Plan of the Ontario Legislative Building, in the model frame: x = u runs along the south
// front toward the east end, z = v runs toward the front (south, i.e. down University
// Avenue), y is up, and (0, 0) is the area centroid of the mapped outline (SPEC.origin).
// `angle` is the rotateY that turns this frame onto east/up/south: the mapped edges run
// 16.92 degrees off the compass grid, so the front looks toward bearing 163.
//
// Every rectangle and height below is read from the ~85 OpenStreetMap building:part ways
// (retrieved 2026-09-29 via the shared Overpass helper, projected and rotated by
// tmp/toronto/ontario-legislative-building/parts.mjs). Heights are the mapper's, not a
// survey. Part ids are the last three digits of 960958xxx unless stated.
export const PLAN = {
  angle: 16.92 * Math.PI / 180,
  axis: -0.55,                                    // the portico's centre line (u)
  // central block (837-840 rear, 862-869 the octagonal roof, 870-877 the domed towers)
  central: { u0: -17.6, u1: 16.4, v0: 19.0, v1: 50.4, eave: 35, peak: 60 },
  octagon: [[-10.5, 22.9], [9.5, 22.9], [16.2, 29.4], [16.2, 43.3], [9.5, 50.4], [-10.5, 50.4], [-17.6, 43.3], [-17.6, 29.4]],
  apex: [-0.6, 36.6],
  towers: [
    { name: 'front-west', u0: -18.8, u1: -10.5, v0: 44.4, v1: 54.2, front: true },
    { name: 'front-east', u0: 9.5, u1: 17.6, v0: 44.6, v1: 54.3, front: true },
    { name: 'rear-west', u0: -18.8, u1: -10.9, v0: 19.1, v1: 28.8, front: false },
    { name: 'rear-east', u0: 9.5, u1: 17.3, v0: 18.7, v1: 28.6, front: false },
  ],
  shaft: 32, domeBase: 39.8, domeTop: 45,
  porch: { u0: -10.6, u1: 9.5, v0: 50.4, v1: 54.2, top: 10 },
  steps: { u0: -12.9, u1: 12.4, v0: 54.2, v1: 62.3 },
  // wings between the central block and the arms (836, 839, 858, 859 / 814)
  wingW: { u0: -47.9, u1: -17.6, v0: 2.4, v1: 30.1, eave: 21, top: 34, flat: [11, 22.4] },
  wingE: { u0: 16.4, u1: 41.8, v0: 2.4, v1: 29.5, eave: 20, peak: 35 },
  link: { u0: 36.9, u1: 47.5, v0: 0.5, v1: 36.4, h: 20 },
  // south-end pavilions (832-835 east, 854-857 west)
  pavW: { u0: -61.1, u1: -44.2, v0: 18.9, v1: 42.5, eave: 27, peak: 43, ridge: [26.9, 34.2] },
  pavE: { u0: 46.8, u1: 62.8, v0: 19.9, v1: 43.0, eave: 24, peak: 43, ridge: [25.9, 35.7] },
  // arms running north (830/831 east, 846/847 west) and their north-end pavilions
  armW: { u0: -62.7, u1: -44.4, v0: -22.0, v1: 18.9, eave: 22, ridge: 34 },
  armE: { u0: 43.0, u1: 62.8, v0: -19.3, v1: 19.9, eave: 22, ridge: 30 },
  endW: { u0: -65.8, u1: -41.5, v0: -32.2, v1: -12.9, eave: 22, ridge: 35 },
  endE: { u0: 40.4, u1: 64.8, v0: -35.4, v1: -12.9, eave: 22, ridge: 35 },
  // rear of the central block (837, 838, 840, 805, 806)
  rearGable: { u0: -17.8, u1: 16.6, v0: 2.8, v1: 19.0, eave: 20, ridge: 30 },
  rearPyrE: { u0: 6.6, u1: 16.6, v0: -1.4, v1: 13.9, eave: 28, peak: 36 },
  rearPyrW: { u0: -18.4, u1: -8.0, v0: -1.3, v1: 9.3, eave: 28, peak: 36 },
  stacks: [{ u: 5.95, v: 1.4, r: 1.75, h: 49 }, { u: -7.2, v: 1.25, r: 1.8, h: 50 }],
  // rear spine and the 1909 north block (810, 813, 811, 812)
  spine: { u0: -4.9, u1: 3.5, v0: -23.1, v1: 2.8, h: 18 },
  north: { u0: -20.6, u1: 17.2, v0: -68.6, v1: -32.2, h: 20 },                 // 813: the wide part
  northStub: { u0: -18.0, u1: 15.0, v0: -32.2, v1: -22.9, h: 20 },            // 813: the narrower south end that meets the spine
  bays: [{ u: 17.6, v: -44.6, r: 5.0, h: 19 }, { u: -21.6, v: -44.4, r: 5.0, h: 19 }],
  // open entrance porches on the outer flanks (824-829 east, 848-853 west)
  porchE: { u0: 65.6, u1: 75.0, v0: 8.8, v1: 19.9 },
  porchW: { u0: -74.4, u1: -65.4, v0: 8.8, v1: 20.4 },
};
