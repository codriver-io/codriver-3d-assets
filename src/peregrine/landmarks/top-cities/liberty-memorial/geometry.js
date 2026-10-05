import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { terrace, tower, hall, sphinx, frieze } from './liberty-memorial-parts.js';
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), near = detail === 'near';
  terrace(b, near); tower(b, near);
  hall(b,-55.73,0,27.1,13.25,near); hall(b,56.08,0.45,27.35,13.5,near);
  sphinx(b,-25,17.5,-1,near); sphinx(b,25,17.5,1,near); frieze(b,near);
  const model = b.finish();
  model.traverse(o => { if(o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
