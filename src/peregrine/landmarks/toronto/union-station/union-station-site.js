import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC } from './config.js';

// The facade frame. u runs along Front Street (bearing AXIS_DEG, east-north-east),
// v runs away from the street (south-south-east), y is up: a right-handed frame with
// the same handedness as the exported east / up / south, rotated by ROTATION about y.
// The model is authored in this frame with the headhouse's plan aligned to the axes,
// and rotated once at the end (see geometry.js). u = 0 is the middle of the 228 m
// headhouse (west pavilion end to east pavilion end), v = 0 is 8 m behind the
// pavilion fronts (roughly the middle of the headhouse's depth).
export const AXIS_DEG = SPEC.axisBearing;
const beta = (AXIS_DEG * Math.PI) / 180;
export const ROTATION = Math.PI / 2 - beta; // rotateY(ROTATION): (u, v) -> (east, south)
const sB = Math.sin(beta), cB = Math.cos(beta);

const stretch = mercStretch(SPEC.origin[1]);
const ox = lngToMercX(SPEC.origin[0]), oy = latToMercY(SPEC.origin[1]);

/** [lng, lat] -> [u, v] in the facade frame, metres (the same conversion the layer uses). */
export function toFacade(lng, lat) {
  const east = (lngToMercX(lng) - ox) / stretch, north = (latToMercY(lat) - oy) / stretch;
  return [east * sB + north * cB, east * cB - north * sB];
}
/** [u, v] -> [x east, z south] in the exported model frame. */
export const toWorld = (u, v) => [u * sB + v * cB, -u * cB + v * sB];

// ---- measured layout, facade frame, metres --------------------------------------------
// Every number below is read off the OpenStreetMap building:part geometry of way 14744491's
// parts (retrieved 2026-09-29) unless marked (est.). See docs/3d-toronto-union-station.md.
export const H = {
  col: 12.0,      // column height, OSM height=12 on each column part (Wikipedia: 40 ft)
  wing: 17.0,     // wall top of wings and pavilions (OSM min_height 17 on the attic parts)
  pavilion: 19.5, // pavilion attic top (OSM height 19.5)
  main: 19.0,     // central body / entablature top (OSM height 19)
  hall: 26.5,     // Great Hall clerestory wall top (OSM height 26.5)
  ridge: 32.5,    // Great Hall hipped copper roof top (OSM height 32.5, roof:height 6)
  court: 5.0,     // roof over the wings' light courts (OSM height 5)
  shed: 6.5,      // shed roofs (est.: OSM only says building:levels 1)
  strip: 5.5,     // the low range between headhouse and shed (est.)
};
export const V = {
  moat: -30.4,     // outer face of the moat parapet
  pavilion: -20.0, // pavilion front wall
  wing: -18.3,     // wing front wall (moat side)
  entab: -20.3,    // colonnade entablature front
  porch: -22.7,    // porch entablature step-out front
  loggia: -14.9,   // Great Hall front wall behind the loggia
  rear: 20.9,      // rear wall of the headhouse
};
export const U = {
  west: -114.2, pavW: -100.3, mainW: -38.5, mainE: 42.1, pavE: 99.2, east: 114.2,
  loggiaW: -36.9, loggiaE: 40.5,
};

// The 24 mapped column shafts (OSM building:part=column) as [u, v, radius mapped].
export const COLUMNS = [
  // west porch: four in front, two behind the inner pair
  [-36.86, -21.71], [-33.22, -21.71], [-27.88, -21.69], [-24.11, -21.68], [-33.27, -19.40], [-27.93, -19.38],
  // recessed central row of ten
  [-17.98, -19.42], [-13.67, -19.43], [-9.19, -19.44], [-4.74, -19.37], [-0.34, -19.40],
  [4.13, -19.42], [8.44, -19.43], [12.92, -19.44], [17.37, -19.37], [21.77, -19.40],
  // east porch
  [27.94, -21.66], [30.66, -21.68], [36.09, -21.64], [39.60, -21.66], [30.69, -19.44], [36.21, -19.49],
];
// The two larger columns where each porch meets the central row (OSM radius 1.1 m).
export const JUNCTION_COLUMNS = [[-23.29, -19.79], [27.11, -19.70]];
// Centres of the two great arched entrances (west, east), behind the porches.
export const ARCH_U = [-30.5, 34.3];

// Plan polygons behind the headhouse ([u, v], facade frame), read from the OSM building:part roofs
// 1550729284 (west shed), 1550729285 (east shed) and the outline 14744491 (the low range between).
export const SHED_W = [[-175.0, 33.2], [-36.9, 32.9], [-36.9, 124.4], [-174.4, 124.7]];
export const SHED_E = [[36.1, 124.3], [67.6, 124.2], [67.6, 111.0], [180.3, 110.6], [180.4, 45.1], [172.0, 45.0],
  [172.0, 44.5], [164.4, 44.5], [164.5, 34.3], [164.5, 32.9], [113.4, 34.3], [41.2, 33.1], [36.1, 33.0]];
export const STRIP = [[-175.2, 17.2], [-149.3, 16.9], [-149.1, 21.0], [-114.3, 20.9], [113.8, 20.9], [113.4, 34.3],
  [41.2, 33.1], [36.1, 33.0], [-36.9, 32.9], [-175.0, 33.2]];
export const ATRIUM = { u0: -36.9, u1: 36.1, v0: 33.0, v1: 132.4 };
