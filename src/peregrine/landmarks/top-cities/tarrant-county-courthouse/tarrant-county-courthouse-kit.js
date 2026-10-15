import * as THREE from 'three';
import { ROT } from './tarrant-county-courthouse-plan.js';
// Plan-frame helpers: every primitive is authored in (X, y, Z) and rotated once into the world by ROT.
export function makeKit(b, near) {
  const put = (g, mat) => {
    if (!g.attributes.position.array.every(Number.isFinite)) throw new Error('Non-finite ' + mat + ' ' + g.type);
    g.rotateY(ROT); b.put(g, mat);
  };
  const box = (mat, x, y, z, w, h, d) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); put(g, mat); };
  const bar = (mat, a, c, w, d = w) => {
    const av = new THREE.Vector3(...a), bv = new THREE.Vector3(...c), dir = bv.clone().sub(av);
    if (dir.length() < 1e-5) return;
    const g = new THREE.BoxGeometry(w, dir.length(), d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
    g.translate(...av.add(bv).multiplyScalar(.5).toArray()); put(g, mat);
  };
  const cylinder = (mat, x, z, r, y0, y1, rt = r, n = near ? 10 : 6) => { const g = new THREE.CylinderGeometry(rt, r, y1 - y0, n, 1, false); g.translate(x, (y0 + y1) / 2, z); put(g, mat); };
  const lathe = (mat, profile, n = near ? 20 : 10, x = 0, z = 0) => { const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), n); g.translate(x, 0, z); put(g, mat); };
  const polygon = (mat, ring, y0, y1) => {
    const shape = new THREE.Shape(ring.map(([x, z]) => new THREE.Vector2(x, -z)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); put(g, mat);
  };
  // Flat glazing quad facing angle a (outward normal (sin a, cos a)); arched adds a half-round head.
  const window = (mat, x, y, z, w, h, a = 0, arched = false) => {
    const pts = arched ? [[-w / 2, 0], [w / 2, 0], ...[...Array(near ? 7 : 4)].map((_, i, arr) => { const t = i * Math.PI / (arr.length - 1); return [Math.cos(t) * w / 2, h - w / 2 + Math.sin(t) * w / 2]; })] : [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]];
    const g = new THREE.ShapeGeometry(new THREE.Shape(pts.map((p) => new THREE.Vector2(...p))));
    g.rotateY(a); g.translate(x, y, z); put(g, mat);
  };
  const disc = (mat, x, y, z, r, a) => { const g = new THREE.CircleGeometry(r, near ? 18 : 8); g.rotateY(a); g.translate(x, y, z); put(g, mat); };
  // Fluted-by-silhouette column: plinth, shaft, capital.
  const column = (x, z, y0, y1, r = .6, mat = 'column') => {
    cylinder(mat, x, z, r * 1.3, y0, y0 + .45, r * 1.3, near ? 8 : 5);
    cylinder(mat, x, z, r, y0 + .4, y1 - .6, r * .88, near ? 10 : 6);
    cylinder(mat, x, z, r * 1.35, y1 - .65, y1, r * 1.45, near ? 8 : 5);
  };
  const hip = (mat, x, z, w, d, y0, y1, topW = w * .6, topD = d * .65) => {
    const v = [x - w / 2, y0, z - d / 2, x + w / 2, y0, z - d / 2, x + w / 2, y0, z + d / 2, x - w / 2, y0, z + d / 2, x - topW / 2, y1, z - topD / 2, x + topW / 2, y1, z - topD / 2, x + topW / 2, y1, z + topD / 2, x - topW / 2, y1, z + topD / 2];
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    g.setIndex([0, 4, 1, 1, 4, 5, 1, 5, 2, 2, 5, 6, 2, 6, 3, 3, 6, 7, 3, 7, 0, 0, 7, 4, 4, 7, 5, 5, 7, 6, 0, 1, 3, 1, 2, 3]); g.computeVertexNormals(); put(g, mat);
  };
  // Gable roof: triangle across X, running from z0 to z1.
  const gable = (mat, x, w, z0, z1, base, peak) => {
    const shape = new THREE.Shape([new THREE.Vector2(-w / 2, base), new THREE.Vector2(w / 2, base), new THREE.Vector2(0, peak)]);
    const g = new THREE.ExtrudeGeometry(shape, { depth: Math.abs(z1 - z0), bevelEnabled: false }); g.translate(x, 0, Math.min(z0, z1)); put(g, mat);
  };
  // Pediment whose front face is at z, thickness depth, facing +Z (dir 1) or -Z (dir -1).
  const pediment = (x, z, w, base, peak, depth, dir = 1, mat = 'stone') => {
    const shape = new THREE.Shape([new THREE.Vector2(-w / 2, base), new THREE.Vector2(w / 2, base), new THREE.Vector2(0, peak)]);
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    if (dir > 0) g.translate(x, 0, z - depth); else { g.rotateY(Math.PI); g.translate(x, 0, z + depth); }
    put(g, mat);
    const o = dir * .12, rz = z + o;
    bar('trim', [x - w / 2, base + .15, rz], [x, peak + .15, rz], .5, .55);
    bar('trim', [x, peak + .15, rz], [x + w / 2, base + .15, rz], .5, .55);
    // tympanum relief: an inner raking moulding, a stepped oculus and (near) a row of modillions under the cornice
    const ro = z + dir * .26, h = peak - base, iw = w * .36;
    bar('trim', [x - iw, base + .9, ro], [x, base + h * .72, ro], .28, .3);
    bar('trim', [x, base + h * .72, ro], [x + iw, base + .9, ro], .28, .3);
    const oy = base + h * .36, or = Math.min(1.25, w * .07), ang = dir > 0 ? 0 : Math.PI;
    disc('trim', x, oy, z + dir * .14, or * 1.45, ang);
    disc('glass', x, oy, z + dir * .26, or, ang);
    if (near) for (let i = 0; i <= Math.round(w / 1.0); i++) box('trim', x - w / 2 + .4 + i * (w - .8) / Math.round(w / 1.0), base - .35, z + dir * .35, .34, .5, .5);
  };
  return { near, put, box, bar, cylinder, lathe, polygon, window, disc, column, hip, gable, pediment };
}
