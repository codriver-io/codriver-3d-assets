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
   for(const [u,v,U,V,mat] of [[a,bt,c,lo,m],[a,hi,c,t,m],[a,lo,l,hi,m],[r,lo,c,hi,m],[l,lo,r,hi,'glass']]){if(mat==='glass'){const mid=(v+V)/2;quad('glass',p(u,v),p(U,v),p(U,mid-.035),p(u,mid-.035));quad('trim',p(u,mid-.035),p(U,mid-.035),p(U,mid+.035),p(u,mid+.035));quad('glass',p(u,mid+.035),p(U,mid+.035),p(U,V),p(u,V));}else quad(mat,p(u,v),p(U,v),p(U,V),p(u,V));}
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
 const oldX=-.42,oldZ=10.7,oldW=22.4,oldD=16,roofBase=12.3;
 // Original 1914 wing: rusticated base, brick middle, paired sash rhythm and heavy white cornice.
 block('plinth',oldX,0,oldZ,oldW,2.1,oldD,8,1,'trim');
 block('brick',oldX,2.25,oldZ,oldW,4.3,oldD,8,1,'trim');box('trim',oldX,2.175,oldZ,oldW,.15,oldD);
 block('brick',oldX,6.8,oldZ,oldW,4.65,oldD,8,1,'trim');box('trim',oldX,6.675,oldZ,oldW,.25,oldD);
 box('trim',oldX,11.75,oldZ,oldW+.45,.6,oldD+.45);box('trim',oldX,12.175,oldZ,oldW+.85,.25,oldD+.85);
 const frustum=(x,y,z,w,d,ww,dd,h)=>{
  quad('roof',[x-w/2,y,z+d/2],[x+w/2,y,z+d/2],[x+ww/2,y+h,z+dd/2],[x-ww/2,y+h,z+dd/2]);
  quad('roof',[x+w/2,y,z+d/2],[x+w/2,y,z-d/2],[x+ww/2,y+h,z-dd/2],[x+ww/2,y+h,z+dd/2]);
  quad('roof',[x+w/2,y,z-d/2],[x-w/2,y,z-d/2],[x-ww/2,y+h,z-dd/2],[x+ww/2,y+h,z-dd/2]);
  quad('roof',[x-w/2,y,z-d/2],[x-w/2,y,z+d/2],[x-ww/2,y+h,z+dd/2],[x-ww/2,y+h,z-dd/2]);
  quad('roof',[x-ww/2,y+h,z+dd/2],[x+ww/2,y+h,z+dd/2],[x+ww/2,y+h,z-dd/2],[x-ww/2,y+h,z-dd/2]);
 };frustum(oldX,12.3,oldZ,oldW+.7,oldD+.7,15,8.7,2.3);
 // Original projecting central entry bay, with paired pilasters and raised porch.
 block('plinth',oldX,0,19.1,8.7,2.1,1.1,0,0,'trim');for(const [y,h] of [[2.1,4.2],[6.6,4.6]]){wall('brick',oldX-3.925,y,19.1,1.1,h,3,0,0);wall('brick',oldX+3.925,y,19.1,1.1,h,1,0,0);for(let j=0;j<3;j++){const l=oldX-3.925+j*7.85/3,r=l+7.85/3,c=(l+r)/2,wl=c-.68,wr=c+.68,lo=y+.22*h,hi=lo+.56*h;for(const [a,bt,C,tp,m]of[[l,y,l+.175,y+h,'trim'],[r-.175,y,r,y+h,'trim'],[l+.175,y,r-.175,lo,'brick'],[l+.175,hi,r-.175,y+h,'brick'],[l+.175,lo,wl,hi,'brick'],[wr,lo,r-.175,hi,'brick'],[wl,lo,wr,hi,'glass']])quad(m,[a,bt,19.65],[C,bt,19.65],[C,tp,19.65],[a,tp,19.65]);}}

 box('trim',oldX,6.45,19.1,9.1,.3,1.5);box('trim',oldX,11.45,19.1,9.4,.5,1.8);
 for(const x of [oldX-4.1,oldX+4.1]){box('trim',x,6.55,19.75,.35,8.9,.35);box('trim',x,11.1,19.75,.7,.2,.6);}
 for(let j=0;j<9;j++)box('plinth',oldX,(j+1)*2.1/18,22.6-j*.33,5.4,(j+1)*2.1/9,.35);
 // Sympathetic 1988 south wing, separately legible as modern masonry and horizontal bands.
 const nz=-12.07,nw=23.24,nd=12.48;
 block('plinth',.23,0,nz,nw,1.65,nd,6,1,'trim');
 for(let j=0;j<2;j++){const y=1.85+j*4.575;block('brick',.23,y,nz,nw,4.375,nd,6,1,'trim');box('trim',.23,y-.1,nz,nw,.2,nd);}
 box('trim',.23,11.05,nz,nw+.3,.5,nd+.3);frustum(.23,11.3,nz,nw+.6,nd+.6,16.5,5.8,2.5);
 // Glazed, arched three-storey west entry between the wings. Mullions partition the glass.
 const az=-1.55,r=4.25,ax=9.23,sy=10.1,ah=2.2,cols=near?10:6,rows=near?7:5;
 const top=z=>sy+ah*Math.sqrt(Math.max(0,1-((z-az)/r)**2));
 const pane=(m,z0,y0,z1,y1)=>quad(m,[ax,y0,z1],[ax,y0,z0],[ax,y1,z0],[ax,y1,z1]);
 for(let i=0;i<cols;i++){const z0=az-r+i*2*r/cols,z1=az-r+(i+1)*2*r/cols,h0=top(z0),h1=top(z1),f=.11;
  for(let j=0;j<rows;j++){const lo=j*sy/rows,hi=(j+1)*sy/rows;pane('metal',z0,lo,z1,lo+f);pane('metal',z0,hi-f,z1,hi);pane('metal',z0,lo+f,z0+f,hi-f);pane('metal',z1-f,lo+f,z1,hi-f);pane('glass',z0+f,lo+f,z1-f,hi-f);}
  quad('glass',[ax,sy,z1],[ax,sy,z0],[ax,h0,z0],[ax,h1,z1]);
  quad('roof',[-11.63,h0,z0],[-11.63,h1,z1],[ax,h1,z1],[ax,h0,z0]);
 }
 // East-side connector projection remains inside its mapped plan.
 block('brick',-13.25,0,-1.55,3.45,10.6,8.5,3,3,'roof');

 return finish();
}
