import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// NPS, Mathematical Equation: Y=A(cosh(C X/L)-1), ft.
// Full centreline: y=693.8597-68.7672*cosh(.0100333*x).
// Cross-sectional AREA interpolates with vertical drop, not side length.
const FT = 0.3048, A = 68.7672, B = 0.0100333, H = 625.0925;
const angle = SPEC.axisBearing * Math.PI / 180;
const axis = [Math.sin(angle), -Math.cos(angle)];
const cross = [Math.cos(angle), Math.sin(angle)];
export const worldPoint = (u, y, v) => new THREE.Vector3(axis[0]*u + cross[0]*v, y, axis[1]*u + cross[1]*v);

function section(u) {
  const x = u / FT, y = (693.8597 - A * Math.cosh(B*x)) * FT;
  const slope = -A * B * Math.sinh(B*x), len = Math.hypot(1, slope);
  const side = Math.sqrt(17*17 + (54*54-17*17)*(H-y/FT)/H)*FT;
  return { y, side, nx: -slope/len, ny: 1/len };
}
function point(u, face, t) {
  const s = section(u), r = s.side/(2*Math.sqrt(3));
  // Outer edge is flat; the third vertex points into the opening.
  const profile = [[r,-s.side/2],[r,s.side/2],[-2*r,0]];
  const a = profile[face], c = profile[(face+1)%3];
  const q = a[0]+(c[0]-a[0])*t, v=a[1]+(c[1]-a[1])*t;
  return worldPoint(u+s.nx*q, s.y+s.ny*q, v);
}
function normal(u, face, t) {
  const du=point(u+0.001,face,t).sub(point(u-0.001,face,t));
  const dt=point(u,face,1).sub(point(u,face,0));
  // Profile order is clockwise when looking along the arch tangent.
  return dt.cross(du).normalize();
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const batches = new Map();
  function triangle(mat, vertices) {
    // Clip foot triangles to the horizontal park datum; never stretch the arch.
    let poly=vertices;
    const out=[];
    for(let i=0;i<poly.length;i++) {
      const a=poly[i], c=poly[(i+1)%poly.length], ai=a.p.y>=0, ci=c.p.y>=0;
      if(ai) out.push(a);
      if(ai!==ci) { const t=a.p.y/(a.p.y-c.p.y); out.push({p:a.p.clone().lerp(c.p,t),n:a.n.clone().lerp(c.n,t).normalize()}); }
    }
    if(out.length<3)return;
    if(!batches.has(mat))batches.set(mat,{p:[],n:[]});
    const dst=batches.get(mat);
    for(let k=1;k<out.length-1;k++) {
      const tri=[out[0],out[k],out[k+1]];
      const actual=tri[1].p.clone().sub(tri[0].p).cross(tri[2].p.clone().sub(tri[0].p));
      if(actual.dot(tri[0].n)<0) [tri[1],tri[2]]=[tri[2],tri[1]];
      if(actual.lengthSq()<1e-12)continue;
      for(const v of tri){dst.p.push(...v.p);dst.n.push(...v.n);}
    }
  }
  function quad(mat, ua, ub, face, ta, tb) {
    const vs=[[ua,ta],[ub,ta],[ub,tb],[ua,tb]].map(([u,t])=>({p:point(u,face,t),n:normal(u,face,t)}));
    triangle(mat,[vs[0],vs[1],vs[2]]);triangle(mat,[vs[0],vs[2],vs[3]]);
  }
  const limit=92, count=near?280:92;
  const stations=new Set(Array.from({length:count+1},(_,i)=>-limit+2*limit*i/count));
  const windows=Array.from({length:16},(_,i)=>(i-7.5)*1.17);
  for(const u of windows){stations.add(u-0.343);stations.add(u+0.343);}
  stations.add(0);
  const us=[...stations].sort((a,c)=>a-c);
  for(let i=0;i<us.length-1;i++) {
    const ua=us[i],ub=us[i+1], mid=(ua+ub)/2;
    const window=windows.some(u=>Math.abs(mid-u)<0.34301);
    quad('steel_outer',ua,ub,0,0,1);
    for(const face of [1,2]) {
      const mat=face===1?'steel':'steel_inner';
      if(window) {
        // Both faces get true glazing patches cut into the steel tessellation.
        // No backing face/overlay: crown windows cannot z-fight at far LOD.
        const t0=0.48, t1=t0+0.1778/(section(mid).side*Math.sqrt(3)/2);
        const lo=face===1?t0:1-t1, hi=face===1?t1:1-t0;
        quad(mat,ua,ub,face,0,lo);quad('glass',ua,ub,face,lo,hi);quad(mat,ua,ub,face,hi,1);
      } else quad(mat,ua,ub,face,0,1);
    }
  }
  for(const [mat,data] of batches) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(data.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(data.n,3));b.put(g,mat);
  }
  // Flat park strip at grade, partitioned into lawn and paths (no stacked faces).
  // This bounded approximation leaves the wider park, ponds and trees to the map.
  function ground(mat, points) {
    const shape=new THREE.Shape(points.map(([u,v])=>new THREE.Vector2(u,-v)));
    const g=new THREE.ShapeGeometry(shape).rotateX(-Math.PI/2),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const w=worldPoint(p.getX(i),.10,p.getZ(i));p.setXYZ(i,...w);}
    g.computeVertexNormals();b.put(g,mat);
  }
  ground('lawn',[[-78,-27],[78,-27],[78,5],[-78,5]]);
  for(const [a,c] of [[-31,-27],[5,9]])ground('paving',[[-78,a],[78,a],[78,c],[-78,c]]);
  // Each compact triangular plaza follows the splayed triangular steel foot.
  for(const sign of [-1,1])ground('paving',[[sign*78,0],[sign*101,-10.5],[sign*101,10.5]]);
  const model=b.finish();
  model.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');
    if(o.material.name.startsWith('steel')){o.material.metalness=0.10;o.material.roughness=0.18;}
  });
  return model;
}
