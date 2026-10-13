# MuCEM & Fort Saint-Jean — Marseille

Original procedural exterior of the J4 museum opened 7 June 2013, designed by Rudy Ricciotti with Roland Carta, and its connection to Fort Saint-Jean. Identity: a low dark concrete lace square around a glass core, a long thin roof footbridge, pale stone harbour ramparts and the circular Tour du fanal / square Tour du Roi René.

## Sources, rights and geographic frame

Consulted 2026-10-13. [MuCEM official architecture](https://mucem.org/en/the-architecture-of-the-mucem/) gives the 72 m outer square, 52 m core, two winding peripheral ramps, 309 tree-like posts, bridge 19 m above grade and blue/turquoise night lighting. [Official J4 page](https://mucem.org/infos-pratiques/j4/) currently calls the aerial walkway 135 m; older official pedagogical material calls it 115 m. The geometry uses the mapped alignment, extended into the roof landing, about 115 m: it does not force the current public page's length onto a different footprint.

OSM dossier `tmp/top-cities/mucem/osm.json` covers the fort. The shared Overpass helper failed its three endpoints; two small OSM map API extracts recovered the J4 footprint and bridge path in `j4-map.osm` / `bridge-map.osm`. These are geographic data, not captured meshes. J4 way 168685674 has height 19; Accès J4 ways 200973160 and 839897089 fix the roof-to-fort bearing. Two facade control points on J4 are [5.3604469,43.2968254] and [5.3611321,43.2971357], matching the local east/north axis approximately [0.851,-0.526]. Rotation is baked into the source/GLBs.

Frame: real metres east/up/south around [5.36194,43.29528]. y=0 is quay/J4 footing. The fort's authored 17 m terrace is a structural rigid podium estimate, with walls down to y=0; it is not a sampled DEM or absolute elevation. `terrainPad` declares the owned envelopes and museum-footing median reference, but both-mode integration needs independent terrace/DEM validation. Water between fort and J4 remains open, with no bridge-wide terrain pad.

The museum's cadastral outline is about 68 m across; the procedural 72 m screen envelope extends up to approximately 4 m beyond it. Both the cadastral provider outline and authored outer screen envelope are in FOOTPRINTS. The fort podium covers its internal mapped wings and every listed tower part; Tiny service structures inside the fort terrace are represented by the rigid terrace instead of individual boxes; their provider ids are included under the full fort envelope (individual rings below 4 m² would fail conformance). The Memorial des déportations is excluded. OSM_WAYS lists each modeled provider way/part. Bridge path ways are circulation references, not provider building extrusions.

Reference-only Commons dossier photographs, inspected as `refs-sheet.jpg`: Holger Uwe Schmitt, “Beeindruckende Architektur”. 5.jpg (CC BY-SA 4.0); Suwannee.payne, Fort Saint-Jean & Musée… (CC BY-SA 3.0); Houss 2020, Mucem Marseille 02/03 (CC BY-SA 4.0); Bertrand SOUBEYRAND, Ben Mahi ed-Din Abd-el-Kader au Mucem 2022 (CC BY-SA 4.0). Linked source pages and credits are in the catalog. All meshes are original code; no photographs, textures, scans or third-party meshes ship. Geographic data © OpenStreetMap contributors, ODbL 1.0.

## Dimensions and choices

| Feature | Metres | Evidence |
| --- | ---: | --- |
| J4 screen width | 72 | Official MuCEM |
| Glass exhibition core | 52 | Official MuCEM |
| Footbridge deck | 19 above local grade | Official MuCEM |
| Roof-to-fort footbridge | 114.7 | OSM alignment plus estimated embedded roof landing; older official length 115 |
| Screen / roof | 20.8 / 20.91 | Estimated; OSM building tag 19 and photographs distinguish terrace from upper canopy |
| Fanal tip | 31 | OSM part 264423707 |
| Roi René turret tip | 33 | OSM part 264423706 |
| Fort upper terrace | 17 | Estimated from roof bridge contact and photos |
| Fort inner buildings | 4.2–7 above terrace | Estimates; mapped rings and tower tags remain distinct |

The cellular lace is a deterministic original bounded Voronoi network, with open polygon apertures, front/back skins and inner reveals in near. Far uses flat double-sided thick webs with 18×6 facade cells and 17×17 roof cells, 39% concrete coverage versus near’s 28%, and keeps real apertures on both sea faces and roof, the inset glazing rhythm, all fort wings and towers, and the continuous unsupported-span silhouette. Repetition merges by material. The bridge is a closed UHPC trough with continuous deck, side parapets and end diaphragms; its museum landing sits on the core roof and its fort end is embedded in a named stone bearing. Peripheral ramps have continuous closed sloping slabs and vertical corner supports. Seven materials: matte charcoal lattice, blue-grey glazing, dark framing, subdued warm stone and coping, muted tiled roofs and blue night panes. The night palette approximates Kersalé's illumination without simulating the changing installation.

Approximations: coarse polygon apertures rather than reproducing individual lace panels; straight column equivalents instead of 309 surveyed tree columns; simplified fort roof shapes, terrace gardens, masonry and window spacing; flat rigid terrace datum. The public museum signs and temporary exhibition lettering are omitted. This is an exterior driving-scale model, not an architectural survey.

## Verification

First source contact sheet `tmp/top-cities/shots/mucem/mucem-procedural-near-light-sheet.jpg`: front/back/above/street/detail/bridge views compared with the dossier sheet. Its uniform rounded-cell grid was too regular, so it was replaced by irregular Voronoi cells. Roof boundary concrete beams and posts now support the canopy; ramp slabs use closed geometry with supported corners. Three far material-depth cycles were fixed by making the touching concrete roof landing/base one material and consolidating stone terrace/keep surfaces; regenerated cycles report is empty.

Final exported sheets are `tmp/top-cities/shots/mucem/mucem-glb-{near,far}-{light,dark}-sheet.jpg`, with overview, exposed glazing facade, opposite facade, roof, street, close lattice detail and bridge. The comparison sheet `mucem-reference-and-exports.jpg` places the dossier photos beside all four exported sheets. The normal/metric audit is `tmp/top-cities/mucem/qa-metrics.json`. Inspection cameras and catalog URLs are registered.

Focused tests pin actual bounds, core width, open screen apertures, tower tips, provider-envelope containment, 115 m deck length and roof/bearing contacts. A deliberately shortened bridge end fails the same named-bearing check. The bridge underside is raycast as a closed surface. Near/far scene metrics come from the exported default scene, not the source triangle estimate.

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. Lead/reviewer must still capture unobstructed app frames, validate provider replacement and shared runtime shading, and sample each fort terrace/pad edge against the DEM; asset readiness does not establish those checks.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 50050 | 7 | 2088136 | 2039.2 |
| far | 11460 | 7 | 471844 | 460.8 |

Final checks (2026-10-13): exact requested two-file test command passed **608/608**, including all three MuCEM conformance checks and five landmark tests; final landmark-only run also passed. The earlier shared run failed only Washington National Cathedral's near source/GLB bounds while its builder was working; the repeat passed. Catalog validation passed (336 records, 616 variants). Depth-table check passed with zero cycles. Metric audit: no issues, zero coplanar overlaps, zero layered faces and 0% back-face rays. Named-support tests cover trough parapets, ramp slab terminals and all canopy-beam corner terminals, with deliberate free-end negative cases. No shared runtime/source edits were needed; only the explicitly permitted generated depth table was regenerated.

## Independent review b9a correction — 2026-10-13

Far sparse cage → denser broad planar webs, with shared normals/vertices saving bytes; harbour slab and generic upper windows → true 0.7 m arched recesses at two rampart levels and in the harbour-facing upper wings, plus a flat stone parapet on the southern court wing. The keep coping now shares stone with its support to remove the far material cycle.

Fresh exported near/far light sheets inspected at `tmp/top-cities/shots/mucem/review-fix/mucem-glb-{near,far}-light-sheet.jpg`; far dark at `mucem-glb-far-dark-sheet.jpg` in the same folder. Harbour-specific exported views in `review-fix/fort/mucem-glb-near-light-sheet.jpg` show the recessed masonry arches and differentiated parapet; `harbour` and `fort-detail` are registered cameras. Named geometry tests cover the review defects in both LODs, including free-end negative cases. Depth generation/check reports zero material cycles. Current exports still await lead app recapture and independent re-review in Cityscape and Full 3D world; previous b9 captures establish only the earlier reviewed appearance.

Validation after review fixes: all **11/11 landmark tests** and **6/6 scoped registry conformance checks** pass; the required combined registry run passed **628/629**, failing only Washington National Cathedral’s unrelated far byte cap. ID-scoped QA metrics report no issues or layered faces, and depth generation/check has zero dropped cycle edges. Shared catalog validation and local preview were attempted repeatedly but remain blocked by missing `docs/3d-top-cities-ut-tower.md`, owned by another builder; no unrelated files were changed.
