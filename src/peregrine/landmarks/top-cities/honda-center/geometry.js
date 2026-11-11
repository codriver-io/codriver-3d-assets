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
 const inv=([x,y,z])=>[Math.cos(SPEC.rotation)*x-Math.sin(SPEC.rotation)*z,y,Math.sin(SPEC.rotation)*x+Math.cos(SPEC.rotation)*z];
 const Q=(m,...p)=>quad(m,...p.map(inv)),B=(m,x,y,z,w,h,d,a=0)=>box(m,...inv([x,y,z]),w,h,d,a-SPEC.rotation);
 const ring=FOOTPRINTS[0].map(([lng,lat])=>[(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),-(lat-SPEC.origin[1])*111320]);
 for(let i=0;i<ring.length-1;i++){const a=ring[i],c=ring[i+1];if(Math.abs((a[1]+c[1])/2)>53&&Math.abs(a[0]-c[0])>60)continue;
  const l=Math.hypot(c[0]-a[0],c[1]-a[1]);
  // Subtle horizontal stone courses are faces within the wall plane.
  for(let j=0;j<8;j++){const lo=j*29/8,hi=(j+1)*29/8;Q((Math.abs((a[0]+c[0])/2)>57&&Math.abs((a[1]+c[1])/2)>36&&j<6)?'glass':j===1||j===6?'course':'stone',[a[0],lo,a[1]],[c[0],lo,c[1]],[c[0],hi,c[1]],[a[0],hi,a[1]]);}
 }
 // Both long-side entrances have a real partitioned semicircular glazed portal.
 for(const side of [-1,1]){
  const z=side*54.2,r=23,sy=3,top=29,ww=75.5;
  const sh=new THREE.Shape();sh.moveTo(-ww/2,0);sh.lineTo(ww/2,0);sh.lineTo(ww/2,top);sh.lineTo(-ww/2,top);sh.closePath();const hole=new THREE.Path();hole.moveTo(-r-2,0);hole.lineTo(r+2,0);hole.lineTo(r+2,sy);hole.absarc(0,sy,r+2,0,Math.PI,false);hole.lineTo(-r-2,0);sh.holes.push(hole);
  const g=new THREE.ShapeGeometry(sh,near?32:16);if(side<0)g.setIndex(Array.from(g.index.array).reduce((o,v,i,a)=>i%3===0?[...o,a[i],a[i+2],a[i+1]]:o,[]));g.translate(0,0,z);g.rotateY(-SPEC.rotation);b.put(g,'stone');
  const nn=near?36:18;for(let j=0;j<nn;j++){const a=j*Math.PI/nn,c=(j+1)*Math.PI/nn;const p=(rr,t)=>[rr*Math.cos(t),sy+rr*Math.sin(t),z];const points=[p(r,a),p(r+2,a),p(r+2,c),p(r,c)];Q('roof',...(side>0?points:points.reverse()));}
  B('roof',-r-1,sy/2,z,2,sy,.25);B('roof',r+1,sy/2,z,2,sy,.25);
  // Glass and mullions partition the curved opening, so no frame lies over a backing pane.
  const cols=near?14:8,rows=near?8:5;
  for(let ci=0;ci<cols;ci++){const x0=-r+ci*2*r/cols,x1=-r+(ci+1)*2*r/cols,h0=sy+Math.sqrt(Math.max(0,r*r-x0*x0)),h1=sy+Math.sqrt(Math.max(0,r*r-x1*x1));
   const tile=(m,l,lo,rr,hi)=>{let p=[[l,lo],[rr,lo],[rr,hi],[l,hi]],inside=p=>p[1]<=h0+(h1-h0)*(p[0]-x0)/(x1-x0)+1e-8,out=[];for(let i=0;i<p.length;i++){const A=p[i],C=p[(i+1)%p.length],ia=inside(A),ic=inside(C);if(ia)out.push(A);if(ia!==ic){const fa=A[1]-h0-(h1-h0)*(A[0]-x0)/(x1-x0),fc=C[1]-h0-(h1-h0)*(C[0]-x0)/(x1-x0),t=fa/(fa-fc);out.push([A[0]+(C[0]-A[0])*t,A[1]+(C[1]-A[1])*t]);}}if(out.length<3)return;const gg=new THREE.ShapeGeometry(new THREE.Shape(out.map(p=>new THREE.Vector2(...p))));if(side<0)gg.setIndex(Array.from(gg.index.array).reduce((o,v,i,a)=>i%3===0?[...o,a[i],a[i+2],a[i+1]]:o,[]));gg.translate(0,0,z);gg.rotateY(-SPEC.rotation);b.put(gg,m);};
   for(let j=0;j<rows;j++){const lo=j*(sy+r)/rows,hi=(j+1)*(sy+r)/rows;tile('glass',x0+.10,lo+.10,x1-.10,hi-.10);tile('metal',x0,lo,x0+.10,hi);tile('metal',x1-.10,lo,x1,hi);tile('metal',x0+.10,lo,x1-.10,lo+.10);tile('metal',x0+.10,hi-.10,x1-.10,hi);}
  }
  B('dark',0,1.5,z+side*.7,40,3,.7);
 }
 // Elliptical shallow raised roof above the exact stepped eave polygon.
 const deck=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))),cut=new THREE.Path();cut.absellipse(0,0,66,49,0,Math.PI*2,true);deck.holes.push(cut);
 const rim=new THREE.ShapeGeometry(deck,near?64:32);rim.rotateX(-Math.PI/2);rim.translate(0,29,0);rim.rotateY(-SPEC.rotation);b.put(rim,'roof');
 const cap=new THREE.SphereGeometry(1,near?64:32,near?10:6,0,Math.PI*2,0,Math.PI/2);cap.scale(66,4,49);cap.translate(0,29,0);cap.rotateY(-SPEC.rotation);b.put(cap,'roof');
 for(const [x,z] of [[-64,-43],[63,-43],[-64,44],[63,44]]){B('glass',x,10,z,5,20,5);}

 return finish();
}
