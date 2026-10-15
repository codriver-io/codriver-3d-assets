import * as THREE from 'three';
// Polygonal solids and gabled/hipped roof surfaces; no texture, terrain or runtime imports.
export function kit(b, near) {
  const faces = (mat, vertices, triangles) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices.flat(), 3));
    g.setIndex(triangles.flat()); g.computeVertexNormals(); b.put(g, mat);
  };
  function solid(mat, ring, low, high) {
    let points = ring.slice();
    if (points[0][0] === points.at(-1)[0] && points[0][1] === points.at(-1)[1]) points.pop();
    if (!near) {
      // Remove surveyed sub-metre notches in far without altering the major outline.
      for(let round=0;round<4;round++) {
        const next=[];
        for(let i=0;i<points.length;i++) {
          const a=points[(i+points.length-1)%points.length],p=points[i],c=points[(i+1)%points.length];
          const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
          const d=len?Math.abs(dx*(a[1]-p[1])-(a[0]-p[0])*dz)/len:0;
          if(d>.35 || points.length<9)next.push(p);
        }
        if(next.length<3)break;points=next;
      }
    }
    const shape = new THREE.Shape(points.map(([x,z]) => new THREE.Vector2(x,-z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: high-low, bevelEnabled: false, steps: 1, curveSegments: 1 });
    g.rotateX(-Math.PI/2); g.translate(0, low, 0); b.put(g, mat);
  }
  function hip(mat, x,z,w,d,eave,top,hipM=Math.min(w,d)*.48) {
    // Ridge follows long Z. All external faces use explicit outward winding.
    const a=[x-w/2,eave,z-d/2],c=[x+w/2,eave,z-d/2],d1=[x+w/2,eave,z+d/2],e=[x-w/2,eave,z+d/2];
    const r=[x,top,z-d/2+hipM],s=[x,top,z+d/2-hipM];
    faces(mat,[a,c,d1,e,r,s],[[0,4,1],[1,4,5],[1,5,2],[2,5,3],[3,5,4],[3,4,0],[0,1,3],[1,2,3]]);
  }
  function cylinder(mat,x,z,r,lo,hi,r2=r,n=near?16:10) {
    const g=new THREE.CylinderGeometry(r2,r,hi-lo,n,1,false);g.translate(x,(hi+lo)/2,z);b.put(g,mat);
  }
  function panel(mat,x,y,z,w,h,angle=0) {
    const g=new THREE.PlaneGeometry(w,h); g.rotateY(angle);g.translate(x,y,z);b.put(g,mat);
  }
  // Pointed Gothic opening silhouette; backing is placed on the visible exterior.
  function lancet(x,z,w,low,high,angle=0,mat='glass') {
    const verts=[[-w/2,low], [w/2,low], [w/2,high-w*.7],[w*.3,high-w*.3],[0,high],[-w*.3,high-w*.3],[-w/2,high-w*.7]];
    const sh=new THREE.Shape(verts.map(v=>new THREE.Vector2(...v)));
    const g=new THREE.ShapeGeometry(sh);g.rotateY(angle);g.translate(x,0,z);b.put(g,mat);
    if(near){
      const p=verts.slice(2).concat([verts[0]]);
      for(let i=1;i<p.length;i++){
        const cv=([u,y])=>[x+u*Math.cos(angle),y,z-u*Math.sin(angle)];
        b.bar('trim',cv(p[i-1]),cv(p[i]),.16);
      }
      for(const u of [-w/6,w/6]) b.bar('trim',[x+u*Math.cos(angle),low,z-u*Math.sin(angle)],[x+u*Math.cos(angle),high-w*.6,z-u*Math.sin(angle)],.12);
    }
  }
  return {...b,faces,solid,hip,cylinder,panel,lancet,near};
}
