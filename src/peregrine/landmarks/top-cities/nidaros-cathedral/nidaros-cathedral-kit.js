import * as THREE from 'three';

// Shape kit for Nidaros. Everything goes through assetBuilder.put (one mesh per material).
// West is -u. A shape is built in XY with +x to the right as you face the wall, then placed
// so its outward face sits on the stone.

export function lancet(w, h, seg = 4) {
  const R = w * 1.05;
  const a = Math.acos(Math.min(0.999, (R - w / 2) / R));
  const rise = R * Math.sin(a);
  const spring = Math.max(0, h - rise);
  const pts = [[-w / 2, 0], [w / 2, 0]];
  if (spring > 0.02) pts.push([w / 2, spring]);
  for (let i = 1; i <= seg; i++) {
    const t = (i / seg) * a;
    pts.push([w / 2 - R + R * Math.cos(t), spring + R * Math.sin(t)]);
  }
  for (let i = seg - 1; i >= 1; i--) {
    const t = (i / seg) * a;
    pts.push([-w / 2 + R - R * Math.cos(t), spring + R * Math.sin(t)]);
  }
  if (spring > 0.02) pts.push([-w / 2, spring]);
  return pts;
}

const vec = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y));

export function makeKit(b, near) {
  const put = (g, m) => { g.computeVertexNormals(); b.put(g, m, 0, 0); };
  const seg = near ? 8 : 3;

  // Shape XY (+x across, +y up), extruded toward the wall. `depth` is how far it bites into the stone.
  function place(g, face, across, y, plane, depth) {
    if (face === 'W') { g.rotateY(-Math.PI / 2); g.translate(plane + depth, y, across); }
    else if (face === 'E') { g.scale(-1, 1, 1); g.rotateY(Math.PI / 2); g.translate(plane - depth, y, across); }
    else if (face === 'S') { g.translate(across, y, plane - depth); }
    else { g.scale(-1, 1, 1); g.rotateY(Math.PI); g.translate(across, y, plane + depth); }
    return g;
  }

  function faceQuad(m, p0, p1, p2, p3) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...p0, ...p1, ...p2, ...p3], 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    put(g, m);
  }
  function faceTri(m, p0, p1, p2) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...p0, ...p1, ...p2], 3));
    g.setIndex([0, 1, 2]);
    put(g, m);
  }

  const kit = {
    near, seg,
    box(m, u0, u1, y0, y1, v0, v1) {
      if (u1 - u0 < 1e-3 || y1 - y0 < 1e-3 || v1 - v0 < 1e-3) return;
      const g = new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0);
      g.translate((u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2);
      put(g, m);
    },
    // Flat polygon on a wall. `plane` is the constant u (W/E) or v (N/S); `across` is the other.
    panel(m, pts, face, across, y, plane) {
      put(place(new THREE.ShapeGeometry(new THREE.Shape(vec(pts))), face, across, y, plane, 0), m);
    },
    disc(m, r, face, across, y, plane, n = near ? 20 : 10) {
      put(place(new THREE.CircleGeometry(r, n), face, across, y, plane, 0), m);
    },
    ring(m, rIn, rOut, face, across, y, plane, n = near ? 24 : 12) {
      put(place(new THREE.RingGeometry(rIn, rOut, n), face, across, y, plane, 0), m);
    },
    // Pointed arch frame, opening down to the baseline. Sits proud of `plane` by `proud`.
    arch(m, w, h, border, face, across, y, plane, proud = 0.12) {
      const outer = new THREE.Shape(vec(lancet(w, h, seg)));
      const inner = lancet(Math.max(0.2, w - border * 2), Math.max(0.4, h - border * 0.85), seg);
      outer.holes.push(new THREE.Path(vec(inner).reverse()));
      const g = new THREE.ExtrudeGeometry(outer, { depth: 0.16, bevelEnabled: false });
      put(place(g, face, across, y, plane - (face === 'W' || face === 'N' ? proud : -proud), 0.16), m);
    },
    lancetPanel(m, w, h, face, across, y, plane) {
      kit.panel(m, lancet(w, h, seg), face, across, y, plane);
    },
    pediment(m, w, h, face, across, y, plane, proud = 0.1) {
      const sh = new THREE.Shape(vec([[-w / 2, 0], [w / 2, 0], [0, h]]));
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.18, bevelEnabled: false });
      put(place(g, face, across, y, plane - (face === 'W' || face === 'N' ? proud : -proud), 0.18), m);
    },
    // Gable roof, ridge along u. Overhang is the caller's job. No underside, so it cannot flicker on the wall top.
    gable(m, u0, u1, v0, v1, y0, y1) {
      const vc = (v0 + v1) / 2;
      const nw = [u0, y0, v0], ne = [u1, y0, v0], sw = [u0, y0, v1], se = [u1, y0, v1];
      const rw = [u0, y1, vc], re = [u1, y1, vc];
      faceQuad(m, nw, rw, re, ne); // north slope, normal up-and-north
      faceQuad(m, sw, se, re, rw);
      faceTri(m, nw, sw, rw);
      faceTri(m, ne, re, se);
    },
    // Shed roof sloping from (vA, yA) up to (vB, yB), a thin slab.
    shed(m, u0, u1, vA, yA, vB, yB, thick = 0.32) {
      const f = (u, v, y) => [u, y, v];
      const drop = thick;
      faceQuad(m, f(u0, vA, yA), f(u0, vB, yB), f(u1, vB, yB), f(u1, vA, yA));
      faceQuad(m, f(u0, vA, yA - drop), f(u1, vA, yA - drop), f(u1, vB, yB - drop), f(u0, vB, yB - drop));
      faceQuad(m, f(u0, vA, yA), f(u1, vA, yA), f(u1, vA, yA - drop), f(u0, vA, yA - drop));
      faceQuad(m, f(u0, vB, yB), f(u0, vB, yB - drop), f(u1, vB, yB - drop), f(u1, vB, yB));
      faceQuad(m, f(u0, vA, yA), f(u0, vA, yA - drop), f(u0, vB, yB - drop), f(u0, vB, yB));
      faceQuad(m, f(u1, vA, yA - drop), f(u1, vA, yA), f(u1, vB, yB), f(u1, vB, yB - drop));
    },
    // West-facing stone gable (the screen triangle), with a little depth.
    screenGable(m, u, v, half, y0, rise, depth = 0.55) {
      const n = [u, y0, v - half], s = [u, y0, v + half], a = [u, y0 + rise, v];
      const n2 = [u + depth, y0, v - half], s2 = [u + depth, y0, v + half], a2 = [u + depth, y0 + rise, v];
      faceTri(m, n, s, a);
      faceTri(m, n2, a2, s2);
      faceQuad(m, n, a, a2, n2);
      faceQuad(m, s, s2, a2, a);
    },
    // Flats face ±u / ±v (a face toward the west front, not an edge).
    cone(m, u, v, y0, y1, radius, n = 8) {
      const g = new THREE.ConeGeometry(radius, y1 - y0, n, 1, true);
      g.rotateY(Math.PI / 2 - Math.PI / n);
      g.translate(u, (y0 + y1) / 2, v);
      put(g, m);
    },
    // Regular drum. `flat` is centre-to-flat. Open ends. Same flat alignment as cone.
    drum(m, u, v, y0, y1, flat, n = 8) {
      const r = flat / Math.cos(Math.PI / n);
      const g = new THREE.CylinderGeometry(r, r, y1 - y0, n, 1, true);
      g.rotateY(Math.PI / 2 - Math.PI / n);
      g.translate(u, (y0 + y1) / 2, v);
      put(g, m);
    },
    frustum(m, u, v, y0, y1, flat0, flat1, n = 8) {
      const c = Math.cos(Math.PI / n);
      const g = new THREE.CylinderGeometry(flat1 / c, flat0 / c, y1 - y0, n, 1, true);
      g.rotateY(Math.PI / 2 - Math.PI / n);
      g.translate(u, (y0 + y1) / 2, v);
      put(g, m);
    },
    // Half-round apse bulging toward +u. The diameter lies in the plane u = `u`.
    apse(m, u, v, y0, y1, r, n = near ? 8 : 5) {
      const g = new THREE.CylinderGeometry(r, r, y1 - y0, n * 2, 1, true, 0, Math.PI);
      g.translate(u, (y0 + y1) / 2, v);
      put(g, m);
      const cap = new THREE.CircleGeometry(r - 0.02, n * 2, -Math.PI / 2, Math.PI);
      cap.rotateX(-Math.PI / 2);
      cap.translate(u, y1 - 0.02, v);
      put(cap, m);
    },
    // Gable roof, ridge along v (transepts). No underside.
    gableAcross(m, u0, u1, v0, v1, y0, y1) {
      const uc = (u0 + u1) / 2;
      const ww = [u0, y0, v0], we = [u1, y0, v0], ew = [u0, y0, v1], ee = [u1, y0, v1];
      const rn = [uc, y1, v0], rs = [uc, y1, v1];
      faceQuad(m, ww, ew, rs, rn);
      faceQuad(m, we, rn, rs, ee);
      faceTri(m, ww, rn, we);
      faceTri(m, ew, ee, rs);
    },
    bar(m, a, c, w, d = w) {
      const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), dir = cv.clone().sub(av);
      const len = dir.length();
      if (len < 1e-3) return;
      const g = new THREE.BoxGeometry(w, len, d);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
      g.translate(...av.add(cv).multiplyScalar(0.5).toArray());
      put(g, m);
    },
    // Spoke lying in a west-facing wall, from r0 to r1 at `angle` (0 = up).
    spoke(m, face, across, y, plane, r0, r1, angle, thick = 0.11) {
      const g = new THREE.BoxGeometry(thick, r1 - r0, 0.06);
      g.translate(0, (r0 + r1) / 2, 0);
      g.rotateZ(angle);
      put(place(g, face, across, y, plane, 0), m);
    },
  };
  return kit;
}
