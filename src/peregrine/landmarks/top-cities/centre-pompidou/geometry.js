import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
// u across to east, v along the building to south. Bearing from OSM east edge:
// [2.3532219,48.8611496]–[2.3524482,48.8597263]. Export already rotated.
const angle=-20*Math.PI/180;
export const world=([u,y,v])=>[Math.cos(angle)*u+Math.sin(angle)*v,y,-Math.sin(angle)*u+Math.cos(angle)*v];
export const FRAME_STATIONS=Array.from({length:14},(_,i)=>-81.8+i*163.6/13);
export const FLOORS=[3,10,17,24,31,38];
export const ESCALATOR_PATH=[[-27,3,73],[-27,3,65],[-27,10,47],[-27,10,39],[-27,17,21],[-27,17,13],[-27,24,-5],[-27,24,-13],[-27,31,-31],[-27,31,-39],[-27,38,-57],[-27,38,-68]];
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const members=[],supports=[];
 const box=(mat,c,s)=>b.box(mat,world(c),s,angle);
 const bar=(mat,a,c,w,d=w,name,supportNames)=>{
  b.bar(mat,world(a),world(c),w,d);
  if(name)members.push({name,a:world(a),b:world(c),supports:supportNames});
 };
 const support=(name,c,s)=>{const g=new THREE.BoxGeometry(...s);g.rotateY(angle);g.translate(...world(c));supports.push({name,geometry:g.clone()});b.put(g,'frame');};
 const tube=(mat,a,c,r,seg=near?10:6,name)=>{
  const av=new THREE.Vector3(...world(a)),cv=new THREE.Vector3(...world(c)),delta=cv.clone().sub(av);
  const g=new THREE.CylinderGeometry(r,r,delta.length(),seg,1,false);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));
  g.translate(...av.add(cv).multiplyScalar(.5).toArray());if(name)supports.push({name,geometry:g.clone()});b.put(g,mat);
 };
 // Separate glass bays; no generic solid extrusion behind the external frame.
 for(let i=0;i<13;i++){
  const v=(FRAME_STATIONS[i]+FRAME_STATIONS[i+1])/2;
  for(let j=0;j<6;j++){
   for(const u of [-21.6,23.6]){
    const g=new THREE.PlaneGeometry(12.38,6.2);g.rotateY(u<0?-Math.PI/2:Math.PI/2);g.translate(u,3.25+j*6.4,v);g.rotateY(angle);b.put(g,j===0?'glow':'glass');
   }
   if(near)for(const u of [-21.95,23.95])for(let k=1;k<4;k++)bar('frame',[u,j*6.4+.15,FRAME_STATIONS[i]+k*12.585/4],[u,(j+1)*6.4-.15,FRAME_STATIONS[i]+k*12.585/4],.09);
  }
 }
 for(const v of [-80.8,80.8])for(let j=0;j<6;j++)for(let i=0;i<8;i++){
  const g=new THREE.PlaneGeometry(5.42,6.2);if(v<0)g.rotateY(Math.PI);g.translate(-19+i*5.6,3.25+j*6.4,v);g.rotateY(angle);b.put(g,j===0?'glow':'glass');
  if(near)bar('frame',[-16.25+i*5.6,0.1,v],[-16.25+i*5.6,38.5,v],.1);
 }
 box('roof',[1,38.6,0],[44.8,.45,164]);
 box('roof',[1,.17,0],[44.8,.34,164]);
 for(const y of FLOORS)box('roof',[1,y-.3,0],[44.8,.25,164]);
 // Fourteen transverse frames, gerberette arms and external tie rods.
 for(let i=0;i<FRAME_STATIONS.length;i++){
  const v=FRAME_STATIONS[i];
  for(const u of [-24,26]){
   support(`column-${i}-${u}`,[u,19.7,v],[.7,39.4,.7]);
   bar('frame',[u+(u<0?-4:2),0,v],[u+(u<0?-4:2),39.4,v],near?.21:.27);
   for(const y of FLOORS){const outer=u+(u<0?-4:2);
    bar('frame',[u,y-.8,v],[outer,y+.1,v],.42,.52);
    if(near)bar('frame',[u,y+.4,v],[outer,y+.1,v],.25,.45);
   }
  }
  for(let j=0;j<FLOORS.length;j++){
   const y=FLOORS[j];
   if(near||i===0||i===13||j===5)bar('frame',[-24,y,v],[26,y,v],.36,.48,`transverse-${i}-${j}`,[`column-${i}--24`,`column-${i}-26`]);

  }
 }
 // Facade beams and tall X-braces outside the glazing plane.
 for(const u of [-24,26])for(let i=0;i<13;i++){
  const a=FRAME_STATIONS[i],c=FRAME_STATIONS[i+1];
  for(let j=0;j<FLOORS.length;j++)bar('frame',[u,FLOORS[j],a],[u,FLOORS[j],c],.30,.36,`longitudinal-${u}-${i}-${j}`,[`column-${i}-${u}`,`column-${i+1}-${u}`]);
  if(i%2===0||near)for(let j=0;j<3;j++){
   const low=[3,17,31][j],high=[17,31,38][j];
   bar('frame',[u,low,a],[u,high,c],.20,.20,`brace-a-${u}-${i}-${j}`,[`column-${i}-${u}`,`column-${i+1}-${u}`]);
   bar('frame',[u,high,a],[u,low,c],.20,.20,`brace-b-${u}-${i}-${j}`,[`column-${i}-${u}`,`column-${i+1}-${u}`]);
  }
 }
 for(const v of [FRAME_STATIONS[0],FRAME_STATIONS.at(-1)])for(const y of [3,14.5,26,37.5])bar('frame',[-24,y,v],[26,y,v],.3);
 for(const v of [FRAME_STATIONS[0],FRAME_STATIONS.at(-1)])for(let k=0;k<4;k++)for(let j=0;j<3;j++){
  const u=-24+k*12.5,y=3+j*11.5;
  bar('frame',[u,y,v],[u+12.5,y+11.5,v],.23);bar('frame',[u,y+11.5,v],[u+12.5,y,v],.23);
 }
 // East technical facade: air, water, electricity and red lift housings.
 for(let i=0;i<13;i++){
  const v=(FRAME_STATIONS[i]+FRAME_STATIONS[i+1])/2,mat=i%3===0?'green':'blue',r=mat==='blue'?1.05:.48;
  tube(mat,[28.1,0,v],[28.1,40.3,v],r);tube(mat,[28.1,40.3,v],[21.5,40.3,v],r);tube(mat,[21.5,40.3,v],[21.5,38.6,v],r);
  if(near)for(const y of [10,24,31])tube(mat,[28.1,y,v],[23.5,y,v],r*.62);
  if(i%3===1)tube('yellow',[27.9,.4,v+3],[27.9,39.5,v+3],.33);
 }
 for(const v of [-62,51]){
  box('red',[25.7,19.8,v],[1.6,39.6,3.5]);
  if(near)for(const y of FLOORS)box('glass',[26.65,y+2,v],[.2,2.5,2.6]);
 }
 // Roof air handling banks with grounded white cowls.
 for(let i=0;i<13;i++){
  const v=(FRAME_STATIONS[i]+FRAME_STATIONS[i+1])/2;
  box(i%4===0?'yellow':'blue',[12,39.65,v],[7,1.65,10]);
  tube('frame',[12,40.4,v],[12,41.4,v],.6);tube('frame',[12,41.4,v],[8,41.4,v],.6);
 }
 // West Chenille: sloping runs/landings, red circulation spine, opaque glass
 // skin and proud metallic hoops; no transparency dependency in the GLB.
 for(let i=0;i<ESCALATOR_PATH.length-1;i++){
  const a=ESCALATOR_PATH[i],c=ESCALATOR_PATH[i+1];
  tube('glass',a,c,1.55,near?12:8,`shell-${i}`);
  bar('red',[a[0],a[1]-1.5,a[2]],[c[0],c[1]-1.5,c[2]],2.8,.48,`circulation-spine-${i}`,[`shell-${i%2?i-1:i}`,`shell-${i%2?i+1:i}`]);
  // Rail terminal contacts are recorded after their actual end hoops are built.
  const axis=new THREE.Vector3(...world(c)).sub(new THREE.Vector3(...world(a))),length=axis.length();
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),axis.normalize()),n=Math.ceil(length/(near?2:14));
  for(let k=0;k<=n;k++){
   const at=world(a.map((x,j)=>x+(c[j]-x)*k/n)),g=new THREE.TorusGeometry(1.60,near?.075:.11,3,near?12:8);
   g.applyQuaternion(q);g.translate(...at);if(k===0||k===n)supports.push({name:`hoop-${i}-${k}`,geometry:g.clone()});b.put(g,'frame');
  }
  for(const du of [-1.25,1.25])bar('frame',[a[0]+du,a[1]-1.1,a[2]],[c[0]+du,c[1]-1.1,c[2]],.15,.15,`rail-${i}-${du}`,[`hoop-${i}-0`,`hoop-${i}-${n}`]);
  for(const p of [a,c]){
   const nearest=FRAME_STATIONS.reduce((best,v,i)=>Math.abs(v-p[2])<Math.abs(FRAME_STATIONS[best]-p[2])?i:best,0);
   bar('frame',[-24,p[1]-1.5,FRAME_STATIONS[nearest]],[-27,p[1]-1.5,p[2]],.4,.4,`landing-bracket-${i}-${p===a?'a':'b'}`,[`column-${nearest}--24`,`shell-${i%2?(p===a?i-1:i+1):i}`]);
   if(p[1]===3)bar('frame',[-27,0,p[2]],[-27,1.6,p[2]],.5);
  }
 }
 box('frame',[-23.6,2,63],[2.5,.4,19]);box('glow',[-22.15,1.1,63],[.25,2.1,16]);
 const root=b.finish();Object.defineProperties(root.userData,{members:{value:members},supports:{value:supports}});root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();}});return root;
}
