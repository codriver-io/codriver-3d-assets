# Sunshine Skyway Bridge

Original procedural model of the **current 1987** Bob Graham Sunshine Skyway Bridge carrying I-275 / US 19 over Tampa Bay between St. Petersburg and Terra Ceia, Florida. The demolished cantilever truss bridges and surviving fishing piers are excluded. Dossier photographs 1, 2 and 5 establish the current structure; photographs 3, 4 and 6 contain old trusses and were not used for geometry.

## Sources and dimensions

Reviewed 2026-10-11: [FIGG designer](https://www.figgbridge.com/i-275-bob-graham-sunshine-skyway-br), [PCI Journal, November–December 1986, pp.168–176](https://www.skywaybridge.com/files/861100.pdf), [FHWA cable study, Chapter 3](https://www.fhwa.dot.gov/publications/research/infrastructure/bridge/05083/chap3.cfm), the supplied Wikipedia dossier and [OSM current crossing](https://www.openstreetmap.org/way/1087109061). FHWA reports the single-mast towers and 84 cables in one plane; its historical opening date is inconsistent with FIGG and is not adopted.

| Feature | Authored value | Basis |
| --- | ---: | --- |
| Main span | 366 m | FIGG / PCI published 1,200 ft |
| Side spans | 165 m each | PCI published 540 ft |
| Stayed section | 696 m | Main and side spans |
| Main deck width | 29 m | PCI published 95 ft section; dossier 94 ft rounds similarly |
| Pylon crown | 131 m | Task / dossier nominal; PCI construction account gives 133 m with a different datum |
| Main girder soffit / pavement | 59 / 63.5 m | Task nominal clearance; estimated 4.5 m girder depth consistent with PCI section |
| Stay legs | 84 near / 44 far | 21 in each of four longitudinal fans; far retains fan boundaries and alternating stays |
| Stay anchor pitch | 7.3 m | PCI every-other-segment anchorage |
| Total modeled roadway | 3,324.634 m | Mapped high section and low-road landings; entire 6.7 km crossing not modeled |
| Flat landings | 70 m each | Integration convention |
| Ramp lengths after flat landings | 1,176.532 / 1,312.103 m | Profile stations; short 60 m vertical curves |
| Maximum flat grades | 5.687 / 5.071% | Shared deck profile |
| Median / shaft sections | 3.8 m / tapered 9×8 to 2.6×2.6 m | Visual estimates; four traffic lanes remain unobstructed |
| Approach support spacing | 41 m, 73 m near central spans | PCI typical span lengths; stations and simplifications estimated |

Clearance sources disagree (dossier 55 m, other accounts 59 m, PCI construction 53 m). This model adopts the task's nominal 59 m **soffit**, rather than describing it as a surveyed navigation clearance. The selected 131 m crown is also nominal. Main deck elevation, tower cross sections, median/barrier details, lamp locations and foundation-pad sizes are visual estimates.

Reference photographs are Joseph Gage, *Sunshine Skyway Bridge (2023)*, CC BY-SA 2.0 ([licence checked](https://commons.wikimedia.org/wiki/File:Sunshine_Skyway_Bridge_(2023).jpg)); Kelly C. Cook, *Sunshine Skyway from Tampa Bay*, public domain ([checked](https://commons.wikimedia.org/wiki/File:Sunshine_Skyway_from_Tampa_Bay.jpeg)); and Apelbaum, *Skyway Bridge 3*, CC BY-SA 3.0 (supplied dossier credit). Two [Esri World Imagery](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer) extracts were inspected for tower foundations and roadway width. These remain reference-only in ignored scratch; no imagery, textures, scan or third-party mesh ships.

## Geographic and runtime frame

East/up/south metric geometry, y=0 flat-map/water grade. Origin `[-82.65655, 27.62179]` is the aerial-observed northern pylon projected onto the averaged mapped carriageways: `[-82.656573712, 27.621776438]`. This corrects the dossier's approximate anchor, about 500 m north of the main pylon. The second tower follows at station +366 m and agrees with the second protective foundation in the aerial to a few metres; this is visual registration, not a survey.

OSM ways **39418630** and **39418633** supply both roadway alignments; **1087109061** identifies the bridge outline. The included alignment source preserves the dossier geometry; the profile averages longitudes at shared latitudes and clips at 27.63244 / 27.60735. Footprints cover this modeled corridor and the two pads, excluding distant trestles/fishing piers. No building-tagged tower outline occurs in the supplied dossier. The optional supplementary Overpass query failed (`fetch failed`); the supplied extract and aerial remain the geographic evidence.

The original shared `createRegistryBridgeLayer` owns loading, standard-road masking, HD overlays, shared route/car/camera heights and absolute-deck terrain placement. Width deformation is identity: a fragmentary HD sample cannot squeeze the structural deck. `bridgeLift` preserves planted shaft feet during approach refits; no terrain, Mercator scale or moving origin is baked into the GLBs. No shared runtime extension was needed.

## Modeling and verification

Two chamfered single-column concrete pylons, one central yellow stay plane, an uninterrupted segmental main box with inclined webs, twin approach boxes with an open median, close-spaced piers, concrete barriers and lamps. No water surface is authored in Cityscape. Foundation pads stand on y=0; only the collapsed slab skin at the flat road landings reaches −0.20 m, concealed below the road. Protective dolphins, rocks, detailed internal cells, full low causeways, anti-suicide netting and old piers are omitted.

Near uses three spatial structural batches; far combines each material, coarsens longitudinal samples and halves stay legs while retaining both crowns, fan extremities and the deck profile. Yellow stays use a photograph-calibrated palette; night shades keep the yellow readable. Lamps are attached in both LODs. Near fallback paint is 3.5 cm above pavement under the shared road-depth convention.

Read-back evidence lives in `tmp/top-cities/shots/sunshine-skyway-bridge/`:

- `procedural/sunshine-skyway-bridge-procedural-near-light-sheet.jpg`: overview, opposite side, plan/footprint, road, tower, underside and approach.
- `reference-export-sheet.jpg`: current reference photographs beside exported near/far, light/dark overview and deck images; judged visually.
- `glb/sunshine-skyway-bridge-glb-{near,far}-{light,dark}-sheet.jpg`: exported GLB comparison, including close tower and underside views.
- `app-overview-sheet.jpg`, plus `cityscape/` and `world/` far/near/street PNGs: normal app, near and far assets active, shared unlit/vertex-shaded rendering.
- `cityscape-approach-sheet.jpg`, `world-approach-sheet.jpg`: both landings in both driving directions; the adjoining standard roads meet without a visible step/gap or duplicate deck.
- Each mode's `approach-height-report.json` records both carriageways and both headings, off-road nulls and footing samples.

Fixes from verification: the first far export exceeded its byte cap, so far longitudinal sampling and normals were reduced; flat landing slab clamps initially produced asphalt/concrete depth cycles, fixed by keeping the collapsed slab below pavement. Lamp arms now belong to their pole's spatial chunk, and far retains the lamp and arm rather than leaving a free pole end. Final depth report has **zero dropped cycle edges**, and geometry metrics report `ok`.

## App heights and placement matrix

QA servers: Cityscape 3270, Full 3D world 3272, own worktree, Protomaps tiles from `tiles.codriver.io`; world uses AWS Terrarium DEM, tile size 256/max zoom 15. Local demo QA grant is the supplied app-shot workflow; no account or product gates changed. Both end surfaces and the main deck were sampled after tile settlement.

The values below apply to **both lateral offsets −8/+8 m and both travel headings**, in **both modes**. World DEM sampled 0 m across this water crossing, so relative and absolute deck values coincide.

| Distance from endpoint | North heightAt (m) | South heightAt (m) |
| --- | ---: | ---: |
| 1 / 50 / 70 m | 0 | 0 |
| 85 m | 0.106636 | 0.095090 |
| 100 m | 0.426544 | 0.380360 |
| 180 m | 4.549803 | 4.057176 |
| Main-span midpoint, `[-82.655647292,27.620350341]` | 63.5 | 63.5 |

Off-road sample 0.001° east returns **null** at both approaches in both modes. World pylon-foot samples have DEM 0 m, actual 0 m and residual 0 m; the final report additionally covers **1,212 planted-foot vertices** across pylon shafts, footing pads and all approach supports, with residuals −0.000000899 to +0.000000733 m; synthetic varying DEM tests independently verify foot shifts, unchanged absolute main deck and Cityscape restoration. Approach heading is ~146–147° southbound / ~326–327° northbound.

| Case | Status | Evidence / limit |
| --- | --- | --- |
| Cityscape standard roads, both ends/directions, near/far | Verified | App PNGs and height reports |
| Full 3D world, both ends/directions, near/far | Verified | Terrarium enabled, app PNGs/height reports, ground 0 m |
| Shared driving/camera height and off-road/perpendicular rejection | Verified API | Real heightAt samples and focused tests; live driven route/traffic not exercised |
| Repeated fits, world/Cityscape restoration | Verified synthetic | Immutable-source and varying-DEM tests |
| Live HD pavement / paint on/off | Not tested | Local `/osm-lanes` requests returned 503; no Redis/HD cache available |
| Full mode/failed-load/tile-disposal lifecycle matrix | Not tested for this asset | Shared factory; no shared implementation changed |
| Tesla hardware / overlay costs | Not tested | Browser inspection does not establish device performance |

## Costs and commands

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 45,084 | 19 | 3,197,604 | 3122.7 |
| Far | 22,332 | 9 | 728,336 | 711.3 |

`pnpm build:top-cities-landmarks sunshine-skyway-bridge --no-check`; focused conformance plus landmark tests; `node scripts/asset-catalog.mjs`; `pnpm assets:check`; `pnpm assets:preview`; `node scripts/landmark-depth-layers.mjs --ids sunshine-skyway-bridge` then `--check`; `qa-metrics.mjs --ids sunshine-skyway-bridge`; `pnpm build:peregrine` for local QA.

Final validation: **385/385** focused conformance tests, including **9/9** landmark tests (<1 s); catalog **266 entries / 442 variants** valid; assets check/preview pass; depth check current with zero cycles; geometry metrics `ok`.

The generated shared depth table is not part of this worker's owned-file commit. Generated app bundles are restored and local servers stopped before delivery. No other landmark/shared runtime source was changed, and no online publication or deployment occurred.
