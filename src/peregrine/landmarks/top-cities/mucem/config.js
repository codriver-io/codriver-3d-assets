import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'mucem', name: 'MuCEM & Fort Saint-Jean', kind: 'building', ready: true,
  origin: [5.36194,43.29528], height: 33, padM: 235, frontageBearing: 238,
  terrainPad: { rings: FOOTPRINTS, refs: FOOTPRINTS[0], datum: 'median', featherM: 4 },
};
export const PALETTES = {
 light: { stone:'#b6a58c', trim:'#c7b69b', roof:'#8c6550', terrace:'#8b8d7b', lattice:'#434747', glass:'#354c52', frame:'#202c30', glow:'#354c52' },
 dark: { stone:'#716c61', trim:'#898072', roof:'#51443d', terrace:'#4e5654', lattice:'#323b3e', glass:'#14282f', frame:'#162125', glow:'#386f88' },
};
export const MANIFEST = {
 elevationDatum: 'Local y=0 is the J4/quay footing; the fort terrace is a rigid authored 17 m podium, not a DEM or sea-level datum. Terrain placement requires separate per-terrace integration verification.',
 attribution: 'Original procedural geometry. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note: 'J4 72 m envelope, 52 m core, roof bridge deck 19 m. OSM tower tips 31/33 m. Cellular concrete lace is original coarse geometry; fort terrace height, stone courses, interior building eaves and glazing rhythm are photographic estimates. Rotation baked into geometry.',
};
