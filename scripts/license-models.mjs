import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT, glbMetrics } from './asset-catalog.mjs';

export async function licenseModels() {
  const catalog=JSON.parse(await readFile(resolve(ROOT,'prototypes/assets3d/catalog.json')));
  for(const entry of catalog.assets) {
    const path=resolve(ROOT,'public'+entry.manifest),manifest=JSON.parse(await readFile(path));
    manifest.license='CC-BY-4.0';manifest.licenseUrl='https://creativecommons.org/licenses/by/4.0/';
    manifest.copyright='© 2026 9570-6198 Québec inc. (Codriver)';
    manifest.attribution=entry.attribution;
    manifest.sourceUrl=entry.source.url;
    manifest.geographicDataLicense='ODbL-1.0';
    for(const variant of Object.values(manifest.assets)) {
      const file=resolve(ROOT,'public'+variant.url),original=await readFile(file);
      glbMetrics(original);
      const oldLength=original.readUInt32LE(12),gltf=JSON.parse(original.subarray(20,20+oldLength));
      gltf.asset.copyright=manifest.copyright+' — CC BY 4.0; geographic data © OpenStreetMap contributors';
      gltf.asset.extras={...gltf.asset.extras,license:manifest.license,licenseUrl:manifest.licenseUrl,source:manifest.sourceUrl,attribution:entry.attribution,geographicDataLicense:'ODbL-1.0',geographicDataUrl:'https://www.openstreetmap.org/copyright'};
      const json=Buffer.from(JSON.stringify(gltf)),padded=Buffer.alloc(Math.ceil(json.length/4)*4,0x20);json.copy(padded);
      const tail=original.subarray(20+oldLength),header=Buffer.from(original.subarray(0,20));
      header.writeUInt32LE(20+padded.length+tail.length,8);header.writeUInt32LE(padded.length,12);
      const output=Buffer.concat([header,padded,tail]);await writeFile(file,output);
      Object.assign(variant,glbMetrics(output));
    }
    await writeFile(path,JSON.stringify(manifest,null,2)+'\n');
  }
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(ROOT,'scripts/license-models.mjs'))await licenseModels();
