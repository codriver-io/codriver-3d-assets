import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {PROFILE as p,L,HALF,MEDIAN,PARAPET,WEST_LAND,EAST_LAND,LANDING,EAST_FLAT,NAV_W,NAV_E,FIXED_STATIONS,RAMP_BENTS,GIRDER_END,
 EAST_PIER,PONTOONS,PONTOON_TOP,PONTOON_BOTTOM,FLOAT_START,FLOAT_END,GIRDER_SLAB,FLOAT_SLAB,SLAB_GAP,GIRDER_DEPTH,
 deckHeight,soffit,slabDepth,edgesAt,approachBlend,PATH_END,pathCentre,pathWidth,pathHeight} from './w-r-bennett-bridge-profile.js';
// Light-theme road colours the landing blends between, copied from the app's basemap (major-road
// surface and HD deck surface) so the generator needs no runtime import. Update if the basemap changes.
const LANDING_ROAD=0xf2f3f6,DECK_SURFACE=0xb4b8bf;
const POST_SPACING=9,GIRDERS=[-10.5,-3.5,3.5,10.5],BENT_COLUMNS=[-8,0,8],PIER_COLUMNS=[-6.5,6.5],POST_ROWS=[-8,0,8];
// Barriers start once the ramp has lifted them clear of the landing (blend 0.1).
const BARRIER_FROM=LANDING+12,BARRIER_TO=EAST_FLAT-12,PARAPET_H=.85,BARRIER_H=1.07,RAIL_Y=1.38,LAMP_H=11,LAMP_SPACING=50;
// Rows of posts under the slab: every 9 m on a pontoon, clear of the 0.5 m joints.
export const POST_STATIONS=(()=>{const out=[];for(let s=GIRDER_END+POST_SPACING;s<FLOAT_END-2;s+=POST_SPACING){if(PONTOONS.some(q=>s>q.start+2&&s<q.end-2))out.push(s);}return out;})();
// Where the posts become stubs; far closes that 0.55 m slot by deepening the slab.
export const STUB_START=POST_STATIONS.find(s=>deckHeight(s)-SLAB_GAP-FLOAT_SLAB+.1-PONTOON_TOP<1.2)-POST_SPACING/2;
const records=new WeakMap();
// Tests inspect the exact generated support triangles without exporting debug data into GLBs.
export const contactsFor=root=>records.get(root);
const clamp01=v=>Math.max(0,Math.min(1,v)),smoothEnd=s=>{const t=clamp01((PATH_END-s)/30);return t*t*(3-2*t);};
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...p.CHAMPLAIN,palette:PALETTES.light},detail),supports=new Map(),members=[];
 const lat=(()=>{const q=p.bridgePoint(0);return new THREE.Vector3(-q.tz,0,q.tx);})(),fwd=(()=>{const q=p.bridgePoint(0);return new THREE.Vector3(q.tx,0,q.tz);})();
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
 const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 const put=(g,mat,name,s=0,lift=1)=>{if(name){if(!supports.has(name))supports.set(name,[]);supports.get(name).push(g);}b.put(g,mat,chunk(s),lift);};
 function box(mat,s,d,y,len,w,h,name,lift=1){const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,name,s,lift);return g;}
 function column(mat,s,d,y0,y1,r,name,lift){const g=new THREE.CylinderGeometry(r,r,y1-y0,near?10:6,1,true),q=p.bridgePoint(s,d,(y0+y1)/2);g.translate(q.x,q.y,q.z);put(g,mat,name,s,lift);}
 function bar(mat,a,c,width,name,anchors){const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),axis=cv.clone().sub(av);
  const g=new THREE.BoxGeometry(width,axis.length(),width);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));
  g.translate(...av.clone().add(cv).multiplyScalar(.5).toArray());put(g,mat,name,(a[0]+c[0])/2);if(anchors)members.push({name,ends:[av.toArray(),cv.toArray()],supports:anchors});}
 const keys=[LANDING,BARRIER_FROM,BARRIER_TO,STUB_START,STUB_START+.01,WEST_LAND,WEST_LAND-1,EAST_LAND+1,PATH_END-30,WEST_LAND-1.5,NAV_W,NAV_E,GIRDER_END-.01,GIRDER_END,FLOAT_START,FLOAT_END,EAST_LAND,EAST_LAND+1.5,EAST_FLAT,PATH_END,PATH_END-40,L/3,2*L/3];
 function stations(start,end){const out=new Set([start,end]);
  for(let s=start;s<end;){const flat=s>760&&s<1060;s+=(flat?12:4)*(near?1:2);if(s<end)out.add(s);}
  for(const s of keys)if(s>start&&s<end)out.add(s);return [...out].sort((a,c)=>a-c);}
 // Loft a cross-section [[lateral, y, liftWeight?]...] along the alignment. Each section edge owns
 // its vertices (hard edges, smooth along the station); outward faces by the section centroid.
 function loft(mat,start,end,section,{closed=true,caps=closed,name=null,lift=null,attr=null}={}){
  const all=stations(start,end),parts=near?[0,1,2].map(k=>[L*k/3,L*(k+1)/3]):[[0,L]];
  for(const [from,to] of parts){const ss=all.filter(s=>s>=from&&s<=to);if(start<from&&end>from)ss.unshift(from);if(start<to&&end>to)ss.push(to);if(ss.length<2)continue;
   const secs=ss.map(section),n=secs[0].length,pos=[],idx=[],w=[],extra=[];
   const edges=closed?n:n-1;
   for(let j=0;j<edges;j++){const k=(j+1)%n,base=pos.length/3;
    for(let i=0;i<ss.length;i++){for(const v of [secs[i][j],secs[i][k]]){pos.push(...xyz(ss[i],v[0],v[1]));w.push(v[2]??1);if(attr)extra.push(attr(ss[i]));}}
    const c=secs[0].reduce((a,v)=>[a[0]+v[0]/n,a[1]+v[1]/n],[0,closed?0:-100]),a=secs[0][j],e=secs[0][k];
    let nd=e[1]-a[1],ny=-(e[0]-a[0]);if(nd*((a[0]+e[0])/2-c[0])+ny*((a[1]+e[1])/2-c[1])<0){nd=-nd;ny=-ny;}
    const out=lat.clone().multiplyScalar(nd).add(new THREE.Vector3(0,ny,0));
    for(let i=1;i<ss.length;i++){const p0=base+(i-1)*2,p1=p0+1,q0=base+i*2,q1=q0+1;
     const A=new THREE.Vector3(...pos.slice(p0*3,p0*3+3)),B=new THREE.Vector3(...pos.slice(p1*3,p1*3+3)),C=new THREE.Vector3(...pos.slice(q0*3,q0*3+3));
     const flip=B.clone().sub(A).cross(C.clone().sub(A)).dot(out)<0;
     if(flip)idx.push(p0,q0,p1,p1,q0,q1);else idx.push(p0,p1,q0,p1,q1,q0);}
   }
   if(caps)for(const [i,sign] of [[0,-1],[ss.length-1,1]]){if((sign<0&&ss[i]!==start)||(sign>0&&ss[i]!==end))continue;
    const base=pos.length/3,sec=secs[i];for(const v of sec){pos.push(...xyz(ss[i],v[0],v[1]));w.push(v[2]??1);if(attr)extra.push(attr(ss[i]));}
    const tri=THREE.ShapeUtils.triangulateShape(sec.map(v=>new THREE.Vector2(v[0],v[1])),[]);
    for(const [a,c,d] of tri){const A=new THREE.Vector3(...pos.slice((base+a)*3,(base+a)*3+3)),B=new THREE.Vector3(...pos.slice((base+c)*3,(base+c)*3+3)),C=new THREE.Vector3(...pos.slice((base+d)*3,(base+d)*3+3));
     if(B.clone().sub(A).cross(C.clone().sub(A)).dot(fwd)*sign<0)idx.push(base+a,base+d,base+c);else idx.push(base+a,base+c,base+d);}}
   const clean=[];for(let i=0;i<idx.length;i+=3){const P=[0,1,2].map(t=>new THREE.Vector3(...pos.slice(idx[i+t]*3,idx[i+t]*3+3)));if(P[1].sub(P[0]).cross(P[2].sub(P[0])).lengthSq()>1e-10)clean.push(idx[i],idx[i+1],idx[i+2]);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(clean);g.computeVertexNormals();
   if(attr)g.setAttribute('landingBlend',new THREE.Float32BufferAttribute(extra,1));
   put(g,mat,name,(ss[0]+ss.at(-1))/2,lift||1);
   if(!lift){const weights=g.attributes.bridgeLift;for(let i=0;i<w.length;i++)weights.setX(i,w[i]);}
  }
 }
 const y=s=>deckHeight(s),slabTop=s=>y(s)-SLAB_GAP;
 // Deck slab, wider than the pavement and tucked inside both parapets; the steel ramp's slab is
 // thin over its girders, the lower deck a deeper slab on posts.
 loft('concrete',WEST_LAND-1,EAST_LAND+1,s=>{const t=slabTop(s),bt=!near&&s>=STUB_START&&s<=FLOAT_END?PONTOON_TOP-.1:t-slabDepth(s);return [[-HALF+.25,t],[HALF-.25,t],[HALF-.25,bt],[-HALF+.25,bt]];},{name:'deck'});
 // Pavement: the carriageways only, landing-blended into the connected road colour.
 for(let side=0;side<2;side++){const cols=near?4:2;
  loft('asphalt',0,L,s=>{const [a,c]=edgesAt(s)[side];return Array.from({length:cols+1},(_,j)=>[a+(c-a)*j/cols,y(s)]);},{closed:false,name:'road',attr:approachBlend});}
 // Median jersey barrier and the road/path barrier: full height on the structure, gone at the landings.
 const jersey=(c,s,hw=.5)=>{const t=approachBlend(s),h=y(s);return near?[[c-hw,h-.55],[c+hw,h-.55],[c+hw*.6,h+.3*t],[c+hw*.24,h+BARRIER_H*t],[c-hw*.24,h+BARRIER_H*t],[c-hw*.6,h+.3*t]]:[[c-hw,h-.55],[c+hw,h-.55],[c+hw*.3,h+BARRIER_H*t],[c-hw*.3,h+BARRIER_H*t]];};
 loft('concrete',BARRIER_FROM,BARRIER_TO,s=>{const e=edgesAt(s);return jersey((e[0][1]+e[1][0])/2,s,Math.min(.5,(e[1][0]-e[0][1])/2+.1));},{name:'median'});
 loft('concrete',BARRIER_FROM,BARRIER_TO,s=>jersey(edgesAt(s)[1][1]+.25,s,.3),{name:'path-barrier'});
 // Shared path on the south side with its own curb height, ending on the mapped connections.
 const pathL=s=>pathCentre(s)-pathWidth(s)/2,pathR=s=>pathCentre(s)+pathWidth(s)/2;
 loft('concrete',0,PATH_END,s=>{const h=pathHeight(s);return [[pathL(s),h+.15],[pathR(s),h+.15],[pathR(s),h-.55],[pathL(s),h-.55]];},{name:'walkway'});
 // Outer parapets carry the deck fascia down past the slab; on the earth ramps they shrink to a kerb.
 const fascia=s=>s<WEST_LAND-1.5||s>EAST_LAND+1.5?.8:SLAB_GAP+slabDepth(s)+.15;
 const parapet=(side,s)=>{const t=side?Math.min(approachBlend(s),smoothEnd(s)):approachBlend(s),h=side?pathHeight(s)+.15:y(s),d=side?pathR(s):edgesAt(s)[0][0],o=side?1:-1,top=h+PARAPET_H*t;
  return [[d-o*.08,h-.55],[d,top],[d+o*PARAPET,top],[d+o*PARAPET,h-fascia(s)]];};
 for(const side of [0,1])loft('concrete',BARRIER_FROM,side?PATH_END-2:BARRIER_TO,s=>parapet(side,s),{name:'parapet'});
 // Embankments: earth ramps between the landings and the abutments, toes on grade (attachment 0).
 const fill=(s)=>{const e=edgesAt(s),h=y(s)-SLAB_GAP,ph=Math.min(h,pathHeight(s)-.2),l=e[0][0]-PARAPET,r=e[1][1]+.5,pl=pathL(s),pr=pathR(s)+PARAPET;
  return [[l-.3-1.5*Math.max(0,h),0,0],[l,h],[r,h],[pl,ph],[pr,ph],[pr+.3+1.5*Math.max(0,ph),0,0]];};
 loft('fill',LANDING,WEST_LAND-1.5,fill,{closed:false,name:'fill'});
 loft('fill',EAST_LAND+1.5,EAST_FLAT,fill,{closed:false,name:'fill'});
 for(const [s,sign] of [[WEST_LAND-1.5,1],[EAST_LAND+1.5,-1]]){const sec=fill(s);
  loft('concrete',Math.min(s,s+sign*.4),Math.max(s,s+sign*.4),()=>[...sec.map(v=>[v[0],v[1]]),[sec.at(-1)[0],-.01],[sec[0][0],-.01]].reverse(),{name:'wing-wall',lift:v=>v>.01?1:0});}
 // Abutment walls on grade under the deck ends.
 for(const s of [WEST_LAND,EAST_LAND]){const top=slabTop(s)-slabDepth(s)-(s<GIRDER_END?GIRDER_DEPTH:0)+.1;
  box('concrete',s+(s<L/2?-.5:.5),0,top/2-.5,2,2*HALF+.3,top+1,s<L/2?'abutment-west':'abutment-east',v=>v>-.4?clamp01((v+1)/(top+1)):0);}
 // Steel plate girders, abutment to the last ramp bent.
 for(const d of near?GIRDERS:[GIRDERS[0],GIRDERS.at(-1)]){loft('girder',WEST_LAND-1,GIRDER_END+1,s=>{const t=slabTop(s)-GIRDER_SLAB+.1,bt=slabTop(s)-GIRDER_SLAB-GIRDER_DEPTH;return [[d-.25,t],[d+.25,t],[d+.25,bt],[d-.25,bt]];},{name:'girder'});
  members.push({name:'girder-'+d,ends:[xyz(WEST_LAND-1,d,soffit(WEST_LAND)+.05),xyz(GIRDER_END+1,d,soffit(GIRDER_END+1)+.05)],supports:['abutment-west','cap-'+GIRDER_END]});}
 // Fixed west piers on pile caps: twin round columns under a tapered hammerhead.
 for(const s of FIXED_STATIONS){const top=soffit(s)+.12,capB=top-1.9,name='hammer-'+s.toFixed(1);
  loft('concrete',s-1.2,s+1.2,()=>[[-12,top],[12,top],[7.5,capB],[-7.5,capB]],{name,lift:1});
  box('concrete',s,0,-.1,4.2,18,1.8,'pilecap-'+s.toFixed(1),0);
  for(const d of PIER_COLUMNS){column('concrete',s,d,.8,capB+.2,1,null,v=>clamp01((v-.8)/(capB-.8)));
   members.push({name:'column-'+s.toFixed(1)+d,ends:[xyz(s,d,.8),xyz(s,d,capB+.2)],supports:['pilecap-'+s.toFixed(1),name]});}}
 // Pontoons: closed concrete boxes, bottoms below grade (never seen), joints left open.
 for(const q of PONTOONS){const sec=()=>[[-HALF,PONTOON_TOP],[HALF,PONTOON_TOP],[HALF,PONTOON_BOTTOM],[-HALF,PONTOON_BOTTOM]];
  loft('pontoon',q.start,q.end,sec,{name:'pontoon'});}
 // Ramp bents on the pontoons: three round columns under a cap beam.
 for(const s of RAMP_BENTS){const top=soffit(s)+.12,capB=top-1.4,name='cap-'+s;
  box('concrete',s,0,(top+capB)/2,2,23,top-capB,name);
  for(const d of BENT_COLUMNS){column('concrete',s,d,PONTOON_TOP-.1,capB+.1,.75,null);members.push({name:'bent-'+s+d,ends:[xyz(s,d,PONTOON_TOP),xyz(s,d,capB+.1)],supports:['pontoon',name]});}}
 // Posts: round where tall, square stubs on the floating string; far draws them all as boxes.
 for(const s of POST_STATIONS){const top=slabTop(s)-FLOAT_SLAB+.1,h=top-PONTOON_TOP;if(!near&&s>=STUB_START)continue;
  for(const d of POST_ROWS){if(h>1.2&&near)column('concrete',s,d,PONTOON_TOP-.1,top,.5,null);else box('concrete',s,d,(PONTOON_TOP-.1+top)/2,1,1,h+.1,null);
   members.push({name:'post-'+s.toFixed(1)+d,ends:[xyz(s,d,PONTOON_TOP),xyz(s,d,top-.05)],supports:['pontoon','deck']});}}
 // East transition span: a wall pier on a pile cap between the last pontoon and the abutment.
 {const top=slabTop(EAST_PIER)-FLOAT_SLAB+.1;box('concrete',EAST_PIER,0,(top-1)/2,1.4,22,top+1,'east-pier',v=>v>-.9?1:0);}
 // Railing on both outer parapets, posts every 6 m (near only).
 if(near){for(const side of [0,1]){const d=s=>side?pathR(s)+PARAPET/2:edgesAt(s)[0][0]-PARAPET/2,base=s=>(side?pathHeight(s)+.15:y(s))+PARAPET_H;
  const a=WEST_LAND+2,c=EAST_LAND-2;
  loft('rail',a,c,s=>{const h=base(s)+RAIL_Y-PARAPET_H;return [[d(s)-.05,h+.05],[d(s)+.05,h+.05],[d(s)+.05,h-.05],[d(s)-.05,h-.05]];},{name:'handrail'});
  const posts=[a];for(let s=a+6;s<c;s+=6)posts.push(s);posts.push(c);
  for(const s of posts)box('rail',s,d(s),base(s)+(RAIL_Y-PARAPET_H)/2,.08,.08,RAIL_Y-PARAPET_H+.1,'rail-post');
  members.push({name:'handrail-'+side,ends:[xyz(a,d(a),base(a)+RAIL_Y-PARAPET_H),xyz(c,d(c),base(c)+RAIL_Y-PARAPET_H)],supports:['rail-post','rail-post']});
  for(const s of [a,c])members.push({name:'rail-post-'+side+'-'+s,ends:[xyz(s,d(s),base(s)-.03),xyz(s,d(s),base(s)+RAIL_Y-PARAPET_H)],supports:['parapet','handrail']});}}
 // Davit lamp standards on both parapets, arms over the traffic lanes.
 for(let s=WEST_LAND+15;s<EAST_LAND-5;s+=LAMP_SPACING)for(const side of [0,1]){
  const d=side?pathR(s)+PARAPET/2:edgesAt(s)[0][0]-PARAPET/2,o=side?-1:1,b0=(side?pathHeight(s)+.15:y(s))+PARAPET_H,top=b0+LAMP_H,arm=near?2.6:2.2,head='lamp-head';
  bar('rail',[s,d,b0-.05],[s,d,top],near?.22:.3,'lamp-pole',['parapet','lamp-arm']);
  bar('rail',[s,d,top-.12],[s,d+o*arm,top+.25],.14,'lamp-arm',['lamp-pole','lamp-head']);
  box('lamp',s,d+o*(arm+.25),top+.2,.4,.75,.22,head);}
 // Lane paint (near only), on the structure: yellow median lines, white edges and dashes.
 if(near){const line=(mat,d,len=null)=>{const a=WEST_LAND+2,c=EAST_LAND-2;
   if(!len){loft(mat,a,c,s=>[[d-.07,y(s)+.1],[d+.07,y(s)+.1]],{closed:false});return;}
   for(let s=a+3;s<c-3;s+=12){const q=[[-len/2,-.07],[len/2,-.07],[len/2,.07],[-len/2,.07]].map(([u,v])=>xyz(s+u,d+v,y(s+u)+.1)),g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(q.flat(),3));g.setIndex([0,2,1,0,3,2]);g.computeVertexNormals();if(g.attributes.normal.getY(0)<0)g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,mat,null,s);}};
  line('stripe',-1.05);line('stripe',.45);line('paint',-11.65);line('paint',7.75);
  for(const d of [-4.5,-7.9,3.95])line('paint',d,3);}
 const root=b.finish();
 root.traverse(mesh=>{if(!mesh.isMesh||mesh.material.name!=='asphalt')return;const blend=mesh.geometry.attributes.landingBlend,colors=[],land=new THREE.Color(LANDING_ROAD),deck=new THREE.Color(DECK_SURFACE);
  for(let i=0;i<blend.count;i++)colors.push(...land.clone().lerp(deck,blend.getX(i)).toArray());
  mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));mesh.material.color.setHex(0xffffff);mesh.material.vertexColors=true;});
 records.set(root,{supports,members});return root;
}
