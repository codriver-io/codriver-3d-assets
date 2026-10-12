// Paleis op de Dam: original exterior, real metres; rotation baked in geometry.
export const SPEC = {
  id: 'royal-palace-amsterdam', name: 'Royal Palace (Paleis op de Dam)', kind: 'building',
  ready: true, origin: [4.89136, 52.37317], height: 51, padM: 60,
  frontageBearing: 1.55, eaves: 25, roofHeight: 30, facadeWidth: 80,
};
export const PALETTES = {
  light: { stone: '#a49e8f', trim: '#bab29e', roof: '#42464c', glass: '#303b40', bronze: '#50625b', gold: '#bfa256', light: '#3b3930' },
  dark: { stone: '#5c6267', trim: '#747b7e', roof: '#272f39', glass: '#23333d', bronze: '#3b514c', gold: '#928451', light: '#c29a5d' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid foundation at local grade y=0; no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry, Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Dutch classical palace: seven small entrance arches, paired window rows, sculpted pediments, four corner hips and open domed cupola with ship vane. OSM massing and heights; ornament and 51 m vane tip estimated from references. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
