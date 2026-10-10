// Pont Saint-Pierre, Toulouse: the five-span composite bridge opened 14 November 1987.
export const SPEC = {
  id: 'pont-saint-pierre', name: 'Pont Saint-Pierre', kind: 'bridge', ready: true,
  origin: [1.4348263, 43.60220035], height: 14.9, padM: 170,
  frontageBearing: 27.6, footprintless: true,
};
export const PALETTES = {
  light: { brick: '#874529', stone: '#b7a78d', concrete: '#d0cab8', lattice: '#fbfcf8', steel: '#495c54', rail: '#497d67', asphalt: '#666a68', lamp: '#efeee0' },
  dark: { brick: '#67351f', stone: '#71736a', concrete: '#778483', lattice: '#c5d5cd', steel: '#354b49', rail: '#395f55', asphalt: '#303b40', lamp: '#ffe2a1' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat Cityscape grade y=0, no sea-level or DEM elevations baked in. Estimated 7.4 m main deck; ends join mapped approaches. World uses bank-fit, interpolated bank datums and independently grounded pier feet.',
  attribution: 'Original procedural geometry. Alignment and bridge outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Current 1987 steel/concrete bridge, five shallow lattice girder spans, four brick-and-stone river piers, raised stone pylons, green cast-metal railings and paired lantern arms. Published length 240 m and width 13.2 m; mapped road 236.09 m, mapped pier pitch approximately 55 m. Pylon, steel sections, lanterns and deck clearance are photographic estimates. Seasonal pedestrian OSM tags preserved; no lane paint or seasonal furniture authored.',
};
