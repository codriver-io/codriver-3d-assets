// Completed 1987 Pei Cobb Freed tower; 625 ft = 190.5 m.
export const SPEC = {
  id: 'miami-tower', name: 'Miami Tower', kind: 'building', ready: true,
  origin: [-80.19143, 25.77219], height: 190.5, padM: 60, frontageBearing: 134,
};
export const PALETTES = {
  light: { glass: '#526b70', reflection: '#708485', light: '#d5d9d7', mullion: '#738486', stone: '#acb2ac', roof: '#8a9595', glow: '#77a0a7' },
  dark: { glass: '#202633', reflection: '#353744', light: '#ed74bc', mullion: '#424954', stone: '#505764', roof: '#303b47', glow: '#8ac8de' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0, metres east/up/south; no DEM, absolute altitude or Mercator stretch.',
  attribution: 'Original procedural geometry for Codriver. Mapped geography © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '625 ft architectural height, three mapped curved tiers and adjoining garage. Intermediate heights 74/115 m from OSM; top adjusted to 190.5 m published height. Facade pitch, podium height, station frontage and sky terrace are photo estimates. Magenta is one fixed night lighting state; actual LEDs change colour. App integration checked separately.',
};
