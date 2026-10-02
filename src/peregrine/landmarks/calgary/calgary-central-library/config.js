// Calgary Central Library, 800 3 Street SE, Downtown East Village. Snøhetta with DIALOG, opened 1 November 2018.
// A four-storey, 22,000 m2 pointed-ellipse building clad in a crystalline pattern of hexagon-derived white
// aluminium and glazed panels, with a steam-bent western red cedar arch (the entrance portal) on its west side,
// raised on a terraced plaza over the CTrain Red/Blue line, whose tunnel mouth opens beneath its north prow.
//
// SOURCED: OSM way 496824026 (building, height 20.4 m, 4 levels, the whole plan: 140 x 57 m); Wikipedia ("oval-shaped",
//   four-storey atrium under a skylight, entrance framed by wood-clad arches, elevated one floor to cover a
//   135 m encapsulated section of light-rail tunnel); Snøhetta/DIALOG press coverage via Wallpaper, ArchPaper,
//   Dezeen ("pointed ellipse", 465 hexagonal panels of fritted glass and iridescent aluminium, steam-bent
//   western red cedar arch, the trains enter a tunnel beneath the "prow" at the northern corner, "gently
//   terraced slopes" up to the entrance); OSM tunnel ways 19166950 and 481522733 (the two tracks of the South Line).
// MAPPED: the plan, the tunnel axis under the north prow (bearing 146 degrees) and the at-grade tracks beside it.
// ESTIMATED (photographs, see docs/3d-calgary-calgary-central-library.md): the arch profile and its height,
//   recess depths, terrace heights, the portal size, the panel size, the cluster pattern and the oculus.
export const SPEC = {
  id: 'calgary-central-library', name: 'Calgary Central Library', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of the OSM way.
  origin: [-114.0550316, 51.0454],
  height: 20.4, // m, OSM `height` of the building: the raised skylight lid is the highest point
  roofY: 20.1, // m, the flat roof (the 0.3 m skylight curb rises to the mapped 20.4 m)
  padM: 86,
  // The cedar arch faces the street on the west side of the building (outward bearing about 253 degrees).
  frontageBearing: 253,
};

// Light is day, dark is night. Same keys in both. `glow` is drawn unshaded: the lit ground-floor glazing and the
// oculus at night; by day it is simply the glass colour.
export const PALETTES = {
  light: {
    panel: '#eceeee', silver: '#cdd2d5', glass: '#677b86', frit: '#b8c5cb', cedar: '#a8744a', cedarDark: '#8f5f3b',
    stone: '#8e8c87', roof: '#92969a', glow: '#5a717d', tunnel: '#1c1d20',
  },
  dark: {
    panel: '#8d949b', silver: '#757d85', glass: '#1f2b33', frit: '#4a5961', cedar: '#6a4a33', cedarDark: '#573b28',
    stone: '#4c4c4a', roof: '#4a4d51', glow: '#ffd68a', tunnel: '#0b0c0e',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (3 Street SE at the west facade and the CTrain tracks at the north prow); no absolute altitude. Roof 20.1 m, skylight curb 20.4 m (OSM height tag).',
  attribution: 'Original procedural mesh. Mapped footprint and tunnel alignment © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'The 140 x 57 m plan and the 20.4 m height are mapped from OSM; the arch profile, recess depths, terrace heights, portal opening, panel pattern, oculus and every colour are estimated from photographs. See docs/3d-calgary-calgary-central-library.md.',
};
