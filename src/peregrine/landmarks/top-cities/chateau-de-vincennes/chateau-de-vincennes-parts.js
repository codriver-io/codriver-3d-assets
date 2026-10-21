import * as THREE from 'three';
// Douglas–Peucker on an open polyline: every dropped vertex stays within tol of the kept chord.
function peucker(pts, tol) {
  const a=pts[0],c=pts.at(-1),dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
  let far=0,at=0;
  for(let i=1;i<pts.length-1;i++){
    const p=pts[i],d=len?Math.abs(dx*(a[1]-p[1])-(a[0]-p[0])*dz)/len:Math.hypot(p[0]-a[0],p[1]-a[1]);
    if(d>far){far=d;at=i;}
  }
  return far>tol?peucker(pts.slice(0,at+1),tol).slice(0,-1).concat(peucker(pts.slice(at),tol)):[a,c];
}
// Closed ring (no repeated end point), split at the vertex farthest from the first. Unlike
// round-by-round neighbour tests, this cannot erode a rounded corner into a chord across a court.
export function simplifyRing(ring, tol) {
  let k=0,best=0;
  ring.forEach((p,i)=>{const d=Math.hypot(p[0]-ring[0][0],p[1]-ring[0][1]);if(d>best){best=d;k=i;}});
  const out=peucker(ring.slice(0,k+1),tol).concat(peucker(ring.slice(k).concat([ring[0]]),tol).slice(1,-1));
  return out.length>=3?out:ring;
}
// Polygonal solids and gabled/hipped roof surfaces; no texture, terrain or runtime imports.
export function kit(b, near) {
  // Flat-shaded: every triangle keeps its own vertices, so roof slopes read as planes and a
  // closing base never bends their normals. create() re-welds only equal position+normal pairs.
  const faces = (mat, vertices, triangles) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(triangles.flat().flatMap((i) => vertices[i]), 3));
    g.computeVertexNormals(); b.put(g, mat);
  };
  function solid(mat, ring, low, high) {
    let points = ring.slice();
    if (points[0][0] === points.at(-1)[0] && points[0][1] === points.at(-1)[1]) points.pop();
    // Remove surveyed sub-metre notches in far without altering the major outline.
    if (!near && points.length >= 9) points = simplifyRing(points, .35);
    const shape = new THREE.Shape(points.map(([x,z]) => new THREE.Vector2(x,-z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: high-low, bevelEnabled: false, steps: 1, curveSegments: 1 });
    g.rotateX(-Math.PI/2); g.translate(0, low, 0); b.put(g, mat);
  }
  // w runs along X and d along Z before an optional yaw (same convention as box()). The ridge
  // follows the footprint's long side (Z when square); hipM is the hip length at each ridge end.
  // base closes the underside for eaves that overhang open space; omit it where the eave sits on
  // a solid top. All external faces use explicit outward winding.
  function hip(mat, x,z,w,d,eave,top,hipM=Math.min(w,d)*.48,{angle=0,base=true}={}) {
    if(w>d){[w,d]=[d,w];angle+=Math.PI/2;}
    const cs=Math.cos(angle),sn=Math.sin(angle),p=(u,y,v)=>[x+u*cs+v*sn,y,z-u*sn+v*cs];
    const a=p(-w/2,eave,-d/2),c=p(w/2,eave,-d/2),d1=p(w/2,eave,d/2),e=p(-w/2,eave,d/2);
    const r=p(0,top,-d/2+hipM),s=p(0,top,d/2-hipM);
    faces(mat,[a,c,d1,e,r,s],[[0,4,1],[1,4,5],[1,5,2],[2,5,3],[3,5,4],[3,4,0],...(base?[[0,1,3],[1,2,3]]:[])]);
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
