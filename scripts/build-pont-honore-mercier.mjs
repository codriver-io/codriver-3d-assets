import { mkdir,writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createMercier,createMercierPart } from '../src/peregrine/landmarks/pont-honore-mercier-geometry.js';
import { MERCIER,MERCIER_PROFILES } from '../src/peregrine/landmarks/pont-honore-mercier-profile.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics,loadAssetCatalog } from './asset-catalog.mjs';
globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const out=new URL('../public/models/landmarks/',import.meta.url),assets={};
await mkdir(out,{recursive:true});
for(const detail of ['near','far'])for(const p of [null,...MERCIER_PROFILES]){
  const model=p?createMercierPart(p,{detail}):createMercier({detail});
  const data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
  const id=p?.CHAMPLAIN.id||MERCIER.id,key=p?`${p.CHAMPLAIN.part.replaceAll('_','-')}-${detail}`:detail;
  await writeFile(new URL(`${id}-${detail}.glb`,out),data);
  assets[key]={url:`/models/landmarks/${id}-${detail}.glb`,...glbMetrics(data)};
  disposeChamplain(model);
}
await writeFile(new URL(`${MERCIER.id}.json`,out),JSON.stringify({...MERCIER,units:'metres',axes:{x:'east',y:'up',z:'south'},
  elevationDatum:'Visual metres above flat-map water/ground. Shore endpoints fit live HD roads; not surveyed or a navigational clearance.',
  parts:MERCIER_PROFILES.map(p=>({id:p.CHAMPLAIN.id,length:p.BRIDGE_LENGTH,stations:p.landmarks,width:p.CHAMPLAIN.width})),
  alignmentAttribution:'© OpenStreetMap contributors — https://www.openstreetmap.org/copyright',
  note:'near/far are complete inspection models; named parts are independently fitted runtime partitions, never loaded alongside complete variants. No decoder, third-party mesh or photograph.',assets},null,2)+'\n');
console.log(assets);
await loadAssetCatalog();
