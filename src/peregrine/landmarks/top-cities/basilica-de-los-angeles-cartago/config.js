// Current exterior vocabulary from the dossier; all vertical dimensions estimated.
export const SPEC = {
  id: 'basilica-de-los-angeles-cartago', name: 'Basílica de Nuestra Señora de los Ángeles', kind: 'building',
  ready: true, origin: [-83.91286411707607, 9.864092100316496],
  height: 42, padM: 49, frontageBearing: 187, rotationDeg: -7,
};
export const PALETTES = {
  light: { stone: '#999c95', trim: '#e4e2d4', shade: '#626b70', roof: '#a8acaf', dome: '#bfc2c4', glass: '#26312e', bronze: '#625c46', glow: '#39433b' },
  dark: { stone: '#505e62', trim: '#8a9695', shade: '#697475', roof: '#54666d', dome: '#82908e', glass: '#152326', bronze: '#3a4545', glow: '#ac9568' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid flat local pavement y=0; no DEM, absolute altitude or Mercator scale baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Full outline from OSM way 102243517. All vertical dimensions including the 42 m dome finial are photographic estimates, not published measurements. Grey stone body, pale facade and neutral silver-grey roofs follow Bernard Gagnon exterior references; rear elevations are inferred.',
};
