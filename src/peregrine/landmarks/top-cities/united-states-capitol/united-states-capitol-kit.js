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
    const g = new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0).translate((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
    // Buried grade faces are unnecessary and would overlap other foundation masses.
    if (y0 < 0.01) { const idx=Array.from(g.index.array);g.setIndex([...idx.slice(0,18),...idx.slice(24)]);g.clearGroups(); }
    put(g,mat);
  };

  // Facade frame. phi is the outward normal in the x–z plane (0 = east). s runs left to right
  // as seen from outside; d is outward from the stone face.
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
        put(new THREE.PlaneGeometry(s1 - s0, y1 - y0).translate((s0 + s1) / 2, (y0 + y1) / 2, d), mat, M);
      },
      arch(mat, sC, y0, w, h, d) {
        const r = w / 2, spring = y0 + h - r, n = near ? 5 : 3;
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
          const shaft = new THREE.CylinderGeometry(r, r * 1.08, y1-y0+0.9, 4, 1, true);
          shaft.translate(sC,(y0+y1)/2+0.1,d);put(shaft,mat,M);return;
        }
        const shaft = new THREE.CylinderGeometry(r, r * 1.04, y1 - y0, n, 1, true);
        shaft.translate(sC, (y0 + y1) / 2, d);
        put(shaft, mat, M);
        const base = new THREE.CylinderGeometry(r * 1.28, r * 1.38, 0.64, n, 1, false);
        base.translate(sC, y0 - 0.02, d);
        put(base, mat, M);
        const cap = new THREE.CylinderGeometry(r * 1.42, r * 1.16, 0.7, n, 1, false);
        cap.translate(sC, y1 + 0.22, d);
        put(cap, mat, M);
      },
      pediment(mat, s0, s1, y, rise, d0, d1) {
        const shape = new THREE.Shape([
          new THREE.Vector2(s0, y), new THREE.Vector2(s1, y), new THREE.Vector2((s0 + s1) / 2, y + rise),
        ]);
        const g = new THREE.ExtrudeGeometry(shape, { depth: d1 - d0, bevelEnabled: false });
        g.translate(0, 0, d0);
        g.computeVertexNormals();
        put(g, mat, M);
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
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
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

  // Flat quad whose normal is `normal`, centred at `origin`.
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

  return { put, wbox, frame, prism, lathe, bar, quad, near };
}
