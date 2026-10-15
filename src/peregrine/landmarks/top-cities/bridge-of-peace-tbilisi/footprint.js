import { ROOF_RING } from './bridge-of-peace-tbilisi-parts.js';
// Two provider outlines sit under the bridge. OSM way 1207561125 (building=roof, man_made=bridge) is a 2 m sliver along
// the 149 m roof axis. OSM way 440933580 (building=roof, roof:shape=round, roof:material=glass, height=20, min_height=8,
// layer=2; added after the first dossier) is the glazed canopy's own outline, ~100 m x 15 m: the provider extrudes it as
// a solid white 20 m lens (the review's "extrusion hiding the bridge"), so it is owned here too. The deck, stairs and piers
// cover water, quay and park, not buildings.
export const CANOPY_ROOF_RING = [[44.8075928, 41.6929305], [44.807641, 41.6929142], [44.8078513, 41.6928835], [44.8079158, 41.6928917], [44.8080775, 41.6929126], [44.8081682, 41.6929205], [44.8082589, 41.6929284], [44.8084728, 41.6929254], [44.8086401, 41.6929113], [44.8087334, 41.6929168], [44.8088109, 41.6929361], [44.8089035, 41.6929625], [44.8089448, 41.6929869], [44.8089527, 41.6930068], [44.8089462, 41.6930241], [44.8089194, 41.6930364], [44.8088954, 41.6930467], [44.8087776, 41.693074], [44.8086963, 41.6930811], [44.8086537, 41.6930795], [44.8086157, 41.6930753], [44.8084333, 41.6930466], [44.8082233, 41.6930372], [44.8080659, 41.6930386], [44.8080015, 41.693044], [44.8078818, 41.693055], [44.8077767, 41.693047], [44.8076674, 41.693019], [44.8075936, 41.6929915], [44.8075685, 41.6929592], [44.8075761, 41.6929442], [44.8075928, 41.6929305]];
export const FOOTPRINTS = [ROOF_RING, CANOPY_ROOF_RING];
export const OSM_WAYS = [1207561125, 440933580];
// Mapped pedestrian axis and stair ways the alignment was read from (not provider extrusions).
export const ALIGNMENT_WAYS = [125589004, 784030759, 77984293, 1047664365, 77984294, 1047664416];
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
