# Cité de Carcassonne

Original procedural exterior of the present restored fortified Cité, on the hill east of the Aude in Carcassonne, France. The driver-scale subject is the two concentric rings, their pointed and flat tower caps, the Narbonnaise twin towers to the east, Château Comtal to the west, and the Basilique Saint-Nazaire roof toward the south. The inner city is represented by nine low aggregate terracotta roof quarters, following the independent review; individual house facades are omitted. This is the Viollet-le-Duc/Boeswillwald restoration silhouette, not the ruin before restoration.

## Sources and rights

Consulted 2026-10-09:

- [Centre des monuments nationaux — Une silhouette iconique](https://www.remparts-carcassonne.fr/decouvrir/une-silhouette-iconique): each Narbonnaise tower is **30 m** high.
- [Carcassonne Tourism — La Cité Médiévale](https://www.tourisme-carcassonne.fr/decouvrir/la-cite-medievale/): **52 towers, approximately 3 km of ramparts, double enceinte**.
- [Ville de Carcassonne — Porte Narbonnaise](https://www.carcassonne.fr/article-page/porte-narbonnaise): eastern main gateway, two large spur-form towers and Saint-Louis barbican. The procedural gateway simplifies the spur profiles into circular shafts; other tower bodies retain mapped round/D outlines.
- Supplied OSM dossier `osm.json`; curtain polygons are tagged `defensive_works=curtain_wall`. The shared Overpass helper request for city-wall lines returned HTTP 504 after fallback attempts. A single bounded OSM API map extract supplied Grande Barbacane and two short wall alignments, plus the overlapping barbican upper part 166446489. No direct Overpass calls.
- Supplied Commons contact sheet: aerial 2016 by **Chensiyuan**; 2023 HDR panorama by **Diego Delso**; Pont-Vieux elevation by **Lynx1211**; general view by **PIERRE ANDRE LECLERCQ**; Narbonnaise gate and rampart close-up by **Krzysztof Golik**, all **CC BY-SA 4.0**. Exact file links and licences are in the catalog source references. Used only as visual references, no external pixels or meshes included.

Code and mesh are original procedural work by Codriver. Geographic data © OpenStreetMap contributors, ODbL 1.0. Photos remain in ignored scratch only.

## Frame and dimensions

Real metres, +X east, +Y up, +Z south, origin `[2.36405,43.20633]`. The rings bake mapped orientation into the export. Gateway facade bearing is approximately **110°**. Two control points on the mapped rear edge `[2.3653391,43.2067605]` and `[2.3654370,43.2069337]` establish a roughly 22° north/east shaft alignment; its east-facing normal is about 112°. The procedural gateway uses 20° / 110°.

`y=0` denotes the rigid plateau grade. The terrain hill and absolute elevation are never baked in. Wall and tower foundations continue down to **-2.8 m**, just above the shared -3 m lower-bound gate. This skirt is intentional below-grade support, not hanging ornament. The site is about **364 × 457 m**, mapped extent; `padM=290` covers its envelope. `terrainPad` owns only listed structure rings, uses the eastern gateway footprint for the **median** reference datum and feathers **6 m**. This is a placement handoff: larger slope differences could exceed the skirt and must be checked in Full 3D world.

| Feature | Dimension | Evidence |
| --- | --- | --- |
| Narbonnaise tower tips | 30 m | Published by CMN |
| Double fortification | About 3 km / 52 defensive towers | Tourism office; model retains 49 tower volumes plus 3 barbicans |
| Site envelope | About 364 × 457 m | Mapped OSM outline envelope, not a survey |
| Inner / outer curtain tops | 12.8 / 8.2 m plus 1.2 m battlements | Estimated from supplied exterior photos |
| Inner round tower eaves / cone rise | Generally 18.2 / 10.2 m | Estimated, varied for Tréseau and Vade |
| Outer towers | Generally 12.5 m, selected cones +9 m | Estimated; lower outer ring |
| Narbonnaise eaves / cone rise | 19 / 11 m | Estimated split of sourced total |
| Tour Pinte shaft | 28 m plus 1.2 m crenels | Estimated; square unroofed silhouette |
| Castle wing eaves / roofs | 13 m / +4 m; western keep 24 m / +6 m | Estimated on mapped wings |
| Basilica tall roof ridge | 22 m | Estimated on mapped nave/transept axes |

## Geometry decisions

`geometry.js` uses the shared assetBuilder with an original surface kit. The 111 mapped parts comprise 45 tower footprints, two twin-tower gateways, six castle wings, the church, a barbican and 56 curtain/associated wall polygons. Three further OSM wall lines add the western Grande Barbacane and short missing connections. Curtain masks use actual building polygons; line-only walls get narrow 3.2 m strips. The separate upper barbican provider part is also masked. Roof-quarter envelopes now cover the added aggregate city masses while wide streets, lices and the castle courtyard stay open. The enlarged gateway has two explicit authored envelopes in addition to its mapped outline.

Tower polygons are reused as lofted archetypes with 18% wider drums (Tour Pinte 45% wider): stone shaft, projecting collar, pointed cone, or crenellated flat crown. North/west cones are slate; selected south/east cones and Narbonnaise are terracotta. Pointed cap apex triangles are degenerate-filtered, indexed and merged. Arrow slits, window registers and staggered rubble joints are near-only offset quads. They stand 0.07–0.14 m off masonry; no coplanar material overlays. Gateway passages are real open arches with intrados and solid spandrels, retained in far. The castle courtyard and lices stay open. Castle roofs are clipped along mapped concave plan triangles. Basilica nave, transept and apse roofs are simplified masses within the mapped ownership envelope plus a documented 4 m roof/eave allowance.

Seven near materials / four far: stone, slate, tile, glow; near also trim, glass and course. `glow` supplies warm floodlit exterior masonry at night and a matching pale stone tone by day. This is a texture-free lighting surrogate, not measured illumination. The far mesh retains the rings, towers, roofs, courtyard, arch openings and overall bounds while dropping collar geometry, slit panels, courses and alternate small battlements.

## Verification and costs

Build: `pnpm build:top-cities-landmarks cite-de-carcassonne --no-check`.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 41,633 | 7 | 2,169,116 | 2,118 |
| Far | 9,114 | 4 | 467,496 | 457 |

Costs are measured default exported GLB scenes, not device performance. Both fit building budgets. Near bounds are `[-207.253,-2.8,-237.767]` to `[158.373,32.2,220.478]`; far bounds differ by less than 0.3 m on each horizontal extent.

Looked at the supplied reference contact sheet and the procedural near-light sheet; then looked at exported GLB sheets for near/far in light/dark, each with overview, east facade, west/back, plan/roof, gateway street and castle detail. Scratch evidence is under `tmp/top-cities/shots/cite-de-carcassonne/`: `cite-de-carcassonne-procedural-near-light-sheet.jpg`, the four `cite-de-carcassonne-glb-{near,far}-{light,dark}-sheet.jpg` files, and the combined `export-reference-contact.jpg` with references alongside all exported views.

The first look prompted corrected gable-end winding, removed degenerate cap triangles, smaller far collar/battlement geometry and a better gateway camera. The second showed the dark palette was too dark compared with the floodlit night reference; exterior masonry now uses the warm `glow` material. The apse roof was tightened to the mapped envelope. The final sheet verifies those changes and the retained near/far silhouette.

Focused tests check both published 30 m tower tips by raycast, open gate and solid arch spandrel, clear courtyard/lices, every tower foundation, mapped extent/roof tolerance, and far silhouette and cost reduction. All ten landmark-specific tests and all three Carcassonne shared-conformance checks pass, including source/export round-trip bounds, palettes, catalog and budgets. The final requested combined command reports **263 passing / zero failing**; the original build’s unrelated concurrent ready-flag mismatch has cleared. `node scripts/asset-catalog.mjs` passes with 209 records and 400 GLB variants; `pnpm assets:preview` builds successfully. `qa-metrics.mjs` reports zero different-material coplanar overlaps, zero back-face hits, no removable lift attribute bytes and no budget issues; final detailed output is `tmp/top-cities/cite-de-carcassonne/revision-metrics.json`.

## Limitations and handoff

Curtain heights, tower-by-tower elevation variations, roof profiles and church detailing are estimates. Gateway spur-form shafts are simplified circles. Roof intersections remain at castle wing joins; windows are dark surface panels rather than carved openings. Individual house facades, timber hoarding/drawbridge detail, trees and the hill/scarp are omitted. The 4 m eave/gateway tolerance is explicit, not a claim of survey precision. The original independent review was PASS-WITH-NITS (recognition 3/5); the review follow-up improves all four named massing/palette issues and awaits the coordinator’s acceptance of the revision.

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.** No runtime, terrain gate, road, shared renderer, other landmark or shared catalog files were edited. Terrain arrival, large hillside datum differences, provider replacement and regional-to-street transitions still need app validation.

## Independent review revision (2026-10-09)

The lead requested all four independent-review findings for the A61 view. Before → after:

1. Empty inner city → **nine aggregate roof quarters**, each three staggered low gabled strips, ridges 9.2–11 m; merged into the existing stone/tile meshes in both LODs. These are estimated quarter masses, not authored individual houses. Their actual strip outlines are registered for replacement.
2. Thin towers / short dark cones → **18% fuller drums**, ordinary cone rises **7–7.7 → 9–10.2 m**, brighter grey slate retained to the north/west and more terracotta toward the south/east. The largest estimated Tréseau tip is now **32.2 m** and the spec height follows it.
3. Weak gateway / keep → Narbonnaise drum diameter **14.3 → 17.2 m**, cone rise **9 → 11 m**, total tips still the published **30 m**; passage width is a clear **3.3 m**. Western keep grows from **17 m eaves / 21 m ridge to 24 / 30 m**, plan widened 8%, and Tour Pinte’s square plan widens 45%. Gate roof/body envelopes are explicitly owned rather than relying on extra mask tolerance.
4. Pale beige / blackish caps → ochre-gold `stone #b29a64`, daylight floodlit-masonry `glow #ac8e54`, darker masonry/battlement shadow `course #766347`, terracotta `tile #ab623e`, lighter grey slate `#5c6571`; night keeps warm floodlighting.

Original costs **39,379 / 7 / 2,001 KiB near and 8,472 / 4 / 424 KiB far** → revision **41,633 / 7 / 2,118 KiB near and 9,114 / 4 / 457 KiB far**. The -2.8 m buried skirts are unchanged. No new material draws.

The provided REVIEW.md contains no Prepare command and no REVIEW-2.md was present. Used the standard preparation equivalents:

```sh
pnpm build:top-cities-landmarks cite-de-carcassonne --no-check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids cite-de-carcassonne --out tmp/top-cities/cite-de-carcassonne/revision-metrics.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids cite-de-carcassonne --out tmp/top-cities/shots/cite-de-carcassonne/revision-2
```

Looked at both `revision-1/cite-de-carcassonne.jpg` and `revision-2/cite-de-carcassonne.jpg`: exported near/far, opposite oblique views, street elevation, close west elevation and plan next to the dossier aerial. The first showed overly uniform roof rows; the second staggers their ends and heights and mutes the tile orange. The roofscape remains deliberately coarse. Near/far dark sheets in `revision-2/` verify the same new massing with night palettes. Revision metrics report **zero issues, zero coplanar overlaps, zero back-face hits and zero removable lift bytes**. Both modes remain **not tested yet, integration is checked separately**.
