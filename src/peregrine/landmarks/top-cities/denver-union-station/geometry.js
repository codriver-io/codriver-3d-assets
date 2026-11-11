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
 // Current historic headhouse only: the demolished1892 extensions and modern train hall are excluded.
 const cx=2.5,zFront=35,back=-11,frontWidth=32;
 // Long1881 pink-rhyolite wings retain their two floors, grey saltbox/hip roof and dormer rhythm.
 for(const [x,w]of[[-51,54],[53,50]]){block('pink',x,0,0,w,10.5,22.5,Math.round(w/(near?3.7:7.4)),2,null);hip('roof',x,10.5,0,w+.4,23,3.6);for(let X=x-w/2+4;X<x+w/2-2;X+=(near?7.2:14.4)){for(const side of [-1,1]){block('pink',X,10.5,side*7.2,2.5,2.25,3.5,1,1,null);hip('roof',X,12.75,side*7.2,2.8,3.8,1.35);}}for(const y of [.5,5.2,10.4])box('trim',x,y,0,w+.5,.28,23);}
 // Lower central shoulders flank, rather than occlude, the three great arched windows.
 for(const x of [cx-21,cx+21])block('stone',x,0,12,10,16.0,46,2,3,'roof');
 wall('stone',cx-16,0,12,46,21.1,3,7,3);wall('stone',cx+16,0,12,46,21.1,1,7,3);hip('roof',cx,21.1,12,32,46,2.9);
 const arcRing=(x,y,w,h)=>{const p=[[x-w/2,y],[x+w/2,y],[x+w/2,y+h-w/2]];for(let j=1;j<=(near?20:10);j++){const a=j*Math.PI/(near?20:10);p.push([x+Math.cos(a)*w/2,y+h-w/2+Math.sin(a)*w/2]);}p.push([x-w/2,y]);return p;};
 const plane=(polys,m,z,reverse=false)=>{for(const poly of polys){const shape=new THREE.Shape(poly[0].map(p=>new THREE.Vector2(...p)));for(const h of poly.slice(1))shape.holes.push(new THREE.Path(h.map(p=>new THREE.Vector2(...p))));const g=new THREE.ShapeGeometry(shape);if(reverse){const a=Array.from(g.index.array);for(let i=0;i<a.length;i+=3)[a[i+1],a[i+2]]=[a[i+2],a[i+1]];g.setIndex(a);}put(g,m,0,0,z);}};
 const archedWindow=(x,y,z,w,h,cols,rows,reverse=false)=>{const ring=arcRing(x,y,w,h),cells=[];for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const l=x-w/2+i*w/cols+.06,r=x-w/2+(i+1)*w/cols-.06,bt=y+j*h/rows+.06,t=y+(j+1)*h/rows-.06;if(r>l&&t>bt)cells.push([[[l,bt],[r,bt],[r,t],[l,t],[l,bt]]]);}const panes=pc.intersection(pc.union(...cells),[ring]);plane(panes,'glass',z,reverse);plane(pc.difference([ring],panes),'metal',z,reverse);};
 // Front and track-side Great Hall elevations: three tall arched glazed openings and deep surrounds.
 for(const [z,reverse]of[[zFront,false],[back,true]]){const sh=new THREE.Shape([[cx-16,0],[cx+16,0],[cx+16,21.1],[cx-16,21.1]].map(p=>new THREE.Vector2(...p)));for(const x of [cx-9,cx,cx+9]){const ring=arcRing(x,5.6,6.6,13.5);sh.holes.push(new THREE.Path(ring.map(p=>new THREE.Vector2(...p))));}for(const x of [cx-12,cx-6,cx,cx+6,cx+12])sh.holes.push(new THREE.Path(arcRing(x,.1,2.6,3.8).map(p=>new THREE.Vector2(...p))));const facade=[[sh.getPoints().map(p=>p.toArray()),...sh.holes.map(h=>h.getPoints().map(p=>p.toArray()))]],joints=[];for(let y=.8;y<20.8;y+=(near?.8:1.6))joints.push([[[cx-16,y-.022],[cx+16,y-.022],[cx+16,y+.022],[cx-16,y+.022],[cx-16,y-.022]]]);const courses=pc.union(...joints);plane(pc.difference(facade,courses),'stone',z,reverse);plane(pc.intersection(facade,courses),'mortar',z,reverse);for(const x of [cx-9,cx,cx+9]){archedWindow(x,5.6,z,6.6,13.5,near?5:3,near?9:4,reverse);plane(pc.difference([arcRing(x,5.45,7.2,14.1)],[arcRing(x,5.6,6.6,13.5)]),'trim',z+(reverse?-.16:.16),reverse);}
 // Individual lower arched entry doors are cut from a separate low front screen.
 for(const x of [cx-12,cx-6,cx,cx+6,cx+12]){const ring=arcRing(x,.1,2.6,3.8);archedWindow(x,.1,z,2.6,3.8,2,2,reverse);}
 }
 // Deep rusticated pilasters and dentilled entablature are grounded to the same datum.
 for(const side of [-1,1])for(const x of [cx-16,cx+16]){const z=side>0?zFront+.35:back-.35;box('stone',x,10.4,z,2,20.8,1.15);if(near)for(let y=.4;y<20.5;y+=(near?.8:1.6))box('stone',x,y,z,2.15,.12,1.3);box('trim',x,21.1,z,3.1,.6,1.9);}
 for(const z of [zFront,back]){box('trim',cx,21.6,z,36,1.0,2.4);box('stone',cx,22.25,z,36.7,.3,2.8);for(let x=cx-17;x<cx+18;x+=(near?.85:3.4))box('trim',x,20.825,z+.8,.34,.55,.75);for(const x of [cx-14.5,cx+14.5]){box('stone',x,23.0,z,5.2,1.2,1.3);box('trim',x,23.7,z,5.7,.2,1.5);}}
 // Simplified original urn-and-swag reliefs on the outer pilaster panels, without numerals/letters.
 for(const x of [cx-16,cx+16]){cyl('trim',x,14.4,zFront+1.05,.65,.38,1.4,near?12:6);cyl('trim',x,15.8,zFront+1.05,.32,.75,.5,near?12:6);box('trim',x,13.7,zFront+1.05,.65,1.0,.5);for(const s of [-1,1])b.bar('trim',[x+s*.7,15.8,zFront+1.05],[x+s*.3,13.2,zFront+1.05],.18,.18);}
 // Great Hall clock face is a planar material mosaic, with actual hands/ticks and no backing overlaps.
 const cy=25.0,cr=2.4,circle=(r,n)=>Array.from({length:n+1},(_,i)=>[cx+Math.sin(i*Math.PI*2/n)*r,cy+Math.cos(i*Math.PI*2/n)*r]),marks=[];
 for(let i=0;i<12;i+=(near?1:3)){const a=i*Math.PI/6,cs=Math.cos(a),sn=Math.sin(a);marks.push([[[-.08,1.88],[.08,1.88],[.08,2.1],[-.08,2.1],[-.08,1.88]].map(([u,v])=>[cx+cs*u+sn*v,cy-sn*u+cs*v])]);}
 for(const [a,l]of[[.45,1.7],[-1.0,1.2]]){const cs=Math.cos(a),sn=Math.sin(a);marks.push([[[-.08,-.1],[.08,-.1],[.08,l],[-.08,l],[-.08,-.1]].map(([u,v])=>[cx+cs*u+sn*v,cy-sn*u+cs*v])]);}
 const ink=pc.union(...marks);for(const z of [zFront+.3,back-.3]){const rev=z<0;plane(pc.difference([circle(cr,near?48:16)],ink),'trim',z,rev);plane(ink,'metal',z,rev);const pedestal=[[[cx-3.1,22.25],[cx+3.1,22.25],[cx+3.1,25],[cx-3.1,25],[cx-3.1,22.25]]];plane(pc.difference(pc.union([circle(cr+.35,near?48:16)],pedestal),[circle(cr,near?48:16)]),'stone',z,rev);}
 // Two bare rooftop sign frames preserve the broad arch silhouette; all neon words are omitted.
 for(const z of [zFront-.6,back+.6]){const P=x=>[cx+x,28.1-4.1*(x/18)**2,z];for(let i=0;i<24;i+=(near?1:2))b.bar('metal',P(-18+i*1.5),P(-18+(i+(near?1:2))*1.5),.15,.15);for(const x of [-18,-12,-6,0,6,12,18])b.bar('metal',[cx+x,22.6,z],P(x),.12,.12);}
 // Cantilevered iron entrance canopy: roof/soffit and braced beams attach directly to the facade.
 box('metal',cx,4.45,37.2,63,.3,4.4);
 for(const u of [-30,-25,-21,-15,-9,-3,3,9,15,21,25,30])box('metal',cx+u,4.15,37.2,.16,.3,4.4);for(const u of [-21,-15,-9,-3,3,9,15,21])b.bar('metal',[cx+u,2.6,35],[cx+u,4.0,38.8],.13,.13);
 for(let x=cx-31;x<cx+31;x+=(near?1.2:3.0)){const g=near?new THREE.TorusGeometry(.32,.045,4,10):new THREE.RingGeometry(.275,.365,6);put(g,'metal',x,4.82,39.4);}

 return finish();
}
