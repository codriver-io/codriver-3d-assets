import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTLINE } from './st-peters-basilica-plan.js';
import { kit } from './st-peters-basilica-kit.js';
import { facade } from './st-peters-basilica-facade.js';
import { dome } from './st-peters-basilica-dome.js';

// Trim the mapped body behind the genuinely open entrance porch.
function bodyRing(near) {
  const out=[],p=OUTLINE.slice(0,-1);
  for(let i=0;i<p.length;i++) {
    const a=p[i],c=p[(i+1)%p.length],ai=a[0]<121,ci=c[0]<121;
    if(ai)out.push(a);
    if(ai!==ci)out.push([121,a[1]+(c[1]-a[1])*(121-a[0])/(c[0]-a[0])]);
  }
  if(!near) {
    const simple=[];for(const p of out)if(!simple.length||Math.hypot(p[0]-simple.at(-1)[0],p[1]-simple.at(-1)[1])>3)simple.push(p);
    return simple;
  }
  return out;
}
function pitched(k,x0,x1,z,width,eave,ridge) {
  const shape=new THREE.Shape([new THREE.Vector2(-width/2,eave),new THREE.Vector2(width/2,eave),new THREE.Vector2(0,ridge)]);
  const g=new THREE.ExtrudeGeometry(shape,{depth:x1-x0,bevelEnabled:false});
  g.rotateY(Math.PI/2);g.translate(x0,0,z);k.put(g,'roof');
}
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
  const {box,cylinder,lathe,extrude,put,line}=k;
  const ring=bodyRing(near);
  extrude('stone',ring,0,34);
  // Monumental lower-wall pilasters and stacked windows follow each mapped exterior run.
  // OSM winding determines the outward normal, so these are on the wall rather than floating.
  const winding=Math.sign(ring.reduce((v,a,i)=>{const c=ring[(i+1)%ring.length];return v+a[0]*c[1]-c[0]*a[1];},0));
  for(let i=0;i<ring.length;i++) {
    const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
    if(len<7||Math.abs(a[0]-121)<.01&&Math.abs(c[0]-121)<.01)continue;
    const nx=winding*dz/len,nz=-winding*dx/len,angle=Math.atan2(nx,nz),count=Math.max(1,Math.round(len/(near?7.5:12)));
    for(let j=0;j<count;j++) {
      const t=(j+.5)/count,x=a[0]+dx*t,z=a[1]+dz*t;
      for(const [y,w,h] of [[10.8,2.6,6.2],[25,3.2,7.0]]) {
        put(new THREE.PlaneGeometry(w,h).rotateY(angle).translate(x+nx*.13,y,z+nz*.13),'glass');
        if(near)put(new THREE.BoxGeometry(w+.75,.55,.5).rotateY(angle).translate(x+nx*.27,y+h/2+.5,z+nz*.27),'trim');
      }
      const p=j/count;
      put(new THREE.BoxGeometry(1.0,31.5,.45).rotateY(angle).translate(a[0]+dx*p+nx*.2,16,a[1]+dz*p+nz*.2),'trim');
      if(near)for(const y of [3.5,18.7,32.5])put(new THREE.BoxGeometry(len/count,.45,.5).rotateY(angle).translate(x+nx*.24,y,z+nz*.24),'trim');
    }
  }
  // Low roof: a shallow pitched perimeter, interrupted by the raised Latin-cross spine.
  const g=new THREE.BufferGeometry(),pos=[],idx=[];
  for(const [x,z] of ring)pos.push(x,34.1,z);
  for(const [x,z] of ring)pos.push(x*.96,37,z*.96);
  const n=ring.length;
  // Wind the shallow roof outward; OSM ring orientation is normalized below.
  for(let i=0;i<n;i++){const j=(i+1)%n;idx.push(i,j,n+i,j,n+j,n+i);}
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  // Roof includes a closed inner plate; lower shells behind upper blocks are hidden.
  const area=ring.reduce((s,a,i)=>{const c=ring[(i+1)%n];return s+a[0]*c[1]-c[0]*a[1];},0);
  if(area>0){const q=g.index.array;for(let i=0;i<q.length;i+=3)[q[i+1],q[i+2]]=[q[i+2],q[i+1]];g.computeVertexNormals();}
  put(g,'roof');extrude('roof',ring.map(([x,z])=>[x*.96,z*.96]),36.8,37);
  box('stone',72,40.6,0,98,13.2,39.2);
  pitched(k,23,121,0,41.0,47.2,53.3);
  box('stone',-29.5,41.1,0,59,14.2,40);
  pitched(k,-59,0,0,41.0,48.2,54);
  box('stone',0,41.0,0,40,14,122);
  // The north/south transept caps and rounded apses.
  for(const [x,z,r] of [[-59.2,0,18.0],[0,-59.9,17.0],[0,60.5,17.0]]) {
    cylinder('stone',x,z,33.5,47.0,r);
    cylinder('trim',x,z,45.6,47.3,r+.4);
    lathe('roof',x,z,[[r+.35,47.3],[r*.6,50.7],[0,51.5]],near?32:16);
    const a0=x<0?-Math.PI/2:z>0?0:Math.PI;
    for(let i=-3;i<=3;i++) {
      const a=a0+i*Math.PI/9,s=Math.sin(a),c=Math.cos(a);
      box('trim',x+s*(r+.1),39.5,z+c*(r+.1),.7,12.4,.7);
      if(near) {
        put(new THREE.PlaneGeometry(2.5,6.4).rotateY(a).translate(x+s*(r+.16),39.7,z+c*(r+.16)),'glass');
        const lintel=new THREE.BoxGeometry(3.2,.6,.7).rotateY(a).translate(x+s*(r+.3),43.6,z+c*(r+.3));put(lintel,'trim');
      }
    }
  }
  // Nave aisle and clerestory rhythms, on both long sides; off the roof planes.
  for(const s of [-1,1]) {
    for(let x=33;x<=114;x+=near?10.1:20.2) {
      const z=s*19.68;
      put(new THREE.PlaneGeometry(4.6,6.2).rotateY(s>0?0:Math.PI).translate(x,40.0,z),'glass');
      box('trim',x,43.6,z+s*.15,5.6,.65,.55);
      for(const dx of [-3.4,3.4])box('trim',x+dx,40.5,z+s*.17,.65,12.4,.6);
    }
    box('trim',72,46.7,s*20.0,98,.8,.85);
    // The lower chapels' pitched pavilion roofs follow the two mapped front roof parts.
    box('stone',61,41.0,s*37.4,21,14.0,12.2);
    pitched(k,50.5,71.5,s*37.4,13.0,48,54.0);
  }
  // Raised transept arms are roofed only outside the central dome base.
  for(const s of [-1,1]) {
    const shape=new THREE.Shape([new THREE.Vector2(-20,48),new THREE.Vector2(20,48),new THREE.Vector2(0,54)]);
    const roof=new THREE.ExtrudeGeometry(shape,{depth:31,bevelEnabled:false});
    roof.translate(0,0,s>0?29:-60);put(roof,'roof');
  }
  facade(k,near);dome(k,near);
  const model=b.finish();
  let triangles=0;
  model.traverse(o=>{
    if(!o.isMesh)return;
    const g=o.geometry,p=g.attributes.position,ind=g.index.array,kept=[];
    for(let i=0;i<ind.length;i+=3) {
      if([ind[i],ind[i+1],ind[i+2]].every(j=>Math.abs(p.getY(j))<.001))continue;
      kept.push(ind[i],ind[i+1],ind[i+2]);
    }
    g.setIndex(kept);
    // Preserve hard normals while welding duplicates; never smooth column capitals into walls.
    o.geometry=mergeVertices(g,1e-4);g.dispose();
    triangles+=o.geometry.index.count/3;
  });
  model.userData.triangles=triangles;
  return model;
}
