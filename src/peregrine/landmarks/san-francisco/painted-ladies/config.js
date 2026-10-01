// Painted Ladies ("Postcard Row"), 710-722 Steiner Street, Alamo Square, San Francisco.
// Seven Queen Anne / Italianate Victorian row houses on the east side of Steiner Street (the
// west-facing fronts look across the street to Alamo Square). 710-720 are the six gabled
// "Painted Ladies" built 1892-1896 for developer Matthew Kavanaugh; 722 is his own 1892 corner
// mansion with the hipped roof. Facts and estimates are itemised in
// docs/3d-san-francisco-painted-ladies.md; the short version: seven footprints from OSM ways
// (710-722 Steiner), heights from the OSM `height` tags (12 m gabled, 13 m hipped), facade layout
// and colours read from photographs, the stepping down the slope estimated.
export const SPEC = {
  id: 'painted-ladies', name: 'Painted Ladies (Postcard Row)', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-122.432745, 37.776272], // area centroid of the seven OSM house outlines
  height: 15.1, // m: the tallest chimney, on 710 at the high (south) end of the stepped row
  padM: 34, // terrain pad radius, m: the row is 53 m long and 16 m deep, stairs reach 3 m past the front
  frontageBearing: 261, // the fronts face west by south (compass bearing of the outward normal), toward the park
  streetDeg: 9.05, // the Steiner Street grid is rotated 9.05 deg from north (front edges of all seven outlines)
};
// Same keys in both themes. Seven body colours are shared by name: sage (720), celadon (718), yellow
// (716), rose (714), blue (712), cream (710) and navy (722); brick is the red of 716's gable panels
// and 714's rust roof; trim is the cream-white paint; base is the stucco of the garage level and
// chimneys; glow is a lit window at night.
export const PALETTES = {
  light: {
    navy: '#43547a', sage: '#bdb27a', celadon: '#98b1a7', yellow: '#e8cd85', rose: '#b88d7c',
    blue: '#a8c0da', cream: '#e8dcc0', trim: '#f6f1e4', roof: '#58534f', brick: '#80453a', base: '#bdb5a3',
    glass: '#3f4b57', glow: '#566370',
  },
  dark: {
    navy: '#2c3852', sage: '#706b48', celadon: '#5d726a', yellow: '#9a8a58', rose: '#76564b',
    blue: '#677a8e', cream: '#9d9580', trim: '#aaa699', roof: '#2e2c2d', brick: '#573027', base: '#6d685e',
    glass: '#1d252d', glow: '#ffcf8a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The row steps up the Steiner Street slope toward the south in 0.25 m terraces (710 stands 1.5 m above 722), each house on its own stucco foundation that reaches y=0.',
  attribution: 'Original procedural mesh. Mapped footprints (c) OpenStreetMap contributors (ODbL 1.0), ways 261412887, 261412899, 261412879, 261412894, 261412900, 261412895, 261412896; https://www.openstreetmap.org/copyright',
  note: 'Seven outlines and the 12 m / 13 m heights are mapped; the storey heights, bay and porch positions, gable ornament and paint colours are read from photographs and are approximate (about 0.3 m). The stepping down the street (0.25 m per house, 1.5 m in all) is estimated. Stairs project up to 2.6 m past the mapped front line. Back elevations, side walls and roofs behind the gables are simplified; decorative trim is suggested, not copied.',
};
