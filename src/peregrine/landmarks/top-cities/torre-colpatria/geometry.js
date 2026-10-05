import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANGLE, site, OUTLINE, FACES } from './torre-colpatria-site.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const box = (mat, u, y, v, w, h, d, a = 0) => b.box(mat, site(u, y, v), [w, h, d], -(ANGLE + a));
  const onFace = (mat, f, s, y, d, w, h, t) => box(mat,
    f.c[0] + f.r[0] * s + f.n[0] * d, y,
    f.c[1] + f.r[1] * s + f.n[1] * d, w, h, t, Math.atan2(f.r[1], f.r[0]));
  const quad = (mat, f, s0, s1, y0, y1, d) => {
    const p = (s, y) => site(f.c[0] + f.r[0] * s + f.n[0] * d, y,
      f.c[1] + f.r[1] * s + f.n[1] * d);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([
      ...p(s0, y0), ...p(s1, y0), ...p(s1, y1), ...p(s0, y1)], 3));
    g.setIndex([0, 2, 1, 0, 3, 2]); // outward on this clockwise outline
    g.computeVertexNormals(); b.put(g, mat);
  };
  const prism = (mat, ring, y0, y1) => {
    const shape = new THREE.Shape(ring.map(([u, v]) => new THREE.Vector2(u, -v)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); g.rotateY(-ANGLE); b.put(g, mat);
  };

  // Closed glass tube, clipped at four corners, rooted at grade. The fins
  // penetrate the glass shell; spandrels and window divisions are offset quads.
  prism('glass', OUTLINE, 0, 191.3);
  const floor0 = 4, pitch = 3.76, floors = 50;
  for (let fi = 0; fi < FACES.length; fi++) {
    const f = FACES[fi], bay = f.len / f.bays, finW = f.len > 10 ? 0.69 : 0.73;
    for (let k = 0; k <= f.bays; k++) {
      const s = -f.len / 2 + k * bay;
      onFace('concrete', f, s, 96, 0.12, finW, 192, 0.8);
    }
    // Continuous centre mullions run behind the floor bands. The hidden lengths
    // cost less than separate geometry per pane while keeping the same visible grid.
    if (near) for (let k = 0; k < f.bays; k++) {
      const s = -f.len / 2 + (k + 0.5) * bay;
      quad('metal', f, s - 0.035, s + 0.035, 5.05, 191.15, 0.075);
    }
    for (let floor = 0; floor < floors; floor++) {
      const y = floor0 + floor * pitch;
      if (y + 0.75 > 191.1) continue;
      quad('spandrel', f, -f.len / 2, f.len / 2, y, y + 0.75, near ? 0.15 : 0.25);
      if (near) quad('metal', f, -f.len / 2, f.len / 2, y + 0.88, y + 0.98, 0.13);
      if (near) for (let k = 0; k < f.bays; k++) {
        const s = -f.len / 2 + (k + 0.5) * bay;
        if ((floor * 17 + k * 23 + fi * 7) % 61 === 0)
          quad('glow', f, s - 0.24, s + 0.24, y + 1.2, y + 2.65, 0.16);
      }
    }
    // Three chains of LED modules in each slot. Near retains module gaps;
    // far combines them into one strip. Yellow/blue/red are one night program.
    const bands = [['sign', 30, 68], ['lamp', 68, 106], ['light', 106, 182]];
    for (let k = 0; k < f.bays; k++) {
      const s = -f.len / 2 + (k + 0.5) * bay;
      for (const [mat, y0, y1] of bands) {
        if (!near) { quad(mat, f, s - 0.32, s + 0.32, y0, y1, 0.36); continue; }
        for (const du of [-0.26, 0, 0.26]) {
          const count = Math.ceil((y1 - y0) / 3), step = (y1 - y0) / count;
          for (let row = 0; row < count; row++)
            quad(mat, f, s + du - 0.11, s + du + 0.11,
              y0 + row * step, y0 + row * step + step * 0.95, 0.31);
        }
      }
    }
  }

  // Main roof 192 m, raised square helipad 196 m (OSM). No decorative spire.
  prism('roof', OUTLINE.map(([u, v]) => [u * 0.985, v * 0.985]), 191.22, 192);
  box('spandrel', -0.044, 193.65, 0.022, 21.35, 3.5, 20.85);
  box('concrete', -0.044, 195.675, 0.022, 21.58, 0.65, 21.07);
  const roofMark = (u, v, w, d) => {
    const g = new THREE.PlaneGeometry(w, d); g.rotateX(-Math.PI / 2);
    g.translate(u, 196.06, v); g.rotateY(-ANGLE); b.put(g, 'metal');
  };
  roofMark(-2.0, 0, 0.6, 5.5); roofMark(2.0, 0, 0.6, 5.5); roofMark(0, 0, 3.4, 0.6);
  if (near) {
    for (const f of FACES) {
      for (const y of [192.45, 193.1]) onFace('metal', f, 0, y, -0.38, f.len, 0.09, 0.09);
      const count = Math.ceil(f.len / 2.1);
      for (let i = 0; i <= count; i++) onFace('metal', f, -f.len / 2 + i * f.len / count,
        192.5, -0.38, 0.09, 1.2, 0.09);
    }
    for (const u of [-12.8, 12.8]) box('metal', u, 192.575, 0, 1.4, 1.25, 3.5);
  }
  // Jambs, transom and sill within the tower wall; no invented plaza clutter.
  // The south low-rise annex remains provider geometry.
  for (const fi of [0, 2]) {
    const f = FACES[fi];
    for (const s of [-2.0, 0, 2.0]) onFace('metal', f, s, 1.6, 0.18, 0.12, 3.2, 0.14);
    onFace('metal', f, 0, 3.2, 0.18, 4.1, 0.16, 0.14);
    onFace('concrete', f, 0, 0.12, 0.18, 4.1, 0.24, 0.6);
  }
  const root = b.finish();
  let triangles = 0;
  root.traverse(o => {
    if (!o.isMesh) return;
    const g = o.geometry, p = g.attributes.position, old = g.index, kept = [];
    // Ground bottoms are invisible and overlap beneath the tube/columns. Drop
    // them rather than retaining coplanar buried faces; exterior sides stay closed.
    for (let i = 0; i < old.count; i += 3) {
      const ids = [old.getX(i), old.getX(i + 1), old.getX(i + 2)];
      if (!ids.every(j => Math.abs(p.getY(j)) < 1e-6)) kept.push(...ids);
    }
    g.setIndex(kept); g.deleteAttribute('bridgeLift');
    triangles += g.index.count / 3;
  });
  root.userData.triangles = triangles;
  return root;
}
