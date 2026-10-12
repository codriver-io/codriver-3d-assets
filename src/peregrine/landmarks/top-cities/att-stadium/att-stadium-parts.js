import * as THREE from 'three';
import { SPEC } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
export function site(u, y, v) {
  const a = SPEC.axisAngle;
  return [u * Math.cos(a) + v * Math.sin(a), y, -u * Math.sin(a) + v * Math.cos(a)];
}
export function local(x, y, z) {
  const a = SPEC.axisAngle;
  return [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)];
}
export const archHeight = u => 12 + 61.36 * (1 - (u / (SPEC.archSpan / 2)) ** 2);
export const trussDepth = u => SPEC.archDepth * Math.min(1, (SPEC.archSpan / 2 - Math.abs(u)) / 25);
// The roof shoulders meet below the lower chords, keeping an uninterrupted
// box truss from crown to thrust blocks. Clearance includes far chord sag.
export function roofHeight(u, v) {
  const dome = 70.5 - 26 * (u / 151) ** 2 - 34 * (v / 115) ** 2;
  const lower = archHeight(u) - trussDepth(u) - 2;
  const shoulder = Math.exp(-(((Math.abs(v) - 41.5) / 16) ** 4));
  return dome - Math.max(0, dome - lower) * shoulder;
}

// Every roof triangle is cut on the same planar grid before lifting. Shared
// edges therefore use identical samples, including roof/membrane/seam borders.
export function roofCells(outline, detail) {
  const step = detail === 'near' ? 10 : 20;
  const cuts = axis => [...new Set([
    ...Array.from({ length: 41 }, (_, i) => (i - 20) * step),
    ...(axis ? [-45.5, 45.5, -41.5, 41.5] : [-67.5, -0.55, 0.55, 67.5]),
  ])].sort((a, b) => a - b);
  const split = (polygon, axis, cut) => {
    const sides = [[], []];
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i], c = polygon[(i + 1) % polygon.length];
      const da = a[axis] - cut, dc = c[axis] - cut;
      if (da <= 1e-9) sides[0].push(a);
      if (da >= -1e-9) sides[1].push(a);
      if (da * dc < -1e-16) {
        const f = da / (da - dc), p = a.map((v, j) => j === axis ? cut : v + (c[j] - v) * f);
        sides[0].push(p); sides[1].push(p);
      }
    }
    return sides.filter(p => p.length >= 3);
  };
  let polygons = THREE.ShapeUtils.triangulateShape(outline.map(p => new THREE.Vector2(...p)), []).map(ids => ids.map(i => outline[i]));
  for (const axis of [0, 1]) for (const cut of cuts(axis)) polygons = polygons.flatMap(p => {
    const values = p.map(q => q[axis]);
    return Math.min(...values) < cut - 1e-9 && Math.max(...values) > cut + 1e-9 ? split(p, axis, cut) : [p];
  });
  return polygons.map(points => {
    const [u, v] = points.reduce((s, p) => s.map((x, i) => x + p[i] / points.length), [0, 0]);
    return { points, material: Math.abs(u) < 67.5 && Math.abs(v) < 45.5 ? Math.abs(u) < 0.55 ? 'seam' : 'membrane' : 'roof' };
  });
}

// Partition each end against the actual piecewise-linear fascia, not the
// analytic dome or a door-height header that can invert on the low shoulders.
// All panes, borders and jambs occupy disjoint regions of this single plane.
export function endWallCells(cells, end, detail) {
  const edge = new Map();
  for (const { points } of cells) for (let i = 0; i < points.length; i++) {
    const a = points[i], c = points[(i + 1) % points.length];
    if (Math.abs(a[0] - end * 135) > 1e-7 || Math.abs(c[0] - end * 135) > 1e-7) continue;
    for (const p of [a, c]) edge.set(p[1].toFixed(7), [p[1], roofHeight(...p) - 2]);
  }
  const top = [...edge.values()].sort((a, c) => a[0] - c[0]);
  const envelope = [[top[0][0] * 0.92, 0], [top.at(-1)[0] * 0.92, 0], ...top.toReversed()];
  const half = SPEC.doorWidth / 2, rows = detail === 'near' ? 10 : 4, bays = detail === 'near' ? 4 : 1;
  const jambs = Array.from({ length: 6 }, (_, i) => -half + i * SPEC.doorWidth / 5);
  const vc = [...top.map(p => p[0]), -half, half];
  for (const v of jambs) vc.push(Math.max(-half, v - 0.28), Math.min(half, v + 0.28));
  for (let i = 0; i < 5; i++) for (let j = 1; j < bays; j++) vc.push(jambs[i] + 0.28 + (SPEC.doorWidth / 5 - 0.56) * j / bays);
  const yc = Array.from({ length: rows + 1 }, (_, i) => SPEC.doorHeight * i / rows);
  yc.push(40, 44, 48, 52);
  const clip = (polygon, axis, cut, sign) => {
    const out = [];
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i], c = polygon[(i + 1) % polygon.length];
      const da = sign * (a[axis] - cut), dc = sign * (c[axis] - cut);
      if (da >= -1e-8) out.push(a);
      if (da * dc < -1e-16) {
        const f = da / (da - dc);
        out.push(a.map((v, j) => j === axis ? cut : v + (c[j] - v) * f));
      }
    }
    return out.filter((p, i) => !i || Math.hypot(p[0] - out[i - 1][0], p[1] - out[i - 1][1]) > 1e-7);
  };
  const cuts = [...new Set([envelope[0][0], envelope[1][0], ...vc])].sort((a, c) => a - c), out = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const column = clip(clip(envelope, 0, cuts[i], 1), 0, cuts[i + 1], -1);
    for (let j = 0; j < yc.length - 1; j++) {
      const p = clip(clip(column, 1, yc[j], 1), 1, yc[j + 1], -1);
      if (p.length < 3) continue;
      const [v, y] = p.reduce((s, q) => s.map((x, k) => x + q[k] / p.length), [0, 0]);
      const door = Math.abs(v) < half && y < SPEC.doorHeight;
      out.push({ points: p.map(([v, y]) => [end * 135, y, v]), material: door ? jambs.some(c => Math.abs(v - c) < 0.28) ? 'steel' : 'door' : 'glass' });
    }
  }
  return out;
}
// Member endpoint supports are tested against independent support geometry.
export function archAssembly(detail) {
  const count = detail === 'near' ? 32 : 12, half = SPEC.archSpan / 2;
  const supports = [], members = [];
  for (const side of [-1, 1]) {
    const v = side * 41.5, key = `arch-${side}`;
    for (const end of [-1, 1]) supports.push({ name: `${key}-thrust-${end}`, at: [end * half, 6.5, v], size: [13, 13, 7.6] });
    const p = (i, edge, level) => {
      const u = -half + 2 * half * i / count;
      return [u, archHeight(u) - (level ? trussDepth(u) : 0), v + edge * (SPEC.archWidth - 0.7) / 2];
    };
    for (const edge of [-1, 1]) for (const level of [0, 1]) for (let i = 0; i < count; i++) {
      members.push({ name: `${key}-chord-${edge}-${level}-${i}`, a: p(i, edge, level), c: p(i + 1, edge, level), width: 0.7,
        supports: [i ? `${key}-chord-${edge}-${level}-${i - 1}` : `${key}-thrust--1`, i === count - 1 ? `${key}-thrust-1` : `${key}-chord-${edge}-${level}-${i + 1}`] });
    }
    for (let i = 1; i < count; i++) for (const edge of [-1, 1]) {
      members.push({ name: `${key}-post-${edge}-${i}`, a: p(i, edge, 0), c: p(i, edge, 1), width: 0.46,
        supports: [`${key}-chord-${edge}-0-${i - 1}`, `${key}-chord-${edge}-1-${i - 1}`] });
    }
    for (let i = 0; i < count; i++) for (const edge of [-1, 1]) {
      members.push({ name: `${key}-diagonal-${edge}-${i}`, a: p(i, edge, i % 2), c: p(i + 1, edge, 1 - i % 2), width: 0.4,
        supports: [`${key}-chord-${edge}-${i % 2}-${i}`, `${key}-chord-${edge}-${1 - i % 2}-${i}`] });
    }
    for (let i = 0; i <= count; i++) for (const level of [0, 1]) {
      members.push({ name: `${key}-cross-${level}-${i}`, a: p(i, -1, level), c: p(i, 1, level), width: 0.42,
        supports: [`${key}-chord--1-${level}-${Math.min(i, count - 1)}`, `${key}-chord-1-${level}-${Math.min(i, count - 1)}`] });
    }
  }
  return { supports, members };
}
export function memberGeometry(m) {
  const a = new THREE.Vector3(...site(...m.a)), c = new THREE.Vector3(...site(...m.c));
  const direction = c.clone().sub(a);
  const g = new THREE.BoxGeometry(m.width, direction.length(), m.width);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()));
  g.translate(...a.add(c).multiplyScalar(0.5).toArray());
  return g;
}

// Actual mapped roof ring, with tiny door-edge notches regularised inward.
export const OUTLINE = FOOTPRINTS[2].slice(0, -1).map(([lng, lat]) => {
  const k = mercStretch(SPEC.origin[1]);
  const [u, , v] = local((lngToMercX(lng) - lngToMercX(SPEC.origin[0])) / k, 0, (latToMercY(SPEC.origin[1]) - latToMercY(lat)) / k);
  return [Math.abs(u) > 130 && Math.abs(v) < 51 ? Math.sign(u) * 135 : u, v];
}).filter((p, i, a) => !i || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 1);
