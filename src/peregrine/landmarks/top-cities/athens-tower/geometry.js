import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './athens-tower-parts.js';
export const MAIN=[[-.96,-22.85],[19.45,-22.85],[19.45,20.07],[-.96,20.07],[-.96,-22.85]];
export const LOWER=[[-11.52,7.26],[-12.06,20.73],[-27.21,20.92],[-41.96,28.28],[-47.91,15.31],[-30.36,7.25],[-11.52,7.26]];
export function facadeEdges(ring,detail='near',main=false){let r=ring.slice(0,-1),area=r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);if(area>0)r.reverse();return r.map((p,i)=>{const q=r[(i+1)%r.length],dx=q[0]-p[0],dz=q[1]-p[1],w=Math.hypot(dx,dz),a=-Math.atan2(dz,dx);return{p,q,w,a,bays:main?(w>30?6:3):Math.max(2,Math.round(w/6.2))};});}
export const MASTS=[{x:5,z:-10,h:9},{x:13,z:-4,h:7},{x:7,z:8,h:5}];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,bar,poly}=k;
 // The two mapped three-storey bases remain independent, preserving the plaza corridor.
 for(const r of LOCAL_RINGS){k.shell('stone',[r],0,11.8,[.6,4.8,8.5],near?5.8:7);k.prism('stone',r,11.55,11.8);k.prism('stone',r,0,.2);}
 function facePanel(m,a,b,y0,y1){poly(m,[[a[0],y0,a[1]],[b[0],y0,b[1]],[b[0],y1,b[1]],[a[0],y1,a[1]]],[0,1,2,0,2,3]);}
 for(const [ring,h,floors,main]of [[MAIN,103,25,true],[LOWER,65,12,false]]){
  const edges=facadeEdges(ring,detail,main),step=(h-13.5)/floors;
  for(const e of edges){
   const nx=Math.sin(e.a),nz=Math.cos(e.a),u=[Math.cos(e.a),-Math.sin(e.a)],mid=[(e.p[0]+e.q[0])/2,(e.p[1]+e.q[1])/2],point=(v,inset)=>[mid[0]+v*u[0]-inset*nx,mid[1]+v*u[1]-inset*nz];
   for(let j=0;j<=e.bays;j++){
    const v=-e.w/2+j*e.w/e.bays+(j===0?.31:j===e.bays?-.31:0),p=point(v,.5);box('stone',p[0],h/2,p[1],.62,h,1.0,e.a);
   }
   for(let j=0;j<e.bays;j++){
    const v=-e.w/2+(j+.5)*e.w/e.bays,bw=e.w/e.bays-.75,A=point(v-bw/2,.78),B=point(v+bw/2,.78),n=detail==='far'?Math.ceil(floors/2):floors,ds=(h-13.5)/n;
    for(let f=0;f<n;f++){const y=11.8+f*ds;facePanel('spandrel',A,B,y,y+Math.min(.95,ds*.28));facePanel('glass',A,B,y+Math.min(.95,ds*.28),y+ds);}
    facePanel('shadow',A,B,h-1.7,h-.5);
    // Fine vertical metal mullions sit safely in front of the physically recessed glazing.
    const pieces=near?4:2;for(let p=1;p<pieces;p++){const q=point(v-bw/2+bw*p/pieces,.12);bar('metal',[q[0],11.7,q[1]],[q[0],h-.2,q[1]],.065);}
   }
  }
  k.prism('stone',ring,h-.55,h);
  // Architectural roof datum is the actual stone cap; no floating duplicate roof surface.
 }
 // Mapped first-floor indoor bridge, with real open space underneath it.
 const x0=-12.15,x1=-.5,z0=11.04,z1=13.47,y=4.2;
 box('stone',(x0+x1)/2,y,(z0+z1)/2,x1-x0,.4,z1-z0);
 box('stone',(x0+x1)/2,7.7,(z0+z1)/2,x1-x0,.4,z1-z0);
 for(const z of [z0,z1])wall('stone',x1-x0,4.4,7.6,.3,(x0+x1)/2,z-(z===z1?.3:-.3),z===z1?0:Math.PI,[{u:0,y:4.55,w:x1-x0-.8,h:2.8,mat:'glass'}]);
 // Actual base floor bearings extend into both towers; bridge triangles are excluded in tests.
 for(const r of LOCAL_RINGS)k.prism('stone',r,4.1,4.4);
 // Three original compact rooftop mast estimates; all feet enter the main mapped shaft roof.
 for(const t of MASTS){
  for(const dx of [-.45,.45])for(const dz of [-.45,.45])bar('metal',[t.x+dx,102.85,t.z+dz],[t.x+dx,103+t.h,t.z+dz],.11);
  const n=near?3:2;for(let i=0;i<n;i++){const lo=103+i*t.h/n,hi=103+(i+1)*t.h/n;
   for(const sign of [-1,1]){bar('antenna',[t.x-.45,lo+.1,t.z+sign*.45],[t.x+.45,hi-.1,t.z+sign*.45],.08);bar('antenna',[t.x+sign*.45,lo+.1,t.z-.45],[t.x+sign*.45,hi-.1,t.z+.45],.08);}
  }
 }
 return k.finish();
}
