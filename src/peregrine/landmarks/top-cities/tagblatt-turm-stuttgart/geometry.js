import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './tagblatt-turm-stuttgart-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const r=LOCAL_RINGS[0];r.forEach((_,i)=>{const f=frame(r,i),n=Math.max(1,Math.round(f.l/(near?2.2:3.3))),step=f.l/n;let base=0;const rr=[[1,3.1],...rows(4.6,56.1,3.35,2.05)];for(const [lo,hi]of rr){patch('stone',f,0,f.l,base,lo);for(let j=0;j<n;j++){const a=j*step,c=(j+1)*step;if(f.l>14&&j>=Math.floor(n*.35)&&j<=Math.floor(n*.65)){if(j===Math.floor(n*.5)){const mid=(a+c)/2;patch('stone',f,a,mid-.36,lo,hi);patch('stone',f,mid+.36,c,lo,hi);patch('stone',f,mid-.36,mid+.36,lo,lo+.4);patch('glass',f,mid-.36,mid+.36,lo+.4,hi-.35);patch('stone',f,mid-.36,mid+.36,hi-.35,hi);}else patch('stone',f,a,c,lo,hi);}else{patch('stone',f,a,a+.16,lo,hi);patch('glass',f,a+.16,c-.16,lo,hi);patch('stone',f,c-.16,c,lo,hi);}}base=hi;}patch('stone',f,0,f.l,base,57);});cap('roof',r,57);cap('stone',r,0,-1);
block(2,-2,7,12,57,61,'stone','roof',[[58,59.6]],near?1.8:3,'glass',.4);
return finish();
}
