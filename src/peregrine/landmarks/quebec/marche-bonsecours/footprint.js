// Rings of [lng, lat] whose provider extrusions the Marché Bonsecours model replaces.
// Both ways come from the shared Overpass helper (tmp/quebec/marche-bonsecours/osm.json), retrieved 2026-10-03.
// (c) OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
//   way 87389029  building=yes "Marché Bonsecours" (350 rue Saint-Paul Est, wikidata Q1629577): the whole 164 x 24 m block
//                 with its end pavilions, river-side bays and the Doric portico footprint. No height or levels are mapped.
//   way 207977352 building:part "Le Cabaret du Roy" (363 rue de la Commune Est): a 9.6 x 20 m slice across the whole depth of the
//                 block, one bay west of the central block; it lies inside the outline above and belongs to the market. It is listed
//                 so a provider extrusion of the part cannot survive the model.
// Not listed: the neighbours across the two streets (Auberge Alt Hostel way 1244238348 and the other 1244238xxx blocks), the Chapelle
// Notre-Dame-de-Bon-Secours (way 87389036), the Kiosques du Vieux-Port (way 1387776862) and relation 19146362, which are separate buildings.
export const FOOTPRINTS = [
  [
    [-73.5519074, 45.5084335],
    [-73.5519359, 45.5083708],
    [-73.5519684, 45.5083052],
    [-73.5519419, 45.5082982],
    [-73.5519566, 45.5082666],
    [-73.551836, 45.5082403],
    [-73.551714, 45.5082105],
    [-73.5517085, 45.5082305],
    [-73.5517016, 45.5082475],
    [-73.5516746, 45.5082422],
    [-73.5516443, 45.5083063],
    [-73.5516149, 45.5083677],
    [-73.5516413, 45.5083743],
    [-73.551562, 45.5085477],
    [-73.5515399, 45.5085419],
    [-73.5515088, 45.5085971],
    [-73.5514821, 45.508655],
    [-73.5515106, 45.5086605],
    [-73.5514673, 45.508748],
    [-73.5514282, 45.5088269],
    [-73.5513836, 45.5089115],
    [-73.5512781, 45.5091567],
    [-73.5512706, 45.5091722],
    [-73.5512492, 45.5091667],
    [-73.5512391, 45.509188],
    [-73.551221, 45.5092261],
    [-73.551203, 45.5092642],
    [-73.551194, 45.5092831],
    [-73.5512206, 45.5092888],
    [-73.5511477, 45.5094327],
    [-73.5511402, 45.5094486],
    [-73.5511113, 45.5094436],
    [-73.5510975, 45.5094769],
    [-73.5510693, 45.509534],
    [-73.5510505, 45.5095704],
    [-73.5510755, 45.5095774],
    [-73.551059, 45.5096131],
    [-73.5510809, 45.5096187],
    [-73.5511862, 45.5096415],
    [-73.5512781, 45.5096644],
    [-73.5512987, 45.5096686],
    [-73.5513131, 45.509636],
    [-73.5513408, 45.5096418],
    [-73.551371, 45.5095795],
    [-73.5514018, 45.5095129],
    [-73.5513748, 45.5095063],
    [-73.5513839, 45.5094833],
    [-73.5514027, 45.5094438],
    [-73.5514235, 45.5093954],
    [-73.5514508, 45.5093362],
    [-73.5514606, 45.5093368],
    [-73.5514883, 45.5092803],
    [-73.5515147, 45.5092246],
    [-73.5515049, 45.5092218],
    [-73.5515133, 45.5092108],
    [-73.5515896, 45.5090521],
    [-73.5516082, 45.5090562],
    [-73.5516335, 45.5090619],
    [-73.5516687, 45.5089804],
    [-73.5517086, 45.5088932],
    [-73.5516887, 45.5088878],
    [-73.5516719, 45.5088836],
    [-73.5517063, 45.508801],
    [-73.5517319, 45.5087396],
    [-73.5517692, 45.5086576],
    [-73.551839, 45.5085107],
    [-73.5518789, 45.5084266],
  ],
  [
    [-73.5516719, 45.5088836],
    [-73.5514282, 45.5088269],
    [-73.5514673, 45.508748],
    [-73.5517063, 45.508801],
  ],
];

export const OSM_WAYS = [
  87389029, // building=yes, name=Marché Bonsecours
  207977352, // building:part, name=Le Cabaret du Roy (inside the outline)
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
