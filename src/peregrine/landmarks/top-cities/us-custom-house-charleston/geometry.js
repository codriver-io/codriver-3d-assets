import * as THREE from 'three';
import {SPEC,PALETTES,MANIFEST} from './config.js';
import {kit} from './parts.js';
// Main plan follows the mapped cross; stair feet extend beyond its masonry ring.
const PLAN=[[22,-11.5],[11.8,-11.5],[11.8,-19.9],[-11.8,-19.9],[-11.8,-11.5],[-22,-11.5],[-22,11.5],[-11.8,11.5],[-11.8,19.9],[11.8,19.9],[11.8,11.5],[22,11.5]];
export function create({detail='near'}={}) {
 const k=kit(SPEC,PALETTES,detail),{near,put,box,cyl,lathe,wall,gable}=k;
 const platform=3.65;
 // Solid cross podium; attached broad steps remain grounded in both LODs.
 box('plaster',0,platform/2,0,56.3,platform,23.5);
 for(const s of [-1,1])box('plaster',0,platform/2,s*15.7,23.6,platform,8.4);
 for(const s of [-1,1]){
  const n=near?20:10,run=10.2;
  for(let i=0;i<n;i++){const h=platform*(n-i)/n,x=s*(28.15+(i+.5)*run/n);box('plaster',x,h/2,0,run/n,h,20.6);}
  for(const z of [-11.1,11.1]){
   // Stair cheeks slope with the stair flight, rather than floating over its foot.
   const a=[s*28.15,3.65,z],c=[s*38.35,.25,z];k.b.bar('plaster',a,c,.65,.75);
   box('plaster',s*28.15,2.25,z,1.5,4.5,1.5);
   box('plaster',s*38.25,.7,z,1.1,1.4,1.1);
  }
 }
 // True two-storey apertures and recessed doors around the entire cruciform body.
 for(let j=0;j<PLAN.length;j++){
  const a=PLAN[j],c=PLAN[(j+1)%PLAN.length],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx),nx=-dz/L,nz=dx/L;
  const n=Math.max(2,Math.round(L/4.6)),front=Math.abs(a[0])===22&&a[0]===c[0],holes=[];
  for(let i=0;i<n;i++){
   const u=-L/2+(i+.5)*L/n,door=front&&Math.abs(u)<1;
   holes.push({u,y:4.45,w:door?2.5:1.9,h:door?7.3:5.0,mat:door?'bronze':'glass'});
   holes.push({u,y:12.75,w:1.9,h:3.7,mat:'glass'});
  }
  wall('plaster',L,platform,18.35,.8,(a[0]+c[0])/2-nx*.8,(a[1]+c[1])/2-nz*.8,angle,holes);
  const center=[(a[0]+c[0])/2,(a[1]+c[1])/2];
  // Engaged shafts flank the window bays and remain attached to the walls.
  for(let i=0;i<=n;i++){
   const u=-L/2+i*L/n,x=center[0]+u*dx/L-nx*.06,z=center[1]+u*dz/L-nz*.06;
   cyl('plaster',x,z,.33,.29,4.1,17.8,near?8:6);
   cyl('plaster',x,z,.52,.52,17.8,18.35,8);
  }
  // Pedimented window heads, connected to the pierced masonry rather than on the glazing.
  if(near)for(let i=0;i<n;i++){
   const u=-L/2+(i+.5)*L/n;
   for(const y of [10.0,16.9]){
    const sh=new THREE.Shape([new THREE.Vector2(u-1.25,y),new THREE.Vector2(u+1.25,y),new THREE.Vector2(u,y+.55)]);
    const g=new THREE.ExtrudeGeometry(sh,{depth:.3,bevelEnabled:false});g.rotateY(angle);g.translate(center[0]-nx*.1,0,center[1]-nz*.1);put(g,'plaster');
   }
  }
 }
 // Complete six-column temple fronts. Upper order supports architraves and pediments.
 for(const s of [-1,1]){
  const x=s*27.0;
  for(let i=0;i<6;i++){
   const z=-10.3+i*4.12;
   lathe('plaster',x,z,[[0,platform],[.88,platform],[.88,3.95],[.72,4.12],[.64,4.3],[.54,17.15],[.60,17.3],[.90,17.85],[.94,18.25],[0,18.25]],8);
   if(near)for(let j=0;j<8;j++){
    const a=j*Math.PI/4,g=new THREE.SphereGeometry(1,6,4);g.scale(.24,.36,.20);g.translate(x+.70*Math.sin(a),17.68,z+.70*Math.cos(a));put(g,'plaster');
   }
   box('plaster',x,18.35,z,1.95,.35,1.95);
  }
  box('plaster',s*25.15,18.9,0,6.4,1.1,24.0);
  box('plaster',s*25.15,19.7,0,6.8,.5,24.6);
  gable('plaster',s>0?21.75:-28.55,s>0?28.55:-21.75,19.95,23.0,24.6);
  // Dentil rhythm below the raking cornice, reduced far without closing the porch.
  if(near)for(let i=0;i<30;i++)box('plaster',s*28.58,19.42,-11.8+i*.81,.28,.28,.28);
 }
 // Cross-plan cornice and open parapet balustrade, not a dark rectangular cap.
 // Partition the roof plate: masonry perimeter and inset roof share an edge, never overlap.
 const inner=PLAN.map(([x,z])=>[Math.sign(x)*(Math.abs(x)-.95),Math.sign(z)*(Math.abs(z)-.95)]);
 const shape=new THREE.Shape(PLAN.map(([x,z])=>new THREE.Vector2(x,-z)));
 shape.holes.push(new THREE.Path(inner.map(([x,z])=>new THREE.Vector2(x,-z))));
 for(const [sh,mat] of [[shape,'plaster'],[new THREE.Shape(inner.map(([x,z])=>new THREE.Vector2(x,-z))),'roof']]){
  const floor=new THREE.ShapeGeometry(sh);floor.rotateX(-Math.PI/2);floor.translate(0,18.35,0);put(floor,mat);
 }
 for(let j=0;j<PLAN.length;j++){
  const a=PLAN[j],c=PLAN[(j+1)%PLAN.length],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx);
  // Side friezes only; the front porticoes own their own entablatures.
  if(Math.abs(a[0])===22&&a[0]===c[0])continue;
  for(const [y,h,d] of [[18.75,.8,.9],[19.35,.4,1.15],[20.8,.22,.45]])k.b.box('plaster',[(a[0]+c[0])/2,y,(a[1]+c[1])/2],[L,h,d],angle);
  const n=Math.max(2,Math.round(L/(near?1.1:2.1)));
  for(let i=0;i<=n;i++){
   const t=i/n,x=a[0]+t*dx,z=a[1]+t*dz;
   cyl('plaster',x,z,.11,.16,19.55,20.7,near?6:4);
  }
 }
 const r=k.finish();r.userData.elevationDatum=MANIFEST.elevationDatum;return r;
}
