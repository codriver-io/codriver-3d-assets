// Old City Hall, 60 Queen St W, Toronto: E. J. Lennox, 1889-1899, Richardsonian
// Romanesque. Combined City Hall (south) and York County Court House (north)
// round a courtyard; now the courthouse. See docs/3d-toronto-old-city-hall.md.
// Origin: area centroid of OSM relation 3116's outer ring (way 12906398).
// Authoring frame: u runs along Queen St (bearing 73.25 deg, "east"), v runs
// into the building toward Albert St (bearing 343.25 deg). Toronto's grid is
// rotated about 17 degrees off true north; the mapped walls give 16.75 exactly.
export const SPEC = {
  id: 'old-city-hall', name: 'Old City Hall', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-09-29)
  origin: [-79.38176399, 43.65264186],
  height: 103.64, // clock tower to the top of its finial (340 ft, Wikipedia / City of Toronto)
  padM: 75, frontageBearing: 163.25, // Queen St facade looks toward bearing 163.25 deg
  rotationDeg: 16.75, // authoring u-axis, degrees anticlockwise from east (Y-up, seen from above)
  eaveY: 25.0, pavilionEaveY: 26.4, // estimated, see docs
};
export const PALETTES = {
  light: {
    stone: '#8d7d6c', band: '#7b6455', redstone: '#77493c', roof: '#48524f', glass: '#2e3841',
    trim: '#4d4a42', brass: '#a98a45', glow: '#3f5c56',
  },
  dark: {
    stone: '#5d554c', band: '#4f4137', redstone: '#48322c', roof: '#2a3437', glass: '#1b232b',
    trim: '#332f2a', brass: '#e2c26c', glow: '#f1e4b4',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Queen Street frontage and the courtyard are taken as one level.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Tower height 103.64 m, clock face 6 m and the mapped outline are sourced. Storey heights, roof pitches, the roof plan behind the pavilions, window counts and the north and east elevations are estimated from photographs.',
};
