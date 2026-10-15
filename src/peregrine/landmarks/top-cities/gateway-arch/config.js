// Gateway Arch: completed 1965, Eero Saarinen / Severud Associates.
// NPS equation uses feet; all exported geometry uses real metres.
export const SPEC = {
  id: 'gateway-arch', name: 'Gateway Arch', kind: 'building', ready: true,
  origin: [-90.18496865, 38.6246122], height: 192.024, padM: 14,
  frontageBearing: 107.4, axisBearing: 17.4,
  // Bounded rigid park/plaza envelope; datum requires live DEM validation.
  terrainPad: {"rings":[[[-90.185749415,38.623777241],[-90.184999827,38.625645947],[-90.184429273,38.625506258],[-90.185178861,38.623637552],[-90.185749415,38.623777241]]],"refs":[[-90.185281551,38.623832144],[-90.184655749,38.625392256],[-90.185416347,38.624156976],[-90.18500373,38.625185622],[-90.185188094,38.624665926]],"datum":"median","featherM":12},
};
export const PALETTES = {
  light: { steel: '#e4e8ea', steel_inner: '#f0f1ef', steel_outer: '#9b9e9f', glass: '#283c48', paving: '#b6b7b2', lawn: '#939b88' },
  dark: { steel: '#bec2c4', steel_inner: '#d2d5d4', steel_outer: '#777b7d', glass: '#b6b7a2', paving: '#777b7a', lawn: '#444c43' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is flat park/plaza grade at both arch feet; no absolute elevation or DEM baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'NPS weighted-catenary centreline and area taper; 630 ft exterior height/span, 54–17 ft triangular section and 32 crown windows. Orientation from OSM north/south feet; rotation baked. Flat muted lawn, grade-level paths and triangular foot paving estimated; underground museum omitted. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
