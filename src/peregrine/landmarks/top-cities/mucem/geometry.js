import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FORT_RING, PARTS, BRIDGE, museumPoint as P } from './mucem-plan.js';
import { fortPrism } from './mucem-fort.js';

// Every volume is authored here, in metres; no textures or runtime imports.
export function create({ detail='near' }={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 function prism(mat,ring,lo,hi){
  const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
  const g=new THREE.ExtrudeGeometry(shape,{depth:hi-lo,bevelEnabled:false,curveSegments:1});
  g.rotateX(-Math.PI/2);g.translate(0,lo,0);b.put(g,mat);
 }
 function mbox(mat,x,y,z,w,h,d){b.box(mat,P(x,y,z),[w,h,d],Math.atan2(.526,.851));}
 // J4: modest pale quay edge, then a 52 m glazed core inside the 72 m lace envelope.
 mbox('lattice',0,.25,0,72,.5,72);
 mbox('glass',0,9.75,0,52,18.5,52);
 mbox('lattice',0,19.1,0,52,.2,52);
 // Separate pane rows and columns, never opaque full-height facade stripes.
 for(const side of [-1,1]) {
  for(let row=0;row<4;row++) {
   const y=.65+row*4.6;
   mbox('frame',0,y,side*26.16,52,.16,.25);
   mbox('frame',side*26.16,y,0,.25,.16,52);
  }
  for(let x=-24;x<=24;x+=near?3:6){
   mbox('frame',x,9.7,side*26.2,.12,18.1,.25);
   mbox('frame',side*26.2,9.7,x,.25,18.1,.12);
  }
  // Night colour uses coarse isolated panes, only on north/east exposed fronts.
  for(let x=-22.5;x<24;x+=6) for(let row=0;row<4;row++) {
   if(side===1) continue;
   mbox('glow',x,2.85+row*4.6,side*26.36,5.5,3.9,.12);
   mbox('glow',side*26.36,2.85+row*4.6,x,.12,3.9,5.5);
  }
 }
 // The real ramps wind in the peripheral 10 m void; connected corners and column footings.
 const corners=[[-30,-30],[30,-30],[30,30],[-30,30],[-30,-30]];
 for(let i=0;i<4;i++){
  const a=P(corners[i][0],.8+i*4.55,corners[i][1]);
  const c=P(corners[i+1][0],.8+(i+1)*4.55,corners[i+1][1]);
  ramp(b,a,c,2.4);
  const h=a[1];mbox('frame',corners[i][0],h/2,corners[i][1],.5,h,.5);
 }
 ramp(b,P(-30,19,-30),P(-24,19,-24),2.4);
 mbox('frame',-30,9.5,-30,.5,19,.5);
 for(const x of [-36,36])for(const z of [-36,0,36])mbox('lattice',x,10.65,z,.35,20.3,.35);
 for(const side of [-1,1]){mbox('lattice',0,20.7,side*36,72,.3,.35);mbox('lattice',side*36,20.7,0,.35,.3,72);}
 // Two sea-facing facade screens and perforated rooftop canopy. The holes are actual negative space.
 lace(b,near?28:18,near?8:6,72,20.2,(u,v,w)=>P(u-36,v+.6,36+w),near);
 lace(b,near?28:18,near?8:6,72,20.2,(u,v,w)=>P(-36-w,v+.6,u-36),near);
 lace(b,near?28:17,near?28:17,72,72,(u,v,w)=>P(u-36,20.8+w,v-36),near);
 // Fort Saint-Jean: battered headland retaining podium, open roof terrace and mapped curtain.
 fortPrism(b,FORT_RING,0,16.8,near,[[10,[6,11.6]]]);
 prism('stone',FORT_RING,16.8,17);
 const curtain=PARTS.find(p=>p.id===67715704);
 prism('stone',curtain.ring,17,19);
 const outer=PARTS.find(p=>p.id===67713579);prism('stone',outer.ring,0,5);
 // Low structures stay on the upper court, except the two towers (OSM absolute local heights).
 const skip=new Set([67715704,67713579,67714466,67714983,264423706,264423707,264423708,264423710,264423711,264423712,264423713,264423714,67717365,1385379912,421470489]);
 for(const p of PARTS){if(skip.has(p.id))continue;
  const h=p.id===67716393?7:p.id===226513420?6:4.2;
  const harbour=p.id===67716768||p.id===226513420;
  if(harbour) {
   const area=p.ring.reduce((s,q,i)=>s+q[0]*p.ring[(i+1)%p.ring.length][1]-p.ring[(i+1)%p.ring.length][0]*q[1],0);
   const edges=p.ring.map((a,i)=>[i,(area>0?1:-1)*(p.ring[(i+1)%p.ring.length][0]-a[0])]).filter(([,dx])=>dx< -8).map(([i])=>[i,[18.2]]);
   fortPrism(b,p.ring,17,17+h,near,edges);
  } else prism('stone',p.ring,17,17+h);
  prism(p.id===67716768?'stone':'roof',p.ring,17+h,17+h+.35);
  if(p.id===67716768)for(let i=0;i<p.ring.length;i++){
   const a=p.ring[i],c=p.ring[(i+1)%p.ring.length],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);
   b.box('stone',[(a[0]+c[0])/2,17+h+.55,(a[1]+c[1])/2],[L,.75,.45],-Math.atan2(dz,dx));
  }
  // Small punched-looking windows on the outward edges, calibrated against stone photos.
  for(let i=0;i<p.ring.length;i++){
   const a=p.ring[i],c=p.ring[(i+1)%p.ring.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]);
   if(L<5||harbour)continue;
   const dx=(c[0]-a[0])/L,dz=(c[1]-a[1])/L;
   const area=p.ring.reduce((s,q,k)=>s+q[0]*p.ring[(k+1)%p.ring.length][1]-p.ring[(k+1)%p.ring.length][0]*q[1],0);
   const nx=(area>0?1:-1)*dz,nz=(area>0?-1:1)*dx;
   for(let s=2;s<L-1;s+=near?3.7:6){
    b.box('frame',[a[0]+dx*s+nx*.25,19.6,a[1]+dz*s+nz*.25],[.85,1.5,.12],-Math.atan2(dz,dx));
   }
  }
 }
 // Roi René: square medieval keep, projecting parapet and little turret.
 const r=PARTS.find(p=>p.id===67714466);prism('stone',r.ring,0,30);
 const rr=PARTS.find(p=>p.id===264423714);prism('stone',rr.ring,29.5,31);
 b.box('stone',[74.6,31.1,64.5],[12.4,.2,12.4]);
 for(const x of [68.8,80.4])for(let z=59.4;z<71;z+=3)b.box('stone',[x,31.5,z],[1.3,.9,1.3]);
 const turret=new THREE.CylinderGeometry(.9,1.3,2,near?12:8);turret.translate(75,32,61);b.put(turret,'stone');
 // Tour du fanal: slender circular beacon and cornice; rings from tagged parts.
 for(const [rad,lo,hi,mat] of [[4.8,17,27.6,'stone'],[5.15,27.6,28,'trim'],[3.9,28,30,'stone']]){
  const g=new THREE.CylinderGeometry(rad,rad,hi-lo,near?20:12);g.translate(-63.5,(lo+hi)/2,-43);b.put(g,mat);
 }
 const dome=new THREE.SphereGeometry(3.9,near?20:12,near?6:3,0,Math.PI*2,0,Math.PI/2);dome.scale(1,1/3.9,1);dome.translate(-63.5,30,-43);b.put(dome,'stone');
 // Long UHPC footbridge: continuous trough, roof landing and explicit fort bearing.
 b.box('stone',[-11.4,18,-61.2],[5,2,5]);
 const [a,c]=BRIDGE,dx=c[0]-a[0],dz=c[2]-a[2],L=Math.hypot(dx,dz),nx=-dz/L,nz=dx/L;
 b.box('lattice',[(a[0]+c[0])/2,18.8,(a[2]+c[2])/2],[L,.4,3],-Math.atan2(dz,dx));
 for(const side of [-1,1])b.box('lattice',[(a[0]+c[0])/2+nx*side*1.4,19.75,(a[2]+c[2])/2+nz*side*1.4],[L,1.5,.22],-Math.atan2(dz,dx));
 for(const p of [a,c]) b.box('lattice',[p[0],19.75,p[2]],[.24,1.5,3],-Math.atan2(dz,dx));
 const root=b.finish();if(!near)root.children.find(m=>m.material.name==='lattice').material.side=THREE.DoubleSide;
 root.userData.bridgeTerminals=BRIDGE;return root;
}

function ramp(b,a,c,width){
 const dx=c[0]-a[0],dz=c[2]-a[2],L=Math.hypot(dx,dz),nx=-dz/L*width/2,nz=dx/L*width/2;
 const ring=[[a[0]+nx,a[1],a[2]+nz],[c[0]+nx,c[1],c[2]+nz],[c[0]-nx,c[1],c[2]-nz],[a[0]-nx,a[1],a[2]-nz]];
 const p=[...ring.flat(),...ring.map(v=>[v[0],v[1]-.3,v[2]]).flat()];
 const ix=[0,1,2,0,2,3,4,6,5,4,7,6];for(let i=0;i<4;i++){const j=(i+1)%4;ix.push(i,i+4,j,j,i+4,j+4);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,'frame');
}

// Original bounded Voronoi cells produce non-repeating polygonal lace, with true holes.
function lace(b,nx,ny,W,H,at,near){
 const pts=[],idx=[],seeds=[];
 const rnd=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
 for(let y=0;y<ny;y++){seeds[y]=[];for(let x=0;x<nx;x++)seeds[y][x]=[(x+.5+(rnd(x+3,y+7)-.5)*.8)*W/nx,(y+.5+(rnd(x+21,y+3)-.5)*.8)*H/ny];}
 const quad=(a,c,d,e)=>{const k=pts.length/3;pts.push(...a,...c,...d,...e);idx.push(k,k+1,k+2,k,k+2,k+3);};
 const clip=(poly,A,B,C)=>{
  const out=[];
  for(let i=0;i<poly.length;i++){
   const p=poly[i],q=poly[(i+1)%poly.length],dp=p[0]*A+p[1]*B-C,dq=q[0]*A+q[1]*B-C;
   if(dp<=1e-8)out.push(p);
   if((dp<0)!==(dq<0)){const t=dp/(dp-dq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
  }return out;
 };
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
  const center=seeds[y][x];let o=[[0,0],[W,0],[W,H],[0,H]];
  for(let j=Math.max(0,y-2);j<=Math.min(ny-1,y+2);j++)for(let i=Math.max(0,x-2);i<=Math.min(nx-1,x+2);i++){
   if(i===x&&j===y)continue;const p=seeds[j][i],A=p[0]-center[0],B=p[1]-center[1],C=(p[0]*p[0]+p[1]*p[1]-center[0]*center[0]-center[1]*center[1])/2;
   o=clip(o,A,B,C);
  }
  const aperture=near?.85:.78;
  const inner=o.map(p=>[center[0]+(p[0]-center[0])*aperture,center[1]+(p[1]-center[1])*aperture]);
  for(let i=0;i<o.length;i++){const j=(i+1)%o.length;
   quad(at(...o[i],.11),at(...o[j],.11),at(...inner[j],.11),at(...inner[i],.11));
   if(!near)continue; // Flat broad two-sided webs retain coverage without hidden reveal faces.
   quad(at(...o[j],-.11),at(...o[i],-.11),at(...inner[i],-.11),at(...inner[j],-.11));
   quad(at(...inner[i],.11),at(...inner[j],.11),at(...inner[j],-.11),at(...inner[i],-.11));
  }
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.setIndex(idx);g.computeVertexNormals();
 const A=new THREE.Vector3(...at(0,0,0)),B=new THREE.Vector3(...at(1,0,0)),C=new THREE.Vector3(...at(0,1,0)),N=new THREE.Vector3(...at(0,0,1)).sub(A);
 if(B.sub(A).cross(C.sub(A)).dot(N)<0){for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];g.setIndex(idx);g.computeVertexNormals();}
 if(!near){
  N.normalize();const normals=[];for(let i=0;i<pts.length/3;i++)normals.push(...N.toArray());
  g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
 }
 b.put(mergeVertices(g,1e-5),'lattice');
}
