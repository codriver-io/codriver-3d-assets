import * as THREE from 'three';

// Original wall kit: punched openings and inset infill, never window overlays.
export function stationKit(b, near) {
  const box=(m,a,z,y0,y1,v0,v1)=>b.box(m,[(a+z)/2,(y0+y1)/2,(v0+v1)/2],[z-a,y1-y0,v1-v0]);
  function points(h,extra=0) {
    const r=h.w/2+extra,y0=h.y0-extra,y1=h.y1+extra;
    const pts=[[h.u-r,y0],[h.u+r,y0]];
    if(h.arch) {
      const spring=h.y1-h.w/2,n=near?14:6;
      for(let i=0;i<=n;i++){const a=i*Math.PI/n;pts.push([h.u+r*Math.cos(a),spring+r*Math.sin(a)]);}
    } else pts.push([h.u+r,y1],[h.u-r,y1]);
    return pts.map(([x,y])=>new THREE.Vector2(x,y));
  }
  function wall(a,z,y0,y1,holes,material='brick',relative=false) {
    const len=Math.hypot(z[0]-a[0],z[1]-a[1]),dx=(z[0]-a[0])/len,dv=(z[1]-a[1])/len;
    const hs=holes.map(h=>({...h,u:relative?h.u:h.u-a[0]}));
    const shape=new THREE.Shape([new THREE.Vector2(0,y0),new THREE.Vector2(len,y0),new THREE.Vector2(len,y1),new THREE.Vector2(0,y1)]);
    for(const h of hs) shape.holes.push(new THREE.Path(points(h)));
    function place(g) {
      g.rotateY(-Math.atan2(dv,dx));g.translate(a[0],0,a[1]);return g;
    }
    const g=new THREE.ExtrudeGeometry(shape,{depth:.8,bevelEnabled:false,curveSegments:1});
    g.translate(0,0,-.8);b.put(place(g),material);
    for(const h of hs) {
      const pane=new THREE.ShapeGeometry(new THREE.Shape(points(h)));
      pane.translate(0,0,-.65);b.put(place(pane),h.y0<3?'glow':'glass');
      if(near) {
        const spring=h.arch?h.y1-h.w/2:h.y1;
        const g=new THREE.BoxGeometry(.10,spring-h.y0,.12);g.translate(h.u,(spring+h.y0)/2,-.38);b.put(place(g),'metal');
        const t=new THREE.BoxGeometry(h.w,.12,.12);t.translate(h.u,h.y0+(spring-h.y0)*.56,-.38);b.put(place(t),'metal');
      }
    }
  }
  function cap(m,ring,y0,y1) {
    const shape=new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:y1-y0,bevelEnabled:false});
    g.rotateX(-Math.PI/2);g.translate(0,y0,0);
    // Roof undersides face the closed station interior. Remove the buried cap.
    if(m==='roof') {
      const n=g.attributes.normal,idx=[];
      for(let i=0;i<n.count;i+=3) if(n.getY(i)>-.9) idx.push(i,i+1,i+2);
      g.setIndex(idx);
    }
    b.put(g,m);
  }
  function edgeBox(m,a,z,y0,y1,width,verticalOnly=false) {
    const len=Math.hypot(z[0]-a[0],z[1]-a[1]);
    const g=new THREE.BoxGeometry(len,y1-y0,width);
    if(verticalOnly) {
      const n=g.attributes.normal,idx=g.index,keep=[];
      for(let i=0;i<idx.count;i+=3) if(Math.abs(n.getY(idx.getX(i)))<.5) keep.push(idx.getX(i),idx.getX(i+1),idx.getX(i+2));
      g.setIndex(keep);
    }
    g.rotateY(-Math.atan2(z[1]-a[1],z[0]-a[0]));
    g.translate((a[0]+z[0])/2,(y0+y1)/2,(a[1]+z[1])/2);b.put(g,m);
  }
  function cylinder(m,u,y,v,r,h,n,axis='y') {
    const g=new THREE.CylinderGeometry(r,r,h,n);
    if(axis==='z')g.rotateX(Math.PI/2);
    g.translate(u,y,v);b.put(g,m);
  }
  function column(u,v) {
    const profile=near?[[.86,1.15],[.86,1.38],[.74,1.55],[.72,2.0],[.73,4.5],[.69,8.5],[.61,12.95],[.68,13.1],[.68,13.35],[.84,13.5],[.87,13.9]]:
      [[.86,1.15],[.72,1.6],[.70,7.0],[.61,13.0],[.87,13.5],[.87,13.9]];
    const g=new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),near?14:7);
    g.translate(u,0,v);b.put(g,'stone');
  }
  function archTrim(u,y0,y1,w,v) {
    const h={u,y0,y1,w,arch:true},shape=new THREE.Shape(points(h,.18));
    shape.holes.push(new THREE.Path(points(h)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:false,curveSegments:1});
    g.translate(0,0,v+.04);b.put(g,'stone');
  }
  return {box,wall,cap,edgeBox,cylinder,column,archTrim};
}
