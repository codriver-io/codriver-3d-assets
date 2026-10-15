// Palais Bourbon (Assemblée nationale), Paris, France.
// Placement from OSM building:part rings (dossier 2026-10-15); the north front's frame is fitted to the
// twelve mapped column centres in palais-bourbon-parts.js (bearing of the colonnade 115.5 deg, front facing 25.5 deg).
export const SPEC = {
  id: 'palais-bourbon', name: "Palais Bourbon (Assemblée nationale)", kind: 'building',
  ready: true,
  origin: [2.31873, 48.86173], // centre of the mapped part rings' bounding box
  height: 27.4, // m to the pediment apex (OSM height of the portico gable, 18.4 m column tops + 2.2 m entablature + 6.8 m pediment)
  padM: 85,
  frontageBearing: 25.5, // the Seine front, the 12-column portico, faces north-north-east
};
export const PALETTES = {
  light: { stone: '#e4dece', wing: '#a99e88', steps: '#bdb6a5', slate: '#6a7076', glass: '#8fa3ab', window: '#464d54', relief: '#e6e0cf', door: '#87a9c7' },
  dark: { stone: '#a1a4a2', wing: '#666963', steps: '#6f7377', slate: '#3b4046', glass: '#53656f', window: '#262b30', relief: '#a0a19f', door: '#4f6a82' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude (the Seine bank is level here).',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'OSM heights and roof shapes for the palace parts, the twelve mapped column positions and the 4.6 m stylobate/steps. Estimated: column entasis and capital profile, the entablature split, the pediment figure group (shallow grouped silhouettes and frieze lettering), the six statues, window grids, mansard dormers, the south colonnade (four mapped columns, door and clock attic). The palace roofs are simplified to the mapped parts; chimneys and the flag are omitted.',
};
