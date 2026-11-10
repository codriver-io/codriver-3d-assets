# Ben Sawyer Bridge — road-fitted 2010 swing bridge

Original procedural model of the **2010 replacement**, closed to navigation and open to road traffic. Stage B fits the approved library model to SC 703 in the normal app. The central Pratt truss, pivot, overhead tender house, harbor-side sidewalk, fenders, colors and member dimensions remain recognizable and unchanged in scale.

## Sources and rights

- [FHWA Innovator, issue 11](https://www.fhwa.dot.gov/innovation/innovator/issue11/): 247 ft center-pivot swing span, 452 ft approach on each bank, tender house above the roadway.
- [FHWA replacement demonstration report](https://www.fhwa.dot.gov/hfl/projects/sc_rapidremovalreplacement_bensawyerbridge_sc703.pdf): permanent replacement and six spans per approach.
- [SCDOT Winter 2010 Connector](https://www.scdot.org/inside/pdf/ConnectorArchives/Winter2010Connector.pdf), pp. 14–15: February 2010 reopening and 5.5 ft sidewalk; new 14 ft lanes.
- [OSM outline 709657858](https://www.openstreetmap.org/way/709657858), approach ways 55610715 and 927285595, [movable span 927285596](https://www.openstreetmap.org/way/927285596), and sidewalk 1459906451. OSM API fetched 2026-11-09; © OpenStreetMap contributors, ODbL 1.0.
- [Current open swing span, 2025](https://commons.wikimedia.org/wiki/File:Swing_span_of_Ben_Sawyer_Bridge_open_in_2025.jpg): Peter Burka, **CC BY-SA 2.0**, license verified on Commons. Shows this replacement span, pivot and overhead cabin, with marine traffic position used only to understand its structure.
- [2010 replacement aerial](https://commons.wikimedia.org/wiki/File:Ben_Sawyer_Bridge_Aerial_View_SC_(8424392896).jpg): Federal Highway Administration, **public domain US DOT work**, also verified Flickr CC BY 2.0. Shows the correct site and both temporary old/new superstructures; these are distinguished rather than modeled as parallel bridges.

Photos stay outside tracked paths and are comparison-only, never traced into a texture. Original geometry and docs use the commissioned-model precedent's CC BY 4.0 / MIT credit. No agent acceptance of contributor terms; separate product permission is a maintainer review.

## Mapped frame and roadway

The stage A ancestor `d0288290` was checked before work. Source is the approved public-library import at `4241517a4bec3ff9e0954b7c69e20fc09c9c7410`; this fitting changes only this bridge's folder, exports, catalog record and documentation. The generated renderer is delivered separately.

Origin remains `[-79.84205815,32.772720675]`; axes are east/up/south, in real metres, with geographic rotation baked once through `PROFILE.bridgePoint`. The roadway alignment is attributed OSM data fetched **2026-11-10**, exclusively through the serialized, cached `.agents/skills/build-3d-city/scripts/overpass.mjs`. Retained snapshot: `tmp/ben-sawyer/osm/roadways.json`; tracked coordinates and IDs: `ben-sawyer-bridge-alignment.js` in the bridge folder.

- **55610715**: south approach structure, two-way SC 703.
- **927285596**: movable swing roadway, both directions.
- **927285595**: north approach structure, both directions.
- **12152716 / 1391506631**: connected south/north ordinary roads; only the first **60 m beyond each abutment** is fitted. Coordinates outside ownership are retained as source context and rejected by the navigation surface.
- **709657858**: bridge outline, retained in `FOOTPRINTS`; **1459906451**: mapped harbor sidewalk reference.

The road ways form one carriageway, not two parallel bridges. All four distinct mapped bridge vertices (eight occurrences across the connected ways) are accepted in both headings. The full original way arrays also contain four ordinary-road vertex occurrences beyond the bounded fit; those remain provider-owned. The 210 m building/building-part inventory returned no extrusions at the bridge, so `buildingFootprints: []` is deliberate. No neighboring house, marina or causeway land is masked.

## Deck and ramp contract

`layer.js` exports `createRegistryBridgeLayer(PROFILE, PALETTES)`. The shared layer owns SD replacement, HD pavement/paint draping when enabled, route/car/camera height, LOD loading, immutable refits and reversible masks. This bridge uses `terrainPolicy: 'absolute-deck'`, station-varying road edges, identity lateral fitting, bounded `ownsPoint`, and `clipStandardEnds: true`. Both headings use the same deck; no stacked `deckOffset` is needed.

| Quantity | Value / basis |
| --- | --- |
| Mapped structural length | 352.5596 m roadway; approved outline model was 352.4780 m |
| Full fitted alignment | 472.5596 m, including two 60 m land tie-ins |
| Swing span | 75.2856 m / 247 ft, preserved |
| Closed deck / truss crown | 11.8 / 21 m, preserved estimates |
| Cabin roof / antenna | 25.5 / 26.5 m, preserved estimates |
| Carriageway | 8.534 m on the structure; two sourced 14 ft lanes |
| Sidewalk / whole deck | Original nominal 5.5 ft harbor walk / 12 m envelope |
| Land-joint pavement | 6 m, widening smoothly to the original carriageway |
| Flat landings | 4 m at each alignment endpoint |
| South rise length / maximum grade | 194.3186 m / **6.4722%** |
| North rise length / maximum grade | 194.9554 m / **6.4497%** |
| Vertical curves | 12 m quadratic curves at both ends of each constant-grade ramp |
| Structural abutment heights in Cityscape | 3.2361 m south / 3.2248 m north, previously 3 m |

Profile knots explicitly include `'start'` and `'end'`. The flat joints meet grade at 0 m with zero derivative. The rigid swing unit stays horizontal. There is no invented opening animation. Geometry uses the same station/height contract as the driven surface, with 2 m longitudinal samples and at most approximately 1.5 m transverse pavement spacing in both LODs.

Local y=0 remains the reusable support-foot/flat-map datum, not a surveyed sea-level measurement. In world mode the absolute-deck policy retains the estimated central deck datum, blends approach ends to the host ground and fits each support foot to its own terrain sample. No DEM or Mercator stretch is baked into the GLBs. The 0.12 m terrain clearance and transverse pavement samples prevent terrain protruding between pavement edge vertices; the initial two-column bank surface exposed this defect and was corrected, then recaptured. Neither mode flattens a corridor through the waterway.

## Visible differences from the approved library model

1. The original straight axis follows the mapped three-segment roadway, with a small bend at each swing joint. Within the original structural envelope the centreline moves by at most **2.00 m horizontally**; the central assembly moves about **1.32 m** and rotates approximately **1.04°** to the mapped swing bearing. Its 247 ft length, member sizes, cabin proportions, pivot and fender arrangement stay the same.
2. Approach decks, longitudinal girders, rails and bent caps follow the fitted grade. Their vertical change is **−0.530 to +0.236 m** over the original structural envelope; shafts re-seat beneath those caps. The central deck, truss and cabin heights do not change.
3. Two **60 m ground tie-ins** extend beyond the approved structure, narrowing to 6 m at the provider joints. They have low, ground-seated retaining sides and no added land piers or railings. Existing rails and the harbor walk remain on the original structure.
4. The deck tessellation is denser to follow the shared surface, especially the terrain-clamped banks. This adds no new decorative feature. All eight material names and both original color palettes remain unchanged.
5. Ground/deck attachment weights are now retained in both GLBs. Support shafts stretch between fixed feet and the deck; timber fenders remain ground-attached. The roof antenna is intentionally a cantilever with a supported lower end.

## Measured exports

| LOD | Approved triangles / draws / bytes | Road-fitted triangles / draws / bytes |
| --- | --- | --- |
| Near | 11,110 / 8 / 165,096 | **18,572 / 8 / 551,076** |
| Far | 5,302 / 8 / 88,124 | **13,556 / 8 / 410,228** |

Both remain below the bridge budgets: near 120k / 40 / 4.5 MB; far 30k / 10 / 1.2 MB. Both preserve the identical final envelope and 26.5 m top. `_bridgelift`, normals, named materials and CC BY 4.0 / MIT / ODbL metadata survive the codec round trip. HD overlay costs are not claimed: the stock QA sessions leave HD off.

`pnpm build:top-cities-landmarks ben-sawyer-bridge`, `pnpm assets:check` (445 records / 878 variants), `pnpm assets:preview`, and the targeted depth `--check` pass. The generated depth ranks remain unchanged; there are **zero material cycles**. Final geometry QA has **no issues, no coplanar/layered candidates and 0% external back-face hits**. Logs: `tmp/ben-sawyer/{build,assets-check,assets-preview,depth-generate,depth-check,qa-metrics}.log`; numerical metrics: `tmp/ben-sawyer/qa-metrics.json`.

Ten bridge tests cover the mapped two-way surface and endpoint edges, exact central identity/clearance, smooth grade, off-road/crossing rejection, rigid width, immutable terrain fits and flat restoration, GLB weights/budgets, and the transverse terrain-clamp regression. Geometric terminal probes cover **1,005 near / 377 far supported ends**, testing actual member cap vertices against separate support parts and rejecting a shortened rail control. Full landmark + registry/building conformance: **973 passed, zero failed**; renderer fresh-build parity: **5 passed**. Evidence: `tmp/ben-sawyer/tests-all.log`, `tests-focused.log`, `bundle-tests.log`.

## App evidence and mode status

Native localhost app only, in this worktree, ports **3304 / 3404**. Protomaps tiles/glyphs/trees/lane archives use the authorized public service; world uses Terrarium 256 px, maximum zoom 15. Telemetry is disabled. No shared preview, staging/production app host, real account, extra entitlement/flag override, push, deploy or Plan change was used.

Visual evidence is produced by the **stock, unmodified `app-shot.mjs`**. An explicitly authorized local read-only companion under `tmp/ben-sawyer/observe-app-shot.mjs` imports that script unchanged and records state immediately before its browser closes. It reads `heightAt`, active LOD and ground/support data; it adds no page initialization, grant, localStorage key or application mutation. Custom `spot-*` screenshot report rows do not identify the bridge by name; the accompanying diagnostics independently verify the actual bridge layer is active.

| Mode | Status and evidence |
| --- | --- |
| Cityscape | **Verified locally** for standard-road replacement, both joints/directions, near/far overview, clear truss corridor and support contacts. Final overview: `tmp/ben-sawyer/final-cityscape-overview/`; joints: `joint-cityscape-{south,north}-{334,154}/`. All include full 1280×800 PNGs, report and live diagnostics. |
| Full 3D world | **Verified locally** after correcting the bank pavement tessellation. Final joints: `tmp/ben-sawyer/final-world-{south,north}-{334,154}/`; overview: `final-world-overview/`. Both banks meet the provider road, with no remaining terrain patches, holes or duplicate generic structure. |
| Night palette and near/far visibility | Verified in both app modes in `app-{cityscape,world}-night/`; these precede only the final transverse pavement subdivision, with identical palettes/central steelwork. |

The south/Sullivan's Island and north/Mount Pleasant joints were captured at `[-79.84093132687713,32.77082175176973]` and `[-79.84317245144476,32.774625474192014]`, facing **334° and 154°** at each. The standard road's map styling is white and zoom-dependent; the model fallback pavement keeps the bridge material. Pavement joins continuously, with the intended taper, no raised end wall or pier in a lane, no generic structure alongside the truss, and no provider box over the cabin. The final transverse fix was re-reviewed in fresh world captures.

Each diagnostic records every original mapped roadway vertex in both headings, plus the exact alignment endpoints, profile knots and 10 m dense samples: **67 records**, including **63 owned records**, with zero rejected owned samples and forward/reverse agreement. Perpendicular headings and the four ordinary-road context samples are rejected. Cityscape heights are 0 m at the land joints, approximately 3.23 m at structural abutments and 11.8 m on the central span. World heights are lift above the queried terrain, not absolute altitude; exact land joints retain 0.12 m clearance. The whole central surface remains approximately 11.8 m in the shared world frame. The earlier dense world sample maximum grade was 7.155%; final values are retained in the final diagnostic JSON rather than presented as a survey.

Live ground checks inspect every zero-weight vertex against its own source-ground coordinate, including each approach pier, pivot, fender and retaining side. The maximum quantized vertex residual is below **0.004 m**. This is agreement with the host DEM, not geotechnical accuracy. The world baseline bank DEM readings were 3.704 m south and 4.318 m north.

**Scope limits:** live HD pavement/paint and its on/off behavior are **not tested**: the stock sessions report `hdOn: false` and optional lane requests return 503 without local backing services. The shared HD drape implementation is used unchanged. Animated vehicle/route/traffic/camera crossing, failed-load/2D/reanchor sequences and Tesla hardware are not tested; the common height API and immutable terrain restoration are covered numerically. No physical drive or hardware performance is claimed. Independent final review remains with the coordinator.

The old initial world joint captures (`joint-world-*`) show terrain patches and are diagnostic failures, not acceptance evidence. Initial conformance also correctly failed on a temporary `SPEC.ready` / catalog mismatch; synchronizing the record resolved it. The final ready gate is based on the passing Cityscape captures and checks above.

Final local source/export inspection: `tmp/ben-sawyer/source-final/` and `export-{near,far}-{light,dark}/` contain the stock inspector views and sheets. The footprint/top, deck, underside, support and cabin views were compared across source and exported LODs. The mapped bank tie-ins intentionally extend beyond the original bridge outline. App montages are `final-overviews-sheet.jpg`, `cityscape-joints-sheet.jpg`, `final-world-joints-sheet.jpg` and `night-sheet.jpg` in the same evidence root; full PNGs remain the acceptance evidence.

**Page boots:** 19 app boots, all sequential, plus 6 offline inspector boots (25 total). One native app server and one browser ran at a time. The final server PID 51970 was stopped; `tmp/ben-sawyer/ports-after.json` confirms both 3304 and 3404 refuse connections. No shared services were started or changed. `SPEC.ready = true` and catalog `status: ready` are committed only after the final Cityscape/world captures and checks passed. The pre-existing `package-lock.json` edit is preserved and excluded.
