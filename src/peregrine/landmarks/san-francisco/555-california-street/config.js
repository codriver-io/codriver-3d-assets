// 555 California Street (former Bank of America Center), San Francisco: Wurster, Bernardi & Emmons with
// Skidmore, Owings & Merrill, Pietro Belluschi consulting; completed 1969.
// Sourced: 237 m (779 ft) to the crown roof, 52 storeys, carnelian (dark red) granite with faceted
// bronze-tinted bay windows, stepped "Sierra" cutouts near the top (Wikipedia, SOM, Skyscraper Center), a
// 1-level pavilion beside the tower; plan and tier heights from OpenStreetMap building parts: a 226 m / 52
// level shaft with four corner arms, a 48-level outer layer of sawtooth bays, a 237 m crown block, a 1-level
// hall. Estimated: floor pitch, window sizes, the per-tooth cutout heights of the outer layer, the hall height,
// the roof equipment and masts. See docs/3d-san-francisco-555-california-street.md.
export const SPEC = {
  id: '555-california-street', name: '555 California Street', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.403774, 37.792105], // centroid of the mapped 52-level shaft (OSM way 1244283836)
  height: 240, // masts on the 237 m crown roof
  padM: 62, // tower plan about 78 x 52 m plus the hall on the east side
  frontageBearing: 351, // California Street face (north) looks 9 degrees west of north: the plan is baked rotated
};

// Heights in local metres above flat-map grade (y = 0 is the plaza level of the mapped footprint).
export const DESIGN = {
  coreRoof: 226, // OSM: 52-level shaft height tag
  crownRoof: 237, // OSM and Wikipedia: 237 m / 779 ft
  hallRoof: 11.5, // estimated: the hall is mapped as one (double-height) level
  floor0: 9, // first typical floor bottom; below it the lobby band
  pitch: 4.25, // floor to floor
  mechanical: [11, 35], // louvre floors seen in photographs (about 58 m and 157 m)
};

export const PALETTES = {
  light: {
    granite: '#80605a', spandrel: '#33241f', glass: '#3f444e', glow: '#383c45', roof: '#8a8279', metal: '#555a5f',
  },
  dark: {
    granite: '#6a4a43', spandrel: '#33241f', glass: '#212835', glow: '#e0b97a', roof: '#43464a', metal: '#2e3236',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The crown roof at 237 m and the masts at 240 m are above this local grade (the real corner of California and Kearny stands about 11 m above sea level).',
  attribution: 'Original procedural mesh. Mapped footprint and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, sawtooth bays, shaft/crown/hall tiers and their heights (226 m, 237 m) are mapped (OpenStreetMap) or sourced; the floor pitch, window and louvre layout, the per-tooth cutout heights of the 48-level outer layer, the 11.5 m hall height, the roof equipment and masts are estimates from published photographs. Plaza, steps, the Transcendence sculpture and the lobby interior are not modelled and stay provider geometry.',
};
