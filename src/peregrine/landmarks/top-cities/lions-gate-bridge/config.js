// Current Lions Gate Bridge, including the 2001 replacement deck.
export const SPEC = {
  id: 'lions-gate-bridge', name: 'Lions Gate Bridge', kind: 'bridge', ready: true,
  origin: [-123.13858845, 49.31544355], height: 111, padM: 800,
  frontageBearing: 31, footprintless: true, terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { steel: '#427c69', cable: '#aab0a2', concrete: '#bcb4a2', asphalt: '#555d63', paint: '#e5c457', lamp: '#dddacb' },
  dark: { steel: '#4b9b83', cable: '#687c78', concrete: '#788087', asphalt: '#303c47', paint: '#b8a653', lamp: '#ffe7a8' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at water/flat-map grade. Absolute-deck terrain policy; no DEM or latitude stretch baked into geometry. Road surface 64.4 m and truss bottom 61 m, approximate published navigation clearance.',
  attribution: 'Original procedural mesh; alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '473 m main span, 187 m side spans, 111 m tower top. Tapered X-braced towers, arched portals, suspension cables, modern thin deck and north steel viaduct. Published tower height varies with datum (111 versus 118 m); use mapped 111 m. Mapped pylon spacing 456 m differs from published span: tower stations symmetrically adjusted 8.6 m. Cable sag, member sections, piers and lighting spacing estimated. Cityscape ramps 900 m south and 730.3 m north, smoothstep grades 10.7 / 13.23 percent. Lions, rivets and individual cable wires omitted.',
};
