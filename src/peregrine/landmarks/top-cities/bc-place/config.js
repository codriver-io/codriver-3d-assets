// BC Place after its 2011 cable-supported roof renovation. Real metres, east/up/south.
export const SPEC = {
  id: 'bc-place', name: 'BC Place', kind: 'building', ready: true,
  origin: [-123.112006654, 49.276698485], height: 77.5, padM: 125,
  frontageBearing: 139.15, majorAxisDegrees: -40.851266,
  mastCount: 36, ringbeamY: 30, mastRise: 47.5,
};
export const PALETTES = {
  light: { concrete: '#b7b8b3', roof: '#eeeede', steel: '#e6ebeb', cable: '#69777a', glass: '#3c8a91', glow: '#528e95', seats: '#bc3037', field: '#477849', shadow: '#3a454a', paint: '#ecede1' },
  dark: { concrete: '#56636d', roof: '#aebeca', steel: '#c0d4df', cable: '#7e929f', glass: '#234756', glow: '#d940a0', seats: '#662d3f', field: '#29473d', shadow: '#223039', paint: '#b2c5c7' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat street grade y=0; rigid foundation, no terrain or sea-level elevation baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '2011 roof, shown open: 36 masts, 47.5 m above an estimated 30 m ringbeam; sourced 100 × 85 m retractable aperture. Roof profile, facade heights, cable routing, seats and colours estimated from references. Rotation already baked into exports.',
};
