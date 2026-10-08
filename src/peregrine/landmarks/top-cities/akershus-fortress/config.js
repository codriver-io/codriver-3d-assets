// Akershus Fortress (Akershus slott), Akershusstranda, Oslo.
// The Renaissance castle and the inner rampart. See docs/3d-top-cities-akershus-fortress.md.
import { FOOTPRINTS } from './footprint.js';

// The headland drops from the fortress plateau to Akershusstranda and the fjord. A disc pad would
// take that low sample and sink the castle. The pad holds every mapped part at the median of the
// podium outline (local y = 0) and feathers 8 m, short of the harbour road.
const TERRAIN_PAD = { rings: FOOTPRINTS, refs: FOOTPRINTS[0], datum: 'median', featherM: 8 };

export const SPEC = {
  id: 'akershus-fortress', name: 'Akershus Fortress', kind: 'building',
  ready: true,
  origin: [10.73611, 59.90667],
  height: 36, // m, OSM spire tops on Blåtårnet and Romerikstårnet (ways 904553012 and 904552993)
  padM: 120, // furthest mapped part (Munks tårn) is about 100 m from the origin
  frontageBearing: 270, // the long harbour facade faces west, toward Pipervika
  terrainPad: TERRAIN_PAD,
};

export const PALETTES = {
  light: {
    // Grey rubble for the bastion and the wing bases. Warm pink-tan render for the
    // Renaissance walls (the harbour photographs), with paler trim on quoins.
    stone: '#8b8880', render: '#c48470', brick: '#8d5340', slate: '#3a414c', copper: '#3f6e58',
    glass: '#2a343c', glow: '#2a343c', trim: '#f3eee4', iron: '#2b3034',
  },
  dark: {
    stone: '#56534e', render: '#7a5246', brick: '#5a3428', slate: '#22272d', copper: '#243f34',
    glass: '#151c22', glow: '#e4c07a', trim: '#b5a898', iron: '#1a1e22',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the inner-fortress plateau on the flat Peregrine basemap. The rocky drop to Akershusstranda and the fjord is not modelled. Full 3D world uses terrainPad: every mapped part is held at the median of the castle podium, with an 8 m feather.',
  attribution: 'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Spire tips stay at the OpenStreetMap 36 m tags. Wing eaves are lower than the part height tags so the harbour elevation reads as three storeys with the spires clear of the roofs; those tags are mapper estimates. Renaissance walls are warm pink-tan render with darker brick crow-step gables (near only) and pale quoins. The bastion is grey rubble, thickened on the mapped rings; the 15–20 m drop from the plateau to the quay is terrain, not mesh. Wing roofs are dark slate. Copper is the two stair-tower caps, the mausoleum and Vågehalstårnet. Munks tårn keeps its mapped pyramidal roof.',
};
