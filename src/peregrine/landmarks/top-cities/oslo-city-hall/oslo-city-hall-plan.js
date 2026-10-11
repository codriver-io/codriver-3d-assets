// Oslo City Hall (Rådhuset), 1950, Arneberg & Poulsson.
// Metres in the mapped frame: +u runs along the harbour facade toward the east
// tower (bearing 114.91°), +v runs toward Fridtjof Nansens plass (bearing 24.91°).
// Geometry is authored with X = u and Z = -v, then rotated onto east/up/south.
// Plan rectangles are the mercator projection of the OSM parts (see footprint.js).

export const BEARING_V = 24.91;
export const PHI = -BEARING_V * Math.PI / 180;

const cos = Math.cos(PHI), sin = Math.sin(PHI);

// Authoring (u, y, v) -> model metres (+x east, +y up, +z south).
export function world(u, y, v) {
  const za = -v;
  return [u * cos + za * sin, y, -u * sin + za * cos];
}

// Wing: OSM way 621514223, height 27 m. The harbour photo is a flat roof behind a
// brick parapet, so the parapet is the mapped 27 m and the roof sits below it.
export const WING = { u0: -38.6, u1: 22.0, v0: -9.7, v1: 40.35, wall: 27, roof: 25.05 };
// Towers: east 66 m, west 63 m (Oslo Byleksikon). Plans are ways 292242403 / 292242405.
export const EAST = { u0: 7.4, u1: 23.2, v0: 40.2, v1: 72.4, h: 66 };
export const WEST = { u0: -39.8, u1: -23.9, v0: 40.2, v1: 72.5, h: 63 };
// Courtyard link between the towers, ten approximate OSM storeys.
export const MID = { u0: -24.05, u1: 7.55, v0: 40.05, v1: 52.1, h: 32.6 };

export const EAST_U = (EAST.u0 + EAST.u1) / 2;
export const WEST_U = (WEST.u0 + WEST.u1) / 2;
export const MID_U = -8.25;

// South face of the east tower. Face diameter 8.6 m (Oslo Byleksikon).
export const CLOCK = { u: EAST_U, v: EAST.v0, y: 50, r: 4.3 };
// Astronomical clock, 5 m, on the middle facade facing the city.
export const ASTRO = { u: MID_U, v: MID.v1, y: 22.6, r: 2.5 };
