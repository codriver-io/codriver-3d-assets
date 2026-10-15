// Casa Presei Libere (Casa Scînteii), Piața Presei Libere, Bucharest.
// Horia Maicu, with Nicolae Bădescu; engineer Panaite C. Mazilu. Built 1952–1957.
// Original procedural model; see docs/3d-top-cities-casa-presei-libere.md.
//
// Origin is the dossier anchor. The ceremonial front faces Șoseaua Kiseleff and the
// square, bearing 160.28°. Rotation is baked once in the kit (plan.js ANGLE).
// y = 0 is local flat grade. The old hippodrome is essentially level, so terrainPad
// holds the outline at the median sample. Cityscape stays flat and ignores the pad.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'casa-presei-libere',
  name: 'Casa Presei Libere',
  kind: 'building',
  ready: true,
  origin: [26.07121, 44.48093],
  height: 104, // spire shoulder 91.6 m plus the 12.4 m television antenna
  padM: 230, // farthest corner of the outer ring is about 213 m
  frontageBearing: 160.28,
  nearM: 900,
  rangeM: 2800,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 18 },
};

// Warm cream stone. `glow` is day glass and warm lit windows at night (unshaded).
export const PALETTES = {
  light: {
    stone: '#d2d0c7',
    base: '#b6b4aa',
    trim: '#f1eadb',
    glow: '#5e686c',
    metal: '#8a9094',
  },
  dark: {
    stone: '#828584',
    base: '#646a68',
    trim: '#acaea6',
    glow: '#e8c27a',
    metal: '#5c6368',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat ground of the old hippodrome at Piața Presei Libere. No absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: OSM relation 15922160 and its building parts, Wikipedia height 104 m (91.6 m to the spire shoulder plus a 12.4 m television antenna), foundation about 280 by 260 m, architects Horia Maicu and Nicolae Bădescu, 1952–1957. Estimated: storey pitch, cornice profile, portico, corner pinnacles above the mapped 57 m, and the wing-end tempiettos OSM flattens into the 24 m wings.',
};
