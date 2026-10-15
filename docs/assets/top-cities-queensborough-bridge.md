# Queensborough Bridge

Original procedural model of the modern Highway 91A bridge between New Westminster and Queensborough (Lulu Island), across the North Arm of the Fraser River. This is the 1960 highway crossing with the later curved southern approach and four-lane/sidewalk modifications, not the neighbouring Queensborough Railway Bridge or New York's Queensboro Bridge. `SPEC.ready = true` describes the exported asset; the verification scope below describes the application evidence.

## Sources and dimensions

The engineers' [TAC 2009 paper, Modifications to Queensborough Bridge](https://conf.tac-atc.ca/english/resourcecentre/readingroom/conference/conf2009/pdf/Harvey.pdf) is the main structural reference. Its description supersedes the generic “arch bridge” classification and historical length in the dossier's Wikipedia infobox. The primary river structure has **two steel plate girders**, transverse floor beams and a lightweight concrete deck. The approach viaduct girders are reinforced concrete. The pair of deep haunches is part of the girder profile; this model has no separate arch ribs.

| Property | Value | Basis |
| --- | --- | --- |
| Opening | 1960 | TAC engineering description |
| River spans | 61 + 91 + 61 = 213 m | TAC, three continuous spans |
| Modern bridge length | 847 m | TAC abstract; model mapped slab is approximately 843 m |
| Historical length | 920 m engineering description / 924 m encyclopedia | Earlier arrangement; not imposed on today's mapped endpoints |
| Approaches | Originally 27 southern spans about 18 m; 11 northern spans 18/24 m | TAC; later spans removed/replaced |
| Sidewalks | 1.6 m; west north section described as 2 m | TAC; model uses 1.6 m, widening omitted |
| Navigation | 23 m vertical clearance, 85 m channel | [DFO PAC 201, 2026, chapter 4 paragraph 140](https://publications.gc.ca/collections/collection_2026/mpo-dfo/Fs74-68-2026-1-eng.pdf) |
| Central road datum | 26 m | Estimated clearance plus deck/girder depth; visual datum, not a tide/survey datum |
| Overall envelope | About 22 m | OSM outline and mapped sidewalk spacing; no survey or calibrated aerial width available |
| Road ribbons | Two 6.9 m carriageways with central separation | Estimated from mapped roadway/sidewalk separation; two lanes per direction |
| Main girder depth | 1.65 m at midspan, 4.85 m at interior piers | Photo estimate; bottom flanges add 0.16 m |
| Highest lamp | 35.49 m | Estimated 9.4 m above the central road |
| Complete fitted alignment | 999.98 m | OSM-derived structure plus connected approach roads |

The working dossier is `tmp/top-cities/queensborough-bridge/` in the lead checkout. Its sheet's third photo shows the **railway bridge** and was excluded. References compared directly: [Queensborough Bridge, Deadkid dk, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Queensborough_Bridge.jpg) and [The Queensborough Bridge, Dennis Sylvester Hurd, CC0](https://commons.wikimedia.org/wiki/File:The_Queensborough_Bridge_(75671689).jpg). The file-page licences were checked. TAC figures provided modern sidewalk separation and interchange context. The photographs and PDF remain ignored reference material; none is embedded or committed.

## Geographic frame and authoring

The anchor is `[-122.94718, 49.19642]`; vertices are metres east/up/south, with orientation baked from the mapped OSM roadway controls. `queensborough-bridge-alignment.js` retains literal mapped carriageway/path coordinates. The centerline averages the opposing carriageways at their common latitude controls and follows the southern curve. The structural slab runs from station 131.994 to 975.305 m. Estimated river support stations are centered 30 m south of the encyclopedia coordinate; the engineer-sourced span distances remain exact. Pier positions and sections are photo-based estimates, not surveyed positions.

OSM outline [1022953407](https://www.openstreetmap.org/way/1022953407), main roadway ways 35345045 / 35487330 / 24529904 / 1059628152, and the connected road/path ways are enumerated in `OSM_WAYS`. The eastbound Stewardson exit branch, adjacent railway, surrounding interchange and buildings are not authored. The inherited bridge replacement retains directional ownership and does not claim those unrelated roads. Footprints include the mapped bridge outline and explicit authored sidewalk/landing ribbons; the model passes the declared footprint-envelope test.

Materials are muted grey-green steel, grey concrete, galvanized rails and shared road pavement colours. Steel web stiffeners, bottom flanges, floor beams, repeated three-column approach bents, paired massive river shafts, separated sidewalks and curved light standards provide the recognizable structure. Near uses three longitudinal batches; far merges batches, reduces rail post density and drops lane paint and one intermediate rail. Both retain the river openings, haunches, lamps, paths and supports.

## Surface and terrain contract

`layer.js` exports the shared registry bridge layer, with a landmark-local fallback pavement colour blend. Its generator imports no app runtime. The shared layer supplies GLB loading, unlit vertex shading, reversible road replacement, navigation height and terrain fitting. No shared bridge implementation was modified.

River structure width is rigid: `fittedLateral` is identity. Only the approach zones narrow the pavement, median and barriers toward the mapped carriageway centres and two 6 m standard-road ribbons. Pavement blends from the HD-style deck colour to the live standard-road colour at ground connections. The north blend and median taper now finish 10 m before the physical structural nose, with exact sampling knots in both LODs, so two separate provider-colour ribbons complete the landing. Sidewalks follow their own mapped hairpin/descent connections and end in posts at ground, rather than continuing across the highway landing noses.

Cityscape uses 15 m flat landing runs and 18 m vertical transition curves. The southern rise to the steel section is 553.1 m and its maximum grade is **4.86%**. After g1b review, Cityscape starts its 347.9 m north descent at station 637.063 m, just beyond the southern navigation pier, for a maximum **7.88%** grade. This spreads the flat-map slope through the river unit and avoids extending raised ramps into the split mainland interchange. The authored/exported model and Full 3D world retain the original level 26 m river roadway; only Cityscape uses the broader descent. Full 3D world uses `absolute-deck` with local terrain contacts and no corridor flattening: support feet stay on the DEM, shafts stretch, and road approaches blend into the terrain. The centreline and lateral terrain clamp are the existing shared policy.

## Export and visual evidence

| LOD | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 52,200 | 17 | 1,968,644 | 1,922.50 |
| Far | 18,736 | 5 | 705,320 | 688.79 |

Both are self-contained texture-free GLBs within the bridge budgets, with normals, named materials, and `_bridgelift` attachment weights retained. Far bounds differ by less than 0.004 m horizontally. Costs exclude provider roads, terrain and any future live HD overlays; Tesla hardware was not measured.

Looked at these ignored local artifacts:

- `tmp/top-cities/shots/queensborough-bridge/procedural/queensborough-bridge-procedural-near-light-sheet.jpg`: source overview, both sides, roof, deck, underside and pier/girder detail.
- `tmp/top-cities/shots/queensborough-bridge/final/reference-export-sheet.jpg`: reference photographs beside final exported near/far, light/dark, both sides, roof, street/deck and haunch detail. The haunched silhouette and open navigation bay survive far LOD. Concrete approach bents replace a generic uniform steel viaduct interpretation.
- `tmp/top-cities/shots/queensborough-bridge/final/app-approaches-sheet.jpg`: eight unobstructed app views, both approaches in both directions and both modes; full individual PNGs remain alongside the sheet under `cityscape-approaches/` and `world-approaches/`.
- `tmp/top-cities/shots/queensborough-bridge/{cityscape,world}/queensborough-bridge-{far,near,street}.png`: normal renderer, near/far loading and shared shading. The full `near.png` images in each mode and both northern/southern landing images were read directly.
- `tmp/top-cities/shots/queensborough-bridge/{cityscape,world}-approaches/forced-far.png`: far model forced at driver zoom.

The first geometry check found sidewalk concrete crossing the fallback pavement. Road edges were narrowed to the mapped sidewalk separation, and the inner intermediate sidewalk rail was removed where it intersected the concrete traffic barrier. Fresh exports have **zero material cycles**, zero coplanar warnings, zero back-face sweep hits and zero unsupported-member warnings. Named-support tests also caught and fixed an approach girder/cap gap and an unsupported sidewalk bracket before the slab began.

## Application verification — 2026-10-14

Own feature worktree, source baseline `55180ebf`, local slots Cityscape 3270 and world 3272. Protomaps roads from `tiles.codriver.io`; world uses AWS Terrarium at max zoom 15. The test grant is the existing `app-shot.mjs` mechanism. The standard app was built with `pnpm build:peregrine`; generated app bundles and depth table are excluded from the landmark commit.

**Cityscape: verified for standard roads. Full 3D world: verified for standard roads and terrain contacts.** Both approaches, both directions, normal near/far/street shots and forced-far shots were captured. No duplicate main provider bridge or gap at the connected road taper is visible in this matrix. Authored lanes provide fallback paint; live HD paint/dash continuity is not verified.

`window.__map.landmarks.heightAt(lng, lat, heading)` readings in metres, each identical for the two aligned headings at the listed station:

| Point | Cityscape | Full 3D world |
| --- | ---: | ---: |
| Southern structural landing, s = 131.994 | 5.247706 | 3.614445 |
| Northern structural landing, s = 975.305 | 0.363731 | 2.448134 |
| Main navigation midpoint, s = 674.563, opposite carriageways | 26.000000 / 26.000000 | 21.782180 / 21.782237 |
| Northern profile endpoint, s = 999.982 | 0.000000 / 0.000000 | 0.000000 / 0.012431 |
| Off bridge `[-122.94718, 49.1952]`, heading 55° | null | null |

World `heightAt` is the accepted lift above the query terrain, not absolute elevation. `evidence.json` in each approach folder retains every point/heading and the live terrain approach datums. All **47 mapped in-range roadway vertices** were accepted in both headings in both modes. The supplementary `dense-survey.json` adds 20 m samples, the main midpoint and the exact endpoint: **151 locations**, all accepted in both headings/modes; the northern end residual lift is at most 0.013 m. Full world sampled **1,904 zero-weight, authored y=0 footing vertices**, each against its own DEM coordinate; the maximum absolute residual was **0.00000105 m**, with the full per-vertex records in world `evidence.json`. These are checks against the application's sampled terrain, not survey accuracy.

## Validation and limits

- Focused acceptance command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/queensborough-bridge/queensborough-bridge.test.js` — **771 passed, 0 failed**. Landmark tests cover actual deck/opening rays, haunch geometry, footprint envelope, named member/support contacts in both LODs, a free-end negative case, mapped roadway ownership/crossing rejection, rigid width, gradients and GLB fitting attributes/bounds.
- `node scripts/asset-catalog.mjs` / `pnpm assets:check` — 406 entries, 662 GLB variants valid. `pnpm assets:preview` built the ignored inspector.
- `node scripts/landmark-depth-layers.mjs --ids queensborough-bridge --check` — current, zero dropped cycle edges. Lead must regenerate this shared generated file after cherry-picking.
- `qa-metrics.mjs --ids queensborough-bridge` — both LODs **ok**, zero listed issues.

Remaining limits: elevations, pier coordinates, section sizes and deck width are visual/mapped estimates; the modern widened 2 m west sidewalk section and highway sign gantries are omitted. Southern concrete approaches retain an approximately 18 m bent rhythm rather than every altered historical span. Full 3D world uses the shared bank clamp, with no separately measured live-HD crossfall. Live HD lane service returned 503, so HD pavement/paint, driven route/car/traffic lifecycle, paint switches, theme switching in the app, load-failure/reanchor cases and hardware performance remain not tested. Local servers are stopped after captures; no online staging or library publication is performed.

## g1b independent review corrections

The Cityscape north descent was 13.98%. It now begins earlier on the existing mapped crossing and runs 347.9 m with 18 m transition curves, limiting the grade to **7.88%**. Keeping this mode-specific avoids claiming or widening the surrounding interchange and retains the level river crossing in the source GLBs and Full 3D world. The landmark-local mode surface also refits the initial asynchronous load before display, so the actual mesh, road overlays and navigation agree immediately; a focused regression raycasts that initial mesh against accepted road height. No shared bridge source changed.

The north pavement blend and median split are complete by station 965.305 m, **10 m before the structural nose** and 34.7 m before the final ground connection. All final ribbon vertices use the provider road colour. Both LODs now have eight **1.2 m stepped bearing seats**, 4.8 × 5.2 m, above the massive river shafts; existing caps remain connected. Far sidewalk/hairpin slab edges are **0.4 m** thick, clipped to ground at their endpoints. No model photography or texture was introduced.

Compared with the reviewed exports, near changes from 51,944 / 17 / 1,958,844 bytes to **52,200 / 17 / 1,968,644**; far changes from 18,504 / 5 / 696,192 to **18,736 / 5 / 705,320**. Both exported near/far contact sheets were judged in `tmp/top-cities/queensborough-bridge/review-final-{near,far}/`; stepped seats, plate girder haunches, slab thickness and open span rhythm remain legible. Geometry QA reports zero issues, and depth ordering has zero dropped edges. Eight focused checks pass, including near/far named member contacts, immutable mode fitting and initial runtime load; the combined registry run before the extra initial-load regression passed 783 tests.

Cityscape and Full 3D world are **verified for these standard-road approaches**, with **167 roadway points per mode accepted identically in both headings**, no outside-road ownership, and empty page-error lists. World checks **1,904 ground-contact vertices** against their DEM locations; maximum absolute residual is **0.00000105 m**. Camera targets can lie in the median gap; the capture metadata samples a declared carriageway point, with both carriageways included in the dense rows. Cityscape also retains the original median-target null readings explicitly. The eight focused checks additionally exercise world-to-Cityscape surface restoration. Complete live HD paint and driven route/traffic remain not tested. Previous application values above are pre-review measurements; current Cityscape heights follow the broader descent.
