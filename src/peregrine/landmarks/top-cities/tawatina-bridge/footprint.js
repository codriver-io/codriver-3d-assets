// The Tawatinâ Bridge is free-standing: it carries two LRT tracks and a path, replaces no provider building, so
// there are no footprint rings to hollow out (config.js sets `footprintless`). OSM_WAYS records the mapped ways
// that fixed its anchor, bearing, pier position and the hung path's extent.
export const FOOTPRINTS = [];
export const OSM_WAYS = [
  { id: 570036448, type: 'way', note: 'man_made=bridge, bridge:structure=cable-stayed, name=Tawatinâ Bridge: the mapped outline (259.8 m between end edges, 12.7 m wide). Centroid = model origin, end-edge midpoints = axis bearing 0.57 deg.' },
  { id: 1221895803, type: 'way', note: 'railway=light_rail bridge (Valley Line, west track) south of the pylon pier; way break at z = -28.6 m marks the pier.' },
  { id: 1221895804, type: 'way', note: 'railway=light_rail bridge (Valley Line, east track): fixes the 4.5 m track spacing.' },
  { id: 636427023, type: 'way', note: 'railway=light_rail bridge (Valley Line), the 100 m northern span.' },
  { id: 732161091, type: 'way', note: 'highway=cycleway, bridge=yes: the hung shared-use path (113 m south, 76 m north of the centre); drawn by the provider itself on the flat map.' },
];
