// Original paired tower authoring; dimensions and the OSM/published tilt discrepancy are documented.
export const SPEC = {
  id: 'puerta-de-europa', name: 'Puerta de Europa (KIO Towers)', kind: 'building',
  ready: true,
  origin: [-3.68911225135, 40.46686163068],
  height: 114.9, roofHeight: 114.7, width: 35, depth: 35, levels: 26, leanDeg: 14.3,
  padM: 116, frontageBearing: 191.5,
  towers: [
    { name: 'CaixaBank', center: [-87.91119341, -18.47386551], gridDeg: 11.70627233, lean: 1 },
    { name: 'REALIA', center: [87.91119341, 18.47386551], gridDeg: 11.26724158, lean: -1 },
  ],
};
export const PALETTES = {
  light: { glass: '#263b4a', spandrel: '#172634', mullion: '#563b38', metal: '#9da7ae', roof: '#484e54', light: '#314653', sign: '#e4e6db', blue: '#145f9a', red: '#a53b39' },
  dark: { glass: '#101d2b', spandrel: '#0a141e', mullion: '#292126', metal: '#626f7f', roof: '#242d39', light: '#e9c479', sign: '#e3ebd2', blue: '#154a7c', red: '#853436' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid lobby grade y=0; no sea-level, terrain or latitude stretch baked into the mesh.',
  attribution: 'Original procedural mesh. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '35 m square bases and 14.3 degree lean from Madrid tourism; OSM 114.7 m roof plus 0.2 m heliport. Mapped 26.4 m floor displacement differs from the published 29.2 m lean: replacement envelopes include the corrected upper overhang. Facade modules, bracing widths, lobby and rooftop fittings are estimates; current tenant lettering is stylized geometry. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
