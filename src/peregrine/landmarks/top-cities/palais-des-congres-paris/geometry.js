import * as THREE from'three';import polygonClipping from'polygon-clipping';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./palais-des-congres-paris-parts.js';
const main=simplify(local(FOOTPRINTS[0],SPEC.origin),.8);export const FRONT=simplify(local(FOOTPRINTS[1],SPEC.origin),.9);
if(FRONT.reduce((s,a,i)=>{const c=FRONT[(i+1)%FRONT.length];return s+a[0]*c[1]-c[0]*a[1];},0)<0)FRONT.reverse();
const N=[-.465,.885],A=[.885,.465],front=p=>p[0]*N[0]+p[1]*N[1]>49,along=p=>p[0]*A[0]+p[1]*A[1],vals=FRONT.filter(front).map(along),lo=Math.min(...vals),hi=Math.max(...vals);
function clip(p,fn,above){const out=[];for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],da=fn(a)*(above?1:-1),dc=fn(c)*(above?1:-1);if(da>=-1e-8)out.push(a);if((da>=0)!==(dc>=0)){const t=da/(da-dc);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 s.shell(main,40,{capTop:false,pitch:near?5:10,bay:near?3.2:6.4,band:near?3.2:6.4,mullion:.16,wall:'panel'});
 s.shell(FRONT,15,{pitch:near?5:7.5,bay:near?3:6,band:.4,mullion:.2});
 const bottom=FRONT.map(p=>front(p)?[p[0]-N[0]*10,p[1]-N[1]*10]:p);
 FRONT.forEach((a,side)=>{const c=FRONT[(side+1)%FRONT.length],ab=bottom[side],cb=bottom[(side+1)%FRONT.length],isFront=front(a)&&front(c),len=Math.hypot(c[0]-a[0],c[1]-a[1]);
 const point=([u,y],inset=0)=>{const t=(y-15)/25,x=ab[0]+u*(cb[0]-ab[0])+(a[0]+u*(c[0]-a[0])-ab[0]-u*(cb[0]-ab[0]))*t,z=ab[1]+u*(cb[1]-ab[1])+(a[1]+u*(c[1]-a[1])-ab[1]-u*(cb[1]-ab[1]))*t;return[x-N[0]*inset,y,z-N[1]*inset];};
 const emit=(mat,p,recess=false)=>{if(p.length<3)return;const face=p.map(v=>point(v,recess?2:0));for(let i=1;i<face.length-1;i++)s.tri(mat,face[0],face[i+1],face[i]);if(recess){const f=p.map(v=>point(v));for(let i=0;i<f.length;i++){const j=(i+1)%f.length;if(Math.abs(p[i][0]-p[j][0])>1e-8)s.quad('panel',f[i],face[i],face[j],f[j]);}}};
 if(!isFront){emit('panel',[[0,15],[1,15],[1,40],[0,40]]);return;}
 const start=(along(a)-lo)/(hi-lo),end=(along(c)-lo)/(hi-lo),us=new Set([0,1]);const cols=Math.max(1,Math.ceil(len/(near?3:6)));for(let i=1;i<cols;i++)us.add(i/cols);for(let k=1;k<6;k++){const u=(k/6-start)/(end-start);if(u>0&&u<1)us.add(u);}const xs=[...us].sort((a,b)=>a-b);
 const peak=u=>{const t=(start+(end-start)*u)*3,f=t-Math.floor(t);return 15+18*(1-Math.abs(2*f-1));};
 for(let col=0;col<xs.length-1;col++){const u0=xs[col],u1=xs[col+1],p=[[u0,15],[u1,15],[u1,40],[u0,40]];emit('panel',clip(p,v=>v[1]-peak(v[0]),true));emit('cut',clip(p,v=>v[1]-peak(v[0]),false),true);}
 });
 const close=p=>[...p,p[0]],roof=polygonClipping.union([close(local(FOOTPRINTS[0],SPEC.origin).slice(0,-1))],[close(local(FOOTPRINTS[1],SPEC.origin).slice(0,-1))]);
 for(const poly of roof){const rings=poly.map(r=>r.slice(0,-1)),all=rings.flat(),ts=THREE.ShapeUtils.triangulateShape(rings[0].map(p=>new THREE.Vector2(...p)),rings.slice(1).map(r=>r.map(p=>new THREE.Vector2(...p))));for(const t of ts)s.tri('roof',...t.slice().reverse().map(i=>[all[i][0],40,all[i][1]]));}
 s.cap(bottom,15,'panel',false);const model=s.finish();model.userData.identity='raked Porte Maillot facade with three deep triangular bays and glass base';return model;
}
