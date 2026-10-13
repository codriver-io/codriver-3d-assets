import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Frontage along mapped NE edge (37 degrees); outward normal faces Grand
// Avenue, SE (127 degrees). Rotation is baked into every vertex exactly once.
export const toWorld = ([x,y,z]) => [.6*x+.8*z,y,-.8*x+.6*z];
export const toLocal = ([x,y,z]) => [.6*x-.8*z,y,.8*x+.6*z];
const mapped = ring => ring.slice(0,-1).map(([lng,lat])=>toLocal([(lng-SPEC.origin[0])*111320*Math.cos(SPEC.origin[1]*Math.PI/180),0,(SPEC.origin[1]-lat)*111320]));

const envelope = mapped(FOOTPRINTS[0]);
// Small mapped notches constrain roof overhangs as well as their footings.
// Project outside shell samples to the closest owned outline segment; use a
// 0.1 m inset to keep normal seams inside the provider replacement envelope.
function fit(p) {
  let inside=false,closest=null,best=Infinity;
  for(let i=0,j=envelope.length-1;i<envelope.length;j=i++){
    const a=envelope[j],c=envelope[i],dx=c[0]-a[0],dz=c[2]-a[2];
    if((a[2]>p[2])!==(c[2]>p[2])&&p[0]<(c[0]-a[0])*(p[2]-a[2])/(c[2]-a[2])+a[0])inside=!inside;
    const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[2]-a[2])*dz)/(dx*dx+dz*dz||1)));
    const q=[a[0]+t*dx,p[1],a[2]+t*dz],d=Math.hypot(q[0]-p[0],q[2]-p[2]);
    if(d<best){best=d;closest=q;}
  }
  if(inside)return p;
  return [closest[0]+(10-closest[0])*.001,p[1],closest[2]+(-5-closest[2])*.001];
}

// Each independently editable sail is a closed, doubly curved loft, thick at
// its footing and tapering into a narrow upper edge. No external source mesh.
export const SAILS = [
  {name:'west-high',x:-12,z:-1,w:45,b:3.2,l:36.7,r:27,c:0,bow:8,lean:-3,flare:1.14,depth:8,vbow:1.4,twist:-3},
  {name:'central-high',x:22,z:-12,w:43,b:3.2,l:25,r:35.8,c:.5,bow:8,lean:1,flare:1.2,depth:9,vbow:1.8,twist:3},
  {name:'east-high',x:51,z:-18,w:31,b:3.2,l:29.5,r:24,c:.5,bow:6,lean:2,flare:1.12,depth:8,vbow:.8,twist:-2},
  {name:'grand-ribbon',x:5,z:27,w:68,b:5,l:22,r:14,c:1.5,bow:9,lean:2,flare:.9,depth:8,vbow:1.5,taper:2.1,twist:-2},
  {name:'west-fold',x:-30,z:17,w:24,b:3.2,l:25,r:16,c:-1,bow:7,lean:1,flare:1.1,depth:6,vbow:2},
  {name:'entry-fold',x:30,z:23,w:21,b:3.2,l:25,r:12,c:-2,bow:-4,lean:2,flare:.95,depth:5,vbow:2},
  {name:'east-scroll',x:58,z:25,w:23,b:3.2,l:19,r:21,c:2,bow:9,lean:3,flare:1,depth:8,vbow:4},
  {name:'east-low',x:73,z:4,w:19,b:3.2,l:14.5,r:13,c:1,bow:5,lean:1,flare:1,depth:5,vbow:2},
  {name:'hope-rear',x:13,z:-36,w:64,b:3.2,l:22,r:23,c:4,bow:-4,lean:-3,flare:1,depth:-11,vbow:3},
];
export function sailPoint(s,u,v,back=false) {
  // Broad upper faces fan out from the lower fold. Vertical billow is restrained
  // on the three high sails; unequal crest slopes and twist distinguish them.
  const x=s.x+(u-.5)*s.w*(1+(s.flare-1)*v)+s.lean*v*v;
  const h=s.l+(s.r-s.l)*u+s.c*Math.sin(Math.PI*u);
  const bottom=s.b+(s.taper??0)*Math.pow(2*u-1,2);
  const y=bottom+(h-bottom)*v;
  const z=s.z+s.bow*Math.sin(Math.PI*u)*(.65+.35*v)+(s.twist??0)*(u-.5)*v+Math.sign(s.depth)*(s.vbow??2)*Math.sin(Math.PI*v)-(back?s.depth*(1-v)+Math.sign(s.depth)*.65*v:0);
  return [x,y,z];
}
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function surf(fn,nu,nv,mat,flip=false) {
    const pos=[],idx=[];
    for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++)pos.push(...toWorld(fit(fn(i/nu,j/nv))));
    for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){
      const a=j*(nu+1)+i,c=a+1,d=a+nu+2,e=a+nu+1;
      idx.push(...(flip?[a,d,c,a,e,d]:[a,c,d,a,d,e]));
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const clean=[];
    for(let i=0;i<idx.length;i+=3){
      const a=new THREE.Vector3().fromArray(pos,idx[i]*3),c=new THREE.Vector3().fromArray(pos,idx[i+1]*3),d=new THREE.Vector3().fromArray(pos,idx[i+2]*3);
      if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-10)clean.push(...idx.slice(i,i+3));
    }
    g.setIndex(clean);g.computeVertexNormals();b.put(g,mat);
  }
  function prism(ring,bottom,top,mat) {
    const ps=ring.map(p=>new THREE.Vector2(p[0],p[2]));
    const g=new THREE.ExtrudeGeometry(new THREE.Shape(ps),{depth:top-bottom,bevelEnabled:false});
    g.rotateX(Math.PI/2);g.translate(0,top,0);g.rotateY(Math.atan2(.8,.6));b.put(g,mat);
  }
  // A shallow rigid stone plinth follows the complete owned outline.
  // A low grade plinth replaces the former full-height cadastral slab. The
  // occupied stone base sits behind the entrance glazing rather than at its face.
  prism(mapped(FOOTPRINTS[0]),0,.65,'stone');
  prism(mapped(FOOTPRINTS[0]).map(p=>[10+(p[0]-10)*.9,p[1],-5+(p[2]+5)*.78]).map(fit),.65,3.2,'stone');
  const box=(m,p,size)=>b.box(m,toWorld(p),size,Math.atan2(.8,.6));
  box('stone',[-44,8,-23],[12,9.6,40]);
  box('stone',[75,7.2,5],[14,8,14]);
  // Low auditorium roof, curved barrel shoulders behind the sail crests.
  const roof=(u,v)=>[-22+70*u,10.5+2.5*Math.sin(Math.PI*u),-27+45*v];
  const rn=near?22:10;
  surf(roof,rn,2,'steel',true);
  for(const v of [0,1])surf((u,t)=>{const p=roof(u,v);p[1]=3.2+(p[1]-3.2)*t;return p;},rn,1,'steel',v===0);
  for(const u of [0,1])surf((v,t)=>{const p=roof(u,v);p[1]=3.2+(p[1]-3.2)*t;return p;},2,1,'steel',u===1);
  for(const s of SAILS){
    const nu=near?28:12,nv=near?16:6,flip=s.depth<0;
    surf((u,v)=>sailPoint(s,u,v),nu,nv,'steel',flip);
    surf((u,v)=>sailPoint(s,u,v,true),nu,nv,'steel',!flip);
    for(const v of [0,1])surf((u,t)=>{
      const a=sailPoint(s,u,v),c=sailPoint(s,u,v,true);return a.map((q,k)=>q+(c[k]-q)*t);
    },nu,1,'steel',v===1?flip:!flip);
    for(const u of [0,1])surf((v,t)=>{
      const a=sailPoint(s,u,v),c=sailPoint(s,u,v,true);return a.map((q,k)=>q+(c[k]-q)*t);
    },nv,1,'steel',u===0?flip:!flip);
    // Incised panel joints are narrow curved strips. Near is 0.22 m proud
    // with one-way ordering; far drops subpixel seams entirely.
    if(near)for(let row=1;row<15;row++)surf((u,t)=>{
      const p=sailPoint(s,u,(row+t*.025)/15);p[2]+=Math.sign(s.depth)*.22;return p;
    },nu,1,'joint',flip);
  }
  for(let k=0;k<14;k++)box(k%4===0?'glow':'glass',[-24+k*4.25,4.15,31],[3.7,1.7,8]);
  box('frame',[3.5,5.2,35],[61,.4,.55]);
  for(const x of [-26.7,33.7])box('stone',[x,4.2,35],[.6,2.1,.8]);
  for(const [x,z] of [[0,0],[38,-5]])for(let k=0;k<6;k++)box('glass',[x,6+k*3.6,z],[2.7,3,.6]);
  for(let k=0;k<14;k++)box('stone',[-46,(k+1)*.115,9-k*.9],[8,(k+1)*.23,.9]);
  box('glow',[-44,4.6,-2.5],[5,2.8,.5]);
  // Garden amphitheatre canopy and its separate OSM service projections.
  for(let n=1;n<FOOTPRINTS.length;n++){
    const ring=mapped(FOOTPRINTS[n]);
    prism(ring,n===2?0:8,n===2?6:8.5,n===2?'stone':'steel');
    if(n!==2){const c=ring.reduce((a,p)=>a.map((q,i)=>q+p[i]/ring.length),[0,0,0]);box('stone',[c[0],4,c[2]],[2,8,2]);}
  }
  const model=b.finish();model.userData.sails=SAILS.map(s=>s.name);return model;
}
