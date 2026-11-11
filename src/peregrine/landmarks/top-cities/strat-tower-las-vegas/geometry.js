import pc from 'polygon-clipping';
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
 const hip=(m,x,y,z,w,d,h)=>{if(Math.abs(w-d)<.001){const g=new THREE.ConeGeometry(w/Math.sqrt(2),h,4);g.rotateY(Math.PI/4);put(g,m,x,y+h/2,z);return;}const base=[[-w/2,0,-d/2],[w/2,0,-d/2],[w/2,0,d/2],[-w/2,0,d/2]],ridge=Math.abs(d-w)/2,wide=w>d,top=wide?[[-ridge,h,0],[ridge,h,0]]:[[0,h,-ridge],[0,h,ridge]];const g=new THREE.BufferGeometry(),p=[...base,...top].flatMap(q=>[q[0]+x,q[1]+y,q[2]+z]);g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(wide?[0,4,5,0,5,1,1,5,2,2,5,4,2,4,3,3,4,0,3,0,1,3,1,2]:[0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0,3,0,1,3,1,2]);const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();b.put(flat,m);};
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
 // Three curved concrete legs narrow into the shaft and flare beneath the observation pod.
 const legStations=[[0,24,8,6],[35,20,7,5.4],[75,14.5,6.2,4.7],[115,9.5,5.3,4.2],[160,6.7,4.8,4.0],[200,7.3,5.2,4.2],[225,10.1,6,4.8],[241,14.2,6.8,5.6]];
 const legAngle=1.926;
 for(let i=0;i<3;i++){const a=legAngle+i*Math.PI*2/3,P=(y,r,w,d,j)=>{const u=[-1,1,1,-1][j]*w/2,v=[-1,-1,1,1][j]*d/2;return [Math.sin(a)*(r+v)+Math.cos(a)*u,y,Math.cos(a)*(r+v)-Math.sin(a)*u];};for(let s=0;s<legStations.length-1;s++){const [y,r,w,d]=legStations[s],[Y,R,W,D]=legStations[s+1];for(let j=0;j<4;j++)quad('concrete',P(y,r,w,d,j),P(Y,R,W,D,j),P(Y,R,W,D,(j+1)%4),P(y,r,w,d,(j+1)%4));}for(const s of [legStations[0],legStations.at(-1)]){const [y,r,w,d]=s;quad('concrete',...(y===0?[0,1,2,3]:[3,2,1,0]).map(j=>P(y,r,w,d,j)));}}
 // A compact lift/service core remains separate from the three open lower leg intervals.
 cyl('concrete',0,0,0,3.3,3.3,237,near?12:6);
 // Above the lower openings, a tapered central concrete web joins all three legs.
 for(const [y,r,Y,R]of[[110,3.3,150,6.7],[150,6.7,200,7.0],[200,7.0,237,10.5]]){const g=new THREE.CylinderGeometry(R,r,Y-y,near?12:6,1,true);put(g,'concrete',0,(y+Y)/2,0);}
 // Pod silhouette follows the lower fan, diagonal lower glazing, white belt and slanted upper glass.
 const bands=[[237,7,241,17,'concrete'],[241,17,243,20,'trim'],[243,20,254,22.6,'diagrid'],[254,22.6,255.5,23,'trim'],[255.5,23,269,26,'glass'],[269,26,270.5,26.2,'trim'],[270.5,26.2,278,11,'bronze'],[278,11,281,8,'roof']];
 const faces=near?48:24;
 for(const [y,r,Y,R,m]of bands){const n=m==='diagrid'?(near?24:12):faces;for(let i=0;i<n;i++){const a=i*Math.PI*2/n,c=(i+1)*Math.PI*2/n,P=(u,v)=>{const A=[Math.sin(a)*r,y,Math.cos(a)*r],B=[Math.sin(c)*r,y,Math.cos(c)*r],C=[Math.sin(c)*R,Y,Math.cos(c)*R],D=[Math.sin(a)*R,Y,Math.cos(a)*R];return A.map((x,j)=>(x*(1-u)+B[j]*u)*(1-v)+(D[j]*(1-u)+C[j]*u)*v);};
 if(!['glass','diagrid'].includes(m)){quad(m,P(0,0),P(1,0),P(1,1),P(0,1));continue;}
 const paint=(polys,mat)=>{for(const poly of polys){const shape=new THREE.Shape(poly[0].map(p=>new THREE.Vector2(...p)));for(const h of poly.slice(1))shape.holes.push(new THREE.Path(h.map(p=>new THREE.Vector2(...p))));const g=new THREE.ShapeGeometry(shape),pos=g.getAttribute('position');for(let j=0;j<pos.count;j++)pos.setXYZ(j,...P(pos.getX(j),pos.getY(j)));g.computeVertexNormals();b.put(g,mat);}};
 const masks=[];if(m==='diagrid'){const t=.025;masks.push([[[-t,0],[t,0],[1+t,1],[1-t,1],[-t,0]]],[[[1-t,0],[1+t,0],[t,1],[-t,1],[1-t,0]]]);}else for(let row=1;row<(near?6:3);row++){const v=row/(near?6:3),t=.012;masks.push([[[0,v-t],[1,v-t],[1,v+t],[0,v+t],[0,v-t]]]);}
 masks.push([[[0,0],[.025,0],[.025,1],[0,1],[0,0]]],[[[.975,0],[1,0],[1,1],[.975,1],[.975,0]]]);const square=[[[0,0],[1,0],[1,1],[0,1],[0,0]]],frame=pc.intersection(pc.union(...masks),square);paint(pc.difference(square,frame),'glass');paint(frame,'trim');
 }}
 // Radial concrete fan under the lowest ring is integral to the pod/shaft connection.
 for(let i=0;i<(near?24:12);i++){const a=i*Math.PI*2/(near?24:12);b.bar('concrete',[Math.sin(a)*6.8,237,Math.cos(a)*6.8],[Math.sin(a)*16.8,241,Math.cos(a)*16.8],.28,.28);}
 cyl('roof',0,280.7,0,8,8,.3,faces);
 // Big Shot's four-rail lattice mast remains, with its finer antenna completing the350.2m silhouette.
 for(const x of [-1.45,1.45])for(const z of [-1.45,1.45])box('ride',x,305.6,z,.35,49.2,.35);
 for(let y=281;y<330;y+=7){const Y=Math.min(y+7,330.2);for(const s of [-1,1]){b.bar('ride',[-1.45,y,s*1.45],[1.45,Y,s*1.45],.16,.16);b.bar('ride',[s*1.45,y,-1.45],[s*1.45,Y,1.45],.16,.16);}box('ride',0,y,0,3.2,.25,3.2);}
 box('ride',0,330.1,0,3.25,.2,3.25);cyl('metal',0,330.2,0,.42,.08,20,8);
 // Ground-level tower entry, with a small blue-glass rotunda owned by the tower circle.
 cyl('base',0,0,0,7.5,7.5,.3,24);cyl('glass',0,.3,0,7.1,7.1,9.5,24);cyl('trim',0,9.8,0,7.6,7.6,.7,24);

 return finish();
}
