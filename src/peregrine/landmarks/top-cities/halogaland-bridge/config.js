// Current bridge opened 9 December 2018. Original metric model, not a survey.
export const SPEC = {
  id: 'halogaland-bridge', name: 'Hålogaland Bridge', kind: 'bridge', ready: true,
  origin: [17.481766, 68.4596989], height: 179.1, padM: 1650,
  frontageBearing: 1, footprintless: true, terrainPolicy: 'absolute-deck',
};
export const PALETTES = {
  light: { concrete: '#bdc1bd', steel: '#929d9f', cable: '#555f64', asphalt: '#50575b', paint: '#e9dfae', rail: '#a4afb4', lamp: '#e4e8da' },
  dark: { concrete: '#626f7c', steel: '#566675', cable: '#73828f', asphalt: '#293541', paint: '#b9b492', rail: '#81939e', lamp: '#ffe4a5' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at flat Cityscape grade; absolute-deck world policy interprets structural heights above the water datum. No DEM, moving origin or latitude scale baked into vertices.',
  attribution: 'Original procedural geometry. E6 alignment © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Current 2018 bridge. Published 1145 m main span, 179.1/173.5 m tower tops, 18.6 m steel deck, 15.4 m viaducts, 9.5 m roadway, 3.5 m cycle path and 0.47 m suspension cables. Deck top 43 m, box depth 3 m, cable sag, tower sections, pier positions and backstay anchorages estimated. Structural south/north viaducts 250/148 m; published totals differ by 10 m. Flat approach road profiles are a deliberate compromise; terrain roads and tunnels fitted separately by shared layer.',
};
