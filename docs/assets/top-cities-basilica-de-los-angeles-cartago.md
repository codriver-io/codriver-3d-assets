# Basílica de Nuestra Señora de los Ángeles — Cartago

Original texture-free procedural model of Costa Rica’s national pilgrimage basilica, authored October 2026. Recognition comes from the grey masonry, pale ornate central facade with a seven-bay belfry and clock crest, paired tall traceried windows, two rose windows over open arcades, angel silhouettes, central ribbed Byzantine dome, two lower cupolas and two outer paired-arch bell turrets.

## Sources and frame

The supplied dossier `tmp/top-cities/basilica-de-los-angeles-cartago/` was the research starting point. [Wikipedia](https://en.wikipedia.org/wiki/Basilica_of_Our_Lady_of_the_Angels,_Cartago) identifies the Cartago basilica and its mix of Byzantine and colonial architecture; its completion dates differ between prose and infobox, so no construction-date assertion is needed here. [OSM way 102243517](https://www.openstreetmap.org/way/102243517) supplies the complete 3,026 m² outline, four mapped levels, and no published height. Other surrounding shops, theater and plaza remain outside ownership.

Photographic form and muted colours were judged against Bernard Gagnon’s CC0 [frontal exterior 01](https://commons.wikimedia.org/wiki/File:Basilica_of_Our_Lady_of_the_Angels,_Cartago_01.jpg), [oblique exterior 02](https://commons.wikimedia.org/wiki/File:Basilica_of_Our_Lady_of_the_Angels,_Cartago_02.jpg), and [angel detail 04](https://commons.wikimedia.org/wiki/File:Basilica_of_Our_Lady_of_the_Angels,_Cartago_04.jpg). The sheet’s souvenir model and statuette are not treated as scale or exterior evidence. Photo licences were checked on Commons. All photos remain ignored scratch assets; no third-party mesh, scan, photo or texture is shipped.

Origin `[-83.91286411707607, 9.864092100316496]` is the footprint area centroid. Real metres, +X east/+Y up/+Z south, y=0 at flat local pavement; no absolute altitude, terrain or Mercator stretch is baked in. Local facade axes are rotated −7° around Y into the geographic frame, giving a south-southwest frontage bearing 187°. The southwest body control `[-83.9132349,9.8640557]` to `[-83.9132039,9.8642297]` gives a roughly northward long wall with about 10° skew; eastern wall `[-83.9125331,9.8641295]` to `[-83.9125595,9.8639842]` has about 10° southward skew. South chapel controls `[-83.9130367,9.8638528]` to `[-83.9129599,9.8638461]` give a roughly eastward frontage with 5° skew; 7° is the compromise across the irregular mapped frontage. Rotation is exported once; the host must not repeat it.

## Dimensions

| Feature | Model value | Basis |
| --- | --- | --- |
| Overall plan envelope | about 78 × 59 m in geographic axes | OSM mapped envelope, including irregular side/rear parts |
| Masonry aisle walls | 10.8 m | photographic estimate |
| Upper nave | 17 × 35 m, eave 19.3 m, ridge 25.2 m | estimated roof subdivisions within mapped outline |
| Central dome | radius 7 m, drum spring 32.3 m, rise 7.3 m | photographic estimate |
| Dome finial | 42 m above local grade | estimate, not an authoritative published height |
| Front belfry and clock crest | 25.3–28.3 m / crest 31.5 m | estimate |
| Lower cupolas | radius 3.6 m, crown 27.5 m | estimate |
| Outer turret caps | about 31.6 m | estimate |
| Front roses | radius 2.05 m | estimate |
| Pad radius | 49 m | rigid placement handoff; DEM survey pending |

## Modelling and limits

The lower walls follow the exact owned OSM polygon, cut back at the south so front arcades have genuine openings. Round-headed side windows follow each actual exterior segment and carry coarse mullions. Separate grey stone wings support the zinc-like hipped roofs. The pale front distinguishes tall paired tracery windows, twelve-spoke roses, a physical seven-hole belfry, clock hands, sculptural silhouettes and a broken triangular crest. Cupolas and turret openings survive far detail. Columns have continuous bases, shafts and capitals; all sculpture is attached to a named facade cap or crest. No long bridge-like rail, cable or free-ended beam exists in this building model.

Near adds dome ribs, thicker arch trims and door panels. Far removes the ribs and panels, simplifies arch/torus/lathe segmentation and keeps individual window bays and all important openings. Eight merged named materials serve both palettes: stone, trim, shade, roof, dome, glass, bronze, glow. Grey stone and neutral silver-grey caps are subdued; lighting varies enough in the dossier that exact historic paint cannot be established. Night stone is dimmed and aisle windows receive warm subdued self-light, an approximation rather than a measured lighting installation.

Rear window layout, roof subdivisions, side-turret depth and detailed dimensions are inferred where the two exterior references lack coverage. Foliage in capitals, relief lettering, exact angel anatomy, fences, street furniture, interior and plaza are omitted. Small architectural trim projects beyond the irregular mapped ring; the measured envelope allowance is tested separately. No neighboring building is masked.

## Verification and placement handoff

The supplied reference sheet and full frontal image were viewed. The first procedural sheet revealed reversed hip winding and inward-facing side fenestration; those were corrected, and additional front aisle windows/recesses were added. Mapped-envelope checks trimmed the eastern roof corner and narrowed porch stairs. Comparison with the front photo lowered the belfry/clock crest and its angel to keep the dome dominant. Curve segments and far dome ribs were reduced to satisfy the far budget. Depth QA then removed buried box undersides, replaced the central drum backing with eight physical round-window panels, cut the clock hole through the crest, and removed conflicting masonry-joint overlays. No depth cycles remain.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No app server, shared runtime layer or rollout was changed.

## Final exports and evidence

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 37,048 | 8 | 1,911,236 | 1,866 |
| Far | 10,044 | 8 | 492,388 | 481 |

Both meet the contract caps. Far keeps identical bounds and all window bays, belfry holes, rose spokes, turrets and cap outlines, at 27% of the near triangle count; its byte budget has only about 7.6 kB headroom. These costs describe exported default scenes, not measured Tesla performance.

The author **looked at** `tmp/top-cities/shots/basilica-de-los-angeles-cartago/export-reference-comparison.jpg`: four rows of exported near/light, near/dark, far/light and far/dark next to dossier photos 1 and 3, with facade, street, rear, roof and clock/belfry detail views. Source and exported top-plan sheets were also viewed against the red mapped boundary. Files follow `basilica-de-los-angeles-cartago-glb-{near,far}-{light,dark}-{view}.png`, with corresponding `-sheet.jpg` files. The seven inspection presets cover overview, facade, street, rear, roof, detail and top. Rear forms and night lighting remain inferred; independent likeness review is still required.

`tmp/top-cities/basilica-de-los-angeles-cartago/qa-metrics.json` reports **no issues**: zero coplanar pairs, zero remaining layered faces, zero material-cycle edges, 0% back-face hits in 283 hit rays, no removable bridge attributes, grade at zero, identical LOD bounds and no window-rhythm loss. The geometry tests measure every vertex against the complete mapped ring with a 1.5 m bounded architectural projection allowance, pin the estimated 42 m tip and frame, raycast all seven central arches and intervening piers, paired turret openings/supports, separate roses/tracery and the dome.

The requested combined test command ran 467 cases: **465 passed**, including all seven basilica-specific tests and all three basilica conformance cases; two unrelated in-progress assets failed (Tower of London far export 0.51 MB over the 0.5 MB cap; High Museum near source 76,308 triangles over 60,000). The focused basilica conformance selection also passed. The full log is `tmp/top-cities/basilica-de-los-angeles-cartago/focused-tests.log`. `node scripts/asset-catalog.mjs` passed with 286 records/530 GLB variants at the initial final-export checkpoint; the final retry and later scoped QA failed solely because `/models/buildings/edificio-metropolis-far.glb` was unregistered while that other builder was in progress. The latest catalog error is preserved in `tmp/top-cities/basilica-de-los-angeles-cartago/catalog-check.log`. Scoped depth regeneration and `--check` passed with zero dropped cycle edges.

`SPEC.ready = true` and catalog status is `ready`. Shared generated `src/peregrine/landmarks/depth-layers.js` was regenerated for this id as authorized; no other shared source was edited.

## October 12 review fix

Review b5b: seven-bay belfry now has 0.75 m deep dark interior/back/reveal surfaces while retaining genuine through apertures and pale front piers in both LODs. Existing shade material gives neutral interior shadow; roof and dome palettes are neutral silver-grey from exterior dossier photos 1/3, with the pale facade retained. No souvenir model colours used. Physical arch openings, roses, turrets and far window rhythm retained.

Latest measured default-scene costs: near **37,048 triangles / 8 draws / 1,911,236 bytes**; far **10,044 triangles / 8 draws / 492,388 bytes**. These supersede earlier authoring-stage results.

Inspected exported contact sheets in `tmp/top-cities/shots/basilica-de-los-angeles-cartago/b5-fix/`: near/light, near/dark and far/light or far/dark, including the reviewed facade/crown details; Source geometry QA is clean for both LODs, with zero layered/coplanar faces, no material cycles, and preserved bounds/window rhythm. The four-landmark tests pass 27/27; combined registry and landmark run passes 501/502, with its sole unrelated failure at `cite-de-carcassonne` (footprint is a real polygon). Evidence: `tmp/top-cities/marine-building/b5-fix-tests.log` and `b5-fix-metrics.json`. Depth generation and scoped `--check` pass; catalog validation, `pnpm assets:check` and `pnpm assets:preview` pass (286 records, 560 variants).

Cityscape: **not tested by this fix worker**; Full 3D world: **not tested by this fix worker**. Fresh app recaptures and independent re-review remain with the lead, as assigned; no overlap was inferred from foreground occlusion and no neighbours were removed.
