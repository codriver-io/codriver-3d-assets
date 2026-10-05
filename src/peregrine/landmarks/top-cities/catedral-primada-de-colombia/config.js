import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'catedral-primada-de-colombia', name: 'Catedral Primada de Colombia', kind: 'building', ready: true,
  origin: [-74.07524, 4.59796], height: 52, padM: 80, frontageBearing: 302,
  rotationDeg: 32, nearM: 600,
  terrainPad: { rings: FOOTPRINTS, refs: FOOTPRINTS[0], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { stone: '#c5a975', trim: '#d7c291', recess: '#292b28', roof: '#925d48', metal: '#666355', wood: '#554134', rubble: '#ad8566', plaster: '#c7bca1' },
  dark: { stone: '#80705a', trim: '#9a896a', recess: '#222829', roof: '#53463f', metal: '#454b4b', wood: '#37322c', rubble: '#69594d', plaster: '#767368' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid building on local flat grade y=0; no absolute altitude or terrain deformation.',
  attribution: 'Original procedural mesh by Codriver. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '52 m tower height from published description; doorway dimensions 7.2×3.6 m and 5.6×2.8 m. Partial cathedral envelope derived from OSM way 24251969; adjoining Cabildo/Sagrario and rear house remain provider-owned. Roof, dome, tower stages and ornament are photo-based estimates. Rotation baked once at 32 degrees. Terrain median pad is proposed; integration not tested.',
};
