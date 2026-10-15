import { DIM, BEARING, ORIGIN, rect } from './tawatina-bridge-site.js';

// Tawatinâ Bridge (Arup design, Valley Line LRT, opened 2021 for the path and 2023 for trains): the extradosed
// concrete bridge over the North Saskatchewan River at Cloverdale, Edmonton. Two LRT tracks on an 11 m box girder,
// three spans (100 + 110 + 50 m), one pair of outward-leaning concrete pylons with 28 stays, and an 8 m shared-use
// path hung beneath the girder, its soffit carrying about 550 Indigenous art panels. It carries no road, so it is a
// free-standing model: no HD road fitting, no provider building to replace.
export const SPEC = {
  id: 'tawatina-bridge', name: 'Tawatinâ Bridge', kind: 'bridge',
  ready: true, // near/far GLBs exported, verified and catalogued
  origin: ORIGIN, // the centroid of the mapped outline (OSM way 570036448)
  height: DIM.deckTop + DIM.pylonRise, // m, the top of the pylons above the river-level datum
  padM: 135, // half the 261 m structure
  frontageBearing: BEARING, // bearing of the axis, south end to north end (OSM way 570036448)
  footprintless: true,
  // Full 3D world: the valley is far from flat (the north bank climbs ~19 m to the end of the structure), so a
  // disc would level the whole valley wall. Instead one small ring per footing is held where the pier or
  // abutment stands, relative to the river-level datum y = 0 (the south pier, in the floodplain). Offsets are
  // read from the AWS Terrarium tiles (see the doc) and are estimates: the lead checks them in world mode.
  terrainPad: {
    rings: [rect(-87.4, -75.4, -9, 9)], // south pier, y = 0
    refs: rect(-87.4, -75.4, -9, 9),
    datum: 'median', featherM: 10,
    terraces: [
      { ring: rect(22.6, 34.6, -10, 10), offsetM: 3.3, featherM: 8 }, // pylon pier on the north bank
      { ring: rect(-133, -125, -9, 9), offsetM: 1.8, featherM: 8 }, // south abutment
      // North bank: the DEM climbs 15-19 % (14 m at u = 100, 21 m at 140, 27 m at 172), faster than any guideway, so the
      // deck would sink into the hill. The mapped Valley Line (ways 650830876 / 672849774) runs at grade from the
      // abutment (u = 129) to u = 172, where the tunnel (way 1221895805 / 674098689) begins (the model's portal stands at 169.5, the toe of the hill: see PORTAL): the model holds that
      // stretch as an open cutting, the floor 0.15-1.6 m under the track slab, and the hill closes it at the portal. Rings
      // are 46 m wide because the near lattice is 22.7 m on the ground: two held node columns must straddle the axis,
      // or the TIN would lift the floor back to the DEM under the deck.
      { ring: rect(98, 132, -23, 23), offsetM: 13.6, featherM: 12 }, // north span end and abutment, deck 14.0
      { ring: rect(132, 150, -23, 23), offsetM: 12.75, featherM: 12 }, // deck 13.9 to 12.9 (5.5 % down)
      { ring: rect(150, 162, -23, 23), offsetM: 11.7, featherM: 12 }, // deck 12.9 to 12.3
      { ring: rect(162, 176, -23, 23), offsetM: 11.0, featherM: 12 }, // deck 12.3 to 11.5; the portal headwall stands at u = 169.5, where the hill's toe begins
    ],
  },
};

// Same keys in both themes. concrete = girder, pylons, piers and the path slab; steel = stay cables, hangers and
// masts; track = the rail slab; tunnel = the dark lining of the north portal's bore; rail = parapet, handrails, running rails and the overhead wires; timber and asphalt
// = the path surface; art1..art3 = the soffit art panels; lamp = the path luminaires (drawn unshaded).
export const PALETTES = {
  light: {
    concrete: '#bebcb3', steel: '#c8cdd0', track: '#6c6e6c', rail: '#8f979c', tunnel: '#15171a', timber: '#a47f57', asphalt: '#4e5256',
    art1: '#6e938e', art2: '#c8a064', art3: '#d9d5c7', lamp: '#fff2c4',
  },
  dark: {
    concrete: '#7e8387', steel: '#8e989f', track: '#404346', rail: '#656d73', tunnel: '#0b0c0e', timber: '#6b553a', asphalt: '#2e3236',
    art1: '#4b6b68', art2: '#8c6d44', art3: '#9b988f', lamp: '#ffd58a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local y = 0 is the river-level floodplain on the flat Peregrine basemap (the south pier). The deck top is 14 m above it, the pylon tops 30 m; the path ramps down to y = 0.5 at its two mapped ends. No absolute altitude baked in; Full 3D world holds each footing with a small terrain terrace.',
  attribution: 'Original procedural mesh. Mapped outline, track and path alignment © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: 261 m, three spans (100 + 110 + 50 m), 11 m upper deck, 3.5 m deep box girder, 8 m hung path, 28 stays, concrete extradosed design (Wikipedia, Structurae, Dialog). Mapped: axis 0.57 deg east of north, pylon pier at the Valley Line way break, tracks 4.5 m apart. Estimated from photographs: pylon height, lean and section, stay layout, haunch depth, deck height above the river, parapet and mast detail, the art-panel pattern (stylised colours, no artwork reproduced), ramp lengths of the path.',
};
