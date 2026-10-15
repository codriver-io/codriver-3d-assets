import * as THREE from 'three';
export const THETA = -23 * Math.PI / 180;
export const toWorld = (u,y,v) => [u*Math.cos(THETA)+v*Math.sin(THETA),y,-u*Math.sin(THETA)+v*Math.cos(THETA)];
export const FLYERS = [-31.6,-23.9,-16.2,-8.5,-.8].flatMap(u => [-1,1].map(side => ({
  wall: [u,31,side<0?-3.4:11.4], pier: [u===-31.6&&side>0?-29.7:u,22,side<0?-15.1:(u<-3?28.0:25.0)],
})));
export function makeKit(b,near) {
 const N=near?4:2;
 const path=p=>new THREE.Path(p.map(([x,y])=>new THREE.Vector2(x,y)));
 const shape=p=>new THREE.Shape(p.map(([x,y])=>new THREE.Vector2(x,y)));
 const move=(g,x,y,z,a=0)=>g.rotateY(a).translate(x,y,z);
 const put=(g,m)=>{g.computeVertexNormals();b.put(g,m);};
 const point=(x,y,z,a,dx,dy,dz=0)=>[x+Math.cos(a)*dx+Math.sin(a)*dz,y+dy,z-Math.sin(a)*dx+Math.cos(a)*dz];
 const profile=(w,h,round=false)=>{
  const spring=h-(round?w/2:w*.866),p=[[-w/2,0],[w/2,0],[w/2,spring]];
  if(round){for(let i=1;i<=N*2;i++){const a=Math.PI*i/(N*2);p.push([Math.cos(a)*w/2,spring+Math.sin(a)*w/2]);}}
  else{for(let i=1;i<=N;i++){let a=Math.PI*i/(3*N);p.push([-w/2+w*Math.cos(a),spring+w*Math.sin(a)]);}for(let i=N-1;i>=0;i--){let a=Math.PI*i/(3*N);p.push([w/2-w*Math.cos(a),spring+w*Math.sin(a)]);}}
  return p;
 };
 const k={near,point,profile,
  box(m,x,y,z,w,h,d){b.box(m,[x,y+h/2,z],[w,h,d]);},
  bar(m,a,c,w,d=w){b.bar(m,a,c,w,d);},
  poly(m,p,x,y,z,a=0,depth=0){put(move(depth?new THREE.ExtrudeGeometry(shape(p),{depth,steps:1,bevelEnabled:false}):new THREE.ShapeGeometry(shape(p)),x,y,z,a),m);},
  ring(m,ri,ro,x,y,z,a=0){put(move(new THREE.RingGeometry(ri,ro,near?32:16),x,y,z,a),m);},
  disc(m,r,x,y,z,a=0){put(move(new THREE.CircleGeometry(r,near?32:16),x,y,z,a),m);},
  frame(w,h,t,x,y,z,a=0,round=false){let s=shape(profile(w,h,round));s.holes.push(path(profile(w-t*2,h-t*1.4,round).map(([u,v])=>[u,v+t*.5])));put(move(new THREE.ShapeGeometry(s),x,y,z,a),'trim');},
  // Each visible opening is removed from the masonry, with its infill behind the wall plane.
  wall(w,h,x,y,z,a=0,openings=[],depth=.8){
   let s=shape([[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]]);
   for(const o of openings){const p=o.circle?Array.from({length:near?32:16},(_,i)=>[o.r*Math.cos(i*2*Math.PI/(near?32:16)),o.r*Math.sin(i*2*Math.PI/(near?32:16))]):profile(o.w,o.h,o.round);s.holes.push(path(p.map(([u,v])=>[u+(o.x||0),v+o.y])));}
   let g=near?new THREE.ExtrudeGeometry(s,{depth,steps:1,bevelEnabled:false}):new THREE.ShapeGeometry(s);if(near)g.translate(0,0,-depth);put(move(g,x,y,z,a),'stone');
   for(const o of openings){const c=point(x,y,z,a,o.x||0,o.y,-.5);if(o.circle){k.disc('glass',o.r,...c,a);k.ring('trim',o.r,o.r+.28,...point(x,y,z,a,o.x||0,o.y,.14),a);}else{
    if(o.portal)k.poly('recess',[[-o.w/2,0],[o.w/2,0],[o.w/2,4.9],[-o.w/2,4.9]],...c,a);else k.poly(o.m||'glass',profile(o.w,o.h,o.round),...c,a);k.frame(o.w+.38,o.h+.16,.23,...point(x,y,z,a,o.x||0,o.y-.04,.14),a,o.round);
    if(o.m!=='recess'&&o.m!=='door'&&o.w>1.8){k.bar('trim',point(x,y,z,a,o.x||0,o.y,.25),point(x,y,z,a,o.x||0,o.y+o.h-o.w*.72,.25),near?.13:.18);}
   }}
  },
  roof(u0,u1,v0,v1,eave,ridge){
   const s=shape([[-v0,eave],[-v1,eave],[-(v0+v1)/2,ridge]]);
   put(new THREE.ExtrudeGeometry(s,{depth:u1-u0,steps:1,bevelEnabled:false}).rotateY(Math.PI/2).translate(u0,0,0),'roof');
  },
  hip(x,z,w,d,y,h){
   const p=[x-w/2,y,z-d/2,x+w/2,y,z-d/2,x+w/2,y,z+d/2,x-w/2,y,z+d/2,x,y+h,z];
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex([0,4,1,1,4,2,2,4,3,3,4,0,0,1,2,0,2,3]);put(g.toNonIndexed(),'roof');
  },
  pinnacle(x,z,y,h=1.8,r=.24){
   k.box('trim',x,y,z,r*1.4,h*.4,r*1.4);const g=new THREE.ConeGeometry(r,h*.6,near?6:4).translate(x,y+h*.7,z);put(g,'trim');
  },
  flyer(a,c,width=.75){
   const dx=c[0]-a[0],dz=c[2]-a[2],L=Math.hypot(dx,dz),n=near?8:4;
   const p=[[0,a[1]+1.1],[L,c[1]+1.1]];
   for(let i=n;i>=0;i--){let t=i/n;p.push([L*t,a[1]+(c[1]-a[1])*t+.6*Math.sin(Math.PI*t)]);}
   const g=new THREE.ExtrudeGeometry(shape(p),{depth:width,steps:1,bevelEnabled:false}).rotateY(-Math.atan2(dz,dx));
   g.translate(a[0]+dz*width/(L*2),0,a[2]-dx*width/(L*2));put(g,'stone');
  },
  apseRoof(center,pts,eave,ridge){
   const p=[],ix=[];for(let i=0;i<pts.length-1;i++){
    const a=pts[i],c=pts[i+1],o=p.length/3;
    p.push(a[0],eave,a[1],center[0],ridge,center[1],c[0],eave,c[1]);ix.push(o,o+1,o+2);
   }
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);put(g,'roof');
  },
  rose(x,y,z,a,r){
   k.ring('trim',r,r+.48,x,y,z,a);k.ring('trim',r-.18,r-.04,...point(x,y,z,a,0,0,.12),a);
   const petals=near?12:8;
   for(let i=0;i<petals;i++){const t=i*Math.PI*2/petals;let q=point(x,y,z,a,Math.cos(t)*r*.61,Math.sin(t)*r*.61,.25);k.ring('trim',r*.225,r*.26,...q,a);}
   k.ring('trim',r*.14,r*.2,...point(x,y,z,a,0,0,.28),a);
   if(near)for(let i=0;i<12;i++){const t=i*Math.PI/6;k.bar('trim',point(x,y,z,a,Math.cos(t)*r*.82,Math.sin(t)*r*.82,.25),point(x,y,z,a,Math.cos(t)*r*.98,Math.sin(t)*r*.98,.25),.10);}
  },
 };
 return k;
}
