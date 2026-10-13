import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTLINE, PLAN_ANGLE } from './santiago-bernabeu-plan.js';
const TAU=2*Math.PI, UP=[0,1,0], DOWN=[0,-1,0];
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
export function mappedAt(a, scale=1, y=0) {
 const dx=Math.cos(a),dz=Math.sin(a);let best=Infinity;
 for(let i=0;i<OUTLINE.length;i++) {
  const p=OUTLINE[i],q=OUTLINE[(i+1)%OUTLINE.length],ex=q[0]-p[0],ez=q[1]-p[1],den=dx*ez-dz*ex;
  if(Math.abs(den)<1e-9)continue;
  const r=(p[0]*ez-p[1]*ex)/den,t=(p[0]*dz-p[1]*dx)/den;
  if(r>0&&t>=0&&t<=1)best=Math.min(best,r);
 }
 return [best*dx*scale,y,best*dz*scale];
}
export function orient(p) {
 const c=Math.cos(PLAN_ANGLE),s=Math.sin(PLAN_ANGLE);
 return [p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c];
}
// Exact rounded rectangle ray intersection in its unrotated stadium frame.
function rr(a,rx,rz,r,y) {
 const dx=Math.cos(a),dz=Math.sin(a),ax=Math.abs(dx),az=Math.abs(dz);
 let d=Math.min(rx/Math.max(ax,1e-9),rz/Math.max(az,1e-9));
 if(d*ax>rx-r && d*az>rz-r) {
  const cx=rx-r,cz=rz-r,b=ax*cx+az*cz;
  d=b+Math.sqrt(Math.max(0,b*b-(cx*cx+cz*cz-r*r)));
 }
 return orient([d*dx,y,d*dz]);
}
// Cross-section of the rolled steel shell; the changing section is not a box extrusion.
function skin(a,t,inset=0) {
 const profile=[[0,.925],[.16,.967],[.62,.979],[.83,.965],[1,.891]];
 let k=1;while(k<profile.length-1&&profile[k][0]<t)k++;
 const lo=profile[k-1],hi=profile[k],s=lo[1]+(hi[1]-lo[1])*(t-lo[0])/(hi[0]-lo[0]);
 const y=8+50*t+2.8*Math.sin(a+.5)*Math.sin(Math.PI*t);
 const p=mappedAt(a,s,y),len=Math.hypot(p[0],p[2]);p[0]*=(len-inset)/len;p[2]*=(len-inset)/len;
 return p;
}

export function create({detail='near'}={}) {
 const near=detail==='near',rows=44;
 // Spend perimeter vertices at changes in the mapped outline and at the
 // aperture's rounded-corner tangencies; straight runs need fewer stations.
 const angles=Array.from({length:near?56:16},(_,i)=>i*TAU/(near?56:16));
 for(const k of [0,1])for(const sign of [-1,1]) {
  const p=OUTLINE.reduce((a,c)=>sign*c[k]>sign*a[k]?c:a);
  angles.push((Math.atan2(p[1],p[0])+TAU)%TAU);
 }
 for(let i=0;i<OUTLINE.length;i++) {
  const p=OUTLINE[i],q=OUTLINE[(i+1)%OUTLINE.length],v=OUTLINE[(i+OUTLINE.length-1)%OUTLINE.length];
  const turn=Math.acos(Math.min(1,((p[0]-v[0])*(q[0]-p[0])+(p[1]-v[1])*(q[1]-p[1]))/Math.hypot(p[0]-v[0],p[1]-v[1])/Math.hypot(q[0]-p[0],q[1]-p[1])));
  if(turn>.15)angles.push((Math.atan2(p[1],p[0])+TAU)%TAU);
 }
 for(const x of [-1,1])for(const z of [-1,1])for(const [rx,rz]of [[37.5,47],[29.5,55]])
  angles.push((Math.atan2(z*rz,x*rx)-PLAN_ANGLE+TAU)%TAU);
 angles.sort((a,c)=>a-c);
 const stations=angles.filter((a,i)=>!i||a-angles[i-1]>.012),n=stations.length;
 const b=assetBuilder({...SPEC,palette:PALETTES.light},detail),buffers=new Map();
 function tri(mat,a,c,d,want) {
  const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dv=new THREE.Vector3(...d);
  const normal=cv.clone().sub(av).cross(dv.clone().sub(av));
  if(normal.lengthSq()<1e-12)return;
  if(normal.dot(new THREE.Vector3(...want))<0)[c,d]=[d,c];
  if(!buffers.has(mat))buffers.set(mat,[]);buffers.get(mat).push(...a,...c,...d);
 }
 function quad(mat,a,c,d,e,want) {tri(mat,a,c,d,want);tri(mat,a,d,e,want);}
 // Each louvre and its shadow channel partition the skin. No overlay behind it.
 for(let i=0;i<n;i++) {
  const a=stations[i],c=i===n-1?TAU:stations[i+1],want=[Math.cos((a+c)/2),0,Math.sin((a+c)/2)];
  for(let r=0;r<rows;r++) {
   const t=r/rows,u=(r+1)/rows,v=t+(u-t)*.12,w=t+(u-t)*(near?.83:.92);
   if(!near) {
    // In-plane silver and narrow shadow strips partition one shallow shell.
    // No backing layer, depth overlap or metre-scale dark channel in far.
    quad('silver',skin(a,t,.24),skin(c,t,.24),skin(c,w,.24),skin(a,w,.24),want);
    quad('dark',skin(a,w,.24),skin(c,w,.24),skin(c,u,.24),skin(a,u,.24),want);
    continue;
   }
   const A=skin(a,t,.24),B=skin(c,t,.24),C=skin(c,v),D=skin(a,v),E=skin(c,w,.24),F=skin(a,w,.24),G=skin(c,u,.24),H=skin(a,u,.24);
   quad('silver',A,B,C,D,want);quad('silver',D,C,E,F,want);quad('dark',F,E,G,H,want);
  }
  // Recessed glazed concourse meets the skin bottom with a supported overhang.
  const A=mappedAt(a,.89,0),B=mappedAt(c,.89,0),C=mappedAt(c,.89,8),D=mappedAt(a,.89,8);
  for(let r=0;r<2;r++) {
   const ps=[mix(A,D,r/2),mix(B,C,r/2),mix(B,C,(r+1)/2),mix(A,D,(r+1)/2)];
   const ctr=ps[0].map((_,k)=>ps.reduce((sum,p)=>sum+p[k],0)/4),inner=ps.map(p=>mix(p,ctr,.075));
   quad('glass',...inner,want);
   for(let j=0;j<4;j++)quad('dark',ps[j],ps[(j+1)%4],inner[(j+1)%4],inner[j],want);
  }
  quad('dark',D,C,skin(c,0,.24),skin(a,0,.24),DOWN);
  tri('dark',[0,0,0],A,B,UP);
 }
 // Four original corner access towers, enclosed by the new wrap. Their lower
 // rotundas remain distinct at the entrance level, grounded under the shell.
 for(const x of [-1,1])for(const z of [-1,1]) {
  const center=orient([x*73,0,z*79]),seg=near?16:10;
  for(let i=0;i<seg;i++) {
   const a=i*TAU/seg,c=(i+1)*TAU/seg,at=(ang,y)=>[center[0]+9*Math.cos(ang),y,center[2]+9*Math.sin(ang)];
   for(let r=0;r<3;r++)quad(r===1?'glass':'silver',at(a,r*4),at(c,r*4),at(c,(r+1)*4),at(a,(r+1)*4),[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);
   tri('silver',[center[0],12,center[2]],at(a,12),at(c,12),UP);
  }
 }
 // Fixed rolled roof connects directly from the last louvre to the 75×110 m
 // rectangular retractable-roof aperture. Radial seams are in-plane divisions.
 for(let i=0;i<n;i++) {
  const a=stations[i],c=i===n-1?TAU:stations[i+1];
  const A=skin(a,1,.24),B=skin(c,1,.24),D=rr(a+PLAN_ANGLE,37.5,55,8,60),C=rr(c+PLAN_ANGLE,37.5,55,8,60);
  // Four curved roof courses blend the rolled rim into the inward roof frame.
  const roofRows=near?18:12;
  for(let r=0;r<roofRows;r++) {
   const f=r/roofRows,g=(r+1)/roofRows,h=f+(g-f)*.93;
   quad(r===roofRows-1?'roof':'silver',mix(A,D,f),mix(B,C,f),mix(B,C,h),mix(A,D,h),UP);
   quad('dark',mix(A,D,h),mix(B,C,h),mix(B,C,g),mix(A,D,g),UP);
  }
  const low=p=>[p[0],p[1]-1.3,p[2]];
  quad('dark',low(A),low(B),low(C),low(D),DOWN);
  quad('roof',D,C,low(C),low(D),[-D[0]-C[0],0,-D[2]-C[2]]);
  quad('silver',A,B,low(B),low(A),[A[0]+B[0],0,A[2]+B[2]]);
  // LED display anchored directly to the inner roof fascia; no suspended box.
  const E=rr(a+PLAN_ANGLE,37.5,55,8,54),F=rr(c+PLAN_ANGLE,37.5,55,8,54);
  quad('glow',E,F,low(C),low(D),[-E[0]-F[0],0,-E[2]-F[2]]);
  const Eo=rr(a+PLAN_ANGLE,38.5,56,9,54),Fo=rr(c+PLAN_ANGLE,38.5,56,9,54),Do=rr(a+PLAN_ANGLE,38.5,56,9,58.7),Co=rr(c+PLAN_ANGLE,38.5,56,9,58.7);
  quad('dark',Eo,Fo,Co,Do,[Eo[0]+Fo[0],0,Eo[2]+Fo[2]]);quad('dark',E,F,Fo,Eo,DOWN);
 }
 // Parked retractable membrane, four folds at each end on the fixed roof.
 // Surfaces replace the roof finish locally at 61 cm clearance, with end skirts
 // closing onto the roof. These are supported panels, not free-ended rails.
 const panels=[];
 for(const z of [-1,1])for(let k=0;k<4;k++) {
  const cz=z*(59+3.5*k),width=74,depth=3.2;
  const ps=[[-width/2,60,cz-depth/2],[width/2,60,cz-depth/2],[width/2,60,cz+depth/2],[-width/2,60,cz+depth/2]].map(orient);
  quad('roof',...ps,UP);
  for(let j=0;j<4;j++) {
   const A=ps[j],B=ps[(j+1)%4],D=[A[0],58.3,A[2]],C=[B[0],58.3,B[2]];
   quad('roof',A,B,C,D,[A[0]+B[0],0,A[2]+B[2]]);
  }
  panels.push({center:orient([0,59,cz]),width,depth});
 }
 // Stepped blue seating bowl preserves the visible interior in both LODs.
 const seatRows=near?20:3,sectors=near?64:16;
 for(let r=0;r<seatRows;r++) {
  const f=r/seatRows,g=(r+1)/seatRows,y=2+f*43,yn=2+g*43;
  for(let i=0;i<sectors;i++) {
   const a=i*TAU/sectors,c=(i+1)*TAU/sectors;
   const at=(angle,t,h)=>rr(angle,39+t*44,58+t*37,9+t*26,h);
   const A=at(a,f,y),B=at(c,f,y),C=at(c,g,y),D=at(a,g,y);
   const mat=i%(sectors/8)===0?'dark':'seating';
   quad(mat,A,B,C,D,UP);quad(mat,D,C,at(c,g,yn),at(a,g,yn),[-D[0]-C[0],0,-D[2]-C[2]]);
  }
 }
 // Pitch sits at the same rigid grade. Paint and turf partition one plane.
 const xs=[-34,-33.75,-.15,.15,33.75,34],zs=[-52.5,-52.25,52.25,52.5];
 for(let i=0;i<xs.length-1;i++)for(let j=0;j<zs.length-1;j++) {
  const mat=(i===0||i===2||i===4||j===0||j===2)?'paint':'turf';
  quad(mat,...[[xs[i],.3,zs[j]],[xs[i+1],.3,zs[j]],[xs[i+1],.3,zs[j+1]],[xs[i],.3,zs[j+1]]].map(orient),UP);
 }
 for(const [mat,pos] of buffers) {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  if(near)g.computeVertexNormals();
  const welded=mergeVertices(g,0.0001);if(!near)welded.computeVertexNormals();g.dispose();b.put(welded,mat);
 }
 const model=b.finish();model.userData.cornerTowers=4;model.userData.roofPanels=panels;model.userData.skinCourses=rows;model.userData.perimeterStations=n;return model;
}
