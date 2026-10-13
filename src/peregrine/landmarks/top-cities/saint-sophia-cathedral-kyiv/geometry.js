import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS } from './saint-sophia-cathedral-kyiv-parts.js';

// Original metre-scale exterior: layered gallery wings, mapped dome centres and
// a four-tier pierced belfry. No app runtime imports, textures or external meshes.
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,m)=>b.put(g,m), box=(m,x,y,z,w,h,d,a=0)=>b.box(m,[x,y,z],[w,h,d],a);
  const rotate=(x,z,a)=>[x*Math.cos(a)+z*Math.sin(a),z*Math.cos(a)-x*Math.sin(a)];
  const center=r=>r.reduce((s,v)=>[s[0]+v[0]/r.length,s[1]+v[1]/r.length],[0,0]);
  function solid(r,y0,y1,m) {
    const s=new THREE.Shape();r.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
    const g=new THREE.ExtrudeGeometry(s,{depth:y1-y0,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y0,0);
    // Internal bottoms are buried in the lower continuous gallery or footing.
    // Remove them rather than spend far bytes on unseen coincident surfaces.
    if(y0>=0) {
      const pos=g.attributes.position,norm=g.attributes.normal,pp=[],nn=[];
      for(let i=0;i<pos.count;i+=3){if(norm.getY(i)<-.9 || (m==='base'&&norm.getY(i)>.9))continue;for(let j=i;j<i+3;j++){pp.push(pos.getX(j),pos.getY(j),pos.getZ(j));nn.push(norm.getX(j),norm.getY(j),norm.getZ(j));}}
      g.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nn,3));g.deleteAttribute('uv');
    }
    put(g,m);
  }
  function roof(r,y,rise,shrink=.65) {
    r=r.slice();let area=0;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length];area+=p[0]*q[1]-q[0]*p[1];}if(area<0)r.reverse();
    const [cx,cz]=center(r),p=[],ix=[];
    // A closed hipped shell, authored with upward-facing winding.
    for(const [x,z]of r)p.push(x,y,z);
    for(const [x,z]of r)p.push(cx+(x-cx)*shrink,y+rise,cz+(z-cz)*shrink);
    const n=r.length;
    for(let i=0;i<n;i++){let j=(i+1)%n;ix.push(i,n+i,j,j,n+i,n+j);}
    const top=THREE.ShapeUtils.triangulateShape(r.map(([x,z])=>new THREE.Vector2(x,z)),[]);
    for(const [i,j,k]of top)ix.push(n+i,n+k,n+j);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();put(g,'roof');
  }
  function lathe(m,x,z,profile,n=near?24:10) {
    const g=new THREE.LatheGeometry(profile.map(v=>new THREE.Vector2(...v)),n);g.translate(x,0,z);put(g,m);
  }
  function cylinder(m,x,z,r,y0,y1,n=near?16:8) {
    const g=new THREE.CylinderGeometry(r,r,y1-y0,n);g.translate(x,(y0+y1)/2,z);put(g,m);
  }
  function archShape(w,bottom,spring,segments=near?12:6) {
    const s=new THREE.Shape(),r=w/2;s.moveTo(-r,bottom);s.lineTo(r,bottom);
    for(let i=0;i<=segments;i++){const a=i*Math.PI/segments;s.lineTo(r*Math.cos(a),spring+r*Math.sin(a));}s.closePath();return s;
  }
  function panel(x,z,a,w,bottom,spring,m='glass') {
    const g=new THREE.ShapeGeometry(archShape(w,bottom,spring));g.rotateY(a);g.translate(x,0,z);put(g,m);

  }
  function facade(r,y0,y1) {
    // Separate arched windows survive far. Offset is outward from the mapped wall.
    let area=0;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length];area+=p[0]*q[1]-q[0]*p[1];}
    for(let i=0;i<r.length;i++) {
      const [x,z]=r[i],[u,v]=r[(i+1)%r.length],len=Math.hypot(u-x,v-z);if(len<4)continue;
      const nx=(v-z)/len*(area>0?1:-1),nz=-(u-x)/len*(area>0?1:-1),a=Math.atan2(nx,nz);
      const count=Math.max(1,Math.floor(len/5));
      for(let j=0;j<count;j++) {
        const t=(j+.5)/count,px=x+(u-x)*t+nx*.22,pz=z+(v-z)*t+nz*.22;
        panel(px,pz,a,1.15,y0+1.2,Math.min(y0+3.5,y1-1.0));
        if(near)box('stone',px,y0+.9,pz,1.8,.25,.5,a);
      }
    }
  }
  // Outer gallery: measured OSM perimeter rather than a generic rectangle.
  solid(PARTS[27830282],0,.5,'base');
  solid(PARTS[27830282],.5,6.8,'stone');
  roof(PARTS[433842691],6.9,3.1,.18);
  facade(PARTS[27830282],.5,6.8);
  for(const [id,top]of [[433842667,9],[433842668,9.5],[433842677,10],[433842678,10]]) {
    const r=PARTS[id];solid(r,6.8,top,'stone');roof(r,top,3.0,.12);
    facade(r,6.7,top);
  }
  for(const [x,z,a,y] of [[-12,14,0,9],[-12,-37,Math.PI,9],[7,14,0,9],[6,-42.5,Math.PI,8.8]]) {
    // Supported stepped Baroque gables rise through the pitched roof field.
    // Polygon steps keep their silhouette in far without costly curved carving.
    const contour=[[-3.8,0],[3.8,0],[3.8,1.0],[3.1,1.0],[3.1,1.8],[2.2,2.2],[1.65,3.3],[1.65,4.1],[.85,4.1],[0,4.9],[-.85,4.1],[-1.65,4.1],[-1.65,3.3],[-2.2,2.2],[-3.1,1.8],[-3.1,1.0],[-3.8,1.0]];
    const s=new THREE.Shape();contour.forEach(([px,py],i)=>i?s.lineTo(px,py):s.moveTo(px,py));s.closePath();
    const g=new THREE.ExtrudeGeometry(s,{depth:.8,bevelEnabled:false});g.translate(0,y,-.4);g.rotateY(a);g.translate(x,0,z);put(g,'stone');
  }
  function dome(x,z,r,drum0,eave,crown,tip,main=false) {
    cylinder('stone',x,z,r*.79,drum0,eave,near?24:10);
    cylinder('stone',x,z,r*.86,eave-.55,eave,near?24:10);
    for(let i=0;i<8;i++) {
      const a=i*Math.PI/4,[dx,dz]=rotate(0,r*.79+.2,a);
      panel(x+dx,z+dz,a,r*.3,drum0+1,eave-1.5);
      const [px,pz]=rotate(r*.52,r*.61,a);
      if(near)box('stone',x+px,(drum0+eave)/2,z+pz,.25,eave-drum0,.38,a);
    }
    const h=crown-eave;
    // Photo-calibrated pear: a flared eave, high rounded shoulder and long
    // steeply contracting upper flank. The shoulder sits over 5 m above the
    // main drum; reducing the diameter removes the previous squat onion read.
    // Both LODs sample the same vertical profile, including the pinched neck.
    lathe(main?'gold':'roof',x,z,[[r*.86,eave],[r*.90,eave+.16],[r*.79,eave+h*.12],[r*.83,eave+h*.30],[r*.96,eave+h*.44],[r,eave+h*.55],[r*.95,eave+h*.64],[r*.72,eave+h*.76],[r*.40,eave+h*.86],[r*.19,eave+h*.94],[r*.17,crown]]);
    // Gold lantern, miniature pear cap and continuous cross stem.
    const small=r*.17,lanternTop=crown+(tip-crown)*.39;
    cylinder('gold',x,z,small,crown,lanternTop,near?12:8);
    for(let i=0;i<(near?8:4);i++) {
      const a=i*Math.PI/(near?4:2),[dx,dz]=rotate(0,small+.12,a);
      panel(x+dx,z+dz,a,small*.55,crown+.16,lanternTop-.2);
    }
    const capTop=tip-1.8;
    cylinder('gold',x,z,small*.15,capTop-.1,capTop,near?12:6);
    lathe('gold',x,z,[[small,lanternTop],[small*1.25,lanternTop+.25],[small*1.1,(lanternTop+capTop)/2],[small*.15,capTop]],near?16:8);
    box('gold',x,tip-.9,z,.14,1.8,.14);
    box('gold',x,tip-.7,z,.85,.14,.14);
  }
  const central=center(PARTS[433842712]);dome(...central,4.7,10.2,18.5,27.9,32,true);
  for(const id of [433842706,433842707,433842709,433842710,433842713,433842714])dome(...center(PARTS[id]),3.25,10,14.6,22.1,25.5);
  for(const id of [433842692,433842694,433842695,433842696]) {
    const [x,z]=center(PARTS[id]);cylinder('stone',x,z,2.45,7.5,11.4,near?16:8);
    for(let i=0;i<4;i++){const a=i*Math.PI/2,[dx,dz]=rotate(0,2.55,a);panel(x+dx,z+dz,a,.75,8.2,10.3);}
    lathe('roof',x,z,[[2.55,11.4],[2.9,11.55],[2.65,12.6],[1.9,13.8],[.55,14.7],[.15,15]],near?20:10);
  }
  // Two low peripheral chapel caps complete the thirteen-dome composition.
  for(const [x,z]of [[-14,-11],[-14,-19]]) {
    cylinder('stone',x,z,1.7,6.8,8.5);
    lathe('roof',x,z,[[1.8,8.5],[2.0,8.65],[1.5,9.5],[.5,10.3],[0,10.5]],near?16:8);
  }
  // Exposed medieval brick apses are a defining surviving contrast to white stucco.
  // Outer mapped east-face lobes: segment-shaped patches, not a full brick building.
  const apseEdges=PARTS[27830282];
  for(let i=0;i<apseEdges.length;i++) {
    const p=apseEdges[i],q=apseEdges[(i+1)%apseEdges.length],len=Math.hypot(q[0]-p[0],q[1]-p[1]);
    if(p[0]<16 || q[0]<16 || len<.8 || len>5)continue;
    // Outer parent ring is clockwise in x/z: reverse the CCW outward normal.
    const a=Math.atan2(-(q[1]-p[1])/len,(q[0]-p[0])/len);
    const [dx,dz]=rotate(0,.25,a);
    box('brick',(p[0]+q[0])/2+dx,4.1,(p[1]+q[1])/2+dz,len-.12,5.0,.18,a);
    if(len>2)panel((p[0]+q[0])/2+dx*2.48,(p[1]+q[1])/2+dz*2.48,a,Math.min(1.1,len-.6),1.4,5.0);
    if(near)for(const y of [2.2,3.3,4.4,5.5,6.2])box('brick',(p[0]+q[0])/2+dx*1.4,y,(p[1]+q[1])/2+dz*1.4,len,.10,.15,a);
  }
  // Tall blue-and-white belfry: detached and independently oriented from OSM.
  const towerWorld=[62.1,-7.15],tower=rotate(...towerWorld,-SPEC.yaw),towerYaw=(30.5-36)*Math.PI/180;
  function towerPut(g,m){g.rotateY(towerYaw);g.translate(tower[0],0,tower[1]);put(g,m);}
  function towerBox(m,x,y,z,w,h,d,a=0) {const g=new THREE.BoxGeometry(w,h,d);g.rotateY(a);g.translate(x,y,z);towerPut(g,m);}
  function octagon(w,d,c=2.5){return [[-w/2+c,-d/2],[w/2-c,-d/2],[w/2,-d/2+c],[w/2,d/2-c],[w/2-c,d/2],[-w/2+c,d/2],[-w/2,d/2-c],[-w/2,-d/2+c]];}
  function tier(w,d,y0,y1,opening,round=false) {
    const r=octagon(w,d,w*.15);
    for(let i=0;i<r.length;i++) {
      const p=r[i],q=r[(i+1)%r.length],len=Math.hypot(q[0]-p[0],q[1]-p[1]),a=Math.atan2(q[1]-p[1],-(q[0]-p[0]));
      const s=new THREE.Shape();s.moveTo(-len/2,y0);s.lineTo(len/2,y0);s.lineTo(len/2,y1);s.lineTo(-len/2,y1);s.closePath();
      const cardinal=i%2===0;
      if(cardinal && opening) {
        // Subtract true arch or circular opening from the supporting blue wall.
        const hole=round?new THREE.Path():archShape(opening,y0+(y0===0?0:1.2),y1-opening/2-1.5);
        if(round){const n=near?20:10;for(let j=0;j<n;j++){const t=-j*Math.PI*2/n,px=opening/2*Math.cos(t),py=(y0+y1)/2+opening/2*Math.sin(t);j?hole.lineTo(px,py):hole.moveTo(px,py);}hole.closePath();}
        s.holes.push(hole);
      }
      const g=new THREE.ExtrudeGeometry(s,{depth:1.1,bevelEnabled:false,curveSegments:near?12:4});
      g.translate(0,0,-1.1);g.rotateY(a);g.translate((p[0]+q[0])/2,0,(p[1]+q[1])/2);towerPut(g,'blue');
      // White pilasters and connected cornices frame each facet.
      for(const side of [-1,1]){const [dx,dz]=rotate(side*(len/2-.52),.22,a);towerBox('stone',(p[0]+q[0])/2+dx,(y0+y1)/2,(p[1]+q[1])/2+dz,.72,y1-y0,.6,a);}
      for(const y of [y0+(y0===0?.4:.2),y1-.5]){const [dx,dz]=rotate(0,.2,a);towerBox('stone',(p[0]+q[0])/2+dx,y,(p[1]+q[1])/2+dz,len+.1,.75,1.0,a);}
      if(cardinal && opening && !round) {
        const radius=opening/2,spring=y1-radius-1.5,arch=new THREE.Shape();
        for(let j=0;j<=(near?12:6);j++){const t=j*Math.PI/(near?12:6),rr=radius+.48;const x=rr*Math.cos(t),y=spring+rr*Math.sin(t);j?arch.lineTo(x,y):arch.moveTo(x,y);}
        for(let j=(near?12:6);j>=0;j--){const t=j*Math.PI/(near?12:6);arch.lineTo(radius*Math.cos(t),spring+radius*Math.sin(t));}arch.closePath();
        const ar=new THREE.ExtrudeGeometry(arch,{depth:.6,bevelEnabled:false});ar.translate(0,0,-.1);ar.rotateY(a);ar.translate((p[0]+q[0])/2,0,(p[1]+q[1])/2);towerPut(ar,'stone');
        for(const sign of [-1,1]){const [dx,dz]=rotate(sign*(radius+.24),.2,a);towerBox('stone',(p[0]+q[0])/2+dx,(y0+(y0===0?0:1.2)+spring)/2,(p[1]+q[1])/2+dz,.48,spring-y0-(y0===0?0:1.2),.6,a);}
      }
      if(near)for(let j=0;j<3;j++) {
        const sign=j%2?1:-1, xx=sign*(len/2-1.55), yy=y0+(j+1)*(y1-y0)/4;
        if(!cardinal || len>9){const [dx,dz]=rotate(xx,.34,a);const rosette=new THREE.TorusGeometry(.34,.09,4,8);rosette.rotateY(a);rosette.translate((p[0]+q[0])/2+dx,yy,(p[1]+q[1])/2+dz);towerPut(rosette,'stone');}
      }
    }
    // Tier floor above openings leaves the entire lowest entrance passage clear.
    if(y0>0){const g=new THREE.CylinderGeometry(w*.43,w*.43,.5,8);g.translate(0,y0+.1,0);towerPut(g,'stone');}
  }
  tier(19.3,21.0,0,13,5.0);tier(18.8,20.3,13,27,5.2);
  tier(16.0,17.4,27,38,3.0,true);tier(14.0,15.1,38,51,4.2);
  // Main bell suspended from a stone floor inside the open second gallery.
  lathe('gold',tower[0],tower[1],[[1.45,20.2],[1.2,20.4],[.85,21.5],[.55,22.5],[.2,23.0]],near?16:8);
  box('gold',tower[0],25,tower[1],.22,4,.22);
  // Pear-shaped roof + upper lantern + smaller onion and cross, top exactly 76 m.
  const [tx,tz]=tower;
  cylinder('gold',tx,tz,7.4,50.8,51,near?32:12);
  lathe('gold',tx,tz,[[7.4,51],[7.6,51.3],[7.3,54],[6.7,56.6],[4.8,59.0],[2.4,62],[1.45,64]],near?32:12);
  cylinder('gold',tx,tz,1.6,64,68,near?16:8);
  for(let i=0;i<8;i++){const a=i*Math.PI/4,[dx,dz]=rotate(0,1.76,a);panel(tx+dx,tz+dz,a,.5,64.5,67.1);}
  cylinder('gold',tx,tz,.18,71.4,71.5,near?12:6);
  lathe('gold',tx,tz,[[1.6,68],[1.9,68.5],[1.65,69.5],[.8,70.5],[.18,71.5]],near?24:12);
  box('gold',tx,73.75,tz,.18,4.5,.18);box('gold',tx,74.4,tz,1.5,.18,.18);
  const root=b.finish();
  const m=new THREE.Matrix4().makeRotationY(SPEC.yaw);
  for(const mesh of root.children){
    mesh.geometry.applyMatrix4(m);
    // Preserve sharp normals while sharing duplicated triangle vertices; this
    // pays for the taller dome profiles and frontons within the far byte cap.
    const old=mesh.geometry;mesh.geometry=mergeVertices(old,.0001);old.dispose();
    mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();
  }
  root.updateMatrixWorld(true);return root;
}
