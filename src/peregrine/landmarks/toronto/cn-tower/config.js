// CN Tower, 290 Bremner Boulevard / 301 Front Street West, Toronto (WZMH with John Andrews, 1976).
// Sourced: 553.3 m to the antenna tip; hexagonal concrete core with three buttress legs; the seven-
// storey main pod (radome ~338 m, glass floor 342 m, LookOut 346 m, 360 restaurant 351 m,
// EdgeWalk 356 m); the SkyPod at 447 m; a 102 m broadcast mast. Mapped (OSM way 32742038 and its
// building:part ways): the axis, the hexagon's size and orientation, the three legs' bearings, tips
// and widths, the 23.2 m round base. Estimated from calibrated photographs: the pod, SkyPod and
// mast profiles and the taper of the core and legs. See docs/3d-toronto-cn-tower.md.
export const SPEC = {
  id: 'cn-tower', name: 'CN Tower', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // The tower's axis: the centre of the mapped antenna and pod parts, which is also the centre of the
  // mapped hexagonal core.
  origin: [-79.3870872, 43.6425888],
  height: 553.3, // to the tip of the antenna
  padM: 50,      // covers the 29 m legs and the 23.2 m round base
  // Bearing of the hexagon face that looks toward Front Street and the entrance building.
  frontageBearing: 346.4,
  // A 553 m tower is read from kilometres away, mostly by its far model: draw it from 9 km, and let the
  // detailed model take over within 650 m (the pod at 350 m is then well inside the view).
  rangeM: 9000, minZoom: 12.5, nearM: 650,
  // Model facts the geometry, tests and docs share.
  legBearings: [46.4, 166.4, 286.4], vertexBearing: 16.4,
};
export const PALETTES = {
  light: {
    concrete: '#aaa498', concrete_dark: '#8b877e', dark: '#454d55', white: '#ecebe5', metal: '#a2a7ab',
    glass: '#151d27', red: '#c72b22', glow: '#8fa9b6',
  },
  dark: {
    concrete: '#767b84', concrete_dark: '#5b6169', dark: '#2a3139', white: '#aab2bd', metal: '#69727d',
    glass: '#0c121a', red: '#a3312b', glow: '#efe8ff',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. The lake shore grade is about 76 m above sea level, not baked in.',
  attribution: 'Original procedural mesh. Mapped footprint and hexagon/leg geometry © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Pod, SkyPod and antenna profiles and the shaft and leg taper are estimated from calibrated photographs (heights agree with the published levels); the round base height (7.5 m) is a guess; the entrance pavilion, aquarium and site furniture are not modelled; interior is empty.',
};
