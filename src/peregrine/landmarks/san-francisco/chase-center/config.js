// Chase Center, 1 Warriors Way (Third Street at 16th Street), Mission Bay · San Francisco, California.
// Home of the Golden State Warriors (NBA) and Golden State Valkyries (WNBA). Manica Architecture
// (design architect), Kendall/Heaton Associates (architect of record), Magnusson Klemencic Associates
// (structure); built 2017-2019, opened 6 September 2019, capacity 18,064.
// Sourced: 38.1 m (125 ft) to the highest point (OSM height tag), the mapped plan (OSM way 579646390,
// about 160 m x 157 m), the arena's east-facing glass entrance front with the "CHASE CENTER" sign, the
// white aluminium panel drum in stepped horizontal bands, the roof visor over the front and the
// timber-toned base and soffit. Estimated: every height inside the 38.1 m, the band profile, the glass
// lean, the visor depth, panel and sign dimensions, all colours. See docs/3d-san-francisco-chase-center.md.
export const SPEC = {
  id: 'chase-center', name: 'Chase Center', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of the mapped arena outline (OSM way 579646390).
  origin: [-122.3873962, 37.7678739],
  height: 38.1, padM: 95,
  // Bearing (clockwise from north) of the centre of the glass entrance front, which faces east
  // toward Terry A. Francois Boulevard and Bayfront Park.
  frontageBearing: 92,
};
export const PALETTES = {
  light: {
    skin: '#e8ebec', skin_dark: '#6a727a', roof: '#d6dcde',
    glass: '#4a7ba6', glow: '#275a85', steel: '#8fa6b6',
    timber: '#b8794a', base: '#7a5640', sign: '#2c3748', logo: '#1473c4',
  },
  dark: {
    skin: '#8c98a3', skin_dark: '#2a2f35', roof: '#7a868d',
    glass: '#2f5373', glow: '#ffd07a', steel: '#76838d',
    timber: '#7a4c2c', base: '#3c2c24', sign: '#f2f7ff', logo: '#3392e6',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the plaza and street level round the arena); no absolute altitude. The 38.1 m (125 ft) crown (OSM height tag) is taken as height over this grade.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'The plan comes from OpenStreetMap and the 38.1 m height from its tag. The band profile, glass lean, visor depth, column spacing, panel rhythm, sign size and colours are estimates from photographs. The Seeing Spheres, the Thrive City pavilions and the Uber towers lie outside the mapped arena and are not modelled.',
};
