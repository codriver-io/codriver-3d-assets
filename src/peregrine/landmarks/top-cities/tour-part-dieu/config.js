// Original procedural Tour Part-Dieu, Lyon, completed 1977; present exterior.
export const SPEC = {
  id: 'tour-part-dieu', name: "Tour Part-Dieu (le Crayon)", kind: 'building',
  ready: true,
  origin: [4.85375495, 45.7610615], // centre of the mapped shell's bounds
  height: 165, padM: 25, frontageBearing: 270,
  radius: 22.05, shoulderY: 141.9, columns: 71,
};
export const PALETTES = {
  light: { terracotta: '#ae6b49', rib: '#cc9c77', glass: '#374b5d', glow: '#405268', roof: '#344451', metal: '#828589', bronze: '#504439' },
  dark: { terracotta: '#563b30', rib: '#80624c', glass: '#172837', glow: '#dcb780', roof: '#1c2b3b', metal: '#536270', bronze: '#302c29' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0; rigid tower foundation, no terrain, absolute altitude or latitude stretch baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '165 m overall height and 71 perimeter columns: Ville de Lyon. OSM shell 141.9 m and glass pyramid 23 m; 44 m diameter corroborated by the photographed entrance plaque. Window/reveal sizes, storey distribution, crown glazing grid and entrance position estimated from photographs. Opaque glazing; signage, interiors and adjoining low office annex omitted. Rotation of the square roof is baked from its OSM corners. Both placement modes require separate app verification.',
};
