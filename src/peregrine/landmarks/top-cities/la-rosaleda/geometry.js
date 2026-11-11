import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './la-rosaleda-parts.js';
export const ROOFS=[{"id":180851874,"ring":[[65.38250195971695,-46.53692331144736],[40.61539893093539,-46.53692331144736],[40.62451778443064,54.319144699570366],[65.39088029984055,54.30803735664585],[65.38250195971695,-46.53692331144736]]},{"id":799047579,"ring":[[-65.51846702267945,-47.90673535757887],[-65.82527086391875,52.23405185654245],[-63.607300157422955,52.2423763490448],[-40.230331982160614,52.31274156511065],[-39.92352814084225,-47.828045649015934],[-65.51846702267945,-47.90673535757887]]}];
export function contour(w,d,r,detail='near'){
 const n=detail==='near'?7:3,straight=detail==='near'?7:1,pts=[];
 const corners=[[w-r,d-r,0],[-w+r,d-r,Math.PI/2],[-w+r,-d+r,Math.PI],[w-r,-d+r,3*Math.PI/2]];
 for(let i=0;i<4;i++){
  const [x,z,a]=corners[i];for(let j=0;j<=n;j++){const t=a+j*Math.PI/2/n;pts.push([x+r*Math.cos(t),z+r*Math.sin(t)]);}
  const end=pts.at(-1),[nx,nz,na]=corners[(i+1)%4],next=[nx+r*Math.cos(na),nz+r*Math.sin(na)];
  for(let j=1;j<straight;j++)pts.push([end[0]+(next[0]-end[0])*j/straight,end[1]+(next[1]-end[1])*j/straight]);
 }
 return pts.reverse();
}
export function roofInfo(r){const xs=r.ring.map(p=>p[0]),zs=r.ring.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);return{inner:minX>0?minX:maxX,outer:minX>0?maxX:minX,minZ,maxZ};}
export function stations(r,detail='near'){const {minZ,maxZ}=roofInfo(r),n=detail==='near'?12:5;return Array.from({length:n+1},(_,i)=>minZ+2+(maxZ-minZ-4)*i/n);}
export function lightStations(r){const {minZ,maxZ}=roofInfo(r);return[minZ+12,(minZ+maxZ)/2,maxZ-12];}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,bar,wall,poly}=k;
 function closed(m,x,y,z,w,h,d){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);k.put(g,m);}
 function up(m,p){const q=p.map(v=>[...v]),a=new THREE.Vector3(...q[1]).sub(new THREE.Vector3(...q[0])),b=new THREE.Vector3(...q[2]).sub(new THREE.Vector3(...q[0]));if(a.cross(b).y<0)q.reverse();poly(m,q,[0,1,2,0,2,3]);}
 const at=(p,y)=>[p[0],y,p[1]];
 function ring(m,a,b,y){for(let i=0;i<a.length;i++){const j=(i+1)%a.length;up(m,[at(a[i],y),at(a[j],y),at(b[j],y),at(b[i],y)]);}}
 function innerWall(r,lo,hi){for(let i=0;i<r.length;i++){const j=(i+1)%r.length;poly('concrete',[at(r[i],lo),at(r[i],hi),at(r[j],hi),at(r[j],lo)],[0,1,2,0,2,3]);}}
 function tier(A,B,n,h0,h1){
  for(let row=0;row<n;row++){
   const u=row/n,v=(row+1)/n,h=h0+(h1-h0)*v,prev=h0+(h1-h0)*u;
   const a=contour(A[0]*(1-u)+B[0]*u,A[1]*(1-u)+B[1]*u,A[2]*(1-u)+B[2]*u,detail),b=contour(A[0]*(1-v)+B[0]*v,A[1]*(1-v)+B[1]*v,A[2]*(1-v)+B[2]*v,detail);
   innerWall(a,prev,h);
   for(let i=0;i<a.length;i++){
    const j=(i+1)%a.length,L=Math.hypot(a[j][0]-a[i][0],a[j][1]-a[i][1]);
    if(i%(near?8:7)===0&&L>1.7){const f=Math.min(.25,1.2/L),pa=[a[i][0]+(a[j][0]-a[i][0])*f,a[i][1]+(a[j][1]-a[i][1])*f],pb=[b[i][0]+(b[j][0]-b[i][0])*f,b[i][1]+(b[j][1]-b[i][1])*f];up('concrete',[at(a[i],h),at(pa,h),at(pb,h),at(b[i],h)]);up('blue',[at(pa,h),at(a[j],h),at(b[j],h),at(pb,h)]);}
    else up('blue',[at(a[i],h),at(a[j],h),at(b[j],h),at(b[i],h)]);
   }
  }
 }
 const inner=contour(40.5,65,12,detail),grass=contour(39.5,64,10,detail),lower=contour(54,77,17,detail),upper=contour(57,80,19,detail),outer=contour(65.5,92,23,detail);
 k.prism('pitch',[...grass,grass[0]],0,.18);ring('concrete',grass,inner,.15);innerWall(inner,.15,1.2);
 tier([40.5,65,12],[54,77,17],near?22:11,1.2,11.3);
 ring('concrete',lower,upper,12.0);innerWall(lower,11.3,12);innerWall(upper,12,13.0);
 tier([57,80,19],[65.5,92,23],near?25:13,13.0,23.5);
 // Closed exterior concourse skin with real inset rows of windows and ground doors.
 for(let i=0;i<outer.length;i++){
  const p=outer[i],q=outer[(i+1)%outer.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),a=-Math.atan2(dz,dx),n=Math.floor(L/(near?4.0:7.0)),holes=[];
  for(let j=0;j<n;j++){const u=(j-(n-1)/2)*L/n;for(const y of [3,14.0])holes.push({u,y,w:Math.min(2.2,L/n*.55),h:3,mat:'glass'});}
  wall('concrete',L,0,23.5,.75,(p[0]+q[0])/2-Math.sin(a)*.75,(p[1]+q[1])/2-Math.cos(a)*.75,a,holes,.35);
 }
 // Distinctive open-end raking fins are solid wall panels, grounded on individual pads.
 for(const sign of [-1,1])for(let i=0;i<13;i++){
  const x=(i-6)*8,shape=new THREE.Shape([[88,.4],[91,.4],[95,25],[91,25]].map(([z,y])=>new THREE.Vector2(-sign*z,y))),g=new THREE.ExtrudeGeometry(shape,{depth:.6,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(x-.3,0,0);k.put(g,'concrete');closed('concrete',x,.2,sign*89.5,1.1,.4,4.0);
 }
 // Low south concourse/ticket appendix follows its own mapped fan-shaped outline.
 k.shell('concrete',[LOCAL_RINGS[1]],0,6.5,[2.0],near?6:9);
 //105×68m playing lines, on raised turf; all text and club marks omitted.
 for(const x of [-34,34])box('paint',x,.30,0,.14,.02,105.14);
 for(const z of [-52.5,52.5])box('paint',0,.30,z,68.14,.02,.14);
 box('paint',0,.30,0,68,.02,.14);
 const center=new THREE.RingGeometry(9.09,9.23,near?48:16);center.rotateX(-Math.PI/2);center.translate(0,.31,0);k.put(center,'paint');
 for(const s of [-1,1]){
  for(const x of [-20.16,20.16])box('paint',x,.30,s*(52.5-8.25),.14,.02,16.5);
  box('paint',0,.30,s*(52.5-16.5),40.32,.02,.14);
 }
 // The two actual mapped canopies retain their short open-ended length, not a complete ring roof.
 for(const r of ROOFS){
  const {inner:ix,outer:ox,minZ,maxZ}=roofInfo(r),width=Math.abs(ox-ix),cx=(ox+ix)/2,cz=(minZ+maxZ)/2,L=maxZ-minZ,sign=Math.sign(ox);
  closed('roof',cx,25.025,cz,width-1,.35,L-.7);
  for(const x of [ix,ox])closed('roof',x,24.1,cz,1.0,2.2,L);
  for(const z of [minZ,maxZ])closed('roof',cx,24.1,z,width,2.2,.7);
  for(const z of stations(r,detail)){
   // Original raking concrete ribs; distinct foot pads and named roof fascias receive their ends.
   const base=[ox-sign*5,.3,z],tip=[ox,24.0,z];closed('concrete',base[0],.2,z,1.6,.4,1.8);bar('concrete',base,tip,.65,.9);
   const a=new THREE.Vector3(ix,23.5,z),b=new THREE.Vector3(ox,23.5,z),v=b.clone().sub(a),g=new THREE.BoxGeometry(.35,v.length(),.55),indices=Array.from(g.index.array);g.setIndex([...indices.slice(0,12),...indices.slice(24)]);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...a.add(b).multiplyScalar(.5).toArray());k.put(g,'steel');
  }
  for(const z of lightStations(r)){
   closed('light',ox,31.4,z,.7,.8,8.0);
   for(const dz of [-2.8,2.8])bar('steel',[ox,25.1,z+dz],[ox,31.2,z+dz],.16);
  }
 }
 const m=k.finish();m.userData.features=['open two-tier blue bowl','two opposed25m canopies','raking white ribs','105by68pitch lines','floodlight bars'];return m;
}
