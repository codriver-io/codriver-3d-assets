import * as T from 'three';
// Original metre-scale facade, moulding and polygon-roof primitives.
export const ANGLE=-50*Math.PI/180;
export const world=([x,y,z])=>[x*Math.cos(ANGLE)+z*Math.sin(ANGLE),y,-x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];
export function kit(b,near){
 const segments=near?6:2;
 const shape=p=>new T.Shape(p.map(([x,y])=>new T.Vector2(x,y)));
 const put=(g,m)=>{g.computeVertexNormals();b.put(g,m,0,0);};
 const face=(x,z,angle)=>({x,z,angle});
 function place(g,f,y=0,off=0){g.rotateY(f.angle);g.translate(f.x+Math.sin(f.angle)*off,y,f.z+Math.cos(f.angle)*off);return g;}
 function pointed(w,h){const r=w/2,R=w*.92,a=Math.acos((R-r)/R),rise=Math.min(h,R*Math.sin(a)),spring=h-rise,p=[[-r,0],[r,0],[r,spring]];
  for(let i=1;i<=segments;i++){const t=a*i/segments;p.push([r-R+R*Math.cos(t),spring+rise*Math.sin(t)/Math.sin(a)]);}
  for(let i=segments-1;i>=0;i--){const t=a*i/segments;p.push([-r+R-R*Math.cos(t),spring+rise*Math.sin(t)/Math.sin(a)]);}return p;
 }
 const rect=(w,h)=>[[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]];
 function solid(m,p,f,y,depth=.7,holes=[]){const s=shape(p);for(const hp of holes)s.holes.push(new T.Path(hp.map(([x,y])=>new T.Vector2(x,y))));const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:1});g.translate(0,0,-depth);put(place(g,f,y),m);}
 function panel(m,p,f,y,off=0){put(place(new T.ShapeGeometry(shape(p)),f,y,off),m);}
 function border(m,p,t,f,y,off=.08){
  // Flat moulding ribbons retain curved silhouettes without 12 hidden box faces
  // per sampled arc segment. Each band has its own normal offset.
  const pos=[],ix=[];
  for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],dx=c[0]-a[0],dy=c[1]-a[1],len=Math.hypot(dx,dy);if(len<1e-6)continue;const nx=-dy/len*t/2,ny=dx/len*t/2,j=pos.length/3;
   for(const [x,v] of [[a[0]+nx,a[1]+ny],[a[0]-nx,a[1]-ny],[c[0]-nx,c[1]-ny],[c[0]+nx,c[1]+ny]])pos.push(x,Math.max(v,-y),0);
   ix.push(j,j+1,j+2,j,j+2,j+3);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(ix);put(place(g,f,y,off),m);
 }
 function line(m,a,c,w=.12){b.bar(m,[a[0],Math.max(a[1],w/2),a[2]],[c[0],Math.max(c[1],w/2),c[2]],w,w,0,false,0);}
 function faceLine(m,f,a,c,w=.12,off=.12){const dx=c[0]-a[0],dy=c[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len*w/2,ny=dx/len*w/2;const p=[[a[0]+nx,Math.max(0,a[1]+ny)],[a[0]-nx,Math.max(0,a[1]-ny)],[c[0]-nx,Math.max(0,c[1]-ny)],[c[0]+nx,Math.max(0,c[1]+ny)]];panel(m,p,f,0,off);}

 function disk(m,f,y,r,off){put(place(new T.CircleGeometry(r,near?40:16),f,y,off),m);}
 function ring(m,f,y,r,t,off,ns=near?40:16){put(place(new T.RingGeometry(r-t,r,ns),f,y,off),m);}
 function cone(m,x,z,y0,y1,r,ns=8){const g=new T.ConeGeometry(r,y1-y0,ns,1,false);g.translate(x,(y0+y1)/2,z);put(g,m);}
 function cyl(m,x,z,y0,y1,r,ns=near?8:4){const g=new T.CylinderGeometry(r,r,y1-y0,ns);g.translate(x,(y0+y1)/2,z);put(g,m);}
 function prism(m,ring,y0,y1){const g=new T.ExtrudeGeometry(shape(ring.map(([x,z])=>[x,-z])),{depth:y1-y0,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,m);}
 function fan(m,ring,h,peak){const p=ring.flatMap(([x,z])=>[x,h,z]);p.push(...peak);const n=ring.length,ix=[];const area=ring.reduce((a,v,i)=>a+v[0]*ring[(i+1)%n][1]-v[1]*ring[(i+1)%n][0],0);for(let i=0;i<n;i++)ix.push(...(area>0?[i,n,(i+1)%n]:[i,(i+1)%n,n]));const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);put(g,m);}
 function gable(m,x0,x1,z0,z1,eave,ridge){const g=new T.ExtrudeGeometry(shape([[-(z1-z0)/2,0],[(z1-z0)/2,0],[0,ridge-eave]]),{depth:x1-x0,bevelEnabled:false});const p=g.attributes.position,ix=[];for(let i=0;i<p.count;i+=3){if([i,i+1,i+2].every(j=>Math.abs(p.getY(j))<1e-6))continue;ix.push(i,i+1,i+2);}g.setIndex(ix);g.rotateY(Math.PI/2);g.translate(x0,eave,(z0+z1)/2);put(g,m);}
 function window(f,w,h,y,div=2,material='glass'){
  const p=pointed(w,h);panel(material,p,f,y,-.38);border('trim',p,.16,f,y,.07);
  for(let j=1;j<div;j++){const x=-w/2+w*j/div;faceLine('trim',f,[x,y],[x,y+h-w*.72],.1);}
  if(near){faceLine('trim',f,[-w/2,y+h*.54],[w/2,y+h*.54],.1);for(let j=0;j<div;j++){const x=-w/2+w*(j+.5)/div;const q=pointed(w/div-.08,w/div*1.3).map(([u,v])=>[u+x,v+y+h-w*1.42]);border('trim',q,.07,f,0,.14);}}
  return p.map(([x,v])=>[x,y+v]);
 }
 function pinnacle(x,z,y,h=4,r=.32,material='trim'){cyl(material,x,z,y,y+h*.38,r);cone(material,x,z,y+h*.38,y+h,r*1.35,4);if(near)for(let j=1;j<3;j++)for(let a=0;a<4;a++){const t=a*Math.PI/2;cone(material,x+Math.cos(t)*r*.8,z+Math.sin(t)*r*.8,y+h*.35+j*h*.12,y+h*.35+j*h*.12+.28,.13,4);}}
 function parapet(f,len,y,h,count,material='ornament'){
  const holes=[],pitch=(len-.24)/count;
  for(let j=0;j<count;j++){const u=-len/2+.12+pitch*(j+.5),w=pitch*.73;holes.push(pointed(w,h-.3).map(([x,v])=>[x+u,v+.12]));}
  const offset=.28,ff=face(f.x+Math.sin(f.angle)*offset,f.z+Math.cos(f.angle)*offset,f.angle);
  solid(material,rect(len,h),ff,y,.28,holes);
  faceLine('trim',f,[-len/2,y+h],[len/2,y+h],.16,.4);
 }
 return {near,put,face,place,pointed,rect,solid,panel,border,line,faceLine,disk,ring,cone,cyl,prism,fan,gable,window,pinnacle,parapet,box:(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d])};
}
