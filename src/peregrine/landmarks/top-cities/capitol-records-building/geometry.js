import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { lettering } from './capitol-records-building-lettering.js';

// Original surfaces. Material boundaries divide the skin instead of placing
// window overlays over a solid cylinder. Rotations are baked into the geometry.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', n = near ? 72 : 24;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const ring = (mat, profile, x = 0, z = 0, segments = n) => {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
    g.translate(x, 0, z); b.put(g, mat);
  };
  const side = (mat, r, lo, hi, start = 0, arc = Math.PI * 2) => {
    const g = new THREE.CylinderGeometry(r, r, hi - lo, Math.max(1, Math.ceil(n * arc / (Math.PI * 2))), 1, true, start, arc);
    g.translate(0, (hi + lo) / 2, 0); b.put(g, mat);
  };
  const paneRow = (radius, lo, hi) => {
    const bays = near ? 6 : 3, da = Math.PI * 2 / 12;
    for (let pier = 0; pier < 12; pier++) {
      const start = pier * da, pw = 0.34 / radius;
      side('wall', radius, lo, hi, start - pw / 2, pw);
      for (let pane = 0; pane < bays; pane++) {
        const w = (da - pw) / bays, a = start + pw / 2 + pane * w;
        const mw = (near ? 0.075 : 0.10) / radius;
        side('glass', radius, lo, hi, a + mw, w - mw);
        side('metal', radius, lo, hi, a, mw);
      }
    }
  };
  // Studio wing and north link, bounded by the mapped building:part ring.
  const toLocal = ([lng, lat]) => [(lng - SPEC.origin[0]) * 111320 * Math.cos(SPEC.origin[1] * Math.PI / 180), -(lat - SPEC.origin[1]) * 111320];
  const points = FOOTPRINTS[2].slice(0, -1).map(toLocal);
  // Cut the recessed Vine Street doorway into the studio frontage.
  const west = points.findIndex(([x,z], i) => x < -15 && z < 1 && points[i+1]?.[1] > 30);
  points.splice(west + 1, 0, [-15.25,3], [-12,3], [-12,13], [-15.25,13]);
  const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
  const podium = new THREE.ExtrudeGeometry(shape, { depth: 5.4, bevelEnabled: false, steps: 1 });
  podium.rotateX(-Math.PI / 2); b.put(podium, 'wall');
  // Smaller first exposed level: 78 ft across versus 92 ft above.
  side('wall', 11.8872, 0, 5.4);
  paneRow(11.8872, 5.4, 8.48);
  const pitch = (45.72 - 8.76) / 11;
  for (let floor = 0; floor < 11; floor++) {
    const y = 8.76 + floor * pitch, top = y + pitch;
    side('wall', SPEC.towerRadius, y, y + 1.0);
    paneRow(SPEC.towerRadius, y + 1.0, top);
  }
  // Twelve porcelain-enamel eyelid awnings: thin sloping annuli, not discs.
  for (let i = 0; i < 12; i++) {
    const y = 8.76 + i * pitch;
    const profile = i === 0
      ? [[0,8.48],[14.0208,8.48],[15.4,y-1.04],[15.4,y-0.84],[14.0208,y+0.18],[0,y+0.18]]
      : [[14.0208,y-0.02],[15.4,y-1.04],[15.4,y-0.84],[14.0208,y+0.18],[14.0208,y-0.02]];
    ring('white', profile);
  }
  ring('roof', [[0, 45.72], [14.0208, 45.72], [14.0208, 45.92], [0, 45.92]]);
  ring('metal', [[0, 45.92], [9.7, 45.92], [9.7, 46.6], [9.1, 46.95], [0, 46.95]]);
  ring('roof', [[0, 46.95], [9.9, 46.95], [9.9, 49.05], [0, 49.05]]);
  ring('white', [[9.9, 46.95], [10.1, 46.95], [10.1, 47.12], [9.9, 47.12]]);
  ring('white', [[9.9, 48.88], [10.1, 48.88], [10.1, 49.05], [9.9, 49.05]]);
  lettering(b);
  // Broad-based triangular spire at the NW roof quadrant, embedded in roof.
  const spire = new THREE.CylinderGeometry(0.065, 0.90, 24.794, 3, 1, false);
  spire.translate(-3.2, 45.72 + 24.794 / 2, -3.2); b.put(spire, 'metal');
  const beacon = new THREE.SphereGeometry(0.20, near ? 8 : 6, 4);
  beacon.translate(-3.2, 70.514, -3.2); b.put(beacon, 'glow');
  // Shallow entrance vestibule at the Vine-facing mapped notch.
  b.box('glass', [-12.65, 1.8, 8.1], [0.22, 3.6, 4.2]);
  b.box('metal', [-12.95, 1.8, 8.1], [0.18, 3.6, 0.14]);
  b.box('white', [-13.5, 3.85, 8.1], [3.2, 0.3, 4.5]);
  if (near) for (const z of [-18, -21]) b.box('metal', [10, 6.0, z], [3, 1.2, 2]);
  const group = b.finish();
  group.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return group;
}
