// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Meshes } from './edifice-marie-guyart-mesh.js';
import { buildTower } from './edifice-marie-guyart-tower.js';
import { buildBase } from './edifice-marie-guyart-base.js';
import { buildCrown } from './edifice-marie-guyart-crown.js';

// Édifice Marie-Guyart (Complexe G), as it stands: the 132 m brutalist tower of pale precast concrete on a 42 m by 47 m plan, a glazed ground storey set back under
// the upper floors, on all four faces a ribbon of glass over a row of square windows in protruding frames, four corner piers that stand above the roof, a glazed
// belvedere floor, a rooftop penthouse and the 177 m mast; and the low government complex (three 4-level wings round a court, five 5-level cores) it stands beside.
// Frame: +X east, +Y up, +Z south, real metres, y = 0 the plaza level. No rotation is applied by the layer: the plan grids (60.74 and 60.14 degrees east of north) are baked in.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), M = new Meshes();
  buildTower(M, near);
  buildBase(M, near, b);
  buildCrown(M, near, b);
  for (const [name, faces] of M) b.put(faces.toGeometry(), name, 0);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // buildings carry no road contract
  root.userData.elevationDatum = 'Y=0 is the plaza level at the foot of the tower, not sea level. Stairs, the plaza and below-grade levels are not modelled.';
  return root;
}
