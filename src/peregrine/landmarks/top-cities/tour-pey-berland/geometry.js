import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { kit } from './parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,cyl,wall,lathe,put,near}=k;
 // Closed lower shaft, real lancets in the two belfry stages, blind arcade above the base.
 const width=9.6;
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,x=4.05*Math.sin(a),z=4.05*Math.cos(a);
  const holes=[];
  if(i===0)holes.push({u:0,y:0,w:1.7,h:3.9,arch:true,mat:'shadow'});
  for(const y of [24,36.7])for(const u of [-1.55,1.55])holes.push({u,y,w:1.75,h:y===24?9.7:10.0,arch:true,mat:'shadow'});
  wall('plaster',width,0,49.3,.75,x,z,a,holes);
  // Recessed large blind lancet at midheight is bounded by raised stone archivolts.
  for(const u of [-2.7,0,2.7]){
   for(const yy of [20.8]){
    const points=[[-1.05,0],[-.95,.65],[-.60,1.5],[0,2.3],[.60,1.5],[.95,.65],[1.05,0]];for(let j=0;j<points.length-1;j++){const p=points[j],q=points[j+1],v=([x,y])=>new THREE.Vector3(u+x,yy+y,4.85).applyAxisAngle(new THREE.Vector3(0,1,0),a).toArray();k.b.bar('plaster',v(p),v(q),.18,.18);}
   }
   for(const side of [-1,1]){const g=new THREE.BoxGeometry(.30,12.2,.30);g.translate(u+side*1.05,14.7,4.85);g.rotateY(a);put(g,'plaster');}
  }
 }
 // Engaged shafts and tracery remain connected to each stage cornice.
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;
  for(const u of [-3.5,0,3.5]){const g=new THREE.BoxGeometry(.44,25.5,.42);g.translate(u,36.25,4.9);g.rotateY(a);put(g,'plaster');}
  for(const y of [24,36.7])for(const u of [-1.55,1.55]){
   const g=new THREE.BoxGeometry(.14,8.1,.35);g.translate(u,y+4.05,4.52);g.rotateY(a);put(g,'plaster');
  }
 }
 // Tier belts and a solid crown terrace; corner shafts carry the pinnacles.
 for(const y of [8.2,23.1,35.5,48.7])box('plaster',0,y,0,10.2,.65,10.2);
 box('plaster',0,49.5,0,10.5,.5,10.5);
 for(const x of [-4.9,4.9])for(const z of [-4.9,4.9]){
  box('plaster',x,12,z,1.55,24,1.55);box('plaster',x,29,z,1.24,10,1.24);box('plaster',x,41.4,z,1.0,14.8,1.0);
  cyl('plaster',x,z,.69,.54,48.8,50.2,4);cyl('plaster',x,z,.54,.03,50.2,54.2,4);
  if(near)for(let y=51;y<54;y+=.7)for(const s of [-1,1])box('plaster',x+s*.3,y,z,.3,.2,.3);
 }
 // Square terrace with genuine gaps in the stone balustrade.
 for(let side=0;side<4;side++){
  const a=side*Math.PI/2;
  for(let j=-4;j<=4;j++){const g=new THREE.BoxGeometry(.24,.95,.3);g.translate(j,50.15,4.85);g.rotateY(a);put(g,'plaster');}
  const g=new THREE.BoxGeometry(9.9,.25,.38);g.translate(0,50.72,4.85);g.rotateY(a);put(g,'plaster');
 }
 // Eight-sided upper crown with open lancets and a tapering stone needle.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,r=2.45;
  wall('plaster',2.14,49.75,55.8,.40,r*Math.sin(a),r*Math.cos(a),a,[{u:0,y:50.5,w:1.25,h:4.35,arch:true}]);
 }
 cyl('plaster',0,0,2.85,2.85,55.8,56.2,8);cyl('plaster',0,0,2.7,.7,56.2,59.5,8);cyl('plaster',0,0,.8,.8,59.5,60,8);
 // Notre-Dame d'Aquitaine: connected robe, torso, draped arms, head/crown and the held Child.
 lathe('gold',0,0,[[0,60],[.85,60],[.95,60.2],[.7,62.1],[.48,63.6],[.64,64.0],[.48,64.7],[.26,64.9],[0,64.9]],near?16:10);
 const ell=(x,y,z,rx,ry,rz)=>{const g=new THREE.SphereGeometry(1,near?12:8,near?8:5);g.scale(rx,ry,rz);g.translate(x,y,z);put(g,'gold');};
 ell(0,65.15,0,.38,.52,.36);cyl('gold',0,0,.39,.39,65.6,66,8);
 k.b.bar('gold',[.4,64.25,0],[.8,62.9,.25],.4,.45);k.b.bar('gold',[-.45,64.25,0],[-.85,63.5,.3],.4,.45);
 ell(-.85,64.1,.3,.29,.65,.32);ell(-.85,64.85,.3,.25,.3,.25);k.b.bar('gold',[-.8,63.5,.25],[-.4,63.7,.3],.3,.35);
 return k.finish();
}
