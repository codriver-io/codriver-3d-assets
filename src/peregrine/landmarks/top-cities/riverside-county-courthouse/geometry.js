import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Authoring +z faces Main Street; the mapped 29.1-degree street axis is baked
// into the mesh at finish. No runtime or terrain modules are imported.
export const PORTICO_COLUMNS = [-8.4,-4.1,-2.7,2.7,4.1,8.4];
export const WING_COLUMNS = [-34,-31.4,-28.8,-26.2,-23.6,-21,-18.4,-15.8,15.0,17.6,20.2,22.8,25.4,28,30.6,33.2];

const shape = points => new THREE.Shape(points.map(([x,y])=>new THREE.Vector2(x,y)));
function shell(s,depth,front=0) {
  return new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,steps:1,curveSegments:4}).translate(0,0,front-depth);
}
// Remove buried caps rather than stacking broad different-material surfaces.
function strip(g,fn) {
  if(g.index)g=g.toNonIndexed();
  const p=g.attributes.position,n=g.attributes.normal,a=[],b=[];
  for(let i=0;i<p.count;i+=3) {
    if(fn(n.getX(i),n.getY(i),n.getZ(i)))continue;
    for(let j=0;j<3;j++){a.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));b.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}
  }
  const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.Float32BufferAttribute(a,3));out.setAttribute('normal',new THREE.Float32BufferAttribute(b,3));g.dispose();return out;
}
export function create({detail='near'}={}) {
  const near=detail==='near',segments=near?12:6;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,m='stone')=>b.put(g,m);
  const box=(m,x0,x1,y0,y1,z0,z1)=>b.box(m,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
  const cyl=(x,y,z,r,h,seg=segments,rt=r)=>put(new THREE.CylinderGeometry(rt,r,h,seg).translate(x,y+h/2,z));
  const ball=(x,y,z,r)=>put(new THREE.SphereGeometry(r,near?8:4,near?5:3).translate(x,y,z));
  // The original mapped range is roughly 80 by 39 metres. Its foundation is
  // a building plinth, not an oversized ground pad. Corner pilaster returns
  // are explicitly drawn inside the OSM's irregular outer wall envelope.
  box('stone',-38.85,37.85,0,2.2,-18.8,16.35);
  for(const [x0,x1] of [[-40.35,-34.95],[32.8,39.05]])box('stone',x0,x1,0,2.2,-19.5,17.45);
  box('stone',-12.7,11.8,0,2.2,16.3,20.0);
  box('stone',-10.2,10.9,0,2.2,-21.8,-18.7);

  // Facade shells contain actual holes; windows sit 60 cm behind them.
  function facade(cx,cz,angle,length,windows,top=11.25) {
    const M=new THREE.Matrix4().makeRotationY(angle).setPosition(cx,0,cz);
    const at=(g,m='stone')=>{g.applyMatrix4(M);put(g,m);};
    const fb=(x0,x1,y0,y1,d0,d1,m='stone')=>at(new THREE.BoxGeometry(x1-x0,y1-y0,d1-d0).translate((x0+x1)/2,(y0+y1)/2,(d0+d1)/2),m);
    const s=shape([[-length/2,2.2],[length/2,2.2],[length/2,top],[-length/2,top]]);
    for(const w of windows)s.holes.push(new THREE.Path([[w.x-w.w/2,w.y],[w.x+w.w/2,w.y],[w.x+w.w/2,w.y+w.h],[w.x-w.w/2,w.y+w.h]].map(q=>new THREE.Vector2(...q))));
    at(strip(shell(s,.62),(_x,y)=>Math.abs(y)>.9));
    for(const [i,w] of windows.entries()) {
      at(new THREE.PlaneGeometry(w.w,w.h).translate(w.x,w.y+w.h/2,-.64),w.door?'bronze':'glass');
      // Restrained classical surrounds and sills, sharing stone material.
      if(w.trim!==false) {
        fb(w.x-w.w/2-.22,w.x+w.w/2+.22,w.y-.20,w.y-.02,-.13,.24);
        fb(w.x-w.w/2-.2,w.x+w.w/2+.2,w.y+w.h+.02,w.y+w.h+.24,-.12,.25);
        for(const d of [-1,1])fb(w.x+d*(w.w/2+.10)-.10,w.x+d*(w.w/2+.10)+.10,w.y,w.y+w.h,-.1,.16);
      }
      if(near) {
        fb(w.x-.04,w.x+.04,w.y+.05,w.y+w.h-.05,-.62,-.38,'bronze');
        for(const f of [1/3,2/3])fb(w.x-w.w/2+.05,w.x+w.w/2-.05,w.y+w.h*f-.04,w.y+w.h*f+.04,-.62,-.38,'bronze');
      }
      // Sparse occupancy lights use the same recessed openings. Not surveyed.
      if(i%11===4&&!w.door)at(new THREE.PlaneGeometry(w.w*.35,w.h*.42).translate(w.x-w.w*.20,w.y+w.h*.27,-.40),'glow');
    }
    fb(-length/2,length/2,2.15,2.35,-.12,.16);
    fb(-length/2,length/2,top-.25,top+.12,-.12,.30);
    if(near)for(let y=2.65;y<top-.6;y+=.68) {
      // Horizontal block courses avoid all openings instead of painting over glass.
      let cuts=[[-length/2,length/2]];
      for(const w of windows)if(y>w.y-.25&&y<w.y+w.h+.3)cuts=cuts.flatMap(([lo,hi])=>{
        const a=w.x-w.w/2-.24,c=w.x+w.w/2+.24;
        if(hi<=a||lo>=c)return [[lo,hi]];
        return [[lo,Math.min(a,hi)],[Math.max(c,lo),hi]].filter(([u,v])=>v-u>.2);
      });
      for(const [lo,hi] of cuts)fb(lo,hi,y,y+.035,-.02,.08);
    }
  }
  // Behind the western colonnades are tall divided sash windows.
  const front=[];
  for(const x of [-32.7,-30.1,-27.5,-24.9,-22.3,-19.7,-17.1,16.3,18.9,21.5,24.1,26.7,29.3,31.9])front.push({x,y:2.65,w:1.62,h:7.9});
  for(const x of [-6,0,6])front.push({x,y:2.25,w:2.5,h:4.1,door:true});
  for(const x of [-6,0,6])front.push({x,y:7.2,w:2.8,h:4.1});
  facade(-.5,14.4,0,77.2,front,11.25);
  box('stone',-9.3,8.6,11.2,12.65,13.8,14.4);
  const rear=[];
  for(let x=-35;x<=35;x+=5)for(const y of [2.85,7.45])rear.push({x,y,w:2.35,h:3.25});
  facade(-.5,-19.0,Math.PI,77.2,rear);
  for(const x of [-39.0,38.0]) {
    const side=[];for(const u of [-13,-7,-1,5,11])side.push({x:u,y:2.65,w:2.25,h:7.85});
    facade(x,-1.0,x<0?-Math.PI/2:Math.PI/2,35.0,side);
  }
  // Low basement lights articulate the plinth without adding a second floor.
  for(const x of [-34,-29,-24,-19,17,22,27,32])put(new THREE.PlaneGeometry(1.6,.8).translate(x,1.1,16.55),'glass');
  // Rear central projecting stair block retains a two-storey bay rhythm.
  box('stone',-10.15,10.85,2.2,11.2,-21.6,-19.1);
  facade(.35,-21.8,Math.PI,21,[...[-7,0,7].flatMap(x=>[2.9,7.4].map(y=>({x,y,w:2.5,h:3.2})))],11.2);

  function column(x,z,base,top,r) {
    const height=top-base;
    box('stone',x-r*1.4,x+r*1.4,base-.03,base+.35,z-r*1.4,z+r*1.4);
    const profile=[[r*1.24,.32],[r*1.24,.48],[r*1.08,.63],[r,height*.26],[r*.94,height*.78],[r*.92,height-.65],[r*1.12,height-.56],[r*1.35,height-.12],[r*1.4,height]];
    put(new THREE.LatheGeometry((near?profile:[profile[0],profile[2],profile[4],profile[6],profile[8]]).map(([s,y])=>new THREE.Vector2(s,y)),segments).translate(x,base,z));
    box('stone',x-r*1.43,x+r*1.43,top-.04,top+.18,z-r*1.43,z+r*1.43);
    if(near) {
      // Corinthian leaf crown and four outward curled volutes; attached to
      // the tapered capital core, deliberately low-poly foliage.
      for(let i=0;i<8;i++) {
        const a=i*Math.PI/4;
        const leaf=new THREE.ConeGeometry(r*.23,.54,4).rotateZ(.20).rotateY(a);
        leaf.translate(x+Math.sin(a)*r*.93,top-.39,z+Math.cos(a)*r*.93);put(leaf);
      }
      for(const dx of [-1,1])for(const dz of [-1,1])ball(x+dx*r*.94,top-.13,z+dz*r*.94,r*.23);
      // Flute ridges remain within the shaft/capital envelope.
      for(let i=0;i<12;i++) {
        const a=i*Math.PI/6;
        b.bar('stone',[x+Math.sin(a)*r*.97,base+.7,z+Math.cos(a)*r*.97],[x+Math.sin(a)*r*.90,top-.65,z+Math.cos(a)*r*.90],.045,.045);
      }
    }
  }
  for(const x of PORTICO_COLUMNS)column(x,19.0,2.2,13.0,.53);
  for(const x of WING_COLUMNS)column(x,16.0,2.2,10.95,.38);
  // Tall pylon piers frame the open central colonnade, with a separate
  // recessed window and pediment on each face. No solid box fills the bays.
  for(const x of [-11.0,10.3]) {
    facade(x,20.0,0,3.6,[{x:0,y:2.6,w:1.75,h:5.2}],12.6);
    box('stone',x-1.8,x+1.8,2.2,12.6,14.45,19.36);
    for(const d of [-1,1])box('stone',x+d*1.60-.20,x+d*1.60+.20,2.2,12.6,19.8,20.3);
    const ped=shape([[-1.1,8.10],[1.1,8.10],[0,8.65]]);put(shell(ped,.3,20.42).translate(x,0,0));
    statueGroup(x,9.1,20.12,.53,true);
  }
  // Profiled horizontal entablatures, dentils, roof slabs and balustrades.
  function entablature(x0,x1,z0,z1,y,depth=1.2) {
    box('stone',x0,x1,y-.6,y,z0,z1);
    box('stone',x0-.18,x1+.18,y,y+.33,z0-.18,z1+.25);
    box('stone',x0-.32,x1+.32,y+.33,y+.55,z0-.30,z1+.38);
    if(near)for(let x=x0+.32;x<x1-.18;x+=.64)box('stone',x-.11,x+.11,y-.14,y+.13,z1-.05,z1+.27);
  }
  entablature(-39.45,-12.8,13.6,17.10,11.35);
  entablature(12.1,38.45,13.6,17.10,11.35);
  entablature(-13.0,12.3,14.2,20.45,13.75);
  // Side/back cornices join the front instead of unsupported beams.
  entablature(-39.4,38.4,-19.45,-18.4,11.35);
  for(const x of [-39.4,38.2])entablature(x-.45,x+.45,-19.0,16.9,11.35);
  // Low pitched rear roof visible only from above, contained by parapets.
  const roofShape=shape([[-13.15,12.0],[18.25,12.0],[2.5,12.8]]);
  const roof= shell(roofShape,75.4,37.2);roof.rotateY(Math.PI/2);put(strip(roof,(_x,y)=>y<-.9),'roof');
  function balustrade(x0,x1,z,y) {
    box('stone',x0,x1,y,y+.18,z-.25,z+.25);
    box('stone',x0,x1,y+.96,y+1.14,z-.28,z+.28);
    const step=near?.82:1.3;
    for(let x=x0+.25;x<x1-.1;x+=step) {
      const profile=[[.13,0],[.13,.12],[.075,.24],[.12,.43],[.075,.62],[.12,.76],[.12,.82]];
      put(new THREE.LatheGeometry((near?profile:[profile[0],profile[3],profile[6]]).map(q=>new THREE.Vector2(...q)),near?6:4).translate(x,y+.16,z));
    }
    for(let x=x0;x<=x1;x+=6)box('stone',x-.25,x+.25,y,y+1.14,z-.34,z+.34);
  }
  balustrade(-38.95,-13.0,16.65,11.90);balustrade(12.3,38.0,16.65,11.90);
  balustrade(-8.85,8.15,19.75,14.30);
  // Rear/side parapets, cheaper than full unseen balusters.
  box('stone',-39.0,38.0,11.9,12.85,-19.0,-18.55);
  for(const x of [-38.8,37.8])box('stone',x-.22,x+.22,11.9,12.85,-19.0,16.9);

  function human(x,y,z,h,seated=false) {
    const leg=seated?h*.28:h*.45;
    const g=new THREE.ConeGeometry(h*.16,h*.51,near?6:4).translate(x,y+leg+h*.28,z);put(g);
    ball(x,y+h*.9,z,h*.095);
    for(const d of [-1,1]) {
      b.bar('stone',[x+d*h*.065,y,z],[x+d*h*.075,y+leg+.04,z],h*.10,h*.12);
      b.bar('stone',[x+d*h*.13,y+h*.70,z],[x+d*h*.24,y+h*.42,z+h*.03],h*.08,h*.085);
    }
  }
  function statueGroup(x,y,z,scale=1,relief=false) {
    box('stone',x-1.45*scale,x+1.45*scale,y,y+.20*scale,z-.40*scale,z+.40*scale);
    human(x,y+.17*scale,z,2.6*scale);
    for(const d of [-1,1])human(x+d*.82*scale,y+.17*scale,z,1.9*scale,true);
  }
  function pylon(x,z,y,central) {
    const w=central?3.65:3.0;
    box('stone',x-w/2-.15,x+w/2+.15,y,y+.34,z-1.3,z+1.3);
    box('stone',x-w/2,x+w/2,y+.32,y+1.25,z-1.1,z+1.1);
    box('stone',x-w*.4,x+w*.4,y+1.22,y+2.65,z-.90,z+.9);
    box('stone',x-w*.43,x+w*.43,y+2.63,y+2.88,z-1.0,z+1.0);
    // Circular medallion is carved stone, rather than a pasted dark disk.
    const disc=new THREE.CylinderGeometry(.63,.63,.19,near?20:10).rotateX(Math.PI/2).translate(x,y+1.75,z+1.02);put(disc);
    statueGroup(x,y+2.85,z,central?1.36:.86);
  }
  pylon(-11.0,18.8,14.14,true);pylon(10.3,18.8,14.14,true);
  for(const x of [-37.0,35.5])pylon(x,15.45,11.90,false);
  // Ornament urns are visibly grounded in the rail/piers in either LOD.
  for(const x of [-31,-25,-19,18,24,30]) {
    box('stone',x-.25,x+.25,13.0,13.2,16.4,16.9);
    cyl(x,13.17,16.65,.19,.32,near?8:4,.27);ball(x,13.54,16.65,.23);
    put(new THREE.ConeGeometry(.13,.29,near?8:4).translate(x,13.89,16.65));
  }
  // Broad stair is continuous from local grade to the portico floor.
  box('stone',-9.7,9.1,0,2.2,19.8,21.5);
  for(let i=0;i<11;i++)box('stone',-9.7,9.1,0,2.2-i*.2,21.5+i*.4,21.92+i*.4);
  for(const x of [-10.8,10.2]) {
    const cheek=shape([[19.8,0],[26.0,0],[26.0,.48],[21.3,2.65],[19.8,2.65]]);
    const g=shell(cheek,.85,-x+.425).rotateY(-Math.PI/2);
    put(g);
  }
  // Stair handrails are omitted at far: no suspended/truncated ends. In near
  // each sloping rail ends at a grounded post, which is independently tested.
  if(near)for(const x of [-8.7,-3.1,2.5,8.1]) {
    const ends=[[x,3.16,21.5],[x,1.15,25.50]];
    b.bar('iron',ends[0],ends[1],.055,.055);
    for(const [px,y,z] of ends)b.bar('iron',[px,0,z],[px,y+.04,z],.075,.075);
  }
  const root=b.finish(),a=THREE.MathUtils.degToRad(SPEC.rotationDeg);
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(a);o.geometry=mergeVertices(o.geometry,1e-4);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  return root;
}
