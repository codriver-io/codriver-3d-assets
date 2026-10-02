# San Francisco City Hall

Original procedural model of San Francisco City Hall (1 Dr Carlton B Goodlett Place), for Cityscape. Part of the [San Francisco landmarks](../san-francisco-landmarks.md).

Build: `pnpm build:san-francisco-landmarks san-francisco-city-hall`. Source: `src/peregrine/landmarks/san-francisco/san-francisco-city-hall/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `san-francisco-city-hall-plan.js`, `-facade.js`, `-dome.js`, `-kit.js` and `san-francisco-city-hall.test.js`). Catalog record: `prototypes/assets3d/catalog.d/san-francisco-city-hall.json`.

## What it is

Arthur Brown Jr.'s Beaux-Arts City Hall (construction 1913 to 1915, reopened for the Panama-Pacific Exposition), faced in Madera County granite, on the Civic Center block between Polk Street (east, the Civic Center Plaza front), Van Ness Avenue (west), Grove Street (north) and McAllister Street (south). The modelled state is today's building: base-isolated since 1999, gilded dome and lantern, no later additions on the roof that read from a road.

What a driver sees, and what the model spends its budget on:

* the **dome** from far away: slate-blue shell with twenty-four gilded ribs and cartouches, a coupled-column drum, a gilded two-stage lantern with open columns and a slender dark spire ending in a gilt finial, 93.7 m above grade (307.5 ft, taller than the US Capitol dome);
* the **Polk Street front** from the plaza: six-column pedimented portico on a rusticated base with three arched doors (gilded string course and grilles) and a stair, tall arched windows behind the columns, two Doric colonnaded wings of eight bays each (two window rows between free columns), pedimented end pavilions;
* the matching **Van Ness Avenue front** (deeper stair) and the two long sides with a middle colonnade between pedimented pavilions;
* the roof spine behind the pediments, the square rotunda block with its arched side windows, the round stage under the drum.

## Frame, origin, orientation

* Origin `[-122.419239, 37.7792759]` is the area centroid of the outer ring of OSM relation 7261820 (outer way 494810795, fetched 2026-10-01). The eight light courts are inner ways, holes the provider leaves empty, so only the outer ring and the rotunda `building:part` ways are in `FOOTPRINTS`. The two tiny spire parts (ways 494810820 and 494810823, under 4 m2) are listed as one 1.3 m circle on their axis.
* The Civic Center grid is not cardinal. The mapped walls run at bearing **80.9 degrees** (Polk Street front, ENE) and **170.9 degrees** (Grove and McAllister). The model is authored in building axes (x toward Polk Street, z along the front) and rotated once, by 9.1 degrees (`SPEC.rotationDeg`), onto east/up/south inside the geometry. The Polk front looks toward bearing 80.9 (`frontageBearing`).
* `y = 0` is local flat-map grade at the Polk Street and Van Ness pavements. The block is level in the model; no terrain, sea level or latitude stretch is baked in.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Height to finial | 93.7 m | sourced: 307.5 ft (Wikipedia, City and County of San Francisco); OSM part tops out at 93 m |
| Outline | 127.5 m along the Polk front x 97.9 m deep, area 11,100 m2 | mapped (OSM relation 7261820); Wikipedia's 390 ft and 273 ft are the block, not the outline |
| Rotunda centre | on the outline's centroid (offset 0.4 m, 0.4 m) | mapped (OSM way 494810785) |
| Dome base radius / springing | 13.9 m / 59.0 m | radius mapped (OSM dome part 13.7 m); springing between OSM (60 m) and photographs (58.2 m) |
| Dome crown, lantern, spire | 73.6 m / 74.1 to 84.3 m / 84.3 to 93.7 m | estimated from photographs; OSM puts the lantern at 74 to 81 m |
| Dome profile and ribs | stilted ellipse (13.9 m x 15.4 m semi-axes), 24 gilded ribs | profile estimated; rib count from the front and west photographs |
| Colonnade drum | 16 coupled-column clusters, core radius 15.8 m, columns to 17.8 m, 41.8 to 51.6 m | OSM drum parts (r 15 to 17 m, 40 to 56 m); clusters and heights estimated |
| Round stage / balustrade course | 32.2 to 40.4 m (r 18.2 m) / to 42.0 m | estimated |
| Wing parapet / entablature top / column top / base | 26.0 / 23.4 / 20.9 / 6.5 m | estimated from the plaza photographs (parapet near 26 m, OSM relation height 30 m) |
| Wing bays | 8 per wing, 4.07 m pitch, columns r 0.62 m | spacing measured from photographs, column radius estimated |
| Central pavilion | 31.2 m wide, six columns r 0.95 m at +-3.4, 9.6, 12.3 m, entablature 28.8 m, pediment apex 33.3 m | width mapped (outline), columns and heights estimated |
| End pavilions | 10.9 m wide, two columns, pediment apex 25.6 m | width mapped, rest estimated |
| Long sides | 44.8 m middle colonnade (11 bays) between 17.2 m pavilions projecting 2.2 m | plan mapped, elevation estimated |
| Roof spine | 30 m wide, eave 31.0 m, ridge 35.4 m (OSM parts: 30 to 35 m flat, 35 to 38 m gabled) | estimated |
| Portico and stair | front 1.25 m (Polk) / 2.05 m (Van Ness) beyond the wing plane, steps to 3.75 m / 7.75 m | mapped (outline) |

## Materials

Eight names, in both palettes: `stone` (granite), `stone2` (shaded walls behind the colonnades, the loggia, tympana, rustication joints), `roof` (verdigris-grey wing roof and skylights only), `dome` (slate shell and spire), `gold` (daylit door grilles and the portico string course), `lamp` (the dome's gilded ribs, band, cartouches, lantern, finial: drawn unshaded, day gold by day, bright warm gold at night), `glass` (windows and doors), `light` (the lantern's glazing: dark amber by day, unshaded and warm at night). The real dome, drum and colonnades are floodlit at night, so the night palette lifts the dome to a pale teal-grey and only dims the stone; the self-lit `lamp` gold and `light` lantern carry the night read at 800 m. Light palette stone `#d1cbbd`, dome `#566171`, gold `#d9aa38`; night stone `#9b9ea5`, dome `#7d98a6`, lamp `#ffd777`. In the far LOD the minor `gold` string course folds into `lamp`, so far has 7 draws.

## Modelling decisions

* **The dome is the far-LOD hero.** One lathe (24 segments near, 12 far) with the 24 ribs as triangular-section ridges on the segment seams (12 in far), 12 cartouches as oriented boxes, a coupled-column drum of sixteen clusters with sixteen windows, an attic ring with sixteen urns, and a lantern of gold prisms and columns over a glowing core. The far model keeps the same silhouette, gold ribs and the open lantern.
* **The plan is the mapped outline**: wing planes at the mapped depths, the end pavilions and the central pavilions projecting by their mapped amounts, the long-side pavilions at the mapped bays. Facade pieces are stacked boxes so no two exterior walls share a plane; windows are single quads offset 0.06 to 0.12 m from their walls.
* **Facades are rhythms**: free columns (8 sides near, 4 far; 10 and 5 on the portico) in front of a shaded recess, two window rows per bay, lintels and sills (near), a rusticated base with joint lines (near), a parapet with attic slots (near). Repeated parts are merged per material, 8 draws near and 7 far.
* **The roof is a truncated hip** (verdigris `roof`) under the parapet ring, with a stone gabled spine across the middle (it was verdigris until review: the wedge above the Polk pediment read as a green roof, the spine is granite) and the square rotunda block through it, so the view from the drum and from above is plausible without modelling the light courts.
* **No lettering** was modelled: nothing on the building reads from a road.

## Approximations and known weaknesses

* The Van Ness (west) front repeats the Polk composition with a deeper stair; the Grove and McAllister sides are reasoned extensions (a middle colonnade between pedimented pavilions). No photograph of those was studied closely.
* Sculpture (the pediment groups, the rotunda statues), carved relief, balusters, flags, lamp standards and the gilded entrance ironwork are abstracted: the tympana are flat recesses, the parapet is a slotted wall, the grilles are bars.
* The corner notches of the mapped outline are filled by short wall returns; the light courts are closed by the roof; the roof is a simplified hip, not the real skylit pitched strips.
* Heights between sourced anchors (finial 93.7 m, outline, OSM rotunda parts) are estimated from perspective photographs and are good to about 2 m; the lantern stages are simplified from a more ornate original.
* Gold leaf is one flat colour; the dome slate is one colour; the real stone varies with weather and light.
* Cornices and pediment overhangs project up to about 0.7 m beyond the mapped wall line.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 12,112 | 8 | 572,740 |
| Far | 4,682 | 7 | 234,116 |

Budgets are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. Far is about 39% of near by triangles. Triangle counts describe the export, not Tesla performance.

## Verification evidence

Reference photographs (Wikimedia Commons; downloaded to ignored `tmp/san-francisco/san-francisco-city-hall/refs/` only to compare, none shipped; authors and licences in the catalog record): the Polk front from the plaza, the dome and portico from the front, the plaza vista, two oblique aerials, a dusk aerial, the west side and a night view.

Renders read with `tmp/san-francisco/shot.mjs` (under `tmp/san-francisco/shots/san-francisco-city-hall/`): overview, facade, dome, portico, colonnade, rear (Van Ness), side (McAllister), roof and top plan (with the red OSM rings), a street-level view at 150 m, a north-east corner close-up, a north-west high oblique, framed comparisons (against the plaza photograph at the same width/height ratio; against the dome photograph; a lantern close-up in light and dark), in near and far, light and dark, procedural source and exported GLB.

Changes made because of what the screenshots showed: the first pass read as one flat pale mass, so the walls behind the colonnades became a darker `stone2` and the rusticated base got joint lines; the gold ribs were too fat (0.7 m wide) and went to 0.5 m, and the cartouches, first stuck on at a wrong tilt, were rebuilt from the surface normal; the lower rotunda stage was a different tan and became granite with joint rings; the lantern was a muddy tan block, so its glazing became dark by day (lit at night), its upper stage slimmer, with pinnacles; the top plan showed the end pavilions overshooting the outline by 1.6 m at the corners, so they were pulled back to the mapped 59.1 m with a short wall return; the entrance doors read as holes and gained gold grilles; the wing windows gained lintels and sills. The framed comparison against the plaza photograph matched the facade width to total height ratio (1.64 against 1.67) and the drum to facade width ratio (0.22 against 0.23).

`san-francisco-city-hall.test.js` pins: the outline size (127.5 m x 97.9 m) and front bearing (80.9), the finial at 93.7 m over the mapped rotunda axis with nothing else above the 35 m spine ridge, the dome radius at 64 m, a gilded rib on every meridian and slate between them (24 near, 12 far), the six portico columns, three arched windows and three arched doors by raycast, daylight between the columns in both LODs, seven free columns in an eight-bay wing, the pedimented end pavilions, containment within 1 m of the mapped outline, far-LOD bounds and negative space, and the GLB round trip. Review round: the night model was a grey mass with one lit dot, so the dome's gilded parts moved to the self-lit `lamp` material and the night dome and stone were lifted; the spine roof became stone; far columns went to 4 sides. The tests now also pin that the finial and ribs are `lamp`, that the day gold equals the lamp colour while the night lamp is brighter, that far stays within 8 draws, and that no `roof` material shows above the pediment. `san-francisco.test.js` passes for this landmark.

Cityscape and Full 3D world in the running app: **not tested yet, integration is checked separately.**
