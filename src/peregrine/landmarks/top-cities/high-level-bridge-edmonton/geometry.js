import { BufferGeometry, Float32BufferAttribute, BoxGeometry, Matrix4, Vector3, Group } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { WAYS } from './high-level-bridge-edmonton-alignment.js';
import { SPEC, PALETTES } from './config.js';
import { bankGeometry } from './high-level-bridge-edmonton-banks.js';
import { PROFILE as p, FORK, FORK_L, STRUCTURE_START as A, STRUCTURE_END as Z, RIVER_START as RA, RIVER_END as RZ, PIERS, MAIN_SPAN, RAIL_RISE, WIDTH, L, MERGE, landingBlend, authoredLateral } from './high-level-bridge-edmonton-profile.js';

// Named member records point to actual merged vertex ranges, for independent contact tests.
// They are nonenumerable on the authoring root and are not shipped in the GLB.
export function create({detail='near'}={}) {
 const near=detail==='near',parts=[],all=new Group();all.name=SPEC.name;
 let triangles=0,drawCalls=0;
 function build(profile,key) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail),offsets=new Map(),bankRows=[];
  const chunk=()=>0; // One material batch per road partition; no per-span draws.
  const P=(s,d,y)=>{const q=profile.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
  function put(g,mat,s,name,lift=1,ends=[],supports=[]) {
   if(mat==='rail')mat='steel';
   const pos=g.attributes.position;for(let i=0;i<pos.count;i++)if(pos.getY(i)<0)pos.setY(i,0);g.computeVertexNormals();
   const ck=key==='fork'?0:chunk(s),batch=`${key}:${ck}:${mat}`,first=offsets.get(batch)||0;
   parts.push({name,batch,first,count:g.attributes.position.count,ends,supports});offsets.set(batch,first+g.attributes.position.count);
   b.put(g,mat,ck,lift);
  }
  function box(name,mat,s,d,y,len,w,h,lift=1) {
   const q=profile.bridgePoint(s,d,y);let g=new BoxGeometry(len,h,w).rotateY(-Math.atan2(q.tz,q.tx)).translate(q.x,y,q.z);if(!near){g.deleteAttribute('normal');g.deleteAttribute('uv');g=mergeVertices(g);}put(g,mat,s,name,lift);
  }
  function bar(name,mat,a,c,w,t=w,supports=[],lift=1) {
   const av=new Vector3(...P(...a)),bv=new Vector3(...P(...c)),axis=bv.clone().sub(av),len=axis.length();if(len<.001)return;
   axis.divideScalar(len);const z=new Vector3().crossVectors(axis,new Vector3(0,1,0));
   if(z.lengthSq()<1e-8){const q=profile.bridgePoint(a[0]);z.set(-q.tz,0,q.tx);}else z.normalize();
   const y=new Vector3().crossVectors(z,axis).normalize();
   let g;
   if(!near&&((name.startsWith('trestle-')&&(name.includes('-x-')||name.includes('-y-')))||name.includes('-diagonal-'))){
    // Two-sided flat bracing keeps the X silhouette with four triangles.
    const across=y.clone().multiplyScalar(w/2);
    const pts=[av.clone().add(across),av.clone().sub(across),bv.clone().add(across),bv.clone().sub(across)];
    g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pts.flatMap(v=>v.toArray()),3));g.setIndex([0,1,2,1,3,2,2,1,0,2,3,1]);g=g.toNonIndexed();
   }else g=new BoxGeometry(len,t,w).applyMatrix4(new Matrix4().makeBasis(axis,y,z).setPosition(av.clone().add(bv).multiplyScalar(.5)));
   if(!near){g.deleteAttribute('uv');if(g.index)g.deleteAttribute('normal');else g.computeVertexNormals();g=mergeVertices(g);}
   put(g,mat,(a[0]+c[0])/2,name,lift,[av.toArray(),bv.toArray()],supports);
  }
  function ribbon(name,mat,a,c,left,right,off=0,thick=0) {
   const stations=[...new Set([a,c,...profile.ALIGNMENT.filter(q=>q.s>a&&q.s<c).map(q=>q.s),...Array.from({length:Math.ceil((c-a)/(near?2:18))},(_,i)=>a+i*(near?2:18))])].sort((a,b)=>a-b);
   // Spatial chunks are merged by material; split long slabs at the same station boundaries.
   const cuts=[a,c];
   for(let ci=1;ci<cuts.length;ci++){
    const ss=[cuts[ci-1],...stations.filter(s=>s>cuts[ci-1]+1e-5&&s<cuts[ci]-1e-5),cuts[ci]],pos=[],idx=[],stride=thick?4:2;
    ss.forEach((s,i)=>{
     const dl=typeof left==='function'?left(s):left,dr=typeof right==='function'?right(s):right;
     const h=profile.deckHeight(s)+(typeof off==='function'?off(s):off);
     for(const [d,y] of thick?[[dl,h],[dr,h],[dl,Math.max(0,h-thick)],[dr,Math.max(0,h-thick)]]:[[dl,h],[dr,h]])pos.push(...P(s,d,y));
     if(!i)return;const u=(i-1)*stride,v=i*stride;
     idx.push(u,u+1,v,u+1,v+1,v);
     if(thick)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);
    });
    if(thick){const n=(ss.length-1)*4;idx.push(0,2,1,1,2,3,n,n+1,n+2,n+1,n+3,n+2);}
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    put(g,mat,(cuts[ci]+cuts[ci-1])/2,`${name}-${ci}`);
   }
  }
  if(key==='fork'){
   ribbon('fork-pavement','asphalt',0,FORK_L,-2,2,0);
   ribbon('fork-slab','concrete',0,FORK_L,-2.3,2.3,-.22,.65);
   // Short piers support the stylized flat-map feeder; DEM buries them on the real bank.
   for(let s=20;s<FORK_L-10;s+=near?24:48){const h=profile.deckHeight(s)-.85;if(h<.5)continue;box(`fork-pier-${s}`,'stone',s,0,h/2,1.4,3.2,h,y=>Math.max(0,y/h));}
  }else{
   const dl=s=>authoredLateral(s,-WIDTH/2),dr=s=>authoredLateral(s,WIDTH/2);
   ribbon('road-slab','girder',0,L,dl,dr,-.26,.65);
   ribbon('road-pavement','asphalt',0,L,s=>authoredLateral(s,-3.35),s=>authoredLateral(s,3.35));
   for(const sign of [-1,1]){
    ribbon(`walk-${sign}`,'concrete',0,L,sign<0?dl:s=>authoredLateral(s,3.65),sign<0?s=>authoredLateral(s,-3.65):dr,.18,.38);
    // Continuous rails terminate in their own downturned end posts on the walking deck.
    const n=Math.ceil(L/4),railS=Array.from({length:n+1},(_,i)=>L*i/n);
    if(near)for(let i=0;i<=n;i++){
     const s=railS[i],d=authoredLateral(s,sign*(WIDTH/2-.18)),y=profile.deckHeight(s),name=`rail-post-${sign}-${i}`;
     bar(name,'steel',[s,d,y+.16],[s,d,y+1.55],.10,.10,['road-slab-1','road-slab-1']);
     if(i<n)for(const off of near?[.72,1.5]:[1.5]){
      const t=railS[i+1],e=authoredLateral(t,sign*(WIDTH/2-.18));
      bar(`handrail-${sign}-${i}-${off}`,'steel',[s,d,y+off],[t,e,profile.deckHeight(t)+off],.085,.085,[name,`rail-post-${sign}-${i+1}`]);
     }
    }
   }
   // Upper track deck: published 20-foot separation. Upper deck is open timber, not a second highway.
   const STRAIGHT_END=p.stationAt([-113.512977,53.52685]);
   const trackLine=WAYS.find(w=>w.id===463555601).line.map(ll=>{const q=p.bridgeLocal(...ll);return p.projectBridge(q.x,q.z);}).sort((a,b)=>a.s-b.s);
   const trackD=s=>{let i=1;while(i<trackLine.length-1&&trackLine[i].s<s)i++;const a=trackLine[i-1],b=trackLine[i],t=Math.max(0,Math.min(1,(s-a.s)/(b.s-a.s)));return a.lateral+(b.lateral-a.lateral)*t;};
   const upperD=s=>s<MERGE?trackD(s)-trackD(MERGE):0;
   ribbon('upper-deck','timber',A,STRAIGHT_END,s=>upperD(s)-3.5,s=>upperD(s)+3.5,RAIL_RISE,.35);
   for(const sign of [-1,1]){
    ribbon(`upper-edge-${sign}`,'steel',A,STRAIGHT_END,s=>upperD(s)+sign*4.5-.20,s=>upperD(s)+sign*4.5+.20,RAIL_RISE-.4,.7);
    if(near)ribbon(`track-${sign}`,'rail',A,STRAIGHT_END,s=>upperD(s)+sign*.7175-.055,s=>upperD(s)+sign*.7175+.055,RAIL_RISE+.17,.17);
   }
   const continuationD=s=>trackD(s)*Math.min(1,Math.max(0,(s-STRAIGHT_END)/12));
   ribbon('south-track-deck','timber',STRAIGHT_END,Z,s=>continuationD(s)-1.8,s=>continuationD(s)+1.8,RAIL_RISE,.35);
   for(const sign of [-1,1])if(near)ribbon(`south-track-${sign}`,'rail',STRAIGHT_END,Z-.8,s=>continuationD(s)+sign*.7175-.055,s=>continuationD(s)+sign*.7175+.055,RAIL_RISE+.17,.17);
   for(let i=0;i<3;i++){
    const s=STRAIGHT_END+(Z-STRAIGHT_END)*i/3,d=continuationD(s),h=profile.deckHeight(s)+RAIL_RISE-.35;
    box(`south-track-support-${i}`,'stone',s,d,h/2,2.2,4.1,h,y=>Math.max(0,y/h));
   }
   // Narrow mapped tram embankments; rail datum at the crest, independent ground at each toe.
   const abutmentS=Z-6,abutmentTop=profile.deckHeight(abutmentS)+RAIL_RISE-.35;
   box('south-track-abutment','stone',abutmentS,continuationD(abutmentS),abutmentTop/2,14,5.2,abutmentTop,y=>Math.max(0,Math.min(1,y/abutmentTop)));
   for(const [name,end,direction,lateral] of [['south-track-bank',Z,1,continuationD],['north-track-bank',A,-1,upperD]]) {
    const {geometry:g,rows,weights}=bankGeometry(end,direction,lateral(end));
    const first=offsets.get('main:0:fill')||0;
    put(g,'fill',end,name,0);
    g.setAttribute('bridgeLift',new Float32BufferAttribute(weights,1));
    bankRows.push(...rows.map(row=>({...row,first:row.first+first})));
   }
   // At the north fork the preserved rail remains on its own mapped alignment;
   // the two road feeds merge below it. A separate short upper-deck trestle
   // avoids making the railway follow the road's sharp S bend.
   for(let i=0;i<=2;i++){
    const s=A+(MERGE-A)*i/2,d=upperD(s),top=profile.deckHeight(s)+RAIL_RISE-.75;
    for(const side of [-1,1]){box(`north-rail-foot-${i}-${side}`,'stone',s,d+side*4.8,.25,1.5,1.5,.5,0);bar(`north-rail-leg-${i}-${side}`,'steel',[s,d+side*4.8,0],[s,d+side*4.3,top],.45,.5,[],y=>Math.max(0,y/top));}
    box(`north-rail-cap-${i}`,'steel',s,d,top+.2,1.3,9.5,.5);
    bar(`north-rail-x-${i}`,'steel',[s,d-4.8,0],[s,d+4.3,top],.3,.3,[],y=>Math.max(0,y/top));
   }
   // Deep Pratt trusses over the water; shallower paired trusses over the land approaches.
   const ranges=[[MERGE,RA,Math.max(2,Math.round((RA-MERGE)/39.624)),false],[RA,RZ,3,true],[RZ,STRAIGHT_END,Math.max(4,Math.round((STRAIGHT_END-RZ)/29.2608)),false]];
   for(const [a,c,n,river] of ranges)for(let span=0;span<n;span++){
    const s0=a+(c-a)*span/n,s1=a+(c-a)*(span+1)/n,np=river?(near?8:4):(near?4:2),ss=Array.from({length:np+1},(_,i)=>s0+(s1-s0)*i/np),bottom=river?-7:-.65;
    for(const side of [-1,1]){
     const d=side*4.5,prefix=`truss-${river?'river':'land'}-${span}-${Math.round(a)}-${side}`;
     for(let i=0;i<np;i++){
      const s=ss[i],t=ss[i+1],lo=profile.deckHeight(s)+bottom,lot=profile.deckHeight(t)+bottom,hi=profile.deckHeight(s)+RAIL_RISE-.55,hit=profile.deckHeight(t)+RAIL_RISE-.55;
      const bn=`${prefix}-bottom-${i}`,tn=`${prefix}-top-${i}`,pn=`${prefix}-post-${i}`;
      bar(bn,'steel',[s,d,lo],[t,d,lot],river?.58:.32,river?.65:.35,[pn,`${prefix}-post-${i+1}`]);
      bar(tn,'steel',[s,d,hi],[t,d,hit],.36,.55,[pn,`${prefix}-post-${i+1}`]);
      bar(pn,'steel',[s,d,lo],[s,d,hi],.38,.40,[bn,tn]);
      const reverse=i>=np/2;
      bar(`${prefix}-diagonal-${i}`,'steel',reverse?[s,d,lo]:[s,d,hi],reverse?[t,d,hit]:[t,d,lot],near?.32:.42,.30,[reverse?bn:tn,reverse?`${prefix}-top-${i}`:`${prefix}-bottom-${i}`]);
      // Beam below the lower road, transverse; bottom lateral X only near.
      if(side===-1&&near){bar(`${prefix}-floor-${i}`,'steel',[s,-4.5,profile.deckHeight(s)-.65],[s,4.5,profile.deckHeight(s)-.65],.3,.4,[],1);
       if(near&&river)bar(`${prefix}-lateral-${i}`,'steel',[s,-4.5,lo],[t,4.5,lot],.18,.18,[],1);}
     }
     const s=ss.at(-1),h=profile.deckHeight(s);bar(`${prefix}-post-${np}`,'steel',[s,d,h+bottom],[s,d,h+RAIL_RISE-.55],.38,.4,[],1);
    }
    for(let i=0;i<=np;i++){
     if(!near&&i>0&&i<np)continue;
     const s=ss[i],h=profile.deckHeight(s),name=`portal-${Math.round(s*10)}`;
     // Crosshead above the 3.2 m clearance envelope, attached to both truss planes.
     bar(name,'steel',[s,-4.5,h+RAIL_RISE-.65],[s,4.5,h+RAIL_RISE-.65],.28,.52,[],1);
     if(near)for(const sign of [-1,1])bar(`${name}-knee-${sign}`,'steel',[s,sign*4.5,h+3.7],[s,sign*3,h+RAIL_RISE-.65],.20,.20,[],1);
    }
   }
   // Four tapered concrete river piers, with open steel spans between them.
   for(let i=0;i<PIERS.length;i++){
    const s=PIERS[i],h=profile.deckHeight(s)-7.35;
    const rings=[[0,7.3,13],[h-1,4.5,9.8],[h,5.2,10.6]],pos=[],idx=[];
    for(const [y,along,across]of rings)for(const [u,v]of[[-along/2,-across/2],[along/2,-across/2],[along/2,across/2],[-along/2,across/2]])pos.push(...P(s+u,v,y));
    for(let k=0;k<2;k++)for(let j=0;j<4;j++){const a=k*4+j,c=k*4+(j+1)%4,v=a+4,w=c+4;idx.push(a,v,c,c,v,w);}
    idx.push(8,10,9,8,11,10,0,1,2,0,2,3);
    const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    put(g,'stone',s,`river-pier-${i}`,y=>Math.max(0,Math.min(1,y/h)));
    for(const side of [-1,1])box(`river-bearing-${i}-${side}`,'steel',s,side*4.5,h+.18,2.2,1.5,.4);
   }
   // Tall steel trestle bents: four splayed legs, horizontal ties and X bracing in both planes.
   const trestles=[];
   for(const [a,c,n]of[[A+12,RA-18,7],[RZ+18,Z-10,10]])for(let i=0;i<n;i++)trestles.push(a+(c-a)*i/(n-1));
   for(let ti=0;ti<trestles.length;ti++){
    const s=trestles[ti],top=profile.deckHeight(s)-1,level=near?3:1;
    if(top<2)continue;
    for(const side of [-1,1])for(const along of [-1,1]){
     const name=`trestle-${ti}-${side}-${along}`,foot=[s+along*4.8,side*6,0],cap=[s+along*2.1,side*4.5,top];
     box(`${name}-foot`,'stone',foot[0],foot[1],.35,2.4,2.1,.7,0);
     bar(name,'steel',foot,cap,.43,.48,[`${name}-foot`,`trestle-cap-${ti}`],y=>Math.max(0,Math.min(1,y/top)));
    }
    box(`trestle-cap-${ti}`,'steel',s,0,top+.2,5.3,10.3,.5);
    for(let j=0;j<level;j++){
     const y0=top*j/level,y1=top*(j+1)/level,alongAt=y=>4.8-2.7*y/top,wideAt=y=>6-1.5*y/top;
     const lift=y=>Math.max(0,Math.min(1,y/top));
     for(const side of [-1,1]){
      bar(`trestle-long-x-${ti}-${j}-${side}`,'steel',[s-alongAt(y0),side*wideAt(y0),y0],[s+alongAt(y1),side*wideAt(y1),y1],.23,.23,[],lift);
      bar(`trestle-long-y-${ti}-${j}-${side}`,'steel',[s+alongAt(y0),side*wideAt(y0),y0],[s-alongAt(y1),side*wideAt(y1),y1],.23,.23,[],lift);
      bar(`trestle-cross-x-${ti}-${j}-${side}`,'steel',[s+side*alongAt(y0),-wideAt(y0),y0],[s+side*alongAt(y1),wideAt(y1),y1],.23,.23,[],lift);
      if(!near)bar(`trestle-cross-y-${ti}-${j}-${side}`,'steel',[s+side*alongAt(y0),wideAt(y0),y0],[s+side*alongAt(y1),-wideAt(y1),y1],.23,.23,[],lift);
     }
     if(j)bar(`trestle-tie-${ti}-${j}`,'steel',[s-alongAt(y0),-wideAt(y0),y0],[s+alongAt(y0),-wideAt(y0),y0],.25,.25,[],lift);
    }
   }
   // Southern road has diverged from the track: supported box-girder continuation to the bank.
   for(let s=Z+18;s<L-15;s+=near?24:48){const top=profile.deckHeight(s)-.9;if(top>1)box(`south-ramp-pier-${s}`,'stone',s,0,top/2,1.8,7,top,y=>Math.max(0,y/top));}
   // Catenary standards: six metres above rail, each connected to the upper edge girder.
   const count=Math.ceil((STRAIGHT_END-A)/30);
   for(let i=0;i<=count;i++){
    const s=A+(STRAIGHT_END-A)*i/count,h=profile.deckHeight(s)+RAIL_RISE,d=upperD(s)-4.5;
    bar(`catenary-post-${i}`,'steel',[s,d,h-.6],[s,d,h+6.8],.16,.16,[],1);
    if(near)bar(`catenary-arm-${i}`,'steel',[s,d,h+6.6],[s,upperD(s),h+6.6],.13,.13,[],1);
    if(near)bar(`dropper-${i}`,'rail',[s,upperD(s),h+6.6],[s,upperD(s),h+6.45],.05,.05,[],1);
    if(near&&i<count){const t=A+(STRAIGHT_END-A)*(i+1)/count;
     bar(`contact-wire-${i}`,'rail',[s,upperD(s),h+6.45],[t,upperD(t),profile.deckHeight(t)+RAIL_RISE+6.45],.035,.035,[],1);}
   }
   // Subdued blue-white fixed LEDs: no animated colour sequence baked into the asset.
   if(near)for(let s=RA+3;s<RZ;s+=6)for(const side of [-1,1])box(`led-${Math.round(s)}-${side}`,'light',s,side*4.72,profile.deckHeight(s)-6.6,.22,.12,.22);
   if(near)for(let s=A+3;s<Z-3;s+=12)ribbon(`lane-${Math.round(s)}`,'paint',s,Math.min(s+3,Z),-.06,.06,.12);
  }
  const root=b.finish();if(key==='main')root.children.find(m=>m.material.name==='fill').userData.bankRows=bankRows;root.name=`${SPEC.id}-${key}`;
  root.traverse(o=>{if(o.isMesh){const ck=o.name.split('-').at(-2);o.userData.batch=`${key}:${ck}:${o.material.name}`;}});
  triangles+=root.userData.triangles;drawCalls+=root.userData.drawCalls;all.add(root);
 }
 build(p,'main');build(FORK,'fork');all.userData={landmark:SPEC.id,units:'metres',triangles,drawCalls};
 Object.defineProperty(all,'parts',{value:parts});return all;
}
