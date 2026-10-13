import {BoxGeometry,BufferGeometry,Float32BufferAttribute,CylinderGeometry,Vector3,Quaternion} from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {LENGTH,TOWERS,TOWER_HEIGHT,DECK_WIDTH,FRAME_WIDTH,RAIL_HEIGHT,deckHeight,point,heading,samples,LANDINGS,landingHeight,landingPoint,landingSamples} from './bob-kerrey-pedestrian-bridge-parts.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const ranges={},offsets={},indexOffsets={},members=[];
 function put(g,mat,name) {
  if(name)ranges[name]={material:mat,start:offsets[mat]||0,count:g.attributes.position.count,indexStart:indexOffsets[mat]||0,indexCount:g.index?.count||g.attributes.position.count};
  offsets[mat]=(offsets[mat]||0)+g.attributes.position.count;
  indexOffsets[mat]=(indexOffsets[mat]||0)+(g.index?.count||g.attributes.position.count);b.put(g,mat);
 }
 function box(name,mat,s,y,d,l,h,w) {
  const g=new BoxGeometry(l,h,w);g.rotateY(heading(s));g.translate(...point(s,y,d));put(g,mat,name);
 }
 function beam(name,mat,a,c,w,ends,depth=w,round=false) {
  const av=new Vector3(...a),cv=new Vector3(...c),delta=cv.clone().sub(av);
  const g=round?new CylinderGeometry(w,w,delta.length(),near?6:4,1,false):new BoxGeometry(w,delta.length(),depth);
  g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),delta.normalize()));
  g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat,name);
  if(ends)members.push({name,endpoints:[a,c],supports:ends,tolerance:round?.085:.36});
 }
 // Closed rectangular sweeps: no overlapping boxes along the S-curve.
 function strip(name,mat,ss,left,right,bottom,top) {
  const p=[],idx=[];
  for(const s of ss)for(const [d,y] of [[left,bottom],[right,bottom],[right,top],[left,top]])p.push(...point(s,deckHeight(s)+y,d));
  for(let i=1;i<ss.length;i++)for(let j=0;j<4;j++){
   const a=(i-1)*4+j,c=(i-1)*4+(j+1)%4,d=i*4+j,e=i*4+(j+1)%4;
   idx.push(a,d,c,c,d,e);
  }
  const end=(ss.length-1)*4;idx.push(0,1,2,0,2,3,end,end+2,end+1,end,end+3,end+2);
  let g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(p,3));g.setIndex(idx);
  g=g.toNonIndexed();g.computeVertexNormals();put(g,mat,name);
 }
 const ss=samples(near?3.5:7),half=DECK_WIDTH/2,outer=FRAME_WIDTH/2;
 strip('walking-deck','deck',ss,-half,half,-.20,0);
 for(const side of [-1,1]){
  strip(`curb-${side}`,'rail',ss,side*half-.075,side*half+.075,0,.19);
  strip(`girder-${side}`,'steel',ss,side*outer-.095,side*outer+.095,-.78,-.196);

 }
 // Published approximately 23 ft modular floorbeam spacing. The walking slab
 // rests on these beams; each end meets its named independent outer girder.
 const floorStations=[0,LENGTH];for(let s=7.0104;s<LENGTH;s+=7.0104)floorStations.push(s);
 for(const [i,s] of floorStations.sort((a,c)=>a-c).entries()){
  beam(`floorbeam-${i}`,'steel',point(s,deckHeight(s)-.40,-outer),point(s,deckHeight(s)-.40,outer),.26,['girder--1','girder-1'],.44);
  if(near&&s>4&&s<LENGTH-4)for(const side of [-1,1]){
   beam(`underside-brace-${i}-${side}`,'steel',point(s,deckHeight(s)-.60,side*outer),point(s+3.5,deckHeight(s+3.5)-.20,0),.07,[`girder-${side}`,'walking-deck']);
  }
 }
 // Approaches only: the cable-supported 1,012 ft unit stays open below.
 const supportStations=[0,26,53,TOWERS[0].s-77.1144,TOWERS[1].s+77.1144,438,486,534,582,630,678,726,LENGTH];
 for(const [i,s] of supportStations.entries()) {
  const terminal=i===0||i===supportStations.length-1;
  const h=deckHeight(s)-(terminal?.62:1.16);
  box(`pier-${i}`,'concrete',s,h/2,0,1.35,h,2.6);
  box(`cap-${i}`,terminal?'steel':'concrete',s,deckHeight(s)-(terminal?.55:.97),0,1.55,.38,FRAME_WIDTH+.10);
 }
 // Three-sided tapered blades outside the walking corridor, subtly raked.
 for(const [i,t] of TOWERS.entries()) {
  const p=[],ix=[],levels=[[0,1.95],[16,1.55],[TOWER_HEIGHT-4.5,.66],[TOWER_HEIGHT,.56]];
  for(const [y,r] of levels){
   const shift=(y/TOWER_HEIGHT)*.65;
   for(const [along,across] of [[-r*.70,-r*.50],[r*.70,-r*.50],[0,r*.82]])p.push(...point(t.s+along+shift,y,t.d+across));
  }
  for(let k=1;k<levels.length;k++)for(let j=0;j<3;j++){
   const a=(k-1)*3+j,c=(k-1)*3+(j+1)%3,d=k*3+j,e=k*3+(j+1)%3;ix.push(a,d,c,c,d,e);
  }
  ix.push(0,1,2,9,11,10);
  let g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(p,3));g.setIndex(ix);g=g.toNonIndexed();g.computeVertexNormals();put(g,'concrete',`tower-${i}`);
  beam(`tower-crosshead-${i}`,'concrete',point(t.s,deckHeight(t.s)-1.03,-outer),point(t.s,deckHeight(t.s)-1.03,outer),.50,['girder--1','girder-1'],.50);
  for(const side of [-1,1])for(const direction of [-1,1])for(let k=0;k<10;k++){
   const s=t.s+direction*(7.0104+(70.104-7.0104)*k/9),y=deckHeight(s)-.31;
   const topY=TOWER_HEIGHT-1.0-(9-k)*.30;
   const r=.56+(TOWER_HEIGHT-topY)*.10/4.5;
   const top=point(t.s+.65*(topY/TOWER_HEIGHT)+direction*.35*r,topY,t.d+(side<0?-.50:.16)*r);
   const deck=point(s,y,side*(outer-.095)),name=`stay-${i}-${side}-${direction}-${k}`;
   beam(name,'cable',top,deck,near?.029:.038,[`tower-${i}`,`girder-${side}`],0,true);
   if(near){
    const av=new Vector3(...deck),v=new Vector3(...top).sub(av).normalize().multiplyScalar(.58);
    beam(null,'steel',deck,av.clone().add(v).toArray(),.075,null,0,true);
   }
  }
  box(`tower-light-${i}`,'light',t.s+.65,TOWER_HEIGHT-.21,t.d+.46,.34,.40,.20);
 }
 // Every retained rail span ends in two independently named rail posts.
 const n=Math.ceil(LENGTH/(near?3.5:10.5)),railSS=Array.from({length:n+1},(_,i)=>i*LENGTH/n);
 for(const side of [-1,1]) {
  const d=side*(half-.06);
  for(const [i,s] of railSS.entries()){
   const post=`rail-post-${side}-${i}`;
   box(post,'rail',s,deckHeight(s)+RAIL_HEIGHT/2,d,.075,RAIL_HEIGHT,.075);
   members.push({name:post,endpoints:[point(s,deckHeight(s),d),point(s,deckHeight(s)+RAIL_HEIGHT,d)],supports:[`curb-${side}`,`rail-${side}-${Math.min(i,n-1)}-${RAIL_HEIGHT}`],tolerance:.08});
   if(near&&i%4===0)box(null,'light',s,deckHeight(s)+1.02,d+side*.08,.16,.07,.09);
  }
  for(let i=0;i<n;i++)for(const y of near?[.25,.80,RAIL_HEIGHT]:[.32,RAIL_HEIGHT]){
   beam(`rail-${side}-${i}-${y}`,'rail',point(railSS[i],deckHeight(railSS[i])+y,d),point(railSS[i+1],deckHeight(railSS[i+1])+y,d),near?.042:.055,[`rail-post-${side}-${i}`,`rail-post-${side}-${i+1}`]);
  }
  if(near)for(let s=1.75;s<LENGTH;s+=1.75){
   const i=Math.min(n-1,Math.floor(s/LENGTH*n)),f=(s-railSS[i])/(railSS[i+1]-railSS[i]);
   const ends=[.25,RAIL_HEIGHT].map(y=>new Vector3(...point(railSS[i],deckHeight(railSS[i])+y,d)).lerp(new Vector3(...point(railSS[i+1],deckHeight(railSS[i+1])+y,d)),f).toArray());
   beam(`rail-infill-${side}-${s}`,'rail',ends[0],ends[1],.014,[`rail-${side}-${i}-0.25`,`rail-${side}-${i}-${RAIL_HEIGHT}`],.022);
  }
 }
 for(const side of [-1,1])members.push({name:`girder-${side}`,endpoints:[point(0,deckHeight(0)-.49,side*outer),point(LENGTH,deckHeight(LENGTH)-.49,side*outer)],supports:['cap-0','cap-12'],tolerance:.3});
 members.push({name:'walking-deck',endpoints:[point(0,deckHeight(0)-.2),point(LENGTH,deckHeight(LENGTH)-.2)],supports:['floorbeam-0',`floorbeam-${floorStations.length-1}`],tolerance:.05});
 // Solid bank-supported wedges meet grade, with a level final landing. Rails
 // share the existing terminal posts so neither LOD has a disconnected seam.
 for(const r of LANDINGS){
  const ts=landingSamples(r),name=`landing-${r.name}`;
  function sweep(part,mat,left,right,bottom,top){
   const p=[],ix=[];
   for(const t of ts)for(const [d,y] of [[left,bottom(t)],[right,bottom(t)],[right,top(t)],[left,top(t)]])p.push(...landingPoint(r,t,y,d));
   for(let i=1;i<ts.length;i++)for(let j=mat==='deck'?1:0;j<4;j++){
    const a=(i-1)*4+j,c=(i-1)*4+(j+1)%4,d=i*4+j,e=i*4+(j+1)%4;ix.push(a,d,c,c,d,e);
   }
   // West section winding follows the original deck frame, opposite to its
   // outward station direction; reverse once, including the terminal cap.
   const end=(ts.length-1)*4;ix.push(end,end+2,end+1,end,end+3,end+2);
   if(r.s===0)for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];
   // At grade the wedge closes to zero thickness. Retain its walking face,
   // omit collapsed side/cap triangles and buried bottoms.
   const clean=[];
   for(let i=0;i<ix.length;i+=3){
    const a=new Vector3().fromArray(p,ix[i]*3),c=new Vector3().fromArray(p,ix[i+1]*3),d=new Vector3().fromArray(p,ix[i+2]*3);
    if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-14)clean.push(ix[i],ix[i+1],ix[i+2]);
   }
   let g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(p,3));g.setIndex(clean);g=g.toNonIndexed();g.computeVertexNormals();put(g,mat,part);
  }
  sweep(name,'deck',-half,half,()=>0,t=>landingHeight(r,t));
  const railTS=[...new Set([0,1,2,r.length-.5,r.length,...Array.from({length:Math.ceil(r.length/(near?1:2))},(_,i)=>i*(near?1:2))])].filter(t=>t<=r.length).sort((a,b)=>a-b);
  for(const side of [-1,1]){
   sweep(`${name}-curb-${side}`,'rail',side*half-.075,side*half+.075,t=>landingHeight(r,t),t=>landingHeight(r,t)+.19);
   const d=side*(half-.06),postNames=railTS.map((t,i)=>i===0?`rail-post-${side}-${r.s===0?0:n}`:`${name}-post-${side}-${i}`);
   for(let i=1;i<railTS.length;i++){
    const t=railTS[i],lo=landingPoint(r,t,landingHeight(r,t),d),hi=landingPoint(r,t,landingHeight(r,t)+RAIL_HEIGHT,d);
    beam(postNames[i],'rail',lo,hi,.075,null);
    members.push({name:postNames[i],endpoints:[lo,hi],supports:[`${name}-curb-${side}`,`${name}-rail-${side}-${i-1}-${RAIL_HEIGHT}`],tolerance:.08});
   }
   for(let i=0;i<railTS.length-1;i++)for(const y of near?[.25,.80,RAIL_HEIGHT]:[.32,RAIL_HEIGHT]){
    beam(`${name}-rail-${side}-${i}-${y}`,'rail',landingPoint(r,railTS[i],landingHeight(r,railTS[i])+y,d),landingPoint(r,railTS[i+1],landingHeight(r,railTS[i+1])+y,d),near?.042:.055,[postNames[i],postNames[i+1]]);
   }
  }
 }
 const model=b.finish();
 // QA-only ranges remain available to focused geometry tests. They are not
 // enumerable, so GLTFExporter does not ship hundreds of redundant labels.
 Object.defineProperties(model.userData,{partRanges:{value:ranges},contactMembers:{value:members}});
 model.userData.alignmentLengthM=LENGTH;model.userData.stayCount=80;
 return model;
}
