import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { base, shaft, crown } from './coit-tower-parts.js';

// Coit Tower, original procedural model: the 24-flute shaft (near model: stair slits), the
// observation crown with its three tiers of arches (alcoves with balustrades, three small windows, the open
// arcade), the cornice and rounded cap, and the stepped base (rotunda with pilasters, porch, block).
// Far keeps every opening and the stepped massing, without slits, pilasters or relief.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ctx = { near: detail === 'near' };
  base(b, ctx); shaft(b, ctx); crown(b, ctx);
  const model = b.finish();
  model.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return model;
}
