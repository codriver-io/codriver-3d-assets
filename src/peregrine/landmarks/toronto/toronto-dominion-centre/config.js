// Toronto-Dominion Centre: Mies van der Rohe's black steel-and-bronze-glass
// complex on the block bounded by King, Bay, Wellington and York, modelled as ONE
// landmark: TD Bank Tower, TD North Tower (Royal Trust Tower), the Banking
// Pavilion, TD West Tower and TD South Tower (across Wellington), with the
// raised granite plaza between them. Sources and dimensions:
// docs/3d-toronto-toronto-dominion-centre.md.
export const SPEC = {
  id: 'toronto-dominion-centre', name: 'Toronto-Dominion Centre', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the smallest circle enclosing the five mapped footprints (OSM, 2026-09-29).
  origin: [-79.3815354, 43.647541],
  height: 222.86, // TD Bank Tower, to the top of the roof (OSM height=222.86; Skyscraper Center 222.8 m)
  padM: 140, // covers every footprint corner (127 m from the origin) and the plaza plinth
  frontageBearing: 344, // King Street frontage, normal to the 74-degree street grid
  nearM: 650,
  // Site facts the geometry reads (metres). Storey heights are the tower's own technical specification.
  floorToFloor: 3.66, // 12 ft, Cadillac Fairview TD Bank Tower technical specification, rev. Jan 2022
  module: 1.524, // 5 ft planning and curtain-wall module
  plinth: 0.9, // granite plaza above street grade (estimate from photographs)
};

// Same material names in both themes. Self-lit names (sign, glow, light, lamp) are
// drawn unshaded: `glow` is a window pane (a warm daytime reflection, lit at night),
// `lamp` the pavilion's luminous ceiling, `light` the white of the TD lettering,
// `sign` the TD green.
export const PALETTES = {
  light: {
    steel: '#18191b', glass: '#443d36', glow: '#4f463b', lamp: '#cdc4ae', light: '#f4f5ef', sign: '#33ae3b',
    granite: '#a59f98', lawn: '#7f9b5c', stone: '#cbc2b0',
  },
  dark: {
    steel: '#0e0f11', glass: '#1e1c1a', glow: '#f1c684', lamp: '#ffd894', light: '#ffffff', sign: '#43c34f',
    granite: '#565860', lawn: '#2f402d', stone: '#6d6c6a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Tower heights are measured from street grade; the granite plaza is a 0.9 m plinth above it. The underground PATH concourse is not modelled.',
  attribution: 'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Tower heights, storey counts and plan sizes are sourced (OSM, Skyscraper Center, the building technical specification); mechanical-band positions, lobby geometry, pavilion height, plinth height and logo placement are estimated from photographs.',
};
