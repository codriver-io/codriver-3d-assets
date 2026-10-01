import * as THREE from 'three';

// Small modelling kit for San Francisco City Hall. Everything is authored in building axes
// (x = depth, +x toward the Polk Street front; y up; z along the Polk Street front) and
// rotated once, onto the mapped grid, when a piece is handed to the asset builder.
//
// A "wall frame" is a local (s, y, d) system standing on one facade: s runs left to right
// seen from outside, d is the distance outward from the facade's base plane.

const UP = new THREE.Vector3(0, 1, 0);

export function makeKit(b, rotation, near) {
  const R = new THREE.Matrix4().makeRotationY(rotation);
  // far folds the minor gilded details (string course) into the self-lit gold so the far model stays at 8 draws or fewer
  const put = (geometry, material, matrix) => { if (!near && material === 'gold') material = 'lamp'; if (matrix) geometry.applyMatrix4(matrix); geometry.applyMatrix4(R); b.put(geometry, material); };

  /** Axis-aligned box from min/max in building axes. */
  const wbox = (mat, x0, x1, y0, y1, z0, z1) => {
    put(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), mat);
  };

  /** A frame standing on a facade: base plane through (x0, z0) facing outward at angle phi (0 = +x, pi/2 = +z). */
  function frame(x0, z0, phi) {
    const c = Math.cos(phi), s = Math.sin(phi);
    const M = new THREE.Matrix4().makeBasis(new THREE.Vector3(s, 0, -c), UP, new THREE.Vector3(c, 0, s)).setPosition(x0, 0, z0);
    const f = {
      M,
      /** box between s0..s1, y0..y1, d0..d1 */
      box(mat, s0, s1, y0, y1, d0, d1) {
        put(new THREE.BoxGeometry(s1 - s0, y1 - y0, d1 - d0).translate((s0 + s1) / 2, (y0 + y1) / 2, (d0 + d1) / 2), mat, M);
      },
      /** vertical panel facing outward at depth d */
      quad(mat, s0, s1, y0, y1, d) {
        put(new THREE.PlaneGeometry(s1 - s0, y1 - y0).translate((s0 + s1) / 2, (y0 + y1) / 2, d), mat, M);
      },
      /** round-headed opening panel: width w, total height h, bottom y0, centre s */
      arch(mat, s, y0, w, h, d) {
        const r = w / 2, spring = y0 + h - r, n = near ? 6 : 3, pts = [new THREE.Vector2(s - r, y0), new THREE.Vector2(s + r, y0), new THREE.Vector2(s + r, spring)];
        for (let i = 1; i < n; i++) { const a = (i * Math.PI) / n; pts.push(new THREE.Vector2(s + r * Math.cos(a), spring + r * Math.sin(a))); }
        pts.push(new THREE.Vector2(s - r, spring));
        put(new THREE.ShapeGeometry(new THREE.Shape(pts)).translate(0, 0, d), mat, M);
      },
      /** round medallion facing outward at depth d */
      disc(mat, s, y, r, d) {
        put(new THREE.CircleGeometry(r, near ? 12 : 6).translate(s, y, d), mat, M);
      },
      /** vertical column on the ground-line s, depth d, from y0 to y1 */
      col(mat, s, d, y0, y1, r, sides = near ? 8 : 4) {
        put(new THREE.CylinderGeometry(r, r * 1.05, y1 - y0, sides, 1, true).translate(s, (y0 + y1) / 2, d), mat, M);
      },
      /** triangular pediment prism: base y, apex y+rise, between s0..s1, d0..d1 */
      pediment(mat, s0, s1, y, rise, d0, d1) {
        const shape = new THREE.Shape([new THREE.Vector2(s0, y), new THREE.Vector2(s1, y), new THREE.Vector2((s0 + s1) / 2, y + rise)]);
        put(new THREE.ExtrudeGeometry(shape, { depth: d1 - d0, bevelEnabled: false, steps: 1 }).translate(0, 0, d0), mat, M);
      },
    };
    return f;
  }

  /** Regular polygon prism around the vertical axis through (cx, cz), radius to the corners r. */
  function prism(mat, cx, cz, r, sides, y0, y1, phase = 0, rTop = r) {
    const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, sides, 1, false);
    g.rotateY(phase); g.translate(cx, (y0 + y1) / 2, cz);
    put(g, mat);
  }

  /** Surface of revolution through (radius, y) points, about the vertical axis through (cx, cz). */
  function lathe(mat, cx, cz, profile, segments, phase = 0) {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments, phase);
    g.translate(cx, 0, cz);
    put(g, mat);
  }

  /** Thin bar between two points (square section), for ribs and ornaments. */
  function bar(mat, a, c, w, d = w) {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), dir = cv.clone().sub(av), len = dir.length();
    if (len < 1e-5) return;
    const g = new THREE.BoxGeometry(w, len, d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray());
    put(g, mat);
  }

  return { put, wbox, frame, prism, lathe, bar };
}
