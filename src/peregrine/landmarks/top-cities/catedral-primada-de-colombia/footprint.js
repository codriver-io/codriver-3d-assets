// Partial envelope of OSM way 24251969: cathedral main body only.
// Cabildo/Sagrario to the south and Casa Cural to the rear stay provider-owned.
// Control edge [-74.0753276,4.5982081] → [-74.0750582,4.5980383]
// establishes eastward nave bearing 122 degrees; facade normal 302 degrees.
// Geographic data © OpenStreetMap contributors, ODbL 1.0.
const origin = [-74.07524, 4.59796], a = 32 * Math.PI / 180;
export function geographic(u, v) {
  const x = u * Math.cos(a) - v * Math.sin(a), z = u * Math.sin(a) + v * Math.cos(a);
  return [origin[0] + x / (111320 * Math.cos(origin[1] * Math.PI / 180)), origin[1] - z / 111320];
}
export const FOOTPRINTS = [[[-23.8,-18.6],[65,-18.6],[65,23],[-23.8,23]].map(([u,v]) => geographic(u,v))];
export const OSM_WAYS = [24251969];
