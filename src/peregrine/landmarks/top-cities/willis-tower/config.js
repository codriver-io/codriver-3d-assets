// Willis Tower (formerly Sears Tower), Chicago; original 1973 tower with current Catalog podium.
export const SPEC = {
  id: 'willis-tower', name: 'Willis Tower', kind: 'building', ready: true,
  origin: [-87.6358, 41.8789], height: 527, padM: 100,
  frontageBearing: 269, // Wacker facade; mapped orientation baked into geometry.
};
export const DESIGN = {
  roof: 442, tip: 527, eastTip: 520, floorPitch: 4,
  // Broad louvre floors read as black belts in the photographs; heights are estimates.
  mechanical: [[118, 130], [254, 264], [346, 355], [420, 442]],
  antennas: [[-33.06, 2.1, 527], [-6.3, 1.75, 520]],
};
export const PALETTES = {
  light: { metal: '#242423', glass: '#42423d', glow: '#43433e', roof: '#686861', lamp: '#d8dcd9', podium: '#383936' },
  dark: { metal: '#18202a', glass: '#26323d', glow: '#bc9d65', roof: '#3c4850', lamp: '#dce5ee', podium: '#29343d' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid building in real metres, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural mesh. Mapped footprint and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Mapped 200/260/355/442 m tube tiers and 5–25 m current podium. Nine structural modules are nominally 75 ft (22.86 m); mapped cladding envelope is ~70 x 71 m. Floor/bay rhythm, mechanical belts, glazing colours, antenna taper and east antenna 520 m tip are photographic estimates; highest tip 527 m. Podium and Wacker atrium are simplified faceted glazed volumes. Cityscape and Full 3D world integration not tested.',
};
