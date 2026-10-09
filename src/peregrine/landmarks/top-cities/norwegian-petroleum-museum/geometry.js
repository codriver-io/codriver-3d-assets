import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { frame, mapped, solid } from './norwegian-petroleum-museum-parts.js';

export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const mat=m=>!near&&m==='joints'?'steel':m;
 const box=(m,p,size)=>b.box(mat(m),frame(...p),size,33*Math.PI/180);
 const bar=(m,a,c,w,d=w)=>b.bar(mat(m),frame(...a),frame(...c),w,d);
 const cyl=(m,u,v,r,y,h,segments=near?48:20)=>{const g=new THREE.CylinderGeometry(r,r,h,segments);g.translate(...frame(u,y+h/2,v));b.put(g,mat(m));};
 const ring=(m,u,v,r,y,t=0.035)=>{const g=new THREE.TorusGeometry(r,t,3,near?64:24);g.rotateX(Math.PI/2);g.translate(...frame(u,y,v));b.put(g,mat(m));};
 // The glazed low storey and flat roof follow the complete mapped main outline.
 const base=mapped(FOOTPRINTS[0]);
 solid(b,'glass',base.map(([u,,v])=>[u,0,v]),base.map(([u,,v])=>[u,4.55,v]),{bottom:true,top:false});
 solid(b,'roof',base.map(([u,,v])=>[u,4.55,v]),base.map(([u,,v])=>[u,4.88,v]),{bottom:false,top:true});
 for(let i=0;i<base.length;i++){
  const a=base[i],c=base[(i+1)%base.length],len=Math.hypot(c[0]-a[0],c[2]-a[2]);if(len<4)continue;
  const n=[(c[2]-a[2])/len,-(c[0]-a[0])/len];
  const pt=(t,y,d=0.08)=>[a[0]+(c[0]-a[0])*t+n[0]*d,y,a[2]+(c[2]-a[2])*t+n[1]*d];
  if(near)for(let j=1;j<len/1.5;j++)bar('steel',pt(j*1.5/len,0.1),pt(j*1.5/len,4.5),0.085);
  for(const y of [0.65,3.55])bar('steel',pt(0,y),pt(1,y),0.1);
 }
 // Inclined silver exhibition shell with an inset roof, between granite end rocks.
 const low=[[-24,4.9,18.9],[28.9,4.9,19.4],[28.9,4.9,-2],[-22,4.9,-16]];
 const high=[[-20.3,11.4,13.6],[25.2,11.4,14.1],[25.2,11.4,-2],[-20.3,11.4,-16]];
 solid(b,'silver',low,high);
 const wings=[
 {lo:[[-34.4,0,8],[-25.9,0,8],[-25.9,0,19.1],[-34.4,0,19.1]],hi:[[-33.8,10,8],[-26.5,10,8],[-26.5,10,16],[-33.8,10,16]]},
 {lo:[[30,0,8.1],[40,0,8.1],[40,0,20.1],[30,0,20.1]],hi:[[31.2,14.2,8.1],[38.9,14.2,8.1],[38.9,14.2,16.8],[31.2,14.2,16.8]]},
 ];
 for(const w of wings){solid(b,'stone',w.lo,w.hi);if(near)for(let i=0;i<4;i++){
  const a=w.lo[i],c=w.lo[(i+1)%4],ta=w.hi[i],tc=w.hi[(i+1)%4],h=ta[1],len=Math.hypot(c[0]-a[0],c[2]-a[2]);
  const n=[(c[2]-a[2])/len,-(c[0]-a[0])/len];
  const pt=(t,y)=>{const f=y/h;return [a[0]+(c[0]-a[0])*t+(ta[0]-a[0]+(tc[0]-c[0]-ta[0]+a[0])*t)*f+n[0]*0.065,y,a[2]+(c[2]-a[2])*t+(ta[2]-a[2]+(tc[2]-c[2]-ta[2]+a[2])*t)*f+n[1]*0.065]};
  for(let y=0.7;y<h;y+=0.75){bar('joints',pt(0,y),pt(1,y),0.027);for(let t=0.1+(Math.round(y/0.75)%2)*0.06;t<1;t+=0.18)bar('joints',pt(t,y-0.68),pt(t,y),0.022);}
 }}
 if(near)for(let y=5.55;y<11.35;y+=0.65){const f=(y-4.9)/6.5;bar('joints',[-24+3.7*f,y,18.9-5.3*f+0.08],[28.9-3.7*f,y,19.4-5.3*f+0.08],0.04);}
 // Three offshore pavilion cylinders, with unequal roof caps and piping.
 const drums=[[-14.25,-39.55,7.35,12,14.5],[5.05,-39.45,7.1,12,15.2],[24.2,-39.05,7.6,12,17.2]];
 for(let j=0;j<drums.length;j++){
  const [u,v,r,top,cap]=drums[j],bottom=5.7;
  if(j===2)cyl('concrete',u,v,5.55,0,5.4);
  else for(const du of [-4.7,4.7])for(const dv of [-4.5,4.5]){
   cyl('concrete',u+du,v+dv,0.58,0,5.4,near?12:8);
   bar('steel',[u+du,0.5,v+dv],[u-du,5.4,v+dv],0.22);
  }
  cyl('roof',u,v,r-0.03,5.35,0.35);
  cyl('silver',u,v,r,bottom-0.05,top-bottom+0.05,near?64:28);
  for(let y=bottom+0.15;y<top;y+=near?0.7:2.1)ring('joints',u,v,r+0.04,y,0.06);
  if(near)for(let i=0;i<32;i++){const a=i*Math.PI/16;bar('joints',[u+Math.cos(a)*(r+0.012),bottom,v+Math.sin(a)*(r+0.012)],[u+Math.cos(a)*(r+0.012),top,v+Math.sin(a)*(r+0.012)],0.04);}
  cyl('roof',u,v,r-0.07,top,0.18);
  ring('steel',u,v,r-0.25,top+0.85,0.045);
  for(let i=0;i<(near?32:12);i++){const a=i*2*Math.PI/(near?32:12);bar('steel',[u+Math.cos(a)*(r-0.25),top+0.08,v+Math.sin(a)*(r-0.25)],[u+Math.cos(a)*(r-0.25),top+0.85,v+Math.sin(a)*(r-0.25)],0.05);}
  box('roof',[u+0.7,(top+cap)/2,v+0.7],[r*1.16,cap-top,r*0.92]);
  if(near)for(let y=top+0.3;y<cap;y+=0.36)box('steel',[u+0.7,y,v-2.83],[r*1.16+0.1,0.08,0.13]);
  const py=Math.min(cap+0.2,17.1);
  bar('steel',[u-4,top+0.05,v+2.8],[u-3,py,v+2.8],0.22);
  bar('steel',[u-3,py,v+2.8],[u+3,py,v+2.8],0.22);
  bar('steel',[u+3,py,v+2.8],[u+3.6,top+0.05,v+2.8],0.22);
 }
 // Glazed links preserve the separate circular silhouettes at both LODs.
 for(const [a,c] of [[[-7.3,8.4,-39.5],[-2,8.4,-39.5]],[[12,8.4,-39.3],[16.8,8.4,-39.3]],[[-14.3,8.4,-32.3],[-14.3,8.4,-21.5]],[[24.2,8.4,-31.6],[24.2,8.4,-11.3]]]){
  const alongU=Math.abs(c[0]-a[0])>Math.abs(c[2]-a[2]),length=Math.hypot(c[0]-a[0],c[2]-a[2]),u=(a[0]+c[0])/2,v=(a[2]+c[2])/2;
  // Horizontal boxes keep vertical glazing upright; a quaternion bar can twist it.
  const link=(material,y,h,width)=>box(material,[u,y,v],alongU?[length,h,width]:[width,h,length]);
  link('light',8.4,4.25,3.5);
  link('roof',10.6,0.25,3.75);
  link('steel',6.2,0.32,3.8);
  if(near){const len=Math.hypot(c[0]-a[0],c[2]-a[2]);for(let t=0;t<=len;t+=1.25)for(const s of [-1,1]){
   const u=a[0]+(c[0]-a[0])*t/len+(c[2]-a[2])/len*s*1.83,v=a[2]+(c[2]-a[2])*t/len-(c[0]-a[0])/len*s*1.83;
   bar('steel',[u,6.2,v],[u,10.65,v],0.1);
  }}
 }
 box('light',[28.9,2,19.77],[1.4,3.4,0.12]);
 box('steel',[28.9,3.8,19.9],[2.3,0.18,1]);
 return b.finish();
}
