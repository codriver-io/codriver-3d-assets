// Hotel de Ville de Montreal, 275 rue Notre-Dame Est, Vieux-Montreal, Quebec. Original procedural model; see
// docs/3d-quebec-hotel-de-ville-de-montreal.md for sources, the dimension table and what is estimated. Contract: docs/3d-quebec-landmarks.md.
//
// Origin: area centroid of the mapped City Hall outline (OSM way 20919180, fetched 2026-10-04). Rotation baked once: the mapped walls give
// the long front (along the 29.5 degree grid direction) and the 119.5 degree end walls; the front looks toward bearing 119.45, toward
// rue Notre-Dame, Place Jacques-Cartier and the Old Port; the rear looks 299.45 toward the Champ-de-Mars. The model is authored in
// building axes (see hotel-de-ville-de-montreal-kit.js) and rotated once by 29.45 degrees.
//
// Full 3D world (ADR-0045): no terrainPad. The public DEM (Terrarium, z14 and z15, sampled 2026-10-04 on a 10 m grid over the outline and
// 60 m round it) reads 19.9 m everywhere under the City Hall and the Champ-de-Mars side, rising only to 20.5-21.2 m about 40-60 m east of
// the front (rue Notre-Dame and Chateau Ramezay's side): the real fall of the ground toward the Champ-de-Mars (about 5 m, from the photographs
// and the 1932-34 terrace) is not in that data. The default disc takes the lowest sample (19.9 m) and so lies level; a pad or terrace
// would carve a pit into a plain the DEM draws flat. The model carries the drop itself: the rear block is a terrace slab (top 4.8 m)
// whose walls run to -2.5 m, so on a DEM that does fall they stand on the ground instead of floating.
export const SPEC = {
  id: 'hotel-de-ville-de-montreal', name: 'Hôtel de Ville de Montréal', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-73.5541401, 45.5088246],
  height: 40, // m to the spire tip, estimated from photographs (no published total): cornice 15.5 m, roof ridge 24.4 m, 9 m campanile on top
  padM: 52, // just covers the City Hall and the rear block (farthest vertex 50 m from the origin); the DEM is level here
  frontageBearing: 119.45, // rue Notre-Dame front looks toward this compass bearing (ESE)
  rotationDeg: 29.45, // building s-axis (along the front), compass bearing; the model is rotated by this once
  axisS: -0.1, // the front's centre line lies this far to the left (building -s) of the origin
};
// Light: grey Montreal limestone, patinated copper roofs and campanile (dark charcoal-green, 25 % darker than the first pass: the reference
// roofs frame the pale stone). Night: the front is floodlit, windows glow. `light` is the window glass (day dark glass, night warm glow),
// `sign` the clock dial (unshaded); `glass` is the dark ground-floor glazing. The campanile cap uses `roof`, the same patina as the mansards.
export const PALETTES = {
  light: { stone: '#aaa79e', stone2: '#7d7b75', roof: '#414b47', glass: '#2f3943', light: '#43515c', sign: '#ebe5d0' },
  dark: { stone: '#85817b', stone2: '#575450', roof: '#34413b', glass: '#141a20', light: '#ffdc98', sign: '#ffeab0' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap: the rue Notre-Dame pavement at the foot of the front stair. The ground falls about 5 m toward the Champ-de-Mars; the public DEM does not show it, so the rear block is modelled as a terrace at +4.8 m, with a slope skirt: its walls run down to -2.5 m (the only geometry below y=0) so they stand on a ground that does fall instead of floating. No absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the mapped outlines of the City Hall (way 20919180) and of the rear block (way 396654637); five storeys; five-part symmetrical front with a projecting central pavilion; grey stone, copper roofs with mansards and dormers, two chimneys; a 30 ft (9.1 m) campanile; the 1932-34 rear extension toward the Champ-de-Mars. Estimated from photographs: storey and cornice heights (cornice 15.5 m, ridge 24.4 m, total 40 m, good to about 4 m), bay counts and sizes, column and window sizes, the roof profile, the rear block height. Sculpture, carved relief, the bronze doors, lettering, flags and the front parterres are abstracted or left out.',
};
