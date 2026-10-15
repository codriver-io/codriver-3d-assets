import * as THREE from 'three';

// Building axes (+X east, +Z south), rotated once onto the mapped walls.
const UP = new THREE.Vector3(0, 1, 0);

export function makeKit(b, rotation, near) {
  const R = new THREE.Matrix4().makeRotationY(rotation);
  const put = (geometry, material, matrix) => {
    if (matrix) geometry.applyMatrix4(matrix);
    geometry.applyMatrix4(R);
    b.put(geometry, material);
  };

  const wbox = (mat, x0, x1, y0, y1, z0, z1) => {
    if (x1 < x0) [x0, x1] = [x1, x0];
    if (y1 < y0) [y0, y1] = [y1, y0];
    if (z1 < z0) [z0, z1] = [z1, z0];
    if (x1 - x0 < 0.02 || y1 - y0 < 0.02 || z1 - z0 < 0.02) return;
    const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    if (y0 < 0.01) {
      const idx = Array.from(g.index.array);
      g.setIndex([...idx.slice(0, 18), ...idx.slice(24)]);
      g.clearGroups();
    }
    put(g, mat);
  };

  // Facade frame. phi is the outward normal in the x–z plane (0 = east).
  // s runs left to right as seen from outside; d is outward from the stone face.
  function frame(x0, z0, phi) {
    const c = Math.cos(phi), s = Math.sin(phi);
    const M = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(s, 0, -c), UP, new THREE.Vector3(c, 0, s),
    ).setPosition(x0, 0, z0);
    return {
      box(mat, s0, s1, y0, y1, d0, d1) {
        if (s1 < s0) [s0, s1] = [s1, s0];
        if (y1 < y0) [y0, y1] = [y1, y0];
        if (d1 < d0) [d0, d1] = [d1, d0];
        if (s1 - s0 < 0.02 || y1 - y0 < 0.02 || d1 - d0 < 0.02) return;
        put(new THREE.BoxGeometry(s1 - s0, y1 - y0, d1 - d0).translate((s0 + s1) / 2, (y0 + y1) / 2, (d0 + d1) / 2), mat, M);
      },
      quad(mat, s0, s1, y0, y1, d) {
        put(new THREE.PlaneGeometry(Math.abs(s1 - s0), Math.abs(y1 - y0)).translate((s0 + s1) / 2, (y0 + y1) / 2, d), mat, M);
      },
      arch(mat, sC, y0, w, h, d) {
        const r = w / 2, spring = y0 + h - r, n = near ? 6 : 4;
        const pts = [new THREE.Vector2(sC - r, y0), new THREE.Vector2(sC + r, y0), new THREE.Vector2(sC + r, spring)];
        for (let i = 1; i < n; i++) {
          const a = (i / n) * Math.PI;
          pts.push(new THREE.Vector2(sC + r * Math.cos(a), spring + r * Math.sin(a)));
        }
        pts.push(new THREE.Vector2(sC - r, spring));
        put(new THREE.ShapeGeometry(new THREE.Shape(pts)).translate(0, 0, d), mat, M);
      },
      col(mat, sC, d, y0, y1, r, sides) {
        const n = sides ?? (near ? 8 : 4);
        if (!near) {
          const shaft = new THREE.CylinderGeometry(r, r * 1.08, y1 - y0 + 0.9, 4, 1, true);
          shaft.translate(sC, (y0 + y1) / 2 + 0.1, d);
          put(shaft, mat, M);
          return;
        }
        const shaft = new THREE.CylinderGeometry(r, r * 1.04, y1 - y0, n, 1, true);
        shaft.translate(sC, (y0 + y1) / 2, d);
        put(shaft, mat, M);
        const base = new THREE.CylinderGeometry(r * 1.28, r * 1.38, 0.55, n, 1, false);
        base.translate(sC, y0 - 0.02, d);
        put(base, mat, M);
        const cap = new THREE.CylinderGeometry(r * 1.42, r * 1.16, 0.62, n, 1, false);
        cap.translate(sC, y1 + 0.18, d);
        put(cap, mat, M);
      },
    };
  }

  function prism(mat, cx, cz, r, sides, y0, y1, phase = 0, rTop = r) {
    const g = new THREE.CylinderGeometry(rTop, r, y1 - y0, sides, 1, false);
    g.rotateY(phase);
    g.translate(cx, (y0 + y1) / 2, cz);
    put(g, mat);
  }

  function lathe(mat, cx, cz, profile, segments) {
    const g = new THREE.LatheGeometry(profile.map(([rad, y]) => new THREE.Vector2(rad, y)), segments);
    g.translate(cx, 0, cz);
    put(g, mat);
  }

  function bar(mat, a, c, w, d = w) {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), dir = cv.clone().sub(av), len = dir.length();
    if (len < 1e-4) return;
    const g = new THREE.BoxGeometry(w, len, d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray());
    put(g, mat);
  }

  function quad(mat, origin, normal, width, height) {
    const n = normal.clone().normalize();
    let side = new THREE.Vector3().crossVectors(UP, n);
    if (side.lengthSq() < 1e-6) side = new THREE.Vector3(1, 0, 0);
    side.normalize();
    const up = new THREE.Vector3().crossVectors(n, side).normalize();
    const g = new THREE.PlaneGeometry(width, height);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(side, up, n));
    g.translate(origin.x, origin.y, origin.z);
    put(g, mat);
  }

  function flat(mat, x0, x1, z0, z1, y) {
    const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0);
    g.rotateX(-Math.PI / 2);
    g.translate((x0 + x1) / 2, y, (z0 + z1) / 2);
    put(g, mat);
  }

  // Hip (or pyramid) roof. Eaves sit just below the wall top so the slope
  // meets stone instead of sharing its horizontal cap.
  function hip(mat, x0, x1, z0, z1, y, rise) {
    const dx = x1 - x0, dz = z1 - z0;
    if (dx < 0.4 || dz < 0.4 || rise < 0.05) return;
    const inset = Math.min(dx, dz) * 0.5;
    let rx0, rx1, rz0, rz1;
    if (dx >= dz) {
      rx0 = x0 + inset; rx1 = x1 - inset; rz0 = rz1 = (z0 + z1) / 2;
    } else {
      rz0 = z0 + inset; rz1 = z1 - inset; rx0 = rx1 = (x0 + x1) / 2;
    }
    const ry = y + rise;
    // Flip any triangle whose normal points down, and drop a collapsed one.
    const tri = (a, b, c) => {
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2];
      const bx = c[0] - a[0], by = c[1] - a[1], bz = c[2] - a[2];
      const ny = az * bx - ax * bz;
      const area = Math.hypot(ay * bz - az * by, ny, ax * by - ay * bx);
      if (area < 1e-4) return;
      if (ny < 0) [b, c] = [c, b];
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
      g.setIndex([0, 1, 2]);
      g.computeVertexNormals();
      put(g, mat);
    };
    // South slope, north slope, then the two hip ends. A square plan collapses the ridge to a point.
    tri([x0, y, z1], [x1, y, z1], [rx1, ry, rz1]);
    if (rx1 - rx0 > 0.05) tri([x0, y, z1], [rx0, ry, rz0], [rx1, ry, rz1]);
    tri([x1, y, z0], [x0, y, z0], [rx0, ry, rz0]);
    if (rx1 - rx0 > 0.05) tri([x1, y, z0], [rx1, ry, rz1], [rx0, ry, rz0]);
    tri([x0, y, z0], [x0, y, z1], [rx0, ry, rz0]);
    if (rz1 - rz0 > 0.05) tri([x0, y, z1], [rx0, ry, rz1], [rx0, ry, rz0]);
    tri([x1, y, z1], [x1, y, z0], [rx1, ry, rz1]);
    if (rz1 - rz0 > 0.05) tri([x1, y, z0], [rx1, ry, rz0], [rx1, ry, rz1]);
  }

  return { put, wbox, frame, prism, lathe, bar, quad, flat, hip, near };
}
