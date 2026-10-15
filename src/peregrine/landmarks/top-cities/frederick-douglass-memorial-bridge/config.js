// Current 2021 replacement; dimensions from SYSTRA IBT and AISC. See the landmark doc.
export const SPEC = {
  id: 'frederick-douglass-memorial-bridge', name: 'Frederick Douglass Memorial Bridge', kind: 'bridge',
  ready: true, origin: [-77.005612375, 38.8684704], height: 51.2064, padM: 100, frontageBearing: 117.3,
  rangeM: 6000, nearM: 1300, footprintless: true,
};
export const PALETTES = {
  light: { arch:'#edece6', concrete:'#b4b5ae', girder:'#67716e', asphalt:'#666e73', rail:'#737f83', hanger:'#a1a7a5', paint:'#e7e5dc', lamp:'#f5e9c9' },
  dark: { arch:'#b1bdc5', concrete:'#677885', girder:'#455866', asphalt:'#354957', rail:'#687e90', hanger:'#7c919e', paint:'#bdc6c8', lamp:'#f2dbaa' },
};
export const MANIFEST = {
  elevationDatum: 'Metric east/up/south, y=0 flat-map grade; estimated 14.6 m deck above river datum, absolute-deck terrain fitting. No DEM or latitude stretch baked into GLBs.',
  attribution: 'Original procedural geometry, Codriver. Alignment and bridge outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '2021 six-lane crossing: 440.64 m, 164.592 m central and 138.0236 m side spans, 37.338 m typical and 50.5968 m overlook width. AISC crown elevations and section dimensions; inclination, deck datum and fittings are photographic estimates; flat-map ramps are an explicit compromise.',
};
