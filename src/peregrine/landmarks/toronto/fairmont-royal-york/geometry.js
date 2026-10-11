import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { RINGS, LEVELS, U, V, at, centroid, inside } from './fairmont-royal-york-site.js';
import { meshKit } from './fairmont-royal-york-mesh.js';
import { crown } from './fairmont-royal-york-crown.js';
import { arcade, wing, ground } from './fairmont-royal-york-facade.js';

// Fairmont Royal York (1929, Ross and Macdonald with Sproatt and Rolph), as it stands: a 160 m limestone
// block along Front Street with a comb plan (west wing, spine and east wing joined at the podium, three
// fingers opening north), a 25 m Chateau podium with the Concert Hall arcade on Front Street, 67 m
// shoulders, the 87 m tower spine, a stepped crown and its steep verdigris hipped roof, dormers, corner
// turrets, the stone chimney stack, and the lit "Fairmont Royal York" sign. Slab plans and heights are
// the OSM building:part ways; everything on the facades is reconstructed from photographs.
// Frame: +X east, +Y up, +Z south, real metres, y = 0 local grade. No rotation is applied: the mapped
// rings already carry the hotel's 16.6 degree grid angle.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const kit = meshKit();
  const L = LEVELS;
  const ctx = { b, kit, near, L, rand: rng(1929) };

  // --- the slabs: walls, and a roof cap under everything (hidden where the next slab stands on it) ---
  const SLABS = [
    { key: 'A', ring: RINGS.BASE, y0: 0, y1: L.podium, roof: 'roof' },
    { key: 'B', ring: RINGS.SHOULDERS, y0: L.podium, y1: L.shoulders, roof: 'roof' },
    { key: 'C', ring: RINGS.TOWER, y0: L.shoulders, y1: L.tower, roof: 'roof' },
    { key: 'D', ring: RINGS.STEP, y0: L.tower, y1: L.step, roof: 'roof' },
    { key: 'E', ring: RINGS.CROWN, y0: L.step, y1: L.crownWalls, roof: 'roof' },
  ];
  for (const s of SLABS) {
    kit.walls('limestone', s.ring, s.y0, s.y1);
    kit.cap(s.roof, s.ring, s.y1, true);
    s.edges = kit.edges(s.ring);
  }
  const slab = Object.fromEntries(SLABS.map((s) => [s.key, s]));
  ctx.slab = slab;

  ground(ctx);
  wing(ctx);
  arcade(ctx);
  crown(ctx);
  rooftop(ctx);

  kit.flush(b);
  const root = b.finish();
  root.userData.tris = kit.stats.tris;
  return root;
}

// Machine rooms and stair heads on the roofs: a few plain boxes so no roof is a bare slab. Positions are
// hotel (u, v) coordinates; every corner must stand on the roof it is meant for.
function rooftop({ kit, near, L }) {
  if (!near) return;
  const yaw = Math.atan2(U[1], U[0]), ba = RINGS.BASE, sh = RINGS.SHOULDERS, tw = RINGS.TOWER;
  const boxes = [
    [ba, -41, -20, 3.2, 2.2, 3.2, L.podium], [ba, 1, -22, 2.6, 2.0, 2.8, L.podium], [ba, 44, -18, 3.0, 2.2, 3.0, L.podium],
    [sh, 65, -5, 3.0, 2.4, 4.4, L.shoulders], [sh, 65, 20, 2.2, 1.8, 3.2, L.shoulders], [sh, -64, -10, 2.4, 2.0, 3.6, L.shoulders],
    [sh, 21, -20, 2.2, 1.8, 3.0, L.shoulders], [sh, 43, 4, 3.0, 2.0, 3.4, L.shoulders],
    [tw, -45, 4, 2.8, 2.2, 3.6, L.tower, RINGS.STEP], [tw, 5, 4, 2.6, 2.0, 3.2, L.tower, RINGS.STEP],
  ];
  for (const [ring, u, v, hw, hd, h, y, keepOut] of boxes) {
    const c = at(u, v), r = kit.block('limestone', c[0], y, y + h, c[1], hw, hd, yaw, { top: false }); // the roof cap below is the top
    if (!r.every(([x, z]) => inside(ring, x, z) && !(keepOut && inside(keepOut, x, z)))) throw new Error(`rooftop box (${u}, ${v}) is off its roof`);
    kit.cap('roof', r, y + h, true);
  }
}

function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
