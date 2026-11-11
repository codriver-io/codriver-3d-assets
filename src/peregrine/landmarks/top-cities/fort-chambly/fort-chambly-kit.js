import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
// Local architectural frame is rotated ONCE on the geometry before export.
export function kit(SPEC, PALETTES, detail) {
 const near=detail!=='far', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m)=>b.put(g,m);
 const box=(m,x,y,z,w,h,d,angle=0)=>b.box(m,[x,y,z],[w,h,d],angle);
 function poly(m,p,ix){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex(ix);const flat=g.toNonIndexed();flat.computeVertexNormals();put(flat,m);g.dispose();}
 function quad(m,a,c,d,e,normal){let p=[a,c,d,e];if(normal){const u=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),v=new THREE.Vector3(...d).sub(new THREE.Vector3(...a));if(u.cross(v).dot(new THREE.Vector3(...normal))<0)p=[a,e,d,c];}poly(m,p,[0,1,2,0,2,3]);}
 const cyl=(m,x,z,r0,r1,y0,y1,n=near?20:12)=>{const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);put(g,m);};
 const lathe=(m,x,z,profile,n=near?24:12)=>{const g=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),n);g.translate(x,0,z);put(g,m);};
 const beam=(m,a,c,w,d=w)=>b.bar(m,a,c,w,d);
 function path(p){const s=new THREE.Path();p.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s;}
 function arch(w,h,pointed=false){const r=w/2,n=near?10:5,p=[[-r,0],[r,0],[r,h-(pointed?w*.8:r)]];if(pointed){for(let i=1;i<=n;i++){const t=i/n;p.push([r*(1-t),h-w*.8*(1-t)*(1-t)]);}for(let i=1;i<=n;i++){const t=i/n;p.push([-r*t,h-w*.8*t*t]);}}else for(let i=1;i<=n;i++){const a=i*Math.PI/n;p.push([r*Math.cos(a),h-r+r*Math.sin(a)]);}return p;}
 function panel(m,outline,thick,x,z,angle,holes=[]){
  const s=new THREE.Shape(outline.map(p=>new THREE.Vector2(...p)));
  for(const o of holes){const p=(o.points||o.arch&&arch(o.w,o.h,o.pointed)||[[-o.w/2,0],[o.w/2,0],[o.w/2,o.h],[-o.w/2,o.h]]).map(([u,y])=>[u+(o.u||0),y+(o.y||0)]);s.holes.push(path(p));
   if(o.mat){const g=new THREE.ShapeGeometry(new THREE.Shape(p.map(p=>new THREE.Vector2(...p))));g.translate(0,0,thick*.30);g.rotateY(angle);g.translate(x,0,z);put(g,o.mat);}
  }
  const g=new THREE.ExtrudeGeometry(s,{depth:thick,bevelEnabled:false,steps:1,curveSegments:near?10:5});g.rotateY(angle);g.translate(x,0,z);put(g,m);
 }
 function wall(m,w,y0,y1,t,x,z,angle,holes=[],peak=null){panel(m,peak?[[-w/2,y0],[w/2,y0],[w/2,y1],[0,peak],[-w/2,y1]]:[[-w/2,y0],[w/2,y0],[w/2,y1],[-w/2,y1]],t,x,z,angle,holes);}
 function gable(m,x,z,w,d,eave,peak){const p=[[x-w/2,eave,z-d/2],[x+w/2,eave,z-d/2],[x,peak,z-d/2],[x-w/2,eave,z+d/2],[x+w/2,eave,z+d/2],[x,peak,z+d/2]];poly(m,p,[0,2,1,3,4,5,0,3,5,0,5,2,1,2,5,1,5,4,0,1,4,0,4,3]);}
 function roof(m,x,z,w,d,eave,peak){gable(m,x,z,w,d,eave,peak);}
 function ring(m,x,z,ri,ro,y,h,n=near?32:16){const shape=new THREE.Shape();for(let i=0;i<=n;i++){const a=i*2*Math.PI/n;i?shape.lineTo(ro*Math.cos(a),ro*Math.sin(a)):shape.moveTo(ro,0);}const hole=new THREE.Path();for(let i=0;i<=n;i++){const a=-i*2*Math.PI/n;i?hole.lineTo(ri*Math.cos(a),ri*Math.sin(a)):hole.moveTo(ri,0);}shape.holes.push(hole);const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(x,y,z);put(g,m);}
 function finish(){const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(SPEC.rotation||0);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});return root;}
 return {near,b,put,box,poly,quad,cyl,lathe,beam,arch,panel,wall,gable,roof,ring,finish};
}
