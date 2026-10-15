// Modern Peter Hemingway conservatory; mapped plan in local east/up/south metres.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'muttart-conservatory', name: 'Muttart Conservatory', kind: 'building',
  ready: true, origin: [-113.47729, 53.53521], height: 24, padM: 60,
  frontageBearing: 225,
  terrainPad: { rings: [FOOTPRINTS[0]], refs: [[-113.47729,53.53521]], datum: 'median', featherM: 8 },
};
export const PALETTES = {
  light: { concrete: '#a9aca7', frame: '#d8dfdf', glass: '#adc6ce', glassShade: '#a4bfc8', vent: '#b5bfc1', roof: '#627950' },
  dark: { concrete: '#596571', frame: '#829295', glass: '#4d6976', glassShade: '#46626e', vent: '#67757b', roof: '#3f4c46' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid foundation y=0; no terrain or absolute altitude baked in.',
  attribution: 'Original procedural mesh for Codriver. Mapped plan © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Four mapped square glass pyramids, 24/18 m tops, linked low base and fifth foyer skylight. Glass bases 26/19.5 m (published nominal dimensions); larger mapped envelopes form concrete perimeter curbs. Glazing grid, vent bands and base heights estimated from photographs. Pale glazing is intentionally opaque for the shared app shader. Cityscape and Full 3D world appearance checked in g8b scratch captures; lifecycle and device performance not tested.',
};
