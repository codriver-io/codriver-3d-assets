// Fountain Place (Henry N. Cobb / Pei Cobb Freed & Partners, 1986), Dallas.
export const SPEC = {
  id: 'fountain-place', name: 'Fountain Place', kind: 'building', ready: true,
  origin: [-96.802544, 32.784797], height: 219.5, padM: 48,
  frontageBearing: 135, halfWidth: 29.35, halfDepth: 31.25,
  shoulderM: 160, lowFacetM: 46, arcadeM: 18.288,
};
export const PALETTES = {
  // Office panes share glass shading by day. The reserved `light` name bypasses
  // normals in the app and would recreate bright scattered daytime patches.
  light: { glass: '#376f6a', facet: '#3a726d', mullion: '#57857c', office: '#376f6a' },
  dark: { glass: '#122c30', facet: '#183a3c', mullion: '#244443', office: '#8eac8c' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local lobby grade y=0; no DEM, altitude or Mercator stretch baked in.',
  attribution: 'Original procedural geometry. Footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '219.5 m height published; 18.288 m base carving published by architect. Mapped 59 x 63 m envelope and 135-degree edge bearing. Crown and long wing facets fitted to OSM roof parts and Commons photographs; panel modules and base bevels estimated. Garden, AMLI tower and garage excluded. Rotation baked once.',
};
