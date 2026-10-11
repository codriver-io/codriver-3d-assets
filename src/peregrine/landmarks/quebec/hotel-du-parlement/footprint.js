// OpenStreetMap extrusion the model replaces, fetched through the shared Overpass queue (tmp/quebec/hotel-du-parlement/rel196002.json):
//  * relation/196002, the Hôtel du Parlement (building=public, 4 levels): one outer way (27072400) around a courtyard hole (way 39012651).
//    The outer ring is the whole quadrangle; the courtyard hole stays provider (it has no extrusion).
// The Édifices Pamphile-Le May, Honoré-Mercier, André-Laurendeau, Jean-Talon and Jean-Antoine-Panet are separate buildings and stay provider.
export const FOOTPRINTS = [
  // relation/196002, outer way 27072400
  [[-71.2147028, 46.8084678], [-71.2150497, 46.808721], [-71.214138, 46.8092749], [-71.2133329, 46.8086402], [-71.2133914, 46.808602], [-71.2142479, 46.8080968], [-71.2145781, 46.8083686], [-71.2145982, 46.8083594], [-71.2146196, 46.8083753], [-71.2147229, 46.8084522], [-71.2147028, 46.8084678]],
];
export const OSM_WAYS = ['relation/196002', 'way/27072400'];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
