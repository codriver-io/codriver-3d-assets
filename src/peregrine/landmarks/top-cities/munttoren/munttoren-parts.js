import * as THREE from 'three';
// Guardhouse way 751683820 north edge: [4.8928583,52.3670802] -> [4.8930658,52.3670858].
export const THETA = 0.04399;
export const OCT = 0.198; // octagonal casing vertices, mapped way 751698384
export const rotate = ([x,y,z]) => [x*Math.cos(THETA)+z*Math.sin(THETA),y,-x*Math.sin(THETA)+z*Math.cos(THETA)];
export function kit(b,near) {
  const steps=near?12:6;
  const arch=(x,y,w,h) => {
    const p=new THREE.Path(),r=w/2,cy=y+h-r;
    p.moveTo(x-r,y);p.lineTo(x+r,y);p.lineTo(x+r,cy);
    for(let i=1;i<=steps;i++){const a=i*Math.PI/steps;p.lineTo(x+r*Math.cos(a),cy+r*Math.sin(a));}
    p.lineTo(x-r,y); return p;
  };
  function plane(g,a,r,offset=0) {
    const c=Math.cos(a),s=Math.sin(a),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,s*x+c*(r+z),y,-c*x+s*(r+z));}
    if(offset)g.translate(0,offset,0);g.computeVertexNormals();return g;
  }
  function face(mat,a,r,y,w,h,holes=[],cx=0) {
    const s=new THREE.Shape();s.moveTo(cx-w/2,y);s.lineTo(cx+w/2,y);s.lineTo(cx+w/2,y+h);s.lineTo(cx-w/2,y+h);s.closePath();
    s.holes=holes.map(v=>arch(...v));
    b.put(plane(new THREE.ShapeGeometry(s,steps),a,r),mat);
  }
  function surround(mat,a,r,x,y,w,h,border=.16){
    const outer=arch(x,y-border,w+2*border,h+2*border),s=new THREE.Shape(outer.getPoints());s.holes=[arch(x,y,w,h)];
    b.put(plane(new THREE.ShapeGeometry(s,steps),a,r),mat);
  }
  function pane(mat,a,r,x,y,w,h) {const s=arch(x,y,w,h);b.put(plane(new THREE.ShapeGeometry(new THREE.Shape(s.getPoints()),steps),a,r),mat);}
  function loft(mat,profile,n=8,phase=OCT,center=[0,0]) {
    const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n,Math.PI/2-phase);g.translate(center[0],0,center[1]);b.put(g,mat);
  }
  function disk(mat,a,r,y,radius) {const g=new THREE.CircleGeometry(radius,near?48:24);g.translate(0,y,0);b.put(plane(g,a,r),mat);}
  function arcbar(mat,a,r,points,width){for(let i=1;i<points.length;i++){
    const cv=([x,y])=>[Math.sin(a)*x+Math.cos(a)*r,y,-Math.cos(a)*x+Math.sin(a)*r];b.bar(mat,cv(points[i-1]),cv(points[i]),width);
  }}
  function sphere(mat,center,r){const g=new THREE.SphereGeometry(r,near?10:6,near?6:4);g.translate(...center);b.put(g,mat);}
  return {arch,plane,face,surround,pane,loft,disk,arcbar,sphere,near};
}
