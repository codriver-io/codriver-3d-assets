import * as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-d2-parts.js';
export const PLAN=simplify(local(FOOTPRINTS[0],SPEC.origin),.3);if(PLAN.reduce((s,a,i)=>{const c=PLAN[(i+1)%PLAN.length];return s+a[0]*c[1]-c[0]*a[1];},0)<0)PLAN.reverse();
export function scaleAt(y){if(y>156)return .65*Math.sqrt(Math.max(0,1-((y-156)/15)**2));const k=[[0,.92],[14,1],[135,1],[151,.82],[156,.65],[171,0]];for(let i=1;i<k.length;i++)if(y<=k[i][0]){const a=k[i-1],c=k[i],t=(y-a[0])/(c[0]-a[0]);return a[1]+(c[1]-a[1])*t;}return 0;}
const lens=PLAN.map((a,i)=>{const c=PLAN[(i+1)%PLAN.length];return Math.hypot(c[0]-a[0],c[1]-a[1]);}),perimeter=lens.reduce((a,b)=>a+b,0);
function at(t,y,proud=0){let d=((t%1)+1)%1*perimeter;for(let i=0;i<PLAN.length;i++){if(d<=lens[i]||i===PLAN.length-1){const a=PLAN[i],c=PLAN[(i+1)%PLAN.length],q=d/lens[i],x=a[0]+(c[0]-a[0])*q,z=a[1]+(c[1]-a[1])*q,r=Math.hypot(x,z),k=scaleAt(y)+(y<170?proud/r:0);return[x*k,y,z*k];}d-=lens[i];}}
export function lattice(detail='near'){
 const n=detail==='near'?12:8,baseRows=detail==='near'?13:10,heights=[...Array.from({length:baseRows},(_,i)=>171*i/baseRows).filter(y=>y<151),151,156,162,167,170,171],rows=heights.length-1,nodes=[];for(let row=0;row<=rows;row++){const y=heights[row];nodes.push(Array.from({length:n},(_,i)=>at((i+(row%2)*.5)/n,y,.65)));}
 const members=[];for(let row=0;row<rows;row++)for(let i=0;i<n;i++)for(const d of[0,row%2?1:-1]){const j=(i+d+n)%n;members.push({id:`diamond-${row}-${i}-${d}`,a:nodes[row][i],b:nodes[row+1][j]});}return members;
}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b),levels=new Set([0,14,135,151,156]);for(let y=3.8;y<156;y+=near?3.8:7.6)levels.add(y);const ys=[...levels].sort((a,b)=>a-b);
 PLAN.forEach((a,side)=>{const c=PLAN[(side+1)%PLAN.length],len=lens[side],cols=Math.max(1,Math.round(len/(near?2.6:5.2)));const point=(u,y)=>[(a[0]+(c[0]-a[0])*u)*scaleAt(y),y,(a[1]+(c[1]-a[1])*u)*scaleAt(y)];
 const patch=(mat,u0,u1,y0,y1)=>s.quad(mat,point(u0,y0),point(u0,y1),point(u1,y1),point(u1,y0));
 for(let col=0;col<cols;col++){const u0=col/cols,u1=(col+1)/cols,um=Math.min(u1,u0+.09/len);for(let row=0;row<ys.length-1;row++){const y0=ys[row],y1=ys[row+1],band=Math.min(near?.18:.3,(y1-y0)*.25);patch('frame',u0,um,y0,y1);patch('frame',um,u1,y0,y0+band);patch('glass',um,u1,y0+band,y1);}}
 });s.cap(PLAN.map(p=>p.map(v=>v*scaleAt(156))),156,'roof');s.cap(PLAN.map(p=>p.map(v=>v*scaleAt(0))),0,'frame',false);
 for(const m of lattice(detail))b.bar('exoskeleton',m.a,m.b,near?.48:.58);
 const model=s.finish();model.userData.identity='blue rounded tower, continuous white diamond exoskeleton and open egg crown';return model;
}
