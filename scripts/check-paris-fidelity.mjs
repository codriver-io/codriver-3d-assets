import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base=process.argv[2]||'http://127.0.0.1:52174';
const out=process.argv[3]||'tmp/paris-fidelity/after';
await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile('prototypes/assets3d/catalog.json'));
const assets=catalog.assets.filter(a=>a.id.startsWith('paris-'));
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[],failed=[],report=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push(r.url());});
async function ready(){await page.waitForFunction(()=>window.__assetPreview?.model);assert.equal(await page.locator('#error').textContent(),'');}
async function change(control,value){
  await page.evaluate(()=>{window.__previousModel=window.__assetPreview.model;});
  await page.selectOption(control,value);
  await page.waitForFunction(()=>window.__assetPreview.model!==window.__previousModel);
  await ready();
}
try{
  for(const a of assets){
    const views=a.kind==='bridge'?['piers','overview']:['facade','roof'];
    await page.goto(`${base}/asset-preview.html?asset=${a.id}&view=${views[0]}&source=glb`);await ready();
    await page.waitForTimeout(100);await page.screenshot({path:`${out}/${a.id}.png`});
    // GLB, source, both LODs: wait for actual scene replacement, not stale metrics.
    await change('#source','procedural');
    await page.screenshot({path:`${out}/${a.id}-source.png`});
    await change('#variant','far');await page.locator('#theme').click();
    await change('#source','glb');
    await page.screenshot({path:`${out}/${a.id}-far-night.png`});
    await change('#variant','near');await page.locator('#theme').click();
    await page.selectOption('#angle',views[1]);await page.waitForTimeout(120);
    await page.screenshot({path:`${out}/${a.id}-roof-or-structure.png`});
    report.push(a.id);console.log('PASS',a.id);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
}finally{
  await writeFile(`${out}/report.json`,JSON.stringify({base,report,errors,failed},null,2)+'\n');
  await browser.close();
}
