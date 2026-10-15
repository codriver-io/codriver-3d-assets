import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {PALETTES} from './config.js';
import {PROFILE as p,L,PIERS,RIVER_START,RIVER_END,STRUCTURE_START,STRUCTURE_END,approachBlend,edgesAt,CREST} from './mission-bridge-profile.js';
const records=new WeakMap();
export const contactsFor=root=>records.get(root);
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...p.CHAMPLAIN,palette:PALETTES.light},detail),supports=new Map(),members=[];
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
 const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 function put(g,mat,name,s,lift=1){if(name){if(!supports.has(name))supports.set(name,[]);supports.get(name).push(g);}b.put(g,mat,chunk(s),lift);}
 function box(mat,s,d,y,len,w,h,name,lift=1){const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,h,w);if(mat==='rail'){const ids=Array.from(g.index.array);ids.splice(18,6);g.setIndex(ids);}g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,name,s,lift);}
 function beam(mat,a,c,w,name,anchors,lift=1){const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),dir=cv.clone().sub(av),g=new THREE.BoxGeometry(w,dir.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));g.translate(...av.clone().add(cv).multiplyScalar(.5).toArray());put(g,mat,null,(a[0]+c[0])/2,lift);if(anchors)members.push({name,ends:[av.toArray(),cv.toArray()],supports:anchors});}
 // Closed swept cross-sections, including caps. Stations include road curvature and vertical knots.
 function sweep(mat,start,end,section,name,{lift=1,openTop=false,openBottom=false,blend=false}={}){
  const cuts=new Set([start,end,...PIERS.filter(s=>s>start&&s<end),...p.ALIGNMENT.map(v=>v.s).filter(s=>s>start&&s<end),...p.knots.map(v=>v[0]).filter(s=>s>start&&s<end)]);
  for(let s=Math.ceil(start/(near?4:12))*(near?4:12);s<end;s+=near?4:12)cuts.add(s);
  const stations=[...cuts].sort((a,c)=>a-c),n=section(start).length;
  for(let k=0;k<(near?3:1);k++){
   const lo=L*k/(near?3:1),hi=L*(k+1)/(near?3:1),ss=stations.filter(s=>s>=lo&&s<=hi);
   if(start<lo&&end>lo)ss.unshift(lo);if(start<hi&&end>hi)ss.push(hi);if(ss.length<2)continue;
   const pos=[],idx=[],weights=[],mix=[];
   for(const s of ss)for(const [d,y] of section(s)){pos.push(...xyz(s,d,y));weights.push(typeof lift==='function'?lift(s,y):lift);if(blend)mix.push(approachBlend(s));}
   // Cross-section is clockwise as seen toward increasing station; outward sides.
   for(let i=1;i<ss.length;i++)for(let j=0;j<n;j++){if((openTop&&j===0)||(openBottom&&j===2))continue;const c=(j+1)%n,a=(i-1)*n+j,d=(i-1)*n+c,e=i*n+j,f=i*n+c;idx.push(a,d,e,d,f,e);}
   for(let j=1;j<n-1;j++)idx.push(0,j+1,j,(ss.length-1)*n,(ss.length-1)*n+j,(ss.length-1)*n+j+1);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const clean=[];
   for(let i=0;i<idx.length;i+=3){const [a,c,d]=idx.slice(i,i+3).map(j=>new THREE.Vector3(...pos.slice(j*3,j*3+3)));if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)clean.push(...idx.slice(i,i+3));}
   g.setIndex(clean);g.computeVertexNormals();if(blend)g.setAttribute('landingBlend',new THREE.Float32BufferAttribute(mix,1));put(g,mat,name,(lo+hi)/2);g.setAttribute('bridgeLift',new THREE.Float32BufferAttribute(weights,1));
  }
 }
 function ribbon(mat,a,c,left,right,top,thick,name,options={}){
  if(mat==='asphalt'){
   const cuts=new Set([a,c,...PIERS.filter(v=>v>a&&v<c),...p.ALIGNMENT.map(v=>v.s).filter(v=>v>a&&v<c),...p.knots.map(v=>v[0]).filter(v=>v>a&&v<c)]),step=near?4:12,cols=near?11:7;
   for(let s=Math.ceil(a/step)*step;s<c;s+=step)cuts.add(s);
   const all=[...cuts].sort((u,v)=>u-v);
   for(let k=0;k<(near?3:1);k++){
    const lo=L*k/(near?3:1),hi=L*(k+1)/(near?3:1),ss=all.filter(s=>s>=lo&&s<=hi);if(a<lo&&c>lo)ss.unshift(lo);if(a<hi&&c>hi)ss.push(hi);if(ss.length<2)continue;
    const pos=[],idx=[],blend=[];
    for(const s of ss)for(let j=0;j<cols;j++){const l=left(s),r=right(s);pos.push(...xyz(s,l+(r-l)*j/(cols-1),top(s)));blend.push(approachBlend(s));}
    for(let i=1;i<ss.length;i++)for(let j=0;j<cols-1;j++){const u=(i-1)*cols+j,v=i*cols+j;idx.push(u,u+1,v,u+1,v+1,v);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('landingBlend',new THREE.Float32BufferAttribute(blend,1));g.setIndex(idx);g.computeVertexNormals();put(g,mat,name,(lo+hi)/2);
   }
   return;
  }
  sweep(mat,a,c,s=>{const l=typeof left==='function'?left(s):left,r=typeof right==='function'?right(s):right,y=top(s),h=typeof thick==='function'?thick(s):thick;return [[l,y],[r,y],[r,y-h],[l,y-h]];},name,{...options,openBottom:thick===0});}
 const h=p.deckHeight;
 // The load-bearing platform stops at the abutments; pavement tapers continue to live road ribbons.
 ribbon('concrete',STRUCTURE_START,STRUCTURE_END,s=>-10.1*approachBlend(s),s=>10.1*approachBlend(s),s=>Math.max(0,h(s)-.1),s=>Math.min(.55,Math.max(0,h(s)-.1)),'slab',{openTop:true});
 for(const [a,c] of [[-8.3,-8],[-.45,.45],[8,8.3]])ribbon('concrete',122,L-122,a,c,s=>h(s)-.1,0,'deck-top');
 for(let side=0;side<2;side++)ribbon('asphalt',0,L,s=>edgesAt(s)[side][0],s=>edgesAt(s)[side][1],h,0,'road',{blend:true});
 const depth=s=>{const nearest=Math.min(...PIERS.map(v=>Math.abs(v-s)));return 2.1+1.4*Math.max(0,1-nearest/22);};
 // Three main spans: twin broad trapezoidal steel box girders, with deeper haunches over the piers.
 for(const d of [-4.8,4.8]){
  sweep('steel',RIVER_START,RIVER_END,s=>[[d-3.5,h(s)-.65],[d+3.5,h(s)-.65],[d+2.9,h(s)-.65-depth(s)],[d-2.9,h(s)-.65-depth(s)]],'box-girder',{openTop:true});
  for(const s of [RIVER_START,RIVER_END])members.push({name:'box-girder-'+d+'-'+s,ends:[xyz(s,d,h(s)-.65-depth(s))],supports:['cap-'+s]});
 }
 for(const [start,end,mat] of [[PIERS[2],RIVER_START,'concrete'],[RIVER_END,PIERS.at(-2),'steel']])for(const d of [-7.4,-3.7,0,3.7,7.4]){
  // Approach girder webs and flanges remain open between members, rather than a solid deep slab.
  const gd=s=>Math.min(1.5,Math.max(0,h(s)-.65));
  ribbon(mat,start,end,d-.18,d+.18,s=>Math.max(0,h(s)-.65),gd,'approach-girder');
  ribbon(mat,start,end,d-.5,d+.5,s=>Math.max(0,h(s)-.65-gd(s)+.18),s=>Math.min(.18,Math.max(0,h(s)-.65)),'approach-girder');
  for(const s of [start,end])if(h(s)>3)members.push({name:'approach-girder-'+d+'-'+s,ends:[xyz(s,d,h(s)-2.15)],supports:['cap-'+s]});
 }
 for(const s of PIERS){
  const main=s>=RIVER_START&&s<=RIVER_END,capTop=h(s)-(main?4.15:2.15);
  if(capTop<1)continue;
  const capDepth=Math.min(1.35,capTop*.35),capBottom=capTop-capDepth;
  box('concrete',s,0,capTop-capDepth/2,3.8,19.4,capDepth,'cap-'+s);
  if(s===RIVER_START||s===RIVER_END)box('concrete',s+(s===RIVER_START?-.95:.95),0,capTop+1,1.9,19.4,2,'cap-'+s);
  const footH=Math.min(1.1,capBottom*.3);
  box('concrete',s,0,footH/2,5.4,13.4,footH,'foot-'+s,0);
  // Inclined twin 2.4 m rectangular columns: feet close together, heads wide apart.
  for(const side of [-1,1]){
   const bottom=footH*.7,top=capBottom+.15,pos=[],idx=[];
   for(const [y,d] of [[bottom,side*4.4],[top,side*7.3]])for(const [a,c] of [[-1.2,-1.2],[-1.2,1.2],[1.2,1.2],[1.2,-1.2]])pos.push(...xyz(s+a,d+c,y));
   for(let i=0;i<4;i++){const j=(i+1)%4;idx.push(i,j,i+4,j,j+4,i+4);}idx.push(0,2,1,0,3,2,4,5,6,4,6,7);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,'concrete',null,s,y=>Math.max(0,Math.min(1,(y-bottom)/(top-bottom))));
   members.push({name:'pier-leg-'+s+'-'+side,ends:[xyz(s,side*4.4,bottom),xyz(s,side*7.3,top)],supports:['foot-'+s,'cap-'+s]});
  }
  if(near&&main)for(const d of [-4.8,4.8])box('steel',s,d,capTop+.1,2.6,1.5,.2,'bearing-'+s);
 }
 // Walks, low concrete kerbs, thin metal outer railings and centre barrier.
 const walkStart=18,walkEnd=L-18;
 for(const side of [-1,1]){
  const inner=s=>edgesAt(s)[side<0?0:1][side<0?0:1]+side*.3,outer=s=>inner(s)+side*1.8*approachBlend(s);
  const railD=s=>outer(s)-side*.16*approachBlend(s);
  ribbon('concrete',walkStart,walkEnd,s=>Math.min(inner(s),outer(s)),s=>Math.max(inner(s),outer(s)),s=>h(s)+.18*approachBlend(s),s=>.28*approachBlend(s),'walk');
  ribbon('concrete',walkStart,walkEnd,s=>inner(s)-.16*approachBlend(s),s=>inner(s)+.16*approachBlend(s),s=>h(s)+.62*approachBlend(s),s=>.44*approachBlend(s),'kerb');
  const posts=[walkStart,walkEnd];for(let s=walkStart+(near?3.5:14);s<walkEnd;s+=near?3.5:14)posts.push(s);posts.sort((a,c)=>a-c);
  for(const s of posts){const f=approachBlend(s),d=railD(s);box('rail',s,d,h(s)+.7*f,.14,.14,1.08*f,'post-'+s+'-'+side);}
  for(const offset of near?[.64,1.15]:[1.15])for(let i=1;i<posts.length;i++){const a=posts[i-1],c=posts[i];beam('rail',[a,railD(a),h(a)+offset*approachBlend(a)],[c,railD(c),h(c)+offset*approachBlend(c)],.085,'rail-'+side+'-'+a,['post-'+a+'-'+side,'post-'+c+'-'+side]);}
 }
 ribbon('concrete',18,L-18,s=>-.28*approachBlend(s),s=>.28*approachBlend(s),s=>h(s)+.75*approachBlend(s),s=>.75*approachBlend(s),'median');
 {
  if(near)for(let s=140;s<L-140;s+=12)for(const d of [-4.2,4.2])box('paint',s,d,h(s)+.11,3,.12,.02,null);
  for(const s of [...Array.from({length:Math.floor((L-280)/60)+1},(_,i)=>140+i*60),(RIVER_START+RIVER_END)/2])for(const side of [-1,1]){const d=side*8.35;box('rail',s,d,h(s)+4,.16,.16,8,'lamp-post-'+s+'-'+side);beam('rail',[s,d,h(s)+7.9],[s,d-side*1.8,h(s)+8],.14,'lamp-arm-'+s+'-'+side,['lamp-post-'+s+'-'+side,'lamp-head-'+s+'-'+side]);box('lamp',s,d-side*1.8,h(s)+8,.65,.4,.22,'lamp-head-'+s+'-'+side);}
 }
 const root=b.finish();records.set(root,{supports,members});return root;
}
