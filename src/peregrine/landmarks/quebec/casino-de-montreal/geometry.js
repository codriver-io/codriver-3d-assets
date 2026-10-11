import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Soup } from './casino-de-montreal-mesh.js';
import { buildDrum } from './casino-de-montreal-drum.js';
import { buildWings } from './casino-de-montreal-wings.js';
import { buildQuebec } from './casino-de-montreal-quebec.js';

/**
 * Casino de Montréal in metres (+X east, +Y up, +Z south, origin = the centre of the French pavilion's drum, orientation
 * baked from the mapped outline: nothing is rotated downstream). Authoring only (exporter, inspector, tests).
 *
 * near: the drum with its fan of flared aluminium ribs, ring beam, drum of vertical louvres over lit glazing and glazed
 * lantern; the west terrace tower with its mast, the shaft stack, the entrance canopy and mushroom; the low link block and
 * corridor; the south-east ramp; and the Québec pavilion, a leaning box of gold glass with a mullion grid and roof band.
 * far: the same silhouette and negative space with half the ribs, no mullions, ledges or railings.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  const S = (mat) => { if (!soups.has(mat)) soups.set(mat, new Soup()); return soups.get(mat); };
  buildDrum(S, near);
  buildWings(S, near);
  buildQuebec(S, near);
  for (const [mat, s] of soups) if (!s.empty) b.put(s.geometry(), mat);
  return b.finish();
}
