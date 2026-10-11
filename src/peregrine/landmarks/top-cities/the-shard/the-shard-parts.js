import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = latToMercY(SPEC.origin[1]);
export const local = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (oz - latToMercY(lat)) / k];
// Eight facades from the mapped envelope; small vestibule notches stay recessed.
export const PLAN = [
  [-0.0865376,51.5047962],[-0.0862709,51.5046764],
  [-0.0860769,51.5044857],[-0.0860736,51.5044247],
  [-0.0862068,51.5042392],[-0.0864534,51.5041406],
  [-0.0870092,51.5043721],[-0.0868568,51.5045842],
].map(local);
export const CENTER = [-1, 3];
export const DECK = 252;
// Unequal shard terminations: three full-height blades, four low blades and the east blade.
export const TIPS = [[250,252],[304,309.6],[286,290],[253,247],[250,254],[309.6,300],[255,260],[299,309.6]];
export const taper = y => 1 - y / 336;
export const hash = (i,j) => ((i*1664525+j*1013904223)>>>0)%997/997;
export function facade(i, u, y, offset = 0) {
  const a=PLAN[i], c=PLAN[(i+1)%8], len=Math.hypot(c[0]-a[0],c[1]-a[1]);
  // PLAN is clockwise in the east/south ground plane; outward lies to the right of each edge.
  const nx=(c[1]-a[1])/len, nz=-(c[0]-a[0])/len;
  const inset=.4/(len*taper(y));
  const t=inset+u*(1-2*inset);
  const x=a[0]+t*(c[0]-a[0]), z=a[1]+t*(c[1]-a[1]);
  return [CENTER[0]+(x-CENTER[0])*taper(y)+nx*offset,y,CENTER[1]+(z-CENTER[1])*taper(y)+nz*offset];
}
export class Surfaces {
  constructor(){this.batches=new Map();}
  quad(mat, a,c,d,e, normal) {
    const n=new THREE.Vector3().crossVectors(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),new THREE.Vector3(...d).sub(new THREE.Vector3(...a)));
    if(n.dot(new THREE.Vector3(...normal))<0)[c,e]=[e,c];
    if(!this.batches.has(mat))this.batches.set(mat,[]);
    this.batches.get(mat).push(...a,...c,...d,...a,...d,...e);
  }
  face(mat,pts,normal){
    const xy=pts.map(p=>new THREE.Vector2(p[0],p[2]));
    for(const tri of THREE.ShapeUtils.triangulateShape(xy,[])) {
      const [a,c,d]=tri.map(i=>pts[i]);
      this.quad(mat,a,c,d,d,normal); // omit the second degenerate triangle in flush()
    }
  }
  flush(b){
    for(const [mat,raw] of this.batches) {
      const pts=[];
      for(let i=0;i<raw.length;i+=9){
        const a=new THREE.Vector3(...raw.slice(i,i+3)), c=new THREE.Vector3(...raw.slice(i+3,i+6)), d=new THREE.Vector3(...raw.slice(i+6,i+9));
        if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)pts.push(...raw.slice(i,i+9));
      }
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.computeVertexNormals();const indexed=mergeVertices(g,1e-4);g.dispose();b.put(indexed,mat);
    }
  }
}
export const outward = i => {
  const a=PLAN[i],c=PLAN[(i+1)%8];return [c[1]-a[1],0,a[0]-c[0]];
};
