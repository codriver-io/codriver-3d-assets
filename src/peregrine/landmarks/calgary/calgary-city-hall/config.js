// Calgary City Hall ("Old City Hall"), 716/800 Macleod Trail SE, Calgary: William M. Dodd, completed 1911,
// Romanesque Revival, rusticated Paskapoo sandstone, four storeys, central clock tower. Restored 2017-2021.
// See docs/3d-calgary-calgary-city-hall.md. The adjacent Calgary Municipal Building and parkade are not modelled.
// Origin: area centroid of OSM way 37829977 (the mapped 1911 outline).
// Authoring frame: building axes u (along the front, east) and v (into the building, south); one rotation of
// 2.079 degrees (SPEC.rotationDeg) onto the mapped outline, baked into the geometry.
export const SPEC = {
  id: 'calgary-city-hall', name: 'Calgary City Hall (Old City Hall)', kind: 'building',
  ready: true, // exported, verified against photographs and catalogued (2026-10-02)
  origin: [-114.05735267, 51.04606148],
  height: 32.7, // clock tower to the top of its finial: "more than 32 metres (100 feet)", City of Calgary
  padM: 30, frontageBearing: 2, // the tower front looks north onto 7 Avenue SE (bearing 2.1 deg)
  rotationDeg: 2.079, // authoring u-axis lies 2.079 degrees from east toward south (the mapped walls)
};
export const PALETTES = {
  light: {
    stone: '#a89070', trim: '#bea888', roof: '#ab5242', glass: '#364852', granite: '#8c4a44', lamp: '#ebe6d1',
  },
  dark: {
    stone: '#635a4a', trim: '#756c5a', roof: '#5c3731', glass: '#1b252b', granite: '#4d302e', lamp: '#ffe6a4',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The plinth stands on y=0 on all sides (downtown is nearly flat here).',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Tower height (32.7 m, "more than 32 m / 100 ft"), four storeys, sandstone, round-arched entrance on four red granite columns, steep tile roofs and the mapped outline are sourced. Storey heights, cornice and roof heights, tower stage proportions, dial size, window counts, dormer and cupola positions, the plain flat-roofed two-storey wing that fills the mapped east bump, the tiled crown over the centre and the rear and side elevations are estimated from photographs; surrounds are drawn in relief only on the street faces.',
};
