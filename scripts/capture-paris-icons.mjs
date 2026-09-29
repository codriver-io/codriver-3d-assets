import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {PARIS_ICONS} from '../src/peregrine/landmarks/paris-icons-geometry.js';

const base=process.argv[2]||'http://localhost:4173';
const out=new URL('../docs/screenshots/paris-icons/',import.meta.url);
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1});
const report={base,captured:[],errors:[]};
page.on('pageerror',e=>report.errors.push(e.message));
async function open(id,detail,source,view,night=false){
  const url=`${base}/asset-preview.html?asset=${id}&detail=${detail}&source=${source}&view=${view}${night?'&theme=night':''}`;
  await page.goto(url);
  await page.waitForFunction(()=>!!window.__assetPreview?.model&&document.querySelector('#metrics')?.textContent.includes('triangles'),null,{timeout:30000});
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#error').textContent(),'');
  assert.equal(await page.locator('#variant').inputValue(),detail);
  assert.equal(await page.locator('#source').inputValue(),source);
  return page.evaluate(()=>{
    const model=window.__assetPreview.model;model.updateMatrixWorld(true);
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    model.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      for(let i=0;i<3;i++){min[i]=Math.min(min[i],b.min.getComponent(i));max[i]=Math.max(max[i],b.max.getComponent(i));}});
    return {min,max};
  });
}
try{
  for(const {id} of PARIS_ICONS){
    const glb=await open(id,'near','glb','facade');
    await page.screenshot({path:new URL(`${id}-near-glb-facade.png`,out).pathname});
    const source=await open(id,'near','procedural','facade');
    await page.screenshot({path:new URL(`${id}-near-source-facade.png`,out).pathname});
    for(let i=0;i<3;i++){assert.ok(Math.abs(glb.min[i]-source.min[i])<.02,`${id} min axis ${i}`);assert.ok(Math.abs(glb.max[i]-source.max[i])<.02,`${id} max axis ${i}`);}
    await open(id,'far','glb','roof',true);
    await page.screenshot({path:new URL(`${id}-far-glb-roof-night.png`,out).pathname});
    report.captured.push({id,glb,source,views:['near-glb-facade','near-source-facade','far-glb-roof-night']});
    console.log('CAPTURED',id);
  }
  assert.deepEqual(report.errors,[]);
}finally{await writeFile(new URL('report.json',out),JSON.stringify(report,null,2)+'\n');await browser.close();}
