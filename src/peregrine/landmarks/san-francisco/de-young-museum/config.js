// de Young Museum, 50 Hagiwara Tea Garden Drive, Golden Gate Park · San Francisco, California: Herzog & de Meuron
// with Fong + Chan Architects, opened 15 October 2005. A long two-storey copper box with courtyards cut in, a huge
// upper volume cantilevered over the glazed entrance front, and the twisting Hamon Observation Tower (144 ft).
// See docs/3d-san-francisco-de-young-museum.md for the sources, the dimension table and what is estimated.
export const SPEC = {
  id: 'de-young-museum', name: 'de Young Museum', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Anchor: the area centroid of the mapped museum outline (OSM relation 1652482). Local grade y = 0 is the
  // plaza/garden level round the building; the sunken Music Concourse and the garden relief are not modelled.
  origin: [-122.4687173, 37.7714729],
  // Highest point: the top of the Hamon Tower cap, 144 ft (43.9 m; the museum and Wikipedia). OSM's stacked
  // tower parts reach 51 m, which the photographs and the 144 ft figure do not support.
  height: 44,
  // Disc round the origin that Full 3D world flattens: the farthest mapped corner (the tower cap overhang) is
  // about 92 m out; the entrance forecourt and the garden courtyards are inside it.
  padM: 96,
  // The entrance front (the long wall under the cantilever) looks south-east, towards the Music Concourse:
  // compass bearing 138 deg. The museum's long axis runs north-east (bearing 48 deg). Rotation is baked in.
  frontageBearing: 138,
};

// Same keys in light and dark. Dark is the night look: dimmer copper (walls lifted 25% after review); `glow` is the lit entrance/cafe glazing and
// the observation level (drawn unshaded by the layer; by day it reads as dark glass).
export const PALETTES = {
  light: {
    copper: '#664a44', copperWarm: '#6e5049', copperDark: '#5e443f',
    roof: '#3b2f2b', roofPanel: '#413530', roofPatina: '#363f39', soffit: '#352a26',
    tower: '#554b45', towerRib: '#6a6057', glass: '#1d2a30', glow: '#2a3a41',
  },
  dark: {
    copper: '#5b423c', copperWarm: '#644841', copperDark: '#533b36',
    roof: '#392d28', roofPanel: '#40332d', roofPatina: '#313a35', soffit: '#2a2220',
    tower: '#51453f', towerRib: '#645a50', glass: '#111b20', glow: '#b08a4a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the plaza and garden level round the museum); no absolute altitude. The sunken Music Concourse, the garden relief and the planting are not modelled.',
  attribution: 'Original procedural mesh. Mapped museum outline, courtyards and Hamon Tower slabs © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Outline, courtyard cut-outs, the 13 m roof, the tower slab positions and their 47.8 to 78.6 degree twist come from OSM (relation 1652482 and the eight Hamon Tower building:parts); the 44 m tower height is the published 144 ft (OSM stacks to 51 m, which is not used). The cantilever depth and soffit height, the glazing, entrance and slit-window positions and the panel pattern are estimated from photographs; the perforated and dimpled copper is a pattern of flat tone panels, not geometry. No trees, interior, tower stair gantries or Music Concourse.',
};
