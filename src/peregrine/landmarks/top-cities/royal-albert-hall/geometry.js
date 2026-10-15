import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

const ROT = 6 * Math.PI / 180;
// Local u is east across the minor axis; v is south along the major axis.
export const plan = (u,y,v) => [u*Math.cos(ROT)+v*Math.sin(ROT), y, -u*Math.sin(ROT)+v*Math.cos(ROT)];
export const ELLIPSE = [36,41.5];
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', n=near?128:48, arcs=near?8:3;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,m)=>{g.rotateY(ROT);b.put(g,m);};
  const box=(m,p,s,a=0,omitBottom=false)=>{const g=new THREE.BoxGeometry(...s);if(omitBottom)g.setIndex(Array.from(g.index.array).filter((_,i)=>i<18||i>=24));g.rotateY(a);g.translate(...p);put(g,m);};
  const mesh=(p,ix,m)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));const valid=[];for(let i=0;i<ix.length;i+=3){const a=new THREE.Vector3().fromArray(p,ix[i]*3),c=new THREE.Vector3().fromArray(p,ix[i+1]*3),d=new THREE.Vector3().fromArray(p,ix[i+2]*3);if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)valid.push(ix[i],ix[i+1],ix[i+2]);}g.setIndex(valid);g.computeVertexNormals();put(g,m);};
  // Closed elliptical profile, ordered bottom-to-top. No stacked coplanar disks.
  function loft(profile,m,segments=n) {
    const p=[],ix=[];
    for(const [rx,rz,y] of profile)for(let i=0;i<segments;i++){const a=i*2*Math.PI/segments;p.push(rx*Math.sin(a),y,rz*Math.cos(a));}
    for(let j=0;j<profile.length-1;j++)for(let i=0;i<segments;i++){const a=j*segments+i,c=j*segments+(i+1)%segments;ix.push(a,c,a+segments,c,c+segments,a+segments);}
    const q=p.length/3;p.push(0,profile[0][2],0,0,profile.at(-1)[2],0);
    for(let i=0;i<segments;i++){const j=(i+1)%segments,k=(profile.length-1)*segments;if(near || profile[0][2]===0)ix.push(q,j,i);ix.push(q+1,k+i,k+j);}
    mesh(p,ix,m);
  }
  const ring=(rx,rz,y,h,m='stone')=>loft([[rx,rz,y],[rx,rz,y+h]],m);
  loft([[36.6,42.1,0],[36.6,42.1,1],[36.1,41.6,1.2],[36.1,41.6,3.5]],'stone');
  ring(36.15,41.65,11.3,.65);ring(36.2,41.7,20.6,.7);
  ring(36,41.5,21.3,1.5,'brick');
  ring(36.2,41.7,22.8,.4);ring(36,41.5,23.2,3,'frieze');
  ring(36.3,41.8,26.2,.55);ring(36,41.5,26.75,.6,'brick');
  loft([[36.15,41.65,27.35],[36.7,42.2,27.6],[36.7,42.2,28.1],[35.8,41.3,28.4]],'stone');
  // True facade holes: glazing is behind reveals, never pasted over masonry.
  function aperture(w,base,spring,r,steps=arcs) {
    const pts=[[-w/2,base],[w/2,base],[w/2,spring]];
    if(r)for(let i=1;i<=steps;i++){const a=i*Math.PI/steps;pts.push([r*Math.cos(a),spring+r*Math.sin(a)]);}
    else pts.push([-w/2,spring]);
    return pts;
  }
  function face(poly,m,transform,holes=[]) {
    const v=poly.map(([x,y])=>new THREE.Vector2(x,y)),hs=holes.map(h=>h.map(([x,y])=>new THREE.Vector2(x,y)));
    const tris=THREE.ShapeUtils.triangulateShape(v,hs),all=[...v,...hs.flat()],p=all.flatMap(q=>transform(q.x,q.y));
    mesh(p,tris.flat(),m);
  }
  function facadeBay(a,rx,rz,width,lo=3.5,hi=20.6) {
    const cx=rx*Math.sin(a),cz=rz*Math.cos(a),tx=rx*Math.cos(a),tz=-rz*Math.sin(a),len=Math.hypot(tx,tz),ux=tx/len,uz=tz/len,nx=-uz,nz=ux;
    const tr=(d)=>(x,y)=>[cx+ux*x+nx*d,y,cz+uz*x+nz*d];
    const lower=aperture(1.42,5,10.1,0),upper=aperture(1.65,13.05,18.2,.825);
    face([[-width/2,lo],[width/2,lo],[width/2,hi],[-width/2,hi]],'brick',tr(0),[lower,upper]);
    for(const poly of [lower,upper]){
      face(poly,'glass',tr(-.28));
      const p=[],ix=[];
      for(let i=0;i<poly.length;i++){const c=poly[i],d=poly[(i+1)%poly.length],k=p.length/3;p.push(...tr(0)(...c),...tr(0)(...d),...tr(-.28)(...c),...tr(-.28)(...d));ix.push(k,k+2,k+1,k+1,k+2,k+3);}
      mesh(p,ix,'stone');
    }
    const frame=(inner,outer)=>face(outer,'stone',tr(.16),[inner]);
    frame(lower,aperture(1.95,4.7,10.45,0));
    frame(upper,aperture(2.22,12.72,18.2,1.11));
    // Omit thin centre mullions: the window aperture itself carries the far rhythm.
    box('stone',tr(.12)(width*.48,16.1),[.24,8.3,.32],Math.atan2(-uz,ux));
    if(near)for(const y of [12.65,20.18])box('stone',tr(.22)(width*.48,y),[.6,.3,.48],Math.atan2(-uz,ux));
  }
  // All sixty-four bays and both distinct window rows survive far detail.
  for(let i=0;i<64;i++){
    const a=(i+.5)*Math.PI*2/64,da=Math.PI*2/64;
    const width=Math.hypot(36*Math.cos(a),41.5*Math.sin(a))*2*Math.tan(da/2);
    facadeBay(a,36,41.5,width);
  }
  for(let i=0;i<32;i++){
    const a=(i+.5)*2*Math.PI/32,cx=36.12*Math.sin(a),cz=41.62*Math.cos(a),ang=Math.atan2(41.5*Math.sin(a),36*Math.cos(a));
    box('stone',[cx,21.95,cz],[.9,1,.23],ang);
    box('glass',[36.32*Math.sin(a),21.95,41.82*Math.cos(a)],[.48,.62,.13],ang);
  }
  // Mosaic figures: grouped heads, draped torsos and gesturing arms in sixteen panels.
  const groups=16, people=near?6:4;
  for(let g=0;g<groups;g++)for(let j=0;j<people;j++){
    const a=(g+(j+.5)/people)*Math.PI*2/groups,cx=36.18*Math.sin(a),cz=41.68*Math.cos(a);
    const norm=new THREE.Vector2(Math.sin(a)/36,Math.cos(a)/41.5).normalize(),tx=norm.y,tz=-norm.x;
    const transform=(x,y)=>[cx+tx*x,y,cz+tz*x];
    const lean=((j+g)%3-1)*.13,y=23.42,h=1.7+(j%2)*.16;
    face([[-.43,y],[.4,y],[.22+lean,y+h*.65],[.5,y+h*.6],[.74,y+h*.88],[.61,y+h*.96],[.28,y+h*.78],[.15+lean,y+h*.94],[-.15+lean,y+h*.94],[-.28,y+h*.66],[-.64,y+h*.46],[-.56,y+h*.37],[-.2,y+h*.49]],'stone',transform);
    const head=[];for(let k=0;k<(near?8:5);k++){const t=k*Math.PI*2/(near?8:5);head.push([lean+.17*Math.cos(t),y+h+.17*Math.sin(t)]);}
    face(head,'stone',transform);
  }
  // Inset upper drum, shallow glass dome and oxidized pale iron ribs.
  ring(30.2,35.2,28.4,.6);ring(30,35,29,3.35,'brick');ring(30.25,35.25,32.35,.65);
  for(let i=0;i<32;i++){const a=i*Math.PI*2/32,ang=Math.atan2(35*Math.sin(a),30*Math.cos(a));box('stone',[30.12*Math.sin(a),30.65,35.12*Math.cos(a)],[.22,2.9,.26],ang);}
  const roofProfile=[],steps=near?10:5;
  for(let j=0;j<=steps;j++){const rr=1-j/steps;roofProfile.push([30*rr,35*rr,33+7*(1-rr*rr)]);}
  loft(roofProfile,'roof',near?96:64);
  // Curved ribbons are embedded in the glazing shoulder and join at the crown.
  for(let i=0;i<32;i++){
    const a=i*Math.PI*2/32,w=near?.10:.14,p=[],ix=[];
    for(let j=0;j<=steps;j++){
      const rr=1-j/steps,y=33+7*(1-rr*rr)+.07;
      for(const s of [-1,1])p.push(30*rr*Math.sin(a)+s*w*Math.cos(a),y,35*rr*Math.cos(a)-s*w*Math.sin(a));
      if(j){const k=(j-1)*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}
    }
    mesh(p,ix,'stone');
  }
  if(near)for(const rr of [.25,.5,.75]){
    const p=[],ix=[];
    for(let i=0;i<96;i++){const a=i*2*Math.PI/96;for(const r of [rr-.002,rr+.002])p.push(30*r*Math.sin(a),33+7*(1-r*r)+.08,35*r*Math.cos(a));}
    for(let i=0;i<96;i++){const k=i*2,j=((i+1)%96)*2;ix.push(k,j,k+1,k+1,j,j+1);}
    mesh(p,ix,'stone');
  }
  loft([[2.8,3.2,39.93],[2.8,3.2,40.55],[0,0,41]],'roof',near?16:8);
  // Four projecting two-storey porches. Arched entries are recessed, not solid black boxes.
  for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
    const north=Math.abs(a-Math.PI)<.01,south=a===0,radius=(south||north)?41.5:36;
    const depth=north?8:7.1,width=15.4,ny=21.6;
    const transform=(x,y,d)=>[x*Math.cos(a)+(radius+d)*Math.sin(a),y,-x*Math.sin(a)+(radius+d)*Math.cos(a)];
    const ang=a;
    for(const s of [-1,1])box('brick',transform(s*(width/2-.8),ny/2,depth/2),[1.6,ny,depth],ang);
    box('brick',transform(0,15.8,depth/2),[width-3.2,11.6,depth],ang,true);
    const entry=aperture(7.2,1,6.1,3.6),front=(d)=>(x,y)=>transform(x,y,d);
    face([[-width/2,0],[width/2,0],[width/2,10],[-width/2,10]],'brick',front(depth),[entry]);
    face(entry,'glass',front(depth-.65));
    face(aperture(8.5,.8,6.1,4.25),'stone',front(depth+.16),[entry]);
    const p=[],ix=[];for(let j=0;j<entry.length;j++){const c=entry[j],d=entry[(j+1)%entry.length],k=p.length/3;p.push(...front(depth)(...c),...front(depth-.65)(...c),...front(depth)(...d),...front(depth-.65)(...d));ix.push(k,k+2,k+1,k+1,k+2,k+3);}mesh(p,ix,'stone');
    for(const s of [-1,1])box('stone',transform(s*6.7,10.1,depth+.2),[1,20.2,.7],ang);
    for(const y of [1,10.5,20.8,21.8])box('stone',transform(0,y,depth/2),[width+.6,.55,depth+.7],ang);
    for(const x of [-4.3,0,4.3]){
      box('stone',transform(x,15.75,depth+.2),[2.7,6.95,.3],ang);
      box('glass',transform(x,15.75,depth+.40),[1.72,6.2,.18],ang);
    }
    if(near)for(const side of [-1,1])for(const d of [2.1,5.0]){
      box('stone',transform(side*(width/2+.12),15.7,d),[.20,5.9,1.35],ang);
      box('glass',transform(side*(width/2+.26),15.7,d),[.13,5.3,.9],ang);
    }
    const stairN=south?8:2,run=south?4:1;
    for(let j=0;j<stairN;j++){const h=(stairN-j)/stairN;box('stone',transform(0,h/2,depth+run*(j+.5)/stairN),[11.5,h,run/stairN],ang);}
    if(near)for(let j=-7;j<=7;j++)box('stone',transform(j,21.35,depth+.14),[.20,.7,.3],ang);
  }
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const old=o.geometry;const used=old.toNonIndexed();o.geometry=mergeVertices(used,1e-5);used.dispose();old.dispose();}});
  return root;
}
