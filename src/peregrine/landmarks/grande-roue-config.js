// Original model frame; OSM way 1097403710, retrieved 2026-09-27.
// Mapped outline © OpenStreetMap contributors, ODbL 1.0.
export const GRANDE_ROUE = Object.freeze({
  id: 'grande-roue-montreal', name: 'La Grande Roue de Montréal',
  origin: [-73.548657525, 45.50847625],
  height: 60, diameter: 56.64, hubHeight: 31.48, cabins: 42,
  // Southward wheel-plane bearing from endpoint midpoints, clockwise from north.
  bearing: 177.98330793181117,
  elevationDatum: 'Local plaza = y 0 on the flat basemap; no sea-level elevation applied',
  footprint: [[-73.5486509, 45.5087309], [-73.548647, 45.5086399], [-73.5486177, 45.5086405], [-73.5486171, 45.508625], [-73.5486, 45.5086253], [-73.5485986, 45.508594], [-73.5486125, 45.5085937], [-73.5486118, 45.5085773], [-73.5486193, 45.5085772], [-73.5486167, 45.5085151], [-73.5486028, 45.5085154], [-73.5486, 45.5084478], [-73.5486101, 45.5084476], [-73.5486036, 45.5082976], [-73.5486222, 45.5082972], [-73.548619, 45.5082225], [-73.5486705, 45.5082215], [-73.5486739, 45.5082995], [-73.5486915, 45.5082992], [-73.5486944, 45.5083664], [-73.5487091, 45.5083661], [-73.5487187, 45.5085907], [-73.5487308, 45.5085905], [-73.5487322, 45.5086221], [-73.5487175, 45.5086224], [-73.5487181, 45.5086386], [-73.5486859, 45.5086393], [-73.5486897, 45.5087301], [-73.5486509, 45.5087309]]
});
export const GRANDE_ROUE_PALETTES = {
  light: { lattice:'#eceee9', glass:'#294750', concrete:'#96968d', iron:'#536069', roof:'#d9ded9', paint:'#cccac2' },
  dark: { lattice:'#86969e', glass:'#203943', concrete:'#515e67', iron:'#455460', roof:'#879da8', paint:'#9bafbd' },
};
// Source diagrams use u along the wheel towards south, v along the axle west.
export const WHEEL_ANGLE = (90 - GRANDE_ROUE.bearing) * Math.PI / 180;
export function wheelPoint(u,y,v=0) {
  const c=Math.cos(WHEEL_ANGLE),s=Math.sin(WHEEL_ANGLE);
  return [c*u+s*v,y,-s*u+c*v];
}
