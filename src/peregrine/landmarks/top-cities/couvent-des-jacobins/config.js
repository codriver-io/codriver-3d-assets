// Restored medieval exterior; temporary roof restoration works are omitted.
export const SPEC = {
  id: 'couvent-des-jacobins', name: 'Couvent des Jacobins', kind: 'building', ready: true,
  origin: [1.44023, 43.60349], height: 45, padM: 115,
  frontageBearing: 261.01, // west front; church axis 81.01° from mapped long wall
};
export const PALETTES = {
  light: { brick:'#aa6c50', trim:'#bd8764', roof:'#623b30', recess:'#382d2b', glass:'#686c65', stone:'#b5ada0', glow:'#65665d' },
  dark: { brick:'#624437', trim:'#80634d', roof:'#342724', recess:'#201e23', glass:'#303941', stone:'#66686c', glow:'#94794f' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat pavement y=0; rigid monastery foundation, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Official Couvent site: octagonal belfry 45 m and four tiers of paired mitre arches; OSM tags 49 m, superseded by official height. Nave exterior roof 32 m follows OSM; vault height 28 m is a separate interior measurement. Convent hall heights, buttress profiles, window tracery and tiled roof relief are estimates from photographs. Temporary works and interiors omitted. Flat central Toulouse site; Full 3D world rigid foundation/pad placement is not tested.',
};
