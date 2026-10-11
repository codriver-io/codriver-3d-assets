import * as THREE from 'three';

// Original metric masonry kit; UVs are removed by assetBuilder.
export function makeKit(b, near) {
  const segments = near ? 10 : 5;
  const box = (mat,x0,x1,y0,y1,z0,z1) => b.box(mat,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
  function profile(cx,bottom,r,spring) {
    const s = new THREE.Shape();
    s.moveTo(cx-r,bottom); s.lineTo(cx+r,bottom); s.lineTo(cx+r,spring);
    for(let i=1;i<=segments;i++) { const t=i*Math.PI/segments; s.lineTo(cx+r*Math.cos(t),spring+r*Math.sin(t)); }
    s.closePath(); return s;
  }
  function putShape(shape, mat, face, plane, depth=0.2) {
    const g=depth>0 ? new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:segments}) : new THREE.ShapeGeometry(shape,segments);
    // Shapes live in XY; their +z front is moved onto a chosen exterior plane.
    g.translate(0,0,-depth);
    if(face==='N')g.rotateY(Math.PI);
    if(face==='E')g.rotateY(Math.PI/2);
    if(face==='W')g.rotateY(-Math.PI/2);
    g.translate(face==='E'||face==='W'?plane:0,0,face==='S'||face==='N'?plane:0);
    b.put(g,mat);
  }
  // Coordinates along N/W facades are negated by the face transform.
  const along = (face,u) => face==='N'||face==='E' ? -u : u;
  function wall(face,plane,u0,u1,y0,y1,holes=[],depth=1.5) {
    let a=along(face,u0),c=along(face,u1); if(a>c)[a,c]=[c,a];
    const s=new THREE.Shape();s.moveTo(a,y0);s.lineTo(c,y0);s.lineTo(c,y1);s.lineTo(a,y1);s.closePath();
    for(const h of holes) { const t=profile(along(face,h.c),h.b,h.r,h.s); const path=new THREE.Path(t.getPoints());s.holes.push(path); }
    putShape(s,'brick',face,plane,depth);
  }
  function patch(face,plane,c,bottom,r,spring,mat='glass',depth=0) {
    putShape(profile(along(face,c),bottom,r,spring),mat,face,plane,depth);
  }
  function frame(face,plane,c,bottom,r,spring,t=0.32,mat='trim',depth=0.25) {
    const cc=along(face,c),s=new THREE.Shape();
    s.moveTo(cc+r+t,spring);
    for(let i=1;i<=segments;i++){const a=i*Math.PI/segments;s.lineTo(cc+(r+t)*Math.cos(a),spring+(r+t)*Math.sin(a));}
    s.lineTo(cc-r,spring);
    for(let i=segments-1;i>=0;i--){const a=i*Math.PI/segments;s.lineTo(cc+r*Math.cos(a),spring+r*Math.sin(a));}
    s.closePath();putShape(s,mat,face,plane,near?depth:0);
    for(const sign of [-1,1]){
      const q=new THREE.Shape();const x=cc+sign*(r+t/2);
      q.moveTo(x-t/2,bottom);q.lineTo(x+t/2,bottom);q.lineTo(x+t/2,spring+0.03);q.lineTo(x-t/2,spring+0.03);q.closePath();
      putShape(q,mat,face,plane,near?depth:0);
    }
  }
  function window(face,plane,c,bottom,r,spring,{back=true,trim=true}={}) {
    if(back)patch(face,plane-((face==='N'||face==='W')?-1:1)*0.5,c,bottom,r,spring);
    if(trim)frame(face,plane+((face==='N'||face==='W')?-1:1)*0.13,c,bottom,r,spring,near?0.32:0.25);
  }
  function polygon(mat,faces,inside) {
    const p=[];
    for(const face of faces) {
      const a=new THREE.Vector3(...face[0]),c=new THREE.Vector3(...face[1]),d=new THREE.Vector3(...face[2]);
      const n=c.clone().sub(a).cross(d.clone().sub(a));
      const center=face.reduce((s,v)=>s.add(new THREE.Vector3(...v)),new THREE.Vector3()).divideScalar(face.length);
      const reverse=n.dot(center.sub(new THREE.Vector3(...inside)))<0;
      for(let i=1;i<face.length-1;i++)for(const v of reverse?[face[0],face[i+1],face[i]]:[face[0],face[i],face[i+1]])p.push(...v);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();b.put(g,mat);
  }
  function gable(mat,x0,x1,z0,z1,eave,ridge) {
    const x=(x0+x1)/2; const pts=[[x0,eave,z0],[x1,eave,z0],[x,ridge,z0],[x0,eave,z1],[x1,eave,z1],[x,ridge,z1]];
    polygon(mat,[[pts[0],pts[1],pts[2]],[pts[3],pts[5],pts[4]],[pts[0],pts[2],pts[5],pts[3]],[pts[1],pts[4],pts[5],pts[2]],[pts[0],pts[3],pts[4],pts[1]]],[x,eave+0.2,(z0+z1)/2]);
  }
  function hip(mat,x0,x1,z0,z1,eave,peak) {
    const x=(x0+x1)/2,z=(z0+z1)/2;
    polygon(mat,[[[x0,eave,z0],[x1,eave,z0],[x,peak,z]],[[x1,eave,z0],[x1,eave,z1],[x,peak,z]],[[x1,eave,z1],[x0,eave,z1],[x,peak,z]],[[x0,eave,z1],[x0,eave,z0],[x,peak,z]],[[x0,eave,z0],[x0,eave,z1],[x1,eave,z1],[x1,eave,z0]]],[x,eave+0.05,z]);
  }
  function disc(face,plane,c,y,r,mat) {
    const s=new THREE.Shape();s.absarc(along(face,c),y,r,0,2*Math.PI,false);putShape(s,mat,face,plane,0.15);
  }
  function cross(x,z,bottom,top=bottom+2.8,mat='copper') {
    box(mat,x-.17,x+.17,bottom,top,z-.17,z+.17);
    box(mat,x-.85,x+.85,top-1.05,top-.77,z-.22,z+.22);
  }
  return {near,box,wall,window,frame,patch,polygon,gable,hip,disc,cross,putShape};
}
