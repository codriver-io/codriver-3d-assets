import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

export const local=([lng,lat])=>[(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),(SPEC.origin[1]-lat)*111320];
// Photographic shell fit, distinct from the complete provider replacement ring.
// Shorter side-wing transitions keep the north glazing dominant in entrance views.
export const OUTLINE=[[-57,3],[-43,-36],[0,-39.86],[58,12],[52,32],[6,23],[-54,19]];
export const ROOF_Y=z=>23-.07*(z-OUTLINE[2][1]);
export const BOTTOM_Y=[6.2,10,10,6.4,7,8.3,6.2];
export const LOWER_OUTLINE=OUTLINE.map(([x,z],i)=>[i===1?x+2:i===2?x-1.5:x*.93,z*.93]);
export const CORES=[
 {name:'northwest',x:-37,z:-24,spread:5.5,angle:.12,top:9.6},
 {name:'east',x:43,z:10,spread:6,angle:1.9,top:8.7},
 {name:'southwest',x:-40,z:13,spread:5.2,angle:1.45,top:7.7},
];
export const LOBBY=[[-51,10],[-20,-9],[20,-3],[48,17],[8,19],[-49,17]];
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),soups=new Map();
 const v=p=>new THREE.Vector3(...p),mix=(a,c,t)=>a.map((n,i)=>n+(c[i]-n)*t);
 function tri(m,a,c,d,out){
  const normal=v(c).sub(v(a)).cross(v(d).sub(v(a)));if(normal.lengthSq()<1e-12)return;
  if(normal.dot(v(out).sub(v(a)))<0)[c,d]=[d,c];
  if(!near&&m==='joint')m='white';
  if(!soups.has(m))soups.set(m,[]);soups.get(m).push(...a,...c,...d);
 }
 const quad=(m,a,c,d,e,out)=>{tri(m,a,c,d,out);tri(m,a,d,e,out);};
 function lid(ring,m,up=true,holes=[]){
  const all=[ring,...holes].flat();
  for(const ids of THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(p[0],p[2])),holes.map(r=>r.map(p=>new THREE.Vector2(p[0],p[2])))))tri(m,...ids.map(i=>all[i]),[0,up?1000:-1000,0]);
 }
 function loft(lo,hi,m){
  lid(lo,m,false);lid(hi,m);
  const center=lo.reduce((s,p)=>s.map((x,i)=>x+p[i]/lo.length),[0,0,0]);
  for(let i=0;i<lo.length;i++){const j=(i+1)%lo.length,out=mix(center,mix(lo[i],lo[j],.5),3);quad(m,lo[i],lo[j],hi[j],hi[i],out);}
 }
 const upper=OUTLINE.map(([x,z])=>[x,ROOF_Y(z),z]);
 const lower=LOWER_OUTLINE.map(([x,z],i)=>[x,BOTTOM_Y[i],z]);
 // Partition glazing into separate panes and mullions, with no stacked faces.
 function glazing(a,c,d,e,bays,rows,out,trusses=false){
  const point=(s,t)=>mix(mix(a,c,s),mix(e,d,s),t);
  for(let row=0;row<rows;row++)for(let i=0;i<bays;i++){
   const t0=row/rows,t1=(row+1)/rows,s0=i/bays,s1=(i+1)/bays,w=.065/bays,h=.055/rows;
   quad('frame',point(s0,t0),point(s0+w,t0),point(s0+w,t1),point(s0,t1),out);
   quad('frame',point(s0+w,t0),point(s1,t0),point(s1,t0+h),point(s0+w,t0+h),out);
   let panes=[[[s0+w,t0+h],[s1,t0+h],[s1,t1],[s0+w,t1]]];
   // Broad diagonal steel chords partition the glass, keeping the characteristic
   // V trusses visible without covering a second coplanar material.
   const clip=(poly,f)=>{const result=[];for(let k=0;k<poly.length;k++){const a=poly[k],c=poly[(k+1)%poly.length],fa=f(a),fc=f(c);if(fa>=0)result.push(a);if((fa>=0)!==(fc>=0))result.push(mix(a,c,fa/(fa-fc)));}return result;};
   const fill=(poly,m)=>{for(let k=1;k<poly.length-1;k++)tri(m,point(...poly[0]),point(...poly[k]),point(...poly[k+1]),out);};
   if(trusses)for(let k=0;k<3;k++)for(const side of [-1,1]){
    const base=(k+.5)/3,slope=side/6,width=.006;
    const f=p=>p[0]-base-slope*p[1],next=[];
    for(const poly of panes){fill(clip(clip(poly,p=>f(p)+width),p=>width-f(p)),'frame');for(const remain of [clip(poly,p=>-width-f(p)),clip(poly,p=>f(p)-width)])if(remain.length>2)next.push(remain);}panes=next;
   }
   for(const poly of panes)fill(poly,'glow');
  }
 }
 for(let i=0;i<OUTLINE.length;i++){
  const j=(i+1)%OUTLINE.length,out=[(OUTLINE[i][0]+OUTLINE[j][0])*2,15,(OUTLINE[i][1]+OUTLINE[j][1])*2];
  if(i===1){glazing(lower[i],lower[j],upper[j],upper[i],near?18:10,near?4:2,out,true);continue;}
  // Real panel partitions instead of coplanar seam overlays.
  const length=v(upper[j]).distanceTo(v(upper[i])),cols=near?Math.ceil(length/1.8):1,rows=near?6:1;
  const point=(s,t)=>mix(mix(lower[i],lower[j],s),mix(upper[i],upper[j],s),t);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
   const s=c/cols,t=r/rows,s1=(c+1)/cols,t1=(r+1)/rows,w=near?.012/cols:0,h=near?.01/rows:0;
   if(near){quad('joint',point(s,t),point(s+w,t),point(s+w,t1),point(s,t1),out);quad('joint',point(s+w,t),point(s1,t),point(s1,t+h),point(s+w,t+h),out);}
   quad('white',point(s+w,t+h),point(s1,t+h),point(s1,t1),point(s+w,t1),out);
  }
 }
 lid(lower,'soffit',false);
 // True recessed terrace, with floor and inner reveals.
 const terrace=[[12,7],[35,8],[47,18],[12,17]].map(([x,z])=>[x,ROOF_Y(z),z]);
 lid(upper,'roof',true,[terrace]);
 const floor=terrace.map(([x,y,z])=>[x,y-1.3,z]);lid(floor,'soffit');
 for(let i=0;i<terrace.length;i++){const j=(i+1)%terrace.length;quad('white',terrace[i],terrace[j],floor[j],floor[i],[26,20,12]);}
 // Three bifurcating cores. Horizontal terminal sections sit at grade and
 // penetrate the monolith's underside; no flat-map floating truncations.
 for(const core of CORES){
  const dx=Math.cos(core.angle),dz=Math.sin(core.angle),px=-dz,pz=dx;
  const ring=(x,z,y,w,d)=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,t])=>[x+dx*u*w/2+px*t*d/2,y,z+dz*u*w/2+pz*t*d/2]);
  for(const side of [-1,1])loft(ring(core.x+dx*side*1.15,core.z+dz*side*1.15,0,2.5,6),ring(core.x+dx*side*core.spread,core.z+dz*side*core.spread,core.top,4.2,7),'concrete');
 }
 // A low glazed base behind the open north forecourt, with rising roof.
 const lobbyLo=LOBBY.map(([x,z])=>[x,0,z]),lobbyHi=LOBBY.map(([x,z])=>[x,1.65+(z+9)*.1,z]);
 lid(lobbyHi,'white');lid(lobbyLo,'frame',false);
 for(let i=0;i<LOBBY.length;i++){const j=(i+1)%LOBBY.length,out=[(LOBBY[i][0]+LOBBY[j][0])*2,2,(LOBBY[i][1]+LOBBY[j][1])*3];glazing(lobbyLo[i],lobbyLo[j],lobbyHi[j],lobbyHi[i],near?12:6,1,out);}
 // Partially enclosed angled stair, ending inside base and main structure.
 const stairLo=[[-27,2,-5],[-23,2,-5],[-4,8.8,-23],[-8,8.8,-23]];
 loft(stairLo,stairLo.map(([x,y,z])=>[x,y+1.5,z]),'soffit');
 // Small texture-free facade wordmark; optional sub-pixel detail in far.
 if(near){
  const glyph={P:['11110','10001','10001','11110','10000','10000','10000'],O:['01110','10001','10001','10001','10001','10001','01110'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],E:['11111','10000','10000','11110','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],U:['10001','10001','10001','10001','10001','10001','01110']};
  const text='PORSCHE MUSEUM',step=.12,basis=mix(upper[1],upper[2],.80),len=v(upper[2]).distanceTo(v(upper[1])),dx=(upper[2][0]-upper[1][0])/len,dz=(upper[2][2]-upper[1][2])/len;
  for(let k=0;k<text.length;k++)for(let r=0;r<7;r++)for(let c=0;c<5;c++)if(glyph[text[k]]?.[r][c]==='1'){
   const s=(k*6+c)*step,y=20.25-r*step;
   const point=(along,yy)=>{const t=.80-along/len,u=mix(upper[1],upper[2],t),l=mix(lower[1],lower[2],t),q=mix(l,u,(yy-BOTTOM_Y[1])/(u[1]-BOTTOM_Y[1]));q[2]-=.3;return q;};
   quad('sign',point(s,y),point(s+step*.82,y),point(s+step*.82,y+step*.82),point(s,y+step*.82),[0,20,-100]);
  }
 }
 for(const [m,p] of soups){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();b.put(g,m);}
 return b.finish();
}
