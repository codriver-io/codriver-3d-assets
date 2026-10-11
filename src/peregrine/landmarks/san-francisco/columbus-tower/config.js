// Columbus Tower (Sentinel Building), 916 Kearny Street at Columbus Avenue · San Francisco.
// Salfield & Kohlberg, 1907. Facts and estimates: docs/3d-san-francisco-columbus-tower.md.
export const SPEC = {
  id: 'columbus-tower', name: 'Columbus Tower (Sentinel Building)', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.4050486, 37.7965438], // area centroid of OSM way 288485994
  height: 29.8, // m to the tip of the spire (OSM height=29; spire tip estimated from photographs)
  padM: 20, // the wedge is ~20 m long
  frontageBearing: 330, // the round corner turret faces north-north-west, toward Columbus/Kearny/Pacific
};
// Same keys in both themes. tile = the white glazed terracotta wall; copper = the verdigris oriels and
// turret rings; verdigris = the paler cornice, dome and finial; patina = recessed panels; frame = stained-wood sashes.
export const PALETTES = {
  light: {
    tile: '#f8f4e8', copper: '#669a8a', patina: '#5a8e7f', verdigris: '#82b09f', glass: '#41596a', frame: '#8f6b45', base: '#2a3230',
    awning: '#a0242b', iron: '#1d1f21', roof: '#777975', gold: '#d9a62c', glow: '#4d6672',
  },
  dark: {
    tile: '#938f86', copper: '#2e5b51', patina: '#244a42', verdigris: '#3b655c', glass: '#18252d', frame: '#523620', base: '#121615',
    awning: '#5a1c20', iron: '#0d0e0f', roof: '#40454a', gold: '#9b7b22', glow: '#ffcd82',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude (the OSM node reads ele=8 m). The model stands on the sidewalk at its own ground floor.',
  attribution: 'Original procedural mesh. Mapped footprint (c) OpenStreetMap contributors (ODbL 1.0), way 288485994; https://www.openstreetmap.org/copyright',
  note: 'Wedge outline and turret size are mapped and the 29 m height (OSM) and eight storeys (SF Planning) are published; storey height (about 2.9 m, ground floor 4.2 m), oriel and window sizes, the spire tip and the fire escape are estimated from photographs. The party wall to 900 Kearny is drawn plain. Awning and fire escape overhang the footprint slightly.',
};
