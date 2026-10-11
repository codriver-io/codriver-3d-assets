// Permanent 1975 viaduct, with the later central concrete traffic separator.
export const SPEC = {
  id: 'viaduc-de-calix', name: 'Viaduc de Calix', kind: 'bridge', ready: true,
  origin: [-0.32775, 49.1846], height: 46.5, padM: 760,
  frontageBearing: 148, terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { concrete: '#a4a8a8', asphalt: '#55585a', steel: '#777e7c', joint: '#8a8c84', paint: '#eeeadd', lamp: '#fff0d0' },
  dark: { concrete: '#737e85', asphalt: '#303b43', steel: '#81919b', joint: '#65717b', paint: '#bec4c6', lamp: '#ffe0a0' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; 38 m road crest interpreted from the 1976 engineering account. Absolute-deck mode fits approach datums and support feet separately, with no DEM baked into vertices.',
  attribution: 'Original procedural geometry. Alignment and footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '15 sourced spans, 1182.60 m structural length (mapped 1183.07 m), 16.50–23.39 m slab, twin 3.82 m box girders at 9.60 m centres, 1.90–9.70 m depth and independent flared piers. Flat-map ramps, lamp/rail fittings and colour estimated; permanent state excludes 2025–2026 scaffolding.',
};
