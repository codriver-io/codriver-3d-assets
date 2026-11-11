import polygonClipping from 'polygon-clipping';
import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './moshe-aviv-tower-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const pc=polygonClipping.union([LOCAL_RINGS[0]],[LOCAL_RINGS[1]])[0][0].slice(0,-1);
 prism(pc,0,211,'stone','roof',rows(.7,210.7,near?3.46:10.38,near?2.55:7.6),near?3.2:8,'glass',.56);
 const cx=0,cz=-18.1,N=near?32:16,circle=Array.from({length:N},(_,i)=>[cx+13.4*Math.cos(i*2*Math.PI/N),cz+13.4*Math.sin(i*2*Math.PI/N)]);
 prism(circle,0,230,'frame','roof',rows(.5,229.7,near?3.46:10.38,near?2.9:8.4),near?3:7,'glass',.9);
 prism(LOCAL_RINGS[3],211,233.7,'frame','roof',rows(211.4,233.5,near?3.46:10.38,near?2.8:8.1),near?2.5:5,'glass',.75);
 cyl(cx,cz,11.8,230,233.7,'glass',near?32:20);
 const posts=near?20:12;for(let j=0;j<posts;j++){const a=j*2*Math.PI/posts,x=cx+12.6*Math.cos(a),z=cz+12.6*Math.sin(a);b.bar('posts',[x,230,z],[x,233.7,z],.25,.25);}
 spin([[14.5,233.7],[14.5,234.35],[14,235]],'lamp',cx,cz,near?40:24);
const root=finish();
 {
  const inside=(x,z,r)=>{let v=false;for(let i=0,j=r.length-1;i<r.length;j=i++)if((r[i][1]>z)!==(r[j][1]>z)&&x<(r[j][0]-r[i][0])*(z-r[i][1])/(r[j][1]-r[i][1])+r[i][0])v=!v;return v;},solid=(x,z)=>inside(x,z,pc)||inside(x,z,circle),axis=new THREE.Vector3(0,1,0);
  // Remove only wholly buried lower-wall triangles; preserve all intersecting boundary cells.
  for(const mesh of root.children){const g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,index=g.index.array,keep=[];for(let j=0;j<index.length;j+=3){const ids=[index[j],index[j+1],index[j+2]],hidden=ids.every(k=>{const q=new THREE.Vector3(p.getX(k),p.getY(k),p.getZ(k)).applyAxisAngle(axis,-SPEC.rotationY),v=new THREE.Vector3(n.getX(k),n.getY(k),n.getZ(k)).applyAxisAngle(axis,-SPEC.rotationY);return q.y<210.9&&Math.abs(v.y)<.1&&solid(q.x+v.x*.03,q.z+v.z*.03)&&solid(q.x-v.x*.03,q.z-v.z*.03);});if(!hidden)keep.push(...ids);}g.setIndex(keep);}
  root.userData.triangles=root.children.reduce((s,m)=>s+m.geometry.index.count/3,0);
 }
 return root;
}
