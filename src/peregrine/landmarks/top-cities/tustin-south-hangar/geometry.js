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
 const rw=W/2-1.2,rh=54.25,base=1.3,z0=-D/2+2,z1=D/2-2;
 const curve=x=>base+(rh-base)*Math.sqrt(Math.max(0,1-(x/rw)**2));
 const xs=[-rw,rw,0];for(let i=0;i<=(near?64:32);i++)xs.push(-rw+i*2*rw/(near?64:32));for(const y of [15,17,31,33]){const x=rw*Math.sqrt(1-((y-base)/(rh-base))**2);xs.push(-x,x);}const xx=[...new Set(xs.map(x=>+x.toFixed(6)))].sort((a,c)=>a-c);
 // Closed curved shell: horizontal daylight bands are face partitions, not overlays.
 const count=near?51:26;
 for(let j=0;j<count;j++){const za=z0+(z1-z0)*j/count,zc=z0+(z1-z0)*(j+1)/count;
  for(let i=0;i<xx.length-1;i++){const x=xx[i],X=xx[i+1],y=curve(x),Y=curve(X),mid=(y+Y)/2,m=(mid>15&&mid<17)||(mid>31&&mid<33)?'glass':'roof';
   quad(m,[x,y,za],[x,y,zc-.18],[X,Y,zc-.18],[X,Y,za]);quad('seam',[x,y,zc-.18],[x,y,zc],[X,Y,zc],[X,Y,zc-.18]);
  }
 }
 for(const x of [-rw,rw])box('stone',x,.65,0,.7,1.3,z1-z0);
 // Concrete portal towers and box guides; six 120 by 37 ft leaves close each end.
 const doorW=6*11.2776,doorH=36.576;
 for(const side of [-1,1]){
  const z=side*(D/2-.8),outer=[];
  for(let i=0;i<=64;i++){const x=-rw+i*2*rw/64;outer.push([x,Math.max(curve(x),Math.abs(x)<doorW/2?doorH:0)]);}
  // Separate cheek polygons and clipped crown leave the rectangular opening genuinely empty.
  const faceShape=points=>{const g=new THREE.ShapeGeometry(new THREE.Shape(points.map(p=>new THREE.Vector2(...p))));if(side<0)g.setIndex(Array.from(g.index.array).reduce((o,v,i,a)=>i%3===0?[...o,a[i],a[i+2],a[i+1]]:o,[]));put(g,'roof',0,0,z);};
  for(const sign of [-1,1]){const pts=[[sign*rw,0],[sign*doorW/2,0],[sign*doorW/2,curve(doorW/2)]];for(let j=1;j<=12;j++){const x=doorW/2+(rw-doorW/2)*j/12;pts.push([sign*x,curve(x)]);}if(sign<0)pts.reverse();faceShape(pts);}
  const crownX=rw*Math.sqrt(1-((doorH-base)/(rh-base))**2),crown=[[-crownX,doorH],[crownX,doorH]];for(let j=0;j<=40;j++){const x=crownX-j*2*crownX/40;crown.push([x,curve(x)]);}faceShape(crown);
  for(let leaf=0;leaf<6;leaf++){const l=-doorW/2+leaf*11.2776,r=l+11.2776;
   const face=(m,a,y,c,Y)=>{const pp=[[a,y,z],[c,y,z],[c,Y,z],[a,Y,z]];quad(m,...(side>0?pp:pp.reverse()));};
   face('trim',l,0,l+.18,doorH);face('trim',r-.18,0,r,doorH);
   for(let j=0;j<10;j++){const lo=j*doorH/10,hi=(j+1)*doorH/10;if(j)face((leaf+j)%4===0?'door2':'door',l+.18,lo,r-.18,hi);else{face('door',l+.18,0,r-.18,1.3);face('door',l+.18,3.2,r-.18,hi);const n=near?10:5,cw=(r-l-.36)/n;for(let k=0;k<n;k++){const x=l+.18+k*cw;face('glass',x,1.3,x+cw-.12,3.2);face('trim',x+cw-.12,1.3,x+cw,3.2);}}}

  }
  for(const x of [-38.5,38.5])box('stone',x,44.196/2,z,5.2,44.196,5.4);
  box('stone',0,39.5,z,Math.min(W+1,92),5.848,5.4);
 }
 // Ridge walkway, parapets and the surviving wind indicator, all tied to the roof crown.
 box('seam',0,54.25,0,1.3,.26,D-8);
 for(const x of [-.6,.6]){for(let j=0;j<=(near?26:13);j++)box('trim',x,54.8,-D/2+4+j*(D-8)/(near?26:13),.07,1.1,.07);box('trim',x,55.25,0,.08,.08,D-8);}
 cyl('trim',0,54.25,0,.09,.09,3.35,6);box('trim',0,57.15,0,1.7,.12,.12);

 return finish();
}
