// Basilique-cathedrale Notre-Dame de Quebec, 16 rue De Buade, Vieux-Quebec. See docs/3d-quebec-notre-dame-de-quebec.md.
// Origin: area centroid of the cathedral outline (OSM way 103862161). The nave and the west wall run at bearing 91.3 deg (two
// control points: the nave roof part's long edges 91.4 and 92.5 deg, the west wall 1.3 deg off north); that 1.3 deg is baked into
// the geometry (rotationDeg), so the model sits in the mapped rings and the layer never rotates it again.
import { FOOTPRINTS } from './footprint.js';

// Full 3D world (ADR-0045): the public Terrarium DEM (zoom 15, bilinear, checked 2026-10-04) falls 44.3 to 49.5 m under the footprint
// (median 47.8 m): the Upper Town rises about 4 m from the facade's north end to the south-east. There is no cliff within 100 m (the ground
// slopes gently, 39 m at 90 m north, 54 m at 90 m south). The default 60 m disc would take its lowest sample (about 39 m) and sink the
// basilica 8 m, so the pad is the outline held at its own median DEM with a short feather: the cathedral stands on the levelled
// site it has in reality (the west front on its parvis, the street slope blends back within 8 m).
const TERRAIN_PAD = { rings: [FOOTPRINTS[0]], refs: FOOTPRINTS[0], datum: 'median', featherM: 8 };

export const SPEC = {
  id: 'notre-dame-de-quebec', name: 'Basilique-cathédrale Notre-Dame de Québec', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-04)
  origin: [-71.2060175, 46.8137764],
  height: 52.3, // m to the tip of the cross on the belfry (estimated from photographs; no published figure found)
  padM: 60, // unused while terrainPad is set
  frontageBearing: 271.3, // the west front looks along bearing 271.3 deg, onto the Place de l'Hôtel-de-Ville
  rotationDeg: 1.3, // authoring u axis (nave, west to east) is rotated this far toward the south, degrees
  terrainPad: TERRAIN_PAD, // Full 3D world only; Cityscape is flat and ignores it
};

// The nave's copper is a darker, greyer verdigris (linear 0.13 / 0.20 / 0.16, about 0.7 of the first pale sage) beside the brown aisles.
export const PALETTES = {
  light: {
    stone: '#a4a196', trim: '#bebaad', copper: '#657d6f', slate: '#524d46',
    glass: '#39444c', glow: '#6e8198', metal: '#33312f', seam: '#587163',
  },
  dark: {
    stone: '#696c71', trim: '#7d8085', copper: '#44584f', slate: '#48443e',
    glass: '#151c23', glow: '#ffcf86', metal: '#262627', seam: '#35463d',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the foot of the west front on the Place de l\'Hôtel-de-Ville / rue De Buade side, roughly 45 to 48 m above sea level (public DEM: 44 to 49.5 m under the footprint, median 47.8 m); the Upper Town slope is not modelled. Full 3D world uses an explicit terrain pad (terrainPad): the outline held at its median DEM with an 8 m feather.',
  attribution: 'Original procedural mesh. Mapped outline and building-part footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped outline and building parts (OSM way 103862161 and parts), the asymmetric west front (Baillairgé 1843-44: one tower finished with its stepped belfry and lanterns, the north tower left without its spire, here about 34.6 m to its roof apex), the nave axis bearing. Estimated from photographs (no published height was found): every height (tower masonry about 26 m, belfry cross about 52 m, nave ridge about 23 m), roof pitches, window sizes and rhythm, the unmapped east end. Ornament, statues, the iron railings, the parvis steps and the surrounding streets are not modelled.',
};
