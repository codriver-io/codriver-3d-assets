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
 // Coordinates below are geographic metres (east/south), converted to mapped axes before final yaw.
 const inv=([x,y,z])=>[Math.cos(SPEC.rotation)*x-Math.sin(SPEC.rotation)*z,y,Math.sin(SPEC.rotation)*x+Math.cos(SPEC.rotation)*z];
 const Q=(m,...p)=>quad(m,...p.map(inv)),B=(m,x,y,z,w,h,d,a=0)=>{const p=inv([x,y,z]);box(m,...p,w,h,d,a-SPEC.rotation);},C=(m,x,y,z,r,h)=>{const p=inv([x,y,z]);cyl(m,...p,r,r,h,near?10:6);};
 const owned=FOOTPRINTS[0].map(([lng,lat])=>[(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),-(lat-SPEC.origin[1])*111320]);
 const shape=new THREE.Shape(owned.map(([x,z])=>new THREE.Vector2(x,-z)));
 const pl=new THREE.ExtrudeGeometry(shape,{depth:7.8,bevelEnabled:false});pl.rotateX(-Math.PI/2);pl.rotateY(-SPEC.rotation);b.put(pl,'stone');
 const ellipse=(r,y,t)=>[-9+Math.cos(t)*r,y,-6+Math.sin(t)*r*.97];
 // Field is a distinct low surface, with a dirt diamond and warning-track edge.
 const fg=new THREE.CircleGeometry(91,near?64:32);fg.rotateX(-Math.PI/2);fg.scale(1,1,.94);fg.translate(-6,.18,-10);fg.rotateY(-SPEC.rotation);b.put(fg,'turf');
 Q('dirt',[-66,.21,50],[-38,.21,77],[-11,.21,50],[-38,.21,23]);
 // Three horseshoe seating decks. Open north-east outfield stays visibly open.
 const steps=near?15:7,segs=near?72:36;
 for(const [base,ri,ro] of [[1.8,65,89],[13,84,107],[25,102,124]]){
  for(let j=0;j<steps;j++){const r=ri+(ro-ri)*j/steps,r2=ri+(ro-ri)*(j+1)/steps,y=base+j*.57*(15/steps),y2=base+(j+1)*.57*(15/steps);
   for(let i=0;i<segs;i++){const a=.10+i*Math.PI*1.43/segs,c=.10+(i+1)*Math.PI*1.43/segs;Q('dark',ellipse(r,y,a),ellipse(r,y,c),ellipse(r2,y,c),ellipse(r2,y,a));Q('metal',ellipse(r2,y,a),ellipse(r2,y,c),ellipse(r2,y2,c),ellipse(r2,y2,a));}
  }
  for(let i=0;i<segs;i++){const a=.10+i*Math.PI*1.43/segs,c=.10+(i+1)*Math.PI*1.43/segs;
   Q('stone',ellipse(ro,base-1,a),ellipse(ro,base+8.55,a),ellipse(ro,base+8.55,c),ellipse(ro,base-1,c));
   Q('stone',ellipse(ri,base-1,a),ellipse(ro,base-1,a),ellipse(ro,base-1,c),ellipse(ri,base-1,c));
   Q('stone',ellipse(ri,base-1,a),ellipse(ri,base-1,c),ellipse(ri,base,c),ellipse(ri,base,a));
  }
  // Concrete outer deck edge and open underside with regular radial piers.
  for(let i=0;i<segs;i++){const a=.10+i*Math.PI*1.43/segs,c=.10+(i+1)*Math.PI*1.43/segs;Q('trim',ellipse(ro,base+8.55,a),ellipse(ro,base+8.55,c),ellipse(ro+2,base+8.55,c),ellipse(ro+2,base+8.55,a));}
 }
 for(let i=0;i<32;i++){const a=.1+i*Math.PI*1.43/31,p=ellipse(123,0,a);B('metal',p[0],14,p[2],1.1,28,1.1);}
 // Pale upper rim canopies and the main entry wall between the two cap structures.
 for(let i=0;i<segs;i++){const a=.10+i*Math.PI*1.43/segs,c=.10+(i+1)*Math.PI*1.43/segs;
 Q('roof',ellipse(116,34,a),ellipse(116,34,c),ellipse(129,34,c),ellipse(129,34,a));
 Q('trim',ellipse(129,33.5,a),ellipse(129,34,a),ellipse(129,34,c),ellipse(129,33.5,c));}
 B('stone',-101,6.3,95,31,12.6,3,Math.PI/4);
 for(const [x,z] of [[-115,79],[-89,107]])B('trim',x,7.6,z,23,.8,23);
 // Outfield low bleachers and blank video structures occupy the opposite side.
 for(let j=0;j<(near?10:5);j++)for(let i=0;i<16;i++){const a=-1.45+i*1.45/16,c=-1.45+(i+1)*1.45/16,r=80+j*(near?2:4),y=2+j*(near?.65:1.3);Q('dark',ellipse(r,y,a),ellipse(r,y,c),ellipse(r+2,y,c),ellipse(r+2,y,a));Q('metal',ellipse(r,0,a),ellipse(r,0,c),ellipse(r,y,c),ellipse(r,y,a));Q('stone',ellipse(r+2,0,a),ellipse(r+2,y,a),ellipse(r+2,y,c),ellipse(r+2,0,c));}
 B('metal',77,13,-38,3,26,3);B('dark',77,26,-38,38,14,1.5,-.6);
 B('metal',17,12,-103,3,24,3);B('dark',17,23,-103,34,12,1.5,-.2);
 // Ring of roof canopies and lighting arrays, without lettering.
 for(let i=0;i<9;i++){const a=.35+i*3.8/8,p=ellipse(125,0,a);B('metal',p[0],35.5,p[2],.6,7,.6);B('trim',p[0],38.45,p[2],12,1.1,1.5,-a);}
 // Twin giant baseball-cap entrance canopies, each supported on six visible posts.
 for(const [x,z] of [[-115,79],[-89,107]]){
  for(let i=0;i<6;i++){const a=i*Math.PI/3;C('metal',x+9.4*Math.cos(a),0,z+9.4*Math.sin(a),.38,8);}
  const h=new THREE.SphereGeometry(10.3,near?24:12,near?10:6,0,Math.PI*2,0,Math.PI/2);h.scale(1,.74,1);h.translate(x,8,z);h.rotateY(-SPEC.rotation);b.put(h,'accent');
  const brim=new THREE.CylinderGeometry(11.9,11.9,.6,near?28:14);brim.scale(1,1,.64);brim.rotateY(-Math.PI/4);brim.translate(x-5,8,z+5);brim.rotateY(-SPEC.rotation);b.put(brim,'accent');
 }
 // Actual outfield California Spectacular: irregular faceted rocks, no signage.
 const rockRing=FOOTPRINTS[1].map(([lng,lat])=>[(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),-(lat-SPEC.origin[1])*111320]);
 for(let i=0;i<rockRing.length-1;i++){const[x,z]=rockRing[i],g=new THREE.DodecahedronGeometry(4.5+(i%3),0);g.scale(1,.6,1);g.translate(x,3.7,z);g.rotateY(-SPEC.rotation);b.put(g,'stone');}

 return finish();
}
