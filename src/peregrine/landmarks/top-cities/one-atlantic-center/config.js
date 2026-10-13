// Johnson/Burgee and Heery, 1987; 250 m / 50 floors. Crown tier heights are photo estimates.
export const SPEC = {
  id: 'one-atlantic-center', name: 'One Atlantic Center', kind: 'building', ready: true,
  origin: [-84.38736845, 33.7870797], height: 250, padM: 39, frontageBearing: 89.8,
  // North edge: [-84.3875279,33.787313] -> [-84.387206,33.7873122].
  // Bearing 90.17 degrees; mapped coordinates bake this orientation once.
  rotationDeg: -0.17,
};
export const PALETTES = {
  light: { stone: '#ac9485', trim: '#baa495', glass: '#293b40', light: '#314348', copper: '#3f6867', glow: '#bcaa64' },
  dark: { stone: '#655a57', trim: '#89796b', glass: '#17252d', light: '#b0a17a', copper: '#28464a', glow: '#ecd894' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local pavement datum y=0; no terrain height or geographic stretch baked into the asset.',
  attribution: 'Original procedural mesh by Codriver. Mapped envelope and parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: 250 m, 50 storeys, 1987, pink Spanish granite, copper pyramid and gold peak. Mapped: 52 m stepped envelope and 33 m central roof part. Estimated: facade bays, floor heights, 198–218 m Gothic crown, 218–242.5 m pyramid, open lantern and finial to 250 m. Adjacent parking decks, landscape and separate buildings are omitted. Cityscape and Full 3D world not tested; integration is checked separately.',
};
