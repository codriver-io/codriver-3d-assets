import * as THREE from 'three';
import { SPEC } from './config.js';

// Small original authoring kit. All transforms finish in east/up/south metres.
export function makeKit(b, near) {
  const rotation = new THREE.Matrix4().makeRotationY(SPEC.rotationDeg * Math.PI / 180);
  const put = (g, mat, matrix) => {
    if (matrix) g.applyMatrix4(matrix);
    g.applyMatrix4(rotation); b.put(g, mat);
  };
  function box(mat,x0,x1,y0,y1,z0,z1) {
    if (x1-x0<.01 || y1-y0<.01 || z1-z0<.01) return;
    const g=new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0).translate((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
    if(y0===0){const a=Array.from(g.index.array);g.setIndex([...a.slice(0,18),...a.slice(24)]);g.clearGroups();}
    put(g,mat);
  }
  function cylinder(mat,x,z,r0,r1,y0,y1,n=near?16:10) {
    put(new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,false).translate(x,(y0+y1)/2,z),mat);
  }
  function lathe(mat,profile,n=near?32:20,x=-.5,z=.5) {
    put(new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n).translate(x,0,z),mat);
  }
  function bar(mat,a,c,w) {
    const start=new THREE.Vector3(...a), end=new THREE.Vector3(...c), dir=end.clone().sub(start);
    const g=new THREE.CylinderGeometry(w/2,w/2,dir.length(),near?8:5,1,false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));
    g.translate(...start.add(end).multiplyScalar(.5).toArray());put(g,mat);
  }
  function frame(x,z,phi) {
    const n=new THREE.Vector3(Math.cos(phi),0,Math.sin(phi));
    const M=new THREE.Matrix4().makeBasis(new THREE.Vector3(Math.sin(phi),0,-Math.cos(phi)),new THREE.Vector3(0,1,0),n).setPosition(x,0,z);
    const fbox=(mat,s0,s1,y0,y1,d0,d1)=>put(new THREE.BoxGeometry(s1-s0,y1-y0,d1-d0).translate((s0+s1)/2,(y0+y1)/2,(d0+d1)/2),mat,M);
    const path=(s,y,w,h,arch=false)=>{
      const pts=[new THREE.Vector2(s-w/2,y),new THREE.Vector2(s+w/2,y)];
      if(arch){const r=w/2, spring=y+h-r;pts.push(new THREE.Vector2(s+r,spring));for(let i=1;i<= (near?8:4);i++){const a=i*Math.PI/(near?8:4);pts.push(new THREE.Vector2(s+r*Math.cos(a),spring+r*Math.sin(a)));}}
      else pts.push(new THREE.Vector2(s+w/2,y+h),new THREE.Vector2(s-w/2,y+h));
      return pts;
    };
    function wall(width,y0,y1,windows,depth=1) {
      const shape=new THREE.Shape(path(0,y0,width,y1-y0));
      for(const v of windows){shape.holes.push(new THREE.Path(path(v.s,v.y,v.w,v.h,v.arch)));
        put(new THREE.ShapeGeometry(new THREE.Shape(path(v.s,v.y,v.w,v.h,v.arch))).translate(0,0,-.52), 'light', M);
        if(near){
          fbox('stone',v.s-.065,v.s+.065,v.y,v.y+v.h-.15,-.31,-.17);
          if(v.h>3)fbox('stone',v.s-v.w/2,v.s+v.w/2,v.y+v.h*.48,v.y+v.h*.48+.12,-.31,-.17);
          fbox('stone',v.s-v.w/2-.18,v.s+v.w/2+.18,v.y-.18,v.y,-.1,.22);
          if(!v.arch)fbox('stone',v.s-v.w/2-.18,v.s+v.w/2+.18,v.y+v.h,v.y+v.h+.18,-.1,.22);
        }
      }
      const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?8:4});
      if(!near){
        // Interior-facing caps are hidden by the inset core; keep exterior faces and reveals.
        const n=g.attributes.normal, p=g.attributes.position, positions=[], normals=[];
        for(let i=0;i<p.count;i+=3)if(n.getZ(i)>-.9){for(let j=i;j<i+3;j++){positions.push(p.getX(j),p.getY(j),p.getZ(j));normals.push(n.getX(j),n.getY(j),n.getZ(j));}}
        g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.deleteAttribute('uv');g.clearGroups();
      }
      g.translate(0,0,-depth);put(g,'stone',M);
    }
    function pediment(width,y,rise,d0,d1) {
      const shape=new THREE.Shape([new THREE.Vector2(-width/2,y),new THREE.Vector2(width/2,y),new THREE.Vector2(0,y+rise)]);
      put(new THREE.ExtrudeGeometry(shape,{depth:d1-d0,bevelEnabled:false}).translate(0,0,d0),'stone',M);
      for(const sign of [-1,1]){
        const a=new THREE.Vector3(sign*width/2,y, d1+.08),c=new THREE.Vector3(0,y+rise,d1+.08),dir=c.clone().sub(a);
        const g=new THREE.BoxGeometry(.34,dir.length(),.34);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));g.translate(...a.add(c).multiplyScalar(.5).toArray());put(g,'stone',M);
      }
    }
    return {box:fbox,wall,pediment,M};
  }
  return {put,box,cylinder,lathe,bar,frame,near};
}
