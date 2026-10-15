import * as THREE from 'three';
export function surfaces(builder) {
 const batches=new Map();
 function face(mat,points,hint) {
  const a=new THREE.Vector3(...points[0]),n=new THREE.Vector3(...points[1]).sub(a).cross(new THREE.Vector3(...points[2]).sub(a));
  if(n.length()<1e-8)return;
  if(n.dot(new THREE.Vector3(...hint))<0){points=[...points].reverse();n.negate();}n.normalize();
  let d=batches.get(mat);if(!d)batches.set(mat,d={p:[],n:[],i:[]});const k=d.p.length/3;
  points.forEach(p=>{d.p.push(...p);d.n.push(...n.toArray());});for(let i=1;i<points.length-1;i++)d.i.push(k,k+i,k+i+1);
 }
 function cap(mat,ring,y){const ps=ring.map(p=>new THREE.Vector2(...p));for(const t of THREE.ShapeUtils.triangulateShape(ps,[]))face(mat,t.map(i=>[ring[i][0],y,ring[i][1]]),[0,1,0]);}
 function flush(){for(const [mat,d]of batches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(d.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(d.n,3));g.setIndex(d.i);builder.put(g,mat);}}
 return {face,cap,flush};
}
