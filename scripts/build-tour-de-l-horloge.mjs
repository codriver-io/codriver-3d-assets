import { mkdir, writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Box3 } from 'three';
import { createTourDeLHorloge } from '../src/peregrine/landmarks/tour-de-l-horloge-geometry.js';
import { TOUR_DE_L_HORLOGE as spec } from '../src/peregrine/landmarks/tour-de-l-horloge-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics, loadAssetCatalog } from './asset-catalog.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const out=new URL('../public/models/buildings/',import.meta.url),assets={};
await mkdir(out,{recursive:true});
for(const detail of ['near','far']){
  const model=createTourDeLHorloge({detail}),bounds=new Box3().setFromObject(model,true);
  const data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
  const name=`${spec.id}-${detail}.glb`;await writeFile(new URL(name,out),data);
  assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(data),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};
  disposeChamplain(model);
}
await writeFile(new URL(`${spec.id}.json`,out),JSON.stringify({id:spec.id,name:spec.name,origin:spec.origin,units:'metres',axes:{x:'east',y:'up',z:'south'},height:spec.height,turretHeight:spec.turretHeight,wallBearing:spec.wallBearing,
  elevationDatum:'Base y=0 at the flat rendered quay. No orthometric/sea-level datum; quay seawall relief omitted.',
  alignmentAttribution:'© OpenStreetMap contributors, ODbL 1.0; way 161206731 version 10, retrieved 2026-09-27.',
  note:'Original texture-free procedural visual model. Published tower/turret heights; mapped plan, photograph-estimated crown, wall height and details. Static clock hands.',assets},null,2)+'\n');
console.log(spec.id,assets);await loadAssetCatalog();
