// High Level Bridge, current black-painted 1913 structure; City heritage fact sheet.
export const SPEC = {
  id: 'high-level-bridge-edmonton', name: 'High Level Bridge', kind: 'bridge', ready: true,
  origin: [-113.51109, 53.53018], height: 54.4, padM: 80, frontageBearing: 199,
  footprintless: true, terrainPolicy: 'absolute-deck', rangeM: 7500, nearM: 2000,
};
export const PALETTES = {
  light: { fill: '#b4b9af', steel: '#302e2a', girder: '#302e2a', stone: '#b3afa2', concrete: '#b3afa2', asphalt: '#555d63', timber: '#3a342d', rail: '#777b7a', paint: '#dedcd2', light: '#6c7578' },
  dark: { fill: '#4d5651', steel: '#303841', girder: '#303841', stone: '#667179', concrete: '#667179', asphalt: '#303c47', timber: '#303137', rail: '#65737d', paint: '#9da7ae', light: '#94b4dc' },
};
export const MANIFEST = {
  elevationDatum: 'Local valley grade y=0; lower roadway 41.45 m, rail-deck base 47.55 m. No DEM or Mercator scale in the GLBs; world placement uses a separate estimated absolute road datum.',
  attribution: 'Original procedural geometry. Alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'City heritage dimensions: 2550 ft (777.24 m), upper rail base 156 ft (47.55 m), decks 20 ft (6.096 m) apart and 39 ft (11.89 m) wide, three 288 ft (87.78 m) river Pratt spans; concrete river piers and steel land trestles. Member sections, pier taper, lighting, catenary and terrain road datum estimated. Flat ramps follow mapped land trestles; world keeps a level rigid crossing.',
};
