import { FOOTPRINTS } from './footprint.js';

// Westminster Abbey (Mission), British Columbia: the Benedictine abbey on the hill above Mission, with the
// Abbatial Church of Saint Joseph (1982, Asbjørn Gathe), the Pfitzer Memorial Bell Tower and the monastery wings.
// origin = area centroid of OSM way 90078404 (the church) in Mercator space. Height: tower apex 28 m + cross.
export const SPEC = {
  id: 'westminster-abbey-mission', name: "Westminster Abbey (Mission)", kind: 'building',
  ready: true,
  origin: [-122.27069, 49.153464],
  height: 31.2,
  padM: 120,
  frontageBearing: 0, // the church is a square plan with its walls on the compass axes (saw-tooth bays at ±45°)
  // A hilltop site: one rigid datum for church, tower, walkway and wings (median of the church outline's terrain).
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 8, refs: FOOTPRINTS[0] },
};
export const PALETTES = {
  light: { concrete: '#b9b5a9', trim: '#c6c2b6', wall: '#d0c9b8', roof: '#7c4a3d', glass: '#5d6a72', glow: '#3f4d55', recess: '#3d4142', brick: '#7a5446' },
  dark: { concrete: '#6d7074', trim: '#7a7d80', wall: '#7b7a75', roof: '#4f3129', glass: '#2c343c', glow: '#d9a95f', recess: '#2a2e30', brick: '#4a3329' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local foundation at y=0 for the whole abbey; the hill altitude is not baked in. A bounded median terrain pad is declared; integration is checked separately.',
  attribution: 'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright. One Commons photo (Joe Mabel, CC BY-SA 3.0) was used for comparison only and is not embedded.',
  note: 'Plan is the mapped OSM outline. Heights are estimates from the single reference photo and storey tags: church wall 15 m, tower apex 28 m (+3.2 m cross), wings 3 storeys to a 10.4 m eave with a low red hip. Lancet windows sit on one face of every saw-tooth bay; the entrance canopy on the north arm and the wing window rhythm are photo-based approximations. The mapped hexagonal chapel, garage and farm buildings are not drawn.',
};
