// The mapped plan of Chase Center in local metres (+X east, +Z south) around SPEC.origin, derived from
// OSM way 579646390 with the same projection the screenshot harness and the tests use.
// Vertices run in increasing bearing atan2(z, x) (counter-clockwise on the x-z plane), starting on the
// north-west of the drum. The ring is star-shaped about the origin, so every inset and the roof are
// radial. Two short mapped edges (the "notches") separate the glass PROW (the east-facing crescent
// under the roof visor) from the white DRUM.
const RAW = [[-46.27,-58.26],[-40.14,-63.07],[-35.52,-66.77],[-28.68,-70.54],[-20.63,-74.40],[-13.93,-76.91],[-4.84,-79.27],[4.23,-80.72],[12.39,-81.16],[21.71,-80.68],[30.37,-79.14],[36.23,-77.62],[43.89,-74.78],[50.20,-71.49],[56.88,-68.06],[63.49,-63.11],[54.61,-52.14],[58.09,-47.26],[62.43,-40.62],[66.35,-32.73],[70.21,-23.15],[72.84,-13.70],[74.64,-6.17],[76.07,3.87],[76.41,14.49],[76.48,24.82],[74.58,35.43],[70.26,47.31],[65.14,56.68],[59.43,66.23],[43.17,55.60],[29.99,65.40],[24.54,68.83],[17.11,71.79],[8.82,74.90],[0.70,76.74],[-7.32,77.80],[-15.63,78.00],[-24.31,76.74],[-33.17,74.74],[-40.08,71.96],[-46.97,68.13],[-54.52,62.93],[-59.44,58.30],[-65.03,51.36],[-69.75,44.83],[-74.24,35.20],[-75.95,27.80],[-77.66,21.40],[-78.13,13.48],[-78.01,5.81],[-80.84,5.47],[-79.96,-0.14],[-79.43,-5.69],[-78.49,-9.24],[-78.12,-10.65],[-77.14,-13.49],[-76.13,-16.38],[-74.36,-20.97],[-71.76,-27.00],[-69.04,-31.71],[-65.80,-37.27],[-62.50,-42.05],[-59.01,-46.29],[-55.35,-50.42],[-51.85,-53.81]];
// The mapped west entrance canopy tip (a 2.8 m bump) is dropped: the drum there stays a smooth wall.
export const OUTLINE = RAW.filter((p) => !(p[0] === -80.84 && p[1] === 5.47));
const radius = ([x, z]) => Math.hypot(x, z);
// Notch edges: the two edges whose radius drops by more than 10 m. In ring order the first one ends where
// the prow starts and the second one ends where the drum starts again.
const notches = [];
OUTLINE.forEach((p, i) => { const q = OUTLINE[(i + 1) % OUTLINE.length]; if (radius(p) - radius(q) > 10) notches.push(i); });
export const PROW_FIRST = notches[0] + 1, PROW_LAST = notches[1];
export const PROW_RING = OUTLINE.slice(PROW_FIRST, PROW_LAST + 1);
export const DRUM_RING = [...OUTLINE.slice(PROW_LAST + 1), ...OUTLINE.slice(0, PROW_FIRST)];
