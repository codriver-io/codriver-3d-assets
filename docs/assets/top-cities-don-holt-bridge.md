# Don N. Holt Bridge — North Charleston

Original procedural model of the current 1992 I-526 crossing over the Cooper River, in the pale Citadel-blue paint applied in 2017. Source: `src/peregrine/landmarks/top-cities/don-holt-bridge/`; exports: `public/models/bridges/don-holt-bridge*`. Stage B fits the approved public-library model to the normal app's road surface. No shared renderer source is changed.

## Sources and rights

- [SCDOT existing conditions, July 2022](https://info2.scdot.org/projects/ViewerFiles/Appendix%20A-Existing%20Transportation%20Conditions%20Summary-Final%20July%202022.pdf): 1992 construction, three-span continuous steel main unit, concrete approaches, approximately two miles overall and 155 ft navigation clearance.
- [OSM truss outline 1469639956](https://www.openstreetmap.org/way/1469639956), westbound [35067062](https://www.openstreetmap.org/way/35067062), and eastbound [35067064](https://www.openstreetmap.org/way/35067064). Stage-B extract: 2026-11-10, through the stock serialized/cached `.agents/skills/build-3d-city/scripts/overpass.mjs`; retained under `tmp/donholt/osm.json`. Normalized coordinates and relevant tags are in `don-holt-bridge-alignment.js`. © OpenStreetMap contributors, ODbL 1.0.
- [Donholt.JPG](https://commons.wikimedia.org/wiki/File:Donholt.JPG): Citm2000, public-domain dedication; the approved comparison shows the truss before repainting.
- [SCDOT painting update](https://info2.scdot.org/SCDOTPress/Lists/Posts/Post.aspx?ID=2616) and [2017 repaint report](https://www.live5news.com/story/36522491/don-holt-bridge-gets-makeover-in-citadel-blue-color-as-painting-resumes/): reference-only, not redistributed.

No imported mesh, photograph, texture, lettering or logo. Original generator/docs MIT; original commissioned models CC BY 4.0; geographic data ODbL. Existing author credit is retained; no contributor declaration was fabricated or signed. Separate product permission remains the maintainer's provenance review.

## Mapped roadway and ownership

The two opposing motorway ways share one deck through the single truss envelope and the modeled approaches. OSM tags both as one-way, two lanes, layer 2. They are separate carriageway centerlines, not stacked decks; the shared `deckOffset` is zero. The approved 28.5 m deck is retained irrespective of the OSM lane-count tag. No new lane markings were added.

The profile follows the midpoint of the mapped carriageways, retaining their intermediate vertex, in west-to-east station order (+lateral south). Its 2,981.755 m length replaces the schematic 3,330 m library extent. The ends have small longitudinal margins to contain every original roadway vertex; the final eastern margin correction was 2.844 m. Origin stays `[-79.964174775,32.8912967]`, local metres east/up/south, geographic stretch applied once by the runtime. Endpoints:

- West: `[-79.981301,32.893729919]`.
- East: `[-79.94984245,32.889294753482]`.

Adjoining ways 1190347673 / 1480013689 west and 35067061 / 58673770 east remain the ordinary provider's roads beyond those cuts. Virginia Avenue ramp ways 35067065 / 35067066 are outside ownership; the west context is `tmp/donholt/west-context.json`. The farther eastern approach outline 1536988929 extends beyond this crossing and is not claimed wholesale. The bridge's `buildingFootprints` masks only truss outline 1469639956; the queried crossing contained no separately mapped building/pier boxes. Actual app captures show no duplicate generic structure or provider box at the fitted crossing.

`createRegistryBridgeLayer` supplies normal loading, LOD, moving origin, navigation surface, reversible SD/HD replacement and provider-paint draping. `clipStandardEnds` clips at both joints. `ownsPoint` and heading/lateral checks reject neighboring and crossing roads. Rigid truss width is invariant under road fitting; only the outer 150 m at each end blend to the mapped carriageway centers and actual provider ribbon/HD widths. The local subclass follows the current Burlington/Ironworkers landing-width and palette interfaces.

## Grade and geometry

| Element | Value / basis |
| --- | --- |
| Truss length / main span | 491 / 244 m; approved mapped envelope / estimated span |
| Deck width / upper chord rise | 28.5 / 21 m; approved estimates |
| Truss roadway | 52 m crest, 50.8 m ends; approved parabola retained |
| Flat western ramp | 1,378.130 m; maximum 3.8317% |
| Flat eastern ramp | 1,112.625 m; maximum 4.7982% |
| Vertical transition curves | 60 m at both ends of each ramp; tangent to landing and truss |
| Truss panel rhythm / main bents | 20 panels; -245.5, -122, 122, 245.5 m relative to crest |

Every modeled roadway point is constructed through the same `PROFILE.bridgePoint` and `deckHeight` read by driving/navigation. Source y=0 is nominal flat/water grade, not a surveyed tidal datum. World uses `absolute-deck`: no corridor flattening or DEM baked in the asset, endpoint bank fitting and local support grounding. The low bank uses the lowest of 13 cross-deck samples, with the shared per-vertex terrain clamp and 0.15 m clearance. Pavement has cells at most 2 × 2 m near and 2.5 × 3 m far within 240 m of the west joint and 210 m of the east joint; these prevent terrain breaking through broad triangles. Above those terrain-contact zones, each carriageway uses one pavement ribbon with longitudinal stations at most 25 m near / 40 m far. Supports have a continuous ground-to-cap attachment gradient: bottoms stay planted, plinths and shafts compress together, caps follow the deck. At a bank, low supports bury below the pavement instead of projecting into lanes.

Visible differences from the approved library model are limited to fitting:

1. The deck follows the mapped alignment and asymmetric approach lengths instead of a straight, symmetric 3,330 m envelope; the small bearing adjustment follows OSM.
2. Approaches end at road grade instead of 4 m above it, with the documented grades, curved transitions, split/tapered landing pavement and barriers lowered into each nose. The center median starts/ends 150 m inside the joints.
3. Approach bents retain the approved twin-column/cap sections and 45 m rhythm but are re-seated under the new grade; end supports buried in the bank are omitted from flat authoring. The four main bents retain their stations and proportions.
4. World fits individual feet and compresses low support plinths/shafts; runtime pavement uses the shared road palette and the local landing blends to the current standard-road color.

The recognizable truss is unchanged: both parallel chord planes, sloping end posts, all Warren panels, near-only vertical/top bracing, cross ties, main support forms, colors and proportions survive both LODs. No towers, cables, tender houses, lamps or signs existed in the approved model; none were added. Maximum model height is 73.506 m in both LODs. Engineering dimensions and exposed footing elevations remain visual estimates.

## Costs and automated checks

| LOD | Approved triangles / draws / bytes | Initial fit (`97b97aa3`) | Current optimized fit |
| --- | ---: | ---: | ---: |
| near | 15,932 / 3 / 214,668 | 39,368 / 3 / 1,083,832 | 25,292 / 3 / 722,572 |
| far | 13,428 / 3 / 182,680 | 28,748 / 3 / 810,168 | 16,624 / 3 / 489,140 |

The additional pavement tessellation and retained `_BRIDGELIFT` attributes account for the increase. Both are within bridge budgets. Source/export bounds, normals, weights, material names and licenses are checked. Named contact tests exclude the member itself and include a deliberately shortened web that must fail; they cover chords, webs, verticals, crossbeams, top bracing, approach girders and support contacts in both LODs. Additional tests cover all mapped/densified roadway vertices in both headings, crossing rejection, exact endpoint edges, height/grade continuity, rigid main-deck width, immutable repeated fits, live layer heightAt, and buried low-bank supports.

Initial fitting checks (current optimization checks follow below):

- `pnpm build:top-cities-landmarks don-holt-bridge`: exports above, fitting weights retained; `tmp/donholt/build-final.log`.
- Bridge tests plus `top-cities.test.js`, `building-layer.test.js`, `registry-ground.test.js`, and `registry-sync-asleep.test.js`: **970 passed, zero failed**; `tmp/donholt/conformance-final.log`. Seven tests belong to this bridge.
- `pnpm assets:check`: **445 entries / 878 variants valid**; `tmp/donholt/assets-check-final.log`. `pnpm assets:preview` rebuilt the local inspector.
- `node scripts/landmark-depth-layers.mjs --ids don-holt-bridge --check`: current; regeneration dropped **zero cycle edges**. Only this id's generated depth ranks changed.
- `qa-metrics.mjs --ids don-holt-bridge`: **both LODs ok**, no issue flags or back-face hits; `tmp/donholt/metrics-final.json`.

 Initial defects and check failures were fixed rather than waived: one out-of-range eastern OSM vertex, low-lane endpoint floating, coarse terrain intersections, low support plinth protrusions, and the temporary draft/ready catalog mismatch. Earlier captures under `tmp/donholt/app-*` and `joints-*` are pre-fix evidence; final evidence uses `tmp/donholt/final/`.

## App verification

**Cityscape: verified for standard Protomaps roads. Full 3D world: verified for standard roads and Terrarium contacts.** Final stock captures:

- `tmp/donholt/final/cityscape/{west-in,west-out,east-in,east-out}/spot-<view>-near.png`: both landing joints and directions, continuous pavement, narrow median gaps, preserved separate Virginia Avenue ramps. Day overview/source-stage images are also in `tmp/donholt/app-cityscape/`; final near/far/street night captures are in `tmp/donholt/final/cityscape/night/`.
- `tmp/donholt/final/world/{west-in,west-out,east-in,east-out}/spot-<view>-near.png`: both banks and directions. The low east lane now meets its bank, the western terrain holes/plinth protrusions are gone, and the deck leaves each bank continuously.
- `tmp/donholt/final/world/overview/don-holt-bridge-{far,near,street}.png`: clear main truss, road on the deck, feet on the terrain, no duplicate generic bridge or provider boxes. The map's surrounding coarse DEM remains unflattened.
- Comparison sheets: `tmp/donholt/final/{cityscape-joints,world-joints,overview-modes}.jpg`. Full 1280×800 originals remain available. The stock app's offline alert banner is visible below the approach joints; it was not removed or hidden. The `--at` reports' `active:false` refers to their synthetic `spot-*` id, not to bridge residency; the live diagnostic confirms the actual bridge is active.

The read-only `tmp/donholt/live-cityscape.json` and `live-world.json` contain every mapped vertex and 20 m densified samples: **315 locations / 630 heading queries per mode**, including all **five original OSM vertices**. No nulls or opposite-heading disagreement. The aggregate navigation API and bridge API agree. Cityscape endpoint lift is zero; World joint lift is 0.15 m above each lane's sampled terrain. World keeps the main 52 m deck datum separate from the terrain, including negative river DEM samples.

Near diagnostic measurements: maximum accepted-surface arithmetic residual below 1.2e-10 m; maximum rendered pavement error 0.0280 m (quantized GLB); **636 planted footing vertices**, maximum World DEM residual **0.02466 m**, flat residual 0.01173 m. Triangle-interior and edge-midpoint probes find a minimum World pavement clearance of **0.0121 m** after refinement; these are discrete surface samples, not a claim of exhaustive intersection proof or surveyed terrain accuracy. Page errors were empty in the live probes. `hdOn:false` was recorded; lane endpoints returned 200, but live HD overlay/paint continuity was not exercised by the stock capture setup.

The native server uses localhost 3303/3403, public Protomaps/OSM assets and AWS Terrarium (256 px, max zoom 15), with telemetry disabled. Stock `.agents/skills/build-3d-city/scripts/app-shot.mjs` is unchanged. A separate ignored `tmp/donholt/live-probe.mjs` uses exactly its sanctioned demo-grant setup and only reads live state after camera positioning; it adds no entitlement, account, storage key or flag.

Live HD pavement/paint, driven route/car/traffic playback, paint toggles and failure/reanchor stress cases remain not tested; the successful height API tests are not a claim of full driven-route validation. Device performance is not measured. Generated renderer/depth output is isolated in a separate `generated:` commit for the integrator to regenerate after merging the parallel bridge branches. No online deployment or tracking-issue changes.


The far World probe, `tmp/donholt/live-world-15.2.json`, independently accepts the same 315 locations in both headings with the far GLB resident. Its maximum pavement error is 0.02587 m, 636 footing residuals stay below 0.02466 m, and sampled pavement clearance is at least 0.02884 m. The accepted endpoint datum follows the currently resident terrain detail; the actual query lift stays at the shared bank clearance.

Source and exported look review: `tmp/donholt/inspector/comparison.jpg` compares procedural near/light, exported near/light and exported far/dark, each from the facade, deck and support views. Main span, panels, open driving corridor, floor/cap/shaft contacts, blue steel and grey concrete agree; the far model retains the approved omission of fine vertical/top bracing. Individual native captures and labeled sheets are in `tmp/donholt/inspector/{source,near,far}/`.

**Readiness: true.** Cityscape and World standard-road placement passed, exports and costs are current, all 970 landmark/registry tests and five bundle freshness tests pass, assets/depth/geometry checks pass. No shared hand-written source was edited. Lead integration should keep the bridge commit, regenerate the separate shared generated commit, and review the evidence; unexercised HD/driven-route/hardware cases above remain explicit limits.

QA used **26 app page boots** (including one aborted malformed `--at=` invocation) and **three offline inspector page boots**, 29 total. No staging/production app page was opened. The final native process was stopped; both assigned ports are confirmed free in `tmp/donholt/ports-after.json`. Telemetry stayed disabled. The pre-existing `package-lock.json` edit is left uncommitted and outside this task.

## Weight refinement after the accepted fit

The accepted `97b97aa3` fit was optimized without changing alignment, deck profile, `heightAt`, ownership, widths, palettes, supports or truss members. Its near/far World probes placed the last sampled clearance below 2 m at approximately 202 m from the west joint and 167 m from the east joint. Fine pavement cells now cover 240 m west / 210 m east, retaining a margin instead of extending 450 m from both joints. The elevated carriageways no longer have redundant lateral strips; their pavement, concrete slab, girders and rails follow longitudinal stations at most 25 m near / 40 m far, with 5 m concrete stations in the low bank zones and explicit alignment/truss/landing transition stations.

No secondary steel was removed. Exported metric steel-position hashes exactly match the accepted near and far GLBs (`tmp/donholt-weight/steel-identity.json`), including every panel point, chord and end post. No visible difference was found in the requested app views. Compared with the accepted fit, near loses 35.8% of triangles and 33.3% of bytes; far loses 42.2% of triangles and 39.6% of bytes. Both meet the requested 30,000 / 800,000 near and 20,000 / 550,000 far targets, with `_BRIDGELIFT` retained.

**Cityscape: verified again. Full 3D world: verified again at both joints.** The unmodified stock app-shot produced:

- `tmp/donholt-weight/cityscape/don-holt-bridge-{far,near}.png`: accepted blue truss, bents and fitted roadway retained; no adjacent duplicate generic structure.
- `tmp/donholt-weight/world-west/spot-west-near.png`, at `[-79.981301,32.893729919]`, bearing 99.6°: continuous west landing and rising pavement; no terrain visible through it.
- `tmp/donholt-weight/world-east/spot-east-near.png`, at `[-79.94984245,32.889294753482]`, bearing 279.6°: continuous east landing and rising pavement; no terrain visible through it.
- `tmp/donholt-weight/qa-montage.png`: labeled comparison sheet of all four images. The ordinary offline alert remains visible. As above, `spot-*` active-state output refers to the synthetic capture id.

Read-only local diagnostics `tmp/donholt-weight/live-world.json` (near) and `live-world-15.2.json` (far) confirm the actual bridge is active with terrain. Each checks 315 road locations, including all five mapped vertices, in both headings: no nulls, heading disagreements or aggregate/bridge API disagreements. The maximum accepted-surface residual is below 1.2e-10 m. Rendered pavement residuals are at most 0.02796 m near / 0.02587 m far; the 636 footing residuals remain below 0.02466 m. Triangle-centroid and edge-midpoint samples have minimum pavement clearance 0.01207 m near / 0.02884 m far and no negative values. These are discrete checks, not an exhaustive intersection proof; the original HD/driven-route/hardware limits still apply.

All **975 tests pass**, including the seven unchanged bridge tests, registry/landmark conformance and five bundle freshness tests (`tmp/donholt-weight/all-tests.log`). No test assertions were weakened or changed. Exports (`build.log`), catalog validation (**445 entries / 878 variants**, `assets-check.log`), local preview generation (`assets-preview.log`), geometry QA (both LODs without issues, `metrics.json`) and depth freshness all pass; depth regeneration drops zero cycle edges and produces no depth-table diff. These logs are under `tmp/donholt-weight/`.

This follow-up used **five page boots**: three stock app-shot runs and two read-only World probes, with one browser at a time. The probes reuse exactly the stock grant/setup and add no storage key, entitlement or flag. Native server settings and disabled telemetry were unchanged; the server is stopped and ports 3303 / 3403 are free (`tmp/donholt-weight/ports-after.json`). Readiness remains true. Shared renderer output is again isolated in a separate `generated:` commit; no shared hand-written source or stock QA script changed.
