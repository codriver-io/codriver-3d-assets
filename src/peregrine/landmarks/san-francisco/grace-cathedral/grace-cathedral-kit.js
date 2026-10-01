import * as THREE from 'three';

// Small shape kit for the cathedral. Everything is pushed through assetBuilder's `put` (one merged mesh per
// material). Panels are flat polygons lifted off the wall by the caller; solids are closed.
const ROT = { F: 0, B: Math.PI, E: Math.PI / 2, W: -Math.PI / 2 }; // wall normal: +z, -z, +x, -x
const vec = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y));

// Pointed (lancet) arch outline, centred on x = 0, standing on y = 0. `k` is the arc radius in widths:
// 1 is the equilateral arch, larger is sharper.
export function lancet(w, h, seg = 3, k = 1) {
  const R = k * w, a = Math.acos((R - w / 2) / R), rise = R * Math.sin(a), sy = Math.max(0, h - rise);
  const pts = sy > 0 ? [[-w / 2, 0], [w / 2, 0], [w / 2, sy]] : [[-w / 2, 0], [w / 2, 0]];
  for (let i = 1; i <= seg; i++) { const t = (i / seg) * a; pts.push([w / 2 - R + R * Math.cos(t), sy + R * Math.sin(t)]); }
  for (let i = seg - 1; i >= 0; i--) { const t = (i / seg) * a; pts.push([R - w / 2 - R * Math.cos(t), sy + R * Math.sin(t)]); }
  return pts;
}
export const disc = (r, seg = 12) => Array.from({ length: seg }, (_, i) => [r * Math.cos((i / seg) * Math.PI * 2), r * Math.sin((i / seg) * Math.PI * 2)]);

export function makeKit(b, near) {
  const put = (g, m) => b.put(g, m, 0, 0);
  const place = (g, side, s, y, off) => {
    g.rotateY(ROT[side]);
    if (side === 'F' || side === 'B') g.translate(s, y, off); else g.translate(off, y, s);
    return g;
  };
  const kit = {
    near, put,
    box: (m, x0, x1, y0, y1, z0, z1) => {
      const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); put(g, m);
    },
    // square pyramid, open base: `half` is half the side of the base square
    pyramid: (m, cx, cz, y0, y1, half) => {
      const g = new THREE.ConeGeometry(half * Math.SQRT2, y1 - y0, 4, 1, true); g.rotateY(Math.PI / 4); g.translate(cx, (y0 + y1) / 2, cz); put(g, m);
    },
    // four-sided frustum, open ends: half sizes at the bottom and the top
    frustum: (m, cx, cz, y0, y1, halfBottom, halfTop) => {
      const g = new THREE.CylinderGeometry(halfTop * Math.SQRT2, halfBottom * Math.SQRT2, y1 - y0, 4, 1, true); g.rotateY(Math.PI / 4); g.translate(cx, (y0 + y1) / 2, cz); put(g, m);
    },
    cyl: (m, cx, cz, y0, y1, rBottom, rTop, seg = 8, open = false, rot = 0) => {
      const g = new THREE.CylinderGeometry(rTop, rBottom, y1 - y0, seg, 1, open); g.rotateY(rot); g.translate(cx, (y0 + y1) / 2, cz); put(g, m);
    },
    // flat polygon on a wall: side F/B/E/W, s along the wall, y base, off = the wall-plane coordinate
    panel: (m, pts, side, s, y, off) => put(place(new THREE.ShapeGeometry(new THREE.Shape(vec(pts))), side, s, y, off), m),
    // flat polygon with a polygonal hole (a frame around an opening)
    panelRing: (m, outer, inner, side, s, y, off) => {
      const sh = new THREE.Shape(vec(outer)); sh.holes.push(new THREE.Path(vec(inner)));
      put(place(new THREE.ShapeGeometry(sh), side, s, y, off), m);
    },
    // flat rectangle with pointed openings (a dark liner behind a slab)
    panelHoles: (m, w, h, holes, side, s, y, off) => {
      const sh = new THREE.Shape(vec([[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]]));
      for (const pts of holes) sh.holes.push(new THREE.Path(vec(pts)));
      put(place(new THREE.ShapeGeometry(sh), side, s, y, off), m);
    },
    // slab with pointed openings: front face on the plane `off`, `thick` deep behind it
    slab: (m, w, h, thick, holes, side, s, y, off) => {
      const sh = new THREE.Shape(vec([[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]]));
      for (const pts of holes) sh.holes.push(new THREE.Path(vec(pts)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false }); g.translate(0, 0, -thick);
      put(place(g, side, s, y, off), m);
    },
    // small triangular gablet standing on a pier face: face centre (cx, cz), outward normal (nx, nz), `half` the pier half width
    gablet: (m, cx, cz, nx, nz, half, y0, hw, rise, depth) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec([[-hw, 0], [hw, 0], [0, rise]])), { depth: depth + 0.05, bevelEnabled: false });
      g.rotateY(Math.atan2(nx, nz)); g.translate(cx + nx * (half - 0.05), y0, cz + nz * (half - 0.05)); put(g, m);
    },
    // pointed arch order: a lancet-shaped band with a lancet hole, extruded `thick` behind the plane `off`
    archOrder: (m, outer, inner, thick, side, s, y, off) => {
      const sh = new THREE.Shape(vec(outer)); sh.holes.push(new THREE.Path(vec(inner)));
      const g = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false }); g.translate(0, 0, -thick);
      put(place(g, side, s, y, off), m);
    },
    // flat polygon on a wall of any bearing: (cx, y, cz) its base centre, (nx, nz) the outward normal
    panelAt: (m, pts, cx, y, cz, nx, nz) => {
      const g = new THREE.ShapeGeometry(new THREE.Shape(vec(pts))); g.rotateY(Math.atan2(nx, nz)); g.translate(cx, y, cz); put(g, m);
    },
    // flat polygon with a hole on a wall of any bearing (a pierced frame)
    panelRingAt: (m, outer, inner, cx, y, cz, nx, nz) => {
      const sh = new THREE.Shape(vec(outer)); sh.holes.push(new THREE.Path(vec(inner)));
      const g = new THREE.ShapeGeometry(sh); g.rotateY(Math.atan2(nx, nz)); g.translate(cx, y, cz); put(g, m);
    },
    // vertical prism over a plan polygon [[x, z], ...] from y0 to y1
    prism: (m, plan, y0, y1) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec(plan.map(([x, z]) => [x, -z]))), { depth: y1 - y0, bevelEnabled: false });
      g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); put(g, m);
    },
    // flat ring (annulus) as a thin solid: front face on `off`, `thick` deep behind it
    ring: (m, side, s, y, off, rIn, rOut, thick, seg = 24) => {
      const sh = new THREE.Shape(vec(disc(rOut, seg)));
      sh.holes.push(new THREE.Path(vec(disc(rIn, seg).reverse())));
      const g = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: false }); g.translate(0, 0, -thick);
      put(place(g, side, s, y, off), m);
    },
    // sawtooth stair block: `n` risers of `rise` and treads of `tread` climbing toward -z from the foot at zFoot,
    // then a landing `landing` deep, centred on x = 0 and `width` wide; the back (buried) face is at the landing's end
    stairs: (m, width, zFoot, n, rise, tread, landing) => {
      const pts = [[0, 0]];
      for (let i = 0; i < n; i++) { pts.push([i * tread, (i + 1) * rise], [(i + 1) * tread, (i + 1) * rise]); }
      pts.push([n * tread + landing, n * rise], [n * tread + landing, 0]);
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec(pts)), { depth: width, bevelEnabled: false });
      g.translate(0, 0, -width / 2); g.rotateY(Math.PI / 2); g.translate(0, 0, zFoot); put(g, m);
    },
    // triangular prism (a gable roof or a gable wall) with the ridge along z, base on y0, cross-section centred on xc
    gableZ: (m, xc, z0, z1, y0, hw, rise) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec([[-hw, 0], [hw, 0], [0, rise]])), { depth: z1 - z0, bevelEnabled: false });
      g.translate(xc, y0, z0); put(g, m);
    },
    // the same with the ridge along x, centred on z = zc
    gableX: (m, x0, x1, zc, y0, hw, rise) => {
      const g = new THREE.ExtrudeGeometry(new THREE.Shape(vec([[-hw, 0], [hw, 0], [0, rise]])), { depth: x1 - x0, bevelEnabled: false });
      g.rotateY(Math.PI / 2); g.translate(x0, y0, zc); put(g, m);
    },
    // bar between two points, rectangular section (w across, d deep)
    bar: (m, a, c, w, d = w) => {
      const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), dir = cv.clone().sub(av), len = dir.length();
      const g = new THREE.BoxGeometry(w, len, d);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
      g.translate(...av.add(cv).multiplyScalar(0.5).toArray()); put(g, m);
    },
  };
  return kit;
}
