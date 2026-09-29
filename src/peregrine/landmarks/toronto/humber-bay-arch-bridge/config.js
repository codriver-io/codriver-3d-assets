import { DIM } from './humber-bay-arch-bridge-site.js';

// Humber Bay Arch Bridge, 1994 (Montgomery Sisam Architects with Delcan): the
// Martin Goodman Trail's foot and cycle bridge over the mouth of the Humber River.
// Free-standing: it carries no road, so there is no footprint to replace and the
// layer only needs a terrain pad along its span.
export const SPEC = {
  id: 'humber-bay-arch-bridge', name: 'Humber Bay Arch Bridge', kind: 'bridge',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-79.471266, 43.63187], // mid-span, from the middle of OSM way 691705308 (the mapped deck outline)
  height: Math.round(DIM.topY * 10) / 10, // top of the rib pipes at the crown, above the flat-map datum
  padM: 100, // half the model's length (139 m bridge + ramps), the terrain pad radius
  frontageBearing: 31.6, // bearing of the bridge axis, south-west end to north-east end (OSM way 691705308, principal axis 31.63)
  footprintless: true, // no OSM extrusion to replace: the model stands on its own
};

// Same keys in both themes. paint = white steel, deck = paved path, girder = dark edge beams and
// recesses, steel = stainless hangers, rails and fittings, concrete = board-formed abutments.
export const PALETTES = {
  light: { paint: '#eef0ee', concrete: '#a7a8a2', deck: '#b8b6ad', steel: '#a9b0b4', girder: '#565c61' },
  dark: { paint: '#aeb7bd', concrete: '#6c7379', deck: '#59616a', steel: '#7c858b', girder: '#31373c' },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (water level); the paving surface is 4.5 m above it. No absolute altitude, no terrain or sea level baked in.',
  attribution: 'Original procedural mesh. Mapped location © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Sourced: 139 m overall, 100 m clear span, two 1.2 m steel-pipe ribs, 44 stainless hangers of 50 mm, 21.3 m rise above grade. Estimated from photographs: deck height above water, deck and rib widths, rib lean, the truss pattern between the ribs, abutment and pylon detail, and the ramps that bring a deck 4.5 m up down to the flat map.',
};
