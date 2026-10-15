import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC,PALETTES } from './config.js';
import { STATION_RING } from './skybridge-vancouver-alignment.js';
import { point,height,halfWidth,stations,START,END,TOWERS,MAIN_START,MAIN_END,local } from './skybridge-vancouver-profile.js';

export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const supports={},contacts=[],counts={};
 function put(g,mat,name){
  const start=counts[mat]||0,count=g.index?.count||g.attributes.position.count;
  if(name)supports[name]={mesh:SPEC.id+'-0-'+mat,start,count};counts[mat]=start+count;b.put(g,mat);
 }
 function box(mat,s,d,y,l,w,h,name){
  const a=point(s),c=point(s+.1),g=new THREE.BoxGeometry(l,h,w);
  g.rotateY(-Math.atan2(c[2]-a[2],c[0]-a[0]));g.translate(...point(s,d,y));put(g,mat,name);
 }
 function bar(mat,A,B,r,name){
  const a=new THREE.Vector3(...A),v=new THREE.Vector3(...B).sub(a),g=new THREE.CylinderGeometry(r,r,v.length(),near?6:4,1,false);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize()));g.translate(...a.addScaledVector(v,.5).toArray());put(g,mat,name);
 }
 const contact=(name,a,c,u,v)=>contacts.push({name,a,c,supports:[u,v]});
 // Closed cross-section ribbon, real mapped curvature, explicit end caps.
 function ribbon(mat,at,dy,wide,thick,name,flattenApproach=false){
  for(let i=1;i<stations.length;i++){
   const s0=stations[i-1],s1=stations[i],positions=[],indices=[];
   const flat=flattenApproach&&(s1<=MAIN_START||s0>=MAIN_END);
   // Approach track profiles are sub-pixel at distance; far drops the overlays.
   if(flat&&!near)continue;
   if(flat){
    for(const s of [s0,s1])for(const side of [-1,1])positions.push(...point(s,at(s)+side*wide(s)/2,height(s)+.12));
    indices.push(0,1,2,1,3,2);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,mat,name+'-'+i);
    contact(name+'-'+i,point(s0,at(s0),height(s0)),point(s1,at(s1),height(s1)),'deck-'+i,'deck-'+i);
    continue;
   }
   for(const s of [s0,s1])for(const [side,up] of [[-1,0],[1,0],[1,-thick],[-1,-thick]])positions.push(...point(s,at(s)+side*wide(s)/2,height(s)+dy+up));
   // outward winding: local station/lateral/y has positive handedness.
   for(let j=0;j<4;j++){const k=(j+1)%4;indices.push(j,k,j+4,k,k+4,j+4);}
   indices.push(0,2,1,0,3,2,4,5,6,4,6,7);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();
   put(g,mat,name+'-'+i);
   if(name!=='deck')contact(name+'-'+i,point(s0,at(s0),height(s0)+(name.startsWith('girder')?dy:dy-thick)),point(s1,at(s1),height(s1)+(name.startsWith('girder')?dy:dy-thick)),'deck-'+i,'deck-'+i);
  }
 }
 ribbon('deck',()=>0,0,s=>halfWidth(s)*2,1.5,'deck');
 // Longitudinal concrete edge girders, parapets and narrow evacuation edges.
 for(const side of [-1,1]){
  ribbon('concrete',s=>side*(halfWidth(s)-.3),-1.5,()=>.6,1.5,'girder-'+side);
  ribbon('concrete',s=>side*(halfWidth(s)-.18),.55,()=>.36,.55,'parapet-'+side);
 }
 // Visible rails and linear-induction reaction strips, no automobile pavement or paint.
 // Mapped track separation narrows into the eastern curved approach.
 const tc=s=>Math.max(1.7,halfWidth(s)-2.25);
 for(const side of [-1,1])for(const edge of [-1,1])ribbon('rail',s=>side*tc(s)+edge*.7175,.24,()=>near?.12:.18,.24,'running-rail-'+side+'-'+edge,true);
 if(near){
  for(const side of [-1,1])ribbon('steel',s=>side*tc(s),.13,()=>.43,.13,'induction-'+side,true);
  for(const side of [-1,1])ribbon('rail',()=>side*.7175,.12,()=>.1,.12,'maintenance-'+side,true);
  for(let s=MAIN_START+1;s<MAIN_END;s+=2.5)for(const side of [-1,1])box('rail',s,side*tc(s),height(s)+.045,.18,1.95,.09);
 }
 // Closed diaphragms are buried inside ground-connected abutments / station enclosure.
 for(const [label,s] of [['west',START],['east',END]]){
  box('concrete',s,0,height(s)-3,2,halfWidth(s)*2,3,'end-diaphragm-'+label);
 }
 // NW abutment: the rail disappears into a recessed portal, not a free end on a pier.
 // Retaining mass stands on grade in Cityscape, and forms the bluff connection in world.
 // Battered headwall, broad at grade, backed by a finite sloped earth wedge.
 // This is the portal's authored embankment, not a baked terrain elevation.
 function solid(mat,vertices,faces,name){
  const vs=vertices.map(([s,d,y])=>new THREE.Vector3(...point(s,d,y))),centre=new THREE.Vector3();
  for(const v of vs)centre.add(v);centre.multiplyScalar(1/vs.length);
  const positions=[];
  for(const face of faces)for(let j=1;j<face.length-1;j++){
   const a=vs[face[0]],c=vs[face[j]],d=vs[face[j+1]];
   const normal=c.clone().sub(a).cross(d.clone().sub(a));
   const ordered=normal.dot(a.clone().sub(centre))<0?[a,d,c]:[a,c,d];
   for(const v of ordered)positions.push(...v.toArray());
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();put(g,mat,name);
 }
 solid('concrete',[
  [START-8,-16,0],[START+5,-16,0],[START+5,16,0],[START-8,16,0],
  [START-8,-6.5,34.2],[START+2,-6.5,34.2],[START+2,6.5,34.2],[START-8,6.5,34.2],
 ],[[0,1,2,3],[4,5,6,7],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]],'nw-abutment');
 solid('earth',[
  [START-80,-36,0],[START-80,36,0],[START-7,36,0],[START-7,-36,0],
  [START-8,-6.5,39.5],[START-8,6.5,39.5],
 ],[[0,1,2,3],[0,4,5,1],[0,3,4],[1,5,2],[3,2,5,4]],'nw-embankment');
 for(const side of [-1,1])box('concrete',START-3,side*5.4,36.5,10,2.2,6,'nw-portal-jamb-'+side);
 box('concrete',START-3,0,40.5,10,13,2,'nw-portal-lintel');
 box('tunnel',START-.5,0,36.5,1,8.6,6,'nw-portal-recess');
 // OSM station 689527849 is a natural visibility boundary for the extended Expo guideway.
 // Its roof / opaque glazing hide the internal authored rail boundary inside the mapped hall.
 function stationMass(mat,y,h,name){
  const shape=new THREE.Shape(STATION_RING.slice(0,-1).map(p=>{const [x,z]=local(p);return new THREE.Vector2(x,-z);}));
  const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,steps:1});
  g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,mat,name);
 }
 stationMass('concrete',0,11.5,'station-base');
 stationMass('glass',11.5,6.5,'station-hall');
 stationMass('station',18,0.6,'station-roof');
 // The pale glazing and green vertical frames keep the photographed station rhythm in both LODs.
 const ring=STATION_RING.slice(0,-1).map(local);
 for(let i=0;i<ring.length;i++){
  const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.ceil(len/4.5);
  for(let j=0;j<n;j++){
   const t=j/n,x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t;
   // Embedded frame cylinders project >10cm near; far uses the same coarse opaque frame.
   bar('station',[x,11.5,z],[x,18.05,z],.19);
  }
 }
 for(const [label,s,support] of [['nw',START,'nw-portal-recess'],['se',END,'station-hall']]){
  for(const d of [0,-halfWidth(s)+.18,halfWidth(s)-.18,-2.4,-.97,.97,2.4]){
   const p=point(s,d,height(s)+.15);contact('enclosed-terminal-'+label+'-'+d,p,p,support,support);
  }
 }
 const piers=[START,MAIN_START,MAIN_END,END];
 for(let s=START+38;s<MAIN_START-8;s+=38)piers.push(s);
 for(let s=MAIN_END+38;s<END-8;s+=38)piers.push(s);
 for(const [i,s] of piers.entries()){
  const top=height(s)-3,cap='pier-cap-'+i;
  box('concrete',s,0,top-.6,3.8,halfWidth(s)*2,1.2,cap);
  const segment=Math.max(1,stations.findIndex(q=>q>=s));
  for(const side of [-1,1])contact('cap-to-girder-'+i+'-'+side,point(s,side*(halfWidth(s)-.3),top),point(s,side*(halfWidth(s)-.3),top),cap,'girder-'+side+'-'+segment);
  for(const side of [-1,1]){
   const d=side*Math.min(2.6,halfWidth(s)-1),name='pier-'+i+'-'+side;
   box('concrete',s,d,1.2,4,3.5,2.4,'foot-'+name);
   bar('concrete',point(s,d,1.2),point(s,d,top-.8),.95,name);
   contact(name,point(s,d,1.2),point(s,d,top-.8),'foot-'+name,cap);
  }
 }
 // H/portal pylons: open lower window, inclined upper shafts and recessed red infill.
 const legD=y=>y<=45?7.2-.9*y/45:6.3-(y-45)*4.3/78;
 function loft(mat,s,levels,name){
  const pos=[],idx=[];
  for(const [y,d,w,l] of levels)for(const [u,v] of [[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2]])pos.push(...point(s+u,d+v,y));
  for(let k=1;k<levels.length;k++)for(let j=0;j<4;j++){const a=(k-1)*4+j,c=(k-1)*4+(j+1)%4,u=k*4+j,v=k*4+(j+1)%4;idx.push(a,u,c,c,u,v);}
  const n=pos.length/3-4;idx.push(0,1,2,0,2,3,n,n+2,n+1,n,n+3,n+2);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,name);
 }
 for(const [i,s] of TOWERS.entries()){
  box('concrete',s,0,42.1,5.2,16.8,2.8,'tower-cap-'+i);
  for(const side of [-1,1]){
   const name='pylon-'+i+'-'+side;
   box('concrete',s,side*7.2,1.5,6,5.2,3,'tower-foot-'+i+'-'+side);
   loft('concrete',s,[[0,side*7.2,3.36,5.52],[42,side*6.36,3.24,5.04],[45,side*6.3,2.6,4.1],[87,side*legD(87),2.0,3.7],[123,side*2,1.7,3.3]],name);
   contact(name,point(s,side*7.2,0),point(s,side*2,122),'tower-foot-'+i+'-'+side,'crown-'+i);
   const ks=near?Array.from({length:14},(_,k)=>k):[0,2,4,6,8,10,12,13];
   for(const dir of [-1,1])for(const k of ks){
    const reach=25+k*(dir===(i? -1:1)?10.2:8.2),anchor=s+dir*reach,upper=94+k*1.95;
    const A=point(s+dir*1.65,side*legD(upper),upper),B=point(anchor,side*5.05,height(anchor)+.8);
    const sup='stay-anchor-'+i+'-'+side+'-'+dir+'-'+k;
    box('concrete',anchor,side*5.05,height(anchor)+.65,1.3,.75,1.3,sup);
    bar('cable',A,B,near?.091:.13,'stay-'+i+'-'+side+'-'+dir+'-'+k);
    contact('stay-'+i+'-'+side+'-'+dir+'-'+k,A,B,name,sup);
   }
  }
  box('concrete',s,0,86.7,3.7,8.1,1.6,'upper-crossbeam-'+i);
  box('concrete',s,0,122.15,3.3,5.7,1.7,'crown-'+i);
  // Solid red diaphragm between shafts. Inset 0.75m from the concrete front/back faces.
  loft('red',s,[[87.5,0,2*legD(87.5)-1.95,1.8],[121.3,0,2*legD(121.3)-1.65,1.8]],'red-panel-'+i);
 }
 const root=b.finish();root.userData.supports=supports;root.userData.contacts=contacts;return root;
}
