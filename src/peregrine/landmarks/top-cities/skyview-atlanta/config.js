// Original procedural SkyView Atlanta. Frame derived from OSM way 1292668916.
export const SPEC = {
  id: 'skyview-atlanta', name: 'SkyView Atlanta', kind: 'building', ready: true,
  origin: [-84.391851775, 33.758831225], height: 60.96, diameter: 50.5968,
  hubHeight: 35.6616, boardingDeckHeight: 1, cabins: 42, wheelBearing: 41.42019157305619,
  frontageBearing: 311.4201915730562, padM: 30,
};
export const WHEEL_ANGLE = (90 - SPEC.wheelBearing) * Math.PI / 180;
export function wheelPoint(u,y,v=0) {
  const c=Math.cos(WHEEL_ANGLE),s=Math.sin(WHEEL_ANGLE);
  return [c*u+s*v,y,-s*u+c*v];
}
export const PALETTES = {
  light: { lattice:'#e1e1da', glass:'#34474e', concrete:'#a6a69c', iron:'#626568', glow:'#d6e4e9' },
  dark: { lattice:'#8296a4', glass:'#263640', concrete:'#52606a', iron:'#414f5c', glow:'#c7d7f4' },
};
export const MANIFEST = {
  elevationDatum: 'Local foundation grade y=0; reusable rigid geometry, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural mesh. Mapped frame and wheel outline © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Operator study guide: overall height 200 ft (60.96 m), outer rim diameter 166 ft (50.5968 m), 42 gondolas. Hub datum 35.6616 m preserves the published height and diameter; hub, spokes and gondola stations share that wheel frame. The 1 m boarding deck is an independent photographic estimate; support spread, rim depth and cabin dimensions are also estimated. Static capsules do not simulate boarding access. Bearings baked into geometry. Site terrain and access datum require separate app verification.',
};
