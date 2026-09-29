import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';
import { RINGS } from './footprint.js';

// The mapped rings, in the model's own metres: +X east, +Z south, origin = SPEC.origin.
const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
export const toLocal = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (-latToMercY(lat) - oz) / k];
export const localRing = (ring) => ring.map(toLocal);
export const centroid = (pts) => { let a = 0, x = 0, z = 0; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const f = pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1]; a += f; x += (pts[j][0] + pts[i][0]) * f; z += (pts[j][1] + pts[i][1]) * f; } return [x / (3 * a), z / (3 * a)]; };
export const mean = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

export const SITE = {};
for (const [name, ring] of Object.entries(RINGS)) SITE[name] = localRing(ring);
export const DOME_AT = mean(SITE.cinesphere);

// The four pipe masts of each pod: OSM `building:part=column`, height=32, ways 888735825-888735844
// (centres, [lng, lat]); a 0.8 m circle each, in a 3.5 m square cluster at the centre of the pod.
export const MASTS = {
  pod1: [[-79.4181978, 43.6286903], [-79.4181918, 43.6286604], [-79.4181535, 43.6286956], [-79.418145, 43.6286654]],
  pod2: [[-79.4186883, 43.628606], [-79.4187324, 43.6286007], [-79.4187265, 43.6285707], [-79.4186797, 43.6285758]],
  pod3: [[-79.4180417, 43.6283291], [-79.4180858, 43.6283232], [-79.4180791, 43.6282934], [-79.4180325, 43.628299]],
  pod4: [[-79.4175405, 43.6284171], [-79.4175845, 43.628411], [-79.4175775, 43.6283812], [-79.417531, 43.6283871]],
  pod5: [[-79.4170151, 43.628495], [-79.4170592, 43.6284889], [-79.4170523, 43.6284591], [-79.4170058, 43.6284648]],
};

// ---- derived plan geometry (all metres, model frame) ----------------------------------------------
export const signedArea = (r) => { let a = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1]; return a / 2; };
export const inside = (pt, ring) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [ax, az] = ring[j], [bx, bz] = ring[i];
    if ((az > pt[1]) !== (bz > pt[1]) && pt[0] < (bx - ax) * (pt[1] - az) / (bz - az) + ax) hit = !hit;
  }
  return hit;
};

/** Dominant edge direction (radians, along +x toward +z... as atan2(dz, dx)) folded to a quarter turn. */
export function yawOf(ring) {
  let sx = 0, sz = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const dx = ring[i][0] - ring[j][0], dz = ring[i][1] - ring[j][1], l = Math.hypot(dx, dz), a = Math.atan2(dz, dx);
    sx += l * Math.cos(4 * a); sz += l * Math.sin(4 * a);
  }
  return Math.atan2(sz, sx) / 4; // atan2(dz, dx) of an edge, so an edge runs along (cos, sin) in (x, z)
}

/** Small rectangular bumps on a ring (three short edges, two right-angle turns): the stair cores. */
export function findTabs(ring, minLen = 2.4, maxLen = 5.6) {
  const n = ring.length, len = (i) => Math.hypot(ring[(i + 1) % n][0] - ring[i][0], ring[(i + 1) % n][1] - ring[i][1]);
  const out = [];
  for (let i = 0; i < n; i++) {
    if (![i, i + 1, i + 2].every((k) => { const l = len(k % n); return l >= minLen && l <= maxLen; })) continue;
    const p = [0, 1, 2, 3].map((k) => ring[(i + k) % n]);
    const c = mean(p), attach = mean([p[0], p[3]]), tip = mean([p[1], p[2]]);
    const dir = [tip[0] - attach[0], tip[1] - attach[1]], l = Math.hypot(dir[0], dir[1]) || 1;
    out.push({ centre: c, dir: [dir[0] / l, dir[1] / l], attach, tip });
  }
  return out;
}

export const PODS = ['pod1', 'pod2', 'pod3', 'pod4', 'pod5'].map((name) => {
  const ring = SITE[name], centre = centroid(ring), yaw = yawOf(ring);
  return { name, ring, centre, yaw, tabs: findTabs(ring), masts: MASTS[name].map(toLocal) };
});
