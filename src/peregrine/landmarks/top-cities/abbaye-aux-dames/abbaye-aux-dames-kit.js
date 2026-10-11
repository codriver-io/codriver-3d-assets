import * as THREE from 'three';

// Original texture-free solids and facade surfaces, batched by material.
export function makeKit(b, near) {
  const seg=near?7:4;
  const put=(g,mat)=>{g.computeVertexNormals();b.put(g,mat);};
  function solid(mat, ring, bottom, top) {
    if(b.clip){for(const part of b.clip(ring))rawSolid(mat,part,bottom,top);return;}
    rawSolid(mat,ring,bottom,top);
  }
  function rawSolid(mat,ring,bottom,top) {
    if(!near)ring=simplify(ring,.19);
    const shape=new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:top-bottom,bevelEnabled:false,curveSegments:seg});
    g.rotateX(-Math.PI/2);g.translate(0,bottom,0);put(g,mat);
  }
  function place(g,u,v,y,nx,nz,offset=0) {
    g.rotateY(Math.atan2(nx,nz));g.translate(u+nx*offset,y,v+nz*offset);return g;
  }
  function panel(mat,points,u,v,y,nx,nz,offset=.075) {
    if(b.accept&&!b.accept(u,v))return;
    put(place(new THREE.ShapeGeometry(new THREE.Shape(points.map(p=>new THREE.Vector2(...p)))),u,v,y,nx,nz,offset),mat);
  }
  function archPoints(width,height,n=seg) {
    const r=width/2,spring=height-r,points=[[-r,0],[r,0],[r,spring]];
    for(let i=1;i<=n;i++){const a=Math.PI*i/n;points.push([r*Math.cos(a),spring+r*Math.sin(a)]);}
    return points;
  }
  function face(mat,u,v,y,nx,nz,width,height,holes=[],depth=.45) {
    const sh=new THREE.Shape([new THREE.Vector2(-width/2,0),new THREE.Vector2(width/2,0),new THREE.Vector2(width/2,height),new THREE.Vector2(-width/2,height)]);
    for(const hole of holes){
      const points=(hole.arch===false?[[-hole.w/2,0],[hole.w/2,0],[hole.w/2,hole.h],[-hole.w/2,hole.h]]:archPoints(hole.w,hole.h)).map(([x,y])=>new THREE.Vector2(x+hole.x,y+hole.y));
      sh.holes.push(new THREE.Path(points.reverse()));
    }
    if(near){
      const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:seg});g.translate(0,0,-depth);put(place(g,u,v,y,nx,nz),mat);
    }else{
      const g=new THREE.ShapeGeometry(sh),rear=g.clone();
      const ix=rear.index.array;for(let i=0;i<ix.length;i+=3){const tmp=ix[i];ix[i]=ix[i+2];ix[i+2]=tmp;}
      put(place(g,u,v,y,nx,nz),mat);put(place(rear,u,v,y,nx,nz,-depth),mat);
    }
  }
  function arch(mat,width,height,thickness,u,v,y,nx,nz,offset=.13,depth=.18) {
    const sh=new THREE.Shape(archPoints(width,height).map(p=>new THREE.Vector2(...p)));
    sh.holes.push(new THREE.Path(archPoints(width-thickness*2,height-thickness).map(([x,yy])=>new THREE.Vector2(x,yy)).reverse()));
    // Small surrounds are relief surfaces against masonry; save thickness for
    // the monumental entrance archivolts. Their normal faces outward.
    const g=depth>=.20&&near?new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:seg}):new THREE.ShapeGeometry(sh);
    if(depth>=.20&&near)g.translate(0,0,-depth);
    put(place(g,u,v,y,nx,nz,offset),mat);
  }
  function window(u,v,y,nx,nz,w,h,{mat='recess',frame=near,mullions=false,offset=.07}={}) {
    if(b.accept&&!b.accept(u,v))return;
    panel(mat,archPoints(w,h),u,v,y,nx,nz,offset);
    if(frame)arch('trim',w+.28,h+.14,.14,u,v,y-.035,nx,nz,offset+.13,.15);
    if(mullions&&near){
      const r=w/2,spring=h-r;
      const local=(x,yy)=>[u+nz*x+nx*(offset+.07),y+yy,v-nx*x+nz*(offset+.07)];
      panel('trim',[[-.035,.08],[.035,.08],[.035,h-.09],[-.035,h-.09]],u,v,y,nx,nz,offset+.07);
      for(let yy=.65;yy<spring+.01;yy+=.7)panel('trim',[[-r+.05,yy-.028],[r-.05,yy-.028],[r-.05,yy+.028],[-r+.05,yy+.028]],u,v,y,nx,nz,offset+.07);
    }
  }
  function cylinder(mat,u,v,r,bot,top,sides=near?12:8) {
    const g=new THREE.CylinderGeometry(r,r,top-bot,sides);g.translate(u,(bot+top)/2,v);put(g,mat);
  }
  function loft(mat,ring,fn,base=.18) {
    if(b.clip){for(const part of b.clip(ring))rawLoft(mat,part,fn,base);return;}
    rawLoft(mat,ring,fn,base);
  }
  function rawLoft(mat,ring,fn,base) {
    if(!near)ring=simplify(ring,.15);
    const positions=[],sh=ring.map(([u,v])=>new THREE.Vector2(u,v)),triangles=THREE.ShapeUtils.triangulateShape(sh,[]);
    for(const tr of triangles){
      for(const i of [tr[0],tr[2],tr[1]]){const [u,v]=ring[i];positions.push(u,fn(u,v),v);}
      if(near)for(const i of tr){const [u,v]=ring[i];positions.push(u,fn(u,v)-base,v);}
    }
    const area=ring.reduce((a,p,i)=>a+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
    if(near)for(let i=0;i<ring.length;i++){
      const a=ring[i],c=ring[(i+1)%ring.length],p=[a[0],fn(...a),a[1]],q=[c[0],fn(...c),c[1]],r=[c[0],fn(...c)-base,c[1]],s=[a[0],fn(...a)-base,a[1]];
      for(const pt of area>0?[p,q,r,p,r,s]:[p,r,q,p,s,r])positions.push(...pt);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));put(g,mat);
  }
  function hip(mat,u0,u1,v0,v1,eave,ridge) {
    const half=Math.min(u1-u0,v1-v0)/2;
    const points=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
    if(u1-u0>=v1-v0){
      const a=[u0+half,(v0+v1)/2],c=[u1-half,(v0+v1)/2];
      for(const ring of [[points[0],points[1],c,a],[points[1],points[2],c],[points[2],points[3],a,c],[points[3],points[0],a]])loft(mat,ring,(u,v)=>eave+(ridge-eave)*Math.min(u-u0,u1-u,v-v0,v1-v)/half);
    }else{
      const a=[(u0+u1)/2,v0+half],c=[(u0+u1)/2,v1-half];
      for(const ring of [[points[0],points[1],a],[points[1],points[2],c,a],[points[2],points[3],c],[points[3],points[0],a,c]])loft(mat,ring,(u,v)=>eave+(ridge-eave)*Math.min(u-u0,u1-u,v-v0,v1-v)/half);
    }
  }
  function gable(mat,u0,u1,v0,v1,eave,ridge) {
    const mid=(v0+v1)/2;
    loft(mat,[[u0,v0],[u1,v0],[u1,mid],[u0,mid]],(u,v)=>eave+(ridge-eave)*(v-v0)/(mid-v0));
    loft(mat,[[u0,mid],[u1,mid],[u1,v1],[u0,v1]],(u,v)=>eave+(ridge-eave)*(v1-v)/(v1-mid));
    for(const [u,nx] of [[u0,-1],[u1,1]])panel('stone',[[-(v1-v0)/2,0],[(v1-v0)/2,0],[0,ridge-eave]],u,mid,eave,nx,0,0);
  }
  return {b,near,seg,put,solid,place,panel,archPoints,face,arch,window,cylinder,loft,hip,gable};
}

function simplify(points,tolerance){
  const out=points.map(p=>[...p]);let changed=true;
  while(changed&&out.length>4){changed=false;for(let i=0;i<out.length;i++){
    const a=out[(i+out.length-1)%out.length],p=out[i],c=out[(i+1)%out.length],du=c[0]-a[0],dv=c[1]-a[1],len=du*du+dv*dv;
    const t=len?((p[0]-a[0])*du+(p[1]-a[1])*dv)/len:0;
    if(t>=0&&t<=1&&Math.hypot(p[0]-a[0]-du*t,p[1]-a[1]-dv*t)<tolerance){out.splice(i,1);changed=true;break;}
  }}return out;
}
