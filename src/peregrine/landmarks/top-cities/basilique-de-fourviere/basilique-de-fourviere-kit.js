import * as THREE from 'three';
// Original closed-solid modelling kit; all wall panels stand proud by >= 0.1 m.
export function fourviereKit(b,near) {
  const put=(g,m)=>b.put(g,m,0,0);
  const box=(m,c,s,a=0)=>b.box(m,c,s,a,0,0);
  const bar=(m,a,c,w,d=w)=>b.bar(m,a,c,w,d,0,false,0);
  const lathe=(m,profile,u,v,n=8)=>{
    const g=new THREE.LatheGeometry(profile.map(q=>new THREE.Vector2(...q)),n).toNonIndexed();
    g.rotateY(Math.PI/n);g.translate(u,0,v);g.computeVertexNormals();put(g,m);
  };
  const faceAngle={S:0,E:Math.PI/2,N:Math.PI,W:-Math.PI/2};
  const place=(g,face,p,a,proud=0)=>{
    const t=faceAngle[face];g.rotateY(t);
    g.translate(face==='E'||face==='W'?p+Math.sin(t)*proud:a,0,face==='N'||face==='S'?p+Math.cos(t)*proud:a);return g;
  };
  const radialPut=(g,m,u,v,r,a)=>{g.rotateY(a);g.translate(u+Math.sin(a)*r,0,v+Math.cos(a)*r);put(g,m);};
  const contour=(r,y0,spring,n=near?6:3)=>{
    const pts=[[-r,y0],[r,y0],[r,spring]];
    for(let i=1;i<=n;i++){const a=Math.PI*i/n;pts.push([r*Math.cos(a),spring+r*Math.sin(a)]);}return pts;
  };
  const shape=pts=>new THREE.Shape(pts.map(q=>new THREE.Vector2(...q)));
  const extrusion=(s,d)=>{const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:near?12:5});g.translate(0,0,-d/2);return g;};
  const ringGeom=(y0,w,spring,t,depth)=>{
    const r=w/2,R=r+t,n=near?6:3,pts=[[-R,y0],[-R,spring]];
    for(let i=1;i<=n;i++){const a=Math.PI-i*Math.PI/n;pts.push([R*Math.cos(a),spring+R*Math.sin(a)]);}
    pts.push([R,y0],[r,y0],[r,spring]);
    for(let i=1;i<=n;i++){const a=i*Math.PI/n;pts.push([r*Math.cos(a),spring+r*Math.sin(a)]);}
    pts.push([-r,y0]);return extrusion(shape(pts),depth);
  };
  const arc=(face,p,a,y0,w,spring,t,m='trim',depth=.3)=>put(place(ringGeom(y0,w,spring,t,depth),face,p,a,.08),m);
  const radialArc=(u,v,r,a,y0,w,spring,t,depth)=>radialPut(ringGeom(y0,w,spring,t,depth),'trim',u,v,r,a);
  const pointedRadialArc=(u,v,r,a,y0,w,spring,tip,t,depth)=>{
    const h=w/2,H=h+t,pts=[[-H,y0],[-H,spring],[0,tip+t],[H,spring],[H,y0],[h,y0],[h,spring],[0,tip],[-h,spring],[-h,y0]];
    radialPut(extrusion(shape(pts),depth),'trim',u,v,r,a);
  };
  function panels(y,w,h,mat) {
    const spring=y+h-w/2, glass=new THREE.ShapeGeometry(shape(contour(w/2,y,spring)));
    const surround=ringGeom(y-.15,w,spring,near?.25:.18,near?.24:.14);
    if(!near){const p=surround.attributes.position,ids=[];for(let i=0;i<p.count;i+=3){if(p.getZ(i)>.06 && p.getZ(i+1)>.06 && p.getZ(i+2)>.06)ids.push(i,i+1,i+2);}surround.setIndex(ids);}
    const out=near?[[glass,mat,.13],[surround,'trim',.16]]:[[glass,mat,.13]];
    if(!near)surround.dispose();
    if(near){
      const m=new THREE.BoxGeometry(.09,h-w/2,.15);m.translate(0,y+(h-w/2)/2,.17);out.push([m,'trim',.16]);
      const q=new THREE.BoxGeometry(w,.1,.15);q.translate(0,y+h*.43,.17);out.push([q,'trim',.16]);
    }return out;
  }
  const window=(face,p,a,y,w,h,mat='glass')=>{for(const [g,m,d]of panels(y,w,h,mat))put(place(g,face,p,a,d),m);};
  const radialWindow=(u,v,r,a,y,w,h,mat='glass')=>{for(const [g,m,d]of panels(y,w,h,mat))radialPut(g,m,u,v,r+d,a);};
  const oculus=(face,p,a,y,r,mat='glass')=>{
    const g=new THREE.CircleGeometry(r,near?16:8);g.translate(0,y,0);put(place(g,face,p,a,.16),mat);
    const t=new THREE.RingGeometry(r,r+.23,near?16:8);t.translate(0,y,0);put(place(t,face,p,a,.18),'trim');
  };
  const radialOculus=(u,v,y,a,r,rad)=>{
    const g=new THREE.CircleGeometry(rad,near?12:6);g.translate(0,y,0);radialPut(g,'glass',u,v,r+.12,a);
    const t=new THREE.RingGeometry(rad,rad+.2,near?12:6);t.translate(0,y,0);radialPut(t,'trim',u,v,r+.14,a);
  };
  const column=(u,v,y0,y1,r)=>lathe('trim',near?[[0,y0],[r*1.5,y0],[r*1.5,y0+.35],[r,y0+.55],[r*.8,y1-.5],[r*1.5,y1-.4],[r*1.5,y1],[0,y1]]:[[0,y0],[r*1.4,y0],[r*.9,y1],[0,y1]],u,v,near?8:4);
  const spandrel=(face,p,a,w,spring,top,depth)=>{
    const r=w/2,pts=[[-r,top],[r,top],[r,spring]];
    for(let i=1;i<=(near?10:4);i++){const t=i*Math.PI/(near?10:4);pts.push([r*Math.cos(t),spring+r*Math.sin(t)]);}
    put(place(extrusion(shape(pts),depth),face,p,a),'stone');
  };
  const cross=(u,v,y,h,m)=>{box(m,[u,y+h/2,v],[.2,h,.2]);box(m,[u,y+h*.7,v],[1.5,.19,.2]);};
  const figure=(u,v,y,h,m)=>{
    lathe(m,[[0,y],[h*.18,y],[h*.2,y+h*.1],[h*.11,y+h*.62],[h*.15,y+h*.76],[h*.07,y+h*.88],[0,y+h*.88]],u,v,near?8:5);
    const head=new THREE.SphereGeometry(h*.1,near?8:5,near?5:3);head.translate(u,y+h*.91,v);put(head,m);
    bar(m,[u,y+h*.65,v],[u-h*.17,y+h*.78,v],h*.09,h*.08);
  };
  const roof=(m,u0,u1,v0,v1,eave,ridge)=>{
    const s=shape([[v0,eave],[v1,eave],[(v0+v1)/2,ridge]]),g=extrusion(s,u1-u0);
    g.rotateY(Math.PI/2);g.translate((u0+u1)/2,0,v0+v1);put(g,m);
  };
  const pediment=(u0,u1,v0,v1,y,top)=>roof('stone',u0,u1,v0,v1,y,top);
  return {near,put,box,bar,lathe,window,arc,spandrel,column,roof,pediment,oculus,radialPut,radialArc,pointedRadialArc,radialWindow,radialOculus,cross,figure};
}
