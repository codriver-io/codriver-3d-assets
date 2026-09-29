import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Box3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { PARIS_PALACES, createParisPalace } from '../src/peregrine/landmarks/paris-palaces-geometry.js';
import { glbMetrics } from './asset-catalog.mjs';
import { licenseMetadata, stampGlbLicense } from './license-models.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const out=new URL('../public/models/buildings/',import.meta.url);
await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(new URL('../prototypes/assets3d/catalog.json',import.meta.url)));
for(const [id,spec] of Object.entries(PARIS_PALACES)){
  const metadata=licenseMetadata(catalog.assets.find(entry=>entry.id===id));
  const assets={};
  for(const detail of ['near','far']){
    const model=createParisPalace(id,{detail});const bounds=new Box3().setFromObject(model);
    const bytes=stampGlbLicense(Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true})),metadata);
    const name=`${id}-${detail}.glb`;
    await writeFile(new URL(name,out),bytes);
    assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(bytes),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
    model.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  }
  await writeFile(new URL(`${id}.json`,out),JSON.stringify({id,name:spec.name,origin:spec.origin,authoringFrame:{rotationAboutY:spec.rotation,center:spec.authoringCenter,scaleXZ:spec.scaleXZ},units:'metres',axes:{x:'east',y:'up',z:'south'},
    elevationDatum:'Local y=0 is the entrance plaza plane; terrain placement belongs to the host.',
    orientation:'Geometry is east/up/south. Explicit volumes and open courtyards are fixed in geographic orientation.',
    license:'CC-BY-4.0',codeLicense:'MIT',attribution:'Codriver / 9570-6198 Québec inc.; geographic placement © OpenStreetMap contributors',
    geographicDataLicense:'ODbL-1.0',geographicDataUrl:'https://www.openstreetmap.org/copyright',...metadata,assets},null,2)+'\n');
  console.log(id,assets);
}
