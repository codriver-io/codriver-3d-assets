import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Buf } from './oracle-park-mesh.js';
import { T_N, T_W, F_NW1, F_NW2, F_SW } from './oracle-park-plan.js';
import { EYE } from './oracle-park-site.js';
import { buildField } from './oracle-park-field.js';
import { buildFacade, prism } from './oracle-park-facade.js';
import { CHAINS, stations, loft, profileGrandstand, profileCanopy, profileBleacher, profileArcade } from './oracle-park-stands.js';
import { lightFrame, scoreboard, brickTower } from './oracle-park-towers.js';
import { cokeBottle, giantGlove, flagpoles, entranceSign, rightFieldWall, roofPlant } from './oracle-park-toys.js';

// Far LOD merges minor materials into their neighbours (eight draws at most).
const FAR_MAP = { stone: 'concrete', glass: 'steel', copper: 'seat', glow: 'steel', roof: 'concrete' };

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const bufs = new Map();
  const B = (name) => { const m = near ? name : (FAR_MAP[name] ?? name); if (!bufs.has(m)) bufs.set(m, new Buf()); return bufs.get(m); };

  buildField(B, near);
  buildFacade(B, { near });
  const g = CHAINS.grandstand, bl = CHAINS.bleacher, ar = CHAINS.arcade, stG = stations(g.inner, g.extras);
  loft(B, stG, profileGrandstand, { caps: [true, true], near });
  loft(B, stG, (W, h, n) => ({ segs: profileCanopy(W, h, profileGrandstand(W, h, n)) }), { near });
  loft(B, stations(bl.inner, bl.extras), profileBleacher, { caps: [false, true], near });
  loft(B, stations(ar.inner, ar.extras), profileArcade, { caps: [true, false], near });
  prism(B('steel'), EYE, 0, 9);

  for (const f of [F_NW1, F_NW2, F_SW]) lightFrame(b, B, f, 70, near);
  scoreboard(b, B, near);
  brickTower(B, T_N, 34, 0, near, false);
  const tower = brickTower(B, T_W, 31, 8.5, near, true);
  b.bar('steel', [tower.c[0], 40.5, tower.c[1]], [tower.c[0], 47.5, tower.c[1]], 0.12, 0.12, 0, true);
  entranceSign(B, near);
  cokeBottle(b, B, near);
  giantGlove(b, B, near);
  flagpoles(b, B, near);
  rightFieldWall(B, near, ar.inner.slice(1));
  if (near) roofPlant(B);

  for (const [name, buf] of bufs) if (buf.triangles) b.put(buf.geometry(), name);
  return b.finish();
}
