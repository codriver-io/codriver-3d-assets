import { TERRAIN_PAD } from './mercedes-benz-stadium-pad.js';

// Hold the surrounding TIN nodes as well as the walls at the rigid datum: the pad ring (walls, near-lattice
// halo and far-TIN support nodes) and the five interior datum references are precomputed in
// mercedes-benz-stadium-pad.js, so this generator imports no runtime terrain code.
const refs = TERRAIN_PAD.refs;
export const FOUNDATION_RING = TERRAIN_PAD.rings[0];

export const SPEC = {
  id: 'mercedes-benz-stadium', name: 'Mercedes-Benz Stadium', kind: 'building',
  ready: true,
  origin: [-84.4008481722, 33.7554148380],
  height: 93, padM: 170, frontageBearing: 92,
  terrainPad: {
    datum: 'median', featherM: 18,
    rings: [FOUNDATION_RING],
    refs,
  },
};
export const PALETTES = {
  light: { silver:'#bfc4c6', roof:'#a0b2b8', glass:'#476170', frame:'#61747c', dark:'#343b40', seating:'#723338', turf:'#456b46', glow:'#8096a0' },
  dark: { silver:'#77858f', roof:'#9caeb5', glass:'#243e50', frame:'#6c7e8a', dark:'#202d37', seating:'#4c2933', turf:'#304c3e', glow:'#c5d4d6' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid stadium base at local flat grade y=0; world placement uses the median of five interior DEM references, a surrounding near-lattice-node halo and the coarser far-TIN support nodes used during terrain arrival. No DEM, absolute altitude or Mercator stretch baked in.',
  attribution: 'Original procedural geometry by Codriver, CC BY 4.0. Geographic outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '2017 stadium with eight triangular ETFE blades and strong diagonal pinwheel seams in an estimated static mid-travel aperture state. OSM height 93 m and exact mapped envelope; unequal facade wing heights/projections, recessed nine-metre glazed concourse, petal pose, interior bowl, halo and panel spacing estimated from reference photographs. Georgia Dome and pedestrian bridge excluded. Floor clipped to the concourse walls; median terrain pad covers surrounding near and coarse TIN nodes. Post-fix Cityscape and Full 3D world app recapture and independent review pending.',
};
