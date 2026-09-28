import alignment from './champlain-alignment.js';
import { lngToMercX, latToMercY, mercXToLng, mercYToLat, mercStretch } from '../facade/geo.js';

// Local metres, east +X, up +Y, south +Z; the same frame is used by the
// generator, exported GLB, geographic placement and navigation surface.
export const CHAMPLAIN = Object.freeze({
  id: 'samuel-de-champlain',
  origin: alignment.origin,
  towerHeight: 168,
  deckHeight: 42,
  width: 60,
  mainSpan: 240,
  backSpan: 200,
});
export const STRETCH = mercStretch(CHAMPLAIN.origin[1]);
const OX = lngToMercX(CHAMPLAIN.origin[0]);
const OZ = -latToMercY(CHAMPLAIN.origin[1]);

export function bridgeLocal(lng, lat) {
  return { x: (lngToMercX(lng) - OX) / STRETCH, z: (-latToMercY(lat) - OZ) / STRETCH };
}
export function bridgeLngLat(x, z) {
  return [mercXToLng(OX + x * STRETCH), mercYToLat(-(OZ + z * STRETCH))];
}

export const ALIGNMENT = alignment.centerline.map(([lng, lat]) => bridgeLocal(lng, lat));
let total = 0;
for (let i = 0; i < ALIGNMENT.length; i++) {
  if (i) total += Math.hypot(ALIGNMENT[i].x - ALIGNMENT[i - 1].x, ALIGNMENT[i].z - ALIGNMENT[i - 1].z);
  ALIGNMENT[i].s = total;
}
export const BRIDGE_LENGTH = total;

export function projectBridge(x, z) {
  let best = null;
  for (let i = 1; i < ALIGNMENT.length; i++) {
    const a = ALIGNMENT[i - 1], b = ALIGNMENT[i];
    const dx = b.x - a.x, dz = b.z - a.z, len = b.s - a.s;
    if (!len) continue;
    const raw = ((x - a.x) * dx + (z - a.z) * dz) / (len * len);
    const t = Math.max(0, Math.min(1, raw));
    const ex = x - a.x - dx * t, ez = z - a.z - dz * t;
    const dist = Math.hypot(ex, ez);
    if (!best || dist < best.distance) best = {
      s: a.s + len * t, lateral: (-dz * ex + dx * ez) / len,
      distance: dist, tx: dx / len, tz: dz / len,
      // Geographic round trips add nanometres at an exact abutment. Do not
      // drop the car to the ground because that noise lies outside the span.
      beyond: (i === 1 && raw * len < -0.001) || (i === ALIGNMENT.length - 1 && (raw - 1) * len > 0.001),
    };
  }
  return best;
}
export const TOWER_STATION = projectBridge(0, 0).s;
export const ROAD_EDGES = [[-25.5, -11.1], [11.1, 29.4]];
const JOIN_LENGTH = 350;
const sectionCache = new WeakMap();

function sectionEdges(s, sections, side) {
  if (!sections?.length) return null;
  let roads = sectionCache.get(sections);
  if (!roads) {
    roads = [0, 1].map((side) => sections.filter((v) => v.edges[side] && v.edges[side][1] - v.edges[side][0] >= 5));
    sectionCache.set(sections, roads);
  }
  const points = roads[side];
  if (!points.length) return null;
  let lo = 0, hi = points.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (points[mid].s < s) lo = mid + 1; else hi = mid; }
  const a = points[Math.max(0, lo - 1)], b = points[Math.min(points.length - 1, lo)];
  const t = a.s === b.s ? 0 : (s - a.s) / (b.s - a.s);
  return a.edges[side].map((v, i) => v + (b.edges[side][i] - v) * t);
}

/** HD pavement controls the whole deck; without those samples only the
 * last spans ease into the known approach width and offset. */
export function roadEdges(s, joins, sections) {
  const end = s < BRIDGE_LENGTH / 2 ? 0 : 1;
  const distance = end ? BRIDGE_LENGTH - s : s;
  const t = Math.max(0, Math.min(1, distance / JOIN_LENGTH));
  const weight = 1 - t * t * (3 - 2 * t);
  return ROAD_EDGES.map((edges, side) => {
    const measured = sectionEdges(s, sections, side);
    if (measured) return measured;
    return edges.map((d, i) => d + ((joins?.[end]?.[side]?.[i] ?? d) - d) * weight);
  });
}

export function fittedLateral(s, d, joins, sections) {
  if (Math.abs(d) < 10) return d; // REM, main tower and its stay anchorages
  const side = d < 0 ? 0 : 1, old = ROAD_EDGES[side], next = roadEdges(s, joins, sections)[side];
  // Preserve the shoulder/path widths outside the pavement itself.
  if (d < old[0]) return d + next[0] - old[0];
  if (d > old[1]) return d + next[1] - old[1];
  return next[0] + (d - old[0]) / (old[1] - old[0]) * (next[1] - next[0]);
}

// A deliberately smooth visual profile. The mapped alignment is measured;
// these elevations are authored approximations in Codriver's flat world.
// Abutments meet the loaded road datum, or ground level for ordinary roads.
export function deckHeight(s, approaches = [0, 0]) {
  const rise = Math.max(0, Math.min(1, s / TOWER_STATION));
  const fall = Math.max(0, Math.min(1, (BRIDGE_LENGTH - s) / (BRIDGE_LENGTH - TOWER_STATION - 240)));
  const smooth = (v) => v * v * (3 - 2 * v);
  return CHAMPLAIN.deckHeight * Math.min(smooth(rise), smooth(fall))
    + approaches[0] * (1 - smooth(rise)) + approaches[1] * (1 - smooth(fall));
}

export function bridgePoint(station, lateral = 0, height = null) {
  const s = Math.max(0, Math.min(BRIDGE_LENGTH, station));
  let i = 1;
  while (i < ALIGNMENT.length - 1 && ALIGNMENT[i].s < s) i++;
  const a = ALIGNMENT[i - 1], b = ALIGNMENT[i];
  const len = b.s - a.s, t = len ? (s - a.s) / len : 0;
  const tx = (b.x - a.x) / len, tz = (b.z - a.z) / len;
  return { x: a.x + (b.x - a.x) * t - tz * lateral, y: height ?? deckHeight(s), z: a.z + (b.z - a.z) * t + tx * lateral, tx, tz };
}

/** Null off the two road decks, including the REM gap and roads crossing below. */
export function bridgeRoadHeight(lng, lat, headingDeg, approaches, joins, sections) {
  const { x, z } = bridgeLocal(lng, lat);
  // Cheap rejection for the rest of the planet, before scanning the alignment.
  if (x < ALIGNMENT[0].x - 50 || x > ALIGNMENT[ALIGNMENT.length - 1].x + 50 || Math.abs(z) > 600) return null;
  const p = projectBridge(x, z);
  if (!p || p.beyond) return null;
  const onRoad = sections?.length || joins?.some(Boolean)
    ? roadEdges(p.s, joins, sections).some(([a, b], side) => p.lateral >= Math.min(side ? 10.5 : -31, a - 0.6)
      && p.lateral <= Math.max(side ? 31 : -10.5, b + 0.6))
    : Math.abs(p.lateral) >= 10.5 && Math.abs(p.lateral) <= 31;
  if (!onRoad) return null;
  if (Number.isFinite(headingDeg)) {
    const h = headingDeg * Math.PI / 180;
    if (Math.abs(Math.sin(h) * p.tx - Math.cos(h) * p.tz) < 0.8) return null;
  }
  return deckHeight(p.s, approaches);
}

// A sparse route may span an entire curved approach with one segment. Add
// samples locally so its ribbon follows the vertical profile. Keep a mapping
// to the original segments so congestion colours retain their boundaries.
export function resampleBridgeLine(line) {
  const coords = [line.coords[0]], segmentMap = [];
  let changed = false;
  for (let i = 1; i < line.coords.length; i++) {
    const a = line.coords[i - 1], b = line.coords[i];
    const p = bridgeLocal(a[0], a[1]), q = bridgeLocal(b[0], b[1]);
    const overlaps = Math.max(p.x, q.x) >= ALIGNMENT[0].x - 40
      && Math.min(p.x, q.x) <= ALIGNMENT[ALIGNMENT.length - 1].x + 40
      && Math.max(p.z, q.z) >= -300 && Math.min(p.z, q.z) <= 250;
    const count = overlaps ? Math.min(256, Math.max(1, Math.ceil(Math.hypot(q.x - p.x, q.z - p.z) / 20))) : 1;
    changed ||= count > 1;
    for (let j = 1; j <= count; j++) {
      coords.push(j === count ? b : [a[0] + (b[0] - a[0]) * j / count, a[1] + (b[1] - a[1]) * j / count]);
      segmentMap.push(i - 1);
    }
  }
  return changed ? { ...line, coords, segmentMap } : line;
}
