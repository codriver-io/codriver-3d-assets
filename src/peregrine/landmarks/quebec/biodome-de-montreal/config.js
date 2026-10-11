// Biodôme de Montréal, 4777 avenue Pierre-De Coubertin, Parc olympique · Montréal, Québec.
// The former Olympic Velodrome of the 1976 Games by Roger Taillibert, converted into the Biodôme (an indoor
// museum of five ecosystems) in 1992. Sourced: 33.5 m (110 ft) above ground at the crown, 172 m average length,
// 16 723 m2 of ground cover, a prestressed concrete shell resting on four abutments (Parc olympique,
// stadeolympiquemontreal.ca/le-toit-du-velodrome.php), the mapped plan (OSM way 26699302, ~16 500 m2). Estimated:
// the shell's profile, the arch heights under the edge, rib and skylight layout, colours. See docs/3d-quebec-biodome-de-montreal.md.
export const SPEC = {
  id: 'biodome-de-montreal', name: "Biodôme de Montréal", kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of the mapped roof outline (OSM way 26699302).
  origin: [-73.549709, 45.559599],
  height: 33.5, // the crown of the shell, 110 ft above ground
  padM: 102, // the four feet reach 85-97 m from the centroid; the site is flat
  // Bearing (clockwise from north) of the glazed entrance front with the BIODÔME sign: the arch between
  // the west and south-west feet faces the Olympic Stadium esplanade, west-south-west.
  frontageBearing: 250,
};
export const PALETTES = {
  light: {
    concrete: '#cac8bf', rib: '#efeee8', skylight: '#869fa8', glass: '#4a6068',
    frame: '#555b5e', sign: '#2c4a3f',
  },
  dark: {
    concrete: '#98a1a9', rib: '#aab2b9', skylight: '#52646c', glass: '#26363f',
    frame: '#3a4146', sign: '#e8f0e8',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the Olympic Park esplanade round the building); no absolute altitude. The 33.5 m crown is taken as height over this grade.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'The plan comes from OpenStreetMap and the 33.5 m crown and four abutments from the Parc olympique. The shell profile, arch heights, rib and skylight layout, glazed walls, entrance canopy and colours are estimates from photographs. The Olympic Stadium and its tower, the Planétarium, the access ramps and the landscaping are not modelled.',
};
