// Stent Family Wing (Meier, 1983) and the three Piano buildings (2005).
export const SPEC = {
  id: 'high-museum-of-art', name: 'High Museum of Art', kind: 'building', ready: true,
  origin: [-84.38557, 33.79005], height: 28, padM: 155, frontageBearing: 151,
};
export const PALETTES = {
  light: { white: '#eeeee8', aluminum: '#dcdfdc', joint: '#adb6b6', glass: '#6d8c92', roof: '#c1c9c7', foundation: '#c5c6be', path: '#e1ddd0', glow: '#9aab9e' },
  dark: { white: '#a1aeb9', aluminum: '#8c9da9', joint: '#647582', glass: '#354c5b', roof: '#6a7c89', foundation: '#7c8992', path: '#9da8ae', glow: '#d0b37b' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid foundation y=0; no terrain or absolute altitude baked into the GLB.',
  attribution: 'Original procedural geometry. Mapped plans © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Meier 1983 and Piano 2005 campus. OSM plans and 61° long-edge bearing; heights (28 m peak), panel pitches, atrium tiers and ramp are photographic estimates. Roof scoops are representative rather than all 1,000. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
