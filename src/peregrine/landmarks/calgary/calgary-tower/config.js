// Calgary Tower (formerly the Husky Tower), 101 9 Avenue SW, Calgary: W.G. Milne and A. Dale and Associates, 1968.
// Sourced: 190.8 m to the tip of the mast, roof 171 m, top floor 157.6 m; a free-standing concrete tower with
// a revolving restaurant and observation deck, the Olympic cauldron (gas flame, 1988) on the crown, a glass
// rotunda lobby added in 1990 and a glass-floor extension on the north side of the deck (2005). Mapped (OSM way
// 25719793 and its building:part ways): the 19 m-radius circle of the tower's foot, which sets the axis, the
// rotunda's plan and its three levels. Estimated from photographs: the shaft taper, the turret's profile and
// the crown. See docs/3d-calgary-calgary-tower.md.
export const SPEC = {
  id: 'calgary-tower', name: 'Calgary Tower', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // The tower's axis: the centre of the circle fitted to the mapped tower outline (way 25719793).
  origin: [-114.0631348, 51.0443015],
  height: 190.8, // to the tip of the mast
  padM: 22,      // covers the 18-19 m rotunda; downtown Calgary is flat here, no terrainPad
  frontageBearing: 0, // round plan: the tower has no front; the glass-floor extension looks north
  // A 190 m tower in a flat city is read from kilometres away: draw it from 6 km at zoom 12.5, and let the
  // detailed model take over within 450 m (the turret at 160 m is then well inside the view).
  rangeM: 6000, minZoom: 12.5, nearM: 450,
};
export const PALETTES = {
  light: {
    concrete: '#b4b1a4', white: '#e4e3dc', metal: '#aeb3b7', red: '#bf2638', brown: '#5b3b32',
    glass: '#1c2733', glow: '#232e3c', lamp: '#aeb3b7', light: '#ff3a30', // lamp: the cauldron's metal by day, orange flame only at night
  },
  dark: {
    concrete: '#6c7076', white: '#9aa1aa', metal: '#7d868e', red: '#8d2b35', brown: '#4a3733',
    glass: '#0e151d', glow: '#ffd58a', lamp: '#ffb347', light: '#ff4a3a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Calgary is at about 1,045 m above sea level, not baked in.',
  attribution: 'Original procedural mesh. Mapped footprint (the 19 m circle at the tower\'s foot) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: 190.8 m tip, 171 m roof, 157.6 m top floor. Mapped: the axis and the 19 m circle (rotunda). Estimated from photographs (about +-3% in width, +-2 m in height): the turret profile and its ~31 m diameter, the shaft taper (10 m under the turret, ~15 m at the foot), the crown, the mast; guessed: the rotunda height (9.6 m) and its cone pitch, the glass-floor extension, the roof aviation lights. The flame is shown lit (the real one burns on special occasions). Interior, the Tower Centre mall beside the rotunda, the 15 Plus skyway and site furniture are not modelled.',
};
