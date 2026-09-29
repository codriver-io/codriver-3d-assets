// CN Tower: the dimensions and pure profile functions the mesh, the tests and the docs
// all read. Real metres, +X east, +Y up (0 = flat-map grade), +Z south, about the tower's
// axis (config.js SPEC.origin). Bearings are compass degrees clockwise from north, the way
// OSM and the photographs give them: a point at bearing b, radius r is (r sin b, -r cos b).
//
// Provenance of each number is marked S (published), M (mapped, OSM) or E (estimated from
// calibrated photographs). docs/3d-toronto-cn-tower.md carries the full table.

// --- overall heights (S) -------------------------------------------------------------
export const TIP = 553.3;          // S: 553.33 m to the top of the antenna (CN Tower / Wikipedia / IEEE Toronto)
export const SHAFT_TOP = 440.3;    // E: concrete ends under the SkyPod bowl (OSM part 440; photo)

// --- the hexagonal core (M: OSM building:part 288273461; taper E) ---------------------
export const HEX = {
  r0: 10.4,        // M: circumradius at grade (mapped vertices 9.9..10.8 m, mean 10.4)
  rPod: 8.8,       // E: circumradius just under the main pod (photos: 16.3 m and 17.9 m across at 320 m)
  hPod: 330,       // S/M: shaft reaches the pod at 330 m (OSM radome min_height; 335 m concrete height quoted)
  rTop: 5.6,       // E: circumradius above the pod (photo: 10.4 m across)
  hStep: 370.0,    // E: the core steps in inside the pod; the roof of the pod is at 370 m (OSM part)
  vertex0: 16.4,   // M: bearing of one vertex; the six are at vertex0 + 60 k (fitted to the mapped hexagon)
};
export const hexRadius = (h) => (h <= HEX.hPod ? HEX.r0 + (HEX.rPod - HEX.r0) * (h / HEX.hPod) : h <= HEX.hStep ? HEX.rPod : HEX.rTop);
export const hexApothem = (h) => hexRadius(h) * Math.sqrt(3) / 2;
export const hexVertexBearing = (k) => HEX.vertex0 + 60 * k;
// Bearings (M) of the three legs: the hexagon faces whose normals are at vertex0 + 30 + 120 k.
export const LEG_BEARINGS = [46.4, 166.4, 286.4];
// Bearings of the three elevator glass strips: the vertices half way between the legs (E, photos).
export const STRIP_BEARINGS = [76.4, 196.4, 316.4];

// --- the three legs (M plan, E profile) -------------------------------------------------
export const LEG = {
  tip: 29.1,       // M: mapped leg tips 28.5..29.5 m from the axis
  tipWidth: 5.85,  // M: width at the tip
  rootWidth: 7.0,  // E: width where the fin leaves the face (mapped 9.3-9.7 at the hexagon vertices; narrowed so it clears the glass slot)
  hTop: 330,       // M: OSM skillion roof height of each leg: the crest reaches the core at 330 m
  p: 1.4,          // E: crest curve exponent, fitted to the south photograph (OSM's skillion tag is the straight p=1 case; the arms are curved)
};
// Radius of the crest (the leg's outer edge in elevation) at height h.
export const legCrestRadius = (h) => hexApothem(Math.min(h, HEX.hPod)) + (LEG.tip - hexApothem(0)) * Math.pow(Math.max(0, 1 - h / LEG.hTop), LEG.p);
// Width of a leg at radius r: linear taper from the hexagon face to the tip (M), scaled with the core.
export const legWidth = (r, h = 0) => {
  const a = hexApothem(0), w = LEG.tipWidth + (LEG.tip - r) * ((LEG.rootWidth - LEG.tipWidth) / (LEG.tip - a));
  return Math.max(LEG.tipWidth, w) * hexRadius(Math.min(h, HEX.hPod)) / HEX.r0;
};

// --- ground: the round base (M: OSM ring is a circle of 23.2 m radius) -----------------
export const BASE = { r: 23.2, h: 7.5 /* E */ };

// --- main pod: [radius, height] profiles (E, from the calibrated south and north photographs;
// heights agree with the OSM parts 330/338/360/370 and the published glass floor 342 m,
// LookOut 346 m, 360 restaurant 351 m and EdgeWalk 356 m) ---------------------------------
export const POD = {
  rMax: 24.6,      // E: widest ring (mapped glass part 46.5 m across; the photographs give 49 m with the ledge)
  // The dark bowl under the radome, seen from below, rising toward the shaft; the brackets ride under it.
  soffit: [[8.6, 332.4], [12.0, 331.3], [15.5, 330.0], [18.9, 328.6]],
  // The white pressurised radome that hides the microwave equipment: a fat skirt, widest at 333.5 m.
  radome: [[18.9, 328.6], [20.5, 329.2], [22.0, 330.5], [22.9, 332.6], [23.0, 334.6], [22.7, 336.5], [22.0, 337.8], [21.5, 338.6]],
  // The coffered lower ring (glass floor level, 342 m), flaring out from the radome, with its diagonal struts.
  ring: [[21.5, 338.6], [22.6, 339.6], [23.5, 341.0], [23.9, 342.4]],
  // Bands of the public levels, bottom to top: [material, r0, h0, r1, h1].
  bands: [
    ['white', 23.9, 342.4, 23.9, 343.8],
    ['glass', 23.9, 343.8, 24.2, 347.3],     // LookOut level, 346 m: dark glazing, the tall bands of the photographs
    ['white', 24.2, 347.3, 24.5, 348.9],     // widest ring
    ['glass', 24.5, 348.9, 24.45, 352.0],    // 360 restaurant, 351 m
    ['white', 24.45, 352.0, 24.6, 353.2],    // fascia under the EdgeWalk ledge
  ],
  ledge: 353.2,                              // E: EdgeWalk is published at 356 m; the pod-top heights are +-3 m
  ledgeIn: 23.3,
  roofCone: [[23.3, 353.2], [18.4, 361.0]],  // dark corrugated sloping roof
  redBand: 1.8,                              // height of the red stripe on the drum's foot
  drum: [[18.4, 361.0], [18.3, 368.3], [17.9, 369.4], [17.0, 370.0], [14.5, 370.0]],
  roofH: 370.0,
};

// --- SkyPod (Space Deck) and the antenna (E from the calibrated south photograph) -------
export const SKYPOD = {
  // bottom bowl, glazed rim, top cone: [radius, height]
  // quarter ellipse: leaves the shaft flaring out, ends vertical at the rim (smooth normals, no lumps)
  bowl: Array.from({ length: 9 }, (_, i) => { const a = (i / 8) * Math.PI / 2; return [5.3 + 3.15 * Math.sin(a), 439.2 + 6.8 * (1 - Math.cos(a))]; }),
  rim: [[8.45, 446.0], [8.45, 447.3]],
  cone: Array.from({ length: 7 }, (_, i) => { const t = i / 6; return [8.45 - 4.05 * (1 - Math.pow(1 - t, 1.8)), 447.3 + 4.9 * t]; }),
};
export const ANTENNA = {
  // [radius, from h, to h, material]
  base: { r: 4.4, h0: 452.2, h1: 489.2 },
  collar: { r: 4.6, h0: 489.2, h1: 490.8 },
  redRing: { r: 4.25, h0: 490.8, h1: 492.6 },
  mid: { r: 3.15, h0: 492.6, h1: 505.8 },
  midCollar: { r: 3.35, h0: 505.8, h1: 508.0 },
  midRed: { r: 2.1, h0: 508.0, h1: 510.6 },
  mast: { r: 1.5, h0: 510.6, h1: 551.6 },
  bands: [[519.7, 523.5, 'dark'], [523.5, 527.2, 'red'], [541.4, 543.2, 'dark'], [543.2, 551.6, 'red']],
  spire: { r: 0.3, h0: 551.6, h1: TIP },
};
