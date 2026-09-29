// Rings of [lng, lat] whose default provider extrusions this landmark replaces:
// the five black towers/pavilion of the Toronto-Dominion Centre that the model
// draws. First Canadian Place, Scotia Plaza, 95 Wellington and 222 Bay are NOT
// here; they stay provider (or belong to other landmarks).
// Source: OpenStreetMap via the shared Overpass helper, 2026-09-29 (osm3s base
// 2026-09-29T06:18Z). (c) OpenStreetMap contributors, ODbL 1.0.
//
// A `building:part` ring is listed beside its parent outline where OSM maps both,
// because the provider extrudes whichever it receives.
export const FOOTPRINTS = [
  // way 141693728: TD Bank Tower (Toronto Dominion Bank Tower), 66 Wellington St W. 222.86 m, 56 levels.
  [[-79.3815914, 43.6476030], [-79.3810886, 43.6477100], [-79.3807957, 43.6477723], [-79.3806908, 43.6477952], [-79.3806188, 43.6476231], [-79.3806079, 43.6475960], [-79.3805981, 43.6475716], [-79.3805506, 43.6474531], [-79.3809451, 43.6473690], [-79.3814521, 43.6472609]],
  // way 141693739: TD North Tower (Royal Trust Tower), 77 King St W: outline. 182.88 m, 46 levels.
  [[-79.3824542, 43.6479820], [-79.3823910, 43.6479954], [-79.3820677, 43.6480637], [-79.3817310, 43.6481348], [-79.3816744, 43.6481468], [-79.3815410, 43.6478164], [-79.3823208, 43.6476515]],
  // way 367642827: TD North Tower: building:part (same tower, smaller inset polygon)
  [[-79.3823910, 43.6479954], [-79.3822787, 43.6477096], [-79.3816173, 43.6478474], [-79.3817310, 43.6481348], [-79.3820677, 43.6480637]],
  // way 110166031: Banking Pavilion, 55 King St W. One storey; roof area ~2 041 m2.
  [[-79.3805408, 43.6484283], [-79.3803769, 43.6480351], [-79.3807844, 43.6479462], [-79.3808613, 43.6479293], [-79.3809074, 43.6479193], [-79.3810713, 43.6483125], [-79.3806938, 43.6483949]],
  // way 27767634: TD West Tower (Commercial Union / CP Tower), 100 Wellington St W: outline. 128.02 m, 32 levels.
  [[-79.3829953, 43.6472854], [-79.3825454, 43.6473846], [-79.3823756, 43.6469817], [-79.3825063, 43.6469529], [-79.3828256, 43.6468824], [-79.3829121, 43.6470879]],
  // way 367641020: TD West Tower: building:part
  [[-79.3828987, 43.6472511], [-79.3826553, 43.6473054], [-79.3825987, 43.6473180], [-79.3825368, 43.6471727], [-79.3824699, 43.6470160], [-79.3825284, 43.6470026], [-79.3827699, 43.6469490], [-79.3828365, 43.6471053]],
  // way 27767631: TD South Tower (IBM / TD Waterhouse Tower), 79 Wellington St W. 153.57 m, 39 levels.
  [[-79.3816371, 43.6467224], [-79.3812974, 43.6467944], [-79.3809890, 43.6468598], [-79.3808579, 43.6465361], [-79.3812630, 43.6464502], [-79.3815061, 43.6463987], [-79.3815988, 43.6466277]],
];
export const OSM_WAYS = [141693728, 141693739, 367642827, 110166031, 27767634, 367641020, 27767631];
