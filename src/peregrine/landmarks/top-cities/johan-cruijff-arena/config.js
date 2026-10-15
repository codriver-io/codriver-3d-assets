// Johan Cruijff ArenA (Amsterdam ArenA until 2018), ArenA Boulevard 1, Amsterdam Zuidoost.
// Modelled with the roof CLOSED. Sourced: 75 m top of the structure (OSM height tag; the two roof
// arches), opened 1996, architect Rob Schuurman, 105 x 68 m pitch (OSM), retractable roof of two
// panels hung under two arched trusses. Mapped: the outer outline (OSM way 57853253) and the pitch
// (way 57853514), which fix the plan and the 151 degree long axis. Estimated: every height but the
// crown, the roof profile, the facade bands, the mast and truss sizes. See docs/3d-top-cities-johan-cruijff-arena.md.
export const SPEC = {
  id: 'johan-cruijff-arena', name: "Johan Cruijff ArenA", kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // The centre of the mapped pitch, which sits on the long axis of the bowl and the arches.
  origin: [4.941798, 52.314329],
  height: 75, padM: 150,
  // Bearing (clockwise from north) of the pitch's long axis, which the two roof arches span.
  frontageBearing: 151,
};
export const PALETTES = {
  light: {
    roof: '#a8afb4', roof_seam: '#7f888e', solar: '#2c3a52',
    concrete: '#d6d4cc', concrete_dark: '#8a8d90', metal: '#aeb4b8',
    glass: '#566d78', glow: '#3f535c', teal: '#6fa3a0', red: '#b8403b',
    truss: '#eceff0', light: '#fff1cf',
  },
  dark: {
    roof: '#7f8a93', roof_seam: '#5b656d', solar: '#1d2738',
    concrete: '#8d9299', concrete_dark: '#5b6065', metal: '#7d868d',
    glass: '#34495a', glow: '#d9a95e', teal: '#5a8e92', red: '#ff5a50',
    truss: '#b7c1c8', light: '#fff3d6',
  },
};
// Draw budget: near keeps all twelve materials; far folds the minor ones into their neighbours (eight draws; the lit ground-floor glazing joins the dark clerestory glass, so a far model has no glowing band at night).
export const FOLD = {
  near: {},
  far: { teal: 'concrete', metal: 'concrete_dark', roof_seam: 'concrete_dark', glow: 'glass' },
};
export const materialFor = (name, detail) => FOLD[detail]?.[name] ?? name;
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the stadium forecourt); no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Roof modelled closed. Plan and orientation come from the mapped outline and pitch; the 75 m crown is the OSM height tag. Every other height, the roof profile, facade bands, truss and mast sizes are estimates from photographs.',
};
