import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

export function kit(detail) {
  const near = detail === 'near';
  const builder = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const transform = new THREE.Matrix4().makeRotationY(SPEC.rotationRad || 0);
  const put = (geometry, material) => {
    geometry.applyMatrix4(transform);
    builder.put(geometry, material);
  };
  const box = (material, x, y, z, width, height, depth, angle = 0) => {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    geometry.rotateY(angle); geometry.translate(x, y, z); put(geometry, material);
  };
  const bar = (material, start, end, width, depth = width) => {
    const startPoint = new THREE.Vector3(...start), endPoint = new THREE.Vector3(...end);
    const direction = endPoint.clone().sub(startPoint);
    const length = direction.length();
    if (length < 1e-5) return;
    const geometry = new THREE.BoxGeometry(width, length, depth);
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()));
    geometry.translate(...startPoint.add(endPoint).multiplyScalar(.5).toArray()); put(geometry, material);
  };
  const cylinder = (material, x, bottom, z, radius, height, topRadius = radius, segments = near ? 16 : 10, angle = 0) => {
    const geometry = new THREE.CylinderGeometry(topRadius, radius, height, segments);
    geometry.rotateY(angle); geometry.translate(x, bottom + height / 2, z); put(geometry, material);
  };
  const face = (material, points, outward) => {
    const positions = points.flat(), indices = [];
    const normal = new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0])).cross(new THREE.Vector3(...points[2]).sub(new THREE.Vector3(...points[0])));
    const reverse = normal.dot(new THREE.Vector3(...outward)) < 0;
    for (let index = 1; index < points.length - 1; index++) indices.push(...(reverse ? [0, index + 1, index] : [0, index, index + 1]));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); put(geometry, material);
  };
  const plan = (material, ring, bottom, height, holes = []) => {
    const shape = new THREE.Shape(ring.map(point => new THREE.Vector2(...point)));
    for (const hole of holes) shape.holes.push(new THREE.Path(hole.map(point => new THREE.Vector2(...point))));
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments: near ? 10 : 5 });
    geometry.rotateX(Math.PI / 2); geometry.translate(0, bottom + height, 0); put(geometry, material);
  };
  const roof = (material, x, bottom, z, length, width, rise) => {
    const shape = new THREE.Shape(); shape.moveTo(-width / 2, 0); shape.lineTo(width / 2, 0); shape.lineTo(0, rise); shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false });
    geometry.rotateY(Math.PI / 2); geometry.translate(x - length / 2, bottom, z); put(geometry, material);
  };
  const outline = (width, height, arch) => {
    const shape = new THREE.Shape(); shape.moveTo(-width / 2, 0); shape.lineTo(width / 2, 0);
    if (arch) {
      shape.lineTo(width / 2, height - width / 2);
      shape.absarc(0, height - width / 2, width / 2, 0, Math.PI, false);
    } else { shape.lineTo(width / 2, height); shape.lineTo(-width / 2, height); }
    shape.closePath(); return shape;
  };
  const wall = (material, x, bottom, z, width, height, thickness, angle, openings = []) => {
    const shape = new THREE.Shape(); shape.moveTo(-width / 2, 0); shape.lineTo(width / 2, 0); shape.lineTo(width / 2, height); shape.lineTo(-width / 2, height); shape.closePath();
    for (const opening of openings) {
      const hole = outline(opening.width, opening.height, opening.arch);
      const points = hole.getPoints(near ? 10 : 3).map(point => new THREE.Vector2(point.x + opening.x, point.y + opening.y));
      shape.holes.push(new THREE.Path(points));
      if (opening.material) {
        const glass = new THREE.Shape(points);
        const pane = new THREE.ExtrudeGeometry(glass, { depth: .12, bevelEnabled: false, curveSegments: near ? 10 : 5 });
        pane.translate(0, 0, Math.min(thickness * .45, .25)); pane.rotateY(angle); pane.translate(x, bottom, z); put(pane, opening.material);
      }
    }
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: near ? 10 : 5 });
    geometry.rotateY(angle); geometry.translate(x, bottom, z); put(geometry, material);
  };
  const hall = (material, x, bottom, z, length, width, height, openings = [], thickness = .6) => {
    for (const side of [-1, 1]) wall(material, x, bottom, z + side * width / 2, length, height, thickness, side < 0 ? 0 : Math.PI, openings.map(opening => ({ ...opening, x: side < 0 ? opening.x : -opening.x })));
    for (const side of [-1, 1]) wall(material, x + side * length / 2, bottom, z, width - thickness * 2, height, thickness, side < 0 ? Math.PI / 2 : -Math.PI / 2);
    box(material, x, bottom + height - .15, z, length - thickness * 2, .3, width - thickness * 2);
  };
  const annulus = (material, innerX, innerZ, outerX, outerZ, bottom, height, segments = near ? 64 : 40) => {
    const ring = Array.from({ length: segments }, (_, index) => [outerX * Math.cos(index * Math.PI * 2 / segments), outerZ * Math.sin(index * Math.PI * 2 / segments)]);
    const hole = Array.from({ length: segments }, (_, index) => [innerX * Math.cos(-index * Math.PI * 2 / segments), innerZ * Math.sin(-index * Math.PI * 2 / segments)]);
    plan(material, ring, bottom, height, [hole]);
  };
  const local = ([lon, lat]) => {
    const east = (lon - SPEC.origin[0]) * 111320 * Math.cos(SPEC.origin[1] * Math.PI / 180), south = (SPEC.origin[1] - lat) * 111320;
    const angle = SPEC.rotationRad || 0;
    return [Math.cos(angle) * east - Math.sin(angle) * south, Math.sin(angle) * east + Math.cos(angle) * south];
  };
  return { near, put, box, bar, cylinder, face, plan, roof, wall, hall, annulus, local, finish: builder.finish };
}

