// San Francisco Museum of Modern Art, 151 Third Street, SoMa. Mario Botta's 1995 building on Third Street
// (stepped reddish-brown brick masses round a black-and-white striped cylinder cut by a slanted skylight)
// and Snohetta's 2016 expansion rising behind it (white fibre-reinforced polymer facade with horizontal waves).
//
// SOURCED: Skyscraper Center "San Francisco Museum of Modern Art Expansion" 62 m / 203 ft, 10 floors (2016,
//   Snohetta with EHDD); Wikipedia / SFMOMA press / Time 1995: Botta's building five storeys, brick masses
//   stepped back, central cylinder in alternating bands of black and white stone, sliced on the bias with an
//   elliptical skylight ("130 ft above" the atrium floor), Snohetta addition about 50 ft higher than Botta
//   (Architectural Record: 200 ft); expansion clad in more than 700 glass-fibre reinforced polymer panels.
// MAPPED (OSM, ODbL, read 2026-10-01): the whole plan: hull 41692824, Botta body 65.2 x 49.0 m, turret circle
//   r 9.6 m at 30.6 / 31.1 m from the frontage corner, the two 14 m end towers 14 m behind it, Snohetta slab
//   (108.6 x 31 m) and its annex. The street grid is 135.4 degrees / 45.4 degrees (Third Street runs SE).
// ESTIMATED (photographs, see docs/3d-san-francisco-sfmoma.md): every height except 62 m, the step depths,
//   the skylight slope (43 degrees), band pitch, the Snohetta roof profile, ribbon windows and the wave pattern.
export const SPEC = {
  id: 'sfmoma', name: 'San Francisco Museum of Modern Art', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of the OSM hull (way 41692824).
  origin: [-122.400673, 37.785899],
  height: 62, // m, the Snohetta roof at its Howard Street end (Skyscraper Center 62 m)
  padM: 80,
  // Botta's main facade looks across Third Street to the south-west (bearing 225.4 degrees).
  frontageBearing: 225.4, gridDeg: 135.4,
  brickTop: 40.5, turretTop: 45.8, expansionTop: 62,
};

// Light is day, dark is night. Same keys in both. `glow` is drawn unshaded: the lit skylight and the
// ground-floor lighting strip at night.
export const PALETTES = {
  light: {
    brick: '#7a4639', brickDark: '#653a30', stoneBlack: '#2a2a2c', stoneWhite: '#e7e5df',
    frp: '#e4e1d9', glass: '#8ea6b1', glassDark: '#33444d', steel: '#4a5358', concrete: '#8e8f8b', glow: '#7f9eac',
  },
  dark: {
    brick: '#5e4137', brickDark: '#4a3029', stoneBlack: '#18181a', stoneWhite: '#9b9c9b',
    frp: '#a3a6ab', glass: '#46606c', glassDark: '#182329', steel: '#2f3538', concrete: '#5a5b59', glow: '#ffe0a0',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (Third Street level at the entrance); no absolute altitude. Botta brick masses 19.5 / 24.5 / 29.5 / 40.5 m, turret rim 27.6 to 45.8 m, Snohetta roof 46 m (north-west end) rising to 62 m (Howard Street end).',
  attribution: 'Original procedural mesh. Mapped footprint and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan (Botta body, turret circle, end towers, Snohetta slab, annex) is mapped from OSM; the 62 m top is sourced (Skyscraper Center); every other height, the step depths, the skylight slope, stripe pitch, the Snohetta roof profile, ribbon windows and wave pattern are estimated from photographs. See docs/3d-san-francisco-sfmoma.md.',
};
