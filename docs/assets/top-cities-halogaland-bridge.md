# Hålogaland Bridge, Narvik

Original texture-free procedural model of the current E6 Hålogalandsbrua / Holgolátrovvi, opened 9 December 2018, crossing Rombaksfjorden. No third-party geometry or photo textures. Sources are [Statens vegvesen technical data](https://www.vegvesen.no/vegprosjekter/fullfort/e6halogalandsbrua/english/technical-data/) and the [2018 opening notice](https://www.vegvesen.no/vegprosjekter/fullfort/e6halogalandsbrua/nyhetsarkiv/apnet-e6-halogalandsbrua/). Reference photos: TorbjørnS (2015, 2016, 2018, CC BY-SA 4.0) and Markus Trienke (2019, CC BY-SA 2.0), exact file-page links and attribution in the catalog record; photos remain in ignored scratch.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Main span | 1145 m | Road authority |
| Karistrand / Øyjord tower top | 179.1 / 173.5 m | Road authority elevations above sea level |
| Steel / concrete viaduct width | 18.6 / 15.4 m | Road authority |
| Roadway / main-span cycle path | 9.5 / 3.5 m | Road authority |
| Main cable diameter | 0.47 m | Road authority |
| Navigation clearance / girder underside | 40 m | Road authority; chosen local water datum |
| Road surface / box depth | 43 / 3 m | Estimated to give 40 m clearance |
| South / north concrete viaduct | 250 / 148 m | Road authority technical data |
| Total stated bridge length | 1533 m | Road authority; span subtotals add to 1543 m |
| Tower sections, head apertures, pier locations, cable sag, lamp spacing | estimated | Photographs; no engineering survey |

Frame is local metres, +X east, +Y up, +Z south, origin `[17.481766,68.4596989]` at the mean of mapped tower stations. Rotation is baked into geometry from E6 way 79877191. Mapped pylons are at the ends of its long straight segment and are 1143.18 m apart; each tower shifts only 0.91 m along the alignment to preserve the published span. Road ownership includes ways 79877190, 108549521, 108549522, 79877191 and 653915946. Dossier OSM geometry and a small north-bank OSM API extract are saved under `tmp/top-cities/halogaland-bridge/`. No building-tagged tower outline was present in the dossier, so FOOTPRINTS is empty; the man_made=bridge outline belongs to road ownership and is not a building mask.

The model preserves converging chamfered concrete legs, the very tall open tower portals, subdeck diagonal supports, joined upper shafts, perforated saddle-house crowns, two suspension cable planes, regular vertical hangers, the streamlined closed steel box, a separated western cycle path and curved southern approach. Concrete shore viaducts have five paired piers. The far model retains all major openings and cable silhouettes, reducing railing/hanger density and ribbon sampling; near geometry batches repeated members into three station chunks. Seven material names have matching light/dark palettes; lamps are self-lit at night. No bright invented tower illumination.

Local y=0 is Cityscape grade/water reference. The bridge has the shared `absolute-deck` terrain policy, no corridor pad flattening, and a Karistrandtunnelen interval so the road is not lifted onto the mountain. Tower foundations have graded attachment weights; heads, crowns, cables and girders remain rigid. The flat Cityscape profile climbs across 1103.31 m south and 718.82 m north, with peak smoothstep grades 5.846% and 8.973%. These long flat-map approach structures deliberately simplify rock cuts; world follows the actual DEM at supports and approach roads. Anchor sockets are estimated and the underground rock anchorage halls, detailed tunnel portals, individual cable wires and surveyed shore geology are omitted.

## Export costs and source verification

| LOD | Triangles | Draws | Bytes | KiB rounded |
| --- | ---: | ---: | ---: | ---: |
| Near | 64,760 | 16 | 3,205,740 | 3,131 |
| Far | 14,720 | 5 | 556,104 | 543 |

Both exports retain the bridgeLift attachment attribute and ordinary named, texture-free GLB materials. Near source/export bounds agree; far bounds differ by only 0.014 m on the western extent. Focused acceptance command (registry plus landmark test file): **216/216 pass**, including 12 landmark tests in about 0.4 s. Assertions observe asymmetric tower heights, 1145 m span, both open vehicle/tall portals, perforated crown apertures, cable saddles, steel box underside and road top, no channel piers, bounded attachment weights, corridor ownership and both travel directions. Catalog check passes: 198 entries / 346 GLB variants. `pnpm assets:preview` and `pnpm build:peregrine` succeed. Deterministic GLB QA (`tmp/top-cities/halogaland-bridge/qa-metrics.json`) is clean: zero coplanar overlaps, zero back-face hits on its 9-hit sweep, minimum Y -0.2 m; this sparse sweep is supplemented by underside raycasts and visual inspection.

Images actually read against the supplied reference sheet and the 2019 completed-bridge photo:
- `tmp/top-cities/shots/halogaland-bridge/initial/halogaland-bridge-procedural-near-light-sheet.jpg`: overview, opposite broadside, above, driver, tower, underside and approach.
- `tmp/top-cities/shots/halogaland-bridge/reference-export-comparison.jpg`: reference photos beside exported near/far light and dark models, opposite broadside, top, deck and underside.
- `tmp/top-cities/shots/halogaland-bridge/app-initial.jpg`, `app-approaches.jpg` and `app-final.jpg`: Cityscape / world near/far/street, plus both endpoint directions.

Changes prompted by verification: fixed reversed box-girder underside winding; moved the tower crossbeam below the pavement plane to remove an 81 m² coplanar overlap; moved the cycle path to mapped negative-lateral/west side; widened the tower inspection camera to include its crown and footing; reduced far ribbon sampling while retaining the tall portal, crown holes and cable curve. There were three geometry correction rounds. Tiny saddle-house apertures are simplified geometric rectangles; concrete casting seams and lamp details are approximate. No claim of independent review: the lead's reviewer still owns that gate.

## Cityscape — verified locally, standard roads

Slot A port 3270, Protomaps standard pavement, renderer build `8b24e7f0ee33` from the worker branch. `app-shot.mjs --ids halogaland-bridge --shots far,near,street` loads far/near LODs correctly; generic provider bridge surfaces are replaced. Both approach feet were captured in both directions using the shared app-shot helper and a scratch Playwright probe. No visible vertical step or longitudinal gap at the joins; fallback pavement/railings are wider and change colour at the join, so these are visible material/width seams, not surveyed cross sections. All 50 mapped alignment vertices return non-null `window.__map.landmarks.heightAt(lng,lat,heading)` for both travel headings (**100/100**), and null for crossing headings. A point 60 m beside midspan returns null. Endpoints return 0 m; both towers and midspan return 43 m. These queries verify the shared navigation contract, not an actual driven car/route session.

## Full 3D world — verified locally, basic placement and standard roads

Slot A terrain port 3272, AWS Terrarium 256-pixel DEM through the app's shared terrain sampler, absolute-deck policy. The layer is active and terrainReady in far/near/street and endpoint captures; no terrain corridor flattening is requested. Both endpoints return zero relative offset over the sampled ground, while midspan stays at 43 m above the water reference. The navigation API returns a deck offset relative to local ground; the absolute world deck equals that offset plus ground. Two travel headings at all 50 mapped vertices are owned (**100/100**); crossing and off-corridor points are rejected.

| Station | Cityscape heightAt | World ground (m) | World heightAt (m) | World deck (m) |
| --- | ---: | ---: | ---: | ---: |
| 0 south endpoint | 0 | 56.240 | 0 | 56.240 |
| 903.31 curved south approach | 39.273 | 14.481 | 29.666 | 44.147 |
| 1103.31 south tower | 43 | -0.024 | 43.024 | 43.000 |
| 1675.81 midspan | 43 | 0 | 43 | 43 |
| 2248.31 north tower | 43 | 0.585 | 42.415 | 43.000 |
| 2967.13 north endpoint | 0 | 57.685 | 0 | 57.685 |

Numbers are from the settled regional probe; endpoint captures at closer zoom had refined DEM values (south 57.313 m, north 58.910 m). This is resolution-dependent terrain, not baked source data. Full values and capture paths: `tmp/top-cities/shots/halogaland-bridge/{cityscape,world}-approaches/probe.json`. World screenshots retain the mountain shore slopes and show the extended road ramps following them. Supports meet locally sampled ground; foundation geometry is still a visual approximation, not bathymetry or an excavated-footing survey.

HD lane payloads were not available as usable live paint in this local session; fallback paint is visible. Local guest auth/CORS and entity endpoints emitted expected unrelated errors. Actual car/route/traffic/camera driving, HD on/off and dash continuity, late/missing/replaced terrain, mode-switch/reanchor/load-failure stress and Tesla device performance remain not tested. Basic local placement in both modes is verified; full integration is checked separately. No staging deployment or shared runtime source extension.

