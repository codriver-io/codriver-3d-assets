import * as THREE from 'three';
import {parts} from './rai-elicium-parts.js';
export function create({detail='near'}={}){
 const p=parts(detail),{near,face,rect,ellipse,cap,facade,prism,block,loft,cylinder,dome,gable,skin,box,bar,put}=p;
function rounded(x,y,w,h,r){const s=new THREE.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
 function frame(x,y,w,h,r){const outer=rounded(x,y,w,h,r),inner=rounded(x+.8,y+.8,w-1.6,h-1.6,Math.max(.2,r-.8));outer.holes.push(new THREE.Path(inner.getPoints(near?6:4).reverse()));const g=new THREE.ExtrudeGeometry(outer,{depth:54,bevelEnabled:false,curveSegments:near?6:4});g.translate(0,0,-27);put(g,'frame');}
 // The frames are solid hollow extrusions, not white decals laid on glass.
 block('metal',-2,0,14,54,0,18,{cols:4,rows:5,fraction:.88,sill:.16,roof:'roof'});
 frame(-9,18,14,28,3);block('metal',-2,0,12.4,52,18.8,45.2,{cols:4,rows:7,fraction:.87,sill:.16,roof:'roof'});
 frame(5,4.5,42,10.5,3);block('metal',26,0,40.4,52,5.3,14.2,{cols:11,rows:2,fraction:.91,sill:.15,roof:'roof'});
 block('metal',-14.5,0,11,54,4,19,{cols:3,rows:4,fraction:.9,sill:.14,roof:'roof'});
 for(const x of[-18,8,44])for(const z of[-21,21])block('frame',x,z,1.4,1.4,0,x===-18?4:4.5);
 const strip=new THREE.Shape();strip.moveTo(4,18.5);strip.lineTo(6.8,18.5);strip.quadraticCurveTo(8.5,15.1,11,15);strip.lineTo(8,15);strip.quadraticCurveTo(6.8,17,4,17.3);strip.closePath();const g=new THREE.ExtrudeGeometry(strip,{depth:52,bevelEnabled:false,curveSegments:near?8:5});g.translate(0,0,-26);put(g,'frame');
 
 return p.finish();
}
