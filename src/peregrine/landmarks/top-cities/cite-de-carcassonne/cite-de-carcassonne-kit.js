import * as THREE from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Original compact surface kit. All faces get outward winding from an explicit normal.
export function meshKit(builder) {
  const batch = new Map();
  function tri(mat,a,b,c,n) {
    const normal=new THREE.Vector3().subVectors(new THREE.Vector3(...b),new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...c),new THREE.Vector3(...a)));
    if(normal.lengthSq()<1e-10)return;
    if(normal.dot(new THREE.Vector3(...n))<0)[b,c]=[c,b];
    if(!batch.has(mat))batch.set(mat,[]);batch.get(mat).push(...a,...b,...c);
  }
  const quad=(m,a,b,c,d,n)=>{tri(m,a,b,c,n);tri(m,a,c,d,n);};
  function prism(ring,lo,hi,mat,sideMaterial=null) {
    const area=ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0),sign=Math.sign(area);
    for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1];quad(sideMaterial?sideMaterial(a,c,[sign*dz,0,-sign*dx]):mat,[a[0],lo,a[1]],[c[0],lo,c[1]],[c[0],hi,c[1]],[a[0],hi,a[1]],[sign*dz,0,-sign*dx]);}
    const faces=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]);
    for(const f of faces){tri(mat,...f.map(i=>[ring[i][0],hi,ring[i][1]]),[0,1,0]);tri(mat,...f.map(i=>[ring[i][0],lo,ring[i][1]]),[0,-1,0]);}
  }
  function loft(ring,c,levels,mat) {
    for(let k=0;k<levels.length-1;k++)for(let i=0;i<ring.length;i++){
      const j=(i+1)%ring.length,at=(i,k)=>[c[0]+(ring[i][0]-c[0])*levels[k][1],levels[k][0],c[1]+(ring[i][1]-c[1])*levels[k][1]];
      const a=at(i,k),b=at(j,k),d=at(i,k+1),e=at(j,k+1);quad(mat,a,b,e,d,[(a[0]+b[0])/2-c[0],0.5,(a[2]+b[2])/2-c[1]]);
    }
    const [h,s]=levels.at(-1);if(s>0)prism(ring.map(p=>[c[0]+(p[0]-c[0])*s,c[1]+(p[1]-c[1])*s]),h-0.01,h,mat);
  }
  function panel(mat,c,t,n,w,h,y,offset=0.08){const p=(u,v)=>[c[0]+t[0]*u+n[0]*offset,v,c[1]+t[1]*u+n[1]*offset];quad(mat,p(-w/2,y),p(w/2,y),p(w/2,y+h),p(-w/2,y+h),[n[0],0,n[1]]);}
  function flush(){for(const [mat,p]of batch){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();builder.put(mergeVertices(g,0.0001),mat);g.dispose();}}
  return {tri,quad,prism,loft,panel,flush};
}
export const center=ring=>ring.reduce((s,p)=>[s[0]+p[0]/ring.length,s[1]+p[1]/ring.length],[0,0]);
export function inside(p,ring){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export function simplify(ring,tol=0.45){const out=ring.filter((p,i)=>i===0||Math.hypot(p[0]-ring[i-1][0],p[1]-ring[i-1][1])>0.05);let change=true;while(change&&out.length>8){change=false;for(let i=0;i<out.length;i++){const a=out[(i+out.length-1)%out.length],c=out[(i+1)%out.length],p=out[i],L=Math.hypot(c[0]-a[0],c[1]-a[1]);if(Math.abs((p[0]-a[0])*(c[1]-a[1])-(p[1]-a[1])*(c[0]-a[0]))/L<tol){out.splice(i,1);change=true;break;}}}return out;}
