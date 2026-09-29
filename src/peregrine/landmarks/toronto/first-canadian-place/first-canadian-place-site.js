// Site frame for First Canadian Place, fitted to the mapped OSM outline (way 27767627).
// Authoring axes: u runs along King Street (ENE), v toward the lake (SSE). The mapped edges
// snap to u/v lines to within 2 cm at an angle of -15.9 degrees, i.e. the street grid.
// site() rotates (u, y, v) into the exported frame (+X east, +Y up, +Z south), exactly as
// place-ville-marie's pvmSite does; the origin is the centre of the mapped 57.65 x 55.04 m plan.
export const SITE = {
  angle: -0.2775,        // u axis, radians from +X (east) toward +Z (south): -15.9 degrees
  hu: 28.825, hv: 27.52, // half extents of the mapped plan along u (57.65 m) and v (55.04 m)
  notchU: 4.8, notchV: 5.0, // each corner is a square pocket cut out of the plan (mapped 4.2-5.2 x 3.7-5.7 m)
};

const c = Math.cos(SITE.angle), s = Math.sin(SITE.angle);
export const site = (u, y, v) => [u * c - v * s, y, u * s + v * c];
export const unsite = (x, z) => [x * c + z * s, -x * s + z * c];

export const TOWER = {
  // Sourced: 292 m roof (OSM height), 298.1 m architectural height, 355 m tip (CTBUH), 72 storeys.
  // Estimated: everything below (storey pitch follows from 66 window rows between lobby and crown).
  roof: 292, top: 298.1, tip: 355,
  base: 12.5, crown: 10.5, floors: 66, windowH: 1.55, bay: 1.52, recess: 0.3,
  // Mapped building:part way 289330446, 29.9 x 22.2 m, centred 1.0 m west of the tower centre.
  penthouse: { u: -1.0, v: 0.1, w: 29.9, d: 22.2 },
  // Two comparable masts about 16 m apart (Commons 'View from CN Tower 2023g'): a slim lattice mast to the 355 m tip and a
  // lattice mast carrying a white FM antenna tube to 349 m.
  mastA: { u: -2, v: -7, top: 355 }, mastB: { u: 9.3, v: 4.3, top: 349 },
  farStandoff: 1.0, // far LOD: how far the window glass sits behind the spandrel quads (z-precision at distance)
  logo: { textH: 5, depth: 0.35, gap: 1.6, roundel: 7, inset: 2.2 },
};
