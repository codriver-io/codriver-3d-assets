// Suncor Energy Centre: site data in the model frame (+X east, +Z south, metres from SPEC.origin).
// The plans are the mapped OSM outlines (ways 505391964, 127741493, 127741496) converted with the same
// Mercator-with-stretch maths the layer uses, with sub-metre jogs merged. Nothing is rotated: the
// towers' diagonal faces are rotated 42 degrees from the street grid in the map, and the outlines
// already carry that.
//
// Both towers are the same idea: a grid-aligned rectangle with its north-east and south-west corners cut
// off by long diagonal faces, and 6 m stepped notches at the other two corners. Each is capped by one
// plane that falls toward the south (the dark "angled top" seen in the photographs).

// 53 levels (OSM) / 52 storeys (Wikipedia): a 9.6 m lobby and 52 office floors of 3.95 m, roof 215 m.
export const WEST = {
  id: 'west',
  poly: [
    [-40.47, -27.14], [-61.59, -28.19], [-61.59, -22.03], [-67.95, -21.99], [-68.96, -4.37], [-68.04, 0.27],
    [-40.32, 31.02], [-38.67, 32.86], [-18.31, 33.46], [-18.14, 27.15], [-11.64, 27.54], [-11.47, 21.99], [-10.74, 5.89],
  ],
  top: 215, lobby: 9.6, floors: 52,
};

// 33 levels (OSM) / 32 storeys (Wikipedia): a 7.55 m lobby and 31 office floors of 3.95 m, roof 130 m (OSM height tag).
export const EAST = {
  id: 'east',
  poly: [
    [29.91, 21.71], [49.35, 22.8], [49.46, 17.7], [56.23, 17.96], [56.76, -3.23], [55.56, -4.48],
    [32.91, -28.04], [32.02, -29.09], [12.17, -29.91], [11.97, -24.37], [5.09, -24.64], [4.68, -6.46],
  ],
  top: 130, lobby: 7.55, floors: 31,
};

export const FLOOR = 3.95;

// The roof plane: the high edge is the north-east one (the long diagonal face), the plane falls toward `bearing` at `slopeDeg`.
export const ROOF = { bearing: 228, slopeDeg: 22 };

// The low block between the towers (mapped as one way with a narrow wing to the south). The wing is split off
// at its mouth. Height is not mapped: three storeys on the east tower's first floor line is an estimate.
export const BLOCK = {
  poly: [
    [-40.49, -29.98], [5.13, -28.12], [5.09, -24.64], [4.68, -6.46], [29.91, 21.71], [21.72, 21.46], [14.95, 23.28],
    [-11.47, 21.99], [-10.74, 5.89], [-40.47, -27.14],
  ],
  top: 11.5, floors: 3,
};
export const WING = {
  poly: [
    [21.72, 21.46], [21.28, 31.37], [20.64, 47.47], [20.27, 50.91], [11.83, 50.69], [12.04, 44.61], [14.0, 44.77], [14.95, 23.28],
  ],
  top: 6.0,
};

// Roof plane through a plan: y(x, z) and its unit normal. The highest point of `poly` is exactly `top`.
export function roofPlane(poly, top, { bearing, slopeDeg } = ROOF) {
  const b = bearing * Math.PI / 180, g = [Math.sin(b), -Math.cos(b)], k = Math.tan(slopeDeg * Math.PI / 180);
  const gmin = Math.min(...poly.map(([x, z]) => x * g[0] + z * g[1]));
  const y = (x, z) => top - k * (x * g[0] + z * g[1] - gmin);
  const l = Math.hypot(g[0] * k, 1, g[1] * k);
  return { y, normal: [g[0] * k / l, 1 / l, g[1] * k / l], g, k };
}
