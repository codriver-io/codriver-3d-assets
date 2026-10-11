// Royal Palace, Oslo (Det kongelige slott), Slottsplassen 1.
// Original procedural model. Sources and the dimension table: docs/3d-top-cities-royal-palace-oslo.md.
//
// Origin is the area centroid of relation 12267199. Rotation is baked: the south front
// faces Karl Johans gate at bearing 120°. y = 0 is the leveled terrace the palace stands on,
// not the sloping avenue below the grass banks.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'royal-palace-oslo',
  name: 'Royal Palace, Oslo',
  kind: 'building',
  ready: true,
  origin: [10.72740248, 59.91714405],
  height: 36.5, // flagpole tip. The building's published highest point is 25 m; the pole is taller so the flag clears the pediment the way the south-front photograph shows.
  padM: 100,
  frontageBearing: 120,
  // Bellevue was graded under the palace; the park and Slottsplassen fall away within a few metres of the walls.
  terrainPad: { rings: [FOOTPRINTS[0]], datum: 'median', featherM: 16 },
};

// Light: warm beige stucco over a grey stone base, white trim, dark metal roof.
// `glow` is the piano nobile (dark glass by day, warm at night). `blue` is the
// flag's cross and is used on the near LOD only, so the far model stays at eight draws.
// Dark is the night grade.
export const PALETTES = {
  light: {
    stucco: '#d8c29c',
    granite: '#cfc8bc',
    trim: '#f7f4ee',
    roof: '#5c656c',
    glass: '#2a3640',
    glow: '#243038',
    iron: '#3c4248',
    flag: '#c8102e',
    blue: '#00205b',
  },
  dark: {
    stucco: '#8a7260',
    granite: '#6e685e',
    trim: '#a39e94',
    roof: '#343c42',
    glass: '#1a2228',
    glow: '#f0c48a',
    iron: '#2a3036',
    flag: '#7a3038',
    blue: '#16325c',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the palace terrace on Bellevue. The grass banks down to Slottsplassen and the park slopes are not modelled. Full 3D world holds the footprint at its median DEM (terrainPad) so a sample on the avenue does not sink the terrace.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: Linstow, 1825–1849, plastered brick on a cut-stone base, main wing 100.8 × 24.1 × 23 m, side wings 40.7 × 14.3 × 16 m, highest point of the building 25 m, hexastyle Ionic portico. Estimated: every storey height except the column band (OSM 8–19 m), bay widths, cornice projection, pediment apex 24.25 m. The flagpole is carried to 36.5 m so the Norwegian flag clears the pediment as in the south-front photograph. The Karl Johan statue, the stair and the guardhouses are not modelled.',
};
