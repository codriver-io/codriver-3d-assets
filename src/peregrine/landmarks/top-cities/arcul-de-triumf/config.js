// Arcul de Triumf, current stone monument following the 2013–2016 restoration.
export const SPEC = {
  id: 'arcul-de-triumf', name: 'Arcul de Triumf', kind: 'building', ready: true,
  origin: [26.07812725, 44.467190214285715],
  height: 27, padM: 15, frontageBearing: 159.695, axisDeg: 20.305,
  width: 24.8, depth: 8.7, archWidth: 9.5, archCrown: 15.2,
};
export const PALETTES = {
  light: { stone: '#c9c2ad', trim: '#ded6c1', relief: '#b3a990', joint: '#aca58f', recess: '#867e6b', lamp: '#c9b996', iron: '#525853', blue: '#174995', yellow: '#e5bc2a', red: '#b53731' },
  dark: { stone: '#857e6b', trim: '#a69a7d', relief: '#91866d', joint: '#726b58', recess: '#575143', lamp: '#edc995', iron: '#444849', blue: '#21365f', yellow: '#988039', red: '#713c34' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map grade y=0 at the pier footings; no altitude, terrain or latitude stretch baked in.',
  attribution: 'Original procedural mesh. Mapped outline and building parts © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '27 m overall including the flagpole; stone attic 25.5 m, cornice terrace 22.83 m and opening crown 15.2 m from the restoration architect. OSM mapped visible width/depth and baked 20.305 degree east-to-north axis; published 25 × 11.5 m foundation is not a visible plaza slab. Ornamental relief, portrait profiles, joints, coffers and flag folds are original approximations. Inscriptions and interior stairs omitted. Cityscape and Full 3D world not tested yet, integration is checked separately.',
};
