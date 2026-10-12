import * as THREE from 'three';
import {HOUSES} from './cite-de-carcassonne-houses.js';
import {FAR_BLOCKS} from './cite-de-carcassonne-far-blocks.js';
import {inside} from './cite-de-carcassonne-kit.js';

const SX=111319.490793*Math.cos(43.20633*Math.PI/180),SZ=111319.490793;
export const localRing=ring=>ring.map(([lng,lat])=>[(lng-2.36405)*SX,-(lat-43.20633)*SZ]);

// The gateway archetypes and their existing ownership envelopes stay unchanged.
export const GATE_FOOTPRINTS = [[119.036,-70.376],[111.964,-50.824]].map(([x,z])=>Array.from({length:20},(_,i)=>{const a=i*Math.PI/10;return [2.36405+(x+9.03*Math.cos(a))/SX,43.20633-(z+9.03*Math.sin(a))/SZ];}));

// Remove collinear cadastral nodes without substituting rectangular plans.
function clean(r,tolerance){
 r=r.filter((p,i)=>!i||Math.hypot(p[0]-r[i-1][0],p[1]-r[i-1][1])>.01);
 let changed=true;
 while(changed&&r.length>3){changed=false;for(let i=0;i<r.length;i++){
  const a=r[(i+r.length-1)%r.length],b=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz),u=((b[0]-a[0])*dx+(b[1]-a[1])*dz)/(length*length);
  if(u>=0&&u<=1&&Math.abs((b[0]-a[0])*dz-(b[1]-a[1])*dx)/length<tolerance){r.splice(i,1);changed=true;break;}
 }}
 return r;
}
const signedArea=r=>r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-b[0]*a[1];},0)/2;

export function houseForm(h,near=true){
 const ring=clean(localRing(h.ring),near?.025:1.2),holes=(h.holes||[]).map(r=>clean(localRing(r),near?.025:1.2));
 // Minimum-area oriented envelope gives the longest plan axis, including L
 // shapes. Roof surfaces are clipped to each ring and its courtyard holes.
 let envelope;
 for(let i=0;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length],length=Math.hypot(b[0]-a[0],b[1]-a[1]),t=[(b[0]-a[0])/length,(b[1]-a[1])/length],n=[-t[1],t[0]],uv=ring.map(p=>[p[0]*t[0]+p[1]*t[1],p[0]*n[0]+p[1]*n[1]]),u0=Math.min(...uv.map(p=>p[0])),u1=Math.max(...uv.map(p=>p[0])),v0=Math.min(...uv.map(p=>p[1])),v1=Math.max(...uv.map(p=>p[1]));
  const area=(u1-u0)*(v1-v0);
  if(!envelope||area<envelope.area)envelope={area,t,n,u0,u1,v0,v1};
 }
 let {t,n,u0,u1,v0,v1}=envelope;
 if(u1-u0<v1-v0){[t,n]=[n,[-t[0],-t[1]]];[u0,u1,v0,v1]=[v0,v1,-u1,-u0];}
 const width=v1-v0,length=u1-u0,hipped=length/width<1.55;
 const rise=h.roofHeight||Math.max(1.4,Math.min(3.4,width*.32));
 const eave=h.eave??(Number.isFinite(h.levels)?h.levels*3+.5:Number.isFinite(h.height)?Math.max(2,h.height-rise):7+(h.id%13)/4);
 const uv=p=>[p[0]*t[0]+p[1]*t[1],p[0]*n[0]+p[1]*n[1]];
 const fromUV=p=>[p[0]*t[0]+p[1]*n[0],p[0]*t[1]+p[1]*n[1]];
 const scale=rise/(width/2),planes=[[0,scale,-v0*scale],[0,-scale,v1*scale]];
 if(hipped)planes.push([scale,0,-u0*scale],[-scale,0,u1*scale]);
 const roofHeight=p=>eave+Math.max(0,Math.min(...planes.map(([a,b,c])=>a*p[0]+b*p[1]+c)));
 return {ring,holes,eave,rise,t,uv,fromUV,planes,roofHeight,hipped,material:h.material||['tile','tileDark','tilePale'][h.id%3]};
}

function clip(poly,a,b,c){
 const out=[];
 for(let i=0;i<poly.length;i++){
  const p=poly[i],q=poly[(i+1)%poly.length],dp=a*p[0]+b*p[1]+c,dq=a*q[0]+b*q[1]+c,pi=dp>=-1e-8,qi=dq>=-1e-8;
  if(pi)out.push(p);
  if(pi!==qi){const u=dp/(dp-dq);out.push([p[0]+u*(q[0]-p[0]),p[1]+u*(q[1]-p[1])]);}
 }
 return clean(out,.00001);
}
function roof(k,f){
 const r=f.ring.map(f.uv),holes=f.holes.map(r=>r.map(f.uv));
 const at=p=>{const q=f.fromUV(p);return [q[0],f.roofHeight(p),q[1]];};
 const triangulate=(r,holes=[])=>THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),holes.map(r=>r.map(p=>new THREE.Vector2(...p))));
 // Courtyards use hole-aware initial triangles. Simple houses clip complete
 // plane regions to avoid needless triangle seams on each roof slope.
 const initial=()=>triangulate(r,holes).map(face=>face.map(i=>r.concat(...holes)[i]));
 const surfaces=polys=>polys.flatMap(poly=>f.planes.flatMap(plane=>{
  let cell=poly;
  for(const other of f.planes){if(other===plane)continue;cell=clip(cell,other[0]-plane[0],other[1]-plane[1],other[2]-plane[2]);if(cell.length<3)break;}
  return cell.length<3?[]:triangulate(cell).map(face=>face.map(i=>cell[i]));
 }));
 const area=tri=>Math.abs(signedArea(tri));
 let faces=surfaces(holes.length?initial():[r]).filter(t=>area(t)>1e-8);
 // Concave clipping can yield disconnected components. Audit the fast region
 // mesh before allowing Earcut to bridge a street-facing recess; fall back to
 // clipping its initial triangles when area or containment differs.
 const expected=Math.abs(signedArea(r))-holes.reduce((s,r)=>s+Math.abs(signedArea(r)),0);
 if(Math.abs(faces.reduce((s,t)=>s+area(t),0)-expected)>.00001||faces.some(t=>!inside(t.reduce((s,p)=>[s[0]+p[0]/3,s[1]+p[1]/3],[0,0]),r)))faces=surfaces(initial()).filter(t=>area(t)>1e-8);
 for(const face of faces)k.tri(f.material,...face.map(at),[0,1,0]);
}

export function buildHouses(k,near,setOffset,base){
 const houses=near?HOUSES:FAR_BLOCKS,forms=houses.map(h=>houseForm(h,near));
 // Shared party walls are internal. Split edges at neighbouring cadastral
 // nodes and keep exposed portions where eaves or world terraces differ.
 const edges=forms.flatMap((f,house)=>[f.ring,...f.holes].flatMap((r,ri)=>r.map((a,i)=>{
  const b=r[(i+1)%r.length],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),sign=Math.sign(signedArea(r))*(ri?-1:1);
  return {house,a,b,length,t:[dx/length,dz/length],normal:[sign*dz/length,0,-sign*dx/length]};
 })));
 for(const [i,f] of forms.entries()){
  const h=houses[i];setOffset(h.offsetM,h.footingDepth);roof(k,f);
  for(const e of edges.filter(e=>e.house===i)){
   const neighbourEdges=edges.filter(q=>q.house!==i&&e.normal[0]*q.normal[0]+e.normal[2]*q.normal[2]<-.99&&Math.abs((q.a[0]-e.a[0])*e.t[1]-(q.a[1]-e.a[1])*e.t[0])<.04&&Math.abs((q.b[0]-e.a[0])*e.t[1]-(q.b[1]-e.a[1])*e.t[0])<.04);
   const intervals=neighbourEdges.map(q=>({house:q.house,u0:Math.max(0,Math.min(...[q.a,q.b].map(p=>(p[0]-e.a[0])*e.t[0]+(p[1]-e.a[1])*e.t[1]))),u1:Math.min(e.length,Math.max(...[q.a,q.b].map(p=>(p[0]-e.a[0])*e.t[0]+(p[1]-e.a[1])*e.t[1])))})).filter(q=>q.u1-q.u0>.04);
   const cuts=[0,e.length,...intervals.flatMap(q=>[q.u0,q.u1])].sort((a,b)=>a-b);
   const uv0=f.uv(e.a),uv1=f.uv(e.b);
   // Break wall tops at every roof-plane join to support gables and hips.
   for(let a=0;a<f.planes.length;a++)for(let b=a+1;b<f.planes.length;b++){
    const p=f.planes[a],q=f.planes[b],value=u=>(p[0]-q[0])*(uv0[0]+u*(uv1[0]-uv0[0]))+(p[1]-q[1])*(uv0[1]+u*(uv1[1]-uv0[1]))+p[2]-q[2],d0=value(0),d1=value(1);
    if(d0*d1<0){const u=d0/(d0-d1),v=[uv0[0]+u*(uv1[0]-uv0[0]),uv0[1]+u*(uv1[1]-uv0[1])],height=p[0]*v[0]+p[1]*v[1]+p[2];if(height<=f.roofHeight(v)-f.eave+.00001)cuts.push(e.length*u);}
   }
   cuts.sort((a,b)=>a-b);
   if(!near&&!intervals.length){
    const top=cuts.slice().reverse().map(u=>{const p=[e.a[0]+e.t[0]*u,e.a[1]+e.t[1]*u];return [p[0],f.roofHeight(f.uv(p)),p[1]];});
    const poly=[[e.a[0],base,e.a[1]],[e.b[0],base,e.b[1]],...top];
    for(let j=1;j<poly.length-1;j++)k.tri('stone',poly[0],poly[j],poly[j+1],e.normal);
    continue;
   }
   for(let j=0;j<cuts.length-1;j++){
    const u0=cuts[j],u1=cuts[j+1];if(u1-u0<.001)continue;
    const p=[e.a[0]+e.t[0]*u0,e.a[1]+e.t[1]*u0],q=[e.a[0]+e.t[0]*u1,e.a[1]+e.t[1]*u1],mid=(u0+u1)/2;
    if(!near&&intervals.some(n=>mid>=n.u0-.001&&mid<=n.u1+.001))continue;
    const cap=Math.max(base,...intervals.filter(n=>mid>=n.u0-.001&&mid<=n.u1+.001).map(n=>forms[n.house].eave+Math.min(0,houses[n.house].offsetM-h.offsetM)));
    const top0=f.roofHeight(f.uv(p)),top1=f.roofHeight(f.uv(q));
    if(cap>=Math.max(top0,top1)-.001)continue;
    k.quad('stone',[p[0],Math.min(cap,top0),p[1]],[q[0],Math.min(cap,top1),q[1]],[q[0],top1,q[1]],[p[0],top0,p[1]],e.normal);
   }
  }
 }
}
