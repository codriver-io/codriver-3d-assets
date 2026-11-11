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
 // Mapped full envelope includes the pedestrian concourse; author the hall and its access separately.
 const ca=Math.cos(SPEC.rotation),sa=Math.sin(SPEC.rotation),k=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
 const plan=FOOTPRINTS[0].slice(0,-1).map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*k,z=-(lat-SPEC.origin[1])*111320;return[ca*x-sa*z,sa*x+ca*z];});
 const clip=(poly,axis,limit,keepGreater)=>{const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length],A=keepGreater?a[axis]>=limit-1e-9:a[axis]<=limit+1e-9,C=keepGreater?c[axis]>=limit-1e-9:c[axis]<=limit+1e-9;if(A)out.push(a);if(A!==C){const t=(limit-a[axis])/(c[axis]-a[axis]);out.push(a.map((x,j)=>x+t*(c[j]-x)));}}return out;};
 const hall=clip(plan,0,-10,true),cz=-10.9,roofW=56.08;
 const boundsAt=z=>{const xs=[];for(let i=0;i<hall.length;i++){const a=hall[i],c=hall[(i+1)%hall.length];if((a[1]<=z&&c[1]>z)||(c[1]<=z&&a[1]>z))xs.push(a[0]+(c[0]-a[0])*(z-a[1])/(c[1]-a[1]));}return[Math.min(...xs),Math.max(...xs)];};
 const surface=(s,t)=>{const z=cz+s*roofW/2,[a,c]=boundsAt(z),height=24.4+(H-24.4)*t;return[a+(c-a)*t,1.5+(height-1.5)*(1-s*s),z];};
 const breaks=[...new Set(hall.map(p=>(p[1]-cz)/(roofW/2)).filter(s=>s>-1&&s<1))].sort((a,b)=>a-b);
 const floorShape=new THREE.Shape(hall.map(([x,z])=>new THREE.Vector2(x,-z))),floorGeo=new THREE.ExtrudeGeometry(floorShape,{depth:.18,bevelEnabled:false});floorGeo.rotateX(-Math.PI/2);b.put(floorGeo,'stone');
 // Diamond cells partition the surface into steel borders and inflated ETFE pillows.
 const ds=near?.065:.13,dt=near?.06:.12;
 for(let a=-20;a<30;a++)for(let c=-20;c<30;c++){
  let poly=[[a,c],[a+1,c],[a+1,c+1],[a,c+1]].map(([u,v])=>[(u-v)*ds,(u+v)*dt]);
  for(const [axis,value,greater]of [[0,-1,true],[0,1,false],[1,0,true],[1,1,false]])if(poly.length)poly=clip(poly,axis,value,greater);
  {const dense=[];for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length];dense.push(a);if(Math.abs(a[1]-c[1])<1e-8&&(Math.abs(a[1])<1e-8||Math.abs(a[1]-1)<1e-8)){const mid=breaks.filter(s=>s>Math.min(a[0],c[0])+1e-8&&s<Math.max(a[0],c[0])-1e-8);if(c[0]<a[0])mid.reverse();for(const s of mid)dense.push([s,a[1]]);}}poly=dense;}
  poly=poly.filter((p,i)=>!i||Math.hypot(p[0]-poly[i-1][0],p[1]-poly[i-1][1])>1e-8);if(poly.length>2&&Math.hypot(poly[0][0]-poly.at(-1)[0],poly[0][1]-poly.at(-1)[1])<1e-8)poly.pop();
  const area=poly.reduce((a,p,i)=>{const c=poly[(i+1)%poly.length];return a+p[0]*c[1]-c[0]*p[1]},0);if(poly.length<3||Math.abs(area)<1e-8)continue;
  const centre=poly.reduce((sum,p,i)=>{const c=poly[(i+1)%poly.length],k=p[0]*c[1]-c[0]*p[1];return[sum[0]+(p[0]+c[0])*k/(3*area),sum[1]+(p[1]+c[1])*k/(3*area)]},[0,0]),inner=poly.map(p=>p.map((v,i)=>centre[i]+(v-centre[i])*(near?.94:.90))),mid=surface(...centre);mid[1]=Math.min(H-.01,mid[1]+(near?.24:.12));
  for(let i=0;i<poly.length;i++){const n=(i+1)%poly.length;quad('steel',surface(...poly[i]),surface(...poly[n]),surface(...inner[n]),surface(...inner[i]));
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...mid,...surface(...inner[i]),...surface(...inner[n])],3));g.setIndex([0,1,2]);g.computeVertexNormals();b.put(g,'glow');}
 }
 // Low rigid edge plinths carry the shell's ground-level springs.
 for(const s of [-1,1]){const a=surface(s,0),c=surface(s,1);box('stone',(a[0]+c[0])/2,.75,a[2],c[0]-a[0],1.5,.8);}
 const joints=[];
 for(const t of [0,1]){
  const sign=t?1:-1,hh=t?H:24.4,steps=near?48:24,pts=[],samples=[...new Set([...Array.from({length:steps+1},(_,i)=>-1+2*i/steps),...breaks])].sort((a,b)=>a-b);
  for(const s of samples){const p=surface(s,t);pts.push([-p[2],p[1]]);}
  for(const s of [...samples].reverse()){const p=surface(s,t);pts.push([-p[2],p[1]-.65]);}
  const g=new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(p=>new THREE.Vector2(...p))),{depth:1.4,bevelEnabled:false});
  const p=g.attributes.position;for(let i=0;i<p.count;i++){const z=-p.getX(i),s=(z-cz)/(roofW/2),q=surface(s,t);p.setXYZ(i,q[0]+sign*(p.getZ(i)-.7),p.getY(i),z);}
  if(sign<0){const idx=g.index;if(idx){for(let i=0;i<idx.count;i+=3){let v=idx.getX(i+1);idx.setX(i+1,idx.getX(i+2));idx.setX(i+2,v);}}else{const raw=p.array;for(let i=0;i<p.count;i+=3)for(let j=0;j<3;j++){const v=raw[(i+1)*3+j];raw[(i+1)*3+j]=raw[(i+2)*3+j];raw[(i+2)*3+j]=v;}}}
  g.computeVertexNormals();b.put(g,'steel');
  // Closed bowed curtain wall; the pale framing remains in far detail.
  for(let i=0;i<(near?32:16);i++){
   const s0=-1+2*i/(near?32:16),s1=-1+2*(i+1)/(near?32:16),a=surface(s0,t),c=surface(s1,t);
   for(let j=0;j<4;j++){const lo=j/4,hi=(j+1)/4,A=[a[0],.18+(a[1]-.83)*lo,a[2]],B=[a[0],.18+(a[1]-.83)*hi,a[2]],C=[c[0],.18+(c[1]-.83)*hi,c[2]],D=[c[0],.18+(c[1]-.83)*lo,c[2]];if(t)quad('glass',A,B,C,D);else quad('glass',D,C,B,A);}
  }
  for(const s of (near?[-.9,-.8,-.7,-.6,-.5,-.4,-.3,-.2,-.1,0,.1,.2,.3,.4,.5,.6,.7,.8,.9]:[-.75,-.5,-.25,0,.25,.5,.75])){
   const p=surface(s,t),top=p[1]-.65,bot=.18;box('frame',p[0],(top+bot)/2,p[2],1.1,top-bot,.16);joints.push({label:'portal mullion foot',point:[p[0],bot,p[2]],support:'stone',member:'frame',free:[p[0],bot+1.2,p[2]]},{label:'portal mullion crown',point:[p[0],top,p[2]],support:'steel',member:'frame',free:[p[0],top-2,p[2]]});
  }
  for(let y=4;y<hh-3;y+=near?4:6){const smax=Math.sqrt(1-(y+.65-1.5)/(hh-1.5)),N=near?16:8,ps=[];for(let i=0;i<=N;i++){const q=surface(-smax+2*smax*i/N,t);ps.push([q[0],y,q[2]]);}for(let i=0;i<N;i++){const a=ps[i],c=ps[i+1],dx=c[0]-a[0],dz=c[2]-a[2];b.box('frame',[(a[0]+c[0])/2,y,(a[2]+c[2])/2],[Math.hypot(dx,dz),.16,1.1],-Math.atan2(dz,dx));}
   for(const [p,f]of [[ps[0],ps[1]],[ps.at(-1),ps.at(-2)]])joints.push({label:'curved transom terminal',point:p,support:'steel',member:'frame',free:p.map((v,i)=>v+(f[i]-v)*Math.min(1,2/Math.hypot(f[0]-p[0],f[2]-p[2])))});
  }
 }
 // The mapped covered skywalk is complete, with its distant end supported down to y=0.
 const sx=-87.5,ex=-9,zc=-4.2;
 const stem=clip(clip(plan,0,sx,true),0,ex,false),platform=clip(clip(hall,0,-9,true),0,-4,false);
 const slab=(poly,y,h,mat)=>{const shape=new THREE.Shape(poly.map(([x,z])=>new THREE.Vector2(x,-z))),g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);put(g,mat,0,y,0);};
 slab(stem,6.9,.4,'deck');
 for(const z of [zc-3.9,zc+3.9])wall('stone',(sx+ex)/2,7.3,z,ex-sx,1.85,z>zc?0:2,near?22:14,1);
 slab(stem,9.15,.25,'steel');
 for(const x of [-87,-62,-38,-14])cyl('stone',x,0,zc,.65,.65,7.1,near?8:6);
 slab(platform,6.9,.4,'stone');cyl('stone',-6.5,0,zc,.7,.7,6.9,near?8:6);
 for(const x of [-81.3,-61.1])block('stone',x,0,-11.25,4.1,9.15,6.3,2,3,null);
 // Small mapped side access projections are exterior volumes, not a paved plaza.
 block('stone',60,0,19.3,9,3.2,3.0,3,1,'steel');block('stone',58,0,-40,9,3.2,2.0,3,1,'steel');
 joints.push({label:'skywalk distant terminal',point:[sx,7.1,zc],support:'stone',member:'deck',free:[sx+2,7.1,zc]},{label:'skywalk hall terminal',point:[ex,7.1,zc],support:'stone',member:'deck',free:[ex-2,7.1,zc]});
 Object.defineProperty(b.root.userData,'contacts',{value:joints,enumerable:false});

 return finish();
}
