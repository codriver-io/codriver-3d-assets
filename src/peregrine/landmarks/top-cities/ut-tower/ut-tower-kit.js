import * as THREE from 'three';
import { ROT } from './ut-tower-plan.js';
export function makeKit(b,near) {
  const put=(g,mat)=>{g.rotateY(ROT);b.put(g,mat);};
  const box=(mat,x,y,z,w,h,d)=>{
    const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);put(g,mat);
  };
  const bar=(mat,a,c,w,d=w)=>{
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dir=cv.clone().sub(av);
    const g=new THREE.BoxGeometry(w,dir.length(),d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat);
  };
  const polygon=(mat,ring,y0,y1)=>{
    const g=new THREE.ExtrudeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))),{depth:y1-y0,bevelEnabled:false,steps:1});
    g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,mat);
  };
  const plane=(mat,x,y,z,w,h,a=0)=>{
    const g=new THREE.PlaneGeometry(w,h);g.rotateY(a);g.translate(x,y,z);put(g,mat);
  };
  const hip=(mat,x,z,w,d,y0,y1,tw=w*.65,td=d*.6)=>{
    const p=[x-w/2,y0,z-d/2,x+w/2,y0,z-d/2,x+w/2,y0,z+d/2,x-w/2,y0,z+d/2,x-tw/2,y1,z-td/2,x+tw/2,y1,z-td/2,x+tw/2,y1,z+td/2,x-tw/2,y1,z+td/2];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
    g.setIndex([0,4,1,1,4,5,1,5,2,2,5,6,2,6,3,3,6,7,3,7,0,0,7,4,4,7,5,5,7,6,0,1,3,1,2,3]);g.computeVertexNormals();put(g,mat);
  };
  const cylinder=(mat,x,z,r,y0,y1,rt=r)=>{
    const g=new THREE.CylinderGeometry(rt,r,y1-y0,near?10:6,1,false);g.translate(x,(y0+y1)/2,z);put(g,mat);
  };
  const column=(x,z,y0,y1)=>{
    box('glow',x,y0+.25,z,.9,.5,.9);
    cylinder('glow',x,z,.32,y0+.45,y1-.55,.27);
    box('glow',x,y1-.25,z,.9,.5,.9);
  };
  return {near,put,box,bar,polygon,plane,hip,cylinder,column};
}
