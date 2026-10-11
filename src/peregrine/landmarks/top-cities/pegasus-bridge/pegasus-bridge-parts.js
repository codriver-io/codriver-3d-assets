import * as THREE from 'three';
import { PROFILE } from './pegasus-bridge-profile.js';

// Member geometry starts in station/up/right metres, then uses the shared roadway frame.
export function parts(b) {
  // Split at local bank grade before batching, so no buried fascia, girder or
  // abutment can draw through Cityscape's flat ground. A single foundation batch
  // retains the lower structure for world mode without exhausting the far draws.
  function put(g,mat,lift=1,worldFrame=false) {
    g.computeBoundingBox();
    if(g.boundingBox.max.y<=0)mat='foundation';
    else if(g.boundingBox.min.y<0) {
      const p=g.attributes.position,idx=g.index,above=[],below=[];
      const clip=(points,up)=>{
        const out=[];
        for(let i=0;i<points.length;i++) {
          const a=points[i],c=points[(i+1)%points.length],ai=up?a[1]>=0:a[1]<=0,ci=up?c[1]>=0:c[1]<=0;
          if(ai)out.push(a);
          if(ai!==ci){const t=-a[1]/(c[1]-a[1]);out.push([a[0]+t*(c[0]-a[0]),0,a[2]+t*(c[2]-a[2])]);}
        }
        return out;
      };
      for(let i=0;i<(idx?.count??p.count);i+=3) {
        const tri=[0,1,2].map(j=>{const n=idx?idx.getX(i+j):i+j;return [p.getX(n),p.getY(n),p.getZ(n)];});
        for(const [up,dest] of [[true,above],[false,below]]) {
          const poly=clip(tri,up);
          for(let j=1;j+1<poly.length;j++) {
            const a=new THREE.Vector3(...poly[0]),c=new THREE.Vector3(...poly[j]),d=new THREE.Vector3(...poly[j+1]);
            if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-14)dest.push(...poly[0],...poly[j],...poly[j+1]);
          }
        }
      }
      g.dispose();
      for(const [positions,material] of [[above,mat],[below,'foundation']])if(positions.length) {
        const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
        put(geometry,material,lift,worldFrame);
      }
      return;
    }
    const p=g.attributes.position;
    for(let i=0;!worldFrame&&i<p.count;i++) {
      const q=PROFILE.bridgePoint(p.getX(i),p.getZ(i),p.getY(i));
      p.setXYZ(i,q.x,q.y,q.z);
    }
    g.computeVertexNormals(); b.put(g,mat,0,lift);
  }
  function box(mat,s,y,d,l,h,w,lift=1) {
    const g=new THREE.BoxGeometry(l,h,w);g.translate(s,y,d);put(g,mat,lift);
  }
  function beam(mat,a,c,w,h=w,lift=1) {
    const A=new THREE.Vector3(...a),C=new THREE.Vector3(...c),v=C.clone().sub(A);
    const g=new THREE.BoxGeometry(w,v.length(),h);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    g.translate(...A.add(C).multiplyScalar(.5).toArray());put(g,mat,lift);
  }
  function cylinder(mat,s,y,d,r,h,n=24,lift=1) {
    const g=new THREE.CylinderGeometry(r,r,h,n);g.translate(s,y,d);put(g,mat,lift);
  }
  function disk(mat,s,y,d,r,thickness,n=16) {
    const g=new THREE.CylinderGeometry(r,r,thickness,n);g.rotateZ(Math.PI/2);
    g.translate(s,y,d);put(g,mat);
  }
  function sector(mat,s,y,d,r,thick,width,n) {
    const shape=new THREE.Shape();
    for(let i=0;i<=n;i++){const a=-Math.PI/2+i*Math.PI/(2*n),x=s+r*Math.cos(a),z=y+r*Math.sin(a);i?shape.lineTo(x,z):shape.moveTo(x,z);}
    for(let i=n;i>=0;i--){const a=-Math.PI/2+i*Math.PI/(2*n);shape.lineTo(s+(r-thick)*Math.cos(a),y+(r-thick)*Math.sin(a));}
    shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:width,bevelEnabled:false,steps:1});g.translate(0,0,d-width/2);put(g,mat);
  }
  return {box,beam,cylinder,disk,sector,put};
}
