// LeVeque Tower, restored architectural envelope; temporary scaffolding omitted.
export const SPEC = {
  id: 'leveque-tower', name: 'LeVeque Tower', kind: 'building', ready: true,
  origin: [-83.00209, 39.96238], height: 189.29, architecturalHeight: 169.29,
  padM: 45, frontageBearing: 188.3, bearing: 8.3,
};
export const PALETTES = {
  light: { stone: '#d6cfb7', recess: '#b8b19f', lamp: '#d6cfb7', glass: '#344047', glow: '#485459', copper: '#548278', metal: '#646b70', sign: '#952e29' },
  dark: { stone: '#555d68', recess: '#414b59', lamp: '#dfc29b', glass: '#1c2b3b', glow: '#edcc8c', copper: '#344a53', metal: '#526273', sign: '#e75442' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0; rigid base, no terrain/sea-level datum or Mercator stretch baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '169.29 m architectural height sourced; antenna tip 189.29 m, setback heights, fenestration and ornaments estimated from photographs. Current surviving reliefs simplified; temporary scaffolding omitted. Rotation baked once from mapped street edges.',
};
