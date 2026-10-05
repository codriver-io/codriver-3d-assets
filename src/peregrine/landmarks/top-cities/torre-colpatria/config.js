import { FOOTPRINTS } from './footprint.js';

// Present pale concrete tube and programmable LED facade, not pre-2012 lighting.
// Published: 196 m total, 50 storeys, Obregón Valenzuela, opened August 1979.
export const SPEC = {
  id: 'torre-colpatria', name: 'Torre Colpatria', kind: 'building', ready: true,
  origin: [-74.0702479896, 4.6109939751], // centroid of OSM mirror core 1175248695
  height: 196, padM: 25, frontageBearing: 78.6485,
  terrainPad: {
    rings: [FOOTPRINTS[0]], datum: 'median', featherM: 4,
    refs: [[-74.0703976, 4.6110795], [-74.0701695, 4.6111485],
      [-74.0700837, 4.6109156], [-74.0703328, 4.6108399]],
  },
};
// LED colours map to neutral window hardware in daylight. The flag is one
// representative static scene, not a live animation of the real programmable facade.
export const PALETTES = {
  light: { concrete: '#dad5c6', glass: '#343b3b', spandrel: '#696b63',
    metal: '#949a94', roof: '#636b66', light: '#3a4141', lamp: '#3a4141',
    sign: '#3a4141', glow: '#555e59' },
  dark: { concrete: '#59636a', glass: '#182b36', spandrel: '#33434c',
    metal: '#738491', roof: '#384851', light: '#ffd036', lamp: '#397bff',
    sign: '#ff4252', glow: '#efdcaa' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local flat-map grade y=0; no altitude or terrain baked into GLBs. Bounded median terrain pad; live terrain placement not tested.',
  attribution: 'Original procedural geometry. Mapped footprints © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '196 m / 50 storeys sourced; 31 x 29 m chamfered plan and helipad mapped. Fin relief, floor pitch, roof supports, entrance and static Colombian-flag LED scene estimated from photographs. Adjoining low-rise block remains provider geometry; rotation baked once.',
};
