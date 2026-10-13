import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Original arched masonry recesses: remove front faces and close the inset reveals.
export function fortPrism(b,ring,lo,hi,near,arcades=[]) {
 const pts=[];
 const tri=(a,c,d,n)=>{
  if(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...d).sub(new THREE.Vector3(...a))).dot(new THREE.Vector3(...n))<0)[c,d]=[d,c];
  pts.push(...a,...c,...d);
 };
 const area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0),sign=area>0?1:-1;
 const vectors=p=>p.map(q=>new THREE.Vector2(...q));
 for(const ids of THREE.ShapeUtils.triangulateShape(vectors(ring),[])){
  tri(...ids.map(i=>[ring[i][0],hi,ring[i][1]]),[0,1,0]);
  tri(...ids.map(i=>[ring[i][0],lo,ring[i][1]]),[0,-1,0]);
 }
 for(let i=0;i<ring.length;i++){
  const a=ring[i],c=ring[(i+1)%ring.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]),dx=(c[0]-a[0])/L,dz=(c[1]-a[1])/L,n=[sign*dz,0,-sign*dx];
  const at=(s,y,inset=0)=>[a[0]+s*dx-n[0]*inset,y,a[1]+s*dz-n[2]*inset];
  const outer=[[0,lo],[L,lo],[L,hi],[0,hi]],holes=[];
  const rows=arcades.find(([edge])=>edge===i)?.[1]||[];
  for(const bottom of rows)for(let s=3;s<L-2;s+=4.2){
   const r=.68,spring=bottom+1.4,hole=[[s-r,bottom],[s+r,bottom],[s+r,spring]];
   const steps=near?8:5;
   for(let k=1;k<=steps;k++)hole.push([s+r*Math.cos(k*Math.PI/steps),spring+r*Math.sin(k*Math.PI/steps)]);
   holes.push(hole);
  }
  const flat=[...outer,...holes.flat()];
  for(const ids of THREE.ShapeUtils.triangulateShape(vectors(outer),holes.map(vectors)))tri(...ids.map(k=>at(...flat[k])),n);
  for(const hole of holes){
   const positions=[];
   for(const ids of THREE.ShapeUtils.triangulateShape(vectors(hole),[])){
    const p=ids.map(k=>at(...hole[k],.7));
    if(new THREE.Vector3(...p[1]).sub(new THREE.Vector3(...p[0])).cross(new THREE.Vector3(...p[2]).sub(new THREE.Vector3(...p[0]))).dot(new THREE.Vector3(...n))<0)[p[1],p[2]]=[p[2],p[1]];
    positions.push(...p.flat());
   }
   const back=new THREE.BufferGeometry();back.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));back.computeVertexNormals();b.put(back,'frame');
   for(let k=0;k<hole.length;k++){
    const j=(k+1)%hole.length,p=at(...hole[k]),q=at(...hole[j]),u=at(...hole[j],.7),v=at(...hole[k],.7);
    const center=at(hole.reduce((s,p)=>s+p[0],0)/hole.length,hole.reduce((s,p)=>s+p[1],0)/hole.length,.35);
    const normal=new THREE.Vector3(...center).sub(new THREE.Vector3(...p)).normalize().toArray();
    tri(p,q,u,normal);tri(p,u,v,normal);
   }
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.computeVertexNormals();b.put(mergeVertices(g,1e-5),'stone');
}
