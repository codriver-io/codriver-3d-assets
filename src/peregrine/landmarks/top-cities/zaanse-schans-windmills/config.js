// Five mapped mills on the east bank of the Zaan; original procedural geometry.
export const SPEC = {
  id: 'zaanse-schans-windmills', name: 'Zaanse Schans windmills', kind: 'building',
  ready: true, origin: [4.81715,52.47470], height: 32,
  padM: 190, frontageBearing: 240,
};
export const PALETTES = {
  light: { green:'#24533c', wood:'#282922', thatch:'#514c40', tile:'#282922', trim:'#d5d6bd', glass:'#283f41', stone:'#747165' },
  dark: { green:'#173a2d', wood:'#191e1b', thatch:'#48473d', tile:'#653c2b', trim:'#858f82', glass:'#233337', stone:'#494d46' },
};
export const MANIFEST = {
 elevationDatum:'Local flat-map grade y=0; no terrain or absolute altitude baked in.',
 attribution:'Original procedural mesh. Mapped footprints © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note:'Five individual mapped mills: De Huisman, De Gekroonde Poelenburg, De Kat, De Zoeker and Het Jonge Schaap. Heights, static sail bearings, cap profiles and facade details estimated from reference photographs. Het Jonge Schaap is the six-sided 2007 reconstruction; Poelenburg is a green paltrok. No landscape or river mesh.',
};
