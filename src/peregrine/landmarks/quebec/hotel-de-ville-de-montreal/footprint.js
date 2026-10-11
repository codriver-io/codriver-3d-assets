// OpenStreetMap extrusions the model replaces, fetched through the shared Overpass queue (tmp/quebec/hotel-de-ville-de-montreal/osm.json):
//  * way/20919180, the City Hall outline (Perrault & Hutchison's block with its front stair and the rear central bay);
//  * way/396654637, the rear block between it and the Champ-de-Mars. It carries no name or tags, but it is the 1932-34 extension
//    (agrandissement jusqu'au Champ-de-Mars, with its terrace): Wikipedia FR, Parcs Canada's character-defining elements ("un ajout
//    construit a l'arriere de l'edifice en 1932"), and the outline shares the rear wall of the City Hall over its full length.
// Chateau Ramezay (way 87415550), across rue Notre-Dame, and the Vieux palais de justice (way 20919178) are separate buildings and stay provider.
export const FOOTPRINTS = [
  // way/20919180
  [[-73.5538877, 45.5088089], [-73.5538501, 45.5087942], [-73.5538727, 45.5087661], [-73.5538397, 45.5087531], [-73.5538625, 45.5087247], [-73.5538937, 45.5086858], [-73.5539345, 45.5087019], [-73.5539498, 45.5086827], [-73.5539828, 45.5086957], [-73.554162, 45.5084725], [-73.5545525, 45.5086265], [-73.5545276, 45.5086601], [-73.5544064, 45.5088086], [-73.5544331, 45.5088676], [-73.5543253, 45.5090144], [-73.5542378, 45.5090303], [-73.5541261, 45.5091677], [-73.5541182, 45.5091749], [-73.5540054, 45.509129], [-73.5540156, 45.5091167], [-73.5539322, 45.5090828], [-73.5538085, 45.5090325], [-73.5537978, 45.5090454], [-73.5536994, 45.5090054], [-73.5537758, 45.5089131], [-73.5538056, 45.5089112], [-73.5538877, 45.5088089]],
  // way/396654637
  [[-73.5541261, 45.5091677], [-73.5543404, 45.5092532], [-73.5544834, 45.5090772], [-73.5544941, 45.5090744], [-73.5546094, 45.5089269], [-73.5546075, 45.5089168], [-73.5547457, 45.5087475], [-73.5545276, 45.5086601], [-73.5544064, 45.5088086], [-73.5544331, 45.5088676], [-73.5543253, 45.5090144], [-73.5542378, 45.5090303], [-73.5541261, 45.5091677]],
];
export const OSM_WAYS = ['way/20919180', 'way/396654637'];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
