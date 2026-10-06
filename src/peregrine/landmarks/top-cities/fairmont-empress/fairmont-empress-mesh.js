import * as THREE from 'three';
import { SPEC } from './config.js';
const angle = SPEC.gridAngle * Math.PI / 180, s = Math.sin(angle), c = Math.cos(angle);
// u runs south along the harbour front; v runs east into the hotel.
export const point = (u,y,v) => [v*c-u*s,y,u*c+v*s];
export const local = (x,z) => [-x*s+z*c,x*c+z*s];
export function mesh(b) {
  const data = new Map();
  function face(mat, pts, hint) {
    const q=pts.map(p=>point(...p)), normal=point(hint[0],hint[1],hint[2]);
    let d=data.get(mat);if(!d)data.set(mat,d={positions:[],normals:[],indices:[]});
    const a=new THREE.Vector3(...q[0]),n=new THREE.Vector3(...q[1]).sub(a).cross(new THREE.Vector3(...q[2]).sub(a));
    if(n.dot(new THREE.Vector3(...normal))<0)q.reverse();
    n.set(...q[1]).sub(new THREE.Vector3(...q[0])).cross(new THREE.Vector3(...q[2]).sub(new THREE.Vector3(...q[0]))).normalize();
    const offset=d.positions.length/3;for(const p of q){d.positions.push(...p);d.normals.push(...n.toArray());}
    const drop=Math.abs(n.x)>Math.abs(n.y)&&Math.abs(n.x)>Math.abs(n.z)?0:Math.abs(n.y)>Math.abs(n.z)?1:2;
    const projection=q.map(p=>new THREE.Vector2(...p.filter((_,i)=>i!==drop)));
    for(const ids of THREE.ShapeUtils.triangulateShape(projection,[])){
      const [a,c,e]=ids.map(i=>new THREE.Vector3(...q[i]));
      if(c.sub(a).cross(e.sub(a)).dot(n)<0)ids.reverse();
      d.indices.push(...ids.map(i=>offset+i));
    }
  }
  function box(mat,u0,u1,v0,v1,y0,y1,top=true){
    face(mat,[[u0,y0,v0],[u1,y0,v0],[u1,y1,v0],[u0,y1,v0]],[0,0,-1]);
    face(mat,[[u0,y0,v1],[u1,y0,v1],[u1,y1,v1],[u0,y1,v1]],[0,0,1]);
    face(mat,[[u0,y0,v0],[u0,y0,v1],[u0,y1,v1],[u0,y1,v0]],[-1,0,0]);
    face(mat,[[u1,y0,v0],[u1,y0,v1],[u1,y1,v1],[u1,y1,v0]],[1,0,0]);
    if(top)face(mat,[[u0,y1,v0],[u1,y1,v0],[u1,y1,v1],[u0,y1,v1]],[0,1,0]);
  }
  function hip(u0,u1,v0,v1,y,rise){
    const inset=Math.min((u1-u0)/2,(v1-v0)/2)*.9;
    const upper=[[u0+inset,y+rise,v0+inset],[u1-inset,y+rise,v0+inset],[u1-inset,y+rise,v1-inset],[u0+inset,y+rise,v1-inset]];
    const lower=[[u0,y,v0],[u1,y,v0],[u1,y,v1],[u0,y,v1]],hints=[[0,.4,-1],[1,.4,0],[0,.4,1],[-1,.4,0]];
    for(let i=0;i<4;i++)face('slate',[lower[i],lower[(i+1)%4],upper[(i+1)%4],upper[i]],hints[i]);
    face('slate',upper,[0,1,0]);
  }
  function flush(){for(const [mat,d] of data){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(d.positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(d.normals,3));g.setIndex(d.indices);b.put(g,mat);}}
  return { face,box,hip,flush };
}
