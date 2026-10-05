import { assetBuilder } from '../../asset-geometry.js';
import { PALETTES, SPEC } from './config.js';
import { buildOrders } from './puerta-de-alcala-orders.js';
import { buildShell } from './puerta-de-alcala-shell.js';

// Puerta de Alcalá: five passages through one granite block, an attic and a pediment on each
// front. East (positive t) is rusticated, with fluted Ionic columns and the REGE CAROLO III
// tablet. West keeps round columns only beside the central arch; the rest are pilasters.
// Metres, +x east, +y up, +z south. The gate's own axis is baked in (frame.js).
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const fold = (m) => (near || m !== 'graniteDark' ? m : 'granite');
  const api = {
    box: (m, ...rest) => b.box(fold(m), ...rest),
    bar: (m, ...rest) => b.bar(fold(m), ...rest),
    put: (g, m, ...rest) => b.put(g, fold(m), ...rest),
  };
  buildShell(api, near);
  buildOrders(api, near);
  return b.finish();
}
