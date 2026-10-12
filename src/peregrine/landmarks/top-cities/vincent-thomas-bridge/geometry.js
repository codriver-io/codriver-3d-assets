import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Quaternion, Vector3, Mesh, MeshBasicMaterial, DoubleSide } from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, TOWER_S, ANCHOR_S, DECK_H, DECK_HALF, ROAD_HALF, CABLE_D, cableHeight, LANDING_M, landingWeight, authoredLateral, roadEdgesAt } from './vincent-thomas-bridge-profile.js';

/** Original texture-free mesh. audit collects unmerged named supports for contact tests only. */
export function create({ detail='near', audit=null }={}) {
  const near=detail==='near', b=bridgeBuilder(p,detail),L=p.BRIDGE_LENGTH;
  const ck=s=>near?Math.min(2,Math.floor(s/L*3)):0;
  const xyz=(s,d,y)=>b.xyz(s,d,y), at=(s,d,y)=>xyz(s,d,p.deckHeight(s)+y);
  const fixed=y=>Math.max(0,Math.min(1,y/DECK_H));
  function put(g,mat,id,s,lift=1) {
    b.put(g,mat,ck(s),lift);
    if(audit){const mesh=new Mesh(g.clone(),new MeshBasicMaterial({side:DoubleSide}));mesh.updateMatrixWorld();
      if(!audit.parts.has(id))audit.parts.set(id,[]);audit.parts.get(id).push(mesh);}
  }
  function box(mat,s,d,y,len,w,h,id,lift=1) {
    const q=p.bridgePoint(s,d,y),g=new BoxGeometry(len,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,id,s,lift);
  }
  function beam(mat,A,B,w,id,s,supports=null,lift=1,depth=w) {
    const a=new Vector3(...A),z=new Vector3(...B).sub(a),g=new BoxGeometry(w,z.length(),depth);
    g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),z.normalize()));g.translate(...a.add(new Vector3(...B)).multiplyScalar(.5).toArray());put(g,mat,id,s,lift);
    if(audit&&supports)audit.terminals.push({id,ends:[A,B],supports,tolerance:Math.max(.35,w*.7)});
  }
  function ribbon(mat,lo,hi,dl,dr,off,thick,id) {
    const cuts=near?[lo,...[L/3,2*L/3].filter(s=>s>lo&&s<hi),hi]:[lo,hi];
    for(let k=1;k<cuts.length;k++){
      const a=cuts[k-1],c=cuts[k],step=near?10:20,ss=new Set([a,c]);
      // Slab and pavement use the same station grid. Independent chord cuts
      // can poke the slab through the far pavement on a curved ramp.
      for(let s=Math.ceil(a/step)*step;s<c;s+=step)if(s>a)ss.add(s);
      for(const s of [30,60,90,120,LANDING_M,L-LANDING_M,L-120,L-90,L-60,L-30])if(s>a&&s<c)ss.add(s);
      let last=0;for(const v of p.ALIGNMENT){if(near||v.s-last>8){if(v.s>a&&v.s<c)ss.add(v.s);last=v.s;}}
      const stations=[...ss].sort((a,b)=>a-b),pos=[],idx=[];
      for(let i=0;i<stations.length;i++){
        const s=stations[i],y=p.deckHeight(s)+(typeof off==='function'?off(s):off),bot=Math.max(-.25,y-(typeof thick==='function'?thick(s):thick));
        for(const [d,h] of [[dl,y],[dr,y],[dl,bot],[dr,bot]])pos.push(...xyz(s,typeof d==='function'?d(s):d,h));
        if(i){const u=(i-1)*4,v=i*4;idx.push(u,u+1,v,u+1,v+1,v,u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
      }
      const e=(stations.length-1)*4;idx.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);
      const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,id,a);
    }
  }
  // Each half becomes its mapped carriageway at the feet; the centre gap
  // opens over the landing only. No steel margin survives the ground handoff.
  const edge=(s,i,j)=>roadEdgesAt(s)[i][j], lateral=d=>s=>authoredLateral(s,d);
  const railD=(s,side)=>{
    const t=Math.max(0,Math.min(1,(Math.min(s,L-s)-LANDING_M)/30)),w=t*t*(3-2*t);
    return edge(s,side<0?0:1,side<0?0:1)+side*(10.9-ROAD_HALF)*w;
  };
  for(const i of [0,1]){
    const side=i?1:-1;
    ribbon('steel',LANDING_M,L-LANDING_M,i?s=>edge(s,i,0):lateral(-DECK_HALF),i?lateral(DECK_HALF):s=>edge(s,i,1),-.18,s=>Math.max(.07,landingWeight(s)),'slab');
    const cuts=[0,30,60,90,120,L-120,L-90,L-60,L-30,L];
    for(let k=1;k<cuts.length;k++){
      const lo=cuts[k-1],hi=cuts[k],distance=Math.min((lo+hi)/2,L-(lo+hi)/2);
      const mat=distance<120?'landing'+Math.min(3,Math.floor(distance/30)):'asphalt';
      ribbon(mat,lo,hi,s=>edge(s,i,0),s=>edge(s,i,1),0,.08,'road');
    }
    ribbon('steel',LANDING_M,L-LANDING_M,lateral(side*(ROAD_HALF+.2)-.1),lateral(side*(ROAD_HALF+.2)+.1),s=>.36*landingWeight(s),s=>.5*landingWeight(s),'curb-'+side);
    ribbon('steel',LANDING_M,L-LANDING_M,lateral(side*9.6-1.15),lateral(side*9.6+1.15),s=>.03*landingWeight(s),s=>.15*landingWeight(s),'margin-'+side);
    // Descending terminal rail meets a low end post rooted in the landing slab.
    const step=near?8:32,n=Math.ceil(L/step),posts=[];
    for(let j=0;j<=n;j++){const s=L*j/n,id='post-'+side+'-'+j;posts.push(id);const d=railD(s,side);
      beam('steel',at(s,d,Math.min(s,L-s)<LANDING_M?0:-.18),at(s,d,.15+1.05*landingWeight(s)),.1,id,s,[Math.min(s,L-s)<LANDING_M?'road':'slab','rail-'+side]);}
    for(let j=0;j<n;j++){
      const s=L*j/n,t=L*(j+1)/n;
      beam('steel',at(s,railD(s,side),.15+1.05*landingWeight(s)),at(t,railD(t,side),.15+1.05*landingWeight(t)),.12,'rail-'+side,s,[posts[j],posts[j+1]]);
    }
    if(near){
      // Fade-free white lines terminate in the same carriageway, never across the fork.
      // Paint is 15 cm proud; far drops it rather than retaining shallow overlays.
      for(const j of [0,1])ribbon('paint',0,L,s=>edge(s,i,j)+(j?-.25:.25)-.055,s=>edge(s,i,j)+(j?-.25:.25)+.055,.15,.018,'paint');
      for(let s=3;s<L-4;s+=12)ribbon('paint',s,s+3,q=>(edge(q,i,0)+edge(q,i,1))/2-.055,q=>(edge(q,i,0)+edge(q,i,1))/2+.055,.15,.018,'paint');
    }
  }
  const [a,c]=ANCHOR_S;
  // Full-depth open stiffening truss: upper and lower chords, X panels and floor beams.
  for(const side of [-1,1]){
    const d=side*10.4,top='truss-top-'+side,bot='truss-bottom-'+side;
    ribbon('steel',a,c,d-.18,d+.18,-1.0,.28,top);
    ribbon('steel',a,c,d-.22,d+.22,-3.75,.25,bot);
    const n=Math.ceil((c-a)/(near?9:18));
    for(let i=0;i<n;i++){
      const s=a+(c-a)*i/n,t=a+(c-a)*(i+1)/n;
      beam('steel',at(s,d,-3.75),at(t,d,-1.05),.22,'truss-X1-'+side+'-'+i,s,[bot,top]);
      beam('steel',at(s,d,-1.05),at(t,d,-3.75),.22,'truss-X2-'+side+'-'+i,s,[top,bot]);
      if(near)beam('steel',at(s,d,-3.75),at(s,d,-1.05),.18,'truss-post-'+side+'-'+i,s,[bot,top]);
    }
  }
  for(let s=a;s<=c;s+=near?18:36)beam('steel',at(s,-10.4,-1.1),at(s,10.4,-1.1),.3,'floor-'+s,s,['truss-top--1','truss-top-1'],1,.6);
  // Rectangular welded tower shafts and three characteristic diamond lattice bands.
  for(let ti=0;ti<2;ti++){
    const s=TOWER_S[ti];
    for(const side of [-1,1]){
      const leg='leg-'+ti+'-'+side;
      box('concrete',s,side*CABLE_D,3,7.5,5,6,'foot-'+ti+'-'+side,0);
      box('steel',s,side*CABLE_D,58.125,3.2,2.1,106.25,leg,fixed);
      box('steel',s,side*CABLE_D,110.6,4.1,2.5,1.3,'saddle-'+ti+'-'+side,1);
      if(near)for(const off of [-1.45,1.45])box('steel',s+off,side*CABLE_D,58, .14,2.3,105,'flange',fixed);
      for(const y of [18,35,63,81,98,109])box('light',s-1.65,side*CABLE_D,y,.16,.28,.35,'blue-lamp',fixed);
    }
    for(const [lo,hi] of [[17,30],[80,86],[103,109]]){
      for(const y of [lo,hi])beam('steel',xyz(s,-CABLE_D,y),xyz(s,CABLE_D,y),.6,'cross-'+ti+'-'+y,s,['leg-'+ti+'--1','leg-'+ti+'-1'],fixed,1.05);
      const count=lo<40?2:3;
      for(let i=0;i<count;i++){
        const dl=-CABLE_D+2*CABLE_D*i/count,dr=-CABLE_D+2*CABLE_D*(i+1)/count;
        beam('steel',xyz(s,dl,lo),xyz(s,dr,hi),.34,'diamond-A-'+ti+'-'+lo+'-'+i,s,['cross-'+ti+'-'+lo,'cross-'+ti+'-'+hi],fixed,.45);
        beam('steel',xyz(s,dr,lo),xyz(s,dl,hi),.34,'diamond-B-'+ti+'-'+lo+'-'+i,s,['cross-'+ti+'-'+lo,'cross-'+ti+'-'+hi],fixed,.45);
      }
    }
    // Open through portal under the elevated road, with the floor supported by a full-width cap.
    beam('steel',xyz(s,-CABLE_D,58.4),xyz(s,CABLE_D,58.4),1.3,'deck-cap-'+ti,s,['leg-'+ti+'--1','leg-'+ti+'-1'],fixed,2.5);
  }
  // Ground cable anchorage blocks remain outside traffic lanes, with exposed steel shoes.
  for(let ai=0;ai<2;ai++)for(const side of [-1,1]){
    const s=ANCHOR_S[ai],d=side*CABLE_D;
    box('concrete',s,d,6.5,18,7,13,'anchor-'+ai+'-'+side,0);
    box('steel',s,d,13.7,3,2,1.4,'anchor-shoe-'+ai+'-'+side,0);
  }
  // 24 main-span catenary chords near / 10 far; hangers end on actual sampled cable chords.
  for(const side of [-1,1]){
    const spans=[a,...TOWER_S,c],segments=[];
    for(let k=0;k<3;k++){
      const lo=spans[k],hi=spans[k+1],n=near?24:10;
      for(let i=0;i<n;i++){
        const s=lo+(hi-lo)*i/n,t=lo+(hi-lo)*(i+1)/n,id='cable-'+side+'-'+k+'-'+i;
        const prev=i? 'cable-'+side+'-'+k+'-'+(i-1):k===0?'anchor-shoe-0-'+side:'saddle-'+(k-1)+'-'+side;
        const next=i<n-1?'cable-'+side+'-'+k+'-'+(i+1):k===2?'anchor-shoe-1-'+side:'saddle-'+k+'-'+side;
        beam('cable',xyz(s,side*CABLE_D,cableHeight(s)),xyz(t,side*CABLE_D,cableHeight(t)),.46,id,s,[prev,next],k===1?1:y=>Math.max(0,Math.min(1,(y-14)/(DECK_H-14))));
        segments.push({s,t,id,y: cableHeight(s),z:cableHeight(t)});
      }
    }
    const n=near?50:25;
    for(let i=1;i<n;i++){
      const s=a+(c-a)*i/n,seg=segments.find(v=>s>=v.s&&s<=v.t),y=seg.y+(seg.z-seg.y)*(s-seg.s)/(seg.t-seg.s);
      if(y<DECK_H+.4)continue;
      beam('cable',xyz(s,side*CABLE_D,DECK_H-.3),xyz(s,side*CABLE_D,y),near?.09:.14,'hanger-'+side+'-'+i,s,['slab',seg.id]);
    }
  }
  // Approach viaduct portal piers: no support in the navigation channel.
  for(const [lo,hi] of [[18,TOWER_S[0]-25],[TOWER_S[1]+25,L-18]]){
    for(let s=lo;s<hi;s+=near?45:90){
      const slabBottom=p.deckHeight(s)-.18-Math.max(.07,landingWeight(s));
      const y=slabBottom-.5;if(y<2||Math.min(s,L-s)<LANDING_M+3)continue;const cap='pier-cap-'+s;
      // Cap top embeds 10 cm into the slab underside and follows its fitted
      // deck datum. Shaft feet follow local DEM; tops follow this same cap,
      // rather than the suspension towers' fixed 60 m attachment weighting.
      const shaftLift=h=>Math.max(0,Math.min(1,(h-.5)/(y-.2-.5)));
      for(const side of [-1,1]){
        const foot='pier-foot-'+s+'-'+side,shaft='pier-shaft-'+s+'-'+side;
        box('concrete',s,side*6,.5,5,3.4,1,foot,0);
        beam('concrete',xyz(s,side*6,.5),xyz(s,side*6,y-.2),1.45,shaft,s,[foot,cap],shaftLift,2.1);
      }
      // Explicit upright section: a transverse beam's arbitrary quaternion
      // can turn its 2.3 m longitudinal depth into vertical cap height.
      box('steel',s,0,y,2.3,21.4,1.2,cap,1);
      if(audit)audit.terminals.push({id:cap,ends:[xyz(s,-10.7,y),xyz(s,10.7,y)],supports:['slab','slab'],tolerance:.84});
    }
  }
  return b.finish();
}
