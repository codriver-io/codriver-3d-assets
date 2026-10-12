# Helsinki Cathedral — Helsinki, Finland

Original procedural present-day exterior of Helsingin tuomiokirkko, the Lutheran cathedral above Senate Square, completed in 1852, designed by Carl Ludvig Engel and subsequently modified by Ernst Lohrmann. The Greek-cross plan, four porticoes, five copper domes and twelve roofline apostles distinguish it from Helsinki's other cathedrals.

## Sources and rights

- [Helsinki Cathedral identity and architectural history](https://en.wikipedia.org/wiki/Helsinki_Cathedral), checked 2026-10-12: completion, architects, Greek cross, domes, zinc apostles. Its dimension fields are empty; no survey dimensions are invented.
- [OSM way 1542850662](https://www.openstreetmap.org/way/1542850662) and all 89 cathedral building-part ways in the supplied dossier `tmp/top-cities/helsinki-cathedral/osm.json`. Main outline height tag 59 m; highest central cross part 1542850683 is tagged 61 m; central dome part 1542850746 is tagged 53 m. Derived geographic data © OpenStreetMap contributors, ODbL 1.0.
- [Lutheran Cathedral Helsinki edit](https://commons.wikimedia.org/wiki/File:Lutheran_Cathedral_Helsinki_edit.jpg), Hans Hillewaert, exposure edit Purpy Pupple, CC BY-SA 4.0: front/side, materials, columns and steps.
- [Christmas market evening, November 2024](https://commons.wikimedia.org/wiki/File:Helsinki_Cathedral_seen_from_a_closed_Christmas_market_on_an_evening_in_November_2024.jpg), JIP, CC BY-SA 4.0: floodlit white facade and dark green dome. Both Commons licences checked on their file pages. Additional dossier photos [01](https://commons.wikimedia.org/wiki/File:Helsingin_tuomiokirkko_Helsinki_2026-01-04_01.jpg), [02](https://commons.wikimedia.org/wiki/File:Helsingin_tuomiokirkko_Helsinki_2026-01-04_02.jpg) and [03](https://commons.wikimedia.org/wiki/File:Helsingin_tuomiokirkko_Helsinki_2026-01-04_03.jpg), Leonhard Lenz, CC0 1.0, provide winter front views; used only in the comparison sheet.

Photos are references only and remain in ignored scratch; no mesh, raster image or texture is distributed. The dossier sheet's snow church is a different structure and was excluded. Procedural source is original Codriver authoring; code/docs MIT, model CC BY 4.0 under the repository asset policy, independent OSM attribution preserved.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | --- | --- |
| Church cross tip above upper terrace | 55 | Photo-calibrated estimate after review; OSM highest cross tag is 61 m, not a survey |
| Dome shell summit above terrace | 47 | Photo-calibrated estimate; OSM dome tag is 53 m |
| Small dome shell / cross tips | 34 / 38 | OSM building parts |
| Central white drum diameter | 15.3 | Mapped central drum ring, about 15.3 m |
| Church arm envelope | about 61 × 61 | Mapped outline, including porticoes |
| Portico shaft height | 14.3 | Estimated from photos, OSM columns reach 16 m |
| Portico width / columns | 26 / 6 per arm | Mapped width and visual count |
| Upper terrace height | 7.2 | Estimated relative to Senate Square stair foot |
| Great stairs width / run | 60 / 20 | Estimated from photographs; 40 near and 20 far treads |
| Export height above stair foot | 62.2 | Estimated 55 m structure plus 7.2 m site rise |

Origin `[24.9521785, 60.170378]` is the central mapped drum centre, replacing the dossier's approximate southern origin. East/up/south, real metres. The mapped north arm edge uses two controls recorded below: its roughly 26 m edge runs about 3° north of east, so a +3° Three.js yaw is baked into all vertex positions. Host transforms must not repeat it. No absolute altitude, DEM or Mercator stretch is baked.

`FOOTPRINTS` owns the cathedral outline and all 89 modeled building parts (one enclosing ring, 90 way IDs). Neighboring east buildings, the detached bell tower and chapel beside the square, and the rear bank remain provider-owned. Minor roof/trim overhang is under 0.85 m and pinned by a vertex containment test. Tiny column and cross part rings are redundant inside the enclosing replacement outline and are not repeated as sub-4 m² mask polygons. The granite site podium/stairs intentionally extend outside building replacement rings; those are ground structures, not authority to mask other buildings.

Local y=0 is the square-level stair foot; the church floor is +7.2 m. The solid podium and stair treads meet continuously, keeping a rigid reusable foundation. An explicit bounded median terrain pad has square-foot reference samples and a +7.2 m upper terrace. These are handoff metadata, pending DEM fitting; the upper terrace rectangle and feathers require runtime inspection so terrain neither cuts through stairs nor exposes rear foundation walls.

## Model and palettes

Seven merged named material meshes in both LODs. Off-white plaster and pale grey relief, muted green copper, grey-brown granite, dark window recesses, grey zinc statues and gold crosses. Night uses pale floodlit facade tones and a darker green roof; gold `lamp` geometry is unshaded. There are no invented glowing window bands.

The square crossing and four equal arms have open six-column porticoes, deep entablatures and solid triangular pediments. Four square belfry bases with curved blind-arch frames and stepped cornices support the smaller domes. Separate window bays, pilasters, cornices and blind panels continue in far. The central lower drum is shortened by 6 m and the upper assembly moved down together to match the photographs; the drum has twelve window bays, horizontal glazing bars near, and four circular clocks. Every roof apostle has feet, robe, shoulders, head and a raised arm; three stand on each arm's roof corners/apex. Dome shells use procedural latitude profiles, not traced meshes.

Capitals suggest Corinthian silhouettes with enlarged lobed blocks; leaf carving, fluting, pediment relief sculpture, dome stars, exact apostle identities, clock numerals and individual masonry joints are omitted. Stair count and terrace rise are estimates. Detached bell/chapel pavilions are excluded rather than erased.

## Verification and cost

Export: `pnpm build:top-cities-landmarks helsinki-cathedral --no-check`.

| LOD | Triangles | Draws | GLB bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 17,748 | 7 | 935,732 | 913.8 |
| far | 7,912 | 7 | 400,576 | 391.2 |

Initial procedural sheet inspected: `tmp/top-cities/shots/helsinki-cathedral/helsinki-cathedral-procedural-near-light-sheet.jpg` (front, opposite face, roof and close portico). It prompted stronger friezes, dentils, belfry panels and pilasters. Deterministic depth QA then exposed stone/glass mullion and stone/relief cornice cycles; visible trim was assigned consistently to relief, eliminating all dropped ordering edges. The exported GLB comparison sheet and four near/far light/dark sheets are recorded under `tmp/top-cities/shots/helsinki-cathedral/`; the combined sheet `helsinki-cathedral-final-comparison.jpg` places all twenty final GLB views beside the five licensed dossier references and was inspected. A top-view stair artifact in the first exported pass prompted replacement of adjacent stair boxes with one closed stepped extrusion; the final plan `helsinki-cathedral-glb-near-light-top.png` was inspected again and is clean.

Focused tests pin five domes, 24 separate portico columns and open bays, twelve supported statues, connected stairs including a shortened-end negative check, capital/shaft/entablature contact, all eight raking cornice members against stone pediments with free-end negative checks, physical bounds, LOD silhouette and geographic containment. `qa-metrics.mjs` reports no issues, including zero unsupported member candidates, clean layering and backface checks. Depth regeneration has zero dropped cycle edges. The requested combined command passed all 392 tests before the eighth landmark-specific cornice support test was added; all eight final landmark-specific tests pass in 0.24 s. Catalog validation and depth checks passed at the completed-export checkpoint (266 entries/460 variants); `pnpm assets:check` and `pnpm assets:preview` also passed there. Final shared reruns are transiently blocked by concurrent edits outside this asset: Freedom Tower Miami catalog references a missing `docs/3d-top-cities-freedom-tower-miami.md`, and Texas State Capitol geometry imports a missing `texas-state-capitol-body.js`. These files were not modified by this worker; the lead must rerun global checks after the other builders settle. A supplemental steps query through the shared Overpass helper returned HTTP 500, so no unsupported step survey claim is made.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**, integration is checked separately by the lead. No app server, provider replacement or DEM contacts were inspected by this worker; screenshots prove asset appearance and export only. Hardware cost, failure/late loads, origin shifts and full lifecycle transitions remain untested.

Mapped orientation controls (longitude, latitude): `[24.9519195, 60.1706466]` and `[24.9523905, 60.1706568]`.

## Independent-review corrections, 2026-10-12

Review b2a identified the stretched bare central drum, rectangular belfry panels and a comparison tile showing Uspenski Cathedral. Shortened the lower drum by 6 m, moving its upper window order, clocks, dome and cross together in both LODs; the exported tip is now 62.2 m above the square. This is an explicit photographic estimate that differs from the unsurveyed OSM 61 m structural-height tag; the reference tag remains documented rather than presented as the delivered height. The granite podium, stairs, horizontal footprint and terrain metadata stay at their existing levels.

Both tiers of each small belfry now have curved blind-arch stone frames and stronger stepped cornices. Near keeps contrasting arched relief panels; far drops those overlays and uses projecting stone arch silhouettes backed by the wall. This keeps the geometry inexpensive and avoids a far relief/depth conflict. The lower arch projection and compact central plinth are pinned by raycasts in both LODs.

Two review look/fix rounds were used. Final exported sheets inspected: `tmp/top-cities/shots/helsinki-cathedral/review-fix-2/helsinki-cathedral-glb-{near,far}-{light,dark}-sheet.jpg`; front, rear, overview, roof and belfry detail by day, plus front/overview/detail at night. `review-fix-2/helsinki-cathedral-reference-comparison.jpg` uses the actual Lutheran cathedral in dossier `refs/1.jpg`, replacing the review's incorrect Uspenski tile in the new evidence. The historical review sheet is retained unchanged.

Final named repository export succeeds; nine Helsinki geometry tests and eight Texas tests plus the registry pass 416/416 in `tmp/top-cities/helsinki-cathedral/review-fix-tests.txt`. Selected QA metrics (`review-fix-metrics.json`) are clean in both LODs; depth regeneration and check show zero dropped cycle edges. Current catalog validation passes. Earlier concurrent AT&T Stadium syntax failure resolved before the final normal export. Cityscape and Full 3D world remain **not tested after this revision**; the lead recaptures both modes and independently re-reviews geometry and terrace contact.
