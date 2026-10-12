import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTLINE } from './mercedes-benz-stadium-plan.js';

const TAU = 2 * Math.PI;
const mix = (a,b,t) => a.map((v,i) => v+(b[i]-v)*t);
const ellipse = (a,rx,rz,y) => [rx*Math.cos(a),y,rz*Math.sin(a)];
// Intersect a ray with the mapped polygon, keeping the real irregular orientation.
export function edgeAt(a, scale=1, y=0) {
  const dx=Math.cos(a), dz=Math.sin(a); let best=Infinity;
  for(let i=0;i<OUTLINE.length;i++) {
    const p=OUTLINE[i],q=OUTLINE[(i+1)%OUTLINE.length], ex=q[0]-p[0],ez=q[1]-p[1];
    const den=dx*ez-dz*ex; if(Math.abs(den)<1e-8)continue;
    const r=(p[0]*ez-p[1]*ex)/den, t=(p[0]*dz-p[1]*dx)/den;
    if(r>0 && t>=-1e-6 && t<=1+1e-6)best=Math.min(best,r);
  }
  return [dx*best*scale,y,dz*best*scale];
}

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const buffers=new Map();
  function tri(mat,a,c,d,want) {
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dv=new THREE.Vector3(...d);
    const normal=cv.clone().sub(av).cross(dv.clone().sub(av));
    if(normal.lengthSq()<1e-10)return;
    if(normal.dot(new THREE.Vector3(...want))<0)[c,d]=[d,c];
    if(!buffers.has(mat))buffers.set(mat,[]);
    buffers.get(mat).push(...a,...c,...d);
  }
  function poly(mat,ps,want) { for(let i=1;i+1<ps.length;i++)tri(mat,ps[0],ps[i],ps[i+1],want); }
  const up=[0,1,0],down=[0,-1,0];
  function quad(mat,a,c,d,e,want) {poly(mat,[a,c,d,e],want);}
  // Adjacent panel/frame faces partition each cell; there is no overlay/backing plane.
  function cell(mat,ps,want,gap=0.035) {
    const center=ps[0].map((_,i)=>ps.reduce((s,p)=>s+p[i],0)/ps.length);
    const inner=ps.map(p=>mix(p,center,gap));
    poly(mat,inner,want);
    for(let i=0;i<ps.length;i++)quad('frame',ps[i],ps[(i+1)%ps.length],inner[(i+1)%ps.length],inner[i],want);
  }
  function grid(mat,a,c,d,e,nx,ny,want,gap=0.04) {
    const at=(u,v)=>{const p=mix(mix(a,c,u),mix(e,d,u),v); if(mat==='roof')p[1]+=2.4*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);return p;};
    for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)
      cell(mat,[at(x/nx,y/ny),at((x+1)/nx,y/ny),at((x+1)/nx,(y+1)/ny),at(x/nx,(y+1)/ny)],want,gap);
  }
  // Unequal station bearings, projections and fold heights follow the reference
  // wing silhouette rather than a repeated radial drum. All stay inside OSM.
  const bearings=[-25,-5,26,52,75,99,125,146,165,193,217,242,263,289,310,336];
  const heights=[80,67,78,73,75,66,81,72,78,70,77,64,82,74,76,68];
  const scales=[0.976,0.91,0.963,0.955,0.976,0.92,0.969,0.947,0.976,0.915,0.96,0.95,0.976,0.924,0.966,0.95];
  const tips=[13,20,10,16,12,22,9,17];
  const shell=bearings.map((a,i)=>edgeAt(a*Math.PI/180,scales[i],heights[i]));
  const base=bearings.map(a=>edgeAt(a*Math.PI/180,0.885,0));
  for(let i=0;i<8;i++) {
    const k=i*2,A=shell[k],B=shell[(k+2)%16],M=shell[(k+1)%16];
    const T=[M[0],tips[i],M[2]],ba=[base[k][0],9,base[k][2]],bm=[base[(k+1)%16][0],9,base[(k+1)%16][2]],bb=[base[(k+2)%16][0],9,base[(k+2)%16][2]];
    const want=[M[0],0,M[2]];
    // Two unequal planar halves meet at a real wing crease M--T; the entire
    // upper edge A--M--B meets the fixed deck. No missing triangular closure.
    for(const [left,right] of [[A,M],[M,B]]) {
      const rows=near?24:7;
      for(let r=0;r<rows;r++) {
        const u=r/rows,v=(r+1)/rows;
        cell('silver',[mix(T,left,u),mix(T,right,u),mix(T,right,v),mix(T,left,v)],want,near?0.012:0.009);
      }
    }
    grid('glass',ba,bm,T,A,near?6:3,near?6:3,want,near?0.028:0.042);
    grid('glass',bm,bb,B,T,near?6:3,near?6:3,want,near?0.028:0.042);
  }
  // Continuous recessed nine-metre concourse. The narrow solid uprights and
  // glazed bays replace surfaces in-plane and terminate at grade and the roof.
  for(let i=0;i<16;i++) {
    const j=(i+1)%16,A=base[i],B=base[j],D=[A[0],9,A[2]],C=[B[0],9,B[2]];
    grid('glass',A,B,C,D,near?6:3,near?2:1,[A[0]+B[0],0,A[2]+B[2]],near?0.035:0.05);
  }
  // Fixed roof: triangulate the irregular wing rim with an eight-sided hole.
  // Its actual outer boundary is shared with the facade, without radial gaps.
  const rim=Array.from({length:8},(_,i)=>ellipse(-Math.PI/8+i*TAU/8,91,73,83));
  const contour=shell.map(p=>new THREE.Vector2(p[0],p[2]));
  const hole=rim.map(p=>new THREE.Vector2(p[0],p[2]));
  const points=[...shell,...rim],low=p=>[p[0],p[1]-1.1,p[2]];
  for(const ids of THREE.ShapeUtils.triangulateShape(contour,[hole])) {
    const ps=ids.map(i=>points[i]);poly('silver',ps,up);poly('dark',ps.map(low),down);
  }
  for(let i=0;i<16;i++) {
    const A=shell[i],B=shell[(i+1)%16];
    quad('silver',A,B,low(B),low(A),[A[0]+B[0],0,A[2]+B[2]]);
  }
  // Static mid-travel camera aperture. Eight triangular ETFE blades have
  // clockwise-shifted tips, each interlocking with a triangular fixed-metal
  // heel. Strong skew boundaries are retained unchanged in the far model.
  // This is an estimated pose of the documented linear motion, not animation.
  for(let i=0;i<8;i++) {
    const a=-Math.PI/8+i*TAU/8,c=a+TAU/8;
    const A=rim[i],B=rim[(i+1)%8];
    const C=ellipse(c+1.1,28,22,93),D=ellipse(a+1.1,28,22,93);
    // Barycentric triangular panel tessellation: no trapezoidal radial petals.
    const corners=[A,B,D],center=A.map((_,j)=>(A[j]+B[j]+D[j])/3);
    const inner=corners.map(p=>mix(p,center,0.04));
    for(let k=0;k<3;k++)quad('frame',corners[k],corners[(k+1)%3],inner[(k+1)%3],inner[k],up);
    const [aa,bb,dd]=inner,n=near?8:3,at=(u,v)=>aa.map((x,j)=>x+(bb[j]-x)*u+(dd[j]-x)*v);
    for(let row=0;row<n;row++)for(let col=0;col<n-row;col++) {
      cell('roof',[at(col/n,row/n),at((col+1)/n,row/n),at(col/n,(row+1)/n)],up,near?0.038:0.034);
      if(col+row<n-1)cell('roof',[at((col+1)/n,row/n),at((col+1)/n,(row+1)/n),at(col/n,(row+1)/n)],up,near?0.038:0.034);
    }
    cell('silver',[B,C,D],up,0.032);
    poly('dark',[low(A),low(B),low(D)],down);
    poly('dark',[low(B),low(C),low(D)],down);
    quad('frame',D,C,low(C),low(D),[-D[0]-C[0],0,-D[2]-C[2]]);
  }
  // Interior bowl: continuous stepped rows and radial aisles, not floating seat boxes.
  const seats=near?24:10, sectors=near?64:32;
  for(let r=0;r<seats;r++) {
    const f=r/seats,g=(r+1)/seats,y=4+f*48,yn=4+g*48;
    for(let i=0;i<sectors;i++) {
      const a=i*TAU/sectors,c=(i+1)*TAU/sectors;
      const A=ellipse(a,64+f*53,43+f*45,y),B=ellipse(c,64+f*53,43+f*45,y);
      const C=ellipse(c,64+g*53,43+g*45,y),D=ellipse(a,64+g*53,43+g*45,y);
      const mat=i%(sectors/16)===0?'dark':'seating';
      quad(mat,A,B,C,D,up);
      const C2=[C[0],yn,C[2]],D2=[D[0],yn,D[2]];
      quad(mat,D,C,C2,D2,[-D[0]-C[0],0,-D[2]-C[2]]);
    }
  }
  // Continuous stadium floor meets the bowl; pitch and painted lines partition its plane.
  // Close the actual recessed-concourse boundary, not a larger independent
  // OSM inset: that former plate projected beyond the glazing as dark strips.
  const groundRing=base;
  for(let i=0;i<groundRing.length;i++)tri('dark',[0,0,0],groundRing[i],groundRing[(i+1)%groundRing.length],up);
  // A separate pitch is 1 m above the building floor, supported by a closed perimeter wall.
  const xcuts=[-53,-52.7,-35.3,-35,-17.3,-17,-0.18,0.18,17,17.3,35,35.3,52.7,53];
  const zcuts=[-34.5,-34.2,34.2,34.5];
  for(let x=0;x+1<xcuts.length;x++)for(let z=0;z+1<zcuts.length;z++) {
    const mat=(x%2===0||z===0||z===2)?'frame':'turf';
    quad(mat,[xcuts[x],1,zcuts[z]],[xcuts[x+1],1,zcuts[z]],[xcuts[x+1],1,zcuts[z+1]],[xcuts[x],1,zcuts[z+1]],up);
  }
  for(const [A,B] of [[[-53,0,-34.5],[53,0,-34.5]],[[53,0,-34.5],[53,0,34.5]],[[53,0,34.5],[-53,0,34.5]],[[-53,0,34.5],[-53,0,-34.5]]])
    quad('dark',A,B,[B[0],1,B[2]],[A[0],1,A[2]],[A[0]+B[0],0,A[2]+B[2]]);
  // Halo display is a closed elliptical ring, with an inward facing luminous fascia.
  const n=near?64:32;
  for(let i=0;i<n;i++) {
    const a=i*TAU/n,c=(i+1)*TAU/n;
    const A=ellipse(a,76,57,65),B=ellipse(c,76,57,65),C=ellipse(c,76,57,77),D=ellipse(a,76,57,77);
    quad('glow',A,B,C,D,[-A[0]-B[0],0,-A[2]-B[2]]);
    const E=ellipse(a,78,59,65),F=ellipse(c,78,59,65),G=ellipse(c,78,59,77),H=ellipse(a,78,59,77);
    quad('dark',E,F,G,H,[E[0]+F[0],0,E[2]+F[2]]);
    quad('dark',D,C,G,H,up);quad('dark',A,B,F,E,down);
  }
  // The halo hangs from eight rigid roof ties. Their ends embed into the named
  // halo cap and fixed/petal soffit, not into the frame geometry itself.
  const contacts=[];
  const darkFaces=buffers.get('dark');
  for(let i=0;i<8;i++) {
    const start=ellipse(i*TAU/8,77,58,77), ray=new THREE.Ray(new THREE.Vector3(start[0],110,start[2]),new THREE.Vector3(0,-1,0));
    let roofY=-Infinity;
    for(let j=0;j<darkFaces.length;j+=9) {
      const ps=[0,3,6].map(k=>new THREE.Vector3(...darkFaces.slice(j+k,j+k+3)));
      if(ps.some(p=>p.y<80))continue;
      const hit=ray.intersectTriangle(...ps,false,new THREE.Vector3());
      if(hit)roofY=Math.max(roofY,hit.y);
    }
    if(!Number.isFinite(roofY))throw new Error('Missing roof support for halo tie '+i);
    const end=[start[0],roofY,start[2]];
    b.bar('frame',start,end,0.8,0.8);
    contacts.push({member:'halo-tie-'+i,start,end,supports:['halo-cap','roof-soffit']});
  }
  // All faces carry outward normals and are merged once per material.
  for(const [mat,pos] of buffers) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();b.put(g,mat);
  }
  const model=b.finish();model.userData.contacts=contacts;return model;
}
