# Ponts-Jumeaux, Toulouse

Original procedural model of the protected brick-and-stone canal bridges at Port de l’Embouchure, including the white Lucas relief facing the basin, with the adjacent north and south boulevard crossings fitted independently to OSM. This is the canal landmark, not the motorway interchange. The third Canal latéral crossing is represented by the plainer north boulevard deck; the two historic openings and the relief take visual priority.

## Evidence and dimensions

The [Mérimée inventory IA31124758](https://pop.culture.gouv.fr/notice/merimee/IA31124758) records Saget’s two bridges completed in 1771/1774, their basket-handle openings, brick and dressed stone, and Lucas’s relief installed in 1775. The [protection record](https://pop.culture.gouv.fr/notice/merimee/PA00094628) distinguishes the later third crossing. [Toulouse Métropole](https://metropole.toulouse.fr/annuaire/bas-relief-des-ponts-jumeaux) identifies the white Carrara marble panel. No surveyed vertical dimensions were found; heights below are expressly visual estimates.

| Parameter | Value | Basis |
| --- | ---: | --- |
| Origin | 1.41868, 43.61099 | Supplied OSM dossier anchor |
| North mapped vehicle structure | 19.902 m | Way 441406351; four lanes |
| South mapped vehicle structure | 38.196 m | Way 22689673; two lanes |
| Central historic axis | 163.50° | Short straight approximation within the curved mapped bridge envelope (mapped straight inner section is about 168°) |
| Central historic bridge | 25.542 m | Envelope aligned to the mapped original bridge |
| Relief wall / retaining return | 18.250 / 12.509 m | Estimated connection along the basin to the south curb |
| Historic clear arch spans | 11.4 / 10 m | Photo estimates |
| Historic rise above spring | 2.55 / 2.45 m | Photo estimates, basket-handle proportions |
| Historic walking surface / coping | 4.75 / 5.23 m | Local grade estimates |
| Lucas panel | 18.7 × 2.65 m | Photo estimate |
| Boulevard deck heights | 4.2 m | Flat-map convention, not absolute altitude |
| Boulevard deck widths | 16 / 9 m | Lane counts plus sidewalks; visual estimates |
| Ramps | North west 45.49 m; others 60 m | Available mapped approaches |
| Steepest flat-map grade | 13.85% north west; 10.5% others | Smoothstep ramps, 1.5 × rise/run |

References viewed: supplied `refs-sheet.jpg` and its Didier Descouens photographs, [ensemble](https://commons.wikimedia.org/wiki/File:Ponts-Jumeaux_Toulouse.jpg) (CC BY-SA 3.0), [relief](https://commons.wikimedia.org/wiki/File:Bas-relief_de_Fran%C3%A7ois_Lucas_-_Ponts_Jumeaux_-_Toulouse.jpg) and [Canal latéral](https://commons.wikimedia.org/wiki/File:Canal_lat%C3%A9ral_%C3%A0_la_Garonne.jpg) (CC BY-SA 4.0). No photo, texture, scan or traced mesh ships. The supplied dossier is the geographic source; two small supplementary waterway queries through the shared helper timed out, so no new geometry was invented from their missing replies.

## Geometry and road contract

Real local metres, +X east, +Y up, +Z south; y=0 is canal-side flat-map grade. Rotation is baked once. Both LODs use clean merged brick faces, stone voussoirs and stepped quoins; far retains the openings, pale rings, coping and panel while simplifying the arch rings and relief facets. The relief uses a continuous shallow faceted crowd/landscape mass, sail and drapery; it is deliberately not a sculpture reproduction. Brick, warm dressed stone, white marble and pavement have matching light/dark palettes.

The central historic arch uses a short straight approximation of its mapped pedestrian bridge envelope. The southern historic arch sits directly beneath the initial straight segment of the mapped south vehicle bridge, so its masonry supports the actual pavement. A separate narrow wall carries the relief between them and returns to the outside of the south curb. Three named mesh partitions (`heritage-`, `north-`, `south-`) survive both GLBs. The landmark’s own layer composes the unchanged `createRegistryBridgeLayer` three times and filters each loaded scene to its partition. Each road has its own stations, height, lateral fit, masks and load lifecycle; the historic axis has no vehicle road edges. Navigation resamples both vehicle profiles, rejects crossing headings and reads the same deck surface as pavement, route, car and camera. Foundations have zero attachment weight; the historic wall does not move when a vehicle approach is fitted. All runtime changes stay inside this landmark folder; no shared extension is needed.

The footprint rings cover the full authored envelopes including the relief projection and ramps; the original OSM historic outline is also retained as provenance. No building extrusion is claimed. Modern fascias are simple curb/brick/stone strips. The southern historic arch remains in the south mesh partition and receives that road’s deformation; the central bridge and relief wall remain outside its car lanes. The precise historic widening, detailed modern civil underside and canal banks are approximations. The north west road has only 45.49 m of mapped approach before another junction; its grade is under the 15% cap but steeper than the preferred 12%.

The requested Pont des Catalans quality reference and its document were unavailable (stub/missing in both checkouts). The completed Prince Edward Viaduct was studied for the shared profile/lift/export contract; its geometry was not copied.

## Validation

Contact sheets exposed an east-facing panel and, later, the south roadway crossing the initial straight frontage. The panel now faces the basin; the historic arches use separate axes, with the southern one exactly on the mapped roadway, and the relief wall ends outside the south curb. A raycast regression checks both edges and the centre of each car corridor every metre above the pavement in both LODs. Both canal openings remain unobstructed and attached to their decks.

Read final exported near/far, light/dark, basin facade/back/plan/detail sheets beside the dossier photos: `tmp/top-cities/shots/ponts-jumeaux/review-final/export-vs-reference.jpg`. The exported near-light sheet includes overview, roof, underside and the opposite face. The panel’s silhouette/white material and shallow raised carving persist in far, with less drapery/figure detail. The relief is intentionally abstract, and the basin frontage is an angular interpretation of the historic composition.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 5,121 | 10 | 330,372 | 323 |
| Far | 3,744 | 9 | 205,252 | 200 |

Exact generated byte metrics in `public/models/bridges/ponts-jumeaux.json` are authoritative. `qa-metrics.mjs --ids ponts-jumeaux` passes: no flagged coplanar overlap, 0% back-face ray hits (102 intersections), minimum y −0.23 m (thin fallback roadway underside), far silhouette on budget. The focused landmark file has seven tests; the required command including `top-cities.test.js` passes 261 checks. Catalog coverage, `pnpm assets:check`, `pnpm assets:preview`, export round trips, semantic materials and `_BRIDGELIFT` all pass.

Two redundant stone blocks buried in the southern arch were removed in final GLB cleanup, reducing coplanar candidates to 0.1 m²; the final export/reference sheet was read again. This changed no road surface or runtime profile.

Renderer bundle `31ce36ff54fe` was built locally for inspection only and is not part of the delivery. Final Protomaps/OSM app captures: `tmp/top-cities/ponts-jumeaux/review-app-cityscape/` (far, near, street) and `review-app-world/` (far, near). In both modes the three parts load and are active. Additional screenshots at both approach endpoints and both bearings for both vehicle roads are in `review-approaches-cityscape/` and `review-approaches-world/`; the combined `tmp/top-cities/ponts-jumeaux/review-approaches-sheet.jpg` was read in both modes, and their `surface.json` records the live map API values and mode state.

| Check | Cityscape | Full 3D world |
| --- | --- | --- |
| Final GLB loading, far/near and placement | Verified locally | Verified locally with Terrarium terrain |
| Standard pavement at both approaches, both directions | Verified locally | Verified locally |
| `heightAt`, bridge centre / approach endpoints | 4.2 m / 0 m | North ≈4.2 m, south ≈4.36 m / ≈0 m, relative to sampled ground |
| Both direction headings | Same deck reading | Same deck reading |
| Cross headings / original pedestrian axis | null | null |
| Disable → reload | null while disabled; active after reload | null while disabled; active after reload |
| Actual HD lane paint / production traffic / Tesla hardware | Not tested | Not tested |
| Terrain exaggeration, late replacement and production mode rollout | N/A / not tested | Not tested |

Terrain uses `bank-fit`; no basin-wide flattening or DEM height is baked into the geometry. The world screenshot run uses the configured public Terrarium elevation source, not a survey of canal water level. Small DEM interpolation corrections at the ramps are recorded in `surface.json`; final installation is still subject to independent review and full provider/device testing.

Live HD pavement/paint, Tesla hardware and production traffic are not established by an asset viewer. Local `/osm-lanes` requires Redis, so live lane paint is unavailable in this task’s preview environment. No staging deployment was made.

Delivery is committed on the dedicated landmark branch; only the owned landmark source, catalog fragment, document and exports are retained. Local servers were stopped after QA, and generated shared renderer bundles were restored to the original branch contents.


## Independent review fixes (2026-10-09)

Addressed all four findings from `tmp/top-cities/review/ponts-jumeaux/REVIEW.md` in two look/fix rounds:

| Before | After |
| --- | --- |
| Grey-green relief and detached pawn figures | Warm white marble (`#fffaf0`) and relief (`#f5f1e7`), one continuous raised mass with shallow faceted shoulders; no detached heads or arms |
| Narrow, foreshortened 15 m panel | 18.7 m estimated panel with an 18.25 m basin wall frame, extending its north end 4 m toward the historic bridge while remaining outside car lanes |
| Horizontal mortar streaks on the east arch | Removed sub-pixel mortar geometry from both arch faces and parapets; brick remains a merged solid face |
| Thick pale coping and a taller relief block | Coping reduced from 0.58 × 0.12 m to 0.48 × 0.08 m on boulevard parapets, with brick filling the old gap; historic parapet and relief/return wall share a 5.23 m coping top |

There is no Prepare command or REVIEW-2 in the supplied local review; re-ran its standard exported-GLB sheet preparation with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids ponts-jumeaux --out tmp/top-cities/review/ponts-jumeaux/final` and read `final/ponts-jumeaux.jpg` alongside the dossier reference sheet. Read the final light/dark near/far facade/detail sheet with roof/back and photos at `tmp/top-cities/shots/ponts-jumeaux/review-final/export-vs-reference.jpg`; the white band is broad, continuous coping is low, and the basket-handle openings retain their recognizable stone rings. Fine sculpture remains an explicit approximation.

Re-exported with the requested command; all 261 focused checks pass, catalog validation and preview pass, and final metrics have no flags or budget overruns (0% back-face hits; the pre-existing buried stone/brick contact remains 0.1 m²). Rebuilt the local app and repeated near/far/street and both-direction approach checks in Cityscape and Full 3D world. Those standard-pavement checks do not establish live HD paint, production traffic or Tesla hardware, which remain untested for the same local Redis/provider limitations described above.
