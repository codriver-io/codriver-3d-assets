import * as THREE from 'three';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';

// Authoring frame: a west along the nave axis from the east front on Main Plaza, y up, s north across it (three x, y, z).
// The mapped outline runs 4.5° off east-west (long edges 4.4° and 4.5°), so the frame is turned 184.5° from
// east/south; FRONT is the centre of the mapped east edge of way 80647022 (its 22.5 m square-ended front).
export const ANGLE = 184.5 * Math.PI / 180, FRONT = [36.39, 4.31];
export const sitePoint = (a, y, s) => new THREE.Vector3(FRONT[0] + Math.cos(ANGLE) * a - Math.sin(ANGLE) * s, y, FRONT[1] + Math.sin(ANGLE) * a + Math.cos(ANGLE) * s);
// Mapped ring in the authoring frame [a, s].
export function mappedPlan(ring) {
  const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = latToMercY(SPEC.origin[1]);
  return ring.map(([lng, lat]) => {
    const x = (lngToMercX(lng) - ox) / k - FRONT[0], z = (oz - latToMercY(lat)) / k - FRONT[1];
    return [x * Math.cos(ANGLE) + z * Math.sin(ANGLE), -x * Math.sin(ANGLE) + z * Math.cos(ANGLE)];
  });
}
// Pointed (equilateral-ish) arch: width w, total height h, base on y=0 centred on x=0.
export function pointed(w, h) {
  const r = w / 2, hs = Math.max(0.01, h - w * 0.866), s = new THREE.Shape();
  s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, hs); s.absarc(-r, hs, w, 0, Math.PI / 3, false); s.absarc(r, hs, w, 2 * Math.PI / 3, Math.PI, false); s.lineTo(-r, 0);
  return s;
}
// Five-point gable-headed opening for the far LOD.
export function gabled(w, h) {
  const r = w / 2, hs = Math.max(0.01, h - w * 0.6);
  return new THREE.Shape([[-r, 0], [r, 0], [r, hs], [0, h], [-r, hs]].map(p => new THREE.Vector2(...p)));
}
export function round(w, h) {
  const r = w / 2, s = new THREE.Shape();
  s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, h - r); s.absarc(0, h - r, r, 0, Math.PI, false); s.lineTo(-r, 0);
  return s;
}
export const rect = (x, y, w, h) => new THREE.Shape([new THREE.Vector2(x - w / 2, y), new THREE.Vector2(x + w / 2, y), new THREE.Vector2(x + w / 2, y + h), new THREE.Vector2(x - w / 2, y + h)]);
export function circle(r, cx = 0, cy = 0) { const s = new THREE.Shape(); s.absarc(cx, cy, r, 0, Math.PI * 2, false); return s; }
export const hole = (shape, segs) => new THREE.Path(shape.getPoints(segs));

export function kit(b, near) {
  const seg = near ? 10 : 5;
  function put(g, m) { g.rotateY(-ANGLE); g.translate(FRONT[0], 0, FRONT[1]); b.put(g, m, 0, 0); }
  function box(m, a0, a1, y0, y1, s0, s1) { const g = new THREE.BoxGeometry(a1 - a0, y1 - y0, s1 - s0); g.translate((a0 + a1) / 2, (y0 + y1) / 2, (s0 + s1) / 2); put(g, m); }
  // Shape drawn in (s, y), extruded from a0 (front face) to a1.
  function ext(m, shape, a0, a1) { const g = new THREE.ExtrudeGeometry(shape, { depth: a1 - a0, bevelEnabled: false, curveSegments: seg }); g.rotateY(-Math.PI / 2); g.translate(a1, 0, 0); put(g, m); }
  // Shape drawn in (along, y) as a thin face. dir = the way it looks in the authoring frame: 'front' (-a, east onto
  // the plaza), 'back' (+a, west), '+s' (north) or '-s' (south).
  function face(m, shape, dir, plane, along, y) {
    const g = new THREE.ShapeGeometry(shape, seg);
    if (dir === 'front') { g.rotateY(-Math.PI / 2); g.translate(plane, y, along); }
    else if (dir === 'back') { g.rotateY(Math.PI / 2); g.translate(plane, y, along); }
    else if (dir === '+s') g.translate(along, y, plane);
    else { g.rotateY(Math.PI); g.translate(along, y, plane); }
    put(g, m);
  }
  // Four-sided pyramid, base w (along a) x d (along s), centred on (a, s).
  function pyr(m, a, y0, s, w, d, h, top = 0) { const g = new THREE.CylinderGeometry(top, Math.SQRT1_2, h, 4, 1, true); g.rotateY(Math.PI / 4); g.scale(w, 1, d); g.translate(a, y0 + h / 2, s); put(g, m); }
  function cross(a, y, s, h = 1.7) { box('iron', a - 0.07, a + 0.07, y, y + h, s - 0.07, s + 0.07); box('iron', a - 0.07, a + 0.07, y + h * 0.62, y + h * 0.62 + 0.14, s - 0.42, s + 0.42); }
  // Vertical prism over a plan ring of [a, s] points, from y0 to y1.
  function prism(m, ring, y0, y1) { const g = new THREE.ExtrudeGeometry(new THREE.Shape(ring.map(([a, s]) => new THREE.Vector2(a, -s))), { depth: y1 - y0, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); put(g, m); }
  function lathe(m, pts, a, y, s, n) { const g = new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), n); g.translate(a, y, s); put(g, m); }
  return { put, box, ext, face, pyr, cross, prism, lathe, seg };
}
