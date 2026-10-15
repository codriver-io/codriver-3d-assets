import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { buildMeshes } from './the-gherkin-parts.js';

// Bullet tower: a diagrid of flat diamond glass, six dark light-well spirals, and a lens tip.
// Frame is metres, +x east, +y up, +z south, origin at the mapped outline's centre. Rotation is
// baked (the plan is a circle, so the only orientation is which way the spiral starts).
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const meshes = buildMeshes(detail);
  for (const [name, geometry] of Object.entries(meshes)) b.put(geometry, name);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  root.userData.elevationDatum = 'Y=0 is local flat-map grade at the plaza, not sea level.';
  return root;
}
