// Original metric layout from OSM attraction way 83688503 and mapped stairs.
export const ORIGIN = [44.515495, 40.1901894];
// OSM west-side control points [44.5152141,40.1901963] → [44.5153864,40.1927613].
export const BEARING = 2.94;
export const ANGLE = BEARING * Math.PI / 180;
export const LENGTH = 286.5; // horizontal map length; 302 m is the published inclined route
export const LEVELS = [0, 8, 24, 40, 55, 69, 78];
export const STATIONS = [0, 28, 87, 139, 195, 246, LENGTH];
export const point = (u,y,s) => [u*Math.cos(ANGLE)+s*Math.sin(ANGLE), y, u*Math.sin(ANGLE)-s*Math.cos(ANGLE)];
export function lngLat(u,s) { const [x,,z]=point(u,0,s); return [ORIGIN[0]+x/(111320*Math.cos(ORIGIN[1]*Math.PI/180)),ORIGIN[1]-z/111320]; }
export const ring = (a,b,width=50) => [[-width/2,a],[width/2,a],[width/2,b],[-width/2,b]].map(([u,s])=>lngLat(u,s));
// Conservative full-width floor/flight ownership. The final 3 m of each flight
// is the upper landing; the switch occurs 13 m behind the gallery facade.
// Upper pads are recessed 1 m. The first floor is 0.25 m above datum;
// keeping its pad at 0 holds the bottom stair terminal on ground.
export const TERRAIN_SECTIONS = STATIONS.slice(1).flatMap((end,i)=>[
 {start:STATIONS[i],end:end-3,level:LEVELS[i],offsetM:i===0?0:LEVELS[i]-1},
 {start:end-3,end,level:LEVELS[i+1],offsetM:LEVELS[i+1]-1},
]);
export function groundOffset(s) {
 return TERRAIN_SECTIONS.find(t=>s>=t.start && s<t.end)?.offsetM ?? 77;
}

