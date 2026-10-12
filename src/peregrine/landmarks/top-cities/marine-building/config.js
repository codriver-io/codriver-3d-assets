export const SPEC = {
  id: 'marine-building', name: 'Marine Building', kind: 'building', ready: true,
  origin: [-123.11710198836293, 49.287513755091574], height: 98, padM: 40,
  frontageBearing: 134.55,
};
export const PALETTES = {
  light: { brick: '#ab9271', stone: '#d3cbb5', green: '#8d9e8b', glass: '#3d5355', glow: '#3d5355', bronze: '#85704c', roof: '#8b8b7d' },
  dark: { brick: '#655e53', stone: '#8e9189', green: '#637c74', glass: '#273941', glow: '#baa278', bronze: '#82734f', roof: '#555f60' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; real metres east/up/south, no terrain or Mercator stretch baked in.',
  attribution: 'Original procedural mesh. Mapped plan © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1930 Art Deco exterior. Mapped setbacks at 26/40/68/74/80/88 m; hipped crown to 96 m and finial to 98 m. Grouped pale piers, stepped pale/green crown friezes and carved portal. Low north podium, facade bays, marine reliefs and portal dimensions are photo estimates. Rotation baked into mapped rings. Cityscape and Full 3D world not tested; integration checked separately.',
};
