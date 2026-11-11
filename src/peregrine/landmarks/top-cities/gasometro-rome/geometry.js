import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './gasometro-rome-parts.js';
export const FRAME={bays:20,radius:31,levels:[.7,17.82,35.64,53.46,71.28,89.1]};
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,bar,box,cyl}=k,{bays:N,radius:R,levels}=FRAME;
 const p=(i,y,r=R)=>[r*Math.sin(i*2*Math.PI/N),y,r*Math.cos(i*2*Math.PI/N)];
 // Annular masonry remains open through the centre; no solid cylinder is present.
 const profile=[[30.6,0],[31.2,0],[31.2,3.2],[30.6,3.2],[30.6,0]];
 k.lathe('base',0,0,profile,near?60:24);
 for(let i=0;i<N;i++){
  const [x,,z]=p(i,0);box('base',x,.35,z,1.1,.7,1.1);
  bar('column',p(i,.2),p(i,89.1),.43,.43);
  for(let j=0;j<levels.length;j++){
   const y=levels[j];
   bar('ring',p(i,y),p(i+1,y),.36,.5);
   if(j>0){
    bar('ring',p(i,y-.95),p(i+1,y-.95),.22,.28);
    if(near)for(let s=0;s<4;s++){
     const a=i+s/4,b=i+(s+1)/4;
     // Fine Warren web terminals are on their named upper/lower ring chords.
     const interp=(t,h)=>new THREE.Vector3(...p(i,h)).lerp(new THREE.Vector3(...p(i+1,h)),t-i).toArray();
     bar('web',interp(a,s%2?y:y-.95),interp(b,s%2?y-.95:y),.11,.11);
    }
   }
   if(j<levels.length-1){
    const top=levels[j+1];
    bar('brace',p(i,y),p(i+1,top),near?.18:.21);
    bar('brace',p(i+1,y),p(i,top),near?.18:.21);
   }
  }
 }
 // Internal access cage attaches to the existing frame at every main ring.
 const gx=29.3,gz=0;
 for(const x of [gx-1.45,gx+1.45])for(const z of [-1.45,1.45]){box('base',x,.2,z,.8,.4,.8);bar('column',[x,.2,z],[x,93.1,z],.22);}
 for(let y=0;y<89;y+=near?3.4:8.5){
  box('ring',gx,y+.11,gz,3.1,.22,3.1);
  if(near){bar('brace',[gx-1.45,y+.2,-1.45],[gx+1.45,Math.min(y+3.4,89.1),-1.45],.09);bar('brace',[gx-1.45,y+.2,1.45],[gx+1.45,Math.min(y+3.4,89.1),1.45],.09);}
 }
 box('ring',gx,91.8,gz,3.2,.28,8);
 for(const x of [gx-1.45,gx+1.45])for(const z of [-3.85,3.85])bar('column',[x,91.8,z],[x,93.1,z],.14);
 // The viewing/maintenance platform's open guard has supported corners and a complete top rail.
 for(const z of [-3.85,3.85])bar('ring',[gx-1.45,93.1,z],[gx+1.45,93.1,z],.12);
 for(const x of [gx-1.45,gx+1.45])bar('ring',[x,93.1,-3.85],[x,93.1,3.85],.12);
 const model=k.finish();model.userData.features=['empty cylindrical steel frame','five X-braced tiers','lattice ring bands','internal access gantry'];return model;
}
