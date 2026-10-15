// Hôtel Negresco, Nice. All elevations above the mapped 24 m body are photo estimates.
export const SPEC = {
  id: 'hotel-negresco', name: 'Hôtel Negresco', kind: 'building', ready: true,
  origin: [7.258,43.6947], height: 40.6, padM: 58, frontageBearing: 162.9,
  ownTolM: 1.4,
};
export const PALETTES = {
  light: { stone:'#eee9de', shadow:'#c4bfb0', glass:'#35494b', pink:'#bc827c', copper:'#709a88', iron:'#454b47', sign:'#c8b98c', glow:'#435456' },
  dark: { stone:'#92918a', shadow:'#686f70', glass:'#24383f', pink:'#805d5e', copper:'#527a70', iron:'#414d50', sign:'#ffe4a1', glow:'#dfb676' },
};
export const MANIFEST = {
  elevationDatum:'Rigid local grade y=0, real metres east/up/south; no terrain or absolute height baked in.',
  attribution:'Original procedural mesh, Codriver 2026. Footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note:'1913 Belle Époque hotel; 24 m main-body height mapped. Roof, dome, lantern, bay dimensions and total 40.6 m flagpole height estimated from attributed reference photographs. Rotation baked from OSM controls. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
