// Stedelijk Museum, Museumplein 10, Amsterdam. Weissman's 1895 brick block
// and the 2012 Benthem Crouwel bathtub. Origin is the centroid of OSM way
// 44508819. The Museumplein front faces 156.4°; that rotation is baked in.
export const SPEC = {
  id: 'stedelijk-museum',
  name: 'Stedelijk Museum',
  kind: 'building',
  ready: true,
  origin: [4.8798417, 52.3579018],
  height: 28, // OSM way 754299889, the north risalit spire
  padM: 95, // half-diagonal of the outline is about 83 m; Museumplein is flat
  frontageBearing: 156.4,
};
export const PALETTES = {
  light: {
    brick: '#9a4636',
    stone: '#efe4d2',
    slate: '#3e4854',
    white: '#f6f3ec',
    soffit: '#ddd6c8',
    glass: '#546068',
    light: '#3a4248',
    mesh: '#2a2e32',
    sign: '#f4f4f2',
  },
  dark: {
    brick: '#54281f',
    stone: '#e4d8c4',
    slate: '#2a3138',
    white: '#e9e4da',
    soffit: '#c9c2b4',
    glass: '#93a3ad',
    light: '#ffd2a4',
    mesh: '#16191d',
    sign: '#ffffff',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Weissman block eaves follow the tagged 14 m; corner turrets the tagged 24 m; the north risalit spire the tagged 28 m. The slate ridge at 20.6 m is estimated from the Paulus Potterstraat photograph. The bathtub roof is the tagged 14 m canopy, about 40 m south of the 1895 wall (Benthem Crouwel). The letter screen is the tagged 17 m glass part, read as the dark east wall.',
};
