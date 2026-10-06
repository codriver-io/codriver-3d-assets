import { assetBuilder } from '../../asset-geometry.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { Faces, uv, ccw, inset, plate, mix, clipU } from './vancouver-house-parts.js';

// Recessed glazing, white ledges and staggered party walls form a basket weave.
function floor(M, polygon, bottom, top, row, near, pixels = true, nextGlass = null) {
  const shell = inset(polygon, 0.25), core = inset(polygon, pixels ? 2.6 : 0.7);
  const outline = [], segments = [], thickness = pixels ? 0.48 : 0.38;
  for (let e = 0; e < shell.length; e++) {
    const a = shell[e], b = shell[(e + 1) % shell.length], c = core[e], d = core[(e + 1) % core.length];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]), normal = [(b[1] - a[1]) / length, -(b[0] - a[0]) / length];
    if (length < 0.01) continue;
    const n = Math.max(1, Math.round(length / (near ? 3.8 : 8.5)));
    for (let j = 0; j < n; j++) {
      const deep = pixels && (j + Math.floor(row / 2) + e) % 3 !== 0;
      const recess = deep ? 0 : pixels ? 1.05 : 0;
      const p = mix(a, b, j / n).map((v, k) => v - normal[k] * recess);
      const q = mix(a, b, (j + 1) / n).map((v, k) => v - normal[k] * recess);
      outline.push(p, q);
      segments.push({ p, q, a: mix(c, d, j / n), b: mix(c, d, (j + 1) / n), normal, j, e });
    }
    M.glass.wall(c, d, bottom, top - thickness, normal);
  }
  const clean = outline.filter((p, i) => { const q = outline[(i + outline.length - 1) % outline.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.005; });
  M.white.flat(clean, top); M.white.flat(clean, top - thickness, -1);
  for (let i = 0; i < clean.length; i++) {
    const a = clean[i], b = clean[(i + 1) % clean.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    M.white.wall(a, b, top - thickness, top, [(b[1] - a[1]) / l, -(b[0] - a[0]) / l]);
  }
  for (const s of segments) {
    const { p, q, a, b, normal, j, e } = s;
    // Pale opaque glazed balustrade, recessed from the slab edge.
    if (pixels && near) {
      const ra = p.map((v, k) => v - normal[k] * 0.18), rb = q.map((v, k) => v - normal[k] * 0.18), center = mix(ra, rb, 0.5);
      const distance = nextGlass ? Math.min(...nextGlass.map((a, i) => {
        const b = nextGlass[(i + 1) % nextGlass.length], dx = b[0] - a[0], dz = b[1] - a[1], length = Math.hypot(dx, dz);
        return length > 0.01 ? (dx * (center[1] - a[1]) - dz * (center[0] - a[0])) / length : Infinity;
      })) : -Infinity;
      // Growing upper floors can absorb a lower balcony. Remove its rail if it
      // lies inside, or within 0.28 m of, the next curtain wall/mullion plane.
      if (distance < -0.28) M.rail.wall(ra, rb, top, top + 0.98, normal);
    }
    if (pixels && (j + Math.floor(row / 2)) % 2 === 0) {
      const along = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(...along), width = near ? 0.34 : 0.48;
      const end = [q[0] - along[0] / l * width, q[1] - along[1] / l * width];
      M.white.wall(end, q, bottom, top - thickness, normal);
      if (near) {
        const innerEnd = [b[0] - along[0] / l * width, b[1] - along[1] / l * width];
        M.white.wall(q, b, bottom, top - thickness, [along[0] / l, along[1] / l]);
        M.white.wall(innerEnd, end, bottom, top - thickness, [-along[0] / l, -along[1] / l]);
      }
    }
    if (!near) continue;
    const point = mix(a, b, 0.5), along = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...along);
    if (l < 0.01) continue;
    const left = point.map((v, k) => v - along[k] / l * 0.065 + normal[k] * 0.08);
    const right = point.map((v, k) => v + along[k] / l * 0.065 + normal[k] * 0.08);
    M.metal.wall(left, right, bottom + 0.08, top - thickness - 0.08, normal);
    if (pixels && (row * 17 + j * 7 + e * 11) % 13 < 2) {
      const pa = mix(a, b, 0.12).map((v, k) => v + normal[k] * 0.15), pb = mix(a, b, 0.45).map((v, k) => v + normal[k] * 0.15);
      M.light.wall(pa, pb, bottom + 0.45, top - thickness - 0.25, normal);
    }
  }
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = Object.fromEntries(Object.keys(PALETTES.light).map(k => [k, new Faces()]));
  const stretch = mercStretch(SPEC.origin[1]);
  const site = ccw(FOOTPRINTS[0].slice(0, -1).map(([lng, lat]) => uv((lngToMercX(lng) - lngToMercX(SPEC.origin[0])) / stretch, (latToMercY(SPEC.origin[1]) - latToMercY(lat)) / stretch)));
  const ground = inset(site, 0.18);
  // Connected retail plinth, with the two mapped site tails rising nine storeys.
  floor(M, ground, 0, 4.2, 0, near, false);
  const wings = [clipU(ground, -22.2, -1), clipU(ground, 22.2, 1)];
  for (const wing of wings) {
    if (wing.length < 3) continue;
    for (let k = 0; k < 8; k++) floor(M, wing, 4.2 + k * 2.85, 4.2 + (k + 1) * 2.85, k, near, false);
  }
  const occupiedRoof = 152.8, count = 51, step = (occupiedRoof - 4.2) / count;
  for (let k = 0; k < count; k++) {
    const bottom = 4.2 + k * step, top = bottom + step;
    const nextGlass = k < count - 1 ? inset(plate(top + step / 2), 2.6) : inset(plate(153), 3.9);
    floor(M, plate((bottom + top) / 2), bottom, top, k, near, true, nextGlass);
  }
  // Recessed crown contacts the last terrace; the plant reaches sourced height.
  const crown = inset(plate(153), 3.2);
  floor(M, crown, 152.8, 154.55, 52, near, false);
  const plant = [[-7, -4], [7, -4], [7, 4], [-7, 4]];
  for (let i = 0; i < 4; i++) {
    const a = plant[i], c = plant[(i + 1) % 4], l = Math.hypot(c[0] - a[0], c[1] - a[1]);
    M.metal.wall(a, c, 154.55, SPEC.height, [(c[1] - a[1]) / l, -(c[0] - a[0]) / l]);
  }
  M.roof.flat(plant, SPEC.height);
  for (const [name, faces] of Object.entries(M)) if (faces.indices.length) b.put(faces.geometry(), name);
  const root = b.finish();
  root.traverse(o => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  root.userData.elevationDatum = 'Rigid local street grade y=0; no DEM, sea level or latitude stretch baked.';
  return root;
}
