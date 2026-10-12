import * as THREE from 'three';
import { SITE_RING } from './motherland-monument-site.js';

// Rigid museum, not a modeled hill. The low earth-covered roof wings taper
// to plaza grade; the two exposed entrance ranges retain their mapped outline.
export function museumParts() {
  const batches=new Map();
  const tri=(mat,a,b,c,n)=>{
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),cv=new THREE.Vector3(...c);
    if(bv.sub(av).cross(cv.sub(av)).dot(new THREE.Vector3(...n))<0)[b,c]=[c,b];
    if(!batches.has(mat))batches.set(mat,[]);batches.get(mat).push(...a,...b,...c);
  };
  const quad=(m,a,b,c,d,n)=>{tri(m,a,b,c,n);tri(m,a,c,d,n);};
  const section=SITE_RING.map(([x,z])=>{
    const r=Math.hypot(x,z),wing=z<-28;
    return {inner:[x/r*32,13,z/r*32],mid:[x/r*47,7.5,z/r*47],outer:[x,wing?7.5:.25,z]};
  });
  for(let i=0;i<section.length;i++) {
    const p=section[i],q=section[(i+1)%section.length];
    tri('museum',[0,13,0],p.inner,q.inner,[0,1,0]);
    quad('museum',p.inner,q.inner,q.mid,p.mid,[0,1,0]);
    quad(p.outer[1]>1&&q.outer[1]>1?'museum':'roof',p.mid,q.mid,q.outer,p.outer,[0,1,0]);
    const a=p.outer,c=q.outer,dx=c[0]-a[0],dz=c[2]-a[2],L=Math.hypot(dx,dz),n=[-dz,0,dx];
    // Openings partition the wall instead of overlaying a solid slab. Low
    // tapered edges are just a 25 cm roof lip resting on local grade.
    if(a[1]>1&&c[1]>1&&L>5) {
      const at=(t,y)=>[a[0]+t*dx,y,a[2]+t*dz],bays=Math.max(2,Math.round(L/3.5));
      for(let j=0;j<bays;j++) {
        const u=j/bays,v=(j+1)/bays,lo=u+.18/bays,hi=v-.18/bays;
        quad('museum',at(u,0),at(lo,0),at(lo,7.5),at(u,7.5),n);
        quad('museum',at(hi,0),at(v,0),at(v,7.5),at(hi,7.5),n);
        quad('glass',at(lo,0),at(hi,0),at(hi,4.8),at(lo,4.8),n);
        quad('museum',at(lo,4.8),at(hi,4.8),at(hi,7.5),at(lo,7.5),n);
      }
    } else quad('museum',[a[0],0,a[2]],[c[0],0,c[2]],c,a,n);
  }
  return [...batches].map(([material,p])=>{
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geometry.computeVertexNormals();return {material,geometry};
  });
}
