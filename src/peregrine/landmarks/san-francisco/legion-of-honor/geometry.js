// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { kit } from './legion-of-honor-kit.js';
import { buildLegionOfHonor } from './legion-of-honor-parts.js';

// California Palace of the Legion of Honor: U-shaped museum, entrance arch, colonnaded Court of Honor, portico and rotunda dome.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const parts = buildLegionOfHonor(kit(b, detail));
  parts.shell(); parts.roofs(); parts.colonnades(); parts.portico(); parts.arch(); parts.pavilions(); parts.rotunda(); parts.court();
  return b.finish();
}
