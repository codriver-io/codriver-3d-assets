// Original 1973 dark-glass exterior, rather than the proposed refurbishment.
export const SPEC = {
  id: 'tour-montparnasse', name: 'Tour Montparnasse', kind: 'building', ready: true,
  origin: [2.32197945, 48.842112875],
  height: 214, roofY: 210, shaftY: 209.2, lobbyY: 5.6,
  padM: 38, frontageBearing: 129, axisBearing: 39,
  halfLength: 30.5, halfWidth: 19.2, endHalfWidth: 12.5,
};
export const PALETTES = {
  light: { frame: '#292a2b', bronze: '#45403a', glass: '#363b3d', glow: '#3b3e3d', roof: '#a29d92', metal: '#737776' },
  dark: { frame: '#15191d', bronze: '#292924', glass: '#182128', glow: '#bbaa7e', roof: '#515a60', metal: '#69777c' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; metres east/up/south. No terrain or Mercator scale baked into the asset.',
  attribution: 'Original procedural model, Codriver. Mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1973 bronze-glass exterior. Published roof height 210 m; mast top 214 m, roof access hut, mullion pitch and lobby detailing are estimated. Rotation of 39 degrees east of north is already baked in. Shopping complex excluded. Cityscape and Full 3D world integration not tested yet.',
};
