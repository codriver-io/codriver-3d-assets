import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './palazzo-civilta-italiana-parts.js';

export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,cyl,sphere}=k;
 const bar=(m,a,b,w,d=w)=>{if(near)return k.bar(m,a,b,w,d);const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av),g=new THREE.CylinderGeometry(w*.6,w*.6,v.length(),3,1,a[1]<1.3);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());k.put(g,m);};
 const W=51.8,t=1.6,pitch=5.58,holes=[];
 for(let row=0;row<6;row++)for(let bay=0;bay<9;bay++)holes.push({u:(bay-4)*pitch,y:.6+row*8.1,w:3.4,h:6.6,arch:true});
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;
  wall('stone',W,.6,54,t,(W/2-t)*Math.sin(a),(W/2-t)*Math.cos(a),a,holes);
 }
 box('stone',0,.3,0,W,.6,W);
 // Real galleries remain visible behind the arches, rather than black painted apertures.
 for(let row=1;row<=6;row++){
  const y=.6+row*8.1-.4;
  for(const s of [-1,1]){box('stone',0,y,s*22.45,W-3.2,.4,4.5);box('stone',s*22.45,y,0,4.5,.4,W-12.2);}
 }
 // Recessed inner building, partitioned around the small mapped lightwell.
 for(const s of [-1,1]){box('glass',0,24.3,s*13.825,39,47.4,11.35);box('glass',s*12.175,24.3,0,14.65,47.4,16.3);}
 for(let i=0;i<6;i++)for(const s of [-1,1]){
  box('stone',0,4.4+i*8.1,s*19.65,39,.35,.3);
  box('stone',s*19.65,4.4+i*8.1,0,.3,.35,39);
 }
 // Roof perimeter does not cap the open central lightwell.
 for(const s of [-1,1]){box('stone',0,53.7,s*16.225,W-3.2,.6,16.15);box('stone',s*14.575,53.7,0,19.45,.6,16.3);}
 wall('stone',9.7,48,54,.6,0,-8.75,0);
 wall('stone',9.7,48,54,.6,0,8.75,Math.PI);
 wall('stone',16.3,48,54,.6,-5.45,0,Math.PI/2);
 wall('stone',16.3,48,54,.6,5.45,0,-Math.PI/2);
 // Simplified seated/standing allegories in the ground arcades, with supported limbs.
 for(let side=0;side<4;side++)for(let i=0;i<7;i+=(near?1:2)){
  const a=side*Math.PI/2,u=(i-3)*pitch,rad=23.9;
  const x=u*Math.cos(a)+rad*Math.sin(a),z=-u*Math.sin(a)+rad*Math.cos(a);
  box('stone',x,.9,z,1.25,.6,1.1);
  for(const s of [-1,1])bar('stone',[x+s*.19,1.2,z],[x+s*.16,2.6,z],.23,.26);
  cyl('stone',x,z,.43,.36,2.35,3.6,near?8:4);sphere('stone',x,4.0,z,.32);
  for(const s of [-1,1])bar('stone',[x+s*.31,3.4,z],[x+s*.57,2.5,z+.1],.2);
 }
 const root=k.finish();root.userData.features=['6 rows x 9 arches per face','open arcades','recessed core','ground arcade statues'];return root;
}
