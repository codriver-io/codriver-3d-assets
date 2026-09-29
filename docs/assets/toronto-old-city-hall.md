# Old City Hall, Toronto

Original procedural model of Toronto's Old City Hall (60 Queen St W), for Cityscape. Part of the [Toronto landmarks](3d-toronto-landmarks.md).

Build: `pnpm build:toronto-landmarks old-city-hall`. Source: `src/peregrine/landmarks/toronto/old-city-hall/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `old-city-hall-plan.js`, `old-city-hall-tower.js`, `old-city-hall-solids.js`, `old-city-hall.test.js`). Catalog record: `prototypes/assets3d/catalog.d/old-city-hall.json`.

## What it is

E. J. Lennox's combined City Hall and York County Court House, built 1889-1899 (opened 18 September 1899), Richardsonian Romanesque, in brown-grey and reddish-brown sandstone under steep dark hipped roofs. Round a courtyard, seven storeys, on the north side of Queen St between Bay St (west) and James St (east), Albert St behind. It served as City Hall until 1965 and is now a courthouse. The modelled state is today's: the building as it stands, roof in dark grey-green metal (OSM tags `roof:material=copper`, `roof:colour=#483C32`; photographs show weathered grey-green, and the palette follows the photographs).

What a driver sees, and what the model spends its budget on:

* the **clock tower** off-centre on the Queen St front, which terminates the Bay St vista: 103.64 m, four 6 m dials, a three-arch belfry, a small arcade, four bronze corner gargoyles, a stone clock stage, and a pyramidal spire with a cross;
* the **porch of three round portals** beside the tower base and the **narrow round turret** at its east end under a cone roof;
* four **corner pavilions** under tall pyramidal hips, each with a gabled front, and gabled **central bays** on the west, east and north faces flanked by cone-roofed turrets (square pyramid-roofed ones on the north);
* the banded ashlar walls: red string courses at every floor, two-storey round arches over mullioned windows on the pavilions, and an arcade under the cornice.

## Frame, origin, orientation

* Origin `[-79.38176399, 43.65264186]` is the area centroid of the outer ring of OSM relation 3116 (way 12906398, v22, 2025-05-28; fetched 2026-09-29). The courtyard is inner way 12906420, a hole the provider leaves empty, so only the outer ring is in `FOOTPRINTS`. No `building:part` ways lie inside it.
* Toronto's grid is not 17 degrees off north in the direction the contract's shorthand suggests: the mapped walls run at bearing **73.25 degrees** (Queen St, ENE) and **343.25 degrees** (Bay St, NNW). The model is authored in building axes (u along Queen St, v into the block) and rotated once, by 16.75 degrees, onto east/up/south (`SPEC.rotationDeg`). The Queen St front looks toward bearing 163.25 degrees (`frontageBearing`).
* `y = 0` is local flat-map grade. No terrain, sea level or latitude stretch is baked in. The Queen St front and the courtyard are treated as one level.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Tower height, to top of finial | 103.64 m | sourced: Wikipedia, City of Toronto (340 ft) |
| Clock dial diameter | 6.0 m | sourced: Wikipedia, City of Toronto (20 ft) |
| Belfry cornice height | 73.2 m | sourced: City of Toronto gives the tower as 240 ft before its 45 ft spire |
| Tower stage heights above the belfry (arcade, gargoyle cornice, clock stage, spire) | 78.6 / 80.2 / 88.3 / 101.9 m | estimated from photographs against the sourced total (long-lens views: dial nearly fills its stage) |
| Tower base | 12.3 x 11.5 m | mapped outline (the OSM outline projects 12.4 m from the wall over 24.5 m); the City of Toronto's "72 ft" base is not reproduced |
| Tower shaft / belfry width | 11.0 / 10.4 m | estimated |
| Outline | 88.3 m along Queen St x 95.0 m deep, area 7,374 m2 | mapped (OSM) |
| Courtyard | 31.5 x 38 m (L-shaped) | mapped, left open in the footprint and closed by a flat dark deck in the model (glass material) so the wing roofs read as hipped ranges round a court |
| Storeys | 7 (base, three floors, arcade, attic in the roof) | sourced: Wikipedia, OSM `building:levels=7` |
| Cornice: pavilions / other walls | 26.4 m / 25.0 m (central bays 26.0 m) | estimated (storey count; photographs) |
| Pavilion roofs, apex | about 46.4 m (rise 20 m, ~66 degrees) | estimated from telephoto photographs against the tower |
| Wing ridges | S 40.2, W and E 40.6, N 35.6 m | estimated (roof plan behind the pavilions is not visible from the street) |
| Round turret | radius 2.6 m (mapped arc), drum to 21.4 m, cone tip 31 m | radius mapped; Wikipedia gives 21.4 m for the turret and 10.7 m above the roofline; tip estimated from photographs |
| Porch | 12.2 m wide x 11.5 m deep, 9.6 m tall, three portals 3.1 m wide, crown 5.7 m | mapped footprint; portal proportions estimated from photographs |

## Materials

Every material is a key of both palettes: `stone` (ashlar walls), `band` (mid-brown course between the floors), `redstone` (string courses, arches, cornices, tower ribs and base), `roof` (steel-grey roofs and the spire), `glass` (dark window recesses), `trim` (bronze gargoyles, cresting, finial), `brass` (dial numerals and hands), `glow` (the dial faces). `glow` is drawn unshaded: a dark verdigris dial by day, warm-lit cream in the night palette, the only self-lit part of the building. Light palette: stone `#8d7d6c` (brown-grey), band `#7b6455`, redstone `#77493c` (deep red-brown), roof `#48524f`; retuned after review against the frontal, south-west and corner photographs, which read darker and browner than the first cream and salmon. The OSM tag `building:colour=#954535` is the bright end of the range. The night palette dims the stone and roof and leaves the dials lit.

## Modelling decisions

* **The plan is the mapped outline**, tiled into disjoint boxes (four pavilions, four wings, the shoulder bay, three central bays), so no two exterior walls share a plane. The tower and porch stand on the mapped projection. The roof volumes are closed convex solids that overlap and let the depth buffer make the valleys, with the wing ridges buried inside the pavilion hips.
* **The tower is the far-LOD hero.** It is built stage by stage with sourced overall height and belfry cornice, and its silhouette (spire, stone clock stage, gargoyles, belfry, shaft ribs) survives in the far model. The far model also keeps the dials, hands and the arched openings as dark quads.
* **Facades are rhythms, not textures**: string courses, banded courses, corner quoins, framed arched windows and giant arches are merged boxes and extruded frames. Repeated elements share one draw per material (8 in each LOD).
* **Roofs and gables are real volumes**: parapet gables (stone triangle, raking coping, small arches, rose window) in front of pitched roof blocks that run back into the main roof.
* **No lettering** was modelled: the building has none that reads from a road.

## Approximations and known weaknesses

* Carved ornament, sculpture, rustication depth and the cenotaph are abstracted or absent. The four corner gargoyles are small stone brackets, not sculpture.
* The plan above the cornice behind the pavilions is a plausible reconstruction: two crossing ridges per wing, a flat dark deck closing the court (an L, as mapped), chimney stacks and cresting. The real court roof is a skylit structure with two small square lantern towers that this model does not reproduce.
* The north and east elevations are extrapolated from the west and south fronts and from two aerial photographs; window counts are approximate.
* The north central bay carries square turrets and the west and east central bays round ones by analogy with the photographed west face. Whether the east face matches the west is unverified.
* Cornices, string courses and eaves project up to about 1.3 m beyond the mapped wall line (ground-level detail at most 0.7 m). The layer removes only provider triangles wholly inside the outline, so this only affects how the model sits against the street.
* Colours are two flat sandstone tones plus a mid band; the real building mixes several sandstones.
* Triangle counts describe the export, not Tesla performance. Near is heavy on bytes because the flat-shaded solids are unindexed.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 53,798 | 8 | 3,546,640 |
| Far | 8,498 | 8 | 470,144 |

Budgets are 160,000 / 48 and 45,000 / 14.

## Verification evidence

Reference photographs (Wikimedia Commons; downloaded to ignored `local-scratch/old-city-hall/` only to compare, none shipped; authors and licences in the catalog record): a frontal view from Bay St, a corner view from the south-east, a view from the west across Bay St, two high oblique aerials and one from the south, a north (Albert St) view, a long-lens view of the tower from Nathan Phillips Square, and a portal detail.

Renders read with `local-scratch/shot.mjs`-style harness (a copy under `local-scratch/old-city-hall/shot.mjs` that imports only this landmark, can recolour by palette name and shades with the layer's baked normal shading):

* overview from the south-west, Queen St front, Bay St (west) front, Albert St (north) back, east front, roofs from above and directly overhead (with the red OSM outline), tower, clock, porch, shoulder bay and SW pavilion detail, in near and far, light and dark, procedural source and exported GLB;
* comparison shots framed like the photographs: front and south-east corner (against the corner view; the composition matches), a telephoto west view (against the long-lens photo; the ratios tower tip : ridge : pavilion apex : cornice match to within a few percent), and high oblique views.

Changes made because of what the screenshots showed: gable roofs were extruded outwards instead of into the roof (found in the first pavilion close-up); the clock stage was too tall and its dial too low (the long-lens photograph puts the dial almost against the spire cornice), so the upper tower stages were raised about 5 m to the sourced 240 ft belfry cornice; the round turret was 42 m and dropped to 31 m; the tower base was a bare red slab and gained courses, windows and quoins; the flanking turrets were invisible (buried in the wall) and were moved to project; the banding was too loud and became a separate mid-tone `band` material; roof dormers looked like boxes and were replaced by small gables; pavilion and wing roofs were made steeper; the porch arches were raised. After independent review: the palette was darkened toward brown-grey stone and deep red-brown banding, the courtyard pyramid was replaced by the wing roofs sloping into a flat deck, the gargoyles became small stone brackets and the tower corner ribs were slimmed from 1.5 m to 1.0 m (belfry 1.4 to 1.0 m).

`old-city-hall.test.js` pins: tower height and the finial's position on the mapped tower plan, dials on all four tower faces (and their 6 m diameter), three open portals with masonry piers, the turret radius and cone tip, roofed pavilion apexes, courtyard cap, outline containment, far-LOD bounds and negative space, GLB round trip. `toronto.test.js` passes for this landmark.

Cityscape and Full 3D world in the running app: **not tested yet, integration is checked separately.**
