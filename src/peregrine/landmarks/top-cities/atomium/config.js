// Post-2006 stainless steel Atomium; dimensions: atomium.be/the_atomium_in_figures.
export const SPEC = {
  id: 'atomium', name: 'Atomium', kind: 'building', ready: true,
  origin: [4.34151995, 50.894925], height: 102, padM: 54,
  frontageBearing: 181.02, sphereDiameter: 18, cubeEdge: 47, tubeDiameter: 3.3,
};
// Two mapped controls: central axis and western lower sphere (ball_1).
export const LOWER_AZIMUTH = Math.atan2((50.894925-50.8949186)*111320,(4.34095415-4.34151995)*111320*Math.cos(50.894925*Math.PI/180));
export const PALETTES = {
  light: { steel:'#b9c3ca', tube:'#c8cbca', glass:'#354b58', support:'#afb3b1', concrete:'#a5a7a3', glow:'#d8dcce' },
  dark: { steel:'#788b9e', tube:'#7b8995', glass:'#263b4d', support:'#657581', concrete:'#566570', glow:'#f4dfa1' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid flat grade y=0; no DEM, sea level or latitude stretch baked into the mesh.',
  attribution: 'Original procedural model for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Nine 18 m spheres, a regular 47 m body-centred cube standing on one corner, twenty 3.3 m tubes; supports, windows and pavilion height are photo estimates. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
