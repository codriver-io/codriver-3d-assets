import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './cathedrale-saint-antoine-longueuil-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const theta=Math.atan2(LOCAL_RINGS[0][19][1]-LOCAL_RINGS[0][18][1],LOCAL_RINGS[0][19][0]-LOCAL_RINGS[0][18][0]);
const R=LOCAL_RINGS[0].map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]);
function clip(r,k,b,less){let out=[];for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],ia=less?a[k]<=b:a[k]>=b,ic=less?c[k]<=b:c[k]>=b;if(ia)out.push(a);if(ia!==ic){const t=(b-a[k])/(c[k]-a[k]);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
solid(clip(R,0,28,true),0,19,'stone','slate',{shape:'pointed',bottom:3,top:16,dy:9,h:6.5,pitch:near?5:8,ratio:.35});
solid(clip(R,0,28,false),0,10.5,'stone','slate',{shape:'pointed',bottom:2,top:9,dy:3.5,h:2.2,pitch:near?4:7,ratio:.38});
// Tall nave roof and crossing with a separate eight-sided drum and low dome.
let nave=R;for(const[k,b,g]of [[0,-29.5,false],[0,25.5,true],[1,-13.5,false],[1,13.5,true]])nave=clip(nave,k,b,g);
solid(nave,19,23,'stone','stone',{shape:'pointed',bottom:19.5,top:22.6,dy:3,h:2.5,pitch:near?5:8,ratio:.36});
const roofY=v=>32-Math.abs(v)*9/13.5;for(const r of [clip(nave,1,0,true),clip(nave,1,0,false)])for(const tri of THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[]))face('slate',tri.map(i=>[r[i][0],roofY(r[i][1]),r[i][1]]),[0,1,0]);
for(let i=0;i<nave.length;i++){const a=nave[i],c=nave[(i+1)%nave.length],q=[a];if(a[1]*c[1]<0){const k=-a[1]/(c[1]-a[1]);q.push([a[0]+k*(c[0]-a[0]),0]);}q.push(c);for(let j=0;j<q.length-1;j++){const a=q[j],c=q[j+1];face('stone',[[a[0],23,a[1]],[c[0],23,c[1]],[c[0],roofY(c[1]),c[1]],[a[0],roofY(a[1]),a[1]]],[c[1]-a[1],0,a[0]-c[0]]);}}
// The front ceremonial gable connects to the chamfered nave, with no exposed slot behind its screen.
for(const side of [-1,1]){face('slate',[[-30.3,25,side*7],[-30.3,35,0],[-29.5,32,0],[-29.5,roofY(side*7),side*7]],[0,1,0]);face('stone',[[-30.3,19,side*7],[-29.5,19,side*7],[-29.5,roofY(side*7),side*7],[-30.3,25,side*7]],[0,0,side]);}
solid(Array.from({length:8},(_,i)=>[12+Math.cos(i*Math.PI/4)*8.5,Math.sin(i*Math.PI/4)*8.5]),28,36.5,'stone','stone',{shape:'pointed',bottom:29.5,top:35.8,dy:5,h:4.5,pitch:4,ratio:.53});
loft([{x:12,z:0,y:36.5,r:8.5},{x:12,z:0,y:40,r:6},{x:12,z:0,y:42.5,r:2},{x:12,z:0,y:43,r:.4}],'roof',near?16:8);
// Asymmetrical front towers: the east tower carries the 81 m needle; the west has a pavilion.
for(const [v,h]of [[-9.5,40],[10,34]]){
 const r=rect(-22.5,v,8.2,8.2);solid(r,0,h,'stone','trim',{shape:'pointed',bottom:4,top:h-1,dy:8,h:5.5,pitch:near?4.5:8,ratio:.4});
 for(const [u,w]of [[-26.3,v-3.8],[-26.3,v+3.8],[-18.7,v-3.8],[-18.7,v+3.8]]){solid(rect(u,w,1.3,1.3),0,h+1.5,'trim');loft([{x:u,z:w,y:h+1.5,r:.65},{x:u,z:w,y:h+6.5,r:.03}],'roof',4);}
 if(v<0){loft([{x:-22.5,z:v,y:40,r:4.1},{x:-22.5,z:v,y:45,r:4}],'stone',8);loft([{x:-22.5,z:v,y:45,r:4},{x:-22.5,z:v,y:78.8,r:.15},{x:-22.5,z:v,y:79.5,r:.04}],'roof',near?16:8);box('metal',[-22.5,80.05,v],[.18,1.9,.18]);box('metal',[-22.5,80.4,v],[1.2,.16,.18]);}
 else loft([{x:-22.5,z:v,y:34,r:4.5},{x:-22.5,z:v,y:39,r:.2}],'roof',4);
}
// Main facade: triangulated wall with three actual pointed opening tiles and a circular rose.
const U=-30.3,outer=[[-7,0],[7,0],[7,25],[0,35],[-7,25]],holes=[];
function arch(v,w,y,h){return [[v-w/2,y],[v+w/2,y],[v+w/2,y+h*.65],[v,y+h],[v-w/2,y+h*.65]];}
for(const v of [-4.6,0,4.6])holes.push(arch(v,3.1,.4,8.7));
const nr=near?28:16,rose=Array.from({length:nr},(_,i)=>[Math.cos(i*2*Math.PI/nr)*4.8,22+Math.sin(i*2*Math.PI/nr)*4.8]);holes.push(rose);
// Local 2D coordinates here are [v,y], converted to the west-facing facade.
const all=[...outer,...holes.flat()];
// Triangulation comes from the same Three.js library as the rest of the authoring helpers.
for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(r=>r.map(p=>new THREE.Vector2(...p)))))face('trim',tri.map(i=>[U,all[i][1],all[i][0]]),[-1,0,0]);
for(const [i,h]of holes.entries())face(i===3?'glass':'door',h.map(([v,y])=>[U,y,v]),[-1,0,0]);
// Rose radial tracery is inset in its dark tile, thick enough to remain in the far model.
for(let i=0;i<(near?12:8);i++){const a=i*2*Math.PI/(near?12:8);bar('trim',[U-.13,22,0],[U-.13,22+Math.sin(a)*4.45,Math.cos(a)*4.45],near?.16:.22);}
for(let i=0;i<nr;i++){const a=i*2*Math.PI/nr,c=(i+1)*2*Math.PI/nr;bar('trim',[U-.13,22+Math.sin(a)*4.78,Math.cos(a)*4.78],[U-.13,22+Math.sin(c)*4.78,Math.cos(c)*4.78],.22);}
// Repeated nave buttresses are grounded, and the roof spire remains seated in its tower.
for(const u of [-12,-3,6,15,24])for(const v of [-14,14.7])solid(rect(u,v,1.4,1.1),0,21,'trim');
return finish(-theta);

}
