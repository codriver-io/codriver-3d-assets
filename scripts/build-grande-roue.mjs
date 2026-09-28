import { mkdir,writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createGrandeRoue } from '../src/peregrine/landmarks/grande-roue-geometry.js';
import { GRANDE_ROUE as spec } from '../src/peregrine/landmarks/grande-roue-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics,loadAssetCatalog } from './asset-catalog.mjs';

globalThis.FileReader??=class { readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});} };
const out=new URL('../public/models/buildings/',import.meta.url),assets={};
await mkdir(out,{recursive:true});
for(const detail of ['near','far']) {
  const model=createGrandeRoue({detail}),data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
  const name=`${spec.id}-${detail}.glb`;await writeFile(new URL(name,out),data);
  assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(data)};disposeChamplain(model);
}
await writeFile(new URL(`${spec.id}.json`,out),JSON.stringify({
  id:spec.id,name:spec.name,origin:spec.origin,units:'metres',axes:{x:'east',y:'up',z:'south'},
  height:spec.height,diameter:spec.diameter,hubHeight:spec.hubHeight,cabins:spec.cabins,bearing:spec.bearing,
  elevationDatum:spec.elevationDatum,
  alignmentAttribution:'© OpenStreetMap contributors — https://www.openstreetmap.org/copyright',
  note:'60m height and 42 cabins confirmed by operator/manufacturer. 56.64m rim diameter and bearing derived from OSM outline; hub, supports and cabins are visual approximations. Static upright cabins; no textures or decoder.',assets
},null,2)+'\n');
await loadAssetCatalog();console.log(spec.id,assets);
