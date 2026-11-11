import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {ALIGNMENT} from './footprint.js';
import {kit} from './santa-justa-lift-parts.js';
const path=[...ALIGNMENT].reverse();
const lengths=[0];for(let i=1;i<path.length;i++)lengths.push(lengths.at(-1)+Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]));
export const BRIDGE={length:lengths.at(-1),deckY:32.5,west:path.at(-1),east:path[0]};
export const CORBELS=[];for(const x of [-1,1])for(const z of [-1,1])CORBELS.push([[x*5.3,29.7,z*3],[x*6.5,30.0,z*3.6],[x*7.1,31.7,z*3.95]]);
export function bridgePoint(s){let i=1;while(i<lengths.length-1&&s>lengths[i])i++;const u=Math.max(0,Math.min(1,(s-lengths[i-1])/(lengths[i]-lengths[i-1])));return[path[i-1][0]+(path[i][0]-path[i-1][0])*u,path[i-1][1]+(path[i][1]-path[i-1][1])*u];}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,wall,bar,box}=k;
 function closed(m,x,y,z,w,h,d,a=0){const g=new THREE.BoxGeometry(w,h,d);g.rotateY(a);g.translate(x,y,z);k.put(g,m);}
 // Four continuous structural corner posts and six tiers of real pointed lancet openings.
 for(const x of [-5.3,5.3])for(const z of [-3,3])bar('column',[x,.1,z],[x,42.9,z],.4,.4);
 closed('deck',0,.2,0,11.4,.4,6.7);
 for(let row=0;row<6;row++){
  const y0=.45+row*5.3,y1=y0+5.0;
  for(let side=0;side<4;side++){
   const a=side*Math.PI/2,long=side%2===0,w=long?10.2:5.6,count=long?(near?5:3):3,holes=[];
   for(let i=0;i<count;i++)holes.push({u:(i-(count-1)/2)*(w-.9)/count,y:y0+.65,w:(w-.9)/count*.7,h:3.75,pointed:true});
   wall('iron',w,y0,y1,.15,long?0:(side===1?5.35:-5.35),long?(side===0?3.05:-3.05):0,a,holes);
  }
  for(const z of [-3,3])bar('iron',[-5.3,y1,z],[5.3,y1,z],.28,.4);
  for(const x of [-5.3,5.3])bar('iron',[x,y1,-3],[x,y1,3],.28,.4);
  if(near)for(const z of [-3,3]){
   bar('iron',[-5.3,y0+.2,z],[5.3,y1-.1,z],.12,.12);
   bar('iron',[5.3,y0+.2,z],[-5.3,y1-.1,z],.12,.12);
  }
 }
 // Lower projecting transfer balcony and the machinery house beneath the observation crown.
 closed('deck',0,32,0,14.5,1,8.1);
 for(const points of CORBELS)for(let i=1;i<points.length;i++)bar('iron',points[i-1],points[i],.2,.2);
 const glassHoles=(w,n)=>Array.from({length:n},(_,i)=>({u:(i-(n-1)/2)*(w-.8)/n,y:37.7,w:(w-.8)/n*.65,h:3.8,pointed:true,mat:'glass'}));
 for(let side=0;side<4;side++){
  const a=side*Math.PI/2,long=side%2===0,w=long?10.2:5.6;
  wall('iron',w,36.8,42.6,.15,long?0:(side===1?5.35:-5.35),long?(side===0?3.05:-3.05):0,a,glassHoles(w,long?5:3));
 }
 closed('iron',0,42.3,0,10.2,.6,5.6);
 closed('deck',0,42.9,0,13.6,.6,8.3);
 function guard(x0,x1,z0,z1,floor,top,westGap=0){
  for(const z of [z0,z1]){
   bar('iron',[x0,top-.16,z],[x1,top-.16,z],.12);bar('iron',[x0,floor+.55,z],[x1,floor+.55,z],.1);
   const n=Math.ceil((x1-x0)/(near?.55:1.1));for(let i=1;i<n;i++)bar('iron',[x0+(x1-x0)*i/n,floor,z],[x0+(x1-x0)*i/n,top-.16,z],.085);
  }
  for(const x of [x0,x1])for(const [a,b] of x===x0&&westGap?[[z0,-westGap/2],[westGap/2,z1]]:[[z0,z1]]){
   bar('iron',[x,top-.16,a],[x,top-.16,b],.12);bar('iron',[x,floor+.55,a],[x,floor+.55,b],.1);
   const n=Math.ceil((b-a)/(near?.55:1.1));for(let i=1;i<n;i++)bar('iron',[x,floor,a+(b-a)*i/n],[x,top-.16,a+(b-a)*i/n],.085);
  }
  for(const x of [x0,x1])for(const z of [z0,z1])bar('column',[x,floor,z],[x,top,z],.22);
  if(westGap)for(const z of [-westGap/2,westGap/2])bar('column',[x0,floor,z],[x0,top,z],.22);
 }
 guard(-7.1,7.1,-3.95,3.95,32.5,34.2,2.8);
 guard(-6.65,6.65,-4.0,4.0,43.2,45.0);
 // Complete covered bridge follows all three mapped controls, including its small skew.
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx),x=(a[0]+b[0])/2,z=(a[1]+b[1])/2;
  // Platform and terminal floors own their overlap, so this slab stops at those cap faces.
  const capX=BRIDGE.west[0]+1.1,xa=Math.min(a[0],-7.25),xb=Math.max(b[0],capX);
  if(xa>xb){const za=a[1]+dz*(xa-a[0])/dx,zb=a[1]+dz*(xb-a[0])/dx;closed('deck',(xa+xb)/2,32.3,(za+zb)/2,Math.hypot(xb-xa,zb-za),.4,2.5,angle);}
  closed('roof',x,36.4,z,len,.3,2.75,angle);
  const n=[Math.sin(angle),Math.cos(angle)];
  for(const sign of [-1,1]){
   bar('iron',[a[0]+n[0]*sign*.98,31.85,a[1]+n[1]*sign*.98],[b[0]+n[0]*sign*.98,31.85,b[1]+n[1]*sign*.98],.45,.9);
   bar('iron',[a[0]+n[0]*sign*1.15,34.04,a[1]+n[1]*sign*1.15],[b[0]+n[0]*sign*1.15,34.04,b[1]+n[1]*sign*1.15],.12);
  }
 }
 const guardJointS=lengths[1]*(-7.1-path[0][0])/(path[1][0]-path[0][0]);
 const stations=[...new Set([0,BRIDGE.length,guardJointS,...lengths, ...Array.from({length:Math.ceil(BRIDGE.length/(near?2.35:4.7))+1},(_,i)=>BRIDGE.length*i/Math.ceil(BRIDGE.length/(near?2.35:4.7)))])].sort((a,b)=>a-b);
 for(let i=0;i<stations.length;i++){
  const s=stations[i],p=bridgePoint(s),a=bridgePoint(Math.max(0,s-.1)),b=bridgePoint(Math.min(BRIDGE.length,s+.1)),dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz),n=[-dz/L,dx/L];
  for(const sign of [-1,1])bar('column',[p[0]+n[0]*sign*1.15,32.4,p[1]+n[1]*sign*1.15],[p[0]+n[0]*sign*1.15,36.4,p[1]+n[1]*sign*1.15],.28);
  if(!i)continue;const q=bridgePoint(stations[i-1]),mx=(p[0]+q[0])/2,mz=(p[1]+q[1])/2,len=Math.hypot(p[0]-q[0],p[1]-q[1]);if(len<.55)continue;
  const angle=-Math.atan2(p[1]-q[1],p[0]-q[0]),norm=[Math.sin(angle),Math.cos(angle)];
  for(const sign of [-1,1])wall('iron',len-.28,32.7,36.25,.1,mx+norm[0]*sign*1.1,mz+norm[1]*sign*1.1,angle+(sign<0?Math.PI:0),[{u:0,y:33.1,w:(len-.28)*.7,h:2.7,pointed:true}]);
 }
 // Current masonry terminal, with a real passage and a capped bearing at deck level.
 const [wx,wz]=BRIDGE.west;
 k.block('stone',wx-.5,wz,3.2,5.0,0,35.8,{east:[{u:0,y:32.5,w:2.4,h:3.0,arch:true}],west:[{u:0,y:32.5,w:2.4,h:3.0,arch:true,mat:'glass'}]});
 closed('stone',wx-.5,32,wz,3.2,1.0,5.0);
 const model=k.finish();model.userData.features=['pointed Neo-Gothic lancets','six iron shaft tiers','two projecting crowns','complete covered footbridge','grounded terminal bearing'];return model;
}
