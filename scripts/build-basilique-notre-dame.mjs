import { mkdir, writeFile } from 'node:fs/promises';
import { Box3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { createNotreDame } from '../src/peregrine/landmarks/basilique-notre-dame-geometry.js';
import { NOTRE_DAME } from '../src/peregrine/landmarks/basilique-notre-dame-config.js';
import { disposeChamplain } from '../src/peregrine/landmarks/champlain-geometry.js';
import { glbMetrics, loadAssetCatalog } from './asset-catalog.mjs';

globalThis.FileReader ??= class {readAsArrayBuffer(blob){blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}};
const out=new URL('../public/models/buildings/',import.meta.url),assets={};
await mkdir(out,{recursive:true});
for(const detail of ['near','far']) {
  const model=createNotreDame({detail}),box=new Box3().setFromObject(model);
  const data=Buffer.from(await new GLTFExporter().parseAsync(model,{binary:true}));
  const name=`${NOTRE_DAME.id}-${detail}.glb`;await writeFile(new URL(name,out),data);
  assets[detail]={url:`/models/buildings/${name}`,...glbMetrics(data),bounds:{min:box.min.toArray(),max:box.max.toArray()}};
  disposeChamplain(model);
}
await writeFile(new URL(`${NOTRE_DAME.id}.json`,out),JSON.stringify({id:NOTRE_DAME.id,name:NOTRE_DAME.name,origin:NOTRE_DAME.origin,units:'metres',axes:{x:'east',y:'up',z:'south'},
  facadeToRearBearing:116.65017553482446,rotationAboutY:NOTRE_DAME.rotation,footprint:NOTRE_DAME.footprint,osmWay:NOTRE_DAME.osmWay,
  dimensions:{width:41,naveLength:77,towerHeight:66,footprintLength:109.5},
  elevationDatum:'Ground-relative y=0 on the flat Peregrine map; not sea level or surveyed terrain.',
  attribution:'Original procedural geometry; footprint © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
  note:'Exterior only. Sourced tower/nave dimensions; roofs, chapel, openings, statuary and material colours are visual estimates. Permanent architecture without restoration scaffolding.',assets},null,2)+'\n');
console.log(NOTRE_DAME.id,assets);await loadAssetCatalog();
