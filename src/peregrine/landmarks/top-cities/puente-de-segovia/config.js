// Puente de Segovia, Madrid (Juan de Herrera, 1582-1584; rebuilt and widened to ~31 m after 1936).
// Nine semicircular granite arches, pointed upstream (north) and rounded downstream (south)
// cutwaters with stepped caps, level deck, plain parapet with ball finials over every pier.
export const SPEC = {
  id: 'puente-de-segovia', name: 'Puente de Segovia', kind: 'bridge', ready: true,
  // Midpoint of the mapped bridge carriageway (OSM way 380275223).
  origin: [-3.7228546, 40.4140243],
  // Bank-street grade frame: the deck is flush with the streets (0.10 m), the lamp lanterns top
  // out at 4.65 m and the arches hang 9.2 m below grade to the river (shown in Full 3D world only).
  height: 4.65, belowGradeM: 6.5,
  padM: 90,
  frontageBearing: 91.5,
  footprintless: true,
};
export const PALETTES = {
  light: { stone: '#a9a499', parapet: '#a9a499', trim: '#bdb8ab', ring: '#bdb8ab', base: '#7f7b71', joint: '#6f6b63', asphalt: '#5d6266', walk: '#a39e94', paint: '#e4e1d6', iron: '#2f3336', lamp: '#efe2bf' },
  dark: { stone: '#686c71', parapet: '#686c71', trim: '#7d8287', ring: '#7d8287', base: '#4a4f53', joint: '#3f4448', asphalt: '#303c47', walk: '#555c62', paint: '#b9bdbe', iron: '#3b4348', lamp: '#ffd38a' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the bank-street grade at both joints. Mapped span only, no approach ramps: the level road surface is 0.10 m above grade and the masonry hangs below it to the river 9.2 m down (stone, base, ring and joint materials are shown in Full 3D world only; flat Cityscape shows deck, walks, parapets, finials and lamps). Full 3D world bank-fit: the rigid structure rides a straight line between the DEM at the two joints and runs on into the terrain. No DEM, absolute altitude or latitude stretch baked in.',
  attribution: 'Original procedural geometry, Codriver. Mapped bridge outline and roadway © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Nine arches, central largest, decreasing symmetrically (es.wikipedia); ~31 m post-war width (miradormadrid.com; IGN PNOA orthophoto 31.1 m). Spans 13.0/12.6/11.1/9.6/8.4 m and 5.2 m piers fitted to the eight mapped cutwater pairs (all within 0.35 m). Springing, crown, the 9.3 m river-to-road rise, cutwater caps, parapet, finials and lamps estimated from photographs.',
};
