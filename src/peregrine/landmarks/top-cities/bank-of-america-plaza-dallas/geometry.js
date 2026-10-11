import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { RINGS, TOPS } from './bank-of-america-plaza-dallas-parts.js';

// Closed stepped shell: differences provide only exposed roof terraces, so stacked
// levels have no buried, shared cap faces. Intersection trims OSM rounding discrepancies.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const polys = [polygonClipping.union([RINGS[0]])];
  for (const ring of RINGS.slice(1)) polys.push(polygonClipping.intersection(polys.at(-1), [ring]));
  function quad(points, material, normal) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
    g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals();
    const n = g.attributes.normal;
    if (n.getX(0) * normal[0] + n.getY(0) * normal[1] + n.getZ(0) * normal[2] < 0) g.setIndex([0, 2, 1, 0, 3, 2]);
    g.computeVertexNormals(); b.put(g, material);
  }
  function cap(multi, y, material, up = true) {
    for (const poly of multi) {
      const loops = poly.map(r => r.slice(0, -1).map(([x, z]) => new THREE.Vector2(x, z)));
      const tris = THREE.ShapeUtils.triangulateShape(loops[0], loops.slice(1));
      const points = loops.flat();
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(points.flatMap(p => [p.x, y, p.y]), 3));
      g.setIndex(tris.flatMap(t => up ? [t[0], t[2], t[1]] : t)); g.computeVertexNormals();
      // Earcut winding depends on the outer ring. Correct each cap explicitly.
      if (g.attributes.normal.getY(0) * (up ? 1 : -1) < 0) {
        g.setIndex(tris.flatMap(t => up ? t : [t[0], t[2], t[1]])); g.computeVertexNormals();
      }
      b.put(g, material);
    }
  }
  function edges(multi, fn) {
    for (const poly of multi) for (const ring of poly) {
      let area = 0;
      for (let i = 0; i < ring.length - 1; i++) area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i], c = ring[i + 1], dx = c[0] - a[0], dz = c[1] - a[1], len = Math.hypot(dx, dz);
        if (len < .02) continue;
        const n = area > 0 ? [dz / len, -dx / len] : [-dz / len, dx / len];
        fn(a, c, len, n, i);
      }
    }
  }
  cap(polys[0], 0, 'stone', false);
  polys.forEach((poly, level) => {
    const y0 = level ? TOPS[level - 1] : 0, y1 = TOPS[level];
    edges(poly, (a, c, len, n, edge) => {
      const at = (s, y, d = 0) => [a[0] + (c[0] - a[0]) * s / len + n[0] * d, y, a[1] + (c[1] - a[1]) * s / len + n[1] * d];
      const panel = (s0, s1, lo, hi, d, mat) => quad([at(s0, lo, d), at(s1, lo, d), at(s1, hi, d), at(s0, hi, d)], mat, [n[0], 0, n[1]]);
      panel(0, len, y0, y1, 0, 'glass');
      // Narrow grey marble floor bands, not a white stone tower.
      const pitch = 3.65, first = Math.max(1, Math.ceil((y0 - 8) / pitch));
      for (let floor = first; 8 + floor * pitch < y1 - .5; floor += near ? 1 : 2) {
        const y = 8 + floor * pitch;
        panel(.12, len - .12, y, y + (near ? .36 : .55), .16, 'band');
      }
      const bays = Math.max(1, Math.round(len / 1.85)), width = len / bays;
      if (near) {
        // Alternating glass reflections and thin per-storey mullions; merged quads.
        for (let k = 0; k < bays; k++) {
          const s = k * width;
          for (let floor = 0; floor < 75; floor++) {
            const lo = Math.max(y0 + .08, 8 + floor * pitch + .56), hi = Math.min(y1 - .35, 8 + (floor + 1) * pitch - .08);
            if (hi <= lo) continue;
            if ((k + edge) % 4 === 0) panel(s + .12, s + width - .12, lo, hi, .07, 'reflection');
            if ((floor * 17 + k * 31 + edge * 11) % 41 === 0) panel(s + .2, s + width - .2, lo + .15, hi - .12, .13, 'glow');
            if (k) panel(s - .04, s + .04, lo, hi, .23, 'mullion');
          }
        }
      }
      // Long strips illuminate the outside faceted corners and all crown steps.
      // Profile stays attached: part of the strip lies inside the shell.
      if (level === 0 && len > 2) b.bar('light', at(.18, .02, .08), at(.18, y1, .08), .25, .25, 0, true);
      b.bar('light', at(0, y1 - .26, .08), at(len, y1 - .26, .08), .25, .25, 0, true);
      if (level > 0) b.bar('light', at(.14, y0, .08), at(.14, y1 - .26, .08), .25, .25, 0, true);
      // Two-storey lobby piers and narrow entrances on the broad end walls.
      if (level === 0 && len > 20) {
        panel(.3, len - .3, 0, .75, .2, 'stone');
        for (let k = 1; k < Math.floor(len / 4.5); k++) {
          const s = k * 4.5;
          panel(s - .22, s + .22, .75, 8, .24, 'stone');
          if (near) {
            panel(s + .45, Math.min(len - .4, s + 2.6), .9, 3.7, .09, 'reflection');
            panel(s + 1.48, s + 1.56, 1, 3.65, .26, 'mullion');
            panel(s + .45, Math.min(len - .4, s + 2.6), 3.75, 3.92, .26, 'mullion');
          }
        }
      }
    });
    cap(level === polys.length - 1 ? poly : polygonClipping.difference(poly, polys[level + 1]), y1, 'roof');
  });
  const root = b.finish();
  root.traverse(o => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return root;
}
