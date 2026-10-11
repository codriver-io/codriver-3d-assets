import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './basilique-sainte-anne-de-beaupre-kit.js';
import { buildFacade } from './basilique-sainte-anne-de-beaupre-front.js';
import { buildNave, buildTransept, buildChoir } from './basilique-sainte-anne-de-beaupre-body.js';
import { PHI } from './basilique-sainte-anne-de-beaupre-plan.js';

// Basilique Sainte-Anne-de-Beaupré: an original procedural model on the mapped outline (OSM way 104582533). Authored in
// axis coordinates (front on +z, see basilique-sainte-anne-de-beaupre-plan.js), moved onto the mapped grid by one
// rotation at the end. docs/3d-quebec-basilique-sainte-anne-de-beaupre.md has the sources.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, detail === 'near');
  buildFacade(k);
  buildNave(k);
  buildTransept(k);
  buildChoir(k);
  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.rotateY(PHI);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
    o.material.color.set(PALETTES.light[o.material.name]);
  });
  root.userData.elevationDatum = 'Local grade y=0 is the plaza pavement at the foot of the front stairs; the church floor stands 2.2 m above it';
  return root;
}
