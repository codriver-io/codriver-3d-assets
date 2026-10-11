// Present, restored courthouse; the historic tower is not part of this version.
export const SPEC = {
  id: 'old-orange-county-courthouse', name: 'Old Orange County Courthouse', kind: 'building',
  ready: true,
  origin: [-117.8691702, 33.75021915],
  height: 23.29, padM: 29,
  frontageBearing: 180.45, rotationDeg: -0.45,
  eaveM: 15.6, graniteM: 2.7,
};
export const PALETTES = {
  light: { sandstone: '#a86a49', ashlar: '#b47853', trim: '#bc845e', granite: '#b7b6a3', roof: '#b94e32', glass: '#435354', wood: '#433629', iron: '#77796f', glow: '#697975' },
  dark: { sandstone: '#604b41', ashlar: '#6a5144', trim: '#7c6050', granite: '#70777a', roof: '#68413a', glass: '#283d49', wood: '#34373b', iron: '#677682', glow: '#bf9d65' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; granite basement starts at grade. No altitude or terrain stretch baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright. Reference photographs are not included.',
  note: 'Present restored 1901 courthouse, without former tower. OSM way 228740921 supplies the outline and 0.45-degree grid skew; heights, roof pitch, window sizes and rear facade are estimated from photographs. Three recessed entry arches, granite stairs, five-window central arcade, hip roofs, gables, dormers and ashlar are modelled. Night window lighting is illustrative. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
