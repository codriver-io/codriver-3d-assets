// Ateneul Român: exterior following the 1994–2004 restoration.
export const SPEC = {
  id: 'romanian-athenaeum', name: 'Romanian Athenaeum', kind: 'building',
  ready: true, origin: [26.0973, 44.4413], height: 31, padM: 49,
  frontageBearing: 235.3696501104, rotation: -55.3696501104, domeDiameter: 29.16,
};
export const PALETTES = {
  light: { stone: '#dfcda4', trim: '#eee1c0', roof: '#596361', glass: '#34443f', wood: '#986735', gold: '#b89848', glow: '#625b43' },
  dark: { stone: '#888475', trim: '#b8ae91', roof: '#354447', glass: '#354b52', wood: '#695339', gold: '#a9935e', glow: '#efb85f' },
};
export const MANIFEST = {
  elevationDatum: 'Local entrance grade y=0; rigid metric base, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry. Mapped envelope © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '31 m top follows detailed OSM parts and photo proportions; parent OSM and published sources instead claim 41 m. Published external dome diameter 29.16 m. Facade heights, reliefs and rear roof reconstruction are estimated. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
