import * as THREE from 'three';import { SPEC, PALETTES } from './config.js';import { kit } from './parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,cyl,put,lathe}=k,n=near?48:24;
 // Adjacent cylindrical panels share boundaries: the arched bay is glazing, not an overlay.
 const shaft=[[4.15,0],[4.15,7.9],[4.15,10.9],[4.15,11.6],[4.15,12.0],[4.15,20.5]];
 function shell(profile,material){
  for(let j=0;j<profile.length-1;j++)for(let i=0;i<n;i++){
   const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n,mid=(a+b)/2;
   const p=([r,y],t)=>[r*Math.sin(t),y,r*Math.cos(t)];
   const y=(profile[j][1]+profile[j+1][1])/2;
   k.poly(material(j,mid,y),[p(profile[j],a),p(profile[j],b),p(profile[j+1],b),p(profile[j+1],a)],[0,1,3,1,2,3]);
  }
 }
 shell(shaft,(j,a,y)=>{const w=Math.abs(a-Math.PI);if(j===1&&w<.25||j===2&&w<.17)return 'glass';return y<12?'blue':'pink';});
 cyl('plaster',0,0,4.3,4.3,0,.6,n);
 for(const y of [11.8,12.2,19.9,20.5])cyl('plaster',0,0,4.38,4.38,y,y+.28,n);
 // Cream pilasters and restrained radial rays retain the pink frieze rhythm.
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4;
  const g=new THREE.BoxGeometry(.34,7.3,.45);g.translate(0,16.2,4.15);g.rotateY(a);put(g,'plaster');
  if(near&&i===4)for(const side of [-1,1]){
   const aa=a+side*.20;const g=new THREE.BoxGeometry(.07,1.5,.12);g.rotateZ(side*.06);g.translate(0,13.7,4.25);g.rotateY(aa);put(g,'plaster');
  }
 }
 // Projecting window balcony and connected corbels; curved bay glazing remains in the shaft.
 box('plaster',0,8.0,-4.55,2.9,.45,1.5);
 for(const x of [-.95,.95])box('plaster',x,7.55,-4.2,.4,.7,.65);
 for(const x of [-1.25,-.75,-.25,.25,.75,1.25])box('plaster',x,8.5,-5.12,.15,.65,.18);
 box('plaster',0,8.88,-5.12,2.8,.17,.28);
 for(const x of [-.9,0,.9])box('plaster',x,9.5,-4.2,.12,3.0,.30);
 const arch=new THREE.TorusGeometry(1.0,.11,3,near?16:8,Math.PI);arch.rotateY(Math.PI);arch.translate(0,10.8,-4.18);put(arch,'plaster');
 // The sculpture is an original low-detail reclining human relief, connected to the drum.
 const ell=(x,y,z,rx,ry,rz)=>{const g=new THREE.SphereGeometry(1,near?12:8,near?8:5);g.scale(rx,ry,rz);g.translate(x,y,z);put(g,'plaster');};
 ell(0,12.7,-4.1,1.4,.48,.5);ell(-1.0,13.2,-4.14,.36,.42,.37);k.b.bar('plaster',[-.6,12.8,-4.2],[.7,13.45,-4.1],.28,.3);k.b.bar('plaster',[.5,12.55,-4.1],[1.8,12.2,-3.9],.4,.4);
 // Four large arch-like blue glass dome bays between cream ribs.
 const dome=[[4.45,20.78],[4.4,21.5],[4.2,23.0],[3.7,25],[2.85,26.7],[1.6,28.1],[.8,28.5],[0,28.5]];
 const rows=[20.78,21.5,22.3,23.2,24.1,24.8,25.4,26.0,26.6,27.1,27.45,27.7,28.1,28.5];
 const radius=y=>{let i=dome.findIndex(p=>p[1]>=y);if(i<=0)return dome[0][0];const a=dome[i-1],b=dome[i];return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]);};
 const half=y=>y<=24.8?.53:Math.max(.015,.53*Math.sqrt(Math.max(0,1-((y-24.8)/2.9)**2)));
 const frac=near?[-1,-.75,-.5,-.25,0,.25,.5,.75,1]:[-1,-.5,0,.5,1];
 for(let q=0;q<4;q++)for(let j=0;j<rows.length-1;j++){
  const y0=rows[j],y1=rows[j+1],a0=[-Math.PI/4,...frac.map(f=>f*half(y0)),Math.PI/4],a1=[-Math.PI/4,...frac.map(f=>f*half(y1)),Math.PI/4];
  const p=(y,a)=>[radius(y)*Math.sin(q*Math.PI/2+a),y,radius(y)*Math.cos(q*Math.PI/2+a)];
  for(let i=0;i<a0.length-1;i++){
   const mat=i>0&&i<a0.length-2&&y0>=21.5&&y1<=27.7?'glass':'plaster';
   k.poly(mat,[p(y0,a0[i]),p(y0,a0[i+1]),p(y1,a1[i+1]),p(y1,a1[i])],[0,1,3,1,2,3]);
  }
 }
 // The lower lantern foot ring closes the dome top; no duplicate internal cap.
 // Open lower and upper lanterns, with continuous foot/head rings and attached slender shafts.
 const lantern=(r,y0,y1,count)=>{
  cyl('gold',0,0,r+.18,r+.18,y0,y0+.25,near?24:16);
  for(let i=0;i<count;i++){const a=i*2*Math.PI/count;cyl('plaster',r*Math.sin(a),r*Math.cos(a),.12,.12,y0+.2,y1,near?8:5);}
  cyl('gold',0,0,r+.18,r+.18,y1,y1+.25,near?24:16);
 };
 lantern(1.27,28.5,31.0,10);
 lathe('roof',0,0,[[0,31.25],[1.45,31.25],[1.2,31.8],[.7,32.2],[0,32.2]],near?24:16);
 lantern(.73,32.2,34.0,8);
 lathe('plaster',0,0,[[0,34.25],[.95,34.25],[.85,34.7],[.35,35.0],[0,35.0]],near?20:12);
 cyl('gold',0,0,.07,.07,35,38,6);
 const crest=new THREE.TorusGeometry(.5,.06,4,near?20:12);crest.translate(0,36.1,0);put(crest,'gold');
 return k.finish();
}
