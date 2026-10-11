import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { B0, YAW } from './lefty-odoul-bridge-site.js';

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

/**
 * Primitives for a model authored in bridge coordinates (B along the axis, y up, V across), turned onto
 * the mapped bearing once, when a piece is handed to the builder. Every piece is a closed convex solid
 * with outward normals; the caller picks different member thicknesses wherever two members overlap so
 * that no two faces ever share a plane.
 */
export function makeKit(builder) {
  const put = (g, material) => { g.translate(-B0, 0, 0); g.rotateY(YAW); builder.put(g, material, 0, 0); };

  // Axis-aligned block between [b0,b1] x [y0,y1] x [v0,v1].
  function cuboid(material, [b0, b1], [y0, y1], [v0, v1]) {
    const g = new THREE.BoxGeometry(b1 - b0, y1 - y0, v1 - v0);
    g.translate((b0 + b1) / 2, (y0 + y1) / 2, (v0 + v1) / 2);
    put(g, material);
  }

  // Rectangular member from point A to point C: `w` is its size in the direction of `hint` (default: up,
  // or the B axis for a near-vertical member) and `t` its size in the third direction. For a member in a
  // truss plane that makes `w` the in-plane depth and `t` the thickness across the bridge; for a lateral
  // brace (hint up) `w` is the vertical depth.
  function beam(material, A, C, w, t, hint) {
    const a = V3(A), c = V3(C), e = c.clone().sub(a), length = e.length();
    if (length < 1e-4) return;
    e.normalize();
    const h = V3(hint || (Math.abs(e.y) > 0.9 ? [1, 0, 0] : [0, 1, 0]));
    const u = h.clone().addScaledVector(e, -h.dot(e));
    if (u.lengthSq() < 1e-8) u.set(0, 0, 1).addScaledVector(e, -e.z);
    u.normalize();
    const s = new THREE.Vector3().crossVectors(e, u);
    const m = new THREE.Matrix4().makeBasis(e.clone().multiplyScalar(length), u.clone().multiplyScalar(w), s.clone().multiplyScalar(t));
    m.setPosition(a.clone().add(c).multiplyScalar(0.5));
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.applyMatrix4(m);
    put(g, material);
  }

  // Cylinder whose axis runs across the bridge (a trunnion knuckle), centred at (b, y, v).
  function knuckle(material, [b, y, v], radius, length, sides) {
    const g = new THREE.CylinderGeometry(radius, radius, length, sides, 1);
    g.rotateX(Math.PI / 2);
    g.translate(b, y, v);
    put(g, material);
  }

  // Convex hull of a point list: chamfered blocks, hip roofs.
  function hull(material, points) {
    put(new ConvexGeometry(points.map(V3)), material);
  }

  // Block with a rectangular base and a smaller rectangular top (a hip roof or a plinth taper).
  function frustum(material, base, y0, top, y1) {
    const rect = (r, y) => [[r.b0, y, r.v0], [r.b1, y, r.v0], [r.b1, y, r.v1], [r.b0, y, r.v1]];
    hull(material, [...rect(base, y0), ...rect(top, y1)]);
  }

  // A chamfered slab seen in the B-y plane, extruded across [v0, v1] (the concrete counterweights).
  function prism(material, profile, [v0, v1]) {
    hull(material, profile.flatMap(([b, y]) => [[b, y, v0], [b, y, v1]]));
  }

  return { cuboid, beam, knuckle, hull, frustum, prism };
}
