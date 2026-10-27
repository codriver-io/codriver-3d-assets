#!/usr/bin/env node
// Local library parity only; this viewer does not establish app/terrain integration.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {compressLandmarkGLB,validateLandmarkConversion} from './lib/landmark-codec.mjs';
const base=process.argv[2]||'http://localhost:4257',out=resolve(process.argv[3]||'tmp/meshopt-visual');
const pilots=(process.argv[4]||'samuel-de-champlain,pont-jacques-cartier,cambie-bridge,golden-gate-bridge,cn-tower,tower-bridge').split(',');
const catalog=JSON.parse(await readFile('dist/asset-catalog.json')),pairs=[],sources=new Map(),encoded=new Map();
for(const id of pilots){const entry=catalog.assets.find(a=>a.id===id);assert.ok(entry,id);
 for(const detail of ['near','far']){const url=entry.model.assets[detail].url,relative=url.slice('/models/'.length);
  const source=await readFile(join('tmp/meshopt-all/before',relative)).catch(()=>readFile('public'+url)),candidate=await compressLandmarkGLB(source);
  await validateLandmarkConversion(source,candidate);sources.set(url,source);encoded.set(url,candidate);
 }
}
for(const phase of ['before','after'])await mkdir(join(out,phase),{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}),errors=[],failed=[];
try{for(const phase of ['before','after']){
 const context=await browser.newContext({viewport:{width:1254,height:784},deviceScaleFactor:1.53}),page=await context.newPage();
 page.on('pageerror',e=>errors.push({phase,message:e.message}));
 page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push({phase,url:r.url(),status:r.status()});});
 await page.route('**/models/**/*.glb*',async route=>{const b=(phase==='before'?sources:encoded).get(new URL(route.request().url()).pathname);if(b)await route.fulfill({status:200,contentType:'model/gltf-binary',body:b});else await route.continue();});
 for(const id of pilots)for(const detail of ['near','far'])for(const [view,theme] of [['overview','day'],[id==='cn-tower'?'roof':id==='cambie-bridge'?'facade':['samuel-de-champlain','pont-jacques-cartier'].includes(id)?'piers':'underside','night']]){
  await page.goto(base+'/asset-preview.html?'+new URLSearchParams({asset:id,detail,view,theme,source:'glb',embed:'1'}));
  await page.waitForFunction(()=>window.__assetPreview?.model&&document.querySelector('#metrics').textContent.includes('triangles'));
  assert.equal(await page.locator('#error').textContent(),'');
  assert.equal(await page.locator('#angle').inputValue(),view,'requested camera preset exists');
  const state=await page.evaluate(()=>{const p=window.__assetPreview;p.controls.enableDamping=false;p.controls.update();const meshes=[];p.model.traverse(m=>{if(m.isMesh)meshes.push({name:m.name,vertices:m.geometry.attributes.position.count,positionType:m.geometry.attributes.position.array.constructor.name,normalType:m.geometry.attributes.normal.array.constructor.name,cpuStream:!!m.geometry.attributes._codriver_position});});return {camera:p.camera.position.toArray(),target:p.controls.target.toArray(),meshes};});
  assert.ok(state.meshes.length);assert.ok(state.meshes.every(m=>!m.cpuStream));
  if(phase==='after')assert.ok(state.meshes.every(m=>m.positionType==='Int16Array'&&m.normalType==='Int8Array'));
  await page.waitForTimeout(150);
  const name=[id,detail,view,theme].join('-');await page.screenshot({path:join(out,phase,name+'.png')});
  if(phase==='before')pairs.push({id,detail,view,theme,name,before:state});else pairs.find(p=>p.name===name).after=state;
  console.log(phase,name);
 }
 await context.close();
}
const page=await browser.newPage();
for(const p of pairs){
 for(const key of ['camera','target'])assert.ok(p.before[key].every((n,i)=>Math.abs(n-p.after[key][i])<1),'same view within quantization bounds');
 const a=(await readFile(join(out,'before',p.name+'.png'))).toString('base64'),b=(await readFile(join(out,'after',p.name+'.png'))).toString('base64');
 p.imageDifference=await page.evaluate(async([a,b])=>{const images=await Promise.all([a,b].map(async d=>{const image=new Image();image.src='data:image/png;base64,'+d;await image.decode();return image;})),canvas=document.createElement('canvas');canvas.width=images[0].width;canvas.height=images[0].height;const ctx=canvas.getContext('2d');const pixels=images.map(image=>{ctx.drawImage(image,0,0);return ctx.getImageData(0,0,canvas.width,canvas.height).data;});let sum=0,changed=0,large=0;for(let i=0;i<pixels[0].length;i+=4){let d=0;for(let k=0;k<3;k++){const v=Math.abs(pixels[0][i+k]-pixels[1][i+k]);sum+=v;d=Math.max(d,v);}if(d)changed++;if(d>32)large++;}return {width:canvas.width,height:canvas.height,meanAbsoluteChannelDifference:sum/(canvas.width*canvas.height*3),changedPixels:changed,largeDifferencePixels:large};},[a,b]);
 // Individual images are the acceptance evidence. Diff statistics aid review.
}
assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
await writeFile(join(out,'report.json'),JSON.stringify({viewport:{width:1254,height:784,dpr:1.53},scope:'Standalone decoded-model parity only; Cityscape and Full 3D world app integration not tested',pairs,errors,failed},null,2)+'\n');
console.log('PASS',pairs.length,'raw/encoded paired captures');
}finally{await browser.close();}
