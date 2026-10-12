// People's Salvation Cathedral, Bucharest, Romania.
// STUB: the landmark's builder replaces this file. Contract: docs/3d-top-cities-landmarks.md.
export const SPEC = {
  id: 'peoples-salvation-cathedral', name: "People's Salvation Cathedral", kind: 'building',
  ready: false, // true only once near/far GLBs are exported, verified and catalogued
  origin: [26.08226, 44.42591], // approximate; the builder sets it from the mapped footprint/alignment
  height: 127, // m to the highest point, approximate
  padM: 60,
  frontageBearing: 0,
};
export const PALETTES = { light: { stone: '#c9c3b3' }, dark: { stone: '#7a8088' } };
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Stub: not yet authored.',
};
