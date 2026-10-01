// OpenStreetMap extrusions the de Young Museum model replaces. Retrieved 2026-10-01 through the shared Overpass queue,
// (c) OpenStreetMap contributors, ODbL 1.0. Ring 1 is the outer ring of the museum multipolygon (relation 1652482,
// outer ways 23867087 + 888799026, building=museum, height 13 m; its five courtyard holes stay provider). Ring 2 is
// the Hamon Tower outline (way 444230154) and rings 3-10 are its eight stacked, twisting building:part slabs
// (13-51 m in OSM): the tower overhangs the roof edge, so each is listed.
export const FOOTPRINTS = [
  // museum outer ring (relation 1652482 outer ways 23867087 + 888799026)
  [[-122.4681715, 37.7713995], [-122.4682646, 37.7713324], [-122.4689220, 37.7708627], [-122.4690369, 37.7707806], [-122.4690434, 37.7707863], [-122.4693969, 37.7710948], [-122.4696196, 37.7712892], [-122.4693564, 37.7714760], [-122.4684723, 37.7721033], [-122.4683154, 37.7722147], [-122.4682715, 37.7720495], [-122.4681822, 37.7719724], [-122.4682304, 37.7719375], [-122.4681561, 37.7719108], [-122.4681319, 37.7719282], [-122.4679993, 37.7718116], [-122.4678209, 37.7716546]],
  // Hamon Tower outline (way 444230154)
  [[-122.4683977, 37.7720382], [-122.4683558, 37.7718564], [-122.4682587, 37.7719172], [-122.4682304, 37.7719375], [-122.4681822, 37.7719724], [-122.4682715, 37.7720495], [-122.4683154, 37.7722147], [-122.4683958, 37.7721581], [-122.4684723, 37.7721033]],
  // building:part 1418750069, tower slab 13-18 m
  [[-122.4684723, 37.7721033], [-122.4682587, 37.7719172], [-122.4681822, 37.7719724], [-122.4683958, 37.7721581]],
  // building:part 1418750072, tower slab 18-23 m
  [[-122.4683758, 37.7721717], [-122.4684523, 37.7721169], [-122.4682664, 37.7719116], [-122.4681900, 37.7719668]],
  // building:part 1418750068, tower slab 23-28 m
  [[-122.4683560, 37.7721861], [-122.4684325, 37.7721314], [-122.4682743, 37.7719060], [-122.4681979, 37.7719611]],
  // building:part 1418750073, tower slab 28-33 m
  [[-122.4683369, 37.7721994], [-122.4684137, 37.7721443], [-122.4682821, 37.7719006], [-122.4682054, 37.7719557]],
  // building:part 1418750070, tower slab 33-38 m
  [[-122.4683163, 37.7722141], [-122.4683929, 37.7721593], [-122.4682900, 37.7718947], [-122.4682135, 37.7719498]],
  // building:part 1418750071, tower slab 38-43 m
  [[-122.4682220, 37.7719437], [-122.4682950, 37.7722293], [-122.4683715, 37.7721745], [-122.4682985, 37.7718885]],
  // building:part 1418972817, tower slab 43-46 m
  [[-122.4682269, 37.7719453], [-122.4682977, 37.7722228], [-122.4683664, 37.7721736], [-122.4682956, 37.7718959]],
  // building:part 1418972816, tower slab 46-51 m
  [[-122.4682170, 37.7719421], [-122.4682922, 37.7722366], [-122.4683769, 37.7721763], [-122.4683015, 37.7718806]],
];

export const OSM_WAYS = [
  23867087, // museum outer way 1 of 2 (relation 1652482)
  888799026, // museum outer way 2 of 2 (relation 1652482)
  444230154, // Hamon Tower outline
  1418750069, // tower building:part
  1418750072, // tower building:part
  1418750068, // tower building:part
  1418750073, // tower building:part
  1418750070, // tower building:part
  1418750071, // tower building:part
  1418972817, // tower building:part
  1418972816, // tower building:part
];
// Derived data (c) OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
