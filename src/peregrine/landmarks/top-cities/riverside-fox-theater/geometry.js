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
 const PLAN=[[11.6,19.8],[-20.3,20.7],[-32.3,20.9],[-33,-17.3],[-32.3,-18],[-26.8,-23.7],[27.5,-23.7],[27.6,-17.4],[30.5,-17.3],[30.7,-18.3],[33.8,-18.4],[33.5,-7.8],[34.1,19.5]];
 const aperture=(x,y,w,h)=>{const p=new THREE.Path(),r=w/2;p.moveTo(x-r,y);p.lineTo(x+r,y);p.lineTo(x+r,y+h-r);p.absarc(x,y+h-r,r,0,Math.PI,false);p.lineTo(x-r,y);return p;};
 const arcade=(x,z,w,h,a,bays,upper=false,y0=0)=>{
  const shape=new THREE.Shape([[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]].map(p=>new THREE.Vector2(...p))),cw=w/bays;
  for(let j=0;j<bays;j++){
   const u=-w/2+(j+.5)*cw,ww=Math.min(2.4,cw*.62),hh=upper?h-.65:4.1;
   shape.holes.push(aperture(u,0,ww,hh));
   if(!upper)shape.holes.push(aperture(u,5.4,ww*.82,3.2));
  }
  const g=new THREE.ExtrudeGeometry(shape,{depth:.55,bevelEnabled:false,curveSegments:near?8:3});
  // Aperture floors are voids, not walking caps at grade; keep jamb feet and downward faces.
  if(!upper&&y0===0){const p=g.getAttribute('position'),keep=[];for(let i=0;i<p.count;i+=3){const a=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(p,i+j)),n=a[1].clone().sub(a[0]).cross(a[2].clone().sub(a[0])).normalize();if(a.every(v=>v.y<.10)&&n.y>.99)continue;keep.push(...a.flatMap(v=>v.toArray()));}g.setAttribute('position',new THREE.Float32BufferAttribute(keep,3));g.deleteAttribute('normal');g.deleteAttribute('uv');g.clearGroups();g.computeVertexNormals();}
  g.translate(0,y0,-.55);g.rotateY(a);put(g,'stone',x,0,z);
  if(!upper)for(let j=0;j<bays;j++){
   const u=-w/2+(j+.5)*cw,ww=Math.min(2.4,cw*.62)*.82,s=new THREE.Shape(aperture(u,5.4,ww,3.2).getPoints(near?8:3));const g=new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:false,curveSegments:near?10:5});g.translate(0,0,-.38);g.rotateY(a);put(g,'glass',x,0,z);
  }
 };
 // Each facade follows its own mapped edge, including the chamfered corner.
 for(let i=0;i<PLAN.length;i++){
  const p=PLAN[i],q=PLAN[(i+1)%PLAN.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),a=Math.atan2(dz,-dx),x=(p[0]+q[0])/2,z=(p[1]+q[1])/2;
  if(len>6)arcade(x,z,len,9.8,a,Math.max(1,Math.round(len/4)));
  else{const g=new THREE.BoxGeometry(len,9.8,.55);g.translate(0,4.9,-.275);g.rotateY(a);put(g,'stone',x,0,z);}
 }
 {const s=new THREE.Shape(PLAN.map(([x,z])=>new THREE.Vector2(x,-z))),g=new THREE.ShapeGeometry(s);g.rotateX(-Math.PI/2);put(g,'roof',0,9.2,0);}
 hip('roof',.5,9.8,1.2,64.8,38.1,3);
 hip('roof',.35,9.8,-20.55,54.3,6.3,2.5);
 block('stone',14,9.8,2,27,5,22,0,0);
 const tx=-27,tz=-17.5;
 // The eight tower walls repeat the original entrance arcades, leaving their interior hollow.
 for(let side=0;side<8;side++){const a=side*Math.PI/4;arcade(tx+Math.sin(a)*3.88,tz+Math.cos(a)*3.88,3.215,9.8,a,1);}
 // Upper tower faces are partitioned around recessed quatrefoil apertures.
 for(let side=0;side<8;side++){
  const a=side*Math.PI/4,face=new THREE.Shape([[-1.6075,9.8],[1.6075,9.8],[1.6075,14.8],[-1.6075,14.8]].map(p=>new THREE.Vector2(...p))),points=[];
  if(side%2===0){for(let j=0;j<(near?24:12);j++){const t=j*Math.PI*2/(near?24:12),r=.48+.14*Math.cos(t*4);points.push([Math.sin(t)*r,12.4+Math.cos(t)*r]);}face.holes.push(new THREE.Path(points.map(p=>new THREE.Vector2(...p))));}
  const g=new THREE.ExtrudeGeometry(face,{depth:.55,bevelEnabled:false});g.translate(0,0,3.33);g.rotateY(a);put(g,'stone',tx,0,tz);
  if(points.length){const g=new THREE.ExtrudeGeometry(new THREE.Shape(points.map(p=>new THREE.Vector2(...p))),{depth:.12,bevelEnabled:false});g.translate(0,0,3.53);g.rotateY(a);put(g,'dark',tx,0,tz);}
 }
 cyl('stone',tx,14.6,tz,4.2,4.2,.2,8);
 for(let side=0;side<8;side++){const a=side*Math.PI/4;arcade(tx+Math.sin(a)*3.5,tz+Math.cos(a)*3.5,2.9,4.3,a,1,true,14.8);}
 cyl('stone',tx,19.1,tz,4.15,4.15,.45,8);
 for(let i=0;i<16;i++){const a=i*Math.PI/8;box('stone',tx+Math.sin(a)*3.75,19.65,tz+Math.cos(a)*3.75,.42,.3,.42);}
 for(const x of [-.8,.8])for(const z of [-.8,.8])box('stone',tx+x,20.35,tz+z,.24,1.6,.24);
 cyl('roof',tx,21.15,tz,1.35,0,.85,8);

 return finish();
}
