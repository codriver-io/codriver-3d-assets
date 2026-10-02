// Royal Ontario Museum and Daniel Libeskind's Michael Lee-Chin Crystal, Bloor Street West at Queen's Park.
// Sources and estimates: docs/3d-toronto-royal-ontario-museum.md.
export const SPEC = {
  id: 'royal-ontario-museum', name: 'Royal Ontario Museum and Michael Lee-Chin Crystal', kind: 'building',
  ready: true,
  // Area centroid of the mapped museum outline (OSM way 4942687).
  origin: [-79.394695, 43.667694],
  // The Crystal's highest point, "37 metres above the ground" (ROM / Wikiarquitectura); the heritage rotunda tops out at 33 m.
  height: 37,
  padM: 115,
  // The Crystal's face looks over Bloor Street to the north-north-west (the street grid is turned 16.8 degrees).
  frontageBearing: 343,
  gridAngleDeg: 16.84,
};
// Same keys in both. Materials are named once and merged; dark = the same building at night.
export const PALETTES = {
  light: {
    stone: '#b9a684', stoneWest: '#9a8f7e', stoneDeep: '#8f8064', copper: '#6f9282', slate: '#6f7276', roofFlat: '#a4a39c',
    window: '#2f373c', alu: '#c6cbce', aluMid: '#8f969b', aluDark: '#54595d', seam: '#3c4145', glass: '#2b4550', frame: '#0f1215', glow: '#86a9ba',
  },
  dark: {
    stone: '#807966', stoneWest: '#6a645b', stoneDeep: '#5d564a', copper: '#4b665b', slate: '#3f454b', roofFlat: '#5e656c',
    window: '#1b2126', alu: '#868e96', aluMid: '#636b72', aluDark: '#40464b', seam: '#262b30', glass: '#1f3640', frame: '#07090b', glow: '#ffcf8a',
  },
};
// Draw-call budget (docs/3d-toronto-royal-ontario-museum.md): design names on the left, the exported material on the
// right; one draw per exported material, so near is 13 and far 8. Near folds only look-alikes: the concrete walls
// and flat roofs are the same grey, and the 8-triangle dark aluminium trim takes the seam colour. Far also folds
// minor tones into their neighbour: deep stone into stone, mid aluminium into aluminium, the dark trim and the
// lit lobby glass into the window and glass tones.
export const FOLD = {
  near: { concrete: 'roofFlat', aluDark: 'seam' },
  far: { concrete: 'roofFlat', stoneDeep: 'stone', aluMid: 'alu', aluDark: 'window', glow: 'glass' },
};
/** The exported material for a design name at a detail level. */
export const materialFor = (name, detail) => FOLD[detail]?.[name] ?? name;
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The heritage wings and the Crystal both stand on y=0; the Crystal\'s cantilevers hang above it.',
  attribution: 'Original procedural mesh. Mapped footprint and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Massing follows the OSM building parts (heights, roof planes) for the whole museum; wall lean, glazing and facade rhythm are read from photographs and are estimates, not a survey. Interiors are not modelled.',
};
