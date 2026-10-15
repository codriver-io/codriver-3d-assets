import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { plinth, shaft, cabinet, crown, surround } from './gastown-steam-clock-parts.js';

// The Gastown Steam Clock, original procedural model: the granite plinth with its vent and plaque, the
// bronze shaft with an arched window to the works on each side, the four-faced cabinet (dials, bezels,
// corner posts, cornice), the pagoda roof with its central and four corner whistles, and the brick pad with
// its four bollards and chains. Far keeps the stages, the arched windows, the dials and the whistles
// without the numerals, hands, grille, plaque and chains.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ctx = { near: detail === 'near' };
  plinth(b, ctx); shaft(b, ctx); cabinet(b, ctx); crown(b, ctx); surround(b, ctx);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
