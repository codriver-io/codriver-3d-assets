import { mkdir, writeFile } from 'node:fs/promises';
import { Box3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createParisHistoric } from '../src/peregrine/landmarks/paris-historic-geometry.js';
import { PARIS_HISTORIC } from '../src/peregrine/landmarks/paris-historic-config.js';
import { glbMetrics } from './asset-catalog.mjs';

globalThis.FileReader ??= class {
  readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}
};
const out=new URL('../public/models/buildings/',import.meta.url);
await mkdir(out,{recursive:true});
for(const spec of PARIS_HISTORIC){
  const assets={};
  for(const detail of ['near','far']){
    const model=createParisHistoric(spec.id,{detail}),bounds=new Box3().setFromObject(model);
    const data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
    const name=`${spec.id}-${detail}.glb`;
    await writeFile(new URL(name,out),data);
    assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(data),
      bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
    model.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
  }
  await writeFile(new URL(`${spec.id}.json`,out),JSON.stringify({
    id:spec.id,name:spec.name,origin:spec.origin,authoringFrame:{rotationAboutY:spec.rotation,center:spec.authoringCenter,scaleXZ:spec.scaleXZ},units:'metres',
    axes:{x:'east',y:'up',z:'south'},rotationAboutY:spec.rotation,
    dimensions:{width:spec.width,length:spec.length,height:spec.height},
    elevationDatum:'Local y=0 is the rigid foundation plane; the host samples and places the model on flat ground or terrain. No DEM, elevation or Mercator scale is baked.',
    footprint:'Approximate bounded architectural footprint in the rotated width × length envelope; public squares, streets and interior courtyards are excluded.',
    note:spec.note,
    provenance:'Original procedural geometry commissioned for Codriver in 2026. Official photographs and publications informed proportions only. OpenStreetMap coordinates used for geographic placement; no third-party mesh, image or texture is included.',
    assets
  },null,2)+'\n');
  console.log(spec.id,assets.near.triangles,assets.far.triangles);
}
