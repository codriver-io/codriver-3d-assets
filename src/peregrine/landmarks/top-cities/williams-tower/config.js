// Williams Tower, 1983 Johnson/Burgee tower; y=0 is local grade.
export const SPEC = {
  id: 'williams-tower', name: 'Williams Tower', kind: 'building', ready: true,
  origin: [-95.461325, 29.737264], height: 275, padM: 60,
  frontageBearing: 179.1,
};
export const DESIGN = { portalHeight: 26.8224, crownBase: 266, crownApex: 274, beaconTop: 275, floorPitch: 4.04 };
export const PALETTES = {
  light: { glass: '#42637d', glow: '#3b5870', mullion: '#8c9da8', stone: '#c4bdb0', roof: '#859099', light: '#a5b9cc' },
  dark: { glass: '#142638', glow: '#e6d8ab', mullion: '#485763', stone: '#687079', roof: '#4f5053', light: '#fff3d6' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local flat-map grade y=0; no terrain datum, absolute altitude or latitude stretch baked in.',
  attribution: 'Original procedural geometry. Mapped outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '275 m / 64 floors sourced; 197/226/233/250/261 m mapped setbacks and 8 m pyramidal crown. Portal height 88 ft from Hines. Window subdivision, illumination, portal width and beacon housing estimated. Static beacon lens; no rotating beam. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
