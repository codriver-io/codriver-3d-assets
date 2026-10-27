#!/usr/bin/env node
// Reproducible archive conversion: node scripts/compress-scene-models.mjs [--write]
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { compressLandmarkGLB, validateLandmarkConversion } from './lib/landmark-codec.mjs';
import { landmarkCompressionMetrics } from './compress-landmarks.mjs';
import { digest, verifyScenePackage } from './scenes/scene-package.js';
import { glbMetrics } from './asset-catalog.mjs';
const write=process.argv.includes('--write'),root=resolve('public/scenes'),out=resolve('tmp/meshopt-scenes');
await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile(join(root,'catalog.json'))),results=[];
for(const entry of catalog.scenes){
 const original=await readFile(resolve('public','.'+entry.url)),dir=await mkdtemp(join(tmpdir(),'codriver-encode-scene-'));
 try{
  // Existing verifier checks archive hashes, dependencies and geometry first.
  execFileSync('unzip',['-q',resolve('public','.'+entry.url),'-d',dir]);
  await verifyScenePackage(dir);
  const manifest=JSON.parse(await readFile(join(dir,'scene.json'))),models=[];
  for(const name of Object.keys(manifest.files).filter(n=>n.endsWith('.glb'))){
   const before=await readFile(join(dir,name)),after=await compressLandmarkGLB(before);
   await validateLandmarkConversion(before,after);
   models.push({name,before:await landmarkCompressionMetrics(before),after:await landmarkCompressionMetrics(after)});
   await writeFile(join(dir,name),after);manifest.files[name]=digest(after);
  }
  const assetPath=join(dir,'asset.json'),asset=JSON.parse(await readFile(assetPath));
  if(asset.assets)for(const [detail,model] of Object.entries(asset.assets))if(['near','far'].includes(detail))Object.assign(model,glbMetrics(await readFile(join(dir,detail+'.glb'))));
  await writeFile(assetPath,JSON.stringify(asset,null,2)+'\n');manifest.files['asset.json']=digest(await readFile(assetPath));
  manifest.validation.evidence='Order-preserving codriver-meshopt-v2: exhaustive vertex/index/name/material/extras/custom-attribute parity within recorded position grid error; archive hashes checked. Presets require EXT_meshopt_compression and KHR_mesh_quantization support. Host application modes remain not tested.';
  await writeFile(join(dir,'scene.json'),JSON.stringify(manifest,null,2)+'\n');
  const verification=await verifyScenePackage(dir),candidate=join(out,entry.id+'.zip');
  await rm(candidate,{force:true});
  // Explicit sorted file list and fixed mtimes make repeated archives stable.
  const names=['scene.json',...Object.keys(manifest.files)].sort();
  for(const name of names)execFileSync('touch',['-t','202610270000',join(dir,name)]);
  execFileSync('zip',['-X','-q','-9',candidate,...names],{cwd:dir});
  const after=await readFile(candidate);results.push({id:entry.id,before:{bytes:original.length,sha256:digest(original)},after:{bytes:after.length,sha256:digest(after)},models});
  if(write){await writeFile(resolve('public','.'+entry.url),after);Object.assign(entry,{bytes:after.length,sha256:digest(after),validation:manifest.validation,geometry:verification.geometry});}
 }finally{await rm(dir,{recursive:true,force:true});}
}
if(write)await writeFile(join(root,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
await writeFile(join(out,'metrics.json'),JSON.stringify({write,results},null,2)+'\n');
console.log(JSON.stringify({write,results},null,2));
