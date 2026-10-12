# Alex Fraser Bridge

Original procedural model of the 1986 Alex Fraser (Annacis) Bridge, Highway 91 over the South Arm Fraser River, between Annacis Island and North Delta, British Columbia. The current seven-lane roadway is shown in one static three-northbound/four-southbound reversible-median configuration. Two open concrete H towers, parallel stay planes, modified fan stays and the slender composite deck are the identifying features. No demolished predecessor or unrelated approach interchange is included.

## Sources and dimensions

The supplied dossier was the starting point: `osm.txt`, `osm.json`, `facts.txt` and `refs-sheet.jpg` in the lead tree, dated October 2026. [ETH Zürich, Chair of Concrete Structures and Bridge Design, bridge-design lecture p39](https://concrete.ethz.ch/assets/brd/autographies/cable-supported-bridges-part-2-cable-stayed-bridges-2024-02-13_notes_inv.pdf) confirms the primary dimensions below; the PDF was downloaded and its text inspected. [Wikipedia](https://en.wikipedia.org/wiki/Alex_Fraser_Bridge) establishes the current seven-lane configuration, two cycle/pedestrian walks and the 1986 opening. The [mapped deck outline](https://www.openstreetmap.org/way/820900975) and two carriageways supply geographic alignment, rather than treating the OSM `bridge:structure=suspension` tag as a structural classification.

| Quantity | Model | Basis |
| --- | --- | --- |
| Main tower separation | 465 m | Published (ETH); actual modeled separation tested |
| Tower crown | 154 m above local pile-cap/water grade | Published (ETH); below-ground piles omitted |
| Overall approach-inclusive alignment | 2520.330 m | OSM derived; published overall length 2525 m |
| Total deck width | 32 m | Published (ETH), checked against mapped straight deck outline |
| Girder soffit / deck top | 57 / 60 m | Published clearance / estimated 3 m composite section |
| Side stay spans | 182.75 m each | Visual/secondary-source estimate, not surveyed |
| Upper / lower H beams | 96 / 49 m | Estimated from Joe Mabel tower photograph |
| Upper shaft width / depth | 4.4 / 4.2 m | Visual estimate; constant upper cross-section |
| Leg lateral centres | ±19 m at grade → ±16 m at road | Visual estimate of outward lower legs |
| Stay count | 144 near, 80 far | Representative geometry, not an as-built cable schedule |
| Raised paths | 3.55 / 3.45 m including shoulders/barriers | Estimated within the sourced 32 m overall width |
| Driving lanes | Seven nominal 3.45 m lanes | Estimated stripe positions; current total lane count sourced |
| Flat landing lengths | 50 m each | Map convention |
| North / south ramp length | 768.277 / 821.553 m | Derived; peak grades 8.239% / 7.677%, 40 m vertical curves |

Visual references inspected: [Alex Fraser Bridge](https://commons.wikimedia.org/wiki/File:Alex_Fraser_Bridge.jpg), Euan Forrester, CC BY-SA 2.0 (aerial dossier); [Alex Fraser Bridge 01](https://commons.wikimedia.org/wiki/File:Alex_Fraser_Bridge_01.jpg), Joe Mabel, CC BY-SA 3.0 (side elevation); [Alex Fraser Bridge 05](https://commons.wikimedia.org/wiki/File:Alex_Fraser_Bridge_05.jpg), Joe Mabel, CC BY-SA 3.0 (H-frame detail). Commons licence pages were checked. Only these two additional photos were fetched. Photographs stay in ignored scratch and are neither traced meshes nor exported textures.

## Geographic and surface contract

Anchor `[-122.943,49.1598]`; units are real metres, +X east, +Y up, +Z south. Rotation is baked from the averaged mapped northbound and southbound carriageways. Straight-span bearing 164.89°; the curved north landing has bearing 134.25°. Mercator stretch 1.5291652307008332 is applied once by the runtime. `alex-fraser-bridge-alignment.js` retains attributed mapped coordinates and road ownership; `alex-fraser-bridge-profile.js` shares station, lateral offset and deck height between the source, replacement pavement and navigation APIs.

OSM roadway ways: 25005852, 25005853, 25005363, 327505388, 327505391, 156897051 and 700396911. Outline 820900975 and cycleways 73147112 / 413747837 are provenance references. A shared-helper building query around both towers returned only neighbouring industrial/pub buildings; none overlaps the modeled supports. `FOOTPRINTS=[]` and `footprintless:true` are deliberate; the road layer owns the corridor, and no neighbouring building is removed. The complete bridge outline includes portions of interchange ramps outside this mainline model and is not used as a blanket mask.

Local y=0 represents the flat-map/water/pile-cap visual datum. There are no baked DEM heights or submerged piles. `terrainPolicy:'absolute-deck'` preserves the 60 m road and 154 m crowns in world mode, moves footing vertices to their local DEM and fits ramps. Existing optional `lateralBankFit:{terrainClamp:true,clearanceM:0}` prevents wide approach vertices from entering terrain. `fittedLateral` is identity outside the first and last 100 m: fragmentary HD samples cannot squeeze the rigid 32 m deck. The low approach noses alone fit the connected road envelopes. No shared bridge source extension was needed.

## Landing correction after review b4b

The reviewer rated recognisability 5/5 but found broad square landing slabs against narrower provider carriageways in both modes. The first and last **100 m** now use a smooth taper to the two mapped carriageway centres. Published main span, towers, attached stay fans, seven lanes and the elevated 32 m structure are unchanged. The slab and girders start beyond the taper, so no load-bearing main structure is squeezed.

Authored pavement, side paths and parapets share the taper. Walk width and raised offsets reduce to zero at each road connection; handrails end on named posts 20 m inside each landing. The median narrows to a point at grade instead of expanding across the provider separator. Both LODs use the same landing curve. `roadEdges` and `bridgeRoadHeight` share the fitted envelope, rejecting the former wide shoulder. Runtime fits begin from immutable authored positions, with navigation surface invalidation on accepted width changes.

The landmark-local layer uses the existing standard-road width calculation at the current zoom and the provider's theme colours. Pavement blends from standard road colour at the nose to bridge pavement over the taper; HD mode retains the factory's measured joins. This follows the Fred Hartman/Pitt River landing approach without changing shared renderer files. Fallback lane paint starts beyond the taper, is 12 cm proud near and is omitted far. The far model retains the seven-lane envelope, H openings/crossbeams, 80 attached stays, main supports, three longitudinal girders, paths and rails.

## Export and validation

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| Near | 71,242 / 28 / 2,782,808 (2717.6 KiB) | 70,516 / 28 / 2,768,088 (2703.2 KiB) |
| Far | 27,956 / 7 / 784,000 (765.6 KiB) | 26,996 / 6 / 761,744 (743.9 KiB) |

Exports are self-contained, texture-free and retain the metric frame, normals and bridge attachment weights. Both remain within 120k/40/4.5 MB near and 30k/10/1.2 MB far. The final exported near/far contact sheets preserve the tower and fan identity and show both tapered noses: `tmp/top-cities/shots/alex-fraser-bridge/review-fix/final/exports/`. Two visual correction rounds were used; the second resolved an overly broad flat median patch discovered in the first app capture.

Actual merged triangle ranges identify named supports through an authoring-only WeakMap ledger. Tests measure stays, floorbeams, girders, handrails and lamps against their own named hosts, excluding the member itself; a deliberately shortened stay fails. Added checks cover mapped carriageway pavement, ground-level connection vertices, fitted height ownership, repeated fits, all vertices outside the taper remaining rigid, standard-road zoom widths and day/night pavement colours.

Focused landmark and registry tests: **411 passed, 0 failed**. `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and depth-table generation/check pass. Final QA metrics report no layered faces, coplanar overlaps, back-face hits or member-end flags; depth generation drops zero cycle edges. Durable metrics: `tmp/top-cities/alex-fraser-bridge/review-fix-final-metrics.json`. Generated app bundles and the shared depth table are excluded from the landmark commit.

## App integration evidence

No product gate changed. Final evidence is under `tmp/top-cities/shots/alex-fraser-bridge/review-fix/final/{cityscape,world}/`: far/near/street bridge views plus `north-forward.png`, `north-reverse.png`, `south-forward.png` and `south-reverse.png`. Each report records the actual landmark layer state and checks all 46 mapped road vertices in both headings at every camera, including the zoom-dependent fitted noses.

Both modes show continuous road width and material transitions at both ends in both directions. The square slab noses are gone. Height probes remain independent of screenshots: `tmp/top-cities/alex-fraser-bridge/review-fix-final-height-{cityscape,world}.json`. Parent group y=0 in both modes; the absolute road datum remains 60 m. All 46 in-range mapped roadway vertices are owned in both headings; off-road and perpendicular samples return null.

Live `heightAt` numbers below are metres above queried ground at lateral −8 / +8 m, sampled with the whole bridge resident. Both aligned headings agree. World's absolute deck is reported relative to its local DEM.

| Sample | Cityscape | Full 3D world |
| --- | --- | --- |
| north-foot | 0 / 0 | 0.000 / 0.348 |
| north-landing | 0 / 0 | 6.040 / 5.914 |
| north-cable-end | 60 / 60 | 51.665 / 51.779 |
| north-tower | 60 / 60 | 51.220 / 51.713 |
| midspan | 60 / 60 | 55.781 / 55.781 |
| south-tower | 60 / 60 | 53.655 / 54.300 |
| south-cable-end | 60 / 60 | 48.219 / 48.898 |
| south-landing | 0 / 0 | 5.558 / 5.491 |
| south-foot | 0 / 0 | 0.000 / 0.487 |

All **1,072** zero-weight footing vertices meet the sampled world DEM within ±0.000001 m. This is a renderer contact check, not a survey. The pre-existing +8 m transverse height residual at the feet remains +0.348 m north / +0.487 m south: centreline bank fitting can leave a sub-metre offset above lower lateral terrain. At 50 m the ramp is already 5.5–6.0 m above local terrain; those are viaduct landings. The landing width/material correction does not change the accepted elevation profile.

| Case | Status / practical limit |
| --- | --- |
| Cityscape near/far, both approaches and both directions | Verified locally with standard roads |
| Full 3D world near/far, both approaches and both directions | Verified locally with Terrarium; transverse foot residual disclosed |
| Per-footing DEM contacts | Verified at all 1,072 sampled foundation vertices |
| Structural contacts, rigid main structure, repeated fits/restoration | Verified by focused tests in both LODs |
| Provider zoom width, light/dark landing material | Verified by focused observable layer tests |
| HD pavement/lane paint, dash phase, paint on/off | Not tested: local `/osm-lanes` unavailable (503 without Redis) |
| Car/camera common height API | Live API verified; full navigation session not tested |
| Load failure/late terrain, 2D/world switches, tile retirement, reanchor | Shared mechanisms retained; full app matrix not tested |
| Real app night / MCU2 or MCU3 performance | Not tested / not measured |
| Independent re-review | Required before publication |

Servers are stopped by their recorded PIDs after final captures. Delivery contains only this landmark's source, catalog fragment, documentation and three exports; local inspection pages, photographs, app bundles and shared generated depth data remain outside the commit.
