// Vincent Thomas Bridge, existing 1963 suspension structure (before deck replacement).
export const SPEC = {
  id: 'vincent-thomas-bridge', name: 'Vincent Thomas Bridge', kind: 'bridge', ready: true,
  origin: [-118.271390075, 33.7494748], height: 111.25, padM: 1100, frontageBearing: 100,
  footprintless: true, terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { landing0: '#ffffff', landing1: '#eef0f3', landing2: '#e0e4e9', landing3: '#cbd1d8', steel: '#40856b', cable: '#617c69', concrete: '#b9b6a6', asphalt: '#555d63', paint: '#ddd5aa', light: '#688e9e' },
  dark: { landing0: '#b1b2b4', landing1: '#92969b', landing2: '#7a7d84', landing3: '#6d7078', steel: '#315a4e', cable: '#3f665b', concrete: '#737d82', asphalt: '#303c47', paint: '#a3a18b', light: '#358afa' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at water/flat-map grade. Road surface 60 m, truss underside 56 m, tower top 111.25 m; absolute-deck terrain policy with DEM-fitted approaches. No latitude stretch baked in.',
  attribution: 'Original procedural mesh; roadway alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '457.2 m main span, 154.2288 m side spans, 111.252 m towers, 15.8496 m roadway from Port of Los Angeles historical report. Cable sag, sections, blue lighting, maintenance margins and anchorage form are photo estimates. Approach-inclusive alignment exceeds the published 1847.1 m structural length to meet flat Cityscape grade. No textures.',
};
