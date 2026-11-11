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
 // Portland's original long depot: mapped building perimeter and the separate entrance canopy.
 const R=SPEC.rotation,k=111320*Math.cos(SPEC.origin[1]*Math.PI/180),local=ring=>ring.map(([lng,lat])=>{const x=(lng-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [Math.cos(R)*x-Math.sin(R)*z,Math.sin(R)*x+Math.cos(R)*z];}),plan=local(FOOTPRINTS[0]),canopy=local(FOOTPRINTS[2]);
 const polygon=(ring,y,m,down=false)=>{const g=new THREE.ShapeGeometry(new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))));g.rotateX(-Math.PI/2);if(down){const a=Array.from(g.index.array);for(let i=0;i<a.length;i+=3)[a[i+1],a[i+2]]=[a[i+2],a[i+1]];g.setIndex(a);}put(g,m,0,y,0);};
 // Red pressed-brick piers frame grey pebbledash panels; windows replace faces in both LODs.
 for(let i=0;i<plan.length-1;i++){const a=plan[i],c=plan[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<.02)continue;const P=(u,y)=>[a[0]+(c[0]-a[0])*u/len,y,a[1]+(c[1]-a[1])*u/len],strip=(m,l,r,lo,hi)=>quad(m,P(l,lo),P(r,lo),P(r,hi),P(l,hi));
  // The small curved frontage needs separate windows on every mapped facet in far.
  // Share its full-height piers and inter-storey bands to retain all three rows cheaply.
  const curvedFrontage=[a,c].every(([x,z])=>x>=-68&&x<=-52&&z>=-12&&z<=0);
  if(!near&&curvedFrontage){
   const wl=len*.25,wr=len*.75;
   strip('base',0,len,0,.65);strip('brick',0,wl,.65,12.65);strip('brick',wr,len,.65,12.65);
   let bottom=.65;
   for(let row=0;row<3;row++){const lo=1.4+row*4,hi=lo+2.55;strip('stone',wl,wr,bottom,lo);strip('glass',wl,wr,lo,hi);bottom=hi;}
   strip('stone',wl,wr,bottom,12.65);strip('trim',0,len,12.65,13.05);continue;
  }
  if(!near&&len<3.2){strip('base',0,len,0,.65);strip('stone',0,len,.65,12.65);strip('trim',0,len,12.65,13.05);continue;}const cols=Math.max(1,Math.round(len/(near?3.5:7.0)));for(let j=0;j<cols;j++){const l=j*len/cols,r=(j+1)*len/cols,w=r-l,wl=l+w*.25,wr=r-w*.25;strip('base',l,r,0,.65);for(let row=0;row<3;row++){const lo=.65+row*4.0,hi=lo+4;strip('brick',l,l+Math.min(.35,w*.2),lo,hi);strip('brick',r-Math.min(.35,w*.2),r,lo,hi);for(const [u,U,bt,tp,m]of[[l+.35,r-.35,lo,lo+.75,'stone'],[l+.35,r-.35,lo+3.3,hi,'stone'],[l+.35,wl,lo+.75,lo+3.3,'stone'],[wr,r-.35,lo+.75,lo+3.3,'stone'],[wl,wr,lo+.75,lo+3.3,'glass']])if(U>u)strip(m,u,U,bt,tp);strip('brick',l,r,hi-.22,hi);}strip('trim',l,r,12.65,13.05);}}
 polygon(plan,13.05,'roof');
 // Measured-plan roof masses: long hipped wings, broad main hall and perpendicular service wing.
 hip('roof',-54.5,13.05,5.8,49,21,4.21);hip('roof',-17,13.05,9.6,26,27,4.21);hip('roof',30,13.05,0,60,47,5.2);hip('roof',69,13.05,-5.5,19,18.5,4.2);hip('roof',7,13.05,34.8,18.5,25,4.2);
 // Grey and red Romanesque clock tower occupies its exact seven-metre OSM part.
 const tx=-16.95,tz=-.5,tw=7.0;
 for(let side=0;side<4;side++){const a=side*Math.PI/2,sh=new THREE.Shape([[-3.5,0],[3.5,0],[3.5,33.7],[-3.5,33.7]].map(p=>new THREE.Vector2(...p)));for(const [y,w,h]of[[1.5,1.3,2.3],[5.5,1.3,2.3],[9.5,1.3,2.3],[15.7,.8,1.8],[25.2,.8,1.8],[31.6,.8,1.6]]){const p=new THREE.Path();p.moveTo(-w/2,y);p.lineTo(w/2,y);p.lineTo(w/2,y+h-w/2);p.absarc(0,y+h-w/2,w/2,0,Math.PI);p.lineTo(-w/2,y);sh.holes.push(p);const glass=new THREE.ShapeGeometry(new THREE.Shape(p.getPoints(near?8:4)));glass.rotateY(a);put(glass,'dark',tx+Math.sin(a)*3.5,0,tz+Math.cos(a)*3.5);}const g=new THREE.ShapeGeometry(sh,near?8:4);g.rotateY(a);put(g,'stone',tx+Math.sin(a)*3.5,0,tz+Math.cos(a)*3.5);}
 for(const sx of [-1,1])for(const sz of [-1,1])box('brick',tx+sx*3.28,17,tz+sz*3.28,.45,34,.45);
 box('brick',tx,34.1,tz,7.8,.8,7.8);block('brick',tx,34.5,tz,7.4,6.4,7.4,0,0,'trim');
 // Four real white clock faces: opaque rim, recessed pale disc, hour ticks and hands without lettering.
 const clockPoly=(r,n)=>Array.from({length:n+1},(_,i)=>[Math.sin(i*Math.PI*2/n)*r,Math.cos(i*Math.PI*2/n)*r]);
 const clockCircle=clockPoly(2.27,near?48:24),marks=[];
 for(let j=0;j<12;j+=(near?1:3)){const t=j*Math.PI/6,cs=Math.cos(t),sn=Math.sin(t);marks.push([[[-.08,1.82],[.08,1.82],[.08,2.08],[-.08,2.08],[-.08,1.82]].map(([u,v])=>[cs*u+sn*v,-sn*u+cs*v])]);}
 for(const [t,l]of[[.5,1.65],[-1.1,1.2]]){const cs=Math.cos(t),sn=Math.sin(t);marks.push([[[-.075,-.12],[.075,-.12],[.075,l],[-.075,l],[-.075,-.12]].map(([u,v])=>[cs*u+sn*v,-sn*u+cs*v])]);}
 const ink=pc.union(...marks),face=pc.difference([clockCircle],ink);
 for(let side=0;side<4;side++){const a=side*Math.PI/2,render=(polys,m)=>{for(const poly of polys){const shape=new THREE.Shape(poly[0].map(p=>new THREE.Vector2(...p)));for(const ring of poly.slice(1))shape.holes.push(new THREE.Path(ring.map(p=>new THREE.Vector2(...p))));const g=new THREE.ShapeGeometry(shape);g.rotateY(a);put(g,m,tx+Math.sin(a)*3.91,37.6,tz+Math.cos(a)*3.91);}};render(pc.difference([clockPoly(2.45,near?48:24)],[clockCircle]),'dark');render(face,'trim');render(ink,'dark');}
 // Projecting eave with open sign support frame; all words/neon lettering are intentionally omitted.
 box('trim',tx,41.1,tz,8.6,.4,8.6);for(const sx of [-1,1])for(const sz of [-1,1])box('metal',tx+sx*3.6,42.1,tz+sz*3.6,.16,1.6,.16);hip('roof',tx,42.9,tz,9,9,2.82);
 // Two characteristic tall brick chimneys, not generic rooftop boxes.
 for(const [x,z,y]of[[-62,7,23],[53,4,26]]){box('brick',x,(y-.6)/2,z,1.8,y-.6,1.6);box('trim',x,y-.3,z,2.05,.6,1.9);}
 // Open iron porte-cochere: actual top/underside, posts bearing at ground and at soffit.
 polygon(canopy,4.8,'metal');polygon(canopy,4.55,'metal',true);
 const postSites=[];for(let i=0;i<canopy.length-1;i++){const a=canopy[i],c=canopy[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<3)continue;const num=Math.ceil(len/7);for(let j=0;j<num;j++){const t=(j+.5)/num;postSites.push([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t]);}quad('metal',[...a.slice(0,1),4.55,a[1]],[c[0],4.55,c[1]],[c[0],4.8,c[1]],[a[0],4.8,a[1]]);}
 for(const [x,z]of postSites){cyl('metal',x,0,z,.11,.11,4.55,near?8:4);}
 // South wing veranda continues the same canopy along the visible brick frontage.
 box('metal',-57,4.675,-6.7,45,.25,5.5);for(let x=-77;x<-35;x+=7)cyl('metal',x,0,-9.2,.11,.11,4.55,near?8:4);

 return finish();
}
