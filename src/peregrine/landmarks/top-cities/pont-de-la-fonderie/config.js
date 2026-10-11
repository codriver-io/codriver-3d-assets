// Current 1951/1952 steel swing bridge, restored and repainted red in September 2023.
export const SPEC = {
  id: 'pont-de-la-fonderie', name: "Pont de la Fonderie", kind: 'bridge',
  ready: true,
  origin: [-0.35227315, 49.18295345], height: 2.105, padM: 40,
  frontageBearing: 126.8, footprintless: true,
};
export const PALETTES = {
  light: { steel: '#ba2834', edge: '#91212b', iron: '#363c3d', stone: '#858077', concrete: '#b1ada1', asphalt: '#626360', rail: '#b23038' },
  dark: { steel: '#76262e', edge: '#562029', iron: '#273137', stone: '#525b61', concrete: '#667078', asphalt: '#30393e', rail: '#74303a' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat Cityscape grade y=0 = quay street level; the closed swing deck is flush with its quays (road surface 0.10 m). Quay walls and slewing drum reach 2.5 m below grade. No DEM or sea-level elevations baked in. World bank-fit interpolates bank datums and grounds fixed foundations separately.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Current closed red steel swing bridge restored in 2023, not an unchanged 1854 bridge. OSM mapped span 22.78 m, deck about 9.96 m wide, two unmarked lanes and 12 m navigable clearance width tag. Heights, steel sections, rivets, counterweight step, bank-side pivot and abutment sizes are photographic estimates. No opening animation, graffiti, textures or construction equipment.',
};
