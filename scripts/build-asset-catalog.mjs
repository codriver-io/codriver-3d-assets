import { copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { ROOT, loadAssetCatalog } from './asset-catalog.mjs';
import { licenseModels } from './license-models.mjs';

export async function buildAssetCatalogPreview() {
  await licenseModels();
  const catalog=await loadAssetCatalog(),out=resolve(ROOT,'dist');
  await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
  const pages=[['asset-catalog','prototypes/assets3d'],['asset-preview','prototypes/assets3d'],['bridge-preview','prototypes/bridges']];
  await build({entryPoints:pages.map(([name])=>resolve(ROOT,`src/${name}.js`)),bundle:true,minify:true,target:'es2019',format:'iife',outdir:out,legalComments:'linked'});
  for(const [name,dir] of pages)await copyFile(resolve(ROOT,dir,`${name}.html`),resolve(out,`${name}.html`));
  await copyFile(resolve(out,'asset-catalog.html'),resolve(out,'index.html'));
  await cp(resolve(ROOT,'public/models'),resolve(out,'models'),{recursive:true});
  await writeFile(resolve(out,'asset-catalog.json'),JSON.stringify(catalog,null,2)+'\n');
  for(const file of ['LICENSE','LICENSE-MODELS.txt','LICENSES.md','THIRD_PARTY_NOTICES.md'])await copyFile(resolve(ROOT,file),resolve(out,file));
  await mkdir(resolve(out,'licenses'),{recursive:true});
  await copyFile(resolve(ROOT,'node_modules/three/LICENSE'),resolve(out,'licenses/three.txt'));
  await cp(resolve(ROOT,'site'),out,{recursive:true});
  await writeFile(resolve(out,'robots.txt'),'User-agent: *\nAllow: /\n');
  console.log(`Public library built: ${catalog.assets.length} landmarks in dist/`);
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(ROOT,'scripts/build-asset-catalog.mjs'))await buildAssetCatalogPreview();
