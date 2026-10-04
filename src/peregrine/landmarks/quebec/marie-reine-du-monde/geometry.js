import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './marie-reine-du-monde-kit.js';
import { buildBody } from './marie-reine-du-monde-body.js';
import { buildFacade } from './marie-reine-du-monde-facade.js';
import { buildDome } from './marie-reine-du-monde-dome.js';

// Cathédrale Marie-Reine-du-Monde (Victor Bourgeau, 1875 to 1894): a one-third replica of St Peter's in Rome. A Latin-cross plan with a long nave,
// a pedimented portico of giant Corinthian columns on boulevard René-Lévesque with thirteen copper statues along its cornice, a transept with three-sided
// ends, the ribbed copper dome on a coupled-column drum with its lantern and cross at 77 m, and two small domes. Authored in building axes and rotated
// once onto the mapped grid (bearing 33.5 / 123.5) inside the kit; see config.js and the plan module.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, SPEC, near);
  buildBody(k);
  buildFacade(k);
  buildDome(k);
  return b.finish();
}
