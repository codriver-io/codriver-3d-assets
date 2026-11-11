import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './bancolombia-medellin-parts.js';
export const BLOCKS=[{x0:-197.6,x1:-8.5,z0:-11.4,z1:21.3,bays:36},{x0:37.2,x1:191.5,z0:-9.1,z1:15.8,bays:30}];
export const LINKS=[32,40];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,bar,poly}=k;
 const pane=(a,b,y0,y1)=>poly('glass',[[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]],[0,1,2,0,2,3]);
 for(const t of BLOCKS){
  const w=t.x1-t.x0,d=t.z1-t.z0,x=(t.x0+t.x1)/2,z=(t.z0+t.z1)/2;
  box('stone',x,.18,z,w,.36,d);
  // Set-back glazed ground floor supports the projecting stone office facade.
  for(const s of [-1,1]){
   const zz=z+s*(d/2-1.7),a=s>0?0:Math.PI;
   wall('stone',w,0,6.2,.75,x,zz-(s>0?.75:-.75),a,Array.from({length:t.bays},(_,i)=>({u:(i-(t.bays-1)/2)*w/t.bays,y:.4,w:w/t.bays-1.0,h:5.4,mat:'glass'})));
  }
  // Continuous tall slot openings reveal the distinctive staggered stone rhythm.
  for(const s of [-1,1]){
   const zz=s>0?t.z1-.8:t.z0+.8,a=s>0?0:Math.PI,holes=[];
   for(let i=0;i<t.bays;i++){
    const u=(i-(t.bays-1)/2)*w/t.bays,slotW=i%5===0?1.2:1.85;
    holes.push({u,y:6.8,w:slotW,h:10.0,mat:'shadow'});
    const y=18+(i%5===1?3.8:0);holes.push({u,y,w:slotW,h:47.8-y,mat:'glass'});
   }
   wall('stone',w,6.2,48.8,.8,x,zz,a,holes);
   // Lower ventilation blades sit inside the actual lower slots, with no facade decal.
   if(near)for(let i=0;i<t.bays;i++)for(let j=0;j<6;j++){
    const xx=x+(i-(t.bays-1)/2)*w/t.bays,yy=7.6+j*1.45;
    box('metal',xx,yy,s>0?t.z1-.3:t.z0+.3,1.72,.09,.23);
   }
  }
  // Floor plates connect the two facades and are the named bearings of both high links.
  for(let floor=1;floor<=12;floor++){const y=floor*4+.1;box('stone',x,y,z,w,.4,d);}
  // Glazed end walls, twelve storeys with deep internal floor shadow and vertical mullions.
  for(const xx of [t.x0,t.x1]){
   const sign=xx===t.x0?-1:1;
   for(let f=0;f<12;f++){
    const y=f*4+.3,a=sign>0?[xx-.65,t.z1]:[xx+.65,t.z0],b=sign>0?[xx-.65,t.z0]:[xx+.65,t.z1];pane(a,b,y,y+3.6);
   }
   for(let j=0;j<=5;j++)bar('trim',[xx,0,t.z0+j*d/5],[xx,48.8,t.z0+j*d/5],.15);
  }
  box('roof',x,48.55,z,w-2,.5,d-2);
  for(const zz of [t.z0+.2,t.z1-.2])box('stone',x,49.05,zz,w,1.5,.45);
  for(const xx of [t.x0+.2,t.x1-.2])box('stone',xx,49.05,z,.45,1.5,d-.9);
 }
 // Mapped small end service projection of the northern block.
 box('stone',194.5,12.0,2.3,6.2,24,18.1);
 // Two stacked glazed links above an empty ground corridor, not a solid connector slab.
 const x0=-9.0,x1=37.7,z0=.8,z1=5.8;
 for(const y of LINKS){
  box('stone',(x0+x1)/2,y+.1,(z0+z1)/2,x1-x0,.4,z1-z0);
  box('stone',(x0+x1)/2,y+4.35,(z0+z1)/2,x1-x0,.35,z1-z0);
  pane([x0,z1],[x1,z1],y+.3,y+4.2);pane([x1,z0],[x0,z0],y+.3,y+4.2);
  const bays=near?10:6;
  for(let i=0;i<=bays;i++)for(const z of [z0,z1])bar('metal',[x0+(x1-x0)*i/bays,y+.18,z],[x0+(x1-x0)*i/bays,y+4.35,z],.13);
  // Slender diagonal bracing is embedded in the floor/roof slabs at both ends.
  if(near)for(const z of [z0,z1])for(let i=0;i<5;i++)bar('trim',[x0+(x1-x0)*i/5,y+.2,z],[x0+(x1-x0)*(i+1)/5,y+4.28,z],.12);
 }
 return k.finish();
}
