import * as THREE from 'three';

// Small shape kit for the basilica. Everything is pushed through assetBuilder's `put` (one merged mesh per material).
// Panels are flat polygons lifted off the wall by the caller; solids are closed. Authoring axes: x lateral, z along the
// nave (front on +z), y up.
const ROT = { F: 0, B: Math.PI, E: Math.PI / 2, W: -Math.PI / 2 }; // wall normal: +z, -z, +x, -x
const vec = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y));
const TAU = Math.PI * 2;

// Round-headed (Romanesque) arch outline of width w standing on yBase and springing at ySpring, centred on x = 0.
export function arch(w, ySpring, yBase, seg = 4) {
  const r = w / 2, s = ySpring - yBase, pts = [[-r, 0], [r, 0], [r, s]];
  for (let i = 1; i < seg; i++) { const a = (i / seg) * Math.PI; pts.push([r * Math.cos(a), s + r * Math.sin(a)]); }
  pts.push([-r, s]);
  return pts;
}
export const disc = (r, seg = 12) => Array.from({ length: seg }, (_, i) => [r * Math.cos((i / seg) * TAU), r * Math.sin((i / seg) * TAU)]);
export const rect = (w, h) => [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]];
export const shift = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
// A band following a round arch: outer radius ro, inner radius ri, springing at ySpring, legs down to yb (absolute y).
export function archBand(ro, ri, ySpring, yb, seg = 8) {
  const pts = [[-ro, yb], [-ro, ySpring]];
  for (let i = 1; i < seg; i++) { const a = Math.PI - (i / seg) * Math.PI; pts.push([ro * Math.cos(a), ySpring + ro * Math.sin(a)]); }
  pts.push([ro, ySpring], [ro, yb], [ri, yb], [ri, ySpring]);
  for (let i = 1; i < seg; i++) { const a = (i / seg) * Math.PI; pts.push([ri * Math.cos(a), ySpring + ri * Math.sin(a)]); }
  pts.push([-ri, ySpring], [-ri, yb]);
  return pts;
}
// A wall panel x0..x1 from yb to yt with a round-arched notch cut from its bottom edge (jamb half-width r, springing at ySpring).
export function archNotch(x0, x1, yb, yt, r, ySpring, seg = 8) {
  const pts = [[x0, yb], [-r, yb], [-r, ySpring]];
  for (let i = 1; i < seg; i++) { const a = Math.PI - (i / seg) * Math.PI; pts.push([r * Math.cos(a), ySpring + r * Math.sin(a)]); }
  pts.push([r, ySpring], [r, yb], [x1, yb], [x1, yt], [x0, yt]);
  return pts;
}

// face normals instead of smooth ones: one normal per triangle
const flat = (g) => { const f = g.toNonIndexed(); f.computeVertexNormals(); return f; };

export function makeKit(b, near) {
  const put = (g, m) => b.put(g, m, 0, 0);
  const place = (g, side, s, y, off) => {
    g.rotateY(ROT[side]);
    if (side === 'F' || side === 'B') g.translate(s, y, off); else g.translate(off, y, s);
    return g;
  };
  return {
    near, put,
    box: (m, x0, x1, y0, y1, z0, z1) => {
      const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); put(g, m);
    },
    // vertical cylinder / frustum; thetaStart/Length cut an arc (x = r sin t, z = r cos t): +x half = (0, PI), rear (-z) half = (PI/2, PI)
    cyl: (m, cx, cz, y0, y1, rBottom, rTop, seg = 8, open = true, t0 = 0, tLen = TAU) => {
      const g = new THREE.CylinderGeometry(rTop, rBottom, y1 - y0, seg, 1, open, t0, tLen); g.translate(cx, (y0 + y1) / 2, cz); put(g, m);
    },
    sphere: (m, cx, cy, cz, r, seg = 8) => {
      const g = new THREE.SphereGeometry(r, seg, Math.max(3, seg >> 1)); g.translate(cx, cy, cz); put(g, m);
    },
    cone: (m, cx, cz, y0, y1, r, seg = 8, t0 = 0, tLen = TAU, rot = 0) => {
      const g = new THREE.ConeGeometry(r, y1 - y0, seg, 1, true, t0, tLen); g.rotateY(rot); g.translate(cx, (y0 + y1) / 2, cz); put(g, m);
    },
    // triangular prism (gable roof or gable wall), ridge along z, base on y0, cross-section centred on xc
    gableZ: (m, xc, z0, z1, y0, hw, rise) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec([[-hw, 0], [hw, 0], [0, rise]])), { depth: z1 - z0, bevelEnabled: false });
      g.translate(xc, y0, z0); put(g, m);
    },
    // the same with the ridge along x, centred on z = zc
    gableX: (m, x0, x1, zc, y0, hw, rise) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec([[-hw, 0], [hw, 0], [0, rise]])), { depth: x1 - x0, bevelEnabled: false });
      g.rotateY(Math.PI / 2); g.translate(x0, y0, zc); put(g, m);
    },
    // lean-to roof: a closed wedge from x0 to x1 over z0..z1, flat underside at yBase, top edge from yA (at x0) to yB (at x1)
    wedge: (m, x0, x1, yBase, yA, yB, z0, z1) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec([[x0, yBase], [x1, yBase], [x1, yB], [x0, yA]])), { depth: z1 - z0, bevelEnabled: false });
      g.translate(0, 0, z0); put(g, m);
    },
    // octagonal spire: a flat face looks toward +z (and +x), base circumradius r, tip at y1; every face is flat-shaded, so it
    // reads as an eight-sided pyramid and not as a smooth cone
    spire: (m, cx, cz, y0, y1, r, seg = 8) => {
      const g = flat(new THREE.ConeGeometry(r, y1 - y0, seg, 1, true)); g.rotateY(Math.PI / seg); g.translate(cx, (y0 + y1) / 2, cz); put(g, m);
    },
    // square pyramid with flat faces parallel to the axes (a pinnacle cap): base circumradius r
    pyramid: (m, cx, cz, y0, y1, r) => {
      const g = flat(new THREE.ConeGeometry(r, y1 - y0, 4, 1, true)); g.rotateY(Math.PI / 4); g.translate(cx, (y0 + y1) / 2, cz); put(g, m);
    },
    // flat polygon on a wall: side F/B/E/W, s along the wall, y base, off = the wall-plane coordinate (symmetric shapes)
    panel: (m, pts, side, s, y, off) => put(place(new THREE.ShapeGeometry(new THREE.Shape(vec(pts))), side, s, y, off), m),
    // flat polygon with a polygonal hole (a frame around an opening)
    panelRing: (m, outer, inner, side, s, y, off) => {
      const sh = new THREE.Shape(vec(outer)); sh.holes.push(new THREE.Path(vec(inner)));
      put(place(new THREE.ShapeGeometry(sh), side, s, y, off), m);
    },
    // closed polygon [[x, y], ...] extruded in z from z0 to z1 (a wall panel with a notch, a band)
    polyZ: (m, pts, z0, z1, holes = []) => {
      const sh = new THREE.Shape(vec(pts)); for (const h of holes) sh.holes.push(new THREE.Path(vec(h)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: z1 - z0, bevelEnabled: false }); g.translate(0, 0, z0); put(g, m);
    },
    // raised frame: the polygon (outer) with an optional hole (inner) stands `thick` proud of the wall plane `off`
    frame: (m, outer, inner, thick, side, s, y, off) => {
      const sh = new THREE.Shape(vec(outer)); if (inner) sh.holes.push(new THREE.Path(vec(inner)));
      put(place(new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false }), side, s, y, off), m);
    },
    // flat polygon on a wall of any bearing: (cx, y, cz) its base centre, (nx, nz) the outward normal
    panelAt: (m, pts, cx, y, cz, nx, nz) => {
      const g = new THREE.ShapeGeometry(new THREE.Shape(vec(pts))); g.rotateY(Math.atan2(nx, nz)); g.translate(cx, y, cz); put(g, m);
    },
    // flat polygon lying on a spire face (tilted by `tilt` radians from vertical), facing front (+z) or sideways (+-x)
    panelTilt: (m, pts, side, s, y, off, tilt) => {
      const g = new THREE.ShapeGeometry(new THREE.Shape(vec(pts))); g.rotateX(-tilt);
      put(place(g, side, s, y, off), m);
    },
    // sawtooth stair block: `n` risers of `rise` and treads of `tread` climbing toward -z from the foot at zFoot,
    // then a landing `landing` deep, centred on x = 0 and `width` wide
    stairs: (m, width, zFoot, n, rise, tread, landing) => {
      const pts = [[0, 0]];
      for (let i = 0; i < n; i++) { pts.push([i * tread, (i + 1) * rise], [(i + 1) * tread, (i + 1) * rise]); }
      pts.push([n * tread + landing, n * rise], [n * tread + landing, 0]);
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec(pts)), { depth: width, bevelEnabled: false });
      g.translate(0, 0, -width / 2); g.rotateY(Math.PI / 2); g.translate(0, 0, zFoot); put(g, m);
    },
    // bar between two points, rectangular section (w across, d deep)
    bar: (m, a, c, w, d = w) => {
      const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), dir = cv.clone().sub(av), len = dir.length();
      const g = new THREE.BoxGeometry(w, len, d);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
      g.translate(...av.add(cv).multiplyScalar(0.5).toArray()); put(g, m);
    },
  };
}
