import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './torre-cali-parts.js';
export const MASTS=[{x:-3,z:-3,h:28,w:2.8},{x:5,z:2,h:22,w:2.3},{x:-4,z:7,h:16,w:1.9}];
export function posts(t){return[-1,1].flatMap(s=>[-1,1].map(q=>[t.x+s*t.w/2,t.z+q*t.w/2]));}
export function braces(t,detail='near'){
 const p=posts(t),out=[],n=detail==='far'?Math.ceil(t.h/7):Math.ceil(t.h/4);
 const ordered=[p[0],p[1],p[3],p[2]];
 for(let j=0;j<n;j++){const lo=183+j*t.h/n,hi=183+(j+1)*t.h/n;for(let i=0;i<4;i++){
  const a=ordered[i],b=ordered[(i+1)%4];out.push([[a[0],hi-.12,a[1]],[b[0],hi-.12,b[1]]]);
  if(detail!=='far'||i%2===0)out.push([[a[0],lo+.12,a[1]],[b[0],hi-.12,b[1]]]);
 }}return out;
}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,wall,bar,box,poly}=k;
 let r=LOCAL_RINGS[0].slice(0,-1);const area=r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);if(area>0)r.reverse();
 // Each long mapped face carries mirror glass; the short deep returns remain solid silver piers.
 for(let i=0;i<r.length;i++){
  const p=r[i],q=r[(i+1)%r.length],dx=q[0]-p[0],dz=q[1]-p[1],w=Math.hypot(dx,dz),a=-Math.atan2(dz,dx),t=.8,holes=[],step=near?4.05:6.075;
  if(w>4.5)for(let y=.8;y+step-.25<181.9;y+=step){if(w>10)for(const sign of [-1,1])holes.push({u:sign*(w+2.0)/4,y,w:(w-2.75)/2,h:step-.25,mat:'glass'});else holes.push({u:0,y,w:w-.75,h:step-.25,mat:'glass'});}
  const x=(p[0]+q[0])/2-Math.sin(a)*t,z=(p[1]+q[1])/2-Math.cos(a)*t;
  wall('stone',w,0,183,t,x,z,a,holes);
  // Fine original vertical facade seams; far keeps the mapped deep grooves and horizontal openings.
  if(near&&w>6)for(let j=1;j<Math.ceil(w/2.2);j++){
   const u=-w/2+j*w/Math.ceil(w/2.2),point=(v,y)=>[x+v*Math.cos(a)+t*Math.sin(a),y,z-v*Math.sin(a)+t*Math.cos(a)];poly('stone',[point(u-.025,.8),point(u+.025,.8),point(u+.025,182),point(u-.025,182)],[0,1,2,0,2,3]);
  }
 }
 // Mapped top closes every stepped lobe and supplies the named mast bearing surface.
 k.prism('stone',LOCAL_RINGS[0],182.7,183);
 for(const t of MASTS){
  for(const p of posts(t))bar('metal',[p[0],182.85,p[1]],[p[0],183+t.h,p[1]],.15);
  for(const [a,b]of braces(t,detail))bar('brace',a,b,near?.11:.15);
 }
 // A representative dish is mounted directly to the western mast by a short bearing arm.
 const t=MASTS[0],mount=[t.x-t.w/2,201,t.z-t.w/2],end=[mount[0]-1.35,201,mount[2]];
 bar('brace',mount,[end[0]-.03,end[1],end[2]],.16);
 const g=new THREE.LatheGeometry([[0,0],[.3,.03],[.9,.2],[1.4,.5],[1.4,.55],[.9,.25],[.3,.08],[0,.05]].map(v=>new THREE.Vector2(...v)),near?20:12);g.rotateZ(Math.PI/2);g.translate(end[0],201,end[2]);k.put(g,'trim');
 return k.finish();
}
