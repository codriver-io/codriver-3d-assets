import { FOOTPRINTS } from './footprint.js';

// Georgia Aquarium: TVS's 2005 ship-and-wave composition, current mapped envelope.
export const SPEC = {
  id: 'georgia-aquarium', name: 'Georgia Aquarium', kind: 'building', ready: true,
  origin: [-84.39472, 33.76278], height: 37, padM: 120, frontageBearing: 135,
  terrainPad: { rings: FOOTPRINTS, refs: [[-84.39472,33.76278],[-84.3953,33.76345],[-84.39445,33.7638]], datum: 'median', featherM: 12 },
};
export const PALETTES = {
  light: { silver: '#aab6be', blue: '#344d68', roof: '#c4ced4', glass: '#416777', frame: '#778b95', glow: '#a9bfc7', sign: '#bb5147' },
  dark: { silver: '#566a7d', blue: '#203249', roof: '#455765', glass: '#294953', frame: '#3a4d59', glow: '#a5c7cc', sign: '#eeb078' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; real metres east/up/south. No terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'TVS 2005 ship-and-wave design, silver/platinum/blue metal documented by ALUCOBOND. OSM envelope includes later halls. Heights (37 m mast, 31 m bow, 15–24 m halls), curvatures and subdivision are photo estimates. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
