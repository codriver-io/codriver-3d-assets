import * as THREE from 'three';
import { AXIS_S, BEARING } from './hotel-de-ville-de-montreal-plan.js';

// Modelling kit for the Hotel de Ville de Montreal. Everything is authored in BUILDING AXES (s along the front, y up, d outward from
// the front, a right-handed set) and rotated once onto east/up/south, here, when a piece goes to the asset builder: s runs at bearing
// BEARING, d at BEARING + 90. A "wall frame" is a local (a, y, e) system standing on one facade: a runs to the right as seen from
// outside, e is the distance outward from the facade's base plane.
const UP = new THREE.Vector3(0, 1, 0);

export function makeKit(b, near) {
  const sb = (BEARING * Math.PI) / 180;
  const S = new THREE.Vector3(Math.sin(sb), 0, -Math.cos(sb)), N = new THREE.Vector3(Math.cos(sb), 0, Math.sin(sb));
  const R = new THREE.Matrix4().makeBasis(S, UP, N).setPosition(S.clone().multiplyScalar(AXIS_S));
  const put = (geometry, material, matrix) => { if (matrix) geometry.applyMatrix4(matrix); geometry.applyMatrix4(R); b.put(geometry, material); };

  /** Box from min/max in building axes. */
  const gbox = (mat, s0, s1, y0, y1, d0, d1) => put(new THREE.BoxGeometry(s1 - s0, y1 - y0, d1 - d0).translate((s0 + s1) / 2, (y0 + y1) / 2, (d0 + d1) / 2), mat);

  /** Multi-ring hip roof over the rectangle [s0,s1] x [d0,d1]: rings are [y, inset] from the bottom up; the last ring is the flat cap. */
  function hip(mat, s0, s1, d0, d1, rings) {
    const pos = [], idx = [], ring = ([y, k]) => [[s0 + k, y, d0 + k], [s1 - k, y, d0 + k], [s1 - k, y, d1 - k], [s0 + k, y, d1 - k]];
    rings.forEach((r) => ring(r).forEach((v) => pos.push(...v)));
    for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, lo = r * 4, hi = (r + 1) * 4;
      idx.push(lo + i, hi + j, lo + j, lo + i, hi + i, hi + j);
    }
    const t = (rings.length - 1) * 4;
    idx.push(t, t + 2, t + 1, t, t + 3, t + 2);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
    const n = g.toNonIndexed(); n.computeVertexNormals();
    put(n, mat);
  }

  /** Vertical prism with `sides` faces round the axis through (s, d), radius r at the bottom, rTop at the top. */
  function cyl(mat, s, d, r, sides, y0, y1, rTop = r, phase = 0) {
    const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, sides, 1, false);
    g.rotateY(phase); g.translate(s, (y0 + y1) / 2, d); put(g, mat);
  }

  /** Surface of revolution through (radius, y) points (bottom to top) about the vertical axis through (s, d). */
  function lathe(mat, s, d, profile, segments) {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
    g.translate(s, 0, d); put(g, mat);
  }

  /** A frame standing on a facade: base plane through (s0, d0) facing outward at angle phi (0 = +d, pi/2 = +s, pi = -d, -pi/2 = -s). */
  function frame(s0, d0, phi) {
    const c = Math.cos(phi), s = Math.sin(phi);
    const M = new THREE.Matrix4().makeBasis(new THREE.Vector3(c, 0, -s), UP, new THREE.Vector3(s, 0, c)).setPosition(s0, 0, d0);
    return {
      /** box between a0..a1, y0..y1, e0..e1 */
      box(mat, a0, a1, y0, y1, e0, e1) { put(new THREE.BoxGeometry(a1 - a0, y1 - y0, e1 - e0).translate((a0 + a1) / 2, (y0 + y1) / 2, (e0 + e1) / 2), mat, M); },
      /** vertical panel facing outward at depth e */
      quad(mat, a0, a1, y0, y1, e) { put(new THREE.PlaneGeometry(a1 - a0, y1 - y0).translate((a0 + a1) / 2, (y0 + y1) / 2, e), mat, M); },
      /** round-headed panel: centre a, bottom y0, width w, total height h */
      arch(mat, a, y0, w, h, e, n = near ? 6 : 3) {
        const r = w / 2, spring = y0 + h - r, pts = [new THREE.Vector2(a - r, y0), new THREE.Vector2(a + r, y0), new THREE.Vector2(a + r, spring)];
        for (let i = 1; i < n; i++) { const t = (i * Math.PI) / n; pts.push(new THREE.Vector2(a + r * Math.cos(t), spring + r * Math.sin(t))); }
        pts.push(new THREE.Vector2(a - r, spring));
        put(new THREE.ShapeGeometry(new THREE.Shape(pts)).translate(0, 0, e), mat, M);
      },
      /** round dial facing outward */
      disc(mat, a, y, r, e) { put(new THREE.CircleGeometry(r, near ? 14 : 8).translate(a, y, e), mat, M); },
      /** vertical column on (a, e) from y0 to y1 */
      col(mat, a, e, y0, y1, r, sides = near ? 8 : 4) { put(new THREE.CylinderGeometry(r, r * 1.08, y1 - y0, sides, 1, true).translate(a, (y0 + y1) / 2, e), mat, M); },
      /** triangular pediment prism: base y, apex y + rise, between a0..a1, e0..e1 */
      pediment(mat, a0, a1, y, rise, e0, e1) {
        const shape = new THREE.Shape([new THREE.Vector2(a0, y), new THREE.Vector2(a1, y), new THREE.Vector2((a0 + a1) / 2, y + rise)]);
        put(new THREE.ExtrudeGeometry(shape, { depth: e1 - e0, bevelEnabled: false, steps: 1 }).translate(0, 0, e0), mat, M);
      },
      /** prism whose side profile is the polygon pts [e, y] (counter-clockwise), extruded across a0..a1 (stair cheeks, brackets) */
      prism(mat, a0, a1, pts) {
        const shape = new THREE.Shape(pts.map(([e, y]) => new THREE.Vector2(-e, y)));
        const g = new THREE.ExtrudeGeometry(shape, { depth: a1 - a0, bevelEnabled: false, steps: 1 }).translate(0, 0, a0).rotateY(Math.PI / 2);
        put(g, mat, M);
      },
    };
  }
  return { put, gbox, hip, cyl, lathe, frame };
}
