// Wilshire Grand Center, 900 Wilshire Boulevard, Los Angeles (AC Martin, completed 2017).
// Sourced: 335.3 m (1,100 ft) to the top of the spire, roof 283 m (928 ft), 73 storeys, 90 m (295-300 ft) spire
// (Wikipedia, Skyscraper Center, OSM way 496246723 height=335.3 and spire part 901739648 note "spire height is 89.916 m",
// tower part 1307580959 height=245). The mapped tower plan axis runs along Wilshire Boulevard at bearing 127.4 degrees
// (mapped, from the 52 m NE tower strip). Everything else (taper law, crown arc, floor pitch, podium height) is
// estimated from photographs and documented in docs/3d-top-cities-wilshire-grand-center.md.
export const SPEC = {
  id: 'wilshire-grand-center', name: 'Wilshire Grand Center', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the mapped block outline (way 496246723): the tower stands in its east half, the 7-level podium in the west.
  origin: [-118.260211, 34.050009],
  height: 335.3, // m to the top of the spire
  padM: 60,
  // Outward bearing of the Wilshire Boulevard (north-east) frontage of the block.
  frontageBearing: 37,
  planBearingDeg: 127.4, // bearing of the tower's long axis (u), baked into the geometry
  roofY: 283, // highest edge of the sail crown (928 ft)
  shaftTopY: 245, // where the glass shaft ends and the sail crown begins (OSM tower part height=245, spire base)
  spireBaseY: 245.4, // 335.3 - 89.9
  floorPitch: 3.95, // m between floor lines (estimated: 60 floors from the 8 m lobby to 245 m)
  lobbyY: 8,
  podiumY: 31, // seven levels (OSM building:levels=7; estimated 4.4 m a level)
  // Model frame offset from the dossier's local metres (origin -118.2593, 34.05) to this origin.
  dossierShift: [84, 1],
};
export const PALETTES = {
  light: {
    glass: '#7ba2bc', spandrel: '#8fb0c4', crown: '#adcce0', fin: '#d6dde0', metal: '#e3e7e9', pglass: '#43515e',
    stone: '#958f86', roof: '#7d8b94', glow: '#82a9c2', light: '#c4dcec', lamp: '#eef1f2', water: '#4aa3c9',
  },
  dark: {
    glass: '#2c4358', spandrel: '#3d5262', crown: '#4d7190', fin: '#85929e', metal: '#9aa6b0', pglass: '#1d2730',
    stone: '#5b5d60', roof: '#3b4a56', glow: '#ffd27a', light: '#9fd0ff', lamp: '#ff5a4a', water: '#2a5a78',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan and heights mapped/sourced (335.3 m, roof 283 m, 90 m spire, 73 levels); taper law, sail-crown arc, floor rhythm, podium height and glazing colours are estimated from photographs.',
};
