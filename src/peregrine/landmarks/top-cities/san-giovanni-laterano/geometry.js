import * as THREE from 'three';
import clipping from 'polygon-clipping';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS,COURTS} from './footprint.js';
import {kit} from './san-giovanni-laterano-parts.js';

export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,block,cyl,bar,sphere}=k;
 const cut=clipping.difference([LOCAL_RINGS[0]],...COURTS.map(r=>[r]),[[[63,-34],[80,-34],[80,33],[63,33],[63,-34]]],[[[-41,-45],[-9,-45],[-9,-30],[-41,-30],[-41,-45]]]);
 for(const rings of cut){
  const shape=new THREE.Shape(rings[0].map(([x,z])=>new THREE.Vector2(x,-z)));
  for(const r of rings.slice(1))shape.holes.push(new THREE.Path(r.map(([x,z])=>new THREE.Vector2(x,-z))));
  const g=new THREE.ExtrudeGeometry(shape,{depth:.35,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,13.15,0);k.put(g,'masonry');
  const floor=g.clone();floor.translate(0,-13.15,0);k.put(floor,'masonry');
  for(let index=0;index<rings.length;index++){
   let r=rings[index].slice(0,-1);const area=r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);
   if((index===0&&area>0)||(index>0&&area<0))r.reverse();
   for(let i=0;i<r.length;i++){
    const p=r[i],q=r[(i+1)%r.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),a=-Math.atan2(dz,dx),t=.75;
    const bays=Math.floor(len/(near?6.5:9)),holes=[];
    for(let j=0;j<bays;j++)holes.push({u:(j-(bays-1)/2)*len/bays,y:4.1,w:Math.min(2.1,len/bays*.42),h:3.3,mat:'glass'});
    wall('masonry',len,0,13.15,t,(p[0]+q[0])/2-Math.sin(a)*t,(p[1]+q[1])/2-Math.cos(a)*t,a,holes);
   }
  }
 }
 // Nave, clerestory and continuous pitched roof above the broad side aisles.
 const windows=[];for(let x=-51;x<62;x+=near?10:15)windows.push({u:x+2,y:20.2,w:4.5,h:5.3,arch:true,mat:'glass'});
 block('masonry',-2,0,130,27,13.5,28,{south:windows,north:windows});
 k.gable('roof',-67,63,28,35,27);
 for(const s of [-1,1])k.gable('roof',-66,63,13.5,20,18,s*23.2);
 // East entrance: five openings at both levels, with a deep walkable arcade.
 const low=[],high=[];for(const z of [-24,-12,0,12,24]){low.push({u:z,y:.6,w:5.3,h:9,mat:'shadow'});high.push({u:z,y:14.3,w:7.0,h:13.8,arch:true});}
 wall('stone',65,.6,31.8,1.1,71.7,0,Math.PI/2,[...low,...high]);
 wall('stone',65,.6,31.8,.9,64,0,Math.PI/2,[...low.map(o=>({...o,w:4.5})),...high.map(o=>({...o,w:6.7,h:13.5,mat:'glass'}))]);
 for(const z of [-32,32])box('stone',68.3,16,z,8.5,31.4,1.2);
 box('stone',68.3,.3,0,9,.6,65);
 box('stone',68.3,12.5,0,9,1.1,65);
 box('stone',68.3,32.5,0,9,1.4,66.0);
 for(let i=0;i<6;i++){
  const z=-30+i*12,positions=(i===0||i===5)?[z]:[z-.9,z+.9];
  for(const v of positions){cyl('stone',72.7,v,.82,.72,1.1,29.8,near?12:7);box('stone',72.7,30.3,v,2.2,1,2.2);box('stone',72.7,.8,v,2,.5,2);}
 }
 k.gable('stone',68.5,73.3,33.2,38.2,37);
 // The balustrade and raised centre carry the named rooftop figures.
 box('stone',68.8,35.3,0,7.8,.7,64.6);
 for(let i=0;i<33;i++)box('stone',72.2,34.3,-31+i*62/32,.35,1.6,.35);
 function figure(x,z,base,height=7,gesture=0){
  box('stone',x,base+.35,z,2.15,.7,2.15);
  for(const s of [-1,1])bar('stone',[x+s*.36,base+.7,z],[x+s*.28,base+2.65,z],.42,.5);
  const robe=new THREE.CylinderGeometry(.62,1.02,3,near?10:6);robe.translate(x,base+3.75,z);k.put(robe,'stone');
  cyl('stone',x,z,.27,.27,base+5.15,base+5.85,near?8:5);
  sphere('stone',x,base+6.25,z,.68);
  for(const s of [-1,1]){bar('stone',[x+s*.55,base+4.8,z],[x+s*1.1,base+4.1+gesture,z],.36);bar('stone',[x+s*1.1,base+4.1+gesture,z],[x+s*1.3,base+3.5+gesture,z+.3],.3);}
  // Crown/head volume completes a seven-metre standing figure including the pedestal.
  sphere('stone',x,base+6.6,z,.4);
 }
 for(let i=0;i<15;i++){
  const z=-30+i*60/14,base=(i===7?41.8:Math.abs(i-7)<=1?38.3:35.6);
  if(base>35.6)box('stone',69.4,(35.6+base)/2,z,3.2,base-35.6,3.2);
  figure(70,z,base,7,i%3===0?.6:0);
 }
 // North loggia: two floors of five real arches, with twin pointed belfries.
 const northHoles=[];for(const x of [-37,-31,-25,-19,-13])for(const y of [.6,12])northHoles.push({u:-x-25,y,w:4.3,h:8.8,arch:true,mat:'shadow'});
 wall('masonry',32,.6,23.5,1.2,-25,-42.2,Math.PI,northHoles);
 box('masonry',-25,11.3,-36.5,32,.7,12);box('masonry',-25,24,-36.5,33,1,12);
 for(const x of [-35.5,-15.5]){
  block('masonry',x,-29.5,5.5,5.5,20,36,{south:[{u:0,y:29,w:2.9,h:5,arch:true}],north:[{u:0,y:29,w:2.9,h:5,arch:true}],east:[{u:0,y:29,w:2.9,h:5,arch:true}],west:[{u:0,y:29,w:2.9,h:5,arch:true}]});
  box('stone',x,36.3,-29.5,6.3,.6,6.3);cyl('roof',x,-29.5,3.2,0,36.6,47,4);
 }
 // Corsini chapel dome and the terracotta cloister roof ranges.
 cyl('masonry',47,40,9,9,13.5,25,near?24:16);k.dome('metal',47,40,9,25,9);
 cyl('masonry',47,40,1.8,1.8,33.8,36,near?12:8);k.dome('metal',47,40,2.1,36,1.8);
 for(const [x0,x1,z,w] of [[-43,28,35,6],[-43,28,68,6],[-43,-35,51,28],[20,28,51,28]])k.gable('roof',x0,x1,13.5,17.1,w,z);
 const model=k.finish();model.userData.features=['five-bay Galilei facade','15 seven-metre saints','north double loggia','twin bell spires','open cloister'];return model;
}
