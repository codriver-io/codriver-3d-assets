// Basilique Sainte-Anne-de-Beaupré, 10018 avenue Royale, Sainte-Anne-de-Beaupré, Québec.
// The present basilica (Maxime Roisin, J.-É.-C. Daoust and Louis-N. Audet; built from 1923-1926, towers and spires
// 1962, consecrated 1976): Neo-Romanesque with Gothic proportions in light granite, a five-aisle nave under green
// copper roofs, a transept with apsidal ends, a choir with a ring of radiating chapels, and a facade with a rose window
// between two stone towers and spires reaching 91 m. The facade faces SOUTH-WEST (bearing 235.5 deg) onto the plaza and
// the front stairs; the apse is at the north-east end. The mapped axis runs along bearing 55.5 deg.
// Origin: area centroid of OSM way 104582533. Authoring frame (see basilique-sainte-anne-de-beaupre-plan.js): x lateral
// (+x = the viewer's right facing the front, i.e. south-east), z along the nave axis, front at +z, one rotation onto
// east/up/south at the end. y = 0 is the plaza pavement at the foot of the front stairs; the church floor and the doors
// stand 2.2 m above it.
import { FOOTPRINTS, STAIRS_PAD } from './footprint.js';
export const SPEC = {
  id: 'basilique-sainte-anne-de-beaupre', name: 'Basilique Sainte-Anne-de-Beaupré', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-70.928269, 47.0241087],
  height: 91, // m to the cross tips of the spires (published: 91 m / 299 ft); the gilded statue of Sainte Anne tops out at 51.4 m
  padM: 58, // footprint radius 51.3 m (the chapel at the apse) and the front stairs at 56.6 m (unused while terrainPad is set)
  // Full 3D world only (Cityscape is flat and ignores it): the outline and the podium and stairs 8 m past it, flattened to the
  // median ground under both (not the lowest sample of the default disc); the escarpment toe north-west is left alone.
  terrainPad: { rings: [FOOTPRINTS[0], STAIRS_PAD], datum: 'median', featherM: 8 },
  frontageBearing: 235.5, // the facade looks toward bearing 235.5 deg (south-west)
  rotationDeg: -55.5, // authoring +z (the front) onto the mapped axis: Y-up rotation baked into the geometry
};
export const PALETTES = {
  light: {
    stone: '#aeb0ad', recess: '#85878a', roof: '#4c675b', glass: '#35404a', glow: '#58677a', gold: '#d2a23a',
  },
  dark: {
    stone: '#6c7076', recess: '#4d5055', roof: '#364a43', glass: '#1b2229', glow: '#e3bd78', gold: '#cfa550',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. y=0 is the plaza pavement at the foot of the front stairs; the church floor and the doors stand 2.2 m above it (12 steps). Full 3D world uses an explicit terrain pad (terrainPad) under the outline and the front podium and stairs.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: spire height 91 m (299 ft), length 105 m overall, 61 m across the transept, 48 m facade (Wikipedia, Répertoire du patrimoine culturel du Québec); the OSM outline (axis bearing 55.5 deg, 100 m long, 62.8 m across the transept apses, 49.8 m front, seven radiating chapels of 3.4 m radius). Estimated from photographs: every height below the spire tops (aisle, nave and transept walls and ridges, belfry stage, gable, rose window), the five-aisle widths, window and buttress rhythm, the transept and choir roofs, and every elevation not visible from the facade or the air. The spires are stone, not copper; the roofs are copper (modelled aged green). Carved ornament, statues (except the gilded Sainte Anne), tracery and the plaza fountain are not modelled.',
};
