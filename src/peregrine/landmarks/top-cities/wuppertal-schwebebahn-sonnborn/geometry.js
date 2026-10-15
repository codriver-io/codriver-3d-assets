import * as THREE from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {point,railHeight,SUPPORTS,STATION,STATION_RINGS,local} from './wuppertal-schwebebahn-sonnborn-alignment.js';

export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),supports={},contacts=[],counts={};
 function put(g,mat,name){g.deleteAttribute('uv');g=mergeVertices(g);const start=counts[mat]||0,count=g.index?.count||g.attributes.position.count; if(name)supports[name]={mesh:`${SPEC.id}-0-${mat}`,start,count}; counts[mat]=start+count;b.put(g,mat);}
 function box(mat,s,d,y,l,w,h,name){const a=point(s),c=point(s+.01),g=new THREE.BoxGeometry(l,h,w);g.rotateY(-Math.atan2(c[2]-a[2],c[0]-a[0]));g.translate(...point(s,d,y));put(g,mat,name);}
 function bar(mat,a,c,w,name,u,v){const av=new THREE.Vector3(...a),dir=new THREE.Vector3(...c).sub(av),g=new THREE.BoxGeometry(w,dir.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize()));g.translate(...av.addScaledVector(dir,.5).toArray());put(g,mat,name);if(u&&v)contacts.push({name,a,c,supports:[u,v]});}
 // Closed paired running girders. Each is one rail for one suspended direction.
 // Every panel has diaphragms and nodes, so diagonals land on real intersections.
 // Sonnborn street portals: vertical kerb legs, 4.6 m rounded shoulders,
 // and a crown carrying the guideway. The two western approach frames retain
 // their splayed legs beyond the motorway street corridor.
 function shoulder(s,side,h,name){
  const n=6,cy=h-4.1;
  function curve(radius,reverse=false){const a=Array.from({length:n+1},(_,j)=>{const t=j*Math.PI/(2*n);return new THREE.Vector2(side*(3.4+radius*Math.cos(t)),cy+radius*Math.sin(t));});return reverse?a.reverse():a;}
  function band(inner,outer,depth,label,holes=false){
   const shape=new THREE.Shape([...curve(outer),...curve(inner,true)]);
   if(holes)for(let j=0;j<n;j++){
    const t=(j+.5)*Math.PI/(2*n),dt=Math.PI/(2*n)*.32;
    const p=(r,a)=>new THREE.Vector2(side*(3.4+r*Math.cos(a)),cy+r*Math.sin(a));
    // Triangular openings leave radial/diagonal lattice webs between flanges.
    shape.holes.push(new THREE.Path([p(4.36,t-dt),p(4.84,t),p(4.36,t+dt)]));
   }
   const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:1});
   // Shape XY is transverse/up. Extrusion is the longitudinal frame depth.
   const a=point(s),v=point(s+.01),angle=Math.atan2(v[2]-a[2],v[0]-a[0]);
   g.translate(0,0,-depth/2);g.rotateY(-Math.PI/2-angle);g.translate(a[0],0,a[2]);put(g,'steel',label);
  }
  band(4.2,5,.22,name,near);
  if(near){band(4.13,4.3,.85,`${name}-inner-flange`);band(4.9,5.07,.85,`${name}-outer-flange`);}
  // Each shoulder meets the leg web and guideway cap at both cut ends.
  contacts.push({name,a:point(s,side*8,cy),c:point(s,side*3.4,h+.5),supports:[`leg-top-${name.split('-')[1]}-${side}`,`cap-${name.split('-')[1]}`]});
 }
 SUPPORTS.forEach((s,i)=>{
  const h=railHeight(s),cap=`cap-${i}`,street=point(s)[0]>-352;
  box('steel',s,0,h+.5,1,7.8,.8,cap);
  for(const side of [-1,1]){
   const foot=`foot-${i}-${side}`,top=`leg-top-${i}-${side}`;
   box('concrete',s,side*8,.3,2.3,2.3,.6,foot);
   const d=street?8:3.4,y=street?h-4.1:h+1.1;
   box('steel',s,side*d,y,.9,.9,.7,top);
   const a=point(s,side*8,.6),c=point(s,side*d,y);
   // A tapered 0.85 m deep box leg reads at driving distance, with a narrower toe.
   const av=new THREE.Vector3(...a),dir=new THREE.Vector3(...c).sub(av),g=new THREE.BoxGeometry(.85,dir.length(),.85);
   for(let k=0;k<g.attributes.position.count;k++)if(g.attributes.position.getY(k)<0){g.attributes.position.setX(k,g.attributes.position.getX(k)*.7);g.attributes.position.setZ(k,g.attributes.position.getZ(k)*.7);}
   g.computeVertexNormals();g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize()));g.translate(...av.addScaledVector(dir,.5).toArray());put(g,'steel',`leg-${i}-${side}`);
   contacts.push({name:`leg-${i}-${side}`,a,c,supports:[foot,top]});
   if(street)shoulder(s,side,h,`shoulder-${i}-${side}`);
  }
 });
 for(let i=1;i<SUPPORTS.length;i++){
  const a=SUPPORTS[i-1],c=SUPPORTS[i],n=Math.ceil((c-a)/(near?9:18)),nodes=[];
  for(let j=0;j<=n;j++){
   const s=a+(c-a)*j/n,h=railHeight(s),name=`joist-${i}-${j}`;
   box('steel',s,0,h+.25,.35,7.1,.5,name); nodes.push({s,h,name});
   for(const d of [-3.3,3.3])box('steel',s,d,h+1.8,.45,.45,.45,`upper-${i}-${j}-${d}`);
   // Under-running I rail: the narrow iron flange sits below the green beam.
   for(const d of [-2.05,2.05]){
    if(j<n){const t=a+(c-a)*(j+.5)/n,hh=railHeight(t);box('iron',t,d,hh-.25,(c-a)/n+.015,.38,.45,`rail-${i}-${j}-${d}`);}
   }
  }
  for(let j=1;j<nodes.length;j++){
   const p=nodes[j-1],q=nodes[j];
   for(const d of [-3.3,3.3]){
    bar('steel',point(p.s,d,p.h+.25),point(q.s,d,q.h+.25),.30,`bottom-${i}-${j}-${d}`,p.name,q.name);
    const u=`upper-${i}-${j-1}-${d}`,v=`upper-${i}-${j}-${d}`;
    bar('steel',point(p.s,d,p.h+1.8),point(q.s,d,q.h+1.8),.25,`upper-chord-${i}-${j}-${d}`,u,v);
    bar('steel',point(p.s,d,p.h+.25),point(p.s,d,p.h+1.8),.16,`upright-${i}-${j}-${d}`,p.name,u);
    const up=j%2===0;
    bar('steel',point(p.s,d,p.h+(up?1.8:.25)),point(q.s,d,q.h+(up?.25:1.8)),near?.16:.20,`web-${i}-${j}-${d}`,up?u:p.name,up?q.name:v);
   }
   // Transverse upper links keep both independent rails in one trestle frame.
   if(near||j%2===0)bar('steel',point(p.s,-3.3,p.h+1.8),point(p.s,3.3,p.h+1.8),.16,`tie-${i}-${j}`,`upper-${i}-${j-1}--3.3`,`upper-${i}-${j-1}-3.3`);
   for(const d of [-2.05,2.05]){
    // Main green rail web sits directly on the joist and iron running flange.
    bar('steel',point(p.s,d,p.h+.13),point(q.s,d,q.h+.13),.45,`girder-${i}-${j}-${d}`,p.name,q.name);
    contacts.push({name:`rail-${i}-${j-1}-${d}`,a:point(p.s,d,p.h-.06),c:point(q.s,d,q.h-.06),supports:[p.name,q.name]});
   }
  }
 }
 // Low, shallow pitched platform canopies, 30 m operator platform length.
 // Open central train slots and continuous road undercroft remain negative space.
 for(const side of [-1,1]){
  const d=side*4.9;
  box('steel',STATION,d,7.55,30,2.8,.55,`platform-${side}`);
  box('roof',STATION,d,11.95,31,3.2,.48,`canopy-${side}`);
  if(near)for(const s of [STATION-10,STATION,STATION+10])box('light',s,d,11.57,3,.35,.25);
  for(let j=0;j<=10;j++){
   const s=STATION-15+j*3;
   box('steel',s,side*6.15,9.7,.18,.24,3.8,`station-post-${side}-${j}`);
   if(j<10)box('glass',s+1.5,side*5.35,9.7,2.70,.16,3.60);
  }
  for(const s of [STATION-15,STATION,STATION+15]){
   box('steel',s,side*5.8,3.7,.55,.6,7.4,`station-foot-${side}-${s}`);
   bar('steel',point(s,side*5.8,7.4),point(s,d,7.55),.5,`platform-brace-${side}-${s}`,`station-foot-${side}-${s}`,`platform-${side}`);
  }
 }
 // Station end portal arches: segmented solid webs, matching the curved Sonnborn portals.
 for(const s of [STATION-15,STATION+15]){
  box('steel',s,0,12.9,.8,7.5,.8,`portal-crown-${s}`);
  for(const side of [-1,1]){
   box('steel',s,side*6.5,4.2,.7,.7,8.4,`portal-leg-${s}-${side}`);
   let prev=point(s,side*6.5,8.4),prior=`portal-leg-${s}-${side}`;
   for(let j=1;j<=5;j++){
    const t=j*Math.PI/10,d=side*(3.3+3.2*Math.cos(t)),y=8.4+4.5*Math.sin(t),node=`portal-node-${s}-${side}-${j}`;
    box('steel',s,d,y,.8,.8,.8,node);
    bar('steel',prev,point(s,d,y),.7,`portal-arc-${s}-${side}-${j}`,prior,node);prev=point(s,d,y);prior=node;
   }
  }
 }
 // Indoor lift shafts follow their exact provider rings, separate from adjacent shops.
 for(let i=1;i<STATION_RINGS.length;i++){
  const ring=STATION_RINGS[i].slice(0,-1).map(local),shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
  const g=new THREE.ExtrudeGeometry(shape,{depth:8,bevelEnabled:false});g.rotateX(-Math.PI/2);put(g,'concrete',`elevator-${i}`);
 }
 // Narrow external stair flights fit the north/south spurs of station way 198459753.
 for(const side of [-1,1]){
  const s=STATION+(side===1?5:-5);
  for(let i=0;i<22;i++)box('concrete',s,side*(7+i*.22),7.3-i*.33,2.2,.25,.34);
  box('concrete',s,side*7,7.4,2.2,2,.3,`stair-landing-${side}`);
  box('concrete',s,side*11.7,.15,2.6,1,.3,`stair-foot-${side}`);
  for(const off of [-.9,.9])bar('concrete',point(s+off,side*7,7.25),point(s+off,side*11.7,.3),.3,`stair-stringer-${side}-${off}`,`stair-landing-${side}`,`stair-foot-${side}`);
 }
 // One stationary modern blue suspended train; no wheels on the ground.
 const cs=STATION+56,cd=2.05,ch=railHeight(cs);
 for(let k=0;k<3;k++){
  const s=cs+(k-1)*7.8;
  box('car',s,cd,ch-3.4,7.5,2.3,1.15,`car-base-${k}`);
  for(let j=0;j<4;j++)box(j%3===0?'light':'window',s-2.7+j*1.8,cd,ch-2.3,1.67,2.3,1.05,`car-glazing-${k}-${j}`);
  box('car',s,cd,ch-1.65,7.5,2.3,.25,`car-roof-${k}`);
  for(let j=0;j<=4;j++)box('car',s-3.6+j*1.8,cd,ch-2.3,.13,2.42,1.05);
  for(const end of [-1,1]){
   const t=s+end*2.4,n=`bogie-${k}-${end}`;
   box('iron',t,cd,ch-.55,.9,.8,.7,n);
   // Hangers meet a bogie and the continuous car roof. These are gravity contacts.
   bar('iron',point(t,cd,ch-.7),point(t,cd,ch-1.53),.25,`hanger-${k}-${end}`,n,`car-roof-${k}`);
  }
 }
 const root=b.finish();root.userData.supports=supports;root.userData.contacts=contacts;root.userData.platformLength=30;root.userData.railDirections=2;return root;
}
