// Tour Incity, completed 2015; real metres east/up/south, rotation baked in plan.
export const SPEC = {
  id: 'tour-incity', name: 'Tour Incity', kind: 'building', ready: true,
  origin: [4.851004736316125, 45.76333066530078], // OSM polygon area centroid
  height: 200, roofHeight: 170, topFloor: 154, storeys: 39,
  padM: 32, frontageBearing: 82.3,
};
export const PALETTES = {
  light: { glass: '#739aaf', glassShade: '#6b8fa4', glassPale: '#80a3b6', frame: '#b7c8ce', roof: '#78858a', glow: '#4c768a', light: '#53666f' },
  dark: { glass: '#172c40', glassShade: '#122335', glassPale: '#20384c', frame: '#495e70', roof: '#28343f', glow: '#c5c3a6', light: '#91b9df' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid tower, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped plan © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '2015 Lyon Incity: 170 m bevelled glass crown and mast to 200 m; 39 storeys. Plan and bearing from OSM way 368018684. Crown drop 16 m, facade grid, mast radius, lobby and night lights estimated from photos. The references show no diagonal exoskeleton; that feature in the dispatch description is excluded. Cityscape and Full 3D world integration not tested yet; checked separately.',
};
