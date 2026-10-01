// San Francisco City Hall, 1 Dr Carlton B Goodlett Place · San Francisco, California.
// Origin: area centroid of the outer ring of OSM relation 7261820 (way 494810795), fetched 2026-10-01.
// The Civic Center grid north of Market is not cardinal: the mapped walls run at bearing 80.9 degrees
// (the Polk Street front, which looks toward 80.9) and 170.9 (the Grove/McAllister sides). The model is
// authored in building axes (x = depth toward Polk Street, z = along the front) and rotated once,
// by `rotationDeg`, onto east/up/south inside the geometry.
export const SPEC = {
  id: 'san-francisco-city-hall', name: 'San Francisco City Hall', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.419239, 37.7792759],
  height: 93.7, // m to the finial: 307.5 ft (City and County of San Francisco, Wikipedia)
  padM: 80,
  frontageBearing: 80.9, // Polk Street front looks toward this compass bearing
  rotationDeg: 9.1, // building x-axis, degrees anticlockwise from east seen from above (bearing 90 - 9.1)
};
// Light: Madera County granite (warm light grey), slate-blue dome with gilded ribs, copper-green skylights.
// Dark (night): the real dome, drum and colonnades are floodlit, so the dome is a pale teal-grey, the stone only dimmed, and every gilded
// part of the dome and lantern is `lamp` (drawn unshaded: day gold, bright warm gold at night). `gold` is the daylit door ironwork and frieze.
export const PALETTES = {
  light: { stone: '#d1cbbd', stone2: '#a29d90', roof: '#74867f', dome: '#566171', gold: '#d9aa38', lamp: '#d9aa38', glass: '#46505a', light: '#4a3a1c' },
  dark: { stone: '#9b9ea5', stone2: '#6d7078', roof: '#46524f', dome: '#7d98a6', gold: '#b08f3c', lamp: '#ffd777', glass: '#151a21', light: '#ffe7ae' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the Polk Street and Van Ness Avenue pavements); no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Dome, drum, lantern and the 93.7 m height are sourced (307.5 ft). The plan follows the OSM outline and its rotunda parts. Facade heights, bay counts, column sizes, the roof and every ornament are estimated from photographs; sculpture and carved relief are abstracted.',
};
