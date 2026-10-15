// Stade de France, original 1998 roof, unbranded football configuration.
export const SPEC = {
  id: 'stade-de-france', name: 'Stade de France', kind: 'building', ready: true,
  origin: [2.36013, 48.92447], height: 50, padM: 172, frontageBearing: 170,
};
export const PALETTES = {
  light: { concrete:'#aeb1ad', recess:'#454e50', roof:'#d5d8d5', glazing:'#8fa5a5', mast:'#c3cdcd', stay:'#858f91', seats:'#78899a', field:'#507457', light:'#c4d0ca' },
  dark: { concrete:'#596975', recess:'#26353f', roof:'#84969d', glazing:'#536e7a', mast:'#98aeb8', stay:'#647f8d', seats:'#455968', field:'#344e43', light:'#e4e6cf' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local parvis grade y=0. Roof at 35 m and needle tips at 50 m; published pitch-relative heights use an estimated 11 m sunken pitch offset. No terrain baked in.',
  attribution: 'Original procedural geometry by Codriver. Mapped outline and mast positions © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '1998 suspended roof with 18 needles, opaque annulus and tinted inner skylight; 3 seating tiers and 18 monumental stairs. Roof thickness, stair shapes and concourse levels estimated. Pitch represented at grade for standalone display; real excavated pitch omitted.',
};
