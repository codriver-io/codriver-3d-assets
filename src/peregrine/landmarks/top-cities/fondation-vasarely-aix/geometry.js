import * as THREE from 'three';
import { kit } from './fondation-vasarely-aix-parts.js';
import { MAPPED_PARTS } from './footprint.js';

export const CELL_CENTERS = [[-35.61, 3.02], [-35.61, 17.74], [-22.86, -4.34], [-22.86, 10.38], [-22.86, 25.1], [-10.11, -11.7], [-10.11, 3.02], [-10.11, 17.74], [2.64, -19.06], [2.64, -4.34], [2.64, 10.38], [15.39, -26.42], [15.39, -11.7], [15.39, 3.02], [28.14, -19.06], [28.14, -4.34]];
export const SKYLIGHT_CENTERS = CELL_CENTERS.filter((center, index) => index !== 1 && index !== 6);

export function create({ detail = 'near' } = {}) {
  const model = kit(detail);
  const mapped = MAPPED_PARTS.map(ring => ring.slice(0, -1).map(model.local));
  let outer = mapped[0];
  for (let pass = 0; pass < 3; pass++) outer = outer.filter((point, index, ring) => {
    const previous = ring[(index + ring.length - 1) % ring.length], next = ring[(index + 1) % ring.length];
    const first = [point[0] - previous[0], point[1] - previous[1]], second = [next[0] - point[0], next[1] - point[1]];
    return Math.abs(first[0] * second[1] - first[1] * second[0]) / (Math.hypot(...first) * Math.hypot(...second)) > .055;
  });
  const hexagon = (center, radius) => Array.from({ length: 6 }, (_, index) => [center[0] + radius * Math.cos(index * Math.PI / 3), center[1] + radius * Math.sin(index * Math.PI / 3)]);
  const skylights = SKYLIGHT_CENTERS.map(center => hexagon(center, 6.1));
  model.plan('black', outer, 0, .18, [mapped[1]]);
  const offset = (ring, distance) => ring.map((point, index) => {
    const previous = ring[(index + ring.length - 1) % ring.length], next = ring[(index + 1) % ring.length];
    const area = ring.reduce((sum, vertex, vertexIndex) => { const following = ring[(vertexIndex + 1) % ring.length]; return sum + vertex[0] * following[1] - following[0] * vertex[1]; }, 0);
    const direction = area < 0 ? -1 : 1;
    const firstLength = Math.hypot(point[0] - previous[0], point[1] - previous[1]), nextLength = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const first = [direction * (previous[1] - point[1]) / firstLength, direction * (point[0] - previous[0]) / firstLength];
    const second = [direction * (point[1] - next[1]) / nextLength, direction * (next[0] - point[0]) / nextLength];
    const normal = [first[0] + second[0], first[1] + second[1]], divisor = Math.max(.3, normal[0] * second[0] + normal[1] * second[1]);
    return [point[0] + normal[0] * distance / divisor, point[1] + normal[1] * distance / divisor];
  });
  const roofShape = new THREE.Shape(offset(outer, .3).map(point => new THREE.Vector2(point[0], -point[1])));
  for (const hole of [offset(mapped[1], -.25), ...skylights]) roofShape.holes.push(new THREE.Path(hole.map(point => new THREE.Vector2(point[0], -point[1]))));
  const roofGeometry = new THREE.ShapeGeometry(roofShape);
  roofGeometry.rotateX(-Math.PI / 2); roofGeometry.translate(0, 9, 0); model.put(roofGeometry, 'cream');
  const curtain = (center, angle, width, bottom, height) => {
    const divisions = Math.ceil(width / (model.near ? .9 : 1.8)), spacing = width / divisions;
    const position = distance => [center[0] + Math.cos(angle) * distance, center[1] - Math.sin(angle) * distance];
    for (let division = 0; division <= divisions; division++) {
      const point = position(-width / 2 + division * spacing);
      model.box('metal', point[0], bottom + height / 2, point[1], .055, height, .3, angle);
      if (division === divisions) continue;
      const start = position(-width / 2 + division * spacing + .0275), end = position(-width / 2 + (division + 1) * spacing - .0275);
      model.face('glass', [[start[0], bottom, start[1]], [end[0], bottom, end[1]], [end[0], bottom + height, end[1]], [start[0], bottom + height, start[1]]], [-Math.sin(angle), 0, -Math.cos(angle)]);
    }
  };
  const panel = (start, end, index, courtyard = false) => {
    const width = Math.hypot(end[0] - start[0], end[1] - start[1]);
    if (width < .1) return;
    const angle = Math.atan2(start[1] - end[1], end[0] - start[0]);
    const center = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    curtain(center, angle, width, .18, 2.02);
    const entrance = center[0] > -15 && center[0] < 0 && center[1] < -13;
    if (width < 5 || courtyard || entrance) {
      curtain(center, angle, width, 2.2, 6.8);
      return;
    }
    const radius = Math.min(3.05, width * .43), segments = model.near ? 24 : 12;
    const circle = Array.from({ length: segments }, (_, step) => new THREE.Vector2(radius * Math.cos(step * Math.PI * 2 / segments), 3.4 + radius * Math.sin(step * Math.PI * 2 / segments)));
    const shape = new THREE.Shape([new THREE.Vector2(-width / 2, 0), new THREE.Vector2(width / 2, 0), new THREE.Vector2(width / 2, 6.8), new THREE.Vector2(-width / 2, 6.8)]);
    shape.holes.push(new THREE.Path(circle));
    const putPanel = (profile, material) => {
      const geometry = new THREE.ExtrudeGeometry(profile, { depth: .3, bevelEnabled: false });
      geometry.rotateY(angle); geometry.translate(center[0], 2.2, center[1]); model.put(geometry, material);
    };
    putPanel(shape, index % 2 ? 'cream' : 'black');
    putPanel(new THREE.Shape(circle), index % 2 ? 'black' : 'cream');
  };
  const signedArea = outer.reduce((sum, point, index) => { const next = outer[(index + 1) % outer.length]; return sum + point[0] * next[1] - next[0] * point[1]; }, 0);
  if (signedArea < 0) outer.reverse();
  outer.forEach((point, index) => panel(point, outer[(index + 1) % outer.length], index));
  const court = [...mapped[1]];
  const courtArea = court.reduce((sum, point, index) => { const next = court[(index + 1) % court.length]; return sum + point[0] * next[1] - next[0] * point[1]; }, 0);
  if (courtArea > 0) court.reverse();
  court.forEach((point, index) => panel(point, court[(index + 1) % court.length], index, true));
  skylights.forEach((ring, index) => {
    const center = SKYLIGHT_CENTERS[index], apex = [center[0], 11.4, center[1]];
    ring.forEach((point, corner) => {
      const next = ring[(corner + 1) % 6];
      model.face('glass', [[point[0], 9, point[1]], [next[0], 9, next[1]], apex], [point[0] - center[0], 2, point[1] - center[1]]);
      model.bar('metal', [point[0], 9, point[1]], apex, .1);
    });
  });
  const result = model.finish();
  result.userData.hexagons = CELL_CENTERS.length;
  result.userData.skylights = SKYLIGHT_CENTERS.length;
  return result;
}
