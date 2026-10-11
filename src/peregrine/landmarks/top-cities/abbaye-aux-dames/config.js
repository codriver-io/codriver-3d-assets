import { FOOTPRINTS } from './footprint.js';
// La Trinité in its present state: restored Romanesque church and classical convent.
export const SPEC = {
  id: 'abbaye-aux-dames', name: "Abbaye aux Dames (La Trinité)", kind: 'building',
  ready: true,
  origin: [-0.35242, 49.18682],
  height: 36, // estimated crossing finial; no surveyed vertical dimensions available
  padM: 112,
  frontageBearing: 315.3,
  terrainPad: {
    rings: FOOTPRINTS.filter((_,i)=>[0,5,7,8,9,10].includes(i)),
    refs: [[-0.353307,49.186456],[-0.3525187,49.1860587],[-0.3514919,49.186396],[-0.3526546,49.1876233]],
    datum: 'median', featherM: 9,
  },
};
export const PALETTES = {
  light: { stone: '#aa9f88', trim: '#c8b995', weather: '#d6c7a6', roof: '#4b5660', recess: '#292b28', glass: '#596d6d', door: '#8f4743', iron: '#827a66' },
  dark: { stone: '#686454', trim: '#8d8470', weather: '#898371', roof: '#303c47', recess: '#192128', glass: '#344b50', door: '#553331', iron: '#55584c' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local flat grade y=0; no terrain, absolute altitude or Mercator stretch baked into geometry. Footprint-bounded median terrain pad requested separately.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Present Romanesque church, square west towers with pierced balustrades, crossing spire, semicircular apse, three classical convent wings and Hôtel-Dieu gallery/Sainte-Anne annex. Mapped exterior church approximately 80 × 19 m, 32 m transept. Vertical dimensions, ornaments and facade spacing are photographic estimates; sculpture and interiors omitted. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
