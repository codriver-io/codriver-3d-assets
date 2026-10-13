import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Surface, outline, world, mix } from './tour-montparnasse-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const M=Object.fromEntries(Object.keys(PALETTES.light).map(k=>[k,new Surface()]));
  const ring=outline(detail),rows=near?58:29,y0=SPEC.lobbyY,y1=SPEC.shaftY,pitch=(y1-y0)/rows;
  const normals=ring.map((p,j)=>{
    const a=world(p,0),c=world(ring[(j+1)%ring.length],0),n=new THREE.Vector3(c[2]-a[2],0,a[0]-c[0]);return n.normalize();
  });
  const offsets=normals.map((n,j)=>{
    const m=n.clone().add(normals[(j+normals.length-1)%normals.length]).normalize();return m.multiplyScalar(1/m.dot(n)).toArray();
  });
  for(let j=0;j<ring.length;j++) {
    const a=ring[j],c=ring[(j+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
    const aw=world(a,0),cw=world(c,0),normal=[cw[2]-aw[2],0,aw[0]-cw[0]];
    const nl=Math.hypot(normal[0],normal[2]);normal[0]/=nl;normal[2]/=nl;
    // Shared mitered corners close the projected ribs and slab in either LOD.
    const at=(p,y,d=0)=>{
      const t=((p[0]-a[0])*(c[0]-a[0])+(p[1]-a[1])*(c[1]-a[1]))/(len*len);
      const offset=mix(offsets[j],offsets[(j+1)%ring.length],t);
      return world(p,y).map((v,k)=>v+offset[k]*d);
    };
    const face=(s,p,q,lo,hi,d=0)=>s.face([at(p,lo,d),at(q,lo,d),at(q,hi,d),at(p,hi,d)],normal);
    const margin=(near?0.18:0.22)/len,u=mix(a,c,margin),v=mix(a,c,1-margin);
    // Separate facade surfaces rather than overlays on a backing shell.
    const relief=near?0.24:0.55;
    face(M.frame,a,u,0,y1,relief);face(M.frame,v,c,0,y1,relief);
    for(const [p,sign] of [[u,1],[v,-1]]){
      const tangent=[(cw[0]-aw[0])*sign,0,(cw[2]-aw[2])*sign];
      M.frame.face([at(p,0),at(p,0,relief),at(p,y1,relief),at(p,y1)],tangent);
    }
    face(M.glass,u,v,0,y0);
    for(let f=0;f<rows;f++){
      const low=y0+f*pitch,high=low+pitch,band=near?0.72:1.10;
      face(M.bronze,u,v,low,low+band);
      const h=(Math.imul(j+7,73856093)^Math.imul(f+11,19349663))>>>0;
      face(M[h%23===0?'glow':'glass'],u,v,low+band,high);
    }
    face(M.frame,a,c,y1,SPEC.roofY,relief);
    M.frame.face([at(a,y1),at(c,y1),at(c,y1,relief),at(a,y1,relief)],[0,-1,0]);
    M.roof.face([at(a,SPEC.roofY),at(c,SPEC.roofY),at(c,SPEC.roofY,relief),at(a,SPEC.roofY,relief)],[0,1,0]);
  }
  const cap=(y,material,up)=>{
    const pts=ring.map(p=>new THREE.Vector2(...p));
    for(const tri of THREE.ShapeUtils.triangulateShape(pts,[]))M[material].face(tri.map(i=>world(ring[i],y)),[0,up,0]);
  };
  cap(SPEC.roofY,'roof',1);cap(0,'frame',-1);
  // Inset open observation terrace, with every post based on the roof slab.
  const terrace=ring.map(p=>p.map(v=>v*0.94)),railY=211.4;
  for(let j=0;j<terrace.length;j++){
    const a=terrace[j],c=terrace[(j+1)%terrace.length];
    b.bar('metal',world(a,210),world(a,railY),near?0.13:0.18);
    b.bar('metal',world(a,railY),world(c,railY),near?0.13:0.18);
    if(near)b.bar('metal',world(a,210.7),world(c,210.7),0.09);
  }
  const box=(mat,p,size,y)=>b.box(mat,world(p,y),size,(90-SPEC.axisBearing)*Math.PI/180);
  box('frame',[0,0],[9,1.2,7],210.6);
  box('roof',[0,0],[9.4,0.24,7.4],211.32);
  box('metal',[8,0],[1.2,0.6,1.2],210.3);
  b.bar('metal',world([8,0],210.6),world([8,0],214),near?0.18:0.23);
  // Low bronze entrance lintel inside the mapped tower envelope.
  b.box('bronze',world([0,19.2],2.3),[7,0.2,0.26],(90-SPEC.axisBearing)*Math.PI/180);
  for(const [mat,s] of Object.entries(M))if(s.i.length)b.put(s.geometry(),mat);
  const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return root;
}
