import { BufferGeometry, Float32BufferAttribute } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, TOWER_S, TOWER_H, STRUCTURE_S, ANCHOR_S, DECK_H, CABLE_D, cableHeight } from './halogaland-bridge-profile.js';

// Original mesh. Every structural member uses the same station/lateral frame as navigation.
export function create({detail='near'}={}) {
  const near=detail==='near',b=bridgeBuilder({...p,meshStep:near?12:40},detail),L=p.BRIDGE_LENGTH;
  const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
  const xyz=(s,d,y)=>b.xyz(s,d,y),at=(s,d,dy)=>xyz(s,d,p.deckHeight(s)+dy);
  const bar=(mat,A,B,w,ck=0,lift=1,round=false)=>b.bar(mat,A,B,w,w,ck,round,lift);
  const footingWeight=y=>Math.max(0,Math.min(1,y/DECK_H));
  // A capped loft in a right handed (along, up, lateral) frame. The top and side
  // vertices are intentionally independent after normal generation at concrete chamfers.
  function loft(mat,rings,ck=0,lift=1) {
    const n=rings[0].length,pos=rings.flat(2),idx=[];
    for(let k=0;k<rings.length-1;k++)for(let i=0;i<n;i++) {
      const j=(i+1)%n,a=k*n+i,c=k*n+j;
      idx.push(a,a+n,c,c,a+n,c+n);
    }
    const e=(rings.length-1)*n;
    for(let i=1;i<n-1;i++)idx.push(0,i,i+1,e,e+i+1,e+i);
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,ck,lift);
  }
  const half=s=>s<TOWER_S[0]||s>TOWER_S[1]?7.7:9.3;
  // Closed steel box: bevelled underside, no open truss (unlike Lions Gate).
  function slab(a,c,mat) {
    const cuts=near?[a,...[L/3,2*L/3].filter(s=>s>a&&s<c),c]:[a,c];
    for(let k=1;k<cuts.length;k++) {
      const lo=cuts[k-1],hi=cuts[k],ss=new Set([lo,hi]);
      for(let s=lo+(near?10:28);s<hi;s+=near?10:28)ss.add(s);
      for(const q of p.ALIGNMENT)if(q.s>lo&&q.s<hi)ss.add(q.s);
      const stations=[...ss].sort((a,c)=>a-c);
      // Ground-level road ramps have at most .2 m of buried foundation.
      const rings=stations.map(s=>{const w=half((lo+hi)/2),h=p.deckHeight(s),bottom=Math.max(-.2,h-3);
        return [[-w,h-.15],[-w+.8,Math.max(-.19,h-1.1)],[-w+3,bottom],[w-3,bottom],[w-.8,Math.max(-.19,h-1.1)],[w,h-.15]].map(([d,y])=>xyz(s,d,y));});
      // Section winding gives outward closed box faces along the station axis.
      loft(mat,rings,chunk(lo));
    }
  }
  slab(0,TOWER_S[0],'concrete');slab(TOWER_S[0],TOWER_S[1],'steel');slab(TOWER_S[1],L,'concrete');
  // Pavement and continuous edge members on the curved road. Two lane road;
  // only the west side carries the 3.5 m shared cycle/footpath.
  b.strip('asphalt',0,L,-4.75,4.75,0,0);
  for(const [a,c] of [[0,TOWER_S[0]],[TOWER_S[1],L]])b.strip('concrete',a,c,-7.65,-5.05,.16,.26);
  b.strip('concrete',TOWER_S[0],TOWER_S[1],-8.55,-5.05,.16,.26);
  for(const d of [-5.1,4.98])b.strip('rail',0,L,d-.07,d+.07,.90,.12);
  for(const d of [-7.65,7.65]){
    b.strip('rail',0,L,d-.065,d+.065,1.38,.10);
    b.strip('rail',0,L,d-.06,d+.06,.65,.08);
    for(let s=0;s<L;s+=near?2.8:15)bar('rail',at(s,d,.15),at(s,d,1.4),near?.06:.10,chunk(s));
  }
  for(const d of [-9.05,8.8]) {
    b.strip('rail',TOWER_S[0],TOWER_S[1],d-.075,d+.075,1.38,.10);
    if(near)for(let s=TOWER_S[0];s<TOWER_S[1];s+=2.8)bar('rail',at(s,d,.15),at(s,d,1.4),.06,chunk(s));
  }
  if(near) {
    for(const d of [-4.35,4.35])b.strip('paint',0,L,d-.07,d+.07,.055);
    for(let s=1;s<L-4;s+=12)for(const d of [-.3,.3])b.strip('paint',s,s+3,d-.065,d+.065,.055);
  }
  // Concrete pylons: slim converging shafts, very tall clear portal, subdeck
  // diagonal supports, joined head and visibly perforated saddle-house crown.
  function leg(s,side,H) {
    const outline=(along,wide)=>{const c=.35;return [[-along/2+c,-wide/2],[along/2-c,-wide/2],[along/2,-wide/2+c],[along/2,wide/2-c],[along/2-c,wide/2],[-along/2+c,wide/2],[-along/2,wide/2-c],[-along/2,-wide/2+c]];};
    const levels=[[4,14.5,7.5,4.8],[43,10.6,6,4.4],[H-24,3.4,4.4,3.8],[H-5,2.9,4.4,3.8]];
    loft('concrete',levels.map(([y,d,a,w])=>outline(a,w).map(([u,v])=>xyz(s+u,side*d+v,y))),chunk(s),footingWeight);
    // Shallow continuous outer corner ribs and casting seams read at tower scale.
    if(near)for(let y=8;y<H-25;y+=6) {
      const k=y<43?(y-4)/39:(y-43)/(H-24-43),d=y<43?14.5+(10.6-14.5)*k:10.6+(3.4-10.6)*k;
      const a=y<43?7.5-1.5*k:6-1.6*k,w=y<43?4.8-.4*k:4.4-.6*k;
      b.box('concrete',s,side*d,y,a+.02,w+.02,.07,chunk(s),footingWeight);
    }
  }
  for(let k=0;k<2;k++) {
    const s=TOWER_S[k],H=TOWER_H[k],ck=chunk(s);
    b.box('concrete',s,0,1.7,11,35,3.4,ck,footingWeight);
    for(const side of [-1,1]) {
      leg(s,side,H);
      bar('concrete',xyz(s,side*13.3,4),xyz(s,side*1.4,39.7),2.9,ck,footingWeight);
      // Saddle blocks sit on the head, with two main cable planes outside road.
      b.box('steel',s,side*CABLE_D,H-2.4,3.4,1.2,1.0,ck);
      if(near)b.box('lamp',s,side*CABLE_D,H-.3,.28,.28,.55,ck);
    }
    b.box('concrete',s,0,41.7,7.0,23.2,2.0,ck,1);
    b.box('concrete',s,0,H-14,4.4,7.6,19,ck,1);
    // Open rectangular apertures through the top crown, rather than painted slots.
    for(const y of [H-4.5,H-2.3,H-.35])b.box('concrete',s,0,y,4.7,9.6,.7,ck);
    for(let d=-4.5;d<=4.51;d+=1.5)b.box('concrete',s,d,H-2.4,4.7,.32,4.1,ck);
  }
  // 47 cm main cables; 20 m hanger rhythm, paired planes visible from fjord.
  // Thick round cables retain the long parabolic silhouette in the far export.
  for(const side of [-1,1]) {
    const knots=[ANCHOR_S[0],...TOWER_S,ANCHOR_S[1]];
    for(let k=1;k<knots.length;k++) {
      const a=knots[k-1],c=knots[k],n=Math.ceil((c-a)/(near?8:22));
      for(let i=0;i<n;i++) {
        const s=a+(c-a)*i/n,t=a+(c-a)*(i+1)/n;
        bar('cable',xyz(s,side*CABLE_D,cableHeight(s)),xyz(t,side*CABLE_D,cableHeight(t)),.235,chunk(s),1,true);
      }
    }
    for(let s=TOWER_S[0]+20;s<TOWER_S[1]-8;s+=near?20:40) {
      const bottom=DECK_H-.3,top=cableHeight(s);
      // Small Y connection at the hanger head and deck edge brackets.
      bar('cable',xyz(s,side*CABLE_D,bottom),xyz(s,side*CABLE_D,top),near?.065:.10,chunk(s),1,true);
      if(near){b.box('steel',s,side*CABLE_D,DECK_H-.6,1.0,.9,.8,chunk(s));
        b.box('steel',s,side*CABLE_D,top,.6,.8,.7,chunk(s));}
    }
  }
  // Concrete approach piers: three south, two north, all on shore approaches.
  for(const s of [TOWER_S[0]-210,TOWER_S[0]-133,TOWER_S[0]-58,TOWER_S[1]+55,TOWER_S[1]+113]) {
    const top=p.deckHeight(s)-3.0,ck=chunk(s);
    for(const side of [-1,1]){
      const levels=[[0,side*4.8,3.0,2.2],[top-.8,side*4.8,2.3,1.8]];
      loft('concrete',levels.map(([y,d,a,w])=>[[-a/2,-w/2],[a/2,-w/2],[a/2,w/2],[-a/2,w/2]].map(([u,v])=>xyz(s+u,d+v,y))),ck,y=>Math.max(0,Math.min(1,y/top)));
    }
    b.box('concrete',s,0,top-.5,3.2,13.7,1,ck);
  }
  // Backstay sockets on the rock slopes; rock itself belongs to terrain.
  for(const s of ANCHOR_S)for(const side of [-1,1]) {
    const h=cableHeight(s);b.box('concrete',s,side*CABLE_D,h/2,8,4.5,h,chunk(s),y=>Math.max(0,Math.min(1,y/h)));
  }
  if(near)for(let s=STRUCTURE_S[0]+20;s<STRUCTURE_S[1];s+=38) {
    bar('rail',at(s,-5.3,.5),at(s,-5.3,7.5),.12,chunk(s));
    bar('rail',at(s,-5.3,7.5),at(s,-3.7,7.8),.10,chunk(s));
    b.box('lamp',s,-3.7,p.deckHeight(s)+7.8,.75,.28,.16,chunk(s));
  }
  return b.finish();
}
