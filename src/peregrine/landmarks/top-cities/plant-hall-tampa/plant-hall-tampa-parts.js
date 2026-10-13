import * as THREE from 'three';
import { SPEC } from './config.js';
// Spherical Mercator converted back to ground metres; geographic frame is baked.
const R=6378137,k=1/Math.cos(SPEC.origin[1]*Math.PI/180);
const my=lat=>R*Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
export const local=([lng,lat])=>[(lng-SPEC.origin[0])*Math.PI/180*R/k,(my(SPEC.origin[1])-my(lat))/k];
export function partsKit(b,near){
 const put=(g,m)=>b.put(g,m,0,0);
 const box=(m,x,y,z,w,h,d,a=0)=>{const g=new THREE.BoxGeometry(w,h,d);g.rotateY(a);g.translate(x,y+h/2,z);put(g,m);};
 const cyl=(m,x,z,y,h,r,rt=r,n=near?20:10)=>{const g=new THREE.CylinderGeometry(rt,r,h,n);g.translate(x,y+h/2,z);put(g,m);};
 const lathe=(m,x,z,profile)=>{const g=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),near?24:12);g.translate(x,0,z);put(g,m);};
 function poly(m,ring,y,h){const s=new THREE.Shape(ring.map(p=>new THREE.Vector2(p[0],-p[1])));const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,y,0);const pos=g.attributes.position,nor=g.attributes.normal,ps=[],ns=[];for(let i=0;i<pos.count;i+=3){const ny=nor.getY(i);if(m==='brick'&&ny>.5)continue;if(m==='roof'&&(Math.abs(ny)<.5||(h<.245&&ny<-.5)))continue;for(let j=0;j<3;j++){ps.push(pos.getX(i+j),pos.getY(i+j),pos.getZ(i+j));ns.push(nor.getX(i+j),nor.getY(i+j),nor.getZ(i+j));}}const cut=new THREE.BufferGeometry();cut.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));cut.setAttribute('normal',new THREE.Float32BufferAttribute(ns,3));g.dispose();put(cut,m);}
 function shape(m,s,x,y,z,a=0,depth=0){let g=depth?new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:near?3:1}):new THREE.ShapeGeometry(s,near?3:1);g.rotateY(a);g.translate(x,y,z);put(g,m);}
 const arch=(w,h)=>{const r=w/2,s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.lineTo(-r,0);return s;};
 function window(x,z,y,w,h,a,lit=false){const nx=Math.sin(a),nz=Math.cos(a);shape(lit?'glow':'glass',arch(w,h),x+nx*.16,y,z+nz*.16,a);if(!near)return;const s=arch(w+.36,h+.2);s.holes.push(new THREE.Path(arch(w,h).getPoints(near?3:1)));shape('trim',s,x+nx*.28,y-.08,z+nz*.28,a);
 if(near){const g=new THREE.PlaneGeometry(.06,h-.25);g.rotateY(a);g.translate(x+nx*.31,y+(h-.25)/2,z+nz*.31);put(g,'trim');}}
 // True pierced horseshoe band: > semicircular arc curling inward at the spring.
 function horse(w,h,t){const r=w/2,cy=h-r,s=new THREE.Shape();s.moveTo(-r*.78,0);s.lineTo(r*.78,0);s.lineTo(r*.78,cy-r*.62);s.absarc(0,cy,r,-Math.PI*.22,Math.PI*1.22,false);s.lineTo(-r*.78,0);const outer=new THREE.Shape();outer.moveTo(-r-t,0);outer.lineTo(r+t,0);outer.lineTo(r+t,h+t);outer.lineTo(-r-t,h+t);outer.closePath();outer.holes.push(new THREE.Path(s.getPoints(near?6:3)));return outer;}
 function crescent(x,z,y,r=.42,a=0){const s=new THREE.Shape();s.absarc(0,0,r,Math.PI*.22,Math.PI*1.78,false);s.absarc(r*.42,0,r*.88,Math.PI*1.66,Math.PI*.34,true);s.closePath();shape('silver',s,x,y,z,a,.10);}
 return {put,box,cyl,lathe,poly,shape,arch,horse,window,crescent};
}
