import { ORIGIN, BEARING, ABUTMENTS, padRing, geographic } from './pont-raymond-barre-parts.js';
// Alain Spielmann / Setec, completed 2013; T1 entered service 2014.
export const SPEC = {
  id: 'pont-raymond-barre', name: 'Pont Raymond-Barre', kind: 'bridge', ready: true,
  origin: ORIGIN, height: 25, padM: 170, frontageBearing: BEARING,
  terrainPad: { rings: ABUTMENTS.map(padRing), refs: ABUTMENTS.map(p=>geographic([p[0],p[2]])), datum: 'median', featherM: 4 },
};
export const PALETTES = {
  light: { arch:'#e9e9e4', deck:'#d9dcd7', track:'#858781', walk:'#91877a', railing:'#d5dbd7', hanger:'#939e9d', concrete:'#b6b6ac', seat:'#b9443b', lamp:'#e9e9db' },
  dark: { arch:'#a2afb7', deck:'#82919b', track:'#424c55', walk:'#5a6063', railing:'#a0b3bc', hanger:'#859ca8', concrete:'#697c87', seat:'#743e40', lamp:'#ffe6b1' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at support feet and mapped bank landings; main deck y=7.5 m is an illustrative flat-map clearance, not NGF or a DEM height. End ramps meet y=0.55 m. No latitude stretch baked in.',
  attribution: 'Original procedural geometry for Codriver. Geographic outline and T1 alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Twin outward-leaning steel arches over one 150 m main span (17.5 m crown rise, 10° lean), three structural spans about 72/150/38 m and bank platform extensions. Tram/pedestrian/cycle bridge; no road layer or HD road fitting. Arch section, hanger spacing and principal dimensions from AFGC 2014; supports/furniture and flat-map elevations simplified. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
