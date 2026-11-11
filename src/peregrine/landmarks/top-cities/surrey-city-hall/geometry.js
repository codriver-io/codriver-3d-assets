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
 const inv=([x,y,z])=>[Math.cos(SPEC.rotation)*x-Math.sin(SPEC.rotation)*z,y,Math.sin(SPEC.rotation)*x+Math.cos(SPEC.rotation)*z],Q=(m,...p)=>quad(m,...p.map(inv));
 const rings=FOOTPRINTS.map(r=>r.slice(0,-1).map(([lng,lat])=>[(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),-(lat-SPEC.origin[1])*111320]));
 const main=rings[6],roofPlan=rings[2].map(([x,z])=>[x+(x>54?4:x< -53?-3:0),z+(z< -25?-6.2:0)]),roofY=x=>28.8-.02*Math.abs(x-17);
 const clip=(p,x,less)=>{const out=[];for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],ia=less?a[0]<=x:a[0]>=x,ic=less?c[0]<=x:c[0]>=x;if(ia)out.push(a);if(ia!==ic){const t=(x-a[0])/(c[0]-a[0]);out.push([x,a[1]+(c[1]-a[1])*t]);}}return out;};
 const surface=(m,p,Y,down=false)=>{if(p.length<3)return;const g=new THREE.ShapeGeometry(new THREE.Shape(p.map(([x,z])=>new THREE.Vector2(x,-z))));const pos=g.getAttribute('position');for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=-pos.getY(i);pos.setXYZ(i,...inv([x,typeof Y==='function'?Y(x,z):Y,z]));}if(down)g.setIndex(Array.from(g.index.array).reduce((o,v,i,a)=>i%3===0?[...o,a[i],a[i+2],a[i+1]]:o,[]));g.computeVertexNormals();b.put(g,m);};
 const signed=p=>Math.sign(p.reduce((s,a,i)=>{const c=p[(i+1)%p.length];return s+a[0]*c[1]-c[0]*a[1];},0));
 const patch=(m,A,C,u,U,y,Y,sign)=>{const P=(t,v)=>[A[0]+(C[0]-A[0])*t,v,A[1]+(C[1]-A[1])*t],p=[P(u,y),P(u,Y),P(U,Y),P(U,y)];Q(m,...(sign>0?p:p.reverse()));};
 const skin=(A,C,lo,hi,rows,sign,office=true)=>{const len=Math.hypot(C[0]-A[0],C[1]-A[1]),cols=Math.max(1,Math.ceil(len/(office?(near?2.8:5.0):(near?1.7:3.3))));for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const a=i/cols,c=(i+1)/cols,f=Math.min(.06,.10/Math.max(1,len)),l=a+f,r=c-f,bt=lo+(hi-lo)*j/rows,tp=lo+(hi-lo)*(j+1)/rows,bty=bt+.12,tpy=tp-(office?.25:.12);for(const [u,y,U,Y,m]of[[a,bt,c,bty,office?'mullion':'core'],[a,tpy,c,tp,office?'frit':'core'],[a,bty,l,tpy,office?'mullion':'core'],[r,bty,c,tpy,office?'mullion':'core']])patch(m,A,C,u,U,y,Y,sign);if(office){const mid=l+(r-l)*.22;patch('frit',A,C,l,mid,bty,tpy,sign);patch('glass',A,C,mid,r,bty,tpy,sign);}else patch(((A[1]+C[1])/2>5&&(A[0]+C[0])/2>29.5)?'soffit':'atrium',A,C,l,r,bty,tpy,sign);}};
 const clerestory=(A,C,lo,sign)=>{const len=Math.hypot(C[0]-A[0],C[1]-A[1]),n=Math.max(1,Math.ceil(len/(near?2.8:5))),ts=Array.from({length:n+1},(_,i)=>i/n),f=(17-A[0])/(C[0]-A[0]);if(f>0&&f<1)ts.push(f);ts.sort((a,c)=>a-c);const P=(t,y)=>[A[0]+(C[0]-A[0])*t,y,A[1]+(C[1]-A[1])*t];for(let i=0;i<ts.length-1;i++){const a=ts[i],c=ts[i+1],h0=roofY(P(a,0)[0])-.32,h1=roofY(P(c,0)[0])-.32,l=a+Math.min(.02,(c-a)*.1),r=c-Math.min(.02,(c-a)*.1);const face=(m,u,U,y0,y1,Y0,Y1)=>{const p=[P(u,y0),P(u,Y0),P(U,Y1),P(U,y1)];Q(m,...(sign>0?p:p.reverse()));};const hh=t=>roofY(P(t,0)[0])-.32;face('mullion',a,l,lo,lo,hh(a),hh(l));face('mullion',r,c,lo,lo,hh(r),hh(c));face('glow',l,r,lo,lo,hh(l),hh(r));}};
 const left=clip(main,15.8,true),right=clip(main,32.8,false),atrium=clip(clip(main,15.8,false),32.8,true),core=clip(right,40,false),overhang=clip(right,40,true);
 for(const [p,lo,rows,office]of[[left,0,6,true],[right,9.2,4,true],[atrium,0,6,false]]){const sign=signed(p);for(let i=0;i<p.length;i++){const A=p[i],C=p[(i+1)%p.length];if([15.8,32.8].some(x=>Math.abs(A[0]-x)<.002&&Math.abs(C[0]-x)<.002))continue;skin(A,C,lo,25.4,rows,sign,office);clerestory(A,C,25.4,sign);}}
 // Grounded dark service core supports the upper right wing; the seven-metre west cantilever remains open.
 for(let i=0;i<core.length;i++){const A=core[i],C=core[(i+1)%core.length];patch('core',A,C,0,1,0,9.2,signed(core));}surface('soffit',overhang,9.2,true);
 // One-storey glazed entry/lobby returns are actual mapped building parts, not a surrounding plaza.
 const pavilions=[rings[1],rings[5]],onSegment=(p,a,c)=>{const dx=c[0]-a[0],dz=c[1]-a[1],t=((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz);return t>=0&&t<=1&&Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz)<.02;};
 for(const p of pavilions){for(let i=0;i<p.length;i++){const A=p[i],C=p[(i+1)%p.length],mid=[(A[0]+C[0])/2,(A[1]+C[1])/2];if(pavilions.some(q=>q!==p&&q.some((a,j)=>onSegment(mid,a,q[(j+1)%q.length]))))continue;skin(A,C,0,4.2,1,signed(p),false);}surface('roof',p,4.2);}
 // Mapped five-storey north facade projections are fritted glass, supported at their ends and attached to the office floors.
 for(const p of [rings[3],rings[4]]){for(let i=0;i<p.length;i++){const A=p[i],C=p[(i+1)%p.length],len=Math.hypot(C[0]-A[0],C[1]-A[1]);if(len<3)patch('core',A,C,0,1,0,23.8,signed(p));else skin(A,C,4.5,23.8,5,signed(p),true);}surface('roof',p,23.8);surface('soffit',p,4.5,true);}
 // The great roof folds at x=17, projects beyond the glazing, and has a continuous cedar soffit.
 for(const p of [clip(roofPlan,17,true),clip(roofPlan,17,false)]){surface('roof',p,x=>roofY(x));surface('soffit',p,x=>roofY(x)-.32,true);}
 for(let i=0;i<roofPlan.length;i++){const A=roofPlan[i],C=roofPlan[(i+1)%roofPlan.length],pts=[A],t=(17-A[0])/(C[0]-A[0]);if(t>0&&t<1)pts.push([17,A[1]+(C[1]-A[1])*t]);pts.push(C);for(let j=0;j<pts.length-1;j++){const a=pts[j],c=pts[j+1],p=[[a[0],roofY(a[0])-.32,a[1]],[a[0],roofY(a[0]),a[1]],[c[0],roofY(c[0]),c[1]],[c[0],roofY(c[0])-.32,c[1]]];Q('roof',...(signed(roofPlan)>0?p:p.reverse()));}}
 // No plaza is authored: just the atrium's own low interior foundation surface.
 surface('core',atrium,.18);

 return finish();
}
