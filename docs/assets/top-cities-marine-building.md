# Marine Building, Vancouver

Original procedural exterior of the 1930 Marine Building, 355 Burrard Street, designed by McCarter & Nairne. Its warm buff masonry tower, stepped white terra-cotta terraces, sea-green hipped crown and large marine-themed entrance distinguish it from nearby glass office towers. No photos, textures, traced meshes or interior are shipped.

## Sources and dimensions

[Wikipedia](https://en.wikipedia.org/wiki/Marine_Building) identifies the opening on 7 October 1930, architects, 97.8 m published height and 22 floors. OSM has 21 building levels, a 97.8 m outline and a 98 m rooftop part; this asset uses 98 m to its small finial. The exterior rather than a historical reconstruction is modeled; the 1947 photo informs unobstructed massing, while the 2018 entrance and modern tower photos inform materials and detail.

| Feature | Model | Evidence |
| --- | --- | --- |
| Height | 98 m | Published 97.8 m; mapped rooftop way 360575458 reaches 98 m |
| Owned outer plan | 1,926 m² irregular polygon | OSM way 125579375, supplied dossier |
| Origin | -123.11710198836293, 49.287513755091574 | Area centroid of the mapped outer ring |
| Burrard facade bearing | 134.55° outward | Control points (-123.1171239,49.2872722) and (-123.11686,49.2874416); mapped orientation baked into geometry |
| Setbacks | 26 / 40 / 68 / 74 / 80 / 88 m | OSM building parts 360575454 / 360437838 / 360437839 / 360575455 / 360437840 / 360437841 |
| Northeastern porch | 8 m | OSM 360575460 |
| Low north podium | 22 m | Estimated from reference massing; outline has only overall height |
| Crown | 88 m eave, 96 m hip apex, finial to 98 m | OSM roof tag says 96m; interpreted as absolute crown top, not 96 m roof rise |
| Facade rhythm | About 3.85 m floors, 2.9 m near bays, 3.8 m far bays | Photo estimates; rendered window rows do not assert a surveyed floor count |
| Entrance | 7.2 m clear width, 7.2 m spring, 10.8 m arch apex, 1 m recess | Photo estimates |

Mapped provider ownership includes all nine ways: 125579375, 360437838, 360437839, 360575455, 360437840, 360437841, 360575458, 360575460 and 360575454. The tiny finial ring is inside the crown replacement ring; it is listed as an owned way but not a separate sub-4 m² footprint. Quad details extend at most 0.56 m beyond masonry at the entrance, inside the provider ownership tolerance. Nearby MNP Tower and Quadra Club remain outside this asset.

## Geometry and materials

The facade derives from the union of the active mapped parts at each height, with roof caps only in the exposed difference. Collinear wall segments are split at all mapped endpoints and merged vertically: a setback on the back cannot produce a blank floor across the continuous front. Ear-clipped wall polygons contain real window and portal holes; near panes are recessed 0.18 m with outward reveals; far panes partition the cut wall plane without hidden backing or reveals. Both LODs retain grouped pale terra-cotta piers and green spandrels; near adds paired mullions and 0.22 m pier relief with closed returns. Far retains individual bays and rows, all terraces, the hipped crown and the arched portal.

The seven named merged materials are buff `brick`, pale `stone`, desaturated `green` terra cotta, `glass`, scattered `glow` office panes, `bronze` doors/grille and grey `roof`. Day and night palettes have matching names. Night panes use a restrained warm glow. Ornament is original geometry: simplified scallop shapes flank the portal and a sailing-ship silhouette appears above the doors in near. These suggest marine decoration without pretending to reproduce the historical bas-reliefs. No signage, figurative sculptures, detailed carved foliage or interior lobby is modeled. The unusual OSM corner/crown polygons are retained rather than replaced by symmetric boxes.

## Verification and limits

The supplied `tmp/top-cities/marine-building/refs-sheet.jpg` was read, including the historic unobstructed mass, contemporary full tower and entrance close-up. Procedural near sheet at `tmp/top-cities/shots/marine-building/marine-building-procedural-near-light-sheet.jpg` includes overview, back, roof, detail and crown. First inspection exposed blank horizontal bands at the intermediate slab boundaries; merging persistent wall spans removed them. A second correction gave the 68–74 m crown shoulder its missing window row and removed the tiny near-only ship relief from far after the depth detector found a stone/bronze cycle.

Final exported GLB sheets were read alongside the reference photos in `tmp/top-cities/shots/marine-building/reference-export-comparison.jpg`. The four individual sheets are `marine-building-glb-near-light-sheet.jpg`, `marine-building-glb-far-light-sheet.jpg`, `marine-building-glb-near-dark-sheet.jpg` and `marine-building-glb-far-dark-sheet.jpg` in that directory. Light sheets include front/overview, back, above, entrance detail and crown; dark sheets include overview, entrance and crown. The exported crown, footprint and portal match the source, and the far model preserves separate windows and terraces. Near mullions were moved to 12 cm in front of their panes, and grille rays now reach the stone arch; the added contact test includes a deliberately shortened free-end failure. Focused tests cover crown height, all terrace datums, recessed arched entrance and scallops, far window rows, mapped footprint containment and GLB round trips. No ground furniture or detached structure is present. Dimensions of facade detail and reliefs remain estimates, and the low north podium height needs independent review. The discrete OSM setbacks are a simplification of the finer terra-cotta corbelling.

Cityscape: **not tested**. Full 3D world: **not tested**. Integration, unobstructed app screenshots, shared material shading, provider removal, terrain footing/pad behavior and lifecycle checks are checked separately by the lead. Export inspection does not certify either mode. y=0 remains rigid local flat-map grade; no terrain values or stretch are baked in. No measured Tesla hardware performance.

## References and rights

Sources are photographic comparison only and remain in ignored dossier scratch. The catalog lists each reference title, author, licence and Commons page: Major James Skitt Matthews, *Marine Building in 1947* (public domain); Wpcpey, *Marine Building Entrance 2018* and *Marine Building Lobby 2018* (CC BY-SA 4.0); Bobanny, *Marine Building from granville* (public domain); Arnold C, *Marine-bldg* (Attribution); Alethe, *Marine Bldg zeppelin decoration* (CC BY-SA 3.0). Plan data © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). Original authored model under the repository's standard model licensing; no external mesh or image is retained in public output.

Rebuild: `pnpm build:top-cities-landmarks marine-building --no-check`.

## Measured costs and final checks

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 20,055 | 7 | 881,776 | 861.1 |
| Far | 7,206 | 7 | 260,156 | 254.1 |

`marine-building.test.js`: 7/7 pass (about 0.36 s). Combined top-cities conformance plus the then-six local tests: 479/480 pass; the sole failure was the concurrently authored High Museum of Art near model (76,308 triangles against its 60,000 cap). All three Marine Building conformance checks passed. After the grille contact test was added, the local seven tests passed again. `qa-metrics.mjs --ids marine-building`: **ok**, no window-rhythm, material-layering, coplanar, back-face or member-end findings. Depth generation: **zero dropped cycle edges**; scoped `--check` passes. The shared generated depth table can be overwritten by concurrent builders, so the lead should regenerate all IDs at commit time.

Whole-catalog check was retried and remains blocked solely by the concurrently authored `docs/3d-top-cities-high-museum-of-art.md` being absent; earlier it also saw unregistered High Museum exports. No other landmark was edited. The final scoped depth check still passes, and the final geometry-metrics check is clean. Durable local evidence: `tmp/top-cities/marine-building/tests.log` and `tmp/top-cities/marine-building/metrics.json`.

## October 12 review fix

Review b5a: strengthened grouped pale terra-cotta piers, green spandrels, stepped pendant crown frames and carved pale/green portal voussoirs in both LODs. Near piers replace the original wall and project 0.22 m with closed returns; far retains separate flush window quads in cut wall openings, eliminating buried reveals without losing rows/bays. Existing nine OSM ownership ways and rigid grade retained; no provider overlap was established by obscured app views. Ornamental proportions and marine motifs remain photo-based abstractions.

Latest measured default-scene costs: near **20,055 triangles / 7 draws / 881,776 bytes**; far **7,206 triangles / 7 draws / 260,156 bytes**. These supersede earlier authoring-stage results.

Inspected exported contact sheets in `tmp/top-cities/shots/marine-building/b5-fix-final/`: near/light, near/dark and far/light or far/dark, including the reviewed facade/crown details; Source geometry QA is clean for both LODs, with zero layered/coplanar faces, no material cycles, and preserved bounds/window rhythm. The four-landmark tests pass 27/27; combined registry and landmark run passes 501/502, with its sole unrelated failure at `cite-de-carcassonne` (footprint is a real polygon). Evidence: `tmp/top-cities/marine-building/b5-fix-tests.log` and `b5-fix-metrics.json`. Depth generation and scoped `--check` pass; catalog validation, `pnpm assets:check` and `pnpm assets:preview` pass (286 records, 560 variants).

Cityscape: **not tested by this fix worker**; Full 3D world: **not tested by this fix worker**. Fresh app recaptures and independent re-review remain with the lead, as assigned; no overlap was inferred from foreground occlusion and no neighbours were removed.
