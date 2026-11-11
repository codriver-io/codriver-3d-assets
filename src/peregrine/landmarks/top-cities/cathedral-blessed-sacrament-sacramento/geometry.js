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
 // West-facing French Renaissance cathedral: one tall central bell tower, two lesser corner towers.
 const R=SPEC.rotation,k=111320*Math.cos(SPEC.origin[1]*Math.PI/180),plan=FOOTPRINTS[0].map(([lng,lat])=>{const x=(lng-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [Math.cos(R)*x-Math.sin(R)*z,Math.sin(R)*x+Math.cos(R)*z];});
 const surface=(m,x,y,z,w,h,openings=[],side=0)=>{const sh=new THREE.Shape([[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]].map(p=>new THREE.Vector2(...p)));for(const o of openings){const [u,v,W,H,arc=true]=o,p=new THREE.Path();p.moveTo(u-W/2,v);p.lineTo(u+W/2,v);if(arc){p.lineTo(u+W/2,v+H-W/2);p.absarc(u,v+H-W/2,W/2,0,Math.PI);p.lineTo(u-W/2,v);}else{p.lineTo(u+W/2,v+H);p.lineTo(u-W/2,v+H);p.closePath();}sh.holes.push(p);const win=new THREE.ShapeGeometry(new THREE.Shape(p.getPoints(near?10:5)));win.rotateY(side*Math.PI/2);if(o[5])win.dispose();else put(win,'glass',x,y,z);}const g=new THREE.ShapeGeometry(sh,near?10:5);g.rotateY(side*Math.PI/2);put(g,m,x,y,z);};
 const top=(ring,y,m)=>{const g=new THREE.ShapeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))));g.rotateX(-Math.PI/2);put(g,m,0,y,0);};
 // The literal owned perimeter includes shallow chapels and its rear apse; no rectory ownership.
 for(let i=0;i<plan.length-1;i++){const a=plan[i],q=plan[i+1],len=Math.hypot(q[0]-a[0],q[1]-a[1]);if(len<.01||Math.min(a[1],q[1])>29)continue;for(const [lo,hi,m]of[[0,2,'base'],[2,14,'stone']]){const P=(u,y)=>[a[0]+(q[0]-a[0])*u/len,y,a[1]+(q[1]-a[1])*u/len];const cols=Math.max(1,Math.round(len/5)),cw=len/cols;for(let j=0;j<cols;j++){const l=j*cw,r=l+cw;if(m==='base'||len<3){quad(m,P(l,lo),P(r,lo),P(r,hi),P(l,hi));continue;}const wl=l+cw*.3,wr=r-cw*.3;for(const [u,U,bt,tp,mat]of[[l,r,lo,5,m],[l,r,11,hi,m],[l,wl,5,11,m],[wr,r,5,11,m],[wl,wr,5,11,'glass']])quad(mat,P(u,bt),P(U,bt),P(U,tp),P(u,tp));}}}
 top(plan,14,'roof');block('stone',0,14,-1.5,21,8.5,56,8,1,null);gable('roof',0,22.5,-1.5,22,56.5,5.5);
 // Tall west facade: three arched portals, grouped clerestory windows, rose and layered cornices.
 surface('stone',0,2,31.5,33,11,[[-9,0,4.3,8.6],[0,0,4.8,8.6],[9,0,4.3,8.6]]);
 const low=[];for(const x of [-9,0,9])for(const dx of [-1.2,0,1.2])low.push([x+dx,1,.85,3.3]);surface('stone',0,13,31.5,33,6,low);
 surface('stone',0,19,31.5,33,10.5,[[-10.1,1.3,1.9,6.6],[-7.9,1.3,1.9,6.6],[7.9,1.3,1.9,6.6],[10.1,1.3,1.9,6.6],[0,2.1,5.7,5.7,false,true]]);
 // Rose is a circular stone/glass mosaic replacing the square centre field.
 {const s=new THREE.Shape([[-2.85,21.1],[2.85,21.1],[2.85,26.8],[-2.85,26.8]].map(p=>new THREE.Vector2(...p))),p=new THREE.Path();p.absarc(0,23.95,2.65,0,Math.PI*2);s.holes.push(p);put(new THREE.ShapeGeometry(s,24),'trim',0,0,31.52);put(new THREE.CircleGeometry(2.65,near?32:16),'glass',0,23.95,31.51);for(let i=0;i<8;i++){const a=i*Math.PI/4;b.bar('trim',[0,23.95,31.56],[Math.sin(a)*2.6,23.95+Math.cos(a)*2.6,31.56],.10,.10);}}
 // Remove the generic central glazing field behind the rose; real round mosaic is the only facing surface.
 for(const y of [2,13,18.8,29.5])box('trim',0,y,31.7,34.2,.5,.75);
 for(const x of [-15.8,-5.2,5.2,15.8]){box('trim',x,15.7,31.85,1.0,27.4,1.1);for(const y of [3,12.8,18.8,28.8])box('trim',x,y,31.9,1.7,.65,1.3);}
 // Main central tower base lies behind the facade, supported at grade and beneath its belfry.
 block('stone',0,0,27,8,30,8,1,3,'trim');
 const openTower=(x,z,y,w,h)=>{for(const sx of [-1,1])for(const sz of [-1,1])box('trim',x+sx*(w/2-.4),y+h/2,z+sz*(w/2-.4),.8,h,.8);box('trim',x,y+.35,z,w,.7,w);box('trim',x,y+h-.35,z,w,.7,w);};
 // Four load-bearing arched faces, with real apertures and recessed horizontal louvres.
 for(let side=0;side<4;side++){const a=side*Math.PI/2,sh=new THREE.Shape([[-3.6,30],[3.6,30],[3.6,39.1],[-3.6,39.1]].map(p=>new THREE.Vector2(...p))),h=new THREE.Path();h.moveTo(-2.65,30.7);h.lineTo(2.65,30.7);h.lineTo(2.65,35.85);h.absarc(0,35.85,2.65,0,Math.PI);h.lineTo(-2.65,30.7);sh.holes.push(h);const g=new THREE.ExtrudeGeometry(sh,{depth:.45,bevelEnabled:false,curveSegments:near?12:6});g.translate(0,0,3.15);g.rotateY(a);put(g,'trim',0,0,27);
  for(let i=0;i<7;i++){const y=31.6+i*.68;box('roof',Math.sin(a)*2.95,y,27+Math.cos(a)*2.95,4.9,.22,.32,a);}
 }
 cyl('dark',0,34.3,27,1.25,.65,1.6,12);box('dark',0,36.3,27,3.2,.2,.2);
 block('stone',0,39.1,27,6.5,5.5,6.5,0,0,'trim');for(let side=0;side<4;side++){const a=side*Math.PI/2;clock(Math.sin(a)*3.3,41.9,27+Math.cos(a)*3.3,1.25,side);}
 for(let side=0;side<4;side++){const a=side*Math.PI/2,sh=new THREE.Shape([[-2.65,44.6],[2.65,44.6],[2.65,50],[-2.65,50]].map(p=>new THREE.Vector2(...p))),h=new THREE.Path();h.moveTo(-1.75,45);h.lineTo(1.75,45);h.lineTo(1.75,47.6);h.absarc(0,47.6,1.75,0,Math.PI);h.lineTo(-1.75,45);sh.holes.push(h);const g=new THREE.ExtrudeGeometry(sh,{depth:.35,bevelEnabled:false,curveSegments:near?10:5});g.translate(0,0,2.3);g.rotateY(a);put(g,'trim',0,0,27);}cyl('trim',0,50,27,3.3,3.3,.75,8);cyl('stone',0,50.75,27,2.8,2.8,3.3,8);dome('roof',0,54.05,27,2.8,4.6);cyl('trim',0,58.5,27,1.5,1.5,.35,8);openTower(0,27,58.85,2.25,3.3);cyl('roof',0,62.15,27,1.55,0,2.2,8);
 const cross=(x,y,z,h)=>{box('gold',x,y+h/2,z,.14,h,.14);box('gold',x,y+h*.7,z,h*.53,.13,.14);};cross(0,64.35,27,1.18);
 // Two smaller corner towers frame the facade and keep their distinct taper in far.
 for(const x of [-13,13]){block('stone',x,0,27,6.2,31,7,1,3,'trim');block('stone',x,31,27,5.0,5.7,5,1,1,'trim');cyl('trim',x,36.7,27,3.1,3.1,.65,8);dome('roof',x,37.35,27,2.8,3.8);cyl('gold',x,41.15,27,.18,.18,.8,8);cross(x,41.95,27,1.2);}
 // Crossing dome and lantern on the independently mapped circular roof location.
 const dc=[1.8,-8.3];
 // Sixteen arched drum bays (four per quadrant), all retained in far, separated by pilasters.
 const drumN=16,drumA=Math.PI*2/drumN,drumW=20*Math.sin(Math.PI/drumN),drumR=10*Math.cos(Math.PI/drumN);
 for(let i=0;i<drumN;i++){const a=(i+.5)*drumA,sh=new THREE.Shape([[-drumW/2,22.5],[drumW/2,22.5],[drumW/2,34.5],[-drumW/2,34.5]].map(p=>new THREE.Vector2(...p))),h=new THREE.Path();h.moveTo(-1.05,28.4);h.lineTo(1.05,28.4);h.lineTo(1.05,32.35);h.absarc(0,32.35,1.05,0,Math.PI);h.lineTo(-1.05,28.4);sh.holes.push(h);const g=new THREE.ExtrudeGeometry(sh,{depth:.3,bevelEnabled:false,curveSegments:near?8:4});g.translate(0,0,drumR-.3);g.rotateY(a);put(g,'stone',... [dc[0],0,dc[1]]);const win=new THREE.ShapeGeometry(new THREE.Shape(h.getPoints(near?8:4)));win.translate(0,0,drumR-.32);win.rotateY(a);put(win,'glass',dc[0],0,dc[1]);const p=i*drumA;box('trim',dc[0]+Math.sin(p)*9.99,31.45,dc[1]+Math.cos(p)*9.99,.38,6.1,.36,p);}
 cyl('trim',dc[0],34.5,dc[1],10.4,10.4,.65,near?32:16);dome('roof',dc[0],35.15,dc[1],10.1,12.1);
 for(let i=0;i<(near?16:8);i++){const a=i*Math.PI*2/(near?16:8),P=t=>[dc[0]+Math.cos(t)*10.13*Math.sin(a),35.15+Math.sin(t)*12.13,dc[1]+Math.cos(t)*10.13*Math.cos(a)];for(let j=0;j<6;j++)b.bar('trim',P(j*Math.PI/12),P((j+1)*Math.PI/12),.11,.11);}
 cyl('trim',dc[0],47.1,dc[1],2.6,2.6,.5,12);for(let i=0;i<8;i++){const a=i*Math.PI/4;cyl('trim',dc[0]+Math.sin(a)*2.1,47.6,dc[1]+Math.cos(a)*2.1,.15,.15,3,6);}cyl('trim',dc[0],50.6,dc[1],2.6,2.6,.35,12);dome('roof',dc[0],50.95,dc[1],2.5,1.2);cross(dc[0],52.15,dc[1],1.19);
 // Broad entrance stair, solid to the foundation: lowest tread is0.2m above local grade.
 for(let i=0;i<10;i++)box('base',0,(i+1)*.1,35.5-i*.4,29,(i+1)*.2,i===9?.8:.4);

 // Raised carved arch surrounds and layered tower cornices retain the Renaissance rhythm.
 const frameArch=(x,y,z,w,h,t)=>{const outer=new THREE.Shape();outer.moveTo(x-w/2,y);outer.lineTo(x+w/2,y);outer.lineTo(x+w/2,y+h-w/2);outer.absarc(x,y+h-w/2,w/2,0,Math.PI);outer.lineTo(x-w/2,y);const p=new THREE.Path();p.moveTo(x-w/2+t,y);p.lineTo(x+w/2-t,y);p.lineTo(x+w/2-t,y+h-w/2);p.absarc(x,y+h-w/2,w/2-t,0,Math.PI);p.lineTo(x-w/2+t,y);outer.holes.push(p);put(new THREE.ShapeGeometry(outer,near?12:6),'trim',0,0,z);};
 for(const x of [-9,0,9])frameArch(x,2,31.65,x===0?5.2:4.7,8.9,.2);
 for(const x of [-9,9]){frameArch(x,20.1,31.66,4.8,7.1,.25);prism('trim',[[x-2.7,27.5],[x+2.7,27.5],[x,28.9]],31.6,.28);}
 for(const [y,w]of[[30,8],[39.1,8],[44.6,7.3],[50,6.1],[54.05,6.3]]){box('trim',0,y,27,w,.35,w);}

 return finish();
}
