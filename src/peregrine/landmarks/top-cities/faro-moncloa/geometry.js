import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './faro-moncloa-parts.js';
export const CROWN=[-0.9786930813216277,3.929794417715607];
export const roofY=(x,z)=>98-.10*(-(x-CROWN[0])*Math.sin(SPEC.rotation)+(z-CROWN[1])*Math.cos(SPEC.rotation));
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,cyl,lathe,box,wall,bar,poly}=k,n=near?48:28,[cx,cz]=CROWN;
 cyl('concrete',0,0,4.5,4.5,0,.35,near?32:20);
 cyl('concrete',0,0,3,3,.35,92,near?32:20);
 // Offset service/lift strip is geographically north of the circular stem.
 const A=-SPEC.rotation,turn=([x,z])=>[x*Math.cos(A)+z*Math.sin(A),-x*Math.sin(A)+z*Math.cos(A)];
 const service=turn([0,3.45]),escape=turn([0,-6.5]);
 const hs=Array.from({length:near?29:15},(_,i)=>({u:0,y:2.5+i*(near?3:5.8),w:1.3,h:near?2.0:3.5,mat:'glass'}));
 for(const c of [service,escape]){k.block('steel',c[0],c[1],2.1,1.8,.4,91.6,{north:hs,south:hs});box('concrete',c[0],.2,c[1],2.5,.4,2.2);}
 // Convex underside transfers the broad eccentric head into its continuous stem.
 lathe('concrete',cx,cz,[[0,89.8],[3,89.8],[13.9,91.5],[14,92],[0,92]],n);
 // Panes fit between full-height mullions. Upper edges follow the actual inclined roof.
 for(let i=0;i<n;i++){
  const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n,da=.075/13.65;
  const point=(t,y)=>[cx+13.65*Math.sin(t),y,cz+13.65*Math.cos(t)];
  const qa=point(a+da,92.05),qb=point(b-da,92.05),ta=point(a+da,0),tb=point(b-da,0);ta[1]=roofY(ta[0],ta[2])-.2;tb[1]=roofY(tb[0],tb[2])-.2;
  poly('glass',[qa,qb,tb,ta],[0,1,2,0,2,3]);
  const foot=point(a,91.95),tip=point(a,0);tip[1]=roofY(tip[0],tip[2])-.14;bar('steel',foot,tip,near?.16:.23);
 }
 const roof=new THREE.CylinderGeometry(14,14,.4,n);const pos=roof.attributes.position;for(let i=0;i<pos.count;i++){const z=pos.getZ(i)+cz;pos.setXYZ(i,pos.getX(i)+cx,pos.getY(i)+roofY(pos.getX(i)+cx,z),z);}roof.computeVertexNormals();k.put(roof,'steel');
 // Aerial mast is rooted above the back of the inclined crown, not floating over its centre.
 const root=roofY(0,0)+.1;
 cyl('steel',0,0,.4,.24,root,110,near?10:6);
 for(const h of [101.5,104.5,107.5]){bar('dark',[-.8,h,0],[.8,h,0],.07);bar('dark',[0,h,-.8],[0,h,.8],.07);}
 const r=k.finish();r.userData.features=['92m observation floor','eccentric28m saucer crown','sloping circular roof','slotted exterior service strip','110m aerial'];return r;
}
