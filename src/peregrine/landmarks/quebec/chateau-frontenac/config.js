// Fairmont Le Château Frontenac, 1 rue des Carrières, Vieux-Québec. See docs/3d-quebec-chateau-frontenac.md.
// Origin: area centroid of the outer ring of the hotel relation (OSM relation 32580, outer way 27072105).
// The hotel's own grid runs 63.4 deg east of north along the terrace facade (the mapped north wing and the central tower block
// give 62.9 and 63.7 deg); the mapped rings already carry it, so nothing is rotated.
import { FOOTPRINTS } from './footprint.js';

// Full 3D world (ADR-0045): the hotel stands on the Cap Diamant promontory. The public DEM under its footprint rises about 10 m from the
// Place d'Armes end to the south-west wing and falls about 5 m beyond the east wall, then drops off the cliff to the lower town 40 to
// 50 m further east and south-east. The default 90 m disc would reach that edge, take its lowest sample and sink the hotel. The explicit pad is
// the hotel outline held at the median DEM of its own outline (the Dufferin Terrace level, local y = 0) with a short 8 m feather:
// the terrace in front of the south-east facade is about 20 m wide, so the pad stops well short of the cliff face and never touches it.
const TERRAIN_PAD = { rings: [FOOTPRINTS[0]], refs: FOOTPRINTS[0], datum: 'median', featherM: 8 };

export const SPEC = {
  id: 'chateau-frontenac', name: 'Château Frontenac', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-03)
  origin: [-71.2054215, 46.8118448],
  height: 80, // m above the terrace: tower finials (infobox: about 80 m, 18 storeys at the tower)
  padM: 90, // unused while terrainPad is set
  frontageBearing: 153.5, // the long terrace facade looks south-east, toward the river
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
};

// Copper and slate follow the photographs: the wing roofs are a dark teal-green (about linear 0.06 / 0.14 / 0.11, not a pastel sage) and the
// tower's roof is near-black slate (about linear 0.03).
export const PALETTES = {
  light: {
    brick: '#9b5f4a', stone: '#b7b2a6', copper: '#45695d', slate: '#2f3133',
    glass: '#46535c', glow: '#46535c', metal: '#6c716f',
  },
  dark: {
    brick: '#6a4a41', stone: '#7a7d80', copper: '#2e473f', slate: '#1d1f21',
    glass: '#1f2830', glow: '#ffcf86', metal: '#4b5050',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the Dufferin Terrace level at the foot of the south-east facade, roughly 55 to 65 m above sea level (Wikipedia gives a 54 m ground elevation, the public DEM 59 to 64 m under the hotel); the cliff, the terrace and the lower town are not modelled. Full 3D world uses an explicit terrain pad (terrainPad): the hotel outline is held at the median DEM of its outline with an 8 m feather, which stops on the terrace well before the cliff face.',
  attribution: 'Original procedural mesh. Mapped outline and building-part footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped outline of the whole complex and the building:part footprints and storey counts (tower 14, wings 5 and 6); the published height of about 80 m and 18 storeys at the tower. Estimated from photographs: floor heights, roof pitches, the roofs of the unmapped wings, dormer, turret and chimney positions, window rhythm, the porte-cochère, and every ornament.',
};
