// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Mesh, ringPoint, ringParams, glassNormal, loft, sweep, fin, cap, box, envelope, hash01, ROOF_Y, TOP_Y, LOBBY_Y, PITCH, FIN_OUT } from './salesforce-tower-parts.js';

// The tower is a stack of rings. Every ring is the same rounded square, scaled by the taper law in
// salesforce-tower-parts.js and rotated onto the street grid. From the ground up:
//   0 to 9 m      recessed glass lobby behind slender fin columns, closed by a deep canopy beam
//   9 to 296 m    blue-grey glass, a white sunshade at every floor line, vertical fins between the bays,
//                 a share of the bays lit at night
//   296 to 326 m  the crown: a roof deck, then an open screen of fins and rings you can see sky through,
//                 with inward-facing LED bands ("Day for Night") on the inside of the screen

// Sunshade: underside, a thin lip and a top that slopes down and outward (offset from glass, rise).
// The lip leans 4 cm inward to its top: a dead-vertical lip 0.7 m off the glass collides with the (slightly tilted, because the corner radius grows
// with height) glass plane in the QA plane hash at about 130 m, where n.y * y is large; the tilt keeps it in its own plane group.
const SHADE = [[0, 0], [SPEC.sunshadeOut, 0], [SPEC.sunshadeOut - 0.04, 0.45], [0, 0.7]];
const SHADE_FAR = [[0, 0], [SPEC.sunshadeOut, 0.12], [0, 0.55]];
const LOBBY_RECESS = -0.8; // the lobby glass stands this far behind the facade plane
const LOBBY_BEAM = [[LOBBY_RECESS, 0], [SPEC.sunshadeOut, 0], [SPEC.sunshadeOut, 0.9], [0, 1.25]];
const ROOF_BEAM = [[0, 0], [SPEC.sunshadeOut, 0], [SPEC.sunshadeOut, 0.8], [-0.3, 0.8], [-0.3, 0]];
const CROWN_RING = [[-0.3, 0], [0.9, 0], [0.9, 1.2], [-0.3, 1.2], [-0.3, 0]];
const CROWN_RING_FAR = [[-0.3, 0], [0.9, 0], [0.9, 2.2], [-0.3, 2.2], [-0.3, 0]];
const CROWN_CAP = [[-0.3, 0], [0.95, 0], [0.95, 1.2], [-0.3, 1.2], [-0.3, 0]];
const SIDES = 'os';

// Fin / bay positions around the ring: nS bays on each straight side, nA on each corner arc.
function bayEdges(nS, nA) {
  const edges = [];
  for (let k = 0; k < 8; k++) { const n = k % 2 === 0 ? nS : nA; for (let i = 0; i < n; i++) edges.push(k + i / n); }
  return edges;
}

// Crown fins at an even spacing along the perimeter at height y (the sides are short up there, so a fixed count would crowd).
function crownEdges(y, pitch) {
  const { S, R } = envelope(y), G = S - FIN_OUT, Rg = Math.max(0.3, R - FIN_OUT), f = G - Rg;
  return bayEdges(Math.max(1, Math.round(2 * f / pitch)), Math.max(2, Math.round(Math.PI / 2 * Rg / pitch)));
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = { glass: new Mesh(), fin: new Mesh(), glow: new Mesh(), light: new Mesh(), roof: new Mesh(), metal: new Mesh() };
  // Near: eight segments per corner arc up to 150 m, five above (the arcs are shallow up there). Far: three.
  const low = ringParams(near ? 8 : 3), high = ringParams(near ? 5 : 3), params = high;

  // Floor lines: LOBBY_Y + k * PITCH up to the last one below the roof deck.
  const lines = [];
  for (let k = 0; LOBBY_Y + k * PITCH < ROOF_Y - 0.5; k++) lines.push(LOBBY_Y + k * PITCH);
  const lastLine = lines.length - 1;
  const K0 = near ? Math.round((150 - LOBBY_Y) / PITCH) : 0; // floor line where the ring drops from 8 to 5 arc segments
  const paramsAt = (k) => (near && k < K0 ? low : high);

  // ---- glass: lobby, then the tapering curtain wall up to the roof deck
  loft(M.glass, [0, LOBBY_Y], low, LOBBY_RECESS);
  if (near) {
    // the coarse ring's top edge lies inside the span of the sunshade underside at line K0, which closes the join
    loft(M.glass, lines.slice(0, K0 + 1), low, 0);
    loft(M.glass, [...lines.slice(K0), ROOF_Y], high, 0);
  } else loft(M.glass, [...lines.filter((_, k) => k % 8 === 0), lines[lastLine], ROOF_Y], high, 0);

  // ---- sunshades: one ring at every floor line (every other one in far)
  sweep(M.fin, LOBBY_Y, low, LOBBY_BEAM);
  lines.forEach((y, k) => {
    if (k === 0) return;
    if (!near && k % 2 && k !== lastLine) return;
    sweep(M.fin, y, paramsAt(k), near ? SHADE : SHADE_FAR);
  });
  sweep(M.fin, ROOF_Y, params, ROOF_BEAM); // open at the bottom: the deck closes it

  // ---- vertical fins: lobby columns, then fins up the curtain wall (near only; far keeps the corners)
  const edges = near ? bayEdges(8, 6) : bayEdges(2, 2); // far keeps only the lobby columns
  const finYs = near ? [...lines.filter((_, k) => k % 4 === 0), lines[lastLine], ROOF_Y] : [LOBBY_Y, ...lines.filter((_, k) => k % 16 === 0 && k > 0), lines[lastLine], ROOF_Y];
  for (const p of edges) {
    fin(M.fin, [0, LOBBY_Y], p, { inner: LOBBY_RECESS, outer: 0.4, width: near ? 0.22 : 0.5, faces: SIDES });
    if (near) fin(M.fin, finYs, p, { inner: -0.2, outer: 0.34, width: 0.2, faces: SIDES }); // white mullions; the inner end sinks into the glass past the arc chord
  }

  // ---- lit bays: a deterministic share of the windows glows at night (it reads as glass by day). Near lights single
  // bays on every floor; far lights coarser bays on every other floor.
  const bays = bayEdges(near ? 8 : 4, near ? 6 : 3), lift = near ? 0.15 : 0.25; // lit panes stand proud of the glass: > 0.15 m on a surface this large keeps them out of z-fighting
  lines.forEach((y, k) => {
    if (k === lastLine || (!near && k % 2)) return;
    const y0 = y + 0.95, y1 = y + PITCH - 0.35;
    const floorBias = 0.55 + hash01(k, 3); // some floors are busier than others
    bays.forEach((pa, j) => {
      if (hash01(k + 1, j + 7) > (near ? 0.27 : 0.34) * floorBias) return;
      const pb = j + 1 < bays.length ? bays[j + 1] : 8, m = Math.floor(pa) % 2 === 1 ? 2 : 1, shrink = (pb - pa) * 0.07;
      const rowAt = (yy) => {
        const row = [];
        for (let s = 0; s <= m; s++) {
          const p = pa + shrink + (pb - pa - 2 * shrink) * (s / m), q = ringPoint(yy, p, lift);
          row.push(M.glow.vertex([q[0], yy, q[1]], glassNormal(yy, p, lift)));
        }
        return row;
      };
      const lo = rowAt(y0), hi = rowAt(y1);
      for (let s = 0; s < m; s++) M.glow.quad(lo[s], lo[s + 1], hi[s + 1], hi[s]);
    });
  });

  // ---- roof deck and its plant, inside the crown
  cap(M.roof, ROOF_Y, params, 0);
  const plant = (u0, u1, v0, v1, h) => box(M.metal, u0, u1, v0, v1, ROOF_Y, ROOF_Y + h);
  plant(-8, 6, -5, 7, 6.5); // main plant enclosure
  plant(9, 11.5, -9, 9, 1.6); // window-washing rail
  plant(-12, -9.5, -6, 4, 2.2);

  // ---- the crown: rings and fins of an open screen, the sky showing between them
  const crownRings = near ? [1, 2, 3, 4, 5, 6] : [2, 4, 6];
  for (const i of crownRings) sweep(M.fin, ROOF_Y + PITCH * i, params, near ? CROWN_RING : CROWN_RING_FAR, true);
  sweep(M.fin, TOP_Y - 1.2, params, CROWN_CAP, true);
  const crownFins = crownEdges(311, near ? 2.0 : 4.0);
  const crownYs = Array.from({ length: near ? 9 : 5 }, (_, i) => ROOF_Y + (TOP_Y - 0.6 - ROOF_Y) * i / (near ? 8 : 4));
  for (const p of crownFins) fin(M.fin, crownYs, p, { inner: -0.2, outer: 0.8, width: near ? 0.5 : 1.0, faces: 'osi' });

  // LED bands on the inside of the screen, between the rings: a thin box on the fins' inner faces, lit on its inward face
  // (seen through the lattice from outside and from above)
  const ledRows = near ? [0, 1, 2, 3, 4, 5] : [1, 3, 5];
  for (const i of ledRows) {
    const y = ROOF_Y + PITCH * i + 1.5, h = near ? 2.0 : 2.4; // between the rings (1.2 m deep near, 2.2 m far)
    sweep(M.light, y, params, [[-0.2, h], [-0.36, h], [-0.36, 0], [-0.2, 0]]); // a thin box resting on the inner faces of the fins
  }

  for (const [name, m] of Object.entries(M)) b.put(m.geometry(), name);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // a building carries no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level; the lobby floor stands on it.';
  return root;
}
