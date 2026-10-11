import { ORIGIN, ROT_DEG } from './art-gallery-of-ontario-site.js';

// Art Gallery of Ontario, 317 Dundas Street West, as Frank Gehry's Transformation
// AGO (2008) left it. Origin is the mean of the mapped outline's vertices (OSM way
// 141693334). The model is authored on the street grid: `frontageBearing` is the
// bearing of the Dundas Street facade's outward normal (the grid the outline itself fits,
// 16.2 degrees off the compass axes).
export const SPEC = {
  id: 'art-gallery-of-ontario', name: 'Art Gallery of Ontario', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  origin: ORIGIN,
  height: 41.5, // top of the rooftop plant on the blue titanium box (38 m roof + 3.5 m plant)
  padM: 110,
  frontageBearing: 360 - ROT_DEG,
  // The whole complex is ~180 m along Dundas: keep the near LOD for a driver on the block.
  nearM: 380,
};

// Material names are the contract with the layer (it recolours by name for night).
// `glow` and `light` are drawn unshaded: the Galleria Italia's ribbed glazing and its
// glass belt, which the real building lights amber from inside after dark.
export const PALETTES = {
  light: {
    timber: '#b59a72', glow: '#9ab5c6', light: '#5f7f8b', glass: '#6f8f97', titanium: '#2f72c0', titaniumDeep: '#2966b2',
    stone: '#d3c8b3', precast: '#d9d2c1', brick: '#8b5646', metal: '#9aa1a6', roof: '#a2a7a4', paint: '#eeece4',
  },
  dark: {
    timber: '#6d5c49', glow: '#e0a04a', light: '#c98a44', glass: '#33474f', titanium: '#1d4278', titaniumDeep: '#1a3c6d',
    stone: '#8d8a85', precast: '#93949a', brick: '#584039', metal: '#6b7379', roof: '#565d64', paint: '#b3b6b8',
  },
};

// Draw-call budget (docs/3d-toronto-art-gallery-of-ontario.md): design names on the left, the exported material on the
// right. Near keeps all twelve (12 draws). Far folds look-alikes into one draw: the two blue titanium tones, the grey
// roof into the grey metal, the off-white stone and plant paint into the off-white precast, and the unshaded belt
// glazing into the unshaded ribbed glazing (both light amber after dark), which leaves seven.
export const FOLD = {
  near: {},
  far: { titaniumDeep: 'titanium', roof: 'metal', stone: 'precast', paint: 'precast', light: 'glow' },
};
/** The exported material for a design name at a detail level. */
export const materialFor = (name, detail) => FOLD[detail]?.[name] ?? name;

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the Dundas Street West sidewalk); no absolute altitude. The site is level in the model; the real block falls gently toward Grange Park.',
  attribution: 'Original procedural mesh. Mapped footprint and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan, glazing bands, blue box, tears, stair and Grange are read from OSM building parts (way 141693334 and 959819xxx/959903xxx/960781xxx); storey heights of the wings are 3.6 m per mapped level, the hull profile and sail heights are photo estimates. Interior (Walker Court, Baillie Court, stairs) is not modelled. Not surveyed.',
};
