// St. Lawrence Market, South Market (93 Front Street East, Toronto).
// Origin: the mapped hall's rectangle centre, OSM way 24626769 (read 2026-09-29).
// The exported model is turned 17.13 degrees so its long axis sits in the mapped
// outline (Toronto's street grid), see st-lawrence-market-site.js.
export const SPEC = {
  id: 'st-lawrence-market', name: 'St. Lawrence Market', kind: 'building',
  ready: true, // near/far GLBs exported and verified (docs/3d-toronto-st-lawrence-market.md)
  origin: [-79.371554, 43.64869],
  height: 24.8, // top of the flue on the Front Street chimney; brick chimneys 22.9-23.6 m, hall ridge 21.2 m
  padM: 80,
  frontageBearing: 342.87, // outward normal of the Front Street facade (NNW)
  rotationDeg: 17.13,
};
// Same material keys in both themes. `glow` (hall windows and the lantern) and `sign`
// (gold lettering) are drawn unshaded by the layer: lit windows at night, signs always.
export const PALETTES = {
  light: {
    brick: '#a2604b', buff: '#c4b088', roof: '#5f504d', cladding: '#686354', copper: '#3f7f69',
    glass: '#50696e', glow: '#5b7a80', ink: '#2a3230', plaster: '#ebe8dc', sign: '#e1c977', concrete: '#aeada4',
  },
  dark: {
    brick: '#6f4036', buff: '#8b7d63', roof: '#403b3e', cladding: '#55524a', copper: '#2c5a4b',
    glass: '#2c3c42', glow: '#c79a52', ink: '#161b1a', plaster: '#a7a79c', sign: '#d8bb63', concrete: '#74746f',
  },
};
// Draw-call budget (docs/3d-toronto-st-lawrence-market.md): design names on the left, the exported material on the
// right. Near keeps all eleven (11 draws). Far folds the small look-alikes: the sill glass into the lit hall glazing, the
// gold lettering and the off-white fascia into buff, and the dark cladding into the roof brown, which leaves seven.
export const FOLD = {
  near: {},
  far: { glass: 'glow', sign: 'buff', plaster: 'buff', cladding: 'roof' },
};
/** The exported material for a design name at a detail level. */
export const materialFor = (name, detail) => FOLD[detail]?.[name] ?? name;

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The real site falls about one storey from Front Street to The Esplanade; the model keeps one flat grade and carries that fall as a solid base on the Front Street half and an open colonnade under the deck on the Esplanade half.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Hall rectangle, roof crown and lantern are mapped (OSM way 24626769 and its building parts). Storey heights, bay module, window and arch sizes, colours and the deck extent are estimated from public photographs. The North Market across Front Street is a separate 2025 building and is not modelled.',
};
