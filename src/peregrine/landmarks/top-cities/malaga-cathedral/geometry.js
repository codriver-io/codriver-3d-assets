import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './malaga-cathedral-parts.js';
export const APSE=[[-28,-22],[-28,-32],[-22.65,-48.46],[-8.65,-58.63],[8.65,-58.63],[22.65,-48.46],[28,-32],[28,-22]];
export const HIP_HUB=[0,48.5,-22];
export function rafters(detail){const n=detail==='far'?3:6,out=[];for(let i=1;i<APSE.length;i++)for(let j=0;j<n;j++){const u=j/n;out.push([APSE[i-1][0]*(1-u)+APSE[i][0]*u,37.6,APSE[i-1][1]*(1-u)+APSE[i][1]*u]);}out.push([28,37.6,-22]);return out;}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,cyl,bar,poly,lathe}=k, bellMat=near?'bell':'iron';
 function bearingBar(mat,a,b,w){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av),g=new THREE.BoxGeometry(w,v.length(),w),ix=Array.from(g.index.array);g.setIndex([...ix.slice(0,12),...ix.slice(24)]);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());k.put(g,mat);}

 // Ground-level chapel envelope follows the mapped irregular apse and stair projections.
 k.shell('stone',LOCAL_RINGS,0,11.5,[3],near?8:12);
 const upper=[[-28,53],[28,53],[28,-32],[22.65,-48.46],[8.65,-58.63],[-8.65,-58.63],[-22.65,-48.46],[-28,-32],[-28,53]];
 // Paired/tall lower windows and triplets of clerestory oculi read from the road.
 for(let i=1;i<upper.length;i++){
  if(i===1)continue; // The detailed west facade owns this face; no duplicate backing wall.
  const p=upper[i-1],q=upper[i],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),a=-Math.atan2(dz,dx),bays=Math.max(1,Math.round(L/15)),holes=[];
  for(let b=0;b<bays;b++){
   const c=(b-(bays-1)/2)*L/bays;
   for(const u of [-3,0,3]){holes.push({u:c+u,y:13,w:2.3,h:8.5,arch:true,mat:'glass'});holes.push({u:c+u,y:u?26.5:27.0,w:u?2.6:3.4,h:u?2.6:3.4,circle:true,mat:'glass'});}
  }
  wall('stone',L,11,37.2,1.6,(p[0]+q[0])/2-Math.sin(a)*1.6,(p[1]+q[1])/2-Math.cos(a)*1.6,a,holes);
  const beam=new THREE.BoxGeometry(L+.8,.6,1.8);beam.rotateY(a);beam.translate((p[0]+q[0])/2+Math.sin(a)*.25,37.5,(p[1]+q[1])/2+Math.cos(a)*.25);k.put(beam,'trim');
  for(let b=0;b<=bays;b++){
   const u=b/bays,x=p[0]+dx*u,z=p[1]+dz*u;box('trim',x+Math.sin(a)*.52,25.0,z+Math.cos(a)*.52,1.1,24.6,1.1,a);
  }
 }
 // West facade: three deep arcaded portals, red-grey marble pairs and upper lanterns.
 wall('stone',47,0,22,1.0,0,53.8,0,[-14,0,14].map(u=>({u,y:.4,w:8.8,h:18,arch:true})));
 for(const x of [-14,0,14]){
  wall('stone',11.4,0,21.8,.7,x,51.8,0,[{u:0,y:.4,w:4,h:7.2,arch:true,mat:'glass'}]);
  for(const s of [-1,1]){cyl('marble',x+s*2.8,52.85,.35,.32,.4,9.7,near?10:4);cyl('marble',x+s*4.9,54.9,.6,.54,.4,21.6,near?12:4);box('trim',x+s*4.9,21.5,54.9,1.65,.7,1.65);}
  const med=new THREE.CircleGeometry(1.8,near?24:14);med.translate(x,12.5,52.65);k.put(med,'marble');
 }
 box('trim',0,22.1,53.9,48,1.0,3.5);
 wall('stone',47,22.6,40.0,.9,0,53.8,0,[-14,0,14].flatMap(u=>[{u,y:24.0,w:8.4,h:10.5,arch:true,mat:'glass'},{u,y:36.2,w:2.7,h:2.7,circle:true,mat:'glass'}]));
 for(const x of [-22,-7,7,22])for(const d of [-.6,.6])cyl('marble',x+d,54.8,.35,.33,22.6,39.8,near?10:4);
 box('trim',0,40.15,53.9,48,.7,3.3);
 // October2026 triangular pediment. Future proposed statues are intentionally absent.
 const front=55.0,back=53.7;
 poly('stone',[[-23.5,40.5,front],[23.5,40.5,front],[0,49.6,front],[-23.5,40.5,back],[23.5,40.5,back],[0,49.6,back]],[0,1,2,3,5,4,0,3,4,0,4,1,0,2,5,0,5,3,1,4,5,1,5,2]);
 bar('trim',[-23.5,40.5,55.1],[0,49.6,55.1],.5,.7);bar('trim',[0,49.6,55.1],[23.5,40.5,55.1],.5,.7);
 // New pitched nave underlay, and the currently exposed timber hips around the apse.
 const ridgeStart=-22;
 for(const s of [-1,1]){
  const q=[[0,48.5,ridgeStart],[s*28,37.6,ridgeStart],[s*28,37.6,53.8],[0,48.5,53.8]];
  const cross=new THREE.Vector3().subVectors(new THREE.Vector3(...q[1]),new THREE.Vector3(...q[0])).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...q[2]),new THREE.Vector3(...q[0])));if(cross.y<0)q.reverse();poly('roof',q,[0,1,2,0,2,3]);poly('roof',q.map(p=>[p[0],p[1]-.35,p[2]]),[2,1,0,3,2,0]);
 }
 // Named ridge beam supports every primary hip crown, embedded in its end station.
 box('timber',0,48.4,15.65,.85,.6,76.3);
 for(const p of rafters(detail))bearingBar('timber',p,HIP_HUB,near?.23:.3);
 for(const t of [.3,.6])for(let i=1;i<APSE.length;i++){
  const p=APSE[i-1],q=APSE[i];bearingBar('purlin',[p[0]*(1-t),37.6+(48.5-37.6)*t,p[1]*(1-t)-22*t],[q[0]*(1-t),37.6+(48.5-37.6)*t,q[1]*(1-t)-22*t],.18);
 }
 // Completed north tower and the deliberately unfinished south tower.
 for(const [x,h] of [[-27,55.5],[27,42.5]]){
  const hs={};for(const face of ['south','north','east','west'])hs[face]=[{u:0,y:26,w:3.2,h:7.5,arch:true,mat:'glass'}];
  k.block('stone',x,45,14.2,15.0,0,39.5,hs);
  for(const y of [21.9,39.5])box('trim',x,y,45,15.3,.8,16.0);
  if(x>0){box('stone',x,41.2,45,13.6,2.6,14.3);for(const u of [-5.5,0,5.5])for(const z of [39.4,50.6])cyl('stone',x+u,z,.5,.5,42.5,47.3,near?10:4);continue;}
  for(let i=0;i<4;i++){
   const a=i*Math.PI/2,s=Math.sin(a),c=Math.cos(a),holes=[{u:0,y:41.0,w:4.4,h:10.8,arch:true},{u:-4.5,y:42.5,w:1.8,h:5.4,arch:true},{u:4.5,y:42.5,w:1.8,h:5.4,arch:true}];
   wall('stone',14.2,39.9,55.5,.8,x+6.3*s,45+6.3*c,a,holes);
   for(const u of [-6,-3.2,3.2,6]){cyl('trim',x+u*c+7.45*s,45-u*s+7.45*c,.34,.3,40.2,55.3,near?10:4);}
  }
  box('trim',x,55.6,45,16.4,.8,16.4);
  const r=7.1,faces=8,w=2*r*Math.tan(Math.PI/8);
  for(let i=0;i<faces;i++){const a=i*2*Math.PI/faces;wall('stone',w,56,68.6,.8,x+(r-.7)*Math.sin(a),45+(r-.7)*Math.cos(a),a,[{u:0,y:57.2,w:3.9,h:9.7,arch:true}]);}
  cyl('trim',x,45,7.7,7.7,68.5,69.3,near?32:12);
  k.dome('stone',x,45,7.2,69.3,10.0);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;cyl('trim',x+6.6*Math.sin(a),45+6.6*Math.cos(a),.35,.2,69.1,70.9,near?8:5);}
  for(let i=0;i<4;i++){const a=i*Math.PI/2;wall('stone',3.9,79.3,83.9,.5,x+1.45*Math.sin(a),45+1.45*Math.cos(a),a,[{u:0,y:79.8,w:1.25,h:3.0,arch:true}]);}
  k.dome('trim',x,45,2.1,83.9,1.9);cyl('iron',x,45,.13,.08,85.7,87,near?8:5);
  // Visible, supported bell groups inside both belfry levels.
  for(const z of [40.5,49.5])for(const u of [-4.5,0,4.5]){cyl(bellMat,x+u,z,.55,.25,45.5,46.8,near?12:4);bar(bellMat,[x+u,46.5,z],[x+u,55.4,z],.13);}
  for(const u of [-3.5,3.5]){cyl(bellMat,x+u,45,.7,.3,61,62.8,near?12:4);bar(bellMat,[x+u,62.5,45],[x+u,68.8,45],.15);}
 }
 const m=k.finish();m.userData.features=['one87m bell tower','unfinished south tower','three polychrome portals','October2026pediment','partly clad2026timber roof'];return m;
}
