// SFMOMA's mapped outline, read 2026-10-01 through the shared Overpass queue (way(around:130) building,
// building:part, out geom). Rings are [lng, lat], closed implicitly.
//   41692824  "San Francisco Museum of Modern Art" (building=yes, 7 levels): the hull of the whole complex,
//             Botta's 1995 building on Third Street (65 x 49 m) and Snohetta's 2016 expansion behind it
//             (108 m along Third Street, Minna to Howard) with its two-storey annex on the north-east side.
// Building parts mapped inside that outline and modelled from it (not separate rings: all lie inside):
//   1365384415 Botta main body (5 levels)    1365384410 turret, a 19.1 m circle (5 levels)
//   1365384412 / 1365384413 the two brick end towers (5 levels, 14 m squares)   1365384414 the block behind the turret
//   1365384411 Snohetta expansion (7 levels)  1365384416 its two-level annex on the north-east face
export const FOOTPRINTS = [
  [
    [-122.4013674, 37.7858766],
    [-122.4008469, 37.7854595],
    [-122.4008138, 37.7854848],
    [-122.4004516, 37.7857695],
    [-122.4004283, 37.7857515],
    [-122.4004063, 37.7857339],
    [-122.4001038, 37.7854918],
    [-122.3998915, 37.7856629],
    [-122.3999445, 37.7857149],
    [-122.4000312, 37.7857985],
    [-122.400039, 37.7858059],
    [-122.4001289, 37.7858914],
    [-122.4001765, 37.7859386],
    [-122.4002607, 37.786011],
    [-122.4002847, 37.786032],
    [-122.4002984, 37.7860437],
    [-122.4003303, 37.7860696],
    [-122.4002918, 37.7860997],
    [-122.4005649, 37.7863143],
    [-122.4006885, 37.7864115],
    [-122.400749, 37.7863632],
    [-122.4009706, 37.7861859],
    [-122.4010075, 37.7861564],
    [-122.4011002, 37.7860873],
    [-122.4011903, 37.7860154],
    [-122.4012691, 37.7859547],
  ],
];
export const OSM_WAYS = [41692824, 1365384415, 1365384410, 1365384412, 1365384413, 1365384414, 1365384411, 1365384416];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
