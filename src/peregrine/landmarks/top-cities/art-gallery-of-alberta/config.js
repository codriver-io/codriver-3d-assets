import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'art-gallery-of-alberta', name: "Art Gallery of Alberta", kind: 'building',
  ready: true, origin: [-113.48869, 53.54491], height: 31, padM: 48,
  frontageBearing: 231,
  terrainPad: { rings: FOOTPRINTS, refs: [[-113.48869,53.54491]], datum: 'median', featherM: 4 },
};
export const PALETTES = {
 light: { steel:'#c9ccd0', steelUnder:'#929ba6', zinc:'#707a80', joint:'#59656d', glass:'#526e78', frame:'#a4afb0', stone:'#aaa79e', glow:'#788f91' },
 dark: { steel:'#9ba9b5', steelUnder:'#606e7c', zinc:'#445461', joint:'#34424d', glass:'#2e4657', frame:'#788d98', stone:'#737f89', glow:'#e5c68d' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Randall Stout 2010 building: Borealis stainless-steel ribbon, glazed atrium, zinc galleries. Published ribbon length 190 m describes the real continuous interior/exterior feature; exterior lofts and 31 m maximum height are photograph estimates. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
