import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

const C=Math.cos(SPEC.rotation),S=Math.sin(SPEC.rotation);
// u east-northeast along the processional axis, v toward its south side.
export const plan=(u,y,v)=>[u*C+v*S,y,-u*S+v*C];
export const GATES=[{u:38.77,v:.35,depth:2.4,width:3.58,top:6.70,soffit:5.00,opening:1.65},
                    {u:59.13,v:.28,depth:3.06,width:3.94,top:7.00,soffit:5.25,opening:1.75}];
export const BASE=.5;
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function put(g,mat='stone') {
    g.computeBoundingBox();
    // Main sanctuary has an 8 cm/m inward batter in both axes. The two
    // full columns stand 28 cm in front of that screen; their capital still
    // reaches the supported lintel. Gate jambs have their own slight batter.
    if(mat==='stone' && g.boundingBox.max.x<10 && g.boundingBox.max.z<7.5) {
      const p=g.attributes.position;
      for(let i=0;i<p.count;i++) {
        const y=p.getY(i), t=Math.max(0,y-BASE)*.08;
        p.setX(i,-.63+(p.getX(i)+.63)*(1-t/9.925));
        p.setZ(i,.56+(p.getZ(i)-.56)*(1-t/6.275));
      }
      p.needsUpdate=true;
    }
    g.rotateY(SPEC.rotation);const merged=mergeVertices(g);g.dispose();b.put(merged,mat==='weather'?'stone':mat);
  }
  function box(u,y,v,w,h,d,mat='stone') {const g=new THREE.BoxGeometry(w,h,d);g.translate(u,y,v);put(g,mat);}
  // Rectangular loft; y profiles create battered sides and the concave Egyptian cornice.
  function loft(u,v,levels,mat='stone',topMat=null) {
    const p=[],idx=[];
    for(const [y,w,d] of levels) p.push(u-w/2,y,v-d/2,u-w/2,y,v+d/2,u+w/2,y,v+d/2,u+w/2,y,v-d/2);
    for(let k=1;k<levels.length;k++) for(let i=0;i<4;i++) {
      const a=(k-1)*4+i,c=(k-1)*4+(i+1)%4,aa=k*4+i,cc=k*4+(i+1)%4;
      idx.push(a,c,aa,c,cc,aa);
    }
    const n=(levels.length-1)*4;idx.push(0,2,1,0,3,2);
    if(topMat) {
      const cap=new THREE.BufferGeometry();
      cap.setAttribute('position',new THREE.Float32BufferAttribute([n,n+1,n+2,n,n+2,n+3].flatMap(i=>p.slice(i*3,i*3+3)),3));
      cap.computeVertexNormals();put(cap,topMat);
    } else idx.push(n,n+1,n+2,n,n+2,n+3);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);
    const flat=g.toNonIndexed();flat.computeVertexNormals();put(flat,mat);g.dispose();
  }
  // One solid block per course cell. Slightly inset bevel edges give joints without
  // coplanar facade decals or a second wall behind the masonry.
  function masonry(u,y,v,w,h,d,seed=0) {
    const rows=Math.max(1,Math.round(h/(near?.43:.85)));
    for(let r=0;r<rows;r++) {
      const cells=Math.max(1,Math.round(w/(near?1.02:2.1))),dy=h/rows;
      const cuts=[-w/2];
      for(let k=1;k<cells;k++) cuts.push(-w/2+w*(k+(r%2?.22:-.12))/cells);
      cuts.push(w/2);
      for(let k=0;k<cuts.length-1;k++) {
        const ww=cuts[k+1]-cuts[k],x=u+(cuts[k+1]+cuts[k])/2,y0=y-h/2+r*dy;
        const mat='stone';
        if(near) loft(x,v,[[y0,ww-.025,d-.025],[y0+.022,ww,d],[y0+dy-.022,ww,d],[y0+dy,ww-.025,d-.025]],mat);
        else box(x,y0+dy/2,v,ww,dy,d,mat);
      }
    }
  }
  function cornice(u,v,w,d,y,h=.70,projection=.8) {
    const f=projection*2;
    const levels=[[y,w,d],[y+.10,w+.08,d+.08],[y+h*.40,w+f*.18,d+f*.18],
      [y+h*.70,w+f*.52,d+f*.52],[y+h,w+f,d+f],[y+h+.12,w+f,d+f]];
    loft(u,v,near?levels:[levels[0],levels[2],levels[3],levels[4],levels[5]],'weather','cornice');
    // Four rounded torus rolls meet at the corners and bear against the
    // cornice neck; same material avoids competing trim depth ranks.
    const r=.14, yy=y+.02;
    for(const z of [v-d/2,v+d/2]) {
      const g=new THREE.CylinderGeometry(r,r,w+2*r,near?8:5,1);
      g.rotateZ(Math.PI/2);g.translate(u,yy,z);put(g,'weather');
    }
    for(const x of [u-w/2,u+w/2]) {
      const g=new THREE.CylinderGeometry(r,r,d+2*r,near?8:5,1);
      g.rotateX(Math.PI/2);g.translate(x,yy,v);put(g,'weather');
    }
  }
  // Basin bed, four shallow water panels and coping. Water is opaque texture-free
  // material, partitioned around the island so no buried competing surface exists.
  box(25,.075,2.5,88,.15,38,'platform');
  for(const v of [-13.9,18.9]) box(25,.175,v,84,.05,1.2,'platform');
  for(const u of [-16.4,66.4]) box(u,.175,2.5,1.2,.05,31.6,'platform');
  for(const v of [-10.9,15.9]) box(25,.17,v,81.6,.04,4.8,'water');
  for(const u of [-13.7,63.7]) box(u,.17,2.5,4.2,.04,22,'water');
  // Central rigid stone island, 35cm above the shallow basin bed.
  box(25,.325,2.5,73,.35,22,'platform');
  // West/back mass and sanctuary side walls. Published 12×15m describes the
  // ancient core; the OSM reconstructed outer enclosure is ~20×12.6m.
  masonry(-10.35,3.10,.56,1.0,5.20,12.3,2);
  for(const v of [-5.19,6.36]) masonry(-.62,3.10,v,18.46,5.20,1.0,v>0?3:4);
  // Interior cross wall is recessed ~3m behind the front screen, with an axial door.
  for(const v of [-3.10,3.89]) masonry(5.15,2.75,v,1.05,4.50,4.0,5);
  masonry(5.15,5.10,.39,1.05,.20,2.0,6);
  box(4.58,2.08,.39,.15,3.16,1.70,'bronze');
  box(6.50,4.1,.56,.15,2.6,9.3,'recess');
  // Reconstructed pronaos: central entrance and four upper intercolumnar openings.
  // Lower screen wall stops at 2.55m, with a true central doorway.
  for(const v of [-3.22,3.95]) masonry(8.54,1.40,v,1.03,1.80,4.23,7);
  for(const v of [-5.18,6.33]) masonry(8.54,3.95,v,1.03,3.30,1.0,8);
  masonry(8.54,3.02,.4,1.03,.94,1.72,9);
  // Three slender columns, the middle over the doorway lintel; flared palm capitals.
  for(const v of [-2.30,.40,3.10]) {
    const g=new THREE.CylinderGeometry(.27,.32,2.52,near?8:6);g.translate(8.82,3.56,v);put(g);
    loft(8.82,v,[[4.82,.54,.54],[5.04,.85,.85],[5.20,.94,.94]]);
    box(8.82,5.28,v,1.00,.16,1.00);
  }
  masonry(8.54,5.53,.56,1.03,.34,12.55,12);
  // Continuous flat roof and perimeter cavetto cornice; no modern pitched cap.
  box(-.63,5.65,.56,19.85,.10,12.55,'stone');
  cornice(-.63,.56,19.02,11.72,5.70,.70,.8);
  // Lower south stair/annex room, visible in the mapped stepped L outline.
  masonry(5.75,2.21,9.80,4.4,3.42,5.87,13);
  cornice(5.75,9.80,4.40,5.87,3.92,.30,.35);
  // Freestanding portals: separate piers and supported lintels keep holes open at far.
  for(const [i,g] of GATES.entries()) {
    const pierW=(g.width-g.opening)/2, y0=BASE;
    for(const s of [-1,1]) {
      const v=g.v+s*(g.opening/2+pierW/2);
      masonry(g.u,(y0+g.soffit)/2,v,g.depth,g.soffit-y0,pierW,20+i+s);
    }
    masonry(g.u,(g.soffit+g.top-.92)/2,g.v,g.depth,g.top-.92-g.soffit,g.width,24+i);
    cornice(g.u,g.v,g.depth,g.width,g.top-.92,.80,.48);
    // Torus framing carved as integral stone strips; same material, attached to
    // portal jambs. No dark panels across the opening.
    if(near) for(const s of [-1,1]) {
      const v=g.v+s*(g.opening/2+.11);
      box(g.u+g.depth/2+.035,(BASE+g.soffit)/2,v,.10,g.soffit-BASE,.14);
    }
  }
  const root=b.finish(); root.userData.orientation='77.5 degrees east-facing, rotation baked';return root;
}
