// Rattenbury's 1908 railway hotel and later wings; orientation baked from OSM.
export const SPEC = {
  id: 'fairmont-empress', name: 'Fairmont Empress', kind: 'building', ready: true,
  origin: [-123.36797, 48.42185], height: 35.4, padM: 130,
  frontageBearing: 278.5, gridAngle: 8.5,
};
export const PALETTES = {
  light: { brick: '#966950', stone: '#c0b59f', slate: '#303238', copper: '#435d54', glass: '#34474b', glow: '#34474b', metal: '#554f48' },
  dark: { brick: '#594133', stone: '#797568', slate: '#1d242b', copper: '#273e37', glass: '#263b43', glow: '#eac681', metal: '#383f43' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid hotel foundations at local flat-map grade y=0; no absolute elevation or terrain baked in.',
  attribution: 'Original procedural geometry, Codriver 2026. Mapped outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '35.4 m published overall height, eight levels including roof storeys. OSM relation 1371841 fixes the asymmetrical hotel envelope. Facade rhythm, roofs and ornament are photo estimates. Conference Centre and Conservatory excluded. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
