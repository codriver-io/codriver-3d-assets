import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';
const RAD = Math.PI/180, R = 6378137;
// Same spherical Mercator conversion as facade/geo.js, literal here for portable authoring.
const stretch = 1/Math.cos(SPEC.origin[1]*RAD);
export const OUTLINE = FOOTPRINTS[0].slice(0,-1).map(([lng,lat])=>[
  R*(lng-SPEC.origin[0])*RAD/stretch,
  -R*(Math.log(Math.tan(Math.PI/4+lat*RAD/2))-Math.log(Math.tan(Math.PI/4+SPEC.origin[1]*RAD/2)))/stretch,
]);
export const TAU = 2*Math.PI;
// South and north mapped controls [-6.96,120.64], [5.90,-118.74]: long axis 3.1° west of south.
const angle=-3.1*RAD,c=Math.cos(angle),s=Math.sin(angle);
export const frame=(u,y,v)=>[u*c+v*s,y,-u*s+v*c];
export function perimeter(t,f=1,y=0) {
  const x=Math.cos(t),z=Math.sin(t);let d=Infinity;
  for(let i=0;i<OUTLINE.length;i++) {
    const a=OUTLINE[i],b=OUTLINE[(i+1)%OUTLINE.length],ex=b[0]-a[0],ez=b[1]-a[1],den=x*ez-z*ex;
    if(Math.abs(den)<1e-8)continue;
    const r=(a[0]*ez-a[1]*ex)/den,q=(a[0]*z-a[1]*x)/den;
    if(r>0&&q>=0&&q<=1)d=Math.min(d,r);
  }
  return [d*x*f,y,d*z*f];
}
// Central oval opening is scaled from mapped inner way 186042396 (83 × 118 m).
export const aperture=(t,y=44)=>frame(42*Math.cos(t),y,59*Math.sin(t));
export const hub=(t,y=46.5)=>frame(5*Math.cos(t),y,5*Math.sin(t));
export function roofPoint(t,r,bottom=false) {
  const a=perimeter(t,.963,38),b=aperture(t),phase=((t/TAU*40)%1+1)%1;
  return [a[0]*(1-r)+b[0]*r,38+6*r+7.5*Math.sin(Math.PI*phase)*(1-r)+1.4*Math.sin(Math.PI*r)-(bottom?.30:0),a[2]*(1-r)+b[2]*r];
}
