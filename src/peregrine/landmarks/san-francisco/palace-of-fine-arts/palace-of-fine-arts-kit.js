import * as THREE from 'three';

// Small modelling kit for the Palace of Fine Arts. Everything feeds the shared assetBuilder, so
// repeated parts (columns, capitals, pylons, beams) merge by material and never add a draw call.
// All coordinates are the model's local metres (+x east, +y up, +z south); angles are rotations
// about +y as THREE applies them (rotateY), so a block of length L along local +x at angle a runs
// along (cos a, 0, -sin a).
export function palaceKit(b, near) {
  const seg = (n, f = 0.5) => (near ? n : Math.max(3, Math.round(n * f)));

  // Axis-aligned or yawed block from y0 to y1 centred on (x, z): w along its local x, d along local z.
  function block(mat, x, z, y0, y1, w, d, yaw = 0) {
    if (y1 - y0 < 1e-4 || w < 1e-4 || d < 1e-4) return;
    b.box(mat, [x, (y0 + y1) / 2, z], [w, y1 - y0, d], yaw);
  }

  // A beam between two plan points at constant height: ends on (x0,z0) and (x1,z1), y0..y1, w thick.
  function beam(mat, x0, z0, x1, z1, y0, y1, w, extend = 0) {
    const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
    if (len < 1e-4) return;
    block(mat, (x0 + x1) / 2, (z0 + z1) / 2, y0, y1, len + extend, w, -Math.atan2(dz, dx));
  }

  // Round shaft from y0 to y1 with `n` sides (even). `flute` > 0 pulls every second vertex in by that
  // fraction of the radius, which reads as fluting from a distance for almost no triangles.
  function shaft(mat, x, z, y0, y1, rBase, rTop, n, flute = 0) {
    if (y1 - y0 < 1e-4) return;
    const g = new THREE.CylinderGeometry(rTop, rBase, y1 - y0, n, 1, true);
    if (flute > 0) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const ix = i % (n + 1);
        if (ix % 2 === 1 && ix !== n) { p.setX(i, p.getX(i) * (1 - flute)); p.setZ(i, p.getZ(i) * (1 - flute)); }
      }
      g.computeVertexNormals();
    }
    g.translate(x, (y0 + y1) / 2, z);
    b.put(g, mat);
  }

  // Frustum (capital body, finial, ...): radius rBottom at y0 to rTop at y1.
  function frustum(mat, x, z, y0, y1, rBottom, rTop, n, caps = true) {
    if (y1 - y0 < 1e-4) return;
    // caps: true = both ends, 'top' = top only (the bottom rests on something), false = open
    let g = new THREE.CylinderGeometry(rTop, rBottom, y1 - y0, n, 1, !caps);
    if (caps === 'top') {
      g = new THREE.CylinderGeometry(rTop, rBottom, y1 - y0, n, 1, false);
      const idx = g.index.array, keepIdx = [], pos = g.attributes.position;
      for (let i = 0; i < idx.length; i += 3) {
        const a = idx[i], c = idx[i + 1], d = idx[i + 2];
        if (!(pos.getY(a) < 0 && pos.getY(c) < 0 && pos.getY(d) < 0)) keepIdx.push(a, c, d); // drop the bottom fan only
      }
      g.setIndex(keepIdx);
    }
    g.translate(x, (y0 + y1) / 2, z);
    b.put(g, mat);
  }

  // Surface of revolution about the vertical axis through (x, z): pts [[radius, y], ...] bottom to top.
  function lathe(mat, x, z, pts, n, yawOffset = 0) {
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), n);
    if (yawOffset) g.rotateY(yawOffset);
    g.translate(x, 0, z);
    b.put(g, mat);
  }

  // A vertical slab with an arched opening cut through it, extruded `t` deep. The slab spans x in [-w/2, w/2]
  // and y in [y0, y1]; the opening has half-width a, springs at ySpring and crowns at yCrown. The panel's front
  // face looks toward +z before `yaw`, then it is moved to (cx, cz). `slab` is the local z of the front face
  // minus nothing: the slab occupies z in [-t, 0].
  function archWall(mat, cx, cz, yaw, w, y0, y1, t, arch) {
    const shape = new THREE.Shape([[-w / 2, y0], [w / 2, y0], [w / 2, y1], [-w / 2, y1]].map(([px, py]) => new THREE.Vector2(px, py)));
    if (arch) {
      const { half, spring, crown, bottom = y0 } = arch, n = seg(14, 0.58), pts = [[-half, bottom], [half, bottom], [half, spring]];
      const rise = crown - spring;
      for (let i = 1; i < n; i++) {
        const a = (i / n) * Math.PI;
        pts.push([half * Math.cos(a), spring + rise * Math.sin(a)]);
      }
      pts.push([-half, spring]);
      shape.holes.push(new THREE.Path(pts.map(([px, py]) => new THREE.Vector2(px, py))));
    }
    const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 1 });
    g.translate(0, 0, -t);
    g.rotateY(yaw);
    g.translate(cx, 0, cz);
    b.put(g, mat);
  }

  // Prism over a plan polygon [[x, z], ...] (counter-clockwise or not) from y0 to y1; no floor.
  function prism(matSide, matTop, pts, y0, y1) {
    // ShapeGeometry/Extrude work in (x, y); map plan z to -y so rotateX(-90deg) returns it to +z.
    const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
    const make = () => {
      const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, curveSegments: 1 });
      g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); return g;
    };
    const keep = (g, test) => {
      const n = g.attributes.normal, index = [];
      for (let i = 0; i + 2 < n.count; i += 3) if (test(n.getY(i))) index.push(i, i + 1, i + 2);
      g.setIndex(index); return g;
    };
    if (matSide) b.put(keep(make(), (a) => Math.abs(a) < 0.5), matSide);
    if (matTop) b.put(keep(make(), (a) => a > 0.99), matTop);
  }

  // Flat-shaded faces from corner lists; each face is wound so its normal has a positive dot with `hint`.
  // list: [[[x, y, z], ...], [hx, hy, hz]]
  function faces(mat, list) {
    const pos = [];
    for (const [pts, hint] of list) {
      const h = new THREE.Vector3(...hint);
      for (let i = 1; i + 1 < pts.length; i++) {
        let [p, q, r] = [pts[0], pts[i], pts[i + 1]];
        const a = new THREE.Vector3(...p), c = new THREE.Vector3(...q), d = new THREE.Vector3(...r);
        if (c.clone().sub(a).cross(d.clone().sub(a)).dot(h) < 0) [q, r] = [r, q];
        pos.push(...p, ...q, ...r);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    b.put(g, mat);
  }

  // A rectangular bar swept along the plan polyline `pts` ([[x, z], ...]), halfW each side of it, from y0 to y1.
  // Joints are mitred; both ends are capped. One merged mesh for the whole run.
  function sweep(mat, pts, halfW, y0, y1) {
    const n = pts.length, segN = [];
    for (let i = 0; i + 1 < n; i++) {
      const dx = pts[i + 1][0] - pts[i][0], dz = pts[i + 1][1] - pts[i][1], l = Math.hypot(dx, dz) || 1;
      segN.push([dz / l, -dx / l]); // plan normal of the segment (one side; "left")
    }
    const L = [], Rt = [];
    for (let i = 0; i < n; i++) {
      const a = segN[Math.max(0, i - 1)], c = segN[Math.min(segN.length - 1, i)];
      let nx = a[0] + c[0], nz = a[1] + c[1]; const nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl;
      const k = halfW / Math.max(0.4, nx * a[0] + nz * a[1]);
      L.push([pts[i][0] + nx * k, pts[i][1] + nz * k]); Rt.push([pts[i][0] - nx * k, pts[i][1] - nz * k]);
    }
    const out = [];
    for (let i = 0; i + 1 < n; i++) {
      const [lx, lz] = segN[i];
      out.push([[[L[i][0], y1, L[i][1]], [L[i + 1][0], y1, L[i + 1][1]], [Rt[i + 1][0], y1, Rt[i + 1][1]], [Rt[i][0], y1, Rt[i][1]]], [0, 1, 0]]);
      out.push([[[L[i][0], y0, L[i][1]], [L[i + 1][0], y0, L[i + 1][1]], [Rt[i + 1][0], y0, Rt[i + 1][1]], [Rt[i][0], y0, Rt[i][1]]], [0, -1, 0]]);
      out.push([[[L[i][0], y0, L[i][1]], [L[i + 1][0], y0, L[i + 1][1]], [L[i + 1][0], y1, L[i + 1][1]], [L[i][0], y1, L[i][1]]], [lx, 0, lz]]);
      out.push([[[Rt[i][0], y0, Rt[i][1]], [Rt[i + 1][0], y0, Rt[i + 1][1]], [Rt[i + 1][0], y1, Rt[i + 1][1]], [Rt[i][0], y1, Rt[i][1]]], [-lx, 0, -lz]]);
    }
    // end caps: hint along the bar's direction at each end
    const d0 = [pts[0][0] - pts[1][0], pts[0][1] - pts[1][1]], d1 = [pts[n - 1][0] - pts[n - 2][0], pts[n - 1][1] - pts[n - 2][1]];
    out.push([[[L[0][0], y0, L[0][1]], [Rt[0][0], y0, Rt[0][1]], [Rt[0][0], y1, Rt[0][1]], [L[0][0], y1, L[0][1]]], [d0[0], 0, d0[1]]]);
    out.push([[[L[n - 1][0], y0, L[n - 1][1]], [Rt[n - 1][0], y0, Rt[n - 1][1]], [Rt[n - 1][0], y1, Rt[n - 1][1]], [L[n - 1][0], y1, L[n - 1][1]]], [d1[0], 0, d1[1]]]);
    faces(mat, out);
  }

  return { seg, block, beam, shaft, frustum, lathe, archWall, prism, faces, sweep };
}
