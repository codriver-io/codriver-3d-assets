import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Original editable construction in local building axes; mapped yaw is baked once at finish.
export function create({detail='near'}={}){
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), N=near?24:12;
 const box=(m,x,y,z,w,h,d,a=0)=>b.box(m,[x,y,z],[w,h,d],a);
 const put=(g,m,x=0,y=0,z=0)=>{g.translate(x,y,z);b.put(g,m);};
 const quad=(m,a,c,d,e)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d,...e],3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();b.put(g,m);};
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
 const PLAN=[[-7.2,14.7],[-8.5,14.7],[-27.8,14.9],[-28,-2.5],[-23.1,-5.3],[-18.5,-5.3],[-18.5,-12],[-7.7,-12],[-7.7,-5.9],[12.4,-5.9],[12.4,-11.3],[21.8,-11.3],[21.8,-4.8],[28.9,-4.8],[28.9,.6],[28.9,5.6],[21.8,5.6],[21.8,7.3],[5.1,7.4],[-4.8,7.5],[-4.7,9.3],[-7.2,9.3]];
 const hole=(x,y,w,h)=>{const p=new THREE.Path(),r=w/2;p.moveTo(x-r,y);p.lineTo(x+r,y);p.lineTo(x+r,y+h-r);p.absarc(x,y+h-r,r,0,Math.PI,false);p.lineTo(x-r,y);return p;};
 for(let i=0;i<PLAN.length;i++){
  const a=PLAN[i],c=PLAN[(i+1)%PLAN.length],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),x=(a[0]+c[0])/2,z=(a[1]+c[1])/2,theta=Math.atan2(dz,-dx);
  let h=x<-18?9.7:x<-7?11.2:(z<0&&x<22)?6.5:1.15;
  if(L<2)h=Math.min(h,2.1);
  const pts=[[-L/2,0],[L/2,0],[L/2,h]];for(let k=1;k<=6;k++)pts.push([L/2-k*L/6,h+(.14*Math.sin(i*2+k*3))]);
  const shape=new THREE.Shape(pts.map(p=>new THREE.Vector2(...p)));
  if(h>5&&L>10){const count=Math.floor(L/6);for(let j=0;j<count;j++)shape.holes.push(hole(-L/2+(j+.5)*L/count,2.3,1.8,3.0));}
  const g=new THREE.ExtrudeGeometry(shape,{depth:.9,bevelEnabled:false,curveSegments:near?6:3});g.translate(0,0,-.9);g.rotateY(theta);put(g,'stone',x,0,z);
 }
 // A raised stone floor records the nave without recreating its lost roof.
 {const shape=new THREE.Shape(PLAN.map(([x,z])=>new THREE.Vector2(x,-z))),g=new THREE.ShapeGeometry(shape);g.rotateX(-Math.PI/2);put(g,'stone',0,.18,0);}
 // Monumental surviving arch at the transept. Its opening is not a black decal.
 {const pts=[[-7,0],[7,0],[7,10.7]];for(let i=0;i<=16;i++){const a=i*Math.PI/16;pts.push([6*Math.cos(a),10.4+3.22*Math.sin(a)]);}pts.push([-7,10.6]);
  const shape=new THREE.Shape(pts.map(p=>new THREE.Vector2(...p)));shape.holes.push(hole(0,.2,8.6,10.35));
  const g=new THREE.ExtrudeGeometry(shape,{depth:1.05,bevelEnabled:false,curveSegments:near?12:6});g.rotateY(Math.PI/2);put(g,'stone',-8.45,0,.8);
 }
 // Surviving engaged pilasters and the deep moulded archivolt frame the great arch.
 for(const z of [.8-4.9,.8+4.9]){
  box('stone',-7.4,4.8,z,.7,9.6,.65);box('stone',-7.4,.4,z,1.1,.8,1.2);box('stone',-7.4,9.6,z,1.0,.5,1.25);
  for(const dz of near?[-.20,.20]:[0])cyl('stone',-6.95,.8,z+dz,near?.17:.22,near?.17:.22,8.6,near?8:6);
 }
 {const p=[];for(let i=0;i<=16;i++){const a=i*Math.PI/16;p.push([4.75*Math.cos(a),6.25+4.75*Math.sin(a)]);}for(let i=16;i>=0;i--){const a=i*Math.PI/16;p.push([4.3*Math.cos(a),6.25+4.3*Math.sin(a)]);}const shape=new THREE.Shape(p.map(p=>new THREE.Vector2(...p))),g=new THREE.ExtrudeGeometry(shape,{depth:.4,bevelEnabled:false});g.rotateY(Math.PI/2);put(g,'stone',-7.45,0,.8);}
 // Short surviving vaulted remnant and rear sanctuary; the long nave remains open.
 box('stone',-19.1,5.3,.8,1.1,10.6,13.4);
 {const ps=[],ix=[],n=near?24:12,ri=4.3,ro=5.15,cy=6.25;
  for(const x of [-18.55,-8.3])for(const r of [ri,ro])for(let i=0;i<=n;i++){const a=i*Math.PI/n;ps.push(x,cy+Math.sin(a)*r,.8+Math.cos(a)*r);}
  const stride=n+1;for(let i=0;i<n;i++){const a=i,c=i+1,A=stride+i,C=stride+i+1,B=2*stride+i,D=2*stride+i+1,E=3*stride+i,F=3*stride+i+1;ix.push(a,c,B,c,D,B,A,E,C,C,E,F,a,A,c,c,A,C,B,D,E,D,F,E);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.setIndex(ix);g.computeVertexNormals();b.put(g,'stone');
 }
 quad('stone',[-18.55,6.25,5.1],[-8.3,6.25,5.1],[-8.3,6.25,5.95],[-18.55,6.25,5.95]);
 quad('stone',[-18.55,6.25,-4.35],[-8.3,6.25,-4.35],[-8.3,6.25,-3.5],[-18.55,6.25,-3.5]);
 for(const z of [-4.35,5.95])box('stone',-13.4,3.125,z,10.3,6.25,.9);
 // Original corner buttresses contact the high transept and ground.
 for(const z of [-5.8,7.4]){box('stone',-7.5,3.8,z,2.1,7.6,2);box('stone',-9,5.2,z,1.1,10.4,1.8);}
 for(let i=0;i<(near?28:14);i++){const x=-2+i*1.05,z=x>21.5?4.5:6.5+.2*Math.sin(i*2.1),h=.3+.18*(1+Math.sin(i));box('stone',x,h/2,z,.7,h,.75);}
 // Exact mapped campanario, rotated separately to its own two OSM controls.
 const C=[-7.9,18.194],A=88.982*Math.PI/180,P=(u,y,v)=>[C[0]+Math.cos(A)*u+Math.sin(A)*v,y,C[1]-Math.sin(A)*u+Math.cos(A)*v],defs=[[-2.35,1.15,1,.44],[-.65,1.15,1,.44],[1,.85,.68,.29],[2.35,.85,.68,.29]];
 const bellWall=new THREE.Shape([[-3.455,0],[3.455,0],[3.455,6.4],[-3.455,6.4]].map(p=>new THREE.Vector2(...p)));
 for(const [u,w]of defs)bellWall.holes.push(hole(u,2.65,w,3.05));
 {const g=new THREE.ExtrudeGeometry(bellWall,{depth:1.29,bevelEnabled:false,curveSegments:near?12:6});g.translate(0,0,-.645);g.rotateY(A);put(g,'brick',C[0],0,C[1]);}
 for(const [u,w,h,r]of defs){
  b.box('timber',P(u,5,0),[w+.10,.14,.4],A);
  const pts=[[r,0],[r*.98,h*.08],[r*.83,h*.18],[r*.59,h*.48],[r*.4,h*.82],[r*.23,h*.96],[r*.1,h],[r*.07,h*.93],[r*.16,h*.87],[r*.3,h*.78],[r*.45,h*.43],[r*.78,h*.1],[r*.86,h*.04],[r,0]].map(p=>new THREE.Vector2(...p));
  const g=new THREE.LatheGeometry(pts,near?18:10);put(g,'bronze',...P(u,4.78-h,0));
  const neck=new THREE.CylinderGeometry(.06,.06,.22,6);put(neck,'bronze',...P(u,4.89,0));
  const rod=new THREE.CylinderGeometry(.04,.04,h-.01,6);put(rod,'dark',...P(u,4.78-h/2-.05,0));
 }

 return finish();
}
