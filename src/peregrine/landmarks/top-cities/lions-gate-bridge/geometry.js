import { BoxGeometry, CylinderGeometry, BufferGeometry, Float32BufferAttribute, Shape, Path, ExtrudeGeometry, Matrix4, Vector3 } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, TOWER_S, ANCHOR_S, DECK_H, CABLE_D, DECK_HALF, cableHeight } from './lions-gate-bridge-profile.js';

/** Original procedural structure. All members share the mapped station/lateral frame. */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = bridgeBuilder({ ...p, meshStep: near ? 3 : 6 }, detail), L = p.BRIDGE_LENGTH;
  const chunk = s => near ? Math.min(2,Math.floor(s/L*3)) : 0;
  const xyz = (s,d,y) => b.xyz(s,d,y), at = (s,d,dy) => xyz(s,d,p.deckHeight(s)+dy);
  const bar = (mat,A,B,w,depth=w,ck=0,lift=1) => {
    const a=new Vector3(...A),z=new Vector3(...B).sub(a),len=z.length(); if(len<0.001)return;
    z.normalize(); const x=new Vector3().crossVectors(new Vector3(0,1,0),z);
    if(x.lengthSq()<1e-6)x.set(1,0,0);x.normalize();const y=new Vector3().crossVectors(z,x).normalize();
    const g=new BoxGeometry(w,depth,len);g.applyMatrix4(new Matrix4().makeBasis(x,y,z).setPosition(a.add(new Vector3(...B)).multiplyScalar(.5)));b.put(g,mat,ck,lift);
  };
  // Closed station ribbons, including a slab bottom buried at most 25 cm below flat grade at the ramp feet.
  function ribbon(mat,a,c,dl,dr,off,thick=0) {
    const cuts=near?[a,...[L/3,2*L/3].filter(s=>s>a&&s<c),c]:[a,c];
    for(let k=1;k<cuts.length;k++) {
      const lo=cuts[k-1],hi=cuts[k],n=Math.ceil((hi-lo)/(near?10:22));
      const ss=new Set(Array.from({length:n+1},(_,i)=>lo+(hi-lo)*i/n));
      for(const q of p.ALIGNMENT)if(q.s>lo&&q.s<hi)ss.add(q.s);
      const stations=[...ss].sort((a,c)=>a-c),pos=[],idx=[],stride=thick?4:2;
      for(let i=0;i<stations.length;i++){
        const s=stations[i],top=p.deckHeight(s)+off,bot=Math.max(-.25,top-thick);
        for(const [d,y] of thick?[[dl,top],[dr,top],[dl,bot],[dr,bot]]:[[dl,top],[dr,top]])pos.push(...xyz(s,d,y));
        if(!i)continue;const u=(i-1)*stride,v=i*stride;idx.push(u,u+1,v,u+1,v+1,v);
        if(thick)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);
      }
      if(thick){const e=(stations.length-1)*4;idx.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);}
      const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,mat,chunk(lo));
    }
  }
  ribbon('steel',0,L,-DECK_HALF,DECK_HALF,-.18,1.4);
  ribbon('asphalt',0,L,-5.4,5.4,0);
  for(const side of [-1,1]){
    const d=side*6.9;ribbon('concrete',0,L,d-1.5,d+1.5,.18,.3);
    ribbon('steel',0,L,side*8.5-.09,side*8.5+.09,1.38,.14);
    ribbon('steel',0,L,side*8.5-.07,side*8.5+.07,.78,.10);
    ribbon('steel',0,L,side*5.6-.15,side*5.6+.15,.65,.72);
    for(let s=0;s<=L;s+=near?4:16)bar('steel',at(s,side*8.5,.18),at(s,side*8.5,1.38),near?.065:.11,near?.065:.11,chunk(s));
  }
  // Three lanes, including the reversible middle lane; no fixed median.
  if(near){
    for(const d of [-1.8,1.8])for(let s=2;s<L-4;s+=12)ribbon('paint',s,s+3,d-.06,d+.06,.055);
    for(const d of [-5.15,5.15])ribbon('paint',0,L,d-.06,d+.06,.055);
  }
  // Thin stiffening truss and transverse floor beams; preserve the open web in both LODs.
  const [a,c]=ANCHOR_S, panel=near?10:20;
  for(const d of [-8,8]){
    ribbon('steel',a,c,d-.16,d+.16,-3.22,.18);
    for(let s=a;s<c-.01;s+=panel){const t=Math.min(c,s+panel);
      bar('steel',at(s,d,-3.22),at(t,d,-.9),.20,.25,chunk(s));
      bar('steel',at(s,d,-.9),at(t,d,-3.22),.20,.25,chunk(s));
      if(near)bar('steel',at(s,d,-3.22),at(s,d,-.8),.18,.24,chunk(s));
    }
  }
  if(near)for(let s=a;s<c;s+=10){
    bar('steel',at(s,-8,-1.4),at(s,8,-1.4),.26,.45,chunk(s));
    bar('steel',at(s,-8,-3.22),at(Math.min(c,s+10),8,-3.22),.12,.14,chunk(s));
  }
  const towerLift = y => Math.max(0, Math.min(1, y / DECK_H));
  // Tapered octagonal steel box shafts, with narrow external flange/rib detail.
  function leg(s,side) {
    const rings=[[6,10,2.5],[DECK_H,8.4,1.85],[108,7.6,1.3]],pos=[],idx=[];
    for(const [y,d,w] of rings){const cham=w*.15,uv=[[-w/2+cham,-w/2],[w/2-cham,-w/2],[w/2,-w/2+cham],[w/2,w/2-cham],[w/2-cham,w/2],[-w/2+cham,w/2],[-w/2,w/2-cham],[-w/2,-w/2+cham]];
      for(const [u,v] of uv)pos.push(...xyz(s+u,side*d+v,y));
    }
    for(let k=0;k<2;k++)for(let i=0;i<8;i++){const j=(i+1)%8,u=k*8+i,v=k*8+j;idx.push(u,u+8,v,v,u+8,v+8);}
    for(let i=1;i<7;i++)idx.push(16,16+i+1,16+i,0,i,i+1);
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,'steel',chunk(s),towerLift);
    b.box('steel',s,side*7.6,109,3.5,2.6,4,chunk(s),1);
    if(near)for(const sign of [-1,1])bar('steel',xyz(s+sign*1.3,side*10,7),xyz(s+sign*.65,side*7.6,108),.16,.22,chunk(s),towerLift);
  }
  function portal(s,y) {
    const w=y>100?7.6:8.4, shape=new Shape();
    shape.moveTo(-w,y+2.5);shape.lineTo(w,y+2.5);shape.lineTo(w,y-2.6);
    shape.quadraticCurveTo(0,y+2,-w,y-2.6);shape.closePath();
    if(near)for(let d=-w+1;d<w;d+=1.6){const hole=new Path();hole.absellipse(d,y+.9,.42,.48,0,Math.PI*2,true);shape.holes.push(hole);}
    const g=new ExtrudeGeometry(shape,{depth:1.65,bevelEnabled:false,curveSegments:near?16:8});
    const q=p.bridgePoint(s),N=new Vector3(-q.tz,0,q.tx),T=new Vector3(q.tx,0,q.tz);
    g.applyMatrix4(new Matrix4().makeBasis(N,new Vector3(0,1,0),T.clone().negate()).setPosition(new Vector3(q.x+T.x*.825,0,q.z+T.z*.825)));
    b.put(g,'steel',chunk(s),towerLift);
  }
  for(const s of TOWER_S){
    // Rounded, chamfered stone footing: the large south water pier is a mapped oval in plan.
    const g=new CylinderGeometry(1,1,5,near?20:10);g.scale(7,1,16);g.rotateY(-Math.atan2(p.bridgePoint(s).tz,p.bridgePoint(s).tx));
    const q=p.bridgePoint(s);g.translate(q.x,2.5,q.z);b.put(g,'concrete',chunk(s),towerLift);
    for(const side of [-1,1]){b.box('concrete',s,side*10,5.5,5,5.2,3,chunk(s),towerLift);leg(s,side);}
    for(const [lo,hi] of [[8,32],[33,59],[75,89],[90,104]]){
      const wd=y=>10-(y-6)/102*2.4;
      bar('steel',xyz(s,-wd(lo),lo),xyz(s,wd(hi),hi),.48,.60,chunk(s),towerLift);
      bar('steel',xyz(s,wd(lo),lo),xyz(s,-wd(hi),hi),.48,.60,chunk(s),towerLift);
    }
    portal(s,72);portal(s,107.5);
    bar('steel',xyz(s,-9.5,7.2),xyz(s,9.5,7.2),.8,1.2,chunk(s),towerLift);
    if(near)for(const side of [-1,1])b.box('lamp',s,side*7.6,111,.25,.25,.10,chunk(s),1);
  }
  // Main suspension cables with regular vertical hangers and the signature necklace lights.
  for(const side of [-1,1]){
    const stations=[a,...TOWER_S,c];
    for(let k=1;k<stations.length;k++){
      const lo=stations[k-1],hi=stations[k],n=Math.ceil((hi-lo)/(near?5:14));
      for(let i=0;i<n;i++){
        const u=lo+(hi-lo)*i/n,v=lo+(hi-lo)*(i+1)/n;
        b.bar('cable',xyz(u,side*CABLE_D,cableHeight(u)),xyz(v,side*CABLE_D,cableHeight(v)),.185,.185,chunk(u),true,1);
      }
    }
    for(let s=a+5;s<c;s+=near?10:20){
      const y=cableHeight(s);bar('cable',at(s,side*CABLE_D,.3),xyz(s,side*CABLE_D,y),near?.085:.14,near?.085:.14,chunk(s));
      // Lights retained far because the night outline is a defining feature.
      b.box('lamp',s,side*CABLE_D,y,.33,.33,.33,chunk(s),1);
    }
  }
  // Reinforced concrete cable anchors beside the road, not across its driving lanes.
  for(const s of ANCHOR_S)for(const side of [-1,1]){
    const top=p.deckHeight(s)+1.2;
    b.box('concrete',s,side*9.3,top/2,12,5.6,top,chunk(s),y=>Math.max(0,Math.min(1,y/top)));
    b.box('steel',s,side*CABLE_D,top,3,1.6,1.2,chunk(s));
  }
  // North viaduct and elevated Cityscape causeway: open steel trestles with transverse caps.
  for(const [lo,hi] of [[20,a-12],[c+20,L-15]]){
    for(let s=lo;s<hi;s+=near?32:64){const top=p.deckHeight(s)-1.55;if(top<1.2)continue;
      for(const side of [-1,1]){
        const baseD=side*6.4,topD=side*5.6;
        b.box('concrete',s,baseD,.4,3,3,.8,chunk(s),0);
        bar('steel',xyz(s,baseD,.8),xyz(s,topD,top),.55,.7,chunk(s),y=>Math.max(0,Math.min(1,(y-.8)/(top-.8))));
      }
      bar('steel',xyz(s,-8.4,top),xyz(s,8.4,top),.65,.9,chunk(s));
      if(top>5){bar('steel',xyz(s,-6.4,1),xyz(s,5.6,top-1),.32,.4,chunk(s),y=>Math.max(0,Math.min(1,y/top)));
        bar('steel',xyz(s,6.4,1),xyz(s,-5.6,top-1),.32,.4,chunk(s),y=>Math.max(0,Math.min(1,y/top)));}
    }
    for(const d of [-5.6,5.6])ribbon('steel',Math.max(150,lo),Math.min(L-150,hi),d-.25,d+.25,-1.4,.9);
  }
  // Small curved lamp standards in the current crossing.
  if(near)for(let s=a+10;s<c;s+=40)for(const side of [-1,1]){
    bar('steel',at(s,side*6.3,.7),at(s,side*6.3,5.7),.16,.16,chunk(s));
    bar('steel',at(s,side*6.3,5.7),at(s,side*4.8,6.1),.13,.13,chunk(s));
    b.box('lamp',s,side*4.8,p.deckHeight(s)+6.05,.7,.28,.15,chunk(s));
  }
  return b.finish();
}
