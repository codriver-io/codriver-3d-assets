import { mkdir, writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createVictoria, createJacquesCartier } from '../src/peregrine/landmarks/montreal-bridges-geometry.js';
import { createBiosphere } from '../src/peregrine/landmarks/biosphere-geometry.js';
import { VICTORIA,JACQUES,BIOSPHERE } from '../src/peregrine/landmarks/montreal-profiles.js';
import { JACQUES_RAMPS, createJacquesIslandRamp } from '../src/peregrine/landmarks/jacques-island-ramps.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics, loadAssetCatalog } from './asset-catalog.mjs';
import { buildAssetCatalogPreview } from './build-asset-catalog.mjs';

globalThis.FileReader ??= class { readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});} };
for(const [spec,create,profile] of [[VICTORIA.CHAMPLAIN,createVictoria,VICTORIA],[JACQUES.CHAMPLAIN,createJacquesCartier,JACQUES],[BIOSPHERE,createBiosphere],
  ...JACQUES_RAMPS.map(p=>[p.CHAMPLAIN,options=>createJacquesIslandRamp(p,options),p])]) {
  const dir=profile?'landmarks':'buildings',out=new URL(`../public/models/${dir}/`,import.meta.url),assets={};
  await mkdir(out,{recursive:true});
  for(const detail of ['near','far']){
    const model=create({detail}),data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
    const name=`${spec.id}-${detail}.glb`;
    await writeFile(new URL(name,out),data);
    assets[detail]={url:`/models/${dir}/${name}`,...glbMetrics(data)};
    disposeChamplain(model);
  }
  await writeFile(new URL(`${spec.id}.json`,out),JSON.stringify({id:spec.id,name:spec.name,origin:spec.origin,units:'metres',axes:{x:'east',y:'up',z:'south'},
    ...(profile?{length:profile.BRIDGE_LENGTH,width:spec.width,stations:profile.landmarks}:{diameter:spec.diameter,height:spec.height}),
    alignmentAttribution:'© OpenStreetMap contributors — https://www.openstreetmap.org/copyright',
    ...(profile?.CHAMPLAIN.terrainPolicy?{placement:{groundPolicy:profile.CHAMPLAIN.terrainPolicy,groundControls:profile.groundControls,
      localZero:'Foundation ground; structural and deck heights are relative, estimated metres.',
      ...(profile.CHAMPLAIN.rigidFoundations?{rigidBaseAttribute:'_bridgebase',rigidBaseStation:profile.landmarks.island}:{}),
      ...(profile.CHAMPLAIN.foundationFootprint?{foundationFootprint:profile.CHAMPLAIN.foundationFootprint,foundationFeatherM:8}: {})}}:{}),
    note:'Original procedural visual model. Heights, member sections, details and LOD simplification are approximate; no third-party model or texture is included.',assets},null,2)+'\n');
  console.log(spec.id,assets);
}
await loadAssetCatalog();
if(process.argv.includes('--preview'))await buildAssetCatalogPreview();
