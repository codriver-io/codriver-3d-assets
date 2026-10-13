import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC} from './config.js';
import {PROFILES,TAPER} from './cambie-bridge-profile.js';

// Original editable twin spine/wing model. Named inspection parts are retained
// only for observable support tests, then normal delivery batches by material.
export function create({detail='near',inspection=false}={}){
 const near=detail==='near',root=new THREE.Group();root.name=SPEC.name;
 const parts=new Map(),contacts=[];
 for(const p of PROFILES){
  const b=assetBuilder({...p.CHAMPLAIN,id:`cambie-bridge-${p.key}`},detail),L=p.L;
  const xyz=(s,d,y)=>{const q=p.bridgePoint(s,p.authoredLateral(s,d),y);return [q.x,q.y,q.z];};
  const prefix=name=>`${p.key}:${name}`;
  const slabAt=s=>prefix(`slab-${Math.min(2,Math.floor(s/(L/3)))}`);
  function put(name,g,mat,s,lift=1){
   if(inspection){const key=prefix(name),old=parts.get(key);parts.set(key,new THREE.Mesh(old?mergeGeometries([old.geometry,g.clone()]):g.clone(),new THREE.MeshBasicMaterial({side:THREE.DoubleSide})));}
   b.put(g,near?mat:({lamp:'rail',paint:'concrete'}[mat]||mat),near?Math.min(2,Math.floor(s/(L/3))):0,lift);
  }
  function box(name,mat,s,d,y,along,across,tall,lift=1){const q=p.bridgePoint(s,p.authoredLateral(s,d),y),g=new THREE.BoxGeometry(along,tall,across);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(name,g,mat,s,lift);}
  function beamGeometry(a,c,w,t=w){const A=new THREE.Vector3(...xyz(...a)),C=new THREE.Vector3(...xyz(...c)),v=C.clone().sub(A),g=new THREE.BoxGeometry(w,v.length(),t);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...A.add(C).multiplyScalar(.5).toArray());return g;}
  function beam(name,mat,a,c,w,t=w,hosts=null){put(name,beamGeometry(a,c,w,t),mat,(a[0]+c[0])/2);if(hosts)contacts.push({name:prefix(name),ends:[xyz(...a),xyz(...c)],hosts:hosts.map(prefix),tolerance:Math.max(w,t)*.8+.07});}
  function strip(name,mat,a,c,l,r,off,thick=0){
   const cuts=new Set([a,c]);for(let s=a+(near?5:8);s<c;s+=near?5:8)cuts.add(s);for(const q of p.ALIGNMENT)if(q.s>a&&q.s<c)cuts.add(q.s);
   for(const s of [...p.marine,TAPER,L-TAPER])if(s>a&&s<c)cuts.add(s);
   const stations=[...cuts].sort((a,c)=>a-c),pos=[],idx=[],stride=thick?4:2;
   for(let i=0;i<stations.length;i++){const s=stations[i],f=p.blend(s),y=p.deckHeight(s)+off*(name.startsWith('slab-')?1:f);
    for(const [d,dy] of thick?[[l,0],[r,0],[l,-thick*f],[r,-thick*f]]:[[l,0],[r,0]])pos.push(...xyz(s,d,y+dy));
    if(i){const x=(i-1)*stride,z=i*stride;idx.push(x,x+1,z,x+1,z+1,z);if(thick){
     // No buried toe underside: otherwise the flat ground reverses depth ordering.
     if(stations[i-1]>40&&s<L-40)idx.push(x+2,z+2,x+3,x+3,z+2,z+3);
     idx.push(x,z,x+2,x+2,z,z+2,x+1,x+3,z+1,x+3,z+3,z+1);}}
   }
   if(thick){const e=(stations.length-1)*4;idx.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(name,g,mat,(a+c)/2);
  }
  // Five current motor lanes within the original six-lane envelope; the sixth
  // southbound lane is a protected bike lane. Paths use published widths.
  for(let i=0;i<3;i++){const a=L*i/3,c=L*(i+1)/3;
   strip(`slab-${i}`,'concrete',a,c,p.left,p.right,-.2,.45);
   strip(`road-${i}`,'asphalt',a,c,...p.edges,0);
   if(p.key==='sb'){
    strip(`cycle-${i}`,'asphalt',a,c,-6.45,-3.85,.18);
    strip(`walk-${i}`,'concrete',a,c,-8.55,-6.75,.2,.4);
    strip(`divider-${i}`,'concrete',a,c,-3.8,-3.5,.75,.95);
   }else strip(`walk-${i}`,'concrete',a,c,5.8,10.1,.2,.4);
   for(const d of [p.edges[0]-.16,p.edges[1]+.16])strip(`kerb-${i}-${d}`,'concrete',a,c,d-.12,d+.12,.6,.8);
   if(near){const aa=Math.max(a,TAPER),cc=Math.min(c,L-TAPER);
    for(const d of p.edges)strip(`edge-${i}-${d}`,'paint',aa,cc,d-.06,d+.06,.12);
    const lanes=p.key==='sb'?2:3;for(let s=aa+3;s<cc-4;s+=12)for(let j=1;j<lanes;j++){const d=p.edges[0]+(p.edges[1]-p.edges[0])*j/lanes;strip(`dash-${s}-${j}`,'paint',s,s+3,d-.06,d+.06,.12);}
   }
  }
  function depth(s){
   if(s<p.marine[0]||s>p.marine[1])return 1.9;
   const u=(s-p.marine[0])/(p.marine[1]-p.marine[0])*3,phase=u-Math.floor(Math.min(2,u));return 2.2+2.1*(2*phase-1)**2;
  }
  // Continuously varying-depth trapezoidal box/spine with overhanging wings.
  const start=85,end=L-85,stations=[start,end,...p.piers];for(let s=start+5;s<end;s+=5)stations.push(s);for(const v of p.ALIGNMENT)if(v.s>start&&v.s<end)stations.push(v.s);
  const cuts=[...new Set(stations)].sort((a,b)=>a-b),pos=[],idx=[];
  for(let i=0;i<cuts.length;i++){const s=cuts[i],h=p.deckHeight(s),dep=depth(s),w=p.key==='sb'?4.2:5.0;
   for(const [d,y] of [[-w,h-.6],[w,h-.6],[-w+.6,h-.65-dep],[w-.6,h-.65-dep]])pos.push(...xyz(s,d,y));
   if(i){const x=(i-1)*4,z=i*4;idx.push(x,x+1,z,x+1,z+1,z,x+2,z+2,x+3,x+3,z+2,z+3,x,z,x+2,x+2,z,z+2,x+1,x+3,z+1,x+3,z+3,z+1);}}
  const e=(cuts.length-1)*4;idx.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);
  const girder=new THREE.BufferGeometry();girder.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));girder.setIndex(idx);girder.computeVertexNormals();put('spine',girder,'concrete',L/2);
  contacts.push({name:prefix('spine'),ends:[xyz(start,0,p.deckHeight(start)-.6),xyz(end,0,p.deckHeight(end)-.6)],hosts:[slabAt(start),slabAt(end)],tolerance:.18});
  // Slender flared pier shafts, not a wall across False Creek. Blue waterline
  // sections replace shaft faces; there is no coplanar coloured wrapper.
  for(let i=0;i<p.piers.length;i++){const s=p.piers[i],top=p.deckHeight(s)-.65-depth(s);if(top<.8)continue;
   const marine=s>=p.marine[0]-.1&&s<=p.marine[1]+.1;
   box(`foot-${i}`,'concrete',s,0,.3,5.4,6.0,.6,0);
   const ys=marine?[.6,1.4,2.15,top]:[.6,top];
   for(let k=1;k<ys.length;k++){const low=ys[k-1],hi=ys[k],positions=[],indices=[];
    for(const y of [low,hi]){const width=3.5+1.6*(y-.6)/(top-.6);for(const [a,d] of [[-1.15,-width/2],[1.15,-width/2],[1.15,width/2],[-1.15,width/2]])positions.push(...xyz(s+a,d,y));}
    for(let j=0;j<4;j++){const n=(j+1)%4;indices.push(j,n,j+4,n,n+4,j+4);}if(k===1)indices.push(0,2,1,0,3,2);if(k===ys.length-1)indices.push(4,5,6,4,6,7);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices.map((v,j)=>indices[j-j%3+(j%3===0?0:3-j%3)]));g.computeVertexNormals();put(`pier-${i}`,g,marine&&k===2?'tideblue':'concrete',s,y=>Math.max(0,Math.min(1,(y-.6)/(top-.6))));
   }
   // Cap overlaps its shaft interior and bears directly on the spine soffit.
   box(`cap-${i}`,'concrete',s,0,top-.18,2.8,6.0,.5);
   contacts.push({name:prefix(`pier-${i}`),ends:[xyz(s,0,.6),xyz(s,0,top)],hosts:[prefix(`foot-${i}`),prefix('spine')],tolerance:.15});
  }
  // Both outer edges keep fine vertical rail rhythm; no airborne cutoff.
  const railDs=p.key==='sb'?[p.left+.12,p.right-.12]:[p.left+.12,p.right-.12];
  for(const d of railDs){const start=25,end=L-25,ss=[start,end];for(let s=start+(near?3:12);s<end;s+=near?3:12)ss.push(s);ss.sort((a,b)=>a-b);
   const railHeight=s=>p.deckHeight(s)+1.35*p.blend(s),gs=[];
   for(let i=1;i<ss.length;i++)gs.push(beamGeometry([ss[i-1],d,railHeight(ss[i-1])],[ss[i],d,railHeight(ss[i])],.085,.085));
   put(`rail-${d}`,mergeGeometries(gs),'rail',L/2);contacts.push({name:prefix(`rail-${d}`),ends:[xyz(start,d,railHeight(start)),xyz(end,d,railHeight(end))],hosts:[prefix(`post-${d}-${start}`),prefix(`post-${d}-${end}`)],tolerance:.12});
   for(const s of ss)beam(`post-${d}-${s}`,'rail',[s,d,p.deckHeight(s)-.2],[s,d,railHeight(s)],.07,.07,[`slab-${Math.min(2,Math.floor(s/(L/3)))}`,`rail-${d}`]);
   if(near){const gs=[];for(let i=1;i<ss.length;i++)gs.push(beamGeometry([ss[i-1],d,p.deckHeight(ss[i-1])+.72*p.blend(ss[i-1])],[ss[i],d,p.deckHeight(ss[i])+.72*p.blend(ss[i])],.055));put(`rail-mid-${d}`,mergeGeometries(gs),'rail',L/2);
    contacts.push({name:prefix(`rail-mid-${d}`),ends:[xyz(start,d,p.deckHeight(start)+.72*p.blend(start)),xyz(end,d,p.deckHeight(end)+.72*p.blend(end))],hosts:[prefix(`post-${d}-${start}`),prefix(`post-${d}-${end}`)],tolerance:.12});}
  }
  // One outside line per deck, single slender arm and real slab contact.
  for(let s=120;s<L-100;s+=near?36:72){const d=p.key==='sb'?-7.6:7.9,h=p.deckHeight(s),sgn=p.key==='sb'?1:-1;
   beam(`pole-${s}`,'rail',[s,d,h+.2],[s,d,h+7.8],.16,.16,[`walk-${Math.min(2,Math.floor(s/(L/3)))}`,`arm-${s}`]);
   beam(`arm-${s}`,'rail',[s,d,h+7.8],[s,d+sgn*1.8,h+7.85],.14,.14,[`pole-${s}`,`lamp-${s}`]);box(`lamp-${s}`,'lamp',s,d+sgn*1.8,h+7.85,.65,.3,.2);
  }
  const part=b.finish();part.name=`cambie-bridge-${p.key}`;root.add(part);
 }
 root.userData={landmark:SPEC.id,units:'metres',origin:SPEC.origin,detail,triangles:root.children.reduce((n,g)=>n+g.userData.triangles,0),drawCalls:root.children.reduce((n,g)=>n+g.userData.drawCalls,0)};
 if(inspection){root.__parts=parts;root.__contacts=contacts;}return root;
}
