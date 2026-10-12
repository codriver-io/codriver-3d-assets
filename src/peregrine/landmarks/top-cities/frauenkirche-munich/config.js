// Dom zu Unserer Lieben Frau, restored exterior without temporary scaffolding.
export const SPEC = {
  id: 'frauenkirche-munich', name: 'Frauenkirche', kind: 'building', ready: true,
  origin: [11.57358, 48.1385668], height: 98.57, padM: 59,
  frontageBearing: 268.846,
};
export const PALETTES = {
  light: { brick: '#946d58', trim: '#b3a48a', roof: '#b26748', copper: '#689584', glass: '#354749', recess: '#292b26', clock: '#e2ddc7' },
  dark: { brick: '#493c35', trim: '#665f4e', roof: '#613e30', copper: '#37584e', glass: '#17272c', recess: '#141b1d', clock: '#b5ae91' },
};
export const MANIFEST = {
  elevationDatum: 'Local Frauenplatz pavement y=0; rigid foundation, no terrain or sea-level heights baked in.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published tower tips 98.57 / 98.45 m; plan 109 × 40 m. OSM roof/eaves 60 / 30 m. Battered tower tiers, belfry arcades, glazing, dome profile and dormers are photo-estimated. Orientation baked once, 1.154 degrees north of east. Both placement modes require separate app verification.',
};
