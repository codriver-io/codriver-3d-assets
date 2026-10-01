import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://localhost:4173',out=process.argv[3]||'tmp/browser';
await mkdir(out,{recursive:true});
const catalog=JSON.parse(await readFile('dist/asset-catalog.json'));
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[],failed=[],report=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push({url:r.url(),status:r.status()});});
try{
 await page.goto(base+'/');await page.waitForSelector('#list .asset');assert.equal(await page.locator('#list .asset').count(),catalog.assets.length);
 assert.match(await page.locator('h1').innerText(),/Open models\.\s+Endless worlds\./);
 assert.equal(await page.locator('#total-models').innerText(),String(catalog.assets.length));
 assert.equal(await page.locator('#contribute').getAttribute('href'),'https://github.com/codriver-io/codriver-3d-assets/blob/main/CONTRIBUTING.md');
 assert.ok(await page.locator('.brand img').evaluate(img=>img.complete&&img.naturalWidth>0),'Helmet logo loaded');
 await page.locator('[data-kind="building"]').click();assert.equal(await page.locator('#list .asset').count(),catalog.assets.filter(a=>a.kind==='building').length);
 await page.locator('#search').fill('Habitat');assert.equal(await page.locator('#list .asset').count(),1);
 await page.locator('#search').fill('');await page.selectOption('#city','Paris');
 assert.equal(await page.locator('#list .asset').count(),catalog.assets.filter(a=>a.kind==='building'&&a.location.includes('Paris')).length);
 await page.locator('#search').fill('not-a-real-model');assert.ok(await page.locator('#empty').isVisible());
 await page.locator('#empty-reset').click();await page.locator('#search').fill('Montreal');
 assert.ok(await page.locator('#list .asset').count()>0,'Accent-insensitive city search');
 await page.locator('#reset').click();
 await page.waitForTimeout(1000);await page.screenshot({path:out+'/desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.locator('#search').fill('');
 await page.setViewportSize({width:320,height:740});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No narrow-phone horizontal page overflow');
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(200);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No mobile horizontal page overflow');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'/mobile.png'});
 await page.locator('#library').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/mobile-library.png'});
 await page.locator('#search').fill('Jacques');await page.locator('[data-id="pont-jacques-cartier"]').click();
 assert.ok(await page.locator('#inspector-dialog').evaluate(d=>d.open),'Mobile sheet opens');
 assert.equal(await page.locator('#mobile-detail .files a[download]').count(),2);
 await page.locator('#mobile-detail iframe').waitFor();
 await page.frameLocator('#mobile-detail iframe').locator('#metrics').filter({hasText:'triangles'}).waitFor({state:'attached'});
 await page.screenshot({path:out+'/mobile-model.png'});
 await page.keyboard.press('Escape');assert.ok(!(await page.locator('#inspector-dialog').evaluate(d=>d.open)),'Escape closes mobile sheet');
 await page.waitForFunction(()=>!document.querySelector('#mobile-detail iframe'));
 assert.equal(await page.locator('#mobile-detail iframe').count(),0,'Closed mobile viewer releases its scene');
 await page.locator('[data-id="pont-jacques-cartier"]').click();await page.locator('#close-detail').click();
 await page.locator('#search').fill('');
 await page.setViewportSize({width:1200,height:900});
 for(const entry of catalog.assets){
  await page.goto(base+'/asset-preview.html?asset='+entry.id);
  await page.waitForFunction(()=>document.querySelector('#metrics')?.textContent.includes('triangles'),null,{timeout:30000});
  assert.equal(await page.locator('#error').textContent(),'');
  const procedural=await page.locator('#source').isEnabled();
  if(procedural)await page.selectOption('#source','procedural');
  await page.selectOption('#variant','far');await page.locator('#theme').click();
  assert.equal(await page.locator('#error').textContent(),'');
  if(procedural){const response=page.waitForResponse(r=>r.url().includes(entry.model.assets.far.url));await page.selectOption('#source','glb');assert.equal((await response).status(),200);}
  await page.waitForTimeout(150);assert.equal(await page.locator('#error').textContent(),'');
  if(['pont-honore-mercier','biosphere-montreal','oratoire-saint-joseph'].includes(entry.id))await page.screenshot({path:`${out}/${entry.id}.png`});
  report.push(entry.id);console.log('PASS viewer',entry.id);
 }
 for(const source of ['glb','procedural'])for(const detail of ['near','far']){
  await page.goto(`${base}/asset-preview.html?asset=pont-jacques-cartier&view=pavilion&source=${source}&detail=${detail}&embed=1`);
  await page.waitForFunction(()=>window.__assetPreview?.model&&document.querySelector('#metrics').textContent.includes('triangles'));
  assert.equal(await page.locator('#error').textContent(),'');
  await page.screenshot({path:`${out}/jacques-pavilion-${source}-${detail}.png`});
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/asset-preview.html?asset=pont-jacques-cartier&view=pavilion');
 await page.waitForFunction(()=>window.__assetPreview?.model);assert.ok(!(await page.locator('aside').isVisible()),'Mobile inspector starts with unobstructed model');
 await page.locator('#toggle-controls').click();assert.ok(await page.locator('aside').isVisible());await page.selectOption('#variant','far');
 await page.locator('#toggle-controls').click();assert.ok(!(await page.locator('aside').isVisible()));
 await page.screenshot({path:out+'/mobile-inspector.png'});await page.setViewportSize({width:1200,height:900});
 await page.goto(base+'/bridge-preview.html?view=piers');await page.waitForFunction(()=>Number.parseFloat(document.querySelector('#triangles')?.textContent)>0);
 assert.equal(await page.locator('#error').textContent(),'');await page.screenshot({path:out+'/champlain-piers.png'});
 await page.goto(base+'/licenses.html');assert.match(await page.locator('body').innerText(),/CC BY 4.0/);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log(`PASS public library, logo/contribution link, desktop/mobile, ${report.length} viewers, GLB/procedural, LOD/theme, Champlain piers, licenses`);
}finally{await writeFile(out+'/report.json',JSON.stringify({base,report,errors,failed},null,2));await browser.close();}
