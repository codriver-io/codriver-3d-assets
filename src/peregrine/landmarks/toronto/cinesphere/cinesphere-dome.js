import * as THREE from 'three';

// The Cinesphere's triodetic shell: a class-I geodesic sphere (icosahedron with a
// vertex at the zenith, every edge split `freq` ways and pushed out to the
// sphere) truncated by a horizontal plane below the equator, the way the real
// building sits like a ball in a cup at the lake. Aluminium tubes run along the
// geodesic edges at the tube radius, a light node cap sits at every hub, and a
// flat cladding panel fills each triangle a little inside the tubes.
//
// All lengths are metres, +Y up, the sphere centre is (0, cy, 0) relative to the
// build origin the caller passes as `at`.

const PHI = (1 + Math.sqrt(5)) / 2;

/** Unit-sphere geodesic: { nodes: Vector3[], edges: [i, j][], faces: [i, j, k][] }. */
export function geodesic(freq) {
  const t = PHI;
  const raw = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
    .map((v) => new THREE.Vector3(...v).normalize());
  const tri = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  // A vertex of the icosahedron becomes the zenith, so the top of the dome is a
  // five-way hub with horizontal rings under it, as photographed.
  const q = new THREE.Quaternion().setFromUnitVectors(raw[0], new THREE.Vector3(0, 1, 0));
  raw.forEach((v) => v.applyQuaternion(q));
  const nodes = [], index = new Map();
  const nodeAt = (p) => {
    const v = p.clone().normalize(), key = `${Math.round(v.x * 1e5)},${Math.round(v.y * 1e5)},${Math.round(v.z * 1e5)}`;
    if (!index.has(key)) { index.set(key, nodes.length); nodes.push(v); }
    return index.get(key);
  };
  const faces = [], seen = new Set(), edges = [];
  const edge = (a, b) => { const k = a < b ? `${a}:${b}` : `${b}:${a}`; if (!seen.has(k)) { seen.add(k); edges.push([a, b]); } };
  for (const [a, b, c] of tri) {
    const A = raw[a], B = raw[b], C = raw[c];
    const at = (i, j) => nodeAt(A.clone().multiplyScalar(freq - i - j).addScaledVector(B, i).addScaledVector(C, j));
    for (let i = 0; i < freq; i++) for (let j = 0; j < freq - i; j++) {
      const p = at(i, j), r = at(i + 1, j), s = at(i, j + 1);
      faces.push([p, r, s]);
      if (j < freq - i - 1) faces.push([r, at(i + 1, j + 1), s]);
    }
  }
  for (const [a, b, c] of faces) { edge(a, b); edge(b, c); edge(c, a); }
  return { nodes, edges, faces };
}

/** Clip a segment to y >= plane; null when entirely below. */
export function clipSegment(a, b, plane) {
  if (a.y < plane && b.y < plane) return null;
  const p = a.clone(), q = b.clone();
  if (p.y < plane) p.lerp(q, (plane - p.y) / (q.y - p.y));
  if (q.y < plane) q.lerp(a, (plane - q.y) / (a.y - q.y));
  return [p, q];
}

/** Sutherland-Hodgman against y >= plane for a convex polygon. */
export function clipPolygon(points, plane) {
  const out = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length], ain = a.y >= plane, bin = b.y >= plane;
    if (ain) out.push(a);
    if (ain !== bin) out.push(a.clone().lerp(b, (plane - a.y) / (b.y - a.y)));
  }
  return out;
}

/** Flat-shaded polygon (fan) with outward-facing normals from `centre`. */
export function facet(points, centre) {
  const positions = [], normals = [], indices = [];
  const n = new THREE.Vector3().subVectors(points[1], points[0]).cross(new THREE.Vector3().subVectors(points[2], points[0])).normalize();
  const mid = points.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(points.length);
  const flip = n.dot(mid.clone().sub(centre)) < 0;
  const order = flip ? [...points].reverse() : points;
  if (flip) n.negate();
  for (const p of order) { positions.push(p.x, p.y, p.z); normals.push(n.x, n.y, n.z); }
  for (let i = 1; i < order.length - 1; i++) indices.push(0, i, i + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setIndex(indices);
  return g;
}

// Design numbers (docs/3d-toronto-cinesphere.md): the mapped OSM ring is a 37.0 m circle
// and Triodetic gives a 37 m sphere, so the light caps reach a 18.5 m radius; tubes sit at
// 18.1 m and the cladding at 17.2 m (Wikipedia's 17 m inner radius). `cutDeg` (how far below
// the equator the ball is cut) and the height of the cut above the lake are photo estimates.
export const DOME = Object.freeze({
  tubeR: 18.1, capR: 18.5, panelR: 17.2, cutDeg: 40, baseY: 1.2,
  freqNear: 7, freqFar: 5,
});
export const domeCentreY = () => DOME.baseY + DOME.tubeR * Math.sin(DOME.cutDeg * Math.PI / 180);

/** Flat strip `2 * half` wide along a -> b, lying on the sphere about `centre` and facing outward. */
export function ribbon(a, c, centre, half) {
  const mid = a.clone().add(c).multiplyScalar(0.5), n = mid.clone().sub(centre).normalize();
  const side = new THREE.Vector3().subVectors(c, a).cross(n).normalize().multiplyScalar(half);
  const pts = [a.clone().sub(side), a.clone().add(side), c.clone().add(side), c.clone().sub(side)];
  const flat = pts.flatMap((p) => [p.x, p.y, p.z]), g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(flat, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(pts.flatMap(() => [n.x, n.y, n.z]), 3));
  const wind = new THREE.Vector3().subVectors(pts[1], pts[0]).cross(new THREE.Vector3().subVectors(pts[2], pts[0])).dot(n) >= 0;
  g.setIndex(wind ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
  return g;
}

/**
 * Adds the shell to the builder `b` centred on ground point [cx, cz] and
 * rotated `yaw` about the vertical so the pentagon-hub zenith pattern can be
 * turned to match photographs.
 */
export function buildDome(b, detail, cx, cz, yaw = 0) {
  const near = detail === 'near', freq = near ? DOME.freqNear : DOME.freqFar;
  const { nodes, edges, faces } = geodesic(freq);
  const cy = domeCentreY(), plane = DOME.baseY - cy; // clip plane relative to the centre
  const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const at = (v, r) => v.clone().multiplyScalar(r).applyQuaternion(rot);
  const shift = (v) => v.clone().add(new THREE.Vector3(cx, cy, cz));
  const centre = new THREE.Vector3(cx, cy, cz);
  // Cladding: one flat triangle per face, clipped at the base plane.
  for (const face of faces) {
    const ring = clipPolygon(face.map((i) => at(nodes[i], DOME.panelR)), plane);
    if (ring.length >= 3) b.put(facet(ring.map(shift), centre), 'panel');
  }
  // Tubes along every geodesic edge above the plane. Far draws each as a flat ribbon at the tube radius, facing outward
  // (a 0.4 m line on a 37 m ball is a pixel or two at far range): 2 triangles where a 3-sided tube takes 6.
  const radius = near ? 0.11 : 0.2;
  for (const [i, j] of edges) {
    const seg = clipSegment(at(nodes[i], DOME.tubeR), at(nodes[j], DOME.tubeR), plane);
    if (!seg) continue;
    if (near) { b.bar('frame', shift(seg[0]).toArray(), shift(seg[1]).toArray(), radius, radius, 0, true); continue; }
    b.put(ribbon(shift(seg[0]), shift(seg[1]), centre, radius), 'frame');
  }
  // Hub caps: the lights the architects fixed at every node; self-lit at night.
  if (near) for (const v of nodes) {
    const p = at(v, DOME.capR - 0.2);
    if (p.y < plane + 0.4) continue;
    const q = shift(p), n = p.clone().normalize();
    const g = new THREE.BoxGeometry(0.42, 0.34, 0.42);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n));
    g.translate(q.x, q.y, q.z);
    b.put(g, 'glow');
  }
  return { cy, plane, centre };
}
