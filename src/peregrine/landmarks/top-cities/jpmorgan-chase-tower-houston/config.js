// Pei Cobb Freed: pale gray granite, cut west corner, 75 storeys; roof 305.4 m.
export const SPEC = {
  id: 'jpmorgan-chase-tower-houston', name: 'JPMorgan Chase Tower', kind: 'building',
  ready: true,
  origin: [-95.3640051633, 29.7603990667], // area centroid of OSM way 44130644
  height: 305.4, padM: 43, frontageBearing: 259.1554,
};
export const DESIGN = { lobby: 12, topFloor: 296.8, rows: 74, roof: 305.4, windowHeight: 2.65 };
export const PALETTES = {
  light: { granite: '#96999b', glass: '#293844', glow: '#2d3b46', roof: '#62696c' },
  dark: { granite: '#444d56', glass: '#17242e', glow: '#b6a47b', roof: '#343e48' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid base, no absolute altitude or terrain baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '305.4 m roof and 75 storeys are sourced; the mapped eight-vertex envelope retains five main faces and three narrow corner bevels. Window pitch, granite grid, lobby glazing, roof finish and occupied-window pattern are photographic estimates. West cut facade follows the mapped 34 m span rather than rescaling to the architect’s 85-foot clear internal span. Plaza, art and Chase Center are outside ownership. Cityscape and Full 3D world not tested; integration checked separately.',
};
