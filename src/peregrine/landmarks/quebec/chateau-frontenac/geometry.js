import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { meshKit } from './chateau-frontenac-kit.js';
import { buildComplex } from './chateau-frontenac-build.js';

// Fairmont Le Château Frontenac (Bruce Price for the Canadian Pacific Railway, 1893; the central tower and the later wings to 1924), as it
// stands: a château-style hotel of red-brown brick with grey stone trim around two courtyards, with steep green copper roofs, dozens of dormers,
// round turrets under conical caps and tall chimneys; the 14-storey central tower with its steep dark roof and pinnacles (about 80 m) rises behind
// the long south-east facade that looks over the Dufferin Terrace, the cliff and the St. Lawrence. Plan and heights follow OSM relation 32580 and its
// building:part ways; everything on the facades and roofs is reconstructed from photographs.
// Frame: +X east, +Y up, +Z south, real metres, y = 0 the Dufferin Terrace level. No rotation is applied: the mapped rings carry the hotel's grid angle.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = meshKit();
  buildComplex(kit, near);
  kit.flush(b);
  const root = b.finish();
  root.userData.tris = kit.stats.tris;
  return root;
}
