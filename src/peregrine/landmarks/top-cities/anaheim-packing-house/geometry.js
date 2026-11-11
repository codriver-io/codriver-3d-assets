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
 const fw=W*.86,zf=D/2-1.8,mainBack=-D/2+17,mainFront=zf-8,mainLen=mainFront-mainBack,mainMid=(mainBack+mainFront)/2;
 // Main hall envelope and low 1926 east addition, with original loading-bay rhythm.
 wall('stone',fw/2,0,mainMid,mainLen,7.7,1,6,1);wall('stone',-fw/2,0,mainMid,mainLen,7.7,3,6,1);
 wall('stone',0,0,mainBack,fw,7.7,2,6,1);block('stone',0,0,-D/2+8.5,fw,7,17,3,1);
 wall('stone',fw/2,0,zf-4,8,8.3,1,1,1);wall('stone',-fw/2,0,zf-4,8,8.3,3,1,1);
 quad('roof',[-fw/2,8.3,zf], [fw/2,8.3,zf],[fw/2,8.3,zf-8],[-fw/2,8.3,zf-8]);
 // Five real sawtooth bays: sloping composition roof and glazed vertical northlight faces.
 const toothCount=5,td=mainLen/toothCount;
 for(let i=0;i<toothCount;i++){
  const z=mainBack+i*td;
  quad('roof',[-fw/2,7.7,z],[-fw/2,13.2,z+td],[fw/2,13.2,z+td],[fw/2,7.7,z]);
  for(const x of [-fw/2,fw/2]){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([x,7.7,z,x,7.7,z+td,x,13.2,z+td],3));g.setIndex(x>0?[0,2,1]:[0,1,2]);g.computeVertexNormals();b.put(g,'stone');}
  wall('stone',0,7.7,z+td,fw,3.9,0);
  const cols=near?18:10,cw=fw/cols,lo=11.6,hi=13.2,fr=.12;
  for(let j=0;j<cols;j++){const l=-fw/2+j*cw,r=l+cw;for(const [a,y,c,Y,m] of [[l,lo,r,lo+fr,'trim'],[l,hi-fr,r,hi,'trim'],[l,lo+fr,l+fr,hi-fr,'trim'],[r-fr,lo+fr,r,hi-fr,'trim'],[l+fr,lo+fr,r-fr,hi-fr,'glass']])quad(m,[a,y,z+td],[c,y,z+td],[c,Y,z+td],[a,Y,z+td]);}

 }
 // Smooth Mission Revival facade; apertures replace the wall, no dark overlays.
 const shp=new THREE.Shape(),profile=[[-fw/2,0],[fw/2,0],[fw/2,8.4],[fw/2-1,8.4],[fw/2-1,7.9],[9.7,7.9],[8.7,8.3],[6,8.3],[5,8.8],[4.2,8.8],[3.4,9.6],[2.6,10.15],[1.4,10.65],[0,10.8],[-1.4,10.65],[-2.6,10.15],[-3.4,9.6],[-4.2,8.8],[-5,8.8],[-6,8.3],[-8.7,8.3],[-9.7,7.9],[-fw/2+1,7.9],[-fw/2+1,8.4],[-fw/2,8.4]];
 profile.forEach((p,i)=>i?shp.lineTo(...p):shp.moveTo(...p));shp.closePath();
 const ap=(x,y,w,h)=>{const p=new THREE.Path(),r=w/2;p.moveTo(x-r,y);p.lineTo(x+r,y);p.lineTo(x+r,y+h-r);p.absarc(x,y+h-r,r,0,Math.PI,false);p.lineTo(x-r,y);return p;};
 for(const x of [-fw*.42,-fw*.16,0,fw*.16,fw*.42]){const y=x===0?1.37:1.8,w=x===0?3:2.4,h=x===0?4.8:3.8;const hole=ap(x,y,w,h);shp.holes.push(hole);const g=new THREE.ShapeGeometry(new THREE.Shape(hole.getPoints(near?12:6)));put(g,'glass',0,0,zf-.22);if(near)for(const off of [-.35,.35])box('dark',x+off,y+h*.42,zf-.10,.09,h*.8,.13);}
 for(const [x,y,h] of [[-.55,9,.55],[0,9,.85],[.55,9,.55]]){const p=new THREE.Path();p.moveTo(x-.1,y);p.lineTo(x+.1,y);p.lineTo(x+.1,y+h);p.lineTo(x-.1,y+h);p.closePath();shp.holes.push(p);box('dark',x,y+h/2,zf-.24,.2,h,.12);}
 const front=new THREE.ExtrudeGeometry(shp,{depth:.4,bevelEnabled:false,curveSegments:near?12:6});put(front,'stone',0,0,zf-.4);
 // Tapered engaged pilasters and low domed caps, the two signature end ornaments.
 for(const x of [-fw*.28,fw*.28]){
  const g=new THREE.CylinderGeometry(1.32,1.58,9.1,4);g.rotateY(Math.PI/4);g.scale(1,1,.90);put(g,'stone',x,4.55,zf+.12);
  box('trim',x,9.1,zf+.12,3.2,.3,3);block('stone',x,9.25,zf+.12,2.35,.65,2.3,1,1,'trim');dome('cap',x,9.9,zf+.12,1.3,.8);
 }
 // Raised entry stair and Palladian entrance surround.
 for(let j=0;j<8;j++)box('trim',0,(j+1)*1.37/16,zf+3.8-j*.43,4.4,(j+1)*1.37/8,.45);
 for(const x of [-2,2]){box('stone',x,3.15,zf+.16,.45,3.56,.45);box('stone',x,4.95,zf+.16,.7,.3,.6);}
 const arcPts=[];for(let i=0;i<=(near?20:10);i++){const a=i*Math.PI/(near?20:10);arcPts.push(new THREE.Vector3(Math.cos(a)*2.05,4.85+Math.sin(a)*2.05,zf+.18));}for(let i=0;i<arcPts.length-1;i++){const a=arcPts[i],c=arcPts[i+1],v=c.clone().sub(a),g=new THREE.CylinderGeometry(.16,.16,v.length(),6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...a.clone().add(c).multiplyScalar(.5).toArray());b.put(g,'stone');}
 // North loading dock and its supported shed canopy: all contact remains on the building pad.
 const dockX=fw/2+1;box('trim',dockX,.685,mainMid,2,1.37,mainLen);
 const shed=new THREE.BoxGeometry(3.3,.23,mainLen);shed.rotateZ(-.13);put(shed,'roof',fw/2+1.1,5.3,mainMid);
 for(let i=0;i<7;i++)box('dark',fw/2+2.3,2.63,mainBack+i*mainLen/6,.16,5.26,.16);

 return finish();
}
