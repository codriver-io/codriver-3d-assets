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
 const fw=8.5,front=12.2,back=-4.6,deck=3.0;
 // Original raised-basement hall. Its flat false front masks the gable behind it.
 const sashSide=(side,z0,z1,height,doorZ,windows)=>{const u=z=>-side*z,x=side*(height===6.8?4.25:4.15),lo=Math.min(u(z0),u(z1)),hi=Math.max(u(z0),u(z1)),sh=new THREE.Shape([[lo,0],[hi,0],[hi,height],[lo,height]].map(p=>new THREE.Vector2(...p)));for(const [z,y,w,h]of[...windows.flatMap(z=>[[z,.8,1,1.3],[z,height===6.8?4.1:3.6,.9,1.65]]),[doorZ,3,1,2.3]]){const c=u(z),l=c-w/2,r=c+w/2,t=y+h,f=.07,p=new THREE.Path();p.moveTo(l,y);p.lineTo(r,y);p.lineTo(r,t);p.lineTo(l,t);p.closePath();sh.holes.push(p);const panel=(m,a,Y,C,H)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([a,Y,0,C,Y,0,C,H,0,a,H,0],3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();g.rotateY(side*Math.PI/2);put(g,m,x,0,0);};for(const [a,Y,C,H,m]of[[l,y,r,y+f,'trim'],[l,t-f,r,t,'trim'],[l,y+f,l+f,t-f,'trim'],[r-f,y+f,r,t-f,'trim'],[l+f,y+f,r-f,(y+t)/2-.035,'glass'],[l+f,(y+t)/2+.035,r-f,t-f,'glass'],[l+f,(y+t)/2-.035,r-f,(y+t)/2+.035,'trim']])panel(m,a,Y,C,H);}const g=new THREE.ShapeGeometry(sh);g.rotateY(side*Math.PI/2);put(g,'stone',x,0,0);};
 for(const side of [-1,1])sashSide(side,-4.6,12.2,6.8,2,[-2.2,5.6,9.4]);
 quad('roof',[-4.25,6.8,front],[0,9.8,front],[0,9.8,back],[-4.25,6.8,back]);quad('roof',[0,9.8,front],[4.25,6.8,front],[4.25,6.8,back],[0,9.8,back]);
 const shape=new THREE.Shape([[-4.25,0],[4.25,0],[4.25,11.2],[-4.25,11.2]].map(p=>new THREE.Vector2(...p)));
 for(const [x,y,w,h]of[[-1.2,8.2,.68,1.55],[1.2,8.2,.68,1.55],[0,3,1.8,2.3],[-2.8,4.1,.85,1.5],[2.8,4.1,.85,1.5],[-2.3,.9,1.2,1],[2.6,0,.85,2.1]]){const l=x-w/2,r=x+w/2,t=y+h,fr=.08,p=new THREE.Path();p.moveTo(l,y);p.lineTo(r,y);p.lineTo(r,t);p.lineTo(l,t);p.closePath();shape.holes.push(p);for(const [a,lo,c,hi,m]of[[l,y,r,y+fr,'trim'],[l,t-fr,r,t,'trim'],[l,y+fr,l+fr,t-fr,'trim'],[r-fr,y+fr,r,t-fr,'trim'],[l+fr,y+fr,r-fr,t-fr,'glass']]){const pane=(m,A,Y,C,H)=>quad(m,[A,Y,front],[C,Y,front],[C,H,front],[A,H,front]);if(m==='glass'&&x===0&&y===3){pane('trim',a,lo,c,4.03);pane('glass',a,4.03,-.055,hi);pane('trim',-.055,4.03,.055,hi);pane('glass',.055,4.03,c,hi);}else if(m==='glass'&&h>1.2){const mid=(lo+hi)/2;pane('glass',a,lo,c,mid-.035);pane('trim',a,mid-.035,c,mid+.035);pane('glass',a,mid+.035,c,hi);}else pane(m,a,lo,c,hi);}}
 put(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}),'stone',0,0,front-.12);
 // Lower 1932 gabled addition and the later low shed-roof rear addition.
 for(const side of [-1,1])sashSide(side,-10.4,-4.6,5.8,-6,[-8.8]);
 quad('roof',[-4.15,5.8,-4.6],[0,8,-4.6],[0,8,-10.4],[-4.15,5.8,-10.4]);quad('roof',[0,8,-4.6],[4.15,5.8,-4.6],[4.15,5.8,-10.4],[0,8,-10.4]);
 prism('stone',[[-4.25,6.8],[0,9.8],[4.25,6.8],[4.15,5.8],[0,8],[-4.15,5.8]],back-.08,.08);
 prism('stone',[[-4.15,5.2],[4.15,5.2],[4.15,5.8],[0,8],[-4.15,5.8]],-10.48,.08);
 for(const x of [-4.4,4.4])wall('stone',x,0,-12,3.2,5.2,x>0?1:3,2,1);wall('stone',0,0,-13.6,8.8,5.2,2,4,1);
 quad('roof',[-4.4,5.2,-10.4],[4.4,5.2,-10.4],[4.4,5.2,-13.6],[-4.4,5.2,-13.6]);
 // Raised gallery floor and three-sided shed canopy are attached to the hall.
 for(const x of [-5.25,5.25])box('trim',x,2.89,2.1,2,.22,20.2);box('trim',0,2.89,13.15,12.5,.22,1.9);
 const edges=new Map(),porch=p=>{const ny=new THREE.Vector3(...p[1]).sub(new THREE.Vector3(...p[0])).cross(new THREE.Vector3(...p[2]).sub(new THREE.Vector3(...p[0]))).y;if(ny<0)p.reverse();const face=(m,pp)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pp.flat(),3));g.setIndex(pp.length===3?[0,1,2]:[0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,m);};face('roof',p);face('soffit',p.map(q=>[q[0],q[1]-.12,q[2]]).reverse());for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],key=[a,c].map(q=>q.map(v=>v.toFixed(5)).join(',')).sort().join('|');if(edges.has(key))edges.delete(key);else edges.set(key,[a,c]);}};
 porch([[-6.5,6.5,-8],[-6.5,6.5,12.2],[-4.25,6.8,12.2],[-4.25,6.8,-8]]);porch([[4.25,6.8,-8],[4.25,6.8,12.2],[6.5,6.5,12.2],[6.5,6.5,-8]]);porch([[-4.25,6.8,12.2],[-4.25,6.5,14.3],[4.25,6.5,14.3],[4.25,6.8,12.2]]);
 for(const side of [-1,1]){const B=[side*4.25,6.8,12.2],A=[side*6.5,6.5,12.2],C=[side*6.5,6.5,14.3],D=[side*4.25,6.5,14.3];porch([B,C,A]);porch([B,D,C]);}
 for(const [a,c]of edges.values()){const attached=(Math.abs(Math.abs(a[0])-4.25)<.001&&Math.abs(a[0]-c[0])<.001&&Math.max(a[2],c[2])<=12.2)||(Math.abs(a[2]-12.2)<.001&&Math.abs(c[2]-12.2)<.001&&Math.max(Math.abs(a[0]),Math.abs(c[0]))<=4.25);if(!attached)quad('soffit',[a[0],a[1]-.12,a[2]],[c[0],c[1]-.12,c[2]],c,a);}
 for(const x of [-6.2,6.2])for(const z of [-8,-4,0,4,8,12,14]){cyl('trim',x,0,z,.075,.075,6.27,near?6:4);cyl('trim',x,6.27,z,.14,.14,.15,near?6:4);}
 for(const x of [-2,2]){cyl('trim',x,0,14,.075,.075,6.27,near?6:4);cyl('trim',x,6.27,14,.14,.14,.15,near?6:4);}
 const rail=(A,C)=>{const dx=C[0]-A[0],dz=C[1]-A[1],len=Math.hypot(dx,dz),a=-Math.atan2(dz,dx);for(const y of [3.08,4])box('trim',(A[0]+C[0])/2,y,(A[1]+C[1])/2,len,.1,.1,a);const n=Math.ceil(len/(near?.40:.80));for(let j=0;j<n;j++){const t=(j+.5)/n,g=new THREE.CylinderGeometry(.024,.024,.82,4,1,true);put(g,'trim',A[0]+dx*t,3.54,A[1]+dz*t);}};
 rail([-6.2,14],[-2,14]);rail([2,14],[6.2,14]);for(const x of [-6.2,6.2]){rail([x,-8],[x,-6.85]);rail([x,-5.95],[x,1.15]);rail([x,2.05],[x,14]);}
 // One poured-concrete central flight plus four secondary flights, all on grade and meeting real landings.
 const stair=(m,x,z,w,run,h,n)=>{const s=new THREE.Shape();s.moveTo(-z,0);s.lineTo(-z-run,0);for(let i=0;i<n;i++){const y=(i+1)*h/n,Z=z+run-i*run/n;s.lineTo(-Z,y);s.lineTo(-Z+run/n,y);}s.lineTo(-z,0);const raw=new THREE.ExtrudeGeometry(s,{depth:w,bevelEnabled:false}),pos=raw.getAttribute('position'),kept=[];for(let i=0;i<pos.count;i+=3){const a=new THREE.Vector3().fromBufferAttribute(pos,i),c=new THREE.Vector3().fromBufferAttribute(pos,i+1),d=new THREE.Vector3().fromBufferAttribute(pos,i+2);if(c.clone().sub(a).cross(d.clone().sub(a)).lengthSq()>1e-10&&![a,c,d].every(p=>Math.abs(p.y)<1e-8))kept.push(...a.toArray(),...c.toArray(),...d.toArray());}raw.dispose();const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(kept,3));g.computeVertexNormals();g.rotateY(Math.PI/2);put(g,m,x-w/2,0,0);};
 stair('stairs',0,14.1,3.6,4.8,3,near?18:12);
 for(const x of [-1.95,1.95]){const g=new THREE.ExtrudeGeometry(new THREE.Shape([[-14.1,0],[-18.9,0],[-18.9,.9],[-14.1,3.9]].map(p=>new THREE.Vector2(...p))),{depth:.2,bevelEnabled:false});g.rotateY(Math.PI/2);put(g,'stairs',x-.1,0,0);}
 for(const side of [-1,1])for(const z of [-6,2]){const x=side*7;stair('wood',x,z,1.35,4.8,3,near?18:12);box('trim',side*6.9,2.89,z-.4,1.7,.22,.8);box('trim',side*7.6,1.39,z-.65,.14,2.78,.14);}
 // Original external brick chimney, distinct from the white clapboard and slate-like roof.
 box('brick',-4.65,4.65,8,.9,9.3,.9);box('brick',-4.65,9.2,8,1,.2,1);

 return finish();
}
