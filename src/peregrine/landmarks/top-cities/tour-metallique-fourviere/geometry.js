import * as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-metallique-fourviere-parts.js';
const plan=local(FOOTPRINTS[0],SPEC.origin),A=plan[0],B=plan[15],d=new THREE.Vector2(B[0]-A[0],B[1]-A[1]).normalize();export const point=(u,y,v)=>[d.x*u-d.y*v,y,d.y*u+d.x*v];export const LEVELS=[[6,9],[15,7.2],[24,5.9],[33,4.9],[42,4.1],[51,3.5],[60,3],[69,2.7],[76,2.5]];const corners=[[1,1],[-1,1],[-1,-1],[1,-1]];export const feet=()=>corners.map(([u,v])=>point(u*9,6,v*9));
export function members(){const legs=[],webs=[],rails=[];for(let j=0;j<LEVELS.length-1;j++){const[y,w]=LEVELS[j],[yy,ww]=LEVELS[j+1];for(let i=0;i<4;i++){const a=corners[i],c=corners[(i+1)%4],p=(q,h,r)=>point(q[0]*r,h,q[1]*r);legs.push([p(a,y,w),p(a,yy,ww)]);webs.push([p(a,y,w),p(c,yy,ww)],[p(c,y,w),p(a,yy,ww)]);rails.push([p(a,y,w),p(c,y,w)]);}}return{legs,webs,rails};}
export function create({detail='near'}={}){const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),m=members(),box=(mat,u,y,v,w,h,depth)=>b.box(mat,point(u,y,v),[w,h,depth],-Math.atan2(d.y,d.x));
 s.shell(simplify(plan,.1),6,{windows:false,wall:'stone'});
 for(const[a,c]of m.legs)b.bar('steel',a,c,near?.48:.6);for(const[a,c]of m.webs)b.bar('lattice',a,c,near?.23:.3);for(const[a,c]of m.rails)b.bar('rail',a,c,.25);
 if(near)for(let j=0;j<LEVELS.length-1;j++){const[y,w]=LEVELS[j],[yy,ww]=LEVELS[j+1];for(const[u,v]of corners)for(let k=0;k<3;k++){const t=k/3,tt=(k+1)/3,r=w+(ww-w)*t,rr=w+(ww-w)*tt;b.bar('lattice',point(u*r-.28,y+(yy-y)*t,v*r),point(u*rr+.28,y+(yy-y)*tt,v*rr),.1);}}
 box('steel',0,76.3,0,8.7,.6,8.7);box('glass',0,77.4,0,7.4,1.6,7.4);box('rail',0,78.6,0,9,.7,9);box('steel',0,80.6,0,4,3.3,4);
 // Upper lattice pedestal and pale broadcast radome,mounted continuously.
 for(const[u,v]of corners){b.bar('lattice',point(u*1.8,81.9,v*1.8),point(u*1.0,85.9,v*1.0),.22);b.bar('lattice',point(u*1.8,81.9,v*1.8),point(-u*1.0,85.9,v*1.0),.14);}box('steel',0,85.6,0,2.8,.6,2.8);
 const g=new THREE.CylinderGeometry(.43,.65,15.1,near?12:6);g.translate(...point(0,93.45,0));b.put(g,'antenna');
 for(const[y,u,r]of[[33,0,1.5],[60,0,1.2],[78.6,1.5,1]]){const w=y>76?4.5:LEVELS.find(p=>p[0]>=y)[1],anchor=point(u,y,w),tip=point(u,y,w+1);b.bar('steel',anchor,tip,.25);const disc=new THREE.CylinderGeometry(r,r,.4,near?16:8);disc.rotateX(Math.PI/2);disc.rotateY(-Math.atan2(d.y,d.x));disc.translate(...point(u,y,w+1));b.put(disc,'antenna');}
 // Grouped pale broadcast panels bear on the existing upper steel pedestal.
 for(const[u,v]of[[1,0],[-1,0],[0,1],[0,-1]])box('antenna',u*2.15,83.5,v*2.15,u?.6:1.2,3.8,u?1.2:.6);
 const root=s.finish();root.userData.identity='four open tapered iron legs, crossed lattice, square observation deck and101 m modern antenna';return root;}
