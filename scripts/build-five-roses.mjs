import { mkdir, writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createFiveRoses } from '../src/peregrine/landmarks/five-roses-geometry.js';
import { FIVE_ROSES } from '../src/peregrine/landmarks/five-roses-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics } from './asset-catalog.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const out=new URL('../public/models/buildings/',import.meta.url),assets={};await mkdir(out,{recursive:true});
for(const detail of ['near','far']){
  const root=createFiveRoses({detail}),data=Buffer.from(await new GLTFExporter().parseAsync(root,{binary:true}));
  const name=`${FIVE_ROSES.id}-${detail}.glb`;await writeFile(new URL(name,out),data);
  assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(data)};disposeChamplain(root);
}
await writeFile(new URL(`${FIVE_ROSES.id}.json`,out),JSON.stringify({id:FIVE_ROSES.id,name:FIVE_ROSES.name,origin:FIVE_ROSES.origin,units:'metres',axes:{x:'east',y:'up',z:'south'},
  elevationDatum:'Local ground y=0 on the flat Peregrine basemap; no sea-level elevation offset.',
  letterHeight:FIVE_ROSES.letterHeight,estimatedRoofHeight:FIVE_ROSES.roofHeight,signFaceBearings:[96.88,276.88],
  alignmentAttribution:'© OpenStreetMap contributors (ODbL 1.0), way 1391560364, retrieved 2026-09-28.',
  note:'Original procedural geometry. Industrial heights, silo interior arrangement and sign mounting dimensions are photo estimates; no reference imagery or textures shipped.',assets},null,2)+'\n');
console.log(assets);
