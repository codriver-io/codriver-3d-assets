// Official dimensions + mapped/photo-derived frame; see docs/3d-stade-olympique.md.
export const STADE = {
  id: 'stade-olympique', name: 'Stade olympique + Tour de Montréal',
  origin: [-73.5516429, 45.5578149],
  length: 284, width: 245, height: 165,
  bearing: -10,
  modeledState: 'March 2026 — open central roof, completed replacement technical ring; simplified construction state',
};
const angle = STADE.bearing * Math.PI / 180, c = Math.cos(angle), s = Math.sin(angle);
// u = across the stadium, v = along its axis toward the tower (NNW).
export function stadePoint(u, y, v) { return [u * c + v * s, y, u * s - v * c]; }
export const STADE_PALETTES = {
  light: { concrete: '#d5d4c9', roof: '#72958b', glass: '#294752', rail: '#818b91', steel: '#424e55', museum: '#c1aa69', asphalt: '#555d63' },
  dark: { concrete: '#8d9da9', roof: '#426a65', glass: '#263e4d', rail: '#a3b3bd', steel: '#6e8897', museum: '#897c56', asphalt: '#303c47' },
};
