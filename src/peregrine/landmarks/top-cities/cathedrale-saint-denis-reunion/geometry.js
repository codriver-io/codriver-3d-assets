import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { kit } from './parts.js';
export const PORCH={x:-21.9,columns:[-6.9,-2.3,2.3,6.9],centres:[-4.6,0,4.6],spring:8.2,r:2.1};
export const STATUES=[[-21.85,11.5,-10.9],[-21.85,11.635,-6.9],[-21.85,13.5,0],[-21.85,11.635,6.9],[-21.85,11.5,10.9]];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{box,wall,put,near,cyl,lathe}=k;
 const bays=Array.from({length:7},(_,i)=>-15+i*5.7);
 // Foundations and a restrained three-step porch, all above the local grade.
 box('plaster',0,.45,0,44.8,.9,23.3);
 box('plaster',-20.8,.45,0,3.2,.9,23.3);
 for(let i=0;i<3;i++)box('plaster',-22.32+i*.28,(i+1)*.3/2,0,.30,(i+1)*.3,23.3);
 for(const s of [-1,1]){
  wall('plaster',41.8,.9,10.7,.6,1.2,s*11.05,s>0?0:Math.PI,bays.map(x=>({u:s>0?x-1.2:-(x-1.2),y:3,w:2.4,h:5.6,arch:true,mat:'glass'})));
  wall('plaster',41.0,.9,17.0,.5,1.7,s*6.0,s>0?0:Math.PI,bays.map(x=>({u:s>0?x-1.7:-(x-1.7),y:13,w:1.8,h:2.8,arch:true,mat:'glass'})));
  {const g=new THREE.PlaneGeometry(41.0,5.17);g.rotateX(-Math.PI/2);g.translate(1.7,10.8,s*8.59);put(g,'roof');}
  // Flat concrete roof and low coping after the 1962 cyclone, not an invented tall nave gable.
  box('plaster',1.2,11.0,s*11.4,42.2,.35,.45);
 }
 box('roof',1.7,17.05,0,41.0,.25,12.9);
 wall('plaster',23.3,.9,10.7,.6,21.8,0,Math.PI/2,[-8,8].map(u=>({u,y:3,w:2.3,h:5.6,arch:true,mat:'glass'})));
 wall('plaster',12.9,.9,17,.6,21.8,0,Math.PI/2,[{u:0,y:12,w:2.8,h:3,arch:true,mat:'glass'}]);
 // Mapped rear sacristy is an independent lower rectangular projection.
 box('plaster',24.9,4.1,-.01,5.25,8.2,12.4);box('roof',24.9,8.3,-.01,5.4,.22,12.65);
 // The facade wall behind the open Tuscan portico, with its tall entrance and upper lattice window.
 wall('plaster',13.8,.9,17.2,.7,-18.4,0,-Math.PI/2,[{u:0,y:.9,w:3.8,h:7.0,mat:'shadow'},{u:0,y:13.3,w:2.7,h:3.0,mat:'glass'}]);
 for(const s of [-1,1]){
  wall('plaster',4.6,.9,11.1,.7,-21.0,s*9.25,-Math.PI/2,[{u:0,y:3,w:2.15,h:5.4,arch:true,mat:'glass'}]);
  box('trim',-20.2,11.3,s*9.25,4.4,.45,4.85);
 }
 // Open diagonal lattice in the upper facade window, inset between its masonry jambs.
 for(const slope of [-1,1])for(const offset of [-2,-1,0,1,2]){const pts=[];for(const z of [-1.35,1.35]){const y=14.8+offset*.85+slope*z;if(y>=13.3&&y<=16.3)pts.push([-18.85,y,z]);}for(const y of [13.3,16.3]){const z=(y-14.8-offset*.85)/slope;if(z>-1.35&&z<1.35)pts.push([-18.85,y,z]);}if(pts.length===2)k.b.bar('trim',pts[0],pts[1],near?.045:.065,near?.045:.065);}
 // Four round columns support three genuinely open arches. The soffit geometry has no opaque infill.
 for(const z of PORCH.columns){
  lathe('trim',PORCH.x,z,[[0,.9],[.57,.9],[.57,1.15],[.44,1.35],[.39,7.85],[.49,7.95],[.56,8.2],[0,8.2]],near?16:8);
  box('trim',PORCH.x,8.24,z,1.15,.16,1.15);
 }
 for(const z of PORCH.centres){
  const p=[[-2.3,8.2],[-2.1,8.2]],n=near?16:8;
  for(let i=1;i<=n;i++){const a=Math.PI-i*Math.PI/n;p.push([2.1*Math.cos(a),8.2+2.1*Math.sin(a)]);}
  p.push([2.3,8.2],[2.3,11.0],[-2.3,11.0]);
  const sh=new THREE.Shape(p.map(a=>new THREE.Vector2(...a))),g=new THREE.ExtrudeGeometry(sh,{depth:.9,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(-21.45,0,z);put(g,'plaster');
  const ring=new THREE.TorusGeometry(2.2,.10,3,near?20:10,Math.PI);ring.rotateY(-Math.PI/2);ring.translate(-22.36,8.2,z);put(ring,'trim');
 }
 box('trim',-20.4,11.25,0,4.4,.5,14.4);
 k.gable('plaster',-22.6,-18.2,11.5,13.5,14.8);
 // The second pediment's round clock is cut through the facade rather than painted on a slab.
 {const sh=new THREE.Shape([new THREE.Vector2(-7.05,17.2),new THREE.Vector2(7.05,17.2),new THREE.Vector2(0,20.2)]),hole=new THREE.Path();hole.absarc(0,18.35,.53,0,Math.PI*2,true);sh.holes.push(hole);const g=new THREE.ExtrudeGeometry(sh,{depth:.6,bevelEnabled:false,curveSegments:near?12:6});g.rotateY(-Math.PI/2);g.translate(-18.4,0,0);put(g,'plaster');
 const clock=new THREE.CircleGeometry(.53,near?24:12);clock.rotateY(-Math.PI/2);clock.translate(-18.8,18.35,0);put(clock,'trim');
 k.b.bar('relief',[-18.95,18.35,0],[-18.95,18.67,0],.055,.055);k.b.bar('relief',[-18.95,18.35,0],[-18.95,18.35,.27],.055,.055);}
 // Raking stone cornices directly meet the filled pediments.
 for(const [x,w,eave,apex] of [[-22.62,14.8,11.5,13.5],[-19.02,14.1,17.2,20.2]])for(const s of [-1,1])k.b.bar('trim',[x,eave,s*w/2],[x,apex,0],.18,.18);
 box('trim',-18.6,17.18,0,1.1,.35,14.5);
 // Muted shallow tympanum relief, freely authored figures with no copied texture or outline.
 for(const z of [-4.3,-2.3,0,2.3,4.3]){
  const h=1.15-Math.abs(z)*.10;lathe('relief',-22.7,z,[[0,11.6],[.20,11.6],[.13,11.6+h-.2],[0,11.6+h]],6);
  const g=new THREE.SphereGeometry(.17,6,4);g.translate(-22.7,11.6+h,z);put(g,'relief');
 }
 // Shallow grouped tympanum relief: a reclining figure and connected reaching arms,
 // embedded in the stone face and freely authored rather than traced from a photograph.
 for(const [y,z,ry,rz] of [[11.92,0,.23,1.75],[12.02,-1.65,.25,.25]]){const g=new THREE.SphereGeometry(1,near?12:8,near?8:5);g.scale(.20,ry,rz);g.translate(-22.70,y,z);put(g,'relief');}
 for(const sign of [-1,1])k.b.bar('relief',[-22.75,12.4,sign*2.25],[-22.80,12.12,sign*1.2],.16,.16,0,true);
 // Five restored rooftop statues, individual pedestal/robe/head silhouettes in both LODs.
 for(const [x,y,z] of STATUES){
  box('trim',x,y+.12,z,.72,.24,.72);
  lathe('relief',x,z,[[0,y+.24],[.30,y+.24],[.22,y+1.35],[.14,y+1.55],[0,y+1.6]],near?10:6);
  const g=new THREE.SphereGeometry(.18,near?10:6,5);g.translate(x,y+1.74,z);put(g,'relief');
  for(const s of [-1,1])k.b.bar('relief',[x,y+1.35,z+s*.14],[x-.07,y+.78,z+s*.27],.14,.14,0,true);
 }
 // The roof clocheton is a square pierced lantern, capped by a shallow dark hip and cross.
 box('plaster',-14.9,18.35,0,4.5,2.5,4.5);box('trim',-14.9,19.4,0,5.15,.45,5.15);
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;wall('plaster',4.5,19.6,24.1,.35,-14.9+1.9*Math.sin(a),1.9*Math.cos(a),a,[{u:0,y:20.2,w:2.0,h:3.25,arch:true,mat:'shadow'}]);
  for(let y=20.4;y<22.7;y+=near?.26:.52){const g=new THREE.BoxGeometry(2.12,.08,.2);g.translate(0,y,2.08);g.rotateY(a);g.translate(-14.9,0,0);put(g,'trim');}
 }
 box('trim',-14.9,24.15,0,5.05,.35,5.05);
 k.poly('roof',[[-17.5,24.35,-2.6],[-12.3,24.35,-2.6],[-12.3,24.35,2.6],[-17.5,24.35,2.6],[-15.4,24.95,-.5],[-14.4,24.95,-.5],[-14.4,24.95,.5],[-15.4,24.95,.5]],[0,4,1,1,4,5,1,5,2,2,5,6,2,6,3,3,6,7,3,7,0,0,7,4,4,7,6,4,6,5,0,1,2,0,2,3]);
 cyl('shadow',-14.9,0,.075,.075,24.95,27,6);box('shadow',-14.9,26.35,0,.15,.15,1.25);
 return k.finish();
}
