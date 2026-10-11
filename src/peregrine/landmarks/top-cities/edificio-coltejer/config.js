// Edificio Coltejer (Centro Coltejer), Avenida La Playa #47-42, Medellín.
// Office tower, 1968–1972, Raúl Fajardo Moreno with Esguerra Sáenz y Samper, Vélez and
// Jorge Manjarrés. Height 175 m to the concrete ridge. See docs/3d-top-cities-edificio-coltejer.md.
import { APEX_Y, ORIGIN } from './edificio-coltejer-parts.js';

export const SPEC = {
  id: 'edificio-coltejer',
  name: 'Edificio Coltejer',
  kind: 'building',
  ready: true,
  origin: ORIGIN,
  height: APEX_Y, // m, concrete ridge (the published cima). Flagpoles continue to 183.
  padM: 50, // the ring reaches ~32 m; El Centro's block is valley floor, no terrainPad
  // Outward bearing of the south-south-west finned face (the long wall opposite the annex).
  frontageBearing: 210,
};

// `end` is the blank gable walls (they read white). `concrete` is the beige fin grid.
// `glow` is a lit office pane. `light` is the needle's eye: a dark slot by day, warm at night.
export const PALETTES = {
  light: {
    concrete: '#b5afa2',
    end: '#f6f3ec',
    glass: '#3c4852',
    glow: '#7e97a8',
    light: '#1c2830',
    metal: '#9aa1a6',
  },
  dark: {
    concrete: '#6e6a63',
    end: '#b4b1a8',
    glass: '#161d24',
    glow: '#f0c48a',
    light: '#e7b56a',
    metal: '#5e656b',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The ground floor is y=0.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '175 m ridge, 36/37 floors and the east-west eye on floor 34 are published. The eave at 143.2 m, the 4.5% shaft taper, bay spacing, the annex height and which long face fronts La Playa are estimated from the mapped outline and photographs.',
};
