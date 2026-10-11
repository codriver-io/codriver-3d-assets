import * as THREE from 'three';

// Original architectural kit: polygon solids, split planar roofs and framed openings.
export function kit(b, near) {
 const seg=near?4:1;
 const shape=pts=>new THREE.Shape(pts.map(([x,y])=>new THREE.Vector2(x,y)));
 const put=(g,m)=>{
  // Discard collapsed roof-edge triangles and unused vertices before batching/export.
  const p=g.attributes.position,ix=g.index,kept=[],a=new THREE.Vector3(),c=new THREE.Vector3(),d=new THREE.Vector3();
  for(let i=0;i<(ix?ix.count:p.count);i+=3){const ids=[0,1,2].map(j=>ix?ix.getX(i+j):i+j);a.fromBufferAttribute(p,ids[0]);c.fromBufferAttribute(p,ids[1]).sub(a);d.fromBufferAttribute(p,ids[2]).sub(a);if(c.cross(d).lengthSq()>1e-12)kept.push(...ids);}
  g.setIndex(kept);g.computeVertexNormals();const map=new Map(),positions=[],normals=[],indices=[],n=g.attributes.normal;
  for(const id of kept){if(!map.has(id)){map.set(id,map.size);positions.push(p.getX(id),p.getY(id),p.getZ(id));normals.push(n.getX(id),n.getY(id),n.getZ(id));}indices.push(map.get(id));}
  const clean=new THREE.BufferGeometry();clean.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));clean.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));clean.setIndex(indices);g.dispose();b.put(clean,m,0,0);
 };
 const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
 function solid(m,ring,y0,y1){const g=new THREE.ExtrudeGeometry(shape(ring.map(([x,z])=>[x,-z])),{depth:y1-y0,bevelEnabled:false,steps:1});g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,m);}
 function face(m,pts){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex(pts.length===4?[0,1,2,0,2,3]:[0,1,2]);put(g,m);}
 function loft(m,ring,levels){const cx=ring.reduce((s,p)=>s+p[0],0)/ring.length,cz=ring.reduce((s,p)=>s+p[1],0)/ring.length;let a=0;for(let i=0;i<ring.length;i++){let p=ring[i],q=ring[(i+1)%ring.length];a+=p[0]*q[1]-q[0]*p[1];}const r=a>0?ring:[...ring].reverse();for(let j=0;j<levels.length-1;j++)for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],v=(p,[y,sx,sz=sx])=>[cx+(p[0]-cx)*sx,y,cz+(p[1]-cz)*sz];face(m,[v(p,levels[j]),v(p,levels[j+1]),v(q,levels[j+1]),v(q,levels[j])]);}
 const [y,sx,sz=sx]=levels.at(-1);const g=new THREE.ShapeGeometry(shape(r.map(([x,z])=>[cx+(x-cx)*sx,-cz-(z-cz)*sz])));g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,m);}
 function clip(r,axis,at,sign){let out=[];for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],ip=(p[axis]-at)*sign>=-1e-6,iq=(q[axis]-at)*sign>=-1e-6;if(ip)out.push(p);if(ip!==iq){let t=(at-p[axis])/(q[axis]-p[axis]);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out;}
 function gable(m,r,y,rise,axis=1){let values=r.map(p=>p[axis]),mid=(Math.min(...values)+Math.max(...values))/2,half=(Math.max(...values)-Math.min(...values))/2;const ht=p=>y+(typeof rise==='function'?rise(p):rise)*(1-Math.abs(p[axis]-mid)/half);for(let sign of [-1,1]){let ring=clip(r,axis,mid,sign);if(ring.length<3)continue;const g=new THREE.ShapeGeometry(shape(ring.map(([x,z])=>[x,-z])));g.rotateX(-Math.PI/2);let pos=g.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,ht([pos.getX(i),pos.getZ(i)]));put(g,m);}
 // End closures follow the mapped outline, with no bottom face against the wall top.
 for(let i=0;i<r.length;i++){let p=r[i],q=r[(i+1)%r.length],vp=[p[0],y,p[1]],vq=[q[0],y,q[1]],tp=[p[0],ht(p),p[1]],tq=[q[0],ht(q),q[1]];let area=r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1]},0);face(m,area>0?[vp,tp,tq,vq]:[vq,tq,tp,vp]);}}
 function arch(w,h,pointed=false){if(pointed==='rect')return [[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]];let r=w/2,spring=h-(pointed?w*.72:r),pts=[[-r,0],[r,0],[r,spring]];for(let i=1;i<=seg*2;i++){let t=Math.PI*i/(seg*2);let y=pointed?w*.72*Math.pow(Math.sin(t),.72):r*Math.sin(t);pts.push([r*Math.cos(t),spring+y]);}return pts;}
 function place(g,x,y,z,nx,nz,proud=0){g.rotateY(Math.atan2(nx,nz));g.translate(x+nx*proud,y,z+nz*proud);return g;}
 function panel(m,pts,x,y,z,nx,nz,proud=.08){put(place(new THREE.ShapeGeometry(shape(pts)),x,y,z,nx,nz,proud),m);}
 function window(x,y,z,nx,nz,w,h,pointed=false,m='glass',trim=true){const pts=arch(w,h,pointed);panel(m,pts,x,y,z,nx,nz,.085);if(trim)frame(x,y,z,nx,nz,w,h,pointed);if(near){panel('trim',[[-.055,.15],[.055,.15],[.055,h-.2],[-.055,h-.2]],x,y,z,nx,nz,.27);for(let yy=1;yy<h-w*.6;yy+=1.1)panel('trim',[[-w*.4,yy-.033],[w*.4,yy-.033],[w*.4,yy+.033],[-w*.4,yy+.033]],x,y,z,nx,nz,.275);}}

 function frame(x,y,z,nx,nz,w,h,pointed=false,border=.19){let outer=shape(arch(w+2*border,h+border,pointed));let inner=arch(w,h,pointed).map(([u,v])=>[u,v+.05]);outer.holes.push(new THREE.Path(inner.map(p=>new THREE.Vector2(...p))));let g=new THREE.ShapeGeometry(outer);put(place(g,x,y,z,nx,nz,.20),'trim');}
 function cylinder(m,x,z,y0,y1,r,n=8,rTop=r){const g=new THREE.CylinderGeometry(rTop,r,y1-y0,n,1,true);g.translate(x,(y0+y1)/2,z);put(g,m);}
 function cone(m,x,z,y0,y1,r,n=8){cylinder(m,x,z,y0,y1,r,n,0);}
 function edges(r,cb){let a=r.reduce((s,p,i)=>{let q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1]},0);for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],l=Math.hypot(q[0]-p[0],q[1]-p[1]);if(l<.01)continue;let nx=(q[1]-p[1])/l,nz=-(q[0]-p[0])/l;if(a<0){nx=-nx;nz=-nz;}cb({p,q,l,nx,nz});}}
 function arcade(x,y,z,nx,nz,w,h,ow,oh){let sh=shape([[-ow/2,0],[ow/2,0],[ow/2,oh],[-ow/2,oh]]);sh.holes.push(new THREE.Path(arch(w,h,true).map(([u,v])=>new THREE.Vector2(u,v+.65))));if(near)put(place(new THREE.ExtrudeGeometry(sh,{depth:.28,bevelEnabled:false}),x,y,z,nx,nz,0),'stone');else{const front=new THREE.ShapeGeometry(sh),back=front.clone();const ix=back.index.array;for(let i=0;i<ix.length;i+=3){let a=ix[i];ix[i]=ix[i+2];ix[i+2]=a;}put(place(front,x,y,z,nx,nz,.28),'stone');put(place(back,x,y,z,nx,nz,0),'stone');}}
 // Closed masonry flyer with a curved intrados: the opening below it stays empty.
 function flyer(a,c,width=.95,depth=1.35,sag=1.75){
  const dx=c[0]-a[0],dz=c[2]-a[2],length=Math.hypot(dx,dz),n=near?8:4,pts=[];
  for(let i=0;i<=n;i++){const t=i/n;pts.push([length*t,a[1]+(c[1]-a[1])*t+.18*Math.sin(Math.PI*t)]);}
  for(let i=n;i>=0;i--){const t=i/n;pts.push([length*t,a[1]+(c[1]-a[1])*t-depth-sag*Math.sin(Math.PI*t)]);}
  const g=new THREE.ExtrudeGeometry(shape(pts),{depth:width,bevelEnabled:false});g.translate(0,0,-width/2);g.rotateY(-Math.atan2(dz,dx));g.translate(a[0],0,a[2]);put(g,'stone');
 }
 return {flyer,arcade,near,seg,put,box,solid,face,loft,gable,panel,window,frame,arch,cylinder,cone,edges,bar:b.bar};
}
