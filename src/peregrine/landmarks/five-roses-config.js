import { lngToMercX, latToMercY, mercStretch } from '../facade/geo.js';
import { FIVE_ROSES_OSM } from './five-roses-footprint.js';

export const FIVE_ROSES = {
  id: 'farine-five-roses', name: 'Farine Five Roses — mill and silos',
  origin: [-73.55135, 45.49176], angle: 0.12,
  letterHeight: 4.572, roofHeight: 39, signTop: 57.272,
};
export const FIVE_ROSES_STRETCH = mercStretch(FIVE_ROSES.origin[1]);
export const FIVE_ROSES_ANCHOR = [lngToMercX(FIVE_ROSES.origin[0]), -latToMercY(FIVE_ROSES.origin[1])];
export const FIVE_ROSES_RING = FIVE_ROSES_OSM.coordinates.map(([lng,lat]) => [(lngToMercX(lng)-FIVE_ROSES_ANCHOR[0])/FIVE_ROSES_STRETCH,(-latToMercY(lat)-FIVE_ROSES_ANCHOR[1])/FIVE_ROSES_STRETCH]);
// Generic *building* extrusions include the mapped elevated galleries too.
// Remove those owned faces, while never applying this predicate to road data.
export function fiveRosesBuildingOwns(x,z) {
  let hit=false;
  for(let i=0,j=FIVE_ROSES_RING.length-1;i<FIVE_ROSES_RING.length;j=i++){
    const [ax,az]=FIVE_ROSES_RING[j],[bx,bz]=FIVE_ROSES_RING[i],dx=bx-ax,dz=bz-az,length=dx*dx+dz*dz;
    const t=length?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/length)):0;
    if(Math.hypot(x-ax-t*dx,z-az-t*dz)<=1.5)return true;
    if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)hit=!hit;
  }
  return hit;
}
// OSM-derived orthogonal industrial axes. u = ESE, v = SSW.
export function fiveRosesPoint(u, y, v) {
  const c = Math.cos(FIVE_ROSES.angle), s = Math.sin(FIVE_ROSES.angle);
  return [u * c - v * s, y, u * s + v * c];
}
export function fiveRosesUV(x, z) {
  const c = Math.cos(FIVE_ROSES.angle), s = Math.sin(FIVE_ROSES.angle);
  return [x * c + z * s, -x * s + z * c];
}
export const FIVE_ROSES_SILOS = [-56, -49.1, -42.2, -35.3, -28.4, -21.5, -3, 3.9, 10.8, 17.7, 24.6, 31.5];
// Only ground-contact masses, never the enclosing industrial parcel or the
// OSM polygon's elevated conveyor across rue Mill (u=-17.5..-6.5).
export function fiveRosesOwns(x, z, margin = 0.8) {
  const [u, v] = fiveRosesUV(x, z);
  const rect = (a,b,c,d) => u >= a-margin && u <= b+margin && v >= c-margin && v <= d+margin;
  if (rect(35.7,68.3,-57.4,29.4) || rect(35.9,58.1,-90.2,-57.4)
    || rect(-5.7,57.9,-151.3,-90.2) || rect(-4.8,17.8,29,80.3)) return true;
  return FIVE_ROSES_SILOS.some(su => [11.1,18.1,25.1].some(sv => Math.hypot(u-su,v-sv) <= 3.55+margin));
}
export const FIVE_ROSES_COLORS = {
  light: { brick:'#76513e', silo:'#b9b5a4', trim:'#c5c1ad', frame:'#4c4b43', window:'#52666a', roof:'#646963', white:'#fff4df', red:'#d32c24', neon:'#fa4733' },
  dark: { brick:'#3f3534', silo:'#68747a', trim:'#8b9290', frame:'#444f55', window:'#31474e', roof:'#444f56', white:'#9d9490', red:'#e54030', neon:'#ff6250' },
};
