import * as THREE from 'three';
import { SPEC } from './config.js';
export function kit(b, near) {
  const sides = near ? 12 : 6, rotation = SPEC.rotationDeg * Math.PI / 180;
  function put(g, material) { g.rotateY(rotation); b.put(g, material); }
  const box = (m,x,y,z,w,h,d) => put(new THREE.BoxGeometry(w,h,d).translate(x,y,z),m);
  function cylinder(m,x,z,y0,y1,r0,r1=r0,n=sides) {
    put(new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false).translate(x,(y0+y1)/2,z),m);
  }
  function lathe(m,x,z,profile,n=near?32:16) {
    put(new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n).translate(x,0,z),m);
  }
  function line(m,a,c,w) {
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av);
    let g;
    if(near)g=new THREE.BoxGeometry(w,d.length(),w);
    else {
      const points=[];for(const y of [-d.length()/2,d.length()/2])for(let i=0;i<3;i++)points.push(Math.sin(i*Math.PI*2/3)*w*.65,y,Math.cos(i*Math.PI*2/3)*w*.65);
      g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setIndex([0,3,1,1,3,4,1,4,2,2,4,5,2,5,0,0,5,3,0,1,2,3,5,4]);g=g.toNonIndexed();g.computeVertexNormals();
    }
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,m);
  }
  function extrude(m,ring,y0,y1) {
    const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:y1-y0,bevelEnabled:false,curveSegments:1});
    g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,m);
  }
  // Facade-facing arch, wall thickness along x. The lower arch opening is real void.
  function arch(m,x,z,width,bottom,spring,depth,outer=false) {
    const r=width/2, s=new THREE.Shape();
    if (!outer) {
      s.moveTo(-r,bottom);s.lineTo(r,bottom);s.lineTo(r,spring);
      s.absarc(0,spring,r,0,Math.PI,false);s.lineTo(-r,bottom);
    } else {
      s.moveTo(-r,spring);s.absarc(0,spring,r,Math.PI,0,true);
      s.lineTo(r,spring+r+.25);s.lineTo(-r,spring+r+.25);s.lineTo(-r,spring);
    }
    const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:near?12:5});
    g.rotateY(Math.PI/2);g.translate(x,0,z);put(g,m);
  }
  // Frontal plane (y,z); geometry keeps its external normal toward +x.
  function plaque(m,x,z,y,w,h) {box(m,x,y,z,.16,h,w);}
  function pediment(x,z,w,y,h,depth,m='trim') {
    extrude(m,[[x-depth/2,z-w/2],[x+depth/2,z-w/2],[x+depth/2,z+w/2],[x-depth/2,z+w/2]],y,y+.3);
    const s=new THREE.Shape([new THREE.Vector2(-w/2,y),new THREE.Vector2(w/2,y),new THREE.Vector2(0,y+h)]);
    const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(x-depth/2,0,z);put(g,m);
    line('trim',[x+depth/2+.08,y,z-w/2],[x+depth/2+.08,y+h,z],.65);
    line('trim',[x+depth/2+.08,y+h,z],[x+depth/2+.08,y,z+w/2],.65);
  }
  function column(x,z,bottom,top,r,ornate=true) {
    if(!near) {
      box('trim',x,bottom+.325,z,r*2.64,.65,r*2.64);
      cylinder('stone',x,z,bottom+.65,top-1.0,r,r*.87,4);
      box('trim',x,top-.5,z,r*2.9,1.0,r*2.9);
      return;
    }
    cylinder('trim',x,z,bottom,bottom+.65,r*1.32);
    cylinder('stone',x,z,bottom+.65,top-1.6,r,r*.87,near?10:5);
    cylinder('trim',x,z,top-1.6,top-.65,r*.94,r*1.4);
    box('trim',x,top-.325,z,r*2.9,.65,r*2.9);
    if(near && ornate) {
      for(let j=0;j<8;j++) {
        const a=j*Math.PI/4;
        const g=new THREE.ConeGeometry(.23,.9,4).rotateZ(.4).rotateY(-a).translate(x+Math.sin(a)*r*1.03,top-1.1,z+Math.cos(a)*r*1.03);put(g,'trim');
      }
      for(let j=0;j<10;j++) {
        const a=j*Math.PI/5;
        line('trim',[x+Math.sin(a)*r*.985,bottom+.8,z+Math.cos(a)*r*.985],[x+Math.sin(a)*r*.89,top-1.7,z+Math.cos(a)*r*.89],.075);
      }
    }
  }
  // Abstract standing stone sculpture: robe, torso, head and connected gesture arms.
  function statue(x,z,bottom,size=5.5,gesture=0) {
    box('trim',x,bottom+.4,z,1.8,.8,1.8);
    lathe('trim',x,z,near?[[0,bottom+.75],[.66,bottom+.75],[.6,bottom+size*.42],[.42,bottom+size*.68],[.5,bottom+size*.8],[0,bottom+size*.81]]:[[0,bottom+.75],[.66,bottom+.75],[.44,bottom+size*.8],[0,bottom+size*.81]],near?8:4);
    put(new THREE.SphereGeometry(.38,near?8:5,near?5:3).translate(x,bottom+size*.91,z),'trim');
    for(const s of [-1,1])line('trim',[x,bottom+size*.7,z+s*.4],[x+.1,bottom+size*(gesture&&s>0?.94:.48),z+s*.95],.32);
  }
  return {put,box,cylinder,lathe,line,extrude,arch,plaque,pediment,column,statue};
}
