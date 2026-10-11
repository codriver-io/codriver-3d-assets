import * as THREE from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
export const area=r=>r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1];},0);
export const center=r=>[0,1].map(i=>r.reduce((s,p)=>s+p[i],0)/r.length);
export function edges(r){const s=Math.sign(area(r));return r.map((a,i)=>{const c=r[(i+1)%r.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]);return {a,c,L,t:[(c[0]-a[0])/L,(c[1]-a[1])/L],n:[s*(c[1]-a[1])/L,-s*(c[0]-a[0])/L]};}).filter(e=>e.L>.06);}
export function inside(r,p){let v=false;for(let i=0,j=r.length-1;i<r.length;j=i++)if((r[i][1]>p[1])!==(r[j][1]>p[1])&&p[0]<(r[j][0]-r[i][0])*(p[1]-r[i][1])/(r[j][1]-r[i][1])+r[i][0])v=!v;return v;}
export function distance(r,p){return Math.min(...edges(r).map(e=>{const u=Math.max(0,Math.min(e.L,(p[0]-e.a[0])*e.t[0]+(p[1]-e.a[1])*e.t[1]));return Math.hypot(p[0]-e.a[0]-u*e.t[0],p[1]-e.a[1]-u*e.t[1]);}));}
export function simplify(r,tol=.2){let a=r.filter((p,i)=>i===0||Math.hypot(p[0]-r[i-1][0],p[1]-r[i-1][1])>.06);for(let pass=0;pass<3;pass++)a=a.filter((p,i)=>{const u=a[(i+a.length-1)%a.length],v=a[(i+1)%a.length],L=Math.hypot(v[0]-u[0],v[1]-u[1]);return !L||Math.abs((p[0]-u[0])*(v[1]-u[1])-(p[1]-u[1])*(v[0]-u[0]))/L>tol;});return a;}
export function kit(b){const batches=new Map();function tri(mat,a,c,d,hint){let n=new THREE.Vector3().crossVectors(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),new THREE.Vector3(...d).sub(new THREE.Vector3(...a)));if(n.length()<1e-6)return;if(n.dot(new THREE.Vector3(...hint))<0)[c,d]=[d,c];if(!batches.has(mat))batches.set(mat,[]);batches.get(mat).push(...a,...c,...d);}
const quad=(mat,a,c,d,e,h)=>{tri(mat,a,c,d,h);tri(mat,a,d,e,h);};
const cap=(r,y,mat)=>{for(const f of THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[]))tri(mat,...f.map(i=>[r[i][0],y,r[i][1]]),[0,1,0]);};
const prism=(r,lo,hi,mat='stone',filter=()=>true,capMat=mat)=>{for(const e of edges(r))if(filter(e))quad(mat,[e.a[0],lo,e.a[1]],[e.c[0],lo,e.c[1]],[e.c[0],hi,e.c[1]],[e.a[0],hi,e.a[1]],[e.n[0],0,e.n[1]]);cap(r,hi,capMat);};
const panel=(mat,e,u,y,w,h,offset=.08)=>{const p=(u,y)=>[e.a[0]+e.t[0]*u+e.n[0]*offset,y,e.a[1]+e.t[1]*u+e.n[1]*offset];quad(mat,p(u-w/2,y),p(u+w/2,y),p(u+w/2,y+h),p(u-w/2,y+h),[e.n[0],0,e.n[1]]);};
function flush(){for(const [mat,pos]of batches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();b.put(mergeVertices(g,.0001),mat);g.dispose();}}
return {tri,quad,cap,prism,panel,flush};}
