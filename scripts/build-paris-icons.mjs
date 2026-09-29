import { mkdir, writeFile } from 'node:fs/promises';
import { Box3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { PARIS_ICONS, createParisIcon } from '../src/peregrine/landmarks/paris-icons-geometry.js';
import { glbMetrics } from './asset-catalog.mjs';
import { licenseModels } from './license-models.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(value=>{this.result=value;this.onloadend?.();});}};
const out=new URL('../public/models/buildings/',import.meta.url);await mkdir(out,{recursive:true});
for(const spec of PARIS_ICONS){
  const assets={};
  for(const detail of ['near','far']){
    const model=createParisIcon(spec.id,{detail}),bounds=new Box3().setFromObject(model);
    const bytes=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
    const name=`${spec.id}-${detail}.glb`;
    await writeFile(new URL(name,out),bytes);
    assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(bytes),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
    model.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  }
  await writeFile(new URL(`${spec.id}.json`,out),JSON.stringify({
    id:spec.id,name:spec.name,origin:spec.origin,authoringFrame:{rotationAboutY:spec.rotation,center:spec.authoringCenter,scaleXZ:spec.scaleXZ},units:'metres',axes:{x:'east',y:'up',z:'south'},
    rotationAboutYRadians:spec.rotation,foundation:{datum:'Local rigid y=0; no terrain, sea-level or Mercator height baked.',footprintMetres:spec.footprint},
    attribution:'Original Codriver-commissioned procedural geometry, 2026. Geographic placement © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
    note:'Architectural exterior approximation; see per-asset documentation for published dimensions and estimated details.',assets
  },null,2)+'\n');
}
if(!process.env.CODRIVER_ASSET_BATCH)await licenseModels();
