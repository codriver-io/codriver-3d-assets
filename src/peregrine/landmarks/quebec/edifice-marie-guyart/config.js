// Édifice Marie-Guyart ("Complexe G"), 675 boulevard René-Lévesque Est, Québec: the 132 m brutalist office tower (Édouard Fiset with
// Gauthier, Guité, Roy, Fiset et Deschamps, 1967-72) and the low government complex it rises from. See docs/3d-quebec-edifice-marie-guyart.md.
// Origin: the area centroid of the tower's mapped outline (OSM way 27372377). The tower grid runs 60.7 degrees east of north and the base grid
// 60.1 degrees (fitted to the mapped edges); the mapped rings already carry both, so nothing is rotated by the layer.
import { FOOTPRINTS } from './footprint.js';

// Full 3D world (ADR-0045): the complex stands on the Colline Parlementaire. The public Terrarium DEM (zoom 15, 5 m samples inside the mapped rings) gives
// 89.8 to 91.2 m under the tower (median 90.0) and 87 to 93 m under the whole base (median 90.0, 10th to 90th percentile 89 to 92 m), but the ground
// falls to 82 m 110 m north of the tower and to 79 m inside the 130 m disc that would be needed to cover the wings: the default disc takes the LOWEST
// sample and would sink the whole complex by 8 to 11 m. The explicit pad holds the tower outline and the base outline at the median DEM of the
// tower outline (local y = 0) with a 10 m feather; nothing outside is flattened.
const TERRAIN_PAD = { rings: [FOOTPRINTS[0], FOOTPRINTS[1]], refs: FOOTPRINTS[0], datum: 'median', featherM: 10 };

export const SPEC = {
  id: 'edifice-marie-guyart', name: 'Édifice Marie-Guyart', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-04)
  origin: [-71.217564, 46.808054],
  height: 177, // m to the tip of the roof mast (fr.wikipedia infobox: roof 132 m, spire 177 m)
  padM: 140, // unused while terrainPad is set; covers the farthest base corner (138 m)
  frontageBearing: 330.7, // the entrance face on boulevard René-Lévesque looks north-north-west
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
};

// Sunlit colour of each material (the runtime layer shades every face from its normal). The precast concrete is a grey-taupe in every photograph
// (linear about 0.30 / 0.27 / 0.22), not the cream it was first drawn in. `glow` is the share of windows lit at night:
// dark glass by day, warm office light after dark.
export const PALETTES = {
  light: { concrete: '#958e81', glass: '#2c3742', glow: '#2c3742', roof: '#8d8e8a', metal: '#7a8085' },
  dark: { concrete: '#555049', glass: '#1a222b', glow: '#ffcf86', roof: '#4d4f50', metal: '#555b60' },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the plaza level at the foot of the tower, about 90 m above sea level in the public DEM (the ground varies by about 3 m under the complex and falls to the north); stairs, ramps, the plaza and below-grade levels are not modelled. Full 3D world uses an explicit terrain pad (terrainPad): the tower and base outlines are held at the median DEM of the tower outline with a 10 m feather.',
  attribution: 'Original procedural mesh. Mapped outlines and building-part footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped plan of the tower (42 m by 47 m) and of the base wings and cores, the 132 m roof and 31 levels (OSM, Wikipedia), the 177 m mast tip (fr.wikipedia infobox), the 4 and 5 levels of the base parts. Estimated from photographs: the 4.2 m storey pitch, the window and pier proportions, which faces carry the punched-window grid and which the narrow-slot grid, the corner piers and crown, the rooftop plant, the mast lattice, the base facades and all heights of the base.',
};
