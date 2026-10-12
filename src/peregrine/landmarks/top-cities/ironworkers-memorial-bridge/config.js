// Current 1960 crossing, with widened paths and safety fences. See the landmark doc.
export const SPEC = {
  id: 'ironworkers-memorial-bridge', name: 'Ironworkers Memorial Second Narrows Crossing', kind: 'bridge',
  ready: true, origin: [-123.026291, 49.29467], height: 64, padM: 1050,
  frontageBearing: 178.9, footprintless: true, terrainPolicy: 'absolute-deck',
  lateralBankFit: { terrainClamp: true, clearanceM: .15, blendM: 120 },
  clipStandardEnds: true,
};
export const PALETTES = {
  light: { steel: '#b4a269', concrete: '#aaa99f', barrier: '#aaa99f', asphalt: '#555d63', rail: '#7c877e', paint: '#e8e6dc', lamp: '#f4ebce' },
  dark: { steel: '#77765d', concrete: '#707d87', barrier: '#707d87', asphalt: '#303c47', rail: '#637779', paint: '#b9bdbe', lamp: '#ffdb91' },
};
export const MANIFEST = {
  elevationDatum: 'Metric east/up/south about the main-span centre. Authored y=0 is a local water/grade reference; no DEM or Mercator stretch baked in. World keeps the engineering-shaped absolute deck and fits feet/endpoints to terrain; Cityscape uses a separate junction-safe flat profile.',
  attribution: 'Original procedural model; roadway/outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
  note: 'Published 1292 m total, 335 m main, 142 m anchor spans. BC Ministry 2018 drawing gives 116 m cantilevers and 103 m suspended centre (IABSE rounds centre to 110 m). Estimated deck crest 56.5 m, curved bottom-chord geometry and member sections; outline-measured 27.8 m deck. Mapped outline is 1326 m including the south landing; the profile continues 130 m to the first motorway junction.',
};
