// The Humber Bay Arch Bridge is free-standing: it carries no road and replaces no
// provider building, so there are no footprint rings to hollow out (config.js sets
// `footprintless`). OSM_WAYS records the mapped ways that fixed its anchor and bearing.
export const FOOTPRINTS = [];
export const OSM_WAYS = [
  { id: 691705308, type: 'way', note: 'man_made=bridge, bridge:structure=arch: the mapped deck outline (~102 m long, 6.7 m wide at mid-span). Mid-point = model origin, principal axis = bearing 31.6°.' },
  { id: 33398082, type: 'way', note: 'highway=cycleway, bridge=yes (Waterfront Recreational Trail / Martin Goodman Trail): the ~131 m trail line on the bridge, drawn by the provider itself.' },
];
