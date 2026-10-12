import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { world } from './high-museum-of-art-site.js';
export function inRing(p, ring) {
  let inside = false;
  for (let i=0,j=ring.length-1;i<ring.length;j=i++) {
    const a=ring[i],b=ring[j];
    if ((a[1]>p[1]) !== (b[1]>p[1]) && p[0] < (b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]) inside=!inside;
  }
  return inside;
}
export function clip(ring, axis, limit, above) {
  const out=[];
  for(let i=0;i<ring.length;i++) {
    const a=ring[i],b=ring[(i+1)%ring.length],ai=above?a[axis]>=limit:a[axis]<=limit,bi=above?b[axis]>=limit:b[axis]<=limit;
    if(ai)out.push(a);
    if(ai!==bi) { const t=(limit-a[axis])/(b[axis]-a[axis]);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]); }
  }
  return out;
}
export class Soup {
  positions=[];
  tri(a,b,c,n) {
    const ab=b.map((v,i)=>v-a[i]),ac=c.map((v,i)=>v-a[i]);
    const nn=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];
    if(Math.hypot(...nn)<1e-7)return;
    if(nn.reduce((v,x,i)=>v+x*n[i],0)<0)[b,c]=[c,b];
    for(const p of [a,b,c])this.positions.push(...world(p[0],p[1],p[2]));
  }
  quad(a,b,c,d,n) { this.tri(a,b,c,n);this.tri(a,c,d,n); }
  geometry() { const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.positions,3));g.computeVertexNormals();const welded=mergeVertices(g,1e-5);g.dispose();return welded; }
}
export function roof(s, ring, y) {
  const pts=ring.map(p=>new THREE.Vector2(...p));
  for(const [a,b,c] of THREE.ShapeUtils.triangulateShape(pts,[]))s.tri([ring[a][0],y,ring[a][1]],[ring[b][0],y,ring[b][1]],[ring[c][0],y,ring[c][1]],[0,1,0]);
}
