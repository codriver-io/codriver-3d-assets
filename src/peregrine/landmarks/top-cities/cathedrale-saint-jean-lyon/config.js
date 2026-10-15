// Original procedural exterior; present-day cathedral, no festival projection.
export const SPEC = {
  id: 'cathedrale-saint-jean-lyon', name: 'Cathédrale Saint-Jean', kind: 'building',
  ready: true, origin: [4.8275, 45.76075], height: 44, padM: 54,
  frontageBearing: 293,
};
export const PALETTES = {
  light: { stone: '#c9c2ae', trim: '#d8cfb8', roof: '#7a7163', recess: '#30302b', glass: '#414a46', door: '#63392e' },
  dark: { stone: '#64665e', trim: '#848273', roof: '#3e4547', recess: '#20282c', glass: '#344547', door: '#473733' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid exterior on local pavement y=0; no altitude, DEM or Mercator stretch baked into the asset.',
  attribution: 'Original procedural mesh © Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Four spireless towers, western screen/rose/three portals, stepped nave and Romanesque chevet. 44 m maximum is published; exterior stage heights and ornament are photo estimates. Orientation baked once, west frontage 293 degrees. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
