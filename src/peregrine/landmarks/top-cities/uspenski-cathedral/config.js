import { FOOTPRINTS } from './footprint.js';
// Origin is the mapped central onion's centre, not the dossier's road-side point.
export const SPEC = {
  id: 'uspenski-cathedral', name: 'Uspenski Cathedral', kind: 'building', ready: true,
  origin: [24.9599092, 60.1685234], height: 38, padM: 1,
  frontageBearing: 266.7, yaw: 3.3 * Math.PI / 180,
  terrainPad: { datum: 'median', featherM: 5, rings: FOOTPRINTS,
    refs: [[24.95970,60.16852],[24.96010,60.16852],[24.95991,60.16863],[24.95993,60.16830]],
  },
};
export const PALETTES = {
  light: { brick: '#884a36', copper: '#4e7567', glass: '#334446', granite: '#a49d8c', trim: '#b9b3a6', lamp: '#bd9a46' },
  dark: { brick: '#5b382e', copper: '#344f48', glass: '#293b42', granite: '#6e736e', trim: '#979c96', lamp: '#d7b65c' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 at the hilltop church footing; rigid local grade. No hill, absolute altitude, DEM or latitude stretch baked in.',
  attribution: 'Original procedural Codriver model; OSM geographic frame © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
  note: 'Present-day exterior, completed 1868. Parish describes a 33 m cupola roof; revised copper neck reaches an estimated 34.6 m after aerial-profile calibration, with gold cap/cross retained at 37.84 m. OSM main crown 39/44 m tags differ from parish roof height. Facade details and small crowns photo-calibrated. Median hilltop pad is provisional; Cityscape and Full 3D world not tested yet, integration checked separately.',
};
