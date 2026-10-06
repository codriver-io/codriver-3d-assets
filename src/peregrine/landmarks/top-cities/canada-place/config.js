// Canada Place / Pan Pacific Vancouver, post-2011 replacement sails.
export const SPEC = {
  id: 'canada-place', name: 'Canada Place', kind: 'building', ready: true,
  origin: [-123.11112, 49.28863], height: 81.5, padM: 290,
  frontageBearing: 152, nearM: 850, rangeM: 3200,
};
export const PALETTES = {
  light: { concrete:'#b9bfbe', trim:'#cccbbf', glass:'#4d6368', fabric:'#f5f4ed', steel:'#929ea3', roof:'#76848a', glow:'#809ba4' },
  dark: { concrete:'#566571', trim:'#89959d', glass:'#263f50', fabric:'#91b4d1', steel:'#6c8191', roof:'#384957', glow:'#d5bd84' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map pier/shore grade y=0; no sea level or terrain baked into geometry.',
  attribution: 'Original procedural mesh by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Five original curved thin-shell sail approximations on mapped roof bays, pier terminal and Pan Pacific hotel. 81.5 m hotel height from the supplied Wikipedia dossier; roof profiles, facade spacing and podium levels are photographic estimates. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
