import { mkdir, writeFile } from 'node:fs/promises';
import { Box3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createStadeOlympique } from '../src/peregrine/landmarks/stade-olympique-geometry.js';
import { STADE } from '../src/peregrine/landmarks/stade-olympique-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics, loadAssetCatalog } from './asset-catalog.mjs';
globalThis.FileReader??=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const out=new URL('../public/models/buildings/',import.meta.url),assets={};await mkdir(out,{recursive:true});
for(const detail of ['near','far']){
  const model=createStadeOlympique({detail}),bounds=new Box3().setFromObject(model);
  const data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true})),name=`${STADE.id}-${detail}.glb`;
  await writeFile(new URL(name,out),data);
  assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(data),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
  disposeChamplain(model);
}
await writeFile(new URL(`${STADE.id}.json`,out),JSON.stringify({id:STADE.id,name:STADE.name,origin:STADE.origin,units:'metres',axes:{x:'east',y:'up',z:'south'},
  modeledState:STADE.modeledState,researchDate:'2026-09-27',dimensions:{stadiumLength:284,stadiumWidth:245,towerHeight:165},
  elevationDatum:'Local esplanade = y 0, adapted to flat map. 165 m tower above local ground; not 190 m above sea level.',
  alignmentAttribution:'© OpenStreetMap contributors, ODbL 1.0 — ways 108505523 and 20213158 — https://www.openstreetmap.org/copyright',
  note:'Original procedural visual model. Inclined shaft, shell, seats and hanging cables are simplified. No historical membrane or future rigid roof. No third-party texture or decoder.',assets},null,2)+'\n');
console.log(STADE.id,assets);await loadAssetCatalog();
