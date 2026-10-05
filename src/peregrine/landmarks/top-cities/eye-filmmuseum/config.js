// DMAA's 2012 waterfront museum, IJpromenade 1, not the collection centre.
// Plan from the three BAG/OSM levels; heights and cladding modules estimated.
export const SPEC = {
  id: 'eye-filmmuseum', name: 'EYE Filmmuseum', kind: 'building', ready: true,
  origin: [4.9008392696, 52.3843671428], // area centroid of upper shell way 127505497
  height: 25, padM: 78, frontageBearing: 185.4,
};
export const PALETTES = {
  light: { shell: '#f1f0e8', roof: '#eeeee7', joints: '#c6c8c4', soffit: '#a4a59f', glass: '#263e46', light: '#324c54', steel: '#465156', concrete: '#b8b5a8' },
  dark: { shell: '#87959b', roof: '#78888f', joints: '#62747b', soffit: '#505e63', glass: '#14272f', light: '#e5b574', steel: '#26343c', concrete: '#626e72' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid promenade grade y=0. No sea-level height, DEM or Mercator scale baked into the geometry.',
  attribution: 'Original procedural mesh by Codriver. Mapped placement © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '2012 DMAA museum exterior. Upper shell, ground core and entrance stair derived from OSM ways 127505497, 1206726812 and 1207014127. Roof rises to an estimated 25 m at the eastern prow; fold heights, aperture, cladding, mullions and stair rise are photograph/section estimates. Cityscape and Full 3D world not tested yet; integration is checked separately. See docs/3d-top-cities-eye-filmmuseum.md.',
};
