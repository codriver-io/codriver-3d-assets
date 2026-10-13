import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { point, WIDTH, DEPTH, BASE, HEIGHT, TUBE_A, TUBE_B, ORIGIN } from './perot-museum-plan.js';

export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const batches=new Map();
 function tri(mat,a,c,d,normal) {
  const cross=new THREE.Vector3().subVectors(new THREE.Vector3(...c),new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...d),new THREE.Vector3(...a)));
  if(cross.lengthSq()<1e-12)return;
  if(new THREE.Vector3().subVectors(new THREE.Vector3(...c),new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...d),new THREE.Vector3(...a))).dot(new THREE.Vector3(...normal))<0) [c,d]=[d,c];
  if(!batches.has(mat)) batches.set(mat,[]);
  batches.get(mat).push(...a,...c,...d);
 }
 const q=(mat,a,c,d,e,n)=>{tri(mat,a,c,d,n);tri(mat,a,d,e,n);};
 const pq=(mat,a,c,d,e,n)=>q(mat,point(...a),point(...c),point(...d),point(...e),n);
 const norm=(u,y,v)=>{const p=point(u,y,v),z=point(0,0,0);return [p[0]-z[0],y,p[2]-z[2]];};
 function box(mat,center,size){b.box(mat,point(...center),size,-Math.atan2(0.54364,0.83931));}
 const w=WIDTH/2,d=DEPTH/2,cut=y=>11.1+(w-11.1)*(y-BASE)/(HEIGHT-BASE);
 // Recessed glazed structural base, not a slab down to grade.
 box('glass',[0,BASE/2,0],[WIDTH-4,BASE,DEPTH-4]);
 for(let u=-19;u<=19;u+=near?3.8:7.6) box('frame',[u,4,d-1.8],[0.15,8,0.3]);
 // Surface relief is tessellated into the wall; no underlying duplicate wall.
 // Lower panels carry the dense geological striations; upper panels are quieter.
 for(let face=0;face<4;face++) {
  const rows=near?78:32, cols=near?14:9;
  const mapping=(s,y,offset=0)=>{
   if(face===0) return [-w+s*(cut(y)+w),y,d+offset];
   if(face===1) return [-w+s*WIDTH,y,-d-offset];
   if(face===2) return [-w-offset,y,-d+s*DEPTH];
   return [w+offset,y,-d+s*(DEPTH-10)];
  };
  const n=norm(...[[0,0,1],[0,0,-1],[-1,0,0],[1,0,0]][face]);
  for(let r=0;r<rows;r++) {
   const rowY=r=>{const split=near?60:23;return r<=split?BASE+19*r/split:27+(HEIGHT-27)*(r-split)/(rows-split);};
   const y0=rowY(r), y1=rowY(r+1);
   for(let c=0;c<cols;c++) {
    const s0=c/cols,s1=(c+1)/cols;
    // Adjacent columns share the ridge height, making continuous geological runs.
    const seed=(r*17+face*7)%23;
    const rib=near?(y0<26?0.10+seed*0.005:0.02+seed*0.003):0.035;
    const upperSlot=face===0 && y0>39 && y0<42 && s0>=0.1 && s1<=0.6;
    const slotted=upperSlot || (r>rows*0.32 && r<rows*0.85 && (r*13+c*7+face*19)%89<2);
    const mat=slotted?'glass':(y0<27 && (r+face*3)%11===0?'relief':'stone');
    const a=mapping(s0,y0,0),c0=mapping(s1,y0,0),c1=mapping(s1,y0+Math.min(0.13,(y1-y0)*0.25),rib),e=mapping(s0,y0+Math.min(0.13,(y1-y0)*0.25),rib);
    pq(mat,a,c0,c1,e,n);
    pq(mat,e,c1,mapping(s1,y1,0),mapping(s0,y1,0),n);
   }
  }
 }
 // Sloped triangular atrium corner: glazing between concrete cube and tall blade.
 const nFront=norm(0,0,1);
 const ay=[BASE,20,34,HEIGHT];
 for(let i=0;i<ay.length-1;i++) {
  const lo=ay[i],hi=ay[i+1],segments=near?5:3;
  for(let j=0;j<segments;j++) {
   const u=(y,t)=>cut(y)+(w-cut(y))*t;
   pq('glow',[u(lo,j/segments),lo,d],[u(lo,(j+1)/segments),lo,d],[u(hi,(j+1)/segments),hi,d],[u(hi,j/segments),hi,d],nFront);
  }
 }
 // Recessed right atrium side, roof and underside closures.
 pq('glass',[w,BASE,d-10],[w,BASE,d],[w,HEIGHT,d],[w,HEIGHT,d-10],norm(1,0,0));
 pq('stone',[-w,HEIGHT,-d],[w,HEIGHT,-d],[w,HEIGHT,d],[-w,HEIGHT,d],[0,1,0]);
 pq('metal',[-w,BASE,-d],[w,BASE,-d],[w,BASE,d-10],[cut(BASE),BASE,d], [0,-1,0]);
 pq('metal',[-w,BASE,-d],[cut(BASE),BASE,d],[-w,BASE,d],[-w,BASE,-d],[0,-1,0]);
 box('stone',[w-0.45,(BASE+HEIGHT)/2,d-7.4],[0.9,HEIGHT-BASE,1.25]);
 // Atrium glazing grid: coarse panes and independent frame bars in far too.
 for(const y of [8,20,34]) b.bar('frame',point(cut(y),y,d+0.3),point(w,y,d+0.3),0.16);
 b.bar('frame',point(cut(BASE),BASE,d+0.3),point(w,HEIGHT,d+0.3),0.2);
 box('stone',[-1,10.3,22.9],[5,6.8,6.4]);
 // Glass escalator cartridge: rectangular shell along its diagonal axis.
 const A=new THREE.Vector3(...TUBE_A),B=new THREE.Vector3(...TUBE_B),axis=B.clone().sub(A).normalize();
 const side=axis.clone().cross(new THREE.Vector3(0,1,0)).normalize();
 const up=side.clone().cross(axis).normalize();
 const len=A.distanceTo(B),half=2.4,h=3.35;
 const tp=(t,s,z)=>{const v=A.clone().lerp(B,t).addScaledVector(side,s).addScaledVector(up,z);return point(...v.toArray());};
 const tn=(v)=>norm(...v.toArray());
 // Landing top follows the underside; its sides remain inset from the glass panes.
 const landingCenter=A.clone().lerp(B,.96).addScaledVector(up,-h-.4);
 const landing=new THREE.BoxGeometry(3.8,len*.08,.8);
 landing.applyMatrix4(new THREE.Matrix4().makeBasis(side,axis,up));
 landing.translate(...landingCenter.toArray());
 landing.rotateY(-Math.atan2(.54364,.83931));
 landing.translate(...point(0,0,0));b.put(landing,'metal');
 const beamRoot=[12,13.65,23.85],beamEnd=landingCenter.clone().addScaledVector(up,-.25).toArray();
 b.bar('metal',point(...beamRoot),point(...beamEnd),.8,.8);
 const bays=near?23:10;
 for(let i=0;i<bays;i++) {
  const t0=i/bays,t1=(i+1)/bays;
  q('glow',tp(t0,half,-h),tp(t1,half,-h),tp(t1,half,h),tp(t0,half,h),tn(side));
  q('glass',tp(t0,-half,-h),tp(t0,-half,h),tp(t1,-half,h),tp(t1,-half,-h),tn(side.clone().negate()));
  q('glass',tp(t0,-half,h),tp(t0,half,h),tp(t1,half,h),tp(t1,-half,h),tn(up));
  q('metal',tp(t0,-half,-h),tp(t1,-half,-h),tp(t1,half,-h),tp(t0,half,-h),tn(up.clone().negate()));
 }
 for(const t of [0,1]) q('glass',tp(t,-half,-h),tp(t,half,-h),tp(t,half,h),tp(t,-half,h),tn(axis.clone().multiplyScalar(t===0?-1:1)));
 // All framing terminates at the cartridge edge frames; internal horizontals touch them.
 for(const s of [-half,half]) {
  for(const z of [-h,0,h]) b.bar('frame',tp(0,s,z),tp(1,s,z),near?0.18:0.25);
  for(let i=0;i<=bays;i++) b.bar('frame',tp(i/bays,s,-h),tp(i/bays,s,h),near?0.13:0.2);
 }
 for(const t of [0,1]) for(const z of [-h,h]) b.bar('frame',tp(t,-half,z),tp(t,half,z),0.22);
 // Podium follows the complete mapped silhouette, with a low rolling planted roof.
 const toLocal=([lng,lat])=>[(lng-ORIGIN[0])*111319.49*Math.cos(ORIGIN[1]*Math.PI/180),-(lat-ORIGIN[1])*111319.49];
 function podium(ring,canopy=false) {
  const pts=ring.slice(0,-1).map(toLocal);
  const height=([x,z])=>canopy?3.5:0.8+6.7*Math.exp(-((x-40)**2+(z+1)**2)/900);
  const shapes=pts.map(p=>new THREE.Vector2(...p));
  function roofTri(a,c,e,level=0) {
   if(!canopy && level<(near?3:2)) {const ac=a.map((v,i)=>(v+c[i])/2),ce=c.map((v,i)=>(v+e[i])/2),ea=e.map((v,i)=>(v+a[i])/2); roofTri(a,ac,ea,level+1);roofTri(ac,c,ce,level+1);roofTri(ea,ce,e,level+1);roofTri(ac,ce,ea,level+1);return;}
   tri(canopy?'stone':'landscape',[a[0],height(a),a[1]],[c[0],height(c),c[1]],[e[0],height(e),e[1]],[0,1,0]);
  }
  for(const ids of THREE.ShapeUtils.triangulateShape(shapes,[])) roofTri(...ids.map(i=>pts[i]));
  const area=pts.reduce((s,p,i)=>s+p[0]*pts[(i+1)%pts.length][1]-pts[(i+1)%pts.length][0]*p[1],0);
  for(let i=0;i<pts.length;i++) {
   const p=pts[i],r=pts[(i+1)%pts.length],n=area>0?[r[1]-p[1],0,p[0]-r[0]]:[p[1]-r[1],0,r[0]-p[0]];
   q('stone',[p[0],canopy?3.1:0,p[1]],[r[0],canopy?3.1:0,r[1]],[r[0],height(r),r[1]],[p[0],height(p),p[1]],n);
  }
 }
 podium(FOOTPRINTS[0]); podium(FOOTPRINTS[1],true);
 for(const [x,z] of [[34,51.5],[21,55],[1,85],[-2,93]]) b.box('stone',[x,1.55,z],[0.5,3.1,0.5]);
 for(const [mat,positions] of batches) {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(g,mat);
 }
 const model=b.finish();model.userData.escalatorLength=len;
 model.userData.landingBeam=[point(...beamRoot),point(...beamEnd)];
 return model;
}
