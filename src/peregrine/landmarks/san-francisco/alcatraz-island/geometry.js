import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './alcatraz-island-kit.js';
import { cellhouse, lighthouse, waterTower, ruins, yard } from './alcatraz-island-parts.js';

// Alcatraz Island: an original procedural model of the cellhouse complex, lighthouse, Warden's House ruins,
// recreation-yard wall and water tower, on the mapped OSM outlines (docs/3d-san-francisco-alcatraz-island.md).
// Authoring frame: u along the cellhouse's long axis, w toward the south-west front, one rotation onto east/south at the end.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, near);
  cellhouse(k, near); lighthouse(k, near); waterTower(k, near); ruins(k, near); yard(k, near);
  k.flush();
  return b.finish();
}
