#!/usr/bin/env node
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {compressLandmarkGLB,validateLandmarkConversion} from './lib/landmark-codec.mjs';
// The caller supplies the verified extracted ORIGINAL archive. No app modes
// are exercised by the standalone inspector, even for the named presets.
const base=process.argv[2]||'http://localhost:4257',source=process.argv[3];
if(!source)throw new Error('Usage: meshopt-scene-qa.mjs <library-url> <original-extracted-scene-dir> [output]');
const out=resolve(process.argv[4]||'tmp/meshopt-scene-visual'),models=new Map(),shots=[],errors=[];
for(const name of ['near','far','cityscape','world']){const before=await readFile(join(source,name+'.glb')),after=await compressLandmarkGLB(before);await validateLandmarkConversion(before,after);models.set(name,{before,after});}
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{for(const phase of ['before','after']){
 await mkdir(join(out,phase),{recursive:true});
 const page=await browser.newPage({viewport:{width:1254,height:784},deviceScaleFactor:1.53});let name;
 page.on('pageerror',e=>errors.push({phase,message:e.message}));
 await page.route('**/models/**/*.glb*',route=>route.fulfill({status:200,contentType:'model/gltf-binary',body:models.get(name)[phase]}));
 for(name of models.keys())for(const view of ['overview','pavilion']){
  await page.goto(base+'/asset-preview.html?asset=pont-jacques-cartier&source=glb&embed=1&view='+view);
  await page.waitForFunction(()=>window.__assetPreview?.model&&document.querySelector('#metrics').textContent.includes('triangles'));
  assert.equal(await page.locator('#error').textContent(),'');
  const meshTypes=await page.evaluate(()=>{const a=[];window.__assetPreview.model.traverse(m=>{if(m.isMesh)a.push({position:m.geometry.attributes.position.array.constructor.name,normal:m.geometry.attributes.normal.array.constructor.name,cpuStream:!!m.geometry.attributes._codriver_position});});return a;});
  assert.ok(meshTypes.length);assert.ok(meshTypes.every(m=>!m.cpuStream));if(phase==='after')assert.ok(meshTypes.every(m=>m.position==='Int16Array'&&m.normal==='Int8Array'));
  await page.waitForTimeout(150);const path=join(out,phase,name+'-'+view+'.png');await page.screenshot({path});shots.push({phase,preset:name,view,path,meshes:meshTypes.length});
 }
 await page.close();
}assert.deepEqual(errors,[]);await writeFile(join(out,'report.json'),JSON.stringify({scope:'Standalone preset decode/render parity only; app Cityscape and Full 3D world not tested',viewport:{width:1254,height:784,dpr:1.53},shots,errors},null,2)+'\n');console.log('PASS',shots.length,'scene captures');}finally{await browser.close();}
