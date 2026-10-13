// O'Neil Ford's 1968 HemisFair tower, present-day restaurant/observation decks.
export const SPEC = {
  id: 'tower-of-the-americas', name: 'Tower of the Americas', kind: 'building', ready: true,
  origin: [-98.483573428125, 29.419040175], // centroid of OSM shaft way 351672057
  height: 229, roofY: 189.6, houseBottomY: 166.43,
  shaftRadius: 6.858, // published 45 ft diameter / 2
  houseRadius: 16.4, // inscribed in mapped way 351672059
  elevatorBearing: 344, // photo estimate, faces north-northwest
  frontageBearing: 4, // northern annex long edge, two OSM control points
  padM: 31, rangeM: 5000, minZoom: 12.5, nearM: 800,
};
export const PALETTES = {
  light: { concrete: '#c9bda9', stone: '#b7ada0', glass: '#374a52', metal: '#617476', roof: '#536d73', glow: '#485a61', antenna: '#95928b' },
  dark: { concrete: '#706b62', stone: '#615e58', glass: '#152630', metal: '#455c60', roof: '#344d56', glow: '#b69d6e', antenna: '#727b81' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0; rigid base in real metres, no DEM or absolute altitude baked in.',
  attribution: 'Original procedural geometry. Mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: '229 m overall, 189.6 m roof, 13.716 m shaft diameter and 23.17 m top-house height are published. Top-house radius is mapped. Tier stations, rib rhythm, slight shaft taper, elevator face and low pavilion roofs are photo estimates. No surrounding plaza, entry sign arch, landscaping, flags, textures or interior. Cityscape and Full 3D world not tested; integration checked separately.',
};
