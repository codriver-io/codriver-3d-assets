// 1956 Louis Naidorf / Welton Becket tower, 1750 N Vine Street, Hollywood.
export const SPEC = {
  id: 'capitol-records-building', name: 'Capitol Records Building', kind: 'building', ready: true,
  // Centre of the mapped circular tower, not Wikipedia's east-side campus point.
  origin: [-118.32636885, 34.10315525], height: 70.714, padM: 38,
  frontageBearing: 270.3, roofHeight: 45.72, towerRadius: 14.0208, shadeRadius: 15.4,
};
export const PALETTES = {
  light: { wall: '#b9bcb8', white: '#ecece4', glass: '#28383d', metal: '#8e9695', roof: '#646e70', sign: '#e8e2d0', glow: '#9b2225' },
  dark: { wall: '#697579', white: '#a5aeb0', glass: '#15242c', metal: '#626f77', roof: '#38464e', sign: '#fff2d0', glow: '#ff2925' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat grade y=0; rigid studio podium, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '150 ft roof and 82 ft rooftop spire follow City heritage description; sources disagree (Conservancy says 90 ft spire; Wikipedia labels 46 m as antenna height). 92 ft upper floor diameter sourced; outer sunshades mapped/photo calibrated. Podium height, crown, floor spacing, lettering, doors and facade divisions estimated. Static beacon, no Morse animation; mural, interiors and flag omitted.',
};
