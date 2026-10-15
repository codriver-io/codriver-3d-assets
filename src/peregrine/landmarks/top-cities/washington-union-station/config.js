// Washington Union Station (D.H. Burnham & Co., 1907). Plan frame: u runs along the facade (bearing 105.5 deg),
// v is toward the front (SSW, Columbus Plaza). The facade bearing and the 15.5 deg rotation come from the mapped
// rectangle of OSM way/67100178 (both long edges agree to 0.1 deg). Origin is the centre of that rectangle.
export const PLAN = {
  angleDeg: 15.5,            // rotation of the plan frame from east toward south
  shiftX: 5.5, shiftZ: -30.7, // plan origin (the OSM dossier point) sits at local (-shiftX, -shiftZ)
};
export const SPEC = {
  id: 'washington-union-station', name: 'Washington Union Station', kind: 'building',
  ready: true,
  origin: [-77.0061965, 38.8975877], // centre of the mapped station rectangle
  height: 30.7, // Main Hall vault crown plus standing-seam ribs (interior ceiling 96 ft = 29.3 m, plus roof shell)
  padM: 125,
  frontageBearing: 195.5, // the long facade faces SSW
  // Sourced: facade ~190 m long (OSM rectangle 193 m), Main Hall 219 x 120 ft x 96 ft (Union Station Redevelopment Corp.),
  // six attic statues at the six column positions (OSM statue nodes). Estimated: storey heights, arch sizes, vault rise.
  hall: { length: 66.8, width: 36.6, ceiling: 29.3 },
};
export const PALETTES = {
  light: { stone: '#d9d5c9', trim: '#e7e3d7', base: '#c8c2b2', roof: '#79878a', tar: '#7f8280', glass: '#566c72', glow: '#34414a' },
  dark: { stone: '#8c9399', trim: '#a5aaae', base: '#767d83', roof: '#4a5c67', tar: '#4d5860', glass: '#324a54', glow: '#f2cd88' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 is local street grade at the facade; reusable rigid geometry, no DEM or absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Facade length, rotation, six statue positions and column bays from OSM; Main Hall size from the station operator. Estimated: arch and storey heights, vault rise, wing arcade rhythm, concourse shell (flat 7.25 m, OSM height). Columbus Fountain, flagpoles and the plaza lie 70-110 m in front of the building and are not modelled. Interior omitted.',
};
