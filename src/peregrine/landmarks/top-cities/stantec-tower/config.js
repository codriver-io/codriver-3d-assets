// Stantec Tower, 10104 103 Avenue NW, Edmonton, Alberta (Stantec / ICE District, 2018-19).
// 250.8 m, 66 storeys: Wikipedia and OSM (way 476797578, height=250.8, building:levels=66) agree. The mapped shaft
// (OSM part 512154307) is a 20.5 x 52 m slab whose long axis runs north-south; it rises out of the west half of a
// 125.4 m block (part 512154306) and a 16.8 m podium (part 512154308). Everything else (floor pitch, fin
// pitch, roof slope, louvre bands) is estimated from photographs: see docs/3d-top-cities-stantec-tower.md.
export const SPEC = {
  id: 'stantec-tower', name: 'Stantec Tower', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centroid of the mapped shaft outline (OSM way 512154307).
  origin: [-113.496213, 53.545004],
  height: 250.8, // m to the north end of the crown rim, the highest point (OSM height=250.8)
  padM: 70, // the podium runs 67 m west of the origin
  // The shaft faces the street grid: 103 Avenue lies to its south.
  frontageBearing: 180,
  podiumY: 16.8, // OSM building:part 512154308 height
  blockY: 125.4, // OSM building:part 512154306 height (north end of its sloped roof)
  floorPitch: 3.77, // m between floor lines on the shaft: 62 lines between the podium roof and the crown (estimated)
};
export const PALETTES = {
  light: { glass: '#5b8eb9', spandrel: '#3b6688', fin: '#e8edf0', louvre: '#22364a', podium: '#4a78a3', roof: '#80878c', metal: '#9aa1a6', glow: '#5688b3' },
  dark: { glass: '#2d4a68', spandrel: '#1b3047', fin: '#808c97', louvre: '#0a1118', podium: '#27425c', roof: '#3b4146', metal: '#566068', glow: '#e8c98c' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map street grade y=0 (the podium plaza); rigid base, no terrain or absolute altitude baked into geometry.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '250.8 m roof, 66 storeys, 16.8 m podium and 125.4 m block follow Wikipedia and OSM. The outlines are the mapped ones (shaft chamfered at its corners). Floor pitch, fin and mullion pitch, the 5.5 m crown slope, louvre bands, glass colour, podium detailing and the entrance canopy are photo-based estimates. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
