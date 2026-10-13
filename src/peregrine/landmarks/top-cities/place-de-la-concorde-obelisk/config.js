import { FOOTPRINTS, TERRAIN_RINGS } from './footprint.js';
// Mapped anchor: centroid of OSM way 72937686; rotation baked from its corners.
export const SPEC = {
  id: 'place-de-la-concorde-obelisk', name: 'Place de la Concorde obelisk & fountains', kind: 'building',
  ready: true, origin: [2.3211306, 48.8654765], height: 33.37, padM: 8,
  frontageBearing: 26, pedestalM: 10.37, stoneM: 23, pyramidionM: 2.8,
  terrainPad: { rings: TERRAIN_RINGS, refs: FOOTPRINTS[0].slice(0, -1), datum: 'median', featherM: 2 },
};
export const PALETTES = {
  light: { stone: '#b4ab97', granite: '#b4a28e', engraving: '#766955', bronze: '#555c49', patina: '#34594b', gold: '#b59746', water: '#647d72' },
  dark: { stone: '#817b6f', granite: '#b5a487', engraving: '#5c5344', bronze: '#333b32', patina: '#284237', gold: '#aa924d', water: '#384b47' },
};
export const MANIFEST = {
 elevationDatum: 'Local plaza grade y=0; rigid separate monument/fountain foundations. Fountain and rostral foundation skirts extend to y=-1.5 m. No terrain or absolute altitude baked in.',
 attribution: 'Original procedural geometry; mapped outlines © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
 note: 'Paris Luxor obelisk, modern gilded pyramidion, two Hittorff fountains. Stone height 23 m and ensemble 33.37 m sourced; fountain plans mapped. Bowl profiles, statues, rostral details and abstract incised hieroglyph rhythm estimated. Seven bounded median-datum terrain pads cover the obelisk, both basin rings and four column groups with 2 m outer feathers. Roads and the roundabout are omitted. Full 3D world pad fix awaits lead recapture and terrain-lattice verification.',
};
