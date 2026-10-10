import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, STRUCTURE_START as A, STRUCTURE_END as Z, SUPPORT_S, PIER_S, DECK_CENTER as C, DECK_HALF as W } from './pont-saint-pierre-profile.js';

/** Original 1987 Saint-Pierre composite bridge. No photographic texture or third-party mesh. */
export function create({ detail = 'near' } = {}) {
  const near=detail==='near', b=bridgeBuilder({...p,meshStep:2},detail), h=p.deckHeight;
  const sides=[C-W,C+W], ck=s=>near&&s>p.BRIDGE_LENGTH/2?1:0;
  const xyz=(s,d,y)=>b.xyz(s,d,y), V=(s,d,y)=>new THREE.Vector3(...xyz(s,d,y));
  // Rectangular members in an untwisted vertical bridge frame.
  function beam(mat,a,z,width,depth=width,lift=1) {
    const v=V(...a), end=V(...z), axis=end.clone().sub(v), length=axis.length(); if(length<.001)return;
    axis.divideScalar(length); const n=new THREE.Vector3().crossVectors(axis,new THREE.Vector3(0,1,0));
    if(n.lengthSq()<1e-8){const q=p.bridgePoint(a[0]);n.set(-q.tz,0,q.tx);}else n.normalize();
    const up=new THREE.Vector3().crossVectors(n,axis).normalize();
    let g;
    if(!near && mat==='rail' && width<.12) {
      // Two closed-facing ribbons retain sparse far rail/arm silhouettes for four triangles.
      const a=-length/2,z=length/2,t=depth/2;
      g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([a,-t,0,z,-t,0,z,t,0,a,t,0,a,-t,0,a,t,0,z,t,0,z,-t,0],3));g.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);g.computeVertexNormals();
    } else g=new THREE.BoxGeometry(length,depth,width);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(axis,up,n).setPosition(v.add(end).multiplyScalar(.5)));
    b.put(g,mat,ck((a[0]+z[0])/2),lift);
  }
  function strip(mat,a,z,left,right,off=0,thick=0) {
    const cuts=near&&a<p.BRIDGE_LENGTH/2&&z>p.BRIDGE_LENGTH/2?[a,p.BRIDGE_LENGTH/2,z]:[a,z];
    for(let i=1;i<cuts.length;i++) b.strip(mat,cuts[i-1],cuts[i],left,right,off,thick,ck(cuts[i-1]));
  }
  function cylinder(mat,s,d,y,r0,r1,height,n=near?8:4,lift=1) {
    const g=new THREE.CylinderGeometry(r1,r0,height,n,1,false);g.translate(...xyz(s,d,y+height/2));b.put(g,mat,ck(s),lift);
  }
  // Closed bevelled rectangular loft, including asymmetric cutwater toes in plan.
  function loft(mat,s,d,rings,lift=1) {
    const points=[],indices=[],N=8;
    for(const [y,along,across,ch] of rings){const aa=along/2,dd=across/2;
      for(const [u,v] of [[-aa+ch,-dd],[aa-ch,-dd],[aa,-dd+ch],[aa,dd-ch],[aa-ch,dd],[-aa+ch,dd],[-aa,dd-ch],[-aa,-dd+ch]])points.push(...xyz(s+u,d+v,y));
    }
    for(let k=0;k<rings.length-1;k++)for(let i=0;i<N;i++){const j=(i+1)%N,a=k*N+i,c=k*N+j,u=(k+1)*N+i,v=(k+1)*N+j;indices.push(a,u,c,c,u,v);}
    for(let i=1;i<N-1;i++){if(rings[0][0]===0)indices.push(0,i,i+1);const a=(rings.length-1)*N;indices.push(a,a+i+1,a+i);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,mat,ck(s),lift);
  }

  // Fallback road, retained on the currently pedestrian-tagged OSM way. No invented lane paint.
  // Thin top road surface above the deck slab; structural concrete stays 18 cm below pavement.
  strip('concrete',A+.02,Z-.02,C-W,C+W,-.18,.57);
  strip('asphalt',0,p.BRIDGE_LENGTH,-5.2,2.8,0,0);
  for(const [l,r] of [[C-W,-5.2],[2.8,C+W]]) {
    // Thin raised sidewalk plate, carried by the inner kerb web and transverse steel.
    // The outer face stays slim so the white truss reads from across the river.
    strip('concrete',A+.02,Z-.02,l,r,.75,.32);
    const kerb=l===C-W?r:l;
    strip('concrete',A+.02,Z-.02,l===C-W?kerb-.32:kerb,l===C-W?kerb:kerb+.32,.48,.71);
    // Separate edge moulding proud of the slab's lateral face, without coplanar tops.
    const edge=l===C-W?l:r, sign=l===C-W?-1:1;
    strip('stone',A+.02,Z-.02,Math.min(edge,edge+sign*.18),Math.max(edge,edge+sign*.18),.36,.14);
  }
  // Low rising approach fills to support the roadway on the flat-map banks.
  // Only the narrow roadway ramp is authored beyond the structural bridge, not the riverside quays.
  for(const [a,z] of [[0,A],[Z,p.BRIDGE_LENGTH]]) {
    const steps=Math.ceil((z-a)/2);
    for(let i=0;i<steps;i++){const sa=a+(z-a)*i/steps,sb=a+(z-a)*(i+1)/steps;
      const g=new THREE.BufferGeometry(),pos=[];
      for(const s of [sa,sb])for(const [d,y] of [[-5.2,h(s)-.16],[2.8,h(s)-.16],[-5.2,0],[2.8,0]])pos.push(...xyz(s,d,y));
      g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex([0,1,4,1,5,4,0,4,2,2,4,6,1,3,5,3,7,5,0,2,1,1,2,3,4,5,6,5,7,6]);g.computeVertexNormals();b.put(g,'stone',ck(sa),y=>Math.min(1,Math.max(0,y/Math.max(.01,h((sa+sb)/2)-.16))));
    }
  }

  // Four massive river foundations. The central negative space between the two rising pylons is real.
  for(const s of PIER_S) {
    const dy=h(s), grip=y=>Math.max(0,Math.min(1,(y-1.45)/(dy-1.45)));
    loft('stone',s,C,[[0,5.3,21.1,.45],[.45,5.3,21.1,.45]],0);
    loft('brick',s,C,[[.45,5.0,20.5,.35],[1.45,5.0,20.5,.35]],0);
    // Lower transverse masonry connecting both uprights; top kept below the steel bearings.
    loft('brick',s,C,[[1.45,3.6,16.8,.3],[2.65,3.6,16.8,.3]],grip);
    for(const d of [C-7.5,C+7.5]) {
      loft('brick',s,d,[[1.45,4.0,4.0,.4],[2.6,3.7,3.55,.3],[dy-.6,3.1,3.1,.17],[dy+3.05,3.1,3.1,.17]],grip);
      // Recessed warm brick inset on the broad pylon faces. Its edges are lighter stone quoins.
      if(near)for(const sign of [-1,1]) {
        b.box('brick',s+sign*1.57,d,(2.8+dy+2.55)/2,.075,2.0,dy+2.55-2.8,ck(s),grip);
        for(let y=3.1;y<dy+2.5;y+=.45) b.box('stone',s+sign*1.62,d,y,.09,1.96,.038,ck(s),grip);
      }
      // Narrow limestone quoins outline the substantial rust-brick shaft in both LODs.
      for(const sign of [-1,1])for(const side of [-1,1])
        b.box('stone',s+sign*1.565,d+side*1.43,dy+1.225,.08,.20,3.65,ck(s));
      // Pylon crown/coping and stone bearing ledges connect the lattice feet.
      b.box('stone',s,d,dy+3.16,3.35,3.3,.22,ck(s));
      b.box('stone',s,d,dy-3.35,4.2,3.3,.9,ck(s),grip);
    }
    // A visible stone string course and corner masonry rhythm, not a ground-clutter box grid.
    if(near)for(const d of [C-10.28,C+10.28]) for(let y=.7;y<1.4;y+=.32) b.box('stone',s,d,y,4.65,.07,.035,ck(s),0);
  }
  // Abutment blocks from grade to the sidewalks; end pylons match the bridge's formal entrances.
  for(const s of [A,Z])for(const d of [C-7.25,C+7.25]) {
    const y=h(s);loft('brick',s,d,[[0,3.4,3.05,.18],[y+.6,3.4,3.05,.18]],v=>Math.min(1,v/(y+.6)));
    loft('stone',s,d,[[y+.6,2.6,2.6,.12],[y+3.05,2.6,2.6,.12]],1);
    b.box('stone',s,d,y+3.16,2.9,2.9,.22,ck(s));
  }

  // The five shallow white lattice haunches, with triangular windows in both LODs.
  for(let k=1;k<SUPPORT_S.length;k++) {
    const a=SUPPORT_S[k-1]+1.4,z=SUPPORT_S[k]-1.4;
    const n=near?Math.max(8,Math.round((z-a)/4.5)):Math.max(6,Math.round((z-a)/7));
    const station=t=>a+(z-a)*t;
    const low=t=>h(station(t))-3.78+2.43*4*t*(1-t);
    for(const d of [C-5.85,C+5.85]) {
      for(let i=0;i<n;i++) {
        const t=i/n,u=(i+1)/n,sa=station(t),sz=station(u),sm=station((t+u)/2);
        beam('lattice',[sa,d,low(t)],[sz,d,low(u)],.48,.38);
        beam('lattice',[sa,d,h(sa)-.84],[sz,d,h(sz)-.84],.50,.40);
        // Warren V web, the distinctive narrow repeated triangular openings.
        beam('lattice',[sa,d,low(t)],[sm,d,h(sm)-.84],.30,.28);
        beam('lattice',[sm,d,h(sm)-.84],[sz,d,low(u)],.30,.28);
        if(near)beam('lattice',[sa,d,low(t)],[sa,d,h(sa)-.84],.22,.22);
      }
      // Feet deliberately overlap their bearing/pylon ledges, never float above them.
      for(const [s,y] of [[a,low(0)],[z,low(1)]])b.box('steel',s,d,y-.10,1.4,.65,.35,ck(s));
    }
    for(let s=a;s<z;s+=near?4.7:9.4) {
      beam('steel',[s,C-5.8,h(s)-1.0],[s,C+5.8,h(s)-1.0],.24,.4);
      for(const edge of sides)beam('steel',[s,edge,h(s)-.10],[s,edge,h(s)+.43],.16,.18);
      if(near)for(const d of [C-3.05,C+3.05])beam('steel',[s,d,h(s)-1.0],[Math.min(z,s+4.7),d,h(Math.min(z,s+4.7))-1.0],.22,.35);
    }
  }

  // Green cast-metal parapets: double rails, collared posts and X/diamond open panels.
  const intervals=[];
  for(let i=1;i<SUPPORT_S.length;i++)intervals.push([SUPPORT_S[i-1]+1.55,SUPPORT_S[i]-1.55]);
  for(const edge of sides)for(const [a,z] of intervals) {
    strip('rail',a,z,edge-.11,edge+.11,1.92,.14);
    strip('rail',a,z,edge-.07,edge+.07,1.02,.09);
    const n=Math.ceil((z-a)/(near?1.85:3.7));
    for(let i=0;i<=n;i++) {
      const s=a+(z-a)*i/n;beam('rail',[s,edge,h(s)+.75],[s,edge,h(s)+1.87],.10,.11);
      if(near)b.box('rail',s,edge,h(s)+1.56,.19,.18,.13,ck(s));
      if(i<n){const e=a+(z-a)*(i+1)/n;beam('rail',[s,edge,h(s)+1.02],[e,edge,h(e)+1.85],near?.055:.075);beam('rail',[s,edge,h(s)+1.85],[e,edge,h(e)+1.02],near?.055:.075);}
    }
  }

  // Decorative lantern standards: flared base, slender mast, curved twin arms, three lanterns.
  // Central lantern is higher than the two arm lanterns, as in the photo dossier.
  const lamps=Array.from({length:13},(_,i)=>A+5+(Z-A-10)*i/12);
  for(const s of lamps)for(const d of [C-W+.3,C+W-.3]) {
    const y=h(s)+.75, rise=1.1;
    const lc=(mat,ss,dd,yy,r0,r1,height,...rest)=>cylinder(mat,ss,dd,y+(yy-y)*rise,r0,r1,height*rise,...rest);
    const lb=(mat,a,z,...rest)=>beam(mat,[a[0],a[1],y+(a[2]-y)*rise],[z[0],z[1],y+(z[2]-y)*rise],...rest);
    lc('stone',s,d,y,.32,.27,.24);
    lc('rail',s,d,y+.24,.19,.125,.4);
    lc('rail',s,d,y+.64,.095,.072,3.82);
    for(const yy of near?[y+1.15,y+3.5,y+4.4]:[y+4.4])lc('rail',s,d,yy,.15,.14,.12);
    for(const side of [-1,1]) {
      const pts=near?[[0,4.15],[.26,4.00],[.58,4.12],[.85,4.42],[.88,4.72]]:[[0,4.15],[.88,4.72]];
      for(let i=1;i<pts.length;i++)lb('rail',[s+pts[i-1][0]*side,d,y+pts[i-1][1]],[s+pts[i][0]*side,d,y+pts[i][1]],.075,.075);
    }
    for(const [off,up] of [[-.88,4.72],[0,5.13],[.88,4.72]]) {
      const ss=s+off;
      if(off===0)lc('rail',ss,d,y+4.4,.07,.07,.73);
      lc('rail',ss,d,y+up,.22,.28,.1);
      lc('lamp',ss,d,y+up+.1,.22,.29,.50,near?6:4);
      // Flared cap and pointed finial: touching, standard closed GLB geometry.
      lc('rail',ss,d,y+up+.60,.32,.065,.22,near?6:4);
      lc('rail',ss,d,y+up+.82,.065,0,.18,near?5:3);
      if(near)for(let k=0;k<6;k++){const ang=k*Math.PI/3;const so=Math.cos(ang)*.25,dd=Math.sin(ang)*.25;lb('rail',[ss+so*.88,d+dd*.88,y+up+.1],[ss+so*1.16,d+dd*1.16,y+up+.60],.035,.035);}
    }
  }
  return b.finish();
}
