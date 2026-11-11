import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';import {kit} from './ellicott-city-station-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,roof,cyl,beam}=k;
 const w=7.6,d=27.6,cx=.2,eave=7.8,peak=10.4;
 box('stone',cx,.2,0,w,.4,d);
 const bays=[-10,-5,0,5,10];
 function sash(side,z,y,h){const x=cx+side*(w/2-.55+.30);box('trim',x,y+h/2,z,.08,h,.055);for(const t of near?[1/3,2/3]:[.5])box('trim',x,y+h*t,z,.08,.055,1.45);}
 for(const side of [-1,1]){
  const a=side>0?Math.PI/2:-Math.PI/2,holes=[];
  for(const z of bays){holes.push({u:side>0?-z:z,y:4.8,w:1.5,h:2.2,mat:'glass'});if(z!==0)holes.push({u:side>0?-z:z,y:1.0,w:1.45,h:2.2,mat:'glass'});}
  holes.push({u:0,y:.4,w:1.65,h:3.05,mat:'wood'});
  wall('stone',d,.4,eave,.55,cx+side*(w/2-.55),0,a,holes);
  for(const z of bays){sash(side,z,4.8,2.2);if(z!==0)sash(side,z,1.0,2.2);}
 }
 for(const side of [-1,1])wall('stone',w,.4,eave,.55,cx,side*(d/2-.55),side>0?0:Math.PI,side>0?[{u:0,y:4.0,w:2.3,h:3.0,arch:true,mat:'wood'}]:[{u:0,y:1,w:1.2,h:2.2,mat:'glass'},{u:0,y:5,w:1.5,h:2.1,mat:'glass'}],peak);
 roof('roof',cx,0,9.5,d-.4,eave,peak-.10);
 // Open shutters on the Maryland Avenue ground-floor sash bays.
 for(const z of [-10,-5,5,10])for(const side of [-1,1])box('wood',4.16,2.1,z+side*.98,.10,2.2,.55);
 // Alternating corner quoins are low-cost stone relief, not a copied texture.
 for(const x of [-3.52,3.92])for(const z of [-13.68,13.68])for(let j=0;j<7;j++)box('stone',x,.8+j*.95,z,.45,.46,.7);
 // Upper trackside platform: an architectural level, supported down to the lower foundation.
 box('wood',-4.10,3.50,0,1.00,.20,26.8);
 for(const z of [-12,-4,4,12]){
  box('stone',-4.10,1.7,z,.50,3.4,.55);
  beam('bracket',[-3.55,6.6,z],[-4.55,7.80,z],.15);
 }
 // Current small wood ventilator, with louvres cut into each wall and a hipped cap.
 const vz=-5.8;
 box('wood',cx,10.40,vz,2.1,.3,2.1);
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,x=cx+Math.sin(a)*.9,z=vz+Math.cos(a)*.9;
  wall('wood',1.8,10.5,11.65,.2,x,z,a,[{u:0,y:10.68,w:1.15,h:.68,mat:'glass'}]);
  const count=near?5:3;for(let j=0;j<count;j++)box('wood',x+Math.sin(a)*.18,10.76+j*(near?.12:.22),z+Math.cos(a)*.18,1.13,.045,.08,a);
 }
 const cap=new THREE.CylinderGeometry(.05,1.66,.8,4,1,false);cap.rotateY(Math.PI/4);cap.translate(cx,12.0,vz);k.put(cap,'roof');
 // Entry threshold is flush with the rigid building plinth, never a 1.5 cm ground decal.
 box('stone',4.25,.12,0,.5,.24,2.1);
 return k.finish();
}
