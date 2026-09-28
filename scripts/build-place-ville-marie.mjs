import { mkdir, writeFile } from 'node:fs/promises';
import { Box3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createPlaceVilleMarie } from '../src/peregrine/landmarks/place-ville-marie-geometry.js';
import { PLACE_VILLE_MARIE as PVM } from '../src/peregrine/landmarks/place-ville-marie-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics, loadAssetCatalog } from './asset-catalog.mjs';

globalThis.FileReader ??= class { readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});} };
const out=new URL('../public/models/buildings/',import.meta.url),assets={};
await mkdir(out,{recursive:true});
for(const detail of ['near','far']){
  const model=createPlaceVilleMarie({detail}),bounds=new Box3().setFromObject(model);
  const data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
  const name=`${PVM.id}-${detail}.glb`;await writeFile(new URL(name,out),data);
  assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(data),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
  disposeChamplain(model);
}
await writeFile(new URL(`${PVM.id}.json`,out),JSON.stringify({id:PVM.id,name:PVM.name,origin:PVM.origin,units:'metres',axes:{x:'east',y:'up',z:'south'},
  height:PVM.height,elevationDatum:PVM.datum,ring:PVM.ring,footprintWay:PVM.footprintWay,
  alignmentAttribution:'© OpenStreetMap contributors — https://www.openstreetmap.org/copyright',
  note:'Original procedural visual model. Only 1 PVM and plaza connection / L’Anneau are authored. Neighbouring towers remain provider buildings. Roof tiers, facade, ring section and flat-map plaza elevations are approximate.',assets},null,2)+'\n');
await loadAssetCatalog();console.log(PVM.id,assets);
