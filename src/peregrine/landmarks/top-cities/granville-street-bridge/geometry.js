import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { PROFILE as p, PIERS, LEFT, RIGHT, lowerChord, authoredLateral, shoulderBlend, TAPER } from './granville-street-bridge-profile.js';

// Editable, original geometry. Optional inspection exposes each named component
// before batching so tests can exclude the member and test its actual supports.
export function create({ detail='near', inspection=false }={}) {
  const near=detail==='near', b=assetBuilder(p.CHAMPLAIN,detail), L=p.BRIDGE_LENGTH;
  const parts=new Map(), contacts=[];
  const xyz=(s,d,y,side)=>{const q=p.bridgePoint(s,authoredLateral(s,d,side),y);return [q.x,q.y,q.z];};
  const ck=s=>near?Math.min(2,Math.floor(s/(L/3))):0;
  function put(name,g,mat,s,lift=1) {
    if(inspection) { const old=parts.get(name);parts.set(name,new THREE.Mesh(old?mergeGeometries([old.geometry,g.clone()]):g.clone(),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}))); }
    b.put(g,near?mat:({yellow:'paint',lamp:'rail'}[mat]||mat),ck(s),lift);
  }
  function box(name,mat,s,d,y,along,across,tall,lift=1) {
    const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(along,tall,across);
    g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(name,g,mat,s,lift);
  }
  function barGeometry(a,c,w,t=w) {
    const A=new THREE.Vector3(...xyz(...a)),C=new THREE.Vector3(...xyz(...c));
    const v=C.clone().sub(A),g=new THREE.BoxGeometry(w,v.length(),t);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    g.translate(...A.add(C).multiplyScalar(0.5).toArray());return g;
  }
  function beam(name,mat,a,c,w,t=w,hosts=null) {
    put(name,barGeometry(a,c,w,t),mat,(a[0]+c[0])/2);
    if(hosts) contacts.push({name,ends:[xyz(...a),xyz(...c)],hosts,tolerance:Math.max(w,t)*0.8+0.12});
  }
  function strip(name,mat,a,c,l,r,off,thick,side) {
    // Short chords on every ramp; full profile/alignment controls in both LODs.
    const cuts=new Set([a,c]);
    for(let s=a+(near?6:12);s<c;s+=near?6:12)cuts.add(s);
    for(const q of p.ALIGNMENT)if(q.s>a&&q.s<c)cuts.add(q.s);
    for(const q of p.knots)if(q[0]>a&&q[0]<c)cuts.add(q[0]);
    for(const s of [20,45,TAPER,L-TAPER,L-45,L-20])if(s>a&&s<c)cuts.add(s);
    const stations=[...cuts].sort((a,c)=>a-c),pos=[],idx=[],flat=mat==='paint'||mat==='yellow',stride=flat?2:4;
    for(let i=0;i<stations.length;i++) {
      const s=stations[i],f=shoulderBlend(s),depth=name.startsWith('girder')?thick:thick*f,y=p.deckHeight(s)+off*(name.startsWith('slab')||name.startsWith('girder')?1:f);
      for(const [d,h] of flat?[[l,y],[r,y]]:[[l,y],[r,y],[l,y-depth],[r,y-depth]])pos.push(...xyz(s,d,h,side));
      if(i){const x=(i-1)*stride,z=i*stride;idx.push(x,x+1,z,x+1,z+1,z);if(!flat){
        // Buried thin toe undersides are omitted: the Cityscape ground uses
        // painter order, and these hidden faces create a reverse material cycle.
        if(!name.startsWith('slab')||(stations[i-1]>=45&&s<=L-45))idx.push(x+2,z+2,x+3,x+3,z+2,z+3);
        idx.push(x,z,x+2,x+2,z,z+2,x+1,x+3,z+1,x+3,z+3,z+1);
      }}
    }
    const e=(stations.length-1)*4;
    if(!flat)idx.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(name,g,mat,(a+c)/2);
  }
  // Three station chunks avoid one kilometre-long draw for every material near.
  for(let i=0;i<3;i++) {
    const a=L*i/3,c=L*(i+1)/3;
    for(const [side,l,r] of [[0,LEFT,-.6],[1,-.6,RIGHT]]) {
      strip(`slab-${i}`,'concrete',a,c,l,r,-0.14,0.9,side);
      strip(`road-${i}-${side}`,'asphalt',a,c,side?-.6:-10.2,side?9:-.6,0,0.025,side);
    }
    strip(`connector-${i}`,'asphalt',a,c,LEFT+0.5,-10.9,0.12,0.12);
    strip(`walk-${i}`,'concrete',a,c,9.05,RIGHT,0.12,0.24);
    strip(`divider-${i}`,'concrete',a,c,-10.85,-10.35,0.72,0.85);
    if(near) {
      const paintA=Math.max(a,TAPER),paintC=Math.min(c,L-TAPER);
      strip(`centre-${i}`,'yellow',paintA,paintC,-0.68,-0.51,0.12,0.006);
      for(const d of [-10.0,8.8])strip(`edge-${i}-${d}`,'paint',paintA,paintC,d-0.07,d+0.07,0.12,0.006);
      for(let s=paintA+2;s<paintC-4;s+=12)for(const d of [-6.95,-3.75,2.65,5.85])strip(`paint-${s}-${d}`,'paint',s,s+3,d-0.06,d+0.06,0.12,0.006);
      for(let s=paintA+2;s<paintC-4;s+=8)strip(`cycle-${s}`,'paint',s,s+2,-14.52,-14.43,0.24,0.006);
    }
  }
  const slabAt=s=>`slab-${Math.min(2,Math.floor(s/(L/3)))}`;
  const lines=[-15.5,7.6];
  // Continuous seven-span cantilever/deck trusses: deep over the piers,
  // shallow midspan, paired channels and open triangular panels in both LODs.
  for(let i=0;i<PIERS.length;i++) {
    const s=PIERS[i],top=p.deckHeight(s)-12.6;
    box(`foot-${i}`,'concrete',s,-3.95,0.5,6.8,27,1,0);
    // Capsule-ended wall pier, not a solid fill under the channel.
    const shape=new THREE.Shape();shape.moveTo(-11,-2.25);shape.lineTo(11,-2.25);
    shape.absarc(11,0,2.25,-Math.PI/2,Math.PI/2,false);shape.lineTo(-11,2.25);shape.absarc(-11,0,2.25,Math.PI/2,Math.PI*1.5,false);
    const g=new THREE.ExtrudeGeometry(shape,{depth:top-1,bevelEnabled:false,curveSegments:near?5:2});
    // Shape x=lateral, y=station offset. Extrusion axis becomes vertical.
    const pos=g.attributes.position;
    for(let j=0;j<pos.count;j++) {const q=xyz(s+pos.getY(j),-3.95+pos.getX(j),1+pos.getZ(j));pos.setXYZ(j,...q);}
    // Lateral/station/up basis has positive determinant; preserve winding.
    g.computeVertexNormals();put(`pier-${i}`,g,'concrete',s,y=>Math.max(0,Math.min(1,(y-1)/(top-1))));
    box(`cap-${i}`,'concrete',s,-3.95,top,5.3,27,0.9);
    for(const d of lines)box(`bearing-${i}-${d}`,'steel',s,d,p.deckHeight(s)-12.2,1.8,1.4,1.0);
  }
  for(let i=0;i<7;i++) {
    const a=PIERS[i],c=PIERS[i+1],n=Math.max(4,Math.round((c-a)/(near?7.6:15)));
    for(const d of lines) {
      const lo=s=>[s,d,lowerChord(s,a,c)],hi=s=>[s,d,p.deckHeight(s)-1.02];
      const lowName=`lower-${i}-${d}`,upName=`upper-${i}-${d}`,geoms=[];
      for(let k=0;k<n;k++)geoms.push(barGeometry(lo(a+(c-a)*k/n),lo(a+(c-a)*(k+1)/n),0.7,0.76));
      put(lowName,mergeGeometries(geoms),'steel',(a+c)/2);
      contacts.push({name:lowName,ends:[xyz(...lo(a)),xyz(...lo(c))],hosts:[`bearing-${i}-${d}`,`bearing-${i+1}-${d}`],tolerance:0.6});
      beam(upName,'steel',hi(a),hi(c),0.7,0.9,[slabAt(a),slabAt(c)]);
      for(let k=0;k<n;k++) {
        const s=a+(c-a)*k/n,t=a+(c-a)*(k+1)/n;
        beam(`diag-${i}-${d}-${k}`,'steel',k%2?hi(s):lo(s),k%2?lo(t):hi(t),near?0.37:0.46,near?0.42:0.5,k%2?[upName,lowName]:[lowName,upName]);
        beam(`vertical-${i}-${d}-${k}`,'steel',lo(s),hi(s),0.28,0.4,[lowName,upName]);
        if(near) {
          for(const yy of [lowerChord(s,a,c),p.deckHeight(s)-1.02])box(`gusset-${i}-${d}-${k}-${yy}`,'steel',s,d,yy,1.05,0.82,0.85);
          for(const dd of [-0.21,0.21])beam(`channel-${i}-${d}-${k}-${dd}`,'steel',[s,d+dd,lowerChord(s,a,c)],[t,d+dd,lowerChord(t,a,c)],0.10,0.16,[lowName,lowName]);
        }
      }
      beam(`vertical-${i}-${d}-end`,'steel',lo(c),hi(c),0.28,0.4,[lowName,upName]);
    }
    for(let k=0;k<=n;k++) {
      const s=a+(c-a)*k/n,y=p.deckHeight(s)-1.02;
      beam(`cross-${i}-${k}`,'steel',[s,lines[0],y],[s,lines[1],y],0.32,0.5,[`upper-${i}-${lines[0]}`,`upper-${i}-${lines[1]}`]);
      if(near&&k<n) {
        const t=a+(c-a)*(k+1)/n;
        beam(`bracing-${i}-${k}`,'steel',[s,lines[0],lowerChord(s,a,c)],[t,lines[1],lowerChord(t,a,c)],0.22,0.28,[`lower-${i}-${lines[0]}`,`lower-${i}-${lines[1]}`]);
      }
    }
  }
  // Short concrete-girder approach bays. No authored forks over provider ramps.
  for(const [a,c] of [[0,PIERS[0]],[PIERS.at(-1),L]]) {
    for(const d of [-14.8,-4,7.5])strip(`girder-${a}-${d}`,'concrete',Math.max(a,TAPER),Math.min(c,L-TAPER),d-0.45,d+0.45,-1.04,0.9);
    for(let s=a+25;s<c-10;s+=26) {
      const top=p.deckHeight(s)-2.05;if(top<0.8)continue;
      box(`approach-cap-${s}`,'concrete',s,-3.95,top,1.9,26.5,0.9);
      for(const d of [-14.8,-4,7.5])box(`approach-leg-${s}-${d}`,'concrete',s,d,(top+0.3)/2,1.4,1.65,top-0.3,y=>Math.max(0,Math.min(1,(y-0.3)/(top-0.3))));
    }
  }
  // Railings and poles terminate at named posts/slabs. Far preserves end posts.
  for(const d of [LEFT+0.12,RIGHT-0.12]) {
    const start=20,end=L-20,railHeight=s=>1.15*shoulderBlend(s);
    const stations=[start];for(let s=start+(near?4.5:12);s<end;s+=near?4.5:12)stations.push(s);stations.push(end);
    const rails=[];
    for(let i=1;i<stations.length;i++)rails.push(barGeometry([stations[i-1],d,p.deckHeight(stations[i-1])+railHeight(stations[i-1])],[stations[i],d,p.deckHeight(stations[i])+railHeight(stations[i])],0.12,0.12));
    const railName=`rail-${d}`;put(railName,mergeGeometries(rails),'rail',L/2);
    contacts.push({name:railName,ends:[xyz(start,d,p.deckHeight(start)+railHeight(start)),xyz(end,d,p.deckHeight(end)+railHeight(end))],hosts:[`post-${d}-${start}`,`post-${d}-${end}`],tolerance:0.15});
    for(const s of stations)beam(`post-${d}-${s}`,'rail',[s,d,p.deckHeight(s)-0.1*shoulderBlend(s)],[s,d,p.deckHeight(s)+railHeight(s)],0.1,0.12,[slabAt(s),railName]);
    if(near)for(const off of [0.55]) {
      const gs=[];for(let i=1;i<stations.length;i++)gs.push(barGeometry([stations[i-1],d,p.deckHeight(stations[i-1])+off*shoulderBlend(stations[i-1])],[stations[i],d,p.deckHeight(stations[i])+off*shoulderBlend(stations[i])],0.055));
      put(`rail-mid-${d}-${off}`,mergeGeometries(gs),'rail',L/2);
      contacts.push({name:`rail-mid-${d}-${off}`,ends:[xyz(start,d,p.deckHeight(start)+off*shoulderBlend(start)),xyz(end,d,p.deckHeight(end)+off*shoulderBlend(end))],hosts:[`post-${d}-${start}`,`post-${d}-${end}`],tolerance:0.15});
    }
  }
  for(let s=100;s<L-100;s+=near?36:108)for(const d of [LEFT+0.65,RIGHT-0.55]) {
    const y=p.deckHeight(s),sign=d<0?1:-1,name=`pole-${s}-${d}`,lamp=`lamp-${s}-${d}`;
    beam(name,'rail',[s,d,y+0.12],[s,d,y+7.2],0.16,0.16,[`${d<0?'connector':'walk'}-${Math.min(2,Math.floor(s/(L/3)))}`,`arm-${s}-${d}`]);
    beam(`arm-${s}-${d}`,'rail',[s,d,y+7.2],[s,d+sign*2.6,y+7.3],0.14,0.14,[name,lamp]);
    box(lamp,'lamp',s,d+sign*2.6,y+7.3,0.85,0.38,0.18);
  }
  const root=b.finish();if(inspection){root.__parts=parts;root.__contacts=contacts;}return root;
}
