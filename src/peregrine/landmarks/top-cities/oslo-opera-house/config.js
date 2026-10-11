// Oslo Opera House (Operahuset), Kirsten Flagstads plass 1, Bjørvika.
// Snøhetta, opened 12 April 2008. Plan from OSM; exterior fly-tower height is the tagged 35 m.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'oslo-opera-house', name: 'Oslo Opera House', kind: 'building', ready: true,
  origin: [10.7526853526, 59.9074989430], // area centroid of way 810259696
  height: 35, padM: 142, frontageBearing: 206,
  // The pad disc reaches the fjord. Median of on-building samples so a water DEM cannot sink the house.
  terrainPad: {
    rings: [FOOTPRINTS[0], FOOTPRINTS[10], FOOTPRINTS[12]],
    datum: 'median', featherM: 8,
    refs: [[10.7527639, 59.9075797], [10.7535651, 59.9075836], [10.7525204, 59.9077392]],
  },
};
export const PALETTES = {
  light: {
    marble: '#f4f1ea', joint: '#c8c2b6', granite: '#d5d8d2', aluminium: '#e7e4dc',
    glass: '#1c4552', light: '#e6d3b0', steel: '#f7f4ee', void: '#243036',
  },
  dark: {
    marble: '#9aa3aa', joint: '#7d868c', granite: '#8b9394', aluminium: '#c5ccd2',
    glass: '#071820', light: '#ffb25a', steel: '#d5dbe0', void: '#0c0e0e',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid waterfront grade y=0. No sea-level height, DEM or Mercator scale baked into the geometry.',
  attribution: 'Original procedural mesh by Codriver. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Snøhetta opera house, opened 2008. Marble glacier roof, glass foyer and 35 m aluminium fly tower follow OSM ways 810259696, 397360403 and 397360407. The 54 m figure is the interior clear height over a stage below sea level, not the exterior. Fold heights, overhang, mullions and the weave module are estimates. Cityscape and Full 3D world not tested yet; integration is checked separately. See docs/3d-top-cities-oslo-opera-house.md.',
};
