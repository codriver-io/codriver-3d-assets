# High Level Bridge, Edmonton

Original procedural model of the current black-painted 1913 bridge across the North Saskatchewan River, with lower two-lane southbound road and upper seasonal streetcar track. No reference imagery or third-party mesh is shipped.

## Sources and dimensions

[City of Edmonton heritage fact sheet](https://www.edmonton.ca/sites/default/files/public-files/documents/HighLevelBridgeFactSheet.pdf), retrieved 2026-10-14, is the dimensional authority. [Edmonton Radial Railway Society](https://www.edmontonstreetcars.ca/high-level-bridge5d312111) describes construction, the four concrete river piers, former three tracks and the surviving central streetcar track. The dossier photographs include Chris Woodrich’s 2026-09-27 image (CC BY-SA 4.0) and the Provincial Archives of Alberta historic view (no restrictions); titles and licences are recorded in the catalog. Dossier OSM geometry provides the roadway, two north feeds, paths, upper tram and bridge outline; attribution © OpenStreetMap contributors, ODbL 1.0.

| Dimension | Model / source | Status |
|---|---|---|
| Historic total length | 2550 ft / 777.24 m | Published; mapped roadway including curved end sections measures 792.56 m |
| Upper rail deck base | 156 ft / 47.5488 m above mean water | Published |
| Deck separation | 20 ft / 6.096 m | Published |
| Lower road | 41.4528 m above local valley datum | Derived from published deck levels |
| Deck width | 39 ft / 11.8872 m | Published; mapped path-centre spacing about 9.7 m corroborates envelope |
| River spans | 3 × 288 ft / 87.7824 m | Published |
| Maximum authored height | 54.35 m, catenary standards | Estimated |
| World road altitude | 657.5 m | Estimated from river-valley elevation; not surveyed |
| Main road / eastern feed width | 6.7 / 4 m | Estimated from mapped lane counts and path positions |

## Frame and modeling

Local origin `[-113.51109,53.53018]`, +X east, +Y up, +Z south; y=0 represents valley/mean-water grade in the reusable export. Rotation follows OSM 22915822, approximately 199° southbound. Neither latitude scale nor terrain heights are baked into GLBs. Source is self-contained (Three.js, asset-geometry and bridge-profile only).

Three deep Pratt spans, four tapered concrete river piers, paired black trusses, transverse portal crossheads, tall splayed X-braced steel land trestles, lower pavement and concrete paths, railings, timber upper deck, standard-gauge rails and overhead standards/wire distinguish the bridge. River members retain the 87.78 m span rhythm in far detail. Near adds smaller bracing, continuous handrails, catenary arms/wires, lane fallback and subdued fixed LEDs; far keeps the silhouette, openings and standards, with no rails, handrails, wire or secondary lacing. Far trestles use full-height two-sided flat X panels. At the south road divergence, a narrower timber track deck follows the mapped tram lateral onto three intermediate supports and a 14 m long, 5.2 m wide grounded retaining abutment; earth fill now backs that wall to the mapped bank ground. The terminal buffer is removed. Both tram ends meet planted fill rather than an exposed terminal tower or open bent; the export does not include the complete off-bridge streetcar route. The north rail deck follows the separate mapped tram alignment over its own short trestle and ends on a filled bank, while both road feeds curve underneath into the main truss; its offset from the road is pinned by a geometry test.

The generator partitions `main` and `fork` meshes for two unchanged shared registry bridge layers; no shared bridge code changed. Each owns a precise corridor, masks reversibly and drapes actual provider pavement/paint through the shared adapter. The main rigid span uses identity lateral fit; only landing zones taper to carriageway width. Both north feeds meet at the same road surface. The normal app source, no online staging, is used for verification.

## Vertical profiles

Cityscape ramps over the land trestles to the lower river roadway at 41.4528 m; north ramp 510.61 m, south ramp 456.47 m, with 18 m vertical curves. Steepest grades: 8.41% north, 9.45% south and 10.04% eastern feed. Approach slabs/paths taper over 55 m and meet loaded pavement; rails return through end posts. Full 3D world uses `absolute-deck`, a level estimated 657.5 m roadway between the mapped bridge ends, bank blends beyond them and per-vertex support footing contacts. No corridor flattening is requested.

## Verification

Source and exported GLBs were inspected beside the dossier photographs in `tmp/top-cities/high-level-bridge-edmonton/reference-export-sheet.jpg`; detail, opposite side, top, road, underside, near/far and light/dark views are in `final-glb-*` and `final-source/`. The inspections caused a southern track continuation to be added, the northern rail to be separated from the road fork, far slab sampling to be reduced, and support and walkway materials to be separated to eliminate a depth cycle. Final geometry metrics report no issues, with 0 dropped depth-cycle edges. Reviewed exports: near **78,048 triangles / 12 draws / 3,626.46 KiB**; far **11,978 / 10 / 320.83 KiB**. Previous costs were 72,860 / 25 / 3,117 KiB and 25,880 / 9 / 1,086 KiB respectively. The longer mapped ramps add near triangles while material merging removes fourteen draws and far simplification removes 55% of triangles and 72% of bytes. Geometry retains lifting attributes and normals through GLB export; no textures or decoders.

Focused landmark tests cover actual raycast deck separation, driver clearance, four river piers, main spans, all authored member terminals against separately named surfaces, deliberately shortened rail endpoint rejection, repeatable fitting, DEM feet, both-heading road heights and off-corridor rejection. An async runtime regression additionally loads both export partitions and checks the linked feeder mesh against navigation after approach changes. The initial app measurement found this mesh had collapsed on first load even though navigation was correct; the landmark-local layer now refits that partition after load and main-surface changes. Shared bridge files are unchanged.

The reviewed combined top-cities and landmark checks passed **781 tests**, including ten focused landmark tests. Catalog coverage (406 entries, 662 variants), `pnpm assets:check`, `pnpm assets:preview`, bundle build and depth-layer check passed. Local viewer output remains ignored.

Initial Cityscape and world far/near/street captures are in `app-city/` and `app-world/`; terrain-ready approach recaptures and height probes are in `probe-cityscape-hd/` and `probe-world-hd/`. Initial world frames preceded complete DEM coverage and are not terrain acceptance evidence. The final linked-feeder and HD recapture results follow.

## Final application evidence

**Cityscape: verified** for normal-map near/far loading, both structural approaches in both headings, bank landings, shared unlit shading, paint on/off and the height contract. **Full 3D world: verified** for the same cases with resident DEM, independent support feet and the separate real deck datum. No shared gate was changed. App road geometry is OSM lane synthesis from the supplied dossier in isolated disposable Redis; exact shared-node topology was recovered from identical coordinate pairs because the dossier omits node IDs. This verifies this corridor, not complete city tile coverage. Upstream Overpass was disabled for these offline captures.

At near zoom, the actual OSM HD adapter was active on both parts: 41 main-road cross sections and 7 feeder sections, with 6 main plus 2 feeder pavement/paint overlays in the diagnostic pass (additional cached overlays vary with tile coverage). Paint-off screenshots remove the lane lines and paint-on restores them; the lower roadway remains clear under the upper track. At final far zoom 15.2, HD deactivates normally: `far-final.png` and final `report.json` therefore document far fallback heights and loaded far models, while the four `north/south-{0,180}.png` images and `paint-{off,on}.png` show the near HD pass. The fixed feeder mesh reaches 23.24 m with the measured near HD approach pair; its navigation far-end matches the main bridge.

Images judged at full resolution: the final reference/export sheet; near/far light/dark sheets; `probe-cityscape-hd/{north,south}-{0,180}.png`, `probe-world-hd/{north,south}-{0,180}.png`, both modes’ `far-final.png` and Cityscape `paint-off.png`/`paint-on.png`. Bank landing captures are `north-landing-{0,180}.png` and `south-landing-{0,180}.png` in each probe folder; these predate only the upper-track alignment refinement, which leaves the road landings unchanged. All evidence paths are under `tmp/top-cities/high-level-bridge-edmonton/` in this worktree.

The original pre-review probes sampled **108 main and 34 feeder points per mode**, including every mapped profile vertex, 20 m main stations and 10 m feeder stations. Both headings agree at all 142 points; no point is null and all 142 transverse-heading probes return null. World `heightAt` is the accepted height above the current terrain, not sea-level altitude; the river road’s authored absolute datum is 657.5 m. Representative pre-review **far fallback** readings, metres:

| Station / point | Cityscape, both headings | World, both headings |
|---|---:|---:|
| North landing (0.00 m) | 0.000 | 0.000 |
| North structural end (149.96 m) | 16.635 | 7.531 |
| River pier 1 (369.27 m) | 41.453 | 37.894 |
| River pier 2 (457.05 m) | 41.453 | 40.148 |
| River pier 3 (544.83 m) | 41.453 | 37.004 |
| River pier 4 (632.61 m) | 41.453 | 33.323 |
| South structural end (942.52 m) | 13.005 | 2.164 |
| South landing (1089.08 m) | 0.000 | 0.000 |

The original terrain-ready far model checked 2734 fixed-weight footing vertices; residuals to the shared DEM were -0.00003 to 0.700 m (the positive 0.7 m is the modeled foundation thickness). Both LODs preserve support contacts; the final runtime async regression is exercised in the eight focused tests. Final console page-error list is empty. Local guest CORS/auth and unavailable optional tree services in the generic app-shot logs are outside model loading.

## Limits and handoff

Steel sections and lacing, pier taper, land-span subdivision, upper-deck planking, catenary and lights are estimates; rivets/gussets, vehicle streetcars and animated lighting are omitted. The 657.5 m world roadway elevation is an estimate, not a survey. The north rail is projected through the road station frame; both tram decks terminate on earth-backed bank abutments rather than supplying the complete off-bridge streetcar route. Fill shape and retaining shoulders are estimated from the mapped bank alignment; toe vertices meet the local ground function. Flat-map approach trestles and feeder piers are a representation of a valley without terrain, not the real bank elevations. Full car/route/traffic playback, all terrain-arrival/mode-switch/failure permutations, hardware performance, complete area HD data and surveyed clearances remain **not tested**; this does not claim those broader gates passed.

No shared bridge source changed. The generated depth table was regenerated for this ID and checked, with zero cycles; it is intentionally excluded from the landmark commit, as are generated public renderer bundles. No deployment or public-library publication was performed. QA servers and the isolated Redis instance are stopped after capture.

## Independent review fixes

The g1b review required a proper south tram termination, visible black lattice and a much lighter far model. The south track now has a continuous grounded retaining abutment and a terminal buffer, replacing the final isolated post. Timber is darkened to `#3a342d` and narrowed to 7 m, leaving 1 m open strips on both sides so steel upper chords remain visible. The two north feeds extend along exact OSM road ways 23237247, 27259193, 471835876 and 471835870; Cityscape main north maximum grade is now 8.41%, with the eastern feed reduced to 10.04%. The world rigid crossing datum remains 657.5 m.

Compatible batches are merged within each mapped road partition; roadway underslab retains its own steel-coloured material to avoid a concrete/steel depth cycle. Far drops running rails, handrails, wires, arms, lane paint, floor lacing and intermediate portals; full-height flat X braces preserve the trestle pattern, and welded far vertices reduce export size without reducing span silhouette. Simple overhead posts remain in far to preserve the authored height. Both exports have zero material cycles.

Review evidence is under `tmp/top-cities/high-level-bridge-edmonton/`: `review-glb-near/` and `review-final-far/` contain exported contact sheets; Final source/export acceptance: **781 tests passed**, geometry QA has zero issues, catalog 406 entries / 672 variants valid, and depth ordering has zero dropped edges. Fresh app captures show both structural approaches and both ground landings in both headings in Cityscape and Full 3D world, plus far and paint-toggle views. In **each mode, all 171 main/feed samples** are accepted identically in both headings and reject transverse headings; page errors are empty. The final forced-far terrain model has **1,120 planted vertices**, with DEM residuals from -0.000031 to +0.700030 m (positive thickness is the authored footing). Both modes are verified for the pictured standard-road approaches; HD is enabled for capture but complete live HD continuity and driven route/traffic remain not tested. Export sheets were inspected before the simple far overhead posts were restored for height silhouette; the final app far capture includes them.

## g1b2 streetcar bank correction

The second review found that grounding the south concrete wall alone still left a freestanding terminal tower, and that the north tram ended on an open bent. Both ends now have sloped earth banks in **both LODs**: fill crests touch the actual tram underside, and zero-lift toes remain planted at local grade in Cityscape and the independent shared DEM in world. Earth batter is 1:1.5 away from roads; tighter retaining shoulders stop before the lower main road and eastern fork, preserving their pavement. The south buffer is removed. Road profiles, structural members, dark timber and existing LOD simplification are unchanged; the eastern feed's 10.04% Cityscape grade remains outside this targeted terminal correction.

The first app recapture exposed fill over the north lower road in world; the final geometry trims the fill footprint around both precise road corridors. New tests inspect actual merged tram underside contacts, planted toes after world fitting, missing-crest negative controls and fill-triangle clearance from both roads. Original structural and road-height tests still pass. Final focused checks passed all 10 landmark tests and all 776 top-cities registry checks (786 total); catalog and depth checks also passed. Final exported geometry QA reports no issues or dropped depth edges.

Near changed from 77,750 / 11 / 3,702,000 bytes to 77,778 / 12 / 3,703,532 bytes; far from 11,680 / 9 / 316,516 bytes to 11,708 / 10 / 318,560 bytes. Both stay below the bridge caps. Final export contact sheets are `g1b2-glb-{near,far}-final/`; `*-landing-high-{0,180}.png` provides unobstructed road-join views above the adjacent north buildings; Cityscape and world tram-end, road-landing, far and paint-toggle recaptures are `g1b2-{cityscape,world}-hd/`, under this landmark's ignored dossier folder. This is local application evidence, with complete live HD, driven traffic, surveyed elevations and hardware performance still untested. The depth table and renderer bundle are regenerated for QA and excluded from the commit.

## g1b3 narrow tram embankments

The g1b2 earth meshes read as floating brown wedges in ordinary world views. Both LODs now use an **8 m crest**, sampled every 4 m along the mapped tram continuation, tapering longitudinally to grade. Neutral muted grass (`#b4b9af`, night `#4d5651`) replaces brown fill. The north bank follows OSM 219620022 beyond 463555601; the south follows 113767071, 1474789002 and 461598599. The adjoining geometry was obtained through two small OSM API map extracts after the shared Overpass helper timed out; saved under `g1b3-{north,south}-osm.xml` in the dossier scratch folder. These are original embankment estimates, not surveyed earthworks. No provider building is replaced.

The main layer refits only the earth toes after its usual surface fit: the horizontal batter is 1.5 times the actual crest-to-local-ground drop, constrained before the main/fork road corridors. This prevents a flat-map 29.5 m bank height from determining the width in the real valley. Short constrained sides act as retained shoulders. The 8 m crest remains on the tram alignment, every toe is independently ground attached, and fitting is repeatable. Road landings, lattice, road profiles and all other structural geometry are unchanged.

Measured before → after: near **77,778 / 12 / 3,703,532 bytes → 78,048 / 12 / 3,713,496**; far **11,708 / 10 / 318,560 bytes → 11,978 / 10 / 328,528** (triangles / draws / bytes). GLBs preserve per-section fitting metadata. Twelve own tests cover the unchanged structure and member contacts plus actual crest width, upward face winding, fitted toe slope/ground contact and repeatability; 783 registry tests pass. Catalog and depth checks pass with zero material-cycle edges dropped.

Exported near/day and far/night bank closeups were judged in `g1b3-glb-{near,far}-final/*-sheet.jpg`. `far-final.png`, paint captures and reports retain the unchanged corridor checks. Cityscape and Full 3D world are independently verified for these views; complete off-bridge streetcar operation, live driving/traffic, surveyed elevations and hardware performance remain untested.

The final reports accept **171 main/feed samples per mode**, with no page errors. The world far pass records 1,230 ground-attached vertices with residuals −0.000031 to +0.700030 m (the +0.7 m values are unchanged footing thickness); bank toes lie at DEM grade. Final app sheets: `g1b3-cityscape-app-sheet.jpg` and `g1b3-world-app-sheet.jpg`.
