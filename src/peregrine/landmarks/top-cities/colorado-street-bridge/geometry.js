import * as THREE from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {assetBuilder} from '../../asset-geometry.js';
import {PALETTES} from './config.js';
import {PROFILE as p,L,START,END,HALF,ROAD_HALF,DECK,ARCHES,PIERS,END_BAY,archTop,authorDeck,edgesAt,approachBlend,FORK} from './colorado-street-bridge-profile.js';
const records=new WeakMap();
export const contactsFor=root=>records.get(root);
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...p.CHAMPLAIN,palette:PALETTES.light},detail),supports=new Map(),members=[];
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
 const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 const weight=y=>Math.max(0,Math.min(1,y/DECK));
 function put(g,mat,s,name,lift=1,attr=null){if(name){const arr=supports.get(name)||[];arr.push(g);supports.set(name,arr);}g.deleteAttribute('uv');const welded=mergeVertices(g,1e-5);b.put(welded,mat,chunk(s),lift);if(attr)welded.setAttribute('landingBlend',new THREE.Float32BufferAttribute(attr,1));}
 function box(mat,s,d,y,len,w,h,name,lift=1){const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,s,name,lift);}
 function bar(mat,a,c,w,name,anchors){const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),delta=cv.clone().sub(av),g=new THREE.BoxGeometry(w,delta.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));g.translate(...av.clone().add(cv).multiplyScalar(.5).toArray());put(g,mat,(a[0]+c[0])/2,name);if(anchors)members.push({name,ends:[av.toArray(),cv.toArray()],supports:anchors});}
 function stations(a,c,step=near?5:16){const ss=new Set([a,c]);for(let s=a+step;s<c;s+=step)ss.add(s);for(const v of p.ALIGNMENT)if(v.s>a&&v.s<c)ss.add(v.s);for(const s of [L/3,2*L/3,START,END,FORK,L-12,12])if(s>a&&s<c)ss.add(s);return [...ss].sort((x,y)=>x-y);}
 // Closed section loft with individually normaled section edges; normal orientation is checked
 // against each local lateral/up direction. The curve is geographic, not a rotated straight beam.
 function loft(mat,a,c,section,{name,closed=true,lift=1,landing=false,step}={}){
  const all=stations(a,c,step),parts=near?[[0,L/3],[L/3,2*L/3],[2*L/3,L]]:[[0,L]];
  for(const [low,high] of parts){const from=Math.max(a,low),to=Math.min(c,high);if(to<=from)continue;const ss=[from,...all.filter(s=>s>from&&s<to),to],secs=ss.map(section),n=secs[0].length,pos=[],idx=[],blend=[];
   const edges=closed?n:n-1;
   for(let e=0;e<edges;e++){const f=(e+1)%n,base=pos.length/3;
    for(let i=0;i<ss.length;i++)for(const v of [secs[i][e],secs[i][f]]){pos.push(...xyz(ss[i],v[0],v[1]));blend.push(approachBlend(ss[i]));}
    for(let i=0;i<ss.length-1;i++){
     const ids=[base+2*i,base+2*i+1,base+2*i+2,base+2*i+3],q=p.bridgePoint((ss[i]+ss[i+1])/2),sec=secs[i],cent=sec.reduce((v,w)=>[v[0]+w[0]/n,v[1]+w[1]/n],[0,0]);
     const A=new THREE.Vector3(...pos.slice(ids[0]*3,ids[0]*3+3)),B=new THREE.Vector3(...pos.slice(ids[1]*3,ids[1]*3+3)),C=new THREE.Vector3(...pos.slice(ids[2]*3,ids[2]*3+3));
     const a0=sec[e],a1=sec[f],out=closed?new THREE.Vector3(-q.tz*((a0[0]+a1[0])/2-cent[0]),(a0[1]+a1[1])/2-cent[1],q.tx*((a0[0]+a1[0])/2-cent[0])):new THREE.Vector3(0,1,0);
     if(B.sub(A).cross(C.sub(A)).dot(out)>0)idx.push(ids[0],ids[1],ids[2],ids[1],ids[3],ids[2]);else idx.push(ids[0],ids[2],ids[1],ids[1],ids[2],ids[3]);
    }
   }
   if(closed)for(const [i,sign] of [[0,-1],[ss.length-1,1]]){if((sign<0&&from!==a)||(sign>0&&to!==c))continue;const sec=secs[i],base=pos.length/3,q=p.bridgePoint(ss[i]);for(const v of sec){pos.push(...xyz(ss[i],v[0],v[1]));blend.push(approachBlend(ss[i]));}
    for(const tri of THREE.ShapeUtils.triangulateShape(sec.map(v=>new THREE.Vector2(...v)),[])){const [ia,ib,ic]=tri.map(v=>v+base),A=new THREE.Vector3(...pos.slice(ia*3,ia*3+3)),B=new THREE.Vector3(...pos.slice(ib*3,ib*3+3)),C=new THREE.Vector3(...pos.slice(ic*3,ic*3+3));const norm=B.sub(A).cross(C.sub(A));if((norm.x*q.tx+norm.z*q.tz)*sign>0)idx.push(ia,ib,ic);else idx.push(ia,ic,ib);}}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,(from+to)/2,name,lift,landing?blend:null);
  }
 }
 function prism(mat,points,s,d,width,name,lift=weight){const shape=new THREE.Shape();shape.moveTo(...points[0]);for(const q of points.slice(1))shape.lineTo(...q);shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth:width,steps:1,bevelEnabled:false,curveSegments:1});g.translate(0,0,-width/2);const a=g.attributes.position;for(let i=0;i<a.count;i++){const q=p.bridgePoint(s+a.getX(i),d+a.getZ(i),a.getY(i));a.setXYZ(i,q.x,q.y,q.z);}g.computeVertexNormals();put(g,mat,s,name,lift);}
 // Authored pavement is two continuous ribbons, opening around the mapped east fork.
 for(let side=0;side<2;side++)loft('asphalt',0,L,s=>{const [a,c]=edgesAt(s)[side];return [[a,authorDeck(s)],[c,authorDeck(s)]];},{closed:false,name:'pavement',landing:true});
 loft('concrete',START,END,s=>[[-HALF,DECK-.22],[HALF,DECK-.22],[HALF,DECK-1.02],[-HALF,DECK-1.02]],{name:'deck'});
 for(const side of [0,1]){
  const edge=s=>edgesAt(s)[side][side?1:0],o=side?1:-1;
  loft('concrete',0,L,s=>{const w=.8+.724*approachBlend(s),d=edge(s),y=authorDeck(s);return [[d,y+.17],[d+o*w,y+.17],[d+o*w,y-.25],[d,y-.25]];},{name:'walkway-'+side});
  // Low balustrade, moulded cornice and attached tall safety fence, matching the restored bridge.
  const from=START-32,to=END+32,railD=s=>edge(s)+o*(.8+.724*approachBlend(s)-.12),h=s=>authorDeck(s);
  loft('concrete',from,to,s=>{const d=railD(s);return [[d-.19,h(s)+.17],[d+.19,h(s)+.17],[d+.19,h(s)+.63],[d-.19,h(s)+.63]];},{name:'parapet-'+side});
  loft('concrete',from,to,s=>{const d=railD(s);return [[d-.24,h(s)+.63],[d+.24,h(s)+.63],[d+.24,h(s)+.83],[d-.24,h(s)+.83]];},{name:'coping-'+side});
  const posts=stations(from,to,near?3.5:9);
  for(const s of posts){box('iron',s,railD(s),h(s)+1.61,.11,.11,1.56,'fence-post-'+side);}
  if(near)for(let s=from+1.25;s<to;s+=1.25)box('iron',s,railD(s),h(s)+1.61,.045,.045,1.56,'fence-infill');
  // Far lower rail underside clears the coping underside by >0.5 m, avoiding a depth cycle.
  for(const off of [near?1.12:1.23,2.37]){loft('iron',from,to,s=>{const d=railD(s),y=h(s)+off;return [[d-.05,y-.05],[d+.05,y-.05],[d+.05,y+.05],[d-.05,y+.05]];},{name:'fence-rail-'+side});members.push({name:'fence-rail-'+side+'-'+off,ends:[xyz(from,railD(from),h(from)+off),xyz(to,railD(to),h(to)+off)],supports:['fence-post-'+side,'fence-post-'+side]});}
  // Each fence end is carried by an endpoint post seated directly on the coping.
  
 }
 // Ten tall paired pier blades with stepped bases and flared caps.
 for(let i=0;i<PIERS.length;i++){const s=PIERS[i];for(const d of [-4.35,4.35]){
  box('substructure',s,d,.55,5.0,2.4,1.1,'foot-'+i,0);
  prism('substructure',[[-2.2,1.05],[2.2,1.05],[1.25,DECK-2.0],[1.8,DECK-1.0],[-1.8,DECK-1.0],[-1.25,DECK-2.0]],s,d,1.3,'pier-'+i);
  // The relief is an actual inset panel cut by frame bars, never a coplanar colour patch.
  if(near)for(const t of [-1,1])box('substructure',s+t*.95,d+(d>0?.74:-.74),24,.18,.18,31,'pier-frame',weight);
 }}
 const ribLat=[-4.35,4.35];
 for(const a of ARCHES){
  const n=near?32:16;
  for(const d of ribLat){const pts=[];for(let k=0;k<=n;k++){const s=a.start+a.span*k/n;pts.push([s-a.mid,archTop(a,s)]);}for(let k=n;k>=0;k--){const s=a.start+a.span*k/n;pts.push([s-a.mid,archTop(a,s)-1.6]);}
   prism('substructure',pts,a.mid,d,1.22,'arch-'+a.i);
   members.push({name:'arch-'+a.i+'-'+d,ends:[xyz(a.start,d,a.spring-.6),xyz(a.end,d,a.spring-.6)],supports:['pier-'+a.i,'pier-'+(a.i+1)]});
  }
  // Spandrel columns meet the arch ring and the little arched lintels under the deck.
  const bays=Math.max(4,Math.round(a.span/5.8)),arcadeSpring=DECK-1.5-(a.span/bays+.68)/2,ss=Array.from({length:bays+1},(_,j)=>a.start+a.span*j/bays);
  for(const d of ribLat){
   for(let j=0;j<ss.length;j++){const s=ss[j],bottom=archTop(a,s)-.18,top=arcadeSpring+.15;
    if(top>bottom+.25){box('substructure',s,d,(bottom+top)/2,.65,1.05,top-bottom,'spandrel-'+a.i,weight);
     members.push({name:'spandrel-'+a.i+'-'+d+'-'+j,ends:[xyz(s,d,bottom+.1),xyz(s,d,top-.04)],supports:['arch-'+a.i,'lintel-'+a.i]});}}
   for(let j=0;j<ss.length-1;j++){const u=ss[j]-.34,v=ss[j+1]+.34,mid=(u+v)/2,pts=[[u-mid,DECK-1.0],[v-mid,DECK-1.0]];
    for(let k=0;k<= (near?8:6);k++){const t=k/(near?8:6),s=v+(u-v)*t,curve=arcadeSpring+((v-u)/2)*Math.sqrt(Math.max(0,1-((s-mid)/((v-u)/2))**2));pts.push([s-mid,Math.max(curve,archTop(a,Math.max(a.start,Math.min(a.end,s)))-.2)]);}
    prism('substructure',pts,mid,d,1.1,'lintel-'+a.i);
   }
  }
  // Cross struts between the paired ribs: exposed underside rhythm in both LODs.
  for(const t of near?[.18,.38,.62,.82]:[.25,.75]){const s=a.start+a.span*t,y=archTop(a,s)-.65;box('substructure',s,0,y,.7,9.0,.75,'cross-strut',weight);members.push({name:'cross-strut-'+a.i+'-'+t,ends:[xyz(s,-4.35,y),xyz(s,4.35,y)],supports:['arch-'+a.i,'arch-'+a.i]});}
 }
 // Three small round-headed openings in each abutment group; terminal walls extend to their locally fitted ground.
 for(const [a,c,idx] of [[START,START+END_BAY,0],[END-END_BAY,END,1]]){
  const wall=4.0,span=(c-a-wall)/3;
  for(const d of ribLat){for(let j=0;j<4;j++){const s=a+wall/2+j*span;box('substructure',s,d,DECK/2,wall,1.3,DECK-1.0,'abutment-'+idx,weight);}
   for(let j=0;j<3;j++){const u=a+wall/2+j*span+wall/2-.15,v=u+span-wall+.3,mid=(u+v)/2,pts=[[u-mid,DECK-1],[v-mid,DECK-1]];for(let k=0;k<=(near?10:5);k++){const t=k/(near?10:5),s=v+(u-v)*t;pts.push([s-mid,DECK-5.5+3.2*Math.sin(Math.PI*t)]);}prism('substructure',pts,mid,d,1.3,'abutment-'+idx);}
  }
 }
 // Paired semicircular overlooks and five-globe Beaux-Arts standards on masonry pedestals.
 const lampStations=[START+3,...PIERS.slice(1,-1),END-3];
 for(const s of lampStations)for(const side of [-1,1]){
  const d=side*(HALF-.18),y=DECK+.17;
  box('concrete',s,d,y+.83,1.1,.86,1.66,'lamp-base');
  if(near){const sh=new THREE.Shape();sh.moveTo(-1.6,0);for(let k=0;k<=12;k++){const t=Math.PI*k/12;sh.lineTo(1.6*Math.cos(t),side*1.25*Math.sin(t));}sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:.38,bevelEnabled:false});g.rotateX(-Math.PI/2);const p0=p.bridgePoint(s,d,y-.2);g.rotateY(-Math.atan2(p0.tz,p0.tx));g.translate(p0.x,p0.y,p0.z);put(g,'concrete',s,'alcove');
   // Curved stone ledge follows the overlook, with real negative space above its floor.
   for(let k=0;k<10;k++){const t=Math.PI*(k+.5)/10,ds=1.48*Math.cos(t),dd=side*1.17*Math.sin(t);box('concrete',s+ds,d+dd,y+.43,.51,.34,.86,'alcove-parapet');}}
  const stemTop=y+4.55;
  bar('iron',[s,d,y+1.66],[s,d,stemTop],near?.15:.21,'lamp-stem',['lamp-base','lamp-crown']);
  box('iron',s,d,stemTop,.36,.36,.30,'lamp-crown');
  const bulbs=near?[[0,0,.65,.32],[-.64,0,.07,.25],[.64,0,.07,.25],[0,-.54,-.1,.23],[0,.54,-.1,.23]]:[[0,0,.65,.36],[-.64,0,.07,.3],[.64,0,.07,.3]];
  for(const [ds,dd,dy,r] of bulbs){const by=stemTop+dy;bar('iron',[s,d,stemTop],[s+ds,d+dd,by-r+.08],.10,'lamp-arm',['lamp-crown','globe']);const g=new THREE.SphereGeometry(r,near?8:6,near?6:4);g.translate(...xyz(s+ds,d+dd,by));put(g,'lamp',s,'globe');}
 }
 if(near)for(const d of [-.16,.16])loft('stripe',START+1,END-1,s=>[[d-.045,DECK+.11],[d+.045,DECK+.11]],{closed:false});
 const root=b.finish();records.set(root,{supports,members});return root;
}
