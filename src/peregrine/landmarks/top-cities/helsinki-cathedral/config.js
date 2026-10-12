// Present-day exterior; structural centre is the mapped central drum.
export const SPEC = {
  id: 'helsinki-cathedral', name: 'Helsinki Cathedral', kind: 'building', ready: true,
  origin: [24.9521785, 60.170378], height: 62.2, padM: 1, frontageBearing: 177,
  terraceHeight: 7.2, yaw: 3 * Math.PI / 180,
  terrainPad: {
    datum: 'median', featherM: 8,
    rings: [[[24.9514,60.16983],[24.95302,60.16983],[24.95302,60.17078],[24.9514,60.17078]]],
    refs: [[24.95198,60.16986],[24.9524,60.16986]],
    terraces: [{ ring: [[24.95143,60.17007],[24.95299,60.17007],[24.95299,60.17077],[24.95143,60.17077]], offsetM: 7.2, featherM: 4 }],
  },
};
export const PALETTES = {
  light: { stone: '#e5e4de', relief: '#d2d1cb', granite: '#938b7e', copper: '#536f60', glass: '#36474a', zinc: '#a2aaa4', lamp: '#b9a257' },
  dark: { stone: '#b6b9b5', relief: '#999e9b', granite: '#535a5c', copper: '#314c43', glass: '#889c95', zinc: '#707f7b', lamp: '#e0c278' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 at the Senate Square stair foot; upper church terrace at +7.2 m, estimated. No absolute altitude or DEM baked in.',
  attribution: 'Original procedural mesh for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Photo-calibrated highest cross 55 m above terrace, 62.2 m above stair foot; OSM 61 m height tag is retained as a differing reference, not a surveyed dimension. Stairs, Corinthian capitals and apostle silhouettes approximated; rotation baked once. Cityscape and Full 3D world not tested yet.',
};
