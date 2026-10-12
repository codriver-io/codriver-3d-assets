// Current road/rail bridge (1966; railway and auxiliary cables added 1999).
export const SPEC = {
  id: 'ponte-25-de-abril', name: 'Ponte 25 de Abril', kind: 'bridge', ready: true,
  origin: [-9.17708, 38.68950], height: 190.5, padM: 2400,
  lateralBankFit: { terrainClamp: true, clearanceM: .15, blendM: 120 },
  frontageBearing: 350.3, terrainPolicy: 'absolute-deck', rangeM: 14000, nearM: 3800,
};
export const PALETTES = {
  light: { steel: '#a44434', concrete: '#c5c0ad', asphalt: '#565c60', paint: '#e6dfcb', rail: '#696c67', lamp: '#f4db9f' },
  dark: { steel: '#853c32', concrete: '#6e777c', asphalt: '#303b43', paint: '#a6adb0', rail: '#69777c', lamp: '#ffd18a' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 water/flat-map grade. Authored road 80 m, underside 70 m; no DEM or Mercator scaling baked in. Absolute-deck terrain policy blends approaches and plants supports.',
  attribution: 'Original procedural mesh; alignment and support footprints © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
  note: 'Published 1012.88 m main span, 482.42 m side spans, 190.5 m towers, 70 m clearance. Estimated truss depth 10 m, cable sag, bracing and viaduct sections; Cityscape ramps are a flat-map compromise.',
};
