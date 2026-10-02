// OpenStreetMap ways the model replaces: the provider extrudes them as `building=yes` slabs, which would show under the
// elevated inruns. The mapped polygons are coarse (the K114 inrun way has a corner 14 m from the girder axis, 11 m past
// its west side, at the tower), so the model follows aerial imagery and the photographs; the rings only remove the
// provider extrusions.
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
export const FOOTPRINTS = [
  // way 272201820, man_made=ski_jump: the K89 (70 m) start house on its tower
  [[-114.2133277, 51.0771844], [-114.2132895, 51.0771768], [-114.2132263, 51.0771643], [-114.2132019, 51.0771595], [-114.2132251, 51.0771132], [-114.2133509, 51.077138], [-114.2133277, 51.0771844]],
  // way 272201821, piste:type=ski_jump: the K89 inrun
  [[-114.2129013, 51.07787], [-114.2128588, 51.0778624], [-114.2132263, 51.0771643], [-114.2132895, 51.0771768], [-114.2129013, 51.07787]],
  // way 272201822, piste:type=ski_jump: the K114 (90 m) inrun
  [[-114.2129992, 51.076761], [-114.212698, 51.0773858], [-114.2127769, 51.0774048], [-114.2130819, 51.0767785], [-114.2129992, 51.076761]],
  // way 272201825, piste:type=ski_jump: the K63 training inrun
  [[-114.212047, 51.0763316], [-114.2120187, 51.0764028], [-114.2119056, 51.0766868], [-114.2118575, 51.0768814], [-114.2119104, 51.0768859], [-114.2119752, 51.0766536], [-114.2120731, 51.0764069], [-114.2121024, 51.0763331], [-114.212047, 51.0763316]],
  // way 272201828, piste:type=ski_jump: the K38 training inrun
  [[-114.2115757, 51.0771302], [-114.2115369, 51.0771288], [-114.2115757, 51.0767127], [-114.2116169, 51.0767127], [-114.2115757, 51.0771302]],
];
export const OSM_WAYS = [272201820, 272201821, 272201822, 272201825, 272201828];
