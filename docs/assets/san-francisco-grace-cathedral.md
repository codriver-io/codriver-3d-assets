# Grace Cathedral, San Francisco

Original procedural model of Grace Cathedral (1100 California St, Nob Hill) for Cityscape and Full 3D world. Part of the [San Francisco landmarks](../san-francisco-landmarks.md).

Build: `pnpm build:san-francisco-landmarks grace-cathedral`. Source: `src/peregrine/landmarks/san-francisco/grace-cathedral/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `grace-cathedral-plan.js`, `-kit.js`, `-tower.js`, `-front.js`, `-body.js`, `grace-cathedral.test.js`). Catalog record: `prototypes/assets3d/catalog.d/grace-cathedral.json`.

## What it is

The cathedral church of the Episcopal Diocese of California: French Gothic revival (Bodley, then Cecil Hare, completed locally by Lewis P. Hobart) in poured reinforced concrete, built in four campaigns 1928-1964. The state modelled is today's. The front with the twin towers, the rose window and the Ghiberti-replica "Gates of Paradise" faces **east onto Taylor Street** (Huntington Park across the street), up the Great Stairs; the apse is at the Jones Street end. The brief's "north tower is taller" is not supported: photographs and Wikipedia ("the towers are 174 ft") show two equal towers (the north one holds the carillon).

What a driver reads: at 100 m the flat-topped towers with open belfries, crenellated parapets and corner pinnacles, the rose window over the pointed portal and the stairs; at 800 m the twin towers, the long dark nave roof, the transept gables and the 75 m needle flèche over the crossing.

## Frame, origin, orientation

* Origin `[-122.4134362, 37.7918386]`: area centroid of OSM way 32946942 (fetched 2026-10-01 through Nominatim lookup for the outline and the shared Overpass helper for the parts).
* The walls are exactly axis-aligned once the grid skew is removed: the nave axis runs **8.8 degrees north of east** (bearing 81.2 degrees; 98.8 degrees is the Y-up rotation baked into the GLB, `SPEC.rotationDeg`). The model is authored in axis coordinates (x lateral, z along the nave, front on +z) with one translation (the axis runs 1.65 m off the centroid) and one rotation at the end. `frontageBearing` 81.2.
* `y = 0` is the **Taylor Street pavement at the foot of the Great Stairs** (the datum of Wikipedia's "above street level" heights). The church floor and doors stand 6.1 m above it. The walls rise from y = 0; the modelled stairs (24 risers, 14 m deep, 28 m wide) climb to 6.1 m. No hill, no terrain, no Mercator scale is baked in. Nob Hill's slope (Full 3D world) is the terrain pad's job (`padM` 62).

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Towers, to the top of the corner pinnacles | 53.0 m | sourced: Wikipedia (174 ft), OSM `height=53` |
| Flèche, to the cross | 75.0 m | sourced: Wikipedia (247 ft), OSM part `height=75` |
| Entry floor above street | 6.1 m | sourced: Wikipedia (20 ft) |
| Length, portal to apse | 95.7 m (apse tip at -53.4, portal at +42.3 m on the axis) | mapped (Wikipedia: 100 m overall) |
| Across the transepts | 43.4 m (modelled +-21.4 m) | mapped (Wikipedia gives 49 m; the model follows the map) |
| Front width / towers / central bay | 26.8 / 8.2 x 10.8 / 10.3 m | mapped (OSM tower parts) |
| Nave and aisles | 26.7 m wide, five bays of 8.1 m, z -12.1 to 29.7 | mapped width; bay count and pitch estimated from photographs |
| Choir / apse | 17.6 m wide, to z -42 then a seven-facet apse | mapped |
| Flèche base | ~3.3 m across (mapped), modelled 4 m octagon tapering | mapped / estimated |
| Aisle wall / clerestory and nave eave / nave ridge and gable apex | 24.5 / 34.5 / 43.5 and 43.8 m | estimated (photographs; the gable apex was lowered 3 m after the review, so the flèche shows over it from the street) |
| Transept eave / ridge, choir ridge, chapel ridge | 32.5 / 41.5, 37.0, 17.5 m | estimated |
| Belfry openings / parapet | y 41.8-48.3 / to 50.7 m, tall pointed openings 1.8 m wide, three per side face and two per front face | estimated |
| Rose window | about 7 m across, centre 31.6 m, twelve outer and twelve inner petals round a hub | estimated (photographs) |
| Portal | arch 5.4 m wide, top about 20 m, two stepped arch orders, gable apex 27.2 m, doors 6.2 m; the canopy front stands 1.1 m (orders 1.9 m) beyond the mapped porch line | estimated; the extra projection is the model's, so the porch reads as a deep gabled canopy |

## Materials

`stone` (weathered concrete, beige-grey), `recess` (darker stone: blind arches and arch orders), `concrete` (the stairs), `roof` (dark grey metal roofs), `spire` (green-grey copper flèche), `glass` (dark window panels and the unlit belfry liners), `glow` (the rose window: blue-grey by day, warm lit at night; drawn unshaded), `brass` (the gilded doors and the cross; near only). Far uses seven materials.

## Modelling decisions

* **The outline is the plan.** Walls follow the mapped rectilinear plan inside the 1 m footprint slack; the aisle walls are inset 1.15 m behind projecting buttress piers so the piers sit on the mapped line.
* **Open belfries.** Each tower's belfry is a ring of four thin slabs extruded with tall pointed holes between corner turrets, with a dark liner just inside each slab, so the sky shows through the openings and the interior reads dark. Kept in far.
* **Flat panels for tracery**: lancets, recess arches, receding portal orders, oculi, blind arcade, the rose wheel (ring, petals, hub, glowing disc) are cheap flat polygons offset 0.06-0.3 m from the wall; pinnacles are 4-sided pyramids; flyers are slanted bars.
* **Stepped corner buttresses.** Each tower corner is a three-stage pier with weathered setbacks and triangular gablets on its two outward faces; the nave aisles have two-stage piers with gablets and curved four-bar flyers up to pinnacled abutments on the clerestory.
* **The flèche has an open lantern** (eight slim columns, pierced pointed frames, foot pinnacles) and crockets leaning out of the eight spire edges.
* **Roofs are closed prisms** (nave, transept, choir, chapel, porch) crossing through each other; gable walls stand slightly proud as coping so no slope is coplanar with a roof.
* **The chapel wing** (OSM `building=chapel`, way 939433952) is a gabled vessel on the south of the choir with a lower chamfered extension; the neighbouring building ways north of the choir are not modelled.
* **Far LOD** keeps the towers with their openings, the rose disc, portal, big arches, roofs and the flèche, and drops crenellations, flyers, small windows and the doors.

## Approximations

* Heights between the sourced tower and flèche tops and the street are estimated from photographs; the exact nave ridge, eave, aisle and belfry heights may be off by 1-2 m.
* Carved ornament, tracery (beyond the rose wheel, aisle and transept mullions), crockets (only on the flèche), gargoyles and the concrete board-marking texture are absent. The porch canopy is modelled 1.1 m deeper than the mapped 1.8 m (orders 1.9 m) to read as a gabled porch; Roof planes are plain.
* The Great Stairs are one straight flight with four pipe handrails and no side flights; the real stairs are wider with landings.
* Colours are two flat tones (stone and recess) taken from photographs; the sky and ground in renders are the harness's.
* The apse and the north side are extrapolated from the south and front photographs.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 12,185 | 8 | 754,092 |
| Far | 2,479 | 7 | 161,224 |

Budgets 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. Desktop numbers, not in-car measurements.

## Verification evidence

References (Commons, in ignored `tmp/san-francisco/grace-cathedral/refs/`, none shipped; authors in the catalog record): the Taylor Street front from the stairs, the front and south side from the corner, the flèche, a side view with the Flood mansion, a view from Huntington Park, and a front-quarter view. Renders (`tmp/san-francisco/shots/grace-cathedral/`), procedural source and exported GLB, near and far, light and dark: overview, facade, towers (belfries), portal (doors), roof/plan, south side with chapel, flèche, apse/west with chapel gable, north side, and close-ups of the portal and the tower-to-nave junction.

Changes made because of the renders: belfry openings widened and lined dark after the stone-coloured reveals read as slits; the first portal "orders" were filled panels hiding the arch and became rings; the arch and gable were lowered and the rose window moved down about 1.5 m after perspective correction against the front photograph; stair rails removed (floating); the chapel plan was cut back to the mapped outline after the outline test found a 3 m overhang; far gained flat lancets for the facade.

Fix round after the independent review (PASS-WITH-NITS): cooler grey stone (the belfry reveals no longer read olive), stepped gablet buttresses on the towers, a deep porch with two arch orders and no coplanar front faces, petals instead of spokes in the rose, taller paired belfry lancets with thinner slabs, nave buttress piers with curved flyers, an open lantern and crockets on the flèche, aisle window mullions, stair handrails, and the central gable and nave roofs lowered about 3 m (apex 43.8 m).

Tests: `grace-cathedral.test.js` (11 tests: outline axis alignment and length, tower and flèche heights, stairs reaching 6.1 m, footprint containment within 1 m, nothing below grade, belfries open by raycast, doors, arch depth and the glowing rose by raycast, exported GLB parity) plus the shared `san-francisco.test.js`.

Cityscape: **not tested** in the app. Full 3D world: **not tested**; the model is rigid on y = 0 and the terrain pad (`padM` 62) is expected to flatten under it.
