// Permanent 1960 structure; pre-2026 cycleway widening cross-section.
export const SPEC = {
  id: 'tromso-bridge', name: 'Tromsø Bridge', kind: 'bridge', ready: true,
  origin: [18.97813, 69.6513], height: 47.6, padM: 550,
  frontageBearing: 122.9, terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { concrete: '#a2a69f', asphalt: '#53595c', rail: '#a8afb1', paint: '#eceadd', yellow: '#d6b548', lamp: '#fff0ce' },
  dark: { concrete: '#737e88', asphalt: '#303c47', rail: '#879aaa', paint: '#aeb6be', yellow: '#ae963c', lamp: '#ffe2a0' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is flat-map grade. Absolute-deck world placement uses an estimated 39.25 m road crest from published 38 m navigation clearance. Supports fit the DEM separately; no DEM baked in.',
  attribution: 'Original procedural geometry. Alignment and outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Mapped 1043 m alignment; published 1036 m length, 80 m main span, 58 bays and 8.3 m historic deck. Paired slender columns, concrete haunches, curved eastern approach, inward-curving safety fence. Pier stations, profiles and fittings estimated; pre-2026 widening state.',
};
