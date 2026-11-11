import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

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
 const fz=D/2,top=8.3;
 box('plinth',0,.225,0,W,.45,D);wall('stone',W/2,.45,0,D,top-.45,1,4,2);wall('stone',-W/2,.45,0,D,top-.45,3,4,2);wall('stone',0,.45,-D/2,W,top-.45,2,7,2);
 const face=new THREE.Shape([[-W/2,.45],[W/2,.45],[W/2,top],[-W/2,top]].map(p=>new THREE.Vector2(...p)));
 const rectangle=(l,y,r,t)=>{const p=new THREE.Path();p.moveTo(l,y);p.lineTo(r,y);p.lineTo(r,t);p.lineTo(l,t);p.closePath();return p;};
 for(const x of [-W*.375,-W*.225,-2.35,0,2.35,W*.225,W*.375])for(const upper of [false,true]){
  const center=Math.abs(x)<3,w=center?1.25:2.3,h=upper?(center?2.65:2.3):(center?2.7:1.6),y=upper?4.65:center?.45:1.25,l=x-w/2,r=x+w/2,t=y+h,fr=.14;
  face.holes.push(rectangle(l,y,r,t));
  for(const [a,lo,c,hi,m] of [[l,y,r,y+fr,'trim'],[l,t-fr,r,t,'trim'],[l,y+fr,l+fr,t-fr,'trim'],[r-fr,y+fr,r,t-fr,'trim'],[l+fr,y+fr,r-fr,t-fr,!upper&&center?'door':'glass']]){if(m==='glass'&&!center){quad('glass',[a,lo,fz],[x-.055,lo,fz],[x-.055,hi,fz],[a,hi,fz]);quad('trim',[x-.055,lo,fz],[x+.055,lo,fz],[x+.055,hi,fz],[x-.055,hi,fz]);quad('glass',[x+.055,lo,fz],[c,lo,fz],[c,hi,fz],[x+.055,hi,fz]);}else quad(m,[a,lo,fz],[c,lo,fz],[c,hi,fz],[a,hi,fz]);}
 }
 for(const x of [-W/2+.2,-W*.30,W*.30,W/2-.2]){face.holes.push(rectangle(x-.16,.45,x+.16,top));quad('trim',[x-.16,.45,fz],[x+.16,.45,fz],[x+.16,top,fz],[x-.16,top,fz]);}
 put(new THREE.ShapeGeometry(face),'stone',0,0,fz);
 // Broad white cornice and hip roof are above the wall, avoiding backing-plane overlays.
 box('trim',0,8.48,0,W+.4,.36,D+.3);hip('roof',0,8.66,0,W+.8,D+.7,2.5);
 const portZ=fz+.95;
 for(const x of [-4.65,-1.55,1.55,4.65]){
  box('plinth',x,.53,portZ,1.0,.16,1.0);cyl('trim',x,.61,portZ,.50,.50,.26,near?16:10);cyl('trim',x,.87,portZ,.42,.35,6.98,near?16:10);cyl('trim',x,7.85,portZ,.51,.51,.23,near?16:10);box('trim',x,8.19,portZ,1.0,.22,1.0);
 }
 box('trim',0,8.57,portZ,11.2,.54,1.9);
 // Open classical pediment face, matched to the portico width and pitched main roof.
 const tri=new THREE.Shape([[-5.6,8.84],[5.6,8.84],[0,11.3]].map(p=>new THREE.Vector2(...p))),arrow=new THREE.Path();for(const [i,p] of [[-.08,9.05],[.08,9.05],[.08,10.25],[.16,10.25],[0,10.6],[-.16,10.25],[-.08,10.25]].entries())i?arrow.lineTo(...p):arrow.moveTo(...p);arrow.closePath();tri.holes.push(arrow);put(new THREE.ShapeGeometry(tri),'stone',0,0,portZ+1.0);put(new THREE.ShapeGeometry(new THREE.Shape(arrow.getPoints())),'blue',0,0,portZ+1.0);
 const edge=(a,c)=>{const v=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),g=new THREE.BoxGeometry(.28,v.length(),.28);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...new THREE.Vector3(...a).add(new THREE.Vector3(...c)).multiplyScalar(.5).toArray());b.put(g,'trim');};
 edge([-5.6,8.84,portZ+1.0],[0,11.3,portZ+1.0]);edge([0,11.3,portZ+1.0],[5.6,8.84,portZ+1.0]);
 quad('roof',[-5.6,8.84,portZ+1],[0,11.3,portZ+1],[0,11.3,fz-1],[-5.6,8.84,fz-1]);quad('roof',[0,11.3,portZ+1],[5.6,8.84,portZ+1],[5.6,8.84,fz-1],[0,11.3,fz-1]);
 // Gentle built-in entry steps, above grade without a lawn or road surface.
 for(let j=0;j<3;j++)box('plinth',0,(j+1)*.45/6,fz+2.8-j*.42,10.6,(j+1)*.45/3,.45);

 return finish();
}
