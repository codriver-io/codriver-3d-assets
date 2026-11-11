import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './eglise-purification-repentigny-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const theta=Math.atan2(LOCAL_RINGS[0][1][1]-LOCAL_RINGS[0][0][1],LOCAL_RINGS[0][1][0]-LOCAL_RINGS[0][0][0]);
const R=LOCAL_RINGS[0].map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]),F=(R[0][0]+R[7][0])/2,B=Math.min(R[1][0],R[6][0]),V=(R[0][1]+R[7][1])/2,W=Math.abs(R[0][1]-R[7][1]);
const body=[];for(let i=0;i<R.length;i++){const a=R[i],c=R[(i+1)%R.length],ia=a[0]>=F+5.02,ic=c[0]>=F+5.02;if(ia)body.push(a);if(ia!==ic){const t=(F+5.02-a[0])/(c[0]-a[0]);body.push([F+5.02,a[1]+t*(c[1]-a[1])]);}}
solid(body,0,9.4,'stone','roof',{bottom:1.2,top:8.8,dy:6,h:5.5,pitch:near?4.5:7.5,ratio:.28});
const nave=rect((F+B+2.5)/2,V,W,B-F-2.5,Math.PI/2);gable(nave,9.4,17.9,'roof');
const r1=rect((B+R[6][0])/2,(R[6][1]+R[2][1])/2,R[2][1]-R[6][1],R[6][0]-B,Math.PI/2);gable(r1,9.4,15.6,'roof');
const r2=rect((R[6][0]+R[3][0])/2,(R[5][1]+R[2][1])/2,R[2][1]-R[5][1],R[3][0]-R[6][0],Math.PI/2);gable(r2,9.4,13.8,'roof');
// Front stone screen and twin grounded square towers.
solid(rect(F+2.52,V,5.04,W-9.4),0,12.4,'stone','stone',{solidOnly:true,skipEdges:[3]});

for(const v of [V-W/2+2.5,V+W/2-2.5]){
 solid(rect(F+2.5,v,5,5),0,19,'stone','trim',{skipEdges:[3],bottom:1.3,top:15.4,dy:7.5,h:5.2,pitch:4.7,ratio:.38});
 // Ring platform, eight distinct posts and a seated silver needle. Negative space is never filled.
 loft([{x:F+2.5,z:v,y:19,r:3},{x:F+2.5,z:v,y:19.45,r:3}],'cornice',8);
 for(let i=0;i<8;i++){const a=(i+.5)*Math.PI/4;box('trim',[F+2.5+Math.cos(a)*2.15,21.5,v+Math.sin(a)*2.15],[.32,4.1,.32]);}
 loft([{x:F+2.5,z:v,y:23.55,r:2.7,mat:'cornice'},{x:F+2.5,z:v,y:23.9,r:2.7,mat:'roof'},{x:F+2.5,z:v,y:31.1,r:.05}],'roof',8);
 box('metal',[F+2.5,31.55,v],[.13,.9,.13]);box('metal',[F+2.5,31.75,v],[.75,.12,.13]);
 // Front tower wall is tiled around two round-headed lights and the oculus, with no overlays.
 facade([[-2.5,0],[2.5,0],[2.5,19],[-2.5,19]],v,[round(0,1.3,1.3,4.7),round(0,1.2,9.1,4.3),circle(0,16.5,.75)]);
}
function round(v,w,y,h){const n=near?12:8,sp=y+h-w/2,r=[[v-w/2,y],[v+w/2,y]];for(let i=0;i<=n;i++){const a=i*Math.PI/n;r.push([v+Math.cos(a)*w/2,sp+Math.sin(a)*w/2]);}return r;}
function circle(v,y,r){return Array.from({length:near?20:12},(_,i)=>[v+Math.cos(i*2*Math.PI/(near?20:12))*r,y+Math.sin(i*2*Math.PI/(near?20:12))*r]);}
function facade(outer,v,holes,doors=false){const all=[...outer,...holes.flat()];for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(r=>r.map(p=>new THREE.Vector2(...p)))))face('stone',tri.map(i=>[F,all[i][1],v+all[i][0]]),[-1,0,0]);for(const [i,h]of holes.entries())face(doors&&i<3?'door':'glass',h.map(([w,y])=>[F,y,v+w]),[-1,0,0]);}
const half=W/2-5;facade([[-half,0],[half,0],[half,12.4],[0,18.4],[-half,12.4]],V,[round(-4.1,1.6,.15,3.7),round(0,2.3,.15,3.7),round(4.1,1.6,.15,3.7),round(0,1.4,8.6,3.7),circle(0,15,.7)],true);

return finish(-theta);

}
