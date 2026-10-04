// Amsterdam Centraal station, Stationsplein, Amsterdam. The 1889 Cuypers headhouse
// (with A.L. van Gendt), the Eijmer train sheds and the 1920s east block De Oost.
// See docs/3d-top-cities-amsterdam-centraal.md for sources, the dimension table and what is estimated.
export const SPEC = {
  id: 'amsterdam-centraal', name: 'Amsterdam Centraal station', kind: 'building',
  ready: true,
  // Wikipedia / NS pin 52°22′42″N 4°54′00″E, which the dossier also used. It falls on the
  // city facade, between the two towers.
  origin: [4.9, 52.37833],
  // Iron finial on the clock-tower pyramids. The mapped apex is 34.25 m; the crest above it
  // is estimated from photographs (see H.finial in amsterdam-centraal-site.js).
  height: 36.65,
  // Noordkap's far corner is about 250 m from the origin. The station island is flat fill.
  padM: 270,
  // Direction the city facade faces (toward Stationsplein), AXIS_DEG + 90.
  frontageBearing: 210.67,
  axisBearing: 120.67,
};

// Same keys in light and dark. Dark is the night look: dimmer brick and slate, warm windows.
// `glow` and `lamp` are drawn unshaded (lit windows, the entrance band, the clock faces).
export const PALETTES = {
  light: {
    brick: '#8e4036', stone: '#f1e6d0', slate: '#454c5c', glass: '#c3d2d8',
    iron: '#3a4046', glow: '#3e494f', lamp: '#f4efe4',
  },
  dark: {
    brick: '#5a2a24', stone: '#a89c8c', slate: '#2a3038', glass: '#6a848c',
    iron: '#1e2428', glow: '#ffb85c', lamp: '#ffe6b0',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 is Stationsplein / platform grade on the flat Peregrine basemap; no absolute altitude is baked in. The station stands on made ground in the Open Havenfront and the site is level.',
  attribution: 'Original procedural mesh. Mapped footprint and building parts © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Headhouse plan, the 23.3 m wing ridge, 22.45 m cross-gables, 29.25 m central gable, 34.25 m tower apexes and the three shed footprints are the mapped OSM parts. The tower finials and lanterns, intermediate gables, window rhythm, the upper arches and the middle and north shed crowns are estimated. The Noord-Zuid Hollandsch Koffiehuis and the IJ bus station are separate buildings and are not in this model.',
};
