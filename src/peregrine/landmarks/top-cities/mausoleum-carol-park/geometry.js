import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './mausoleum-carol-park-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
prism(LOCAL_RINGS[0],0,1.8,'marble','marble');
 spin([[15,1.8],[15,7.7],[14.5,8]],'granite',0,0,near?60:30);
 spin([[10.8,8],[10.8,8.6],[10.3,9]],'cap',0,0,near?40:25);
 const n=near?20:10;
 for(let k=0;k<5;k++){
  const a=(k*2*Math.PI/5)+.515,c=((k+1)*2*Math.PI/5)+.515,p=[7.49*Math.cos(a),7.49*Math.sin(a)],q=[7.49*Math.cos(c),7.49*Math.sin(c)],mid=[(p[0]+q[0])/2,(p[1]+q[1])/2],dx=q[0]-p[0],dz=q[1]-p[1],theta=Math.atan2(-dz,dx);
  const s=new THREE.Shape();s.moveTo(-4.4,9);s.lineTo(-4.4,43.6);for(let j=1;j<=n;j++){const t=Math.PI-j*Math.PI/n;s.lineTo(4.4*Math.cos(t),43.6+4.4*Math.sin(t));}s.lineTo(4.4,9);s.lineTo(3.25,9);s.lineTo(3.25,43.6);for(let j=1;j<=n;j++){const t=j*Math.PI/n;s.lineTo(3.25*Math.cos(t),43.6+3.25*Math.sin(t));}s.lineTo(-3.25,9);s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:1.35,steps:1,bevelEnabled:false});g.translate(0,0,-.675);g.rotateY(theta);g.translate(mid[0],0,mid[1]);b.put(g,'arch');
 }
 // A muted metal entrance leaf occupies its own proud recess, with no lettering.
 block(0,14.95,1.8,.18,1.8,4.8,'door','door');
return finish();
}
