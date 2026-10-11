// Derived data (c) OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { HOUSES, houseMatrix } from './painted-ladies-site.js';
import { gabledHouse, hippedHouse } from './painted-ladies-houses.js';

// The Painted Ladies: seven row houses on the mapped outlines of 710-722 Steiner Street, built
// in real metres around SPEC.origin (+X east, +Y up, +Z south). The far model keeps every
// outline, gable, bay and chimney and merges colours: celadon into blue (cool grey-green, not 720's olive), brick into rose, cream (710) and
// the stucco foundation into trim, unlit glass into the roof's dark; lit windows stay `glow`, so the
// far model still shows lamplit windows at night within its eight draws.
const FAR_MAP = { celadon: 'blue', glass: 'roof', base: 'trim', cream: 'trim', brick: 'rose' };

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const remap = detail === 'far' ? (m) => FAR_MAP[m] ?? m : (m) => m;
  for (const house of HOUSES) (house.roof === 'hip' ? hippedHouse : gabledHouse)(b, houseMatrix(house), house, detail, remap);
  return b.finish();
}
