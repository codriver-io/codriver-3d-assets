import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './grace-cathedral-kit.js';
import { buildTower } from './grace-cathedral-tower.js';
import { buildFront } from './grace-cathedral-front.js';
import { buildNave, buildTransept, buildChoir, buildChapel, buildFleche } from './grace-cathedral-body.js';
import { PHI, AXIS_SHIFT_X } from './grace-cathedral-plan.js';

// Grace Cathedral (Bodley / Hare / Hobart, 1928-1964): an original procedural model on the mapped outline (OSM way
// 32946942). Authored in axis coordinates (front on +z, see grace-cathedral-plan.js), moved onto the mapped grid
// by one translation and one rotation at the end. docs/3d-san-francisco-grace-cathedral.md has the sources.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, detail === 'near');
  buildTower(k, 1);
  buildTower(k, -1);
  buildFront(k);
  buildNave(k);
  buildTransept(k);
  buildChoir(k);
  buildChapel(k);
  buildFleche(k);
  const root = b.finish();
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.deleteAttribute('bridgeLift');
    o.geometry.translate(AXIS_SHIFT_X, 0, 0); o.geometry.rotateY(PHI);
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
    o.material.color.set(PALETTES.light[o.material.name]);
  });
  root.userData.elevationDatum = 'Local grade y=0 is Taylor Street at the foot of the Great Stairs; the church floor stands 6.1 m above it';
  return root;
}
