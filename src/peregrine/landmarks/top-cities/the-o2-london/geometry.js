import*as THREE from'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{PARTS,MASTS}from'./footprint.js';import{kit}from'./the-o2-london-geometry-kit.js';
const COS=Math.cos(SPEC.origin[1]*Math.PI/180),local=([x,y])=>[(x-SPEC.origin[0])*111320*COS,(SPEC.origin[1]-y)*111320],RING=PARTS.find(p=>p.id===4320517).ring.slice(0,-1).map(local);
function radius(t){const dx=Math.cos(t),dz=Math.sin(t);let best=0;for(let i=0;i<RING.length;i++){const a=RING[i],b=RING[(i+1)%RING.length],vx=b[0]-a[0],vz=b[1]-a[1],den=dx*vz-dz*vx;if(Math.abs(den)<1e-8)continue;const d=(a[0]*vz-a[1]*vx)/den,u=(a[0]*dz-a[1]*dx)/den;if(d>=0&&u>=-1e-8&&u<=1+1e-8)best=Math.max(best,d);}return best;}
export function roofHeight(x,z){const t=Math.atan2(z,x),r=Math.hypot(x,z)/radius(t),span=170,rise=42.5,sphere=(span*span+rise*rise)/(2*rise);return 7.5+Math.sqrt(Math.max(0,sphere*sphere-(Math.min(1,r)*span)**2))-Math.sqrt(sphere*sphere-span*span);}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),angles=near?[...new Set(RING.map(p=>(Math.atan2(p[1],p[0])+2*Math.PI)%(2*Math.PI)))].sort((a,c)=>a-c):Array.from({length:72},(_,i)=>i*2*Math.PI/72),n=angles.length,nr=near?12:4,point=(t,f)=>{const r=radius(t)*f,x=r*Math.cos(t),z=r*Math.sin(t);return[x,roofHeight(x,z),z];},edge=[];
 for(let i=0;i<n;i++){const a=angles[i],c=i===n-1?angles[0]+2*Math.PI:angles[i+1],seam=a+(c-a)*.035;for(let j=0;j<nr;j++){const lo=j/nr,hi=(j+1)/nr;for(const[mat,t,u]of(near?[['seam',a,seam],['membrane',seam,c]]:[['membrane',a,c]]))k.face(mat,[point(t,lo),point(u,lo),point(u,hi),point(t,hi)],[0,1,0]);}edge.push([point(a,1)[0],point(a,1)[2]]);
  const A=point(a,1),C=point(c,1),cols=near?Math.max(1,Math.round(Math.hypot(C[0]-A[0],C[2]-A[2])/4)):1;for(let j=0;j<cols;j++){const s=j/cols,t=(j+1)/cols,at=(f,y)=>[A[0]+(C[0]-A[0])*f,y,A[2]+(C[2]-A[2])*f],out=[(A[0]+C[0])/2,0,(A[2]+C[2])/2];k.face('skirt',[at(s,0),at(t,0),at(t,1),at(s,1)],out);for(const[mat,u,v]of[['skirt',s,s+.08/cols],['glass',s+.08/cols,t-.08/cols],['skirt',t-.08/cols,t]])k.face(mat,[at(u,1),at(v,1),at(v,7.5),at(u,7.5)],out);}
 }
 // Ground cap is the hidden underside of the enclosure, never an authored plaza.
 k.cap('skirt',edge,0,false);
 for(const p of PARTS.filter(p=>p.id>=151983290&&p.id<=151983301)){
  const original=p.ring.slice(0,-1).map(local),r=near?original:Array.from({length:8},(_,i)=>original[Math.floor(i*original.length/8)]),sign=Math.sign(k.area(r)),lo=0,hi=p.height;const step=1;
  for(let i=0;i<r.length;i+=step){const a=r[i],c=r[(i+step)%r.length],out=[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])],rows=near?4:2;for(let j=0;j<rows;j++){const y=hi*j/rows,z=hi*(j+1)/rows;k.panel('pod',a,c,y,y+.7,out);k.panel('glass',a,c,y+.7,z,out);}}
  k.cap('pod',r,hi);k.cap('pod',r,0,false);
 }
 const centre=new THREE.TorusGeometry(14.8,.22,4,near?48:24);centre.rotateX(Math.PI/2);centre.translate(0,50.2,0);b.put(centre,'steel');
 for(const p of structureParts(detail))b.put(p.geometry,p.material);
 k.flush();return b.finish();
}
export function structureParts(detail='near'){
 const near=detail==='near',parts=[];
 function bar(name,a,c,w,supports,material='mast',round=false){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),d=B.clone().sub(A),g=round?new THREE.CylinderGeometry(w/2,w/2,d.length(),near?6:3,1,!near):new THREE.BoxGeometry(w,d.length(),w);if(!near&&!round){g.setIndex([...g.index.array.slice(0,12),...g.index.array.slice(24)]);g.clearGroups();}g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());parts.push({name,geometry:g,a,c,supports,material});}
 function cylinder(name,p,r,h,material){const g=new THREE.CylinderGeometry(r,r,h,near?12:4);g.translate(...p);parts.push({name,geometry:g,material});}
 for(const[m,mast]of MASTS.entries()){
  const [x,z]=local(mast.point),dist=Math.hypot(x,z),dx=x/dist,dz=z/dist,n=near?8:4,at=(y,i=0)=>{const t=i*2*Math.PI/n,shift=14*Math.max(0,y-10.4)/89.2;return[x+dx*shift+1.2*Math.cos(t),y,z+dz*shift+1.2*Math.sin(t)];},center=y=>{const shift=14*Math.max(0,y-10.4)/89.2;return[x+dx*shift,y,z+dz*shift];};
  cylinder(`base${m}`,center(10.2),1.55,1.2,'mast');cylinder(`head${m}`,center(99.6),1.55,.8,'mast');
  for(let i=0;i<4;i++){const t=i*Math.PI/2,foot=[x+4*Math.cos(t),.3,z+4*Math.sin(t)],g=new THREE.BoxGeometry(1.6,.6,1.6);g.translate(...foot);parts.push({name:`foot${m}-${i}`,geometry:g,material:'steel'});bar(`pyramid${m}-${i}`,foot,center(10.2),.6,[`foot${m}-${i}`,`base${m}`],'mast',true);}
  for(let i=0;i<n;i++)bar(`chord${m}-${i}`,at(10.4,i),at(99.6,i),near?.323:.42,[`base${m}`,`head${m}`],'mast',true);
  let j=0;for(let y=15;y<99;y+=near?5:22.5){for(let i=0;i<n;i++)bar(`ring${m}-${j}-${i}`,at(y,i),at(y,(i+1)%n),near?.24:.32,[`chord${m}-${i}`,`chord${m}-${(i+1)%n}`],'mast');j++;}
  const count=near?8:4;for(let j=0;j<count;j++){const outer=j<count/2,fan=j%(count/2),delta=(fan-(count/2-1)/2)*(near?.06:.10),t=Math.atan2(z,x)+delta,r=outer?radius(t)*.965:35,px=r*Math.cos(t),pz=r*Math.sin(t),h=roofHeight(px,pz),g=new THREE.OctahedronGeometry(.7,0);g.translate(px,h+.2,pz);parts.push({name:`anchor${m}-${j}`,geometry:g,material:'steel',roofContact:[px,h-.5,pz]});bar(`stay${m}-${j}`,center(99.6),[px,h+.8,pz],near?.10:.15,[`head${m}`,`anchor${m}-${j}`],'steel',true);}
 }
 return parts;
}
