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
 const hip=(m,x,y,z,w,d,h)=>{const base=[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2]],ridge=Math.max(0,(d-w)/2),top=[[0,h,-ridge],[0,h,ridge]];const g=new THREE.BufferGeometry(),p=[...base,...top].flatMap(q=>[q[0]+x,q[1]+y,q[2]+z]);g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex([0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0,3,0,1,3,1,2]);g.computeVertexNormals();b.put(g,m);};
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
 block('stone',0,0,0,W,12,D,near?11:7,2);
 block('stone',0,12,-D*.30,W*.94,14,D*.35,0,0);
 // Low sloping auditorium shoulders flank the tall rectangular stage house.
 prism('roof',[[-W*.46,12],[W*.46,12],[W*.36,18],[-W*.36,18]],-D*.14,D*.37);
 // The central Churrigueresque crown and tall engaged finials are the identity.
 const z=D/2-.8;
 {
 const outline=[[-7,7],[7,7],[7,15],[5.4,15.7],[4.6,18],[2,18.6],[0,20.3],[-2,18.6],[-4.6,18],[-5.4,15.7],[-7,15]],s=new THREE.Shape(outline.map(p=>new THREE.Vector2(...p))),hole=new THREE.Path();
 hole.moveTo(-1,12.8);hole.lineTo(1,12.8);hole.lineTo(1,16.2);hole.absarc(0,16.2,1,0,Math.PI,false);hole.lineTo(-1,12.8);s.holes.push(hole);
 put(new THREE.ExtrudeGeometry(s,{depth:1.5,bevelEnabled:false,curveSegments:near?12:6}),'stone',0,0,z);
 arch('dark',0,12.8,z,2,4.4,.4);
 }
 for(const x of [-4,4]){const g=new THREE.SphereGeometry(.48,near?12:8,6);g.scale(1,1,.35);put(g,'accent',x,14.1,z+1.52);}
 for(const x of [-6,6]){box('trim',x,12.7,z+1.55,.6,6.8,.85);for(const yy of [10,12.7,15.4])box('trim',x,yy,z+1.4,.85,.28,.65);}

 for(const x of [-7,7]){box('trim',x,11.8,z+1.35,.65,11.5,.65);cyl('accent',x,17.55,z+1.35,.48,.06,1.7,8);}
 // Projecting paired scrolls and stronger pilasters articulate the existing crown without changing its outline.
 for(const side of [-1,1]){const g=new THREE.TorusGeometry(.68,.14,near?6:4,near?20:10,Math.PI*1.55);if(side<0)g.rotateY(Math.PI);put(g,'stone',side*3.2,17.1,z+1.62);}
 for(const x of [-2,2]){box('trim',x,17.6,z+.95,.5,4.6,.7);cyl('accent',x,19.9,z+.95,.32,0,1.5,8);}
 for(let i=0;i<(near?21:13);i++){let x=-W/2+(i+.5)*W/(near?21:13);cyl('stone',x,12,z+.2,.35,0,.8,5);}
 // Projecting marquee stays attached to the restored front wall, without lettering.
 box('dark',0,5.9,D/2+1.1,13,.9,3.8);
 box('trim',0,6.65,D/2+1.1,13,.6,3.8);
 for(const x of [-5,-2.5,0,2.5,5])arch('dark',x,9.1,z+1.52,.9,1.9,.1);
 if(near)for(const x of [-10,10])for(const y of [7.5,10])box('trim',x,y,D/2+.45,.25,1.5,.9);

 return finish();
}
