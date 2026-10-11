// Vikingskipet (Hamar Olympiahall), Åkersvikvegen 1, Hamar. Opened 19 December 1992
// for the 1994 Winter Olympics speed-skating; architects Biong & Biong and Niels Torp.
// An upturned Viking-ship hull: silver-grey ribbed cladding over a glazed skirt, beside Åkersvika.
// Sourced: length 250 m, width 110 m, 36 m clear height (Store norske leksikon / Hamar Olympiske Anlegg);
// Structurae lists 260 × 96 × 35 m (96 m is the glulam arch span). The mesh crown is 35 m.
// See docs/3d-top-cities-vikingskipet.md.
export const SPEC = {
  id: 'vikingskipet',
  name: 'Vikingskipet (Hamar Olympic Hall)',
  kind: 'building',
  ready: true,
  // Area centroid of OSM way 28287844, the sports-hall outline.
  origin: [11.10098302, 60.79298595],
  height: 35, // m to the keel batten at midships
  padM: 145, // the lens is ~248 m on the diagonal; the filled Åkersvika site is treated as flat
  // The long side facing Åkersvikvegen (northwest). The keel runs 25° east of north.
  frontageBearing: 295,
};

export const PALETTES = {
  light: {
    hull: '#c2c8ce', // silver cladding; kept off white so the sheet lights do not clip it
    seam: '#2a3138', // shadow joints, mullions and the entrance porch
    concrete: '#8f8b80', // plinth
    light: '#5d7c90', // glazed skirt (unshaded). Dark enough to stay a band when the hull washes out
    glow: '#d5e4ee', // thin bright line under the eave
    door: '#1c2228', // entrance doors on the road side
  },
  dark: {
    hull: '#5c656d',
    seam: '#1a1f24',
    concrete: '#3e423c',
    light: '#e8b56b', // interior light through the glass
    glow: '#ffc48a',
    door: '#12161a',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the filled Åkersvika shore); no absolute altitude. The keel crown is 35 m over this grade.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan fitted inside OSM way 28287844 (about 254 × 105 m): modelled outer eaves 248 m × 102 m, which sits between the 96 m glulam span and the published 110 m overall width. Ridge 35 m is the published exterior/Structurae height; the 36 m figure is the clear height under the roof. Eave line, plank count, stem upturn, glass-skirt height and the road-side entrance recess are read from photographs. The 17 interior glulam arches are not modelled. The neighbouring building to the north and the X sculpture are separate and omitted.',
};
