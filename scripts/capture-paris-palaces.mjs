// Local inspection evidence. Run after `pnpm build` and `PORT=4187 node scripts/serve.mjs`.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { PARIS_PALACES } from '../src/peregrine/landmarks/paris-palaces-geometry.js';

await mkdir(new URL('../docs/images/',import.meta.url),{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1280,height:820},deviceScaleFactor:1});
  page.on('console',m=>{if(m.type()==='error')console.error(m.text());});
  for(const id of Object.keys(PARIS_PALACES)){
    const url=`http://127.0.0.1:4187/asset-preview.html?asset=${id}&view=overview`;
    await page.goto(url,{waitUntil:'networkidle'});
    await page.waitForFunction(()=>document.querySelector('#metrics')?.textContent?.includes('triangles'),{timeout:20000});
    await page.waitForTimeout(450);
    await page.screenshot({path:new URL(`../docs/images/${id}-near.png`,import.meta.url).pathname});
    await page.selectOption('#variant','far');
    await page.selectOption('#angle','roof');
    await page.waitForFunction(()=>document.querySelector('#metrics')?.textContent?.includes('triangles'),{timeout:20000});
    await page.waitForTimeout(450);
    await page.screenshot({path:new URL(`../docs/images/${id}-far-roof.png`,import.meta.url).pathname});
    await page.selectOption('#variant','near');
    await page.selectOption('#angle','facade');
    await page.selectOption('#source','procedural');
    await page.locator('#theme').click();
    await page.waitForTimeout(450);
    await page.screenshot({path:new URL(`../docs/images/${id}-source-night.png`,import.meta.url).pathname});
    const text=await page.locator('#error').textContent();if(text)throw new Error(`${id}: ${text}`);
    console.log(`${id}: near GLB, far roof GLB, procedural source loaded`);
  }
}finally{await browser.close();}
