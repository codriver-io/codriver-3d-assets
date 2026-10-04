import * as THREE from 'three';
import { ROTATION_DEG } from './st-pauls-cathedral-plan.js';

// Primitives in building axes (u east along the nave, y up, v south), rotated once onto
// east/up/south. A facade frame's s runs to the viewer's right, d grows outward.

const UP = new THREE.Vector3(0, 1, 0);
const R = new THREE.Matrix4().makeRotationY((ROTATION_DEG * Math.PI) / 180);

export function makeKit(b, near) {
  const put = (geometry, material, matrix) => {
    if (matrix) geometry.applyMatrix4(matrix);
    geometry.applyMatrix4(R);
    b.put(geometry, material);
  };

  function wbox(mat, u0, u1, y0, y1, v0, v1) {
    if (u1 - u0 < 1e-3 || y1 - y0 < 1e-3 || v1 - v0 < 1e-3) return;
    put(new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0).translate((u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2), mat);
  }

  function frame(u0, v0, phi) {
    const c = Math.cos(phi), s = Math.sin(phi);
    const M = new THREE.Matrix4().makeBasis(new THREE.Vector3(s, 0, -c), UP, new THREE.Vector3(c, 0, s)).setPosition(u0, 0, v0);
    return {
      box(mat, s0, s1, y0, y1, d0, d1) {
        if (s1 - s0 < 1e-3 || y1 - y0 < 1e-3 || d1 - d0 < 1e-3) return;
        put(new THREE.BoxGeometry(s1 - s0, y1 - y0, d1 - d0).translate((s0 + s1) / 2, (y0 + y1) / 2, (d0 + d1) / 2), mat, M);
      },
      quad(mat, s0, s1, y0, y1, d) {
        put(new THREE.PlaneGeometry(s1 - s0, y1 - y0).translate((s0 + s1) / 2, (y0 + y1) / 2, d), mat, M);
      },
      arch(mat, s, y0, w, h, d) {
        const r = w / 2, spring = y0 + h - r, n = near ? 6 : 3;
        const pts = [new THREE.Vector2(s - r, y0), new THREE.Vector2(s + r, y0), new THREE.Vector2(s + r, spring)];
        for (let i = 1; i < n; i++) {
          const a = (i * Math.PI) / n;
          pts.push(new THREE.Vector2(s + r * Math.cos(a), spring + r * Math.sin(a)));
        }
        pts.push(new THREE.Vector2(s - r, spring));
        put(new THREE.ShapeGeometry(new THREE.Shape(pts)).translate(0, 0, d), mat, M);
      },
      disc(mat, s, y, r, d, segs = near ? 14 : 8) {
        put(new THREE.CircleGeometry(r, segs).translate(s, y, d), mat, M);
      },
      col(mat, s, d, y0, y1, r, sides = near ? 8 : 5) {
        if (y1 - y0 < 1e-3) return;
        put(new THREE.CylinderGeometry(r, r * 1.05, y1 - y0, sides, 1, true).translate(s, (y0 + y1) / 2, d), mat, M);
      },
      pediment(mat, s0, s1, y, rise, d0, d1) {
        const shape = new THREE.Shape([new THREE.Vector2(s0, y), new THREE.Vector2(s1, y), new THREE.Vector2((s0 + s1) / 2, y + rise)]);
        put(new THREE.ExtrudeGeometry(shape, { depth: d1 - d0, bevelEnabled: false }).translate(0, 0, d0), mat, M);
      },
      // Annular arc in the facade plane. Angle 0 is +s, increasing toward +y. A strip, not a filled disc.
      band(mat, s, y, r0, r1, a0, a1, d0, d1) {
        const n = Math.max(3, Math.round((near ? 14 : 5) * ((a1 - a0) / Math.PI)));
        const at = (r, a) => new THREE.Vector2(s + Math.cos(a) * r, y + Math.sin(a) * r);
        const shape = new THREE.Shape();
        const p0 = at(r1, a0);
        shape.moveTo(p0.x, p0.y);
        for (let i = 1; i <= n; i++) {
          const p = at(r1, a0 + ((a1 - a0) * i) / n);
          shape.lineTo(p.x, p.y);
        }
        for (let i = n; i >= 0; i--) {
          const p = at(r0, a0 + ((a1 - a0) * i) / n);
          shape.lineTo(p.x, p.y);
        }
        shape.closePath();
        put(new THREE.ExtrudeGeometry(shape, { depth: d1 - d0, bevelEnabled: false }).translate(0, 0, d0), mat, M);
      },
    };
  }

  function cyl(mat, u, v, r, y0, y1, sides, rTop = r, open = false) {
    const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, sides, 1, open);
    g.translate(u, (y0 + y1) / 2, v);
    put(g, mat);
  }

  function lathe(mat, u, v, profile, segments) {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
    g.translate(u, 0, v);
    put(g, mat);
  }

  function col(mat, u, v, y0, y1, r, sides = near ? 8 : 5) {
    cyl(mat, u, v, r, y0, y1, sides, r * 1.04, true);
  }

  return { put, wbox, frame, cyl, lathe, col, near };
}
