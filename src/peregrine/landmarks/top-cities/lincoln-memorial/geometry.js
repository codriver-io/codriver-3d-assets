import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { TERRACE } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

// Architecture in east-facing plan metres; the mapped correction is baked once.
export const plan = (x, y, z) => new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), SPEC.rotation).toArray();
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  function put(g, mat) { g.rotateY(SPEC.rotation); b.put(g, mat); }
  const names = ['east', 'west', 'top', 'bottom', 'south', 'north'];
  function box(mat, x0, x1, y0, y1, z0, z1, omit = []) {
    const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), ix = [...g.index.array];
    g.setIndex(ix.filter((_, i) => !omit.includes(names[Math.floor(i / 6)])));
    g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); put(g, mat);
  }
  function rod(mat, a, c, r, segments = near ? 8 : 5) {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), d = cv.clone().sub(av);
    const g = new THREE.CylinderGeometry(r, r, d.length(), segments, 1, true);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray()); put(g, mat);
  }
  function turned(mat, x, z, points, segments = near ? 16 : 8) {
    const g = new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
    g.translate(x, 0, z); put(g, mat);
  }
  function ring(mat, hx, hz, y0, y1, t) {
    box(mat, -hx, hx, y0, y1, -hz, -hz + t);
    box(mat, -hx, hx, y0, y1, hz - t, hz);
    box(mat, -hx, -hx + t, y0, y1, -hz + t, hz - t, ['north', 'south']);
    box(mat, hx - t, hx, y0, y1, -hz + t, hz - t, ['north', 'south']);
  }
  // Mapped horseshoe terrace, not a circular ground slab. No river elevations baked in.
  const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = latToMercY(SPEC.origin[1]);
  const shape = new THREE.Shape(TERRACE.slice(0, -1).map(([lng, lat]) => {
    const p = new THREE.Vector3((lngToMercX(lng) - ox) / k, 0, -(latToMercY(lat) - oz) / k);
    p.applyAxisAngle(new THREE.Vector3(0, 1, 0), -SPEC.rotation);
    return new THREE.Vector2(p.x, -p.z);
  }));
  const terrace = new THREE.ExtrudeGeometry(shape, { depth: 4.3, bevelEnabled: false, steps: 1 });
  terrace.rotateX(-Math.PI / 2); put(terrace, 'granite');
  const lawn = new THREE.ShapeGeometry(shape); lawn.rotateX(-Math.PI / 2); lawn.translate(0, 4.36, 0); put(lawn, 'turf');
  box('granite', -20.12, 20.12, 0, 4.3, -30.76, 30.76, ['bottom', 'top']);
  // NPS eight-foot, three-step platform, followed by the two eastern stair flights.
  for (let i = 0; i < 3; i++) {
    const hx = 20.12 - i * 0.68, hz = 30.76 - i * 1.03;
    const y0 = 4.3 + i * (SPEC.platformY - 4.3) / 3, y1 = 4.3 + (i + 1) * (SPEC.platformY - 4.3) / 3;
    box('stone', -hx, hx, y0, y1, -hz, hz, ['bottom']);
  }
  function stairs(x0, x1, y0, y1, w, count, mat) {
    for (let i = 0; i < count; i++) {
      const a = x0 + (x1 - x0) * i / count, c = x0 + (x1 - x0) * (i + 1) / count;
      box(mat, a, c, y0 === 4.3 ? 4.3 : 0, y1 + (y0 - y1) * i / count, -w, w, ['bottom', 'west']);
    }
  }
  stairs(18.76, 26.1, 4.3, SPEC.platformY, 12.1, near ? 16 : 8, 'stone');
  box('granite', 20.12, 26.1, 0, 4.3, -12.1, 12.1, ['bottom', 'west', 'top', 'east']);
  box('granite', 26.1, 28.6, 0, 4.3, -12.1, 12.1, ['bottom', 'west', 'east']);
  stairs(28.6, 35.9, 0.12, 4.3, 12.1, near ? 23 : 10, 'granite');
  for (const s of [-1, 1]) {
    box('stone', 20.2, 26.1, 0, 4.45, s < 0 ? -13.8 : 12.5, s < 0 ? -12.5 : 13.8, ['bottom']);
    box('granite', 28.2, 30, 0, 5.0, s * 13.25 - 0.85, s * 13.25 + 0.85, ['bottom', 'top']);
    box('stone', 28.0, 30.2, 5.0, 5.32, s * 13.25 - 1.05, s * 13.25 + 1.05, ['bottom', 'top']);
    turned('stone', 29.1, s * 13.25, [[0.45, 5.32], [0.35, 5.8], [0.27, 7.2], [0.82, 7.6], [0.92, 8.0], [0.84, 8.3], [0, 8.3]].map(([r, y]) => [r, 5.32 + (y - 5.32) * 3.3528 / 2.98]));
    for (let i = 0; i < 3; i++) {
      const a = i * 2 * Math.PI / 3;
      rod('stone', [29.1 + 0.7 * Math.cos(a), 5.32, s * 13.25 + 0.7 * Math.sin(a)], [29.1 + 0.66 * Math.cos(a), 8.1665, s * 13.25 + 0.66 * Math.sin(a)], 0.13);
    }
  }
  // Hollow cella and true entrance. No black rectangle covering a solid extrusion.
  const floor = SPEC.platformY;
  box('stone', -13.65, -12.4, floor, 29.67, -21.6, 21.6, ['bottom', 'top']);
  box('stone', -12.4, 13.65, floor, 29.67, -21.6, -20.4, ['bottom', 'top', 'west']);
  box('stone', -12.4, 13.65, floor, 29.67, 20.4, 21.6, ['bottom', 'top', 'west']);
  for (const s of [-1, 1]) box('stone', 12.4, 13.65, floor, 25.8, s < 0 ? -20.4 : 6.8, s < 0 ? -6.8 : 20.4, ['bottom', 'top']);
  box('stone', 12.4, 13.65, 25.8, 29.67, -20.4, 20.4, ['bottom', 'top']);
  box('glow', -12.4, 12.4, 25.7, 25.95, -20.4, 20.4, ['top']);
  // Eight interior shafts; Ionic volutes simplified, separating the three chambers.
  for (const z of [-9.25, 9.25]) for (const x of [-9, -3, 3, 9])
    turned('stone', x, z, [[0.94, floor], [0.94, floor + 0.45], [0.8, floor + 0.55], [0.67, floor + 14.7], [0.91, floor + 15.24], [0, floor + 15.24]], near ? 12 : 6);
  // 36 outside and two in-antis columns; 20 concave flutes in near detail.
  const cx = SPEC.colonnadeDepth / 2 - SPEC.columnDiameter / 2;
  const cz = SPEC.colonnadeWidth / 2 - SPEC.columnDiameter / 2;
  const columns = [];
  for (const x of [-cx, cx]) for (let i = 0; i < 12; i++) columns.push([x, -cz + 2 * cz * i / 11]);
  for (const z of [-cz, cz]) for (let i = 1; i < 7; i++) columns.push([-cx + 2 * cx * i / 7, z]);
  columns.push([12.98, -2.8], [12.98, 2.8]);
  for (const [x, z] of columns) {
    const y1 = floor + SPEC.columnHeight, shaftTop = y1 - 0.72;
    const segments = near ? 60 : 10, levels = near ? 3 : 1, positions = [], indices = [];
    for (let j = 0; j <= levels; j++) {
      const t = j / levels, radius = 1.1303 - 0.20 * t + 0.055 * Math.sin(Math.PI * t);
      for (let i = 0; i <= segments; i++) {
        const a = 2 * Math.PI * i / segments, r = near && i % 3 === 1 ? radius - 0.085 : radius;
        positions.push(x + r * Math.cos(a), floor + (shaftTop - floor) * t, z + r * Math.sin(a));
        if (j && i) { const p = (j - 1) * (segments + 1) + i - 1, q = j * (segments + 1) + i - 1; indices.push(p, q, p + 1, p + 1, q, q + 1); }
      }
    }
    const shaft = new THREE.BufferGeometry(); shaft.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); shaft.setIndex(indices); shaft.computeVertexNormals(); put(shaft, 'stone');
    turned('trim', x, z, [[0.93, shaftTop], [0.97, shaftTop + 0.12], [1.16, shaftTop + 0.43], [1.19, shaftTop + 0.49]], near ? 20 : 10);
    box('stone', x - 1.26, x + 1.26, shaftTop + 0.49, y1, z - 1.26, z + 1.26, ['top']);
  }
  // Peristyle entablature, layered cornice, roof walk and recessed attic well.
  ring('stone', 18.58, 28.9, floor + SPEC.columnHeight, 21.3, 4.95);
  ring('trim', 18.72, 29.04, 21.3, 21.57, 5.1);
  ring('stone', 18.58, 28.9, 21.57, 23.25, 4.95);
  ring('trim', 18.87, 29.2, 23.25, 23.65, 5.3);
  ring('stone', 19.0, 29.33, 23.65, 24.05, 5.43);
  ring('roof', 18.55, 28.88, 24.05, 24.18, 4.9);
  box('roof', -12.4, 12.4, 25.95, 26.15, -20.4, 20.4, ['bottom']);
  ring('trim', 13.9, 21.85, 29.67, SPEC.height, 1.5);
  // Three shallow gabled skylights and mullions, wholly within the attic wall.
  for (const [z0, z1, ridge] of [[-19.6, -9.5, 28.1], [-6.5, 6.5, 29.0], [9.5, 19.6, 28.1]]) {
    const p = [-10.05, 26.15, z0, 10.05, 26.15, z0, 0, ridge, z0, -10.05, 26.15, z1, 10.05, 26.15, z1, 0, ridge, z1];
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); g.setIndex([0, 3, 2, 2, 3, 5, 2, 5, 1, 1, 5, 4, 0, 2, 1, 3, 4, 5]); g.computeVertexNormals(); put(g, 'roof');
    for (let z = z0; z <= z1 + 0.01; z += near ? 0.85 : 3.0) {
      rod('bronze', [-10.05, 26.159, z], [0, ridge + 0.09, z], near ? 0.045 : 0.07, 4);
      rod('bronze', [0, ridge + 0.09, z], [10.05, 26.159, z], near ? 0.045 : 0.07, 4);
    }
  }
  // Shallow garland reliefs and eagle wing silhouettes; inscriptions are omitted.
  function ornament(x, z, alongZ, w, y) {
    const at = (u, v) => alongZ ? [x, v, z + u] : [x + u, v, z], n = near ? 9 : 4;
    // A buried relief stem joins the raised festoon to the attic wall.
    rod('trim', alongZ ? [Math.sign(x) * 13.60, y, z] : [x, y, Math.sign(z) * 21.55], at(0, y), 0.08, 5);
    for (let i = 0; i < n; i++) {
      const u = -w / 2 + w * i / n, v = -w / 2 + w * (i + 1) / n;
      rod('trim', at(u, y + 0.44 * (2 * u / w) ** 2), at(v, y + 0.44 * (2 * v / w) ** 2), near ? 0.12 : 0.14, 5);
    }
    if (near) {
      rod('trim', at(-w / 2, y + 0.45), at(-w / 2 - 0.38, y + 0.82), 0.11, 5);
      rod('trim', at(-w / 2, y + 0.45), at(-w / 2 + 0.38, y + 0.82), 0.11, 5);
    }
  }
  for (const s of [-1, 1]) {
    for (let i = 0; i < 12; i++) ornament(s * 13.78, -19.8 + i * 3.6, true, 2.6, 28.28);
    for (let i = 0; i < 7; i++) ornament(-11.3 + i * 3.76, s * 21.73, false, 2.7, 28.28);
    if (near) {
      // Double wreath medallions between the state inscription groups.
      const wreath = (x, z, alongZ) => {
        for (const d of [-0.19, 0.19]) {
          const g = new THREE.TorusGeometry(0.23, 0.055, 3, 16);
          if (alongZ) g.rotateY(Math.PI / 2);
          g.translate(x + (alongZ ? 0 : d), 22.47, z + (alongZ ? d : 0)); put(g, 'trim');
        }
      };
      for (let i = 0; i < 12; i++) wreath(s * 18.67, -27.1 + i * 4.927, true);
      for (let i = 1; i < 5; i++) wreath(-16.6 + i * 6.64, s * 28.99, false);
      for (let z = -28.0; z <= 28; z += 1.7) turned('trim', s * 18.82, z, [[0.16, 24.05], [0.23, 24.30], [0.10, 24.58], [0, 24.62]], 6);
      for (let x = -17.3; x <= 17.3; x += 1.7) turned('trim', x, s * 29.18, [[0.16, 24.05], [0.23, 24.30], [0.10, 24.58], [0, 24.62]], 6);
    }
  }
  // Stylised seated Lincoln (5.79m sculpture), chair and 3.048m pedestal.
  box('granite', -9.8, -4.6, floor, floor + 3.048, -2.44, 2.44, ['bottom', 'top']);
  box('trim', -10.0, -4.4, floor + 3.048, floor + 3.53, -2.65, 2.65, ['bottom']);
  box('stone', -9.5, -8.85, floor + 3.53, floor + 8.35, -2.5, 2.5, ['bottom']);
  for (const s of [-1, 1]) {
    box('stone', -9.0, -5.6, floor + 3.53, floor + 6.8, s * 2.1 - 0.35, s * 2.1 + 0.35, ['bottom']);
    rod('trim', [-7.5, floor + 6.0, s * 1.2], [-5.8, floor + 5.35, s * 1.0], 0.63);
    rod('trim', [-5.8, floor + 5.35, s * 1.0], [-5.1, floor + 3.7, s * 0.9], 0.46);
    rod('trim', [-7.9, floor + 7.4, s * 1.1], [-6.4, floor + 6.85, s * 2.0], 0.28);
    box('trim', -5.6, -4.75, floor + 3.53, floor + 3.9, s * 0.9 - 0.4, s * 0.9 + 0.4, ['bottom']);
  }
  const torso = new THREE.SphereGeometry(1, near ? 12 : 6, near ? 8 : 4); torso.scale(0.82, 1.65, 1.45); torso.translate(-7.9, floor + 6.62, 0); put(torso, 'trim');
  const head = new THREE.SphereGeometry(1, near ? 12 : 6, near ? 8 : 4); head.scale(0.48, 0.65, 0.52); head.translate(-7.8, floor + 8.65, 0); put(head, 'trim');
  box('trim', -7.48, -7.23, floor + 8.48, floor + 8.9, -0.23, 0.23);
  if (near) box('stone', -7.55, -7.25, floor + 8.05, floor + 8.44, -0.28, 0.28);
  return b.finish();
}
