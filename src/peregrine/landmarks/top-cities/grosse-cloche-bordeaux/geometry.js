import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { kit } from './parts.js';
export const CLOCK={y:13.2,bellMouthDiameter:3.36,dialDiameter:3.696,backingWidth:4.9896};
export function create({detail='near'}={}) {
 const k=kit(SPEC,PALETTES,detail), {box,cyl,wall,lathe,near,put}=k;
 // A hollow gate, with the street passage and exposed belfry cut through both faces.
 const holes=[{u:0,y:0,w:4.2,h:7.8,arch:true},{u:0,y:18.2,w:7.2,h:8.8,arch:true},{u:0,y:CLOCK.y-CLOCK.backingWidth/2,w:CLOCK.backingWidth,h:CLOCK.backingWidth}];
 for(const s of [-1,1])wall('plaster',14.1,0,29,.75,0,s*2.65,s>0?0:Math.PI,holes);
 for(const x of [-6.1,6.1])box('plaster',x,14.5,0,1.9,29,5.3);
 box('plaster',0,8.8,0,10,2,5.3);box('plaster',0,16.7,0,10,1.7,5.3);box('plaster',0,28.0,0,11,2,5.3);for(const y of [8.3,17.8,27.2])box('plaster',0,y,0,14.1,.45,6.2);
 for(const x of [-6.8,6.8]){
  cyl('plaster',x,0,3.22,3.22,0,28.2,near?24:16);
  cyl('plaster',x,0,3.5,3.5,27.6,28.35,near?24:16);
  for(const y of [8.3,18.0,27.2])cyl('plaster',x,0,3.38,3.38,y,y+.42,near?24:16);
  for(const s of [-1,1]){
   const sh=new THREE.Shape();sh.moveTo(-.42,21);sh.lineTo(.42,21);sh.lineTo(.42,24.1);sh.quadraticCurveTo(0,25,-.42,24.1);sh.closePath();
   const g=new THREE.ShapeGeometry(sh,near?8:4);g.rotateY(s>0?0:Math.PI);g.translate(x,0,s*3.6);put(g,'glass');
  }
  cyl('roof',x,0,3.5,.05,28.35,36.4,near?24:16);
  cyl('gold',x,0,.09,.09,36.4,36.85,6);
 }
 // Slightly flared, hollow bronze bell with a closed thickness profile.
 lathe('bell',0,0,[[.7,23.6],[.86,23.4],[.96,22.7],[1.2,21.4],[1.62,20.7],[1.68,20.5],[1.5,20.4],[1.38,20.65],[1.03,21.45],[.8,22.7],[.61,23.45],[.7,23.6]],near?24:12);
 cyl('bell',0,0,.22,.22,23.4,25.9,8);box('shadow',0,25.9,0,7.7,.5,.8);
 cyl('bell',0,0,.16,.16,20.2,22.3,6);
 // Central slate shoulder, open octagonal lantern, cap and small weather vane.
 cyl('roof',0,0,3.0,1.55,29,33.8,8);
 cyl('plaster',0,0,1.65,1.65,33.8,34.2,8);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,x=1.3*Math.sin(a),z=1.3*Math.cos(a);
  box('plaster',x,35.65,z,.32,2.9,.32);
 }
 cyl('plaster',0,0,1.65,1.65,37.0,37.45,8);
 cyl('roof',0,0,1.85,.65,37.45,38.55,8);cyl('roof',0,0,.65,.65,38.55,39,8);
 cyl('gold',0,0,.08,.08,39,40,6);
 // Circular clock faces in real square wall apertures; no large coplanar facade overlays.
 for(const s of [-1,1]){
  const y=CLOCK.y,d=CLOCK.dialDiameter,w=CLOCK.backingWidth;
  box('trim',0,y,s*2.3,w,w,.18);
  for(const edge of [-1,1]){box('gold',edge*(w/2-.06),y,s*2.43,.12,w,.12);box('gold',0,y+edge*(w/2-.06),s*2.43,w,.12,.12);}
  const g=new THREE.CylinderGeometry(d/2,d/2,.14,near?32:16);g.rotateX(Math.PI/2);g.translate(0,y,s*2.65);put(g,'glass');
  const rim=new THREE.TorusGeometry(d/2-.055,.055,4,near?32:16);rim.translate(0,y,s*2.765);put(rim,'gold');
  // Unmarked plain border and high-contrast hands, identical readable proportions in both LODs.
  box('gold',-.51,y,s*2.82,1.12,.14,.12);box('gold',0,y+.67,s*2.82,.14,1.46,.12);
  // Open belfry railing meets the lower arch sill.
  for(let i=-5;i<=5;i++)box('shadow',i*.59,18.9,s*2.65,.10,1.4,.14);
  box('shadow',0,19.55,s*2.65,6.2,.13,.14);
 }
 return k.finish();
}
