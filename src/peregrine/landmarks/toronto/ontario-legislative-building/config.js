// Ontario Legislative Building, Queen's Park, Toronto (Richard A. Waite, 1893;
// west wing rebuilt after the 1909 fire, north block 1909-13). No published survey
// dimensions were found: the plan and the heights follow the ~85 OpenStreetMap
// building:part ways (unverified mapper heights: 60 m octagonal roof, 45 m domes,
// 43 m pavilions), the facade features follow photographs. See
// docs/3d-toronto-ontario-legislative-building.md.
export const SPEC = {
  id: 'ontario-legislative-building', name: 'Ontario Legislative Building', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: [-79.391663, 43.662569], // area centroid of the mapped outline (OSM way 15089986)
  height: 63, padM: 125, frontageBearing: 163, // the south front looks down University Avenue, 17 degrees off due south toward the east; roof peak 60 m + finial (63 m)
};
export const PALETTES = {
  light: { stone: '#8a5d51', stoneDark: '#6b473f', trim: '#c69f88', roof: '#4a5358', copper: '#6a9583', glass: '#46565f', glow: '#586a74', iron: '#372f2d' },
  dark: { stone: '#5c4340', stoneDark: '#48332f', trim: '#8f7268', roof: '#2f373c', copper: '#4a6b62', glass: '#2c3b44', glow: '#f2c67a', iron: '#27211f' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The real building stands on a rise in Queen\'s Park; the base is kept rigid.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, part heights and roof forms follow the ~85 OpenStreetMap building:part ways (unverified mapper heights: octagonal roof 60 m, domes 45 m, pavilions 43 m). Facade rhythm, arcades, dormer placement, the portico arch sizes, turrets, domes\' profile, the north block front and every window are estimates from Wikimedia Commons photographs; no survey dimensions were found. The Legislative Building stands on a rise in Queen\'s Park; the model keeps a rigid flat base at y=0. Grounds, statues, the Whitney Block and the Lieutenant Governor\'s drive are not modelled.',
};
