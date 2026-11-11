import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './bmw-headquarters-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
 const n=near?32:20;
 const circle=(x,z,r)=>Array.from({length:n},(_,i)=>[x+r*Math.cos(i*2*Math.PI/n),z+r*Math.sin(i*2*Math.PI/n)]);
 cyl(0,0,6,0,98,'metal');
 for(const x of [-10.7,10.7])for(const z of [-10.7,10.7]){
  const r=circle(x,z,12.2);prism(r,0,3,'metal','metal');
  prism(r,3,47.5,'metal','metal',rows(4,47.4,near?3.7:7.4,near?2.7:5.9),near?2.4:4.5,'glass',.83);
  cyl(x,z,11.9,47.5,51,'belt',n);
  prism(r,51,88.5,'metal','metal',rows(51.7,88.4,near?3.7:7.4,near?2.7:5.9),near?2.4:4.5,'glass',.83);
 }
 for(const x of [-6.5,6.5])for(const z of [-6.5,6.5]){const N=near?20:12,top=[];for(let j=0;j<N;j++){const a=j*2*Math.PI/N,c=(j+1)*2*Math.PI/N,A=[x+4.3*Math.cos(a),97+4*Math.cos(a)*Math.sign(x),z+4.3*Math.sin(a)],C=[x+4.3*Math.cos(c),97+4*Math.cos(c)*Math.sign(x),z+4.3*Math.sin(c)];top.push(A);face('metal',[[A[0],88.5,A[2]],[C[0],88.5,C[2]],C,A],[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);}face('metal',top,[0,1,0]);}
 
return finish();
}
