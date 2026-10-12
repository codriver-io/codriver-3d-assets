import * as THREE from 'three';
export const ROTATION = 123.5 * Math.PI / 180;
export function worldPoint([x,y,z]) { return [x*Math.cos(ROTATION)+z*Math.sin(ROTATION),y,-x*Math.sin(ROTATION)+z*Math.cos(ROTATION)]; }
export function worldGeometry(g) { return g.rotateY(ROTATION); }
// Closed sampled elliptical sections: real cloth folds, not lines on a cylindrical stick.
export function loft(rings, segments, folds=0, foldDepth=0) {
  const pos=[], idx=[];
  for (let k=0;k<rings.length;k++) {
    const [x,y,z,rx,rz]=rings[k];
    const a=new THREE.Vector3(...rings[Math.max(0,k-1)].slice(0,3));
    const c=new THREE.Vector3(...rings[Math.min(rings.length-1,k+1)].slice(0,3));
    const t=c.sub(a).normalize(), u=new THREE.Vector3().crossVectors(t,new THREE.Vector3(0,0,1)).normalize(), v=new THREE.Vector3().crossVectors(u,t).normalize();
    for (let j=0;j<segments;j++) { const q=j/segments*Math.PI*2, f=1-foldDepth*(1-Math.cos(folds*q))/2;
      pos.push(x+f*(u.x*rx*Math.cos(q)+v.x*rz*Math.sin(q)),y+f*(u.y*rx*Math.cos(q)+v.y*rz*Math.sin(q)),z+f*(u.z*rx*Math.cos(q)+v.z*rz*Math.sin(q)));
    }
    if (k) for(let j=0;j<segments;j++) { const n=(j+1)%segments,a=(k-1)*segments+j,b=(k-1)*segments+n,c=k*segments+j,d=k*segments+n; idx.push(a,c,b,b,c,d); }
  }
  for(const end of [0,rings.length-1]) { const center=pos.length/3; pos.push(...rings[end].slice(0,3));
    for(let j=0;j<segments;j++) { const a=end*segments+j,b=end*segments+(j+1)%segments; if(end===0)idx.push(center,a,b);else idx.push(center,b,a); }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function orb(center,size,near) { const g=new THREE.SphereGeometry(1,near?20:10,near?14:7);g.scale(...size);g.translate(...center);return g; }
export function slab(outline,z,depth) {
  const s=new THREE.Shape(); outline.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,steps:1});g.translate(0,0,z);return g;
}
export function rod(a,c,r,near) {
  const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av);
  const g=new THREE.CylinderGeometry(r,r,d.length(),near?8:5,1,false);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());return g;
}
