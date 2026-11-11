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
 // Broad southern cross wing, north service ell, projecting east gable and two-storey veranda.
 wall('stone',6.2,.6,5.1,9.6,5.8,1,3,2);wall('stone',-6.2,.6,5.1,9.6,5.8,3,3,2);wall('stone',0,.6,.3,12.4,5.8,2,4,2);
 const front=new THREE.Shape([[-6.2,.6],[6.2,.6],[6.2,6.4],[-6.2,6.4]].map(p=>new THREE.Vector2(...p)));
 for(const [x,y,w,h] of [[-4.6,4.45,.9,1.6],[-2.25,4.45,.9,1.6],[1.45,4.45,1,1.6],[4.6,4.45,1,1.6],[-3.8,1.3,1.8,1.7],[-.8,.6,.95,2.3],[2.6,1.3,1.1,1.7],[4.7,1.3,1.1,1.7]]){const l=x-w/2,r=x+w/2,t=y+h,p=new THREE.Path();p.moveTo(l,y);p.lineTo(r,y);p.lineTo(r,t);p.lineTo(l,t);p.closePath();front.holes.push(p);const f=.08;for(const [a,lo,c,hi,m] of [[l,y,r,y+f,'green'],[l,t-f,r,t,'green'],[l,y+f,l+f,t-f,'green'],[r-f,y+f,r,t-f,'green'],[l+f,y+f,r-f,t-f,'glass']])quad(m,[a,lo,9.9],[c,lo,9.9],[c,hi,9.9],[a,hi,9.9]);}
 put(new THREE.ShapeGeometry(front),'stone',0,0,9.9);
 block('stone',-.15,0,-5.4,7.4,4.3,11.4,3,1,'roof');gable('roof',-.15,4.3,-5.4,7.8,11.8,2.1);
 // Left cross-roof ridge is east/west; the right front gable runs north/south.
 {const g=new THREE.ExtrudeGeometry(new THREE.Shape([[-4.9,6.4],[4.9,6.4],[0,8.1]].map(p=>new THREE.Vector2(...p))),{depth:6.9,bevelEnabled:false});g.rotateY(Math.PI/2);put(g,'roof',-6.5,0,4.7);}
 for(const zz of [2.9,9.9]){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-.25,6.4,zz,6.25,6.4,zz,3,9.1,zz],3));g.setIndex(zz>6?[0,1,2]:[0,2,1]);g.computeVertexNormals();b.put(g,'stone');}
 // Slim roof surfaces keep the gable face white and the bargeboards forest green.
 quad('roof',[-.5,6.4,10.15],[3,9.1,10.15],[3,9.1,2.65],[-.5,6.4,2.65]);quad('roof',[3,9.1,10.15],[6.5,6.4,10.15],[6.5,6.4,2.65],[3,9.1,2.65]);
 const rod=(m,a,c,r=.065,n=near?6:4)=>{const v=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),g=new THREE.CylinderGeometry(r,r,v.length(),n);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...new THREE.Vector3(...a).add(new THREE.Vector3(...c)).multiplyScalar(.5).toArray());b.put(g,m);};
 for(const x of [-.5,6.5])rod('green',[x,6.4,10.18],[3,9.1,10.18],.10,4);
 // The roofed left veranda and open upper balcony on the gabled right wing.
 box('trim',0,.45,10.9,12.5,.3,2.1);box('green',3,3.7,10.8,6.8,.25,2.2);
 const shed=new THREE.BoxGeometry(6.5,.18,2.45);shed.rotateX(.12);put(shed,'roof',-3.1,3.75,10.8);
 for(const x of [-6,-2,1.1,6]){box('green',x,2.19,11.65,.15,2.38,.15);box('trim',x,.725,11.65,.28,.55,.28);box('trim',x,3.4775,11.65,.3,.195,.3);}
 const railing=(x0,x1,y,z,upper=false)=>{x0+=.08;x1-=.08;box('trim',(x0+x1)/2,y,z,x1-x0,.10,.10);box('trim',(x0+x1)/2,y+.92,z,x1-x0,.12,.12);const n=near?Math.ceil((x1-x0)/.42):Math.ceil((x1-x0)/.8);for(let j=0;j<n;j++){const x=x0+(j+.5)*(x1-x0)/n;if(upper){rod('trim',[x-.17,y+.08,z],[x+.17,y+.84,z],.045,4);rod('trim',[x+.17,y+.08,z],[x-.17,y+.84,z],.045,4);}else box('trim',x,y+.46,z,.045,.85,.045);}};
 railing(-6,-2,.65,11.66);railing(1.2,6,.65,11.66);railing(-.2,6.3,3.92,11.86,true);
 for(const x of [-.2,6.3]){for(const z of [9.8,11.8])box('green',x,4.3875,z,.12,1.125,.12);}
 // Delicate hanging fan brackets, present at both veranda levels in the current exterior.
 for(const x of [-4.7,2.4,4.7]){rod('trim',[x-.48,3.4,11.7],[x,2.1,11.7],.035,4);rod('trim',[x+.48,3.4,11.7],[x,2.1,11.7],.035,4);if(near)for(const dx of [-.23,0,.23])rod('trim',[x+dx,3.4,11.7],[x,2.1,11.7],.025,4);}
 // Side balcony balusters are real open bars; no solid balcony wall.
 for(const x of [-.2,6.3]){for(const z of [10.5,11.2])rod('trim',[x,3.98,z],[x,4.80,z],.045,4);box('trim',x,4.84,10.8,.1,.1,1.88);box('trim',x,3.96,10.8,.1,.1,1.88);}
 for(let j=0;j<5;j++)box('trim',-.5,(j+1)*.6/10,12.65-j*.25,3,(j+1)*.6/5,.28);
 // The two unwrapped brick chimneys are shown in the current City photograph.
 for(const [x,z,y] of [[-3.5,5.8,8.1],[3,3.5,9.1]]){box('brick',x,(y+10.2)/2,z,.52,10.2-y,.62);box('brick',x,10.12,z,.65,.16,.75);}

 return finish();
}
