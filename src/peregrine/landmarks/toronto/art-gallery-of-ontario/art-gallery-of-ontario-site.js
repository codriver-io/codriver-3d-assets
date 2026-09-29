// Site frame and the mapped plan of the Art Gallery of Ontario.
//
// The AGO stands on Toronto's street grid, so the model is authored in the site's
// own axes and rotated into east/up/south once, in `pt`:
//   u  runs along Dundas Street West (16.2 degrees north of east, the bearing the
//      mapped outline itself fits), v runs away from Dundas, toward Grange Park.
// Every polygon below is an OpenStreetMap building or building:part way (ids in
// the comments), converted with the repository's own projection at the model
// origin and rounded to 0.1 m. Heights and levels are OSM tags where mapped
// (blue box, glazing, Grange) and 3.6 m per mapped `building:levels` elsewhere.
export const ORIGIN = [-79.392525, 43.653638];
export const ROT_DEG = 16.2;
const c = Math.cos(ROT_DEG * Math.PI / 180), s = Math.sin(ROT_DEG * Math.PI / 180);

/** Site (u, y, v) to model metres [east, up, south]. */
export const pt = (u, y, v) => [u * c + v * s, y, -u * s + v * c];
/** Site (u, v) back to model metres, dropping height. */
export const xz = (u, v) => { const p = pt(u, 0, v); return [p[0], p[2]]; };

export const LEVEL_M = 3.6;

// --- plan polygons (u, v) ------------------------------------------------
export const PLAN = {
  // 959819124 white, 5 levels: the Beverley Street wing
  WEST_WING: [[-67.4,28],[-73.4,28],[-73.4,23.6],[-75.7,23.6],[-75.6,3.6],[-72.1,3.6],[-72,-0.7],[-79.8,-0.8],[-79.7,-30.4],[-70.6,-30.9],[-59.4,-31.7],[-53.4,-32.1],[-53.4,-3.2],[-67.3,-3.3]],
  // 959819125 white, 6 levels: the central gallery mass
  CENTRAL: [[-38,24.2],[-37.7,-3],[-26.3,-3],[-26.2,-5],[-0.4,-5],[-0.4,-3.1],[11.1,-3],[10.9,24.1],[17.1,24.1],[17,48.9],[17,50.1],[21.4,50.1],[25.1,50.2],[35.1,50.2],[35.3,29.9],[38.7,29.8],[38.7,23.8],[35.3,23.8],[35.5,4.6],[38.8,4.5],[38.8,-1.1],[37.3,-1.1],[37.3,-2.3],[47.2,-2.3],[47,-12.5],[27,-12.6],[27.2,-33.4],[16.8,-33.8],[-14.2,-33.4],[-41,-33.1],[-53.4,-32.1],[-53.4,-3.2],[-67.3,-3.3],[-67.4,28],[-73.4,28],[-75.6,28],[-75.6,29.9],[-75.7,49.2],[-44.1,48.8],[-44.1,24.2]],
  // 959819121 4 levels: the walls round Walker Court
  RING: [[-37.7,-3],[-38,24.2],[-28.2,24.2],[-28,-1.8],[1.2,-1.7],[1.1,24.2],[10.9,24.1],[11.1,-3],[-0.4,-3.1],[-0.4,-5],[-26.2,-5],[-26.3,-3]],
  // 959819122 glass gabled roof over Walker Court (height 18, roof 4)
  COURT: [[-28.2,24.2],[-28,-1.8],[1.2,-1.7],[1.1,24.2]],
  // 959819123 brick, 3 levels: south-west wings on Grange Park
  BRICK: [[-75.6,29.9],[-80,29.9],[-80.1,55.2],[-49.9,55.3],[-49.8,57],[-40.3,57.1],[-40.3,49.9],[-44.1,49.9],[-44.1,48.8],[-75.7,49.2]],
  // 959903556 height 12: the low block the blue box stands on
  BASE_BLUE: [[-44.1,48.8],[17,48.9],[17.1,24.1],[-44.1,24.2]],
  // 959819126 blue metal, min_height 12, height 38: the titanium box over the Grange
  BLUE_BOX: [[-40.3,49.9],[-44.1,49.9],[-44.1,48.8],[-44.1,24.2],[17.1,24.1],[17,48.9],[17,50.1],[0.4,50.1],[0.4,49.1],[-27.4,49.1],[-27.4,50],[-33.1,49.9]],
  // 959819118 white, 4 levels: the McCaul Street wing
  EAST_WING: [[59.9,-32.2],[81.8,-30.7],[81.8,-26.2],[82.8,-26.3],[82.8,-28],[86.8,-28],[86.8,-21.3],[83.1,-21.3],[83.1,-21.9],[82,-21.9],[82,-12.4],[94.8,-12.3],[94.8,-6.1],[67.8,-6.1],[67.8,-2.2],[47.2,-2.3],[47,-12.5],[27,-12.6],[27.2,-33.4],[42.8,-32.8]],
  // 959819119 / 959819120 4 levels: notches on the east flank
  SLIVER_W: [[38.8,4.5],[35.5,4.6],[35.3,23.8],[38.7,23.8]],
  SLIVER_E: [[38.7,29.8],[35.3,29.9],[35.1,50.2],[38.6,50.2]],
  // 242550201 The Grange (1817), brick, height 10: main house 959903554, west wing 959903553
  GRANGE_MAIN: [[3,51.1],[2.9,65],[-16.7,65.1],[-16.8,62.2],[-16.8,50.9]],
  GRANGE_WEST: [[-16.8,62.2],[-23.8,62.3],[-24,57.1],[-33.1,57.1],[-33.1,49.9],[-22.5,50],[-22.5,50.8],[-16.8,50.9]],
};

// --- the Galleria Italia hull --------------------------------------------
// 959819147 (glass belt, 4 to 10 m) and 959819129..146 (the ribbed glass, 10 to 20 m).
export const HULL = {
  front: [[-70.6,-39.5],[-59.9,-40.3],[-41.2,-41.3],[-14.4,-42.1],[17,-42],[43.1,-41.5],[59.9,-40.8]],
  back: [[-70.6,-30.9],[-59.4,-31.7],[-53.4,-32.1],[-41,-33.1],[-14.2,-33.4],[16.8,-33.8],[27.2,-33.4],[42.8,-32.8],[59.9,-32.2]],
  u0: -70.6, u1: 59.9,
  beltY0: 4, beltY1: 10, ridgeY: 20,
  ribs: 47,            // Wikipedia / Entuitive: 47 radial glulam arches
};
// 959819128 / 959819127: the two "tears" where the glass ribbon peels away at each end.
export const TEARS = {
  west: [[-70.6,-38.05],[-74.9,-36.6],[-79.7,-34.5],[-83.45,-32.2]],
  east: [[59.9,-39.55],[61.7,-38.15],[64.95,-36.5],[68.95,-35.05],[73.5,-33.95],[77.6,-32.65],[81.85,-30.8],[86.8,-28.1],[91.2,-25.2]],
};

/** Piecewise-linear v at u along a polyline of [u, v] points. */
export function along(poly, u) {
  if (u <= poly[0][0]) return poly[0][1];
  for (let i = 1; i < poly.length; i++) {
    if (u <= poly[i][0]) { const [a, va] = poly[i - 1], [b, vb] = poly[i]; return va + (vb - va) * (u - a) / (b - a); }
  }
  return poly[poly.length - 1][1];
}
/** Height of the hull's ribbed glass across its section, s = 0 (street edge) .. 1 (ridge). Fits the mapped 10/15/18/20 m bands. */
export const hullY = (t) => 10 + 10 * (1 - Math.pow(1 - t, 2.6));
