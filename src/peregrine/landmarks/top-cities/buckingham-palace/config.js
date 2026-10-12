// Buckingham Palace: present east front (Aston Webb, 1913), quadrangle and garden wings.
export const SPEC = {
  id: 'buckingham-palace', name: 'Buckingham Palace', kind: 'building', ready: true,
  origin: [-0.14194, 51.50083], height: 33, padM: 150, frontageBearing: 57,
  bodyHeight: 24, facadeWidth: 108,
};
export const PALETTES = {
  light: { stone:'#d5d1c5', oldstone:'#bbae95', trim:'#e4dfd2', roof:'#646c68', glass:'#404b50', glow:'#51575a', metal:'#4b5050', flag:'#783b42' },
  dark: { stone:'#777e86', oldstone:'#727365', trim:'#91969a', roof:'#38434a', glass:'#293a45', glow:'#c49b63', metal:'#424d58', flag:'#573640' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; no DEM or absolute altitude baked into the reusable mesh.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '108 m east-front width and 24 m principal roofline sourced; mapped wings and open quadrangle. Bay sizes, pediments, roof pitches and 33 m flagpole tip estimated from photographs. Rotation -57 degrees baked into east/up/south geometry. Victoria Memorial and freestanding gates excluded. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
