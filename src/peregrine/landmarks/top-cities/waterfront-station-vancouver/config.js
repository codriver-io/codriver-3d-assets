// Cordova facade control points: (-123.1122651,49.2858456) and
// (-123.111367,49.2852555), OSM way 78393326. Rotation is baked once.
export const ANGLE = 45.2 * Math.PI / 180;
export const SPEC = {
  id: 'waterfront-station-vancouver', name: 'Waterfront Station', kind: 'building',
  ready: true, origin: [-123.11167, 49.28583], height: 23,
  padM: 85, frontageBearing: 225.2,
};
export const PALETTES = {
  light: { brick: '#60382f', stone: '#d7d3c3', base: '#9c978a', roof: '#777670', glass: '#263c42', metal: '#333e3e', glow: '#425355' },
  dark: { brick: '#382a2b', stone: '#797b7b', base: '#565b60', roof: '#343e46', glass: '#233843', metal: '#29353d', glow: '#bc985f' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid Cordova Street pavement datum y=0; real metres east/up/south. No terrain or altitude baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1914 CPR station, present exterior. OSM height 23 m and mapped outline; column profiles, window rhythm and annex heights estimated from credited reference photographs. Ten freestanding Ionic columns plus engaged end pilasters; interiors and the distant SeaBus bridge are omitted. Cityscape and Full 3D world integration not tested yet.',
};
