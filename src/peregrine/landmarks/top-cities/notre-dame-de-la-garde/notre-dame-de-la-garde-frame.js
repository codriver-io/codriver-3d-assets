// Nave axis from the long mapped wall: clockwise 131° from north.
// Architectural coordinates u toward southeast apse; v toward southwest.
const angle = 131 * Math.PI / 180;
export const xyz = (u,y,v) => [u*Math.sin(angle)+v*Math.cos(angle),y,-u*Math.cos(angle)+v*Math.sin(angle)];
export const localLngLat = (u,v) => { const [x,,z]=xyz(u,0,v); return [5.371+x/(111320*Math.cos(43.2841*Math.PI/180)),43.2841-z/111320]; };
const ring = pts => pts.map(([u,v]) => localLngLat(u,v));
// Pad polygons are site ownership, separate from the provider building masks.
export const SITE_RINGS = {
  lower: ring([[-18,-15],[54,-15],[54,14],[-8,14],[-18,7]]),
  upper: ring([[-6,-11],[51,-11],[51,11],[-6,11]]),
};
