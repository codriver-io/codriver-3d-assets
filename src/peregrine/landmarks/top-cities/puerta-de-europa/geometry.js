import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// A sheared prism, rather than a rotated box: floor plates and both heliports stay horizontal.
// Every curtain-wall cell is an exposed quad; opaque joints replace glass, avoiding coplanar overlays.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const batches = new Map();
  const quad = (mat, pts, outward) => {
    const a = new THREE.Vector3(...pts[0]), c = new THREE.Vector3(...pts[1]).sub(a), d = new THREE.Vector3(...pts[2]).sub(a);
    if (c.cross(d).dot(new THREE.Vector3(...outward)) < 0) pts = [pts[3], pts[2], pts[1], pts[0]];
    if (!batches.has(mat)) batches.set(mat, []);
    batches.get(mat).push(...pts[0], ...pts[1], ...pts[2], ...pts[3]);
  };
  for (let ti = 0; ti < 2; ti++) {
    const t = SPEC.towers[ti], angle = t.gridDeg * Math.PI / 180, co = Math.cos(angle), si = Math.sin(angle);
    const slope = Math.tan(SPEC.leanDeg * Math.PI / 180) * t.lean;
    const xyz = (u, y, v) => {
      const s = u + slope * y;
      return [t.center[0] + s * co - v * si, y, t.center[1] + s * si + v * co];
    };
    const transform = (g) => {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) p.setXYZ(i, ...xyz(p.getX(i), p.getY(i), p.getZ(i)));
      g.computeVertexNormals(); return g;
    };
    const box = (mat, u, y, v, w, h, d) => {
      let g = new THREE.BoxGeometry(w, h, d).translate(u, y, v);
      // Grade bottoms and the heliport's buried underside never draw. Filter them before batching.
      if (Math.abs(y - h / 2) < .001 || Math.abs(y - h / 2 - 114.7) < .001) {
        const ids = [], index = g.index, normals = g.attributes.normal;
        for (let i = 0; i < index.count; i += 3) if (normals.getY(index.getX(i)) > -.9) ids.push(index.getX(i), index.getX(i + 1), index.getX(i + 2));
        g.setIndex(ids); g = g.toNonIndexed();
      }
      b.put(transform(g), mat);
    };
    // Faces: south, north, east, west in this tower's mapped grid.
    const dirs = [[-si, 0, co], [si, 0, -co], [co, -slope, si], [-co, slope, -si]];
    const at = (face, a, y, out = 0) => face < 2 ? xyz(a, y, (face === 0 ? 1 : -1) * (17.5 + out)) : xyz((face === 2 ? 1 : -1) * (17.5 + out), y, a);
    const wall = (mat, face, a0, a1, y0, y1, out = 0) => quad(mat, [at(face, a0, y0, out), at(face, a1, y0, out), at(face, a1, y1, out), at(face, a0, y1, out)], dirs[face]);
    const n = near ? 24 : 8, floors = near ? 26 : 13, pitch = SPEC.roofHeight / floors, module = 35 / n;
    for (let face = 0; face < 4; face++) {
      for (let k = 0; k < floors; k++) {
        const y0 = k * pitch, y1 = (k + 1) * pitch;
        const bottom = k === 0 ? 0 : (near ? 0.32 : 0.5), top = near ? 0.38 : 0.55;
        if (bottom) wall('spandrel', face, -17.5, 17.5, y0, y0 + bottom);
        wall('spandrel', face, -17.5, 17.5, y1 - top, y1);
        for (let j = 0; j < n; j++) {
          const a0 = -17.5 + j * module, a1 = a0 + module, mull = near ? 0.075 : 0.12;
          const lit = k > 0 && k < floors - 1 && ((j * 19 + k * 7 + ti * 11 + face * 17) % 29 < 4);
          if (lit && !near) {
            const middle = (y0 + y1) / 2;
            wall('glass', face, a0 + mull, a1 - mull, y0 + bottom, middle - .3);
            wall('spandrel', face, a0 + mull, a1 - mull, middle - .3, middle + .3);
            wall('light', face, a0 + mull, a1 - mull, middle + .3, y1 - top);
          } else wall(lit ? 'light' : 'glass', face, a0 + mull, a1 - mull, y0 + bottom, y1 - top);
          wall(near ? 'mullion' : 'spandrel', face, a0 - (j ? mull : 0), a0 + mull, y0 + bottom, y1 - top);
          if (j === n - 1) wall(near ? 'mullion' : 'spandrel', face, a1 - mull, a1, y0 + bottom, y1 - top);

        }
        // One merged transom across the facade instead of a separate bar per pane.
        if (near) wall('mullion', face, -17.5, 17.5, (y0 + y1) / 2 - 0.035, (y0 + y1) / 2 + 0.035, 0.055);
      }
    }
    quad('roof', [xyz(-17.5, 114.7, -17.5), xyz(17.5, 114.7, -17.5), xyz(17.5, 114.7, 17.5), xyz(-17.5, 114.7, 17.5)], [0, 1, 0]);
    quad('spandrel', [xyz(-17.5, 0, -17.5), xyz(17.5, 0, -17.5), xyz(17.5, 0, 17.5), xyz(-17.5, 0, 17.5)], [0, -1, 0]);
    // Silver perimeter columns and the centre stripe are structural facade bands, visibly in contact with glazing.
    for (const u of [-17.45, 17.45]) for (const v of [-17.45, 17.45]) box('metal', u, 57.3, v, 0.8, 114.6, 0.8);
    for (const v of [-17.51, 17.51]) {
      box('metal', 0, 57.35, v, 0.82, 114.7, 0.34);
      for (const y of [0.45, 38.23, 76.47, 114.2]) box('metal', 0, y, v, 34.3, 0.9, 0.34);
    }
    for (const u of [-17.51, 17.51]) {
      for (const y of [0.45, 38.23, 76.47, 114.2]) box('metal', u, y, 0, 0.34, 0.9, 34.3);
    }
    // One tall diagonal on each flank, crossed by the horizontal frame at thirds; opposite slopes make an X reading in oblique views.
    const ribbon = (face, a, y, c, z, width, mat = 'metal', out = 0.18) => {
      const len = Math.hypot(c - a, z - y), da = -(z - y) / len * width / 2, dy = (c - a) / len * width / 2;
      quad(mat, [at(face, a + da, y + dy, out), at(face, c + da, z + dy, out), at(face, c - da, z - dy, out), at(face, a - da, y - dy, out)], dirs[face]);
    };
    for (const face of [2, 3]) ribbon(face, -16.9, 0.7, 16.9, 114, 0.78);
    // Ground-level doors are inserted into the glass facade and carried by a slim entrance frame.
    box('metal', 0, 2.4, 17.62, 5.6, 0.22, 0.4);
    for (const u of [-2.7, 0, 2.7]) box('metal', u, 1.15, 17.62, 0.14, 2.3, 0.4);
    if (near) {
      for (const u of [-1.35, 1.35]) box('metal', u, 1.05, 17.77, 0.055, 0.65, 0.12);
    }
    // Roof-level rectangular helicopter pad: thin 0.2 m platform, coloured outline and geometric H.
    box('roof', 0, 114.775, 0, 25, 0.15, 25);
    const pad = ti === 0 ? 'blue' : 'red';
    for (const [u, v, w, d] of [[0, -11.7, 22.85, 0.55], [0, 11.7, 22.85, 0.55], [-11.7, 0, 0.55, 23.8], [11.7, 0, 0.55, 23.8]]) {
      quad(pad, [xyz(u - w / 2, 114.9, v - d / 2), xyz(u + w / 2, 114.9, v - d / 2), xyz(u + w / 2, 114.9, v + d / 2), xyz(u - w / 2, 114.9, v + d / 2)], [0, 1, 0]);
    }
    for (const [u, v, w, d] of [[-3, 0, 0.9, 9], [3, 0, 0.9, 9], [0, 0, 5.1, 0.9]]) quad('sign', [xyz(u - w / 2, 114.9, v - d / 2), xyz(u + w / 2, 114.9, v - d / 2), xyz(u + w / 2, 114.9, v + d / 2), xyz(u - w / 2, 114.9, v + d / 2)], [0, 1, 0]);
    // Original monoline letters, no font file/texture/borrowed logo. Tenant marks are approximate.
    const glyphs = {
      A: [[0, 0, .5, 1], [.5, 1, 1, 0], [.23, .45, .77, .45]],
      B: [[0, 0, 0, 1], [0, 1, .8, 1], [.8, 1, 1, .75], [1, .75, .8, .5], [.8, .5, 0, .5], [.8, .5, 1, .25], [1, .25, .8, 0], [.8, 0, 0, 0]],
      C: [[1, 1, 0, 1], [0, 1, 0, 0], [0, 0, 1, 0]],
      E: [[0, 0, 0, 1], [0, 1, 1, 1], [0, .5, .8, .5], [0, 0, 1, 0]],
      I: [[.5, 0, .5, 1]], K: [[0, 0, 0, 1], [0, .5, 1, 1], [0, .5, 1, 0]],
      L: [[0, 1, 0, 0], [0, 0, 1, 0]], N: [[0, 0, 0, 1], [0, 1, 1, 0], [1, 0, 1, 1]],
      R: [[0, 0, 0, 1], [0, 1, .8, 1], [.8, 1, 1, .75], [1, .75, .8, .5], [.8, .5, 0, .5], [.5, .5, 1, 0]],
      X: [[0, 0, 1, 1], [0, 1, 1, 0]],
    };
    const text = ti === 0 ? 'CAIXABANK' : 'REALIA', width = ti === 0 ? 22 : 23, step = width / text.length, letterW = step * .72;
    // Letters are split to either side of the centre stripe so they do not fight it.
    for (let i = 0; i < text.length; i++) {
      const x = -width / 2 + i * step;
      for (const [a, y, c, z] of glyphs[text[i]]) ribbon(0, x + a * letterW, 107.1 + y * 3, x + c * letterW, 107.1 + z * 3, near ? .24 : .3, 'sign', .36);
    }
  }
  for (const [name, positions] of batches) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); const indices = []; for (let i = 0; i < positions.length / 3; i += 4) indices.push(i, i + 1, i + 2, i, i + 2, i + 3);
    g.setIndex(indices); g.computeVertexNormals(); b.put(g, name);
  }
  const root = b.finish();
  root.traverse((n) => { if (n.isMesh) n.geometry.deleteAttribute('bridgeLift'); });
  root.userData.elevationDatum = MANIFEST_DATUM;
  return root;
}
const MANIFEST_DATUM = 'Rigid local lobby grade y=0; horizontal plates, no terrain baked into geometry.';
