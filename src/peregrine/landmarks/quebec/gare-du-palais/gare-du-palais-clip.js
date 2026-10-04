// Convex clipping for the Gare du Palais roofs: a block is the intersection of half-spaces (its wall planes and the planes of its roof slopes, which are
// convex because the slopes flatten toward the top), so a wing roof can be cut by the taller roof it runs into and the cut is exact: the wing's gable ends
// at the wall or the valley it meets. Points are [x, y, z]; a half-space {n, d} holds the points with n . p <= d (n a unit vector).

/** The half-spaces of a block (see BLOCKS in gare-du-palais-build.js): four wall planes, every roof slope plane on all four sides, and the flat top. */
export function solidOf(b) {
  const { fr, u0, u1, v0, v1, pts, half } = b, U = fr.U, V = fr.V, hs = [];
  const add = (n, d) => { const l = Math.hypot(...n); hs.push({ n: n.map((c) => c / l), d: d / l }); };
  add([U[0], 0, U[1]], u1); add([-U[0], 0, -U[1]], -u0); add([V[0], 0, V[1]], v1); add([-V[0], 0, -V[1]], -v0);
  for (let i = 0; i < pts.length - 1; i++) {
    const [di, yi] = pts[i], [dj, yj] = pts[i + 1];
    if (dj - di < 1e-6) continue;
    const m = (yj - yi) / (dj - di); // rise per metre of inset
    add([m * U[0], 1, m * U[1]], yi + m * (u1 - di)); add([-m * U[0], 1, -m * U[1]], yi - m * (u0 + di));
    add([m * V[0], 1, m * V[1]], yi + m * (v1 - di)); add([-m * V[0], 1, -m * V[1]], yi - m * (v0 + di));
  }
  const [dt, yt] = pts[pts.length - 1];
  if (dt < half - 1e-6) add([0, 1, 0], yt);
  return hs;
}

const side = (h, p) => h.n[0] * p[0] + h.n[1] * p[1] + h.n[2] * p[2] - h.d;
const E = 1e-7;

function split(poly, h) {
  const dist = poly.map((p) => side(h, p));
  if (dist.every((d) => Math.abs(d) < E)) return [[], poly]; // lying in the plane: treated as inside
  const front = [], back = [];
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length, a = poly[i], c = poly[j], da = dist[i], dc = dist[j];
    if (da > E) front.push(a); else if (da < -E) back.push(a); else { front.push(a); back.push(a); }
    if ((da > E && dc < -E) || (da < -E && dc > E)) {
      const t = da / (da - dc), p = [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t];
      front.push(p); back.push(p);
    }
  }
  return [front, back];
}

/** The convex pieces of a convex polygon that lie outside the solid `hs` (the part inside is dropped). */
export function outsidePieces(poly, hs) {
  const out = [];
  let rest = poly;
  for (const h of hs) {
    const [front, back] = split(rest, h);
    if (front.length >= 3) out.push(front);
    rest = back;
    if (rest.length < 3) break;
  }
  return out;
}

/** The pieces of a convex polygon left after cutting away every solid in turn. */
export function clipPolygon(poly, solids) {
  let pieces = [poly];
  for (const hs of solids) pieces = pieces.flatMap((q) => outsidePieces(q, hs));
  return pieces;
}

/** The parts of the segment a-b that lie outside a solid. */
function segmentOutside(a, b, hs) {
  let t0 = 0, t1 = 1;
  for (const h of hs) {
    const da = side(h, a), db = side(h, b);
    if (da > 0 && db > 0) return [[a, b]]; // wholly outside this plane, so outside the solid
    if (da <= 0 && db <= 0) continue;
    const t = da / (da - db);
    if (da > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
  }
  if (t0 >= t1) return [[a, b]];
  const at = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], out = [];
  if (t0 > 1e-6) out.push([a, at(t0)]);
  if (t1 < 1 - 1e-6) out.push([at(t1), b]);
  return out;
}

/** The parts of a segment left after cutting away every solid in turn. */
export function clipSegment(a, b, solids) {
  let segs = [[a, b]];
  for (const hs of solids) segs = segs.flatMap(([p, q]) => segmentOutside(p, q, hs));
  return segs;
}
