import * as THREE from 'three';import { SPEC,PALETTES } from './config.js';import { kit } from './parts.js';
export const TOWER={x:30.55,z:-8.85,w:4.3,d:5.1};
export const shoulder=t=>[8.1+6.15*t,11.5+6.0*(1-t)**3];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{wall,cyl,lathe,put,near}=k;
 // Front cornices end at their bearing wall: no rear trim faces buried behind plaster.
 const box=(m,x,y,z,w,h,d)=>{if(m==='trim'&&x< -28&&(y>3.6||y<2)){const lo=x-w/2,hi=Math.min(x+w/2,-29),g=new THREE.BoxGeometry(hi-lo,h,d);g.translate((lo+hi)/2,y,z);const p=g.attributes.position,ix=g.index.array,out=[];for(let i=0;i<ix.length;i+=3)if(![0,1,2].every(j=>Math.abs(p.getX(ix[i+j])-hi)<1e-4))out.push(ix[i],ix[i+1],ix[i+2]);g.setIndex(out);put(g,m);}else k.box(m,x,y,z,w,h,d);};
 box('plaster',0,.4,0,57,.8,28.9);box('metal',TOWER.x,.4,TOWER.z,4.3,.8,5.1);
 for(let i=0;i<4;i++)box('plaster',-29.3+i*.28,(i+1)*.2/2,0,.3,(i+1)*.2,28.9);
 const bays=Array.from({length:8},(_,i)=>-24+i*6.9);
 for(const s of [-1,1]){
  wall('plaster',57,.8,11.5,.6,0,s*13.85,s>0?0:Math.PI,bays.map(x=>({u:s>0?x:-x,y:3,w:2.4,h:5.7,arch:true,mat:'glass'})));
  wall('plaster',55.5,.8,18.0,.55,.75,s*7.05,s>0?0:Math.PI,bays.map(x=>({u:s>0?x-.75:-(x-.75),y:14.6,w:1.85,h:2.65,mat:'glass'})));
  const p=[[-s*14.5,11.6],[-s*7.6,14.1],[-s*7.6,13.9],[-s*14.5,11.4]];
  const sh=new THREE.Shape(p.map(a=>new THREE.Vector2(...a))),g=new THREE.ExtrudeGeometry(sh,{depth:56.3,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-27.9,0,0);const pos=g.attributes.position,ix=[];for(let j=0;j<pos.count;j+=3)if(![0,1,2].every(i=>Math.abs(Math.abs(pos.getZ(j+i))-7.6)<1e-4)&&![0,1,2].every(i=>Math.abs(pos.getX(j+i)+27.9)<1e-4))ix.push(j,j+1,j+2);g.setIndex(ix);put(g,'roof');
  for(let i=0;i<9;i++){const g=new THREE.PlaneGeometry(.36,10.6);if(s<0)g.rotateY(Math.PI);g.translate(-27.5+i*6.8,6.1,s*14.46);put(g,'trim');}
 }
 {const x0=-28.0,x1=28.4,w=7.675;k.poly('roof',[[x0,18,-w],[x0,18,w],[x0,21,0],[x1,18,-w],[x1,18,w],[x1,21,0]],[3,5,4,0,5,3,0,2,5,1,5,2,1,4,5,0,4,1,0,3,4]);}
 wall('plaster',28.9,.8,11.5,.6,27.9,0,Math.PI/2,[-10,0,10].map(u=>({u,y:3,w:2.4,h:5.7,arch:true,mat:'glass'})));
 wall('plaster',15.25,.8,18.0,.6,27.9,0,Math.PI/2,[{u:0,y:14.6,w:2.2,h:2.65,mat:'glass'}]);
 // Broad front, with three recessed entrances and two statue niches.
 wall('plaster',28.9,.8,11.3,.8,-28.2,0,-Math.PI/2,[{u:0,y:.8,w:3.8,h:7.7,arch:true,mat:'shadow'},...[-10.1,10.1].map(u=>({u,y:.8,w:3.1,h:6.8,mat:'shadow'})),...[-5.4,5.4].map(u=>({u,y:3,w:1.5,h:4.3,arch:true,mat:'shadow'}))]);
 for(const z of [-13.8,-7.1,-3.6,3.6,7.1,13.8]){
  box('trim',-29.06,5.25,z,.25,8.9,.58);box('trim',-29.06,9.8,z,.42,.35,.93);box('trim',-29.06,1.0,z,.42,.4,.93);
 }
 box('trim',-28.6,10.3,0,1.35,.55,29.5);box('trim',-28.6,11.45,0,1.4,.4,29.65);
 // Small classical pediments mark both side entrances.
 for(const z of [-10.1,10.1]){
  box('trim',-29.07,7.75,z,.3,.35,4.5);
  const sh=new THREE.Shape([new THREE.Vector2(-2.25,7.9),new THREE.Vector2(2.25,7.9),new THREE.Vector2(0,8.9)]),g=new THREE.ExtrudeGeometry(sh,{depth:.19,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(-29.0,0,z);put(g,'trim');
 }
 // Two freely authored stone saint silhouettes in the actual recessed niches.
 for(const z of [-5.4,5.4]){
  box('trim',-28.65,3.25,z,.65,.5,1.2);
  lathe('trim',-28.65,z,[[0,3.5],[.33,3.5],[.23,5.6],[.13,5.8],[0,5.85]],near?12:7);
  const head=new THREE.SphereGeometry(.2,near?10:6,5);head.translate(-28.65,6.0,z);put(head,'trim');
  for(const s of [-1,1])k.b.bar('trim',[-28.65,5.4,z+s*.14],[-28.7,4.65,z+s*.3],.16,.16,0,true);
 }
 // Three large upper arched fretwork windows, retained as holes at far distance.
 const upper=[-5.0,0,5.0];wall('plaster',15.8,11.65,18.0,.8,-28.2,0,-Math.PI/2,upper.map(u=>({u,y:12.0,w:3.9,h:5.3,arch:true,mat:'shadow'})));
 for(const z of upper){
  for(const zz of (near?[-1.84,-.92,0,.92,1.84]:[-1.84,0,1.84]))k.b.bar('wood',[-28.7,12,z+zz],[-28.7,15.35,z+zz],.12,.12);
  for(const y of [12,13.7,15.35])k.b.bar('wood',[-28.7,y,z-1.95],[-28.7,y,z+1.95],.12,.12);
  if(near)for(const yy of [12.85,14.53])for(const zz of [-.92,.92])for(const s of [-1,1]){
   k.b.bar('wood',[-28.7,yy-.65,z+zz],[-28.7,yy,z+zz+s*.66],.07,.07);
   k.b.bar('wood',[-28.7,yy,z+zz+s*.66],[-28.7,yy+.65,z+zz],.07,.07);
  }
  const arch=new THREE.TorusGeometry(2.04,.19,3,near?20:10,Math.PI);arch.rotateY(-Math.PI/2);arch.translate(-29.01,15.35,z);put(arch,'trim');
 }
 for(const z of [-7.7,-2.5,2.5,7.7]){box('trim',-29.02,14.6,z,.16,5.5,.48);box('trim',-29.02,17.4,z,.3,.25,.68);}
 // Concave scroll shoulders, with measured continuous raking cornices.
 for(const sign of [-1,1]){
  const n=near?14:7,curve=Array.from({length:n+1},(_,i)=>{const [z,y]=shoulder(i/n);return [sign*z,y];}),pp=[[sign*8.1,11.3],...curve,[sign*14.25,11.3]];
  const sh=new THREE.Shape(pp.map(a=>new THREE.Vector2(...a))),g=new THREE.ExtrudeGeometry(sh,{depth:.8,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(-28.2,0,0);put(g,'plaster');
  for(let i=0;i<n;i++)k.b.bar('trim',[-29.01,curve[i][1],curve[i][0]],[-29.01,curve[i+1][1],curve[i+1][0]],.18,.18);
 }
 box('trim',-28.6,18.02,0,1.35,.35,16.4);k.gable('plaster',-29.05,-28.0,18.2,21.0,16.4);
 for(const s of [-1,1])k.b.bar('trim',[-29.08,18.2,s*8.2],[-29.08,21,0],.22,.22);
 // Rear offset metal campanile from the mapped chevet projection, not a front tower.
 const t=TOWER;box('metal',t.x,11.3,t.z,t.w,22.6,t.d);
 // Recessed blind panels on the lower metal stages are inset, not floating facade sheets.
 for(let face=0;face<4;face++){
  const a=face*Math.PI/2,w=face%2?t.d:t.w,r=face%2?t.w/2:t.d/2,holes=[{u:0,y:23.4,w:2.35,h:4.55,arch:true,mat:'shadow'},{u:0,y:28.6,w:2.1,h:2.1,circle:true,mat:'trim'}];
  wall('metal',w,22.6,31.2,.28,t.x+(r-.28)*Math.sin(a),t.z+(r-.28)*Math.cos(a),a,holes);
  for(let y=23.6;y<26.7;y+=near?.3:.6){const g=new THREE.BoxGeometry(2.5,.09,.18);g.translate(0,y,r-.14);g.rotateY(a);g.translate(t.x,0,t.z);put(g,'metal');}
  const fp=([u,y,z])=>new THREE.Vector3(u,y,z).applyAxisAngle(new THREE.Vector3(0,1,0),a).add(new THREE.Vector3(t.x,0,t.z)).toArray();
  k.b.bar('wood',fp([0,29.65,r-.1]),fp([0,30.45,r-.1]),.07,.07);k.b.bar('wood',fp([0,29.65,r-.1]),fp([.65,29.65,r-.1]),.07,.07);
  const sh=new THREE.Shape([new THREE.Vector2(-w/2,31.2),new THREE.Vector2(w/2,31.2),new THREE.Vector2(0,33.2)]),g=new THREE.ExtrudeGeometry(sh,{depth:.25,bevelEnabled:false});g.translate(0,0,r-.25);g.rotateY(a);g.translate(t.x,0,t.z);put(g,'metal');
  for(const u of [-w/2+.12,w/2-.12]){const g=new THREE.CylinderGeometry(.15,.17,30.6,near?10:6);g.translate(u,15.5,r-.02);g.rotateY(a);g.translate(t.x,0,t.z);put(g,'trim');}
 }
 for(const y of [.3,9.4,17.8,22.6,28.1,31.1])box('metal',t.x,y,t.z,t.w+.35,.35,t.d+.35);
 // Four little corner finials and a shallow hip cap preserve the cast-iron skyline.
 k.poly('metal',[[t.x-t.w/2,31.25,t.z-t.d/2],[t.x+t.w/2,31.25,t.z-t.d/2],[t.x+t.w/2,31.25,t.z+t.d/2],[t.x-t.w/2,31.25,t.z+t.d/2],[t.x,33.7,t.z]],[0,4,1,1,4,2,2,4,3,3,4,0,0,1,2,0,2,3]);
 for(const x of [-1,1])for(const z of [-1,1]){const xx=t.x+x*t.w/2,zz=t.z+z*t.d/2;cyl('trim',xx,zz,.12,.08,31.25,32.2,6);cyl('trim',xx,zz,.12,0,32.2,32.5,6);}
 cyl('metal',t.x,t.z,.065,.065,33.7,35,6);box('metal',t.x,34.45,t.z,.13,.13,1.0);
 return k.finish();
}
