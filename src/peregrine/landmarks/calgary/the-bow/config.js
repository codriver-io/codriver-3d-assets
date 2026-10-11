// The Bow, 500 Centre Street SE, Calgary (Foster + Partners with Zeidler Partnership, completed 2012).
// Height 236 m, 58 storeys: Wikipedia and OSM (way 127741499, height=236, building:levels=58) agree. The plan is a
// crescent mapped by the OSM outline: a convex north-east face on a circle fitted at 46 to 47 m about (-1.5, +9.6) m
// (modelled at 46.0 m so the model stays inside the ring), a concave south-south-west face on a circle of 39.3 m about
// (-17.7, +41.0) m (residual 0.25 m), and a rounded wing at each end. The nine-band diagrid, the mechanical bands, the
// sky-garden heights and the roof are read from photographs (docs/3d-calgary-the-bow.md).
export const SPEC = {
  id: 'the-bow', name: 'The Bow', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the outline's bounding box (the outline spans x -45.7..45.7 and z -37.8..37.7 m around it).
  origin: [-114.0619708, 51.0478588],
  height: 236, // m to the highest point (the window-washing rig on the roof)
  padM: 62, // the footprint reaches 53 m from the origin; downtown here is flat, so no terrain pad
  // Outward bearing of the concave south-south-west face, the plaza side (Wonderland stands there).
  frontageBearing: 207,
  roofY: 233.6, // parapet-free roof deck; the window-washing rig stands on it up to 236 m
  bands: 9, // diagrid bands of roofY / 9 = 25.96 m between horizontal ring members (about 6.4 storeys)
};

// Pale silver-white diagrid members over blue-grey glass; the two wing columns are darker blue-green glass with fine
// vertical mullions. `glow` is the lit offices at night (it reads as glass by day) and is drawn unshaded.
export const PALETTES = {
  light: {
    glass: '#5c7f9b', wing: '#3f6277', frame: '#eef1f3', louvre: '#5a524b', glow: '#587c99',
    roof: '#767c82', metal: '#9ca4aa', sculpt: '#f3f4f2',
  },
  dark: {
    glass: '#243a4d', wing: '#182c3a', frame: '#8b97a2', louvre: '#2a2623', glow: '#f0cb8c',
    roof: '#33383d', metal: '#566068', sculpt: '#9aa4aa',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The ground floor is y=0; the plaza, the +15 skywalk links and the below-grade parkade are not modelled.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Height, storey count and the crescent plan (two mapped circles and the wing ends) follow OSM and Wikipedia; the nine-band diagrid, the sky-garden recesses, the mechanical bands, the roof and the 12 m Wonderland head are estimated from photographs.',
};
