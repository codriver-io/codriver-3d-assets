import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './texas-star-ferris-wheel-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {face,flush}=t,R=29.5,H=35.02;
 // Continuous tube rims carry every spoke and cabin crossbar in both LODs.
 for(const z of[-1.8,1.8]){const g=new THREE.TorusGeometry(R,.25,near?6:4,near?176:88);g.translate(0,H,z);b.put(g,'steel');}
 const spokes=near?44:22;for(let i=0;i<spokes;i++){const a=2*Math.PI*i/spokes;for(const z of[-1.8,1.8])b.bar('spokes',[1.6*Math.cos(a),H+1.6*Math.sin(a),z],[R*Math.cos(a),H+R*Math.sin(a),z],near?.10:.14);}
 // A rigid axle joins the rims and the A-frame head bearings.
 {const g=new THREE.CylinderGeometry(1.8,1.8,4.8,near?24:16,1,true);g.rotateX(Math.PI/2);g.translate(0,H,0);b.put(g,'blue');}
 const circle=Array.from({length:near?24:16},(_,i)=>[1.8*Math.cos(i*2*Math.PI/(near?24:16)),H+1.8*Math.sin(i*2*Math.PI/(near?24:16))]),star=Array.from({length:10},(_,i)=>{const a=Math.PI/2+i*Math.PI/5,r=i%2?.42:1.05;return[r*Math.cos(a),H+r*Math.sin(a)];});
 // The white star and blue hub cap adjoin in one plane, avoiding a coplanar sticker.
 const points=[...circle,...star],tris=THREE.ShapeUtils.triangulateShape(circle.map(p=>new THREE.Vector2(...p)),[star.map(p=>new THREE.Vector2(...p))]);for(const ids of tris)face('blue',ids.map(i=>[...points[i],2.4]),[0,0,1]);for(const ids of THREE.ShapeUtils.triangulateShape(star.map(p=>new THREE.Vector2(...p)),[]))face('spokes',ids.map(i=>[...star[i],2.4]),[0,0,1]);face('blue',circle.map(p=>[...p,-2.4]),[0,0,-1]);
 for(const sx of[-1,1])for(const sz of[-1,1]){b.box('spokes',[sx*17,.4,sz*7.5],[3,.8,3]);b.bar('support',[sx*17,.8,sz*7.5],[0,H,sz*2.4],1.15,1.05);}
 const colours=['red','gold','green','blue'];for(let i=0;i<44;i++){const a=i*2*Math.PI/44,x=R*Math.cos(a),y=H+R*Math.sin(a),m=colours[i%4];
  b.bar('steel',[x,y,-1.8],[x,y,1.8],.16);b.bar('steel',[x,y,0],[x,y-.5,0],.16);
  b.box(m,[x,y-2.5,0],[2.1,.8,1.5]);b.box('glass',[x,y-1.4,0],[1.8,1.4,1.3]);b.box(m,[x,y-.6,0],[2.15,.2,1.55]);
 }
 return flush(-Math.PI/4);
}
