// Colosseum (Amphitheatrum Flavium), Piazza del Colosseo, Rome. The standing ruin:
// the outer wall survives on the north and east (about half the circuit) and is quarried
// away on the south and west; the arena floor is gone and the hypogeum is open.
// Sourced: Platner & Ashby, A Topographical Dictionary of Ancient Rome (1929),
// Amphitheatrum Flavium — outer ellipse 188 × 156 m, major axis approximately WNW–ESE,
// arena 86 × 54 m, outer wall 48.50 m, ground arches 7.05 × 4.20 m on piers
// 2.40 × 2.70 m, second and third orders 6.45 and 6.40 m. OSM relation 1834818 follows the intact outer wall and the inner wall on the ruined south.
// Estimated: storey splits that sum to 48.50 m, the exact bay where the outer wall
// breaks, inner-wall heights, the hypogeum grid, and the colours.
// See docs/3d-top-cities-colosseum.md.
export const SPEC = {
  id: 'colosseum', name: 'Colosseum', kind: 'building',
  ready: true, // exported asset readiness; app placement is a separate verification gate
  // Ellipse centre fitted to the intact northern OSM outer arc; see the authoring notes.
  origin: [12.49229914, 41.89019898],
  height: 48.5, padM: 115,
  // North end of minor axis. Mapped major axis is bearing 106°, baked into vertices.
  frontageBearing: 16,
};
export const PALETTES = {
  light: {
    travertine: '#e7dcc6', // pale outer stone, sunlit
    brick: '#af9680', // muted mixed tuff/brick of the cavea
    hypogeum: '#9a846c', // passage walls in the arena
    void: '#241e1a', // attic recesses and the arena floor
  },
  dark: {
    travertine: '#cbb892', // floodlit buff, still a lit stone
    brick: '#75614e',
    hypogeum: '#5a4937',
    void: '#12100e',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the valley-floor plaza). No absolute altitude and no terrain pad: the Palatine and Oppian rise outside the footprint.',
  attribution: 'Original procedural mesh. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan and height are Platner’s surveyed ellipse (188 × 156 m, 48.50 m), rotated to the mapped outer arc (bearing 106°). The replacement ring is the actual OSM multipolygon outline; south-side steps follow the surviving inner wall. The south-west outer wall is the ruin as it stands, without the modern scaffolding. Inner radii, the hypogeum grid and the colours are estimates from photographs.',
};
