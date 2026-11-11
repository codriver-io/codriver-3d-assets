import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './temple-saint-martin-montbeliard-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,put,gable,cyl}=k,L=38.6,W=17.4;
 box('stone',0,.45,0,L,.9,W);
 const bays=[-15.5,-9.3,-3.1,3.1,9.3,15.5];
 function pediment(u,z,a,y,w=2.85,h=.85){const sh=new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(0,h)]),g=new THREE.ExtrudeGeometry(sh,{depth:.32,bevelEnabled:false});g.translate(u,y,0);g.rotateY(a);g.translate(0,0,z);put(g,'stone');}
 for(const side of [-1,1]){
  const a=side>0?0:Math.PI;
  wall('stone',L,.9,12.45,.65,0,side*(W/2-.65),a,bays.flatMap(x=>x===3.1?[{u:x,y:.92,w:2.15,h:3.6,mat:'shadow'},{u:x,y:7.3,w:2.1,h:2.1,circle:true,mat:'glass'}]:[{u:x,y:3.1,w:1.95,h:6.45,mat:'glass'}]));
  for(let j=0;j<7;j++)box('stone',-18.6+j*6.2,6.7,side*8.8,.65,11.6,.45);
  pediment(3.1,side*8.9,a,4.9,3.7,1.0);
  for(const x of bays.filter(x=>x!==3.1)){box('stone',x,9.8,side*8.86,2.9,.35,.45);pediment(x,side*8.9,a,9.98);box('stone',x,2.95,side*8.88,2.6,.3,.42);}
 }
 for(const side of [-1,1]){
  const angle=side*Math.PI/2,holes=[-5.55,0,5.55].map(u=>({u,y:3.1,w:1.85,h:6.45,mat:'glass'}));
  wall('stone',W,.9,12.45,.65,side*(L/2-.65),0,angle,holes);
  // Three pilaster-framed bays on each short facade.
  for(const z of [-8.15,-2.8,2.8,8.15]){box('stone',side*19.5,6.65,z,.8,11.5,.85);box('trim',side*19.55,12.18,z,.95,.45,1.1);}
 }
 // Continuous stepped cornices, steep tiled gables and three upper gable windows.
 box('trim',0,12.63,0,L+.65,.36,W+.65);box('stone',0,12.94,0,L+.95,.26,W+.95);
 k.poly('roof',[[-19.6,13.07,-9.125],[-19.6,13.07,9.125],[-19.6,21.25,0],[19.6,13.07,-9.125],[19.6,13.07,9.125],[19.6,21.25,0]],[0,5,3,0,2,5,1,5,2,1,4,5,0,4,1,0,3,4]);
 for(const s of [-1,1]){
  const sh=new THREE.Shape([new THREE.Vector2(-8.8,13.07),new THREE.Vector2(8.8,13.07),new THREE.Vector2(0,21.2)]);
  for(const z of [-5.15,0,5.15]){const p=new THREE.Path([new THREE.Vector2(z-.60,14.1),new THREE.Vector2(z+.60,14.1),new THREE.Vector2(z+.60,15.8),new THREE.Vector2(z-.60,15.8)]);p.closePath();sh.holes.push(p);}
  const g=new THREE.ExtrudeGeometry(sh,{depth:.85,bevelEnabled:false});g.rotateY(s*Math.PI/2);g.translate(s*19.3,0,0);put(g,'stone');
  for(const z of [-5.15,0,5.15])box('shadow',s*19.4,14.95,z,.24,1.65,1.18);
 }
 // Square stone base and timber clock case, seated through the eastern roof ridge.
 const tx=17.8;
 box('stone',tx,21.1,0,3.1,4.8,3.1);
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;
  wall('slate',3.15,23.45,26.05,.36,tx+1.215*Math.sin(a),1.215*Math.cos(a),a,[{u:0,y:23.9,w:1.30,h:1.30,circle:true,mat:'dial'}]);
  const g=new THREE.BoxGeometry(.07,.55,.075);g.translate(0,24.85,1.41);g.rotateY(a);g.translate(tx,0,0);put(g,'shadow');
  const h=new THREE.BoxGeometry(.38,.07,.075);h.translate(.16,24.55,1.41);h.rotateY(a);h.translate(tx,0,0);put(h,'shadow');
 }
 box('slate',tx,26.20,0,3.65,.30,3.65);
 // Short flared base and four-sided slate needle; finial touches its tip.
 const sp=new THREE.CylinderGeometry(.08,2.25,4.8,4,1);sp.rotateY(Math.PI/4);sp.translate(tx,28.75,0);put(sp,'slate');
 cyl('trim',tx,0,.06,.06,31.05,31.5,near?6:4);
 if(near)for(const x of [-12,-4,4,12])for(const s of [-1,1]){box('stone',x,16.3,s*5.5,1.15,1.7,.9);const sh=new THREE.ConeGeometry(1,1.1,4);sh.rotateY(Math.PI/4);sh.scale(.9,1,.65);sh.translate(x,17.65,s*5.5);put(sh,'roof');}
 return k.finish();
}
