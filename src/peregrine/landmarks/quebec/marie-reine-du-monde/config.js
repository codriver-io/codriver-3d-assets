// Cathédrale Marie-Reine-du-Monde, 1085 rue de la Cathédrale, Montréal, Québec.
// Victor Bourgeau, 1875 to 1894: a one-third-scale replica of St Peter's Basilica in Rome (Latin cross, ribbed dome on a drum, pedimented portico).
// Origin: area centroid of the mapped outline, OSM way 21335240 (fetched 2026-10-04).
// Montréal's street grid is not cardinal. The mapped walls run at bearing 33.5 degrees (boulevard René-Lévesque, the façade line) and 123.5 degrees (the nave and
// the cathedral's long axis); the mean of the outline's edge bearings, weighted by length, is 33.5 (mod 90). The façade faces 303.5 degrees (west-north-west).
// The model is authored in building axes (x across the church, to the right of someone facing the façade; z along the nave toward the façade; the origin on the dome axis)
// and rotated once, by `rotationDeg`, then moved to the dome axis (`axisM`, model metres from the origin), inside the geometry.
export const SPEC = {
  id: 'marie-reine-du-monde', name: 'Cathédrale Marie-Reine-du-Monde', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-73.568406, 45.499274],
  height: 77, // m to the top of the cross: 77 m (252 ft) at the cupola (Wikipedia); OSM lantern part ends at 77 m
  padM: 70, // flat site: just covers the outline (farthest mapped corner 64.4 m from the origin)
  frontageBearing: 303.5, // the façade on boulevard René-Lévesque looks toward this compass bearing
  rotationDeg: -123.5, // rotateY applied to building axes (+z = façade side): +z maps to bearing 303.5
  axisM: [9.65, 7.04], // dome axis in model metres (east, south) from the origin
};
// Light: pale grey ashlar limestone, darker grey fieldstone at the rear, green-patinated copper dome and roofs (the same copper lines the cornices),
// darker bronze-green statues, dark glazing. Dark (night): the dome, drum and façade are floodlit, so the stone is only dimmed and the copper lifted;
// `glow` is the glazing: dark glass by day, warm lit windows at night (drawn unshaded).
export const PALETTES = {
  light: { stone: '#b9b2a1', rubble: '#8f8d84', copper: '#5d8376', bronze: '#4a7a68', glass: '#363f46', glow: '#4b5a64' },
  dark: { stone: '#85878d', rubble: '#5d6368', copper: '#6aa196', bronze: '#4d786e', glass: '#12171d', glow: '#e3bd78' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the boulevard René-Lévesque pavement at the foot of the stair); no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: the 77 m total height, the cupola (23 m across per Wikipedia, 24.8 m for the outer shell in OSM), the thirteen façade statues, and the plan (mapped outline and OSM building parts). Estimated from photographs: the dome profile and lantern stages, the drum, the ten-column order, window rhythm, every roof pitch and the statue size; sculpture, relief and lettering are abstracted. The Monument à Mgr Bourget on the stair is not modelled.',
};
