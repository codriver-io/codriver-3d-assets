import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './intercontinental-bucharest-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const podium=LOCAL_RINGS[0],r=LOCAL_RINGS[1];prism(podium,0,12,'stone','roof',[[1,4],[5.2,7.8],[9,10.8]],near?3.5:7,'glass',.64);
 const sign=Math.sign(r.reduce((s,a,i)=>{const c=r[(i+1)%r.length];return s+a[0]*c[1]-c[0]*a[1];},0));
 const normals=r.map((a,i)=>{const c=r[(i+1)%r.length],l=Math.hypot(c[0]-a[0],c[1]-a[1]);return [sign*(c[1]-a[1])/l,-sign*(c[0]-a[0])/l];});
 const inner=r.map((p,i)=>{const a=normals[(i+r.length-1)%r.length],c=normals[i],vx=a[0]+c[0],vz=a[1]+c[1],den=vx*c[0]+vz*c[1];return [p[0]-.65*vx/den,p[1]-.65*vz/den];});
 const count=near?20:14,pitch=68/count;
 for(let floor=0;floor<count;floor++){const lo=12+floor*pitch,hi=Math.min(80,lo+pitch);prism(r,lo,lo+.7,'balcony','balcony');
 r.forEach((_,i)=>{const curved=(i>=5&&i<15)||(i>=20&&i<29)||i>=34,f=frame(curved?inner:r,i),a=lo+.7;
  if(curved){const n=Math.max(1,Math.round(f.l/(near?1.6:3.5))),step=f.l/n;for(let j=0;j<n;j++){patch('stone',f,j*step,j*step+.08,a,hi);patch('glass',f,j*step+.08,(j+1)*step,a,hi);}}
  else patch('stone',f,0,f.l,a,hi);
 });}
 // The real crown dips between each pair of tall end piers.
 const topY=i=>{let t=null;if(i>=5&&i<=15)t=(i-5)/10;else if(i>=20&&i<=29)t=(i-20)/9;else if(i>=34)t=(i-34)/9;return t===null?87:84+3*(2*t-1)**2;};
 r.forEach((_,i)=>{const j=(i+1)%r.length,curved=(i>=5&&i<15)||(i>=20&&i<29)||i>=34,f=frame(r,i);patch('stone',f,0,f.l,80,81);if(curved){const n=Math.max(1,Math.round(f.l/(near?2:4))),step=f.l/n;for(let j=0;j<n;j++){patch('stone',f,j*step,j*step+.2,81,83.7);patch('glass',f,j*step+.2,(j+1)*step,81,83.7);}}else patch('stone',f,0,f.l,81,83.7);face('stone',[f.p(0,83.7),f.p(f.l,83.7),f.p(f.l,topY(j)),f.p(0,topY(i))],f.out);});
 for(const tri of THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[]))face('roof',tri.map(i=>[r[i][0],topY(i),r[i][1]]),[0,1,0]);
 block(0,8,2,2,83.7,87,'roof','roof');cyl(0,8,.22,87,90,'metal',near?8:5);
return finish();
}
