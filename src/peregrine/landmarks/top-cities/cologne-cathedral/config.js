import { FOOTPRINTS } from './footprint.js';
// Cologne Cathedral: completed Gothic exterior, without temporary scaffolding.
export const SPEC = {
  id: 'cologne-cathedral', name: 'Cologne Cathedral', kind: 'building',
  ready: true,
  origin: [6.95833, 50.94139], // geographic anchor in the choir; dossier frame
  height: 157.22, padM: 100, frontageBearing: 268.430,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 12,
    refs: [[6.95712,50.941315],[6.95822,50.940968],[6.9590,50.94132]] },
};
export const PALETTES = {
  light: { stone: '#746e61', roof: '#85888b', glass: '#303b40', recess: '#222420' },
  dark: { stone: '#48453e', roof: '#3b4148', glass: '#253139', recess: '#171a19' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is cathedral pavement grade. Rigid metre-scale foundation; no absolute altitude or terrain is baked into the mesh.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Official tower tips: south 157.22 m, north 157.18 m; crossing 109.12 m. Mapped plan, orientation and owned parts from OSM. Spire tracery, sculpture, buttress profiles and chapel details are architectural approximations. No temporary scaffolds or photographic textures. Rotation is baked once. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
