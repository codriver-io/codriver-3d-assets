# Tower of London — original procedural exterior

Contemporary Tower of London, London, United Kingdom: the White Tower inside the two defensive rings, Waterloo Barracks, the chapel, secondary ranges, mural towers, St Thomas’s Tower / Traitors’ Gate and dry moat grass strips. This is an original texture-free architectural approximation, not a scan or photographic mesh. Source lives in `src/peregrine/landmarks/top-cities/tower-of-london/`; `SPEC.ready = true` describes the exported asset.

## Sources and provenance

- [Historic England, monument 1002061](https://historicengland.org.uk/listing/the-list/list-entry/1002061?section=official-list-entry): published keep dimensions, ragstone rubble and Portland stone dressings, lead roofs, cylindrical northeast stair turret, southeast chapel apse, arched windows and defensive rings.
- [Historic Royal Palaces — White Tower](https://www.hrp.org.uk/tower-of-london/whats-on/white-tower/) and [visitor map](https://www.hrp.org.uk/media/3394/tower-visitor-map.pdf): identity and the relationship of the wards and watergate. The map is reference only.
- [White Tower architecture](https://en.wikipedia.org/wiki/White_Tower_(Tower_of_London)): southern battlements at 27 m above the lower southern ground.
- [White Tower photograph](https://commons.wikimedia.org/wiki/File:White_Tower,_City_of_London.jpg) and [Waterloo Barracks photograph](https://commons.wikimedia.org/wiki/File:Waterloo_Barracks.jpg), Tristan Surtel, CC BY-SA 4.0; [ward panorama](https://commons.wikimedia.org/wiki/File:Panoramic_view_from_Tower_of_London_cropped.jpg), MatthiasKabel / Nev1, CC BY-SA 3.0. Viewed dossier photos 1, 4 and 5; photos 2, 3 and 6 were unrelated and were not used.
- [OSM White Tower way 369135772](https://www.openstreetmap.org/way/369135772), associated body/roof/turret/stair parts, and complete castle building outlines from the shared Overpass helper. Dossier `osm.json` plus the single expanded `site-osm.json` are retained under ignored `tmp/top-cities/tower-of-london/`. All modeled/replaced way IDs are recorded in `footprint.js`; geographic data © OpenStreetMap contributors, ODbL 1.0.

Authored by Codriver on 2026-10-12. Photographs, the map, and all downloaded reference data remain in ignored scratch. No image, texture, third-party mesh or restricted capture is exported. Model/code attribution and independent geographic rights are in the manifest and catalog.

## Geographic frame and dimensions

Origin `[-0.07611, 51.50806]`; real metres, +X east, +Y up, +Z south. Local y=0 is the rigid castle foundation datum. Rotation is already carried by the mapped rings, with no additional host rotation. The White Tower’s west edge uses controls `[-0.076338,51.5079327]` and `[-0.0762827,51.5082493]`, giving a 6.2° northward bearing and a south frontage of about 186°. The southeast apse and northeast turret retain their mapped curved outlines.

| Feature | Model / published size | Basis |
| --- | --- | --- |
| White Tower rectangular keep | published 36 × 32.5 m | Historic England; excludes projecting apse and turrets |
| Main mapped body, excluding apse | approximately 35.9 × 30.5 m | OSM controls; horizontal fit approximately 1.00 / 0.94 relative to published dimensions, independent of height |
| Southern battlements | 27 m | Published height; solid parapet 25.5 m and merlons 1.5 m |
| Three square turret shafts / caps / pole tips | 30.4 / 32 / 34.2 m | Photograph proportions and OSM part tags; estimated, not survey heights |
| Round northeast turret | shaft 31 m, dome 33.5 m, pole tip 35 m | OSM `height=35` and photo proportions; modeled tip is estimated |
| Waterloo Barracks | wall 14 m, ridge 18 m, corner towers 20 m | OSM building-part height tags, mapper estimates |
| Inner wall / outer wall | typically 3–6 / 6.3 m, plus merlons | OSM tags and visual estimates; local grade removes real terrain differences |
| Mural towers | usually 12 m; Lanthorne 18 m, Byward 13 m | Tags where supplied, otherwise visual estimates |
| Dry moat | three low grass strips at y=0.025 | Schematic plan estimate; trench depth is not baked into the reusable mesh |

Every provider outline and associated part beneath the model is owned, including the White Tower roofs, cupolas, wooden stair, barracks towers, Byward Tower, Legge’s Mount and Brass Mount. Sub-4 m² parts use their parent replacement rings. Legacy outline ways 369135041 and 369143430 overlap the later house outlines; both remain owned but their duplicate volumes are omitted from geometry. The moat grass strips are ground surfaces, not building replacement masks.

`terrainPad` proposes the mapped building rings, White Tower outline as the median datum reference and 8 m feathering. This is placement metadata, not proof of DEM contact; the moat floor, terraces, surrounding terrain lattice, provider replacement and approaches need separate in-app validation. No altitude or Mercator stretch is baked.

## Geometry and LOD decisions

The White Tower is a mapped polygon with its southeast apse, four independent turret shafts, three square lead roof caps, a rounded northeast dome and supported weather poles. Window faces are cut out of the facade. Near uses curved stone bevels and recessed glazing; far uses separate coarse openings with flush, disjoint glass faces. There are three main window registers in both LODs, and five turret registers. Near adds shallow pilaster buttresses. Fine rubble texture, the exact grouped upper gallery windows, sculptural weather-vane silhouettes and stair cross-bracing are simplified.

The court remains open. Curtains and D-shaped mural towers follow OSM outlines; Waterloo’s long roof and four front towers preserve the secondary skyline. Secondary roofs are clipped planar gables; they are triangulated at their mapped ridges rather than represented by loose floating boxes. The watergate has a genuine nine-metre arched opening, inset gate uprights and closed side/rear walls. Timber stair treads contact two continuous sloping stringers, with the lowest tread at grade and both stringer heads embedded in the extended first-floor landing.

Far reduces secondary facade bays, curve segments and battlement repetition. White Tower merlon width is retained and its repetition density is half near; distant curtains retain outward battlements and omit duplicate inward ones. The important bounds, four capped turrets, apse, watergate and separate window rows remain. Far remains comparatively detailed because the full fortress is modeled.

Eight named materials in both palettes: `pale`, `stone`, `trim`, `lead`, `glass`, `timber`, `brick`, `grass`. Muted ragstone, cream stone dressing, charcoal lead and dark glazing are calibrated against the supplied photos. The dark palette dims all materials; nighttime floodlight photometry and internal light distribution are not reconstructed.

## Measured export costs

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 48,888 | 8 | 2,251,540 | 2198.8 |
| Far | 10,139 | 8 | 466,204 | 455.3 |

Measured from exported default scenes. Building caps are 60,000 / 14 / 2,500,000 bytes near and 12,000 / 8 / 500,000 far. Exports are self-contained uncompressed GLB 2.0 with normals and no texture, decoder or `bridgeLift`. Both LODs have bounds approximately 292 × 35 × 249.7 m including the schematic moat ground strips; source and exported bounds match.

## Verification evidence and changes

Ignored screenshots under `tmp/top-cities/shots/tower-of-london/`:

- `tower-of-london-glb-{near,far}-light-sheet.jpg`: overview, main facade / stair, north / back, roof plan, White Tower detail and watergate.
- `tower-of-london-glb-{near,far}-dark-sheet.jpg`: overview and White Tower detail.
- `tower-of-london-final-reference-sheet.jpg`: exported near/far, both themes, front/back/above/detail/gate beside dossier reference photographs 1, 4 and 5. Viewed directly after export.

The first comparison exposed an oversized solid timber staircase and a blank watergate caused by a split collinear frontage edge. The stair now has open supported treads and a landing, and merged frontage segments allow the true arched portal. Budget analysis removed hidden duplicate parapet volumes; deterministic QA identified and removed the two overlapping legacy house volumes and the coplanar pale cap under the Waterloo gateway roof. The second comparison identified oversized far White Tower merlons; their width and density were corrected, and outward-only distant curtain crenellation recovered the byte budget. Final evidence was refreshed after that correction.

Seven landmark tests pass in under one second: dimensions/bearing and grade, four lead caps/finials, three window registers, actual watergate opening, open court, footprint containment/provider ownership, and landing-to-post contact with a deliberately shortened negative control. All three Tower of London registry conformance checks pass. Deterministic exported QA is clean: no material cycles, no flagged coplanar/layered faces, 0% back-face sweep hits, no window-rhythm or member-end flags. Depth-layer generation and `--check` pass for this ID.

The complete requested two-file test run encountered only unrelated in-progress `palacio-de-cibeles`, `edificio-metropolis` and `high-museum-of-art` failures in its recorded run; see `tmp/top-cities/tower-of-london/conformance.log`. Catalog validation passed once during the build, but later global checks encountered the other builder’s missing `docs/3d-top-cities-edificio-metropolis.md`, and the final catalog check / preview attempt were blocked by an unregistered `high-museum-of-art-far.glb`. Tower of London’s own record loads through the QA fallback. No shared file required a manual change; only the permitted generated depth table was regenerated.

## Integration handoff

| Mode / case | Status | Evidence or remaining work |
| --- | --- | --- |
| Exported source/GLB, near/far, light/dark | verified | Contact sheets, focused tests and deterministic QA above |
| Cityscape in-app | not tested | Coordinator builds app and captures unobstructed views |
| Full 3D world / terrain | not tested | Coordinator validates rigid datum, moat elevation, DEM/terrace contacts, feathering and entrances |
| Provider replacement / load fallback / lifecycle | not tested | Needs app captures and failure, mode, region, reanchor and terrain-arrival checks |
| Driving and real hardware performance | not tested | Asset metrics do not establish device performance |

No server, bundle build, online deployment or git mutation was performed by this worker.

## Independent-review corrections, 2026-10-12

Review fix: two continuous sloping timber stringers support every tread in both LODs; lowest tread underside is y=0, heads embed in the extended first-floor landing. Named-support raycasts include a failing unsupported-tread control. Far retains ten open treads. Stair profile and landing extent are estimates fitted within mapped stair ownership; revised app captures remain with the lead.

Judged exported near/far light/dark sheets under `tmp/top-cities/shots/tower-of-london/review-fix1/`; near sheets include facade/detail and the initial round includes roof/opposite or rear views. Museum and statue changes passed after one look round; Fountain Place needed a second round because matching colours alone still left bright unshaded daytime patches. Exported QA reports no material cycles, layered/coplanar flags, back-face hits or unsupported-member flags for these three assets. The 28 focused landmark tests and all 475 registry conformance tests pass; catalog validation and assets:check pass (286 entries / 560 variants), and assets:preview generated the local catalog. Updated app Cityscape and Full 3D world captures (2026-10-12) were visually verified and passed independent re-review; these exported sheets alone do not certify terrain placement.
