import * as THREE from 'three';import polygonClipping from 'polygon-clipping';import {SPEC,PALETTES} from './config.js';import {kit} from './savage-mill-kit.js';
const PLANS=[{"id":138508601,"p":[[18.401,13.359],[-1.58,13.31],[-1.539,2.857],[4.627,2.828],[5,-32.18],[27.183,-32.088],[27.173,-23.95],[18.522,-24.067]]},{"id":138508602,"p":[[43.253,13.31],[42.922,26.978],[-1.476,26.737],[-1.58,13.31]]},{"id":116605963,"p":[[-11.406,29.391],[-41.836,29.397],[-41.814,0.33],[-45.129,0.298],[-45.199,-8.553],[-41.797,-8.532],[-41.764,-32.433],[-7.649,-32.258],[-7.665,-25.312],[-11.239,-25.346],[-11.374,2.896],[-1.539,2.857],[-1.476,26.737],[-11.407,26.763]]}];
function inside(x,z,p){let yes=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
function splitEdge(plan,a,b,ang){
 const dx=b[0]-a[0],dz=b[1]-a[1],L2=dx*dx+dz*dz,cuts=[0,1];
 for(const other of PLANS)if(other!==plan)for(const q of other.p){const t=((q[0]-a[0])*dx+(q[1]-a[1])*dz)/L2;if(t>0&&t<1&&Math.abs(dx*(q[1]-a[1])-dz*(q[0]-a[0]))/Math.sqrt(L2)<.8)cuts.push(t);}
 cuts.sort((a,b)=>a-b);const out=[];for(let i=0;i<cuts.length-1;i++){const t0=cuts[i],t1=cuts[i+1];if((t1-t0)*Math.sqrt(L2)<.2)continue;const mid=(t0+t1)/2,x=a[0]+mid*dx,z=a[1]+mid*dz,nx=Math.sin(ang),nz=Math.cos(ang);let base=0;for(const other of PLANS)if(other!==plan&&inside(x+nx*.2,z+nz*.2,other.p))base=Math.max(base,other.id===138508602?14.4:10.95);out.push({a:[a[0]+t0*dx,a[1]+t0*dz],b:[a[0]+t1*dx,a[1]+t1*dz],base});}return out;
}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,quad,cyl,lathe,beam,put}=k;
 function roofX(x0,x1,z,w,eave,peak){
  const p=[[x0,eave,z-w/2],[x1,eave,z-w/2],[x1,peak,z],[x0,peak,z],[x0,eave,z+w/2],[x1,eave,z+w/2]];
  quad('roof',p[0],p[1],p[2],p[3],[0,1,-1]);quad('roof',p[3],p[2],p[5],p[4],[0,1,1]);quad('roof',p[0],p[3],p[4],p[4],[-1,0,0]);quad('roof',p[1],p[5],p[2],p[2],[1,0,0]);
 }
 for(const plan of PLANS){
  const card=plan.id===138508602,top=card?14.4:10.6;
  const shape=new THREE.Shape(plan.p.map(([x,z])=>new THREE.Vector2(x,-z))),floor=new THREE.ExtrudeGeometry(shape,{depth:.45,bevelEnabled:false});floor.rotateX(-Math.PI/2);put(floor,card?'stone':'brick');
  // Signed ring area controls which single-sided panes face the street.
  const area=plan.p.reduce((a,p,i)=>{const q=plan.p[(i+1)%plan.p.length];return a+p[0]*q[1]-q[0]*p[1];},0);
  for(let i=0;i<plan.p.length;i++){
   const a=plan.p[i],b=plan.p[(i+1)%plan.p.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),ang=-Math.atan2(dz,dx)+(area>0?Math.PI:0),x=(a[0]+b[0])/2,z=(a[1]+b[1])/2;
   for(const edge of splitEdge(plan,a,b,ang)){const len=Math.hypot(edge.b[0]-edge.a[0],edge.b[1]-edge.a[1]),x=(edge.a[0]+edge.b[0])/2,z=(edge.a[1]+edge.b[1])/2,base=edge.base;
   const n=Math.floor(len/(card?(near?2.8:5.6):(near?4.1:6.3))),lower=[],upper=[];
   if(n>0&&len>3.4)for(let j=0;j<n;j++){
    const u=(j-(n-1)/2)*len/n;
    if(card){for(const y of [1.0,4.4,7.8])lower.push({u,y,w:1.12,h:2.35,arch:true,mat:'glass'});upper.push({u,y:11.5,w:1.12,h:2.0,arch:true,mat:'glass'});}
    else for(const [y,h] of [[1.0,3.9],[6.2,2.9]])lower.push({u,y,w:1.7,h,arch:true,mat:'glass'});
   }
   if(card){if(base<10.8)wall('stone',len,base,10.8,.55,x,z,ang,lower.filter(o=>o.y>base+.05));if(base<top)wall('brick',len,Math.max(10.8,base),top,.55,x,z,ang,upper.filter(o=>o.y>base+.05));}
   else if(base<top)wall('brick',len,base,top,.55,x,z,ang,lower.filter(o=>o.y>base+.05));
   }
  }
  if(!card){const pieces=polygonClipping.difference([plan.p],[[[-2.65,3.7],[6.05,3.7],[6.05,12.3],[-2.65,12.3],[-2.65,3.7]]]);for(const polygon of pieces){const roofShape=new THREE.Shape(polygon[0].map(([x,z])=>new THREE.Vector2(x,-z)));for(const hole of polygon.slice(1))roofShape.holes.push(new THREE.Path(hole.map(([x,z])=>new THREE.Vector2(x,-z))));const g=new THREE.ExtrudeGeometry(roofShape,{depth:.35,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,top-.02,0);put(g,'roof');}}
 }
 // Carding's long roof and eight-column open belfry are separate silhouettes.
 roofX(-1.2,43.4,19.7,14.2,14.4,19.2);
 const bx=34.5,bz=19.7;
 cyl('trim',bx,bz,1.25,1.25,18.9,19.55,8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;cyl('trim',bx+Math.sin(a)*.88,bz+Math.cos(a)*.88,.10,.10,19.45,21.7,near?6:4);}
 lathe('copper',bx,bz,[[0,21.65],[1.38,21.65],[1.25,22.15],[.75,22.55],[.10,22.7],[0,22.7]],near?20:12);
 // Light wells and low monitors retain the industrial roof rhythm in far.
 for(const z of [-24,-13,-2,9,20]){
  box('trim',-28.7,11.2,z,8,.9,3.5);box('glass',-28.7,11.75,z,7.2,.2,2.8);
 }
 // The courtyard brick stair tower is mapped by the westward foot of Spinning.
 const tx=1.7,tz=8.0,w=7.4,shaft=21.6;
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;
  wall('brick',w,0,shaft,.6,tx+Math.sin(a)*w/2,tz+Math.cos(a)*w/2,a,[{u:0,y:1.1,w:1.6,h:3.7,arch:true,mat:'glass'},{u:0,y:6.7,w:1.6,h:3.7,arch:true,mat:'glass'},{u:0,y:12.3,w:1.6,h:3.7,arch:true,mat:'glass'},{u:0,y:17.8,w:1.6,h:2.4,arch:true,mat:'glass'}]);
  for(const side of [-1,1]){const x=tx+Math.sin(a)*w/2+side*(w/2-.32)*Math.cos(a),z=tz+Math.cos(a)*w/2-side*(w/2-.32)*Math.sin(a);box('brick',x,10.4,z,.55,20.8,.55);}
  const n=near?12:5;for(let j=0;j<n;j++){const u=(j-(n-1)/2)*w/n,x=tx+Math.sin(a)*4.1+u*Math.cos(a),z=tz+Math.cos(a)*4.1-u*Math.sin(a);box('brick',x,20.9,z,.30,.85,.5,a);}
 }
 box('brick',tx,21.45,tz,8.4,.65,8.4);
 const g=new THREE.CylinderGeometry(0,5.8,5.6,4,1,false);g.rotateY(Math.PI/4);g.translate(tx,24.4,tz);put(g,'roof');
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2,x=tx+Math.sin(a)*3.0,z=tz+Math.cos(a)*3.0;
  wall('trim',1.4,22.9,24.5,.28,x,z,a,[{u:0,y:23.1,w:.8,h:.95,mat:'glass'}]);
  const q=new THREE.BoxGeometry(1.6,.25,1.3);q.rotateY(a);q.translate(x,24.55,z);put(q,'roof');
 }
 beam('copper',[tx,27.1,tz],[tx,27.8,tz],.07);
 const root=k.finish();root.traverse(o=>{if(!o.isMesh)return;const g=o.geometry,p=g.attributes.position,ix=g.index.array,keep=[];for(let i=0;i<ix.length;i+=3)if(![ix[i],ix[i+1],ix[i+2]].every(j=>Math.abs(p.getY(j))<.001))keep.push(ix[i],ix[i+1],ix[i+2]);g.setIndex(keep);});root.userData.triangles=root.children.reduce((n,o)=>n+o.geometry.index.count/3,0);return root;
}
