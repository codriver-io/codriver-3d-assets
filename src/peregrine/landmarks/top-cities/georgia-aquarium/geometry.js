import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { bow, port, HALL, hallHeight, CANOPY_SUPPORTS, canopyPoint } from './georgia-aquarium-plan.js';

export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const bags=new Map();
 function tri(mat,a,c,d,hint) {
  const n=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...d).sub(new THREE.Vector3(...a)));
  if(n.lengthSq()<1e-12)return;
  if(n.dot(new THREE.Vector3(...hint))<0)[c,d]=[d,c];
  if(!bags.has(mat))bags.set(mat,[]);
  bags.get(mat).push(...a,...c,...d);
 }
 function q(mat,a,c,d,e,hint) {tri(mat,a,c,d,hint);tri(mat,a,d,e,hint);}
 function polygon(ring,height,mat,top='roof',bottom=0) {
  const topPts=ring.map(([x,z])=>[x,typeof height==='function'?height(x,z):height,z]);
  const signed=ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0);
  for(let i=0;i<ring.length;i++) {
   const j=(i+1)%ring.length,a=ring[i],c=ring[j];
   q(mat,[a[0],bottom,a[1]],[c[0],bottom,c[1]],topPts[j],topPts[i],[(c[1]-a[1])*Math.sign(signed),0,(a[0]-c[0])*Math.sign(signed)]);
  }
  const indices=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]);
  for(const [a,c,d] of indices) {
   tri(top,topPts[a],topPts[c],topPts[d],[0,1,0]);
   if(bottom>0)tri(mat,[ring[a][0],bottom,ring[a][1]],[ring[c][0],bottom,ring[c][1]],[ring[d][0],bottom,ring[d][1]],[0,-1,0]);
  }
 }
 // Tank halls: mapped outer envelope, windowless walls and undulating roofline.
 // Subdivide the roof interior, so the roof's swells are not just edge profiles.
 const outline=HALL, roofPts=outline.map(([x,z])=>[x,hallHeight(x,z),z]);
 const steps=near?14:7;
 const signed=outline.reduce((v,p,k)=>{const q=outline[(k+1)%outline.length];return v+p[0]*q[1]-q[0]*p[1];},0);
 for(let i=0;i<outline.length;i++) {
  const a=outline[i],c=outline[(i+1)%outline.length];
  const hint=[(c[1]-a[1])*Math.sign(signed),0,(a[0]-c[0])*Math.sign(signed)];
  for(let j=0;j<steps;j++) {
   const at=t=>[a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t],p=at(j/steps),r=at((j+1)/steps);
   const hp=hallHeight(...p),hr=hallHeight(...r);
   // Blue panel bands and silver seams partition the wall, including north/east elevations.
   const levels=[0,4.8,5,8,8.2,12,12.2,14.7,14.9];
   for(let k=0;k<levels.length;k++) {
    const lo=levels[k],hi=k+1<levels.length?levels[k+1]:null;
    q(k===2||k===6?'blue':'silver',[p[0],lo,p[1]],[r[0],lo,r[1]],[r[0],hi??hr,r[1]],[p[0],hi??hp,p[1]],hint);
   }
  }
 }
 const faces=THREE.ShapeUtils.triangulateShape(outline.map(p=>new THREE.Vector2(...p)),[]);
 function roofTriangle(a,c,d,steps) {
  const pt=(u,v)=>{const x=a[0]*(1-u-v)+c[0]*u+d[0]*v,z=a[1]*(1-u-v)+c[1]*u+d[1]*v;return [x,hallHeight(x,z),z];};
  for(let i=0;i<steps;i++)for(let j=0;j<steps-i;j++) {
   const u=i/steps,v=j/steps,h=1/steps;
   tri('roof',pt(u,v),pt(u+h,v),pt(u,v+h),[0,1,0]);
   if(j<steps-i-1)tri('roof',pt(u+h,v),pt(u+h,v+h),pt(u,v+h),[0,1,0]);
  }
 }
 for(const [a,c,d] of faces)roofTriangle(outline[a],outline[c],outline[d],steps);
 // Low west wave wing, curved in section and along the Baker Street frontage.
 const wing=[]; const n=near?44:20;
 for(let i=0;i<=n;i++) {const t=i/n,x=-71+53*t,u=Math.max(0,Math.min(1,(x+61)/8));wing.push([x,19+22*u*u*(3-2*u)]);}
 wing.push([-21,19],[-45,-4],[-75,-5]);
 polygon(wing,(x,z)=>12+6*Math.sin((x+75)/57*Math.PI),'silver');
 // Small attached west service bay, not neighbouring hotel or parking garage.
 const west=FOOTPRINTS[2].slice(0,-1).map(([lng,lat])=>[(lng-SPEC.origin[0])*92543,(SPEC.origin[1]-lat)*111319]);
 polygon(west,4.2,'blue');

 // Ship's bow. Both sides taper to the raked prow; starboard is a genuine
 // panel grid (glass/frame are adjacent patches, with no stacked backing wall).
 const nt=near?48:24,nv=near?12:8;
 function panel(t0,t1,v0,v1,mat) {
  q(mat,bow(t0,v0),bow(t1,v0),bow(t1,v1),bow(t0,v1),[1,0,0.6]);
 }
 for(let i=0;i<nt;i++)for(let j=0;j<nv;j++) {
  const t0=i/nt,t1=(i+1)/nt,v0=j/nv,v1=(j+1)/nv;
  const dt=near?0.0025:0.0035,dv=near?0.0055:0.007;
  const mat=j>=nv-2?'glow':'glass';
  panel(t0+dt,t1-dt,v0+dv,v1-dv,mat);
  panel(t0,t0+dt,v0,v1,'frame'); panel(t1-dt,t1,v0,v1,'frame');
  panel(t0+dt,t1-dt,v0,v0+dv,'frame');panel(t0+dt,t1-dt,v1-dv,v1,'frame');
  q('silver',port(t0,v0),port(t1,v0),port(t1,v1),port(t0,v1),[-1,0,-0.5]);
 }
 for(let i=0;i<nt;i++) {
  const t0=i/nt,t1=(i+1)/nt;
  q('roof',bow(t0,1),port(t0,1),port(t1,1),bow(t1,1),[0,1,0]);
 }
 // The mast emerges from the solid prow, rather than hovering over it.
 b.bar('silver',[-27.6,30.2,35.7],[-30.1,36.74,37.4],0.75,1.15);

 // Entrance canopy: use its separately mapped ring, suspended on real columns.
 const segments=near?84:42;
 for(let i=0;i<segments;i++) {
  const a=canopyPoint(i/segments),c=canopyPoint((i+1)/segments),d=canopyPoint((i+1)/segments,5.5),e=canopyPoint(i/segments,5.5);
  polygon([a,c,d,e],8.6,'silver','silver',8.05);
 }
 for(const [x,z] of CANOPY_SUPPORTS)b.bar('silver',[x,0,z],[x,8.15,z],near?.42:.55,near?.42:.55,0,true);
 // A silver roof/hull infill closes the aft notch behind the glass bow.
 const aft=[[-44,18],[-46,-8],[-30,-45],[1,-83],[45,-70]];
 function hallEdge(p) {
  let best=null,dist=Infinity;
  for(let i=0;i<aft.length-1;i++) {
   const a=aft[i],c=aft[i+1],dx=c[0]-a[0],dz=c[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[2]-a[1])*dz)/(dx*dx+dz*dz)));
   const x=a[0]+t*dx,z=a[1]+t*dz,d=Math.hypot(x-p[0],z-p[2]);
   if(d<dist){dist=d;best=[x,hallHeight(x,z),z];}
  }return best;
 }
 for(let i=0;i<nt;i++) {
  const p=port(i/nt,1),r=port((i+1)/nt,1),a=hallEdge(p),c=hallEdge(r);
  q('roof',p,r,c,a,[0,1,0]);
  if(i===0)q('silver',[p[0],0,p[2]],p,a,[a[0],0,a[2]],[0,0,1]);
 }
 // Standing seams follow the swells and terminate on the hall roof surface.
 if(near) {
  const inside=(x,z)=>{let yes=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++) {
   const a=outline[i],c=outline[j];if((a[1]>z)!==(c[1]>z)&&x<(c[0]-a[0])*(z-a[1])/(c[1]-a[1])+a[0])yes=!yes;
  }return yes;};
  for(let x=-113;x<45;x+=4)for(let z=-165;z<18;z+=3)if(inside(x,z)&&inside(x,z+3))
   b.bar('roof',[x,hallHeight(x,z),z],[x,hallHeight(x,z+3),z+3],.13,.22);
 }
 // Large recognisable fish-G badge, original simple polygon geometry. It sits
 // 0.6 m outside the glass, avoiding near and far depth-precision collisions.
 const badgeT=.13,badgeV=.82,p=bow(badgeT,badgeV);
 const U=new THREE.Vector3(...bow(badgeT+.01,badgeV)).sub(new THREE.Vector3(...p)).normalize();
 const N=new THREE.Vector3(-U.z,0,U.x).normalize(); if(N.x<0)N.negate();
 const badge=(x,y)=>[p[0]+U.x*x+N.x*.65,p[1]+y,p[2]+U.z*x+N.z*.65];
 const count=near?28:18;
 for(let i=0;i<count;i++) {
  const a=(.2+i/count*1.72)*Math.PI,c=(.2+(i+1)/count*1.72)*Math.PI;
  q('blue',badge(3.2*Math.cos(a),2.1*Math.sin(a)),badge(3.2*Math.cos(c),2.1*Math.sin(c)),badge(2*Math.cos(c),1.15*Math.sin(c)),badge(2*Math.cos(a),1.15*Math.sin(a)),N.toArray());
 }
 q('blue',badge(0,-.2),badge(3.1,-.2),badge(3.1,.65),badge(0,.65),N.toArray());
 tri('blue',badge(-2.4,0),badge(-5,1.6),badge(-4.2,0),N.toArray());
 tri('blue',badge(-2.4,0),badge(-4.2,0),badge(-5,-1.6),N.toArray());

 // GEORGIA AQUARIUM, spaced individual stroke letters above the canopy fascia.
 // This short signage is part of the photographed entrance identity.
 const glyphs={
 G:[[1,1,0,1],[0,1,0,0],[0,0,1,0],[1,0,1,.5],[1,.5,.5,.5]],
 E:[[1,1,0,1],[0,1,0,0],[0,0,1,0],[0,.5,.8,.5]],
 O:[[0,0,0,1],[0,1,1,1],[1,1,1,0],[1,0,0,0]],
 R:[[0,0,0,1],[0,1,1,1],[1,1,1,.55],[1,.55,0,.55],[.45,.55,1,0]],
 I:[[.5,0,.5,1]], A:[[0,0,.5,1],[.5,1,1,0],[.25,.45,.75,.45]],
 Q:[[0,0,0,1],[0,1,1,1],[1,1,1,0],[1,0,0,0],[.6,.3,1.2,-.1]],
 U:[[0,1,0,0],[0,0,1,0],[1,0,1,1]],
 M:[[0,0,0,1],[0,1,.5,.4],[.5,.4,1,1],[1,1,1,0]],
 };
 const word='GEORGIA AQUARIUM';
 for(let i=0;i<word.length;i++) {
  if(word[i]===' ')continue;
  const t=.16+i/(word.length-1)*.7,[x,z]=canopyPoint(t,.1),p=canopyPoint(t+.001,.1);
  const l=Math.hypot(p[0]-x,p[1]-z),u=[(p[0]-x)/l,(p[1]-z)/l];
  const at=(a,y)=>[x+u[0]*(a-.5)*.95,8.65+y*1.75,z+u[1]*(a-.5)*.95];
  for(const [a,y,c,h] of glyphs[word[i]])b.bar('sign',at(a,y),at(c,h),near?.13:.18,near?.13:.18);
 }

 // Warm strip lamps underneath the canopy are restrained at day and night.
 if(near)for(const [x,z] of CANOPY_SUPPORTS)b.box('sign',[x,8,z],[1.2,.12,.8]);
 for(const [mat,positions] of bags) {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();b.put(mergeVertices(g),mat);
 }
 return b.finish();
}
