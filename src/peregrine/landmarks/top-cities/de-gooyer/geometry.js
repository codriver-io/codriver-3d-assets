import * as THREE from 'three';
import {parts} from './de-gooyer-parts.js';
export function create({detail='near'}={}){
 const p=parts(detail),{near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,skin,box,bar,put}=p;
prism('brick',[[5.488,-5.527],[5.488,5.539],[-5.487,5.532],[-5.488,-5.544]],0,7,{cols:2,rows:2,fraction:.19,sill:.72,roof:'brick'});
 function taper(r0,r1,y0,y1){const A=ellipse(0,0,r0,r0,8),C=ellipse(0,0,r1,r1,8);for(let k=0;k<8;k++){const j=(k+1)%8,a=A[k],b=A[j],c=C[j],d=C[k],out=[b[1]-a[1],0,a[0]-b[0]],pt=(u,v)=>[(a[0]+(b[0]-a[0])*u)*(1-v)+(d[0]+(c[0]-d[0])*u)*v,y0+(y1-y0)*v,(a[1]+(b[1]-a[1])*u)*(1-v)+(d[1]+(c[1]-d[1])*u)*v],patch=(m,s,t,l,h)=>face(m,[pt(s,l),pt(t,l),pt(t,h),pt(s,h)],out);if(k%2===0){patch('wood',0,1,0,1);continue;}const u=.37,v=.63,lo=.5-.55/(y1-y0),hi=.5+.55/(y1-y0),p=.035,q=.12/(y1-y0);patch('wood',0,1,0,lo);patch('wood',0,1,hi,1);patch('wood',0,u,lo,hi);patch('wood',v,1,lo,hi);patch('frame',u,u+p,lo,hi);patch('frame',v-p,v,lo,hi);patch('frame',u+p,v-p,lo,lo+q);patch('frame',u+p,v-p,hi-q,hi);patch('glass',u+p,v-p,lo+q,hi-q);}cap('wood',A,y0,-1);cap('wood',C,y1);}
 taper(5.25,4.35,7,14);taper(4.35,4.25,14,17.5);prism('wood',ellipse(0,0,8.2,8.2,near?16:8),17.5,17.8);taper(4.7,2.8,17.8,27.2);dome('cap',0,0,3.1,3.1,27.2,2.4,near?16:12,near?5:4);
 const count=near?16:8;for(let i=0;i<count;i++){const a=i*2*Math.PI/count,c=(i+1)*2*Math.PI/count,point=(r,y,t=a)=>[r*Math.cos(t),y,r*Math.sin(t)];bar('frame',point(3.98,13.5),point(8.0,17.6),.13,.13);bar('frame',point(8,17.8),point(8,18.9),.1,.1);bar('frame',point(8,18.9),point(8,18.9,c),.1,.1);}
 bar('cap',[0,27.5,2.6],[0,27.5,4.4],.32,.32,0,true);
 for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2,u=[Math.cos(a),Math.sin(a)],n=[-Math.sin(a),Math.cos(a)],point=(r,s=0)=>[u[0]*r+n[0]*s,27.5+u[1]*r+n[1]*s,4.3];bar('iron',point(0),point(13.3),.20,.20);for(const s of[-.9,-.3,.3,.9])bar('sail',point(2.5,s),point(13.3,s),near?.06:.1,near?.06:.1);const N=near?15:9;for(let j=0;j<=N;j++){const r=2.5+(13.3-2.5)*j/N;bar('frame',point(r,-.9),point(r,.9),near?.06:.1,near?.06:.1);}}
 block('wood',0,-7.2,.6,.7,17.8,18.4);for(const x of[-1.8,1.8])bar('frame',[x,27,-2],[0,18.1,-7.2],.14,.14);
 
 return p.finish();
}
