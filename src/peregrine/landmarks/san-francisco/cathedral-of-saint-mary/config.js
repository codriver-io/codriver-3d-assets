// Cathedral of Saint Mary of the Assumption, 1111 Gough Street, San Francisco. Pietro Belluschi and
// Pier Luigi Nervi with McSweeney, Ryan and Lee, consecrated 1971. Sourced: 255 ft (77.7 m) square under a
// cantilevered roof slab, 190 ft (58 m) overall including the cross, eight hyperbolic-paraboloid shell
// segments of precast concrete clad in travertine rising from the corners to meet in a cross, a stained-glass
// slot on each face and glass strips forming a cross at the summit. Mapped (OSM relation 7814696 and its
// building:part ways): the 63 m ground block, the 35.6 m tower base and the four 3 m fins reaching 20 m from
// the centre, all on one grid rotated 9.1 degrees (the Western Addition street grid). See
// docs/3d-san-francisco-cathedral-of-saint-mary.md.
export const SPEC = {
  id: 'cathedral-of-saint-mary', name: 'Cathedral of Saint Mary of the Assumption', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.4253877, 37.7842352], // centre of the mapped 63 m ground block (OSM part 436473547), which is also the cross centre
  height: 58, // to the tip of the cross on the summit
  padM: 64, // the 77.7 m cantilevered slab reaches 55 m diagonally; the entrance steps and plaza edge need a little more
  frontageBearing: 80.9, // the bronze doors and the plaza face Gough Street to the east (the grid's east, 9.1 degrees north of true east)
  // Model facts the geometry, tests and docs share (metres, building frame: u east, v south, rotated by gridDeg).
  gridDeg: 9.1, blockHalf: 31.4, slabU: [-37.7, 39], slabV: [-38.2, 39], slabBottom: 10.8, slabTop: 12.7,
  towerHalf: 17.8, finTip: 20.2, finHalf: 1.65, wallTop: 45, finTop: 53.5, crossBase: 43, annexHeight: 10.5,
};
export const PALETTES = {
  light: { stone: '#ddd6c6', stoneDark: '#bdb5a2', slab: '#cdc7b8', glass: '#5b7585', glow: '#232d36', bronze: '#5a4a37', bronzeLight: '#8a7250', metal: '#3d3a32', annex: '#d3cbb9' },
  dark: { stone: '#8d9298', stoneDark: '#737880', slab: '#838890', glass: '#52687a', glow: '#f2c37a', bronze: '#4b3f31', bronzeLight: '#6a5a42', metal: '#4a463c', annex: '#848990' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 at the plaza level on the flat Peregrine basemap; no absolute altitude. The raised plaza, the garage below it and the street stairs are not modelled.',
  attribution: 'Original procedural mesh. Mapped outline, 63 m ground block, 35.6 m tower base and fin positions © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Overall height, plan size and the shell/glass-cross arrangement are published; the slab thickness, ground-floor wall height, fin and wall-top heights, the curvature of the shell flanks, the apex height and the cross dimensions are estimated from photographs (the shells are modelled as ruled surfaces, not from the structural drawings); the annex south of the cathedral is a plain mass at its OSM height; interior, plaza, steps, door relief, travertine joints and the bell platform are not modelled.',
};
