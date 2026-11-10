// Current standing church, not a reconstruction of the 1713 construction site.
export const SPEC = {
  id: 'st-james-goose-creek-church', name: "St. James' Church, Goose Creek", kind: 'building', ready: true,
  origin: [-80.03264685,32.9755013], height: 8.85, padM: 14, frontageBearing: 274.5,
  rotationDeg: 4.5, lengthM: 15.22, widthM: 12.57, ownTolM: 0.8,
};
export const PALETTES = {
  light: { stucco:'#dddcd4', roof:'#61676a', glass:'#38484a', door:'#c6c9c2' },
  dark: { stucco:'#858e8b', roof:'#3c474b', glass:'#25383b', door:'#687974' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid church foundation grade y=0; no sea-level, terrain or Mercator scale baked in. Geographic rotation is baked once.',
  attribution: 'Original procedural geometry by Codriver; mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '1713–1719 stucco church, current exterior: jerkinhead slate roof, quoins, tall round arches, four side windows around each side doorway and pelican-relief pediment. Owner publishes 50 × 40 ft; mapped envelope is 15.22 × 12.57 m. Wall/roof heights, mouldings and openings are photo estimates. No cemetery, vegetation, perimeter wall, lettering or texture. Cityscape: not tested. Full 3D world: not tested.',
};
