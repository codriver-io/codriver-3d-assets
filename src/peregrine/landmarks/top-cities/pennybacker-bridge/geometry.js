import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE, SPAN, WIDTH, DECK, ARCH_WIDTH, ARCH_DEPTH, ARCH_D, ARCH_START, ARCH_END, STRUCTURE_START, STRUCTURE_END, LENGTH, LANDING, landingBlend, authoredLateral, archY } from './pennybacker-bridge-profile.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=bridgeBuilder({...PROFILE,bridgePoint:(s,d,y)=>PROFILE.bridgePoint(s,authoredLateral(s,d),y),meshStep:near?10:20},detail);
  const contacts=[],chunk=s=>near?(s<ARCH_START?0:s>ARCH_END?2:1):0;
  const member=(name,a,c,supports,mat,width,depth=width,ck=1,lift=1)=>{
    b.beam(mat,a,c,width,depth,ck,lift);contacts.push({name,ends:[a,c],supports,material:mat});
  };
  // World ramp pavement needs interior DEM samples across its width, not
  // merely two edge vertices. A sparse rectangle can bury its middle in the
  // limestone terrain even when both edges clear it. The slab uses the same
  // grid so its top cannot cut through the fitted pavement. Near/far keep
  // 2/4 m stations; merging still makes one draw per material/chunk.
  function rampPavement(a,c,ck,slab=false) {
    const stations=new Set([a,c,LANDING,LENGTH-LANDING].filter(s=>s>=a&&s<=c));
    for(let s=a+(near?2:4);s<c;s+=near?2:4)stations.add(s);
    for(const q of PROFILE.ALIGNMENT)if(q.s>a&&q.s<c)stations.add(q.s);
    const ss=[...stations].sort((u,v)=>u-v),ds=Array.from({length:13},(_,j)=>-11.15+22.3*j/12);
    if(slab){ds.unshift(-WIDTH/2);ds.push(WIDTH/2);}
    const cols=ds.length-1,vertices=[],indices=[];
    // Split the land-ramp median: each dense terrain grid
    // follows its own road ribbon instead of bridging the widening gap.
    if(a===0||c===LENGTH){
      for(const side of [0,1]){
        const edge=side===0?[-11.15,0]:[0,11.15],v=[],idx=[];
        const ds=Array.from({length:7},(_,j)=>edge[0]+(edge[1]-edge[0])*j/6);
        if(slab){if(side===0)ds.unshift(-WIDTH/2);else ds.push(WIDTH/2);}
        const steps=Array.from({length:Math.ceil((c-a)/(near?2:4))+1},(_,i)=>a+(c-a)*i/Math.ceil((c-a)/(near?2:4)));
        const columns=ds.length-1,stride=ds.length;
        for(let i=0;i<steps.length;i++)for(let j=0;j<=columns;j++){
          const st=steps[i],d=ds[j];
          const q=PROFILE.bridgePoint(st,authoredLateral(st,d,side),PROFILE.deckHeight(st)-(slab?.22:.12));v.push(q.x,q.y,q.z);
          if(i&&j){const k=(i-1)*stride+j-1,n=i*stride+j-1;idx.push(k,k+1,n,k+1,n+1,n);}
        }
        if(slab){const start=v.length/3;
          for(let i=0;i<steps.length;i++){
            for(const d of [ds[0],ds.at(-1)]){const st=steps[i],q=PROFILE.bridgePoint(st,authoredLateral(st,d,side),PROFILE.deckHeight(st)-.87);v.push(q.x,q.y,q.z);}
            if(i){const k=(i-1)*stride,n=i*stride,u=start+(i-1)*2,w=start+i*2;idx.push(u,w,u+1,u+1,w,w+1,k,n,u,u,n,w,k+columns,u+1,n+columns,u+1,w+1,n+columns);}
          }
        }
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));const clean=[];for(let i=0;i<idx.length;i+=3){const a=new THREE.Vector3().fromArray(v,idx[i]*3),c=new THREE.Vector3().fromArray(v,idx[i+1]*3),d=new THREE.Vector3().fromArray(v,idx[i+2]*3);if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)clean.push(idx[i],idx[i+1],idx[i+2]);}g.setIndex(clean);g.computeVertexNormals();b.put(g,slab?'concrete':'asphalt',ck);
      }
      return;
    }
    for(let i=0;i<ss.length;i++)for(let j=0;j<=cols;j++) {
      const q=PROFILE.bridgePoint(ss[i],ds[j],PROFILE.deckHeight(ss[i])-(slab?.22:.12));
      vertices.push(q.x,q.y,q.z);
      if(i&&j){const k=(i-1)*(cols+1)+j-1,n=i*(cols+1)+j-1;indices.push(k,k+1,n,k+1,n+1,n);}
    }
    if(slab) {
      const start=vertices.length/3;
      for(let i=0;i<ss.length;i++) {
        for(const d of [-WIDTH/2,WIDTH/2]){const q=PROFILE.bridgePoint(ss[i],d,PROFILE.deckHeight(ss[i])-.87);vertices.push(q.x,q.y,q.z);}
        if(i){const a=(i-1)*(cols+1),c=i*(cols+1),v=start+(i-1)*2,w=start+i*2;
          indices.push(v,w,v+1,v+1,w,w+1,a,c,v,v,c,w,a+cols,v+1,c+cols,v+1,w+1,c+cols);
        }
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,slab?'concrete':'asphalt',ck);
  }
  const sections=[0,STRUCTURE_START,ARCH_START,ARCH_END,STRUCTURE_END,LENGTH];
  for(let i=1;i<sections.length;i++) {
    const a=sections[i-1],c=sections[i],ck=chunk((a+c)/2);
    // Surface and shared HD overlay use the same profile. Slab lies below it.
    if(i===1||i===sections.length-1){rampPavement(a,c,ck,true);rampPavement(a,c,ck);}
    else {b.strip('concrete',a,c,-WIDTH/2,WIDTH/2,-.22,.65,ck);b.strip('asphalt',a,c,-11.15,11.15,-.12,0,ck);}
    const sa=Math.max(a,10),sc=Math.min(c,LENGTH-10);
    b.strip('concrete',sa,sc,11.2,WIDTH/2-.25,.16,.48,ck);
    contacts.push({name:`walkway ${i}`,ends:[[sa,12.1,PROFILE.deckHeight(sa)-.25],[sc,12.1,PROFILE.deckHeight(sc)-.25]],supports:['slab','slab'],material:'concrete'});
    // Concrete traffic barriers connect directly to the slab and walk.
    for(const d of [-WIDTH/2+.22,0,WIDTH/2-.2]) {
      if(d!==0||(a>=STRUCTURE_START&&c<=STRUCTURE_END))b.strip('concrete',d===0?Math.max(sa,STRUCTURE_START):sa,d===0?Math.min(sc,STRUCTURE_END):sc,d-.2,d+.2,.98,1.24,ck);
      if(d!==0) {
        b.strip('rail',sa,sc,d-.04,d+.04,1.16,.08,ck);
        // Vertical posts close rail ends even at LOD/chunk boundaries.
        const posts=new Set([sa,sc]);for(let s=sa;s<sc;s+=near?3:15)posts.add(s);
        for(const s of posts)b.box('rail',s,d,PROFILE.deckHeight(s)+1.04,.16,.16,.3,ck);
        contacts.push({name:`edge rail ${i}/${d}`,ends:[[sa,d,PROFILE.deckHeight(sa)+1.12],[sc,d,PROFILE.deckHeight(sc)+1.12]],supports:['rail-post','rail-post'],material:'rail'});
      }
    }
    if(near) {
      for(const d of [-10.5,10.5])b.strip('paint',a,c,d-.06,d+.06,.01,0,ck);
      for(let s=Math.ceil(a/12)*12;s<c-3;s+=12)for(const d of [-4.45,4.45])b.strip('paint',s,Math.min(s+3,c),d-.065,d+.065,.015,0,ck);
    }
  }
  // Three south approach spans and a single north approach; no lake piers.
  const southSpan=(ARCH_START-STRUCTURE_START)/3;
  const bentStations=[STRUCTURE_START,STRUCTURE_START+southSpan,STRUCTURE_START+2*southSpan,ARCH_START,ARCH_END,STRUCTURE_END];
  for(const s of bentStations) {
    const top=DECK-.86,ck=chunk(s);
    b.box('concrete',s,0,top-.5,2.4,WIDTH-.6,1,ck);
    for(const d of [-8,8]) {
      b.box('concrete',s,d,.25,3.6,3.6,.5,ck,0);
      member(`bent ${s}/${d}`,[s,d,.3],[s,d,top-.6],['concrete','concrete'],'concrete',1.25,1.25,ck,y=>Math.max(0,Math.min(1,y/(top-.6))));
    }
  }
  for(const [a,c] of [[STRUCTURE_START,ARCH_START],[ARCH_END,STRUCTURE_END]])for(let d=-10.5;d<=10.5;d+=near?3.5:7) {
    b.strip('concrete',a,c,d-.24,d+.24,-.86,1.49,chunk((a+c)/2));
    contacts.push({name:`approach girder ${a}/${d}`,ends:[[a,d,DECK-1.6],[c,d,DECK-1.6]],supports:['concrete','concrete'],material:'concrete',exclude:'longitudinal'});
  }
  // Steel floor system. Four main longitudinal stringers and transverse
  // 7 ft plate girders receive the hanger sockets under the concrete deck.
  for(const d of [-10.8,-3.6,3.6,10.8]) {
    b.strip('girder',ARCH_START,ARCH_END,d-.14,d+.14,-.88,1.45,1);
    contacts.push({name:`main stringer ${d}`,ends:[[ARCH_START,d,DECK-1.5],[ARCH_END,d,DECK-1.5]],supports:['concrete','concrete'],material:'girder'});
  }
  const floors=[];
  for(let i=0;i<18;i++) {
    const s=ARCH_START+24+(SPAN-48)*i/17;floors.push(s);
    b.box('girder',s,0,DECK-.45-2.1336/2,.42,25.7,2.1336,1);
    contacts.push({name:`floor beam ${i}`,ends:[[s,-12.85,DECK-.55],[s,12.85,DECK-.55]],supports:['cable','cable'],material:'girder'});
    for(const d of ARCH_D)for(const delta of near?[-.14,.14]:[0]) {
      const station=s+delta,lateral=d-Math.sign(d)*.25;
      member(`hanger ${i}/${d}/${delta}`,[station,lateral,DECK-.55],[station,lateral,archY(station)-ARCH_DEPTH/2+.1],['girder','arch-rib'],'cable',near?.05715:.095);
    }
  }
  // Large X wind braces stay beneath the roadway, never across the open sky.
  if(near)for(let i=1;i<floors.length;i+=2)for(const sign of [-1,1]) {
    member(`underside X ${i}/${sign}`,[floors[i-1],sign*10.8,DECK-1.8],[floors[i],-sign*10.8,DECK-1.8],['girder','girder'],'arch',.2,.18);
  }
  // Each arch is a continuous closed box ribbon: no segment overlap seams.
  const shape=new THREE.Shape(),N=near?96:40;
  shape.moveTo(0,archY(ARCH_START)+ARCH_DEPTH/2);
  for(let i=1;i<=N;i++)shape.lineTo(SPAN*i/N,archY(ARCH_START+SPAN*i/N)+ARCH_DEPTH/2);
  for(let i=N;i>=0;i--)shape.lineTo(SPAN*i/N,archY(ARCH_START+SPAN*i/N)-ARCH_DEPTH/2);
  shape.closePath();
  for(const d of ARCH_D) {
    const g=new THREE.ExtrudeGeometry(shape,{depth:ARCH_WIDTH,bevelEnabled:false});
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++) {const q=PROFILE.bridgePoint(ARCH_START+p.getX(i),d+p.getZ(i)-ARCH_WIDTH/2,p.getY(i));p.setXYZ(i,q.x,q.y,q.z);}
    g.computeVertexNormals();b.put(g,'arch',1,y=>Math.max(0,Math.min(1,(y-1.3)/(DECK-1.3))));
    for(const s of [ARCH_START,ARCH_END])b.box('concrete',s,d,1.5,5,4,3,1,0);
    contacts.push({name:`arch rib ${d}`,ends:[[ARCH_START,d,3],[ARCH_END,d,3]],supports:['concrete','concrete'],material:'arch'});
  }
  // Vierendeel struts, not diagonal roof trusses. Transverse beams bury
  // their end caps inside the two arch boxes.
  for(let i=0;i<9;i++) {
    const s=ARCH_START+27+(SPAN-54)*i/8,y=archY(s)-.4;
    member(`Vierendeel ${i}`,[s,ARCH_D[0],y],[s,ARCH_D[1],y],['arch-rib','arch-rib'],'arch',.9,1.15);
  }
  for(const contact of contacts)contact.ends=contact.ends.map(([s,d,y])=>[s,authoredLateral(s,d),y]);
  const model=b.finish();Object.defineProperty(model.userData,'memberContacts',{value:contacts,enumerable:false});
  return model;
}
