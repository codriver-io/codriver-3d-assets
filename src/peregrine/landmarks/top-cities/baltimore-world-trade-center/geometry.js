import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './baltimore-world-trade-center-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const raw=LOCAL_RINGS[0],R=[raw[0],raw[1],raw[2],raw[4],raw[5]],area=R.reduce((s,p,i)=>s+p[0]*R[(i+1)%5][1]-R[(i+1)%5][0]*p[1],0);if(area<0)R.reverse();
for(let i=0;i<5;i++){const a=R[i],c=R[(i+1)%5],L=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/L,uz=(c[1]-a[1])/L,n=[uz,0,-ux],P=(s,y,inset=0)=>[a[0]+ux*s-n[0]*inset,y,a[1]+uz*s-n[2]*inset],patch=(mat,s,t,y0,y1,inset=0)=>face(mat,[P(s,y0,inset),P(t,y0,inset),P(t,y1,inset),P(s,y1,inset)],n);
 function window(s,t,lo,hi,count,depth=.28){const pitch=(t-s)/count,mull=near?.10:.16;for(let j=0;j<count;j++){const v=s+j*pitch;patch('reveal',v,v+mull,lo,hi,depth);patch('glass',v+mull,v+pitch-mull,lo,hi,depth);patch('reveal',v+pitch-mull,v+pitch,lo,hi,depth);}for(const[y,out]of[[lo,[0,1,0]],[hi,[0,-1,0]]])face('reveal',[P(s,y),P(t,y),P(t,y,depth),P(s,y,depth)],out);for(const[x,out]of[[s,[ux,0,uz]],[t,[-ux,0,-uz]]])face('reveal',[P(x,lo),P(x,hi),P(x,hi,depth),P(x,lo,depth)],out);}
 patch('stone',0,2.8,0,123.5);patch('stone',L-2.8,L,0,123.5);patch('stone',2.8,L-2.8,0,.45);window(2.8,L-2.8,.45,10.4,near?8:4,(a[1]+c[1])/2>0?3:.45);patch('stone',2.8,L-2.8,10.4,11.4);
 const dy=(118.8-11.4)/27;for(let j=0;j<27;j++){const lo=11.4+j*dy,hi=lo+2.15;window(2.8,L-2.8,lo,hi,near?8:3);patch('stone',2.8,L-2.8,hi,lo+dy);}patch('stone',2.8,L-2.8,118.8,123.5);
}cap('roof',R,123.5);cap('stone',R,0,-1);return finish();

}
