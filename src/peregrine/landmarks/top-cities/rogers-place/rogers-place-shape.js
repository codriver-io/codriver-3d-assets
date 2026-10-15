import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
// WGS84 local tangent approximation; error below 3 mm on this 210 m envelope.
const lat = SPEC.origin[1] * Math.PI / 180;
export const mapped = FOOTPRINTS[0].slice(0, -1).map(([lng, la]) => [(lng-SPEC.origin[0])*111319.490793*Math.cos(lat), (SPEC.origin[1]-la)*111319.490793]);
export const bowl = mapped.slice(0, 42);
export const hall = [mapped[0], ...mapped.slice(41)];
export const centre = [-4, -8];
export const top = ([x,z]) => 34 - 3*x/83 - Math.max(0,z-64)*.185;
export const sill = ([x,z]) => z > 68 && z < 111 ? 8 : 0;
export const bottom = ([x,z]) => z < 45 ? 4 : 10.5 + 10*Math.exp(-(((x-12)/35)**2))*Math.max(0,Math.min(1,z/64));
export function resample(ring, step) {
  const out=[];
  for(let i=0;i<ring.length;i++) {
    const a=ring[i],b=ring[(i+1)%ring.length],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/step));
    for(let j=0;j<n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);
  }
  return out;
}
// Inset the concave hall toward its own centreline; a global radial shrink would push
// its west return outside the mapped footprint.
export const scaled = (p,r) => {
  const t=Math.max(0,Math.min(1,(p[1]-64)/20)),cx=centre[0]+60*t;
  return [cx+(p[0]-cx)*r,centre[1]+(p[1]-centre[1])*r];
};
