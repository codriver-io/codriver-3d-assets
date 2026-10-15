import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { STADIUM_RING } from './footprint.js';

const TAU = Math.PI * 2, A = 3 * Math.PI / 180, C = Math.cos(A), S = Math.sin(A);
// The mapped north roof's long edge has bearing 93°; rotation is baked into all local components.
export const place = ([x,y,z]) => [x*C-z*S,y,x*S+z*C];
const unplace = ([x,y,z]) => [x*C+z*S,y,-x*S+z*C];
const metres = STADIUM_RING.map(([lon,lat])=>[(lon-SPEC.origin[0])*111319.490793*Math.cos(SPEC.origin[1]*Math.PI/180),(SPEC.origin[1]-lat)*111319.490793]);
export function outerRadius(a) {
 const dx=Math.cos(a),dz=Math.sin(a);let best=Infinity;
 for(let i=0;i<metres.length;i++){
  const p=metres[i],q=metres[(i+1)%metres.length],ex=q[0]-p[0],ez=q[1]-p[1],den=dx*ez-dz*ex;
  if(Math.abs(den)<1e-9)continue;
  const t=(p[0]*ez-p[1]*ex)/den,u=(p[0]*dz-p[1]*dx)/den;
  if(t>0&&u>=0&&u<=1)best=Math.min(best,t);
 }
 return best;
}
// A rounded-rectangle opening, estimated from reference aerials (retractable roof partly open).
export function openingRadius(a) {
 const x=Math.cos(a-A),z=Math.sin(a-A);
 return 1/Math.pow(Math.pow(Math.abs(x)/97,4)+Math.pow(Math.abs(z)/66,4),0.25);
}
export function roofHeight(x,z) {
 const a=Math.atan2(z,x),r=Math.hypot(x,z),ri=openingRadius(a),ro=outerRadius(a)*.992;
 return 48+4*(r-ri)/(ro-ri);
}
export function archNode(i,j,detail='near') {
 const n=detail==='near'?64:32,k=detail==='near'?6:4,t=i/n,u=2*t-1;
 const y=3.7+125.6*(1-u*u),z=-35-(y-3.7)*Math.tan(22*Math.PI/180);
 // Circular cross section perpendicular to the centreline, six/four physical longitudinal chords.
 const tangent=new THREE.Vector3(315,-502.4*u,-(-502.4*u)*Math.tan(22*Math.PI/180)).normalize();
 const n1=new THREE.Vector3(0,Math.sin(22*Math.PI/180),Math.cos(22*Math.PI/180));
 const n2=new THREE.Vector3().crossVectors(tangent,n1).normalize();
 const phi=j*TAU/k;
 const p=new THREE.Vector3(157.5*u,y,z).addScaledVector(n1,(detail==='near'?3.45:2.95)*Math.cos(phi)).addScaledVector(n2,(detail==='near'?3.45:2.95)*Math.sin(phi));
 return place(p.toArray());
}

export function create({ detail='near' }={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),buffers=new Map();
 const contacts=[];
 const tri=(mat,a,c,d,want)=>{
  const n=new THREE.Vector3().crossVectors(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),new THREE.Vector3(...d).sub(new THREE.Vector3(...a)));
  if(n.dot(new THREE.Vector3(...want))<0)[c,d]=[d,c];
  if(!buffers.has(mat))buffers.set(mat,[]);buffers.get(mat).push(...a,...c,...d);
 };
 const quad=(m,a,c,d,e,w)=>{tri(m,a,c,d,w);tri(m,a,d,e,w);};
 const radial=(a,r,y)=>[r*Math.cos(a),y,r*Math.sin(a)];
 const ringFace=(mat,a0,a1,r0,r1,y0,y1)=>quad(mat,radial(a0,r0,y0),radial(a1,r1,y0),radial(a1,r1,y1),radial(a0,r0,y1),[Math.cos((a0+a1)/2),0,Math.sin((a0+a1)/2)]);
 const N=near?128:64;
 // Integrated facade cells: glazing replaces the metal rather than being a coplanar overlay.
 const rows=[0,8,10,20,22,32,34,42,50,52];
 for(let i=0;i<N;i++){
  const a=i*TAU/N,aa=(i+1)*TAU/N,mid=(a+aa)/2,ro=outerRadius(a)*.992,rr=outerRadius(aa)*.992;
  const corner=Math.abs(Math.sin(2*(mid-A)))>.91;
  for(let j=0;j<rows.length-1;j++){
   const y0=rows[j],y1=rows[j+1],glass=corner&&y0>=8&&y1<=42||([10,22,34].includes(y0)&&i%5!==0)||y0===42;
   if(glass&&!corner&&[10,22,34].includes(y0)){
    // Keep a distinct opening per bay in far as well: adjacent cells never become giant strips.
    const aL=a+(aa-a)*.1,aR=a+(aa-a)*.9,rL=ro+(rr-ro)*.1,rR=ro+(rr-ro)*.9;
    ringFace('wall',a,aL,ro,rL,y0,y1);
    ringFace('glass',aL,aR,rL,rR,y0,y1);
    ringFace('wall',aR,aa,rR,rr,y0,y1);
   }else ringFace(glass?'glass':'wall',a,aa,ro,rr,y0,y1);
  }
  // Fixed roof with central negative space and a 1 m deep soffit.
  const ri=openingRadius(a),rj=openingRadius(aa);
  const p=radial(a,ro,52),q=radial(aa,rr,52),r=radial(aa,rj,48),s=radial(a,ri,48);
  quad('roof',p,q,r,s,[0,1,0]);
  quad('dark',p.map((v,k)=>k===1?v-1:v),s.map((v,k)=>k===1?v-1:v),r.map((v,k)=>k===1?v-1:v),q.map((v,k)=>k===1?v-1:v),[0,-1,0]);
  ringFace('steel',a,aa,ri,rj,47,48);
  // Three red seating tiers, with genuine grey concourse gaps, all retained in far.
  const bowlR=(ang,t)=>{
   const xp=Math.cos(ang-A),zp=Math.sin(ang-A),inner=Math.min(59/Math.max(.00001,Math.abs(xp)),40/Math.max(.00001,Math.abs(zp)));
   return inner+(outerRadius(ang)*.91-inner)*t;
  };
  const tiers=[[0,1.2],[.25,12],[.28,13],[.58,26],[.62,27],[1,42]];
  for(let j=0;j<tiers.length-1;j++){
   const [t,y]=tiers[j],[tt,yy]=tiers[j+1];
   quad(j===1||j===3?'dark':'seat',radial(a,bowlR(a,t),y),radial(aa,bowlR(aa,t),y),radial(aa,bowlR(aa,tt),yy),radial(a,bowlR(a,tt),yy),[0,1,0]);
  }
  if(i%(near?2:1)===0){
   const next=(i+(near?2:1))*TAU/N;
   const p0=radial(a,ro+.25,42.2),p1=radial(next,outerRadius(next)*.992+.25,50.4);
   b.bar('steel',p0,p1,.8);
   contacts.push({name:'eave diagonal',a:p0,b:p1,supportA:'facade',supportB:'facade'});
  }
 }
 // Discrete mullions retain the glazed corner tower rhythm at either detail level.
 for(let i=0;i<N;i+=(near?1:2)){
  const a=i*TAU/N,r=outerRadius(a)*.992+.05;
  const p=radial(a,r,8),q=radial(a,r,42);
  b.bar('steel',p,q,near?.25:.4);
  contacts.push({name:'glazing mullion',a:p,b:q,supportA:'facade',supportB:'facade'});
 }
 // Pitch and markings are planar geometry; no texture or photo content.
 const turf=[[-59,1,-40],[59,1,-40],[59,1,40],[-59,1,40]].map(place);quad('turf',...turf,[0,1,0]);
 if(near){
  const line=(x,z,xx,zz)=>{
   const dx=xx-x,dz=zz-z,l=Math.hypot(dx,dz),nx=-dz/l*.11,nz=dx/l*.11;
   quad('paint',...[[x+nx,1.12,z+nz],[xx+nx,1.12,zz+nz],[xx-nx,1.12,zz-nz],[x-nx,1.12,z-nz]].map(place),[0,1,0]);
  };
  for(const q of [[-52.5,-34,52.5,-34],[52.5,-34,52.5,34],[52.5,34,-52.5,34],[-52.5,34,-52.5,-34],[0,-34,0,34]])line(...q);
  for(let i=0;i<32;i++)line(9.15*Math.cos(i*TAU/32),9.15*Math.sin(i*TAU/32),9.15*Math.cos((i+1)*TAU/32),9.15*Math.sin((i+1)*TAU/32));
  for(const s of [-1,1])for(const q of [[52.5,-20.16,36,-20.16],[36,-20.16,36,20.16],[36,20.16,52.5,20.16]])line(q[0]*s,q[1],q[2]*s,q[3]);
 }
 // The iconic tubular SPACE TRUSS: circular hoops, longitudinal chords and crossed helical diagonals.
 const ns=near?64:32,nc=near?6:4;
 const members=[];
 const member=(name,a,c,w,supportA,supportB)=>{
  const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dir=cv.clone().sub(av);
  const g=new THREE.CylinderGeometry(w,w,dir.length(),near?5:4,1,true);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));
  g.translate(...av.add(cv).multiplyScalar(.5).toArray());
  b.put(g,'glow');members.push({name,a,b:c,supportA,supportB,geometry:g});
 };
 for(let i=0;i<=ns;i++)for(let j=0;j<nc;j++){
  const a=archNode(i,j,detail),c=archNode(i,(j+1)%nc,detail);
  member(`hoop-${i}-${j}`,a,c,near?.18:.28,`chord-${j}`,`chord-${(j+1)%nc}`);
  if(i<ns){
   const d=archNode(i+1,j,detail),e=archNode(i+1,(j+1)%nc,detail);
   member(`chord-${i}-${j}`,a,d,near?.25:.75,`hoop-${i}`,`hoop-${i+1}`);
   member(`diagonal-${i}-${j}`,a,e,near?.13:.23,`hoop-${i}`,`hoop-${i+1}`);
  }
 }
 // Abutment blocks enclose all terminal lattice nodes at grade.
 for(const i of [0,ns]){
  const pts=Array.from({length:nc},(_,j)=>archNode(i,j,detail)),box=new THREE.Box3().setFromPoints(pts.map(p=>new THREE.Vector3(...p)));
  const c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3());
  b.box('wall',[c.x,Math.max(7,box.max.y+.5)/2,c.z],[s.x+1.8,Math.max(7,box.max.y+.5),s.z+1.8]);
 }
 // Hangers attach to actual hoop nodes, then terminate on the named roof skin.
 const step=4;
 const roofGeometry=new THREE.BufferGeometry();
 roofGeometry.setAttribute('position',new THREE.Float32BufferAttribute(buffers.get('roof'),3));
 const roofSurface=new THREE.Mesh(roofGeometry,new THREE.MeshBasicMaterial());roofSurface.updateMatrixWorld();
 for(let i=near?12:8;i<=ns-(near?12:8);i+=step)for(const south of [false,true]){
  const start=archNode(i,0,detail),local=unplace(start),end=place([local[0],0,south?102:-108]);
  // Query the authored roof triangles, drawing the corner hangers inward until over the fixed roof.
  let hit=[];
  for(let dz=0;dz<40;dz+=1){
   const q=place([local[0],80,(south?102:-108)+(south?-dz:dz)]);
   hit=new THREE.Raycaster(new THREE.Vector3(...q),new THREE.Vector3(0,-1,0)).intersectObject(roofSurface);
   if(hit.length){end.splice(0,3,...hit[0].point.toArray());break;}
  }
  if(!hit.length)throw new Error('Roof hanger has no roof support');
  b.bar('steel',start,end,near?.14:.2,.2,0,true);
  contacts.push({name:south?'south roof stay':'north roof hanger',a:start,b:end,supportA:`hoop-${i}`,supportB:'roof'});
 }
 roofGeometry.dispose();roofSurface.material.dispose();
 for(const [mat,pos]of buffers){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();b.put(g,mat);}
 const model=b.finish();
 // Named contact fixtures kept non-enumerable so the export does not retain test metadata.
 Object.defineProperty(model.userData,'contacts',{value:contacts});
 Object.defineProperty(model.userData,'archMembers',{value:members});
 return model;
}
