import { lancet, disc } from './grace-cathedral-kit.js';
import { FRONT_Z, PORCH_Z, ENTRY_Y } from './grace-cathedral-plan.js';

const WALL_Z = 40.2; // face of the central bay between the towers (the tower buttresses stand at 40.5)
const BAY = 5.85; // half width of the wall, tucked behind the tower shafts
const WALL_TOP = 40.8, PT = 22.6; // top of the central wall; top of the porch block (the gable rises to PT + 4.6)

// The Taylor Street front between the towers: the porch with its stepped pointed arch, gable and gilded doors, the rose
// window, the arcade under the nave gable, and the Great Stairs.
export function buildFront(k) {
  const { near } = k, seg = near ? 3 : 1;
  // ---- central wall and nave gable ---------------------------------------------
  k.box('stone', -BAY, BAY, 0, WALL_TOP, 36.0, WALL_Z);
  k.gableZ('stone', 0, 37.4, 39.3, 34.3, 8.3, 9.5); // the nave roof's gable end, apex 43.8 m, showing above the wall
  // ---- porch: a deep slab with the great pointed arch, two stepped orders, a gabled roof and pinnacles ----------
  const base = ENTRY_Y + 0.2, hole = lancet(5.4, 13.9, seg + 1, 1.25).map(([x, y]) => [x, y + base]);
  k.slab('stone', 10.3, PT, PORCH_Z - WALL_Z, [hole], 'F', 0, 0, PORCH_Z);
  const o1 = lancet(6.4, 14.9, seg + 1, 1.25), o2 = lancet(7.4, 15.9, seg + 1, 1.25), o0 = lancet(5.4, 13.9, seg + 1, 1.25);
  k.archOrder('stone', o1, o0, 0.4, 'F', 0, base, PORCH_Z + 0.4);
  k.archOrder('stone', o2, o1, 0.4, 'F', 0, base, PORCH_Z + 0.8);
  k.gableZ('stone', 0, PORCH_Z - 0.6, PORCH_Z + 0.7, PT - 0.2, 3.7, 4.8); // front gable, apex 27.2 m
  k.gableZ('roof', 0, WALL_Z, PORCH_Z - 0.6, PT - 0.2, 3.45, 4.5); // the porch roof running back to the wall
  for (const x of [-4.6, 4.6]) { k.box('stone', x - 0.5, x + 0.5, PT, PT + 0.9, PORCH_Z - 1.2, PORCH_Z - 0.2); k.pyramid('stone', x, PORCH_Z - 0.7, PT + 0.9, PT + 4.2, 0.5); }
  k.panel('glass', lancet(5.2, 13.4, seg + 1, 1.25), 'F', 0, ENTRY_Y + 0.3, WALL_Z + 0.1); // the dark depth of the portal
  if (near) {
    k.panel('recess', disc(0.6, 10), 'F', 0, 24.4, PORCH_Z + 0.78); // quatrefoil in the gable
    for (const x of [-4.5, 4.5]) { // traceried windows beside the arch
      k.panel('recess', lancet(1.0, 6.0, 3), 'F', x, 10.2, PORCH_Z + 0.08);
      k.panel('glass', lancet(0.6, 5.0, 3), 'F', x, 10.45, PORCH_Z + 0.16);
    }
    for (const x of [-4.5, 4.5]) k.panel('recess', lancet(1.0, 4.0, 3), 'F', x, 16.4, PORCH_Z + 0.08); // upper pair
  }
  // Gates of Paradise: two gilded leaves, deep inside the portal
  if (near) {
    for (const x of [-0.93, 0.93]) k.panel('brass', [[-0.88, 0], [0.88, 0], [0.88, 6.2], [-0.88, 6.2]], 'F', x, ENTRY_Y + 0.3, WALL_Z + 0.35);
    for (const x of [-1.8, 0, 1.8]) k.box('glass', x - 0.03, x + 0.03, ENTRY_Y + 0.3, ENTRY_Y + 6.5, WALL_Z + 0.4, WALL_Z + 0.46);
    for (let i = 1; i < 5; i++) k.box('glass', -1.8, 1.8, ENTRY_Y + 0.3 + i * 1.24 - 0.03, ENTRY_Y + 0.3 + i * 1.24 + 0.03, WALL_Z + 0.4, WALL_Z + 0.46);
  }
  // ---- rose window: a glowing disc behind a stone wheel of twelve petals ----------------
  const ry = 31.6, rz = WALL_Z + 0.08;
  k.panel('glow', disc(3.4, near ? 28 : 14), 'F', 0, ry, rz);
  k.ring('stone', 'F', 0, ry, rz + 0.3, 3.35, 3.95, 0.25, near ? 28 : 14);
  if (near) {
    for (let i = 0; i < 12; i++) { // outer petals (r 2.55) and inner petals (r 1.4) in alternate directions
      const a = (i / 12) * Math.PI * 2, b = a + Math.PI / 12;
      k.ring('stone', 'F', 2.55 * Math.cos(a), ry + 2.55 * Math.sin(a), rz + 0.3, 0.44, 0.6, 0.2, 10);
      k.ring('stone', 'F', 1.4 * Math.cos(b), ry + 1.4 * Math.sin(b), rz + 0.3, 0.2, 0.34, 0.2, 8);
      k.bar('stone', [0.88 * Math.cos(b), ry + 0.88 * Math.sin(b), rz + 0.2], [3.3 * Math.cos(b), ry + 3.3 * Math.sin(b), rz + 0.2], 0.07, 0.1); // fine mullions between the petals
    }
    k.ring('stone', 'F', 0, ry, rz + 0.3, 0.55, 0.9, 0.2, 14); // hub ring
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.panel('recess', disc(0.5, 8), 'F', sx * 4.35, ry + sy * 3.3, WALL_Z + 0.1);
  }
  // ---- string courses and the blind arcade under the gable ------------------------------
  k.box('stone', -BAY, BAY, 26.4, 26.9, WALL_Z, WALL_Z + 0.4);
  k.box('stone', -BAY, BAY, 40.1, WALL_TOP, WALL_Z, WALL_Z + 0.5);
  if (near) {
    k.box('stone', -BAY, BAY, 34.9, 35.3, WALL_Z, WALL_Z + 0.35);
    for (let i = -2; i <= 2; i++) k.panel('recess', lancet(1.3, 3.6, 3), 'F', i * 2.0, 35.7, WALL_Z + 0.12);
    for (let i = -4; i <= 4; i++) k.box('stone', i * 1.2 - 0.3, i * 1.2 + 0.3, WALL_TOP, WALL_TOP + 0.6, WALL_Z + 0.05, WALL_Z + 0.45);
  }
  // ---- the Great Stairs ----------------------------------------------------------------------
  const n = near ? 24 : 6, rise = ENTRY_Y / n, tread = near ? 0.55 : 2.2, landing = 5.0; // the buried back reaches under the towers
  const zFoot = FRONT_Z - 0.5 + landing + n * tread;
  k.stairs('concrete', 28, zFoot, n, rise, tread, landing);
  if (near) for (const x of [-9.5, -4.0, 4.0, 9.5]) { // dark pipe handrails on posts, standing on the treads
    const zTop = zFoot - n * tread, surf = (z) => Math.min(ENTRY_Y, Math.max(0, (zFoot - z) / tread | 0) * rise + rise);
    k.bar('glass', [x, ENTRY_Y + 1.0, zTop], [x, rise + 1.0, zFoot - 0.3], 0.07, 0.07);
    for (let i = 0; i <= 8; i++) { const z = zTop + (zFoot - 0.3 - zTop) * (i / 8), y = ENTRY_Y + 1.0 - (ENTRY_Y - rise) * (i / 8); k.box('glass', x - 0.035, x + 0.035, Math.max(0, surf(z) - 0.02), y, z - 0.035, z + 0.035); }
  }
}
