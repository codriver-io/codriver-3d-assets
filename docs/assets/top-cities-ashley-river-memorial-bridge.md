# Ashley River Memorial Bridge — Charleston, South Carolina

Current 1926 southbound US 17 crossing, with its closed double-leaf bascule and four lantern-topped tender houses. The adjacent T. Allen Legare Bridge is a separate structure and is excluded.

## Sources and dimensions

The [City/SCDOT centennial announcement](https://www.charleston-sc.gov/m/NewsFlash/Home/Detail/1757) establishes the 1926 memorial structure; [SCDOT maintenance notice](https://www.scdot.org/inside/SCDOTPress/2023/Post3390.html) confirms the southbound crossing. No primary dimensional drawing was available during this build, so mapped horizontal measurements are distinguished from photo estimates; secondary 1733 ft / 101 ft leaf descriptions are not silently treated as surveys. The model uses the current mapped river crossing.

| Feature | Value | Basis |
| --- | ---: | --- |
| End-to-end deck | 528.10 m | Sourced, measured from OSM road endpoints |
| Width | 14.1 m including walks | Sourced, OSM outline, rounded |
| Alignment | bearing 61.396° eastward | Sourced, two mapped endpoint controls |
| Mapped movable roadway segment | 43.22 m | Sourced, way 480966843; not hinge-to-hinge structural span |
| Hinge/pier centres | local x −72.8 and −19.5 m, 53.3 m apart | Sourced positions from OSM bridge-outline projections; interpretation as hinge piers estimated |
| Approach pier stations | about 19–31 m spacing | Sourced, mapped outline projections |
| Deck height | 7 m at bascule, roughly 4.8 m at east end | Estimated from photographs; no tide/survey datum |
| Tender houses | 5.2 × 4.7 m, cornice 12.75 m, roof tip 17.9 m | Estimated from photographs |
| Lantern | eight columns, open 13.1–15.25 m | Estimated proportions; count from photographs |
| Highest mast | 19.9 m | Estimated |
| Arch soffits, pile jackets, railing and fender sections | Estimated | Simplified photo-derived construction |

Photographs, both **ProfReader, CC BY-SA 4.0**, file pages checked 2026-11-09: [Ashley River Memorial Bridge](https://commons.wikimedia.org/wiki/File:Ashley_River_Memorial_Bridge.jpg) and [Ashley River Memorial Bridge, Charleston, South Carolina](https://commons.wikimedia.org/wiki/File:Ashley_River_Memorial_Bridge,_Charleston,_South_Carolina.jpg). Their four Mediterranean Revival lantern houses, narrow bascule and concrete arches establish the correct 1926 structure. The temporary maintenance tarp in these 2015 photos is excluded. Local comparison images are not committed.

## Frame and foundations

Origin `[-79.96106825,32.7834928]`, local metres east/up/south. Controls `[-79.9635453,32.7823572]` and `[-79.9585912,32.7846284]`; rotation +0.499229901 radians baked once. `y=0` is the visual waterline. No terrain, tide elevation or Mercator scale is baked in. The approved structural span keeps this metric frame and vertical profile. Stage B below adds mapped approaches, attachment weights and the runtime navigation surface; no terrain values are baked into the exports.

[OSM outline 1499776962](https://www.openstreetmap.org/way/1499776962); roadway ways **117153920, 480966843, 480966842**; footway ways **489958699, 1499776963–1499776967**. `FOOTPRINTS` retains the detailed mapped bridge boundary including later pier projections. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). Host ownership must exclude Legare and its approaches. Concrete piers and fender piles reach y=0; the fitted approaches now connect the end decks to the mapped roads. Tender houses must stay rigid.

## Geometry and omissions

Both LODs retain open shallow arch soffits, four separately windowed tender houses, eight-column open lanterns and tapered pale roofs. Steel bascule leaves meet at the channel centre with a narrow seam; end bearings rest on the main pier blocks. Concrete pier jackets and extra piles describe the visible reinforced substructure. Far coarsens arches and balustrades while preserving each major pier and house.

No moving mechanisms, bascule animation, stairs, detailed electrical gear, coats of arms, text, adjacent bridge or roadway beyond the mapped structure. Original procedural geometry, no imported meshes or textures. Window holes are actual wall apertures with recessed dark panes; dark strips are not substituted for openings.

## Verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 23558 | 8 | 311980 |
| far | 13210 | 7 | 189260 |

Mechanical QA: no flags. Final structural review mirrored the closed bascule leaf taper at the opposing hinge; both halves retain full bearing contact. Exported near/far contact sheet inspected against both reference photographs: four lantern houses, shallow arches and the single bascule retained. One refinement removed hidden support/roof faces and stopped balustrades at house walls. Evidence: `tmp/landmark-qa/final/ashley-river-memorial-bridge.jpg`; metrics: `tmp/landmark-qa/ashley-river-memorial-bridge-metrics.json`. Padded camera bounds are used so the long bridge fits the oblique tiles.

Cityscape: **not tested**. Full 3D world: **not tested**. Human contributor/product permission remains a maintainer process; the agent accepted no legal terms.

## Codriver app port (2026-11-10)

Imported from public-library commit `4241517a4bec3ff9e0954b7c69e20fc09c9c7410`. Approved geometry, palettes, proportions and LOD are unchanged. The app and library `asset-geometry.js` are byte-identical, so no import/call adaptation was needed. The app exporter now preserves the public CC BY 4.0 / MIT / ODbL metadata on rebuild; both GLBs are byte-identical to the approved library exports. No contributor declaration was fabricated or signed.

| App LOD | Triangles | Draws | Bytes | Library match |
| --- | ---: | ---: | ---: | --- |
| near | 23,558 | 8 | 311,980 | exact GLB bytes, triangles and draws |
| far | 13,210 | 7 | 189,260 | exact GLB bytes, triangles and draws |

Landmark-specific regression tests pin the approved structural envelope, distinguishing material volumes, central structural surface and exported round trip in both LODs. Additional opening/contact probes cover the Ravenel stays (including shortened-end negative controls), Sumter sally port/casemates, pineapple skin, Noisette arch feet, Citadel open quadrangle and Rainbow Row gates.

Standalone app-tool evidence: `tmp/charleston/shots/ashley-river-memorial-bridge/ashley-river-memorial-bridge-combined.jpg` (source, exported near/far, light/dark, opposite side/roof and red-ring top view). Geometry metrics: `tmp/charleston/qa-metrics.json`; all 20 pass. These are inspector captures, not app placement evidence.

Cityscape: **not tested**. Full 3D world: **not tested**. Cityscape: not tested. Full 3D world: not tested. The stock unmodified app-shot tool ran on this worktree’s native local server using its authorized synthetic demo grant, without a real account or shared preview. It failed before the map initialized: page.waitForFunction: Timeout 90000ms exceeded (app-shot.mjs:53:12). The native config had no MAPBOX_TOKEN, TILE_SCHEMA or TILE_BASE_URL, and no terrain source; no additional override or credential/service workaround was introduced. World and runtime dark runs were not attempted after this common boot blocker. Model presence, provider extrusion removal, ground contact and neighbor shading are all not tested in either app mode. Evidence: tmp/charleston/app-shot-cityscape.log, tmp/charleston/native-config-check.json, tmp/charleston/native-server.log and tmp/charleston/native-ports-after.json. Only one app page boot was used; both native ports 3278/3279 were confirmed free after shutdown.

At stage A runtime remained disabled pending road fitting, with `ROAD_LAYER = null`. This historical state is superseded by stage B below.

The native app-shot run targeted enabled free-standing landmarks only; this bridge is additionally **not tested** in both modes because road fitting is deliberately pending.


## Stage B — road fitting (2026-11-10)

This section supersedes the stage A runtime status above. Worktree branch `gauthiergarnier/chs-bridge-ashley`, based on required ancestor `d0288290`; shared renderer sources are unchanged. The current High Level Bridge Edmonton / Cambie partition pattern supplements the Arlington / Burrard / Pont Royal surface precedents because this bridge has a second east-bank feeder.

### Road identity, source and ownership

OSM snapshot 2026-11-10 was fetched exclusively with the repository's serialized, cached `overpass.mjs`. Extracts: `tmp/ashley/osm.json` and `tmp/ashley/approach-context.json`; attributed, compact controls are committed in `ashley-river-memorial-bridge-alignment.js`.

- Memorial roadway: **480966842, 480966843, 117153920**, all `oneway=yes`, `lanes=3`, US 17 southbound, traveling east bank → west bank. The profile station increases in the reverse direction, west → east.
- West approach **51180495**, first 100 m from the structural end; its service-road junction **246343564** is only 0.91 m inside the ramp's flat vertical curve (about 3 mm above flat grade).
- East approach **38108288**, complete 76.813 m at-grade link, ending before provider viaduct **38108280**. Its two-lane metadata is retained in the source record; the fixed-width fallback remains 11 m until live HD pavement replaces it.
- East-bank feeder **631693898**, a one-way trunk link entering this southbound bridge, is also fitted. The 173.186 m feeder profile ends at the main pavement edge, main station 661.537 m, where the Cityscape deck is 2.727 m high; the remainder of that way lies within the main road surface.
- Legare is a distinct northbound crossing: **480966845, 38108319, 480966844**, four lanes. None of its vertices is owned by either profile or the Memorial building mask; it remains provider-drawn. No geographic mask spans both bridges.

The main layer uses `createRegistryBridgeLayer(PROFILE, PALETTES)` and the feeder uses the same factory with its own profile. A bridge-local composite loads independent `-main` / `-fork` partitions from the same near/far GLB, forwards ground, road masking and lifecycle changes, and links the feeder merge to the main accepted deck. Both use `absolute-deck`, clipped standard-road ends and rigid lateral widths. The main ownership margin is only 0.5 m; its exact Memorial outline **1499776962** supplies `buildingFootprints`. The source query found no separate building-tagged tender-house parts. There are no stacked decks, so `deckOffset` remains zero; no separating carriageways require `roadEdgesAt`.

### Grade and approved appearance

| Surface | Length | Maximum flat-map grade |
| --- | ---: | ---: |
| West approach | 100.000 m | 6.289% |
| East approach | 76.813 m | 7.105% |
| East-bank feeder | 173.186 m | 7.011%, including the 40 m merge blend |
| Original structural span | 528.103 m mapped | Original photographic grade retained |

Main ramps have constant grades with 10 m parabolic vertical curves; their height and derivative match the original 5.705 / 4.800 m end decks. The bascule stays at 7 m. World fits each free end to the live terrain, retains the main absolute deck, and seats each weighted pier/fender foot independently. No corridor is flattened. The feeder's skew mouth is clipped against the main carriageway edge, and its geometry and `heightAt` share the main grade across that mouth; it does not overlap the main driving lanes.

Every visible difference from the approved library model:

1. Three necessary approach surfaces and shallow retaining sides now connect the original span to mapped roads; they were absent in the library asset.
2. The original span follows every mapped roadway control rather than the former two-point straight axis. A dense local comparison measured at most **0.271 m horizontal displacement** over the structural envelope; the vertical geometry of the concrete arches, bascule leaves, four tender houses, lanterns, fenders, balustrades and mast is unchanged.
3. The road surface is tessellated at ≤4 m on the original span and 2 m on approaches so the driven and modeled grade agree. Bend cross-sections meet without outer-edge gaps. The original colors, house proportions, arch openings, hinge spacing and 19.9 m top remain intact in both LODs.
4. Runtime support feet follow the ground; shafts stretch to their original deck/cap attachments. The arches carry full deck attachment weights and remain rigid, rather than stretching toward a lower river DEM. This is a placement change, not terrain baked into the library geometry.

| LOD | Approved triangles / draws / bytes | Fitted triangles / draws / bytes |
| --- | --- | --- |
| near | 23,558 / 8 / 311,980 | 25,359 / 10 / 721,704 |
| far | 13,210 / 7 / 189,260 | 15,011 / 9 / 454,952 |

The lift attribute survives export; its lossless authoring data accounts for much of the byte increase. All bridge budgets pass. Exported partition loading requests the same GLB twice through the shared loader/cache, as in the precedent; two additional material draws are the feeder. The observed standard-road runs have zero HD overlay draws; no HD or Tesla hardware cost is claimed.

### Checks and verification

Fourteen focused regressions cover the original houses/material envelopes, every arch opening and pier contact, named rail/fender terminal contacts with a shortened-member negative control, pavement at both edges and profile knots in both LODs, all mapped vertices in both headings, perpendicular/walk/beyond-end and Legare rejection, ramp grades and endpoint derivatives, immutable repeated fitting, terrain feet, flat restoration, disable/failed load, exported weights/licences/costs, partition loading, the linked feeder and its clipped skew seam. The original 30 cm house-envelope tolerance accommodates only the measured horizontal alignment correction; its vertical dimensions are unchanged.

`tmp/ashley/qa-metrics.json`: no issues, no coplanar pairs, no layered faces, and no unsupported-member flags. The initial additional ramp walls had reversed winding; this was fixed and the export rechecked. `tmp/ashley/depth-generate.log`: zero cycle edges. The subsequent world broadside review caught arches sharing the pier deformation weights; those were changed to rigid deck attachments, with a regression asserting their world elevations stay authored.

Final combined landmark, top-cities and registry ground/asleep conformance suites: **967 passed, zero failed** (`tmp/ashley/required-tests-final.log`). Bundle parity: **5 passed** (`bundle-check-final.log`). `pnpm assets:check`: **445 entries / 878 GLB variants valid** (`assets-check-final.log`); `pnpm assets:preview` built the ignored local catalog; the scoped depth check reports **Depth layers current (1 models)** (`depth-check-final.log`). Final exported near/light and far/dark overview, underside and tender-house detail were inspected with stock `shot.mjs`: `tmp/ashley/inspector-{near,far}/`, reading montage `tmp/ashley/inspector-final.jpg`.


### Application evidence and limits

Cityscape: **verified locally**, Protomaps/OSM standard roads, both main approach joints in both directions, the additional feeder and merge, near/far loading, light/dark materials, and accepted navigation heights. Full 3D world: **verified locally** for the same road connections with the configured AWS Terrarium terrain and per-foot support placement; the final `world-rigid-arches` captures supersede the earlier world broadside geometry. These are stock app-shot runs with its sanctioned local synthetic grant, not real-account or Tesla tests.

Final evidence in this worktree:

| Case | Evidence folder / observations |
| --- | --- |
| West joint, Cityscape | `tmp/ashley/delivery/cityscape-west-{forward,reverse}/`: ramp meets the ordinary road, service entrance stays at grade, no road hole, no pier in a lane |
| West joint, world | `tmp/ashley/delivery/world-west-{forward,reverse}/`: ramp meets loaded ground, support feet seated; road surface and both headings agree |
| East joint, Cityscape | `tmp/ashley/delivery/cityscape-east-{forward,reverse}/`: continuous main ramp, feeder joins its edge, adjoining viaduct and Legare remain provider-owned |
| East joint, world | `tmp/ashley/delivery/world-east-{forward,reverse}/`: both roads join through the terrain fit, no vertical break at the free end |
| Feeder free end | `tmp/ashley/delivery/{cityscape,world}-feeder/`: at-grade entry from Lockwood Drive, continuous approach to the skew main merge |
| Whole bridge, Cityscape | `tmp/ashley/delivery/cityscape-overview/` and `cityscape-dark/`: original arches/four tender houses, one custom Memorial structure, no provider tower box, untouched parallel Legare |
| Whole bridge, final world | `tmp/ashley/delivery/world-rigid-arches/`: far, near, street and top; rigid original arches, longer piers down to the river DEM, no duplicate structure or provider boxes |

Each folder contains the original unobstructed-at-target stock PNGs, `report.json`, and `probe-N.json`. The stock `--at` report says `active:false` for its synthetic `spot-*` ID; the diagnostic finds the actual Memorial composite and confirms it active. `tmp/ashley/delivery-joints.jpg` and `delivery-overview.jpg` are reading montages; the earlier world broadside tile in the latter is superseded by `world-rigid-arches`.

The ignored `tmp/ashley/read-only-probe.mjs` observes the stock script immediately before each screenshot. It only reads page state; it writes no account, flag, entitlement, storage key or app state. It samples every mapped main and feeder vertex, the cut merge, all original pier stations and extra endpoint points: **47 samples per capture**, both headings. All returned finite heights, identical forward/reverse values, null perpendicular headings, and null ownership on every Legare control. World values are offsets above query ground, not absolute deck elevations; river values can exceed 7 m because the DEM lies below local authoring zero. All zero-weight footing vertices were compared to their local DEM, including the support coordinates through the quantized GLB node transforms; worst observed residual is **under 0.007 m**, within quantization error. The aggregate map API agrees with the bridge API.

Remaining untested matrix: live HD pavement/lane count/dash phase and paint on/off (local `/osm-lanes` returns **503**, no Redis), actual moving car/route/traffic/halo/camera replay, full browser failure/late-load/reanchor/toggle lifecycle, real account entitlements and Tesla hardware performance. Unit tests cover failed model load, disable, terrain/flat restoration and repeated fitting; those are not substituted for an unperformed browser drive. The fallback road has the approved three-lane markings, and its fixed 11 m width meets zoom-dependent stylized standard roads; live HD endpoint width remains unverified. No account, flag or shared renderer was changed to bypass these limits.

The shared preview stayed down. Native server was confined to this worktree on `3302/3402` with the supplied public tile/glyph/lane/terrain URLs; telemetry remained disabled. No .env from another checkout, staging page, production app page, push, PR, deploy or Plan action was used. App reports also record expected local account CORS and unavailable backend responses; none prevented model or terrain loading.

QA used **28 app page boots**, plus **2 local GLB inspector boots** (30 total). One scheduling mistake overlapped two stock app browsers for about 10 seconds; subsequent runs were serialized, with one native server throughout and no retry loop. The server is stopped and ports **3302/3402 are free** (`tmp/ashley/ports-after.log`). The ignored diagnostic summary and worker report retain the run inventory and handoff details.

Readiness: **true** after Cityscape road fitting, required tests, budgets, catalog/depth checks and the inspected app evidence passed. HD and driven-navigation limits remain explicit above; readiness is not a claim of those tests.
