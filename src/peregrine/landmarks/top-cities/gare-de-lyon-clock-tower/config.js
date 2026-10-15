// Gare de Lyon (clock tower), Paris, France.
// Original procedural building. Contract: docs/3d-top-cities-landmarks.md.
export const SPEC = {
  id: 'gare-de-lyon-clock-tower', name: "Gare de Lyon (clock tower)", kind: 'building',
  ready: true,
  origin: [2.3735, 48.8448], // dossier anchor; geometry aligned to OSM parts
  height: 67, // m, OSM Tour de l’Horloge height
  padM: 250,
  frontageBearing: 310, axisBearing: 40,
};
export const PALETTES = {
  light: { stone:'#cfc5af', trim:'#dfd4bc', roof:'#667079', glass:'#58686a', iron:'#343b3d', clock:'#78949d', glow:'#526065', mark:'#e7e2d0' },
  dark: { stone:'#626970', trim:'#899095', roof:'#3c4b59', glass:'#263d47', iron:'#313a41', clock:'#75939c', glow:'#e8bb76', mark:'#f4e4ba' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Original 1900 headhouse, 67 m clock tower and Hall 1 shed. OSM plan and heights; facade bays, dome tiers and Hall 2 roofs estimated from photographs. Rotation baked once at 40° facade axis. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
