// Palacio Real de Madrid, Calle de Bailén / Plaza de la Armería, Madrid.
// Original procedural model. Sources, the dimension table and what is estimated:
// docs/3d-top-cities-palacio-real-de-madrid.md. Contract: docs/3d-top-cities-landmarks.md.
//
// Origin is the centre of the main block's mapped extremes (relation 30399), not the
// centroid of the whole multipolygon: the south galleries pull that centroid into the
// Plaza de la Armería. Rotation is baked (walls 4.7° off north). y = 0 is the plaza
// grade of the platform, not the Campo del Moro gardens below the west bluff.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'palacio-real-de-madrid',
  name: 'Palacio Real de Madrid',
  kind: 'building',
  ready: true,
  origin: [-3.714234605, 40.418469883],
  height: 47.6, // m to the chapel lantern; the Prince's Gate crown is 40.4 and the balustrade is 33.2
  padM: 230, // unused while terrainPad is set; the south galleries end ~210 m south of the origin
  frontageBearing: 184.7, // the Plaza de la Armería front looks 4.7° west of south
  terrainPad: { rings: [FOOTPRINTS[0]], datum: 'median', featherM: 14 },
};

// Light: white Colmenar limestone above a grey granite base, paler trim for the
// cornice, balustrade and the king statues, grey metal roofs. The piano nobile is
// `glow` (pale glass by day, warm at night). Dark is the night grade of the same keys.
export const PALETTES = {
  light: {
    stone: '#e4ddd0',
    granite: '#8d887f',
    trim: '#f3f0e6',
    roof: '#6d757d',
    glass: '#3c4a52',
    glow: '#c3d2da',
  },
  dark: {
    stone: '#7e7a72',
    granite: '#524e48',
    trim: '#a39e94',
    roof: '#3a4248',
    glass: '#1a2228',
    glow: '#f0c48a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the palace platform (Plaza de la Armería and Plaza de Oriente). The west front stands on the bluff above the Campo del Moro; that drop is not modelled. Full 3D world holds the outer ring at its median DEM (terrainPad) so a coarse sample on the lip does not sink the platform.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: Sacchetti\'s square palace (1738-64) on Juvarra\'s facade idea, granite and Colmenar stone, 33 m facades, about 131 m sides, six levels, central courtyard, balustrade with royal statues, Prince\'s Gate on the Plaza de la Armería, Royal Chapel dome on the north range. Estimated: every storey height except the 33 m balustrade, bay sizes, the crown, the chapel lantern (47.6 m), the wing heights and the roof pitches. The cathedral, the plaza statues and the gardens are not modelled.',
};
