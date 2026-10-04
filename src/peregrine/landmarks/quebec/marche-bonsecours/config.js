// Marché Bonsecours, 350 rue Saint-Paul Est, Vieux-Montréal, Québec. William Footner, 1844-1847 (former City Hall and, in 1849, the
// Parliament of the Province of Canada). Original procedural model; see docs/3d-quebec-marche-bonsecours.md for sources, the dimension
// table and what is estimated. Contract: docs/3d-quebec-landmarks.md.
import { FOOTPRINTS } from './footprint.js';

// Full 3D world (ADR-0045): the public DEM (Terrarium z12-z15, identical at the three zooms) falls about 2 to 2.7 m across the block, from
// about 20.0 to 20.2 m at the Saint-Paul wall to about 17.5 to 18.0 m at the river wall (13 m either side of the origin) and on to about
// 15 m at the Old Port, with only about 1 m of change along the 164 m length. The default 60 m disc takes the LOWEST sample under it (the Old Port side, about 15 m)
// and would leave the Saint-Paul front on a 5 m wall of fill; the explicit pad is the outline held at the median DEM of its own
// vertices (the mid-slope, local y = 0) with a short feather: the street sits right at the wall on both sides, so the blend must not
// reach the next building. The model carries the remaining +-1.4 m itself: a 1.7 m stone plinth under the Saint-Paul front and portico,
// and the same plinth with basement arches on the river side.
const TERRAIN_PAD = { rings: [FOOTPRINTS[0]], refs: FOOTPRINTS[0], datum: 'median', featherM: 6 };

export const SPEC = {
  id: 'marche-bonsecours', name: 'Marché Bonsecours', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-04)
  // Anchor: the area centroid of the mapped outline (OSM way 87389029); it lies on the long axis halfway between the two end
  // pavilions and 0.3 m from the centre line between the Saint-Paul and de la Commune walls.
  origin: [-73.55151, 45.50894],
  // Highest point: the thin mast above the lantern. No published total height. Estimated from photographs: the central block's cornice is
  // at 18.8 m and the drum, dome, lantern and mast rise about 30.6 m above it, which is the popular "100-foot dome" (30.5 m).
  height: 49.4,
  padM: 60, // unused while terrainPad is set
  // Bearing the Saint-Paul front (the portico) faces: west-north-west, 270 + 18.2.
  frontageBearing: 288.2,
  // Bearing of the long axis, +u toward the north-north-east end (rue Bonsecours side), from the long edges of the OSM outline
  // (17.7 to 18.6 deg over every edge longer than 9 m; length-weighted 18.2).
  axisBearing: 18.2,
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
};

// Same keys in light and dark. Dark is the night look: dimmer stone, warm lit windows, the lantern lit; the dome keeps its tin colour
// (the real dome is floodlit in changing colours; not modelled). `glow` and `lamp` are drawn unshaded by the layer.
export const PALETTES = {
  light: {
    stone: '#9c9fa0', base: '#878a8b', pale: '#d9d5c9', roof: '#6b7682', tin: '#a9b3be',
    glass: '#3f4c56', glow: '#56707e', metal: '#3a3f43', lamp: '#2c3236',
  },
  dark: {
    stone: '#5d6068', base: '#4b4e54', pale: '#8e9095', roof: '#39414b', tin: '#7a879a',
    glass: '#1f2830', glow: '#ffd08a', metal: '#24282c', lamp: '#ffdca0',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the mid-slope grade of the block on the flat Peregrine basemap (the DEM falls about 2 to 2.7 m from rue Saint-Paul to the de la Commune wall); no absolute altitude (about 17 to 20 m above sea level), no relief, no Mercator scale. The Saint-Paul front stands on a 1.7 m plinth, the river wall on its basement arches. Full 3D world uses an explicit terrain pad (terrainPad): the outline held at the median DEM of its own vertices with a 6 m feather.',
  attribution: 'Original procedural mesh. Mapped outline, bearing and bay positions © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the plan (164.2 x 19.5 m main body, 24 m end pavilions, projecting river bays, 19.8 m portico) and the 18.2 degree bearing from the OSM outline (way 87389029), the Doric portico of six columns on rue Saint-Paul, the two main storeys with three-storey end pavilions and a central drum and dome (Répertoire du patrimoine culturel du Québec; Parks Canada), and the 535 ft length (Wikipedia). Estimated from photographs: every height (cornice 12.9 m, pavilions 15 m, central block 18.8 m, dome crown 35 m, mast tip 49.4 m), the window sizes and rhythm, the drum (16 bays, 15 m across), the lantern, the roof pitches, the plinth and basement arches. Not modelled: the lettering and medallion detail, balustrades and railings, chimneys, doors in detail, interior, the Saint-Paul and de la Commune street furniture and the dome floodlighting.',
};
