import * as THREE from 'three';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const theta = SPEC.rotationDeg * Math.PI / 180;
export function world([x, y, z]) { return [Math.cos(theta) * x + Math.sin(theta) * z, y, -Math.sin(theta) * x + Math.cos(theta) * z]; }
export function toLocal([lng, lat]) {
  const stretch = mercStretch(SPEC.origin[1]);
  const x = (lngToMercX(lng) - lngToMercX(SPEC.origin[0])) / stretch;
  const z = -(latToMercY(lat) - latToMercY(SPEC.origin[1])) / stretch;
  return [x * Math.cos(theta) - z * Math.sin(theta), x * Math.sin(theta) + z * Math.cos(theta)];
}

// Original solid/arch kit; components rotate into east/up/south before material batching.
export function kit(b, near) {
  const put = (g, mat, matrix) => {
    if (matrix) g.applyMatrix4(matrix);
    g.rotateY(theta);
    if (!g.index) g.setIndex(Array.from({ length: g.attributes.position.count }, (_, i) => i));
    const p = g.attributes.position, ids = g.index.array, keep = [], a = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3();
    for (let i = 0; i < ids.length; i += 3) {
      a.fromBufferAttribute(p, ids[i]); c.fromBufferAttribute(p, ids[i + 1]); d.fromBufferAttribute(p, ids[i + 2]);
      if (c.sub(a).cross(d.sub(a)).lengthSq() > 1e-12) keep.push(ids[i], ids[i + 1], ids[i + 2]);
    }
    g.setIndex(keep); b.put(g, mat);
  };
  const box = (mat, x, y, z, w, h, d) => put(new THREE.BoxGeometry(w, h, d).translate(x, y, z), mat);
  const lathe = (mat, x, z, profile, n) => put(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), n).translate(x, 0, z), mat);
  const bar = (mat, a, c, w) => {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...c), vector = end.clone().sub(start);
    const g = new THREE.BoxGeometry(w, vector.length(), w);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.normalize()));
    put(g.translate(...start.add(end).multiplyScalar(0.5).toArray()), mat);
  };
  function plan(mat, coords, y0, y1) {
    const g = new THREE.ExtrudeGeometry(new THREE.Shape(coords.map(([x, z]) => new THREE.Vector2(x, -z))), { depth: y1 - y0, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2).translate(0, y0, 0); put(g, mat);
  }
  function wedge(mat, x0, x1, z0, z1, eave, ridge) {
    const shape = new THREE.Shape([new THREE.Vector2(x0, eave), new THREE.Vector2(x1, eave), new THREE.Vector2((x0 + x1) / 2, ridge)]);
    put(new THREE.ExtrudeGeometry(shape, { depth: z1 - z0, bevelEnabled: false }).translate(0, 0, z0), mat);
  }
  function pediment(mat, x, z, width, y, rise, depth) {
    const shape = new THREE.Shape([new THREE.Vector2(x - width / 2, y), new THREE.Vector2(x + width / 2, y), new THREE.Vector2(x, y + rise)]);
    put(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }).translate(0, 0, z - depth), mat);
  }
  function archPath(s, y, w, h) {
    const r = w / 2, spring = y + h - r, points = [new THREE.Vector2(s - r, y), new THREE.Vector2(s + r, y), new THREE.Vector2(s + r, spring)];
    for (let i = 1; i <= (near ? 12 : 6); i++) {
      const a = Math.PI * i / (near ? 12 : 6); points.push(new THREE.Vector2(s + r * Math.cos(a), spring + r * Math.sin(a)));
    }
    return points;
  }
  function frame(x, z, yaw) {
    const matrix = new THREE.Matrix4().makeRotationY(yaw).setPosition(x, 0, z);
    return {
      box(mat, x0, x1, y0, y1, d0, d1) { put(new THREE.BoxGeometry(x1 - x0, y1 - y0, d1 - d0).translate((x0 + x1) / 2, (y0 + y1) / 2, (d0 + d1) / 2), mat, matrix); },
      arch(mat, s, y, w, h, d) { put(new THREE.ShapeGeometry(new THREE.Shape(archPath(s, y, w, h))).translate(0, 0, d), mat, matrix); },
      archTrim(mat, s, y, w, h, thickness, depth) {
        const shape = new THREE.Shape(archPath(s, y - thickness, w + thickness * 2, h + thickness * 2));
        shape.holes.push(new THREE.Path(archPath(s, y, w, h)));
        const g = near ? new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false }).translate(0, 0, depth) : new THREE.ShapeGeometry(shape).translate(0, 0, depth + 0.12);
        put(g, mat, matrix);
      },
      openWall(mat, width, y0, y1, holeW, holeY, holeH, thickness) {
        const shape = new THREE.Shape([new THREE.Vector2(-width / 2, y0), new THREE.Vector2(width / 2, y0), new THREE.Vector2(width / 2, y1), new THREE.Vector2(-width / 2, y1)]);
        shape.holes.push(new THREE.Path(archPath(0, holeY, holeW, holeH)));
        put(new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false }).translate(0, 0, -thickness), mat, matrix);
      },
    };
  }
  function flutedColumn(x, z, y0, y1, bottomR, topR) {
    const n = near ? 96 : 8, levels = near ? 5 : 1, P = [], I = [];
    for (let j = 0; j <= levels; j++) for (let i = 0; i <= n; i++) {
      const t = j / levels, a = i * Math.PI * 2 / n;
      const r = bottomR + (topR - bottomR) * t + Math.sin(t * Math.PI) * 0.016 - (near ? 0.034 * (1 + Math.cos(a * 24)) / 2 : 0);
      P.push(x + Math.sin(a) * r, y0 + (y1 - y0) * t, z + Math.cos(a) * r);
      if (j && i) { const q = (j - 1) * (n + 1) + i - 1, r0 = j * (n + 1) + i - 1; I.push(q, q + 1, r0, q + 1, r0 + 1, r0); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); put(g, 'trim');
  }
  function cross(x, y, z, height, w) { box('trim', x, y + height / 2, z, w, height, w); box('trim', x, y + height * 0.68, z, height * 0.5, w, w); }
  return { put, box, lathe, bar, plan, wedge, pediment, frame, flutedColumn, cross };
}
