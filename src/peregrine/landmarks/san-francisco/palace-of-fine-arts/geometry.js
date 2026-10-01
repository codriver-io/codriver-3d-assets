import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { palaceKit } from './palace-of-fine-arts-kit.js';
import { buildRotunda } from './palace-of-fine-arts-rotunda.js';
import { buildColonnades } from './palace-of-fine-arts-colonnade.js';
import { buildHall } from './palace-of-fine-arts-hall.js';

// Palace of Fine Arts: the open rotunda (eight arches, paired Corinthian columns on eight corner piers,
// attic and shallow dome), the two curving colonnades with their pylons and planter boxes, and the curved
// exhibition hall behind. Local metres: +x east, +y up, +z south, origin at the rotunda's centre; the plan is
// authored directly in that frame (the building's own axis, 10 deg off east, is carried by the geometry).
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  // Far folds the minor materials (podium, panels and soffits, the night glow) into `stone`: three fewer draws.
  const fold = (m) => (near || !['base', 'stoneDark', 'glow'].includes(m) ? m : 'stone');
  const bx = { ...b, put: (g, m, ...r) => b.put(g, fold(m), ...r), box: (m, ...r) => b.box(fold(m), ...r), bar: (m, ...r) => b.bar(fold(m), ...r) };
  const kit = palaceKit(bx, near);
  buildRotunda(bx, kit, near);
  buildColonnades(bx, kit, near);
  buildHall(bx, kit, near);
  return b.finish();
}
