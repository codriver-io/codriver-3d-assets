import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BRIDGE_LENGTH, TOWER_STATION, CHAMPLAIN, bridgePoint, deckHeight } from './champlain-profile.js';

export const BRIDGE_PALETTES = {
  light: { concrete: '#d4d7d4', pierCap: '#dce0dc', steel: '#667c83', asphalt: '#555d63', rail: '#aab9bd', paint: '#f0ecdd', path: '#b6aca0', cables: '#e4e8e5' },
  dark: { concrete: '#7d8e9d', pierCap: '#94a5b0', steel: '#394c5b', asphalt: '#303c47', rail: '#8c9da9', paint: '#b9bdbe', path: '#66717b', cables: '#a8b9c9' },
};

/** Original parametric geometry. No Flight Simulator mesh or texture is used.
 * Each material is merged per geographic chunk; a distant bridge never costs
 * one draw per cable, lane dash or support. LODs are separate exported assets.
 */
export function createChamplain({ detail = 'near', theme = 'light', unlit = false } = {}) {
  const root = new THREE.Group();
  root.name = 'Samuel-De Champlain Bridge';
  root.userData = { landmark: CHAMPLAIN.id, units: 'metres', origin: CHAMPLAIN.origin, detail,
    alignmentAttribution: '© OpenStreetMap contributors', elevations: 'approximate' };
  const mats = {};
  for (const [name, color] of Object.entries(BRIDGE_PALETTES[theme] || BRIDGE_PALETTES.light)) {
    mats[name] = unlit
      ? new THREE.MeshBasicMaterial({ color, vertexColors: true })
      : new THREE.MeshStandardMaterial({ color, roughness: name === 'rail' ? 0.5 : 0.88, metalness: name === 'rail' ? 0.45 : 0 });
    mats[name].name = name;
  }
  const batches = new Map();
  const put = (geo, mat, chunk, lift = 1) => {
    if (detail === 'far') chunk = 0;
    geo.deleteAttribute('uv');
    // Runtime approach joins can raise the deck while the foundations stay
    // planted. This survives material batching and the GLB round trip.
    const positions = geo.getAttribute('position');
    const weights = new Float32Array(positions.count);
    for (let i = 0; i < weights.length; i++) weights[i] = typeof lift === 'function' ? lift(positions.getY(i)) : lift;
    geo.setAttribute('bridgeLift', new THREE.BufferAttribute(weights, 1));
    if (unlit) {
      const normal = geo.getAttribute('normal');
      const col = new Float32Array(normal.count * 3);
      for (let i = 0; i < normal.count; i++) {
        const shade = 0.62 + 0.38 * Math.max(0, normal.getX(i) * -0.35 + normal.getY(i) * 0.83 + normal.getZ(i) * 0.44);
        col.set([shade, shade, shade], i * 3);
      }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    }
    const key = chunk + ':' + mat;
    if (!batches.has(key)) batches.set(key, { mat, chunk, geos: [] });
    batches.get(key).geos.push(geo);
  };
  const box = (mat, s, d, y, length, width, height, chunk, lift = 1) => {
    const p = bridgePoint(s, d, y);
    const g = new THREE.BoxGeometry(length, height, width);
    g.rotateY(-Math.atan2(p.tz, p.tx));
    g.translate(p.x, p.y, p.z);
    put(g, mat, chunk, lift);
  };
  const bar = (mat, a, b, width, depth, chunk, round = false) => {
    const A = new THREE.Vector3(a.x, a.y, a.z), B = new THREE.Vector3(b.x, b.y, b.z);
    const v = B.clone().sub(A), len = v.length();
    if (len < 0.001) return;
    const g = round ? new THREE.CylinderGeometry(width, width, len, detail === 'far' ? 3 : 5, 1) : new THREE.BoxGeometry(width, len, depth);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize()));
    g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    put(g, mat, chunk);
  };
  const strip = (mat, s0, s1, left, right, lift, thickness, chunk, step = 25) => {
    const positions = [], indices = [];
    const stride = thickness ? 4 : 2;
    const count = Math.max(1, Math.ceil((s1 - s0) / step));
    for (let i = 0; i <= count; i++) {
      const s = s0 + (s1 - s0) * i / count;
      const section = [[left, 0], [right, 0]];
      if (thickness) section.push([left, -thickness], [right, -thickness]);
      for (const [d, dh] of section) {
        const p = bridgePoint(s, d, deckHeight(s) + lift + dh);
        positions.push(p.x, p.y, p.z);
      }
      if (!i) continue;
      const a = (i - 1) * stride, b = i * stride;
      indices.push(a, a + 1, b, a + 1, b + 1, b); // top
      if (thickness) indices.push(a + 2, b + 2, a + 3, a + 3, b + 2, b + 3,
        a, b, a + 2, a + 2, b, b + 2, a + 1, a + 3, b + 1, a + 3, b + 3, b + 1);
    }
    if (thickness) {
      const e = count * 4;
      indices.push(0, 2, 1, 1, 2, 3, e, e + 1, e + 2, e + 1, e + 3, e + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setIndex(indices); g.computeVertexNormals();
    put(g, mat, chunk);
  };

  // A pier is one transverse W frame on TWO inclined shafts. The light steel
  // cap has two open triangular windows, with curved haunches at the necks.
  // Envelope follows the published ~52 x 11 x 3 m cap; taper/fillets are visual
  // approximations from photographs, not structural fabrication dimensions.
  const pier = (s, chunk) => {
    if (deckHeight(s) - 3.4 < 4) return;
    // Far LOD omits the longitudinal girders, so meet its slab underside.
    const top = deckHeight(s) - (detail === 'far' ? 1.2 : 3.4);
    const capHeight = Math.min(11.4, top * 0.56), neck = top - capHeight;
    const y = (v) => neck + v * capHeight;
    const shape = new THREE.Shape();
    shape.moveTo(-26, top); shape.lineTo(26, top);
    shape.lineTo(26, y(0.94)); shape.lineTo(16.7, y(0.29));
    shape.quadraticCurveTo(15.3, y(0.16), 15.3, neck);
    shape.lineTo(10.3, neck);
    shape.quadraticCurveTo(10.3, y(0.19), 8.6, y(0.31));
    shape.lineTo(1.1, y(0.81)); shape.lineTo(-1.1, y(0.81));
    shape.lineTo(-8.6, y(0.31));
    shape.quadraticCurveTo(-10.3, y(0.19), -10.3, neck);
    shape.lineTo(-15.3, neck);
    shape.quadraticCurveTo(-15.3, y(0.16), -16.7, y(0.29));
    shape.lineTo(-26, y(0.94)); shape.closePath();
    for (const sign of [-1, 1]) {
      const hole = new THREE.Path();
      hole.moveTo(sign * 21.6, y(0.9));
      hole.lineTo(sign * 4.1, y(0.9));
      hole.lineTo(sign * 3.8, y(0.83));
      hole.lineTo(sign * 12.7, y(0.41));
      hole.lineTo(sign * 22.3, y(0.81)); hole.closePath();
      shape.holes.push(hole);
    }
    const cap = new THREE.ExtrudeGeometry(shape, {
      depth: 3.3, bevelEnabled: false, steps: 1, curveSegments: detail === 'far' ? 1 : 4,
    });
    // Shape x is lateral, extrusion z is longitudinal; keep this local frame
    // aligned to the road, including the curving approach spans.
    const pos = cap.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const p = bridgePoint(s + 1.65 - pos.getZ(i), pos.getX(i), pos.getY(i));
      pos.setXYZ(i, p.x, p.y, p.z);
    }
    cap.setIndex(Array.from({ length: pos.count }, (_, i) => i));
    cap.computeVertexNormals();
    put(cap, 'pierCap', chunk);

    for (const sign of [-1, 1]) {
      // Broad toes at water level narrow into faceted shafts and widen again
      // at the cap. The two bases splay outward from the rail corridor.
      const foot = 12.8 + Math.min(4, neck * 0.13);
      box('concrete', s, sign * foot, -1.5, 11, 11, 2, chunk, 0);
      const rings = detail === 'far'
        ? [[-0.5, foot, 3.2, 3.5], [neck * 0.22, foot * 0.78 + 12.8 * 0.22, 2.1, 1.9], [neck, 12.8, 2.5, 1.65]]
        : [[-0.5, foot, 3.2, 3.5], [neck * 0.2, foot * 0.8 + 12.8 * 0.2, 2.1, 1.9],
          [neck * 0.7, foot * 0.3 + 12.8 * 0.7, 2.05, 1.65], [neck, 12.8, 2.5, 1.65]];
      const vertices = [], indices = [];
      const loops = rings.map(([height, d, halfWidth, halfDepth]) => {
        const bevel = detail === 'far' ? 0 : 0.3;
        const outline = bevel ? [
          [-halfWidth + bevel, -halfDepth], [halfWidth - bevel, -halfDepth],
          [halfWidth, -halfDepth + bevel], [halfWidth, halfDepth - bevel],
          [halfWidth - bevel, halfDepth], [-halfWidth + bevel, halfDepth],
          [-halfWidth, halfDepth - bevel], [-halfWidth, -halfDepth + bevel],
        ] : [[-halfWidth, -halfDepth], [halfWidth, -halfDepth], [halfWidth, halfDepth], [-halfWidth, halfDepth]];
        return outline.map(([across, along]) => bridgePoint(s + along, sign * d + across, height));
      });
      const face = (points) => {
        const start = vertices.length / 3;
        for (const p of points) vertices.push(p.x, p.y, p.z);
        for (let i = 1; i < points.length - 1; i++) indices.push(start, start + i, start + i + 1);
      };
      for (let i = 1; i < loops.length; i++) for (let j = 0; j < loops[i].length; j++) {
        const next = (j + 1) % loops[i].length;
        face([loops[i - 1][j], loops[i - 1][next], loops[i][next], loops[i][j]]);
      }
      face([...loops[0]].reverse()); face(loops[loops.length - 1]);
      const shaft = new THREE.BufferGeometry();
      shaft.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      shaft.setIndex(indices); shaft.computeVertexNormals();
      put(shaft, 'concrete', chunk, (height) => Math.max(0, Math.min(1, (height + 0.5) / (neck + 0.5))));
    }
  };

  // Even the small model must stay below the HD pavement draped over its
  // curved profile. Long 80 m chords protruded through it near Brossard.
  const step = detail === 'far' ? 32 : 25;
  // The signature span has its own bounds; approach chunks can be culled.
  const cuts = [0, Math.max(0, TOWER_STATION - 650), TOWER_STATION - 220, TOWER_STATION + 265, BRIDGE_LENGTH];
  const chunkAt = (s) => Math.min(3, Math.max(0, cuts.findIndex((v) => v > s) - 1));
  for (let ci = 0; ci < cuts.length - 1; ci++) {
    const a = cuts[ci], b = cuts[ci + 1];
    for (const [l, r] of [[-30, -10.5], [-5, 5], [10.5, 30]]) {
      strip('concrete', a, b, l, r, -0.10, 1.1, ci, step);
      if (detail !== 'far') for (const d of [l + 3, r - 3]) strip('steel', a, b, d - 1.5, d + 1.5, -1.2, 2.2, ci, step);
    }
    strip('asphalt', a, b, -25.5, -11.1, 0, 0, ci, step);
    strip('asphalt', a, b, 11.1, 29.4, 0, 0, ci, step);
    strip('path', a, b, -29.5, -26.1, 0.05, 0, ci, step);
    if (detail !== 'far') {
      for (const d of [-29.8, -25.8, -10.8, 10.8, 29.8]) strip('concrete', a, b, d - 0.18, d + 0.18, 0.85, 0.85, ci, step);
      for (const d of [-3.3, -1.865, 1.865, 3.3]) strip('rail', a, b, d - 0.055, d + 0.055, 0.18, 0.18, ci, step);
      for (const d of [-24.6, -12, 12.2, 28.5]) strip('paint', a, b, d - 0.08, d + 0.08, 0.025, 0, ci, step);
      for (let s = Math.ceil(a / 15) * 15; s < b; s += 15) {
        for (const d of [-20.7, -17.1, 16.1, 19.7, 23.3]) strip('paint', s, Math.min(s + 6, b), d - 0.075, d + 0.075, 0.025, 0, ci);
      }
    }
  }

  // Repeated W-shaped piers. No pier in the navigation channel.
  for (let s = 80; s < BRIDGE_LENGTH - 65; s += 80.4) {
    if (s > TOWER_STATION - 195 && s < TOWER_STATION + CHAMPLAIN.mainSpan) continue;
    pier(s, chunkAt(s));
  }

  // Twin prongs straddle the rail corridor; cables sit in the two deck gaps.
  const s = TOWER_STATION, ci = 2;
  for (const sign of [-1, 1]) {
    box('concrete', s, sign * 8, 1, 13, 12, 2, ci, 0);
    bar('concrete', bridgePoint(s, sign * 8, 1), bridgePoint(s, sign * 7.8, 51), 5.8, 7.5, ci);
    bar('concrete', bridgePoint(s, sign * 7.8, 49), bridgePoint(s, sign * 9.2, CHAMPLAIN.towerHeight), 4.6, 6.2, ci);
  }
  box('concrete', s, 0, 36, 8, 22, 4, ci);
  const every = detail === 'far' ? 3 : 1;
  for (let i = 1; i <= 15; i += every) {
    const y = 59 + i * 6.7;
    for (const side of [-1, 1]) for (const direction of [-1, 1]) {
      const reach = (direction > 0 ? CHAMPLAIN.mainSpan : CHAMPLAIN.backSpan) * i / 15;
      const a = bridgePoint(s, side * (7.8 + (y - 49) / 119 * 1.4), y);
      const b = bridgePoint(s + direction * reach, side * 8, deckHeight(s + direction * reach) - 0.3);
      bar('cables', a, b, detail === 'far' ? 0.55 : 0.21, 0, ci, true);
    }
  }
  if (detail !== 'far') {
    for (let ds = -200; ds <= 240; ds += 12.6) box('steel', s + ds, 0, deckHeight(s + ds) - 2, 1.1, 59, 2.3, ci);
    // Lamps and REM catenary poles are visible close up; omitted in far LOD.
    for (let at = 50; at < BRIDGE_LENGTH; at += 65) {
      const chunk = chunkAt(at), h = deckHeight(at);
      for (const d of [-25.8, 29.7]) {
        bar('steel', bridgePoint(at, d, h + 0.6), bridgePoint(at, d, h + 10), 0.14, 0.14, chunk);
        box('paint', at, d + (d < 0 ? 1 : -1), h + 10, 1.4, 2.2, 0.18, chunk);
      }
      bar('steel', bridgePoint(at, 0, h), bridgePoint(at, 0, h + 6.5), 0.18, 0.18, chunk);
      box('steel', at, 0, h + 6.5, 0.16, 8.3, 0.16, chunk);
    }
  }

  let triangles = 0;
  for (const { mat, chunk, geos } of batches.values()) {
    const geometry = mergeGeometries(geos);
    geos.forEach((g) => g.dispose());
    geometry.computeBoundingBox(); geometry.computeBoundingSphere();
    triangles += geometry.index.count / 3;
    const mesh = new THREE.Mesh(geometry, mats[mat]);
    mesh.name = `span-${chunk}-${mat}`;
    root.add(mesh);
  }
  root.userData.triangles = triangles;
  root.userData.drawCalls = root.children.length;
  return root;
}

export function disposeChamplain(root) {
  const mats = new Set();
  root.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); mats.add(o.material); } });
  mats.forEach((m) => m.dispose());
}
