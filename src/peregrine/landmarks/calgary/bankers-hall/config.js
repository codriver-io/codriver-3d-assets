// Bankers Hall, 855 2 Street SW, Calgary: twin 52-storey office towers (East 1989, West 2000; Cohos Evamy /
// Design Dialog, structural engineers Jablonsky, Ast and Partners) on a shared four-level retail podium.
// Sourced: 197 m / 52 storeys for both towers (OSM ways 807001350 and 294875872, Wikipedia, Skyscraper Center),
// the plan of the two towers and of the podium parts (OpenStreetMap), the peaked metal crowns with a pedimented
// glass slot, the pink-tan stone and glass grid, the stepped upper shafts (photographs). Estimated: the floor
// pitch, window sizes, tier heights, crown height and slope, podium heights, mast heights, the glass roof over the
// galleria. See docs/3d-calgary-bankers-hall.md.
export const SPEC = {
  id: 'bankers-hall', name: 'Bankers Hall', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: [-114.069122, 51.045251], // centroid of the mapped complex outline (OSM way 548390399)
  height: 197, // mast tips above the crowns (the OSM / Wikipedia roof figure)
  padM: 74, // complex about 114 x 87 m; the farthest footprint corner is 70 m from the origin
  frontageBearing: 92, // the East tower's face on 2 Street SW looks east; the plan is baked 2.4-2.7 degrees off the compass
};

// Heights in local metres above flat-map grade (y = 0 is the street level of the mapped footprint).
export const DESIGN = {
  podium: { p4: 17.5, p5: 21.5, roof: 13.5 }, // 4, 5 and 3 levels of about 4.4 m (OSM building:levels)
  shaftTop: 173, // top of the 46 office floors, base of the crown (estimated)
  tiers: [116, 134, 158, 173], // roof heights of the stepped north end, from the very end to the full shaft
  cuts: [0, 3, 7, 15], // metres back from the main rectangle's north end where each tier starts
  crownH: 21, // eave to flat top (estimated from photographs: about 0.6 of the shaft width)
  crownInset: 1.5, // eave set back from the shaft walls
  topInset: 10.5, // flat top set back from the eave
  mast: 197, // sourced roof height, taken to the mast tips
  floor0: 8, // first typical floor above the double-height lobby
  pitch: 3.667, // floor to floor: (173 - 8) / 45
  rows: 45,
};

export const PALETTES = {
  light: {
    stone: '#8e7b6d', glass: '#9aa1a6', glow: '#8f969a', light: '#b9c8d0', lamp: '#d4473b', crown: '#b79f5e', silver: '#c6ccd2', metal: '#4f4733', podium: '#6b5d54', roof: '#6f6c68',
  },
  dark: {
    stone: '#5c5049', glass: '#262c33', glow: '#f3c46c', light: '#eef2f4', lamp: '#ff3b2f', crown: '#4a4430', silver: '#4b525a', metal: '#35322a', podium: '#3b3430', roof: '#3a3836',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude (downtown Calgary stands about 1,045 m above sea level). The mast tips at 197 m are above this local grade.',
  attribution: 'Original procedural mesh. Mapped footprints and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan of both towers and of the podium parts, the 197 m / 52-level height and the 4/5/3-level podium counts are mapped (OpenStreetMap) or sourced; the floor pitch, window layout and lit-window pattern, the stepped tier heights, the crown height, slope and the pedimented slot, the podium level height and glazing, the glass roof over the galleria and the masts are estimates from published photographs. The West Parkade, the Plus-15 bridges and the street furniture are not modelled.',
};
