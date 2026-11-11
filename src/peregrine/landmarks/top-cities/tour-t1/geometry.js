import * as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-t1-parts.js';
const outline=simplify(local(FOOTPRINTS[0],SPEC.origin),.3),minZ=Math.min(...outline.map(p=>p[1])),maxZ=Math.max(...outline.map(p=>p[1]));
const t=z=>Math.max(0,Math.min(1,(maxZ-z)/(maxZ-minZ)));
export const roofY=(x,z)=>138+31*Math.pow(t(z),.65);
export const crestY=(x,z)=>145+40*Math.pow(t(z),.55);
function plan(detail){const p=[];for(let i=0;i<outline.length;i++){const a=outline[i],c=outline[(i+1)%outline.length],n=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/(detail==='near'?3.1:6.2)));for(let j=0;j<n;j++)p.push(a.map((v,k)=>v+(c[k]-v)*j/n));}return p;}
export function crownMembers(detail='near'){
 const p=plan(detail),posts=p.map(([x,z],i)=>({id:'post-'+i,a:[x,roofY(x,z)-.15,z],b:[x,crestY(x,z),z]})),ribs=[];
 p.forEach((v,i)=>{const j=(i+1)%p.length;for(const f of[.33,.66,1])ribs.push({id:`rib-${i}-${f}`,a:posts[i].a.map((x,k)=>x+(posts[i].b[k]-x)*f),b:posts[j].a.map((x,k)=>x+(posts[j].b[k]-x)*f),supports:[posts[i].id,posts[j].id]});});return{posts,ribs};
}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),p=plan(detail);
 s.shell(p,roofY,{pitch:near?3.8:7.6,bay:near?3.1:6.2,band:near?.38:.55,mullion:near?.1:.16});
 const{posts,ribs}=crownMembers(detail);for(const m of[...posts,...ribs])b.bar('frame',m.a,m.b,near?.16:.25);
 const model=s.finish();model.userData.identity='folded prow and curving open glass-leaf crown';return model;
}
