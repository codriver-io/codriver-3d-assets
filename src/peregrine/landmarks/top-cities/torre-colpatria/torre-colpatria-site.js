// The helipad north edge joins two OSM control points:
// [-74.0703625,4.6110675] -> [-74.0701716,4.6111057].
// u is ENE, v is SSE; rotation is exported, never applied again by the host.
export const ANGLE = -0.19812096179032823;
export const site = (u, y, v) => [
  u * Math.cos(ANGLE) - v * Math.sin(ANGLE), y,
  u * Math.sin(ANGLE) + v * Math.cos(ANGLE),
];
export const unsite = (x, z) => [x * Math.cos(ANGLE) + z * Math.sin(ANGLE),
  -x * Math.sin(ANGLE) + z * Math.cos(ANGLE)];
// Symmetric regularisation of the mapped mirror core (±0.3 m).
// Clipped corners are real flat faces, not square pockets.
export const OUTLINE = [[-12.1, -14.4], [11.9, -14.4], [15.4, -11.8],
  [15.4, 11.8], [11.9, 14.4], [-12.1, 14.4], [-15.4, 11.8], [-15.4, -11.8]];
export const FACES = OUTLINE.map((p, i) => {
  const q = OUTLINE[(i + 1) % OUTLINE.length], dx = q[0] - p[0], dz = q[1] - p[1];
  const len = Math.hypot(dx, dz), r = [dx / len, dz / len];
  return { c: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2],
    r, n: [r[1], -r[0]], len, bays: len > 10 ? 13 : 2 };
});
