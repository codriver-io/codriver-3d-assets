// 1939 hotel: footprint/parts mapped, ornament reconstructed from reference photographs.
export const SPEC = {
  id: 'fairmont-hotel-vancouver', name: 'Fairmont Hotel Vancouver', kind: 'building',
  ready: true, origin: [-123.12096, 49.28384], height: 112.47, padM: 65, frontageBearing: 45.7,
};
export const PALETTES = {
  light: { stone: '#c2baa7', copper: '#84b5a4', glass: '#39484e', glow: '#39484e', roof: '#74746a', bronze: '#49594e' },
  dark: { stone: '#7c7b72', copper: '#4d8174', glass: '#1c2a32', glow: '#edbc76', roof: '#43494a', bronze: '#344b46' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid foundation, no baked DEM or sea-level altitude.',
  attribution: 'Original procedural geometry. Mapped outline and parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '1939 Châteauesque hotel; 112.47 m tip and 110.64 m architectural height sourced; OSM outline and part levels retained. Roof dormers, gargoyles, window pitch, Renaissance arcade and canopy reconstructed approximately from photos. Both runtime placement modes await separate integration checks.',
};
