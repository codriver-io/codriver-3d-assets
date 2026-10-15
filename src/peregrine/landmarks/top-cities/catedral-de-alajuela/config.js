// Dimensions are photo estimates fitted to OSM way 391297577, not a survey.
export const SPEC = {
  id: 'catedral-de-alajuela', name: 'Catedral de Alajuela', kind: 'building',
  ready: true, origin: [-84.21302806, 10.01673469],
  height: 35.55, padM: 40, frontageBearing: 254, rotationDeg: -74,
};
export const PALETTES = {
  light: { wall: '#e0ded3', trim: '#bcb9a9', roof: '#8e4144', seam: '#843c3e', glass: '#263b38', door: '#49382e', metal: '#776947' },
  dark: { wall: '#747e81', trim: '#6e787a', roof: '#593239', seam: '#533036', glass: '#334a47', door: '#302d2b', metal: '#8d8668' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid grade y=0; no absolute altitude or terrain baked into GLBs.',
  attribution: 'Original procedural mesh, Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '1863 neoclassical cathedral; red dome with broad flat standing-seam colour bands, drum windows/oculi, two-stage white bell turrets and columned porticoes. Vertical dimensions and details estimated from attributed photographs; mapped outer envelope and bearing from OSM way 391297577. Cityscape and Full 3D world static app views captured in the g7 fix evidence; lifecycle and terrain stress cases not tested.',
};
