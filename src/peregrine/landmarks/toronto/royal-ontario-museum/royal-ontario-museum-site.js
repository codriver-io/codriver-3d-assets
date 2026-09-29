// Site data for the Royal Ontario Museum landmark. Numbers only.
// Mapped rings are © OpenStreetMap contributors (ODbL 1.0): the museum outline way 4942687 and its
// building:part ways (ids in PART_WAYS), retrieved 2026-09-29 through the OSM map API (one 0.006 x 0.004 degree
// request) and confirmed against the shared Overpass helper. Coordinates are METRES in the museum's own frame:
//   u  along Bloor Street (east-north-east), v  perpendicular, into the museum (south-south-east),
//   origin = area centroid of the museum outline. The street grid is rotated 16.84 degrees from true north:
//   the mean axis of the six long edges of the 1933 wing's blocks (the same angle as Bloor, Queen's Park and Avenue Road to about 1.5 degrees).
// Heights are OSM tags (height, min_height, roof:*) where a part carries them; anything else is marked as estimated in
// docs/3d-toronto-royal-ontario-museum.md.
export const SITE_ANGLE = 0.29391344603584507;
export const SITE_ORIGIN = [-79.394695,43.667694];
// Museum outline (way 4942687) in u,v.
export const OUTLINE = [[-50.4,-48.7],[-37.8,-48.6],[-47.4,-70],[-36,-71.2],[-23.6,-69.2],[-18,-68.3],[-14.3,-67.7],[-10.7,-70.3],[0.7,-78.6],[3.4,-73.1],[10,-79],[18,-86.1],[35.5,-78.5],[33.6,-70],[42,-70],[47.4,-70],[47.4,-68.4],[47.3,-10.3],[47.3,-9.4],[47.3,-8.9],[51.4,-8.9],[53.8,-8.9],[55,-8.9],[59.2,-9],[59.1,10.3],[54.9,10.2],[54,10.2],[51.2,10.3],[47.2,10.4],[47.2,10.7],[47.9,71.2],[42.5,71.2],[33.8,71.3],[32.3,71.3],[27.3,71.3],[23.7,71.4],[20.7,71.4],[11.1,71.4],[-24.1,71.9],[-24.1,65.8],[-29.7,65.7],[-29.7,71.4],[-56.8,71.5],[-56.6,55.2],[-50.8,55.3],[-50.7,36.4],[-53.2,35.1],[-53.1,31],[-50.6,29.5],[-50.7,9.9],[-56.2,8.5],[-52.9,2.7],[-52.7,-1.5],[-50.3,-2.9],[-50.3,-28.4],[-52.8,-29.9],[-52.7,-34],[-50.5,-35.5]];
export const PART_WAYS = { eNaveN: 992716654, eAisleNW: 992716655, eAisleNE: 992716656, eRot: 992716648, eRotDrum: 992716647, eRotCap: 992716646, ePorchA: 992716650, ePorchB: 992716649, eNaveS: 992716653, eAisleSW: 992716651, eAisleSE: 992716652, central: 992716630, west: 992716631, curatorial: 992716629, pavA: 30327147, pavB: 992716628, pavC: 992716627, canopy: 992716625, cA: 992716640, cB: 992716639, cC: 992716638, cD: 992716636, cE: 992716637, cF: 992716632, cG: 992716634, cH: 992716633, cI: 992716635, cBase: 992753871, steps1: 992716645 };
export const PART_TAGS = {
  eNaveN: {"height":"24","roof:shape":"gabled","roof:height":"4","building:material":"stone","building:colour":"grey","roof:colour":"#8b4513","roof:material":"copper"},
  eAisleNW: {"height":"18","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  eAisleNE: {"height":"18","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  eRot: {"height":"26","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  eRotDrum: {"height":"30","min_height":"26","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  eRotCap: {"height":"33","min_height":"30","roof:shape":"pyramidal","roof:height":"3","roof:colour":"#8b4513"},
  ePorchA: {"height":"23.5","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  ePorchB: {"height":"24.5","min_height":"23.5","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  eNaveS: {"height":"24","roof:shape":"gabled","roof:height":"4","building:material":"stone","building:colour":"grey","roof:colour":"#8b4513","roof:material":"copper"},
  eAisleSW: {"height":"18","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  eAisleSE: {"height":"18","building:material":"stone","building:colour":"grey","roof:colour":"lightgrey"},
  central: {"height":"25","building:material":"stone","building:colour":"#EEDFCC","roof:colour":"lightgrey"},
  west: {"height":"25","building:material":"stone","building:colour":"#EEDFCC","roof:colour":"#696969"},
  curatorial: {"height":"28","building:material":"concrete","building:colour":"grey","roof:colour":"lightgrey"},
  pavA: {"height":"15","building:colour":"grey","roof:colour":"lightgrey"},
  pavB: {"height":"15","building:colour":"grey","roof:colour":"lightgrey"},
  pavC: {"height":"5","building:colour":"grey","roof:colour":"lightgrey"},
  canopy: {},
  cA: {"height":"39","min_height":"6","roof:shape":"skillion","roof:direction":"72","roof:height":"33","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0"},
  cB: {"height":"39","min_height":"6","roof:shape":"skillion","roof:direction":"273","roof:height":"18","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cC: {"height":"27","min_height":"6","roof:shape":"skillion","roof:direction":"236","roof:height":"8","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cD: {"height":"33","roof:shape":"skillion","roof:direction":"50","roof:height":"10","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cE: {"height":"36","roof:shape":"skillion","roof:direction":"360","roof:height":"8","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cF: {"height":"33","roof:shape":"skillion","roof:direction":"353","roof:height":"33","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cG: {"height":"33","roof:shape":"skillion","roof:direction":"223","roof:height":"28","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cH: {"height":"36","roof:shape":"skillion","roof:direction":"82","roof:height":"11","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cI: {"height":"36","min_height":"25","roof:shape":"skillion","roof:direction":"285","roof:height":"11","building:material":"metal","building:colour":"#c0c0c0","roof:colour":"#c0c0c0","roof:material":"metal"},
  cBase: {"height":"6","building:material":"metal","building:colour":"#c0c0c0"},
  steps1: {"height":"1.5","building:colour":"lightgrey","roof:colour":"lightgrey","roof:material":"concrete"},
};
export const PARTS = {
  eNaveN: [[32.5,-70],[33.6,-70],[42,-70],[42,-53.6],[42.1,-9.5],[32.2,-9.5]],
  eAisleNW: [[32.5,-70],[32.2,-9.5],[27.1,-9.5],[27.3,-46.6],[26.8,-69.9]],
  eAisleNE: [[47.3,-9.4],[42.1,-9.5],[42,-53.6],[42,-70],[47.4,-70],[47.4,-68.4],[47.3,-10.3]],
  eRot: [[47.3,-9.4],[42.1,-9.5],[32.2,-9.5],[27.1,-9.5],[27.3,10.6],[32.9,10.6],[42.6,10.6],[47.2,10.7],[47.2,10.4],[47.3,-8.9]],
  eRotDrum: [[33.4,-5.6],[31,-3.2],[30.9,4.3],[33.4,6.8],[41.1,6.9],[43.5,4.6],[43.5,-3.2],[41,-5.5]],
  eRotCap: [[34.4,-4],[32.5,-2.3],[32.5,3.4],[34.4,5.2],[39.9,5.3],[41.8,3.5],[41.8,-2.1],[39.9,-4]],
  ePorchA: [[47.3,-8.9],[51.4,-8.9],[51.4,-8.3],[51.7,-8.3],[51.7,-4],[51.4,-4],[51.4,-3.5],[51.4,0.4],[51.3,4.5],[51.3,5.4],[51.7,5.3],[51.6,9.7],[51.2,9.7],[51.2,10.3],[47.2,10.4]],
  ePorchB: [[51.4,-4],[51.4,-4.4],[50.3,-4.4],[50.4,-4.1],[51.1,-4.1],[51,5.5],[50.4,5.5],[50.4,5.8],[51.3,5.8],[51.3,5.4],[51.3,4.5],[51.4,0.4],[51.4,-3.5]],
  eNaveS: [[42.6,10.6],[42.5,71.2],[33.8,71.3],[32.3,71.3],[32.3,10.6],[32.9,10.6]],
  eAisleSW: [[32.3,10.6],[27.3,10.6],[20.6,10.6],[20.5,20.1],[20.8,65.3],[23.6,65.4],[27.4,65.3],[27.3,71.3],[32.3,71.3]],
  eAisleSE: [[42.6,10.6],[47.2,10.7],[47.9,71.2],[42.5,71.2]],
  central: [[-50.8,55.3],[-56.6,55.2],[-56.8,71.5],[-29.7,71.4],[-29.7,65.7],[-24.1,65.8],[-23.8,20],[20.5,20.1],[20.6,10.6],[27.3,10.6],[27.1,-9.5],[27.3,-46.6],[19.6,-43.4],[26.8,-36.9],[24.1,-10.3],[5,-36.8],[0.2,-35.1],[-0.3,-25],[-6.3,-23.4],[-10.2,1.4],[-29.5,6.6],[-29.9,48.7],[-36.2,48.6],[-36.1,55.4]],
  west: [[-25,-48.6],[-23.1,-45.4],[-29.5,-35],[-29.1,-22.8],[-46.1,11.2],[-29.5,6.6],[-29.9,48.7],[-36.2,48.6],[-36.1,55.4],[-50.8,55.3],[-50.7,36.4],[-53.2,35.1],[-53.1,31],[-50.6,29.5],[-50.7,9.9],[-50.6,4.3],[-52.9,2.7],[-52.7,-1.5],[-50.3,-2.9],[-50.3,-28.4],[-52.8,-29.9],[-52.7,-34],[-50.5,-35.5],[-50.4,-48.7],[-37.8,-48.6]],
  curatorial: [[-23.8,20],[20.5,20.1],[20.8,65.3],[20.7,71.4],[11.1,71.4],[-24.1,71.9],[-24.1,65.8]],
  pavA: [[11.1,71.4],[11,77.2],[23.6,76.9],[23.7,71.4],[20.7,71.4]],
  pavB: [[23.6,65.4],[20.8,65.3],[20.7,71.4],[23.7,71.4]],
  pavC: [[23.7,71.4],[23.6,65.4],[27.4,65.3],[27.3,71.3]],
  canopy: [[33.8,71.3],[42.5,71.2],[47.9,71.2],[54.5,71.2],[54.5,73.5],[54.5,75.1],[36.3,75.2],[33.7,72.3]],
  cA: [[27.3,-46.6],[19.6,-43.4],[12.1,-40.1],[18,-86.1],[35.5,-78.5],[33.6,-70],[32.5,-70],[26.8,-69.9]],
  cB: [[18,-86.1],[10,-79],[3.4,-73.1],[7.4,-65.1],[-2.6,-49.7],[-3.6,-33.6],[0.2,-35.1],[5,-36.8],[12.1,-40.1]],
  cC: [[-2.6,-49.7],[-5.7,-57.8],[-22.8,-62.2],[-14.3,-67.7],[-10.7,-70.3],[0.7,-78.6],[3.4,-73.1],[7.4,-65.1]],
  cD: [[0.2,-35.1],[-0.3,-25],[-6.3,-23.4],[-6.4,-23.4],[-24.9,-57.5],[-5.7,-57.8],[-2.6,-49.7],[-3.6,-33.6]],
  cE: [[19.6,-43.4],[26.8,-36.9],[24.1,-10.3],[5,-36.8],[12.1,-40.1]],
  cF: [[-47.4,-70],[-24.9,-57.5],[-5.7,-57.8],[-22.8,-62.2],[-14.3,-67.7],[-18,-68.3],[-23.6,-69.2],[-36,-71.2]],
  cG: [[-23.1,-45.4],[-25,-48.6],[-37.8,-48.6],[-47.4,-70],[-24.9,-57.5],[-6.4,-23.4],[-9.3,-22.7],[-18.8,-43.5]],
  cH: [[-18.8,-43.5],[-9.3,-22.7],[-6.4,-23.4],[-6.3,-23.4],[-10.2,1.4],[-29.5,6.6],[-46.1,11.2],[-29.1,-22.8]],
  cI: [[-52.9,2.7],[-29.5,-35],[-23.1,-45.4],[-18.8,-43.5],[-29.1,-22.8],[-46.1,11.2],[-50.7,9.9],[-56.2,8.5]],
  cBase: [[26.8,-69.9],[2.6,-70.2],[-5.6,-70.3],[-10.1,-70.3],[-10.7,-70.3],[-14.3,-67.7],[-22.8,-62.2],[-5.7,-57.8],[-2.6,-49.7],[-3.6,-33.6],[0.2,-35.1],[5,-36.8],[12.1,-40.1],[19.6,-43.4],[27.3,-46.6]],
  steps1: [[51.4,-8.9],[53.8,-8.9],[55,-8.9],[55,-5.7],[55.7,-5.7],[55.6,0.4],[55.5,7.1],[54.9,7.1],[54.9,10.2],[54,10.2],[51.2,10.3],[51.2,9.7],[51.6,9.7],[51.7,5.3],[51.3,5.4],[51.3,4.5],[51.4,0.4],[51.4,-3.5],[51.4,-4],[51.7,-4],[51.7,-8.3],[51.4,-8.3]],
};
// Road centre lines in u,v (Bloor Street West on the north side, Queen's Park / Avenue Road on the east side).
export const ROADS = {"30679706":{"name":"Queen's Park","pts":[[75.9,74.7],[75.7,49.7],[75.6,17],[75.7,7.9],[75.6,-40.3]]},"124690743":{"name":"Bloor Street West","pts":[[-88.9,-96.7],[-36.6,-95.5],[16.7,-95.1]]},"124690744":{"name":"Bloor Street West","pts":[[76.1,-94.2],[89.1,-94],[121.8,-93.5]]},"244093699":{"name":"Avenue Road","pts":[[77.5,-170.2],[77.2,-161.8],[76.1,-106.8],[76.1,-94.2]]},"244248087":{"name":"Queen's Park","pts":[[75.6,-40.3],[76.1,-82.3],[76.1,-94.2]]},"354354330":{"name":"Bloor Street West","pts":[[43.8,-94.7],[61.3,-94.4],[76.1,-94.2]]},"1290816551":{"name":"Bloor Street West","pts":[[16.7,-95.1],[43.8,-94.7]]}};
// u,v (metres, museum frame), y up  ->  model x east, y up, z south.
const C = Math.cos(SITE_ANGLE), S = Math.sin(SITE_ANGLE);
export const site = (u, y, v) => [u * C + v * S, y, -u * S + v * C];
export const unsite = (x, z) => [x * C - z * S, x * S + z * C];
