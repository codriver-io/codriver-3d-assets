import * as THREE from 'three';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
export const ANGLE=81*Math.PI/180, FRONT=[-15.18,11.97];
// u north along the facade, v east into the church; exported bearing is baked once.
export const sitePoint=(u,y,v)=>new THREE.Vector3(FRONT[0]+Math.cos(ANGLE)*u+Math.sin(ANGLE)*v,y,FRONT[1]-Math.sin(ANGLE)*u+Math.cos(ANGLE)*v);
export function mappedPlan(ring){const k=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=latToMercY(SPEC.origin[1]);return ring.map(([lng,lat])=>{const x=(lngToMercX(lng)-ox)/k-FRONT[0],z=(oz-latToMercY(lat))/k-FRONT[1];return [x*Math.cos(ANGLE)-z*Math.sin(ANGLE),x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];});}
export function archShape(w,h){const s=new THREE.Shape(),r=w/2;s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.lineTo(-r,0);return s;}
export const rectangle=(x,y,w,h)=>new THREE.Shape([new THREE.Vector2(x-w/2,y),new THREE.Vector2(x+w/2,y),new THREE.Vector2(x+w/2,y+h),new THREE.Vector2(x-w/2,y+h)]);
// Intersections of inward-offset mapped edges: roofs never cross the exterior stone face.
export function insetRing(ring,d){
  const r=ring.slice(0,-1),out=[];
  for(let i=0;i<r.length;i++){
    const p=r[(i+r.length-1)%r.length],q=r[i],s=r[(i+1)%r.length],a=[q[0]-p[0],q[1]-p[1]],b=[s[0]-q[0],s[1]-q[1]],al=Math.hypot(...a),bl=Math.hypot(...b);a[0]/=al;a[1]/=al;b[0]/=bl;b[1]/=bl;
    const n=[-a[1]-b[1],a[0]+b[0]],den=1+a[0]*b[0]+a[1]*b[1];out.push([q[0]+d*n[0]/den,q[1]+d*n[1]/den]);
  }return out;
}
export function kit(b,near){
  function put(g,m){g.rotateY(ANGLE);g.translate(FRONT[0],0,FRONT[1]);b.put(g,m,0,0);}
  function without(g,predicate){const src=g.index?g.toNonIndexed():g,p=src.attributes.position,n=src.attributes.normal,pos=[],nor=[];for(let i=0;i<p.count;i+=3){if(predicate(p,n,i))continue;for(let j=0;j<3;j++){pos.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));nor.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}}if(src!==g)src.dispose();g.dispose();const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));out.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return out;}
  function box(m,u,y,v,w,h,d,backless=false){let g=new THREE.BoxGeometry(w,h,d);if(backless)g=without(g,(_,n,i)=>n.getZ(i)>.9);g.translate(u,y+h/2,v);put(g,m);}
  function shape(m,s,u,y,v,d,backless=false){let g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:near?12:6});if(backless)g=without(g,(_,n,i)=>n.getZ(i)>.9);g.translate(u,y,v);put(g,m);}
  function face(m,s,u,y,v){const g=new THREE.ShapeGeometry(s,near?12:6);g.rotateY(Math.PI);g.translate(u,y,v);put(g,m);}
  function cyl(m,u,y,v,h,r,rt=r){const g=new THREE.CylinderGeometry(rt,r,h,near?12:6);g.translate(u,y+h/2,v);put(g,m);}
  function poly(m,ring,y,h){const s=new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v))),g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,m);}
  function wall(a,c,h,openings=[],d=.6){const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),s=rectangle(len/2,0,len,h);for(const o of openings)s.holes.push(new THREE.Path(rectangle(o.t,o.y,o.w,o.h).getPoints()));let g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false}),angle=-Math.atan2(dz,dx);g.rotateY(angle);g.translate(a[0],0,a[1]);put(g,'stone');for(const o of openings){const q=new THREE.PlaneGeometry(o.w,o.h);q.rotateY(Math.PI);q.translate(o.t,o.y+o.h/2,d*.83);q.rotateY(angle);q.translate(a[0],0,a[1]);put(q,o.y<.1?'wood':'iron');}return {len,angle};}
  return {put,box,shape,face,cyl,poly,wall,without};
}
