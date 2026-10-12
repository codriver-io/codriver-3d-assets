import * as THREE from 'three';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';
const k = mercStretch(SPEC.origin[1]);
export const PLAN = FOOTPRINTS[0].map(([lng,lat]) => [
  (lngToMercX(lng)-lngToMercX(SPEC.origin[0]))/k,
  (-latToMercY(lat)+latToMercY(SPEC.origin[1]))/k,
]);
export function surfaceBuilder() {
  const positions=[], indices=[];
  function quad(a,b,c,d) {
    const i=positions.length/3; positions.push(...a,...b,...c,...d);
    indices.push(i,i+1,i+2,i,i+2,i+3);
  }
  function cap(ring,y) {
    for(let i=1;i<ring.length-1;i++) {
      const [a,b,c]=[ring[0],ring[i+1],ring[i]];
      const j=positions.length/3;positions.push(a[0],y,a[1],b[0],y,b[1],c[0],y,c[1]);indices.push(j,j+1,j+2);
    }
  }
  function geometry() {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
  }
  return {quad,cap,geometry,count:()=>indices.length/3};
}
