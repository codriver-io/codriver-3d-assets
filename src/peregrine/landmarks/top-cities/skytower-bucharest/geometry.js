import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './skytower-bucharest-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
 const r=LOCAL_RINGS[0];
 r.forEach((_,i)=>{const f=frame(r,i),count=Math.max(1,Math.ceil(f.l/(near?1.3:2.8))),step=f.l/count;
  patch('frame',f,0,f.l,0,.5);
  for(let row=0;row<(near?37:19);row++){const lo=.5+row*(near?3.6:7.01),hi=Math.min(134,lo+(near?3.6:7.01));if(hi<=lo)continue;
   patch('frame',f,0,f.l,lo,lo+.16);
   for(let j=0;j<count;j++){const a=j*step,c=(j+1)*step;patch('frame',f,a,a+.09,lo+.16,hi);patch((Math.floor(row/(near?5:3))*7+i*3+j)%9<2?'glassLight':'glass',f,a+.09,c,lo+.16,hi);}
  }
  patch('glass',f,0,f.l,133.7,135);patch('frame',f,0,f.l,135,137);
 });
 cap('roof',r,137);cap('frame',r,0,-1);
return finish();
}
