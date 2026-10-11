import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { localRing, contains, faces, roof, edges, strut } from './science-world-vancouver-parts.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const mat=m=>near?m:({panelBright:'panel',glow:'light'}[m]??m);
 const put=(m,g)=>b.put(g,mat(m));
 const bar=(m,a,c,w)=>near?b.bar(m,a,c,w):put(m,strut(a,c,w*.6));
 const lower=localRing(FOOTPRINTS[1]),annex=localRing(FOOTPRINTS[2]);
 // Exact mapped plan, already east/up/south. Glass bands are the walls themselves.
 for(const [ring,h] of [[lower,10],[annex,14]]) {
  for(const {a,c,n,len} of edges(ring)) {
   for(const [lo,hi,m] of [[0,1,'concrete'],[1,3,'glass'],[3,3.6,'red'],[3.6,h-.5,'glass'],[h-.5,h,'roof']])
    put(m,faces([{p:[[a[0],lo,a[1]],[c[0],lo,c[1]],[c[0],hi,c[1]],[a[0],hi,a[1]]],n}]));
   const count=Math.max(1,Math.ceil(len/(near?2.1:6)));
   for(let i=0;i<count;i++) {
    const t=(i+.5)/count,x=a[0]+(c[0]-a[0])*t+n[0]*.14,z=a[1]+(c[1]-a[1])*t+n[2]*.14;
    bar(mat(i===0?'red':'steel'),[x,1,z],[x,h-.5,z],i===0?.30:.09);
   }
   if(near)for(const y of [5.7,8.1,...(h>10?[10.5,12.4]:[])])
    bar('steel',[a[0]+n[0]*.14,y,a[1]+n[2]*.14],[c[0]+n[0]*.14,y,c[1]+n[2]*.14],.09);
  }
  put('roof',roof(ring,h));
  // Raised photovoltaic/skylight modules, confined to the mapped roof.
  for(const r of (h===10?[22,27,32]:[46,52,58]))for(let a=0;a<Math.PI*2;a+=near?.14:.30) {
   const x=r*Math.cos(a),z=r*Math.sin(a);
   if(![-2,2].every(dx=>[-1.2,1.2].every(dz=>contains(ring,x+dx,z+dz))))continue;
   if(!near){
    const c=Math.cos(-a+Math.PI/2),sn=Math.sin(-a+Math.PI/2);
    const corners=[[-1.9,-.8],[1.9,-.8],[1.9,.8],[-1.9,.8]].map(([u,v])=>[x+u*c+v*sn,h+.15,z-u*sn+v*c]);
    put('panelDark',faces([{p:corners,n:[0,1,0]}]));continue;
   }
   const g=new THREE.BoxGeometry(3.4,.15,1.9);g.rotateY(-a+Math.PI/2);g.translate(x,h+.13,z);put('steel',g);
   const s=new THREE.BoxGeometry(near?3.1:3.7,.06,1.6);s.rotateY(-a+Math.PI/2);s.translate(x,h+.24,z);put('panelDark',s);
  }
 }
 const R=20,cy=27,cut=15,baseR=Math.sqrt(R*R-(cy-cut)**2),N=near?96:32;
 const cyl=(m,r,h,y)=>{const g=new THREE.CylinderGeometry(r,r,h,N,1,false);g.translate(0,y+h/2,0);put(m,g);};
 cyl('red',baseR,5,10);
 for(const y of [10.15,14.65])cyl('glow',baseR+.08,.18,y);
 // Original faceted shell. Geodesic triangles survive in the far LOD.
 const geo=new THREE.IcosahedronGeometry(R,near?7:3);
 geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,(1+Math.sqrt(5))/2).normalize(),new THREE.Vector3(0,1,0)));
 const p=geo.attributes.position,seen=new Set(),nodes=new Map();
 const key=v=>v.map(x=>Math.round(x*1e4)).join(',');
 const clipped=poly=>{
  const out=[];
  for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length];if(a[1]>=cut)out.push(a);if((a[1]>=cut)!==(c[1]>=cut)){const t=(cut-a[1])/(c[1]-a[1]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}
  return out;
 };
 for(let i=0;i<p.count;i+=3){
  const tri=[0,1,2].map(j=>[p.getX(i+j),p.getY(i+j)+cy,p.getZ(i+j)]),poly=clipped(tri);
  if(poly.length<3)continue;
  const center=poly.reduce((s,v)=>s.map((x,j)=>x+v[j]/poly.length),[0,0,0]);
  const norm=new THREE.Vector3(center[0],center[1]-cy,center[2]).normalize();
  const apex=center.map((v,j)=>v+norm.toArray()[j]*(near?.10:.16));
  const m=['panel','panel','panelBright','panelDark','panel'][Math.floor(i/3)%5];
  put(m,faces(poly.map((a,j)=>({p:[a,poly[(j+1)%poly.length],apex],n:norm.toArray()}))));
  for(let j=0;j<poly.length;j++) {
   const a=poly[j],c=poly[(j+1)%poly.length],id=[key(a),key(c)].sort().join(':');
   if(seen.has(id))continue;seen.add(id);
   put('steel',strut(a,c,near?.065:.095));nodes.set(key(a),a);nodes.set(key(c),c);
  }
 }
 geo.dispose();
 for(const v of nodes.values()) {
  const n=new THREE.Vector3(v[0],v[1]-cy,v[2]).normalize();
  const lamp=new THREE.OctahedronGeometry(near?.24:.30,0);lamp.translate(...v.map((x,j)=>x+n.toArray()[j]*.09));put('light',lamp);
 }
 // Expo pavilion radial roof masts and tension braces.
 for(const a of [1.2,2.15,3.05,4.05,4.85]) {
  const at=(r,y)=>[r*Math.cos(a),y,r*Math.sin(a)];
  if(!contains(lower,at(29,0)[0],at(29,0)[2]))continue;
  bar('steel',at(28.8,10),at(27.1,18.4),near?.23:.28);
  for(const r of [17,31])bar('steel',at(r,10.05),at(27.1,18.4),near?.10:.13);
 }
 const model=b.finish();
 model.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');
  const original=o.geometry;o.geometry=mergeVertices(original,1e-4);original.dispose();
  if(/^panel/.test(o.material.name)){o.material.metalness=.62;o.material.roughness=.28;}
  if(o.material.name==='steel'){o.material.metalness=.55;o.material.roughness=.42;}
 });
 return model;
}
