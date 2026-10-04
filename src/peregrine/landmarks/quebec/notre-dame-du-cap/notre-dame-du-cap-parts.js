// Helpers for the Basilique Notre-Dame-du-Cap model. Everything is authored in the BUILDING frame (x to the viewer's right in front of the
// portal, y up, z toward the portal, origin on the octagon's axis); geometry.js turns it onto the mapped outline. A "facet frame" is the
// frame of the portal side (+z) rotated by a multiple of 45 degrees about y: the octagon has eight such sides.
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SPEC } from './config.js';

export const ROT = (-SPEC.axisDeg * Math.PI) / 180;
export const TAN = Math.tan(Math.PI / 8);
export const COS = Math.cos(Math.PI / 8);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Flat-shaded polygon soup. Points are given in the facet frame and turned by `phi` about y as they are added. */
export class Soup {
  constructor(phi = 0) { this.pos = []; this.phi = phi; }
  rot(p) {
    if (!this.phi) return p;
    const c = Math.cos(this.phi), s = Math.sin(this.phi);
    return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
  }
  /** A triangle whose normal points along `hint` (mode 'dir') or away from the interior point `hint` (mode 'in'). */
  tri(a, b, c, hint, mode = 'dir') {
    a = this.rot(a); b = this.rot(b); c = this.rot(c); hint = this.rot(hint);
    const n = cross(sub(b, a), sub(c, a));
    if (Math.hypot(...n) < 1e-9) return;
    const ref = mode === 'dir' ? hint : sub([(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3], hint);
    if (dot(n, ref) < 0) [b, c] = [c, b];
    this.pos.push(...a, ...b, ...c);
  }
  /** A convex planar polygon (fan from the first point). */
  poly(pts, hint, mode = 'dir') { for (let i = 1; i < pts.length - 1; i++) this.tri(pts[0], pts[i], pts[i + 1], hint, mode); }
  /** A simple (possibly concave) polygon in the plane z = `z` of the facet frame, from 2D points. */
  shape(pts2, z, hint = [0, 0, 1]) {
    const v = pts2.map(([x, y]) => new THREE.Vector2(x, y));
    for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(v, [])) this.tri([v[a].x, v[a].y, z], [v[b].x, v[b].y, z], [v[c].x, v[c].y, z], hint);
  }
  get empty() { return !this.pos.length; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.computeVertexNormals();
    return mergeVertices(g, 1e-4);
  }
}

/** A non-indexed geometry without its zero-area triangles (the poles of a lathe, collapsed extrusion faces), flat-shaded. */
function dropDegenerate(g) {
  const p = g.attributes.position.array, out = [];
  for (let i = 0; i < p.length; i += 9) {
    const a = [p[i], p[i + 1], p[i + 2]], b = [p[i + 3], p[i + 4], p[i + 5]], c = [p[i + 6], p[i + 7], p[i + 8]];
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < 1e-6) continue;
    for (let k = 0; k < 9; k++) out.push(p[i + k]);
  }
  const r = new THREE.BufferGeometry();
  r.setAttribute('position', new THREE.Float32BufferAttribute(out, 3)); r.computeVertexNormals();
  return mergeVertices(r, 1e-4);
}

/** Flat-shaded copy of a (smooth) three.js geometry. */
export function flat(g) {
  return dropDegenerate(g.index ? g.toNonIndexed() : g);
}

/** Regular octagonal prism with a flat face toward +z (a facet frame at phi = 0). Open ended, or with a top cap only (`caps`). */
export function octPrism(apothem, y0, y1, caps = false) {
  const r = apothem / COS, g = new THREE.CylinderGeometry(r, r, y1 - y0, 8, 1, !caps);
  g.rotateY(Math.PI / 8); g.translate(0, (y0 + y1) / 2, 0);
  if (!caps) return flat(g);
  const f = g.toNonIndexed(), p = f.attributes.position.array, out = [];
  for (let i = 0; i < p.length; i += 9) { // the bottom cap faces the ground and touches whatever stands on it: drop it
    if (Math.abs(p[i + 1] - y0) < 1e-5 && Math.abs(p[i + 4] - y0) < 1e-5 && Math.abs(p[i + 7] - y0) < 1e-5) continue;
    for (let k = 0; k < 9; k++) out.push(p[i + k]);
  }
  const r2 = new THREE.BufferGeometry();
  r2.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  return flat(r2);
}

/** Lancet (equilateral pointed arch) outline, base y0, springing yS, width w: [[x, y]], counter-clockwise. */
export function lancet(w, y0, yS, n = 4) {
  const pts = [[-w / 2, y0], [w / 2, y0], [w / 2, yS]];
  for (let i = 1; i <= n; i++) { const a = (i / n) * (Math.PI / 3); pts.push([-w / 2 + w * Math.cos(a), yS + w * Math.sin(a)]); }
  for (let i = n - 1; i >= 1; i--) { const a = (i / n) * (Math.PI / 3); pts.push([w / 2 - w * Math.cos(a), yS + w * Math.sin(a)]); }
  pts.push([-w / 2, yS]);
  return pts;
}
export const lancetTop = (w, yS) => yS + w * Math.sin(Math.PI / 3);

/** Parabolic arch outline from the left springing over the apex to the right springing: [[x, y]]. */
export function parabola(half, y0, apex, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    // denser near the apex, where the curvature is
    const t = i / n, x = half * Math.sign(t - 0.5) * Math.pow(Math.abs(2 * t - 1), 1.35);
    pts.push([x, apex - (apex - y0) * (x / half) ** 2]);
  }
  pts[0][0] = -half; pts[n][0] = half;
  return pts;
}

/** The portal tower: a tapering block through which the parabolic arch is cut. `depth` runs from z = z0 to z = z1 (front). */
export function towerBlock({ z0, z1, baseHalf, topHalf, top, archHalf, floorY, archApex, archN }) {
  const shape = new THREE.Shape([[-baseHalf, 0], [baseHalf, 0], [topHalf, top], [-topHalf, top]].map(([x, y]) => new THREE.Vector2(x, y)));
  shape.holes.push(new THREE.Path(parabola(archHalf, floorY, archApex, archN).map(([x, y]) => new THREE.Vector2(x, y))));
  const g = new THREE.ExtrudeGeometry(shape, { depth: z1 - z0, bevelEnabled: false, curveSegments: 1 });
  g.translate(0, 0, z0);
  const p = g.attributes.position.array, out = [];
  for (let i = 0; i < p.length; i += 9) { // drop the back cap: it lies inside the octagon's roof
    if (Math.abs(p[i + 2] - z0) < 1e-5 && Math.abs(p[i + 5] - z0) < 1e-5 && Math.abs(p[i + 8] - z0) < 1e-5) continue;
    for (let k = 0; k < 9; k++) out.push(p[i + k]);
  }
  const r = new THREE.BufferGeometry();
  r.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
  return dropDegenerate(r);
}

/** A flight of steps, `width` wide, from the plaza (y = 0) up to `top`, treads `tread` deep, the top step starting at z = zBack. */
export function stair({ zBack, width, top, steps, tread }) {
  const pts = [[zBack, 0]];
  const rise = top / steps;
  for (let k = 1; k <= steps; k++) {
    const z = zBack + tread * (steps - k + 1);
    pts.push([z, rise * (k - 1)], [z, rise * k]);
  }
  pts.push([zBack, top]);
  // profile in (-z, y); extruded along local z, which the quarter turn lays along x
  const shape = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(-z, y)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false, curveSegments: 1 });
  g.rotateY(Math.PI / 2); g.translate(-width / 2, 0, 0);
  return flat(g);
}

/** Deterministic pseudo-random in [0, 1). */
export const hash = (a, b, c) => { const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return s - Math.floor(s); };

/** Box from [x0,y0,z0] to [x1,y1,z1]. */
export function boxAB(x0, y0, z0, x1, y1, z1) {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return g;
}
