# Knight Street Bridge

Original procedural model of the current 1974 Vancouver–Mitchell Island–Richmond crossing of the North Arm Fraser River. Two independent parallel concrete structures, a short six-lane north crossing, a longer four-lane south crossing, deep cantilever haunches, repeated rectangular piers and the south-span hump establish its identity. The Marine Drive overpass north of the crossing and detached interchange loops remain provider roads.

The dispatch described a steel box-girder main span. The [Transportation Safety Board marine investigation M00W0005](https://www.bst.gc.ca/eng/rapports-reports/marine/2000/m00w0005/m00w0005.html) instead describes parallel concrete cantilevers joined by arched post-tensioned concrete drop-in girders; that sourced identity is modeled. The TSB search-index extract was available, but its live page returned 403. [TransLink](https://www.translink.ca/plans-and-projects/projects/maintenance-and-upgrade-program/bridge-projects) confirms the 1974 opening and approximately 1.4 km crossing. The [Wikipedia history](https://en.wikipedia.org/wiki/Knight_Street_Bridge) supplies the 238/1198 m component lengths and 109.7 m principal span; these are secondary-source values, not survey measurements. [Structurae](https://structurae.net/en/structures/knight-street-bridge) independently identifies prestressed concrete and balanced cantilever construction.

## References and dimensions

The October 2026 lead dossier supplied the OSM extract, facts, reference sheet and three distinct photographs. Licences were checked on the Commons pages: [Knight Street Bridge](https://commons.wikimedia.org/wiki/File:Knight_Street_Bridge.jpg), Fujitariuji, CC BY 2.0; [Knight St Bridge and Fraser River, Richmond](https://commons.wikimedia.org/wiki/File:Knight_St_Bridge_and_Fraser_River,_Richmond_(504727)_(23985428530).jpg), Robert Linsdell, CC BY 2.0; [Knight Street at Exit for Mitchell Island](https://commons.wikimedia.org/wiki/File:Knight_Street_at_Exit_for_Mitchell_Island_(50736994048).jpg), formulanone, CC BY-SA 2.0. The [Richmond News pier-repair photograph](https://www.richmond-news.com/local-news/work-on-knight-street-bridge-in-richmond-below-deck-as-well-7319230) provides an underside view of stringers, rectangular piers and the narrow cap; it is a copyright reference held only in ignored scratch, never redistributed or used as a texture. A Structurae side photograph request returned a challenge page and was not usable; no substitute image was inferred from it.

| Quantity | Model | Basis |
| --- | --- | --- |
| Opening / structural material | 1974 / prestressed concrete | TransLink / TSB and Structurae |
| North / south structural station extents | 238 / 1198 m | Published secondary source; endpoint station limits, not a rescaling of OSM |
| Main pier separation | 109.7 m | Published secondary source; actual geometry separation measured in tests |
| Main south girder crown soffit | 23.3 m | TSB clearance above local low water; visual datum approximation |
| South road crown | 25.5 m | Estimated 2.2 m girder/slab depth above soffit |
| North road crown / island mainline | 15 / 10 m | Estimated flat-map profile; not an engineering elevation survey |
| Approach-inclusive geographic alignment | 1885.456 m | Averaged mapped carriageways; includes island connection and landing extensions |
| South / north total width | 23 / 32 m | Estimated aerial proportions calibrated to mapped carriageway separation; not a published deck width |
| South / north carriageway width, each | 8.45 / 12.95 m | Two / three lanes plus shoulders; lane count sourced, stripe placement estimated |
| Outer walks, shoulders and barriers | 2.5 m per side | Visual estimate within overall width |
| Central gap | 1.1 m | Visual estimate; retained as actual negative space |
| Girder depth at crown / main pier | 2.2 / 5.4 m | Estimated concrete cantilever haunch profile |
| Typical pier pitch / shaft | 45 m / 2.4 × 3.8 m | Estimated, with no intermediate pier in either 109.7 m principal channel |
| Cap / footing | 9.7 × 3.2 × 0.7 m / 6.2 × 4 × 0.7 m, top −0.2 m | Estimated; shallow footing block embeds below grade; piles and temporary repair scaffolding omitted |
| Lamp / highest point | 8.85 m above deck / 34.44 m | Estimated representative curved-arm fitting |
| Landing width taper | First and last 75 m | Map connection convention; elevated spans retain authored widths |
| Maximum flat grade | 7.862% | Measured profile derivative; constant grades with 20 m parabolic vertical curves |
| North rise / south rise / south descent | 210.800 / 356.953 / 830.463 m | Profile lengths; north rise excludes first 20 m level landing |

Deck widths are estimates based on the dossier aerial and the separated OSM roadway axes; no survey-grade orthophoto was available. Main pier stations are estimated around the mapped south-channel centre at latitude 49.201973, and around the centre of the published north component. Other piers use representative rhythm, not an as-built schedule. The model does not claim exact seismic retrofit details, electrical heating hardware, signage, utility pipe diameters or submerged piles.

## Geographic, surface and terrain contract

Anchor `[-123.07752,49.20408]`, real metres east/up/south. Rotation is baked from the averaged east and west carriageway polylines; no runtime rotation or Mercator scale is baked into the GLBs. The attributed `knight-street-bridge-alignment.js` retains the selected October 2026 OSM ways. `knight-street-bridge-profile.js` owns one station/lateral/height frame for geometry, roadway replacement and navigation. The structural north/south station ranges exclude the intermediate island link; the exported asset also includes connections beyond those ranges.

`FOOTPRINTS=[]` and `footprintless:true` are deliberate: the model replaces road structure, not surrounding buildings. The source lists every selected roadway way. A focused shared-helper building query failed at the Overpass endpoint; supplied extract and inspected app views show no provider building block intersecting the authored piers. No neighbouring industrial buildings are masked, and no broad rectangle is used as a building replacement mask.

The local `layer.js` wraps `createRegistryBridgeLayer(PROFILE,PALETTES)`. Main river spans preserve their authored width even if an HD sample is incomplete. Only the first and last 75 m fit connected road envelopes. Pavement, walks, parapets and median taper together; raised offsets disappear at the nose, and rails terminate on named posts 20 m inside the connection. The standard-road provider uses zoom-dependent width and theme colours; local layer code shares those values with the height envelope. No shared bridge module extension was needed.

`terrainPolicy:'absolute-deck'` avoids a terrain-flattening corridor across the river and island. Reusable y=0 is a flat-map/visual water datum; runtime feet sample their local DEM, shafts carry interpolated `bridgeLift`, and deck/beam attachments stay with the fitted surface. Existing lateral terrain clamping keeps approach vertices 15 cm above the sampled surface where the DEM overtops the authored profile; ramp pavement also uses finer 2 m near / 6 m far samples, walks 4 / 8 m, to avoid terrain crossing between mesh samples. This small world-only offset is included in live height readings. Flat-mode lamps, rails, walks, beams, caps and ground attachments are tested independently of terrain fitting.

## Geometry and verification

The model uses merged named materials in three near chunks, one far chunk. Each carriageway has its own capped slab and haunched concrete girder, approach stringer ribs and capped abutment. Both LODs retain the open median, main-span profile, all principal piers, raised walks, handrails and representative lamp silhouette; far thins rail posts and lamps, and drops lane paint and separate luminous lamp-head material. Near paint is 12 cm proud. The western main span retains a representative maintenance-walk strip on named bearing seats, following the TSB description without attempting a detailed utility inventory.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 65,348 | 18 | 2,378,912 | 2,323.2 |
| Far | 27,644 | 4 | 879,292 | 858.7 |

Both are texture-free GLB 2.0, with normals, stable semantic materials and bridge attachment weights. Budgets are 120k/40/4.5 MB near and 30k/10/1.2 MB far. Far keeps the full structural envelope and contacts; it is heavier than a generic far proxy because the long curved ribbons and rails remain sampled at 20 m. Hardware timing has not been measured.

Authoring-only ledgers identify actual merged triangle ranges by named support. Tests measure every handrail, rail post, walkway, girder, cap and lamp terminal against its own named host, excluding the member; a deliberately shortened pole fails contact. Embedded pier feet and cap/soffit contact, both travel headings, crossing/off-road rejection, all in-range mapped vertices, rigid river width, landing width/theme fitting and repeatable terrain→flat restoration are covered. Zero-area faces at fully collapsed landing edges are excluded from point-to-triangle distance calculations; their geometry is the deliberate ground-level end of tapering ribbons.

Visual inspection used `tmp/top-cities/shots/knight-street-bridge/export/` for complete near-light and far-dark front/back/top/deck/detail views; the closer `export-close/` captures expose the main-span haunch and piers in near/far, light/dark. `export-reference-sheet.jpg` places all four exported main-span variants beside the aerial and underside references, and was inspected. The initial general cameras made the very long bridge too small for structural judgement; the `main-span`, underside and detail views were tightened, with geometry unchanged. `source/knight-street-bridge-procedural-near-light-sheet.jpg` provides the matching source comparison. No visible hole, detached member or inverted face was observed in these views.

QA metrics `tmp/top-cities/knight-street-bridge/final-metrics.json` report no layered faces, coplanar overlaps, back-face hits or member-end flags. Depth generation/check passes with zero dropped cycle edges. Focused registry plus landmark tests passed 603/603; the landmark-only cases pass in under 3 seconds when app capture processes are idle. Catalog validation, `pnpm assets:check`, `pnpm assets:preview` and the renderer bundle build pass.

## Application evidence

Standard Protomaps/OSM roads use `tiles.codriver.io`; world uses Terrarium 256 px tiles, maximum zoom 15. The supplied app-shot QA harness was used without changing product gates. Far/near/street images and reports are under `tmp/top-cities/shots/knight-street-bridge/{cityscape,world}/`; both modes load the landmark and show the shared unlit/vertex-shaded rendering path. The app overview/near/street sheet was inspected, including the open navigation channel and absence of a doubled generic deck.

The first world approach screenshots revealed tan footing blocks intersecting the clamped road where Terrarium contains elevated roadway heights. Footing tops now sit 20 cm below sampled grade (bottom −0.9 m), and shafts continue down to them; the bodies stay buried even when terrain reaches the bridge deck. This changed both LODs, was re-exported and retested, and is rechecked in the final approach captures below. A second inspection identified white terrain patches through the north pavement; finer approach sampling and the existing 15 cm terrain-clearance option correct that overlap without changing flat-mode joins. Final evidence replaces the earlier diagnostic screenshots. HD pavement/lane paint is not tested: the local lane endpoint returns 503 without Redis. Background account APIs also produce local CORS/authorization errors; the bridge GLBs and regular map tiles load.

Final correction evidence is under `tmp/top-cities/shots/knight-street-bridge/final/`: four GLB theme/LOD sheets, `export-reference-sheet.jpg`, source comparison, and both app modes with all four landing directions plus far/near/street. The final north world reverse view was inspected at full resolution: the tan footing rectangles and white terrain patches are gone. A regression test places the bridge on a synthetic 20 m approach DEM and verifies buried footing vertices and the same 15 cm accepted pavement clearance in the live layer height API.

All 65 in-range mapped roadway vertices return a height in both aligned headings in both modes; perpendicular and off-road probes return null. Heights below are metres above the queried local ground at the two carriageway centres (east / west); both headings agree. At curved alignment vertices the projection produces a few millimetres of station difference.

| Sample | Cityscape | Full 3D world |
| --- | --- | --- |
| north-foot | 0.000 / 0.000 | 0.150 / 0.235 |
| north-ramp | 3.538 / 3.538 | 0.150 / 0.150 |
| north-bridge | 9.186 / 9.182 | 0.341 / 1.202 |
| island | 10.000 / 10.000 | 0.150 / 0.150 |
| south-start | 10.000 / 10.000 | 0.150 / 0.150 |
| main-north | 25.500 / 25.500 | 24.501 / 24.501 |
| midspan | 25.500 / 25.500 | 24.500 / 24.500 |
| main-south | 25.500 / 25.500 | 24.503 / 24.502 |
| south-ramp | 1.416 / 1.416 | 0.527 / 1.148 |
| south-foot | 0.000 / 0.000 | 0.150 / 0.793 |

World checks sampled 2,352 zero-weight foundation/shaft-bottom vertices: maximum residual against DEM plus each authored embedded offset is 0.000000952 m. Footing tops are deliberately 0.2 m below ground; this is a renderer attachment check, not a survey or a claim that the DEM is bare ground beneath elevated infrastructure. The 15 cm world clearance and sub-metre east/west nose residuals reflect the live sampled road/terrain datums. Parent-scale stretch is 1.530534085025, applied once; no regional flatten pad is installed.

| Case | Status / practical limit |
| --- | --- |
| Cityscape standard roads, near/far, both landings and headings | Verified locally; all four final landing images inspected |
| Full 3D world standard roads, near/far, both landings and headings | Verified locally with Terrarium; dense approach mesh and terrain-clearance correction inspected |
| Foundation terrain attachment and repeated flat/world restoration | Verified by live numeric probes and focused tests |
| Named structural contacts in both LODs | Verified against actual merged host triangles, shortened-end negative case included |
| Standard-road zoom widths and day/night pavement colour | Verified by local-layer tests |
| HD pavement/paint, dash phase, paint switches | Not tested: lane endpoint unavailable without Redis |
| Full route/car/traffic/camera driving session | Height API verified; complete session not tested |
| Late load/terrain, tile retirement, 2D/world switches, reanchor | Shared mechanisms retained; complete app matrix not tested |
| App night and Tesla MCU2/MCU3 hardware performance | Not tested / not measured |
| Independent release review | Required from coordinator before publication |
