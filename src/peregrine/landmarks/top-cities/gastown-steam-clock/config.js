// Gastown Steam Clock, Water Street at Cambie Street, Vancouver, British Columbia. Designed and built by
// Raymond Saunders, 1977. Sourced: about 5 m (16 ft) tall; a cast bronze and glass case on a granite
// plinth, four clock faces, a pagoda roof with a tall central steam whistle and four corner whistles; the
// plaque on the plinth says the clock weighs over two tons. The origin is the OSM clock node position
// (-123.10889, 49.28438). No OSM building way exists under it (the nearest, way/363419786, is a 4 m annex
// 50 m away), so the model is footprintless and stands on the sidewalk. Water Street runs along the mapped
// building edges at bearing 106 degrees (the neighbouring blocks' longest edges are 106 and 15 degrees):
// the clock's square plan is rotated 16 degrees from the east-west axes so its faces look along and across
// the street. See docs/3d-top-cities-gastown-steam-clock.md.
export const SPEC = {
  id: 'gastown-steam-clock', name: 'Gastown Steam Clock', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-123.10889, 49.28438], // the clock's axis
  height: 5, // m to the tip of the central whistle finial
  padM: 6, // the brick pad and bollards reach 2.1 m from the axis
  frontageBearing: 164, // the plaque and vent face south-south-east, onto Water Street's roadway
  footprintless: true, // no OSM extrusion to replace: the model stands on its own
  // Model facts the geometry, tests and docs share (metres, clock-local axes before the 16 degree turn).
  turnDeg: 16, plinthHalf: 0.46, shaftHalf: 0.29, cabinetCoreHalf: 0.32, cabinetBottomY: 3.03, cabinetTopY: 3.83,
  dialR: 0.27, padHalf: 1.5, bollardHalf: 1.15,
};
// Photo-calibrated, muted: blackened bronze, aged brass, dark granite, amber-backed glass, a cream
// back-lit dial (glow: self-lit at night) and red-brown brick paving.
export const PALETTES = {
  light: { granite: '#68675f', bronze: '#343a37', brass: '#a58a46', glass: '#76653d', glow: '#e4d9b0', brick: '#7c5649' },
  dark: { granite: '#3d3f42', bronze: '#1f2423', brass: '#6e5d31', glass: '#4a3f26', glow: '#f1d68c', brick: '#4a3a38' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the sidewalk of the flat Peregrine basemap; no absolute altitude. Gastown is nearly flat here.',
  attribution: 'Original procedural mesh. Placement from the OpenStreetMap clock position and the mapped street blocks © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Total height (about 5 m) and the four-face, pagoda-roof, five-whistle layout are published and photographed; the stage heights, the plinth width, the whistle diameters, the arched works windows and the bollard ring are estimated from photographs; the steam plume, the lamp post beside it, the chain sag and the lettering on the plaque are not modelled; the brick pad is a stylised patch of the mapped brick corner.',
};
