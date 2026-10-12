import * as THREE from 'three';
import { Earcut } from 'three/src/extras/Earcut.js';
// Flat surfaces with explicit outward normals; one merged buffer per material.
export function marineMesh(builder) {
  const buffers = new Map();
  function triangle(mat,a,b,c,normal) {
    const ab=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)), ac=new THREE.Vector3(...c).sub(new THREE.Vector3(...a));
    if(ab.cross(ac).dot(new THREE.Vector3(...normal))<0)[b,c]=[c,b];
    const s=buffers.get(mat)||{p:[],n:[]};buffers.set(mat,s);s.p.push(...a,...b,...c);s.n.push(...normal,...normal,...normal);
  }
  const quad=(m,a,b,c,d,n)=>{triangle(m,a,b,c,n);triangle(m,a,c,d,n);};
  function polygon(m,rings,point,normal) {
    const flat=[],holes=[];
    rings.forEach((r,i)=>{if(i)holes.push(flat.length/2);for(const q of r.slice(0,-1))flat.push(...q);});
    const ix=Earcut.triangulate(flat,holes,2);
    for(let i=0;i<ix.length;i+=3)triangle(m,...ix.slice(i,i+3).map(k=>point(flat[k*2],flat[k*2+1])),normal);
  }
  function finish() {
    for(const [m,s] of buffers) {
      const p=[],n=[],ix=[],keys=new Map();
      for(let i=0;i<s.p.length;i+=3) {
        const key=[...s.p.slice(i,i+3),...s.n.slice(i,i+3)].map(v=>Math.round(v*1e5)).join(',');
        let k=keys.get(key);if(k===undefined){k=p.length/3;keys.set(key,k);p.push(...s.p.slice(i,i+3));n.push(...s.n.slice(i,i+3));}ix.push(k);
      }
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(n,3));g.setIndex(ix);builder.put(g,m);
    }
    return builder.finish();
  }
  return {triangle,quad,polygon,finish};
}
