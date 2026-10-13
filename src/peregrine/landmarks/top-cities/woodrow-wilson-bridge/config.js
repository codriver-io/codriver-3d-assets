// Current twin replacement bridges, opened 2006/2008; leaves closed for road traffic.
export const SPEC = {
  id: 'woodrow-wilson-bridge', name: "Woodrow Wilson Bridge", kind: 'bridge',
  ready: true,
  origin: [-77.037669, 38.7927185], // midpoint of the mapped movable roadway pieces
  height: 33.3, padM: 1800, frontageBearing: 89,
  terrainPolicy: 'absolute-deck', rangeM: 8000, nearM: 2600,
  lateralBankFit: { terrainClamp: true, clearanceM: .15, blendM: 120 },
};
export const PALETTES = {
  light: { concrete: '#c2bfb3', girder: '#b0b2a9', asphalt: '#565d61', rail: '#838b8b', steel: '#76817e', glass: '#56777d', paint: '#deddd0', lamp: '#f4d99b' },
  dark: { concrete: '#778184', girder: '#66777c', asphalt: '#303b43', rail: '#859498', steel: '#677b7e', glass: '#45636b', paint: '#a7afb0', lamp: '#f3cc83' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 water/flat-map grade, authored road crest 24 m and 70 ft navigation clearance at the closed bascule centre. Absolute-deck terrain fitting plants supports and blends approach roads; no DEM baked into the model.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced 270 ft trunnion spacing, 124/110 ft twin deck widths, 15 ft gap and eight bascule leaves. Estimated pier stations/curvature, deck datum, control-house dimensions and approach grades; fixed closed leaves, no operational animation.',
};
