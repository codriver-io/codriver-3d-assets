import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Architectural axes follow the measured 81.15-degree OSM northern edge.
export const plan = (x,y,z) => new THREE.Vector3(x,y,z).applyAxisAngle(new THREE.Vector3(0,1,0),SPEC.rotation).toArray();
export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m)=>{g.rotateY(SPEC.rotation);b.put(g,m);};
 const faceNames=['east','west','top','bottom','south','north'];
 function box(m,x0,x1,y0,y1,z0,z1,omit=[]) {
  const g=new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0);
  g.setIndex([...g.index.array].filter((_,i)=>!omit.includes(faceNames[Math.floor(i/6)])));
  g.translate((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);put(g,m);
 }
 function quad(m,a,c,d,e) {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d,...e],3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,m);
 }
 function cylinder(m,x,z,r0,r1,y0,y1,n=near?32:16) {
  const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);put(g,m);
 }
 function hip(m,x0,x1,z0,z1,y,rise,inset=5) {
  const a=[x0,y,z0],c=[x1,y,z0],d=[x1,y,z1],e=[x0,y,z1];
  const f=[x0+inset,y+rise,z0+inset],h=[x1-inset,y+rise,z0+inset],i=[x1-inset,y+rise,z1-inset],j=[x0+inset,y+rise,z1-inset];
  quad(m,a,f,h,c);quad(m,c,h,i,d);quad(m,d,i,j,e);quad(m,e,j,f,a);quad(m,f,j,i,h);
 }
 // Partition the facade into masonry and actual recessed openings. No glass overlay on a wall.
 function facade(axis,s,plane,u0,u1,y0,y1,windows,material='stone') {
  const pt=(u,y,depth=0)=>axis==='x'?[plane+s*depth,y,u]:[u,y,plane+s*depth];
  const rect=(m,a,c,lo,hi,depth=0)=>{
   let ps=[pt(a,lo,depth),pt(c,lo,depth),pt(c,hi,depth),pt(a,hi,depth)];
   // x facade: increasing z cross increasing y = -x. z facade: increasing x cross y = +z.
   if((axis==='x'&&s>0)||(axis==='z'&&s<0))ps.reverse();quad(m,...ps);
  };
  const us=[...new Set([u0,u1,...windows.flatMap(w=>[w[0],w[1]])])].sort((a,c)=>a-c);
  const ys=[...new Set([y0,y1,...windows.flatMap(w=>[w[2],w[3]])])].sort((a,c)=>a-c);
  for(let i=1;i<us.length;i++)for(let j=1;j<ys.length;j++){
   const a=us[i-1],c=us[i],lo=ys[j-1],hi=ys[j],u=(a+c)/2,y=(lo+hi)/2;
   if(!windows.some(w=>u>w[0]&&u<w[1]&&y>w[2]&&y<w[3]))rect(material,a,c,lo,hi);
  }
  for(const [a,c,lo,hi,m='glass'] of windows){
   const dep=near?-.24:-.6, edge=near?.12:.16;
   // Opening reveals have outward normals into the opening.
   const q=[pt(a,lo),pt(c,lo),pt(c,hi),pt(a,hi)],r=[pt(a,lo,dep),pt(c,lo,dep),pt(c,hi,dep),pt(a,hi,dep)];
   for(let k=0;k<4;k++){let ps=[q[k],r[k],r[(k+1)%4],q[(k+1)%4]];if((axis==='x'&&s>0)||(axis==='z'&&s<0))ps.reverse();quad(material,...ps);}
   if(near){
    rect('frame',a,c,lo,lo+edge,dep);rect('frame',a,c,hi-edge,hi,dep);
    rect('frame',a,a+edge,lo+edge,hi-edge,dep);rect('frame',c-edge,c,lo+edge,hi-edge,dep);
    const mid=(a+c)/2,ym=(lo+hi)/2;
    rect('frame',mid-.04,mid+.04,lo+edge,hi-edge,dep);
    for(const [v,w] of [[a+edge,mid-.04],[mid+.04,c-edge]]){
     rect(m,v,w,lo+edge,ym-.04,dep);rect('frame',v,w,ym-.04,ym+.04,dep);rect(m,v,w,ym+.04,hi-edge,dep);
    }
   }else rect(m,a,c,lo,hi,dep);
  }
 }
 function pediment(x0,x1,half,base,top) {
  const shape=new THREE.Shape([new THREE.Vector2(-half,base),new THREE.Vector2(half,base),new THREE.Vector2(0,top)]);
  const g=new THREE.ExtrudeGeometry(shape,{depth:x1-x0,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(x0,0,0);put(g,'stone');
 }
 const windows=(centers,rows=[[2.4,6.0],[9.1,12.7]],w=1.7)=>centers.flatMap((u,i)=>rows.map(([lo,hi])=>[u-w/2,u+w/2,lo,hi,i%5===0?'light':'glass']));
 function column(x,z,y0=1.4,y1=14.5,r=.92) {
  const n=near?48:8, levels=near?3:1, p=[],ix=[],shaftTop=y1-.62;
  for(let j=0;j<=levels;j++)for(let k=0;k<=n;k++){
   const t=j/levels,a=k*2*Math.PI/n,rr=r*(1-.15*t+.035*Math.sin(Math.PI*t))-(near&&k%3===1?.065:0);
   p.push(x+rr*Math.cos(a),y0+(shaftTop-y0)*t,z+rr*Math.sin(a));
   if(j&&k){const v=(j-1)*(n+1)+k-1,w=j*(n+1)+k-1;ix.push(v,w,v+1,v+1,w,w+1);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();put(g,'stone');
  const cap=new THREE.LatheGeometry([[r*.85,shaftTop],[r*.9,shaftTop+.1],[r*1.17,y1-.2]].map(v=>new THREE.Vector2(...v)),near?16:8);cap.translate(x,0,z);put(cap,'stone');
  box('stone',x-r*1.22,x+r*1.22,y1-.2,y1,z-r*1.22,z+r*1.22,['bottom','top']);
 }
 // Main 1861 building: a broad rectangular floor, shallow porticos and two-storey wings.
 box('stone',-27.5,28.3,0,1.4,-46,46.4,['bottom']);
 const wings=[[-46,-20.4],[20.4,46.4]];
 for(const [a,c] of wings){
  facade('x',-1,-27.5,a,c,1.4,14.5,windows(Array.from({length:5},(_,i)=>a+2.7+i*(c-a-5.4)/4)));
  for(let i=0;i<6;i++){const z=a+.5+i*(c-a-1)/5;box('stone',-28.0,-27.45,1.4,14.5,z-.55,z+.55,['east','top','bottom']);}
 }
 facade('x',-1,-21,-20.4,20.4,1.4,14.5,[...windows([-16,-5.2,5.2,16],[[2,6]],2.1),...windows([-16,-10.5,-5.2,0,5.2,10.5,16],[[9.1,12.7]],2.1),...[-10.5,0,10.5].map(u=>[u-1.3,u+1.3,1.4,6.2,'glass'])]);
 for(const z of [-20.4,20.4])facade('z',Math.sign(z),z,-27.5,-21,1.4,14.5,[]);
 for(let i=0;i<8;i++)column(-25.9,-18.8+i*37.6/7);
 for(const s of [-1,1]){
  const edge=s<0?-46:46.4;
  for(const [a,c] of [[-27.5,-13.4],[13.4,28.3]])facade('z',s,edge,a,c,1.4,14.5,windows([a+3.1,(a+c)/2,c-3.1]));
  facade('z',s,s*40.4,-13.4,13.4,1.4,14.5,windows([-10.8,-6.5,-2.2,2.2,6.5,10.8]));
  for(const x of [-13.4,13.4])facade('x',Math.sign(x),x,s<0?-46:40.4,s<0?-40.4:46.4,1.4,14.5,[]);
  for(let i=0;i<6;i++)column(-11.2+i*4.48,s<0?-44.4:44.8);
 }
 facade('x',1,28.3,-46,46.4,1.4,14.5,windows(Array.from({length:17},(_,i)=>-42+i*5.2)));
 box('stone',-27.5,28.3,14.5,16,-46,46.4,['top']);
 box('trim',-27.7,28.5,16,17,-46.2,46.6,['bottom']);
 for(const [a,c] of [[-46.0,-18.7],[18.9,46.4]])hip('roof',-27.4,28.2,a,c,17,2.7,5.0);
 // Central raised roof and square rotunda base; west/east pediments are small, above the long entablature.
 hip('roof',-23.4,23.4,-12,12,17,3.6,3);
 box('stone',-11.15,11.15,20.6,23.2,-11.15,11.15,['bottom','top']);
 box('trim',-11.4,11.4,23.2,23.8,-11.4,11.4,['bottom']);
 for(const s of [-1,1])pediment(s<0?-23.9:23.4,s<0?-23.4:23.9,12,17,20.7);
 // Two-storey cylindrical cupola, 64 ft across. Window rows are actual drum partitions.
 const radius=SPEC.drumDiameter/2,bays=24;
 cylinder('stone',0,0,radius,radius,23.8,25.2,near?48:24);
 for(let i=0;i<bays;i++){
  const a=2*Math.PI*(i+.5)/bays;
  const tangent=radius*Math.tan(Math.PI/bays),center=radius;
  // Build an x-positive facade at the origin then rotate it around the drum.
  // Local panel partition drawn directly with radial/tangential coordinates.
  const point=(u,y,depth=0)=>[(center+depth)*Math.cos(a)+u*Math.sin(a),y,(center+depth)*Math.sin(a)-u*Math.cos(a)];
  const panel=(m,u0,u1,y0,y1,dep=0)=>quad(m,point(u0,y0,dep),point(u1,y0,dep),point(u1,y1,dep),point(u0,y1,dep));
  const half=.45,dep=near?-.24:-.6;
  panel('stone',-tangent,-half,25.2,37.4);panel('stone',half,tangent,25.2,37.4);
  for(const [lo,hi] of [[25.2,26.1],[30.6,31.4],[35.9,37.4]])panel('stone',-half,half,lo,hi);
  for(const [lo,hi] of [[26.1,30.6],[31.4,35.9]]){
   const outer=[point(-half,lo),point(half,lo),point(half,hi),point(-half,hi)],inner=[point(-half,lo,dep),point(half,lo,dep),point(half,hi,dep),point(-half,hi,dep)];
   for(let k=0;k<4;k++)quad('stone',outer[k],inner[k],inner[(k+1)%4],outer[(k+1)%4]);
   if(near){for(let j=0;j<3;j++){const y0=lo+(hi-lo)*j/3,y1=lo+(hi-lo)*(j+1)/3;panel('glass',-half,half,y0,y1-.08,dep);panel('frame',-half,half,y1-.08,y1,dep);}}
   else panel('glass',-half,half,lo,hi,dep);
  }
  // Narrow pilasters are masonry; no differently coloured applique on the cylinder.
  if(near){const g=new THREE.BoxGeometry(.36,11.9,.32);g.translate(radius,31.3,0);g.rotateY(-2*Math.PI*i/bays);put(g,'stone');}
 }
 cylinder('stone',0,0,10.15,10.15,37.4,SPEC.drumTop,near?48:24);
 cylinder('trim',0,0,10.5,10.5,SPEC.drumTop,38.75,near?48:24);
 // Low cone, circular raised skylight and pinnacle. No hemisphere/dome geometry.
 cylinder('roof',0,0,10.5,4.7244,38.75,40.05,near?48:24);
 cylinder('trim',0,0,4.7244,4.7244,40.05,40.45,near?32:16);
 cylinder('skylight',0,0,4.7244,.4,40.45,41.4,near?32:16);
 cylinder('frame',0,0,.15,.055,41.4,SPEC.height,8);
 // Continuous grounded west stair: each tread is a single cross-section, not stacked coplanar slabs.
 for(let i=0,n=near?7:4;i<n;i++)box('stone',-27.5-3.2*(n-i)/n,-27.5-3.2*(n-i-1)/n,0,1.4*(i+1)/n,-19.8,19.8,['bottom','east']);
 // Connector and 1901 Senate/Judiciary annex within the complete OSM compound footprint.
 box('stone',28.3,45.4,0,1.2,-18,19,['bottom']);
 for(const s of [-1,1])facade('z',s,s<0?-18:19,28.3,45.4,1.2,14.1,windows([31,34.8,38.6,42.5],[[2.1,6.5],[8.2,12.7]],2.5));
 box('trim',28.3,45.4,14.1,14.6,-18,19,['bottom']);hip('roof',28.3,45.4,-18,19,14.6,1.6,3);
 box('stone',45.4,73.5,0,1.4,-33,33.3,['bottom']);
 for(const s of [-1,1]){
  const x=s<0?45.4:73.5;
  if(s<0)facade('x',s,x,-33,33.3,1.4,16.6,windows(Array.from({length:13},(_,i)=>-29.5+i*4.9),[[2.5,6.8],[9.0,13.9]],2));
  else {
   for(const [a,c] of [[-33,-14],[14,33.3]])facade('x',1,x,a,c,1.4,16.6,windows([a+3,(a+c)/2,c-3],[[2.5,6.8],[9,13.9]],2));
   facade('x',1,69.9,-14,14,1.4,16.6,windows([-10.5,-3.5,3.5,10.5],[[2.5,6.8],[9,13.9]],2));
   for(const z of [-14,14])facade('z',Math.sign(z),z,69.9,73.5,1.4,16.6,[]);
  }
 }
 for(const s of [-1,1])facade('z',s,s<0?-33:33.3,45.4,73.5,1.4,16.6,windows([49,54.2,59.5,64.7,69.9],[[2.5,6.8],[9,13.9]],2));
 box('stone',45.4,73.5,16.6,18,-33,33.3,['top']);
 box('trim',45.2,73.7,18,18.7,-33.2,33.5,['bottom']);hip('roof',45.4,73.5,-33,33.3,18.7,1.3,4);
 // Attached central east pediment, shallow Doric pilasters and skylights distinguish the annex.
 box('stone',69.9,73.7,1.4,6.5,-14,14,['west','top','bottom']);
 for(const u of [-10.5,-3.5,3.5,10.5])column(73.1,u,6.5,16.6,.77);
 pediment(73.5,74.1,12.5,18.7,21.0);
 for(const z of [-23,0,23])hip('skylight',54.5,62.5,z-2,z+2,20,1,1);
 for(const s of [-1,1])for(const z of [-28.5,28.5])hip('skylight',4.5,16.5,z-3,z+3,19.7,1.1,1.5);
 if(near){
  for(const z of [-16,16]){box('stone',18,21,17,24.5,z-1.3,z+1.3,['bottom']);box('trim',17.7,21.3,24.5,24.9,z-1.6,z+1.6,['bottom']);}
  // Sparse stone dentils under the main cornice, merged with the masonry.
  for(let z=-44.5;z<46;z+=2)box('stone',-27.75,-27.4,15.65,16.0,z-.25,z+.25,['east','top']);
 }
 return b.finish();
}
