import * as THREE from 'three';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { create } from './geometry.js';
import { toBridge } from './george-c-king-bridge-site.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oy = latToMercY(SPEC.origin[1]);
const ring = FOOTPRINTS[0].map(([lng, lat]) => toBridge((lngToMercX(lng) - ox) / k, 0, (-latToMercY(lat) + oy) / k));
console.log(ring.map(p=>`${p.u.toFixed(0)},${p.v.toFixed(1)}`).join(' '));
const m=create({detail:'near'}); m.updateMatrixWorld(true);
const worst=[];
m.traverse(o=>{ if(!o.isMesh) return; const p=o.geometry.attributes.position; for(let i=0;i<p.count;i+=1){ const q=toBridge(...new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld).toArray()); worst.push([o.material.name,q.u,q.v,q.y]);}});
// max |v| by u bin
const bins={}; for(const [mat,u,v,y] of worst){ const b=Math.round(u/10)*10; bins[b]=Math.max(bins[b]||0,Math.abs(v)); }
console.log(JSON.stringify(bins));
