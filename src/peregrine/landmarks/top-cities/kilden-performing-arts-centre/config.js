import { ORIGIN, FACADE_BEARING, ROOF } from './kilden-performing-arts-centre-plan.js';

// Kilden Performing Arts Centre, Odderøya, Kristiansand. ALA Architects with
// SMS Arkitekter, opened 6 January 2012. Harbour front faces the quay.
export const SPEC = {
  id: 'kilden-performing-arts-centre',
  name: 'Kilden Performing Arts Centre',
  kind: 'building',
  ready: true,
  origin: ORIGIN,
  height: ROOF,
  padM: 68,
  frontageBearing: FACADE_BEARING,
};
export const PALETTES = {
  light: {
    metal: '#1b1e22',
    seam: '#3d4450',
    oak: '#d4893c',
    oakLine: '#a85c28',
    frame: '#14181c',
    glow: '#6e92a4',
  },
  dark: {
    metal: '#101214',
    seam: '#2c333c',
    oak: '#e2a15a',
    oakLine: '#c47c3e',
    frame: '#0c1014',
    glow: '#f0c48a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local quay grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '22 m roof is the published cantilever line. The lip stays near half to three-quarters of that height; lobe positions, the 26 m glass setback and oak thickness are photographic estimates. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
