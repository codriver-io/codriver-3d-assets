# Lviv National Opera

Original procedural model of the Solomiya Krushelnytska Lviv National Academic Theatre of Opera and Ballet, Svobody Avenue 28, Lviv, Ukraine: Zygmunt Gorgolewski’s 1897–1900 Neo-Renaissance / Neo-Baroque exterior. The three open arched loggias with paired Corinthian columns, triangular sculptural attic, winged bronze Glory with gilded palm flanked by allegorical groups, and rear copper cupola identify it at road distance. The cupola covers the stage block according to the architectural history source; the lower hall/foyer is in front of it.

Editable source: `src/peregrine/landmarks/top-cities/lviv-national-opera/`. Export: `pnpm build:top-cities-landmarks lviv-national-opera --no-check`. Texture-free, original geometry only; no scan, traced mesh, photograph or third-party mesh ships.

## Sources and frame

References checked 2026-10-11:

- [Center for Urban History / Lviv Interactive architectural history](https://lia.lvivcenter.org/en/objects/opera-house/): construction dates, paired Corinthian columns, three portals and arched loggias, attic, nine-figure tympanum, six-metre bronze acroterions, dome ventilation lanterns, and stage-block dome.
- [Visit Lviv facade history](https://visitlviv.net/en/about-lviv/the-facade-of-the-lviv-opera/): approximate base dimensions 45 × 95 m.
- [Identity, architect, opening date and address](https://en.wikipedia.org/wiki/Lviv_Theatre_of_Opera_and_Ballet).
No additional provider building parts occur in the supplied extract. Nearby kiosk and apartments are excluded.

The OSM centroid is the origin: [24.02623964019201, 49.84404123377512]. Real metres, +X east, +Y up, +Z south; y=0 is local entrance grade and the complete mapped plinth is rigid. Width and heights have no Mercator stretch or DEM baked in. Footprint controls [24.0258414,49.8442329] → [24.0259443,49.8440542] give the longitudinal bearing 159.6284288°; this faces the front south-southeast along Svobody Avenue. The 20.3715712° model rotation is baked once into all primitives and exports. Provider ownership is exactly way 459807007, including its front projection and rear bay. Vertices remain inside its polygon or the allowed 0.8 m architectural eave slack; there is no plaza pad geometry.

| Dimension / feature | Model | Basis |
| --- | --- | --- |
| Complete mapped envelope | approximately 43.1 × 85.3 m | OSM outer ring in facade-aligned coordinates |
| Published base | approximately 45 × 95 m | Visit Lviv; different rough envelope, deliberately not used to stretch OSM |
| Building height | 43 m including finial | Photo-proportion estimate, no surveyed height found |
| Main cornice / attic / pediment | 23.3 / 26.3 / 30.2 m | Estimated from facade photos |
| Three arched loggias | radius 2.55 m, spring at 17.4 m | Count sourced; dimensions estimated |
| Eight paired Corinthian shafts | approximately 13 m order, about 0.9 m shaft diameter | Order and pairing sourced, dimensions estimated |
| Bronze rooftop acroterions | 6 m | Six-metre groups sourced in Lviv Interactive; sculptural shape abstracted |
| Rear cupola | approximately 29.1 × 23.0 m; roof 29.65–39 m | Estimated from side and aerial photos |
| Lantern / finial | to 43 m | Estimated |
| Terrain pad radius | 50 m | Envelope coverage estimate, live DEM not sampled |

## Materials, construction and approximations

Six material batches in both LODs: warm subdued cream `stone`, oxidized copper `roof`, green patinated `bronze`, dark recessed `glass`, entrance `glow`, gilded palm `gold`. Night dims masonry and metal; entrance glazing becomes softly warm. Full facade floodlighting is omitted.

Actual cut-through wall apertures with recessed glazing preserve window rhythm without material overlays. Ground rustication stops between windows. The front loggia has three genuinely open bays, separate paired shafts, broad Corinthian capital foliage in both LODs, arch mouldings, balustrades and a recessed glazed wall. A stepped cornice respects the projecting middle frontage. Statues use joined feet, limbs, flowing skirts, torsos, heads and wings; the central figure holds a geometric gilded palm. Both LODs include nine clustered upright and reclining relief silhouettes and cartouche motifs. Sculptures are abstractions, not anatomical replicas or copies of carvings.

Near includes finer capital foliage, fluting, rustication, dentils, reliefs and 24 dome seams. Far removes subpixel decoration, coarsens side bay counts and alternate upper attic-storey windows, and uses fewer dome/column segments, while keeping all three loggia voids, paired columns, all three bronze groups, three entrances, separate side window rows, cupola, lantern and ventilator caps. The rear is a reconstruction from mapped footprint and the side/aerial reference; unseen carving and interiors are omitted. Door lettering, banners, flags, adjacent plaza structures and street furniture are omitted.

## Verification

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Actual Tesla performance and lifecycle transitions remain untested.

The dossier `tmp/top-cities/lviv-national-opera/refs-sheet.jpg` was opened and compared with the first procedural sheet `tmp/top-cities/shots/lviv-national-opera/iteration-1/lviv-national-opera-procedural-near-light-sheet.jpg` (facade, back, roof, street, detail, top). This showed a plain arch surround and redundant ground-floor detail, so the final geometry added arch mouldings, stepped the front cornice to the footprint, stopped rustication between windows, seated the central bronze figure on its pediment, and reduced far bay density while preserving separate rows. Identical extrusion vertices were welded, preserving creases and geometry while reducing GLB bytes.

The final exported comparison sheet was **opened and visually judged**: `tmp/top-cities/shots/lviv-national-opera/final/comparison-sheet.jpg`. It contains four reference-photo tiles alongside exported near light facade/back/roof/street/detail/top, far light facade/back/roof, near dark facade/detail, and far dark facade/back. Exported shape matches the procedural model. The three tall loggia voids, paired shafts, roofline and three human/wing silhouettes remain legible in far. Top views fit the red owned footprint. No open exterior shell, floating sculpture or reversed face was visible. The stone-carving program is simplified and the rear elevation is a photo/mapping reconstruction; full night floodlighting is intentionally not reproduced. Independent visual judgement remains pending.

Exported default-scene costs (uncompressed):

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |

| Near | 37,840 | 6 | 1,697,480 | 1657.7 |
| Far | 10,368 | 6 | 454,868 | 444.2 |

Both LODs meet the building caps (60k/14/2.5 MB near, 12k/8/500 KB far); these are asset costs, not real hardware benchmarks.

Eleven focused geometry tests pin open loggias, eight paired shaft contacts, entrance glazing, six-metre bronze silhouettes and named stone support contacts (including a deliberately free-foot negative case), copper dome, lantern glazing, base at grade, complete mapped ownership, baked orientation, vertex containment, side window rows and near/far bounds. The focused landmark run passed in under 0.4 seconds. Shared conformance additionally checks source/export roundtrip bounds, metric budgets and record parity.

`qa-metrics.mjs --ids lviv-national-opera --out tmp/top-cities/lviv-national-opera/metrics.json` reports no issues: zero near/far layered faces, zero near different-material coplanar pairs, 0% back-face hits across 315 intersecting rays, no removable bridgeLift bytes, no flagged unsupported named linear members. `landmark-depth-layers.mjs --ids lviv-national-opera` reports zero dropped cycle edges; final check is recorded below. The shared generated depth table is the only authorized shared-file mutation.

Final checks on 2026-10-11:

- `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/lviv-national-opera/lviv-national-opera.test.js`: **390 passed, zero failed**, including all nine local tests and all three shared Lviv conformance checks.
- `node scripts/asset-catalog.mjs`: **valid**, 266 entries / 452 GLB variants at validation time.
- `node scripts/landmark-depth-layers.mjs --ids lviv-national-opera --check`: **current**, one model, no material cycles.
- `SPEC.ready = true` and catalog status `ready`; near/far exports and metrics match procedural source.
- No git writes, dependency installation, app server, shared runtime edit or online deployment was performed.

## Independent review fixes — 2026-10-12

Review fix 2026-10-12: separate seated allegorical pairs flank standing winged Glory and its palm; broad Corinthian foliage/arch mouldings and nine clustered upright/reclining pediment figures survive both LODs. Abstract human silhouettes and photo-estimated carving remain. Mapped envelope, sourced 6 m group height, rigid grade and provider way 459807007 retained. Independent re-review and lead app recaptures in both modes pending.

The previous repeated V-shaped roof figures were replaced by differently gesturing seated main figures with lower attendants and wings; right group carries a simplified lyre, central Glory keeps wings and gilded palm. Joined feet/plinths remain seated on the named masonry supports. The thin loggia outlines became broad arch rings with keystones and expanded leafy capitals. The triangular relief now combines three upright central figures with six reclining flanking figures rather than miniature identical standing figures, in near and far. The change reduced near cost while spending far headroom on recognisable sculpture.

Opened and judged exported near/light facade, street/entrance, detail and roof sheet `tmp/top-cities/shots/lviv-national-opera/review-fix-1/lviv-national-opera-glb-near-light-sheet.jpg` and final far/dark equivalents `tmp/top-cities/shots/lviv-national-opera/review-fix-2/lviv-national-opera-glb-far-dark-sheet.jpg`. Broad sculpture/crest survives far; openings, windows and grade remain unchanged. No third visual look-fix iteration was used. The app evidence in `tmp/next-200/qa/b1/` predates these changes; lead must recapture and obtain independent re-review.

Final combined dedicated and shared top-cities conformance tests pass **409/409**, including 18 dedicated cases, against the final exports. Final deterministic QA metrics are clean for both landmarks. Depth tables regenerated and checked current for both models, with zero cycles. Global catalog validation passed: **266 entries / 472 GLB variants**; an earlier transient missing document in another worker's in-progress record cleared without editing its files. All costs above now reflect the revised exports.
