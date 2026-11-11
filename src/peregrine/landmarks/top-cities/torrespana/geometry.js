import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {kit} from './torrespana-parts.js';
export const GALLERIES=[[153.7,154.7,5.3],[156.7,157.7,4.1],[162.7,163.7,3.65],[166.7,167.7,3.2],[172.1,173.1,2.6]];
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,cyl,lathe,bar,quad}=k,n=near?40:24;
 cyl('concrete',0,0,14.75,14.75,0,.4,n);
 lathe('concrete',0,0,[[0,.4],[5.1,.4],[4.6,2],[4.5,132.7],[0,132.7]],n);
 // Broad dark equipment head and the projecting upper gallery are separate real rings.
 lathe('dark',0,0,[[0,132.65],[4.5,132.65],[9.5,135.2],[9.5,137.9],[12,137.9],[12,142.1],[9.5,142.1],[9.5,147.7],[0,147.7]],n);
 lathe('concrete',0,0,[[0,147.7],[9.5,147.7],[9.4,148.3],[5.2,151.5],[2,153.7],[2,173.1],[1.1,175.1],[1.1,180],[0,180]],n);
 // Separate small equipment panes preserve the rhythm rather than a single featureless black band.
 for(let i=0;i<(near?28:14);i++){
  const a=(i+.5)*2*Math.PI/(near?28:14),da=.6*Math.PI/(near?28:14),r=12.05;
  quad('steel',[r*Math.sin(a-da),139.9,r*Math.cos(a-da)],[r*Math.sin(a+da),139.9,r*Math.cos(a+da)],[r*Math.sin(a+da),141.25,r*Math.cos(a+da)],[r*Math.sin(a-da),141.25,r*Math.cos(a-da)]);
 }
 // Lower microwave dishes: planar circular faces joined by short backed conical housings.
 for(let i=0;i<(near?14:10);i++){
  const a=i*2*Math.PI/(near?14:10),r=9.55,x=Math.sin(a)*r,z=Math.cos(a)*r;
  const g=new THREE.ConeGeometry(1.12,.6,near?16:10,1,false);g.rotateX(Math.PI/2);g.rotateY(a);g.translate(x,135.4,z);k.put(g,'dish');
 }
 for(const [lo,hi,r] of GALLERIES){
  cyl('concrete',0,0,r,r,lo,hi,n);
  // Ring railings remain attached to the continuous core via gallery floors.
  const count=near?18:10;
  for(let i=0;i<count;i++){const a=i*2*Math.PI/count,b=(i+1)*2*Math.PI/count;bar('steel',[r*.94*Math.sin(a),hi-.05,r*.94*Math.cos(a)],[r*.94*Math.sin(a),hi+.7,r*.94*Math.cos(a)],.09);bar('steel',[r*.94*Math.sin(a),hi+.7,r*.94*Math.cos(a)],[r*.94*Math.sin(b),hi+.7,r*.94*Math.cos(b)],.08);}
 }
 // Dark equipment enclosures between the upper galleries, visible in skyline references.
 for(const [lo,hi,r] of [[154.7,156.7,3.75],[157.7,162.7,3.35],[163.7,166.7,2.95],[167.7,172.1,2.45],[173.1,177.8,1.5]]){
  cyl('dark',0,0,r,r,lo,hi,n);
  for(let i=0;i<(near?12:8);i++){const a=i*2*Math.PI/(near?12:8),da=.2/(r+.12),R=r+.12;quad('steel',[R*Math.sin(a-da),lo+.3,R*Math.cos(a-da)],[R*Math.sin(a+da),lo+.3,R*Math.cos(a+da)],[R*Math.sin(a+da),hi-.3,R*Math.cos(a+da)],[R*Math.sin(a-da),hi-.3,R*Math.cos(a-da)]);}
 }
 // Four tapering lattice uprights rooted in the mapped upper structural core.
 const sections=[173,179,185,191,197,200];
 for(let side=0;side<4;side++){
  const a=side*Math.PI/2,b=(side+1)*Math.PI/2;
  const p=(t,angle)=>[(1.0-(t-173)*.018)*Math.sin(angle),t,(1.0-(t-173)*.018)*Math.cos(angle)];
  for(let i=1;i<sections.length;i++){const lo=sections[i-1],hi=sections[i];bar('red',p(lo,a),p(hi,a),.12);if(near||i%2===1)bar('red',p(lo,a),p(hi,b),.08);bar('red',p(hi,a),p(hi,b),.08);}
 }
 // Solid, alternating mast sections meet directly and end at the documented adopted tip height.
 for(let i=0;i<6;i++){const lo=200+i*31/6,hi=200+(i+1)*31/6;const rb=.48-(lo-200)*.010,rt=.48-(hi-200)*.010;cyl(i%2?'cream':'red',0,0,rb,rt,lo,hi,near?12:8);}
 const m=k.finish();m.userData.features=['long132.7m shaft','24m equipment head','five narrowing aerial galleries','circular microwave dishes','231m striped mast'];return m;
}
