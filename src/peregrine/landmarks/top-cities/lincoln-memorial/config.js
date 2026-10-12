import { FOOTPRINTS } from './footprint.js';
// NPS dimensions, OSM placement; y=0 at the foot of the terrace retaining walls.
export const SPEC = {
  id: 'lincoln-memorial', name: 'Lincoln Memorial', kind: 'building', ready: true,
  origin: [-77.0501717, 38.8892721], height: 30.1752, padM: 54,
  frontageBearing: 90.034371312, rotation: -0.034371312 * Math.PI / 180,
  colonnadeWidth: 57.404, colonnadeDepth: 36.1188,
  columnHeight: 13.4112, columnDiameter: 2.2606, platformY: 6.739,
  terrainPad: { rings: FOOTPRINTS, refs: [[-77.05045, 38.88961], [-77.05045, 38.88894], [-77.04980, 38.889277]], datum: 'median', featherM: 7 },
};
export const PALETTES = {
  light: { interior: '#242522', stone: '#dddcd3', trim: '#e9e7db', granite: '#aaa394', turf: '#637b50', roof: '#626f70', bronze: '#786e54', glow: '#e8e3d3' },
  dark: { interior: '#2e3335', stone: '#858e95', trim: '#aaa99e', granite: '#5c646d', turf: '#303e37', roof: '#394954', bronze: '#625c52', glow: '#f3e6c3' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 is grade at the foot of the terrace retaining walls; reusable rigid geometry, no DEM or absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'NPS dimensions for height, colonnade, columns and statue. Estimated vertical tier split, chamber wall details, reliefs and roof framing; inscriptions omitted. Rotation baked once from OSM. Daytime visual integration is recorded separately in the landmark documentation.',
};
