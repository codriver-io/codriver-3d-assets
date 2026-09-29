// Toronto City Hall and Nathan Phillips Square, 100 Queen Street West.
// Viljo Revell (with John B. Parkin Associates; structure Hannskarl Bandel), opened 13 Sept 1965;
// square by Revell and Richard Strong. Heritage-designated 1991.
//
// SOURCED (Wikipedia "Toronto City Hall", "Nathan Phillips Square"; torontojourney416.com; the
// Canadian Encyclopedia; OSM building:part tags read 2026-09-29):
//   east tower 27 storeys, 99.5 m (OSM; Wikipedia 99.7 m)   west tower 20 storeys, 79.4 m (OSM; Wikipedia 79.6 m)
//   towers stand on the podium roof (OSM min_height 8 m); the podium is two storeys, OSM height 8 m
//   council chamber: saucer dome 46 m (155 ft) across, 12 m from floor to highest point (13 to 25 m in OSM),
//     on a hollow concrete column 6 m across, 23 pairs of V-shaped concrete struts outside its windows
//   tower faces 225 ft (west) and 325 ft (east) along the arc; ribbed precast concrete backs with marble
//     inlays, curtain-wall concave faces; reflecting pool 55.5 x 30 m spanned by three Freedom Arches;
//     TORONTO sign 3 m tall x 22 m long (2015).
// MAPPED (OSM, ODbL): every plan position, the towers' inner and outer curves, the chamber radii, the podium
//   outline, the pool, the three arch foot pairs, the sign, the elevated walkway loop and the ramp centre line.
// ESTIMATED (photographs, see docs/3d-toronto-toronto-city-hall.md): every storey-level dimension, the rib pitch,
//   the strut ring, the podium colonnade, the arch rise, section and lamps, the walkway and ramp sections.
export const SPEC = {
  id: 'toronto-city-hall', name: 'Toronto City Hall and Nathan Phillips Square', kind: 'building',
  ready: true, // near/far GLBs exported, verified and catalogued
  // The chamber's central column: the point both towers' arcs and the saucer are concentric about.
  origin: [-79.3839615, 43.6534932],
  // Roof of the east tower 99.5 m + a 6 m aerial mast on it (estimated).
  height: 105.5, padM: 200,
  // The building and the square sit on Toronto's street grid, which runs 16.7 degrees north of east
  // (Queen St W bearing 73.3): the podium front looks along the grid's south, bearing 163.3.
  frontageBearing: 163.3, gridDeg: 16.7,
  podiumRoof: 8, eastRoof: 99.5, westRoof: 79.4, chamberCrown: 25,
};

// Light is day, dark is night. Same keys in both. `sign` and `light` are drawn unshaded by the layer:
// the TORONTO sign letters and the lit office windows.
export const PALETTES = {
  light: {
    concrete: '#d0c7b8', concreteDark: '#aca493', glass: '#4f6772', darkGlass: '#2c3b43',
    dome: '#ecece6', metal: '#8b9094', grass: '#7f9b62', water: '#7196a0',
    sign: '#f1f3f0', light: '#93abb2',
  },
  dark: {
    concrete: '#8d8b87', concreteDark: '#6a6967', glass: '#2e4551', darkGlass: '#17242b',
    dome: '#aab2b9', metal: '#5d6469', grass: '#40563f', water: '#22404d',
    sign: '#f2f6ff', light: '#ffd98f',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the plaza level); no absolute altitude. The podium roof is 8 m above it, the west tower roof 79.4 m, the east tower roof 99.5 m and the aerial mast tip 105.5 m.',
  attribution: 'Original procedural mesh. Mapped footprint and site geometry © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan positions, tower curves, chamber radii, podium outline, pool, arch feet, sign and walkway loop are mapped from OSM; tower and podium storey dimensions, rib pitch, strut ring, colonnade, arch rise and walkway/ramp sections are estimated from photographs. See docs/3d-toronto-toronto-city-hall.md.',
};
