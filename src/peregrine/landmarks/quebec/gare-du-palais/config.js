// Gare du Palais, 450 rue de la Gare-du-Palais, Québec (Harry Edward Prindle for the Canadian Pacific Railway, 1915). Original procedural model;
// see docs/3d-quebec-gare-du-palais.md for sources, the dimension table and what is estimated. Contract: docs/3d-quebec-landmarks.md.
// Origin: area centroid of the mapped station outline (OSM way 33893247). Nothing is rotated by the layer: the main block's grid
// (68 deg east of north, facade looking south-south-east over the forecourt) and the wings' grid (7 deg off it the other way) are baked in the geometry.
import { FOOTPRINTS } from './footprint.js';

// Full 3D world (ADR-0045): the Lower Town site is nearly flat. The public DEM (Terrarium z15, 10 m grid) gives 5.6 to 7.1 m under the station
// (6.0 m along the tracks side, 7.0 m on the forecourt, a 1.5 m rise south over the whole block) and 4.9 to 5.0 m 50 m to the north-east. That is under
// the 2 m rule, but the default 56 m disc takes the LOWEST sample under it (4.9 m) and would cut the forecourt, which is 2 m higher, into a pit in front
// of the doors. The pad is therefore the station outline held at the median DEM of its own outline (about 6.1 m, local y = 0), short feather:
// the model stands within about 1 m of the real ground everywhere, and the plaza keeps its level.
const TERRAIN_PAD = { rings: [FOOTPRINTS[0]], refs: FOOTPRINTS[0], datum: 'median', featherM: 6 };

export const SPEC = {
  id: 'gare-du-palais', name: 'Gare du Palais', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-04)
  origin: [-71.2139626, 46.81756],
  height: 20.4, // m above the forecourt: finial on the central hall roof (its flat top at 19.4 m; estimated from the photographs, the ticket lobby is 18.3 m clear inside)
  padM: 60, // unused while terrainPad is set
  frontageBearing: 157, // the main facade (clock, glass wall, entrance canopy) looks south-south-east over the forecourt
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
};

export const PALETTES = {
  light: {
    brick: '#9b7548', stone: '#d3cebf', copper: '#5f9784', glass: '#3f5660', glow: '#3f5660', metal: '#59635f', sign: '#e8e3d2',
  },
  dark: {
    brick: '#5e4932', stone: '#878a8c', copper: '#3f6757', glass: '#1c262d', glow: '#ffcf86', metal: '#3b4140', sign: '#ffe0a0',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the forecourt level in front of the entrance, about 6 to 7 m above sea level (public DEM 5.6 to 7.1 m under the station); the Lower Town, the tracks and the plaza are not modelled. Full 3D world uses an explicit terrain pad (terrainPad): the station outline held at the median DEM of its outline with a 6 m feather.',
  attribution: 'Original procedural mesh. Mapped outline and building-part footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped outline and the three building:part footprints (north wing, west wing, main block, with their 2 and 4 levels); the 1915 date and architect. Estimated from photographs: every height, the roof profiles, the clock, towers, glass wall and canopy, dormers, windows and chimneys. The forecourt, fountain and street furniture are not modelled.',
};
