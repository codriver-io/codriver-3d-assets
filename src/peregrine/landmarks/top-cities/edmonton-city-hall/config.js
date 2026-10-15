// Gene Dub / Dub Architects, 1992; mapped footprint and 60.96 m tower from OSM.
// The main pyramid is 43 m above grade, NOT 62 m (dossier stub conflated heights).
export const SPEC = {
  id: 'edmonton-city-hall', name: 'Edmonton City Hall', kind: 'building', ready: true,
  origin: [-113.49014, 53.54556], height: 60.96, padM: 88, frontageBearing: 174,
  rotationDeg: 6,
};
export const PALETTES = {
  light: { tower: '#c7b28a', stone: '#b9b5a5', trim: '#d3cdbb', glass: '#3e6277', roof: '#7b817e', metal: '#c0c2b4', clock: '#49776a' },
  dark: { tower: '#70634d', stone: '#515c63', trim: '#76828a', glass: '#294d66', roof: '#39454f', metal: '#8e9b9b', clock: '#598d7b' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local flat grade y=0; no absolute elevation or terrain baked into the model.',
  attribution: 'Original procedural geometry; mapped footprint © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
  note: '1992 City Hall: 43 m main glass pyramid, smaller council pyramid and 60.96 m Friendship Tower. Roof pitches, lattice, facade rhythm and belfry dimensions estimated from photos; exact mapped plan and orientation. Static Cityscape and Full 3D world views verified; terrain lifecycle and rollout checked separately.',
};
