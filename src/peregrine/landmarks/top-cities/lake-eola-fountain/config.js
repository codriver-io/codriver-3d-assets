// Linton E. Allen Memorial Fountain, 1957; post-2011 lighting restoration.
export const SPEC = {
  id: 'lake-eola-fountain', name: 'Lake Eola fountain', kind: 'building', ready: true,
  origin: [-81.37291941578947, 28.543637715789476], // OSM fountain way 45775179 centre
  height: 15, // representative low spray phase; structure is estimated at 6.45 m
  structureHeight: 6.45, diameter: 18.288, // 60 ft, Orange County Regional History Center
  padM: 14, frontageBearing: 90,
};
export const PALETTES = {
  light: { concrete: '#abae9e', frame: '#536f69', panel: '#3f8172', water: '#e7eeea', glow: '#a5c1ab', light: '#d0dbd0' },
  dark: { concrete: '#4d625f', frame: '#304f53', panel: '#348b71', water: '#b0c6cb', glow: '#487cdd', light: '#b48ae7' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the lake surface and rigid foundation datum; no absolute altitude, lake depth or DEM baked in.',
  attribution: 'Original procedural mesh. Geographic frame and fountain outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '60 ft diameter sourced from Orange County Regional History Center; tier heights, rib rhythm, six-sided shallow plinth and spray phase estimated from reference photographs. Green domed fountain, distinct from the separate Chinese pagoda. Basemap lake supplies surrounding water; no contextual water pad. Cityscape and Full 3D world not tested.',
};
