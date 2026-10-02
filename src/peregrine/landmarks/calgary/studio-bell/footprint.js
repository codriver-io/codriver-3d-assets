// OpenStreetMap extrusions the Studio Bell model replaces. Retrieved 2026-10-02 through the shared Overpass queue,
// (c) OpenStreetMap contributors, ODbL 1.0. Ring 1 is Studio Bell (way 317559844, building=commercial, 850 4 Street SE,
// layer=1, height 15.24 m, 5 levels): one outline that holds the east tower block, the west block behind the hotel and
// the skybridge over 4 Street SE with its flared ends. Ring 2 is the King Edward Hotel (way 550777783), which stands
// between the west block and the street and sits partly under the skybridge: the model draws it, so it is listed.
// Neighbours (N3, the Hillier Block, the St. Louis Hotel, the Energy Centre) stay provider.
export const FOOTPRINTS = [
  // Studio Bell (way 317559844)
  [[-114.0529574, 51.0447495], [-114.0529647, 51.0446878], [-114.0529770, 51.0446665], [-114.0530044, 51.0446465], [-114.0530492, 51.0446382], [-114.0530966, 51.0446350], [-114.0531123, 51.0446339], [-114.0532129, 51.0446344], [-114.0533339, 51.0446377], [-114.0533694, 51.0446396], [-114.0534810, 51.0446470], [-114.0535223, 51.0446588], [-114.0535435, 51.0446707], [-114.0535595, 51.0446848], [-114.0535721, 51.0447041], [-114.0535808, 51.0447737], [-114.0537396, 51.0447747], [-114.0537638, 51.0444480], [-114.0535996, 51.0444403], [-114.0535812, 51.0445023], [-114.0535653, 51.0445275], [-114.0535439, 51.0445436], [-114.0535188, 51.0445544], [-114.0534895, 51.0445624], [-114.0533722, 51.0445637], [-114.0533376, 51.0445650], [-114.0532155, 51.0445618], [-114.0531150, 51.0445577], [-114.0530986, 51.0445548], [-114.0530513, 51.0445465], [-114.0530147, 51.0445356], [-114.0529898, 51.0445151], [-114.0529716, 51.0444825], [-114.0529668, 51.0444211], [-114.0523802, 51.0444025], [-114.0523534, 51.0447330], [-114.0529574, 51.0447495]],
  // King Edward Hotel (way 550777783)
  [[-114.0535808, 51.0447737], [-114.0535996, 51.0444403], [-114.0536010, 51.0444163], [-114.0534892, 51.0444133], [-114.0534407, 51.0444163], [-114.0534295, 51.0444192], [-114.0534224, 51.0444276], [-114.0533926, 51.0447705], [-114.0535808, 51.0447737]],
];

export const OSM_WAYS = [
  317559844, // Studio Bell: east block, west block and the skybridge over 4 Street SE
  550777783, // King Edward Hotel, 1905
];
// Derived data (c) OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
