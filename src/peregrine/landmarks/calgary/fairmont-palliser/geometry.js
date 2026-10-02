// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { exposedWalls } from './fairmont-palliser-site.js';
import { meshKit } from './fairmont-palliser-mesh.js';
import { drawFacades } from './fairmont-palliser-facade.js';
import { roofs, roofBoxes, penthouse, entrance, entryEdge } from './fairmont-palliser-top.js';

// Fairmont Palliser Hotel (1914, Edward and William S. Maxwell for the Canadian Pacific Railway), as it stands at
// 133 9 Avenue SW: a buff-brick block on a stone base, three arms (the west wing, the central stem, the east wing)
// joined by 2-storey courts to the 70 m block along 9 Avenue, stepping up from 12 to 15 levels along the stem to a
// slate penthouse roof with the "PALLISER" sign, a heavy cornice one storey under every roof (and a 1 m cornice at the roofline), and the
// canopied entrance on 9 Avenue. The plan and the levels of its eleven parts are the OSM building:part ways.
// Frame: +X east, +Y up, +Z south, real metres, y = 0 local grade. No rotation is applied: the mapped rings
// already carry the hotel's 2.7 degree grid angle.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = meshKit();
  const ctx = { b, kit, near, rand: rng(1914) };

  drawFacades(ctx, exposedWalls());
  roofs(ctx);
  roofBoxes(ctx);
  const info = penthouse(ctx);
  entrance(ctx, entryEdge());

  kit.flush(b);
  const root = b.finish();
  root.userData.tris = kit.stats.tris;
  root.userData.sign = info;
  return root;
}

function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
