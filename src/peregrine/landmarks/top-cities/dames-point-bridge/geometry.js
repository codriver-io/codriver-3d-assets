import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {PROFILE as p,L,MID,DECK_H,TOWER_H,HALF_WIDTH,MEDIAN,ROAD_EDGES,TOWERS,CABLE_START,CABLE_END,BRIDGE_END,
 LANDING,SAG,SIDES,TAPER,authoredLateral,landingBlend} from './dames-point-bridge-profile.js';
import {PALETTES} from './config.js';

// Lateral layout (m from the centreline): anchorage curb 14.4-15.4, outer barrier 15.4-16.1 (it holds
// the stay anchors), deck slab to 16.0, edge girders 14.2-15.9, H-pylon legs centred at 18.6.
export const LEG_D=18.6,STAY_TOP_D=18.0,STAY_DECK_D=15.75,PARAPET=[15.4,16.1],CURB=[14.4,15.4];
// Pylon leg sections [y, along, across]: flared below the deck, slender above (photo-scaled).
export const legLevels=hT=>[[0,9.0,5.6],[hT-3.0,5.8,4.2],[hT+1.0,4.4,2.8],[TOWER_H,3.9,2.5]];
// Two struts between the legs (photo-scaled from Commons refs 1 and 4): deep haunches at the legs,
// the top face dipping 4 m to a V at mid-width. Outline [lateral, height about the strut level].
export const STRUTS=[71.0,114.5];
export const STRUT_SHAPE=[[-18,3.0],[0,-1.0],[18,3.0],[18,-3.4],[0,-3.8],[-18,-3.4]];
// Crossbeam under the deck, with haunched corners like the hexagonal opening between the lower legs.
const crossbeamShape=hT=>[[-18.6,hT-1.85],[18.6,hT-1.85],[18.6,hT-9.5],[11,hT-5.2],[-11,hT-5.2],[-18.6,hT-9.5]];
// Harp: 18 positions per half harp, tower anchors evenly spaced, all stays one slope.
export const STAY_COUNT=18,STAY_LOW=62.0,STAY_HIGH=139.5,STAY_REACH=190;
export const SPAN=48.77; // 160 ft approach spans (estimated from photographs)
// Embankments: south abutment fill up to the first bent, north fill beyond the mapped bridge end.
export const SOUTH_ABUT=(()=>{let s=LANDING;while(p.deckHeight(s)<3.5)s+=1;return s;})();
// The fills stop where the deck is 0.5 m up: the flat map's ground writes no depth, so a buried fill top
// would show as a concrete apron round the landing noses.
export const FILL_ENDS=(()=>{let a=LANDING,c=L-LANDING;while(p.deckHeight(a)<.5)a+=1;while(p.deckHeight(c)<.5)c-=1;return [a,c];})();
// Ship-impact dolphins, measured from Esri World Imagery (reference only).
// Full-width slab and fill tops break at the pavement edges and the median (each half on its own carriageway).
export const DECK_COLS=[ROAD_EDGES[0][0],ROAD_EDGES[0][1],ROAD_EDGES[1][0],ROAD_EDGES[1][1]];
// Only where the deck is low can the world-mode clamp lift it (the DEM along the alignment stays under ~10 m):
// below COL_DECK_M the slab carries the columns, over the high viaducts and spans it stays a single chord.
export const COL_DECK_M=20;
export const COL_REACH=(()=>{let a=0,c=L;while(p.deckHeight(a)<COL_DECK_M)a+=1;while(p.deckHeight(c)<COL_DECK_M)c-=1;return [a,c];})();
const STRIP_ENDS=[...FILL_ENDS,SOUTH_ABUT,SOUTH_ABUT-2,BRIDGE_END,BRIDGE_END+2,...COL_REACH];
export const DOLPHINS=[[-81.555918,30.382959],[-81.557178,30.386153]];
const stayTop=i=>STAY_LOW+(STAY_HIGH-STAY_LOW)*i/(STAY_COUNT-1);
function reach(t,dir,y,k){let x=(y-DECK_H)/k;for(let n=0;n<30;n++)x=(y-p.deckHeight(t+dir*x))/k;return x;}
// One slope for all four harps: the steepest outermost stay that still lands inside its span.
export const HARP_SLOPE=(()=>{let lo=.2,hi=1;for(let n=0;n<50;n++){const k=(lo+hi)/2,ok=TOWERS.every(t=>[-1,1].every(dir=>reach(t,dir,STAY_HIGH,k)<=STAY_REACH));if(ok)hi=k;else lo=k;}return hi;})();
export function stays(detail='near'){
 const out=[];
 for(const [ti,t] of TOWERS.entries())for(const sd of [-1,1])for(const dir of [-1,1])for(let i=0;i<STAY_COUNT;i++){
  const main=(ti===0)===(dir===1);
  // Main-span cables are paired one above the other, side-span cables side by side.
  const pairs=detail==='near'?(main?[[0,0],[-1.0,0]]:[[0,-.25],[0,.25]]):[[0,0]];
  for(const [dy,dd] of pairs){
   const y=stayTop(i)+dy,x=reach(t,dir,y,HARP_SLOPE),s=t+dir*x;
   out.push({ti,sd,dir,i,main,top:[t+dir*1.2,sd*(STAY_TOP_D+dd),y],foot:[s,sd*(STAY_DECK_D+dd),p.deckHeight(s)+.75]});
  }
 }
 return out;
}
export function bentStations(){
 const out=[];
 for(let s=CABLE_START-SPAN;s>SOUTH_ABUT+20;s-=SPAN)out.push(s);
 for(let s=CABLE_END+SPAN;s<BRIDGE_END-20;s+=SPAN)out.push(s);
 return out.sort((a,b)=>a-b);
}
export function lampStations(){const out=[];for(let s=60;s<L-60;s+=54)out.push(s);return out;}

export function create({detail='near',audit=false}={}){
 const near=detail==='near',b=assetBuilder(p.CHAMPLAIN,detail),support={},members=[];
 const xyz=(s,d,y,sd)=>{const q=p.bridgePoint(s,authoredLateral(s,d,sd),y);return [q.x,q.y,q.z];};
 const ck=s=>near?Math.min(2,Math.max(0,Math.floor(s/L*3))):0;
 const clamp=v=>Math.max(0,Math.min(1,v)),h=s=>p.deckHeight(s);
 function put(g,mat,s,name,lift=1){if(audit&&name)for(const n of [].concat(name))(support[n]??=[]).push(g.clone());b.put(g,mat,ck(s),lift);}
 function frame(s){const q=p.bridgePoint(s,0,0);return new THREE.Matrix4().makeBasis(new THREE.Vector3(-q.tz,0,q.tx),new THREE.Vector3(0,1,0),new THREE.Vector3(-q.tx,0,-q.tz)).setPosition(q.x,0,q.z);}
 function box(mat,s,d,y,len,w,ht,name,lift=1){const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(len,ht,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);put(g,mat,s,name,lift);}
 function bar(mat,a,c,w,depth=w,name,lift=1,round=false,sides=near?6:3){const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),v=cv.clone().sub(av);const g=round?new THREE.CylinderGeometry(w,w,v.length(),sides,1,true):new THREE.BoxGeometry(w,v.length(),depth);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat,a[0],name,lift);}
 function contact(name,a,c,sa,sc){if(audit)members.push({name,a:xyz(...a),c:xyz(...c),sa,sc});}
 // Station samples: alignment vertices, dense on the crest and sag curves and the landing tapers.
 function stationsIn(a,c){
  // Every strip end is a station of every strip it overlaps, so the pavement and the slab/fill under it share rows.
  const ss=new Set([a,c,...[...p.ALIGNMENT.map(q=>q.s),...STRIP_ENDS].filter(s=>s>a&&s<c)]),step=near?25:50;
  for(let s=Math.ceil(a/step)*step;s<c;s+=step)ss.add(s);
  const dense=(u,v,st)=>{for(let s=Math.max(a,u);s<=Math.min(c,v);s+=st)ss.add(s);};
  // A 50 m chord on the 8 km crest radius sags 4 cm: only the 60 m sags and the tapers need samples.
  if(near)dense(MID-SIDES[0].C,MID+SIDES[1].C,10);
  dense(LANDING,LANDING+SAG,near?5:15);dense(L-LANDING-SAG,L-LANDING,near?5:15);
  dense(0,TAPER,near?10:25);dense(L-TAPER,L,near?10:25);
  return [...ss].filter(s=>s>=a&&s<=c).sort((u,v)=>u-v);
 }
 // Closed longitudinal box between two laterals. top/bottom: offsets from the deck, or 'ground'.
 // fade: the box sinks into the pavement over the last metres at each landing (no buried end caps).
 function strip(mat,left,right,top,bottom,name,{a=0,c=L,fade=0,sd,thin=false,cols=[]}={}){
  const all=stationsIn(a,c),parts=near?3:1;
  for(let part=0;part<parts;part++){
   const lo=Math.max(a,L*part/parts),hi=Math.min(c,L*(part+1)/parts);if(hi<=lo)continue;
   const sub=[lo,...all.filter(s=>s>lo&&s<hi),hi],pos=[],idx=[];
   // Each face keeps its own vertex rows (flat across the edges, smooth along the deck).
   // Top laterals left to right, then the bottom right to left. cols adds interior columns, so a full-width
   // top keeps the pavement's own vertices: the world-mode terrain clamp lifts every vertex to the DEM under it,
   // and a chord straight across from parapet to parapet rose through the carriageways where the bank is not flat.
   const lats=[left,...cols,right],n=lats.length;
   const rows=sub.map(s=>{const f=fade?clamp(Math.min(s,L-s)/fade):1,y0=h(s),yt=y0+top*f,yb=Math.min(yt,bottom==='ground'?0:y0+bottom*f);
    return [...lats.map(d=>xyz(s,d,yt,sd)),...lats.slice().reverse().map(d=>xyz(s,d,yb,sd))];});
   const faces=thin?lats.slice(1).map((_,k)=>[k,k+1]):Array.from({length:2*n},(_,k)=>[k,(k+1)%(2*n)]);
   for(const [ia,ib] of faces){
    const base=pos.length/3;
    for(const r of rows)pos.push(...r[ia],...r[ib]);
    for(let i=1;i<rows.length;i++){const u=base+(i-1)*2,v=base+i*2;idx.push(u,u+1,v,u+1,v+1,v);}
   }
   if(!thin)for(const [k,end] of [[0,lo>0],[rows.length-1,hi<L]]){
    if(!end)continue;const r=rows[k];
    for(let j=0;j<n-1;j++){const base=pos.length/3;pos.push(...r[j],...r[j+1],...r[2*n-2-j],...r[2*n-1-j]);
     if(k===0)idx.push(base,base+3,base+1,base+1,base+3,base+2);else idx.push(base,base+1,base+3,base+1,base+2,base+3);}
   }
   const clean=[];
   for(let i=0;i<idx.length;i+=3){const u=new THREE.Vector3().fromArray(pos,idx[i]*3),v=new THREE.Vector3().fromArray(pos,idx[i+1]*3),w=new THREE.Vector3().fromArray(pos,idx[i+2]*3);if(v.sub(u).cross(w.sub(u)).lengthSq()>1e-10)clean.push(idx[i],idx[i+1],idx[i+2]);}
   if(!clean.length)continue;
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(clean);g.computeVertexNormals();
   // A fill wall's foot stays on the ground; its crown rides with the deck.
   put(g,mat,lo,name,bottom==='ground'?(y=>y>.01?1:0):1);
  }
 }
 // Vertical prism through chamfered octagonal sections [y, along, across] around (s, d).
 function prism(mat,s,d,levels,name,lift){
  const pos=[],idx=[],c=.35;
  for(const [y,len,w] of levels){const a=len/2,e=w/2;for(const [u,v] of [[-a+c,-e],[a-c,-e],[a,-e+c],[a,e-c],[a-c,e],[-a+c,e],[-a,e-c],[-a,-e+c]])pos.push(...xyz(s+u,d+v,y));}
  for(let k=1;k<levels.length;k++)for(let j=0;j<8;j++){const a=(k-1)*8+j,cc=(k-1)*8+(j+1)%8,u=k*8+j,v=k*8+(j+1)%8;idx.push(a,u,cc,cc,u,v);}
  const top=(levels.length-1)*8;for(let j=1;j<7;j++)idx.push(top,top+j+1,top+j);
  let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);
  if(near)g=g.toNonIndexed();g.computeVertexNormals();put(g,mat,s,name,lift);
 }
 // Chevron strut: a V in the lateral/vertical plane, extruded along the bridge.
 function slab(s,outline,y,depth,name,lift=1){
  const shape=new THREE.Shape(outline.map(([u,v])=>new THREE.Vector2(u,v)));
  const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:1});
  g.translate(0,y,-depth/2);g.applyMatrix4(frame(s));put(g,'tower',s,name,lift);
 }
 const sides=[[0,-1],[1,1]];
 // Deck: slab and girders on the viaduct; fill walls on the two embankments.
 for(const [a,c,cols] of [[SOUTH_ABUT-2,COL_REACH[0],DECK_COLS],[COL_REACH[0],COL_REACH[1],[]],[COL_REACH[1],BRIDGE_END+2,DECK_COLS]])
  if(c>a)strip('concrete',-16.0,16.0,-.15,near?-.75:-2.0,'deck',{a,c,cols});
 // Far: the slab is drawn at full girder depth instead of separate girder lines.
 if(near)for(const [i,sg] of sides){
  const [l,r]=sg<0?[-15.9,-14.2]:[14.2,15.9];
  strip('concrete',l,r,-.7,-2.0,`girder-${i}`,{a:SOUTH_ABUT-2,c:BRIDGE_END+2});
  // Approach viaducts also carry an inner girder line under each carriageway.
  const [il,ir]=sg<0?[-8.4,-6.6]:[6.6,8.4];
  for(const [a,c] of [[SOUTH_ABUT-2,CABLE_START+2],[CABLE_END-2,BRIDGE_END+2]])strip('concrete',il,ir,-.7,-2.0,`igirder-${i}`,{a,c});
 }
 strip('concrete',-16.0,16.0,-.2,'ground','fill-south',{a:FILL_ENDS[0],c:SOUTH_ABUT,cols:DECK_COLS});
 strip('concrete',-16.0,16.0,-.2,'ground','fill-north',{a:BRIDGE_END,c:FILL_ENDS[1],cols:DECK_COLS});
 for(const [i,sg] of sides){
  const [l,r]=ROAD_EDGES[i];
  strip('asphalt',l,r,0,0,`pavement-${i}`,{thin:true});
  const [pl,pr]=sg<0?[-PARAPET[1],-PARAPET[0]]:PARAPET,[cl,cr]=sg<0?[-CURB[1],-CURB[0]]:CURB;
  strip('concrete',pl,pr,1.1,-.2,`parapet-${i}`,{fade:25});
  strip('concrete',cl,cr,.25,-.2,`curb-${i}`,{fade:25});
  strip('concrete',sg<0?-MEDIAN:0,sg<0?0:MEDIAN,1.07,-.2,`median-${i}`,{fade:25,sd:i});
  if(near){
   // Edge lines (yellow inside, white outside) and 3 m dashes every 12 m, clear of the landing tapers.
   const lane=d=>[d-.08,d+.08];
   for(const [d,mat] of [[sg*1.9,'yellow'],[sg*12.9,'paint']])strip(mat,...lane(d).sort((u,v)=>u-v),.04,0,undefined,{a:TAPER+5,c:L-TAPER-5,thin:true});
   for(const d of [sg*5.56,sg*9.22]){
    const [l2,r2]=lane(d).sort((u,v)=>u-v),byChunk=new Map();
    for(let s=TAPER+5;s<L-TAPER-8;s+=12){const k=ck(s),q=byChunk.get(k)||byChunk.set(k,{s,pos:[]}).get(k);q.pos.push(...xyz(s,l2,h(s)+.04),...xyz(s,r2,h(s)+.04),...xyz(s+3,l2,h(s+3)+.04),...xyz(s+3,r2,h(s+3)+.04));}
    for(const {s,pos} of byChunk.values()){const idx=[];for(let v=0;v<pos.length/3;v+=4)idx.push(v,v+1,v+2,v+1,v+3,v+2);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,'paint',s);}
   }
  }
 }
 // Under the stayed spans, transverse floor beams frame into the edge girders.
 if(near)for(let s=CABLE_START+4;s<CABLE_END-2;s+=9){
  if(TOWERS.some(t=>Math.abs(s-t)<4))continue;
  box('concrete',s,0,h(s)-1.1,.5,29.2,.9);contact(`floorbeam-${s}`,[s,-14.6,h(s)-1.1],[s,14.6,h(s)-1.1],'girder-0','girder-1');
 }
 // Approach bents: two columns and a cap under the four girders; tall bents get a tie beam.
 for(const s of bentStations()){
  const top=h(s)-1.95,n=`bent-${s.toFixed(1)}`;
  for(const d of [-9,9]){
   prism('concrete',s,d,[[0,2.7,2.7],[top-1.0,2.4,2.4]],n+'-col',y=>clamp(y/top));
   contact(`${n}-col-${d}`,[s,d,0],[s,d,top-1.0],'ground',n+'-cap');
  }
  if(top>30){box('concrete',s,0,top*.5,1.6,18,1.8,n+'-tie',y=>clamp(y/top));contact(n+'-tie',[s,-9,top*.5],[s,9,top*.5],n+'-col',n+'-col');}
  box('concrete',s,0,top-1.0,2.4,31.0,2.1,n+'-cap');
  contact(n+'-cap',[s,-15,top],[s,15,top],near?'girder-0':'deck',near?'girder-1':'deck');
 }
 // Anchor piers at both ends of the stayed unit.
 for(const s of [CABLE_START,CABLE_END]){
  const top=h(s)-1.95,n=`anchor-${s.toFixed(0)}`;
  for(const d of [-11,11]){prism('concrete',s,d,[[0,5.0,4.0],[top-1.5,3.6,3.2]],n+'-col',y=>clamp(y/top));contact(`${n}-col-${d}`,[s,d,0],[s,d,top-1.5],'ground',n+'-cap');}
  box('concrete',s,0,top-1.25,4.0,31.4,2.6,n+'-cap');
  contact(n+'-cap',[s,-15,top],[s,15,top],near?'girder-0':'deck',near?'girder-1':'deck');
 }
 // Two H-pylons: flared legs on a shared pile cap, a crossbeam under the deck, two chevron struts.
 for(const [ti,t] of TOWERS.entries()){
  const hT=h(t),tower=`tower-${ti}`;
  box('concrete',t,0,1.75,18,48,3.5,`pilecap-${ti}`,0);
  for(const sg of [-1,1]){
   const leg=`leg-${ti}-${sg}`;
   prism('tower',t,sg*LEG_D,legLevels(hT),[tower,leg],y=>clamp(y/(hT-3)));
   contact(leg,[t,sg*LEG_D,0],[t,sg*LEG_D,TOWER_H],`pilecap-${ti}`,leg);
  }
  // Stay anchor blocks stepping up both faces of every leg (the serrated edge in the photographs).
  if(near)for(const sg of [-1,1])for(const dir of [-1,1])for(let i=0;i<STAY_COUNT;i++){
   const y=stayTop(i),across=2.8+(2.5-2.8)*(y-hT-1)/(TOWER_H-hT-1),along=4.4+(3.9-4.4)*(y-hT-1)/(TOWER_H-hT-1);
   box('tower',t+dir*(along/2+.15),sg*LEG_D,y-.3,.9,across-.5,1.8,`leg-${ti}-${sg}`);
  }
  slab(t,crossbeamShape(hT),0,5.0,`crossbeam-${ti}`,y=>clamp(y/(hT-3)));
  contact(`crossbeam-${ti}`,[t,-LEG_D,hT-3.45],[t,LEG_D,hT-3.45],`leg-${ti}--1`,`leg-${ti}-1`);
  for(const [k,y] of STRUTS.entries()){slab(t,STRUT_SHAPE,y,2.6,`strut-${ti}-${k}`);contact(`strut-${ti}-${k}`,[t,-18,y-1],[t,18,y-1],`leg-${ti}--1`,`leg-${ti}-1`);}
 }
 for(const ll of DOLPHINS){const q=p.bridgeLocal(...ll),g=new THREE.CylinderGeometry(9,9,5,near?16:10,1,false);g.translate(q.x,2.5,q.z);put(g,'concrete',p.projectBridge(q.x,q.z).s,'dolphin',0);}
 // The harps, one tube per cable, top in its pylon leg and foot in the parapet's anchor beam.
 for(const q of stays(detail)){
  const leg=`leg-${q.ti}-${q.sd}`,parapet=`parapet-${q.sd<0?0:1}`;
  bar('cable',q.top,q.foot,near?.13:.2,undefined,undefined,1,true,near?5:3);
  contact(`stay-${q.ti}-${q.sd}-${q.dir}-${q.i}`,q.top,q.foot,leg,parapet);
 }
 // Cobra-head lamps on the inner face of each parapet, arms reaching over the outer lane.
 for(const [k,s] of lampStations().entries())for(const [i,sg] of sides){
  const d=sg*14.65,y=h(s),n=`lamp-${s}-${i}`;
  // Far keeps every other standard as a pole and its lit head, without the arm.
  if(!near){if(k%2)continue;bar('rail',[s,d,y+.1],[s,d,y+10.5],.16,undefined,n,1,true,3);box('lamp',s,d,y+10.6,1.0,.6,.3,n+'-head');contact(n,[s,d,y+.1],[s,d,y+10.5],`curb-${i}`,n+'-head');continue;}
  bar('rail',[s,d,y+.1],[s,d,y+10.5],.12,undefined,n,1,true,6);
  box('rail',s,d-sg*1.3,y+10.45,.22,2.6,.22,n+'-arm');
  box('lamp',s,d-sg*2.9,y+10.4,1.0,.6,.3,n+'-head');
  contact(n,[s,d,y+.1],[s,d,y+10.45],`curb-${i}`,n+'-arm');
  contact(n+'-arm',[s,d,y+10.45],[s,d-sg*2.6,y+10.45],n,n+'-head');
 }
 const root=b.finish();
 // The exported fallback's landing pavement blends toward the map's road colour like the app's.
 root.traverse(mesh=>{if(!mesh.isMesh||mesh.material.name!=='asphalt')return;
  const pos=mesh.geometry.attributes.position,col=[];
  for(let i=0;i<pos.count;i++){const s=p.projectBridge(pos.getX(i),pos.getZ(i)).s,c=new THREE.Color(PALETTES.light.asphalt).lerp(new THREE.Color(0xf2f3f6),landingBlend(s));col.push(c.r,c.g,c.b);}
  mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(col,3));mesh.material.color.setHex(0xffffff);mesh.material.vertexColors=true;
 });
 if(audit)root.userData.audit={support,members};
 return root;
}
