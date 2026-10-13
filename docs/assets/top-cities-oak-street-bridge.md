# Oak Street Bridge

Original procedural model of the current 1957 BC Highway 99 crossing over the Fraser North Arm between Vancouver and Richmond. The identifying features are a raised four-lane roadway, weathered yellow haunched plate girders, repeating twin-shaft concrete piers and long concrete approach viaducts. The supplied task called the main span a truss; the inspected photographs and structural publication identify girders, which the model follows.

## Sources and dimensions

Started from the supplied October 2026 dossier (osm.json, facts.txt and refs-sheet.jpg). The [2004 Klohn Crippen seismic upgrade paper by Ding and Hamersley](https://www.iitk.ac.in/nicee/wcee/article/13_3279.pdf) supplies overall length, steel main/concrete approach construction, five concrete strings and typical 18 m approach spans. [Wikipedia](https://en.wikipedia.org/wiki/Oak_Street_Bridge) supplies the four-lane identity, June 1957 opening and central 60.9/91.4/60.9 m span sequence. The [OSM outline](https://www.openstreetmap.org/way/502803752) and seven mainline roadway ways supply alignment.

| Quantity | Model | Basis |
| --- | --- | --- |
| Approach-inclusive length | 1837.482 m | Mapped; published 1840 m |
| Central spans | 60.9 / 91.4 / 60.9 m | Published sequence; stations visually estimated |
| Deck width | 19.6 m | OSM outline measurement normal to roadway, approximate |
| Carriageways / raised paths | Two 7 m ribbons; 2.55 m outer shoulders/walks | Estimate within mapped envelope |
| Road crest / river-end height | 26 / 24 m | Visual estimate, not surveyed clearance |
| Main girder depth | 1.35 m at span middle; 2.7 m over piers | Visual estimate; haunched profile |
| Pier shafts / cap | Two 1.9 × 1.8 m shafts; 17.8 × 2.8 × 1.4 m cap | Visual estimate |
| Approach pier rhythm | At most 18 m | Primary paper typical span; counts and station placement estimated |
| Steel river structure | Seven spans, including the central three | Visual estimate |
| Flat ramps | 460.812 m north / 859.870 m south, 35 m vertical curves | Map convention; peak grade 5.636% / 2.910% |
| Flat landings / width taper | 30 / 100 m at each end | Map convention |

Reference photographs inspected: [Oak St Bridge and Fraser River](https://commons.wikimedia.org/wiki/File:Oak_St_Bridge_and_Fraser_River,_Vancouver_(504732)_(23665221024).jpg), Robert Linsdell, CC BY 2.0; [Oak Street Bridge](https://commons.wikimedia.org/wiki/File:Oak_Street_Bridge.jpg), Mike from Vancouver, CC BY 2.0. Commons pages checked; both stay in ignored dossier scratch. No additional photos fetched and no textures or third-party meshes exported.

## Frame, construction and road fit

Origin `[-123.12556,49.19972]`; real metres east/up/south. Alignment is baked once from averaged mapped carriageways, including both curved approaches. The seven mainline ways are 24530021, 24530023, 24530033, 182607985, 182607986, 338171747 and 1274838145. The river-crossing bearing is approximately 148.5°. `FOOTPRINTS=[]` and `footprintless:true` deliberately avoid masking neighbouring buildings: road replacement is owned by the profile. The dossier shows no building extrusion on the mainline deck. The full outline contains interchange branches outside this model and is a reference rather than a building-removal polygon.

Local y=0 is the visual water/flat-map footing grade. No DEM is baked into the mesh. The existing absolute-deck policy fits each footing to terrain and the ramps to approach datums, retaining the river hump. Rigid steel width is unchanged by incomplete HD samples. Only the first/last 100 m narrow to the mapped roadway centres and live pavement widths; walk widths, divider and raised offsets fade to grade. A landmark-local layer uses the existing standard-road zoom widths and theme colors. No shared bridge extension was needed.

Both LODs preserve the five haunched strings, pier caps and twin-shaft openings. Near adds denser railing posts, web stiffeners, lane paint and lamp heads. Far drops paint, merges heads with the rails and samples the curves more coarsely. All longitudinal ribbons are closed and capped; named support triangle ranges test member contacts without allowing a member to validate itself. A shortened floorbeam is the negative control. Interchange forks, submerged piles and retrofit wraps are omitted.

## Validation evidence

Source contact sheet inspected: `tmp/top-cities/shots/oak-street-bridge/source/oak-street-bridge-procedural-near-light-sheet.jpg`, including both sides, plan, roadway, underside, pier detail and both landings. The muted yellow strings, open pier rhythm and clear four-lane deck match the supplied photo sheet. The first geometry cost check exceeded the far budget; reduced ribbon tessellation retained piers and haunches while bringing far below the cap. Export and in-app evidence will be recorded below after verification.

Cityscape and Full 3D world standard roads are verified locally as detailed below. HD pavement and lane dash continuity, full lifecycle matrix and real Tesla performance remain not tested.

Export comparison judged: `tmp/top-cities/shots/oak-street-bridge/exports/reference-comparison.jpg` combines the dossier photographs with near/far GLB sheets in light and dark. It includes side, reverse, plan, road, underside and close support views. The exported silhouette agrees with the source and retains open piers and all five strings far. No extra visual correction was needed after cost reduction.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 59,700 | 24 | 2,479,660 | 2421.5 |
| Far | 24,792 | 5 | 1,022,620 | 998.7 |

`qa-metrics.mjs` reports zero issues: no layered faces, coplanar overlaps, backface sweep hits or unsupported-member candidates. Both have identical bounds and top 34.249 m (lamps). `landmark-depth-layers.mjs --ids oak-street-bridge` generated zero dropped cycle edges; its check passes. Catalog validation, `pnpm assets:check` and local-only `pnpm assets:preview` pass. Landmark tests measure main spans, pier openings, four lane heights, actual named-support triangles for all rails/walkways/girders/floorbeams/poles and negative shortened-end control, mapped ownership in both headings, cross-road rejection, immutable terrain restoration and standard-road width/theme transitions.

## Application verification

Protomaps/OSM standard roads from tiles.codriver.io. World uses Terrarium 256 px tiles with maximum zoom 15. No gate changed. Captures are under `tmp/top-cities/shots/oak-street-bridge/{cityscape,world}/`: `oak-street-bridge-{far,near,street}.png` plus `approaches/spot-{north-forward,north-reverse,south-forward,south-reverse}-near.png`. These unobstructed views and both approach sheets were judged; they show tapered ground connections without a square slab nose or duplicate provider structure. The river structure remains raised in both modes.

Each approach report records 42 in-range mapped roadway vertices, checked in both travel headings: all are owned, and every perpendicular/crossing and off-road probe returns null. The following live `window.__map.landmarks.heightAt(lng,lat,heading)` numbers are metres relative to local queried ground; west/east refer to negative/positive profile lateral centres, and both headings give identical values. World retains its estimated absolute 26 m crest, so values differ with the DEM below it.

| Sample | Cityscape west / east | World west / east |
| --- | --- | --- |
| North foot, station 1 | 0 / 0 | 0 / 0.347 |
| North landing, station 60 | 0.725 / 0.725 | 4.968 / 5.102 |
| North steel limit | 24 / 24 | 17.323 / 17.269 |
| River crest | 26 / 26 | 22.677 / 22.430 |
| South steel limit | 24 / 24 | 19.161 / 18.955 |
| South landing, 60 m inside | 0.374 / 0.374 | 1.419 / 1.513 |
| South foot, 1 m inside | 0 / 0 | 0.141 / 0.072 |

Both modes use the same fitted pavement envelope and deck API. All 1,584 sampled zero-weight footing vertices meet the world DEM within ±0.000000466 m. World is active with terrain available at all four approach captures. The north approach road datum is 15.107 m, south 7.439 m; neither is baked into the export. The existing centreline road datum leaves up to 0.347 m across-width residual at the foot, disclosed as a renderer limitation rather than a survey. Terrain clamps prevent the pavement going below the sampled ground.

Final focused registry plus landmark run: **613 passed, zero failed**, with the landmark alone finishing in about 1.3 seconds. Semantic web-stiffener contact coverage was then added without changing any exported vertices; the seven landmark tests passed again. QA metrics, catalog, asset checks, preview and depth-table check all pass, with no shared check failures.

| Case | Status / limit |
| --- | --- |
| Cityscape near/far and both approaches in both headings | Verified with standard roads |
| Full 3D world near/far and both approaches in both headings | Verified with Terrarium; small transverse foot residual above |
| Per-footing DEM and named structural terminal contacts | Verified; every named host uses actual triangle ranges |
| Common route/car/camera height API | Live height API verified; full driven navigation session not tested |
| HD pavement, stripe phase and paint toggles | Not tested; local lane endpoint returns 503 without Redis |
| Night in app, load failure, delayed terrain, mode/reanchor/disposal matrix | Not tested; existing shared lifecycle retained |
| Tesla hardware cost | Not measured |
| Independent review | Required before publication |

Only this landmark's source, three exports, catalog fragment and document are committed. No shared bridge source extension was required. App bundles, local inspection pages, reference images and capture scripts remain uncommitted. Both local servers are stopped by their recorded PIDs after capture completion.
