import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './mississauga-civic-centre-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const t=Math.atan2(LOCAL_RINGS[0][1][1]-LOCAL_RINGS[0][0][1],LOCAL_RINGS[0][1][0]-LOCAL_RINGS[0][0][0]),rings=LOCAL_RINGS.map(r=>r.map(([x,z])=>[x*Math.cos(t)+z*Math.sin(t),-x*Math.sin(t)+z*Math.cos(t)]));
const [front,hall,office,step,clock,council,skylight]=rings;
solid(front,0,14,'stone','roof',{bottom:1,top:12.7,dy:3.4,h:2.1,pitch:near?3.6:6.5,ratio:.56});solid(hall,0,20,'stone','stone',{bottom:1,top:13.5,dy:3.4,h:2.1,pitch:near?3.6:6.5,ratio:.5});
// Broad low barn roof follows the exact irregular envelope, split at its mapped ridge.
const us=hall.map(p=>p[0]),mid=(Math.min(...us)+Math.max(...us))/2,half=(Math.max(...us)-Math.min(...us))/2,roofY=u=>20+8*Math.max(0,1-Math.abs(u-mid)/half);
function clip(r,less){let out=[];for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],ia=less?a[0]<=mid:a[0]>=mid,ic=less?c[0]<=mid:c[0]>=mid;if(ia)out.push(a);if(ia!==ic){const k=(mid-a[0])/(c[0]-a[0]);out.push([mid,a[1]+k*(c[1]-a[1])]);}}return out;}
for(const r of [clip(hall,true),clip(hall,false)])for(const tri of THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[]))face('roof',tri.map(i=>[r[i][0],roofY(r[i][0]),r[i][1]]),[0,1,0]);
const hallSign=Math.sign(hall.reduce((s,p,i)=>s+p[0]*hall[(i+1)%hall.length][1]-hall[(i+1)%hall.length][0]*p[1],0));
for(let i=0;i<hall.length;i++){const a=hall[i],c=hall[(i+1)%hall.length],q=[a];if((a[0]-mid)*(c[0]-mid)<0){const k=(mid-a[0])/(c[0]-a[0]);q.push([mid,a[1]+k*(c[1]-a[1])]);}q.push(c);for(let j=0;j<q.length-1;j++){const a=q[j],c=q[j+1];face('stone',[[a[0],20,a[1]],[c[0],20,c[1]],[c[0],roofY(c[0]),c[1]],[a[0],roofY(a[0]),a[1]]],[hallSign*(c[1]-a[1]),0,hallSign*(a[0]-c[0])]);}}
// Administrative block and receding small upper storeys.
solid(office,20,38,'stone','stone',{bottom:20.5,top:37.7,dy:3,h:1.8,pitch:near?3.2:5.8,ratio:.5});solid(step,38,41,'stone','stone',{bottom:38.4,top:40.9,dy:2,h:1.7,pitch:near?3.5:6,ratio:.4});
const C=r=>r.reduce((s,p)=>[s[0]+p[0]/r.length,s[1]+p[1]/r.length],[0,0]),oc=C(step),scaled=(r,k)=>r.map(p=>[oc[0]+(p[0]-oc[0])*k,oc[1]+(p[1]-oc[1])*k]);
solid(scaled(step,.78),41,44,'stone','stone',{bottom:41.4,top:43.8,dy:2,h:1.2,pitch:near?3.5:6,ratio:.4});solid(scaled(step,.55),44,47,'stone','roof',{bottom:44.3,top:46.8,dy:2,h:1.1,pitch:near?3.5:6,ratio:.4});
const top=scaled(step,.55);for(let i=0;i<top.length;i++){const j=(i+1)%top.length;face('roof',[[top[i][0],47,top[i][1]],[top[j][0],47,top[j][1]],[oc[0],51.5,oc[1]]],[0,1,0]);}
solid(council,0,33.4,'stone','roof');const cc=C(council);loft([{x:cc[0],z:cc[1],y:33.4,r:17.3},{x:cc[0],z:cc[1],y:35,r:17.3}],'roof',near?32:20);
// Clock tower base is rigid and grounded. Four columns support every rail and crossed brace.
solid(clock,0,38,'stone','stone',{bottom:1,top:36.5,dy:4.2,h:2.3,pitch:near?3.3:6,ratio:.37});const kc=C(clock),P=clock.map(p=>[kc[0]+(p[0]-kc[0])*.9,kc[1]+(p[1]-kc[1])*.9]);
for(const p of P)box('column',[p[0],56.75,p[1]],[.48,37.5,.48]);
for(let k=0;k<=4;k++){const y=38+k*9.375;for(let i=0;i<4;i++){const a=P[i],c=P[(i+1)%4];bar('frame',[a[0],y,a[1]],[c[0],y,c[1]],.28,.28);if(k<4){const top=y+9.375;bar('brace',[a[0],y,a[1]],[c[0],top,c[1]],.2,.2);bar('brace',[c[0],y,c[1]],[a[0],top,a[1]],.2,.2);}}}
cap('clock',clock,75.5,-1);cap('clock',clock,86.5);
// Four clock faces are tiled around circular dials; the hands replace the dial surface (no overlays).
for(let i=0;i<4;i++){const a=clock[i],c=clock[(i+1)%4],len=Math.hypot(c[0]-a[0],c[1]-a[1]),dx=(c[0]-a[0])/len,dz=(c[1]-a[1])/len,out=[(a[0]+c[0])/2-kc[0],0,(a[1]+c[1])/2-kc[1]],point=(s,y)=>[a[0]+dx*s,y,a[1]+dz*s],n=near?32:16,cy=81.8,r=3.1,disc=Array.from({length:n},(_,j)=>[len/2+Math.cos(j*2*Math.PI/n)*r,cy+Math.sin(j*2*Math.PI/n)*r]),windows=[-.22,0,.22].map(k=>[[len/2+len*k-.35,76.8],[len/2+len*k+.35,76.8],[len/2+len*k+.35,77.5],[len/2+len*k-.35,77.5]]),outer=[[0,75.5],[len,75.5],[len,86.5],[0,86.5]],holes=[disc,...windows],all=[...outer,...holes.flat()];
 for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p)))))face('clock',tri.map(j=>point(...all[j])),out);for(const h of windows)face('glass',h.map(p=>point(...p)),out);
 const hands=[[-.13,-.13],[.13,-.13],[.13,2.5],[-.13,2.5],[-.13,.13],[-1.8,.13],[-1.8,-.13]].map(([x,y])=>[len/2+x,cy+y]),both=[...disc,...hands];for(const tri of THREE.ShapeUtils.triangulateShape(disc.map(p=>new THREE.Vector2(...p)),[hands.map(p=>new THREE.Vector2(...p))]))face('dial',tri.map(j=>point(...both[j])),out);for(const tri of THREE.ShapeUtils.triangulateShape(hands.map(p=>new THREE.Vector2(...p)),[]))face('glass',tri.map(j=>point(...hands[j])),out);
}
for(let i=0;i<4;i++){const a=clock[i],c=clock[(i+1)%4];face('roof',[[a[0],86.5,a[1]],[c[0],86.5,c[1]],[kc[0],92,kc[1]]],[0,1,0]);}
return finish(-t);

}
