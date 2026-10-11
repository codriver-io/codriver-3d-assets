// Puerta de Alcalá, Plaza de la Independencia, Madrid. Francesco Sabatini, 1769–1778.
// Contract: docs/3d-top-cities-landmarks.md. Dimensions and the two facades: docs/3d-top-cities-puerta-de-alcala.md.
export const SPEC = {
  id: 'puerta-de-alcala',
  name: 'Puerta de Alcalá',
  kind: 'building',
  ready: true,
  // Vertex centroid of OSM way 174805987, the triumphal_arch outline.
  origin: [-3.68872321, 40.41998632],
  // Sculpture tip. Ayuntamiento restoration survey: 23.79 m. Wikipedia's 19.50 m is the lower figure.
  height: 23.79,
  padM: 30, // level traffic circle; the outline sits inside ~22 m
  // East facade (the inscribed exterior) faces ENE, along the gate's through-axis.
  frontageBearing: 80.4,
};

// Segovia granite for the mass, Colmenar limestone for sculpture and the inscription tablet.
// Night is the floodlit monument: warm dim granite, the white stone still bright. No event lighting.
export const PALETTES = {
  light: {
    granite: '#9c978c', // Segovia granite, grey enough that the white stone separates
    graniteDark: '#5c5852',
    limestone: '#f6f3ea', // Colmenar limestone: tablet, letters' ground, sculpture
  },
  dark: {
    granite: '#6a655c',
    graniteDark: '#3c3934',
    limestone: '#efe4cc', // floodlit white stone, warm, not an event wash
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height 23.79 m, width 43.07 m, depth 11.74 m and the door height 6.10 m are Ayuntamiento restoration figures. The model width is 42.3 m so the chamfered outline contains it. Arch crowns (central 13.35 m, sides 12.63 m) and the cornice at 16.60 m follow the photographed order; the survey side opening of 9.28 m left a blank belt. East is the rusticated Ionic front with the REGE CAROLO III tablet; west is the smooth front, columns only beside the central arch.',
};
