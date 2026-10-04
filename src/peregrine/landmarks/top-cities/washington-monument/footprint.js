// OpenStreetMap extrusions this model replaces. Way 766761337 is the obelisk
// (building=civic, man_made=obelisk, height 169.294). Way 897141356 is the
// one-storey east entrance lobby (building=government, glass) that shares the
// east wall. Read from the dossier extract (Overpass, 2026-10-04).
// The circular plaza, flag ring and paths stay provider-owned.
export const FOOTPRINTS = [
  // 766761337: the shaft. Collinear nodes on the east edge are where the lobby meets it.
  [[-77.0351445, 38.8895166], [-77.0351441, 38.8894341], [-77.0351439, 38.8893984], [-77.0353406, 38.8893989], [-77.0353412, 38.8895517], [-77.0351447, 38.8895521], [-77.0351445, 38.8895166]],
  // 897141356: east screening lobby, about 9.2 m wide and 10.7 m deep.
  [[-77.0351445, 38.8895166], [-77.0351441, 38.8894341], [-77.0350211, 38.8894343], [-77.0350212, 38.8894517], [-77.0350214, 38.8894998], [-77.0350215, 38.8895169], [-77.0351445, 38.8895166]],
];
export const OSM_WAYS = ['way/766761337', 'way/897141356'];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
