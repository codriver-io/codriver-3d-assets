# Palacio de la Cultura Rafael Uribe Uribe, Medellín

Original texture-free procedural model of the **present built palace** at Carrera 51 / Calle 52, beside Plaza Botero and the elevated metro. It models the Bolívar and Calibío wings, octagonal former assembly hall and Patio de las Azaleas, rather than the much larger unbuilt Goovaerts proposal. Source is the landmark folder under `src/peregrine/landmarks/top-cities/palacio-de-la-cultura-medellin/`; `palacio-de-la-cultura-medellin-parts.js` contains the original repeated profiles and facade construction.

Build: `pnpm build:top-cities-landmarks palacio-de-la-cultura-medellin --no-check`. Exports: `public/models/buildings/palacio-de-la-cultura-medellin-{near,far}.glb` and the measured JSON manifest. Catalog record: `prototypes/assets3d/catalog.d/palacio-de-la-cultura-medellin.json`.

## Identity and sources

The [ICPA official history](https://culturantioquia.gov.co/palacio-de-la-cultura/) attributes the design to Belgian architect Agustín Goovaerts, hired in 1920, describes the basement-to-attic five-level proposal and Belgian metal dome structure, and explains that only a little more than a quarter of the proposal was built. The [restoration foundation](https://fundacionferrocarrildeantioquia.com/proyectos/palacio-cultura-rafael-uribe-uribe/) documents the two wings and octagonal assembly hall built in 1925–1932, the later northern completion, cultural reuse, and its own 2012–2015 restoration. Both pages were checked on 2026-10-05. Neither provides a reliable surveyed overall height; **all vertical numbers below are estimates**.

Mapped horizontal geometry: [OSM relation 7460245](https://www.openstreetmap.org/relation/7460245), outer way 31964639, v12 (2026-06-11), inner garden way 514510200, v2 (2025-09-10). The supplied extract had no relation members. A queued shared-helper Overpass query timed out; a single OSM API `/relation/7460245/full.json` response supplied the members and nodes. The full JSON remains in ignored `tmp/top-cities/palacio-de-la-cultura-medellin/relation-full.json`; no other buildings or parts in the dossier are owned.

Visual references: the prepared `refs-sheet.jpg`, especially the station view, south-east dome/back view and close Bolívar elevation, plus one supplementary restoration-foundation photo (`refs/7.jpg`) clarifying the main dome and the wing/roof relationship. Commons authors/licences and checked links are in the catalog; the foundation photograph has no asserted redistribution licence and is retained only in ignored scratch for visual comparison. No reference mesh, scan, texture, photograph or bust geometry is shipped. No external contributor permission is claimed.

## Frame and footprint

Origin `[-75.56820644866352, 6.251686397758602]` is the area centroid of the mapped outer envelope. Real metres, east/up/south. Local y=0 is rigid flat-map grade; no sea level, DEM or Mercator stretch is baked into the exports.

The main Bolívar edge control points `[-75.5680643, 6.2514268]` and `[-75.5679297, 6.2517380]` run approximately 23.3 degrees east of north. Building-axis geometry is rotated **−23 degrees around Y once**, into east/up/south. The east facade faces bearing 113 degrees; the Calibío face looks south-west. The base body follows the complete measured ring rather than forcing its slightly skewed west edge to a rectangular grid. `FOOTPRINTS` owns only outer way 31964639; the garden is a hole in the mesh, never an owned garden extrusion.

Trims and rounded turrets extend beyond OSM's simplified wall line by up to 2.8 m. The base body is exact to the mapped outline; a per-vertex test enforces this explicit allowance. Provider masking remains the original outer ring. Ground rings are not enlarged into the metro or adjacent buildings.

## Dimensions and fidelity

| Quantity | Model | Basis |
| --- | --- | --- |
| Outer envelope area | about 2,873 m² | Mapped OSM ring |
| Building-axis outer width / length | about 51.6 / 64.1 m | Mapped, after the baked rotation |
| Courtyard | about 17.4 × 11.4 m | Mapped inner ring, open to the sky |
| Total height including finial | 40.0 m | **Estimated** from photo proportions |
| Main cornice | 22.4 m | **Estimated** |
| Assembly drum radius | 8.8 m | **Estimated**, fitted to south-east plan |
| Dome spring / roof summit | 27.1 / 35.6 m | **Estimated** curved profile |
| Ventilated lantern / finial | 35.85–38.55 / 40.0 m | **Estimated** |
| Rounded turret radius / dome / finial | 2.45 / 29.4 / 31.4 m | **Estimated**, revised against the station view |
| Entrance / secondary facade gables | 33.6 / 30.0 m, plus finials (entrance 36.0 m) | **Estimated**, revised Gothic entrance hierarchy |
| Street parapet pinnacles | 22.92–27.37 m | **Estimated**, stepped masonry shafts in both LODs |
| Window rhythm | 4.3 m typical bay pitch, three visible tiers | **Estimated** from photographs |

## Modelling and materials

The contrasting dark grey and cream masonry is actual separated quad geometry, with finer courses near and larger alternating courses far. Both keep the colour pattern; no texture or vertex-colour dependency. Windows are arched recessed-colour panels with offset cream outlines, mullions, transoms and near-only fan tracery. Paired attic arches, roses, raking copings, roof finials, parapet slots, cornices and framed entrances retain the Gothic character. Tall windows approximate double-height arrangements; they are glazed representations, not holes in the structural body.

The octagonal drum has eight fanlight/gable faces and corner pinnacles. A sampled curved metal dome sits above it, with eight ribs and a genuinely open, eight-shaft lantern. The courtyard is an actual mesh hole in both LODs. Two rounded ground-to-cornice turret shafts project from the east wing and support curved dome caps. Hip roofs leave the court open; the west plaster facade is deliberately simpler than the historic checker fronts. Repeated geometry merges into one mesh per material.

Palette keys are `stone`, `cream`, `roof`, `glass`, `wood`, `iron`, `glow`, `lamp`, identical in light/dark. `glow` is dark glazing by day and warm crown/rose illumination at night; `lamp` gives the main dome its night floodlighting. Other stone/glass tones dim in the dark palette. All geometry is self-contained standard GLB 2.0.

## Approximations and limitations

Rear window counts, the roof valleys, exact turret positions/radii, fine carved ornament, small ironwork and facade ornaments are reconstructed rather than surveyed. The full elaborate dome crown is reduced to dormers, roses and pinnacles; its lateral flying-arch relief is omitted. No sculpture, fence, trees, metro or plaza furniture is included. Roofs use broad flat metal tones and omit individual tiles/seams. Far drops minor window frames, tracery, rib end caps and chimneys, and coarsens masonry courses; the main silhouette, turrets, gables, roses, dome, lantern and courtyard remain. The model is recognisable but is not a conservation survey or an interior model.

## Export cost

Measured default scenes after the final independent-review fixes:

| LOD | Triangles | Draws | Bytes | KiB rounded |
| --- | --- | --- | --- | --- |
| Near | 33,471 | 8 | 1,478,204 | 1,444 |
| Far | 11,023 | 8 | 442,448 | 432 |

Near/far remain below 60,000 / 12,000 triangles and 2.5 MB / 500 KB. Far uses the maximum eight allowed draws. Hardware frame time is unmeasured. Both variants omit the unused bridgeLift attribute.

## Verification evidence

I opened the supplied reference sheet and the foundation photograph, then **looked at** the following contact sheets:

1. `tmp/top-cities/shots/palacio-de-la-cultura-medellin/palacio-de-la-cultura-medellin-procedural-near-light-sheet.jpg`: overview, front, back, roof, street and dome detail. It exposed buried round turrets and a short bare return wall. Turrets were projected forward, the return gained decoration, and entrance portals were added. Trim backs were removed and flat ribbon geometry replaced expensive small beam solids.
2. `tmp/top-cities/shots/palacio-de-la-cultura-medellin/exported-reference-contact.jpg`: exported near/far, light/dark, six views each next to station/back/front and restoration photographs. This led to closer flanking-turret placement, windows on the turrets, a less repetitive plaster rear facade, and explicit night dome floodlighting.
3. `tmp/top-cities/shots/palacio-de-la-cultura-medellin/exported-reference-contact-final.jpg`: the same 24 GLB views plus the four reference photographs. Turrets are now visibly rounded, the gable/dome/lantern hierarchy and court survive far LOD, and crown lighting reads in dark mode. Also opened the exported near-light `...-top.png` to compare the roof/base with the mapped geographic ring; only documented trims project. The final test found a portal trim 3 cm below grade; lifting that trim 7 cm resolved it without changing the visible massing.

`qa-metrics.mjs --ids palacio-de-la-cultura-medellin` reports no issues, zero different-material coplanar overlaps, no removable attributes, and 0.3% back-face sweep hits. The original six landmark-specific tests pass and verify grade and estimated height, the open mapped courtyard, projecting grounded round turrets, curved dome, lantern slots/supports, every vertex against the mapped envelope allowance, and far preservation. Shared conformance checks source/GLB bounds, named palettes, costs and manifest/catalog agreement. The original delivery passed three shared conformance checks; its full focused run returned 120/121 because Mission Inn was being edited concurrently. The review-fix validation below passes all nine landmark tests and the three shared conformance checks for this landmark. Independent reviewer re-acceptance remains the coordinator's separate gate.

## Placement modes

**Cityscape: not tested yet, integration is checked separately.**

**Full 3D world: not tested yet, integration is checked separately.**

A footprint-bounded median terrain pad with 8 m feathering is declared because coarse Medellín valley terrain could depress the default lowest-sample disc. The model remains a rigid structure at one local grade, including its court; no slope or DEM is baked. Actual entrance elevations, pad edges, terrain arrival/refinement, provider mask lifecycle and regional-to-street zoom still need app verification. No shared renderer, runtime clone, deployment, or other landmark file was changed.

## Independent-review fixes (2026-10-05)

The review in `tmp/top-cities/review/palacio-de-la-cultura-medellin/REVIEW.md` rated recognisability 3/5 and requested stronger Gothic street geometry. `REVIEW-1.md` contains the same findings, no `REVIEW-2.md` exists, and neither supplied file contains a Prepare command. The standard equivalent used for the new exported review sheet was:

```sh
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids palacio-de-la-cultura-medellin --out tmp/top-cities/palacio-de-la-cultura-medellin/fix-review/sheet-2
```

Before → after by finding:

* Thin cornice poles → repeated substantial four-sided masonry pinnacles with stepped bases, shafts, projecting shoulders, pyramidal caps and iron finials. They sit on mapped facade parapets and rise 4.45 m, including in far LOD.
* Small gable above repeated windows → an 11.6 m wide authored entrance bay between the rounded turrets, 33.6 m gable and 36.0 m finial; an actual extruded arch recess, layered arch mouldings, two stacked triple-mullioned window tiers, deep dividing friezes, fan/rose tracery and paired attic windows. The pane lies approximately 0.6 m behind the inner arch face, and the prior generic windows in this interval are omitted.
* Smooth small turret caps → wider 2.45 m rounded shafts, pronounced projecting stepped cornices, elongated curved dome profiles to 29.4 m, eight metal ribs in both LODs and finials to 31.4 m.

Two look/fix iterations were used. I opened the first regenerated `fix-review/sheet-1/palacio-de-la-cultura-medellin.jpg`: roofline and turret hierarchy were clearer, but deterministic QA caught a coplanar rose pane and far LOD above budget. The second pass separated the rose from the large glass pane by 8 cm, dropped buried rib end caps, and simplified only far circular tessellation. The final standard sheet and direct entrance/oblique/roof/dome views in near/far and light/dark were assembled and **looked at** in `tmp/top-cities/palacio-de-la-cultura-medellin/fix-review/FIX-CONTACT.jpg`, with the reference photograph present. The entrance now reads as a stacked Gothic composition, and the stronger pinnacles and ribbed turret silhouette remain legible far away.

Final deterministic QA in `fix-review/metrics-2.json`: no flagged issues, zero coplanar overlap, 0.3% back-face hits, no below-grade vertices, no removable bridgeLift bytes and acceptable far/near bounds. Near changed 32,316 / 8 / 1,427 KiB → 34,628 / 8 / 1,478 KiB; far changed 9,754 / 8 / 396 KiB → 11,446 / 8 / 436 KiB. Far is close to its triangle cap (554 triangles of headroom) and uses all eight permitted draws; future additions must reduce another cost first.

All nine landmark tests pass, including new observable rays for stepped roofline pinnacles, the entrance recess/tall gable and the elongated turret/cornice profiles, in both LODs. The three relevant shared conformance checks also pass; `node scripts/asset-catalog.mjs` passes 164 entries / 306 variants. Dimensions remain photographic estimates; carved sculpture, true masonry relief and exact interiors remain approximate. Cityscape and Full 3D world remain **not tested yet, integration is checked separately**. No shared-file changes were needed.

## Final review fixes (REVIEW-2, 2026-10-05)

The re-review rated recognisability 4/5 and requested only two concrete corrections, retaining the prior silhouette, pinnacles, turret profiles and current budgets:

* Unsupported dark blocks at three frieze levels → the carved frieze groups are now generated only **between consecutive supporting piers**, never after the last pier. The former inclusive terminal index created three detached panel/disk groups beyond each decorated wall. This is corrected for every facade generated by the helper; narrow returns also omit windows/sills that would exceed their supporting face. No silhouette or street geometry was added to disguise the defect.
* Glazed entrance wheel → an **opaque shallow stone crest tympanum**, filling the existing arch above the stacked glazing. It uses the existing shaded `cream` and `stone` materials, with a raised shield, crown, acanthus/laurel lobes, ribbon and small central figure. The panel is connected to the arch reveal; relief volumes embed into their supporting plaque/shield. There is no entrance glow disc, radial wheel tracery or circular glazing, including at night or in far LOD. This is an original simplified relief read from the photograph, not a conservation-accurate heraldic sculpture.

Collapsed triangles at far lathe-cap axes were also removed; they contribute no rendered area or silhouette. Both final LODs are **lighter** than the preceding review version: near 34,628 / 8 / 1,478 KiB → **33,471 / 8 / 1,444 KiB**, far 11,446 / 8 / 436 KiB → **11,023 / 8 / 432 KiB**. Far has 977 triangles of headroom and continues to use the eight-draw cap.

Executed the exact requested `qa-metrics.mjs --ids palacio-de-la-cultura-medellin --out tmp/top-cities/review/palacio-de-la-cultura-medellin/metrics.json` and `qa-sheet.mjs --ids palacio-de-la-cultura-medellin --out tmp/top-cities/review/palacio-de-la-cultura-medellin` commands. Opened the regenerated review sheet, also included in `tmp/top-cities/palacio-de-la-cultura-medellin/final-fix/FINAL-CONTACT.jpg`, and **looked at** entrance, front, opposite/back, roof, street, dome detail and overview in exported near/far and light/dark. The detached edge panels are absent across the elevations, and the entrance reads as opaque carved stone rather than a lit wheel. Other roses and assembly-hall illumination retain their prior treatment.

Final metrics: zero coplanar overlap, 0.3% back-face hits, grade minimum zero, no removable bytes and no budget or silhouette flags. All **14 focused checks** pass (11 landmark tests, three shared conformance tests); new tests pin supported facade-detail bounds and the visible opaque, shaded crest surface. Catalog validation passes 164 entries / 306 variants. Independent final review and both in-app placement modes remain separate coordinator gates; no shared source files were changed.
