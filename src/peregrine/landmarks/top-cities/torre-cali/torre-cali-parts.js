import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';

// Original metre-based architectural primitives. Rotation is baked once at finish.
export function kit(SPEC, PALETTES, detail) {
 const near=detail!=='far', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m)=>b.put(g,m);
 function box(m,x,y,z,w,h,d,a=0){
  const g=new THREE.BoxGeometry(w,h,d); // No buried underside: adjoining courses share one surface.
  const ix=Array.from(g.index.array);g.setIndex([...ix.slice(0,18),...ix.slice(24)]);
  g.rotateY(a);g.translate(x,y,z);put(g,m);
 }
 const cyl=(m,x,z,r0,r1,y0,y1,n=near?32:20)=>{
  const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);put(g,m);
 };
 const lathe=(m,x,z,p,n=near?32:20)=>{const g=new THREE.LatheGeometry(p.map(v=>new THREE.Vector2(...v)),n);g.translate(x,0,z);put(g,m);};
 function poly(m,p,indices){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex(indices);const flat=g.toNonIndexed();flat.computeVertexNormals();put(flat,m);g.dispose();}
 const quad=(m,a,c,d,e)=>poly(m,[a,c,d,e],[0,1,2,0,2,3]);
 const bar=(m,a,c,w,d=w)=>b.bar(m,a,c,w,d);
 function prism(m,ring,y0,y1){const s=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));const g=new THREE.ExtrudeGeometry(s,{depth:y1-y0,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,m);}
 function gable(m,x0,x1,h,top,w,z=0){poly(m,[[x0,h,z-w/2],[x0,h,z+w/2],[x0,top,z],[x1,h,z-w/2],[x1,h,z+w/2],[x1,top,z]],[0,1,2,3,5,4,0,5,3,0,2,5,1,5,2,1,4,5]);}
 function arch(w,h,n=near?10:5){const r=w/2,p=[[-r,0],[r,0],[r,h-r]];for(let i=1;i<=n;i++){const a=i*Math.PI/n;p.push([r*Math.cos(a),h-r+r*Math.sin(a)]);}return p;}
 function path(p){const s=new THREE.Path();p.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s;}
 function wall(m,w,y0,y1,t,x,z,a,holes=[]){
  const s=new THREE.Shape([new THREE.Vector2(-w/2,y0),new THREE.Vector2(w/2,y0),new THREE.Vector2(w/2,y1),new THREE.Vector2(-w/2,y1)]);
  for(const o of holes){const p=(o.circle?Array.from({length:near?20:10},(_,i)=>[o.w/2*Math.cos(i*2*Math.PI/(near?20:10)),o.h/2+o.h/2*Math.sin(i*2*Math.PI/(near?20:10))]):o.arch?arch(o.w,o.h):[[-o.w/2,0],[o.w/2,0],[o.w/2,o.h],[-o.w/2,o.h]]).map(([u,v])=>[u+o.u,v+o.y]);s.holes.push(path(p));
   if(o.mat){const g=new THREE.ShapeGeometry(new THREE.Shape(p.map(v=>new THREE.Vector2(...v))));g.translate(0,0,t*.45);g.rotateY(a);g.translate(x,0,z);put(g,o.mat);}
  }
  const g=new THREE.ExtrudeGeometry(s,{depth:t,bevelEnabled:false,curveSegments:near?10:5,steps:1});if(!near){const pos=g.getAttribute('position'),keep=[];for(let i=0;i<pos.count;i+=3){if([0,1,2].every(j=>Math.abs(pos.getZ(i+j))<.002))continue;keep.push(i,i+1,i+2);}g.setIndex(keep);}// Far keeps every discrete glazing row; opaque window backs conceal these inward faces and reveal tubes.
  if(!near&&holes.length&&holes.every(o=>o.mat)){const pa=g.attributes.position,source=g.index?Array.from(g.index.array):Array.from({length:pa.count},(_,i)=>i),keep=[],rings=s.holes.map(h=>h.getPoints());for(let j=0;j<source.length;j+=3){const ix=source.slice(j,j+3),v=ix.map(i=>[pa.getX(i),pa.getY(i),pa.getZ(i)]),back=v.every(p=>Math.abs(p[2])<.002),side=Math.max(...v.map(p=>p[2]))-Math.min(...v.map(p=>p[2]))>.01,hidden=side&&rings.some(r=>v.every(p=>r.some(q=>Math.hypot(p[0]-q.x,p[1]-q.y)<.002)));if(!back&&!hidden)keep.push(...ix);}g.setIndex(keep);}
  g.rotateY(a);g.translate(x,0,z);put(g,m);
 }
 function block(m,x,z,w,d,y0,y1,holes={}){
  const t=.6;
  wall(m,w,y0,y1,t,x,z+d/2-t,0,holes.south||[]);
  wall(m,w,y0,y1,t,x,z-d/2+t,Math.PI,holes.north||[]);
  wall(m,d-2*t,y0,y1,t,x+w/2-t,z,Math.PI/2,holes.east||[]);
  wall(m,d-2*t,y0,y1,t,x-w/2+t,z,-Math.PI/2,holes.west||[]);
  // Opaque internal ceiling is embedded below the exterior wall cap.
  box(m,x,y1-.35,z,w-1.2,.6,d-1.2);
 }
 function dome(m,x,z,r,y0,h){const p=[[0,y0]];for(let i=0;i<= (near?10:6);i++){const a=i*Math.PI/2/(near?10:6);p.push([r*Math.cos(a),y0+h*Math.sin(a)]);}lathe(m,x,z,p);}
 function shell(m,rings,y0,y1,rows=[],spacing=near?6.5:9){
  const shape=new THREE.Shape(rings[0].map(([x,z])=>new THREE.Vector2(x,-z)));
  for(const r of rings.slice(1))shape.holes.push(new THREE.Path(r.map(([x,z])=>new THREE.Vector2(x,-z))));
  const g=new THREE.ExtrudeGeometry(shape,{depth:.3,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,y1-.3,0);put(g,m);
  for(let index=0;index<rings.length;index++){
   let r=rings[index].slice(0,-1);const area=r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);if((index===0&&area>0)||(index>0&&area<0))r.reverse();
   for(let i=0;i<r.length;i++){
    const p=r[i],q=r[(i+1)%r.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),a=-Math.atan2(dz,dx),t=.7;
    const bays=Math.floor(len/spacing),holes=[];
    for(const y of rows)for(let j=0;j<bays;j++)holes.push({u:(j-(bays-1)/2)*len/bays,y,w:Math.min(2,len/bays*.4),h:2.8,mat:'glass'});
    wall(m,len,y0,y1-.3,t,(p[0]+q[0])/2-Math.sin(a)*t,(p[1]+q[1])/2-Math.cos(a)*t,a,holes);
   }
  }
 }
 function sphere(m,x,y,z,r){const g=new THREE.SphereGeometry(r,near?12:8,near?8:5);g.translate(x,y,z);put(g,m);}
 function finish(){const r=b.finish();r.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(SPEC.rotation||0);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});return r;}
 return {near,b,put,box,cyl,lathe,poly,quad,bar,prism,gable,arch,wall,block,dome,shell,sphere,finish};
}
