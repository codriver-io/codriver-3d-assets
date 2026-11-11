import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { kit } from './parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,cyl,wall,roof,put}=k;
 const keeps=[{x:-16.1,w:13.5,h:28},{x:16,w:14.5,h:23}];
 for(const q of keeps){
  const r=q.w/2,top=q.h-1.1;
  for(let i=0;i<4;i++){
   const a=i*Math.PI/2;
   wall('plaster',q.w,0,top,.8,q.x+(r-.8)*Math.sin(a),(r-.8)*Math.cos(a),a,[{u:0,y:6.5,w:.7,h:1.6,arch:true,mat:'glass'},{u:0,y:13.4,w:1.0,h:2.1,mat:'glass'},{u:0,y:top-4,w:1.05,h:2.2,arch:true,mat:'glass'}]);
   // Wide, unevenly spaced merlons; real daylight remains between them.
   for(let j=-2;j<=2;j++){
    const g=new THREE.BoxGeometry(1.45,1.1,.85);g.translate(j*(q.w-2.2)/4,top+.55,r-.42);g.rotateY(a);g.translate(q.x,0,0);put(g,'plaster');
   }
  }
  box('plaster',q.x,top-1.0,0,q.w-1.4,.45,q.w-1.4);
  // Round engaged corner buttresses and finer mid-face shafts.
  for(const sx of [-1,1])for(const sz of [-1,1]){
   const x=q.x+sx*(r-1.25),z=sz*(r-1.25),rad=q.w===13.5?1.72:1.9;
   cyl('plaster',x,z,rad,rad,0,top,near?20:12);
   for(let j=0;j<5;j++){
    const a=j*Math.PI*2/5;const g=new THREE.BoxGeometry(.95,1.1,.65);g.rotateY(a);g.translate(x+(rad-.25)*Math.sin(a),top+.55,z+(rad-.25)*Math.cos(a));put(g,'plaster');
   }
  }
  for(const s of [-1,1]){
   cyl('plaster',q.x,s*(r-.3),.68,.68,0,top,near?12:8);
   cyl('plaster',q.x+s*(r-.3),0,.68,.68,0,top,near?12:8);
  }
  // Splayed foundation plinth firmly attached to the keep, with no plaza slab.
  box('plaster',q.x,.65,0,q.w+.5,1.3,q.w+.5);
 }
 // The lower residential curtain/hall, with pitched slate roof and sparse separate window bays.
 for(const s of [-1,1])wall('plaster',19.0,0,17.7,.75,0,s>0?5.83:-6.81,s>0?0:Math.PI,[-6,-2,2,6].flatMap(u=>[5.2,11.6].map(y=>({u,y,w:.95,h:1.7,mat:'glass'}))));
 box('plaster',0,17.7,0,19.2,.45,12.2);roof(-9.9,9.9,17.9,22.1,12.3);
 // Two stair towers on opposite sides of the connector, with cones meeting the cylindrical drums.
 for(const [x,z,h,r] of [[.4,6.6,18.0,3.15],[-.6,-7.5,16.3,1.1]]){
  cyl('plaster',x,z,r,r,0,h,near?24:16);cyl('roof',x,z,r+.15,.03,h,h+3.9,near?24:16);
 }
 box('plaster',2.4,22.8,0,.8,4.6,1.1);box('plaster',2.4,25.1,0,1.1,.35,1.4);
 return k.finish();
}
