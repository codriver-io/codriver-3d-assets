# Yerevan Cascade — Yerevan, Armenia

Original procedural representation of the five completed white Cascade terraces, enclosed gallery shell and unfinished concrete upper platform at 10 Tamanyan Street. The separate Monument Terrace and Victory Park are excluded. The giant paired stairs, fountain fan relief, arched museum glazing and repeated garden platforms identify the landmark from the street. No external mesh, texture, photo, font or scan is shipped.

## Sources and dimensions

[Cafesjian Center](https://www.cca.am/The-Cascade-Complex) gives 572 steps, 302 m distance along the Cascade, 50 m width, 15° incline, and 450 m to the separate Monument Terrace at 118 m. [Visit Yerevan](https://www.visityerevan.am/places/details/700/en/) gives the approximately 78 m unfinished level. The often-confused 302 m is a route length, not structural height. The supplied [Wikipedia dossier](https://en.wikipedia.org/wiki/Yerevan_Cascade) establishes five terraces, internal escalators and architects Jim Torosyan, Aslan Mkhitaryan and Sargis Gurzadyan.

| Dimension | Model | Basis |
| --- | --- | --- |
| Width | 50 m | Published Cafesjian statistic |
| Horizontal run | 286.5 m | OSM attraction envelope, approximately 287 m; published inclined route 302 m |
| Upper terrace / parapet | 78 / 79.2 m | 78 m source, parapet estimated |
| Terrace elevations | 0, 8, 24, 40, 55, 69, 78 m | Photo estimates, not surveyed |
| Terrace stations | 0, 28, 87, 139, 195, 246, 286.5 m | Mapped stair group extents with simplified landings |
| Stair sampling | 572 near per side / 137 far | Published nominal count; actual route differs by side; count is visual approximation |
| Core gallery / stair wings | 28 m / 11 m each | Photo estimate within sourced overall width |

[OSM way 83688503](https://www.openstreetmap.org/way/83688503) is `tourism=attraction`, not `building=*`; the full shared-helper extract is `tmp/top-cities/yerevan-cascade/full-osm.json`. Nearby office, houses and museum buildings are excluded, so `FOOTPRINTS` and `OSM_WAYS` are intentionally empty and SPEC declares `footprintless`. The mapped site ring is recorded separately for placement evidence. West-side control points [44.5152141,40.1901963] and [44.5153864,40.1927613] establish the 2.94° northward axis; origin [44.515495,40.1901894] is the bottom stair centre. Rotation is baked exactly once; metres east/up/south, rigid y=0 at the bottom landing, no absolute altitude or Mercator stretch.

## Construction and approximations

Six closed stair and gallery shells stop at the previous terrace (typically 0.8 m below its floor), rather than extending the entire limestone structure down to y=0. Five facade walls retain fan relief or actual arched apertures with recessed glazing; the unfinished summit is unchanged. Cityscape uses a separate estimated stepped, planted retaining base with concrete ledges, broken into tiers no taller than 8 m. Recessed limestone supports connect that base to the rigid floors. This base is an authored flat-mode visual substitute for the hillside, not a surveyed hill model. It remains tall at the rear in flat mode, but the uninterrupted white wedge is gone.

In Full 3D world, exported `terrainOffsets` bury all vertices of the artificial base at 1.5 m below the previous structural terrace. Only the support feet move to 0.25 m below their owned pad target; stair treads, rises, terrace floors, gallery walls and lamps remain immutable. The existing shared building-layer mode switch consumes the compact offsets and restores exact source positions when terrain is disabled. Both LODs carry the metadata in GLB node extras. No new runtime API or shared renderer code was changed.

Far coarsens stair treads, scallops and arch segments, removes the middle support row, and keeps every level, both glazed recesses, garden/pool layout and summit. Seven materials/draws in either LOD. Sculptures, interior escalator routing, fine rails and symbols remain simplified or omitted; no collection sculpture is copied.

Reference photos actually viewed: `tmp/top-cities/yerevan-cascade/refs-sheet.jpg`, including a city-facing full view, lower fountain detail, upper arch and divers terrace. Photo titles, authors, licences and Commons links are in the catalog source references: Petar Milošević and Diego Delso CC BY-SA 4.0; Vyacheslav Argenberg CC BY 4.0. Reference pixels are never embedded.

## Numeric terrain coverage and placement handoff

Previous pads covered only six 3 m-wide upper landing strips (900 m²) plus a 250 m² datum strip. The revised twelve disjoint rectangular pads cover **all 50 × 286.5 m = 14,325 m² of floors and flights**, plus 3 m feathers. Upper targets are 1 m below authored levels; the bottom target remains 0 to hold the bottom stair ends, below the 0.25 m fountain floor. Full-width lower targets continue under the flights; the final 3 m is the upper stair landing. Its target switches 13 m behind the gallery face, so no higher target crosses the low fountain floor. Terrain beneath the first landing stays at the bottom datum; the separate origin reference ring still determines the median DEM datum.

| Station range (m) | Pad target relative to bottom datum (m) |
| --- | ---: |
| 0–25 / 25–28 | 0 / 7 |
| 28–84 / 84–87 | 7 / 23 |
| 87–136 / 136–139 | 23 / 39 |
| 139–192 / 192–195 | 39 / 54 |
| 195–243 / 243–246 | 54 / 68 |
| 246–283.5 / 283.5–286.5 | 68 / 77 |

These numbers establish source-level coverage, not actual resident-TIN or DEM clearance. Coarse lattice interpolation between adjacent terraces can differ from pointwise pad targets; the lead must inspect all bearings, especially the bottom fountain and lower glazed arch, and measure each terrace residual and pad edge after terrain refinement. No app server, DEM sampling or renderer build was run by this worker.

Cityscape: **post-fix app verification pending**; the flat exported base was inspected. Full 3D world: **not verified after fix**; the b9 review documented penetration of the old pads and the lead must recapture the fixed version. Mode restoration, pad coverage and footing metadata tests do not certify the app's terrain. Roads/neighbours, late/refined terrain, origins, loading and mode lifecycle remain integration checks.

## Export metrics and checks

| LOD | Triangles before → after | Draws | Bytes before → after | KiB after |
| --- | ---: | ---: | ---: | ---: |
| Near | 19,530 → 21,609 | 7 → 7 | 797,020 → 941,460 | 919.4 |
| Far | 6,702 → 8,531 | 7 → 7 | 329,656 → 456,288 | 445.6 |

Two look-fix rounds used exported sheets in `tmp/top-cities/shots/yerevan-cascade/review-fix-{1,2}/`. The first showed overly exposed supports; the second replaced them with the stepped planted base and confirmed unchanged front-facing stairs, galleries, fountains and summit. The final far/light sheet in `review-fix-2/` confirms the simplified LOD, all terrain metadata and the same envelope. Final index cleanup removes invisible soil and inter-tier caps; that cleanup does not change exterior appearance. The final pad split adjustment from 8 m to the actual 3 m upper landing followed numeric coverage tests rather than a third look-fix round.

Nine focused Cascade tests pass, retaining the original dimensional, monotonic stair, lamp footing and shortened-terminal checks. New tests sample four lateral positions at nine stations in every flight in both LODs and assert pad targets stay below observed walking surfaces; the shared BuildingLayer switch test checks fitted pier side contacts, unchanged upper stair terminals and exact flat restoration. GLB inspection confirms `terrainOffsets` on stone, garden and concrete nodes in both LODs. Exported deterministic QA reports no issues and scoped depth generation/check has zero cycle edges dropped. Removing ground/inter-tier caps eliminated the opposing garden/stone depth relationship.

The mandated combined run is recorded in `tmp/top-cities/yerevan-cascade/review-fix-tests.txt`; unrelated conformance and shared catalog failures are listed in the durable worker report, without editing another builder's files. Final deterministic metrics are in `tmp/top-cities/yerevan-cascade/review-fix-metrics.json`. Independent visual re-review and fresh Cityscape/world app captures remain the lead's work.

Final combined conformance checkpoint: **638/638 pass** in 42.3 s (`tmp/top-cities/yerevan-cascade/review-fix-tests-final.txt`), including all 16 owned tests. Earlier unrelated Miami Tower record failures cleared after its builder completed the record. The shared catalog and local preview subsequently pass (336 records / 654 GLB variants), and scoped depth metadata is current with zero cycles. The durable handoff is `tmp/top-cities/yerevan-cascade/REVIEW-FIX-REPORT.md`.
