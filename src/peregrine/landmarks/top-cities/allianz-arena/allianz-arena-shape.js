// Shape model of the Allianz Arena shell: polar radii of the mapped outlines (smoothed so the shell reads as one soft
// oval, the "rubber dinghy"), the cross-section of the skin, and the rhombus lattice laid over it.
import { OUTER, OPENING, PLAZA } from './allianz-arena-plan.js';

export const TAU = 2 * Math.PI;

// Distance from the origin to a closed ring along direction angle a (x east, z south).
export function rayRing(ring, a) {
  const dx = Math.cos(a), dz = Math.sin(a);
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length], ex = q[0] - p[0], ez = q[1] - p[1];
    const den = dx * ez - dz * ex;
    if (Math.abs(den) < 1e-9) continue;
    const r = (p[0] * ez - p[1] * ex) / den, t = (p[0] * dz - p[1] * dx) / den;
    if (r > 0 && t >= -1e-9 && t <= 1 + 1e-9) best = Math.min(best, r);
  }
  return best;
}

// Periodic low-pass (harmonics 0..h) of the ring's polar radius, then scaled so it never leaves the mapped ring.
function smoothRadius(ring, h, margin) {
  const n = 360, raw = Array.from({ length: n }, (_, i) => rayRing(ring, i * TAU / n));
  const co = [];
  for (let k = 0; k <= h; k++) {
    let c = 0, s = 0;
    for (let i = 0; i < n; i++) { c += raw[i] * Math.cos(k * i * TAU / n); s += raw[i] * Math.sin(k * i * TAU / n); }
    co.push([c * (k ? 2 : 1) / n, s * (k ? 2 : 1) / n]);
  }
  const at = a => co.reduce((v, [c, s], k) => v + c * Math.cos(k * a) + s * Math.sin(k * a), 0);
  let worst = 0;
  for (let i = 0; i < n; i++) worst = Math.max(worst, at(i * TAU / n) / raw[i]);
  const k = Math.min(1, margin / worst);
  return a => at(a) * k;
}

export const rOut = smoothRadius(OUTER, 12, 0.995);
export const rIn = smoothRadius(OPENING, 10, 1.0);
export const rPlaza = smoothRadius(PLAZA, 12, 0.995);

// Pitch (105 x 68 m) lies along the roof opening's long axis, 77.4 degrees from +x toward +z (measured from the OSM roof opening).
export const PITCH_AXIS = 77.4 * Math.PI / 180;
export const PITCH_CENTRE = [-0.5, -3.1];
export function pitchPoint(u, v) { // u along the long axis, v across (metres from the centre)
  const c = Math.cos(PITCH_AXIS), s = Math.sin(PITCH_AXIS);
  return [PITCH_CENTRE[0] + u * c - v * s, PITCH_CENTRE[1] + u * s + v * c];
}

// Cross-section of the skin: nearly upright flanks (the widest outline holds from the plinth to 34 m, as in the photographs)
// that roll over in a tight shoulder and a gently domed roof, [f, y] where f = 0 is the widest outline and f = 1 the roof opening (radii blend between
// rOut and rIn at the same angle). Height 50 m at the crown (Wikipedia / the club's facts page), 8.5 m at the plaza deck.
export const SKIN_KNOTS = [[0.14, 8.5], [0.05, 12.5], [0.0, 18], [0.0, 28], [0.0, 34], [0.035, 39.5], [0.1, 43.5], [0.2, 46.3], [0.38, 48.2], [0.58, 49.2], [0.78, 49.3], [0.9, 48.4], [1.0, 46.8]];
export const SKIN_TOP = 50;
export const LIP_DROP = 4.5; // inner lining under the roof opening

const catmull = (p0, p1, p2, p3, t) => p1.map((_, i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t * t + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t * t * t));

// Rows of the skin resampled by arc length, so every cushion row is the same height. Returns [{f, y}].
export function skinRows(rowM) {
  const dense = [], K = SKIN_KNOTS;
  for (let i = 0; i < K.length - 1; i++)
    for (let s = 0; s < 24; s++) dense.push(catmull(K[Math.max(0, i - 1)], K[i], K[i + 1], K[Math.min(K.length - 1, i + 2)], s / 24));
  dense.push(K[K.length - 1]);
  const cum = [0], hScale = 72; // f spans about 72 m of horizontal run on the long axis side
  for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot((dense[i][0] - dense[i - 1][0]) * hScale, dense[i][1] - dense[i - 1][1]));
  const total = cum[cum.length - 1], rows = Math.max(2, Math.round(total / rowM)), out = [];
  for (let r = 0; r <= rows; r++) {
    const target = total * r / rows;
    let i = 1; while (i < cum.length - 1 && cum[i] < target) i++;
    const t = (target - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
    out.push({ f: dense[i - 1][0] + (dense[i][0] - dense[i - 1][0]) * t, y: dense[i - 1][1] + (dense[i][1] - dense[i - 1][1]) * t });
  }
  return { rows: out, length: total };
}

// Horizontal radius of the skin at angle a for a profile row. The bottom row sits on the plaza-level building outline.
export function skinRadius(a, row, bottom) {
  if (bottom) return rPlaza(a);
  return rOut(a) - row.f * (rOut(a) - rIn(a));
}

// Column angles with equal arc length along the widest outline, so cushions are about the same width all the way round.
export function columnAngles(count) {
  const n = 2048, len = [0];
  let prev = [rOut(0), 0];
  for (let i = 1; i <= n; i++) {
    const a = i * TAU / n, p = [rOut(a) * Math.cos(a), rOut(a) * Math.sin(a)];
    len.push(len[i - 1] + Math.hypot(p[0] - prev[0], p[1] - prev[1])); prev = p;
  }
  const total = len[n], angles = [];
  let j = 0;
  for (let k = 0; k < count; k++) {
    const target = total * k / count;
    while (len[j + 1] < target) j++;
    angles.push(((j + (target - len[j]) / (len[j + 1] - len[j])) * TAU / n));
  }
  return { angles, perimeter: total };
}
