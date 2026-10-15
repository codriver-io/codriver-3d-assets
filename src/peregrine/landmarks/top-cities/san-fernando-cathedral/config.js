// San Fernando Cathedral, San Antonio: 1868 Gothic Revival twin-tower front (Giraud) on the 1738-55 church.
// Heights are photo estimates scaled from door and passer-by heights, not surveyed. Contract: docs/3d-top-cities-landmarks.md.
export const SPEC = {
  id: 'san-fernando-cathedral', name: "San Fernando Cathedral", kind: 'building',
  ready: true,
  origin: [-98.49432, 29.42456], // mapped cathedral outline centroid
  height: 25.7, // m to the tower crosses
  padM: 45,
  frontageBearing: 94.5, // east front onto Main Plaza, outward normal
};
export const PALETTES = {
  light: { stone: '#cbbc9f', trim: '#d9cdb5', roof: '#5d5b57', dark: '#46474a', wood: '#4b3b2d', iron: '#2c2c2b', dome: '#a2a196', joint: '#b5a78a' },
  dark: { stone: '#7c7968', trim: '#8b8674', roof: '#3b3e41', dark: '#2a323a', wood: '#2e2822', iron: '#1c1d1f', dome: '#686b6a', joint: '#6a6757' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'East front onto Main Plaza (94.5° outward, baked in) with twin belfry towers, pinnacled centre gable and rose window, three pointed portals; nave, aisles and the low sanctuary dome of the 1738 church at the west end, on the mapped stepped west block. Plan from OSM way 80647022; the model stays within 0.8 m of it (buttresses and eaves). All heights, openings and the dome are photo estimates, not a survey. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
