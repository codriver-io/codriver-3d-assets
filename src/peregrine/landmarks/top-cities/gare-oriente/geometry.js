import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './gare-oriente-parts.js';
export const TREES=Array.from({length:60},(_,i)=>({x:(i%4-1.5)*17,z:(Math.floor(i/4)-7)*17}));
export const treeRoot=t=>[t.x,24.4,t.z];
export const treeCorners=t=>[[-8.5,-8.5],[8.5,-8.5],[8.5,8.5],[-8.5,8.5]].map(([x,z])=>[t.x+x,35,t.z+z]);
// Six mapped full fingers and the short rounded western termination, not seven equal fingers.
export const BUS_WINGS=[-56.04,-79.24,-102.44,-125.64,-148.85,-172.05,-217].map(x=>({x,tail:x<-200?11:48}));
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,cyl,poly}=k;
 const bar=(m,a,b,w)=>{if(near)return k.bar(m,a,b,w);const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av);const g=new THREE.CylinderGeometry(w*.62,w*.62,v.length(),3,1,true);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());k.put(g,m);};
 function solid(m,x,y,z,w,h,d){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);k.put(g,m);}
 // Five longitudinal rows of open concrete viaduct arches beneath the rail platforms.
 const arches=Array.from({length:20},(_,i)=>({u:(i-9.5)*12.8,y:.3,w:10.3,h:9.8,arch:true}));
 for(const x of [-31.2,-15.6,0,15.6,31.2])wall('concrete',254,0,11.8,1.1,x,0,Math.PI/2,arches);
 solid('concrete',0,12.05,0,78,.7,260);
 // Raised platforms and eight continuous track pairs, bounded by supported end slabs.
 for(let i=0;i<4;i++)solid('concrete',(i-1.5)*17,12.65,0,6,.5,250);
 for(let i=0;i<8;i++){const x=(i-3.5)*8.5;for(const s of [-1,1])solid('track',x+s*.72,12.48,0,.14,.16,258);}
 for(const t of TREES){
  cyl('column',t.x,t.z,.48,.34,12.3,24.6,near?8:3);
  const root=treeRoot(t),corners=treeCorners(t);
  for(const p of corners)bar('steel',root,p,.26);
  // Interlocking faceted umbrella cells, with real folded edges rather than a flat slab.
  const center=[t.x,26.2,t.z];
  for(let i=0;i<4;i++){
   const a=corners[i],b=corners[(i+1)%4],mid=[(a[0]+b[0])/2,31.6,(a[2]+b[2])/2];
   // Winding points upward; each pane has its own recessed underside.
   for(const q of near?[[a,mid,center],[mid,b,center]]:[[a,b,center]]){const v=new THREE.Vector3().subVectors(new THREE.Vector3(...q[1]),new THREE.Vector3(...q[0])).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...q[2]),new THREE.Vector3(...q[0])));if(v.y<0)q.reverse();poly('glass',q,[0,1,2]);poly('glass',q.map(p=>[p[0],p[1]-.18,p[2]]),[2,1,0]);}
   if(near){bar('steel',a,mid,.16);bar('steel',mid,b,.16);bar('steel',root,mid,.2);}
   if(near){for(const u of [.25,.5,.75]){const p=[a[0]*(1-u)+b[0]*u,35-3.4*(1-Math.abs(u*2-1)),a[2]*(1-u)+b[2]*u];bar('steel',root,p,.09);}}
  }
 }
 // Axial west gallery and seven ribbed bus-terminal wings; their low tails stand on named piers.
 solid('concrete',-132,8.25,0,188,.7,16);
 solid('roof',-132,14.4,0,188,.35,17);
 for(const {x,tail} of BUS_WINGS){
  for(const z of [-7,7])solid('concrete',x,4,z,2.2,8,2.2);
  for(const sign of [-1,1]){
   solid('concrete',x,2.9,sign*tail,2.1,5.8,2.1);
   const n=near?12:3,points=[];
   for(let j=0;j<=n;j++){const u=j/n;points.push([x,14.35-8.1*Math.pow(u,.65),sign*(8+(tail-8)*u)]);}
   for(let j=1;j<points.length;j++){
    const a=points[j-1],b=points[j];
    // Width is bounded by the mapped curved bus canopy lobes.
    const w=13.4;
    const q=[[x-w/2,a[1],a[2]],[x+w/2,a[1],a[2]],[x+w/2,b[1],b[2]],[x-w/2,b[1],b[2]]];
    const cross=new THREE.Vector3().subVectors(new THREE.Vector3(...q[1]),new THREE.Vector3(...q[0])).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...q[2]),new THREE.Vector3(...q[0])));if(cross.y<0)q.reverse();poly('glass',q,[0,1,2,0,2,3]);poly('glass',q.map(p=>[p[0],p[1]-.25,p[2]]),[2,1,0,3,2,0]);
   }
   for(const off of [-6.7,0,6.7])for(let j=1;j<points.length;j++)bar('steel',[x+off,points[j-1][1]-.35,points[j-1][2]],[x+off,points[j][1]-.35,points[j][2]],near?.15:.22);
   bar('steel',[x,5.7,sign*tail],[x,6.2,sign*tail],1.1);
  }
 }
 // Eastern entrance fan: high spine joined to two low outer supports, open beneath.
 for(const sign of [-1,1]){
  const n=near?12:3;
  for(let j=0;j<n;j++){
   const u=j/n,v=(j+1)/n,point=t=>[40+42*t,14.5-8*Math.pow(t,.6),sign*(16-11.5*t)];const a=point(u),b=point(v),q=[a,b,[b[0],b[1],0],[a[0],a[1],0]];
   const cr=new THREE.Vector3().subVectors(new THREE.Vector3(...q[1]),new THREE.Vector3(...q[0])).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...q[2]),new THREE.Vector3(...q[0])));if(cr.y<0)q.reverse();poly('glass',q,[0,1,2,0,2,3]);poly('glass',q.map(p=>[p[0],p[1]-.25,p[2]]),[2,1,0,3,2,0]);
   for(const f of [0,.5,1])bar('steel',[a[0],a[1]-.4,a[2]*f],[b[0],b[1]-.4,b[2]*f],.2);
  }
  solid('concrete',81,3.2,sign*4.5,2.5,6.4,2.5);
 }
 const r=k.finish();r.userData.features=['60 steel trees','folded glass canopy','open concrete viaduct','eight rail tracks','seven bus canopy wings'];return r;
}
