// 30 St Mary Axe (the Gherkin), City of London. Foster + Partners, completed 2003, opened 2004.
// Height 180 m and 41 floors: Wikipedia, the building's own site, and OSM way 4959489 (height=180,
// building:levels=41, roof:shape=dome). The plan is the mapped circle: outline radius 28.4 m,
// base part 25.0 m, widest mapped band 28.3 m between 53.5 m and 70 m (about the 16th–17th floor).
// Diagrid count, spiral pitch, glass colours and the taper above 70 m are estimated; see
// docs/3d-top-cities-the-gherkin.md.
export const SPEC = {
  id: 'the-gherkin', name: '30 St Mary Axe (the Gherkin)', kind: 'building',
  ready: true,
  // Vertex mean of the mapped outline (way 4959489), a 36-gon. Area centroid is within 4 cm.
  origin: [-0.08033161, 51.51447498],
  height: 180, // m to the tip of the lens
  padM: 45,
  // Public approach is the south plaza toward Undershaft. The plan is circular, so this is not a wall normal.
  frontageBearing: 180,
  floors: 41,
  floorM: 4.15, // m, estimated: 41 floors into 180 m with the lens above the last office floor
  bays: 24, // diamonds around the circumference (estimated from photographs)
};

// Pale blue-grey glass, near-white diagrid, and the six dark light-well spirals. `glow` is lit
// office glass: a lighter pane by day, greenish-white interior light at night (unshaded).
export const PALETTES = {
  light: {
    glass: '#536e83', lens: '#637f94', well: '#1a2c3c', glow: '#72899b', steel: '#bbc7ce',
  },
  dark: {
    glass: '#3d5162', lens: '#6d8494', well: '#101820', glow: '#e3edd6', steel: '#b4c0c8',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The plaza is y=0; the diagrid feet stand on it. Basement levels are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height, floor count and the circular plan radii follow Wikipedia and OSM. The smooth taper above 70 m, 24-bay diagrid, the six light wells advancing about 0.85 bay per diamond course, mullions and the glass colours are estimated from photographs.',
};
