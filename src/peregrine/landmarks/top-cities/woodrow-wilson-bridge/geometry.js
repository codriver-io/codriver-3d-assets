import { BoxGeometry, BufferGeometry, Float32BufferAttribute, Quaternion, Vector3 } from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PROFILE as p, DECK_H, DECK_EDGES, BASCULE_S, TRUNNIONS, PIER_S, CLEARANCE, carriagewaysAt, landingBlend, CONTROL } from './woodrow-wilson-bridge-profile.js';

export function create({ detail='near', evidence=false }={}) {
 const near=detail==='near',L=p.BRIDGE_LENGTH,b=assetBuilder({...p.CHAMPLAIN,palette:PALETTES.light},detail);
 const parts={},contacts=[],offsets=new Map(),chunk=s=>near?Math.min(3,Math.floor(s/L*4)):0;
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,y,q.z];};
 function put(name,g,mat,s,lift=1){
  const ck=chunk(s),key=`${ck}:${mat}`,count=g.index?.count??g.attributes.position.count;
  parts[name]={mesh:`${SPEC.id}-${ck}-${mat}`,start:offsets.get(key)||0,count};offsets.set(key,(offsets.get(key)||0)+count);b.put(g,mat,ck,lift);
 }
 function box(name,mat,s,d,y,along,across,up,lift=1){const q=p.bridgePoint(s,d,y),g=new BoxGeometry(along,up,across);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);put(name,g,mat,s,lift);}
 function beam(name,mat,a,c,w,t=w,supports=null,lift=1){
  const A=new Vector3(...xyz(...a)),B=new Vector3(...xyz(...c)),v=B.clone().sub(A),g=new BoxGeometry(w,v.length(),t);
  g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),v.normalize()));g.translate(...A.clone().add(B).multiplyScalar(.5).toArray());put(name,g,mat,(a[0]+c[0])/2,lift);
  if(supports)contacts.push({name,ends:[A.toArray(),B.toArray()],supports,tolerance:.8});
 }
 function ribbon(name,mat,a,c,l,r,off=0,thick=0){
  const ss=new Set([a,c]);for(let s=Math.ceil(a/(near?12:25))*(near?12:25);s<c;s+=near?12:25)ss.add(s);
  if(near)for(const q of p.ALIGNMENT)if(q.s>a&&q.s<c)ss.add(q.s);
  const stations=[...ss].sort((a,b)=>a-b),pos=[],idx=[],stride=thick?4:2;
  stations.forEach((s,i)=>{
   const h=Math.max(.03,p.deckHeight(s)+(typeof off==='function'?off(s):off));
   for(const [d,dy] of thick?[[l,0],[r,0],[l,-Math.min(typeof thick==='function'?thick(s):thick,h-.01)],[r,-Math.min(typeof thick==='function'?thick(s):thick,h-.01)]]:[[l,0],[r,0]])pos.push(...xyz(s,typeof d==='function'?d(s):d,h+dy));
   if(!i)return;const u=(i-1)*stride,v=i*stride;idx.push(u,u+1,v,u+1,v+1,v);
   if(thick)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);
  });
  if(thick){idx.push(0,2,1,1,2,3);const k=(stations.length-1)*stride;idx.push(k,k+1,k+2,k+1,k+3,k+2);}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(name,g,mat,(a+c)/2);
 }
 const split=(name,mat,a,c,l,r,off,thick)=>{
  const cuts=near?[a,...[L/4,L/2,3*L/4].filter(s=>s>a&&s<c),c]:[a,c];
  for(let i=1;i<cuts.length;i++)ribbon(`${name}-${i}`,mat,cuts[i-1],cuts[i],l,r,off,thick);
 };
 // Four mapped local/express ribbons: separate SD-width landings, rigid published river decks.
 for(let side=0;side<4;side++)for(let j=0;j<4;j++){
  const edge=(s,u)=>{const [a,c]=carriagewaysAt(s)[side];return a+(c-a)*u;};
  split(`road-${side}-${j}`,'asphalt',0,L,s=>edge(s,j/4),s=>edge(s,(j+1)/4),0,0);
 }
 for(let side=0;side<2;side++){
  const [a,c]=DECK_EDGES[side],middle=(a+c)/2,name=side?'south':'north';
  // Approach-only structural taper; no square seventy-six-metre slab at either landing.
  const edge=(s,k)=>{const roads=carriagewaysAt(s),e=roads[side*2+k][k],fixed=k?c:a;return e+(fixed-e)*landingBlend(s);};
  const left=s=>edge(s,0),right=s=>edge(s,1);
  split(`girder-${name}`,'girder',100,TRUNNIONS[0],left,right,-.35,2.55);
  split(`girder-east-${name}`,'girder',TRUNNIONS[1],L-100,left,right,-.35,2.55);
  for(const s of [100,L-100])box(`abutment-${name}-${s}`,'concrete',s,middle,Math.max(.1,(p.deckHeight(s)-2.9)/2),7,c-a,Math.max(.2,p.deckHeight(s)-2.9),y=>Math.min(1,y/Math.max(.2,p.deckHeight(s)-2.9)));
  for(const [edgeName,dAt,sign]of [['outer',side?right:left,side?1:-1],['inner',side?left:right,side?-1:1]]){
   // Kerbs and handrails all land on tapered endposts; the path rejoins mapped north trail.
   split(`kerb-${name}-${edgeName}`,'concrete',0,L,s=>dAt(s)-.28,s=>dAt(s)+.28,.18,.35);
   split(`rail-${name}-${edgeName}`,'rail',0,L,s=>dAt(s)-.09,s=>dAt(s)+.09,s=>.42+1.05*landingBlend(s),.18);
   for(const s of [0,L])box(`endpost-${name}-${edgeName}-${s}`,'rail',s,dAt(s),p.deckHeight(s)+.4,.45,.45,.44);
   const cuts=near?[0,L/4,L/2,3*L/4,L]:[0,L];
   for(let i=1;i<cuts.length;i++)contacts.push({name:`rail-${name}-${edgeName}-${i}`,ends:[xyz(cuts[i-1],dAt(cuts[i-1]),p.deckHeight(cuts[i-1])+.42+1.05*landingBlend(cuts[i-1])),xyz(cuts[i],dAt(cuts[i]),p.deckHeight(cuts[i])+.42+1.05*landingBlend(cuts[i]))],supports:[i===1?`endpost-${name}-${edgeName}-0`:`rail-${name}-${edgeName}-${i-1}`,i===cuts.length-1?`endpost-${name}-${edgeName}-${L}`:`rail-${name}-${edgeName}-${i+1}`],tolerance:.24});
   for(let s=8;s<L-4;s+=near?8:32){const h=p.deckHeight(s),up=1.05*landingBlend(s);box(`post-${name}-${edgeName}-${s}`,'rail',s,dAt(s),h+.22+up/2,.12,.14,up+.08);}
  }
  if(!side){
   split('trail','concrete',0,L,s=>left(s)+.3,s=>left(s)+.3+3.0*landingBlend(s),.16,.28);
   if(near)for(let s=170;s<L-165;s+=18)ribbon(`trail-dash-${s}`,'paint',s,s+3,x=>left(x)+1.75-.05,x=>left(x)+1.75+.05,.29);
  }
  // Local/express separation: concrete barriers stop at the actual SD ribbons.
  const median=s=>{const e=carriagewaysAt(s);return (e[side*2][1]+e[side*2+1][0])/2;};
  split(`median-${name}`,'concrete',0,L,s=>median(s)-.24*landingBlend(s),s=>median(s)+.24*landingBlend(s),s=>.2+.8*landingBlend(s),.9);
 }
 if(near)for(let i=0;i<4;i++){
  for(const k of [0,1])split(`edge-paint-${i}-${k}`,'paint',0,L,s=>carriagewaysAt(s)[i][k]+(k?-.5:.5)-.06,s=>carriagewaysAt(s)[i][k]+(k?-.5:.5)+.06,.15);
  for(let s=5;s<L-5;s+=18)for(let lane=1;lane<(i===0||i===3?3:2);lane++){
   if(Math.abs(s-BASCULE_S)<5)continue;
   const d=x=>{const [a,c]=carriagewaysAt(x)[i];return a+(c-a)*lane/(i===0||i===3?3:2);};
   ribbon(`dash-${i}-${lane}-${s}`,'paint',s,s+4,x=>d(x)-.06,x=>d(x)+.06,.16);
  }
 }
 // Closed flared concrete webs: broad girder shoulders and a rounded triangular throat.
 // The opening edge reaches the girder before the outer end, leaving a full bearing seat.
 function arm(name,s,d,sign,run,top,foot,girder){
  const n=near?12:6,pos=[],idx=[],base=2.0;
  for(let i=0;i<=n;i++){
   const t=i/n,ss=s+sign*run*t,half=1.3+1.05*t;
   const throat=Math.min(1,(Math.hypot(t,.055)-.055)/(Math.hypot(.82,.055)-.055));
   const lower=.4+Math.max(0,top-5.0-.4)*t,neck=Math.min(4.4,top+.6),upper=neck+(top+1.15-neck)*throat;
   for(const [dd,y]of [[-half,lower],[half,lower],[-half,upper],[half,upper]])pos.push(...xyz(ss,d+dd,y));
   if(!i)continue;const a=(i-1)*4,b=i*4;idx.push(a,b,a+1,a+1,b,b+1,a+2,a+3,b+2,a+3,b+3,b+2,a,a+2,b,a+2,b+2,b,a+1,b+1,a+3,a+3,b+1,b+3);
  }
  idx.push(0,1,2,1,3,2);const k=n*4;idx.push(k,k+2,k+1,k+1,k+2,k+3);
  if(sign<0)for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(name,g,'concrete',s,y=>Math.min(1,Math.max(0,y/(top+1.15))));
  contacts.push({name,ends:[xyz(s,d,base),xyz(s+sign*run,d,top+1.15)],supports:[foot,girder],tolerance:.15});
 }
 for(const [i,s]of PIER_S.entries())for(let side=0;side<2;side++){
  const [a,c]=DECK_EDGES[side],middle=(a+c)/2,top=p.deckHeight(s)-4.05,run=Math.min(43,Math.max(3,s-105),Math.max(3,L-105-s));
  for(const [j,d]of [middle-9,middle+9].entries()){
   const foot=`foot-${i}-${side}-${j}`;box(foot,'concrete',s,d,1.2,8,6,2.4,0);
   for(const sign of [-1,1]){const end=s+sign*run,start=s>TRUNNIONS[1]?TRUNNIONS[1]:100,finish=s>TRUNNIONS[1]?L-100:TRUNNIONS[0],cuts=near?[start,...[L/4,L/2,3*L/4].filter(v=>v>start&&v<finish),finish]:[start,finish],index=cuts.findIndex((v,i)=>i>0&&end<=v);const part=`girder-${s>TRUNNIONS[1]?'east-':''}${side?'south':'north'}-${Math.max(1,index)}`;arm(`V-${i}-${side}-${j}-${sign}`,s,d,sign,run,p.deckHeight(end)-4.05,foot,part);}
  }
 }
 // Bascule chambers and eight separate closed leaves, subdivided by the four parallel roadways.
 for(const [k,s]of TRUNNIONS.entries())for(let side=0;side<2;side++){
  const [a,c]=DECK_EDGES[side],middle=(a+c)/2;
  box(`bascule-foot-${k}-${side}`,'concrete',s,middle,1.3,13,c-a-5,2.6,0);
  for(const d of [middle-10,middle+10]){
   box(`bascule-shaft-${k}-${side}-${d}`,'concrete',s,d,9.8,7,6,16,y=>y/17.8);
   for(const sign of [-1,1])beam(`delta-${k}-${side}-${d}-${sign}`,'concrete',[s,d,5],[s+sign*17,d,20.8],4.0,3.4,[`bascule-shaft-${k}-${side}-${d}`,`machinery-${k}-${side}`],y=>y/21);
  }
  box(`machinery-${k}-${side}`,'concrete',s,middle,20.15,35,c-a,2.5);
  for(let ribbonSide=side*2;ribbonSide<side*2+2;ribbonSide++){
   const [l,r]=carriagewaysAt(s)[ribbonSide],end=k?BASCULE_S+.055:BASCULE_S-.055,aS=k?end:s,cS=k?s:end;
   ribbon(`leaf-body-${ribbonSide}-${k}`,'steel',aS,cS,l,r,-.35,x=>2.314+3.41*Math.abs(x-BASCULE_S)/(Math.abs(s-BASCULE_S)));
   // Deep trunnion girder tapers towards the navigational clearance at the centre.
   const depth=x=>2.664+3.41*Math.abs(x-BASCULE_S)/(Math.abs(s-BASCULE_S));
   for(const [edgeIndex,d] of [l+.8,r-.8].entries()){
    const gname=`leaf-girder-${ribbonSide}-${k}-${d}`;
    ribbon(gname,'steel',aS,cS,d-.32,d+.32,x=>-depth(x),.45);
    box(`leaf-seat-${ribbonSide}-${k}-${d}`,'steel',s,d,20.15,3,1.9,6.3);
    contacts.push({name:gname,ends:[xyz(s,d,DECK_H-depth(s)),xyz(end,d,DECK_H-depth(end))],supports:[`leaf-seat-${ribbonSide}-${k}-${d}`,`span-lock-${ribbonSide}-${edgeIndex}`],tolerance:.3});
    if(k===0)box(`span-lock-${ribbonSide}-${edgeIndex}`,'steel',BASCULE_S,d,CLEARANCE-.1,.7,1.2,.7);
   }
   if(near&&k===0)ribbon(`leaf-seam-${ribbonSide}-${k}`,'paint',BASCULE_S-.055,BASCULE_S+.055,l,r,.22);
  }
 }
 // Open warning-gate portals, with all horizontal beam terminals supported by uprights.
 for(const [k,s]of [TRUNNIONS[0]-27,TRUNNIONS[1]+27].entries())for(let i=0;i<4;i++){
  const [a,c]=carriagewaysAt(s)[i];
  for(const [j,d]of [a-.8,c+.8].entries()){
   box(`gate-foot-${k}-${i}-${j}`,'concrete',s,d,DECK_H+.2,1.2,1.2,.4);
   box(`gate-post-${k}-${i}-${j}`,'steel',s,d,DECK_H+3.9,.35,.45,7.4);
  }
  beam(`gate-top-${k}-${i}`,'steel',[s,a-.8,DECK_H+7.5],[s,c+.8,DECK_H+7.5],.4,.45,[`gate-post-${k}-${i}-0`,`gate-post-${k}-${i}-1`]);
  if(near)for(const d of [a+1,c-1])box(`signal-${k}-${i}-${d}`,'lamp',s,d,DECK_H+6.8,.45,.55,.5);
 }
 // Mapped median operator house: flared silver machinery enclosure below leaning glazing.
 const ts=CONTROL.s+5.5,td=CONTROL.lateral;
 box('tower-platform','concrete',CONTROL.s,td,DECK_H-.5,22.3,5.6,1.8);
 // Low machinery tail occupies the mapped island; the taller flared housing supports the cab.
 box('tower-enclosure','steel',CONTROL.s,td,DECK_H+.6,22.3,5.3,1.2);
 const bowl=new BufferGeometry(),bp=[],bi=[];
 const levels=[[DECK_H+.7,ts+.6,8.6,4.6],[DECK_H+1.1,ts+.45,9.3,4.9],[DECK_H+4.0,ts,11.0,5.3]];
 for(const [y,station,along,across]of levels)for(const [u,v]of [[-1,-1],[1,-1],[1,1],[-1,1]])bp.push(...xyz(station+u*along/2,td+v*across/2,y));
 for(let k=0;k<levels.length-1;k++)for(let i=0;i<4;i++){const j=(i+1)%4,u=k*4,v=u+4;bi.push(u+i,v+i,u+j,u+j,v+i,v+j);}
 bi.push(8,10,9,8,11,10,0,1,2,0,2,3);bowl.setAttribute('position',new Float32BufferAttribute(bp,3));bowl.setIndex(bi);bowl.computeVertexNormals();put('tower-bowl',bowl,'steel',ts);
 // Tilt every glass/frame piece through the same transform; frames stand 0.12 m proud.
 const tilt=.27,q=p.bridgePoint(ts,td),angle=-Math.atan2(q.tz,q.tx),cy=DECK_H+6.2;
 const cabPoint=(x,y,z)=>new Vector3(x,y,z).applyAxisAngle(new Vector3(0,0,1),tilt).applyAxisAngle(new Vector3(0,1,0),angle).add(new Vector3(q.x,cy,q.z)).toArray();
 const cabContact=(name,a,c,supports)=>contacts.push({name,ends:[cabPoint(...a),cabPoint(...c)],supports,tolerance:.18});
 function housePiece(name,mat,x,y,z,along,up,across){
  const g=new BoxGeometry(along,up,across);g.translate(x,y,z);g.rotateZ(tilt);g.rotateY(angle);g.translate(q.x,cy,q.z);put(name,g,mat,ts);
 }
 if(near)housePiece('control-glass','glass',0,0,0,5.3,5.0,4.4);
 else {
  // Far glazing is individual inset panes between the structural mullions.
  for(const z of [-2.2,2.2])for(let i=0;i<4;i++)for(const [y,h]of [[-.9,2.85],[1.625,1.45]])housePiece(`control-pane-${z}-${i}-${y}`,'glass',-1.9875+i*1.325,y,z,1.105,h,.05);
  for(const x of [-2.65,2.65])for(const z of [-1.1,1.1])for(const [y,h]of [[-.9,2.85],[1.625,1.45]])housePiece(`control-end-pane-${x}-${z}-${y}`,'glass',x,y,z,.05,h,1.98);
 }
 for(const [name,y]of [['lower',-2.5],['upper',2.5]])housePiece(`control-frame-${name}`,'steel',0,y,0,5.85,.28,4.9);
 for(const z of [-2.42,2.42]){
  for(const x of [-2.65,-1.325,0,1.325,2.65]){
   const name=`control-mullion-${z}-${x}`;housePiece(name,'steel',x,0,z,.18,5.0,.18);
   cabContact(name,[x,-2.5,z],[x,2.5,z],['control-frame-lower','control-frame-upper']);
  }
  housePiece(`control-transom-${z}`,'steel',0,.65,z,5.65,.18,.18);
  cabContact(`control-transom-${z}`,[-2.825,.65,z],[2.825,.65,z],[`control-mullion-${z}--2.65`,`control-mullion-${z}-2.65`]);
 }
 for(const x of [-2.87,2.87]){
  for(const z of [-2.2,0,2.2]){
   const name=`control-end-mullion-${x}-${z}`;housePiece(name,'steel',x,0,z,.18,5.0,.18);
   cabContact(name,[x,-2.5,z],[x,2.5,z],['control-frame-lower','control-frame-upper']);
  }
  housePiece(`control-end-transom-${x}`,'steel',x,.65,0,.18,.18,4.6);
  cabContact(`control-end-transom-${x}`,[x,.65,-2.3],[x,.65,2.3],[`control-end-mullion-${x}--2.2`,`control-end-mullion-${x}-2.2`]);
 }
 // Recessed louvre panel on the flared side, with spaced silver slats in both LODs.
 for(const side of [-1,1]){
  box(`control-louvre-backing-${side}`,near?'glass':'steel',ts+.15,td+side*2.79,DECK_H+2.45,7.5,.18,2.55);
  for(let i=0;i<(near?8:5);i++){
   const y=DECK_H+1.25+i*2.4/(near?7:4);
   box(`control-louvre-${side}-${i}`,'steel',ts+.15,td+side*2.95,y,7.9,.18,.12);
  }
 }
 // Twin-arm highway lamps remain in the silhouette in both LODs, far at every other station.
 for(let s=140;s<L-120;s+=near?55:110){
  const d=2.8,y=p.deckHeight(s);
  box(`light-foot-${s}`,'concrete',s,d,y+.3,.9,.9,.6);
  beam(`light-post-${s}`,'rail',[s,d,y+.4],[s,d,y+7.2],.15,.15,[`light-foot-${s}`,`light-hub-${s}`]);
  box(`light-hub-${s}`,'rail',s,d,y+7.2,.3,.4,.3);
  for(const sign of [-1,1]){
   beam(`light-arm-${s}-${sign}`,'rail',[s,d,y+7.2],[s,d+sign*3.5,y+8.4],.12,.12,[`light-hub-${s}`,`light-head-${s}-${sign}`]);
   box(`light-head-${s}-${sign}`,'lamp',s,d+sign*3.5,y+8.4,.6,.9,.16);
  }
 }
 const root=b.finish();if(evidence)root.userData.evidence={parts,contacts};return root;
}
