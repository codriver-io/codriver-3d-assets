import * as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-carpe-diem-parts.js';
export const PLAN=simplify(local(FOOTPRINTS[0],SPEC.origin),.35);
if(PLAN.reduce((s,a,i)=>{const b=PLAN[(i+1)%PLAN.length];return s+a[0]*b[1]-b[0]*a[1];},0)<0)PLAN.reverse();
const minX=Math.min(...PLAN.map(p=>p[0])),maxX=Math.max(...PLAN.map(p=>p[0]));export const roofY=(x,z)=>162-6*(x-minX)/(maxX-minX);
export const FOLDS=[[8,0],[75,1],[120,0],[162,1]];
export function foldU(y){const i=Math.max(1,FOLDS.findIndex(v=>v[0]>=y));const a=FOLDS[i-1],c=FOLDS[i];return a[1]+(c[1]-a[1])*(y-a[0])/(c[0]-a[0]);}
function clip(p,fn,above){const out=[];for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],da=fn(a)*(above?1:-1),dc=fn(c)*(above?1:-1);if(da>=-1e-8)out.push(a);if((da>=0)!==(dc>=0)){const t=da/(da-dc);out.push(a.map((v,k)=>v+t*(c[k]-v)));}}return out;}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),levels=new Set([0,8,75,120,162]);for(let y=8;y<162;y+=near?3.9:7.8)levels.add(y);const ys=[...levels].sort((a,b)=>a-b);
 PLAN.forEach((a,side)=>{const c=PLAN[(side+1)%PLAN.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),cols=Math.max(1,Math.round(len/(near?2.5:5))),point=([u,y])=>[a[0]+u*(c[0]-a[0]),y,a[1]+u*(c[1]-a[1])];
 function patch(mat,u0,u1,y0,y1){let p=[[u0,y0],[u1,y0],[u1,y1],[u0,y1]];p=clip(p,v=>roofY(...[point(v)[0],point(v)[2]])-v[1],true);
 const emit=(mat,p)=>{for(let i=1;i<p.length-1;i++)s.tri(mat,point(p[0]),point(p[i+1]),point(p[i]));};
 if(mat!=='glass'||len>40||y1<8){emit(mat,p);return;}
 const d=v=>v[0]-foldU(v[1]),w=.18/len;
 emit('glassPale',clip(p,v=>d(v)+w,false));emit('fold',clip(clip(p,v=>d(v)+w,true),v=>d(v)-w,false));emit('glass',clip(p,v=>d(v)-w,true));
 }
 for(let col=0;col<cols;col++){const u0=col/cols,u1=(col+1)/cols,um=u0+.10/len;patch('frame',u0,um,0,162);for(let row=0;row<ys.length-1;row++){const y0=ys[row],y1=ys[row+1],band=near?.22:.34;patch('frame',um,u1,y0,Math.min(y1,y0+band));patch('glass',um,u1,y0+band,y1);}}
 });s.cap(PLAN,roofY);s.cap(PLAN,0,'frame',false);const model=s.finish();model.userData.identity='alternating triangular blue-glass facets and pale zigzag fold';return model;
}
