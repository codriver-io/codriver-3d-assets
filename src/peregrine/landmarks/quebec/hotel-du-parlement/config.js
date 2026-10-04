// Hôtel du Parlement, 1045 rue des Parlementaires, Québec (Eugène-Étienne Taché, Second Empire, 1877-86). Original procedural model; see
// docs/3d-quebec-hotel-du-parlement.md for sources, the dimension table and what is estimated. Contract: docs/3d-quebec-landmarks.md.
//
// Origin: area centroid of the mapped outer ring of OSM relation 196002 (fetched 2026-10-04). Rotation baked once: the ring's four walls
// run 48.6, 49.4 (the long sides) and 138.8 / 140 degrees; the main front is the north-east one, 93.2 m long, looking toward bearing 48.9
// down the axis of the Fontaine de Tourny (OSM way 577383256 stands 108 m out on that line) and the curved esplanade stairs. The model is
// authored in building axes (x along the front toward the viewer's right, z toward the front; hotel-du-parlement-plan.js) and turned once.
//
// Full 3D world (ADR-0045): terrainPad declared. The public DEM (Terrarium z15, sampled 2026-10-04 on a 4 m grid over the outline) is not flat
// here: it climbs about 5.4 m across the plan (82.2 m at the north corner to 87.6 m at the south corner), 85.0 m median, with the front
// (north-east) side the lower one. The default disc takes the lowest sample (82.1 m) and would bury the south-east and south-west wings
// up to 5 m; the pad holds the outline at the median (85.0 m) and feathers back to the slope.
import { FOOTPRINTS } from './footprint.js';

export const SPEC = {
  id: 'hotel-du-parlement', name: 'Hôtel du Parlement', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-71.2141891, 46.8086847],
  height: 65, // m to the flagpole tip on the clock tower: slate roof apex 52.4 m, iron crest to 57 m, pole to 65 m
  padM: 75, // unused while terrainPad is set; covers the quadrangle (farthest corner 66 m from the origin)
  frontageBearing: 48.9, // the Fontaine de Tourny / esplanade front looks north-east
  rotationDeg: 48.9, // building z-axis (toward the front), compass bearing; the model is rotated by 180 - 48.9 degrees about Y once
  terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 12 }, // Full 3D world only; Cityscape is flat and ignores it
};
// Light: grey ashlar (the dusk photograph reads #77757a under cool light; a neutral warm grey is used) with paler dressed trim (linear 0.51, 15 % darker than first drawn so the string courses and window surrounds read against the walls), dark slate mansards, dark bronze (statues, ironwork, flagpole), the Québec flag's blue as `sign`.
// Night: the ground-floor arched windows, the clock faces and the tower's belfry glow (`glow`, unshaded: pale glass by day, warm at night).
export const PALETTES = {
  light: { stone: '#aba89c', trim: '#bdbaaf', stoneDark: '#8b887e', roof: '#59636d', glass: '#4b5864', glow: '#8fa0aa', iron: '#34332f', sign: '#1f5ba5' },
  dark: { stone: '#78746a', trim: '#8d8980', stoneDark: '#5c5950', roof: '#353c44', glass: '#232c35', glow: '#f4c878', iron: '#24241f', sign: '#2b5f9e' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is the foot of the facade walls on the Colline Parlementaire, about 85 m above sea level (median of a public DEM over the outline); the plan climbs about 5.4 m toward the south corner, which the rigid base does not follow. No absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped outer ring of the quadrangle (relation 196002) and its courtyard hole, four levels, Second Empire style, Taché 1877-86, clock tower 52.4 m (Wikipedia, citing Ledoux and Jacob 2003), bronze statues of historical figures in the facade niches. Estimated from photographs: every storey, cornice and roof height except the tower, bay counts, window sizes, the pavilion and tower profiles, the roof pitches, the statue count and positions, the central chamber block and everything on the back and the sides. The Fontaine de Tourny, the esplanade, the lamps, the grounds and the neighbouring Édifices are not modelled.',
};
