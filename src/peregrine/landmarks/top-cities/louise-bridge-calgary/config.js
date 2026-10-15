// Current five-span Hillhurst/Louise Bridge, 1921; source notes in its doc.
export const SPEC = {
  id: 'louise-bridge-calgary', name: 'Louise Bridge (10 Street)', kind: 'bridge', ready: true,
  origin: [-114.0849,51.05116], height: 8.76, padM: 45,
  frontageBearing: 322.3, footprintless: true,
};
export const PALETTES = {
  light: { concrete:'#b7b5aa', trim:'#cfcec2', asphalt:'#555d63', rail:'#bfc3ba', paint:'#e5e1ce' },
  dark: { concrete:'#747f87', trim:'#919b9e', asphalt:'#303c47', rail:'#9aa8ac', paint:'#b8bdba' },
};
export const MANIFEST = {
 elevationDatum:'Local river/flat grade y=0. Deck at 7.2 m is a photographic estimate; bank-fit world terrain uses bank controls, no DEM baked into the GLB.',
 attribution:'Original procedural geometry. Mapped roadway and outline © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
 note:'Five closed-spandrel concrete arches (the supplied open-spandrel wording is contradicted by photos and City archives), 172 m long, 19.6 m wide. Estimated 31.4 m clear bays, 4.7 m rise, 1 m springing, 3 m piers; shallow elliptical vaults, vertical pier pilasters, open balustrade. Separate southern approach ribbons follow mapped fork; flat-map ramps about 100 m.',
};
