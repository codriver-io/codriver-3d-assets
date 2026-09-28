import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { ROOT } from './asset-catalog.mjs';
import { licenseModels } from './license-models.mjs';
const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url)));
for(const [key,command] of Object.entries(pkg.scripts))if(key.startsWith('build:')){
  console.log(key);
  const result=spawnSync(process.execPath,command.split(' ').slice(1),{cwd:ROOT,stdio:'inherit',env:{...process.env,CODRIVER_ASSET_BATCH:'1'}});
  if(result.status!==0)process.exit(result.status||1);
}
await licenseModels();
