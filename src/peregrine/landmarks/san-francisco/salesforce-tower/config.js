// Salesforce Tower, 415 Mission Street, San Francisco (Pelli Clarke Pelli, 2018).
// Height 326 m architectural, roof 296 m, 61 storeys: Wikipedia and OSM (way 431972186, height=326,
// building:levels=61) agree. The plan is mapped: a rounded square, half-side 26.5 m, corner radius 14.3 m,
// whose sides are parallel to the SoMa street grid (Mission Street 45.2, Fremont and First 135.2 degrees).
// The rest (taper law, floor pitch, fin sizes, crown) is documented in docs/3d-san-francisco-salesforce-tower.md.
export const SPEC = {
  id: 'salesforce-tower', name: 'Salesforce Tower', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the mapped outline's best-fit rounded square (not the vertex mean, because the outline has a small bump).
  origin: [-122.39693, 37.789776],
  height: 326, // m to the top of the crown screen
  padM: 55,
  // Outward bearing (degrees from true north) of the Mission Street frontage: Mission lies north-west of the tower.
  frontageBearing: 316,
  // Bearing of the plan's u axis, fitted to the mapped outline (46.2) and the street grid (45.2). Baked into the geometry.
  planBearingDeg: 45.7,
  roofY: 296, // occupied roof deck (970 ft); the crown screen stands on it up to 326 m (1,070 ft)
  lobbyY: 9, // top of the recessed glass lobby; the first sunshade line
  floorPitch: 4.4, // m between sunshade lines (estimated: 66 lines to the roof, 61 occupied storeys plus plant)
  sunshadeOut: 0.7, // m the sunshades and fins stand proud of the glass (Wikipedia: up to two feet)
  // The envelope (glass plus fins) of a floor: half-side and corner radius, one smooth law from the base to the top.
  plan: {
    baseHalf: 26.45, baseRadius: 14.3, // mapped (fit 26.5 to 26.6, trimmed so the fins stay inside the outline)
    // Width relative to the base: 1 - (1 - topWidth) * ((y - taperStartY) / (height - taperStartY)) ^ taperPower, measured by edge
    // detection on a telephoto photograph (Ina Coolbrith Park) and checked against a second one (Sacramento and Davis Street):
    // a prism to about 170 m, 0.87 at 259 m, 0.74 at 292 m, 0.59 at 317 m, 0.55 at the 326 m rim. One law: no kink at the roof.
    taperStartY: 170, taperPower: 2.5, topWidth: 0.55,
    // Corner radius / half-side: 0.54 at the base (mapped), 0.85 at the top; the corners round more toward the top.
    topRho: 0.85, rhoPower: 3,
  },
};

// Pearl-white aluminium fins and sunshades over blue-grey glass. `glow` is the lit offices at night (it reads as glass by
// day) and `light` is the inward-facing LED art of the crown ("Day for Night"); both are drawn unshaded.
export const PALETTES = {
  light: {
    glass: '#6c88a4', fin: '#f1f3f4', glow: '#4f6f8f', light: '#e8eef2', roof: '#6f7478', metal: '#9ba2a7',
  },
  dark: {
    glass: '#314c66', fin: '#8693a0', glow: '#e3bd82', light: '#cfe7ff', roof: '#383d42', metal: '#59616a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The lobby floor is y=0; the plaza, the fifth-floor bridge to the Transit Center and the below-grade levels are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height, storey count, plan size, corner radius and orientation follow OSM and the street grid; the taper law, floor pitch, fin sizes, the glass colour and the crown lattice are estimated from photographs. The crown LED art is shown as inward-facing light bands, not the real pixel layout.',
};
