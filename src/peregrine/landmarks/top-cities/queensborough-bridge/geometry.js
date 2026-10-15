import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {PALETTES} from './config.js';
import {PROFILE as p,L,MAIN_MID,STEEL_START,MAIN_SOUTH,MAIN_NORTH,STEEL_END,STRUCTURE_START,STRUCTURE_END,approachBlend,edgesAt} from './queensborough-bridge-profile.js';
import {WEST_PATH,EAST_PATH} from './queensborough-bridge-alignment.js';
// Generator remains independent of the app. Light standard-road/HD-surface values copied from
// basemap/road-material.js and hd-material.js. layer.js supplies the live palette at runtime.
const LANDING_ROAD=0xf2f3f6,DECK_SURFACE=0xb4b8bf;
const records=new WeakMap();
export const contactsFor=root=>records.get(root);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const GIRDER_STATIONS=[STEEL_START,MAIN_SOUTH,MAIN_NORTH,STEEL_END];
export const girderDepth=s=>{const q=Math.min(Math.abs(s-MAIN_SOUTH),Math.abs(s-MAIN_NORTH));return 1.65+3.2*Math.max(0,1-q/38)**2;};
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...p.CHAMPLAIN,palette:PALETTES.light},detail),supports=new Map(),members=[];
 const chunk=s=>near?Math.min(2,Math.max(0,Math.floor(s/L*3))):0;
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
 function put(g,mat,name,s=0,lift=1){if(name){if(!supports.has(name))supports.set(name,[]);supports.get(name).push(g);}b.put(g,mat,chunk(s),lift);}
 function box(mat,s,d,y,len,w,h,name,lift=1){const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,name,s,lift);}
 function bar(mat,a,c,w,name,anchors,lift=1){const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),delta=cv.clone().sub(av),g=new THREE.BoxGeometry(w,delta.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));g.translate(...av.clone().add(cv).multiplyScalar(.5).toArray());const s=p.projectBridge((av.x+cv.x)/2,(av.z+cv.z)/2).s;put(g,mat,null,s,lift);if(anchors)members.push({name,ends:[a,c],supports:anchors});}
 // Closed ribbons with exact mapped bends, ramp samples and named supports. Each cross-section
 // is subdivided across wide road surfaces for the shared terrain fitting contract.
 function strip(mat,start,end,left,right,top,bottom,name){
  const ss=new Set([start,end,...p.ALIGNMENT.map(v=>v.s).filter(s=>s>start&&s<end),...GIRDER_STATIONS.filter(s=>s>start&&s<end),...[STRUCTURE_END-90,STRUCTURE_END-10,L-15].filter(s=>s>start&&s<end)]);
  for(let s=start+(near?5:14);s<end;s+=near?5:14)ss.add(s);
  for(let k=0;k<(near?3:1);k++){
   const from=Math.max(start,L*k/(near?3:1)),to=Math.min(end,L*(k+1)/(near?3:1));if(to<=from)continue;
   const samples=[from,...[...ss].filter(s=>s>from&&s<to).sort((a,c)=>a-c),to],pos=[],idx=[],blend=[],cols=mat==='asphalt'?(near?5:3):2,stride=cols*(bottom?2:1);
   for(const s of samples){const a=typeof left==='function'?left(s):left,c=typeof right==='function'?right(s):right;
    for(let row=0;row<(bottom?2:1);row++)for(let j=0;j<cols;j++){pos.push(...xyz(s,a+(c-a)*j/(cols-1),row?bottom(s):top(s)));blend.push(approachBlend(s));}}
   for(let i=1;i<samples.length;i++){const a=(i-1)*stride,c=i*stride;for(let j=0;j<cols-1;j++){idx.push(a+j,a+j+1,c+j,a+j+1,c+j+1,c+j);if(bottom)idx.push(a+cols+j,c+cols+j,a+cols+j+1,a+cols+j+1,c+cols+j,c+cols+j+1);}if(bottom)idx.push(a,c,a+cols,a+cols,c,c+cols,a+cols-1,a+stride-1,c+cols-1,a+stride-1,c+stride-1,c+cols-1);}
   if(bottom){const a=(samples.length-1)*stride;for(let j=0;j<cols-1;j++)idx.push(j,j+cols,j+1,j+1,j+cols,j+cols+1,a+j,a+j+1,a+j+cols,a+j+1,a+j+cols+1,a+j+cols);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();if(mat==='asphalt')g.setAttribute('landingBlend',new THREE.Float32BufferAttribute(blend,1));put(g,mat,name,(from+to)/2);
  }
 }
 const h=p.deckHeight;
 strip('concrete',STRUCTURE_START,STRUCTURE_END,-9,9,s=>h(s)-.16,s=>Math.max(0,h(s)-.65),'slab');
 // The river crossing is a continuous pair of plate girders, with deep parabolic haunches at
 // the two navigation piers; concrete approach girders have a separate, much shorter rhythm.
 for(const d of [-7.8,7.8]){
  const n='main-web-'+d;
  strip('steel',STEEL_START,STEEL_END,d-.12,d+.12,s=>h(s)-.65,s=>h(s)-.65-girderDepth(s),n);
  strip('steel',STEEL_START,STEEL_END,d-.48,d+.48,s=>h(s)-.65-girderDepth(s),s=>h(s)-.81-girderDepth(s),'main-flange-'+d);
  members.push({name:n,ends:[xyz(STEEL_START,d,h(STEEL_START)-.74-girderDepth(STEEL_START)),xyz(STEEL_END,d,h(STEEL_END)-.74-girderDepth(STEEL_END))],supports:['cap-'+STEEL_START,'cap-'+STEEL_END]});
  if(near)for(let s=STEEL_START+2;s<STEEL_END;s+=3){const depth=girderDepth(s);box('steel',s,d,h(s)-.65-depth/2,.14,.48,depth,null);}
 }
 for(let s=STEEL_START;s<=STEEL_END;s+=near?6:18){bar('steel',xyz(s,-7.8,h(s)-1.1),xyz(s,7.8,h(s)-1.1),.4,'floorbeam-'+s,['main-web--7.8','main-web-7.8']);}
 const piers=[...GIRDER_STATIONS];
 for(let s=STEEL_START-18;s>STRUCTURE_START+8;s-=18)piers.push(s);
 for(let s=STEEL_END+18;s<STRUCTURE_END-8;s+=18)if(h(s)>3.8)piers.push(s);
 piers.sort((a,c)=>a-c);
 const first=piers[0],last=piers.at(-1);
 const approachDepth=s=>1.8+(girderDepth(STEEL_START)+.81-1.8)*Math.max(smooth((s-(STEEL_START-18))/18)*(s<=STEEL_START?1:0),smooth(((STEEL_END+18)-s)/18)*(s>=STEEL_END?1:0));
 for(const range of [[first,STEEL_START],[STEEL_END,last]])for(const d of [-7.8,-4.8,-1.8,1.8,4.8,7.8]){
  strip('concrete',...range,d-.22,d+.22,s=>h(s)-.65,s=>h(s)-approachDepth(s),'approach-girder');
  members.push({name:'approach-girder-'+d,ends:range.map(s=>xyz(s,d,h(s)-approachDepth(s))),supports:range.map(s=>'cap-'+s)});
 }
 for(const s of piers){const main=GIRDER_STATIONS.includes(s),depth=main?girderDepth(s)+.81:1.8,top=h(s)-depth;
  box('concrete',s,0,top-.5,main?4:1.8,18,.95,'cap-'+s);
  for(const d of main?[-5.8,5.8]:[-6,0,6]){
   const y=top-.975;if(y<=0)continue;
   box('concrete',s,d,y/2,main?3.6:1.25,main?3.9:1.25,y,'shaft-'+s+'-'+d,v=>Math.max(0,Math.min(1,v/y)));
   box('concrete',s,d,.25,main?5:2.2,main?5:2.2,.5,'foot-'+s+'-'+d,0);
   if(main)box('concrete',s,d,y-.6,4.8,5.2,1.2,'bearing-seat-'+s+'-'+d);
   members.push({name:'shaft-'+s+'-'+d,ends:[xyz(s,d,.25),xyz(s,d,y)],supports:['foot-'+s+'-'+d,'cap-'+s]});
  }
 }
 for(let side=0;side<2;side++){
  strip('asphalt',0,L,s=>edgesAt(s)[side][0],s=>edgesAt(s)[side][1],h,null,'road');
  // Far paint is omitted: no low-offset far overlay.
  if(near)for(let s=STRUCTURE_START+3;s<STRUCTURE_END-3;s+=12){const edge=edgesAt(s)[side],d=(edge[0]+edge[1])/2;box('paint',s,d,h(s)+.11,3,.12,.015,null);}
  const outer=s=>edgesAt(s)[side][side?1:0]+(side?.28:-.28)*approachBlend(s);
  strip('concrete',15,L-15,s=>outer(s)-.24*approachBlend(s),s=>outer(s)+.24*approachBlend(s),s=>h(s)+.95*approachBlend(s),s=>h(s)+.15*approachBlend(s),'road-barrier');
 }
 strip('concrete',15,L-15,s=>-.32*approachBlend(s),s=>.32*approachBlend(s),s=>h(s)+.83*approachBlend(s),s=>h(s),'median');
 // Sidewalks follow the mapped off-highway connections rather than ending on the highway taper.
 for(const [side,line] of [WEST_PATH,EAST_PATH].entries()){
  const controls=line.map(ll=>{const q=p.bridgeLocal(...ll);return {...q,s:p.projectBridge(q.x,q.z).s};});let dist=0;for(let i=0;i<controls.length;i++){if(i)dist+=Math.hypot(controls[i].x-controls[i-1].x,controls[i].z-controls[i-1].z);controls[i].u=dist;}
  const length=dist,pts=[];
  for(let i=1;i<controls.length;i++){const a=controls[i-1],c=controls[i],n=Math.ceil((c.u-a.u)/(near?5:14));for(let j=0;j<n;j++){const t=j/n;pts.push({x:a.x+(c.x-a.x)*t,z:a.z+(c.z-a.z)*t,s:a.s+(c.s-a.s)*t,u:a.u+(c.u-a.u)*t});}}pts.push(controls.at(-1));
  const sections=pts.map((q,i)=>{const a=pts[Math.max(0,i-1)],c=pts[Math.min(pts.length-1,i+1)],len=Math.hypot(c.x-a.x,c.z-a.z),tx=(c.x-a.x)/len,tz=(c.z-a.z)/len,fade=Math.min(smooth(q.u/65),smooth((length-q.u)/90));return {...q,tx,tz,y:h(q.s)*fade+.18,fade,w:1.6};});
  const path='path-'+side,post='path-post-'+side,hand='path-hand-'+side;
  const pp=(q,d,y)=>[q.x-q.tz*d,y,q.z+q.tx*d];
  function pathStrip(d,width,dy,thick,mat,name){const pos=[],idx=[],weights=[];for(const q of sections)for(const [a,y] of [[d-width/2,q.y+dy],[d+width/2,q.y+dy],[d-width/2,Math.max(0,q.y+dy-thick)],[d+width/2,Math.max(0,q.y+dy-thick)]]){pos.push(...pp(q,a,y));weights.push(q.fade);}for(let i=1;i<sections.length;i++){const a=(i-1)*4,c=i*4;idx.push(a,a+1,c,a+1,c+1,c,a+2,c+2,a+3,a+3,c+2,c+3,a,c,a+2,a+2,c,c+2,a+1,a+3,c+1,a+3,c+3,c+1);}const a=(sections.length-1)*4;idx.push(0,2,1,1,2,3,a,a+1,a+2,a+1,a+3,a+2);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,name,MAIN_MID);g.setAttribute('bridgeLift',new THREE.Float32BufferAttribute(weights,1));}
  pathStrip(0,1.6,0,near?.18:.4,'concrete',path);
  for(const d of [-.73,.73]){
   pathStrip(d,.11,1.38,.11,'rail',hand);
   if(near&&d===(side===0?-.73:.73)){pathStrip(d,.07,.72,.07,'rail','midrail-'+side);members.push({name:'midrail-'+side,ends:[pp(sections[0],d,sections[0].y+.68),pp(sections.at(-1),d,sections.at(-1).y+.68)],supports:[post,post]});}
   const ids=new Set([0,sections.length-1]);for(let i=0;i<sections.length;i+=near?1:3)ids.add(i);
   for(const i of ids){const q=sections[i];bar('rail',pp(q,d,q.y),pp(q,d,q.y+1.38),.09,'post-'+side+'-'+i,[path,hand],q.fade);}
   members.push({name:hand,ends:[pp(sections[0],d,sections[0].y+1.33),pp(sections.at(-1),d,sections.at(-1).y+1.33)],supports:[post,post]});
   for(const i of [0,sections.length-1]){const q=sections[i],g=new THREE.BoxGeometry(.2,1.5,.2);g.translate(...pp(q,d,q.y+.7));put(g,'rail',post,q.s,q.fade);}
  }
  members.push({name:path,ends:[pp(sections[0],0,.1),pp(sections.at(-1),0,.1)],supports:['ground','ground']});
  // Cantilever brackets connect the narrow sidewalk to the main deck; local ramp bents
  // carry the detached northern/southern descents, with planted feet and stretchable shafts.
  for(let i=0;i<sections.length;i+=near?4:6){const q=sections[i],proj=p.projectBridge(q.x,q.z),d=proj.lateral;
   if(q.y<.9)continue;
   if(Math.abs(d)<12&&q.fade>.99&&q.s>=STRUCTURE_START&&q.s<=STRUCTURE_END){bar('concrete',xyz(q.s,Math.sign(d)*7.8,h(q.s)-.5),pp(q,0,q.y-.2),.32,'path-bracket-'+side+'-'+i,['slab',path]);}
   else {const top=q.y-.18;const g=new THREE.BoxGeometry(.75,top,.75);g.translate(q.x,top/2,q.z);put(g,'concrete','path-shaft',q.s,y=>Math.max(0,Math.min(1,y/top)));}
  }
 }
 // Slender curved highway lamps are retained in both silhouettes; merged by material/chunk.
 for(let s=STRUCTURE_START+15;s<STRUCTURE_END-18;s+=44){const d=-8.9,name='lamp-head-'+s;box('rail',s,d,h(s)+.5,.35,.35,1,'lamp-base-'+s);
  const points=[[s,d,h(s)+.95],[s,d,h(s)+7.8],[s,d+.25,h(s)+8.7],[s,d+1,h(s)+9.2],[s,d+2.5,h(s)+9.4]];
  for(let i=1;i<points.length;i++)bar('rail',xyz(...points[i-1]),xyz(...points[i]),.12,'lamp-arm-'+s+'-'+i,i===1?['lamp-base-'+s,'lamp-joint-'+s]:['lamp-joint-'+s,'lamp-joint-'+s]);
  for(const q of points.slice(1))box('rail',q[0],q[1],q[2],.15,.15,.15,'lamp-joint-'+s);
  box('lamp',s,d+2.6,h(s)+9.4,1,.45,.18,name);
 }
 const root=b.finish();root.traverse(m=>{if(!m.isMesh||m.material.name!=='asphalt')return;const a=m.geometry.attributes.landingBlend,colors=[],land=new THREE.Color(LANDING_ROAD),deck=new THREE.Color(DECK_SURFACE);for(let i=0;i<a.count;i++)colors.push(...land.clone().lerp(deck,a.getX(i)).toArray());m.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));m.material.vertexColors=true;m.material.color.setHex(0xffffff);});records.set(root,{supports,members});return root;
}
