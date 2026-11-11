import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './siegestor-munich-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const shape=new THREE.Shape();shape.moveTo(-11.76,0);const openings=[[-8.5,2.05,5.1],[0,3.6,8.9],[8.5,2.05,5.1]];
 for(const [u,r,h]of openings){shape.lineTo(u-r,0);shape.lineTo(u-r,h);for(let j=1;j<=(near?9:5);j++){const a=Math.PI-j*Math.PI/(near?9:5);shape.lineTo(u+r*Math.cos(a),h+r*Math.sin(a));}shape.lineTo(u+r,0);}shape.lineTo(11.76,0);shape.lineTo(11.76,15.5);shape.lineTo(-11.76,15.5);shape.closePath();
 const shell=new THREE.ExtrudeGeometry(shape,{depth:10.12,bevelEnabled:false,steps:1,curveSegments:near?9:5});shell.rotateY(Math.PI/2);shell.translate(-5.06,0,0);b.put(shell,'stone');
 block(0,0,11.4,24,15.2,15.7,'stone','stone');block(0,0,10.8,23.5,15.7,20.6,'stone','stone');block(0,0,11.4,24,20.6,21,'stone','stone');block(0,0,7,8.2,21,21.9,'stone','stone');
 for(const x of [-5.4,5.4])for(const z of [-11,-5.1,5.1,11]){block(x,z,1.2,1.1,0,1.4,'stone','stone');cyl(x,z,.45,1.4,14.7,'stone',near?8:4);spin([[.45,14.7],[.65,15.1],[.65,15.5]],'stone',x,z,near?8:4);}
 for(const z of [-7.8,7.8]){const t=new THREE.TorusGeometry(1.35,.16,near?4:3,near?14:8);t.rotateY(Math.PI/2);t.translate(5.52,18.15,z);b.put(t,'stone');}
 const ball=(mat,p,size)=>{const q=new THREE.SphereGeometry(1,near?6:4,near?4:3);q.scale(size[0]*(near?1:2/Math.sqrt(3)),size[1],size[2]*2/Math.sqrt(3));q.translate(...p);b.put(q,mat);};
 const person=(mat,x,z,base,h)=>{const q=new THREE.CylinderGeometry(.12*h,.20*h,.56*h,near?6:4,1);q.translate(x,base+.28*h,z);b.put(q,mat);ball(mat,[x,base+.62*h,z],[.16*h,.24*h,.13*h]);ball(mat,[x+.07*h,base+.88*h,z],[.10*h,.12*h,.10*h]);for(const side of [-1,1]){const a=[x+.06*h,base+.7*h,z+side*.09*h],c=[x+.1*h,base+.58*h,z+side*.24*h],d=[x+.24*h,base+.74*h,z+side*.25*h];b.bar(mat,a,c,.05*h,.05*h,0,true);b.bar(mat,c,d,.05*h,.05*h,0,true);}};
 for(const z of [-10.5,-5,5,10.5])person('stone',5.3,z,15.7,2.6);
 for(const z of [-2.7,-.9,.9,2.7]){for(const x of [.1,2])for(const dz of [-.38,.38]){b.bar('bronze',[x,21.9,z+dz],[x,23,z+dz],.18,.18,0,true);ball('bronze',[x+.15,22,z+dz],[.28,.17,.22]);}ball('bronze',[1,23,z],[1.45,.68,.62]);ball('bronze',[2.15,23.25,z],[.7,.9,.66]);ball('bronze',[2.65,23.9,z],[.63,.66,.61]);ball('bronze',[3.15,23.86,z],[.4,.28,.32]);}
 person('bronze',-1.8,0,21.9,4.1);
return finish();
}
