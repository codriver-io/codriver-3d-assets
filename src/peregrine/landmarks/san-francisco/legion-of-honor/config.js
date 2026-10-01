// California Palace of the Legion of Honor, 100 34th Avenue, Lincoln Park · San Francisco.
// George Applegarth and Henri Guillaume, opened 1924: a replica of the French Pavilion of the 1915 Panama-Pacific
// International Exposition, itself a three-quarter-scale Palais de la Légion d'Honneur (Hôtel de Salm, Paris, 1782).
// See docs/3d-san-francisco-legion-of-honor.md.
//
// Frame. The mapped outline is a rectangle turned 48.91 deg from north (mean of its edge bearings, relation 21115818).
// Plan coordinates (u, v): u runs along the long axis toward bearing 48.91 (from the rotunda toward the entrance arch),
// v toward bearing 138.91 (the building's right-hand side when facing the arch from inside). Numbers in the parts files are
// in these OSM-derived (u, v) metres, measured from the mapped outline around the old scratch origin; the model is
// re-centred on `planCentre` (the bounding-box centre of the mapped outline) and turned onto the true grid once, here.
// The entrance arch and the Court of Honor face the +u direction.
export const SPEC = {
  id: 'legion-of-honor', name: 'California Palace of the Legion of Honor', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-01)
  origin: [-122.500759, 37.7845338], // centre of the mapped outline's bounding box (oriented), on the Court of Honor axis
  height: 18, // m: rotunda dome finial above the Court of Honor floor (OSM tags 21 m measured from the lowest grade, see docs)
  padM: 75, // terrace pad: the 94 x 60 m outline, its forecourt steps and the rotunda apse
  frontageBearing: 48.91, // the entrance arch and Court of Honor look toward +u
  bearingU: 48.91, // authoring u axis, degrees clockwise from north
  planCentre: [-14.7, -17.8], // (u, v) of the origin in the mapped outline's frame
  gradeOffsetM: 3, // OSM heights count from the lowest grade; the model's y = 0 is the Court of Honor / entrance level
};
export const PALETTES = {
  light: {
    stone: '#ebe3cf', shade: '#d3cab4', roof: '#a8afa2', glass: '#3f565d', glow: '#cdc3ab', dome: '#c3c9ba', bronze: '#5b4a38',
  },
  dark: {
    stone: '#8e9196', shade: '#777b82', roof: '#4b5359', glass: '#233845', glow: '#e9d7a2', dome: '#6c767d', bronze: '#3b3229',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap = the Court of Honor floor and entrance level; no absolute altitude. The building stands on a bluff in the real world, but no hill is modelled: the terrace pad is flattened to this level. OSM heights count from the lowest grade (about 3 m lower on the sides and rear); the model drops that base.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan (94 x 60 m outline, court, colonnades, portico, arch and dome positions) is mapped; the arch opening, colonnade pitch, column proportions and every height are estimated from photographs and OSM height tags minus a 3 m base; facade ornament is simplified.',
};
