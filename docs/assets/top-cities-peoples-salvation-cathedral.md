# People's Salvation Cathedral, Bucharest

Original procedural exterior of the National Cathedral of Romania at Calea 13 Septembrie 4–60, behind the Palace of the Parliament on Arsenal Hill. It represents the finished gold-roofed exterior visible in October/November 2025, following the 2018 altar consecration and 2025 mosaic consecration. No photograph, texture, scan or third-party mesh is embedded.

Editable source is `src/peregrine/landmarks/top-cities/peoples-salvation-cathedral/`. The parameterized geometry, config, mapped plan helper, footprint and views are owned by this asset. Rebuild with `pnpm build:top-cities-landmarks peoples-salvation-cathedral --no-check`; regenerate material ordering with `node scripts/landmark-depth-layers.mjs --ids peoples-salvation-cathedral`, then its `--check` form. Runtime deliverables are `public/models/buildings/peoples-salvation-cathedral-{near,far}.glb` and `peoples-salvation-cathedral.json`.

## References and dimensions

- [Official architectural concept](https://catedrala-nationala.ro/conceptul-catedralei/) publishes 126 m length, 67.70 m width and 127 m maximum height from its zero datum. Older repeated sections of that same page still list 120 m without the cross.
- [National Cathedral of Romania](https://en.wikipedia.org/wiki/National_Cathedral_of_Romania) identifies the consecrations, materials, sixteen-arched drum and distinction between 127 m above the entrance floor and 133 m from lower exterior ground. These datums must not be mixed.
- [OSM parent way 232332568](https://www.openstreetmap.org/way/232332568) and 22 cathedral building parts are taken from the supplied `tmp/top-cities/peoples-salvation-cathedral/osm.json` dossier, accessed by the lead's shared helper. No new Overpass requests were necessary.
- [MIHAIL, Catedrala Mântuirii Neamului – Fațadă](https://commons.wikimedia.org/wiki/File:Catedrala_M%C3%A2ntuirii_Neamului_-_Fa%C8%9Bad%C4%83.jpg), 25 October 2025, CC BY 4.0, supplies the limestone colour, side window rows, smaller towers and roof details.
- [MIHAIL, National Cathedral of Romania (2025 November)](https://commons.wikimedia.org/wiki/File:National_Cathedral_of_Romania_(2025_November).jpg), CC BY-SA 4.0, supplies the completed west belfry, rose, portal and porch arrangement. The initially found Flickr/Commons file advertised as a cathedral exterior actually depicts a rose flower; it was rejected and replaced. The two retained exterior references are in ignored `refs/exterior-{front,side}.jpg`; their licence pages are also retained there.
- The initial dossier contact sheet contains six interior mosaics by MIHAIL, CC BY 4.0. It was inspected for identity/context; interiors were not modeled.

| Dimension / feature | Model | Basis |
| --- | ---: | --- |
| Highest central cross | 127 m | Official entrance-floor datum and detailed OSM top part |
| Main drum upper cornice | 97.8 m | Detailed OSM parts |
| Main attic/dome spring | 103.8 m | Detailed OSM part, interpreted with photos |
| Main drum diameter | 28.5 m | Mapped 28.55 m drum, versus published 29.4 m outer colonnade; pilasters extend it |
| Central dome shell | 12 m above 103.8 m | Estimated curved outer profile; lantern connects to cross at 120 m |
| West belfry dome spring | 78.7 m | OSM 78 m upper part plus cornice |
| West dome/cross apex | 95.85 m | Photo-based estimate; published belfry dimensions use varying scopes |
| Body cornice | 52.4 m | OSM parent height 52 m, simplified moldings |
| Nave barrel roof crest | 62.8 m | OSM part height |
| Mapped parent envelope | about 121 × 71 m | OSM, separate from published 126 × 67.7 m scope |
| West porch | 8 columns / 7 open bays | Completed west photograph |
| Side nave porches | 6 bays on each side | Simplified reference rhythm inside parent outline |
| Small domed towers | 4 primary / 4 narrow turrets | Mapped parts and photo arrangement |

Lengths are metres without Mercator stretching. The mapped parent is used directly; it is not scaled arbitrarily to the published dimensions. The origin stays `[26.08226, 44.42591]`. +X east, +Y up, +Z south. Two control points on OSM part 1282747246, `[26.0827542,44.4257241]` and `[26.0818453,44.4257778]`, define the long-axis skew. Rotation **−4.72933098°** is baked once in source and GLBs; west frontage bearing is **274.72933098°**. Local y=0 is the reusable entrance-grade base, not an absolute DEM or the lower esplanade. The external 6 m datum difference is not added to structural height.

`OSM_WAYS` names the parent and all 22 cathedral parts, including the central cross, belfry, sanctuary and tower roofs. The footprint rings cover every owned part; the tiny 2 m² cross polygon is redundant inside the larger dome/parent rings and omitted to satisfy the shared minimum polygon-area contract. Detached site porticoes 1223607028/1223607029 and neighboring structures remain outside ownership. No broad plaza pad is drawn. Both LODs pass vertex containment inside the parent with the contract's 0.8 m eave tolerance.

## Model and LOD decisions

The mass uses the mapped irregular outline, octagonal upper crossing, sixteen-arched central drum, low gold barrel roof, distinct west belfry and dome, four larger satellite domes, four slender turret domes, and a mapped curved eastern sanctuary cap. Porch ground-level walls are inset so the west and side arcade bays remain actual negative space. Arched panes retain three separate rows on the body and discrete windows on every drum. The west facade retains its giant arched window, three molded archivolts, circular rose and seven bays. Dome ribs, column capitals, masonry courses, mullions and abstract geometric icon panels provide near detail.

Six merged material meshes: warm pale `stone`, subdued yellow `gold`, darker gold `rib` for icon silhouettes, blue-grey `glass`, brown `mosaic` for recessed entrance fields, and warm `glow` for icon panels. Near gold uses moderate metalness in the inspector; runtime colour is the named palette, so gold does not rely on an environment texture. Night dims masonry/glass while preserving gold, with restrained warm icon panels. Photograph mosaics, full saint likenesses, carved vegetal sculpture, inscriptions, interiors, basement and surrounding detached plaza structures are omitted. Rear details are reconstructed primarily from mapped geometry; the photo set provides stronger west/side evidence.

Far keeps every tower, roofline, cross, arched window row, sixteen main drum windows, rose and open arcade bay. It reduces curve segments and drops ordinary window surrounds, mullions, tiny medallions, stone courses, dome standing seams and slender drum columns. Major west portal moldings and porch columns survive. Near/far footprint extents differ by under 0.5 m; the 127 m cross apex is identical.

## Costs and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 46,368 | 6 | 2,167,520 | 2,116.7 |
| Far | 10,476 | 6 | 497,528 | 485.9 |

Measured default-scene GLB costs, uncompressed, below the 60k/14/2.5 MB and 12k/8/500 KB caps. These describe asset costs, not measured Tesla performance.

The first procedural sheet was inspected at `tmp/top-cities/shots/peoples-salvation-cathedral/iteration-1/peoples-salvation-cathedral-procedural-near-light-sheet.jpg`. It exposed a hidden west rose and a round sanctuary roof that did not follow the mapped eastern cap. The rose was moved to the actual front plane, the sanctuary was rebuilt from its mapped ring, side arcades gained inset rear walls, and the large west portal gained molded archivolts. Window bands were simplified to retain the rhythm within the far budget. The exported sheet also exposed sparse windows on curved apse edges; the final model restores three arched rows on those shorter edges in both LODs, now pinned by raycast tests.

Final exported comparison evidence is `tmp/top-cities/shots/peoples-salvation-cathedral/final/comparison-sheet.jpg`: retained west/side reference photos next to **near light facade/back/roof/street/detail/top**, **far light facade/back/roof/detail**, **near dark facade/back/detail** and **far dark facade/back/detail**. This checks GLB round trip, gold readability, silhouette, porch negative space, opposite facade and mapped alignment. All listed tiles were inspected. Ornament and unseen rear detail remain simplified rather than surveyed reproductions.

Focused tests pin the observable 127 m apex, grounded base, sixteen separate main drum arches, eight west columns and seven open bays, side arcade openings, rose and gold dome contacts, complete OSM ownership, mapped footprint containment, baked frontage bearing and LOD silhouette/cost. A deliberately obstructed bay proves the opening assertion distinguishes a filled porch. Test source: `peoples-salvation-cathedral.test.js`.

`qa-metrics.mjs --ids peoples-salvation-cathedral` reports no issues: zero coplanar pairs, zero unresolved layered faces after generated ranks, zero back-face hits among 326 intersecting rays, no retained bridgeLift attribute, and no far window-rhythm flags. Depth generation reports zero dropped cycle edges; its `--check` passes. Exact results are saved in `tmp/top-cities/peoples-salvation-cathedral/metrics.json` and focused-check logs.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. A footprint-bounded median terrain pad with three distributed reference points is declared for Arsenal Hill, but DEM samples, surrounding lattice coverage, entrance residuals and pad edges remain unverified. No terrain is baked into the GLBs. Asset-preview generation is left to the lead because its shared output lies outside this worker's ownership; approved landmark-local screenshots serve as the worker's export inspection.

Final focused command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/peoples-salvation-cathedral/peoples-salvation-cathedral.test.js` — **418 passed, zero failed**, including 13 cathedral-specific tests and all three shared cathedral conformance checks. `node scripts/asset-catalog.mjs` passed (266 records / 500 GLB variants at verification); `node scripts/landmark-depth-layers.mjs --ids peoples-salvation-cathedral --check` passed. Own zero-cycle evidence is preserved at `tmp/top-cities/peoples-salvation-cathedral/depth-cycles.json` so other concurrent builders can regenerate the shared cycle report without losing this result. `SPEC.ready = true` and catalog status is ready. No shared blocking issue remains; the only shared file changed is the generated depth table.

## Independent review fix — 2026-10-12

Review fix: raised arched west rose crest with gold roof edging, stepped cornices, returning west pilasters and gold hipped shoulders at belfry/satellite bases, retained in both LODs; far roof faces replace the masonry cap instead of overlaying it. Gold domes retain the existing calibrated gold palette.

Judged the exported `tmp/top-cities/shots/peoples-salvation-cathedral/review-fix/peoples-salvation-cathedral-glb-near-light-sheet.jpg` and `far-night-comparison.jpg` (far daylight plus near/far night); underlying four sheets are in the same directory. These show facade/roof/detail and opposite views as applicable. One visual inspection round was sufficient after deterministic budget and layer corrections. Geometry metrics for all three fix assets are in `tmp/top-cities/peoples-salvation-cathedral/review-metrics.json`: zero issues, no dropped depth cycle edges.

Cityscape and Full 3D world were verified only in the supplied pre-fix b3 captures by review b3a; post-fix app recapture and independent re-review remain with the lead. The preceding original-build statements describe the original builder handoff, not approval of these revisions. No provider ownership expansion was required by the review; exact existing ids/rings are retained.

Required final tests: all 28 landmark-specific tests and nine owned conformance checks passed; the complete top-cities run had 442 passes and one unrelated `washington-dc-temple` footprint-polygon failure. Catalog validation retry passed (286 entries / 520 GLB variants). Final results and before/after costs: `tmp/top-cities/peoples-salvation-cathedral/REVIEW-FIX-REPORT.md`; unfiltered focused output is in `review-tests.log` in that folder. Shared preview generation remains the lead’s responsibility under the worker-only output boundary.
