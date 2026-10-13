import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { BODY, CORNERS } from './cec-palace-plan.js';
const ROT=SPEC.rotation*Math.PI/180;
export const plan=(x,y,z)=>[x*Math.cos(ROT)+z*Math.sin(ROT),y,-x*Math.sin(ROT)+z*Math.cos(ROT)];
export const unplan=(x,z)=>[x*Math.cos(ROT)-z*Math.sin(ROT),x*Math.sin(ROT)+z*Math.cos(ROT)];
export function create({detail='near'}={}) {
 const near=detail==='near',N=near?24:12,b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,mat,x=0,y=0,z=0,a=0)=>{
  g.rotateY(a);g.translate(x,y,z);
  // Omit buried downward roof faces; these are internal contact surfaces.
  if(mat==='roof'||mat==='glass') {
   const p=g.attributes.position,idx=g.index?.array??Array.from({length:p.count},(_,i)=>i),keep=[];
   for(let i=0;i<idx.length;i+=3){const [u,v,w]=[idx[i],idx[i+1],idx[i+2]];
    const y0=p.getY(u),flat=Math.abs(p.getY(v)-y0)<1e-5&&Math.abs(p.getY(w)-y0)<1e-5;
    const ny=(p.getZ(v)-p.getZ(u))*(p.getX(w)-p.getX(u))-(p.getX(v)-p.getX(u))*(p.getZ(w)-p.getZ(u));
    if(!(flat&&ny<0&&y0>17))keep.push(u,v,w);
   }g.setIndex(keep);
  }
  g.rotateY(ROT);b.put(g,mat);
 };
 const box=(mat,x,y,z,w,h,d,a=0)=>put(new THREE.BoxGeometry(w,h,d),mat,x,y,z,a);
 const bar=(mat,a,c,w,d=w)=>b.bar(mat,plan(...a),plan(...c),w,d);
 const profile=(mat,x,z,points,n=N)=>put(new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),n),mat,x,0,z);
 const sphere=(mat,x,y,z,r,sx=1,sy=1,sz=1)=>{const g=new THREE.SphereGeometry(r,near?10:6,near?7:4);g.scale(sx,sy,sz);put(g,mat,x,y,z);};
 function prism(points,y,h,mat='stone') {
  const shape=new THREE.Shape(points.map(([x,z])=>new THREE.Vector2(x,-z)));
  const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);put(g,mat,0,y,0);
 }
 function panel(shape,mat,x,y,z,depth=.5,a=0) {
  if(!near&&depth===.75) {
   const g=new THREE.ShapeGeometry(shape),idx=Array.from(g.index.array);
   for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
   g.setIndex(idx);g.computeVertexNormals();put(g,mat,x,y,z,a);
  }else put(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?12:5}),mat,x,y,z,a);
 }
 function rect(w,h) {return new THREE.Shape([new THREE.Vector2(-w/2,-h/2),new THREE.Vector2(w/2,-h/2),new THREE.Vector2(w/2,h/2),new THREE.Vector2(-w/2,h/2)]);}
 function arch(radius,thick,y,z,depth) {
  const s=new THREE.Shape();s.moveTo(-radius-thick,y);s.absarc(0,y,radius+thick,Math.PI,0,true);s.lineTo(radius,y);s.absarc(0,y,radius,0,Math.PI,false);s.closePath();panel(s,'stone',-.7,0,z,depth);
 }
 function pediment(x,z,width,y,top,depth,a=0) {
  const s=new THREE.Shape([new THREE.Vector2(-width/2,y),new THREE.Vector2(width/2,y),new THREE.Vector2(0,top)]);panel(s,'stone',x,0,z,depth,a);
  const at=(u,v)=>[x+u*Math.cos(a),v,z-u*Math.sin(a)];
  if(near){bar('stone',at(-width/2,y+.15),at(0,top+.15),.28,.35);bar('stone',at(0,top+.15),at(width/2,y+.15),.28,.35);}
 }
 // Closed masonry shell with real punched window recesses, in both LODs.
 prism(BODY,0,.9);prism(BODY,17.1,.4);
 for(let i=0;i<BODY.length;i++) {
  const p=BODY[i],q=BODY[(i+1)%BODY.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),a=Math.atan2(-dz,dx);
  const at=(s,out,y)=>[p[0]+s*dx/L+out*dz/L,y,p[1]+s*dz/L-out*dx/L];
  const shape=new THREE.Shape([new THREE.Vector2(0,.85),new THREE.Vector2(L,.85),new THREE.Vector2(L,17.2),new THREE.Vector2(0,17.2)]);
  const central=p[1]>18&&q[1]>18&&p[0]>0&&q[0]<0;
  const count=central?0:L>5?Math.floor(L/3.8):0;
  if(central)for(const [x,y,w,h] of [[-4.6,13,2.25,5.2],[-.7,13,2.25,5.2],[3.2,13,2.25,5.2],[-.7,4.2,3.9,5.6]]){
   const u=p[0]-x;shape.holes.push(new THREE.Path([new THREE.Vector2(u-w/2,y-h/2),new THREE.Vector2(u-w/2,y+h/2),new THREE.Vector2(u+w/2,y+h/2),new THREE.Vector2(u+w/2,y-h/2)]));
  }
  for(let j=0;j<count;j++)for(const [y,h] of [[5.1,3.5],[12.4,4.6]]) {
   const u=(j+.5)*L/count,w=1.65;
   shape.holes.push(new THREE.Path([new THREE.Vector2(u-w/2,y-h/2),new THREE.Vector2(u-w/2,y+h/2),new THREE.Vector2(u+w/2,y+h/2),new THREE.Vector2(u+w/2,y-h/2)]));
   // Shape +Z points inward; dark panels close the holes behind the facade.
   panel(rect(w+.1,h+.1),'window',...at(u,-.48,y),.10,a);
   if(near) {
    for(const du of [-.97,.97])box('stone',...at(u+du,.12,y),.22,h+.5,.4,a);
    for(const yy of [y-h/2-.2,y+h/2+.2])box('stone',...at(u,.12,yy),2.25,.25,.5,a);
    box('wood',...at(u,-.2,y),.08,h,.1,a);box('wood',...at(u,-.2,y+.6),w,.09,.1,a);
    if(y>10){const v=at(u,.25,0);pediment(v[0],v[2],2.4,y+h/2+.5,y+h/2+1,.3,a);}
   }
  }
  panel(shape,'stone',p[0],0,p[1],.75,a);
  for(const [y,h,out] of [[1.1,.35,.10],[7.6,.45,.15],[16.6,.45,.18],[17.3,.5,.32]])box('stone',...at(L/2,out,y),L,h,.5,a);
  if(near&&L>5) {
   for(let u=.4;u<L-.1;u+=.55)box('stone',...at(u,.30,16.9),.22,.32,.5,a);
   for(let j=0;count>0&&j<=count;j++)box('stone',...at(j*L/count,.05,12),.55,8.5,.34,a);
   for(let y=2;y<7;y+=.65)box('stone',...at(L/2,.045,y),L,.055,.08,a);
  }
 }
 // Hipped metal roofs connecting the corner pavilions.
 for(const [x,z,w,d] of [[0,15,41,7],[0,-15,41,7],[-25,0,7,21],[25,0,7,21]]) {
  const s=new THREE.Shape([new THREE.Vector2(-w/2,17.8),new THREE.Vector2(w/2,17.8),new THREE.Vector2(w/2-1.3,20),new THREE.Vector2(-w/2+1.3,20)]);panel(s,'roof',x,0,z-d/2,d);
 }
 // Central square drum and tall ribbed glass-and-metal dome.
 box('stone',-1.35,21.1,.1,18,7.2,18);
 for(const y of [23.5,24.5])box('stone',-1.35,y,.1,18.6,.6,18.6);
 const dome=[[8.5,24.8],[8.5,25.4],[8.1,27.5],[7.25,30],[5.8,32.2],[3.5,34.1],[1.75,34.8]];
 profile('glass',-1.35,.1,dome);
 for(let i=0;i<(near?24:6);i++) {
  const a=i*Math.PI*2/(near?24:6);
  for(let j=1;j<dome.length;j++) {const [r,y]=dome[j-1],[s,v]=dome[j];bar('roof',[-1.35+r*Math.sin(a),y,.1+r*Math.cos(a)],[-1.35+s*Math.sin(a),v,.1+s*Math.cos(a)],near?.15:.24);}
 }
 profile('roof',-1.35,.1,[[8.55,24.9],[8.65,25.15],[8.55,25.4]],N);
 profile('stone',-1.35,.1,[[0,34.6],[1.9,34.6],[2.05,35],[1.55,35.3],[1.55,36.9],[2,37.1],[1.7,37.5],[0,37.5]]);
 for(let i=0;i<(near?8:4);i++) {const a=i*Math.PI*2/(near?8:4);sphere('stone',-1.35+1.6*Math.sin(a),35.3,.1+1.6*Math.cos(a),.35,1,2,1);}
 profile('roof',-1.35,.1,[[1.65,37.45],[1.45,37.85],[.6,38.4],[0,38.55]]);
 profile('stone',-1.35,.1,[[0,38.3],[.35,38.3],[.4,38.65],[.13,38.9],[.07,40],[0,40]],near?12:6);
 // Four square corner pavilions with gables, ribbed Renaissance caps and lanterns.
 for(const [x,z] of CORNERS) {
  box('stone',x,19.3,z,8.4,3.5,8.4);box('stone',x,21.3,z,8.7,.55,8.7);box('stone',x,22,z,8.5,.55,8.5);
  const cap=[[4.1,22.25],[4.1,22.6],[3.95,24.1],[3.3,26],[2.05,27.3],[1.1,27.7]];profile('roof',x,z,cap,near?24:12);
  for(let i=0;i<(near?12:6);i++) {
   const a=i*Math.PI*2/(near?12:6);
   for(let j=1;j<cap.length;j++) {const [r,y]=cap[j-1],[s,v]=cap[j];bar('stone',[x+r*Math.sin(a),y,z+r*Math.cos(a)],[x+s*Math.sin(a),v,z+s*Math.cos(a)],near?.10:.15);}
  }
  profile('stone',x,z,[[0,27.5],[1.2,27.5],[1.4,28],[.65,28.4],[.7,29.2],[1.05,29.45],[.55,29.8],[.45,30.5],[.1,30.9],[0,30.9]],near?12:6);
  sphere('stone',x,30.2,z,.45,1,1.5,1);
  profile('stone',x,z,[[0,30.7],[.35,30.7],[.5,31.05],[.22,31.4],[.05,32.5],[0,32.5]],near?12:6);
  for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]) {
   const fx=x+4.3*Math.sin(a),fz=z+4.3*Math.cos(a);pediment(fx,fz,8.2,20.6,23,.3,a);
   if(near) {sphere('stone',fx,19.4,fz,.55,1,1.3,.35);for(const dx of [-3.45,3.45]) {const xx=fx+dx*Math.cos(a),zz=fz-dx*Math.sin(a);box('stone',xx,12.2,zz,.55,8.2,.5,a);box('stone',xx,16.2,zz,1,.45,.65,a);}}
  }
 }
 // Open entrance portico: four composite shafts carry a monumental arch.
 box('stone',-.7,.7,21.1,16.4,1.4,5.5);
 for(let i=0;i<7;i++)box('stone',-.7,.1+i*.1,23.85-i*.33,12.7,.2+i*.2,.38);
 for(const x of [-8.1,-6.7,5.3,6.7]) {
  box('stone',x,2.1,22.3,1.45,1.4,1.6);
  profile('stone',x,22.3,[[0,2.7],[.8,2.7],[.82,3.1],[.64,3.45],[.68,3.6],[.59,19.2],[.72,19.45],[.86,20],[0,20]],near?12:6);
  box('stone',x,20.1,22.3,1.7,.45,1.8);
  if(near)for(let i=0;i<8;i++) {const a=i*Math.PI*2/8;sphere('stone',x+.65*Math.sin(a),19.75,22.3+.65*Math.cos(a),.17,1,2,1);}
 }
 arch(6,2,20.25,21.25,2.35);arch(7.7,.45,20.25,23.7,.3);arch(6.2,.28,20.25,23.75,.25);
 const tym=new THREE.Shape();tym.moveTo(-6,20.25);tym.absarc(0,20.25,6,Math.PI,0,true);tym.closePath();panel(tym,'stone',-.7,0,19.9,.4);
 put(new THREE.CircleGeometry(.62,near?20:12),'glow',-.7,23,20.42);
 put(new THREE.TorusGeometry(.77,.14,near?6:4,near?20:12),'stone',-.7,23,20.43);
 if(near)for(const x of [-3.8,-2.6,1.2,2.4]) {
  sphere('stone',x,22.5,20.45,.25,1,1.15,.5);sphere('stone',x,21.85,20.43,.4,.85,1.25,.5);
  for(const sg of [-1,1])bar('stone',[x+sg*.1,21.5,20.4],[x+sg*.35,20.5,20.4],.2);
 }
 // Oak entry and tall transom panels recessed behind the open columns.
 box('wood',-.7,4.2,19.05,3.9,5.6,.3);
 for(const x of [-4.6,-.7,3.2]) {
  box('window',x,13,19.05,2.25,5.2,.3);
  for(const dx of [-1.3,1.3])box('stone',x+dx,12.95,19.35,.25,5.6,.5);
  for(const y of [10.1,15.8])box('stone',x,y,19.4,2.9,.3,.55);
  if(near)box('wood',x,13,19.3,.09,5.2,.15);
 }
 box('stone',-.7,8.3,19.6,12.6,.65,1.8);
 for(const x of [-6.6,5.2])box('stone',x,12.8,19.8,.8,8.5,1);
 // Low glazed skylights alongside the central drum, from mapped roof parts.
 for(const x of [-14,11.5]) {
  box('stone',x,19.5,.1,7,4,14);
  const s=new THREE.Shape();s.moveTo(-3.5,21.5);s.quadraticCurveTo(0,24.5,3.5,21.5);s.closePath();panel(s,'glass',x,0,-6.9,14);

 }
 return b.finish();
}
