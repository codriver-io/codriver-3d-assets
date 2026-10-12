# Mémorial de Caen

Original procedural model of the peace museum on Esplanade Général Eisenhower, Caen. The 1988 building’s broad pale stone front is broken by a narrow full-height fracture, with recessed blue glazing above the entrance. The asset includes the mapped stepped west gallery and curved western hall, plus an estimated position for the newer low immersive drum. The facade is bare: the 2014 event banner is excluded.

## Evidence and rights

- [Museum history](https://www.memorial-caen.fr/le-musee/linstitution/): Jacques Millet, inauguration 6 June 1988, white Caen-stone facade with a symbolic fracture, museum floor area 14,000 m² over three levels. Floor area is not used as plan area.
- [Original architect’s project](https://www.mcg-architectes.fr/projet/memorial-de-caen-02-jpg/): 1988, Eisenhower esplanade, original scheme 7,300 m² and a bare-front photograph. Image `Memorial-de-caen-02.jpg` was viewed only as a private reference; copyright MCG Architectes / photographer unspecified, no redistribution rights assumed.
- [SOPREMA / CCS Ouest](https://www.soprema-entreprises.fr/realisation/memorial-de-caen/): 2019 immersive room by Millet–Chilou–Gardette, circular steel frame 18 m diameter and 8 m high; 93 curved sheets, 4 m high; matte-black finish without visible fixings. The structural frame and the exterior cladding height are different measurements.
- Provided `tmp/top-cities/memorial-de-caen/osm.json`: [main way 155629535](https://www.openstreetmap.org/way/155629535), cadastre 2012 source, architect Jacques Millet, start date 1988; [wall=no entry apron 155656141](https://www.openstreetmap.org/way/155656141). Neither has a height tag. A single current Overpass query through the shared helper failed; the supplied OSM API-prefill dossier remains the geographic authority.
- Dossier photo 1: [La salle immersive et le Mémorial de Caen](https://commons.wikimedia.org/wiki/File:La_salle_immersive_et_le_M%C3%A9morial_de_Caen.jpg), MémorialCaen, CC BY-SA 4.0. Photo 2: [Façade du Mémorial juin 2014](https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_du_M%C3%A9morial_juin_2014.JPG), Benoit-caen, CC BY-SA 3.0. Supplemental photo 3: [Musée du mémorial de Caen - 2](https://commons.wikimedia.org/wiki/File:Mus%C3%A9e_du_m%C3%A9morial_de_Caen_-_2.jpeg), Mickaël Schauli, CC BY-SA 4.0; this proved to be an interior image and did not inform the exterior geometry.

Original geometry only. No external mesh, tracing, photo or texture is in the source or GLBs. All reference images remain in ignored `tmp/`. Kilden was studied for recognizable negative space, material batching and useful LODs; its geometry was not copied. OSM-derived coordinates retain contributor credit and ODbL provenance.

## Dimensions and placement

| Feature | Model | Basis |
| --- | ---: | --- |
| Original main front | 72 m | OSM control edges, about 71.7–72 m |
| Original block depth | 52.9–53.4 m | OSM, longest eastern edge about 53.95 m |
| Main roofline | 15 m | Photo estimate; no authoritative surveyed height found |
| Fracture width | about 4 m | Bare-front photograph estimate |
| Entrance glazing setback | 6.9–7.0 m | Estimate, symbolic deep breach preserved |
| Main roof recess | 0.45 m | Estimate |
| West gallery / hall height | 7.3 / 8.1 m | Estimate; scarce elevation references |
| Immersive visible skin | 4 m | Published sheet height, matched to the low external drum in photo 1 |
| Immersive structural frame | 18 m diameter / 8 m high | Published contractor dimensions; internal frame not modeled |
| Immersive outer skin | 20 m diameter | Approximate shell envelope; not a surveyed exterior dimension |
| Immersive centre | local u=-31 m, v=12 m | Estimated west of the main block; newer than the OSM cadastre |
| Model origin | [-0.38457730871559803, 49.19755677816735] | OSM polygon area centroid |
| Front direction | 197.168° | Normal to east wall controls [-0.3836119,49.197024] → [-0.383393,49.197487] |

Coordinates are real metres east/up/south, with rotation baked once. Main plan coordinates are `u` east-southeast and `v` north-northeast, converted before export. Local `y=0` is a common rigid museum-grade datum; no DEM, sea level or latitude stretch is baked. The 8 m frame is not asserted to stand 8 m above this datum: only the visible 4 m skin is rendered. Subsurface structure and connections are excluded.

The replacement list includes the complete mapped museum ring and apron, a rectangular upper-slab envelope across the mapped ground-floor recess, and the estimated new drum ring. The latter two are authored envelopes, not invented OSM ways. The model stays within them to 0.20 m, including cladding offsets. Unrelated buildings, the elevator, gardens and roads remain outside ownership.

This broad site has sloping garden margins. A median `terrainPad` uses the owned rings and three site references with a 6 m feather. Its flat rigid placement is an authoring handoff only: world-mode datum, entrance levels and nearby road clearance require integration review. The photographed earth around the drum is not baked into the asset.

## Geometry

The front is two pale slabs with irregular fracture edges, a true open recess and continuous glazing following both jagged jambs. Near uses staggered Caen-stone courses made from merged quads, slightly in front of the backing; far drops the courses and preserves the opening and glass. Three other main faces keep quiet courses. Roofs are inset behind closed parapets, with a narrow glazed front/middle spine and a plain-stone cap over the short rear pocket. All pale roofs retain the same height in both LODs.

The stepped west gallery follows the OSM ring, with a schematic recessed ribbon of glazing. The western hall follows its mapped rounded plan; its reviewed finish is warm dark bronze under a muted grass-toned roof. The new drum is a closed 96-segment near / 32-segment far shell, matte black with subtle broad sheet seams; the cap is physically connected. No visible fixings are invented. The paved entry footprint is only 0.15 m thick, with a low threshold; no speculative overhead canopy is added.

Nine named materials near; far omits the stone tone and mortar backing. `glow` is limited to the recessed entry glass, warm and subdued at night; the full stone facade is not self-lit. Small panel tone changes are intentionally restrained. No flags, lawns, exhibits, banners, facade poem lettering, speculative machinery or interiors.

## Verification and limits

The dossier sheet and supplementary bare-front photo were looked at before authoring. The first procedural sheet identified a gallery/hall boundary error, an overly tall exterior drum, and roof caps that needed genuine recesses. The second sheet showed the drum intersecting the old annex: its estimated centre was moved west/south so the exterior stands clear; stone tone contrast was also reduced. The final exported GLB contact sheets show the bare facade, blue upper breach, deep entrance, subdued stone bond, west wing and a low dark drum standing clear of the old annex; both LODs keep the fracture and mapped outline. No further appearance fix was needed after the third look.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Inspector views do not verify provider masking, terrain arrival, lifecycle, roads or hardware performance. The western elevations, drum position, grade transitions and exact fracture profile remain the weakest approximations; the first independent review rated it PASS-WITH-NITS (recognisability 4/5), and the reviewed fixes are recorded below for recheck.

## Export costs and judged screenshots

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 7,958 | 9 | 621,484 | 606.92 |
| Far | 768 | 7 | 64,116 | 62.61 |

Measured from the exported default scenes by the build and `qa-metrics.mjs`. Far keeps the bounds to 7 cm; both reach 15 m and stand on grade. Near QA: zero coplanar material overlaps, zero back-face hits in 198 intersecting sweep rays, zero removable bridgeLift bytes. The quiet modern slabs need fewer triangles than an ornamented historic facade; far retains their negative space, full west-wing plan and 32-sided drum.

Personally viewed evidence, under `tmp/top-cities/shots/memorial-de-caen/`:

- `memorial-de-caen-procedural-near-light-sheet.jpg`: two look/fix rounds, overview/front/back/roof/entrance/detail/extension.
- `export-reference-comparison.jpg`: final exported **near/light, far/dark, near/dark, far/light** sheets placed beside the bare-front architect photograph and dossier immersive-room photograph. It includes overview, front, back, above, street-level entrance, breach detail and drum views. References were also viewed in `tmp/top-cities/memorial-de-caen/refs-sheet.jpg` and `extra-refs.jpg`.
- The comparison’s source sheets are `memorial-de-caen-glb-near-light-sheet.jpg`, `memorial-de-caen-glb-far-dark-sheet.jpg`, `memorial-de-caen-glb-near-dark-sheet.jpg`, and `memorial-de-caen-glb-far-light-sheet.jpg`.
- `memorial-de-caen-glb-near-light-top.png`: exported model and red owned rings align; the additional circular envelope is explicitly an estimate.

Initial validation ran 298 tests, with 296 passing and unrelated concurrent-builder failures in `abbaye-aux-dames` geometry and `cathedrale-de-bayeux` readiness. After review fixes, all ten landmark tests plus three filtered Mémorial conformance tests pass in about 0.3 s (source/export bounds, palettes, costs, manifest and catalog). `node scripts/asset-catalog.mjs` passed, 222 records / 426 GLB variants. QA metrics are at `tmp/top-cities/memorial-de-caen/qa-metrics.json`; command logs are `tests.log` and `catalog-check.log` in that dossier. Catalog preview build passed into ignored `tmp/champlain-preview/`.

No shared file change or shared-file assistance was needed.

## Independent-review fix pass, 2026-10-10

Completed the three findings in `tmp/top-cities/review/memorial-de-caen/REVIEW.md` in two look/fix iterations:

1. Large western curved hall: near-black `steel` walls (`#393333`, night `#33323a`) and shared grey roof at 9.1 m → warm bronze (`#705244`, night `#58483e`) and separate `softRoof` (`#758267`, night `#424e42`), with its top lowered to 8.1 m. The OSM plan, curved silhouette and adjoining 7.3 m gallery stay intact. This treatment applies to the large west hall; the distinct 2019 immersive drum keeps its sourced black finish and four-metre exterior skin.
2. Breach: the opaque middle band between separate glazing strips → continuous blue glazing from 0.2 to 14.7 m, clipped to both jagged jamb profiles. Dark geometry is limited to thin mullions, transom and the recessed soffit/body behind glass; warm night lighting is confined to door panes.
3. Rear: glass at the back of the fracture and an open rear roof pocket → a plain-stone rear wall joining the two slab depths, plus a stone roof cap between v=43.9 and 52.75 m. The glazed front/middle roof spine remains readable from above. The second look removed the dark rectangular roof gap visible on the first revised sheet.

Observable tests raycast through the middle-height glazing, into the rear stone wall, onto the capped rear roof and onto the lowered soft-roof hall in both LODs. Original geographic envelope, grade, drum, massing and LOD checks still pass. No shared source files changed.

`REVIEW.md` contains no Prepare command, so the equivalent exported-GLB preparation was run:

```sh
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids memorial-de-caen --out tmp/top-cities/memorial-de-caen/review-fix-metrics.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids memorial-de-caen --out tmp/top-cities/memorial-de-caen/review-fix-sheets
```

Personally looked at the regenerated `tmp/top-cities/memorial-de-caen/review-fix-sheets/memorial-de-caen.jpg` beside its reference photo, plus exported near/light and far/dark contact sheets at `tmp/top-cities/shots/memorial-de-caen/review-fix/memorial-de-caen-glb-near-light-sheet.jpg` and `memorial-de-caen-glb-far-dark-sheet.jpg`. These cover the facade, plain rear, roof, street entrance, breach detail and extension. Warm bronze, the softer roof, continuous jagged blue glass and closed rear read clearly after the second look; no additional fix was needed.

Focused validation command:

```sh
node --test --test-name-pattern 'memorial-de-caen|^near:|^far:|replacement envelope|entrance silhouette' src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/memorial-de-caen/memorial-de-caen.test.js
```

Result: 13/13 passing, recorded in `tmp/top-cities/memorial-de-caen/review-fix-tests.log`; catalog passes; metric `issues` is empty, with zero coplanar overlaps, zero back-face hits and no byte/draw/triangle budget overruns. Updated exports: near 7,958 triangles / 9 draws / 606.92 KiB; far 768 / 7 / 62.61 KiB. App modes and terrain integration remain **not tested yet, integration is checked separately**.
