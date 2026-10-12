// Solomiya Krushelnytska National Opera: present exterior, original 1900 building.
export const SPEC = {
  id: 'lviv-national-opera', name: 'Lviv National Opera', kind: 'building',
  ready: true, origin: [24.02623964019201, 49.84404123377512], height: 43, padM: 50,
  frontageBearing: 159.62842875984187, rotation: 20.371571240158126,
};
export const PALETTES = {
  light: { stone: '#d4c9ad', roof: '#596b60', bronze: '#466857', glass: '#33433f', glow: '#42473d', gold: '#b99e55' },
  dark: { stone: '#868474', roof: '#35453f', bronze: '#35584a', glass: '#293b41', glow: '#d9ae65', gold: '#a49059' },
};
export const MANIFEST = {
  elevationDatum: 'Local entrance grade y=0; rigid metric foundation, no terrain height baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped envelope © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Mapped footprint approximately 43 × 85 m; published 45 × 95 m base is a separate approximate envelope, not stretched to fit. Bronze front acroterions follow the sourced 6 m height. Other vertical levels, dome and ornament sizes are photo estimates. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
