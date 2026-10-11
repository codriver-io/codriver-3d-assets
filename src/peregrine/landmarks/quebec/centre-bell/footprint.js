// Rings of [lng, lat] whose default provider extrusions this landmark replaces.
// OSM way 19911284 (building=stadium, leisure=stadium, name=Centre Bell / Bell Centre, start_date=1996,
// wikidata Q522282; retrieved 2026-10-03, © OpenStreetMap contributors, ODbL 1.0) is the whole arena:
// a 146 m x 107 m rectangle (15 046 m2) turned about 41 degrees from true north, with a 6 m notch on its
// south-west end, a 3.5 m protruding glazed front on the north-east side and a small rounded bay near the
// east corner. The Tour des Canadiens towers (way 95427586 and the building:part ways round it), L'Avenue,
// Gare Lucien-L'Allier and the office towers around are separate buildings outside this ring and are NOT
// included. The model is built inside this ring (see centre-bell.test.js).
export const FOOTPRINTS = [
  [[-73.5702444,45.4961044],[-73.5703634,45.4961816],[-73.5696798,45.4967517],[-73.5695759,45.496827],[-73.5692938,45.4966532],[-73.5692589,45.496681],[-73.568815,45.4964072],[-73.5685718,45.4962545],[-73.5685016,45.496211],[-73.5684249,45.4961663],[-73.5684486,45.4961437],[-73.5684182,45.4961236],[-73.5684075,45.4961244],[-73.568398,45.4961244],[-73.5683893,45.4961239],[-73.5683814,45.4961232],[-73.5683744,45.4961223],[-73.5683662,45.496121],[-73.5683558,45.4961189],[-73.5683454,45.4961158],[-73.5683369,45.4961121],[-73.568329,45.4961075],[-73.5683209,45.4961013],[-73.568315,45.4960953],[-73.5683093,45.4960885],[-73.5683052,45.4960809],[-73.5683026,45.4960729],[-73.5683007,45.4960636],[-73.5683005,45.4960563],[-73.568168,45.4959748],[-73.568486,45.495714],[-73.5685623,45.4956514],[-73.5690504,45.4952788],[-73.5697306,45.4956904],[-73.5699094,45.4958112],[-73.5701543,45.4959767],[-73.5701071,45.4960153]],
];
export const OSM_WAYS = [
  19911284, // building=stadium, name=Centre Bell
];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
