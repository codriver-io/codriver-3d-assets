import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, STRUCTURE, PIERS, HALF, boxDepth } from './storseisundet-bridge-profile.js';

// Original texture-free cantilever bridge, authored in the mapped station frame.
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', b=bridgeBuilder({...p,meshStep:near?2:4},detail);
  const L=p.BRIDGE_LENGTH, [A,Z]=STRUCTURE, h=p.deckHeight;
  const material=m=>near?m:({rockLight:'rock',yellow:'paint'}[m]||m);
  const put=(g,m,lift=1)=>b.put(g,material(m),0,lift);
  const box=(m,s,d,y,l,w,t,lift=1)=>b.box(material(m),s,d,y,l,w,t,0,lift);
  function stations(a,c,step=near?2:4) {
    return [...new Set([a,c,...p.ALIGNMENT.map(q=>q.s),...p.knots.map(q=>q[0]),...PIERS,
      ...Array.from({length:Math.ceil((c-a)/step)},(_,i)=>a+i*step)])]
      .filter(s=>s>=a&&s<=c).sort((a,c)=>a-c);
  }
  // Closed loft. Rings are clockwise in lateral/height, so the top faces point up.
  function loft(a,c,section,m,lift=1,step,openBase=false) {
    const ss=stations(a,c,step), n=section(ss[0]).length, pos=[], ix=[];
    for(const s of ss) for(const [d,y] of section(s)) pos.push(...b.xyz(s,d,y));
    for(let j=1;j<ss.length;j++) for(let k=0;k<n;k++) {
      if(openBase&&k===n-2)continue;
      const v=(j-1)*n+k,w=(j-1)*n+(k+1)%n,t=j*n+k,u=j*n+(k+1)%n;
      ix.push(v,w,t,w,u,t);
    }
    for(const [end,reverse] of [[0,false],[ss.length-1,true]]) {
      const points=section(ss[end]).map(([d,y])=>new THREE.Vector2(d,y));
      for(const tri of THREE.ShapeUtils.triangulateShape(points,[])) {
        const face=tri.map(k=>end*n+k);ix.push(...(reverse?face.reverse():face));
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const good=[];
    for(let i=0;i<ix.length;i+=3){
      const v=ix.slice(i,i+3).map(k=>new THREE.Vector3(...pos.slice(k*3,k*3+3)));
      if(v[1].sub(v[0]).cross(v[2].sub(v[0])).lengthSq()>1e-12)good.push(...ix.slice(i,i+3));
    }
    g.setIndex(good);const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();
    const merged=mergeVertices(flat);flat.dispose();put(merged,m,lift);
  }
  // One continuous tapered box. Top flange projects past sloping box webs.
  loft(A,Z,s=>{
    const y=h(s)-0.15,depth=boxDepth(s);
    return [[-HALF,y],[HALF,y],[HALF,y-0.35],[2.5,y-0.62],[2.05,y-depth],[-2.05,y-depth],[-2.5,y-0.62],[-HALF,y-0.35]];
  },'concrete');
  // Approach slabs taper to zero thickness at the at-grade roadway, avoiding below-grade blocks.
  for(const [a,c] of [[0,A],[Z,L]]) loft(a,c,s=>{
    const y=h(s)-Math.min(0.15,h(s)*0.3),bottom=Math.max(0,h(s)-0.55);
    return [[-HALF,y],[HALF,y],[HALF,bottom],[-HALF,bottom]];
  },'concrete');
  b.strip('asphalt',0,L,-3.15,3.15,0);
  for(const sign of [-1,1]) {
    const band=(a,c)=>sign>0?[a,c]:[-c,-a];
    loft(0,L,s=>{const [l,r]=band(3.17,3.65),y=h(s)+0.13,bottom=Math.max(0,h(s)-0.19);
      return [[l,y],[r,y],[r,bottom],[l,bottom]];},'concrete');
    b.strip('paint',0,L,...band(2.91,3.03),0.04);
    // Galvanized W-beam safety barrier, upper parapet handrail.
    loft(0,L,s=>{
      const d=sign*3.53,y=h(s)+0.55;
      return near?[[d-0.07,y+0.17],[d+0.045,y+0.12],[d-0.035,y],[d+0.045,y-0.12],
        [d-0.07,y-0.17],[d-0.105,y-0.15],[d-0.075,y],[d-0.105,y+0.15]]
        :[[d-0.065,y+0.17],[d+0.045,y+0.17],[d+0.045,y-0.17],[d-0.065,y-0.17]];
    },'rail',1,near?3:6);
    loft(0,L,s=>{
      const d=sign*3.53,y=h(s)+1.10;
      return [[d-0.045,y+0.05],[d+0.045,y+0.05],[d+0.045,y-0.05],[d-0.045,y-0.05]];
    },'rail',1,near?3:6);
    for(let s=1;s<L;s+=near?2:8) {
      box('rail',s,sign*3.53,h(s)+0.62,0.09,0.095,0.96);
      if(near) {
        box('rail',s,sign*3.53,h(s)+0.17,0.22,0.24,0.08);
        // Small reflector units on the existing posts, no poles inside lanes.
        if(Math.round((s-1)/2)%6===0) box('paint',s,sign*3.43,h(s)+0.67,0.13,0.12,0.19);
      }
    }
  }
  // Norwegian yellow dashed centre line. White edges remain in both LODs.
  for(let s=3;s<L-3;s+=12) b.strip(material('yellow'),s,Math.min(s+3,L),-0.06,0.06,0.045);
  // Slender rectangular piers terminate exactly at the variable-depth box soffit.
  for(const s of PIERS) {
    const top=h(s)-0.15-boxDepth(s),base=0.8;
    box('concrete',s,0,base/2,5.3,6.1,base,0);
    loft(s-1.35,s+1.35,ss=>[[-2.45,top],[2.45,top],[2.75,base],[-2.75,base]],'concrete',y=>Math.max(0,Math.min(1,(y-base)/(top-base))));
    // Bearing ledge is embedded into the box haunch, never floating below it.
    box('soffit',s,0,top+0.05,2.9,4.3,0.30);
  }
  // Abutment walls and engineered rock-fill approach embankments; no surrounding island/DEM.
  for(const s of STRUCTURE) {
    box('concrete',s,0,5.7,1.65,7.5,11.4,y=>Math.min(1,Math.max(0,y/12)));
    box('soffit',s,0,11.45,2.0,7.6,0.30);
  }
  for(const [a,c] of [[2,A-1.0],[Z+1.0,L-2]]) {
    loft(a,c,s=>{
      const y=Math.max(0.015,h(s)-0.65),w=HALF+1.0+y*0.65;
      return [[-3.52,y],[3.52,y],[w,0],[-w,0]];
    },'rock',y=>y>0.005?1:0,near?4:12,true);
    if(near) {
      // Deterministic fractured rock panels on the slopes, attached to the engineered fill.
      for(let s=a+2;s<c-2;s+=4.8) for(const sign of [-1,1]) {
        const y=Math.max(0,h(s)-0.65);if(y<0.5)continue;
        for(let row=0;row<3;row++) {
          const t=(row+0.5)/3,w=HALF+1+y*0.65,d=sign*(3.52+(w-3.52)*t);
          const yy=y*(1-t);
          const g=new THREE.IcosahedronGeometry(0.48,0);
          g.scale(1.8,0.7,1.0);const q=p.bridgePoint(s,d,yy);g.translate(q.x,q.y,q.z);
          put(g,(row+Math.floor(s/4.8))%3?'rock':'rockLight',1-t);
        }
      }
    }
  }
  const model=b.finish();model.userData.structureStations=STRUCTURE;model.userData.pierStations=PIERS;
  return model;
}
