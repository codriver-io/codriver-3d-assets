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
 // Historic west Capitol only; the separate eastern annex/construction ways are excluded.
 const c=[1.5,8],rot=SPEC.rotation,k=111320*Math.cos(SPEC.origin[1]*Math.PI/180),owned=FOOTPRINTS[0].map(([lng,lat])=>{const x=(lng-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [Math.cos(rot)*x-Math.sin(rot)*z,Math.sin(rot)*x+Math.cos(rot)*z];});
 const polyRoof=(ring,y,m)=>{const g=new THREE.ShapeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))));g.rotateX(-Math.PI/2);put(g,m,0,y,0);};
 // Literal mapped stepped plan, coursed granite base, two upper window registers and cornice.
 for(let i=0;i<owned.length-1;i++){const a=owned[i],q=owned[i+1],dx=q[0]-a[0],dz=q[1]-a[1],len=Math.hypot(dx,dz);if(len<.1)continue;const P=(u,y)=>[a[0]+dx*u/len,y,a[1]+dz*u/len],strip=(m,l,r,lo,hi)=>quad(m,P(l,lo),P(r,lo),P(r,hi),P(l,hi));const cols=Math.max(1,Math.round(len/4.1));for(let j=0;j<cols;j++){const l=j*len/cols,r=(j+1)*len/cols,w=r-l,wl=l+w*.26,wr=r-w*.26;for(const [lo,hi,bt,tp,m]of[[0,7.0,1.1,5.5,'base'],[7,15.5,8.6,13.8,'stone'],[15.5,22.5,16.8,20.4,'stone']]){strip(m,l,r,lo,bt);strip(m,l,r,tp,hi);strip(m,l,wl,bt,tp);strip(m,wr,r,bt,tp);strip('glass',wl,wr,bt,tp);if(near)strip('trim',wl,wr,(bt+tp)/2-.06,(bt+tp)/2+.06);}strip('trim',l,r,22.5,23.8);} }
 polyRoof(owned,23.8,'roof');
 // Low parapet follows every outer edge without sealing the architectural recesses.
 for(let i=0;i<owned.length-1;i++){const a=owned[i],q=owned[i+1],len=Math.hypot(q[0]-a[0],q[1]-a[1]);if(len>.1)b.bar('trim',[a[0],24.0,a[1]],[q[0],24.0,q[1]],.45,.4);}
 // West six-column Corinthian portico on the granite entrance floor, with actual open intervals.
 block('base',1.3,0,24,27.5,7,8,5,1,'trim');
 const column=(x,z,y,h,r)=>{cyl('trim',x,y,z,r*1.3,r*1.3,.45,12);cyl('stone',x,y+.45,z,r,r*.85,h-.95,near?16:8);cyl('trim',x,y+h-.5,z,r*1.4,r*1.4,.5,12);if(near){for(const s of [-1,1])box('trim',x+s*r, y+h-.3,z,.5,.45,.55);}};
 for(let i=0;i<6;i++)column(1.3-12.1+i*4.84,27.3,7,14.2,.58);
 box('trim',1.3,21.8,24,28.4,1.2,8.5);prism('stone',[[-13.3,22.4],[15.9,22.4],[1.3,28.2]],20,8.5);
 // Pediment field and deep cornice, original simplified Minerva group rather than copied sculpture.
 prism('stone',[[-11.8,23.1],[14.4,23.1],[1.3,27.3]],28.51,.12);box('trim',1.3,22.85,28.68,29.6,.42,.42);
 for(const [x,y,w,h]of[[1.3,24.8,.7,2.5],[-1,24,.8,1.3],[3.8,24,.8,1.3],[-5,23.7,1.6,.6],[7.5,23.7,1.6,.6]]){box('stone',x,y,28.75,w,h,.4);if(h>1)cyl('stone',x,y+h/2,28.75,.24,.24,.36,8);}
 // Perforated balustrades crown the west wing parapets and the drum gallery.
 for(const [l,r]of[[-31,-14],[16,31]]){box('trim',(l+r)/2,25.5,24.4,r-l,.28,.38);for(let x=l;x<r;x+=(near?1.65:3.3))cyl('trim',x,24.2,24.4,.12,.17,1.2,6);}
 for(let i=0;i<(near?48:24);i++){const a=i*Math.PI*2/(near?48:24);cyl('trim',c[0]+Math.sin(a)*13,42,c[1]+Math.cos(a)*13,.11,.16,1.0,6);}
 cyl('trim',c[0],43,c[1],13.3,13.3,.22,near?48:24);
 // Long side-wing pilaster rhythm, visible from L/N Streets, and small end pediments.
 for(const side of [-1,1]){for(let x=-44;x<=44;x+=4.4){if(Math.abs(x)<16)continue;const hits=[];for(let j=0;j<owned.length-1;j++){const A=owned[j],C=owned[j+1];if((x-A[0])*(x-C[0])<=0&&Math.abs(C[0]-A[0])>.01)hits.push(A[1]+(C[1]-A[1])*(x-A[0])/(C[0]-A[0]));}if(hits.length){const z=side<0?Math.min(...hits):Math.max(...hits);box('stone',x,14.75,z,.48,15.5,.22);}}const x=side*40;box('trim',x,24.15,0,15.5,.7,45);prism('stone',[[x-7.8,24.5],[x+7.8,24.5],[x,27.5]],24.2,.8);}
 // Two-storey drum: 24 real exterior columns and inset windows retain the open colonnade in far.
 cyl('trim',c[0],23.8,c[1],13.3,13.3,2,near?48:24);
 cyl('stone',c[0],25.8,c[1],10.5,10.5,16.2,near?48:24);
 for(let i=0;i<24;i++){const a=i*Math.PI/12,x=c[0]+Math.sin(a)*12.2,z=c[1]+Math.cos(a)*12.2;column(x,z,26.1,14.7,.34);const theta=a,rx=c[0]+Math.sin(a)*10.53,rz=c[1]+Math.cos(a)*10.53;box('glass',rx,34.0,rz,1.1,7.6,.12,a);}
 cyl('trim',c[0],40.8,c[1],13.5,13.5,1.2,near?48:24);cyl('stone',c[0],42,c[1],11,11,7.8,near?48:24);
 for(let i=0;i<24;i++){const a=i*Math.PI/12,x=c[0]+Math.sin(a)*11.02,z=c[1]+Math.cos(a)*11.02;const g=new THREE.Shape();g.moveTo(-.54,43.1);g.lineTo(.54,43.1);g.lineTo(.54,46.6);g.absarc(0,46.6,.54,0,Math.PI);g.lineTo(-.54,43.1);const raw=new THREE.ShapeGeometry(g,near?8:4);raw.rotateY(a);put(raw,'glass',x,0,z);}
 cyl('trim',c[0],49.8,c[1],11.25,11.25,.7,near?48:24);
 // Dark copper outer dome and raised ribs, white 12-column lantern, gold cap and 30-inch ball.
 dome('copper',c[0],50.5,c[1],10.9,10.0);
 for(let i=0;i<(near?24:12);i++){const a=i*Math.PI*2/(near?24:12),P=t=>[c[0]+Math.cos(t)*10.94*Math.sin(a),50.5+Math.sin(t)*10.04,c[1]+Math.cos(t)*10.94*Math.cos(a)];for(let j=0;j<8;j++)b.bar('trim',P(j*Math.PI/16),P((j+1)*Math.PI/16),near?.13:.18,near?.13:.18);}
 cyl('trim',c[0],60.2,c[1],2.5,2.5,.55,24);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;cyl('trim',c[0]+Math.sin(a)*1.85,60.75,c[1]+Math.cos(a)*1.85,.13,.13,3.65,8);}
 cyl('trim',c[0],64.4,c[1],2.3,2.3,.35,24);dome('gold',c[0],64.75,c[1],2.25,1.35);cyl('gold',c[0],66.05,c[1],.16,.16,.23,8);put(new THREE.SphereGeometry(.381,near?16:8,near?10:6),'gold',c[0],66.659,c[1]);

 return finish();
}
