import { FOOTPRINTS } from './footprint.js';
// Official park FAQ: 56 ft statue (toe to spear) on a 124 ft sandstone pedestal.
export const SPEC = {
  id: 'vulcan-statue', name: 'Vulcan statue and tower', kind: 'building', ready: false,
  origin: [-86.79550087777778, 33.491722788888886], height: 54.864,
  pedestalM: 37.7952, statueM: 17.0688, padM: 17, frontageBearing: 1.8,
  terrainPad: { rings: [FOOTPRINTS[0], FOOTPRINTS[2], FOOTPRINTS[3]],
    refs: [...FOOTPRINTS[1].slice(0, -1), ...FOOTPRINTS[2].slice(0, -1)],
    datum: 'median', featherM: 12 },
};
export const PALETTES = {
  light: { stone: '#a79777', trim: '#c4b99b', iron: '#474b49', glass: '#44565b', recess: '#313a39' },
  dark: { stone: '#746d59', trim: '#8c8168', iron: '#777971', glass: '#263a43', recess: '#222b30' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at the tower and elevator footing. Red Mountain and DEM heights are not baked; a bounded median terrain pad is declared for separate world integration verification.',
  attribution: 'Original procedural geometry. Mapped provider outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Official dimensions: statue toe-to-spear 56 ft and pedestal 124 ft. Shaft width and elevator location mapped; anatomy, balcony level, stone taper and elevator height estimated from reference photos. Original simplified anatomy, no scan, mesh tracing or texture. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
