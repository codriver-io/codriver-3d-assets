import * as THREE from 'three';
import { SPEC } from './config.js';
const A = 29 * Math.PI / 180;
// u down the hotel toward the southeast; v toward the river (northeast).
export const world = (u,y,v) => [u*Math.sin(A)+v*Math.cos(A),y,u*Math.cos(A)-v*Math.sin(A)];
export const local = ([lng,lat]) => {
 const x=(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),z=(SPEC.origin[1]-lat)*111320;
 return [x*Math.sin(A)+z*Math.cos(A),x*Math.cos(A)-z*Math.sin(A)];
};
export const BLOCKS = [
 // u0,u1,v0,v1,eave,roof-rise,ridge-direction (u or v)
 [-57,-12,-5,13,31,9,'u'],[12,47,-5,13,31,9,'u'],
 [-12,12,-31,13,45.5,13.2,'v'],
 [-62,-48,-30,10,34,15,'v'],[47,60,-26,13,34,16,'v'],
 [-48,-12,-30,-5,11,1,'u'],[12,47,-30,-5,11,1,'u'],
 [-2,11,13,43,13,10,'v'],[12,20,13,33,10,7,'v'],
 [65,77,-12,4,11,6,'u'],
 [99,132,18,40,11,10,'u'],[85,108,71,76,8,5,'u'],
 [111,139,70,76,8,5,'u'],[111,125,10,18,10,9,'u'],
];
export function surfaces(builder) {
 const buckets=new Map();
 const tri=(m,a,b,c,n) => {
  let ab=new THREE.Vector3().fromArray(b).sub(new THREE.Vector3().fromArray(a)),ac=new THREE.Vector3().fromArray(c).sub(new THREE.Vector3().fromArray(a));
  let normal=ab.cross(ac);if(normal.lengthSq()<1e-12)return;
  if(normal.dot(new THREE.Vector3(...n))<0){[b,c]=[c,b];normal.negate();}normal.normalize();
  const t=buckets.get(m)||{p:[],n:[]};buckets.set(m,t);
  for(const p of [a,c,b]){t.p.push(...world(...p));const q=world(normal.x,normal.y,normal.z);t.n.push(...q);}
 };
 const quad=(m,a,b,c,d,n)=>{tri(m,a,b,c,n);tri(m,a,c,d,n);};
 const panel=(m,p,t,n,lo,hi,y0,y1,d)=>{
  const at=(s,y)=>[p[0]+t[0]*s+n[0]*d,y,p[1]+t[1]*s+n[1]*d];
  quad(m,at(lo,y0),at(hi,y0),at(hi,y1),at(lo,y1),[n[0],0,n[1]]);
 };
 const cap=(m,ring,y)=>{for(const idx of THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]))tri(m,...idx.map(i=>[ring[i][0],y,ring[i][1]]),[0,1,0]);};
 const flush=()=>{for(const [m,t] of buckets){const P=[],N=[],I=[],seen=new Map();for(let i=0;i<t.p.length;i+=3){const key=[...t.p.slice(i,i+3),...t.n.slice(i,i+3)].map(x=>Math.round(x*10000)).join(',');let idx=seen.get(key);if(idx===undefined){idx=P.length/3;seen.set(key,idx);P.push(...t.p.slice(i,i+3));N.push(...t.n.slice(i,i+3));}I.push(idx);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setIndex(I);builder.put(g,m);}};
 return {tri,quad,panel,cap,flush};
}
