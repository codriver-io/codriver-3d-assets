import { FOOTPRINTS } from './footprint.js';
// OSM anchor at the west gable; orientation baked into the geometry.
export const SPEC = {
  id: 'arctic-cathedral', name: "Arctic Cathedral", kind: 'building',
  ready: true,
  origin: [18.9871, 69.6482], height: 35, padM: 56, frontageBearing: 324.5,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 6,
    refs: [[18.98716, 69.64817], [18.98751, 69.64801], [18.98782, 69.64784]] },
};
export const PALETTES = {
  light: { shell: '#e2e3df', edge: '#cfd2cf', seam: '#a9b2b3', glass: '#284454', frame: '#495a62', blue: '#1756a0', light: '#359dba', glow: '#d5ae48' },
  dark: { shell: '#a2b1bd', edge: '#8197a7', seam: '#5e7381', glass: '#668c9e', frame: '#556978', blue: '#234f86', light: '#59b7c9', glow: '#f4cd73' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '35 m west gable and eleven paired aluminium-clad slabs; mapped bay footprints and OSM height progression. Panel section, cladding joints, mullions and cross estimated. East glass is an original abstract colour pattern, not a reproduction of Victor Sparre’s artwork. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
