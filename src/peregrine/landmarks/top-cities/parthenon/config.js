import { FOOTPRINTS } from './footprint.js';
// Temple only; the Acropolis rock belongs to the application's terrain.
export const SPEC = {
  id: 'parthenon', name: 'Parthenon (Acropolis)', kind: 'building', ready: true,
  origin: [23.72661765, 37.97150335], height: 18.05, padM: 39,
  frontageBearing: 77.01080318038069, rotation: 0.22670425169193295,
  stylobateLength: 69.5, stylobateWidth: 30.88, columnHeight: 10.43,
  columnDiameter: 1.905, platformY: 1.8,
  // A median on the hilltop, never a lowest-sample disc extending down the cliff.
  terrainPad: { rings: FOOTPRINTS, refs: [[23.72630,37.97155],[23.72661,37.97150],[23.72694,37.97146]], datum: 'median', featherM: 3 },
};
export const PALETTES = {
  light: { marble: '#cbbb9f' },
  dark: { marble: '#877f6d' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 at the bottom of the temple crepidoma on the hilltop; no absolute altitude or DEM baked into the rigid temple.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '69.5 × 30.88m stylobate and 10.43m Doric columns; mapped bearing baked once. Contemporary roofless ruin, not an intact ancient reconstruction. Ruin edges, cella remnants and inner porch restoration heights are approximate; temporary cranes, scaffolding, visitor rails and the Acropolis hill are omitted. App terrain footing is checked separately.',
};
