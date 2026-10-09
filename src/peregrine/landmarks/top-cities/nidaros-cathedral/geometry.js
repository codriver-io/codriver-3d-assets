import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { makeKit } from './nidaros-cathedral-kit.js';
import { buildNidaros } from './nidaros-cathedral-build.js';
import { THETA } from './nidaros-cathedral-plan.js';

// Nidaros Cathedral (Nidarosdomen), Trondheim. Original procedural mesh on OSM way 417245741.
// Authored along the nave, then rotated once onto the mapped outline. The layer does not rotate it again.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildNidaros(makeKit(b, detail === 'near'));
  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.rotateY(THETA);
    o.geometry.computeBoundingBox();
    o.geometry.computeBoundingSphere();
  });
  root.userData.elevationDatum = MANIFEST.elevationDatum;
  return root;
}
