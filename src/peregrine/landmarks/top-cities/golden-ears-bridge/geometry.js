import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p,L,TOWERS,MAIN_START,MAIN_END,DECK_H,TOWER_H,HALF_WIDTH,LANDING,CURVE,TAPER,approachBlend,edgesAt,PATH_START,PATH_STATIONS,pathCentre,pathWidth,pathHeight } from './golden-ears-bridge-profile.js';

// Audit records identify the exact support triangle range after material/chunk merging.
// Tests use these ranges, excluding the cable/member mesh itself.
export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder(p,detail),xyz=b.xyz,h=p.deckHeight;
 const ck=s=>near?Math.min(3,Math.floor(s/L*4)):0;
 const clamp=y=>Math.max(0,Math.min(1,y));
 const totals=new Map(),supports={},contacts=[];
 function put(g,mat,s=0,lift=1,name=null){
  const chunk=ck(s),key=chunk+':'+mat;
  if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));
  const start=totals.get(key)||0;
  if(name)supports[name]={mesh:'golden-ears-bridge-'+chunk+'-'+mat,start,count:g.index.count};
  totals.set(key,start+g.index.count);b.put(g,mat,chunk,lift);
 }
 function box(mat,s,d,y,len,w,ht,name=null,lift=1){
  const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,ht,w);
  g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,s,lift,name);
 }
 function member(mat,A,B,width,s,name=null,lift=1){
  const a=new THREE.Vector3(...xyz(...A)),c=new THREE.Vector3(...xyz(...B)),axis=c.clone().sub(a);
  const g=new THREE.CylinderGeometry(width,width,axis.length(),near?6:3,1,false);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));
  g.translate(...a.add(c).multiplyScalar(.5).toArray());put(g,mat,s,lift,name);
 }
 function contact(name,A,B,aSupport,bSupport){contacts.push({name,a:xyz(...A),b:xyz(...B),supports:[aSupport,bSupport]});}
 // Closed ribbons, sampled at all alignment and vertical-curve controls, chunked by station.
 function strip(mat,a,c,left,right,offset=0,thickness=0,name=null,lift=1){
  for(let from=a;from<c-1e-5;){
   const to=near?Math.min(c,(Math.floor((from+.001)/(L/4))+1)*L/4):c,set=new Set([from,to]);
   for(let s=Math.ceil(from/(near?8:18))*(near?8:18);s<to;s+=near?8:18)set.add(s);
   for(const s of [0,TAPER,L-TAPER,...PATH_STATIONS,LANDING,LANDING+CURVE,MAIN_START-CURVE,MAIN_START,MAIN_END,MAIN_END+CURVE,L-LANDING-CURVE,L-LANDING])if(s>from&&s<to)set.add(s);
   for(const v of p.ALIGNMENT)if(v.s>from&&v.s<to)set.add(v.s);
   const ss=[...set].sort((a,c)=>a-c),pos=[],idx=[],stride=thickness?4:2;
   const value=(v,s)=>typeof v==='function'?v(s):v;
   for(const s of ss){const l=value(left,s),r=value(right,s),o=value(offset,s),t=value(thickness,s);for(const [d,dy] of thickness?[[l,0],[r,0],[l,-t],[r,-t]]:[[l,0],[r,0]])pos.push(...xyz(s,d,h(s)+o+dy));}
   for(let i=1;i<ss.length;i++){
    const u=(i-1)*stride,v=i*stride;idx.push(u,u+1,v,u+1,v+1,v);
    if(thickness)idx.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);
   }
   if(thickness){const v=(ss.length-1)*stride;idx.push(0,2,1,1,2,3,v,v+1,v+2,v+1,v+3,v+2);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
   if(mat==='landing'){const colors=[];const grey=new THREE.Color(p.CHAMPLAIN.palette.asphalt),white=new THREE.Color('#f2f3f6');for(const s of ss)for(let j=0;j<stride;j++)colors.push(...white.clone().lerp(grey,approachBlend(s)).toArray());g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));}
   put(g,mat,from,lift,name?name+'-'+ck(from):null);from=to;
  }
 }
 let first=LANDING,last=L-LANDING;
 while(h(first)<4.5)first++;while(h(last)<4.5)last--;
 // Broad composite girder bridge, six lanes, protected paths on both edges.
 strip('concrete',first,last,-HALF_WIDTH,HALF_WIDTH,-.22,.8,'slab');
 for(let side=0;side<2;side++){
  const left=s=>edgesAt(s)[side][0],right=s=>edgesAt(s)[side][1];
  strip('landing',0,TAPER,left,right,0,0,'landing-north-'+side);
  strip('asphalt',TAPER,L-TAPER,left,right,0,0,'road-'+side);
  strip('landing',L-TAPER,L,left,right,0,0,'landing-south-'+side);
 }
 for(const side of [-1,1]){
  const d=s=>pathCentre(s,side),half=s=>pathWidth(s)/2;
  // Ground-level noses join mapped provider paths; raised rails stop at held posts.
  strip('concrete',PATH_START,L,s=>d(s)-half(s),s=>d(s)+half(s),s=>pathHeight(s)-h(s)+.18*approachBlend(s)*Math.min(1,(s-PATH_START)/40),s=>.18*approachBlend(s)*Math.min(1,(s-PATH_START)/40),'walk-'+side);
  const outer=s=>d(s)+side*(half(s)-.18),railStart=PATH_START+24,railEnd=L-24;
  strip('concrete',railStart,railEnd,s=>outer(s)-.24,s=>outer(s)+.24,s=>pathHeight(s)-h(s)+.65,.47,'parapet-'+side);
  strip('rail',railStart,railEnd,s=>outer(s)-.07,s=>outer(s)+.07,s=>pathHeight(s)-h(s)+1.35,.12,'rail-'+side);
  for(const s of [railStart,railEnd])box('concrete',s,outer(s),pathHeight(s)+.77,.8,.6,1.54,'rail-end-'+side+'-'+s);
  contact('rail-'+side,[railStart,outer(railStart),pathHeight(railStart)+1.29],[railEnd,outer(railEnd),pathHeight(railEnd)+1.29],'rail-end-'+side+'-'+railStart,'rail-end-'+side+'-'+railEnd);
  strip('concrete',PATH_START,L-PATH_START,s=>edgesAt(s)[side<0?0:1][side<0?0:1]-.23,s=>edgesAt(s)[side<0?0:1][side<0?0:1]+.23,s=>.18+.87*approachBlend(s),s=>.87*approachBlend(s),'barrier-'+side);
  strip('steel',first,last,side*13.5-.6,side*13.5+.6,-.9,3.1,'girder-'+side);
  for(const s of [first,last])box('concrete',s,side*13.5,(h(s)-2)/2,4,3,h(s)-2,'girder-end-'+side+'-'+s,y=>clamp(y/(h(s)-2)));
  contact('girder-'+side,[first,side*13.5,h(first)-2.5],[last,side*13.5,h(last)-2.5],'girder-end-'+side+'-'+first,'girder-end-'+side+'-'+last);
  contact('walk-'+side,[PATH_START,d(PATH_START),pathHeight(PATH_START)],[L,d(L),pathHeight(L)],'ground','ground');
  if(near)strip('paint',TAPER,L-TAPER,side*11.9-.065,side*11.9+.065,.12);
 }
 strip('concrete',LANDING,L-LANDING,-.25,.25,s=>.95*approachBlend(s),s=>.95*approachBlend(s),'median');
 if(near)for(let s=TAPER;s<L-TAPER-4;s+=12)for(const d of [-8,-4,4,8])strip('paint',s,Math.min(s+3,L-TAPER),d-.06,d+.06,.12);
 // Long approach viaducts: paired round columns and wide hammerhead caps.
 const piers=[MAIN_START,MAIN_END];
 for(const [a,c] of [[first+18,MAIN_START-12],[MAIN_END+12,last-18]])for(let s=a;s<c;s+=42)piers.push(s);
 for(const s of piers){
  const capTop=h(s)-3.8,top=capTop-1.4;if(top<.5)continue;
  for(const side of [-1,1])member('concrete',[s,side*10,0],[s,side*10,top+.2],1.25,s,'pier-'+s+'-'+side,y=>clamp(y/top));
  box('concrete',s,0,capTop-.7,3.6,31.8,1.4,'cap-'+s);
  for(const side of [-1,1])contact('pier-'+s+'-'+side,[s,side*10,0],[s,side*10,top],'ground','cap-'+s);
 }
 // Four H-shaped tower assemblies, each with two separate masts, twin-wall lower legs
 // and ship-impact collars. No portal crossbeam above traffic.
 for(const [i,s] of TOWERS.entries()){
  box('concrete',s,0,DECK_H-4.5,5.8,33,1.8,'tower-cap-'+i);
  for(const side of [-1,1]){
   const d=side*13.7;
   box('concrete',s,d,2.5,8,6.5,5,'collar-'+i+'-'+side,0);
   for(const u of [-1,1]){
    const top=DECK_H-4.1;
    box('tower',s+u*2,d,top/2,1.7,3.8,top,'leg-'+i+'-'+side+'-'+u,y=>clamp(y/top));
    contact('leg-'+i+'-'+side+'-'+u,[s+u*2,d,2.5],[s+u*2,d,top],'collar-'+i+'-'+side,'tower-cap-'+i);
   }
   // Closed rectangular tapered mast with chamfered corners.
   const levels=[[DECK_H-4.2,5.5,3.5],[DECK_H+1,4.0,3.1],[TOWER_H-1,2.8,2.55],[TOWER_H,2.8,2.55]],pos=[],idx=[];
   for(const [y,len,w] of levels){const a=len/2,c=w/2,t=.24;for(const [u,v] of [[-a+t,-c],[a-t,-c],[a,-c+t],[a,c-t],[a-t,c],[-a+t,c],[-a,c-t],[-a,-c+t]])pos.push(...xyz(s+u,d+v,y));}
   for(let k=1;k<levels.length;k++)for(let j=0;j<8;j++){const a=(k-1)*8+j,c=(k-1)*8+(j+1)%8,u=k*8+j,v=k*8+(j+1)%8;idx.push(a,u,c,c,u,v);}
   for(let j=1;j<7;j++)idx.push(0,j,j+1,24,24+j+1,24+j);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,'tower',s,1,'mast-'+i+'-'+side);
   for(const dir of [-1,1])for(let k=0;k<10;k++){
    if(!near&&k%2&&k!==9)continue;
    const reach=24+k*9.5,anchor=s+dir*reach,upper=DECK_H+9+k*3.22;
    const A=[s+dir*1.35,d,upper],B=[anchor,d,h(anchor)+.88],support='anchor-'+i+'-'+side+'-'+dir+'-'+k;
    box('steel',anchor,d,h(anchor)+.52,1.5,.9,1.0,support);
    member('cable',A,B,near?.10:.14,s);contact('stay-'+i+'-'+side+'-'+dir+'-'+k,A,B,'mast-'+i+'-'+side,support);
    if(near)box('steel',s+dir*1.75,d,upper,.22,1.1,.4);
   }
  }
 }
 // Transverse floor beams intersect both side girders, never terminate in the air.
 for(let s=first+4;s<last;s+=near?8:24){
  box('steel',s,0,h(s)-2, .48,27.2,1.15);
  contact('floor-'+s,[s,-13.5,h(s)-2],[s,13.5,h(s)-2],'girder--1-'+ck(s),'girder-1-'+ck(s));
 }
 if(near)for(let s=PATH_START+28;s<L-26;s+=4)for(const side of [-1,1]){
  const d=pathCentre(s,side)+side*(pathWidth(s)/2-.18);member('rail',[s,d,pathHeight(s)+.63],[s,d,pathHeight(s)+1.33],.045,s);
  contact('rail-post-'+s+'-'+side,[s,d,pathHeight(s)+.63],[s,d,pathHeight(s)+1.33],'parapet-'+side+'-'+ck(s),'rail-'+side+'-'+ck(s));
 }
 // Perched eagle silhouettes on all eight crowns, retained without simplification far.
 // Faceted bodies, bent raised wings, hooked beaks and tails read from the road.
 function ellipsoid(s,d,y,scale,name){const g=new THREE.SphereGeometry(1,8,6);g.scale(...scale);const q=p.bridgePoint(s,d,y);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,'gold',s,1,name);}
 for(const [i,s] of TOWERS.entries())for(const side of [-1,1]){
  const d=side*13.7;
  box('gold',s,d,TOWER_H+.18,1.2,1.0,.36,'eagle-perch-'+i+'-'+side);
  for(const u of [-.23,.23])member('gold',[s,d+u,TOWER_H+.22],[s,d+u,TOWER_H+.85],.12,s);
  ellipsoid(s,d,TOWER_H+1.25,[.55,.9,.48],'eagle-body-'+i+'-'+side);
  ellipsoid(s-.35,d,TOWER_H+2.1,[.36,.4,.3],'eagle-head-'+i+'-'+side);
  member('gold',[s-.55,d,TOWER_H+2.1],[s-.95,d,TOWER_H+1.94],.13,s);
  member('gold',[s+.28,d,TOWER_H+.8],[s+.95,d,TOWER_H+.32],.23,s);
  for(const wing of [-1,1]){
   const outline=[[0,.25,1.2],[.15,1.25,2.15],[.55,2.3,3.15],[.95,2.15,1.95],[.65,1.05,1.05]],shape=new THREE.Shape(outline.map(([u,v,y])=>new THREE.Vector2(v,y)));
   const g=new THREE.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:false});
   // Swapping extrusion X/Z reverses handedness on the positive wing.
   const a=g.attributes.position;if(wing>0){const idx=Array.from({length:a.count},(_,j)=>j);for(let j=0;j<idx.length;j+=3)[idx[j+1],idx[j+2]]=[idx[j+2],idx[j+1]];g.setIndex(idx);}
   for(let j=0;j<a.count;j++){const q=p.bridgePoint(s+.15+a.getZ(j),d+wing*a.getX(j),TOWER_H+a.getY(j));a.setXYZ(j,q.x,q.y,q.z);}g.computeVertexNormals();put(g,'gold',s,1,'eagle-wing-'+i+'-'+side+'-'+wing);
   contact('eagle-wing-root-'+i+'-'+side+'-'+wing,[s+.25,d+wing*.3,TOWER_H+1.3],[s+.25,d+wing*.3,TOWER_H+1.3],'eagle-body-'+i+'-'+side,'eagle-body-'+i+'-'+side);
  }
  contact('eagle-perch-'+i+'-'+side,[s,d,TOWER_H],[s,d,TOWER_H+.2],'mast-'+i+'-'+side,'eagle-perch-'+i+'-'+side);
 }
 const root=b.finish();root.traverse(o=>{if(o.isMesh&&o.material.name==='landing'){o.material.color.set('#ffffff');o.material.vertexColors=true;}});root.userData.supports=supports;root.userData.contacts=contacts;return root;
}
