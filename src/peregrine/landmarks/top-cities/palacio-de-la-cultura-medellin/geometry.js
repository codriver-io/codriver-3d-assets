import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, COURTYARD } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { palaceParts } from './palacio-de-la-cultura-medellin-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const h = palaceParts(b, near), phi = THREE.MathUtils.degToRad(23), k = mercStretch(SPEC.origin[1]);
  const local = ([lng, lat]) => {
    const x = (lngToMercX(lng) - lngToMercX(SPEC.origin[0])) / k;
    const z = -(latToMercY(lat) - latToMercY(SPEC.origin[1])) / k;
    return [x * Math.cos(phi) + z * Math.sin(phi), -x * Math.sin(phi) + z * Math.cos(phi)];
  };
  const ring = FOOTPRINTS[0].slice(0, -1).map(local), court = COURTYARD.slice(0, -1).map(local);
  h.mass(ring, court, SPEC.corniceM);
  // Whole provider envelope owned, with the mapped garden left open.
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    if (Math.hypot(q[0] - p[0], q[1] - p[1]) < 2) continue;
    h.facade(p, q, 22.4, { plain: (p[0] + q[0]) / 2 < -18 });
  }
  for (let i = 0; i < court.length; i++) h.facade(court[i], court[(i + 1) % court.length], 22.4, { plain: true, inner: true });
  h.hip(-24.1, -14.2, -30, 26.6, 22.45, 28.5);
  h.hip(-13.6, 5.1, -29.8, -5.1, 22.45, 28.1);
  h.hip(4.5, 25.1, -24.8, 11.7, 22.45, 28.8);
  h.hip(-13.5, 3.7, 7.1, 27.5, 22.45, 28.4);
  // Bolívar and Calibío gables, each with masonry, attic arches and a rose.
  h.entranceBay([26.45, -9.4], [0, -1], [1, 0]);
  h.gable([-8.5, 28.45], [1, 0], [0, 1], 14.4, 22.4, 7.6);
  for (const [u, v] of [[25.75, -17.2], [25.75, -1.6]]) h.turret(u, v, 2.45, 22.9, 29.4);
  // Octagonal assembly hall, corner pinnacles, ribbed dome and lantern.
  h.assembly(12.0, 18.0, SPEC.domeRadiusM);
  h.portal([-8.5,28.45],[1,0],[0,1]);
  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.rotateY(THREE.MathUtils.degToRad(SPEC.rotationDeg));
    o.geometry = mergeVertices(o.geometry, 1e-4);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
  return root;
}
