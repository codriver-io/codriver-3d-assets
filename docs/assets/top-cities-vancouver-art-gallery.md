# Vancouver Art Gallery — former Vancouver Law Courts

Original procedural present-day exterior at 750 Hornby Street, Vancouver, including the southwest Thomas Hooper addition. The identity is the broad grey neoclassical courthouse, four-column Ionic Georgia Street portico, paired reclining lions, shallow copper cupola, stone roof balustrades and intersecting gabled clerestory wings. Temporary exhibition banners, modern plaza canopies, interiors, trees and fountains are excluded. No photograph, texture, scan or external mesh is distributed.

## Sources and dimensions

The lead dossier (`tmp/top-cities/vancouver-art-gallery/osm.{txt,json}`, `facts.txt`, exterior photographs 1 and 6) provided the initial footprint, roof heights and comparisons. The dossier's interiors and unrelated paintings were discarded as exterior references. Checked 2026-10-13:

- [Canadian Register of Historic Places](https://www.historicplaces.ca/en/rep-reg/place-lieu.aspx?id=7439): Rattenbury, construction 1907–1911, opened fall 1911, four Ionic columns, copper-clad dome, granite lions, Nelson Island granite base and Haddington Island upper stone; large Hooper wing added by 1914. The commonly repeated 1906 date describes planning, not the register's construction range.
- [OSM courthouse envelope](https://www.openstreetmap.org/way/69701736) and twelve overlapping part ways from the shared dossier. No new Overpass requests were needed.
- [Front square view](https://commons.wikimedia.org/wiki/File:Vancouver_Art_Gallery_(29787380987).jpg), dronepicr, CC BY 2.0.
- [Georgia Street low view](https://commons.wikimedia.org/wiki/File:Art_Gallery_(229999805).jpeg), Ian Spence, CC BY 3.0.
- [Rear from Robson and Howe](https://commons.wikimedia.org/wiki/File:Vancouver_Art_Gallery_Robson_Square_from_third_floor.jpg), Jason Vanderhill, public domain, 4 May 2006; one additional photograph fetched to cover the missing rear angle.

These photos remain in ignored `tmp/` only. The current exterior interpretation excludes their changing exhibition installations. Geographic data © OpenStreetMap contributors, ODbL 1.0; original model authored by Codriver in 2026.

| Feature | Source / confidence | Model |
| --- | --- | --- |
| Main frontage | OSM outline, approximate mapped width | About 62 m |
| Total southwest extent | OSM outer envelope including annex | About 63 m behind origin |
| Dome apex | OSM part 361964116 height | 26.5 m |
| Dome diameter | Mapped ring / photograph estimate | 12.2 m |
| Lower wing cornice / gabled roof | OSM 14 / 18 m | 14 / 18 m |
| Central roof | OSM 20 m, conflicting with photo silhouette | 18.9 m, photo-adjusted estimate |
| Square dome drum / copper profile | Photograph estimate; OSM min-height 26 and roof-height 4 conflict with total height 26.5 | Drum 18.9–22.2 m, dome 22.2–26.5 m |
| Portico / Ionic shafts | Four columns sourced; size estimated from photographs | 19.1 m entablature, 20.4 m projecting cornice, 3.2–15.4 m columns with 0.68 m base shaft radius; triangular peak 19.85 m |
| Georgia entrance / wing bays | Exterior photograph estimates | Entrance back wall 6.4 m behind shafts; six paired window bays per wing in both LODs, lower openings 4.45 m tall, upper 3.35 m |
| Front steps / main landing | Photo estimate | 16 contiguous steps to 3.2 m landing |
| Lions | Pair and material sourced; sizes estimated | Stylised reclining silhouettes, about 2 m tall above plinths |

No published architectural survey dimensions were found. OSM heights are mapping estimates rather than certified measurements; the cupola's contradictory vertical tags are explicitly resolved using the photo profile, without changing the tagged apex.

## Geographic frame and ownership

Metres, +X east, +Y up, +Z south. Origin `[-123.12046,49.28287]` is the dossier anchor in the main block. Authoring u runs southeast along the Georgia Street facade and v southwest toward the annex. Two OSM control points on way 69701736, `[-123.120566,49.2832178]` → `[-123.1204249,49.2831273]`, establish the facade axis at 134.5157° from north; The local rotation is 44.515682° from east toward south, giving a frontage bearing of **44.515682° from north**, baked into vertices exactly once. The root is identity after baking; no height/latitude/DEM stretch is authored.

`footprint.js` owns outer way 69701736 and part ways 361964114, 361964115, 361964116, 361964117, 361964119, 361964121, 361964123, 361964125, 361964126, 361964127, 380105927 and 380105931. All thirteen rings are literal geographic coordinates. Nearby hotel, office towers, and plaza roof ways are excluded. The base follows the original outer envelope, including its curved southeast rear projection and the southwest wing. Walls have inset window apertures; the front portico's footprint includes the floor but the upper volume remains open.

Front stairs extend about 5.5 m beyond the portico's mapped front edge; lion plinths flank this authored stair flight. Rear stairs extend about 4.4 m beyond the central rear wall. These are bounded approach features, not expanded provider masks. Tiny dressings and the rectangular lofts on slightly skewed mapped wings differ by less than approximately 0.7 m from the local outline. `padM=75` covers the structure's radius around the anchor; it is a rigid grade-zero pad handoff, not a terrain survey.

## Modeling and LOD

Editable generator plus local kit and literal site data. Polygon shells retain the irregular footprint; separate raised gables, rotunda, cupola, pediments, open portico, staircase, Ionic capitals, reclining lions and sparse balustrades establish recognition. The drum has four real semicircular recessed apertures. Window openings are cut into wall surfaces with closed reveals and separate inset glass, rather than layered on top of intact walls. Near mullions sit within those recesses, 0.12 m ahead of the glass. The five merged materials are neutral grey granite foundation (`#696d70`), grey upper stone (`#929496`), lighter grey exposed columns (`#a1a3a3`), dark patinated copper (`#3c4945`) and dark glass; both palettes use the same names. The shaded portico back wall reuses foundation grey so the deep entrance remains legible in the app's unlit material path. Dark glass warms subtly; there is no unsupported luminous advertising or invented outline lighting.

Far retains the footprint, dome/pediments, the four Ionic shafts and their open gaps/capitals, both lions, stairs, gables, balustrade rail supports and separate window rows. Georgia Street keeps all six paired tall bays per wing, five engaged Ionic columns between them, end pilasters, grade-supported portico framing piers and the three projecting cornice courses. Secondary facades halve bay density; far drops mullions, dentils and dome seams and reduces engaged-column/scroll segments. Colors and bounds remain consistent between LODs. Capitals and lions are deliberately geometric, not reproductions of carved artworks; window cadence and roof lofts are approximate. The model is less ornate at close range than the real courthouse. No ground-level plaza props or arbitrary boxes were added.

## Verification and export costs

Repeatable export: `pnpm build:top-cities-landmarks vancouver-art-gallery --no-check`.

| Export | Triangles | Draws | KiB |
| --- | ---: | ---: | ---: |
| Near | 25,193 | 5 | 844 |
| Far | 10,701 | 5 | 361 |

Metrics describe the actual default-scene GLBs, not Tesla hardware timing. Both remain below the building budgets of 60k/14/2.5MB near and 12k/8/500KB far.

Judged images under `tmp/top-cities/shots/vancouver-art-gallery/`:

- `vancouver-art-gallery-procedural-near-light-sheet.jpg`: initial front/back/above/entrance/dome/plan comparison.
- `vancouver-art-gallery-glb-near-light-sheet.jpg`, `vancouver-art-gallery-glb-far-light-sheet.jpg`, `vancouver-art-gallery-glb-near-dark-sheet.jpg`, `vancouver-art-gallery-glb-far-dark-sheet.jpg`: exported front, back, above, street entrance, dome detail and mapped plan.
- `final-reference-comparison.jpg`: those four exported sheets next to the three attributed exterior photographs; inspected after the final export.

Corrections made from the sheets: removed door overlays in favor of real recessed openings; reduced far bay density and retained two separate rows; lowered the central roof from the literal 20 m OSM tag to 18.9 m so it no longer obscures the pediment's triangular front silhouette; added the drum's four semicircular apertures from the rear photo. This is a self-review; independent review and both-mode app capture remain with the lead.

Focused tests pin OSM envelope/apex, grade contact, the annex roof, near/far silhouette, four portico openings, named capital/landing support contacts, deliberately detached support negative cases, rail endpoints against isolated baluster top faces, paired lion plinths, individual recessed windows, semicircular drum glass and the triangular pediment, plus GLB normals/materials/bounds/no-texture round trips. The review revision adds observable ray checks for the 6.4 m entrance recess, doors behind the three column gaps, projecting cornice, framing-pier plinth contacts, all twelve paired wing bays and engaged-column sill contacts in both LODs. Its six focused cases pass in under one second. `qa-metrics.mjs --ids vancouver-art-gallery` returned **ok** after regenerating depth ranks; `node scripts/landmark-depth-layers.mjs --ids vancouver-art-gallery --check` passed, with zero dropped cycle edges in the generation report. Source and GLB bounds match within 1 mm, and near/far world bounds match exactly. Final byte counts are 863,844 near and 369,512 far (844 / 361 KiB rounded).

### Independent review correction, b11b (2026-10-13)

The reviewer rated the previous export FIX / 3 out of 5 because the Georgia facade read as an office grid and cream stone/pale green copper weakened its identity. The revision straightens the two mapped wing fronts, aligns six wider tall paired bays with attached Ionic columns and end pilasters, strengthens the central four shafts, recesses the door wall to v=-19.5 m, removes its office-style upper windows, supplies full-depth framing piers on granite plinths, and enlarges the stepped cornice and pediment rim. Neutral grey stone and darker copper follow dossier exterior photographs 1 and 6. First-pass sheets showed a bright blank entrance wall flattening the porch; the second and final look-fix pass darkened that recessed wall and aligned its three doors with the column gaps, without relying on renderer shadows.

Fresh exported near/far light/dark sheets (overview, Georgia facade, street entrance, back, roof, dome and plan) were inspected under `tmp/top-cities/vancouver-art-gallery/review-fix/final/`; `../reference-export-comparison.jpg` puts those revised facade/entrance/overview views beside dossier photos 1 and 6. Metrics are at `tmp/top-cities/vancouver-art-gallery/review-fix/metrics.json`, and the combined registry/landmark log is `tmp/top-cities/vancouver-art-gallery/review-fix/final-tests.log`: **630 passed, zero failed** (36.5 seconds). Catalog validation passed with 336 entries / 658 GLB variants, and `pnpm assets:preview` rebuilt the ignored local viewer. Geometry QA reports zero layered/coplanar faces, 1% near back-face hits and no window-rhythm flags; the member heuristic tests no members here, so support evidence comes from the named geometry tests. Before → after: near 21,863 → 25,193 triangles, 5 → 5 draws, 791 → 844 KiB; far 9,011 → 10,701 triangles, 5 → 5 draws, 323 → 361 KiB. Independent re-review and fresh unobstructed Georgia approach shots in both app modes remain with the lead; this exported-model correction does not certify terrain contact or provider lifecycle.

## Placement evidence

| Mode | Status | Limitation |
| --- | --- | --- |
| Cityscape | Revised export not tested in app | Previous b11 app captures reviewed; foreground neighbours hid the stairs/portico in street shots; lead recaptures an unobstructed Georgia approach |
| Full 3D world | Revised export not tested in app | Previous b11 app captures reviewed; lead recaptures the revised model; no DEM residual or mode-switch certification |

Road/traffic/bridge surfaces are N/A for this building. No app servers, shared runtime changes, git writes or deployment were performed. The sole shared generated file is `depth-layers.js`, regenerated by the permitted script; the lead regenerates all ids before committing. Public release, independent acceptance and device performance are pending separately.
