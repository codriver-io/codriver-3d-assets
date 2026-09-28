import { mkdir, writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Box3 } from 'three';
import { createOrangeJulep } from '../src/peregrine/landmarks/orange-julep-geometry.js';
import { ORANGE_JULEP as spec } from '../src/peregrine/landmarks/orange-julep-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics, loadAssetCatalog } from './asset-catalog.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const out=new URL('../public/models/buildings/',import.meta.url),assets={};
await mkdir(out,{recursive:true});
for(const detail of ['near','far']){
  const model=createOrangeJulep({detail}),bounds=new Box3().setFromObject(model);
  const bytes=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
  const file=`orange-julep-${detail}.glb`;await writeFile(new URL(file,out),bytes);
  assets[detail]={url:`/models/buildings/${file}`,...glbMetrics(bytes),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
  disposeChamplain(model);
}
await writeFile(new URL('orange-julep.json',out),JSON.stringify({
  ...spec,units:'metres',axes:{x:'east',y:'up',z:'south'},
  elevationDatum:'Local grade y=0 on the flat Peregrine basemap; no absolute altitude or road lift.',
  attribution:'Original procedural mesh. Footprint © OpenStreetMap contributors (ODbL 1.0), way 364067316; https://www.openstreetmap.org/copyright',
  note:'18.3m shell from operator near-60ft account; footprint envelope ~21.1m. Frontage, heights, signage and sign position are photo estimates, not surveyed. No reference photos or external textures shipped.',assets,
},null,2)+'\n');
await loadAssetCatalog();console.log(JSON.stringify(assets,null,2));
