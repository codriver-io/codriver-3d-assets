import { FOOTPRINTS, FOUNDATION_RING } from './footprint.js';
export const SPEC = {
  id: 'tower-of-london', name: 'Tower of London', kind: 'building', ready: true,
  origin: [-0.07611, 51.50806], height: 35, padM: 155, frontageBearing: 186,
  ownTolM: 1.5, rangeM: 6000, nearM: 950,
  terrainPad: { rings: FOOTPRINTS, refs: [FOUNDATION_RING], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { pale: '#b8b1a0', stone: '#9b978c', trim: '#cdc5b3', lead: '#535b5d', glass: '#273239', timber: '#554435', brick: '#867565', grass: '#69725a' },
  dark: { pale: '#66665e', stone: '#535650', trim: '#858174', lead: '#303b41', glass: '#192731', timber: '#342c27', brick: '#49443c', grass: '#303e33' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid foundation y=0; no absolute altitude, DEM or latitude stretch. Dry moat surface shown at grade; trench depth is left to terrain integration.',
  attribution: 'Original procedural model by Codriver. Mapped geometry © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'White Tower fitted to mapped body (about 30.5 by 35.5 m excluding projections; published 32.5 by 36 m). Southern battlements 27 m; turret finials 34–35 m estimated from photographs and OSM height tags. Secondary heights and moat surfaces estimated. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
