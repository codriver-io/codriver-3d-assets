// Walterdale Bridge, Edmonton.
// STUB: the landmark's builder replaces this file. Contract: docs/3d-top-cities-landmarks.md.
export const SPEC = {
  id: 'walterdale-bridge', name: "Walterdale Bridge", kind: 'bridge',
  ready: false, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-113.50171, 53.52839], // approximate; the builder sets it from the mapped footprint/alignment
  height: 52, // m to the highest point, approximate
  padM: 60,
  frontageBearing: 0,
};
export const PALETTES = { light: { stone: '#c9c3b3' }, dark: { stone: '#7a8088' } };
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Stub: not yet authored.',
};
