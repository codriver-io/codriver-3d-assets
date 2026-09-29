import * as THREE from 'three';

// Small mesh kit for the City Hall model. Everything returns a THREE.BufferGeometry with a normal
// attribute so assetBuilder.put() can merge it by material. Frame: +X east, +Y up, +Z south.

// Flat-shaded triangle soup. quad() takes a,b,c,d in any order that is a simple loop; `toward` (optional)
// is a point the face must face, which spares hand-checking every winding.
export class Soup {
  constructor() { this.p = []; }
  tri(a, b, c, toward) {
    if (toward) {
      const n = [(b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]), (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]), (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])];
      if (n[0] * (toward[0] - a[0]) + n[1] * (toward[1] - a[1]) + n[2] * (toward[2] - a[2]) < 0) [b, c] = [c, b];
    }
    this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  }
  quad(a, b, c, d, toward) { this.tri(a, b, c, toward); this.tri(a, c, d, toward); }
  get empty() { return this.p.length === 0; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.computeVertexNormals();
    return g;
  }
}

// A vertical prism over a polygon of [x, z] points (any winding), from y0 to y1.
export function prism(points, y0, y1) {
  const shape = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, steps: 1 });
  g.rotateX(-Math.PI / 2); g.translate(0, y0, 0);
  return g;
}

// A vertical ribbon along a polyline of [x, z], y0..y1, facing `toward` [x, y, z] at its first segment's middle.
export function ribbon(soup, points, y0, y1, toward) {
  for (let i = 0; i + 1 < points.length; i++) {
    const [ax, az] = points[i], [bx, bz] = points[i + 1];
    soup.quad([ax, y0, az], [bx, y0, bz], [bx, y1, bz], [ax, y1, az], toward);
  }
}

// A horizontal ribbon between two polylines (same count), facing up (dir 1) or down (-1).
export function flatStrip(soup, a, b, y, dir = 1) {
  const up = [0, y + dir * 10, 0];
  for (let i = 0; i + 1 < a.length; i++) {
    const p = [a[i][0], y, a[i][1]], q = [a[i + 1][0], y, a[i + 1][1]], r = [b[i + 1][0], y, b[i + 1][1]], s = [b[i][0], y, b[i][1]];
    soup.quad(p, q, r, s, [p[0], y + dir * 10, p[2]]);
  }
  return up;
}

// A rotated box in a general frame: `basis` = [ex, ey, ez] unit vectors in model space, size along each.
export function orientedBox(center, basis, size) {
  const g = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...basis[0]), new THREE.Vector3(...basis[1]), new THREE.Vector3(...basis[2]));
  m.setPosition(...center); g.applyMatrix4(m);
  return g;
}

// A solid of revolution about the Y axis from [r, y] points running along the profile with the outside
// on the right of travel; segments round the axis. Returns an indexed geometry with smooth normals.
export function lathe(profile, segments) {
  const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
  return g;
}

export function dispose(...geometries) { for (const g of geometries) g?.dispose(); }
