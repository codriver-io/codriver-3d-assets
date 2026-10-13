import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTLINE } from './one-atlantic-center-outline.js';

// Original measured-frame skin: granite and glass occupy disjoint facade cells.
// Recess returns seal the openings; no opaque backing or coplanar overlays.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const batches = new Map();
  function polygon(mat, points, normal) {
    const a = new THREE.Vector3(...points[0]), c = new THREE.Vector3(...points[1]), d = new THREE.Vector3(...points[2]);
    const reverse = new THREE.Vector3().crossVectors(c.sub(a), d.sub(a)).dot(new THREE.Vector3(...normal)) < 0;
    const vertices = batches.get(mat) || []; batches.set(mat, vertices);
    for (let i = 1; i < points.length - 1; i++) for (const p of reverse ? [points[0], points[i+1], points[i]] : [points[0], points[i], points[i+1]]) vertices.push(...p);
  }
  function face(a, c) {
    const len = Math.hypot(c[0]-a[0], c[1]-a[1]), dx=(c[0]-a[0])/len, dz=(c[1]-a[1])/len;
    const n=[dz,0,-dx];
    const at=(u,y,inset=0)=>[a[0]+dx*u-n[0]*inset,y,a[1]+dz*u-n[2]*inset];
    const rect=(mat,u0,u1,y0,y1,inset=0)=>polygon(mat,[at(u0,y0,inset),at(u1,y0,inset),at(u1,y1,inset),at(u0,y1,inset)],n);
    function opening(mat,u0,u1,y0,y1) {
      const inset=near?.28:0;
      if(near && y0>=10) {
        const mid=(u0+u1)/2;
        rect(mat,u0,mid-.045,y0,y1,inset);rect(mat,mid+.045,u1,y0,y1,inset);
        rect('stone',mid-.045,mid+.045,y0,y1,inset);
      } else rect(mat,u0,u1,y0,y1,inset);
      if(!near) return;
      polygon('stone',[at(u0,y0),at(u0,y1),at(u0,y1,inset),at(u0,y0,inset)],[dx,0,dz]);
      polygon('stone',[at(u1,y0),at(u1,y0,inset),at(u1,y1,inset),at(u1,y1)],[-dx,0,-dz]);
      polygon('stone',[at(u0,y0),at(u0,y0,inset),at(u1,y0,inset),at(u1,y0)],[0,1,0]);
      polygon('stone',[at(u0,y1),at(u1,y1),at(u1,y1,inset),at(u0,y1,inset)],[0,-1,0]);
    }
    function arched(u0,u1,bottom,spring,top) {
      const w=u1-u0, r=w/2, contour=[[u0,bottom],[u1,bottom],[u1,spring]];
      for(let k=1;k<=8;k++) {const t=k*Math.PI/8;contour.push([u0+r+r*Math.cos(t),spring+r*Math.sin(t)]);}
      const outer=[[u0-.45,bottom],[u1+.45,bottom],[u1+.45,top],[u0-.45,top]];
      const triangles=THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),[contour.map(p=>new THREE.Vector2(...p))]);
      const all=[...outer,...contour];
      for(const t of triangles) polygon('trim',t.map(i=>at(...all[i])),n);
      polygon('glass',contour.map(p=>at(...p,.65)),n);
      for(let k=0;k<contour.length;k++){const p=contour[k],q=contour[(k+1)%contour.length]; const ey=q[1]-p[1],eu=q[0]-p[0];
        polygon('trim',[at(...p),at(...q),at(...q,.65),at(...p,.65)],[dx*ey,-eu,dz*ey]);}
      if(near) rect('stone',u0+w*.48,u0+w*.52,bottom,spring+r*.96,.5);
    }
    return {len,at,rect,opening,arched,n};
  }
  function roof(ring,y,mat='stone') {
    const t=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]);
    for(const tri of t) polygon(mat,tri.map(i=>[ring[i][0],y,ring[i][1]]),[0,1,0]);
  }
  function skin(ring,y0,y1,mat='stone') {for(let i=0;i<ring.length;i++) face(ring[i],ring[(i+1)%ring.length]).rect(mat,0,Math.hypot(ring[(i+1)%ring.length][0]-ring[i][0],ring[(i+1)%ring.length][1]-ring[i][1]),y0,y1);}
  // 48 upper storeys plus two lobby levels. Far groups two adjacent floors per separate glass cell.
  for(let e=0;e<OUTLINE.length;e++) {
    const f=face(OUTLINE[e],OUTLINE[(e+1)%OUTLINE.length]);
    if(f.len<3) {f.rect('stone',0,f.len,0,198);continue;}
    const bays=Math.max(1,Math.round(f.len/4.2)), pitch=f.len/bays, pier=Math.min(1.25,pitch*.3);
    f.rect('stone',0,f.len,0,1.2);f.rect('trim',0,f.len,8.8,10);
    for(let j=0;j<bays;j++) {
      const u=j*pitch; const l=u+pier*.5,r=u+pitch-pier*.5;
      f.rect('stone',u,l,1.2,198);f.rect('stone',r,u+pitch,1.2,198);
      f.opening('glass',l,r,1.2,8.8);
      const rows=near?48:24;
      for(let row=0;row<rows;row++) {
        const y=10+row*188/rows, band=near?(row%3===0?.65:.1):.65;
        f.rect('stone',l,r,y,y+band);
        const y0=y+band,y1=y+188/rows;
        f.opening((row*7+j*13+e*3)%19===0?'light':'glass',l,r,y0,y1);
      }
    }
  }
  roof(OUTLINE,198);
  // Gothic shoulder: clipped-corner arcade, four substantial corner pinnacles.
  const crown=[[-19,-23],[19,-23],[23,-19],[23,19],[19,23],[-19,23],[-23,19],[-23,-19]];
  skin(crown,198,200,'trim');
  for(let i=0;i<crown.length;i++) {
    const f=face(crown[i],crown[(i+1)%crown.length]);
    const count=Math.max(1,Math.floor(f.len/4.8)), pitch=f.len/count;
    for(let k=0;k<count;k++) {
      const u0=k*pitch+.9,u1=(k+1)*pitch-.9;
      f.rect('trim',k*pitch,u0-.45,200,212);
      f.rect('trim',u1+.45,(k+1)*pitch,200,212);
      f.arched(u0,u1,200,206.5,212);
    }
  }
  roof(crown,212,'trim');
  const collar=[[-16.6,-16.6],[16.6,-16.6],[16.6,16.6],[-16.6,16.6]];
  // Small recessed crown windows break the former blank six-metre collar.
  // Each opening replaces stone cells, with closed returns rather than overlays.
  for(let i=0;i<4;i++) {
    const f=face(collar[i],collar[(i+1)%4]), count=7, pitch=f.len/count;
    for(let k=0;k<count;k++) {
      const left=k*pitch, right=(k+1)*pitch, u0=left+1.3,u1=right-1.3;
      f.rect('trim',left,u0-.45,212,218);f.rect('trim',u1+.45,right,212,218);
      f.arched(u0,u1,212,215.3,218);
    }
  }
  roof(collar,218,'trim');
  // Four stepped Gothic shoulders climb from the arcade to the pyramid base.
  // The stepped buttresses are solid and rooted in the 212 m crown terrace.
  for(let side=0;side<4;side++) for(const u of [-12,-6,0,6,12]) {
    const angle=side*Math.PI/2, transform=(x,y,z)=>[x*Math.cos(angle)+z*Math.sin(angle),y,-x*Math.sin(angle)+z*Math.cos(angle)];
    for(const [z,depth,top] of [[21.5,3,213.5],[19.25,1.5,215.4],[17.65,1.7,217.5]])
      b.box('trim',transform(u,(212+top)/2,z),[1.15,top-212,depth],angle);
    const shoulder=new THREE.ConeGeometry(.7,2.3,4);shoulder.rotateY(Math.PI/4);shoulder.translate(...transform(u,218.65,17.65));b.put(shoulder,'trim');
  }
  // Pyramid with four gently lit ridges; ribs are directly on the panel junctions.
  const peak=[0,242.5,0];
  for(let i=0;i<4;i++) {
    const p=[...collar[i]],q=[...collar[(i+1)%4]];
    polygon('copper',[[p[0],218,p[1]],[q[0],218,q[1]],peak],[(p[0]+q[0])/2,16,(p[1]+q[1])/2]);
    b.bar('glow',[p[0],218,p[1]],peak,near?.24:.32);
    if(near) {
      // Small ridge crockets, present in the reference photographs.
      for(let k=1;k<15;k++){const t=k/15;const x=p[0]*(1-t),z=p[1]*(1-t),y=218+24.5*t;
        b.box('glow',[x,y+.23,z],[.42,.46,.42]);}
    }
  }
  // Connected stone corner shafts and copper tips; retained unaltered in far.
  for(const [x,z] of [[20.3,20.3],[-20.3,20.3],[20.3,-20.3],[-20.3,-20.3]]) {
    b.box('stone',[x,207,z],[1.5,18,1.5]);
    const g=new THREE.ConeGeometry(1.1,4.5,4);g.rotateY(Math.PI/4);g.translate(x,218.25,z);b.put(g,'copper');
  }
  // Smaller parapet pinnacles around the crown.
  for(const [x,z] of [[-12,23],[0,23],[12,23],[-12,-23],[0,-23],[12,-23],[23,-12],[23,0],[23,12],[-23,-12],[-23,0],[-23,12]]) {
    // Square pedestal and two setbacks make each parapet tip a Gothic pinnacle.
    b.box('trim',[x,212.6,z],[1.2,1.2,1.2]);
    b.box('trim',[x,213.5,z],[.85,.6,.85]);
    const g=new THREE.ConeGeometry(.58,2.6,4);g.rotateY(Math.PI/4);g.translate(x,215.1,z);b.put(g,'trim');
  }
  // Open gold lantern: plinth, four pillars, canopy and final needle, no solid box substitute.
  b.box('glow',[0,242.7,0],[2.8,.6,2.8]);
  for(const x of [-.95,.95]) for(const z of [-.95,.95]) b.box('glow',[x,245,z],[.3,4,.3]);
  b.box('glow',[0,247.1,0],[2.7,.3,2.7]);
  const cap=new THREE.ConeGeometry(1.9,2.2,4);cap.rotateY(Math.PI/4);cap.translate(0,248.35,0);b.put(cap,'glow');
  const finial=new THREE.ConeGeometry(.14,.55,5);finial.translate(0,249.725,0);b.put(finial,'glow');
  for(const [mat,positions] of batches) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(mergeVertices(g,1e-5),mat);g.dispose();
  }
  const model=b.finish();model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});
  return model;
}
