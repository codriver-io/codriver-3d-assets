import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { meshKit } from './gare-du-palais-kit.js';
import { buildStation } from './gare-du-palais-build.js';

// Gare du Palais (Harry Edward Prindle for the Canadian Pacific Railway, 1915): the Château-style railway station of Québec's Lower Town. Red-brown brick
// with grey stone trim under steep verdigris copper mansard roofs: a main block whose tall central hall shows a great mullioned glass wall, an arcature,
// the clock gable and two round turrets under conical caps, over a glazed entrance canopy facing the forecourt; a long low west wing and a north
// wing toward the tracks with rows of pedimented dormers. Plan from the mapped outline and its three building:part ways; every height and detail
// is read from photographs. Frame: +X east, +Y up, +Z south, real metres, y = 0 the forecourt level. Nothing is rotated: the mapped rings carry the grids.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = meshKit();
  buildStation(kit, near);
  kit.flush(b);
  const root = b.finish();
  root.userData.tris = kit.stats.tris;
  return root;
}
