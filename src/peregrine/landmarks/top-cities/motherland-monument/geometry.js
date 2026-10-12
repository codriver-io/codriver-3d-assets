import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { loft, worldGeometry } from './motherland-monument-mesh.js';
import { sculptureParts } from './motherland-monument-statue.js';
import { museumParts } from './motherland-monument-museum.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  for(const p of museumParts())b.put(p.geometry,p.material);
  // The central pedestal stays rigid on the thirteen-metre museum roof.
  b.put(loft([[0,13,0,15.1,15.1],[0,25.7,0,14.8,14.8],[0,26.5,0,14.5,14.5],[0,38.5,0,8.8,8.8],[0,40,0,8.45,8.45]],near?100:50,25,.025),'pedestal');
  // Tall radial buttresses at the lower cone, seated on the museum roof.
  const n=16;
  for(let k=0;k<n;k++) { const a=k/n*Math.PI*2;
    const g=new THREE.BoxGeometry(2.1,11.3,3.3);g.translate(0,18.65,15.1);g.rotateY(a);b.put(g,'pedestal');
    { const glass=new THREE.BoxGeometry(1.2,6.8,.45);glass.translate(0,17.1,16.95);glass.rotateY(a);b.put(glass,'glass'); }
  }
  for(const p of sculptureParts(detail))b.put(worldGeometry(p.geometry),p.material);
  const model=b.finish();model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return model;
}
