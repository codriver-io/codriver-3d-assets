// Storseisundbrua: original 1988 concrete cantilever, Atlantic Road opened 1989.
export const SPEC = {
  id: 'storseisundet-bridge', name: 'Storseisundet Bridge (Atlantic Ocean Road)',
  kind: 'bridge', ready: true, origin: [7.3545931, 63.0167825],
  height: 26.35, padM: 330, frontageBearing: 65, footprintless: true,
};
export const PALETTES = {
  light: { concrete: '#c0c0b5', soffit: '#969b96', asphalt: '#52575b', rail: '#aeb6b8', paint: '#eeeade', yellow: '#d5b039', rock: '#838778', rockLight: '#a1a18d' },
  dark: { concrete: '#7d898c', soffit: '#55666f', asphalt: '#303c46', rail: '#9faeb8', paint: '#bfc5c1', yellow: '#a89f64', rock: '#52626c', rockLight: '#718087' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; estimated road crest 25.2 m and 23 m central soffit clearance. No DEM/sea-level datum or latitude stretch baked in. Absolute-deck policy adapts approaches and support feet.',
  attribution: 'Original procedural geometry. Mapped alignment/outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Published length 260 m, three concrete cantilever spans, maximum sailing clearance about 23 m. Main span 130 m from dossier. OSM structure 264.26 m retained without rescaling. Width 7.4 m from OSM envelope; piers at midpoint ±65 m, haunch depths, 13 m abutment heights, guardrails and engineered rock-fill slopes are photographic estimates. Flat-map ramps 180 m each; central hump peak grade 13.85%. No textures or scans.',
};
