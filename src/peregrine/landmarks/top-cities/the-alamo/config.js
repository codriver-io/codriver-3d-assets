// Present-day church and Long Barrack. Heights are mapped tags / photo estimates.
export const SPEC = {
  id: 'the-alamo', name: "The Alamo", kind: 'building',
  ready: true,
  origin: [-98.48611, 29.42583],
  height: 9.8,
  padM: 60,
  frontageBearing: 279, ownTolM: 0.8,
};
export const PALETTES = {
  light: {stone:'#bdb197',trim:'#cec1a7',mortar:'#a29883',wood:'#44352a',iron:'#343833',roof:'#91948e'},
  dark: {stone:'#62625c',trim:'#7c7970',mortar:'#51564f',wood:'#302e2a',iron:'#242d2d',roof:'#485455'},
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Present-day church with rounded army-era crest and 1921 barrel roof, plus Long Barrack. Facade peak 9.8 m and shoulder 7.6 m use OSM parts, not a survey. Other heights, openings, carvings and roof curvature are photo estimates. West facade bearing 279° is baked in. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
