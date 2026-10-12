import * as THREE from 'three';
import { ROT } from './texas-state-capitol-plan.js';
export function makeKit(b,near) {
  const put=(g,mat='stone')=>{
    if(!g.attributes.position.array.every(Number.isFinite))throw new Error('Non-finite '+mat+' '+g.type+' '+JSON.stringify(g.parameters));
    g.rotateY(ROT);b.put(g,mat);
  };
  const box=(mat,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);put(g,mat);};
  const bar=(mat,a,c,w,d=w)=>{
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...c),dir=bv.clone().sub(av);
    const g=new THREE.BoxGeometry(w,dir.length(),d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));
    g.translate(...av.add(bv).multiplyScalar(.5).toArray());put(g,mat);
  };
  const cylinder=(mat,x,z,r,y0,y1,rt=r,n=near?10:6)=>{
    const g=new THREE.CylinderGeometry(rt,r,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);put(g,mat);
  };
  const lathe=(mat,profile,n=near?48:24,x=0,z=0)=>{
    const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n);g.translate(x,0,z);put(g,mat);
  };
  const polygon=(mat,ring,y0,y1)=>{
    const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:y1-y0,bevelEnabled:false,steps:1});
    g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,mat);
  };
  const window=(mat,x,y,z,w,h,a=0,arched=false)=>{
    const pts=arched ? [[-w/2,0],[w/2,0],...[...Array(near?9:5)].map((_,i,arr)=>{const t=i*Math.PI/(arr.length-1);return [Math.cos(t)*w/2,h-w/2+Math.sin(t)*w/2];})] : [[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]];
    const g=new THREE.ShapeGeometry(new THREE.Shape(pts.map(p=>new THREE.Vector2(...p))));
    g.rotateY(a);g.translate(x,y,z);put(g,mat);
  };
  const column=(x,z,y0,y1,r=.65)=>{
    cylinder('stone',x,z,r*1.38,y0,y0+.5,r*1.38,near?8:4);
    cylinder('stone',x,z,r,y0+.45,y1-.55,r*.86,near?10:5);
    cylinder('stone',x,z,r*1.4,y1-.6,y1,r*1.5,near?8:4);
    if(near)for(let j=0;j<4;j++){
      const a=j*Math.PI/2;box('stone',x+Math.cos(a)*r*.8,y1-.35,z+Math.sin(a)*r*.8,.38,.45,.38);
    }
  };
  const hip=(mat,x,z,w,d,y0,y1,topW=w*.62,topD=d*.65)=>{
    const verts=[x-w/2,y0,z-d/2,x+w/2,y0,z-d/2,x+w/2,y0,z+d/2,x-w/2,y0,z+d/2,x-topW/2,y1,z-topD/2,x+topW/2,y1,z-topD/2,x+topW/2,y1,z+topD/2,x-topW/2,y1,z+topD/2];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
    g.setIndex([0,4,1,1,4,5,1,5,2,2,5,6,2,6,3,3,6,7,3,7,0,0,7,4,4,7,5,5,7,6,0,1,3,1,2,3]);g.computeVertexNormals();put(g,mat);
  };
  const pediment=(x,z,w,base,peak,depth=2)=>{
    const shape=new THREE.Shape([new THREE.Vector2(-w/2,base),new THREE.Vector2(w/2,base),new THREE.Vector2(0,peak)]);
    const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false});g.translate(x,0,z-depth);put(g,'stone');
    bar('stone',[x-w/2,base,z+.08],[x,peak,z+.08],.5,.55);
    bar('stone',[x,peak,z+.08],[x+w/2,base,z+.08],.5,.55);
  };
  return {near,put,box,bar,cylinder,lathe,polygon,window,column,hip,pediment};
}
