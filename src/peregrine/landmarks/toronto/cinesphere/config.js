// Cinesphere and the Ontario Place pods (955 Lake Shore Blvd W). See docs/3d-toronto-cinesphere.md.
// Origin is the centre of the mapped envelope (sphere + pods + the 216 m spine), so the terrain pad and the
// distance checks cover the whole complex rather than the dome alone. Model frame: +X east, +Y up, +Z south;
// y = 0 is lake level on the flat map, nothing bakes terrain, sea level or latitude stretch.
export const SPEC = {
  id: 'cinesphere', name: 'Cinesphere and Ontario Place pods', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-79.41787, 43.62867],
  height: 32, padM: 155, frontageBearing: 121,
};
export const PALETTES = {
  light: {
    panel: '#e9e8e2', frame: '#c6cac9', white: '#efefeb', glass: '#7fa3af', concrete: '#b9b8b0',
    deck: '#7a8086', cable: '#88909a', glow: '#f4ecd2',
  },
  dark: {
    panel: '#a4a9ad', frame: '#6c777e', white: '#a9aeb2', glass: '#3c5561', concrete: '#737b82',
    deck: '#4d555c', cable: '#59636b', glow: '#ffd88c',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is lake level on the flat Peregrine basemap; no absolute altitude, no terrain, no latitude stretch baked in.',
  attribution: 'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sphere radius, pod plan and heights follow OSM and published figures; frame frequency, cut height, pod facade and the walkway trusses are estimated from photographs. See docs/3d-toronto-cinesphere.md.',
};
