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
 // Original clipped-octagonal wedding-cake tiers, in real metres over one rigid foundation.
 const R=SPEC.rotation,k=111320*Math.cos(SPEC.origin[1]*Math.PI/180),base=FOOTPRINTS[0].slice(0,-1).map(([lng,lat])=>{const x=(lng-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return [Math.cos(R)*x-Math.sin(R)*z,Math.sin(R)*x+Math.cos(R)*z];}),levels=[{ring:base,lo:0,hi:3.8},{ring:base.map(([x,z])=>[x*.74,z*.74]),lo:3.8,hi:7.1},{ring:base.map(([x,z])=>[x*.49,z*.49]),lo:7.1,hi:10},{ring:Array.from({length:8},(_,i)=>[Math.sin(Math.PI/8+i*Math.PI/4)*1.75,Math.cos(Math.PI/8+i*Math.PI/4)*1.75]),lo:10,hi:12}];
 const roof=(polys,y)=>{for(const p of polys){const s=new THREE.Shape(p[0].map(([x,z])=>new THREE.Vector2(x,-z)));for(const ring of p.slice(1))s.holes.push(new THREE.Path(ring.map(([x,z])=>new THREE.Vector2(x,-z))));const g=new THREE.ShapeGeometry(s);g.rotateX(-Math.PI/2);put(g,'roof',0,y,0);}};
 for(let index=0;index<levels.length;index++){const t=levels[index],closed=[...t.ring,t.ring[0]];for(let i=0;i<t.ring.length;i++){const a=t.ring[i],c=t.ring[(i+1)%t.ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),P=(u,y,inset=0)=>[a[0]+dx*u/len+dz*inset/len,y,a[1]+dz*u/len-dx*inset/len],face=(m,l,r,lo,hi,inset=0)=>quad(m,P(l,lo,inset),P(r,lo,inset),P(r,hi,inset),P(l,hi,inset)),cols=Math.max(1,Math.round(len/(index===3?1.8:2.4))),cw=len/cols,h=t.hi-t.lo;
 for(let j=0;j<cols;j++){const l=j*cw,r=l+cw,w=Math.min(cw*.57,index===3?.65:.95),wl=(l+r-w)/2,wr=wl+w,bt=t.lo+(index===3?.45:.65),tp=t.hi-.6;for(const [u,U,y,Y,m]of[[l,r,t.lo,bt,'stone'],[l,r,tp,t.hi,'stone'],[l,wl,bt,tp,'stone'],[wr,r,bt,tp,'stone']])face(m,u,U,y,Y);const f=.055,mid=(wl+wr)/2,cy=(bt+tp)/2;for(const [l,r,lo,hi]of[[wl,wr,bt,bt+f],[wl,wr,tp-f,tp],[wl,wl+f,bt+f,tp-f],[wr-f,wr,bt+f,tp-f],[mid-.025,mid+.025,bt+f,tp-f]])face('frame',l,r,lo,hi);for(const [l,r]of[[wl+f,mid-.025],[mid+.025,wr-f]]){if(near){face('glass',l,r,bt+f,cy-.025);face('frame',l,r,cy-.025,cy+.025);face('glass',l,r,cy+.025,tp-f);}else face('glass',l,r,bt+f,tp-f);}}

 if(index<3){ // Real notched parapet wall: openings remain above the lower continuous sill.
 const count=Math.max(1,Math.round(len/(near?.7:1.1))),step=len/count;for(let j=0;j<count*2;j++){const l=j*step/2,r=(j+1)*step/2,y=t.hi,h=j%2===0?.40:.17;face('stone',l,r,y,y+h);quad('stone',P(l,y,.14),P(l,y+h,.14),P(r,y+h,.14),P(r,y,.14));quad('frame',P(l,y+h),P(r,y+h),P(r,y+h,.14),P(l,y+h,.14));if(j>0){const old=(j-1)%2===0?.4:.17;const v=[P(l,y+Math.min(old,h)),P(l,y+Math.max(old,h)),P(l,y+Math.max(old,h),.14),P(l,y+Math.min(old,h),.14)];quad('frame',...(old>h?v.reverse():v));}}
 }
 }
 const next=levels[index+1];roof(next?pc.difference([closed],[[...next.ring,next.ring[0]]]):[[closed]],t.hi);
 }
 // Alternating green copper and pale painted dome gores are geometry, with no image texture.
 for(let i=0;i<8;i++){const g=new THREE.SphereGeometry(1.75,near?4:2,near?6:4,i*Math.PI/4,Math.PI/4,0,Math.PI/2);g.scale(1,1.4/1.75,1);put(g,i%2?'trim':'frame',0,12,0);}
 cyl('metal',0,13.4,0,.035,.035,2.44,6);

 return finish();
}
