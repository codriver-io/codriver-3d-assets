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
 const cx=-1.2,eave=4.7,peak=9.2,front=7.4,rear=-8.4;
 // Original faceted fieldstone: each stone replaces the wall face; no texture or backing overlay.
 const rubble=(x,y,z,w,h,d)=>{for(let side=0;side<4;side++){const a=side*Math.PI/2,tw=side%2?d:w,dep=side%2?w:d,cols=Math.max(1,Math.ceil(tw/(near?.55:.95))),rows=Math.max(1,Math.ceil(h/(near?.55:.95))),P=(u,v,out=0)=>[x+Math.cos(a)*u+Math.sin(a)*(dep/2+out),y+v,z-Math.sin(a)*u+Math.cos(a)*(dep/2+out)];for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const l=-tw/2+i*tw/cols,r=l+tw/cols,lo=j*h/rows,hi=(j+1)*h/rows,p=[P(l,lo),P(r,lo),P(r,hi),P(l,hi),P((l+r)/2,(lo+hi)/2,.035+((i*5+j*3+side)%3)*.012)],g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex([0,1,4,1,2,4,2,3,4,3,0,4]);g.computeVertexNormals();b.put(g,(i+j+side)%4===0?'stone2':'stone');}}quad('stone',[x-w/2,y+h,z+d/2],[x+w/2,y+h,z+d/2],[x+w/2,y+h,z-d/2],[x-w/2,y+h,z-d/2]);};
 // Raised shingle base, mustard lapped first storey and the low attic knee wall.
 block('base',cx,0,-.5,8.8,1.1,15.8,5,1,'base');
 wall('paint',-5.6,1.1,-.5,15.8,3,3,5,1);wall('paint',cx,1.1,rear,8.8,3,2,4,1);
 // South wall includes the actual porch entry, rather than a window that cannot reach its floor.
 const south=new THREE.Shape([[-rear,1.1],[-front,1.1],[-front,4.1],[-rear,4.1]].map(p=>new THREE.Vector2(...p)));
 const slot=(u,y,w,h)=>{const p=new THREE.Path();p.moveTo(u-w/2,y);p.lineTo(u+w/2,y);p.lineTo(u+w/2,y+h);p.lineTo(u-w/2,y+h);p.closePath();return p;};
 for(const [z,y,w,h]of[[1,1.1,1.1,2.4],[-4.6,1.7,1,1.7],[4.6,1.7,.9,1.7]]){const p=slot(-z,y,w,h);south.holes.push(p);const g=new THREE.ShapeGeometry(new THREE.Shape(p.getPoints()));g.rotateY(Math.PI/2);put(g,'glass',3.2,0,0);}
 {const g=new THREE.ShapeGeometry(south);g.rotateY(Math.PI/2);put(g,'paint',3.2,0,0);}
 wall('paint',-5.1,1.1,front,1,3,0);wall('paint',1.2,1.1,front,4,3,0,2,1);
 for(const [x,z,w,d,side]of[[cx,front,8.8,0,0],[cx,rear,8.8,0,2],[-5.6,-.5,15.8,0,3],[3.2,-.5,15.8,0,1]])wall('wood',x,4.1,z,w,.6,side);
 // West bay window, its heavy white casement grid, transoms and shallow hood.
 block('base',-2.7,0,7.95,3.8,1.1,1.1,0,0,'base');
 const windowGrid=(x,y,z,w,h,cols,rows,side=0)=>{const a=side*Math.PI/2,P=(u,v)=>[x+Math.cos(a)*u,y+v,z-Math.sin(a)*u];for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const l=-w/2+i*w/cols,r=l+w/cols,bt=j*h/rows,t=bt+h/rows,f=.09;for(const [u,v,U,V,m]of[[l,bt,r,bt+f,'trim'],[l,t-f,r,t,'trim'],[l,bt+f,l+f,t-f,'trim'],[r-f,bt+f,r,t-f,'trim'],[l+f,bt+f,r-f,t-f,'glass']])quad(m,P(u,v),P(U,v),P(U,V),P(u,V));}};
 windowGrid(-2.7,1.1,8.5,3.8,2.8,3,2);windowGrid(-4.6,1.1,7.95,1.1,2.8,1,2,3);windowGrid(-.8,1.1,7.95,1.1,2.8,1,2,1);
 box('trim',-2.7,4.0,7.95,4,.2,1.3);quad('roof',[-4.7,4.1,8.6],[-.7,4.1,8.6],[-.7,4.55,7.35],[-4.7,4.55,7.35]);
 // Dark coursed shingle gables with cream stucco peaks and timber framing.
 const half=(peak-7.5)/((peak-eave)/4.6),lowGable=new THREE.Shape([[-5.8,eave],[3.4,eave],[cx+half,7.5],[cx-half,7.5]].map(p=>new THREE.Vector2(...p))),hole=slot(cx,5.3,3,2.05);lowGable.holes.push(hole);put(new THREE.ShapeGeometry(lowGable),'wood',0,0,front);windowGrid(cx,5.3,front,3,2.05,3,2);
 prism('stone',[[cx-half,7.5],[cx+half,7.5],[cx,peak]],front-.1,.1);
 const sideZ=1.4,sidePeak=8.8,sideHalf=(sidePeak-7.3)/(4.1/3.2),sg=new THREE.Shape([[-sideZ-3.2,eave],[-sideZ+3.2,eave],[-sideZ+sideHalf,7.3],[-sideZ-sideHalf,7.3]].map(p=>new THREE.Vector2(...p)));
 for(const z of [.55,2.25])sg.holes.push(slot(-z,5.1,.8,1.8));{const g=new THREE.ShapeGeometry(sg);g.rotateY(Math.PI/2);put(g,'wood',3.2,0,0);}for(const z of [.55,2.25])windowGrid(3.2,5.1,z,.8,1.8,1,2,1);
 {const g=new THREE.ShapeGeometry(new THREE.Shape([[-sideZ-sideHalf,7.3],[-sideZ+sideHalf,7.3],[-sideZ,sidePeak]].map(p=>new THREE.Vector2(...p))));g.rotateY(Math.PI/2);put(g,'stone',3.2,0,0);}
 // Closed rear gable: the attic is enclosed beneath the full rear roof plane.
 prism('wood',[[-5.6,eave],[3.2,eave],[cx,peak-.18]],rear,.12);
 // Intersecting roof planes are clipped at the real valley, avoiding a buried full roof slab.
 const slope=(peak-eave)/4.6,tip=cx+(peak-sidePeak)/slope;
 const roofSurface=(p,Y,holes=[])=>{const s=new THREE.Shape(p.map(([x,z])=>new THREE.Vector2(x,-z)));for(const r of holes)s.holes.push(new THREE.Path(r.map(([x,z])=>new THREE.Vector2(x,-z))));for(const [m,off,down]of[['roof',0,false],['wood',-.12,true]]){const g=new THREE.ShapeGeometry(s),pos=g.getAttribute('position');for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=-pos.getY(i);pos.setXYZ(i,x,Y(x,z)+off,z);}if(down)g.setIndex(Array.from(g.index.array).reduce((o,v,i,a)=>i%3===0?[...o,a[i],a[i+2],a[i+1]]:o,[]));g.computeVertexNormals();b.put(g,m);}for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];quad('trim',[a[0],Y(...a)-.12,a[1]],[c[0],Y(...c)-.12,c[1]],[c[0],Y(...c),c[1]],[a[0],Y(...a),a[1]]);}};
 roofSurface([[-5.8,-8.7],[cx,-8.7],[cx,8.4],[-5.8,8.4]],x=>peak-slope*(cx-x),[[[-3.15,-3.05],[-2.25,-3.05],[-2.25,-2.15],[-3.15,-2.15]]]);
 roofSurface([[cx,-8.7],[3.4,-8.7],[3.4,-1.8],[tip,sideZ],[3.4,4.6],[3.4,8.4],[cx,8.4]],x=>peak-slope*(x-cx));
 roofSurface([[tip,sideZ],[3.4,-1.8],[3.4,sideZ]],(x,z)=>sidePeak-(sideZ-z)*4.1/3.2);roofSurface([[tip,sideZ],[3.4,sideZ],[3.4,4.6]],(x,z)=>sidePeak-(z-sideZ)*4.1/3.2);
 // Cobblestone chimneys: one full-height external stack and one emerging from the roof.
 rubble(3.45,0,6.2,1.1,10.6,1.15);box('stone',3.45,10.7,6.2,1.25,.2,1.3);
 rubble(-2.7,7.2,-2.6,.9,3.6,.9);box('stone',-2.7,10.9,-2.6,1.05,.2,1.05);
 // South veranda: rough stone piers/railing, tapered timber posts, and a real roof soffit.
 box('base',4.4,.55,2.4,2.4,1.1,8.4);
 for(const z of [-1.2,5.8]){rubble(5.05,0,z,1.05,2.3,1.05);const h=(4.9-(5.05-3.2)*.35/2.4-.12)-2.3,g=new THREE.CylinderGeometry(.30,.45,h,4);g.rotateY(Math.PI/4);put(g,'trim',5.05,2.3+h/2,z);}
 rubble(5.35,0,-.9,.5,1.9,1.8);rubble(5.35,0,4.3,.5,1.9,4.6);
 roofSurface([[3.2,-2.2],[5.8,-2.2],[5.8,6.9],[3.2,6.9]],x=>4.9-(x-3.2)*.35/2.4);
 // Six built-in steps to the side veranda: no lawn or surrounding paving.
 {const s=new THREE.Shape();s.moveTo(5.6,0);s.lineTo(7.4,0);for(let i=0;i<6;i++){s.lineTo(7.4-i*.3,(i+1)*1.1/6);s.lineTo(7.1-i*.3,(i+1)*1.1/6);}s.lineTo(5.6,0);const raw=new THREE.ExtrudeGeometry(s,{depth:2,bevelEnabled:false}),pos=raw.getAttribute('position'),kept=[];for(let i=0;i<pos.count;i+=3){const a=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(pos,i+j));if(a[1].clone().sub(a[0]).cross(a[2].clone().sub(a[0])).lengthSq()>1e-10)kept.push(...a.flatMap(v=>v.toArray()));}raw.dispose();const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(kept,3));g.computeVertexNormals();b.put(g,'stone');}
 // Exposed purlins, eave braces, ridge caps and small timber finials.
 box('trim',cx,9.14,-.15,.18,.12,17.1);for(const z of [-8.7,8.4])box('trim',cx,9.325,z,.065,.25,.065);
 for(const z of [-8,0,7.8])for(const side of [-1,1]){const x=cx+side*4.5;box('trim',x,4.62,z,.16,.18,1.1);b.bar('trim',[x-side*.65,4.0,z-.1],[x,4.6,z+.4],.12,.12);}
 for(const [x,y,z,w,h,d]of[[cx,8.3,7.47,.11,1.4,.14],[3.27,8.0,sideZ,.14,1.4,.11]])box('trim',x,y,z,w,h,d);

 return finish();
}
