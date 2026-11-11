import * as THREE from "three";
import { assetBuilder } from "../../asset-geometry.js";
// Original architectural primitives; local x/z orientation is baked at finish().
export function kit(SPEC,PALETTES,detail) {
 const near=detail!=="far", b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m)=>{if(m==='roof'){const raw=g.index?g.toNonIndexed():g,p=raw.attributes.position,n=raw.attributes.normal,positions=[],normals=[];for(let i=0;i<p.count;i+=3){if(n.getY(i)<-.99)continue;for(let j=0;j<3;j++){positions.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));normals.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}}const out=new THREE.BufferGeometry();out.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));out.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));b.put(out,m);}else b.put(g,m);};
 const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
 const cyl=(m,x,z,r0,r1,y0,y1,n=near?16:8)=>{const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false);g.translate(x,(y0+y1)/2,z);put(g,m);};
 const lathe=(m,x,z,p,n=near?24:16)=>{const g=new THREE.LatheGeometry(p.map(v=>new THREE.Vector2(...v)),n);g.translate(x,0,z);put(g,m);};
 const poly=(m,p,indices)=>{const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex(indices);const flat=g.toNonIndexed();flat.computeVertexNormals();put(flat,m);g.dispose();};
 function quad(m,a,c,d,e){poly(m,[a,c,d,e],[0,1,2,0,2,3]);}
 function gable(m,x0,x1,h,top,w){poly(m,[[x0,h,-w/2],[x0,h,w/2],[x0,top,0],[x1,h,-w/2],[x1,h,w/2],[x1,top,0]],[0,1,2,3,5,4,0,5,3,0,2,5,1,5,2,1,4,5,0,4,1,0,3,4]);}
 function roof(x0,x1,eave,peak,w){gable("roof",x0,x1,eave,peak,w);}
 function arch(w,h,n=near?10:5){const r=w/2,p=[[-r,0],[r,0],[r,h-r]];for(let i=1;i<=n;i++){const a=i*Math.PI/n;p.push([r*Math.cos(a),h-r+r*Math.sin(a)]);}return p;}
 function path(p){const s=new THREE.Path();p.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s;}
 function wall(m,w,y0,y1,thick,x,z,angle,openings=[]){
  const s=new THREE.Shape([new THREE.Vector2(-w/2,y0),new THREE.Vector2(w/2,y0),new THREE.Vector2(w/2,y1),new THREE.Vector2(-w/2,y1)]);
  for(const o of openings){const p=(o.circle?Array.from({length:near?24:12},(_,i)=>[o.w/2*Math.cos(i*2*Math.PI/(near?24:12)),o.h/2+o.h/2*Math.sin(i*2*Math.PI/(near?24:12))]):o.pointed?[[-o.w/2,0],[o.w/2,0],[o.w/2,o.h-o.w*.65],[o.w*.35,o.h-o.w*.30],[0,o.h],[-o.w*.35,o.h-o.w*.30],[-o.w/2,o.h-o.w*.65]]:o.arch?arch(o.w,o.h):[[-o.w/2,0],[o.w/2,0],[o.w/2,o.h],[-o.w/2,o.h]]).map(([u,v])=>[u+o.u,v+o.y]);s.holes.push(path(p));
   // Glazing/doors sit inside the actual hole. No facade overlays.
   if(o.mat){const gs=new THREE.Shape(p.map(([u,v])=>new THREE.Vector2(u,v)));const g=new THREE.ExtrudeGeometry(gs,{depth:thick*.12,bevelEnabled:false,steps:1,curveSegments:near?10:5});g.translate(0,0,thick*.32);g.rotateY(angle);g.translate(x,0,z);put(g,o.mat);}
  }
  const g=new THREE.ExtrudeGeometry(s,{depth:thick,bevelEnabled:false,curveSegments:near?10:5,steps:1});g.rotateY(angle);g.translate(x,0,z);put(g,m);
 }
 function portico(x0,x1,w,floor,shaftTop,apex,count=4){
  box("plaster",(x0+x1)/2,floor/2,0,x1-x0,floor,w);
  const cx=x0+.7;
  for(let i=0;i<count;i++){
   const z=-w/2+1+i*(w-2)/(count-1);
   lathe("plaster",cx,z,[[0,floor],[.77,floor],[.77,floor+.25],[.65,floor+.4],[.57,shaftTop-.5],[.74,shaftTop-.32],[.82,shaftTop],[0,shaftTop]],near?16:8);
  }
  box("plaster",(x0+x1)/2,shaftTop+.65,0,x1-x0,1.3,w+.55);
  gable("plaster",x0-.25,x1,shaftTop+1.3,apex,w+.55);
  // Raking cornice directly embedded in the pediment roof.

 }
 function prism(m,ring,y0,y1){const sh=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));const g=new THREE.ExtrudeGeometry(sh,{depth:y1-y0,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,m);}
 function finish(){const r=b.finish();r.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute("bridgeLift");o.geometry.rotateY(SPEC.rotation||0);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});return r;}
 return {near,b,put,box,cyl,lathe,poly,quad,gable,roof,arch,wall,portico,prism,finish};
}
