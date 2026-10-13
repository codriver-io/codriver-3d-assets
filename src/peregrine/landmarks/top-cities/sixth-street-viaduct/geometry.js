import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {bridgeBuilder} from '../../asset-geometry.js';
import {PROFILE,LENGTH,WIDTH,ARCHES,ARCH_D,archPoint,authoredLateral} from './sixth-street-viaduct-profile.js';
import {accessPaths} from './sixth-street-viaduct-access.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder(PROFILE,detail),h=PROFILE.deckHeight;
 const terminals=[],namedSupports=new Map();
 const retain=(name,g)=>{if(name){const copy=g.clone();for(const attr of Object.keys(copy.attributes))if(!['position','normal'].includes(attr))copy.deleteAttribute(attr);const old=namedSupports.get(name);const mesh=new THREE.Mesh(old?mergeGeometries([old.geometry,copy]):copy,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));mesh.updateMatrixWorld();namedSupports.set(name,mesh);}};
 const ck=s=>near?Math.min(2,Math.floor(s/(LENGTH/3))):0;
 const xyz=(s,d,y)=>b.xyz(s,authoredLateral(s,d),y);
 // Closed four-sided loft; outward winding and real end caps in both LODs.
 function loft(material,rings,chunk,lift=1,name=null){
  const positions=rings.flat(2),indices=[];
  for(let k=1;k<rings.length;k++)for(let j=0;j<4;j++){
   const a=(k-1)*4+j,c=(k-1)*4+(j+1)%4,e=k*4+j,f=k*4+(j+1)%4;
   indices.push(a,c,e,c,f,e);
  }
  indices.push(0,3,2,0,2,1);
  const e=(rings.length-1)*4;indices.push(e,e+1,e+2,e,e+2,e+3);
  for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.setIndex(indices);g.computeVertexNormals();retain(name,g);b.put(g,material,chunk,Array.isArray(lift)?1:lift);
  if(Array.isArray(lift))g.setAttribute('bridgeLift',new THREE.Float32BufferAttribute(lift,1));
 }
 function ribbon(material,start,end,left,right,dy,thickness,chunk,name=null,terminalFine=false){
  if(end<=start)return;
  const stations=new Set([start,end]);
  for(let s=Math.ceil(start/(near?10:20))*(near?10:20);s<end;s+=near?10:20)stations.add(s);
  for(const a of PROFILE.ALIGNMENT)if(a.s>start&&a.s<end)stations.add(a.s);
  if(terminalFine)for(let s=Math.ceil(start/5)*5;s<end;s+=5)if(s<130||s>LENGTH-130)stations.add(s);
  const value=(q,s)=>typeof q==='function'?q(s):q;
  loft(material,[...stations].sort((a,c)=>a-c).map(s=>{
   const l=value(left,s),r=value(right,s),y=h(s)+value(dy,s),depth=value(thickness,s);
   // Clockwise viewed along increasing station: top-left, bottom-left, bottom-right, top-right.
   return [xyz(s,l,y),xyz(s,l,y-depth),xyz(s,r,y-depth),xyz(s,r,y)];
  }),chunk,1,name);
 }
 function beam(material,a,c,width,depth=width,chunk=ck((a[0]+c[0])/2),lift=1,name=null){
  const av=new THREE.Vector3(...xyz(...a)),bv=new THREE.Vector3(...xyz(...c)),v=bv.clone().sub(av),len=v.length();
  if(len<1e-6)return;
  const g=new THREE.BoxGeometry(width,len,depth);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
  g.translate(...av.add(bv).multiplyScalar(.5).toArray());retain(name,g);b.put(g,material,chunk,lift);
 }
 function box(material,s,d,y,length,width,height,chunk,lift,name){
  const q=PROFILE.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(length,height,width);
  g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);retain(name,g);b.put(g,material,chunk,lift);
 }
 const bounds=[0,LENGTH/3,2*LENGTH/3,LENGTH];
 const railTop=s=>.93*Math.min(1,Math.min(s,LENGTH-s)/25);
 const accesses=accessPaths(detail);
 const openings=accesses.map(r=>r.id==='west'?[r.topStation-18,r.topStation+4]:[r.topStation-4,r.topStation+12]);
 for(let i=0;i<3;i++){
  const a=bounds[i],c=bounds[i+1],chunk=near?i:0;
  // Keep the carriageway slab separate from the two terrain-fitted shoulders:
  // an edge-to-edge concrete face must not bridge over the road's DEM trough.
  const slabDepth=s=>.02+1.33*Math.min(1,Math.min(s,LENGTH-s)/18);
  ribbon('concrete',a,c,-7.6,7.6,-.60,slabDepth,chunk,`slab-${i}`,true);
  for(const [l,r] of [[-WIDTH/2,-7.6],[7.6,WIDTH/2]])ribbon('concrete',a,c,l,r,-.45,slabDepth,chunk,`slab-${i}`);
  // Thin fallback surfaces stay below real provider HD pavement/paint.
  ribbon('asphalt',a,c,-7.6,7.6,-.14,.06,chunk);
  for(const side of [-1,1]){
   const edges=side===1?[8.5,11.55]:[-11.55,-8.5];
   ribbon('asphalt',a,c,...edges,-.14,.06,chunk);
   const walks=side===1?[11.7,WIDTH/2]:[-WIDTH/2,-11.7];
   ribbon(near?'walk':'concrete',a,c,...walks,s=>-.04+.10*Math.min(1,Math.min(s,LENGTH-s)/18),s=>.18+.10*Math.min(1,Math.min(s,LENGTH-s)/18),chunk);
   for(const s of [a,c])terminals.push({kind:'walkway',a:[s,side*13.7,h(s)-.15],supportA:`slab-${i}`});
   // Vehicle/bicycle barrier is white guardrail, not a high solid wall.
   for(const d of [side*8.15,side*(WIDTH/2-.13)]){
    const cuts=d< -14?openings:[],ranges=[];let from=a;
    for(const [lo,hi] of cuts.toSorted((v,w)=>v[0]-w[0]))if(hi>a&&lo<c){if(lo>from)ranges.push([from,lo]);from=Math.max(from,hi);}
    if(from<c)ranges.push([from,c]);
    for(const [lo,hi] of ranges){
     ribbon('rail',lo,hi,d-.055,d+.055,railTop,.1,chunk,`rail-${i}-${d}`);
     if(near)ribbon('rail',lo,hi,d-.035,d+.035,s=>railTop(s)*.52/.93,.06,chunk);
     for(const s of [lo,hi]){
      const name=`rail-cap-${i}-${d}-${s}`;beam('rail',[s,d,h(s)-.55],[s,d,h(s)+railTop(s)],.12,.12,chunk,1,name);
      terminals.push({kind:'rail-end',a:[s,d,h(s)+railTop(s)],supportA:name});
     }
    }
    for(let s=Math.ceil(a/(near?4:20))*(near?4:20);s<=c;s+=near?4:20)
     {if(cuts.some(([lo,hi])=>s>lo&&s<hi))continue;beam('rail',[s,d,h(s)-.55],[s,d,h(s)+railTop(s)],.095,.095,chunk);
     terminals.push({kind:'rail-post',a:[s,d,h(s)-.55],b:[s,d,h(s)+railTop(s)],supportA:`slab-${i}`,supportB:`rail-${i}-${d}`});}
   }

   if(near){
    ribbon('paint',a,c,side*7.35-.06,side*7.35+.06,-.11,.015,chunk);
    for(let s=Math.ceil(a/12)*12;s<c-3;s+=12)
     ribbon('paint',s,s+3,side*3.65-.055,side*3.65+.055,-.11,.015,chunk);
   }
  }
  for(const d of [-.13,.13])ribbon('paint',a,c,d-.05,d+.05,-.11,.015,chunk);
  // Underside closely spaced transverse deck ribs and longitudinal beams.
  for(const d of near?[-12,-8,-4,0,4,8,12]:[-11,0,11]){
   ribbon('girder',Math.max(a,100),Math.min(c,LENGTH-90),d-.15,d+.15,-1.52,.40,chunk);
   for(const s of [Math.max(a,100),Math.min(c,LENGTH-90)])terminals.push({kind:'girder',a:[s,d,h(s)-1.60],supportA:`slab-${i}`});
  }
  if(near)for(let s=Math.ceil(Math.max(a,100)/9)*9;s<Math.min(c,LENGTH-90);s+=9)
   beam('girder',[s,-14,h(s)-1.71],[s,14,h(s)-1.71],.28,.38,chunk);
 }
 for(const arch of ARCHES)for(const side of [-1,1]){
  const N=near?56:24,chunk=ck(arch.center),rings=[];
  for(let i=0;i<=N;i++){
   const t=i/N,[s,d,y]=archPoint(arch,t,side),slope=(arch.rise-.6)*4*(1-2*t)/arch.span;
   const v=1/Math.hypot(1,slope),ds=-slope*v*.6,dy=v*.6;
   // 10-foot transverse rib, radial section estimated 1.2 m. Lean baked into its path.
   rings.push([xyz(s+ds,d-1.524,y+dy),xyz(s-ds,d-1.524,y-dy),xyz(s-ds,d+1.524,y-dy),xyz(s+ds,d+1.524,y+dy)]);
  }
  const archName=`arch-${arch.index}-${side}`;loft('arch',rings,chunk,1,archName);
  for(const t of [0,1])terminals.push({kind:'arch',a:archPoint(arch,t,side),supportA:`spring-${arch.index}-${side}-${t}`});
  // Network tied arch: two crossing diagonals at each hanger node, never vertical-only wires.
  const n=near?14:7;
  for(let j=1;j<n;j++)for(const shift of [-1,1]){
   const t=j/n,start=archPoint(arch,t,side),endS=Math.max(arch.center-arch.span/2+2,
    Math.min(arch.center+arch.span/2-2,start[0]+shift*arch.span*.15));
   const end=[endS,side*ARCH_D,h(endS)-.55];
   beam('cable',start,end,near?.07:.115,near?.07:.115,chunk);
   terminals.push({kind:'hanger',a:start,b:end,supportA:archName,supportB:`slab-${Math.min(2,Math.floor(endS/(LENGTH/3)))}`});
  }
  for(const t of [0,1]){
   const [s,d]=archPoint(arch,t,side);
   // Solid springing block welds arch feet into the deck and Y-bent continuation.
   box('concrete',s,d,h(s)-.60,2.2,3.7,2.1,chunk,1,`spring-${arch.index}-${side}-${t}`);
  }
 }
 // Each of nine gaps has two longitudinal Y-bents, flowing into adjacent arch feet.
 for(let i=0;i<ARCHES.length-1;i++){
  const left=ARCHES[i].center+ARCHES[i].span/2,right=ARCHES[i+1].center-ARCHES[i+1].span/2;
  const s=(left+right)/2,chunk=ck(s),top=Math.max(1.2,h(s)-5.5);
  for(const side of [-1,1]){
   const d=side*ARCH_D;
   box('concrete',s,d,.30,4.1,4.1,.6,chunk,0,`foot-${i}-${side}`);
   beam('concrete',[s,d,.35],[s,d,top],2.2,2.6,chunk,y=>Math.max(0,Math.min(1,y/top)),`stem-${i}-${side}`);
   terminals.push({kind:'pier',a:[s,d,.35],supportA:`foot-${i}-${side}`});
   for(const [j,e] of [left,right].entries()){
    beam('concrete',[s,d,top-.2],[e,d,h(e)-.65],2.2,2.75,chunk);
    terminals.push({kind:'Y-beam',a:[s,d,top-.2],b:[e,d,h(e)-.65],supportA:`stem-${i}-${side}`,supportB:`spring-${i+j}-${side}-${1-j}`});
   }
  }
 }
 // Terminal ramp piers and abutment caps meet both first/last arch feet.
 for(const arch of [ARCHES[0],ARCHES.at(-1)]){
  const s=arch.center+(arch.index===0?-1:1)*arch.span/2,chunk=ck(s),top=h(s)-1.45;
  if(top>1)for(const side of [-1,1]){
   const d=side*ARCH_D;
   beam('concrete',[s,d,0],[s,d,top],2.2,2.8,chunk,y=>Math.max(0,Math.min(1,y/top)));
   b.box('concrete',s,authoredLateral(s,d),top+.1,3.6,4.4,.6,chunk);
  }
 }
 // End posts give every long guardrail/light/girder a real termination on the slab.
 for(const s of [0,LENGTH])for(const d of [-8.15,8.15,-WIDTH/2+.13,WIDTH/2-.13]){
  beam('concrete',[s,d,h(s)-.5],[s,d,h(s)+railTop(s)],.22,.22,ck(s),1,`toe-${s}-${d}`);
  terminals.push({kind:'rail',a:[s,d,h(s)+railTop(s)],supportA:`toe-${s}-${d}`});
 }
 // Continuous mapped access paths: western sweeping descent and eastern 3.5-turn helix.
 // Each section shares deck/ground interpolation; supports use their own DEM feet.
 for(const ramp of accesses){
  const samples=ramp.samples,chunk=ck(ramp.topStation),name=`access-${ramp.id}`;
  const at=(v,d,dy=0)=>[v.x+v.nx*d,v.y+dy,v.z+v.nz*d];
  const half=ramp.width/2;
  loft('concrete',samples.map(v=>[at(v,-half),at(v,-half,-.4),at(v,half,-.4),at(v,half)]),chunk,samples.flatMap(v=>Array(4).fill(v.weight)),name);
  const rawBeam=(material,a,c,width,depth,wa,wc,support)=>{
   const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...c),v=bv.clone().sub(av),len=v.length();
   const dir=v.clone().normalize(),g=new THREE.BoxGeometry(width,len,depth);
   g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir));g.translate(...av.clone().add(bv).multiplyScalar(.5).toArray());
   retain(support,g);b.put(g,material,chunk,1);
   const p=g.attributes.position;g.setAttribute('bridgeLift',new THREE.Float32BufferAttribute(Array.from({length:p.count},(_,i)=>{
    const t=Math.max(0,Math.min(1,new THREE.Vector3().fromBufferAttribute(p,i).sub(av).dot(dir)/len));return wa+(wc-wa)*t;
   }),1));
  };
  for(const side of [-1,1]){
   const rail=`${name}-rail-${side}`,d=side*(half-.1);
   loft('rail',samples.map(v=>[at(v,d-.055,.98),at(v,d-.055,.88),at(v,d+.055,.88),at(v,d+.055,.98)]),chunk,samples.flatMap(v=>Array(4).fill(v.weight)),rail);
   for(let j=0;j<samples.length;j++)if(j===0||j===samples.length-1||j%(near?2:5)===0){
    const v=samples[j],post=`${name}-post-${side}-${j}`,a=at(v,d,-.12),c=at(v,d,.98);
    rawBeam('rail',a,c,.10,.10,v.weight,v.weight,post);
    terminals.push({kind:'access-rail-post',worldA:a,worldB:c,supportA:name,supportB:rail});
    if(j===0||j===samples.length-1)terminals.push({kind:'access-rail',worldA:c,supportA:post});
   }
  }
  // Piers under every ~10 m along each path, with shared upper section contacts.
  let last=-Infinity;
  for(let j=0;j<samples.length;j++){
   const v=samples[j];if(v.y<1||v.s-last<10)continue;last=v.s;
   const foot=`${name}-foot-${j}`,a=[v.x,0,v.z],c=[v.x,v.y-.18,v.z];
   const g=new THREE.BoxGeometry(1.6,.4,1.6);g.translate(v.x,.2,v.z);retain(foot,g);b.put(g,'concrete',chunk,0);
   rawBeam('concrete',a,c,.85,1.1,0,v.weight,`${name}-pier-${j}`);
   terminals.push({kind:'access-pier',worldA:a,worldB:c,supportA:foot,supportB:name});
  }
  const first=samples[0],end=samples.at(-1);
  terminals.push({kind:'access-fork',worldA:at(first,0,-.28),supportA:`slab-${Math.min(2,Math.floor(ramp.topStation/(LENGTH/3)))}`});
  // A ground landing block holds the ramp's closed low end, including both rail ends.
  const ground=`${name}-landing`,g=new THREE.BoxGeometry(ramp.width,.35,3.5);g.rotateY(-Math.atan2(-end.nx,end.nz));g.translate(end.x,.025,end.z);retain(ground,g);b.put(g,'concrete',chunk,0);
  terminals.push({kind:'access-landing',worldA:at(end,0,-.12),supportA:ground});
 }
 const root=b.finish();Object.defineProperty(root.userData,'terminals',{value:terminals});Object.defineProperty(root.userData,'namedSupports',{value:namedSupports});return root;
}
