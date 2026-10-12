# Westerkerk, Amsterdam

Original procedural church and Westertoren at Prinsengracht 281, Amsterdam; permanent restored architecture, without temporary scaffolding. Editable authoring lives in `src/peregrine/landmarks/top-cities/westerkerk/`, with texture-free near/far GLBs under `public/models/buildings/`. Contract: [top-cities landmarks](../top-cities-landmarks.md).

## Sources and dimensions

| Feature | Dimension | Basis |
| --- | --- | --- |
| Tower / highest point | 85 m excluding rooster, 87 m including rooster | [Official church visitor information](https://westerkerk.nl/bezoek-de-westerkerk-amsterdam/); SPEC.height uses highest point |
| Church | Published 58 × 29 m | [Wikipedia](https://en.wikipedia.org/wiki/Westerkerk); Hendrick de Keyser, 1620–1631 |
| Tower completion | 1638; upper stages diminish as squares | [Amsterdam City Archive](https://www.amsterdam.nl/stadsarchief/stukken/grachten-torens/westertoren/) |
| Brick tower / upper stages | 40 / 52 / 64 / 72 m | OSM ways 751083599 / 598 / 596 / 597; cap way 751083595 is tagged to 82 m |
| Nave eaves / ridge | 25 / 34 m | OSM way 749268118 (height 34, roof:height 9) |
| Twin transept eaves / ridge | 25 / 33 m | OSM ways 749268116 / 117 (height 33, roof:height 8) |
| Aisle / north vestry | Low aisle roof about 15 m; vestry 5 m | OSM ways 749268115 / 749287964 |
| Crown cap / orb / vane | Blue cap begins 76.75 m, orb near 80 m, rooster to 87 m | Estimated from photographs; small jewelry/feather profiles simplified |
| Origin | [4.8835355, 52.3745297] | Tower structural anchor, approximately its mapped centre |
| Frame | Nave 2.86° south of east; frontage 272.86° | Two south-wall control points of way 749268115: [4.8835983,52.3743932] and [4.8843132,52.3743716] |

The published church plan is distinct from the approximately 61 m mapped envelope including tower and attached houses. Individual pier, window, gable, clock and cornice dimensions are photographic estimates. Orientation is baked once into geometry and GLBs; +X east, +Y up, +Z south, local pavement y=0. No absolute altitude, Mercator stretch or terrain is authored.

## Ownership and provenance

Owns church way 99205257, tower way 99203577, their ten mapped building parts and the two attached tower houses (266616369, 266616410). All fourteen exact rings are in footprint.js; the irregular 5 m north vestry uses its mapped polygon. Nearby retail kiosks, houseboats and surrounding streets remain provider-owned. No plaza pad is modeled. Pier cornices and dressings remain within the provider replacement's 0.8 m tolerance; the test checks every vertex against the union of owned rings.

Original meshes, no scans, traced meshes, photographic textures or imported captures. Mapped geographic data © OpenStreetMap contributors (ODbL 1.0). Reference-only pictures are exclusively in ignored `tmp/top-cities/westerkerk/refs/`: Dietmar Rabich, [Amsterdam (NL), Westerkerk -- 2015 -- 7186](https://commons.wikimedia.org/wiki/File:Amsterdam_(NL),_Westerkerk_--_2015_--_7186.jpg), CC BY-SA 4.0; Taksen, [Roof top Westerkerk Amsterdam](https://commons.wikimedia.org/wiki/File:Roof_top_Westerkerk_Amsterdam.jpg), CC BY-SA 4.0; Massimo Catarinella, [WestertorenAmsterdam](https://commons.wikimedia.org/wiki/File:WestertorenAmsterdam.jpg), CC BY 3.0. The latter supplied the useful missing tower detail angle; its caption's 89 m is not used over the official church's height.

## Modeling decisions

Two equal transepts cross the tall longitudinal nave; low aisles retain a separate window rhythm. Tall arched glazed openings have pale surrounds and merged mullions in both LODs. Simplified gable scrolls, stone strings, ribbed brick piers and the attached tower houses complete the road-facing silhouette. The tower has a brick belfry shaft, weathered grey masonry stage, four red-brown clocks with gold ticks and hands, two genuinely open paired-arch stages, balconies, bells attached under their roofs, a curved square cap and a blue imperial crown. Crown ribs, circlet, white pearl tips, golden orb and rooster remain in far.

Eight merged materials: brick, stone, metal, roof, glass, recess, blue and gold. Pale church dressings differ from the tower's weathered grey surface. Night uses the same material keys with dimmer surfaces; the inspector renders reflected light rather than claiming a measured architectural floodlight rig. Glass has individual bays in far, never blank bands. Far reduces curve samples, column sections, balusters and thin window subdivisions, preserving massing and negative space.

Approximations: simplified ornaments, heraldic arms and rooster silhouette; clock ticks rather than individual Roman numeral lettering; no brick mortar, organ/interior, street kiosks or temporary construction equipment. The north vestry roof follows its outline as a low flat slab. No field-survey claim is made for window count or ornament profiles.

## Validation and integration

Rebuild with `pnpm build:top-cities-landmarks westerkerk --no-check`, regenerate `node scripts/landmark-depth-layers.mjs --ids westerkerk`, and check with `--check`. Focused tests pin highest point, twin roof ridges, clock and crown materials, belfry sightlines, exact owned OSM ids, footprint projection, LOD silhouette and named corner-capital contacts (including a deliberately shortened support that fails).

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Integration is checked separately by the lead. A rigid flat base is authored at local pavement; no terrain pad overrides or runtime layer changes. Provider masking, runtime unlit/vertex shading, terrain refinement, foundation datum, mode toggles, failed loads, driving and Tesla performance require the lead's separate app evidence.

Asset costs and judged final screenshot evidence are recorded below after the final export.

## Final asset costs and visual evidence — 2026-10-12

| LOD | Triangles | Draws | Bytes | KB (1024 bytes) |
| --- | ---: | ---: | ---: | ---: |
| Near | 31,712 | 8 | 1,167,916 | 1,140.5 |
| Far | 9,963 | 8 | 426,040 | 416.1 |

Measured from the exported default scenes. Far silhouette differs by only 7.5 cm at the westernmost thin window mullion; other bounding faces agree. Both retain the 87 m rooster tip. The deterministic metrics report is `tmp/top-cities/westerkerk/qa-metrics.json`: no issues, no back-face/layered-face failures, no removable bridgeLift data. Depth generation drops zero cycle edges and `--ids westerkerk --check` is current.

Judged the supplied reference sheet, exterior and roof ornaments, and added tower-detail photograph. Initial procedural sheet: `tmp/top-cities/shots/westerkerk/westerkerk-procedural-near-light-sheet.jpg`. That inspection prompted weathered grey tower materials, gable scrolls, attached-house roof/windows, and tighter mapped pier positions. A subsequent exported comparison exposed occluded far annex panes; these are now individual rectangular glass quads with measured depth clearance in both LODs, and a raycast regression checks visibility. Main church windows remain actual arched openings.

Final exported evidence, all judged together against the reference photos: `tmp/top-cities/shots/westerkerk/westerkerk-export-reference-contact.jpg`. It contains facade, back, roof, tower and crown views for near/far and light/dark, plus street views for each combination and the footprint top view. Underlying sheets: `westerkerk-glb-near-light-sheet.jpg`, `westerkerk-glb-far-light-sheet.jpg`, `westerkerk-glb-near-dark-sheet.jpg`, `westerkerk-glb-far-dark-sheet.jpg`; top image: `westerkerk-glb-near-light-top.png`, all in that same shots folder. Tower openings, crown ribs, window rhythm, roof crossings, opposite facade and rigid base read consistently across LODs. The contact sheets establish exported-asset appearance only; both app modes and independent review remain separate gates.

Focused landmark tests pass (six tests, under 3 seconds). No shared source change was needed except the authorized generated depth-layers.js entry; no app server, bundle build, Git write or deployment was performed.

## Independent review fix — 2026-10-12

Review nit: upper tower masonry/metal palette darkened selectively to weathered charcoal in both themes; pale church sandstone, open stage profiles and blue/gold imperial crown retained.

Judged the exported `tmp/top-cities/shots/westerkerk/review-fix/westerkerk-glb-near-light-sheet.jpg` and `far-night-comparison.jpg` (far daylight plus near/far night); underlying four sheets are in the same directory. These show facade/roof/detail and opposite views as applicable. One visual inspection round was sufficient after deterministic budget and layer corrections. Geometry metrics for all three fix assets are in `tmp/top-cities/peoples-salvation-cathedral/review-metrics.json`: zero issues, no dropped depth cycle edges.

Cityscape and Full 3D world were verified only in the supplied pre-fix b3 captures by review b3a; post-fix app recapture and independent re-review remain with the lead. The preceding original-build statements describe the original builder handoff, not approval of these revisions. No provider ownership expansion was required by the review; exact existing ids/rings are retained.

Required final tests: all 28 landmark-specific tests and nine owned conformance checks passed; the complete top-cities run had 442 passes and one unrelated `washington-dc-temple` footprint-polygon failure. Catalog validation retry passed (286 entries / 520 GLB variants). Final results and before/after costs: `tmp/top-cities/peoples-salvation-cathedral/REVIEW-FIX-REPORT.md`; unfiltered focused output is in `review-tests.log` in that folder. Shared preview generation remains the lead’s responsibility under the worker-only output boundary.
