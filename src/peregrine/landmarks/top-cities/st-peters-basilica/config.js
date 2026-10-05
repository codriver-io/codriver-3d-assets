// Present basilica, Vatican City; anchor is the mapped dome axis.
export const SPEC = {
  id: 'st-peters-basilica', name: "St. Peter's Basilica", kind: 'building', ready: true,
  origin: [12.453372, 41.902166], height: 136.57, padM: 145,
  frontageBearing: 89.45, rotationDeg: 0.55,
};
export const PALETTES = {
  light: { stone: '#d4cbb7', trim: '#e5ddc9', recess: '#a49881', roof: '#866856', dome: '#9aa3a7', glass: '#394348', lamp: '#b99a55', light: '#574938' },
  dark: { stone: '#73787c', trim: '#a4a39b', recess: '#41484e', roof: '#524a47', dome: '#8c979f', glass: '#15232f', lamp: '#e8cc82', light: '#e4c68b' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat grade y=0; a rigid basilica foundation, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural mesh by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height 136.57 m is published by the basilica; facade 114.69 m wide and 45.55 m high is published in the dossier/Wikipedia. Dome axis, outer envelope and bearing are mapped. Intermediate elevations, facade bay sizes, dome profile and sculpture are estimated from reference photographs. Piazza, Bernini colonnades and sacristy excluded. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
