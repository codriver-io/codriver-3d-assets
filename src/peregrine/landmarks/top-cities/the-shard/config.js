// The completed 2012 Renzo Piano tower, 32 London Bridge Street, London.
export const SPEC = {
  id: 'the-shard', name: 'The Shard', kind: 'building', ready: true,
  origin: [-0.0865, 51.5045], height: 309.6, padM: 70,
  // Southern tall shard: mapped (-.0864534,51.5041406) -> (-.0867452,51.5042622).
  frontageBearing: 213.8,
};
export const PALETTES = {
  light: { glass: '#96b7c3', glassCool: '#8baab8', glassPale: '#a3bec6', seam: '#466473', frame: '#bccbd0', roof: '#667478', glow: '#98b9c4', light: '#b6d2da' },
  dark: { glass: '#253c4c', glassCool: '#1b3040', glassPale: '#354a57', seam: '#142531', frame: '#657986', roof: '#34424b', glow: '#d4bf96', light: '#9abcc9' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map street grade y=0; rigid base, no terrain or absolute altitude baked into geometry.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '309.6 m height and eight glass shards follow the operator and RPBW. OSM supplies base outlines, bearings and 70/74 m annex heights. Taper, uneven blade tips, floor/bay pitch, mullions, lighting and entrances are photo-based estimates. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
