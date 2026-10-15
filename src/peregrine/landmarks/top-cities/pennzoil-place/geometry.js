import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { buildPennzoil } from './pennzoil-place-mesh.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const info = buildPennzoil(b, detail);
  const root = b.finish();
  root.userData.pennzoil = info;
  root.userData.elevationDatum = MANIFEST.elevationDatum;
  return root;
}
