import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { CENTERLINE, BRIDGE_ENDS } from './puente-de-segovia-alignment.js';

// A low bridge over a canalised river: the model is the mapped span only. The deck is level with
// the bank streets at both ends (Calle de Segovia, Paseo de la Virgen del Puerto), so no authored
// approach ramp ever lies over a junction, a stop line or a bend. Heights: y = 0 is the bank
// street grade; the road surface is DECK_H above it; the arches, piers and cutwaters hang below
// toward the river, RISE (estimated from photographs) under the road.
export const DECK_H = 0.1, RISE = 9.3, RIVER = DECK_H - RISE;
// Springing above the river (photographs).
export const SPRING = 1.0;
const raw = createBridgeProfile({ ...SPEC, width: 31, roadEdges: [[-12, 12]], centerline: CENTERLINE, profile: ({ length }) => [[0, 0], [length, 0]] });
// The mapped bridge way, end node to end node, keeping its own vertices.
function cut(s0, s1) {
  const at = (s) => { const q = raw.bridgePoint(s, 0, 0); return raw.bridgeLngLat(q.x, q.z); };
  return [at(s0), ...raw.ALIGNMENT.filter((p) => p.s > s0 + 0.5 && p.s < s1 - 0.5).map((p) => raw.bridgeLngLat(p.x, p.z)), at(s1)];
}
const centerline = cut(raw.stationAt(BRIDGE_ENDS[0]), raw.stationAt(BRIDGE_ENDS[1]));
const shape = createBridgeProfile({ ...SPEC, width: 31, roadEdges: [[-12, 12]], centerline, profile: ({ length }) => [[0, 0], [length, 0]] });
export const L = shape.BRIDGE_LENGTH, START = 0, END = L;

// Lateral frame (+ = south). The mapped outline's faces sit at -13.5 (north) and +17.2 (south)
// of the OSM road line; the PNOA orthophoto centres the 24.3 m carriageway on the structure.
export const CENTER = 1.85, HALF = 15.35, ROAD_HALF = 12.15, PARAPET = 0.5;
// Arches west to east (clear spans, m): central largest, decreasing symmetrically; 5.2 m piers.
export const SPANS = [8.4, 9.6, 11.1, 12.6, 13.0, 12.6, 11.1, 9.6, 8.4], PIER = 5.2;
// Mapped cutwater pairs are symmetric about this station (0.3 m scatter).
export const MID = START + 69.6;
// Arch heights are absolute (bank-grade frame): springing and crown sit below the street.
export const ARCHES = [], PIERS = [];
{
  const total = SPANS.reduce((a, v) => a + v, 0) + PIER * (SPANS.length - 1);
  let s = MID - total / 2;
  SPANS.forEach((span, i) => {
    ARCHES.push({ a: s, c: s + span, mid: s + span / 2, span, r: span / 2, crown: RIVER + SPRING + span / 2 });
    s += span;
    if (i < SPANS.length - 1) { PIERS.push(s + PIER / 2); s += PIER; }
  });
}
export const WEST_FACE = ARCHES[0].a, EAST_FACE = ARCHES.at(-1).c;

// The rigid level carriageway, centred on the structure. The fallback paint keeps clear of the
// two joints, where the bank streets' own junction paint begins.
export const ROAD_EDGES = [CENTER - ROAD_HALF, CENTER + ROAD_HALF];
export const PAINT_END = 1.5;
export const outerEdgesAt = () => [CENTER - HALF, CENTER + HALF];
// Materials wholly below the street grade (arches, spandrels, piers, cutwaters, voussoirs, cornice,
// coursing). Flat Cityscape ground does not hide them, so the layer shows them in Full 3D world only.
export const BELOW_GRADE = ['stone', 'base', 'ring', 'joint'];

const base = createBridgeProfile({ ...SPEC, palette: PALETTES.light, modelDir: 'bridges', width: 31, centerline,
  roadEdges: [ROAD_EDGES], terrainPolicy: 'bank-fit', buildingFootprints: FOOTPRINTS,
  // Full 3D world: the deck rides a straight line between the DEM at the two joints (the bank
  // streets), so the structure stays level with them; the rigid arches reach down into the terrain.
  groundControls: () => [{ s: 0, sampleS: 0 }, { s: L, sampleS: L }],
  profile: ({ length }) => [[0, 'start'], [length, 'end']] });

// The deck spans straight between the two live bank-street datums, DECK_H above them.
export function deckHeight(s, approaches = [0, 0]) {
  const t = Math.max(0, Math.min(1, s / L));
  return approaches[0] + (approaches[1] - approaches[0]) * t + DECK_H;
}
// The stone structure is rigid: its carriageway never moves to follow the live HD pavement.
const roadEdges = () => [ROAD_EDGES];
const fittedLateral = (s, d) => d;
function bridgeRoadHeight(lng, lat, heading, approaches) {
  const v = base.bridgeLocal(lng, lat);
  if (v.x < base.bounds.minX - 10 || v.x > base.bounds.maxX + 10 || v.z < base.bounds.minZ - 10 || v.z > base.bounds.maxZ + 10) return null;
  const q = base.projectBridge(v.x, v.z);
  if (q.beyond || q.lateral < ROAD_EDGES[0] - 0.6 || q.lateral > ROAD_EDGES[1] + 0.6) return null;
  if (Number.isFinite(heading) && Math.abs(Math.sin(heading * Math.PI / 180) * q.tx - Math.cos(heading * Math.PI / 180) * q.tz) < 0.8) return null;
  return deckHeight(q.s, approaches);
}
export const PROFILE = { ...base, deckHeight, roadEdges, fittedLateral, bridgeRoadHeight, meshStep: 2, surfaceStep: 2,
  bridgePoint: (s, d = 0, y = null) => base.bridgePoint(s, d, y ?? deckHeight(s)) };
