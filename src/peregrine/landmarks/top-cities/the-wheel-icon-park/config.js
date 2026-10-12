// Original procedural model; site alignment from OSM attraction way 331551657.
export const SPEC = {
  id: 'the-wheel-icon-park', name: 'The Wheel at ICON Park', kind: 'building',
  ready: true, origin: [-81.468199, 28.4432359], height: 122,
  padM: 42, frontageBearing: 269.3168902113, bearing: 179.3168902113,
  radius: 56.5, hubHeight: 61.5, capsuleOrbit: 58, capsules: 30,
};
export const WHEEL_ANGLE = (90-SPEC.bearing)*Math.PI/180;
export const wheelPoint = (u,y,v=0) => [Math.cos(WHEEL_ANGLE)*u+Math.sin(WHEEL_ANGLE)*v,y,-Math.sin(WHEEL_ANGLE)*u+Math.cos(WHEEL_ANGLE)*v];
export const PALETTES = {
  light: { structure:'#e0e3df', glass:'#253e4a', concrete:'#a5aaa3', hardware:'#67747a', glow:'#e8e8e3', light:'#e8e8e3' },
  dark: { structure:'#8796a3', glass:'#1e3444', concrete:'#515c64', hardware:'#556a7b', glow:'#628dff', light:'#df72ad' },
};
export const MANIFEST = {
  elevationDatum: 'Local foundation grade y=0; real metres, no terrain elevation baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped site alignment © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '122 m overall height and 30 capsules/spokes, eight legs from official Orlando Eye facts. Rim radius, hub datum, capsule sizes and support spacing estimated from photographs. Rotation baked once from OSM way 331551657; adjoining aquarium remains provider-owned. Static upright capsules; simplified opaque glazing and fixed blue/pink LED scheme.',
};
