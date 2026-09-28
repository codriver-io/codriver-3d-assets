import assert from 'node:assert/strict';
import { access, readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { ROOT, loadAssetCatalog, glbMetrics } from './asset-catalog.mjs';

const catalog=await loadAssetCatalog(),out=resolve(ROOT,'dist');
assert.ok(catalog.assets.length>0);
let variants=0;
for(const entry of catalog.assets){
  assert.equal(entry.status,'ready');assert.equal(entry.license,'CC-BY-4.0');assert.equal(entry.codeLicense,'MIT');
  assert.ok(entry.source.url.startsWith('https://github.com/gauthiergarnier/codriver-3d-assets/blob/main/'));
  for(const view of [entry.inspection,...entry.inspection.views])await access(resolve(out,view.url.slice(1).split('?')[0]));
  const manifest=JSON.parse(await readFile(resolve(out,'.'+entry.manifest)));
  assert.equal(manifest.license,'CC-BY-4.0');assert.equal(manifest.geographicDataLicense,'ODbL-1.0');
  for(const variant of Object.values(manifest.assets)){
    const buffer=await readFile(resolve(out,'.'+variant.url)),source=await readFile(resolve(ROOT,'public'+variant.url));
    assert.deepEqual(buffer,source);assert.deepEqual(glbMetrics(buffer),{bytes:variant.bytes,triangles:variant.triangles,drawCalls:variant.drawCalls});
    const json=JSON.parse(buffer.subarray(20,20+buffer.readUInt32LE(12)));assert.equal(json.asset.extras.license,'CC-BY-4.0');assert.match(json.asset.copyright,/Codriver/);variants++;
  }
}
assert.ok(variants>=catalog.assets.length);
assert.match(await readFile(join(out,'LICENSE-MODELS.txt'),'utf8'),/Creative Commons Attribution 4.0/);
for(const name of ['LICENSE','LICENSES.md','THIRD_PARTY_NOTICES.md','licenses/three.txt','licenses.html','404.html','_headers'])await access(join(out,name));
const headers=await readFile(join(out,'_headers'),'utf8');assert.match(headers,/Access-Control-Allow-Origin: \*/);
async function inspect(dir){for(const item of await readdir(dir,{withFileTypes:true})){
  const file=join(dir,item.name);assert.ok(!item.isSymbolicLink(),file);
  if(item.isDirectory()){await inspect(file);continue;}
  assert.ok((await stat(file)).size<25*1024*1024,'Cloudflare Pages per-file limit: '+file);
  const name=relative(out,file);assert.ok(!/(^|\/)(\.env|node_modules|\.git|_worker\.js|functions)(\/|$)|peregrine(?:-worker)?\.js|bridge-map-preview|\/cars\//.test(name),'Only the asset library is published: '+name);
  if(!name.endsWith('.glb')){
    const text=await readFile(file,'utf8');assert.ok(!/\/Users\/|\/var\/folders\/|op:\/\/|-----BEGIN [A-Z ]*PRIVATE KEY-----|gh[op]_[A-Za-z0-9]{30,}/.test(text),'Private material in '+name);
  }
}}
await inspect(out);
console.log(`PASS ${catalog.assets.length} licensed models, ${variants} self-contained GLBs, public views, metadata, notices and deployment contents`);
