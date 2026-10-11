// Palace of the Parliament (Palatul Parlamentului), Strada Izvor 2-4, Bucharest.
// Anca Petrescu, 1984–1997. Original procedural model; see docs/3d-top-cities-palace-of-the-parliament.md.
//
// Origin is the area centroid of OSM relation 2230391's outer ring (way 14325732), fetched 2026-10-05.
// The ceremonial front faces Bulevardul Unirii and Piața Constituției, almost due east. Rotation is baked
// once in geometry.js (plan.js ANGLE). y = 0 is the terrace the walls stand on, at the top of Dealul Spirii.
//
// Full 3D world: the palace sits on the levelled Arsenal hill, and the gardens in front terrace down to the
// boulevard. terrainPad holds the outline at the median sample so the default disc cannot sink the downhill
// lip. Cityscape is flat and ignores the pad. No DEM was sampled in this pass.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'palace-of-the-parliament',
  name: 'Palace of the Parliament',
  kind: 'building',
  ready: true,
  origin: [26.08735814, 44.42747051],
  height: 89.5, // flagpole tip. Stone parapet of the central block is the published 84 m.
  padM: 210, // farthest corner of the outer ring is about 194 m; unused while terrainPad is set
  frontageBearing: 93.3, // the Unirii front looks east, a few degrees south of east
  nearM: 800,
  rangeM: 2500,
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 18 },
};

// Pale Romanian limestone. `glow` is cool glass by day and warm lit windows at night (unshaded).
// `sign` / flagY / flagR are the Romanian tricolour on the roof flag (blue at the hoist).
export const PALETTES = {
  light: {
    stone: '#e4d9c4',
    trim: '#f3eee4',
    stoneDark: '#c9bba4',
    glass: '#5c707a',
    glow: '#8fa3ad',
    void: '#2c2824',
    iron: '#3c3a36',
    sign: '#002B7F',
    flagY: '#FCD116',
    flagR: '#CE1126',
  },
  dark: {
    stone: '#847c70',
    trim: '#9c9488',
    stoneDark: '#5a534b',
    glass: '#182228',
    glow: '#f0c98a',
    void: '#100e0c',
    iron: '#262420',
    sign: '#1a3f86',
    flagY: '#e0b010',
    flagR: '#b01020',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the terrace at the foot of the walls on Dealul Spirii (Dealul Arsenalului). The civic gardens step down toward Bulevardul Unirii and are not part of the model. No absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: outer ring of relation 2230391, architectural height 84 m, plan about 270 m by 240–245 m (Wikipedia), 12 floors, Anca Petrescu, limestone, east front to Unirii. OSM tags the central part 86 m and a broad middle part 58 m; the relation height 29 m is not used. The 58 m part anchors the first broad setback tier; a second tier reaches 66 m before the 84 m central crown. Estimated: bastion parapet 42.4 m, outer wings 48 m, setback envelopes and 66 m tier, storey heights, the 6.8 m recess, the giant-order bay, column size, cornice profile, courtyard openness, and the flagpole above 84 m.',
};
