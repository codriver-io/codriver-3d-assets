import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { ANGLE, freedomKit } from './freedom-tower-miami-parts.js';
export const TIERS={podium:17.6,shaft:53,crown:61,belvedere:71.2,dome:74.5,beacon:76.4,finial:78};
export function mappedPlan(){const k=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=latToMercY(SPEC.origin[1]);return FOOTPRINTS[0].map(([lng,lat])=>{const x=(lngToMercX(lng)-ox)/k,z=(oz-latToMercY(lat))/k;return [x*Math.cos(ANGLE)-z*Math.sin(ANGLE),x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];});}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=freedomKit(b,near);
 // Low printing-house wing follows the complete mapped perimeter, including shallow offsets.
 const ring=mappedPlan();k.poly('stucco',ring,0,16.1);
 // Projecting stone plinth, storey strings and roof cornice, on the actual skewed edges.
 let area=0;for(let i=1;i<ring.length;i++)area+=ring[i-1][0]*ring[i][1]-ring[i][0]*ring[i-1][1];
 for(let i=1;i<ring.length;i++){
  const [a,c]=[ring[i-1],ring[i]],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<2)continue;
  const nx=(area>0?1:-1)*dz/len,nz=(area>0?-1:1)*dx/len,angle=Math.atan2(nx,nz),x=(a[0]+c[0])/2,z=(a[1]+c[1])/2;
  k.box('stone',x+nx*.12,0,z+nz*.12,len,1.05,.45,angle);
  for(const y of [5.3,10.7,15.85])k.box('stone',x+nx*.18,y,z+nz*.18,len,.32,.5,angle);
  const count=Math.floor(len/3.65);for(let j=0;j<count;j++)for(let row=0;row<3;row++){
   const t=(j+.5)/count,u=a[0]+dx*t,v=a[1]+dz*t;
   if(nx>.9&&Math.abs(v)<3.8)continue; // The east entrance portal owns the central bay.
   k.window(u,v,1.45+row*5.1,1.55,2.6,angle,false,near||row===1);
  }
  // Roof parapet has individual balusters instead of an opaque rooftop fence.
  k.box('stone',x,16.15,z,len,.5,.8,angle);
  k.box('stone',x,17.25,z,len,.35,.85,angle);
  for(let d=.4;d<len;d+=near?.85:1.7){const t=d/len;k.box('stone',a[0]+dx*t,16.6,a[1]+dz*t,.16,.65,.16);}
 }
 // Red-tile, raised T-plan roof behind the shaft, inset within the printing wing.
 k.poly('stucco',[[-41,-5.85],[-23.6,-5.85],[-23.6,-10.7],[-6.2,-10.7],[-6.2,-5.85],[-1,-5.85],[-1,5.85],[-6.2,5.85],[-6.2,10.7],[-23.6,10.7],[-23.6,5.85],[-41,5.85]],16.1,3.2);
 for(const [u0,u1,v0,v1,rise] of [[-41,-23.6,-5.85,5.85,2.2],[-23.6,-6.2,-10.7,10.7,2.5],[-6.2,-1,-5.85,5.85,2.2]]){
  k.box('roof',(u0+u1)/2,19.3,(v0+v1)/2,u1-u0,.22,v1-v0);
  k.hip(u0,u1,v0,v1,19.52,rise);
 }
 // Tall cream/yellow shaft: eleven regular punched rows, three bays on each face.
 for(let f=0;f<4;f++){
  const a=f*Math.PI/2,nx=Math.sin(a),nz=Math.cos(a),depth=f%2?6:6.7,width=f%2?13.4:12,windows=[];
  for(let row=0;row<11;row++)for(const x of [-3.65,0,3.65])windows.push([x,19.3+row*3.0,1.4,1.95,false]);
  k.wall('stucco',depth*nx,depth*nz,17.6,width,35.4,a,windows);
  // Unbroken corner pilasters and top corbels are the shaft's only stone accents.
  for(const x of [-width/2+.33,width/2-.33])k.box('stone',depth*nx+Math.cos(a)*x,17.6,depth*nz-Math.sin(a)*x,.32,35.4,.22,a);
  if(near)for(const x of [-4.9,-2.5,0,2.5,4.9])k.box('stone',depth*nx+Math.cos(a)*x+nx*.4,51.7,depth*nz-Math.sin(a)*x+nz*.4,.42,1.2,.65,a);
 }
 // Attached corner sentry turrets immediately below the broad crown.
 for(const u of [-5.75,5.75])for(const v of [-6.35,6.35]){
  k.box('stone',u,49.9,v,1.12,2.7,1.12);
  k.cyl('copper',u,v,52.6,.65,.8,0,near?12:6);
  k.cyl('iron',u,v,53.25,.45,.045,.025,5);
 }
 k.box('stone',0,52.75,0,12.9,.55,14.3);
 // Broad square Giralda crown: tall central arch and two smaller side arches on all sides.
 for(let f=0;f<4;f++){
  const a=f*Math.PI/2,nx=Math.sin(a),nz=Math.cos(a),d=f%2?6.15:6.85,w=f%2?13.7:12.3;
  k.wall('stone',nx*d,nz*d,53.3,w,6.7,a,[[-4.1,56.1,1.28,2.2,true],[0,55.1,2.85,3.65,true],[4.1,56.1,1.28,2.2,true]]);
  k.box('stone',nx*(d+.24),54.2,nz*(d+.24),w,.28,.65,a);
  for(const x of [-w/2+.4,-2.1,2.1,w/2-.4])k.box('stone',nx*(d+.32)+Math.cos(a)*x,54.55,nz*(d+.32)-Math.sin(a)*x,.3,5.25,.3,a);
  // Grouped lower relief panels and capitals articulate the Giralda crown.
  // Same stone batch, attached to the shell; coarse profiles survive far.
  for(const x of [-4.1,4.1]){
   const u=nx*(d+.16)+Math.cos(a)*x,v=nz*(d+.16)-Math.sin(a)*x;
   k.box('stone',u,54.7,v,1.75,.22,.42,a);
   k.box('stone',u,55.65,v,1.75,.22,.42,a);
   if(near){const g=new THREE.TorusGeometry(.33,.09,4,12);g.rotateY(a);g.translate(nx*(d+.27)+Math.cos(a)*x,55.28,nz*(d+.27)-Math.sin(a)*x);k.put(g,'stone');}
   else k.box('stone',u,55.05,v,.48,.45,.36,a);
  }
  for(const x of [-w/2+.4,-2.1,2.1,w/2-.4]){
   const u=nx*(d+.27)+Math.cos(a)*x,v=nz*(d+.27)-Math.sin(a)*x;
   k.box('stone',u,59.4,v,.57,.25,.55,a);
   k.box('stone',u,59.65,v,.74,.25,.68,a);
  }
  if(near){for(const x of [-4.1,4.1]){k.cyl('stone',nx*(d+.24)+Math.cos(a)*x,nz*(d+.24)-Math.sin(a)*x,54.7,.18,.43,.43,12);}for(let x=-w/2+.4;x<w/2;x+=.62)k.box('stone',nx*(d+.25)+Math.cos(a)*x,53.35,nz*(d+.25)-Math.sin(a)*x,.15,.55,.18,a);}
 }
 k.box('stone',0,59.9,0,13.1,.2,14.5);k.box('stone',0,60.1,0,13.6,.5,15);k.box('stone',0,60.6,0,14.1,.4,15.5);
 // Eight corner/edge pinnacles give the crown its jagged, light silhouette.
 for(const u of [-6.1,0,6.1])for(const v of [-6.8,6.8])k.pinnacle(u,v,61,2.35);
 for(const u of [-6.1,6.1])k.pinnacle(u,0,61,2.35);
 // Slender octagonal belvedere. Arched recesses are real openings in the wall shell.
 const radius=3.72,apothem=radius*Math.cos(Math.PI/8),side=2*radius*Math.sin(Math.PI/8);
 k.cyl('lamp',0,0,61,1.05,4.35,3.85,8);
 for(let f=0;f<8;f++){
  const a=f*Math.PI/4,nx=Math.sin(a),nz=Math.cos(a);
  k.wall('lamp',nx*apothem,nz*apothem,62.05,side,8.1,a,[[0,63.2,1.08,5.45,true,'stone']]);
  if(f%2===1){const hole=new THREE.Shape();hole.absarc(0,0,.32,0,Math.PI*2,false);k.pane('glass',hole,nx*(apothem+.23),nz*(apothem+.23),68.55,a);}
  for(const x of [-side/2+.22,side/2-.22]){
   const u=nx*(apothem+.18)+Math.cos(a)*x,v=nz*(apothem+.18)-Math.sin(a)*x;
   k.box('lamp',u,62.1,v,.42,.38,.45,a);
   k.box('lamp',u,68.85,v,.43,.3,.48,a);
   k.box('lamp',u,69.15,v,.55,.25,.58,a);
  }
  k.box('lamp',nx*(apothem+.2),69.6,nz*(apothem+.2),side,.22,.65,a);
  for(const x of [-side/2+.22,side/2-.22])k.box('lamp',nx*(apothem+.18)+Math.cos(a)*x,62.1,nz*(apothem+.18)-Math.sin(a)*x,.22,7.95,.28,a);
 }
 k.cyl('lamp',0,0,70.15,1.05,4.3,4.3,8);
 for(let f=0;f<8;f++){const a=(f+.5)*Math.PI/4;k.pinnacle(4.05*Math.sin(a),4.05*Math.cos(a),71.2,1.1);}
 // Domed copper cap, ribs, small dark beacon lantern and a supported weather vane.
 k.cyl('stone',0,0,71.2,.38,3.25,3.25,near?24:12);
 k.lathe('copper',0,0,[[3.15,71.58],[3.1,72.0],[2.8,72.65],[2.25,73.4],[1.45,74.0],[.72,74.5],[0,74.5]],near?24:12);
 if(near)for(let i=0;i<12;i++){const a=i*Math.PI/6;for(const [r,y,rr,yy]of [[3.16,71.61,2.83,72.67],[2.83,72.67,2.28,73.43],[2.28,73.43,1.48,74.03],[1.48,74.03,.73,74.53]]){const g=new THREE.CylinderGeometry(.035,.035,Math.hypot(rr-r,yy-y),5);const p=new THREE.Vector3(r*Math.sin(a),y,r*Math.cos(a)),q=new THREE.Vector3(rr*Math.sin(a),yy,rr*Math.cos(a));g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),q.clone().sub(p).normalize()));g.translate(...p.add(q).multiplyScalar(.5).toArray());k.put(g,'iron');}}
 k.cyl('iron',0,0,74.5,.2,.8,.8,8);
 for(let f=0;f<8;f++){const a=f*Math.PI/4;k.box('iron',.58*Math.sin(a),74.7,.58*Math.cos(a),.1,1.15,.1);}
 k.cyl('copper',0,0,75.85,.12,.82,.82,near?16:8);
 k.lathe('copper',0,0,[[.8,75.85],[.83,76],[.6,76.2],[.12,76.4],[0,76.4]],near?16:8);
 k.cyl('iron',0,0,76.4,1.6,.07,.04,near?8:5);k.box('iron',0,77.35,0,1.15,.09,.1);k.cyl('iron',0,0,77.75,.2,.19,0,near?8:5);
 // Churrigueresque east portal: arched doorway, engaged paired columns, scrolled pediment.
 const portal=new THREE.Shape([new THREE.Vector2(-3.7,0),new THREE.Vector2(3.7,0),new THREE.Vector2(3.7,12.3),new THREE.Vector2(2.9,13),new THREE.Vector2(2.1,16),new THREE.Vector2(.95,16.5),new THREE.Vector2(0,19.2),new THREE.Vector2(-.95,16.5),new THREE.Vector2(-2.1,16),new THREE.Vector2(-2.9,13),new THREE.Vector2(-3.7,12.3)]);
 portal.holes.push(new THREE.Path(k.arch(2.3,4.8).getPoints(near?8:4)));
 k.shape('stone',portal,7.02,0,0,.65,Math.PI/2);k.pane('iron',k.arch(2.3,4.8),7.2,0,0,Math.PI/2);
 k.window(7.1,0,8.5,1.85,3.15,Math.PI/2,true,true);
 for(const v of [-3,-1.65,1.65,3]){k.cyl('stone',7.6,v,1.1,6.5,.24,.24,near?12:6);k.box('stone',7.6,7.5,v,.72,.4,.75);}
 k.box('stone',7.4,12.35,0,1.05,.4,6.9);
 // Low-relief medallions, broken scrolls and engaged colonnettes remain connected to the portal.
 for(const [v,y,r] of [[0,15.1,.8],[-2.8,10.5,.62],[2.8,10.5,.62]]){
  const g=new THREE.TorusGeometry(r,.17,near?6:4,near?20:10);g.rotateY(Math.PI/2);g.translate(7.48,y,v);k.put(g,'stone');
 }
 for(const v of [-2.85,2.85]){
  k.box('stone',7.45,8.1,v,.38,3.55,.38);
  k.box('stone',7.45,10.9,v,.72,.3,.72);
  if(near)for(const y of [3.2,5,6.7,9.2,11.8]){const g=new THREE.SphereGeometry(.23,8,6);g.scale(.8,1.3,1);g.translate(7.68,y,v);k.put(g,'stone');}
 }
 // Split scroll pediment around the central crest rather than a plain triangular cap.
 for(const side of [-1,1]){
  const points=Array.from({length:near?10:5},(_,i)=>{const t=i/(near?9:4);return [7.52,13.2+3.5*t,side*(3.05-2.1*t+.28*Math.sin(t*Math.PI*2))];});
  for(let i=1;i<points.length;i++){const p=new THREE.Vector3(...points[i-1]),q=new THREE.Vector3(...points[i]),g=new THREE.CylinderGeometry(.17,.17,p.distanceTo(q),near?8:5);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),q.clone().sub(p).normalize()));g.translate(...p.add(q).multiplyScalar(.5).toArray());k.put(g,'stone');}
 }

 for(const v of [-3.2,3.2])k.pinnacle(7.4,v,12.75,1.4);
 const model=b.finish();model.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');const original=o.geometry;o.geometry=mergeVertices(original,1e-7);original.dispose();});return model;
}
