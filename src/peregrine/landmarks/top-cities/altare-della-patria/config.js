import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'altare-della-patria', name: 'Altare della Patria', kind: 'building',
  ready: true, origin: [12.4831, 41.8947], height: 81, padM: 140,
  frontageBearing: 343, rotationDeg: 17,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 10 },
};
export const PALETTES = {
  light: { stone: '#ece9df', trim: '#faf5e8', relief: '#d6cdb9', bronze: '#3d5c50', recess: '#6b6355', gold: '#a99660', glow: '#e4d4b0' },
  dark: { stone: '#818b92', trim: '#abb5ba', relief: '#70797e', bronze: '#2d4842', recess: '#323d44', gold: '#817553', glow: '#ffcb80' },
};
export const MANIFEST = {
  elevationDatum: 'Local Piazza Venezia entrance grade y=0; rigid marble terraces rise internally. No absolute altitude or DEM baked into geometry.',
  attribution: 'Original procedural mesh, Codriver 2026. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sacconi Vittoriano, completed 1935. Published 81 m including quadrigas; VIVE main colonnade 70 m, sixteen 15 m columns. Mapped outer rings of relations 1849830/1849831 and mapped column rhythm. Photo-estimated common portico/propylaea floor 42 m and central cornice 65 m; terrace and propylaea heights are estimated. Estimated sculptural anatomy, ornament, rear museum elevations and minor openings. Botticino marble and patinated bronze; texture-free.',
};
