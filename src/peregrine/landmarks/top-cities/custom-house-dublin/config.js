// Custom House, present restored exterior; original procedural geometry.
export const SPEC = {
  id: 'custom-house-dublin', name: 'Custom House', kind: 'building', ready: true,
  origin: [-6.25319, 53.34868], height: 40, padM: 76, frontageBearing: 179.89,
};
export const PALETTES = {
  light: { stone: '#c9c5b4', drum: '#969b91', roof: '#626a66', copper: '#759c89', glass: '#3d4949', frame: '#ada99a' },
  dark: { stone: '#baa075', drum: '#a29170', roof: '#354247', copper: '#526f62', glass: '#293a37', frame: '#9d967c' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local flat-map grade y=0; no terrain or absolute altitude baked in.',
  attribution: 'Original procedural model for Codriver; source MIT, model CC BY 4.0. Mapped geography © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'James Gandon, completed 1791. Mapped envelope approximately 115 by 63 m, dome top 40 m from OSM. Two principal facade storeys; drum tiers, roof and sculptural detail photo-estimated. Modern courtyard and rear details simplified. Cityscape and Full 3D world integration not tested.',
};
