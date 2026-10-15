import * as THREE from 'three';
import { SPEC } from './config.js';
const yaw = SPEC.rotationDeg * Math.PI / 180;
export const world = ([x,y,z]) => [x*Math.cos(yaw)+z*Math.sin(yaw),y,-x*Math.sin(yaw)+z*Math.cos(yaw)];
export function local([lng,lat]) {
  const x=(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),z=-(lat-SPEC.origin[1])*111320;
  return [x*Math.cos(yaw)-z*Math.sin(yaw),x*Math.sin(yaw)+z*Math.cos(yaw)];
}
export function parts(b,near) {
  const n=near?12:6;
  function put(g,mat,m){if(m)g.applyMatrix4(m);g.rotateY(yaw);b.put(g,mat==='trim'?'wall':mat);}
  const box=(mat,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d).translate(x,y,z);g.setIndex([...g.index.array].filter((_,i)=>i<18||i>=24));put(g,mat);};
  function bar(mat,a,c,w){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...c),v=end.clone().sub(start);const g=new THREE.BoxGeometry(w,v.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));put(g.translate(...start.add(end).multiplyScalar(.5).toArray()),mat);}
  function plan(mat,ring,y,h){if(mat==='roof'){put(new THREE.ShapeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)))).rotateX(-Math.PI/2).translate(0,y+h,0),mat);return;}const g=new THREE.ExtrudeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))),{depth:h,bevelEnabled:false}).rotateX(-Math.PI/2).translate(0,y,0);const keep=[],pos=g.attributes.position,norm=g.attributes.normal;for(let i=0;i<pos.count;i+=3){if(norm.getY(i)<-.9||(mat==='wall'&&norm.getY(i)>.9))continue;keep.push(i,i+1,i+2);}g.setIndex(keep);put(g,mat);}
  function lathe(mat,x,z,profile,segs=n){put(new THREE.LatheGeometry(profile.map(v=>new THREE.Vector2(...v)),segs).translate(x,0,z),mat);}
  function gable(x,z,w,d,eave,peak,mat='roof') {
    const s=new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(0,peak-eave)]);
    const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false}).translate(x,eave,z-d/2);if(w>20){const pos=g.attributes.position,norm=g.attributes.normal,keep=[];for(let i=0;i<pos.count;i+=3){if(Math.abs(norm.getZ(i))>.9)continue;keep.push(i,i+1,i+2);}g.setIndex(keep);}put(g,mat);
  }
  function column(x,z,y0,y1,r=.42){box('wall',x,y0+.22,z,r*2.8,.44,r*2.8);lathe('wall',x,z,[[r*1.3,y0+.44],[r,y0+.7],[r*.88,y1-.65],[r*1.4,y1-.35]],n);box('wall',x,y1-.18,z,r*3,.36,r*3);if(near)for(let i=0;i<6;i++){const a=i*Math.PI/3;put(new THREE.SphereGeometry(r*.23,5,3).scale(1,1.7,1).translate(x+r*Math.sin(a),y1-.48,z+r*Math.cos(a)),'wall');}}
  function ap(x,y,w,h){const r=w/2,s=y+h-r,p=[new THREE.Vector2(x-r,y),new THREE.Vector2(x+r,y),new THREE.Vector2(x+r,s)];for(let i=1;i<=n;i++){const a=i*Math.PI/n;p.push(new THREE.Vector2(x+r*Math.cos(a),s+r*Math.sin(a)));}return p;}
  function face(x,z,a=0){const m=new THREE.Matrix4().makeRotationY(a).setPosition(x,0,z);return {
    arch(mat,s,y,w,h,d=.24){put(new THREE.ShapeGeometry(new THREE.Shape(ap(s,y,w,h))).translate(0,0,d),mat,m);},
    trim(s,y,w,h,t=.18,d=.36){const shape=new THREE.Shape(ap(s,y-t,w+2*t,h+2*t));shape.holes.push(new THREE.Path(ap(s,y,w,h)));put((near?new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}):new THREE.ShapeGeometry(shape)).translate(0,0,d),'wall',m);},
    wall(mat,w,y0,y1,holes,depth=.45){const shape=new THREE.Shape([new THREE.Vector2(-w/2,y0),new THREE.Vector2(w/2,y0),new THREE.Vector2(w/2,y1),new THREE.Vector2(-w/2,y1)]);for(const [s,y,hw,hh] of holes)shape.holes.push(new THREE.Path(ap(s,y,hw,hh)));put(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false}).translate(0,0,-depth),mat,m);},
    box(mat,s,y,w,h,d0=.1,d1=.4){put(new THREE.BoxGeometry(w,h,d1-d0).translate(s,y,(d0+d1)/2),mat,m);},
    circle(mat,s,y,r,d=.25){put(new THREE.CircleGeometry(r,near?24:12).translate(s,y,d),mat,m);},
    line(mat,a,c,w){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...c),v=end.clone().sub(start);const g=new THREE.BoxGeometry(w,v.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));put(g.translate(...start.add(end).multiplyScalar(.5).toArray()),mat,m);},
  };}
  return {put,box,bar,plan,lathe,gable,column,face};
}
