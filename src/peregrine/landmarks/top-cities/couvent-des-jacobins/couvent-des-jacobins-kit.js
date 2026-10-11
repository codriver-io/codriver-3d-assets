import * as THREE from 'three';

// Original shape primitives: XY facade profiles are extruded inward from their outward face.
export function makeKit(b, near) {
  const n=near?6:2;
  const vectors=p=>p.map(v=>new THREE.Vector2(...v));
  const shape=p=>new THREE.Shape(vectors(p));
  const put=(g,m)=>{g.computeVertexNormals(); b.put(g,m,0,0);};
  function pointed(w,h,mitre=false) {
    const r=w/2,R=w*.92, angle=Math.acos((R-r)/R), naturalRise=R*Math.sin(angle);
    const rise=Math.min(h,naturalRise),spring=h-rise;
    if(mitre)return [[-r,0],[r,0],[r,Math.max(0,h-r)],[0,h],[-r,Math.max(0,h-r)]];
    const p=[[-r,0],[r,0],[r,spring]];
    for(let i=1;i<=n;i++){const t=i/n*angle;p.push([r-R+R*Math.cos(t),spring+R*Math.sin(t)*rise/naturalRise]);}
    for(let i=n-1;i>=0;i--){const t=i/n*angle;p.push([-r+R-R*Math.cos(t),spring+R*Math.sin(t)*rise/naturalRise]);}
    return p;
  }
  const xf=(g,face,across,y,plane)=>{g.rotateY(face.angle);g.translate(face.x+Math.cos(face.angle)*across,y,face.z-Math.sin(face.angle)*across);return g;};
  // 'plane' is an additional outward normal offset; avoids face-on-face overlays.
  function place(g,face,across,y,plane=0){xf(g,face,across,y);g.translate(Math.sin(face.angle)*plane,0,Math.cos(face.angle)*plane);return g;}
  function solid(m,p,depth,face,across,y,plane=0,holes=[]) {
    const s=shape(p);for(const hole of holes)s.holes.push(new THREE.Path(vectors(hole).reverse()));
    const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:1});g.translate(0,0,-depth);put(place(g,face,across,y,plane),m);
  }
  function panel(m,p,face,across,y,offset){put(place(new THREE.ShapeGeometry(shape(p)),face,across,y,offset),m);}
  function arch(m,w,h,border,face,across,y,offset=0,mitre=false){
    const outer=pointed(w,h,mitre),inner=pointed(w-2*border,h-border,mitre);
    const p=[],ix=[];for(let i=0;i<outer.length;i++){p.push(...outer[i],0,...inner[i],0);}
    for(let i=1;i<outer.length;i++){const a=(i-1)*2,b=i*2;ix.push(a,b,b+1,a,b+1,a+1);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);put(place(g,face,across,y,offset+.03),m);
  }
  function cyl(m,x,z,y0,y1,r,sides=near?8:4){const g=new THREE.CylinderGeometry(r,r,y1-y0,sides,1,true);g.translate(x,(y1+y0)/2,z);put(g,m);}
  function prism(m,ring,y0,y1){const s=shape(ring.map(([u,v])=>[u,-v]));const g=new THREE.ExtrudeGeometry(s,{depth:y1-y0,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,m);}
  function roof(m,u0,u1,v0,v1,eave,ridge){const s=shape([[-(v1-v0)/2,0],[(v1-v0)/2,0],[0,ridge-eave]]);const g=new THREE.ExtrudeGeometry(s,{depth:u1-u0,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(u0,eave,(v0+v1)/2);put(g,m);}
  function fan(m,ring,eave,apex){const p=[],ix=[];ring.forEach(([x,z])=>p.push(x,eave,z));p.push(...apex);const count=ring.length;const area=ring.reduce((a,[x,z],i)=>{const q=ring[(i+1)%count];return a+x*q[1]-q[0]*z;},0);for(let i=0;i<count;i++)ix.push(...(area>0?[i,count,(i+1)%count]:[i,(i+1)%count,count]));const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();put(g,m);}
  function roofV(m,u0,u1,v0,v1,eave,ridge){const s=shape([[-(u1-u0)/2,0],[(u1-u0)/2,0],[0,ridge-eave]]);const g=new THREE.ExtrudeGeometry(s,{depth:v1-v0,bevelEnabled:false});g.translate((u0+u1)/2,eave,v0);put(g,m);}
  function circle(m,r,face,across,y,offset){put(place(new THREE.CircleGeometry(r,near?24:12),face,across,y,offset),m);}
  function ring(m,inner,outer,face,across,y,offset){put(place(new THREE.RingGeometry(inner,outer,near?24:12),face,across,y,offset),m);}
  const rectLocal=(w,h)=>[[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]];
  function faceBar(m,face,a,y,offset,w,h,d=.12){if(!near){panel(m,rectLocal(w,h),face,a,y-h/2,offset+d/2);return;}const g=new THREE.BoxGeometry(w,h,d);g.translate(a,y,offset);put(place(g,face,0,0),m);}
  return {near,n,put,pointed,solid,panel,arch,cyl,prism,roof,roofV,fan,circle,ring,faceBar,
    box:(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]),
    bar:(m,a,c,w,d=w)=>b.bar(m,a,c,w,d,0,false,0),
    frustum(m,x,z,y0,y1,flat0,flat1){const c=Math.cos(Math.PI/8),g=new THREE.CylinderGeometry(flat1/c,flat0/c,y1-y0,8);g.rotateY(Math.PI/8);g.translate(x,(y0+y1)/2,z);put(g,m);},
    cone(m,x,z,y0,y1,r,sides=4){const g=new THREE.ConeGeometry(r,y1-y0,sides,1,true);g.translate(x,(y0+y1)/2,z);put(g,m);},
  };
}
