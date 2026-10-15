import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {point,ANGLE,TOWERS,buildingVolumes} from './battersea-power-station-plan.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 function quad(mat,a,c,d,e,normal) {
  const pts=[a,c,d,e].map(p=>point(...p)),n=new THREE.Vector3(...normal);
  n.applyAxisAngle(new THREE.Vector3(0,1,0),-ANGLE);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));
  const cross=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])).cross(new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0])));
  g.setIndex(cross.dot(n)>0?[0,1,2,0,2,3]:[0,2,1,0,3,2]);g.computeVertexNormals();b.put(g,mat);
 }
 function box(mat,u,y,v,w,h,d){b.box(mat,point(u,y,v),[w,h,d],-ANGLE);}
 const volumes=buildingVolumes();
 const xs=[...new Set(volumes.flatMap(q=>[q.x0,q.x1]))].sort((a,c)=>a-c);
 const zs=[...new Set(volumes.flatMap(q=>[q.z0,q.z1]))].sort((a,c)=>a-c);
 const height=(i,j)=>{
  if(i<0||j<0||i>=xs.length-1||j>=zs.length-1)return 0;
  const x=(xs[i]+xs[i+1])/2,z=(zs[j]+zs[j+1])/2;
  return Math.max(0,...volumes.filter(q=>x>q.x0&&x<q.x1&&z>q.z0&&z<q.z1).map(q=>q.h));
 };
 // Exposed union surfaces only: no hidden floors or coincident internal walls.
 const faces=new Map();
 function face(axis,plane,a,c,lo,hi,sign){
  if(hi<=lo)return;const key=[axis,plane,lo,hi,sign].join(',');
  if(!faces.has(key))faces.set(key,{axis,plane,lo,hi,sign,intervals:[]});
  faces.get(key).intervals.push([a,c]);
 }
 for(let i=0;i<xs.length-1;i++)for(let j=0;j<zs.length-1;j++){
  const h=height(i,j);if(!h)continue;const [x0,x1,z0,z1]=[xs[i],xs[i+1],zs[j],zs[j+1]];
  quad('roof',[x0,h,z0],[x1,h,z0],[x1,h,z1],[x0,h,z1],[0,1,0]);
  quad('brick',[x0,0,z1],[x1,0,z1],[x1,0,z0],[x0,0,z0],[0,-1,0]);
  face('x',x0,z0,z1,height(i-1,j),h,-1);face('x',x1,z0,z1,height(i+1,j),h,1);
  face('z',z0,x0,x1,height(i,j-1),h,-1);face('z',z1,x0,x1,height(i,j+1),h,1);
 }
 function panel(f,a,c,lo,hi,mat='brick'){
  if(c-a<1e-5||hi-lo<1e-5)return;
  const p=(u,y)=>f.axis==='x'?[f.plane,y,u]:[u,y,f.plane];
  quad(mat,p(a,lo),p(c,lo),p(c,hi),p(a,hi),f.axis==='x'?[f.sign,0,0]:[0,0,f.sign]);
 }
 function facade(f,a,c){
  const L=c-a,rows=[];
  const endBoiler=f.axis==='z'&&L>16&&f.hi===49&&f.lo===0;
  const sideBoiler=f.axis==='x'&&f.lo===30&&f.hi===49;
  if(endBoiler)for(let y=4;y<43;y+=6)rows.push([y,y+4]);
  else if(f.lo===0&&L>8&&f.hi<=35)rows.push([6,8.5],[18,25]);
  else if(sideBoiler)rows.push([34,37],[41,44]);
  if(!rows.length){panel(f,a,c,f.lo,f.hi);return;}
  const count=Math.max(1,Math.floor(L/(near?5.8:8.5))),pitch=L/count;
  const w=endBoiler?pitch*.64:sideBoiler?pitch*.24:pitch*.28;
  let last=f.lo;
  for(const [y0,y1] of rows){
   panel(f,a,c,last,y0);
   for(let k=0;k<count;k++){
    const left=a+k*pitch+(pitch-w)/2,right=left+w;
    panel(f,a+k*pitch,left,y0,y1);panel(f,right,a+(k+1)*pitch,y0,y1);
    panel(f,left,right,y0,y1,endBoiler&&k%3===1?'glow':'glass');
   }
   last=y1;
  }
  panel(f,a,c,last,f.hi);
 }
 for(const f of faces.values()){
  f.intervals.sort((a,c)=>a[0]-c[0]);let [a,c]=f.intervals[0];
  for(const r of f.intervals.slice(1))if(r[0]<=c+.0001)c=Math.max(c,r[1]);else{facade(f,a,c);[a,c]=r;}
  facade(f,a,c);
 }
 // Brick piers and tower flutes root into their named wall, same material.
 for(const u of [-21.8,39.4])for(let v=-82;v<56;v+=near?6.2:12.4)
  box('brick',u+(u<0?-.28:.28),39.2,v,.8,18.4,.7);
 for(const t of TOWERS){
  for(const side of [-1,1])for(let u=t.x0+1.5;u<t.x1-1;u+=near?2.6:4.4)
   box('brick',u,21.7,side<0?t.z0:t.z1,.85,43.4,.8);
  chimney(t,b,near);
 }
 // Low restored roof clerestories. Disjoint vertical glass and roof caps.
 for(const u of [-12,29]){
  box('brick',u,49.45,-12,8,.9,130);
  for(const side of [-1,1])quad('glass',[u+side*4,49.9,-77],[u+side*4,50.7,-77],[u+side*4,50.7,53],[u+side*4,49.9,53],[side,0,0]);
  quad('roof',[u-4,50.7,-77],[u+4,50.7,-77],[u+4,50.7,53],[u-4,50.7,53],[0,1,0]);
  for(const v of [-77,53])quad('brick',[u-4,49.9,v],[u+4,49.9,v],[u+4,50.7,v],[u-4,50.7,v],[0,0,v<0?-1:1]);
 }
 return b.finish();
}

function chimney(t,b,near){
 // Flutes are part of a continuous tapered shell, avoiding detached rods.
 const n=near?128:48,lobes=near?32:24;
 const levels=[[51,4.3],[52,4.32],[53,4.12],[98.7,3.38],[99.15,3.57],[99.65,3.57],[99.9,3.35],[101,3.35]];
 const positions=[],indices=[];
 for(const [y,r] of levels)for(let i=0;i<n;i++){
  const a=i*2*Math.PI/n,flute=(y<53||y>98.7)?0:.085*Math.cos(a*lobes);
  positions.push(...point(t.u+(r+flute)*Math.cos(a),y,t.v+(r+flute)*Math.sin(a)));
 }
 for(let k=0;k<levels.length-1;k++)for(let i=0;i<n;i++){
  const j=(i+1)%n,a=k*n+i,c=k*n+j,d=(k+1)*n+j,e=(k+1)*n+i;
  indices.push(a,e,c,c,e,d);
 }
 const inner=positions.length/3;
 for(const y of [101,99])for(let i=0;i<n;i++){
  const a=i*2*Math.PI/n;positions.push(...point(t.u+2.88*Math.cos(a),y,t.v+2.88*Math.sin(a)));
 }
 for(let i=0;i<n;i++){
  const j=(i+1)%n,outer=(levels.length-1)*n;
  indices.push(outer+i,inner+i,outer+j,outer+j,inner+i,inner+j);
  indices.push(inner+i,inner+n+i,inner+j,inner+j,inner+n+i,inner+n+j);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,'concrete');
 const floor=new THREE.CylinderGeometry(2.88,2.88,.2,near?32:16);floor.translate(...point(t.u,98.9,t.v));b.put(floor,'roof');
}
