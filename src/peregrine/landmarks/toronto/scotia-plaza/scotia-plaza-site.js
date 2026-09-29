// Site data for Scotia Plaza in the authoring frame: u runs along King Street (bearing
// 72.87 deg), v along Bay Street toward King (bearing 162.87 deg), metres from the
// origin (the centroid of OSM way 141694075). geometry.js rotates the finished model
// about +Y by SPEC.siteAngleDeg into east/up/south.
//
// Every polygon below was read from OpenStreetMap (© OpenStreetMap contributors, ODbL 1.0)
// through the same conformal projection the layer uses, then snapped: edges that the
// map draws a few centimetres off a right angle are made exact, and the repeated
// steps of the sawtooth corners are kept as mapped. Ways are named beside each block.

export const ROOF_Y = 274.9;      // OSM height of way 141694075; Wikipedia agrees (274.9 m)
export const FLOOR = 3.95;        // floor pitch: the chevron steps are two floors (8 m) and land on it
export const LOBBY_Y = 14.2;      // 274.9 - 66 x 3.95; two lobby levels below 66 office floors = 68 storeys
export const WING_Y = 30.0;       // the two six-level wings (OSM building:levels=6): lobby zone + four floors

// Full-height shaft including the two facade bands (way 141694075 plus the strips
// 951711673-694). Counter-clockwise on screen (u right, v down): the west band face
// runs down the left, the east band face up the right.
export const TOWER = [
  [-20.10, -14.10], [-20.10, 33.28], [-15.90, 33.28], [-15.90, 37.38], [-5.22, 37.38], [-5.22, 33.27],
  [-1.25, 33.27], [-1.25, 29.87], [2.63, 29.87], [2.63, 25.62], [6.97, 25.62], [6.97, 21.56],
  [10.92, 21.56], [10.92, 17.54], [14.94, 17.54], [14.94, 13.86], [18.78, 13.86], [18.78, -35.08],
  [14.37, -35.08], [14.37, -39.02], [4.10, -39.02], [4.10, -34.77], [0.25, -34.77], [0.25, -30.90],
  [-4.10, -30.90], [-4.10, -26.85], [-7.78, -26.85], [-7.78, -22.25], [-11.92, -22.25], [-11.92, -17.62],
  [-15.90, -17.62], [-15.90, -14.10],
];

// The stepped-chevron recess (floors 56-68) is carved out of two facade bands that
// stand 4 m proud of the core: the OSM strips are the band's top, eleven of them a
// side (the apex is mapped as one double-width strip), 8 m (two floors) apart in height.
// Tops are the mapped 267, 259, ..., 227, ..., 259, 267 m, snapped to the floor grid.
const TOPS = [2, 4, 6, 8, 10, 12, 12, 10, 8, 6, 4, 2].map((k) => ROOF_Y - k * FLOOR);
const edges = (v0, v1) => Array.from({ length: 13 }, (_, k) => v0 + (v1 - v0) * k / 12);
export const BANDS = {
  west: { sgn: -1, uOuter: -20.10, uCore: -15.95, vFrom: -14.10, vTo: 33.28, vEdges: edges(-7.61, 26.95), tops: TOPS },
  east: { sgn: 1, uOuter: 18.78, uCore: 14.75, vFrom: -35.08, vTo: 13.86, vEdges: edges(-27.49, 7.12), tops: TOPS },
};

// Roof outline: the shaft with both bands' recesses cut back to the core faces.
export const CORE_ROOF = [
  [-20.10, -14.10], [-20.10, -7.61], [-15.95, -7.61], [-15.95, 26.95], [-20.10, 26.95], [-20.10, 33.28],
  [-15.90, 33.28], [-15.90, 37.38], [-5.22, 37.38], [-5.22, 33.27], [-1.25, 33.27], [-1.25, 29.87],
  [2.63, 29.87], [2.63, 25.62], [6.97, 25.62], [6.97, 21.56], [10.92, 21.56], [10.92, 17.54],
  [14.94, 17.54], [14.94, 13.86], [18.78, 13.86], [18.78, 7.12], [14.75, 7.12], [14.75, -27.49],
  [18.78, -27.49], [18.78, -35.08], [14.37, -35.08], [14.37, -39.02], [4.10, -39.02], [4.10, -34.77],
  [0.25, -34.77], [0.25, -30.90], [-4.10, -30.90], [-4.10, -26.85], [-7.78, -26.85], [-7.78, -22.25],
  [-11.92, -22.25], [-11.92, -17.62], [-15.90, -17.62], [-15.90, -14.10],
];

// Six-level wings that fill the two chamfered corners at the base (ways 951711671, 951711672).
export const WING_NW = {
  poly: [[-20.10, -14.10], [-20.10, -26.85], [-7.78, -26.85], [-7.78, -22.25], [-11.92, -22.25], [-11.92, -17.62], [-15.90, -17.62], [-15.90, -14.10]],
  exposed: [[[-20.10, -14.10], [-20.10, -26.85]], [[-20.10, -26.85], [-7.78, -26.85]]],
};
export const WING_SE = {
  poly: [[18.78, 13.86], [14.94, 13.86], [14.94, 17.54], [10.92, 17.54], [10.92, 21.56], [6.97, 21.56], [6.97, 25.62], [2.63, 25.62], [2.63, 29.87], [-1.25, 29.87], [-1.25, 32.05], [18.78, 32.05]],
  exposed: [[[18.78, 13.86], [18.78, 32.05]], [[18.78, 32.05], [-1.25, 32.05]]],
};

// 44 King Street West, the 1951 Bank of Nova Scotia building (ways 43417401, 366234293/292/294).
// OSM maps a 25.6 m base and three nested set-back tiers of 81, 98 and 115 m.
export const HERITAGE = {
  base: { top: 25.6, poly: [[-22.73, 60.65], [-22.76, 56.98], [-20.10, 56.96], [-20.10, -8.92], [-71.62, -8.58], [-71.31, 26.45], [-71.01, 61.07], [-25.66, 60.86]] },
  tiers: [
    { from: 25.6, to: 81, poly: [[-66.40, 60.85], [-66.40, 43.42], [-63.76, 43.41], [-62.19, 43.41], [-62.10, 11.16], [-63.82, 11.16], [-66.24, 11.16], [-66.25, -6.12], [-63.78, -6.12], [-43.72, -6.12], [-43.65, -4.27], [-43.78, 43.12], [-32.33, 43.14], [-31.21, 43.14], [-25.66, 43.14], [-25.66, 60.86]] },
    { from: 81, to: 98, poly: [[-63.80, 60.85], [-63.76, 43.41], [-62.19, 43.41], [-62.10, 11.16], [-63.82, 11.16], [-63.78, -6.12], [-43.72, -6.12], [-43.65, -4.27], [-43.78, 43.12], [-32.33, 43.14], [-31.21, 43.14], [-31.25, 60.86]] },
    { from: 98, to: 115, poly: [[-62.06, -4.32], [-62.10, 11.16], [-62.19, 43.41], [-62.23, 59.35], [-32.37, 59.43], [-32.33, 43.14], [-43.78, 43.12], [-43.65, -4.27]] },
  ],
};
