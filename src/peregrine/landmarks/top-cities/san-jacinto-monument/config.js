// Finn / Cummins, 1939. Primary dimensions: museum and original contractor Bellows.
export const SPEC = {
  id: 'san-jacinto-monument', name: 'San Jacinto Monument', kind: 'building', ready: true,
  origin: [-95.080704525, 29.74985375], // mapped star support, way 257767770
  height: 567.31 * 0.3048, starM: 34 * 0.3048,
  shaftBaseM: 48 * 0.3048, observationM: 30 * 0.3048, starSupportM: 19 * 0.3048,
  padM: 88, frontageBearing: 25.2, angle: -25.2 * Math.PI / 180,
};
export const PALETTES = {
  light: { stone: '#d7c9ad', stone_recess: '#b4a68e', bronze: '#504538', glass: '#394b50' },
  dark: { stone: '#94968f', stone_recess: '#787d77', bronze: '#302e29', glass: '#657271' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0 beneath a rigid terraced base. No DEM, sea level or latitude stretch baked in.',
  attribution: 'Original procedural mesh. Mapped platform and provider parts © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Published height, star height and shaft widths. Museum and terrace plans mapped; fluting, cornice heights, doors and reliefs estimated from photographs. Nine-tip star approximated by perpendicular faceted Lone Star volumes sharing their zenith. Separate reflecting pool, landscape, inscription text and interior omitted. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
