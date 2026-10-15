// Layout of the Fondation Louis Vuitton model: the white "iceberg" blocks, the twelve glass sails
// and the struts that tie them together. Pure data and pure maths, shared by geometry.js and the
// test so both read the same terminal points. Metres, +x east, +y up, +z south.
// Original layout, estimated from attributed reference photographs; the mapped OSM outline is the
// only fixed constraint.

export const PLINTH_H = 2.2; // white fibre-concrete terrace the icebergs stand on

// Iceberg blocks: convex plan polygons [x, z] with a planar, sloping top
// y(x, z) = top + gx * (x - cx) + gz * (z - cz) around the polygon centre.
export const BLOCKS = [
  { id: 'centre', poly: [[-27, -14], [8, -17], [15, 13], [-24, 14]], top: 21, gx: 0.28, gz: -0.12 },
  { id: 'tower', poly: [[-13, -9], [7, -11], [9, 5], [-11, 6]], top: 31, gx: 0.2, gz: 0.1 },
  { id: 'east', poly: [[12, -13], [45, -13], [47, 5], [14, 9]], top: 14.5, gx: 0.14, gz: 0.1 },
  { id: 'west', poly: [[-53, -9], [-29, -13], [-25, 9], [-50, 5]], top: 12, gx: -0.16, gz: 0.1 },
  { id: 'south-a', poly: [[-18, 15], [-5, 17.5], [-9, 24], [-14, 24]], top: 9, gx: 0, gz: -0.3 },
  { id: 'south-b', poly: [[15, 20], [28, 22], [26, 25], [19, 25]], top: 10, gx: 0.2, gz: -0.3 },
];

export const centroid = (poly) => [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length];
export function blockTopY(block, x, z) {
  const [cx, cz] = centroid(block.poly);
  return block.top + block.gx * (x - cx) + block.gz * (z - cz);
}

// Glass sails. Each sail is a curved quadrilateral shell: four corners (bottom-left, bottom-right,
// top-right, top-left), straight top and bottom edges, a dome `bulge` (sagitta, m) pushed toward its
// outer side and a `bow` that curves the two side edges outward. Authored either from `corners` or
// from a base point on the terrace: `at` [x, z], `face` (deg, 0 = faces south/+z, 90 = east), base
// width `bw`, top width `tw`, height `h`, `lean` (how far the top sits back toward the building)
// and `skew` (top slid along the width).
const DEG = Math.PI / 180;
function corners({ at, y0 = 0.5, face, bw, tw, h, lean, skew = 0, tilt = 0 }) {
  const f = [Math.sin(face * DEG), Math.cos(face * DEG)], r = [Math.cos(face * DEG), -Math.sin(face * DEG)];
  const top = [at[0] - f[0] * lean + r[0] * skew, at[1] - f[1] * lean + r[1] * skew];
  return [
    [at[0] - (r[0] * bw) / 2, y0, at[1] - (r[1] * bw) / 2], [at[0] + (r[0] * bw) / 2, y0, at[1] + (r[1] * bw) / 2],
    [top[0] + (r[0] * tw) / 2, y0 + h - tilt / 2, top[1] + (r[1] * tw) / 2], [top[0] - (r[0] * tw) / 2, y0 + h + tilt / 2, top[1] - (r[1] * tw) / 2],
  ];
}
const sail = (id, spec, bulge, bow, extra = {}) => ({ id, corners: corners(spec), bulge: bulge * 1.6, bow: bow * 1.4, out: [Math.sin(spec.face * DEG), 0.25, Math.cos(spec.face * DEG)], ...extra });
// Broad, overlapping shells: neighbours share ~20 % of their width so the icebergs read as wrapped, not
// ringed by loose strips; the two southern sails and the north-west one are the big visible bellies.
export const SAILS = [
  sail('s1', { at: [-48, 14], face: -48, bw: 44, tw: 24, h: 29, lean: 6, skew: -3, tilt: 6 }, 5.5, 0.8),
  sail('s2', { at: [-59, -12], face: -96, bw: 38, tw: 20, h: 17, lean: -2, skew: 2, tilt: -4 }, 4.6, 0.8),
  sail('s3', { at: [-34, -29], face: 202, bw: 46, tw: 24, h: 34, lean: 4, skew: 3, tilt: 8 }, 5.6, 0.8),
  sail('s4', { at: [-14, 28], face: -10, bw: 46, tw: 26, h: 28, lean: 7, skew: 2, tilt: -6 }, 6, 1),
  sail('s5', { at: [25, 27], face: 22, bw: 40, tw: 22, h: 22, lean: 4, skew: -2, tilt: 5 }, 5.2, 0.8),
  sail('s8', { at: [47, 18], face: 58, bw: 38, tw: 20, h: 19, lean: -1, skew: 2, tilt: -5 }, 4.8, 0.8),
  sail('s9', { at: [58, -4], face: 98, bw: 36, tw: 18, h: 25, lean: 4, skew: -2, tilt: 4 }, 4.4, 0.8),
  sail('s10', { at: [44, -22], face: 136, bw: 42, tw: 20, h: 33, lean: 10, skew: 3, tilt: 7 }, 5, 0.8),
  sail('s11', { at: [18, -30], face: 172, bw: 38, tw: 20, h: 21, lean: 3, skew: -2, tilt: -5 }, 4.6, 0.8),
  sail('s12', { at: [-8, -31], face: 190, bw: 34, tw: 17, h: 30, lean: -2, skew: 1, tilt: 6 }, 4.2, 0.8),
  sail('silver', { at: [-28, 2], y0: 18, face: -60, bw: 26, tw: 10, h: 24, lean: 4, skew: -2, tilt: 4 }, 3.5, 0.8, { mat: 'metal' }),
  // the great roof: a steep, pointed sail of exposed timber and glass; its high prow is the 46 m top of the building
  { id: 'roof', corners: [[-18, 27, 13], [22, 30, 14], [26, 45, 0], [11, 44, -2]], bulge: 5.5, bow: 3, out: [0.15, 0.6, 0.8], mat: 'glass', timber: true },
];

const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const norm = (p) => { const l = Math.hypot(...p) || 1; return [p[0] / l, p[1] / l, p[2] / l]; };

// Mean normal of the corner quad, on the convex side.
export function sailFrame(sail) {
  const [p0, p1, p2, p3] = sail.corners;
  const across = [p1[0] + p2[0] - p0[0] - p3[0], p1[1] + p2[1] - p0[1] - p3[1], p1[2] + p2[2] - p0[2] - p3[2]];
  const along = [p3[0] + p2[0] - p0[0] - p1[0], p3[1] + p2[1] - p0[1] - p1[1], p3[2] + p2[2] - p0[2] - p1[2]];
  let n = norm(cross(across, along));
  if (dot(n, sail.out) < 0) n = [-n[0], -n[1], -n[2]];
  return { n, across: norm(across), along: norm(along) };
}

// Point on the shell: s in [-1, 1] across (left to right), t in [0, 1] from the bottom edge to the top edge.
export function sailPoint(sail, s, t, f = sailFrame(sail)) {
  const [p0, p1, p2, p3] = sail.corners, u = (s + 1) / 2;
  const sin = Math.sin(Math.PI * t);
  const out = sail.bulge * (1 - s * s) * Math.pow(sin, 0.8) + sail.bow * Math.pow(Math.abs(s), 2) * sin;
  return [0, 1, 2].map((i) => {
    const bottom = p0[i] + (p1[i] - p0[i]) * u, top = p3[i] + (p2[i] - p3[i]) * u;
    return bottom + (top - bottom) * t + f.n[i] * out;
  });
}

// Struts: one steel member under each sail, from a point on the shell down to the nearest iceberg top.
// Distance from (x, z) to the polygon's edges, negative outside (convex polygons).
function insetDistance(poly, x, z) {
  let min = Infinity, inside = true;
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length], dx = q[0] - p[0], dz = q[1] - p[1], len = Math.hypot(dx, dz);
    const side = (dx * (z - p[1]) - dz * (x - p[0])) / len; // signed distance to the edge line
    min = Math.min(min, Math.abs(side));
    if (side < 0) inside = false; // polygons here wind so that the inside is on the left (checked below)
  });
  return { inside, min };
}

export function struts() {
  const out = [];
  for (const sail of SAILS) {
    const f = sailFrame(sail);
    for (const s of [-0.35, 0.35]) {
      let pick = null;
      for (const t of [0.7, 0.55, 0.4]) {
        const top = sailPoint(sail, s, t, f);
        for (const block of BLOCKS) {
          const [cx, cz] = centroid(block.poly);
          // a point well inside the convex block, on its top plane, below the sail point
          const d = Math.hypot(cx - top[0], cz - top[2]);
          let bx = cx, bz = cz;
          for (const k of [0.2, 0.1, 0.05]) {
            const x = cx + (top[0] - cx) * k, z = cz + (top[2] - cz) * k, g = insetDistance(block.poly, x, z);
            if ((g.inside || insetDistance(block.poly.slice().reverse(), x, z).inside) && g.min > 0.8) { bx = x; bz = z; break; }
          }
          const y = blockTopY(block, bx, bz);
          if (d < 36 && top[1] - y >= 3 && (!pick || d < pick.d)) pick = { sail: sail.id, block: block.id, d, top, foot: [bx, y, bz] };
        }
        if (pick) break;
      }
      if (pick) { delete pick.d; out.push(pick); }
    }
  }
  return out;
}
