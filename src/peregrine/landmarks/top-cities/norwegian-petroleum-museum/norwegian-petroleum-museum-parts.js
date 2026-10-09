import * as THREE from 'three';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
// Mapped facade [5.7343961,58.9732921] → [5.7350042,58.9734919].
const a=57*Math.PI/180,s=Math.sin(a),c=Math.cos(a);
export const frame=(u,y,v)=>[s*u+c*v,y,-c*u+s*v];
export const unframe=(x,y,z)=>[s*x-c*z,y,c*x+s*z];
const k=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=latToMercY(SPEC.origin[1]);
export const mapped=ring=>ring.slice(0,-1).map(([lng,lat])=>unframe((lngToMercX(lng)-ox)/k,0,(oz-latToMercY(lat))/k));
export function surfaces(b,mat,polys){
 const positions=[],indices=[];
 for(const poly of polys){
  const vs=poly.map(q=>new THREE.Vector3(...frame(...q))),n=new THREE.Vector3().crossVectors(vs[1].clone().sub(vs[0]),vs[2].clone().sub(vs[0])).normalize();
  const basis=vs[1].clone().sub(vs[0]).normalize(),cross=new THREE.Vector3().crossVectors(n,basis);
  const contour=vs.map(v=>new THREE.Vector2(v.clone().sub(vs[0]).dot(basis),v.clone().sub(vs[0]).dot(cross)));
  const offset=positions.length/3;positions.push(...vs.flatMap(v=>v.toArray()));
  for(const t of THREE.ShapeUtils.triangulateShape(contour,[]))indices.push(...t.map(i=>i+offset));
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,mat);
}
export function solid(b,mat,bottom,top,caps={bottom:true,top:true}){
 const polys=[];if(caps.bottom)polys.push(bottom.slice().reverse());if(caps.top)polys.push(top);
 for(let i=0;i<bottom.length;i++){const j=(i+1)%bottom.length;polys.push([bottom[i],bottom[j],top[j],top[i]]);}
 const area=bottom.reduce((a,p,i)=>{const q=bottom[(i+1)%bottom.length];return a+p[0]*q[2]-q[0]*p[2]},0);
 if(area>0)for(const p of polys)p.reverse();
 surfaces(b,mat,polys);
}
