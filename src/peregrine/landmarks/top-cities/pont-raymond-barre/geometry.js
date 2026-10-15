import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { AXIS, OUTLINE, S0, S1, point, edges, trackD, deckY, archPoint, archSectionHeight } from './pont-raymond-barre-parts.js';

export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const parts={}, counts={}, contacts=[];
  function put(g,mat,name) {
    if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));
    g.computeVertexNormals();
    const offset=counts[mat]||0;
    (parts[name]??=[]).push({mat,start:offset,count:g.index.count});counts[mat]=offset+g.index.count;
    b.put(g,mat);
  }
  function bar(name,mat,a,c,w,dep=w,round=false) {
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),v=cv.clone().sub(av),len=v.length();
    const g=round?new THREE.CylinderGeometry(w/2,w/2,len,near?6:4,1,false):new THREE.BoxGeometry(w,len,dep);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat,name);
  }
  function member(name,mat,a,c,w,supportA,supportC,tolerance=.22,dep=w,round=false) {
    bar(name,mat,a,c,w,dep,round);contacts.push({name,a,c,supportA,supportC,tolerance});
  }
  function box(name,mat,s,d,y,l,w,h) {
    const g=new THREE.BoxGeometry(l,h,w);g.rotateY(-Math.atan2(AXIS[1],AXIS[0]));g.translate(...point(s,d,y));put(g,mat,name);
  }
  // Explicit outward hints keep every closed prism wound correctly, including
  // the asymmetric under-deck triangles and the outward-canted arch boxes.
  function faces(name,mat,quads) {
    const p=[],ix=[];
    for(const [q,hint] of quads) {
      const n=new THREE.Vector3(...q[1]).sub(new THREE.Vector3(...q[0])).cross(new THREE.Vector3(...q[2]).sub(new THREE.Vector3(...q[0])));
      if(n.lengthSq()<1e-12)continue;
      const k=p.length/3;p.push(...q.flat());
      if(n.dot(new THREE.Vector3(...hint))>=0)ix.push(k,k+1,k+2,k,k+2,k+3);else ix.push(k,k+2,k+1,k,k+3,k+2);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);put(g,mat,name);
  }
  function loft(name,mat,rings,omit=[]) {
    const quads=[],n=rings[0].length;
    const ctr=r=>r.reduce((a,p)=>a.map((v,k)=>v+p[k]/r.length),[0,0,0]);
    for(let i=1;i<rings.length;i++)for(let j=0;j<n;j++) {
      if(omit.includes(j))continue;
      const q=[rings[i-1][j],rings[i-1][(j+1)%n],rings[i][(j+1)%n],rings[i][j]];
      const middle=ctr(q),centre=ctr([ctr(rings[i-1]),ctr(rings[i])]);
      quads.push([q,middle.map((v,k)=>v-centre[k])]);
    }
    for(const [r,sign] of [[rings[0],-1],[rings.at(-1),1]]) {
      for(let j=1;j<n-1;j++)quads.push([[r[0],r[j],r[j+1],r[j+1]],[sign*AXIS[0],0,sign*AXIS[1]]]);
    }
    faces(name,mat,quads);
  }
  const ss=[...new Set([S0+.001,S1-.001,0,150,...OUTLINE.map(p=>p.s).filter(s=>s>S0+.001&&s<S1-.001),...Array.from({length:Math.ceil((S1-S0)/(near?3:9))},(_,i)=>S0+i*(near?3:9)).filter(s=>s>S0+.001&&s<S1-.001)])].sort((a,c)=>a-c);
  const rect=(s,l,r,top,bottom)=>[point(s,l,top),point(s,r,top),point(s,r,bottom),point(s,l,bottom)];
  // The deck's outside edge is the actual mapped polygon; no rectangular slab
  // hides the curved bank transitions or the 60 m downstream belvedere.
  loft('deck-body','deck',ss.map(s=>{const [l,r]=edges(s),y=deckY(s);return rect(s,l,r,y,y-Math.min(.65,y));}),[0]);
  const tops={track:[],walk:[]};
  for(let i=1;i<ss.length;i++)for(const mat of ['track','walk']) {
    const q=[ss[i-1],ss[i]].map(s=>{const [l,r]=edges(s),cut=Math.max(l,Math.min(r,trackD(s)+4.8));return [point(s,mat==='track'?l:cut,deckY(s)),point(s,mat==='track'?cut:r,deckY(s))];});
    tops[mat].push([[q[0][0],q[0][1],q[1][1],q[1][0]],[0,1,0]]);
  }
  for(const mat of ['track','walk'])faces(`${mat}-surface`,mat,tops[mat]);
  // White longitudinal box ties, below the track platform. Both remain in far.
  for(const side of [-1,1])loft(`girder-${side}`,'deck',ss.map(s=>rect(s,trackD(s)+side*4.3-.75,trackD(s)+side*4.3+.75,deckY(s)-.12,Math.max(0,deckY(s)-1.65))));
  // Twin canted box arches, 150 m span, outer crown 17.5 m above deck.
  for(const side of [-1,1]) {
    const n=near?72:24,rings=[];
    for(let i=0;i<=n;i++) {
      const t=i/n,s=150*t,c=archPoint(s,side),h=archSectionHeight(t)/2;
      const d=side*(4.3+16.25*4*t*(1-t)*Math.tan(Math.PI/18));
      rings.push([point(s,d-.575,c[1]+h),point(s,d+.575,c[1]+h),point(s,d+.575,c[1]-h),point(s,d-.575,c[1]-h)]);
    }
    loft(`arch-${side}`,'arch',rings);
    // The exposed terminal segments of each box arch are embedded in the tie.
    contacts.push({name:`arch-${side}`,a:archPoint(0,side),c:archPoint(150,side),supportA:`girder-${side}`,supportC:`girder-${side}`,tolerance:.95});
    for(let s=8;s<149;s+=near?8:16) {
      const topS=Math.max(2,Math.min(148,s+(s-75)*.16));
      // End centred inside the lower arch skin and top of the longitudinal tie.
      const a=point(s,side*4.3,7.42),c=archPoint(topS,side);c[1]-=archSectionHeight(topS/150)/2-.05;
      member(`hanger-${side}-${s}`,'hanger',a,c,near?.075:.13,`girder-${side}`,`arch-${side}`,.22,.075,true);
      if(near)box(`socket-${side}-${s}`,'arch',s,side*4.3,7.65,.32,.32,.30);
    }
  }
  // P1: a single broad river cap and low V-shaped steel knee/backslope system.
  // P2: paired splayed concrete shafts. Footings stay at local y=0.
  for(const [station,type] of [[0,'p1'],[150,'p2']]) {
    if(type==='p1') {
      box('p1-foot','concrete',0,2,.35,7,15,.7);
      for(const d of [-3.9,5.9])box(`p1-shaft-${d}`,'concrete',0,d,2.2,3.5,2.2,3.3);
      box('p1-cap','concrete',0,1,4.1,5.2,14,1.5);
      for(const side of [-1,1])for(const [s,end] of [[-17,'back'],[12,'front']]) {
        member(`knee-${side}-${end}`,'deck',point(0,side*4.3,4.7),point(s,trackD(s)+side*4.3,deckY(s)-1.55),1.25,'p1-cap',`girder-${side}`,.42,1.15);
      }
    } else {
      for(const side of [-1,1]) {
        const d=side*4.3;
        box(`p2-foot-${side}`,'concrete',station+2,d,.35,7,4,.7);
        member(`p2-shaft-${side}`,'concrete',point(station+2,d,.6),point(station,d,5.9),2.1,`p2-foot-${side}`,`girder-${side}`,.8,2.7);
      }
    }
  }
  // End blocks close the deck to local grade and support all track/rail ends.
  for(const [s,key] of [[S0+1,'west'],[S1-1,'east']]) {
    const [l,r]=edges(s);box(`${key}-abutment`,'concrete',s,(l+r)/2,deckY(s)/2,2,r-l,deckY(s));
  }
  // Cantilever cross beams reach the downstream promenade's fascia.
  for(let s=-45;s<S1-6;s+=near?8:16) {
    const [,r]=edges(s),d=trackD(s);
    member(`crossbeam-${s}`,'deck',point(s,d-4.3,Math.max(.2,deckY(s)-1.1)),point(s,r-.12,deckY(s)-.4),.32,'girder--1','deck-body',.75,.42);
  }
  // Four standard-gauge rails, mapped curved centreline; low rectangular metal
  // ribbons enter the terminal abutments instead of ending above open water.
  for(const [j,d] of [-2.3175,-.8825,.8825,2.3175].entries()) {
    const railSS=ss.filter(s=>{const [l,r]=edges(s);return trackD(s)+d>l+.08&&trackD(s)+d<r-.08;});
    const rings=railSS.map(s=>rect(s,trackD(s)+d-.045,trackD(s)+d+.045,deckY(s)+.12,deckY(s)-.03));
    loft(`tram-rail-${j}`,'hanger',rings);
    contacts.push({name:`tram-rail-${j}`,a:point(railSS[0],trackD(railSS[0])+d,deckY(railSS[0])),c:point(railSS.at(-1),trackD(railSS.at(-1))+d,deckY(railSS.at(-1))),supportA:'track-surface',supportC:'track-surface',tolerance:.15});
  }
  // Open horizontal guardrails; every end is held by its own named post.
  const railStations=[S0+.5,...ss.filter((s,i)=>i%(near?1:2)===0&&s>S0+2&&s<S1-2),S1-.5];
  for(const side of [-1,1]) {
    const dAt=s=>edges(s)[side<0?0:1]-side*.16;
    for(let i=0;i<railStations.length;i++) {
      const s=railStations[i],d=dAt(s),y=deckY(s);
      bar(`post-${side}-${i}`,'railing',point(s,d,y-.04),point(s,d,y+1.2),.09);
      contacts.push({name:`post-${side}-${i}`,a:point(s,d,y),c:point(s,d,y+1.14),supportA:'deck-body',supportC:`handrail-${side}-${Math.max(0,i-1)}-1.14`,tolerance:.23});
    }
    for(let i=1;i<railStations.length;i++) {
      const a=railStations[i-1],c=railStations[i];
      for(const h of near?[.3,.55,.8,1.14]:[.4,1.14])member(`${h===1.14?'handrail':'infill'}-${side}-${i-1}-${h}`,'railing',point(a,dAt(a),deckY(a)+h),point(c,dAt(c),deckY(c)+h),.065,`post-${side}-${i-1}`,`post-${side}-${i}`,.13);
    }
  }
  // Separate low safety curb along the tram/promenade boundary.
  loft('platform-edge','arch',ss.map(s=>rect(s,trackD(s)+4.45,trackD(s)+4.68,deckY(s)+.25,deckY(s))));
  // Tapered leaning overhead line/light masts, both LODs; wires end at masts.
  const poles=[];
  for(let s=-45;s<S1-15;s+=28) {
    const d=trackD(s)+4.6,y=deckY(s),top=point(s+1.2,d,y+6.4),base=point(s,d,y);
    member(`mast-${s}`,'railing',base,top,.16,'platform-edge',`mast-head-${s}`,.22);
    member(`mast-head-${s}`,'railing',top,point(s+1.2,d-7.8,y+6.4),.10,`mast-${s}`,`lamp-${s}`,.22);
    for(const off of [-1.6,1.6])poles.push({s,off,p:point(s+1.2,trackD(s)+off,y+6.4)});
    box(`lamp-${s}`,'lamp',s+1.2,d-7.8,y+6.38,.75,.28,.16);
  }
  for(const off of [-1.6,1.6]) {
    const rows=poles.filter(p=>p.off===off);
    for(let i=1;i<rows.length;i++)member(`contact-wire-${off}-${i}`,'hanger',rows[i-1].p,rows[i].p,near?.035:.055,`mast-head-${rows[i-1].s}`,`mast-head-${rows[i].s}`,.4);
  }
  if(near) {
    for(let s=16;s<112;s+=16) {
      const [,r]=edges(s),d=r-1.6;
      for(const u of [-.8,.8])box(`bench-leg-${s}-${u}`,'railing',s+u,d,7.75,.16,.75,.5);
      box(`bench-${s}`,'seat',s,d,8.05,2.5,.8,.2);
      box(`bench-back-${s}`,'seat',s,d+.32,8.3,2.5,.13,.5);
    }
  }
  const model=b.finish();
  // Non-enumerable inspection metadata keeps the published GLBs small.
  Object.defineProperties(model.userData,{parts:{value:parts},contacts:{value:contacts}});
  return model;
}
