// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Mesh, ringParams, ringPoint, bayEdges, loft, sweep, fin, rib, cap, box, hash01 } from './brookfield-place-calgary-parts.js';
import { buildPavilion } from './brookfield-place-calgary-pavilion.js';

// Brookfield Place East is a straight glass prism, 66 x 41 m with rounded corners (radius 5.5 m), turned 2 degrees onto the mapped outline.
// From the ground up:
//   0 to 12.9 m     the two-storey lobby: dark glass set back 0.6 m behind slim columns, closed by a belt cornice
//   12.9 to 229 m   the curtain wall: dark blue reflective glass, a silver floor line at each of 52 floors and a vertical
//                   mullion every 1.5 m; part of the offices glow at night
//   229 to 247 m    the glass crown: a lantern of lighter glass on a projecting ledge, ringed by vertical ribs that flare
//                   out over their top 9 m, closed by a rim whose lip flares out; the roof deck and plant sit inside it
// The three-storey glass pavilion of the complex (OSM way 575090048) stands against the west and south-west faces.
const Y0 = SPEC.lobbyY, ROOF = SPEC.roofY, TOP = SPEC.height, CROWN0 = SPEC.crownBaseY, PITCH = (ROOF - Y0) / SPEC.floors;
const LOBBY_TOP = Y0 - 0.9; // the belt cornice spans 12.0 to 12.9 m
const RECESS = -0.6; // the lobby glass stands this far behind the facade plane
const MULLION_OUT = 0.2, RING_OUT = 0.2, LIT_OUT = 0.16; // proud of the glass (all > 0.15 m on a surface this large)

const BELT = [[RECESS, 0], [0.55, 0], [0.55, 0.9], [RECESS, 0.9]];
const FLOOR_LINE = [[0, 0], [RING_OUT, 0], [RING_OUT, 0.28], [0, 0.34]];
const FLOOR_LINE_FAR = [[0, 0], [0.3, 0], [0.3, 0.6], [0, 0.7]]; // thinner than before and drawn in the mullion tone: the real wall is a smooth mirror
const LEDGE = [[-0.2, 0], [0.7, 0], [0.7, 0.9], [-0.2, 0.9]];
const CROWN_RING = [[-0.2, 0], [0.4, 0], [0.4, 0.4], [-0.2, 0.4]];
const RIM = [[-0.35, 0], [0.3, 0], [0.85, 0.45], [0.85, 1.0], [-0.35, 1.0]]; // the top ring flares out into a proud lip (0.85 m, as far out as the ledge; the footprint test allows no more)
const RIB_PATH = [[0.5, CROWN0], [0.5, TOP - 9], [0.62, TOP - 5], [0.76, TOP - 2.2], [0.8, TOP - 0.8]]; // a rib flares out over its top 9 m, into the proud lip
const RIB_PATH_FAR = [[0.5, CROWN0], [0.5, TOP - 9], [0.76, TOP - 2.2], [0.8, TOP - 0.8]];
const ROOF_DECK = TOP - 3.1; // the roof deck inside the crown screen

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = { glass: new Mesh(), frame: new Mesh(), mullion: new Mesh(), glow: new Mesh(), light: new Mesh(), lobby: new Mesh(), roof: new Mesh(), pglass: new Mesh() };
  const params = ringParams(near ? 4 : 2);

  // ---- lobby: dark glass behind slim columns, a transom, and the belt cornice that carries the curtain wall
  loft(M.lobby, [0, LOBBY_TOP], params, RECESS);
  sweep(M.frame, LOBBY_TOP, params, BELT, true);
  if (near) {
    for (const p of bayEdges(10, 18, 2)) fin(M.frame, [0, LOBBY_TOP], p, { inner: RECESS + 0.05, outer: -0.1, width: 0.45, faces: 'os' });
    sweep(M.frame, 5.6, params, [[RECESS, 0], [-0.3, 0], [-0.3, 0.35], [RECESS, 0.4]]);
  } else {
    for (const p of bayEdges(3, 5, 1)) fin(M.frame, [0, LOBBY_TOP], p, { inner: RECESS + 0.05, outer: -0.1, width: 0.7, faces: 'os' });
  }

  // ---- curtain wall: one tall glass loft, a floor line at each floor (every fourth in far), mullions (near only)
  loft(M.glass, [Y0, ROOF], params, 0);
  for (let k = 1; k < SPEC.floors; k++) {
    if (!near && k % 4) continue;
    sweep(M.mullion, Y0 + k * PITCH, params, near ? FLOOR_LINE : FLOOR_LINE_FAR);
  }
  if (near) for (const p of bayEdges(20, 36, 4)) fin(M.mullion, [Y0, ROOF], p, { inner: -0.02, outer: MULLION_OUT, width: 0.1, faces: 'os' });

  // ---- lit offices: a deterministic share of the window bays glows at night (it reads as glass by day).
  // Runs of lit bays merge into one quad on a straight side; arcs keep one quad per bay.
  {
    const nEW = near ? 20 : 6, nNS = near ? 36 : 11, nA = near ? 4 : 2, step = near ? 1 : 2;
    const prob = near ? 0.24 : 0.27;
    for (let k = 0; k < SPEC.floors; k += step) {
      const y0 = Y0 + k * PITCH + (k === 0 ? 0.25 : 0.45), y1 = Y0 + (k + step) * PITCH - 0.1;
      const busy = 0.55 + hash01(k, 3);
      for (let side = 0; side < 8; side++) {
        const n = side % 2 === 1 ? nA : (side % 4 === 0 ? nEW : nNS), lit = [];
        for (let i = 0; i < n; i++) lit.push(hash01(k + 1, side * 64 + i + 7) < prob * busy);
        const emit = (from, to) => {
          const row = (y) => [side + from / n, side + to / n].map((p) => { const q = ringPoint(p, LIT_OUT); return M.glow.vertex([q[0], y, q[1]], [q[2], 0, q[3]]); });
          const lo = row(y0), hi = row(y1);
          M.glow.quad(lo[0], lo[1], hi[1], hi[0]);
        };
        if (side % 2 === 1) { for (let i = 0; i < n; i++) if (lit[i]) emit(i + 0.08, i + 0.92); } else {
          let i = 0;
          while (i < n) { if (!lit[i]) { i++; continue; } let j = i; while (j + 1 < n && lit[j + 1]) j++; emit(i + 0.05, j + 0.95); i = j + 1; }
        }
      }
    }
  }

  // ---- crown: a ledge, a lantern of lighter glass, rings between the floors, ribs that flare out at the top, a proud rim; roof deck inside
  sweep(M.frame, ROOF, params, LEDGE, true);
  loft(M.light, [CROWN0, TOP - 1], params, -0.2); // outer face of the lantern glass, between the ledge top and the rim bottom
  loft(M.light, [ROOF_DECK, TOP - 1], params, -0.35, true); // its inside, seen across the roof deck and from above
  for (const y of near ? [233.9, 237.9, 241.9] : [237.9]) sweep(M.frame, y, params, CROWN_RING);
  sweep(M.frame, TOP - 1, params, RIM, true);
  for (const p of near ? bayEdges(15, 27, 4) : bayEdges(7, 14, 2)) rib(M.frame, p, near ? RIB_PATH : RIB_PATH_FAR, { inner: -0.2, width: near ? 0.3 : 0.6 });
  cap(M.roof, ROOF_DECK, params, -0.35);
  box(M.roof, -9, 5, -6, 8, ROOF_DECK, TOP - 0.7); // plant enclosure
  if (near) { box(M.frame, 10, 12.2, -9, 9, ROOF_DECK, ROOF_DECK + 1.5); box(M.frame, -12.5, -10, -7, 4, ROOF_DECK, ROOF_DECK + 2.2); } // window-washing rail and a small enclosure

  buildPavilion(M, near);

  for (const [name, m] of Object.entries(M)) if (m.triangles) b.put(m.geometry(), name);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // a building carries no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level; the lobby and pavilion floors stand on it.';
  return root;
}
