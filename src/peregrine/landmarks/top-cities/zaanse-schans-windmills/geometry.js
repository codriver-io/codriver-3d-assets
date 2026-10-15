import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, OSM_WAYS } from './footprint.js';
import { MILLS, point, local, members } from './zaanse-schans-windmills-site.js';

export function create({detail='near', onSupport=null}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,mat)=>b.put(g,mat);
 const bar=(mat,a,c,w,d=w,name=null)=>{
  const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...c),delta=bv.clone().sub(av);
  const g=new THREE.BoxGeometry(w,delta.length(),d);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));g.translate(...av.add(bv).multiplyScalar(0.5).toArray());if(name && onSupport)onSupport(name,g.clone());put(g,mat);
 };
 function loft(m,mat,levels,n=m.sides,name=null) {
  const pos=[],idx=[];
  for(const [y,rx,rz=rx] of levels)for(let i=0;i<n;i++){const t=2*Math.PI*(i+0.5)/n;pos.push(...point(m,Math.sin(t)*rx,y,Math.cos(t)*rz));}
  for(let k=0;k<levels.length-1;k++)for(let i=0;i<n;i++){const j=(i+1)%n,a=k*n+i,c=k*n+j;idx.push(a,c,a+n,c,c+n,a+n);}
  for(let i=1;i<n-1;i++)idx.push((levels.length-1)*n,(levels.length-1)*n+i,(levels.length-1)*n+i+1);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();if(name && onSupport)onSupport(m.name+':'+name,flat.clone());put(flat,mat);
 }
 function annulus(m,inner,outer,y,mat) {
  const pos=[],idx=[],n=m.sides;
  for(let i=0;i<n;i++){const t=2*Math.PI*(i+0.5)/n;for(const r of [inner,outer])pos.push(...point(m,Math.sin(t)*r,y,Math.cos(t)*r));}
  for(let i=0;i<n;i++){const a=i*2,c=((i+1)%n)*2;idx.push(a,a+1,c,c,a+1,c+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();if(mat==='wood' && onSupport)onSupport(m.name+':gallery',g.clone());put(g,mat);
 }
 function box(m,mat,u,y,v,w,h,d){const g=new THREE.BoxGeometry(w,h,d);g.rotateY(m.angle);g.translate(...point(m,u,y,v));put(g,mat);}
 for(const m of MILLS){
  // Most mapped outlines include the mill's lower workshop; roof form follows its own mapped axis.
  const ring=FOOTPRINTS[OSM_WAYS.indexOf(m.way)].slice(0,-1).map(local);
  if(!m.paltrok && m.name!=='De Zoeker')shed(b,ring,m.name==='De Huisman'?3.4:3.0,m.name==='Het Jonge Schaap'?'wood':'green','wood',near,m.stage-0.85,onSupport,m.name);
  if(m.paltrok){
   // Open-sided saw floor on a rolling-ring base, with broad timber cheeks and rear buck.
   loft(m,'stone',[[0,2.5],[0.6,2.5]],12);
   for(const u of [-3.1,3.1])for(const v of [-3.0,3.0])bar('wood',point(m,u,0.5,v),point(m,u,m.stage,v),0.35);
   box(m,'wood',0,m.stage-0.15,0,9,0.3,8);
   for(const u of [-4.1,4.1])box(m,'green',u,m.stage+0.7,0,0.3,1.4,8);
   box(m,'green',0,6.1,-1.4,6.8,5.6,4.6);
   loft(m,'green',[[7.6,3.5,2.5],[m.hub-1.2,2.1,1.7]],4);
  }else{
   loft(m,'green',[[0,m.baseR],[m.stage,m.baseR]],m.sides,'tower');
   loft(m,m.body,[[m.stage,m.baseR],[m.hub-1.6,m.topR]]);
   const r=m.baseR+1.7;
   annulus(m,m.baseR-0.1,r,m.stage,'wood');
   for(let i=0;i<m.sides;i++){
    const t=(i+0.5)*2*Math.PI/m.sides,t2=(i+1.5)*2*Math.PI/m.sides;
    const q=(a,y,rr=r)=>point(m,Math.sin(a)*rr,y,Math.cos(a)*rr);
    bar('wood',q(t,m.stage-0.12),q(t2,m.stage-0.12),0.25);
    bar('trim',q(t,m.stage),q(t,m.stage+1.05),0.1);
    bar('trim',q(t,m.stage+1.05),q(t2,m.stage+1.05),0.11);
    if(near){bar('trim',q(t,m.stage+0.52),q(t2,m.stage+0.52),0.07);const mid=(t+t2)/2;bar('trim',q(mid,m.stage,r*Math.cos(Math.PI/m.sides)),q(mid,m.stage+1.05,r*Math.cos(Math.PI/m.sides)),0.07);}
   }
   for(const e of members(m))bar('green',e.a,e.b,e.name==='tail pole'?0.22:0.19);
   bar('wood',point(m,-3.4,m.hub-1.2,-0.8),point(m,3.4,m.hub-1.2,-0.8),0.28,0.28,m.name+':cap crossbeam');
   bar('wood',point(m,0,m.stage,-m.baseR-1.2),point(m,0,m.stage+0.6,-m.baseR-1.2),0.3,0.3,m.name+':tail foot');
   // Tail winding wheel, held by the foot post.
   const center=point(m,0,m.stage+0.75,-m.baseR-1.2);
   const g=new THREE.TorusGeometry(0.68,0.065,4,near?16:8);g.rotateY(m.angle);g.translate(...center);put(g,'wood');
   for(const t of [0,Math.PI/2])bar('wood',point(m,Math.cos(t)*0.68,m.stage+0.75+Math.sin(t)*0.68,-m.baseR-1.2),point(m,-Math.cos(t)*0.68,m.stage+0.75-Math.sin(t)*0.68,-m.baseR-1.2),0.07);
  }
  // Rounded boat-shaped cap; broad lower eaves sit directly on the tapered smock.
  loft(m,'wood',[[m.hub-1.6,m.topR+0.3,2.6],[m.hub-0.1,m.topR+0.2,2.5],[m.hub+1.25,0.8,1.7],[m.hub+1.45,0.12,0.7]],near?12:8);
  const plane=3.15;
  bar('wood',point(m,0,m.hub,0),point(m,0,m.hub,plane+0.2),0.5);
  const hub=new THREE.CylinderGeometry(0.55,0.55,0.65,8);hub.rotateX(Math.PI/2);hub.rotateY(m.angle);hub.translate(...point(m,0,m.hub,plane));put(hub,'green');
  // Near has open lattice cells; far widens the stock to a cream panel while retaining cross-rungs.
  for(let k=0;k<4;k++){
   const a=m.phase+k*Math.PI/2, ca=Math.cos(a),sa=Math.sin(a);
   const Q=(r,t=0,depth=0)=>point(m,sa*r+ca*t,m.hub+ca*r-sa*t,plane+depth);
   bar('trim',Q(0),Q(m.radius),near?0.19:0.75,0.18);
   const start=1.65,end=m.radius,width=m.paltrok?1.35:1.55;
   for(const t of [0.36,width])bar(near?'wood':'trim',Q(start,t),Q(end,t),near?0.07:0.10);
   const count=near?18:8;
   for(let j=0;j<=count;j++){const r=start+(end-start)*j/count;bar('trim',Q(r,0.1),Q(r,width+0.1),near?0.065:0.10);}
  }
  // Small framed windows, separate panes in both LODs.
  for(const side of [-1,1])for(const y of [m.stage+1.9,m.hub-3.1]){
   const r=m.baseR+(m.topR-m.baseR)*Math.max(0,(y-m.stage)/(m.hub-1.6-m.stage));
   box(m,'trim',0,y,side*(r*Math.cos(Math.PI/m.sides)+0.10),0.7,0.95,0.14);
   box(m,'glass',0,y,side*(r*Math.cos(Math.PI/m.sides)+0.20),0.48,0.72,0.08);
  }
  if(near)for(let y=m.stage+0.3;y<m.hub-1.9;y+=0.65){
   const r=m.baseR+(m.topR-m.baseR)*(y-m.stage)/(m.hub-1.6-m.stage);
   if(m.body==='green')annulus(m,r+0.035,r+0.07,y,'green');
  }
 }
 shed(b,FOOTPRINTS[OSM_WAYS.indexOf(285317882)].slice(0,-1).map(local),3.0,'wood','wood',near,MILLS.find(m=>m.name==='De Zoeker').stage-0.85,onSupport,'De Zoeker');
 return b.finish();
}

// Gabled roof clipped to each actual OSM lower workshop polygon; no rectangular apron.
function shed(b,ring,eave,wall,roof,near,maxRidge,onSupport,name){
 let best=0,angle=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length],d=Math.hypot(c[0]-a[0],c[1]-a[1]);if(d>best){best=d;angle=Math.atan2(c[1]-a[1],c[0]-a[0]);}}
 const cx=ring.reduce((s,p)=>s+p[0],0)/ring.length,cz=ring.reduce((s,p)=>s+p[1],0)/ring.length,c=Math.cos(angle),s=Math.sin(angle);
 const pts=ring.map(([x,z])=>[(x-cx)*c+(z-cz)*s,-(x-cx)*s+(z-cz)*c]);
 // Parallel 45-degree gables keep the tarred roof below its own gallery.
 const minV=Math.min(...pts.map(p=>p[1])),maxV=Math.max(...pts.map(p=>p[1]));
 const count=Math.ceil((maxV-minV)/(2*(maxRidge-eave))),span=(maxV-minV)/count;
 const breaks=Array.from({length:count*2+1},(_,i)=>minV+i*span/2);
 const height=v=>{const f=Math.max(0,Math.min(count-1,Math.floor((v-minV)/span))),mid=minV+(f+.5)*span;return eave+Math.max(0,span/2-Math.abs(v-mid));};
 const splitEdge=(a,d)=>[a,...breaks.filter(v=>(v-a[1])*(v-d[1])<0).sort((u,v)=>(u-v)*Math.sign(d[1]-a[1])).map(v=>[a[0]+(v-a[1])/(d[1]-a[1])*(d[0]-a[0]),v]),d];
 const P=(u,y,v)=>[cx+u*c-v*s,y,cz+u*s+v*c];
 const pos=[],idx=[];
 const tri=(a,c,d)=>{const i=pos.length/3;pos.push(...a,...c,...d);idx.push(i,i+1,i+2);};
 let area=0;for(let i=0;i<pts.length;i++){const a=pts[i],d=pts[(i+1)%pts.length];area+=a[0]*d[1]-d[0]*a[1];}
 if(area>0)pts.reverse();
 for(let i=0;i<pts.length;i++){
  const a=pts[i],d=pts[(i+1)%pts.length];const split=splitEdge(a,d);
  for(let j=0;j<split.length-1;j++){const a=split[j],d=split[j+1],A=P(a[0],0,a[1]),D=P(d[0],0,d[1]),AT=P(a[0],height(a[1]),a[1]),DT=P(d[0],height(d[1]),d[1]);tri(A,D,AT);tri(D,DT,AT);}
 }
 let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();b.put(g,wall);
 for(let i=0;i<pts.length;i++){
  const a=pts[i],d=pts[(i+1)%pts.length],split=splitEdge(a,d);
  for(let j=0;j<split.length-1;j++)if(Math.abs(split[j+1][1]-split[j][1])>0.1)b.bar('green',P(split[j][0],height(split[j][1])+.13,split[j][1]),P(split[j+1][0],height(split[j+1][1])+.13,split[j+1][1]),.22);
 }
 for(let k=0;k<breaks.length-1;k++){
  let out=pts;
  for(const [cut,sign] of [[breaks[k],1],[breaks[k+1],-1]]){
   const clipped=[];for(let i=0;i<out.length;i++){const a=out[i],d=out[(i+1)%out.length];if((a[1]-cut)*sign>=-1e-7)clipped.push(a);if((a[1]-cut)*(d[1]-cut)<0){const t=(cut-a[1])/(d[1]-a[1]);clipped.push([a[0]+t*(d[0]-a[0]),cut]);}}out=clipped;
  }
  out=out.filter((p,i)=>Math.hypot(p[0]-out[(i+1)%out.length][0],p[1]-out[(i+1)%out.length][1])>1e-6);
  if(out.length<3)continue;
  const faces=THREE.ShapeUtils.triangulateShape(out.map(p=>new THREE.Vector2(...p)),[]),v=out.flatMap(p=>P(p[0],height(p[1])+0.04,p[1]));g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(faces.flat());g.computeVertexNormals();if(g.attributes.normal.getY(0)<0){g.setIndex(faces.map(f=>f.reverse()).flat());g.computeVertexNormals();}if(onSupport)onSupport(name+':shed roof:'+k,g.clone());b.put(g,roof);
 }
 // Door and two warehouse windows on the long side. Frames are small facade reliefs.
 const min=Math.min(...pts.map(p=>p[0])),max=Math.max(...pts.map(p=>p[0]));
 for(const u of [min+(max-min)*0.25,min+(max-min)*0.7])for(const side of [-1,1]){
  const cuts=[];for(let i=0;i<pts.length;i++){const a=pts[i],d=pts[(i+1)%pts.length];if((u-a[0])*(u-d[0])<=0 && Math.abs(d[0]-a[0])>1e-6)cuts.push(a[1]+(u-a[0])/(d[0]-a[0])*(d[1]-a[1]));}
  const v=side<0?Math.min(...cuts):Math.max(...cuts),frame=new THREE.BoxGeometry(0.95,1.2,0.15);frame.rotateY(-angle);frame.translate(...P(u,1.4,v+side*0.10));b.put(frame,'trim');
  const pane=new THREE.BoxGeometry(0.72,0.94,0.08);pane.rotateY(-angle);pane.translate(...P(u,1.4,v+side*0.22));b.put(pane,'glass');
 }
}
