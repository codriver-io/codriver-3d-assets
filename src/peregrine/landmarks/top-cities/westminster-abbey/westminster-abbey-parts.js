import * as THREE from 'three';
// Original low-poly architectural primitives; offsets are in real metres.
export function pointed(w,h,n) {
  const spring=h-w*.8,p=[[-w/2,0],[w/2,0],[w/2,spring]];
  for(let i=1;i<=n;i++){const t=i/n;p.push([w/2*(1-t*t),spring+w*.8*t]);}
  for(let i=n-1;i>=0;i--){const t=i/n;p.push([-w/2*(1-t*t),spring+w*.8*t]);}return p;
}
export function parts(b,near) {
  const n=near?5:2,path=pts=>new THREE.Shape(pts.map(v=>new THREE.Vector2(...v)));
  const put=(g,mat='stone')=>{g.computeVertexNormals();b.put(g,mat);};
  function volume(pts,y,h,mat='stone') {
    const g=new THREE.ExtrudeGeometry(path(pts.map(([x,z])=>[x,-z])),{depth:h,bevelEnabled:false,curveSegments:1});
    g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,mat);
  }
  function face(g,axis,u,y,plane) {
    if(axis==='W')g.rotateY(-Math.PI/2);if(axis==='E')g.rotateY(Math.PI/2);if(axis==='N')g.rotateY(Math.PI);
    g.translate(...(axis==='W'||axis==='E'?[plane,y,u]:[u,y,plane]));return g;
  }
  const xyz=(axis,u,y,p)=>axis==='W'||axis==='E'?[p,y,u]:[u,y,p];
  function panel(mat,pts,axis,u,y,p){put(face(new THREE.ShapeGeometry(path(pts)),axis,u,y,p),mat);}
  function window(axis,u,y,p,w,h,mat='glass',mullions=1) {
    panel(mat,pointed(w,h,n),axis,u,y,p);
    const outer=path(pointed(w+.65,h+.45,n));outer.holes.push(new THREE.Path(pointed(w,h,n).map(v=>new THREE.Vector2(...v)).reverse()));
    put(face(new THREE.ShapeGeometry(outer),axis,u,y,p));
    for(let i=1;i<=mullions;i++) {
      const d=(i/(mullions+1)-.5)*w,hh=h-w*.8+Math.sqrt(Math.max(0,1-Math.abs(d)*2/w))*w*.8;
      b.bar('stone',xyz(axis,u+d,y,p),xyz(axis,u+d,y+hh,p),near?.17:.25);
    }
    if(near&&h>8)for(const yy of [h*.32,h*.62])b.bar('stone',xyz(axis,u-w/2,y+yy,p),xyz(axis,u+w/2,y+yy,p),.18);
  }
  function rose(axis,u,y,p,r,mat='glass',petals=12) {
    put(face(new THREE.CircleGeometry(r,near?48:24),axis,u,y,p),mat);
    put(face(new THREE.RingGeometry(r-.24,r+.26,near?48:24),axis,u,y,p));
    put(face(new THREE.RingGeometry(r*.27,r*.32,near?24:12),axis,u,y,p));
    for(let i=0;i<petals;i++){const t=i*2*Math.PI/petals;b.bar('stone',xyz(axis,u+Math.cos(t)*r*.30,y+Math.sin(t)*r*.30,p),xyz(axis,u+Math.cos(t)*r*.97,y+Math.sin(t)*r*.97,p),near?.16:.25);}
    if(near)for(let i=0;i<petals;i++){const t=i*2*Math.PI/petals;put(face(new THREE.RingGeometry(r*.13,r*.16,8),axis,u+Math.cos(t)*r*.76,y+Math.sin(t)*r*.76,p));}
  }
  function gable(x0,x1,z0,z1,eave,ridge,across=false,mat='roof') {
    const g=new THREE.ExtrudeGeometry(path([[-z0,eave],[-z1,eave],[-(z0+z1)/2,ridge]]),{depth:x1-x0,bevelEnabled:false,curveSegments:1});
    g.rotateY(Math.PI/2);g.translate(x0,0,0);if(across)g.rotateY(Math.PI/2);put(g,mat);
  }
  function pinnacle(x,z,base,tip,r=.65) {
    const stem=tip-base>4?tip-3:base;
    if(stem>base)b.box('stone',[x,(base+stem)/2,z],[r*1.5,stem-base,r*1.5]);
    const g=new THREE.ConeGeometry(r,tip-stem,4);g.rotateY(Math.PI/4);g.translate(x,(tip+stem)/2,z);put(g);
    if(near&&stem>base)for(let y=stem+.7;y<tip-.5;y+=.9)b.box('stone',[x,y,z],[r*.8,.24,r*.8]);
  }
  function flying(x,z0,z1,y0,y1) {
    const pts=[],seg=near?6:2;
    for(let i=0;i<=seg;i++){const t=i/seg;pts.push([z0+(z1-z0)*t,y0+(y1-y0)*Math.sqrt(t)]);}
    const outline=[...pts,...pts.slice().reverse().map(([z,y])=>[z,y-1.3])];
    const g=new THREE.ExtrudeGeometry(path(outline.map(([z,y])=>[-z,y])),{depth:near?.9:1.1,bevelEnabled:false});
    g.rotateY(Math.PI/2);g.translate(x-(near?.45:.55),0,0);put(g);
    return {outer:[x,y0-.5,z0],inner:[x,y1-.5,z1]};
  }
  return {volume,window,rose,gable,pinnacle,flying,panel,xyz,put,box:b.box,bar:b.bar,near};
}
