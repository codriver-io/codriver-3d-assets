# Canada Place — Vancouver

Original procedural model of the present Canada Place convention/cruise terminal and Pan Pacific Vancouver hotel at 999 Canada Place, built for Expo ’86. Five white fabric sails and the shore-end concrete hotel grid with a flattened roof crown distinguish it from the adjacent waterfront buildings. The asset represents the exterior after the 2011 sail replacement, with approximate current massing; ships, neighbors and interiors are excluded.

## Sources and dimensions

The supplied dossier (`tmp/top-cities/canada-place/`) was the starting point. [DA Architects](https://www.da-architects.ca/projects/canada-place-pan-pacific-hotel/) confirms completion in 1986, the five sails, 34,840 m² project area and the convention/cruise/hotel functions. The [Government of Canada’s 2010 sail-replacement announcement](https://www.canada.ca/en/news/archive/2010/07/canada-place-begins-work-replace-iconic-sails.html) confirms the replacement fabric mimics the original five-sail design. The supplied [Wikipedia dossier](https://en.wikipedia.org/wiki/Canada_Place) gives the 81.5 m hotel height, 23 floors and opening on May 2, 1986; this height is secondary-source evidence, not a surveyed dimension. The Skyscraper Center's separate estimate uses a different floor convention; it was not used as dimensional authority.

| Measure | Value | Basis |
| --- | --- | --- |
| Hotel maximum height | 81.5 m | Supplied Wikipedia dossier; secondary source |
| Sail count | 5 | DA Architects and Government of Canada |
| Fabric roof transverse edges | Approximately 73 m | Mapped OSM roof parts |
| Repeated sail bay pitch | Approximately 24.5 m | Mapped OSM corner-to-corner distances |
| Roof width bearing | Approximately 108.5° from north | Two mapped roof control points |
| Sail row bearing | Approximately 61.6° from north | Mapped adjacent roof corners |
| Main pier outer envelope | Approximately 496 × 246 m in east/south axes | Full OSM polygon, includes aprons |
| Fabric roof base / peaks / exposed mast tips | 18 / 45 / 46.35 m | Photographic estimate |
| Pier top / hotel podium tiers | 7.8 / 14.8 / 20.2 / 25.5 m | Photographic estimate relative to local grade |
| Hotel plan | 65 m width, 31 m depth with 9 m convex harbour bow; 18.5° southeast of east | Photographic/mapped-envelope estimate |
| Hotel facade rhythm | 18 horizontal upper divisions, curve-aware mullions | Photographic approximation; not asserted as total floor count |
| End hall | Oval 50 × 36 m, drum top 27.4 m, domed roof top 33 m | Photographic approximation, within the mapped pier envelope |

OSM dossier outlines cover way 223635729 (pier), 143682542 (terminal), roof ways 1216968939/40/41/42/44 and part 1216968938. One targeted shared-helper query added hotel relation 16532084 with its stitched outer ways, and a second queried nearby parts to identify the rooftop dome 1216968929. Unrelated neighboring towers from that query are excluded. Full rings and ownership IDs are in `footprint.js`. Derived geographic data © OpenStreetMap contributors, ODbL 1.0.

Reference images inspected in ignored scratch only:

- `refs-sheet.jpg`: supplied sheet; exterior hotel photograph, exhibition-hall tensile roof and harbor panorama used. Heritage Horns at the Pan Pacific Vancouver — Pan Pacific, CC BY 2.0; Exhibition hall in Canada Place 2026 — Canmenwalker, CC BY 4.0; Canada Place with Downtown Vancouver, British Columbia, Canada Masson — Spyder212, CC BY-SA 4.0. File-page links are in the catalog.
- `refs/7.jpg`: [Vancouver (BC, Canada), Canada Place -- 2022 -- 1847](https://commons.wikimedia.org/wiki/File:Vancouver_(BC,_Canada),_Canada_Place_--_2022_--_1847.jpg), Dietmar Rabich, CC BY-SA 4.0. License verified on the Commons file page. This additional side view was needed because the supplied exterior panorama was distant.

No pixels, textures, traced meshes or reference captures are included in runtime exports.

## Geometry, frame and materials

Origin `[-123.11112,49.28863]` is the dossier's structural anchor near the convention roof. Metres, east/up/south; y=0 is local flat-map grade on the pier/shore, with no sea-level or DEM height. Roof corners and pier outlines are authored directly in this geographic frame; the hotel rotation is baked into vertices. No host rotation is needed. Example roof controls `[-123.1117289,49.288748]` and `[-123.1107751,49.2885423]` establish the transverse bearing; adjacent bay corners establish the oblique row axis. The roof bays are intentionally skewed, not forced into a perpendicular street grid.

The main pier is a rigid polygon prism with lower terminal glazing, repeated facade mullions and walkway railings. Five connected sampled tensile shells have doubly curved saddles, deep longitudinal edge valleys, sagging transverse edges and 0.15 m closed thickness. There are **no opaque side or end curtains**. Four inter-bay mast ridges connect their two neighboring membranes; the first shore edge remains low and the final ridge meets the end hall area. Exposed mast tips stand at 46.35 m above grade, 1.35 m above the fabric peaks. Curved sampled edge cables replace the previous straight descending stays. Near includes denser seams and curve samples; far retains every bay, mast and valley. The irregular shoremost bay follows its mapped roof polygon. This is original visual tensile geometry, not an engineering reconstruction.

The pale end hall rises directly from the pier on an oval drum, with vertical ribs, a rounded shallow dome and a projecting upper band. Its 50 × 36 m oval is centered near local [72,-31] within the mapped main pier; both location and dimensions are estimates guided by the review photograph, rather than independently surveyed theatre geometry. The longer terminal OSM outline remains modeled as the lower annex.

Pan Pacific now has a flattened convex harbour bow with 9 m central bulge, rounded rear corners and eighteen broad horizontal concrete spandrel bands over recessed blue-grey glazing. Curve-aware mullions and sparse lit panes follow the facade. Two broad setback terraces above the mapped hotel podium have horizontal glazing bands and pale top ledges. The equipment crown remains rounded at the sourced 81.5 m maximum height. Bow curvature, facade spacing and the 20.2/25.5 m podium tiers are photographic estimates.

Seven material batches in each LOD: `concrete`, `trim`, `glass`, `fabric`, `steel`, `roof`, `glow`. Night palettes dim opaque surfaces, tint the sails blue and retain warm hotel panes. Animated colored sail lighting is excluded. No textures, compression extensions, vertex-color reliance or redundant bridge attributes. Facade details stand 0.08–0.38 m proud. Foundation and podium geometry remain rigid; no terrain is baked into the reusable GLB. Inlet/shore DEM samples can be inconsistent, so Full 3D world needs a separately reviewed foundation datum; `padM=290` is an authoring envelope, not terrain certification.

## Review revision and verification

The independent review (`tmp/top-cities/review/canada-place/REVIEW.md`) judged the original export FIX, recognition 3/5. All three FIX defects and the lead's hotel-bow clarification were addressed in two look/fix iterations:

| Defect | Before → after |
| --- | --- |
| Sail roof | Opaque triangular curtains and straight descending edge stays → connected doubly curved thin shells, deep curved edge valleys, exposed mast tips and curved edging |
| Pier-end hall | Dark low flat wedge → pale ribbed oval drum and shallow dome beside the last sail, retained in far |
| Hotel podium | Single shallow mass → two substantial setback terrace tiers with horizontal glazing and pale ledges |
| Hotel tower, lead clarification | Flat rectangular grid → convex harbour bow, rounded rear corners, horizontal spandrel bands and rounded roof crown |

First revision: inspected `tmp/top-cities/shots/canada-place/revision-review/canada-place.jpg` against its reference tile and the dossier sail photograph. The tensile geometry and hotel terraces read substantially better; moved the rounded hall shoreward beside the final sail, matching the reference adjacency rather than leaving it isolated along the apron. No third modeling iteration was used.

Final revision: regenerated the review's equivalent preparation with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids canada-place --out tmp/top-cities/shots/canada-place/revision-final-review` and inspected `canada-place.jpg`. REVIEW.md did not contain a Prepare command and REVIEW-2.md was absent; this was reported to the coordinator. The reference tile is [Canada Place Landing](https://commons.wikimedia.org/wiki/File:Canada_Place_Landing.jpg), Nicolas Untz, photographed 2001, CC BY-SA 2.0; license verified on Commons. Used its exterior bow, podium and hall proportions alongside the 2022 sail photograph, without shipping any image content.

Also inspected exported GLB contact sheets:

- `tmp/top-cities/shots/canada-place/revision-final-near/canada-place-glb-near-light-sheet.jpg`: facade, back, sail detail, rounded hall, harbour bow and hotel; the former opaque curtain triangles are gone, and mast tips project above the fabric.
- `tmp/top-cities/shots/canada-place/revision-final-near-dark/canada-place-glb-near-dark-sheet.jpg`: facade, sail detail and harbour bow.
- `tmp/top-cities/shots/canada-place/revision-final-far-dark/canada-place-glb-far-dark-sheet.jpg`: facade, back, sail detail, rounded hall and harbour bow; corrected sail valleys, dome and podium steps survive LOD reduction and night recoloring.
- The standard final review sheet includes both near/far light, opposite sides, top and street views with the reference photograph beside the exports.

| Current export | Triangles | Draws | Bytes | KiB (rounded) |
| --- | --- | --- | --- | --- |
| Near | 44,292 | 7 | 1,736,228 | 1,696 |
| Far | 9,448 | 7 | 428,236 | 418 |

Previous exports were 41,624 / 7 / 1,552 KiB near and 7,992 / 7 / 328 KiB far. Both revised LODs remain under the building caps, with identical outer bounds and the 81.5 m maximum height. Metrics describe geometry, not Tesla hardware performance.

Nine local geometry tests pass in approximately 0.3 s. In addition to height, five peaks, catenary sag, footprint containment and near/far silhouette, regression tests reject large opaque vertical fabric triangles, verify exposed mast tips, raycast the rounded hall roof and shoulders, and measure the hotel's convex harbour bow and two podium tiers. Deterministic export QA (`qa-metrics.mjs --ids canada-place`, report `tmp/top-cities/canada-place/revision-metrics.json`) reports no issues, zero coplanar overlaps, 0% back-face hits, minimum y=0 and no removable attributes. Final conformance and catalog outcomes are recorded below.

Approximations remain in fabric curvature, hall shape/location, podium levels, hotel bow and facade spacing; lower dock colonnade depth, escalators, gardens, atrium, horns, fine signage and FlyOver entrance details are omitted. Independent re-review is pending; authoring QA does not claim a separate reviewer verdict. No shared files changed and no git write commands were run.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Provider replacement/lifecycle, shoreline terrain arrival, driving and actual Tesla hardware are outside this asset-only handoff.

Final acceptance checks: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/canada-place/canada-place.test.js` passed all 161 tests in approximately 5.8 s, including all nine Canada Place tests. Output is preserved in `tmp/top-cities/canada-place/revision-tests.txt`. `node scripts/asset-catalog.mjs` passed: 178 records and 322 GLB variants at validation time. Exports and evidence are ready for the coordinator's independent re-review.
