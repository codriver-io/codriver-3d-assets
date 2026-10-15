// Allianz Arena, Munich, Germany (Herzog & de Meuron with Arup, 2005).
export const SPEC = {
  id: 'allianz-arena', name: 'Allianz Arena', kind: 'building',
  ready: true,
  origin: [11.624701, 48.218791], // centroid of the mapped widest outline (OSM way 1257847557)
  height: 50, // m: Wikipedia and the club's facts give 50 m; the crown of the ETFE shell
  padM: 170,
  frontageBearing: 168, // long axis (pitch) bearing, from the mapped roof opening
};
export const PALETTES = {
  light: { etfe: '#e6e9ec', glow: '#f7f9fb', frame: '#a7adb3', deck: '#9a9c9c', conc: '#b8b7b0', dark: '#3a3e43', seat: '#6e7581', turf: '#4f7b40', paint: '#f1f1ec' },
  dark: { etfe: '#c9323a', glow: '#ff6a63', frame: '#5b606b', deck: '#44474c', conc: '#64666a', dark: '#16191d', seat: '#3b404a', turf: '#2c472a', paint: '#c6cac3' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The esplanade deck top is 8.5 m above that grade (OSM min_height 7.5, height 8.5).',
  attribution: 'Original procedural geometry by Codriver, CC BY 4.0. Mapped outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Shell outline, roof opening, plaza building and esplanade deck follow the mapped OSM rings; skin cross-section, cushion size (about 5 m x 8 m diamonds) and pitch/bowl are estimated from photographs. Cushion count is simplified (about 2,300 modelled against 2,874 real). Night colours show the arena lit red; the real facade changes colour (red, blue, white). Lettering, roof ties, towers/ramps beyond the mapped deck, and the surrounding car parks are not modelled.',
};
