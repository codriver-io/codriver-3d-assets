// Modern permanent form; temporary 2025–26 restoration scaffolding is omitted.
// SWR and LAP: 217 m tip, 15 m / 12 m cabin at 138–150 m, 10.8 -> 5.04 m shaft.
const origin = [9.1901683034, 48.7557595897];
// Literal local geographic conversion at the mapped tower centre (no runtime imports).
const geo = (x, z) => [origin[0] + x / 73386, origin[1] - z / 111319];
const pad = Array.from({ length: 33 }, (_, i) => geo(12 * Math.cos(i * Math.PI / 16), 12 * Math.sin(i * Math.PI / 16)));
export const SPEC = {
  id: 'fernsehturm-stuttgart', name: 'Fernsehturm Stuttgart', kind: 'building', ready: true,
  origin, height: 217, padM: 12, frontageBearing: 146,
  rangeM: 6500, minZoom: 12.5, nearM: 600,
  terrainPad: { rings: [pad], refs: [[0,0], [4,0], [-4,0], [0,4], [0,-4]].map(([x,z]) => geo(x,z)), datum: 'median', featherM: 10 },
};
export const PALETTES = {
  light: { concrete: '#c7c4b7', aluminium: '#dadbd7', dark: '#353d40', steel: '#89918e', red: '#aa403b', glow: '#334a50', light: '#c1473b' },
  dark: { concrete: '#646d73', aluminium: '#9aa4aa', dark: '#263239', steel: '#637582', red: '#79302e', glow: '#edca83', light: '#ff3e28' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid tower grade y=0; no absolute hill or terrain elevation is baked into the asset. Bounded median terrain pad requested; terrain integration is untested.',
  attribution: 'Original procedural mesh for Codriver. Mapped frame and footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'SWR/LAP sourced overall height, shaft diameters and cabin dimensions; photographed taper, window divisions, parapets, dishes and antenna details are estimated. Adjacent entrance pavilion and offices remain provider-owned. Temporary restoration scaffolding, forest and interiors omitted.',
};
