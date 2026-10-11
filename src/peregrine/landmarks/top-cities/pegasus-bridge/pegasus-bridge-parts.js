import * as THREE from 'three';
import { PROFILE } from './pegasus-bridge-profile.js';

// Member geometry starts in station/up/right metres, then uses the shared roadway frame.
export function parts(b) {
  function put(g,mat,lift=1) {
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++) {
      const q=PROFILE.bridgePoint(p.getX(i),p.getZ(i),p.getY(i));
      p.setXYZ(i,q.x,q.y,q.z);
    }
    g.computeVertexNormals(); b.put(g,mat,0,lift);
  }
  function box(mat,s,y,d,l,h,w,lift=1) {
    const g=new THREE.BoxGeometry(l,h,w);g.translate(s,y,d);put(g,mat,lift);
  }
  function beam(mat,a,c,w,h=w,lift=1) {
    const A=new THREE.Vector3(...a),C=new THREE.Vector3(...c),v=C.clone().sub(A);
    const g=new THREE.BoxGeometry(w,v.length(),h);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    g.translate(...A.add(C).multiplyScalar(.5).toArray());put(g,mat,lift);
  }
  function cylinder(mat,s,y,d,r,h,n=24,lift=1) {
    const g=new THREE.CylinderGeometry(r,r,h,n);g.translate(s,y,d);put(g,mat,lift);
  }
  function disk(mat,s,y,d,r,thickness,n=16) {
    const g=new THREE.CylinderGeometry(r,r,thickness,n);g.rotateZ(Math.PI/2);
    g.translate(s,y,d);put(g,mat);
  }
  function sector(mat,s,y,d,r,thick,width,n) {
    const shape=new THREE.Shape();
    for(let i=0;i<=n;i++){const a=-Math.PI/2+i*Math.PI/(2*n),x=s+r*Math.cos(a),z=y+r*Math.sin(a);i?shape.lineTo(x,z):shape.moveTo(x,z);}
    for(let i=n;i>=0;i--){const a=-Math.PI/2+i*Math.PI/(2*n);shape.lineTo(s+(r-thick)*Math.cos(a),y+(r-thick)*Math.sin(a));}
    shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,steps:1});g.translate(0,0,d-width/2);put(g,mat);
  }
  return {box,beam,cylinder,disk,sector,put};
}
