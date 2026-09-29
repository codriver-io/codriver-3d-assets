# St. Lawrence Market, South Market (Toronto)

Original procedural model of the **South Market** at 93 Front Street East, Toronto. File contract and budgets: [3d-toronto-landmarks.md](3d-toronto-landmarks.md). Source: `src/peregrine/landmarks/toronto/st-lawrence-market/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `st-lawrence-market-site.js`, `st-lawrence-market.test.js`). Build: `pnpm build:toronto-landmarks st-lawrence-market`. Exports: `public/models/buildings/st-lawrence-market{-near,-far}.glb` and `st-lawrence-market.json`.

## Identity and version

The market hall rebuilt in 1902-04 to John William Siddall's design (city architect's office), which keeps the centre block of the **1845 City Hall** in its Front Street facade: three stone arches at street level, a red-brick block with buff pilasters above, and (upstairs) the former council chamber that is now the Market Gallery. The 1845 pediment, cupola and side wings were demolished in the rebuild. What is modelled is the building as it stands today (2026): the brick hall under one arched metal roof with a clerestory lantern, the green copper eaves, the pedimented corner entrances, and the deck and colonnade at The Esplanade end.

**The North Market is not modelled.** It is a separate building across Front Street (the glass and green-roof North St. Lawrence Market opened in 2025; OSM way 1290813314 and its parts). It is not part of the heritage hall, is ~70 m from the origin outside the terrain pad, and the provider extrusion built from its mapped parts reads acceptably; its footprint is deliberately not in `FOOTPRINTS`, so the provider keeps drawing it.

## Sources

| What | Source |
| --- | --- |
| History, Siddall, 1845 centre block kept, "hybrid of arch roof with clerestory", Market Gallery in the council chamber | [Wikipedia, St. Lawrence Market South](https://en.wikipedia.org/wiki/St._Lawrence_Market_South), [Heritage Toronto](https://www.heritagetoronto.org/explore/building-toronto-map/building-toronto-lawrence-market/) |
| "Three stone archways ... part of the 1845 City Hall", "sweeping arched walls" | [Historic Toronto](https://tayloronhistory.com/2012/04/23/enjoying-torontos-architectural-gems-the-st-lawrence-market/) |
| Polychrome brickwork with stone detailing, view terminus looking east on Front | [ACO Toronto](https://www.acotoronto.ca/building.php?ID=2831) |
| Hall outline, wall 10 m, roof 10 m (total 20 m), brick colour `#954535`, roof colour, ridge strip 14.5 m wide at 19 m with a 21 m lantern part | OSM ways [24626769](https://www.openstreetmap.org/way/24626769), 1291184907, 304467236 (read 2026-09-29) |
| Photographs compared against (not shipped) | see the catalog record's provenance list |

## Dimensions

| Quantity | Value | Basis |
| --- | --- | --- |
| Hall plan | 43.3 m x 106.2 m rectangle, long axis 17.13 degrees off north (NNW-SSE) | **mapped**: OSM way 24626769 fits a rectangle to a few cm at that angle (`local-scratch/st-lawrence-market/fit.mjs`) |
| Facade bearing | 342.87 degrees (Front Street facade faces NNW) | mapped |
| Wall top (eave) | 10.4 m | OSM 10 m; +0.4 m for the cornice |
| Roof crown at mid width | 19.6 m | OSM part height 19 m, ridge photographed slightly higher; **estimated** |
| Clerestory lantern | 14.5 m wide, glazing to 20.25 m, ridge 21.2 m, stops 7.2 m short of the Esplanade wall | width/length **mapped** (OSM part), glazing height **estimated** (OSM 21 m) |
| Highest point | 24.8 m (flue on the Front Street chimney; brick chimneys 22.9-23.6 m) | chimney heights **estimated** from photographs |
| Bay module | 4.8 m, 20 bays per long side, 9 across each end (window 3.15 m, pier 1.65 m) | count **estimated** from photographs, fits the mapped length |
| Sill / eave / window head | 5.5 / 10.4 / 9.25 m (long walls) | **estimated** |
| Remnant block | 14 m wide, 13.9 m tall, three arches (2.5 / 4.2 / 2.5 m wide), 4 pilasters, 2 rows of 4 windows | width from the 1899 view and proportion to the hall, **estimated** |
| Corner pavilions | 8 m along the long wall, 1.14 m proud (OSM jog 1.0-1.25 m), fascia 8.6 m, pediment apex 13.4 m | proud/plan **mapped**, heights **estimated** |
| Deck and colonnade | starts 34 m from Front Street, 2.4 m deep, 3.8 m above grade, columns every 9.6 m | **estimated** |

## Materials (light / dark)

`brick` (red brick), `buff` (stone and yellow-brick pilasters and courses), `roof` (dark brown-grey standing-seam metal), `cladding` (olive-brown ribbed metal of the Esplanade gable), `copper` (green pent eaves, muntins, rake trim, railings, awnings, sign board), `glass` (remnant windows, shopfronts), `glow` (hall windows and lantern: unshaded, warm at night), `ink` (dark voids, sign board, black lettering), `plaster` (white entrance fascia), `sign` (gold lettering, unshaded), `concrete` (deck, columns, caps). Same keys in both palettes; the light palette was tuned against the layer's own vertex-lit shading (`shot.mjs --runtime` in the scratch harness), not only the inspector's lights.

## Modelling decisions

- **One rectangle, one rotation.** The hall is authored in its own frame (u along the Front Street facade, v towards The Esplanade) and the exported root is turned 17.13 degrees once. Every wall is drawn in a 2D wall frame (along, up, into-the-wall) so arches, reveals and lettering are written once and placed on all four sides. Windows are real reveals: wall panels extruded with arched holes, recessed panes and muntins.
- **Silhouette first.** The convex arched roof (steep at the eave, flat at the crown), the lantern along the ridge, the green flared eave, the Esplanade gable in dark ribbed metal with its sign, and the Front Street gable: shoulders following the arch, the lantern end as a peak, two brick chimneys.
- **Front Street facade.** Centre block with three vaulted arches (a metre deep, dark), buff pilasters, string courses, two window rows, sign board with "ST LAWRENCE MARKET" as stroked block lettering; two arched windows and doors either side; corner pavilions with the white lettered fascia, green pediment and disc.
- **Lettering is geometry** (a 12-glyph stroke font in `st-lawrence-market-site.js`), near model only; far keeps a single sign strip.
- **Flat grade.** The real site falls about a storey from Front Street to The Esplanade. The model keeps y = 0 everywhere: the lower storey is a solid brick base on the Front Street half (with doors) and an open colonnade under the deck on the Esplanade half, so each end looks right against a flat map. Full 3D world uses the same rigid model on the terrain pad.
- **Negative space in far LOD:** the open colonnade, the deck edge, the barrel profile and lantern, chimneys and vent stacks stay; windows become one glass band per wall between the piers.

## Approximations and limits

- Storey heights, bay count, window sizes and the deck extent are photograph estimates, not survey. The lower-level treatment (base/colonnade split at 34 m) is a simplification of a sloping multi-level site.
- The deck, columns and pent eave extend up to 3.4 m beyond the mapped outline (the OSM outline stops at the walls/roof edge); they overhang the sidewalk. The ridge lantern glazing and the roof vents are simplified; roof seams, gutters, snow guards, the stair to the deck, tenant signs and the two flagpoles are not modelled.
- Lettering uses a generic block face, not the market's actual lettering. The South Market's real window muntin pattern and brick coursing are not reproduced.
- The north (Front Street) footprint edge is the wall plane; the remnant block and pavilions stand 0.4 m proud of it, inside the mapped pavilion jogs.
- Costs are geometry counts, not measured Tesla frame times.

## Verification

Cost: near 18 674 triangles, 11 draws, 1.10 MB; far 3 566 triangles, 11 draws, 0.22 MB (budgets 160 000/48 and 45 000/14).

Screenshots looked at (all in ignored `local-scratch/shots/st-lawrence-market/`), procedural and exported GLB, compared with the Commons photographs listed in the catalog record: front (`facade`), Front Street corner (`entrance`, `ne-corner`), west and east long walls (`side`, `structure`), Esplanade end and colonnade (`colonnade`, `sw-corner`), roof and lantern from above (`roof`, `overview`), pavilion close-up (`porch`), near/far, light/dark (`--theme dark`, plus the layer's own shading with `--runtime`). Changes made because of them: the west-side piers were rendering inside-out (negative box size) and were fixed; windows were reshaped from semicircular to shallow segmental heads on the long walls after the detail photograph; the deck was lowered so the sills sit ~1.7 m above it as in the February 2026 photograph; awnings and shopfront panels were added; the shopfront panels' z-fighting with the dark wall was removed; the roof and cladding were darkened; the far remnant's single glass block was split into two window bands.

Tests: `node --test src/peregrine/landmarks/toronto/st-lawrence-market/` (rectangle, wall planes and bearing against the OSM ring; roof profile and lantern ridge by raycast; the three arches vs the stone between; window vs pier per bay on both walls; solid base vs open colonnade in near and far; pavilion fascia, pediment and door; sign board on the gable and lettering counts; brick inside the mapped ring; far bounds and cost; GLB round trip including the export rotation) and `toronto.test.js`.

| Environment | Status |
| --- | --- |
| Inspector, procedural and exported GLB, near/far, light/dark | verified (screenshots above) |
| Cityscape in the running app | not tested yet, integration is checked separately |
| Full 3D world | not tested yet, integration is checked separately |
