// Closed roof and end doors; metres above street/plaza grade.
export const SPEC = {
  id: 'att-stadium', name: 'AT&T Stadium', kind: 'building', ready: true,
  origin: [-97.09284, 32.74785], height: 73.8, padM: 210,
  frontageBearing: 69, axisAngle: 21 * Math.PI / 180,
  archSpan: 373.38, archWidth: 5.0292, archDepth: 10.668,
  doorWidth: 54.864, doorHeight: 36.576,
};
export const PALETTES = {
  light: { concrete: '#b9b8b1', glass: '#566369', door: '#5b7280', steel: '#b0b5b5', roof: '#c4c8c7', membrane: '#e0dfd5', seam: '#657077', glow: '#455b64' },
  dark: { concrete: '#626c76', glass: '#253b49', door: '#3c5667', steel: '#8398a8', roof: '#7b8e9b', membrane: '#a1acb2', seam: '#3d5260', glow: '#b6c8c7' },
};
export const MANIFEST = {
  elevationDatum: 'y=0 at local street/plaza grade; the field is 15.24 m lower. No absolute altitude or terrain baked in.',
  attribution: 'Original procedural mesh for Codriver; mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Closed roof. Published 373.38 m arch span, 5.03 m truss width, 10.67 m depth and 54.86 × 36.58 m doors. Arch crest 89.00 m above field minus 15.24 m field depression gives 73.76 m above grade. Roof curvature, canted wall, bays, support profiles and lighting estimated from photos. Rotation 21 degrees baked into geometry; OSM includes four arch-foot structures. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
