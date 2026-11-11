import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Original editable construction in local building axes; mapped yaw is baked once at finish.
export function create({detail='near'}={}){
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), N=near?24:12;
 const box=(m,x,y,z,w,h,d,a=0)=>b.box(m,[x,y,z],[w,h,d],a);
 const put=(g,m,x=0,y=0,z=0)=>{g.translate(x,y,z);b.put(g,m);};
 const quad=(m,a,c,d,e)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d,...e],3));const pp=[a,c,d,e],ind=[];for(const tri of [[0,1,2],[0,2,3]]){const A=new THREE.Vector3(...pp[tri[0]]),C=new THREE.Vector3(...pp[tri[1]]),D=new THREE.Vector3(...pp[tri[2]]);if(C.sub(A).cross(D.sub(A)).lengthSq()>1e-12)ind.push(...tri);}if(!ind.length){g.dispose();return;}const used=[...new Set(ind)];g.setAttribute('position',new THREE.Float32BufferAttribute(used.flatMap(i=>pp[i]),3));g.setIndex(ind.map(i=>used.indexOf(i)));g.computeVertexNormals();b.put(g,m);};
 const cyl=(m,x,y,z,rb,rt,h,n=N)=>put(new THREE.CylinderGeometry(rt,rb,h,n),m,x,y+h/2,z);
 const dome=(m,x,y,z,r,h)=>{const g=new THREE.SphereGeometry(r,N,near?10:6,0,Math.PI*2,0,Math.PI/2);g.scale(1,h/r,1);put(g,m,x,y,z);};
 const prism=(m,points,z0,d)=>{const s=new THREE.Shape(points.map(p=>new THREE.Vector2(...p)));const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:near?12:6});put(g,m,0,0,z0);};
 const gable=(m,x,y,z,w,d,h)=>{prism(m,[[x-w/2,y],[x+w/2,y],[x,y+h]],z-d/2,d);};
 const hip=(m,x,y,z,w,d,h)=>{const base=[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2]],ridge=Math.abs(d-w)/2,wide=w>d,top=wide?[[-ridge,h,0],[ridge,h,0]]:[[0,h,-ridge],[0,h,ridge]];const g=new THREE.BufferGeometry(),p=[...base,...top].flatMap(q=>[q[0]+x,q[1]+y,q[2]+z]);g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(wide?[0,4,5,0,5,1,1,5,2,2,5,4,2,4,3,3,4,0,3,0,1,3,1,2]:[0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0,3,0,1,3,1,2]);const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();b.put(flat,m);};
 // A masonry/glazing mosaic: windows REPLACE wall faces, with no coplanar backing face.
 const wall=(m,x,y,z,w,h,side=0,cols=0,rows=0)=>{
  const theta=side*Math.PI/2,tx=Math.cos(theta),tz=-Math.sin(theta),nx=Math.sin(theta),nz=Math.cos(theta);
  const p=(u,v)=>[x+tx*u,y+v,z+tz*u];
  if(!cols||!rows){quad(m,p(-w/2,0),p(w/2,0),p(w/2,h),p(-w/2,h));return;}
  const cw=w/cols,rh=h/rows,wx=cw*.53,wh=rh*.56;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
   const a=-w/2+i*cw,c=a+cw,l=a+(cw-wx)/2,r=l+wx,bt=j*rh,t=bt+rh,lo=bt+rh*.22,hi=lo+wh;
   for(const [u,v,U,V,mat] of [[a,bt,c,lo,m],[a,hi,c,t,m],[a,lo,l,hi,m],[r,lo,c,hi,m],[l,lo,r,hi,'glass']])quad(mat,p(u,v),p(U,v),p(U,V),p(u,V));
  }
 };
 const block=(m,x,y,z,w,h,d,cols=0,rows=0,roof='roof')=>{
  wall(m,x,y,z+d/2,w,h,0,cols,rows);wall(m,x+w/2,y,z,d,h,1,Math.max(0,Math.round(cols*d/w)),rows);wall(m,x,y,z-d/2,w,h,2,cols,rows);wall(m,x-w/2,y,z,d,h,3,Math.max(0,Math.round(cols*d/w)),rows);
  if(roof)quad(roof,[x-w/2,y+h,z+d/2],[x+w/2,y+h,z+d/2],[x+w/2,y+h,z-d/2],[x-w/2,y+h,z-d/2]);
 };
 const arch=(m,x,y,z,w,h,d)=>{const s=new THREE.Shape();s.moveTo(x-w/2,y);s.lineTo(x+w/2,y);s.lineTo(x+w/2,y+h-w/2);s.absarc(x,y+h-w/2,w/2,0,Math.PI,false);s.lineTo(x-w/2,y);put(new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:near?12:6}),m,0,0,z);};
 const clock=(x,y,z,r,side=0)=>{const a=side*Math.PI/2,g=new THREE.CylinderGeometry(r,r,.22,near?24:12);g.rotateX(Math.PI/2);g.rotateY(a);put(g,'trim',x,y,z);const hand=(len,angle)=>{const ca=Math.cos(angle),sa=Math.sin(angle),u=len*ca/2,v=len*sa/2;box('dark',x+u*Math.cos(a),y+v,z-u*Math.sin(a),len,.15,.28,-a);};if(near){const g2=new THREE.BoxGeometry(.17,r*.95,.26);g2.rotateZ(-.6);g2.rotateY(a);put(g2,'dark',x,y+r*.15,z+Math.cos(a)*.15);}};
 const finish=()=>{const group=b.finish();for(const mesh of group.children)mesh.geometry.rotateY(SPEC.rotation);return group;};
 const W=SPEC.widthM,D=SPEC.depthM,H=SPEC.height;
 // Factual OSM plan is in geographic metres. Convert to authoring axes before baking the mapped yaw.
 const inv=([x,y,z])=>[Math.cos(SPEC.rotation)*x-Math.sin(SPEC.rotation)*z,y,Math.sin(SPEC.rotation)*x+Math.cos(SPEC.rotation)*z];
 const Q=(m,...p)=>quad(m,...p.map(inv));
 const plan=FOOTPRINTS[0].slice(0,-1).map(([lng,lat])=>[(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),-(lat-SPEC.origin[1])*111320]);
 const polygon=(m,p,y)=>{const g=new THREE.ShapeGeometry(new THREE.Shape(p.map(([x,z])=>new THREE.Vector2(x,-z))));g.rotateX(-Math.PI/2);g.translate(0,y,0);g.rotateY(-SPEC.rotation);b.put(g,m);};
 const baseShape=new THREE.Shape(plan.map(([x,z])=>new THREE.Vector2(x,-z))),baseGeom=new THREE.ExtrudeGeometry(baseShape,{depth:1,bevelEnabled:false});baseGeom.rotateX(-Math.PI/2);baseGeom.rotateY(-SPEC.rotation);b.put(baseGeom,'base');
 const sideFace=(A,C,lo,hi,m,sign=1,u0=0,u1=1)=>{const p=(u,y)=>[A[0]+(C[0]-A[0])*u,y,A[1]+(C[1]-A[1])*u],pp=[p(u0,lo),p(u0,hi),p(u1,hi),p(u1,lo)];Q(m,...(sign>0?pp:pp.reverse()));};
 const grid=(A,C,lo,hi,m,cols,rows,sign=1,curtain=false)=>{for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const a=i/cols,c=(i+1)/cols,y=lo+(hi-lo)*j/rows,Y=lo+(hi-lo)*(j+1)/rows,ww=curtain?.88:.58,hh=curtain?.84:.57,l=a+(c-a)*(1-ww)/2,r=c-(c-a)*(1-ww)/2,bt=y+(Y-y)*(1-hh)/2,tp=Y-(Y-y)*(1-hh)/2;for(const [u,L,U,H,mat]of[[a,y,c,bt,m],[a,tp,c,Y,m],[a,bt,l,tp,m],[r,bt,c,tp,m],[l,bt,r,tp,'glass']])sideFace(A,C,L,H,mat,sign,u,U);}};
 const wing=plan.slice(3,36),area=wing.reduce((s,p,i)=>{const q=wing[(i+1)%wing.length];return s+p[0]*q[1]-q[0]*p[1];},0),sign=Math.sign(area);
 // Four-storey office wing, with actual taper and entrance returns, not a rectangular substitute.
 for(let i=0;i<wing.length;i++){const A=wing[i],C=wing[(i+1)%wing.length],len=Math.hypot(C[0]-A[0],C[1]-A[1]);grid(A,C,1,17.2,((i>=11&&i<=13)||(i>=28&&i<=31))?'metal':'brick',Math.max(1,Math.round(len/(near?2.6:4.5))),4,sign,(i>=11&&i<=13)||(i>=28&&i<=31));}
 polygon('roof',wing,17.2);
 const head=[...plan.slice(35),...plan.slice(0,4)];polygon('roof',head,14.2);
 // Council head follows the mapped rounded arc. Pale stone is mostly opaque above the low windows.
 for(let i=35;i<plan.length+3;i++){
  const A=plan[i%plan.length],C=plan[(i+1)%plan.length],len=Math.hypot(C[0]-A[0],C[1]-A[1]),circle=i>=61&&i<=plan.length+2,glazed=(i>=35&&i<=42)||(i>=49&&i<=60);
  if(circle){grid(A,C,1,3.7,'trim',1,1,1,true);if(i>=73&&i<=75){sideFace(A,C,3.7,4.8,'stone');grid(A,C,4.8,11.5,'trim',1,2,1,true);sideFace(A,C,11.5,12.8,'stone');}else{const courses=near?12:6;for(let j=0;j<courses;j++)sideFace(A,C,3.7+j*9.1/courses,3.7+(j+1)*9.1/courses,j%3===0?'stone2':'stone');}sideFace(A,C,12.8,14.2,'metal');}
  else if(i>=43&&i<=48)sideFace(A,C,1,14.2,'brick');
  else grid(A,C,1,14.2,glazed?'metal':'brick',Math.max(1,Math.round(len/(near?2.6:4.5))),glazed?3:4,1,glazed);
 }
 // Higher northern office strip gives the screen a real enclosed backing mass.
 const northern=[];for(let i=0;i<head.length;i++){const a=head[i],c=head[(i+1)%head.length],ia=a[1]<=-40,ic=c[1]<=-40;if(ia)northern.push(a);if(ia!==ic){const t=(-40-a[1])/(c[1]-a[1]);northern.push([a[0]+(c[0]-a[0])*t,-40]);}}
 polygon('roof',northern,18);for(let i=0;i<northern.length;i++)sideFace(northern[i],northern[(i+1)%northern.length],14.2,18,'brick');
 // Concave-topped brick screen rises behind the council chamber, tied to the north roof plane.
 const seg=near?24:12,screen=[];for(let i=0;i<=seg;i++){const t=i/seg;screen.push([-19+31*t,-43+3*Math.sin(t*Math.PI),18+2*(2*t-1)**2]);}
 for(let i=0;i<seg;i++){const a=screen[i],c=screen[i+1],th=.42;Q('brick',[a[0],14.2,a[1]],[a[0],a[2],a[1]],[c[0],c[2],c[1]],[c[0],14.2,c[1]]);Q('brick',[a[0],14.2,a[1]+th],[c[0],14.2,c[1]+th],[c[0],c[2],c[1]+th],[a[0],a[2],a[1]+th]);Q('brick',[a[0],a[2],a[1]],[a[0],a[2],a[1]+th],[c[0],c[2],c[1]+th],[c[0],c[2],c[1]]);}
 for(const a of [screen[0],screen.at(-1)])Q('brick',[a[0],14.2,a[1]],[a[0],a[2],a[1]],[a[0],a[2],a[1]+.42],[a[0],14.2,a[1]+.42]);

 return finish();
}
