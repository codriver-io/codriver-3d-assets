import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'westminster-abbey', name: "Westminster Abbey", kind: 'building',
  ready: true,
  origin: [-0.1275, 51.49944], // approximate; the builder sets it from the mapped footprint/alignment
  height: 69, // m to the highest point, approximate
  padM: 65,
  frontageBearing: 264.774,
  terrainPad: { rings: FOOTPRINTS, refs: [[-0.12848,51.49948],[-0.12732,51.49971],[-0.12630,51.49936]], datum: 'median', featherM: 12 },
};
export const PALETTES = {
  light: { stone: '#c7c2b3', roof: '#8d9393', glass: '#3d484b', recess: '#55544e', clock: '#292b2b' },
  dark: { stone: '#707b85', roof: '#434e58', glass: '#27363f', recess: '#37414a', clock: '#26323d' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Hawksmoor west towers 69 m (OSM, rounded published 225 ft 4 in); church plan mapped from OSM, details estimated from attributed exterior photographs. Temporary works and new Sacristy excluded. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
