import * as THREE from 'three';
import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-total-coupole-parts.js';
const A=26*Math.PI/180,C=Math.cos(A),S=Math.sin(A);
const uv=simplify(local(FOOTPRINTS[0],SPEC.origin),.35).map(([x,z])=>[x*C+z*S,-x*S+z*C]);
function clip(p,axis,k,above){const out=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=(a[axis]-k)*(above?1:-1),db=(b[axis]-k)*(above?1:-1);if(da>=-1e-7)out.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}return out;}
function area(u0,u1,v0,v1){let p=uv;for(const[axis,k,above]of[[0,u0,true],[0,u1,false],[1,v0,true],[1,v1,false]])p=clip(p,axis,k,above);return p.map(([u,v])=>[u*C-v*S,u*S+v*C]);}
// The mapped outline supplies every corner; partition planes separate the
// three upper shafts from their two lower entrance volumes.
export const SHAFTS=[
 {name:'west shaft',height:165,ring:area(-100,-28,-100,17.5)},
 {name:'central shaft',height:187,ring:area(-28,5.4,-100,17.5)},
 {name:'east shaft',height:175,ring:area(5.4,33,-100,19.1)},
 {name:'west entrance hall',height:65,ring:area(-100,5.4,17.5,100)},
 {name:'east entrance hall',height:75,ring:area(5.4,33,19.1,100)},
 {name:'east low service volume',height:28,ring:area(33,100,-100,100)},
].filter(x=>x.ring.length>=3);
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 for(const shaft of SHAFTS)s.shell(shaft.ring,shaft.height,{edgeBottom:(a,c)=>{
  const m=[(a[0]+c[0])/2,(a[1]+c[1])/2];let h=0;
  for(const other of SHAFTS){if(other===shaft)continue;for(let i=0;i<other.ring.length;i++){
   const p=other.ring[i],q=other.ring[(i+1)%other.ring.length],dx=q[0]-p[0],dz=q[1]-p[1],d=dx*dx+dz*dz;if(d<1e-8)continue;
   const t=((m[0]-p[0])*dx+(m[1]-p[1])*dz)/d;
   if(t>=0&&t<=1&&Math.hypot(m[0]-p[0]-t*dx,m[1]-p[1]-t*dz)<.015)h=Math.max(h,other.height);
  }}return h;
 },pitch:near?3.8:7.6,bay:near?3.2:6.4,band:near?.23:.38,mullion:near?.1:.16});
 const model=s.finish();model.userData.identity='1985 polygonal organ-pipe glass shafts with lower stepped halls';return model;
}
