import * as THREE from 'three';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
export function mapped(ring){const k=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=latToMercY(SPEC.origin[1]);return ring.slice(0,-1).map(([x,z])=>[(lngToMercX(x)-ox)/k,(oz-latToMercY(z))/k]);}
export function foxKit(b,near){
 const n=near?24:12;
 function surface(mat,points){const p=points.flat(),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(points.length===4?[0,1,2,0,2,3]:[0,1,2]);g.computeVertexNormals();b.put(g,mat);}
 function poly(mat,ring,y,h,frontCut=null){
  const pts=ring.map(([x,z])=>new THREE.Vector2(x,z));
  const area=THREE.ShapeUtils.area(pts),r=area>0?ring: [...ring].reverse();
  for(let i=0;i<r.length;i++){
   const a=r[i],c=r[(i+1)%r.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
   if(frontCut&&frontCut(a,c,len))continue;
   for(let base=y;base<y+h-.001;){const course=Math.floor((base-y+.001)/2.4),top=Math.min(y+h,y+(course+1)*2.4),mid=Math.min(top,base+1.72);
    for(const [lo,hi,m] of [[base,mid,mat],[mid,top,mat==='stone'?'brick':mat]])if(hi-lo>.001)surface(m,[[a[0],lo,a[1]],[a[0],hi,a[1]],[c[0],hi,c[1]],[c[0],lo,c[1]]]);base=top;
   }
  }
  for(const tri of THREE.ShapeUtils.triangulateShape(r.map(([x,z])=>new THREE.Vector2(x,z)),[])){
   surface(mat,tri.map(i=>[r[i][0],y+h,r[i][1]]).reverse());
   surface(mat,tri.map(i=>[r[i][0],y,r[i][1]]));
  }
 }
 function shape(mat,s,x,y,z,angle=0,depth=0){const g=depth?new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:near?12:3}):new THREE.ShapeGeometry(s,near?12:3);g.rotateY(angle);g.translate(x,y,z);b.put(g,mat);}
 function archShape(w,h){const s=new THREE.Shape();const r=w/2;s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.lineTo(-r,0);return s;}
 function arch(mat,x,y,z,w,h,t=.3,angle=0){const s=archShape(w,h);const hole=archShape(w-2*t,h-t);s.holes.push(new THREE.Path(hole.getPoints(near?18:4)));shape(mat,s,x,y,z,angle);}
 function window(x,y,z,w,h,angle=0,arched=false){shape('glass',arched?archShape(w,h):new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(w/2,h),new THREE.Vector2(-w/2,h)]),x,y,z,angle);if(near){const dx=Math.sin(angle)*.22,dz=Math.cos(angle)*.22;b.box('trim',[x+dx,y+h/2,z+dz],[.12,h,.1],angle);}}
 function cyl(mat,x,z,y,h,r,rt=r,s=n){const g=new THREE.CylinderGeometry(rt,r,h,s);g.translate(x,y+h/2,z);b.put(g,mat);}
 function lathe(mat,x,z,profile,s=n){const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),s);g.translate(x,0,z);b.put(g,mat);}
 function dome(x,z,y,r,h,mat='tile',onion=false){const profile=onion?[[0,y],[r*.87,y],[r,y+h*.19],[r*.91,y+h*.42],[r*.65,y+h*.65],[r*.26,y+h*.87],[0,y+h]]:[[0,y],...Array.from({length:near?9:5},(_,i)=>{const t=i/(near?8:4)*Math.PI/2;return[r*Math.cos(t),y+h*Math.sin(t)]})];lathe(mat,x,z,profile);}
 return {surface,poly,shape,archShape,arch,window,cyl,lathe,dome};
}
