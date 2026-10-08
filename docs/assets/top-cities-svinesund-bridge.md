# Svinesund Bridge, Halden / Strömstad

Original procedural model of the **new 2005 E6 crossing** over Iddefjorden at the Norway–Sweden border. The 1946 stone bridge in dossier image 1 and the foreground of images 3/4 is a different structure. Recognition comes from one tapered white concrete arch in the open slot between two steel motorway decks, six hanger pairs, four central Swedish viaduct columns and one Norwegian column. The national border creates no geometry seam or extra object.

## Sources and dimensional convention

| Feature | Model | Evidence |
| --- | ---: | --- |
| Structural length | 704 m | [Aas-Jakobsen, bridge designer](https://www.aas-jakobsen.com/project/svinesund-bridge-2/) and [fib structural paper](https://www.fib-international.org/news/198-2007-4-abstract-5.html) |
| Single arch span | 247 m | Aas-Jakobsen; fib gives the more precise 247.3 m |
| Swedish approach / arch / Norwegian approach | 337 / 247 / 120 m | [Trafikverket official project report, elevation diagram](https://trafikverket.diva-portal.org/smash/get/diva2:1389783/FULLTEXT01.pdf) |
| Each carriageway | 11 m; two lanes | [KTH monitoring report](https://kth.diva-portal.org/smash/get/diva2:431868/FULLTEXT01.pdf) |
| Central open slot | 6 m | Steel-superstructure description, [TRB record](https://trid.trb.org/View/944442); agrees with OSM lateral separation |
| Arch crown cross section | 4 × 2.7 m | KTH monitoring report |
| Arch foot cross section | 6.2 × 4.2 m | KTH monitoring report |
| Hangers | Six pairs; 25.5 m between pairs | [SEH Engineering, steel contractor](https://seh-engineering.de/referenzen/svinesund-bruecke-norwegen-/-schweden); 30.48 m end bays and 188.46 m suspended segment |
| Approach columns | Four Swedish, one Norwegian; typical 75 m bays | SEH and Aas-Jakobsen |
| Real road / crown / arch-foundation datum | Approximately +59.9 / +91.7 / +28.3 m | KTH monitoring material; section sizes and datum are engineering-reference values, not a new survey |
| Local flat deck / crown | 31.6 / 63.4 m | Real datums minus 28.3 m; explicit flat-map foundation convention |
| Artificial flat ramps | 450 m each; maximum 7.71% | Authored compromise; constant grade with 40 m vertical easements |
| Girder depth / pier section / lamps | 2.6 m / 2.8–3.8 m / 8.1 m | Visual estimates from supplied photos |

The contractor's listed individual spans sum to about 694 m, while its total and the official report give 704 m. The model pins 704 m and the official 337/247/120 division; the approximate pier stations 68, 143, 218, 293 and 632 m are not a surveyed set of support coordinates. The suspended deck junctions are 363.27/551.73 m from the Swedish structural start. The arch uses a circular centerline chosen from the span and rise, with vertically oriented tapered box sections rather than the precise engineering curve or hollow interior. Crown/foot section thicknesses and total height remain explicit.

The three primary web pages and the indexed engineering reports were checked on 2026-10-08. Some PDF fetches timed out; dimensions were available in their indexed text/diagram descriptions, so exact plate/page review remains a source limitation. No scanned drawing or existing mesh was imported or traced.

## Frame, footprint and road surface

Metres east/up/south around `[11.2518319, 59.0943680]`, the modeled arch midpoint. Road geometry comes from the two independently mapped OSM carriageways and their connected approach roads, sampled by physical station and averaged; original controls and way IDs are retained in `svinesund-bridge-alignment.js`. The arch bearing is approximately 351.79° northbound. Rotation is baked once; latitude stretch belongs to the renderer.

Structural start/end are stations 450/1154 m within a 1604 m approach-inclusive profile. Arch feet are stations 787/1034 m, approximately `[11.25214035,59.09327009]` and `[11.25152470,59.09546628]`. All members, road acceptance, navigation and camera height queries share this station/lateral frame. Road bands are `[-13.25,-3.75]` and `[3.75,13.25]` m; the middle slot and perpendicular roads are rejected. No shared bridge module was changed.

`FOOTPRINTS` contains the two mapped `man_made=bridge` outlines, ways 978465305/978465306. No building parts were present in the supplied extract. Those rings describe the structural decks, not the arch foot spread or added flat-map ramps; the profile's bounded 36 m corridor owns those additions and road replacement. The model's 11 m slabs are slightly wider than the coarse mapped outlines. The Swedish curve follows the mapped approach rather than a straight extrapolation.

`layer.js` exports the shared registry bridge layer with one landmark-local subclass selecting the separate real +59.9 m surface when terrain is resident. `absolute-deck` preserves the fjord banks and avoids corridor flattening. Feet have attachment weight zero; columns/low arch sections interpolate, while deck, girder, rail and high arch vertices have weight one. Shared fitting always starts from immutable authoring coordinates. Footings meet the sampled DEM in world; the arch and deck remain structural rather than draping over the riverbed. Deck slab toes embed to −2.9 m in flat grade; this is intentional, not floating structure.

## Geometry, materials and LODs

One closed swept concrete arch, two independent box decks, open guardrails, crossbeams, central tapered columns with crossheads, arch footings, six hanger pairs and slender inner-edge luminaires. Near adds girder lower webs, dense rail posts, hanger shoes, bearing blocks and two-lane fallback paint on each deck. Far keeps all hanger pairs, the center gap, arch, five columns, main crossbeams and lighting silhouette; it reduces arch and railing samples and drops fine webs, shoes and paint.

Eight named light/dark materials: warm off-white arch, neutral concrete, grey-green girder, dark asphalt, metal rails, grey hangers, pale paint and warm self-lit lamps. Repeated members merge by material into four useful station chunks near; far merges globally into seven draws. Texture-free GLB 2.0, ordinary materials, no decoder or required extension. The arch's hollow engineering box, bolts, expansion joints, exact lamp optics and surveyed pier tapers are omitted. Night lighting is an estimate, not a lighting survey.

## Export costs and visual verification

| Export | Triangles | Mesh draws | Uncompressed bytes / KiB |
| --- | ---: | ---: | ---: |
| Near | 57,868 | 25 | 2,629,352 / 2,568 |
| Far | 18,196 | 7 | 703,180 / 687 |

Both fit the 120k/40/4.5 MB near and 30k/10/1.2 MB far caps with headroom. Scene costs are not Tesla hardware or total-map benchmarks.

Opened the supplied `refs-sheet.jpg`, then `tmp/top-cities/shots/svinesund-bridge/first/svinesund-bridge-procedural-near-light-sheet.jpg`. The first model showed the right single-arch / twin-deck structure; redundant station samples were reduced, fine lower webs were restricted to elevated structural spans, and shaft-to-crosshead contact was tightened. Final `final-reference-comparison.jpg` was opened and judged: supplied new-bridge photographs beside exported near-light, far-light, near-dark and far-dark contact sheets. Every export sheet includes overview, both sides, above, driver, underside, arch detail and approach. The reference slot and arch negative space survive far LOD. The above view emphasizes the road slot; it does not frame the complete 1.6 km ramps at once.

Reference-only images are in the lead's ignored dossier: *Svinesundsbrua.jpg*, Håkon Aurlien, CC BY-SA 3.0 (Commons author/licence checked); *Svinesund bruene.jpg*, John Erlandsen, CC BY 2.0; *Hjelmkollen utstikt mot svinesund (1).jpg*, TommyG, CC BY-SA 3.0 (latter two metadata from dossier; web fetch unavailable). Original stone-bridge image excluded. Full links and attribution are in the catalog record; no photos/textures are committed.

Focused tests pass **213/213**: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/svinesund-bridge/svinesund-bridge.test.js`. Specific tests raycast both outward crown sides, the thin crown, true road gap, two road surfaces, unobstructed suspended span, single central piers and all twelve hanger bottoms, and verify approach grades, both headings, cross-road rejection, fixed toes and `_BRIDGELIFT` GLB round trips. The tests run below two seconds in isolation. `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and `pnpm build:peregrine` passed. `tmp/top-cities/svinesund-bridge/qa-metrics.json` reports zero issues, zero different-material coplanar overlaps and zero backface hits in its deterministic 81-ray sweep.

## Local application evidence

Local bundle `4886a713e653`; app 3270 / terrain 3272, Protomaps standard tiles from `tiles.codriver.io`, Terrarium 256 px DEM up to zoom 15. Opened `tmp/top-cities/shots/svinesund-bridge/app-modes-sheet.jpg`: Cityscape and world far/near/street captures. Both modes load near/far assets and replace the generic standard-provider bridge; the open central slot and white arch remain visible. The default world street camera centers on terrain and can crop the elevated deck at the top of the image, so it is not a vehicle-level camera certification.

Cityscape: **verified locally for standard-provider loading, road placement and both approach directions**. Full 3D world: **verified locally for model loading, DEM fitting, both approach directions and transverse ramp-toe contact after the owned correction below**; surveyed support datum, actual HD overlay, live route/car motion and lifecycle rollout are not certified. Local `/osm-lanes` returns 503 without Redis, so HD lane layout, dash phase and paint toggles remain not tested. Guest account CORS/API errors do not prevent the static landmark or terrain from loading. No rollout gate or online staging was changed.

Opened `approaches-sheet.jpg` with Swedish/Norwegian structural approaches in both travel directions and both modes. Cameras are 20 m outside each structural end at stations 430/1174 m, lateral ±8.5 m, bearing taken from the local mapped tangent and reversed for the other direction. Flat pavement is continuous across these authored deck/approach transitions; generic provider walls do not duplicate the landmark. Standard-provider road widths and fallback shoulders differ; live HD width matching remains untested.

`surface-cityscape/surface-check.json` and `surface-world/surface-check.json` contain the camera coordinates, mode readiness and live `window.__map.landmarks.heightAt(lng,lat,heading)` samples. Numbers below are metres **above the terrain at the queried carriageway**, not sea-level elevations; forward and reverse headings give the same values. Lateral 0 (central slot) and 22 m (outside bridge) return null throughout.

| Station m | Cityscape west / east | Initial shared-only world west / east |
| --- | ---: | ---: |

| 0 | 0.00000 / 0.00000 | -1.33366 / 1.31885 |
| 225 | 15.80000 / 15.79612 | 0.47664 / -0.43562 |
| 450 | 31.59993 / 31.60000 | 2.00779 / 2.74113 |
| 910.5 | 31.60000 / 31.60000 | 59.89079 / 59.89510 |
| 1154 | 31.60000 / 31.60000 | 4.90279 / 9.10052 |
| 1379 | 15.80000 / 15.80000 | 4.04935 / 4.53853 |
| 1604 | 0.00000 / 0.00000 | -3.52305 / 3.08875 |

Cityscape height checks meet zero at both road-center ramp toes, 31.6 m on both structural carriageways, and the expected smooth ramps. World terrain is resident (`ground:true`, `terrainReady:true`), with centerline endpoint DEM elevations 62.73130/47.68262 m and main deck +59.9 m, approximately 59.9 m above the fjord DEM. The initial world check **failed approach continuity**: the shared absolute-deck fitter uses centerline DEM samples to keep a common transverse deck height, while lateral ground varies. The western toes return −1.334/−3.523 m and the eastern toes +1.319/+3.089 m relative to their own ground, and world screenshots show patches of ramp pavement buried by terrain. These are real observed defects, not passing integration evidence. The initial shared-only fit was corrected below with a landmark-owned adapter; no shared file was edited.

Default app world street captures can point below the elevated deck; near overview and the structural-approach captures establish model placement, not a driven vehicle camera. No moving car/route or failed-load/mode/reanchor stress test was performed. Catalog readiness records source/export readiness separately from this known world integration limitation. Servers are stopped at handoff; generated shared renderer bundles are excluded and restored before the landmark commit.

### Both-landing terrain correction

The landmark-owned layer applies a transverse terrain fit to both artificial ramps after each immutable shared refit. Stations 0–80 m and 1524–1604 m follow the local DEM plus the measured provider approach height; a C1 blend over 80–450 m and 1154–1524 m returns to the absolute structural deck. The accepted surface never dips below local ground, and the 704 m structure retains the published +59.9 m road datum. Model vertices, height queries used by vehicle/camera/route and newly arriving/refitted HD pavement/paint overlays use this same rule. A world-only asphalt/paint polygon depth bias (factor/units −4) resolves interference between the terrain and pavement triangle lattices without lifting navigation artificially. Cityscape restores both the original positions and material depth settings bit-exact.

The two added focused tests raycast the fitted pavement at both landings and both lateral road centers, compare it to the live layer/route surface, repeat terrain revisions and mode/LOD refits, verify exact flat restoration and test synthetic HD surface/paint offsets 0.06/0.08 m. Actual HD remains unavailable locally. The pattern follows the coordinator's explicit reference to Port Mann's owned landing adapter, adapted here to two ramps and the separate real-elevation profile. No other landmark or shared source was modified.

Opened `fixed-world-approaches-sheet.jpg`: both structural approaches and both ramp toes in both directions, eight captures from the updated bundle. World pavement no longer has the buried patches observed before the correction; zero toe offsets replace the prior −3.523/+3.089 m northern mismatch and −1.334/+1.319 m southern mismatch. All eight captures report the landmark active, ground resident and terrain ready, with no page errors. `surface-fixed-world/surface-check.json` and `surface-fixed-cityscape/surface-check.json` record final live heights, coordinates, and mode readiness. Additional CLI ad-hoc `--at` toe captures are in `world-toe-cli/`; its `active:false` refers to looking up the custom spot name, whereas the dedicated collector correctly resolves `landmark:svinesund-bridge` and reports active.

| Station m | Final world west / east, both headings |
| --- | ---: |

| 0 | 0.00000 / 0.00000 |
| 225 | 0.16223 / 0.00000 |
| 450 | 2.00779 / 2.74113 |
| 910.5 | 59.89079 / 59.89510 |
| 1154 | 4.90279 / 9.10052 |
| 1379 | 1.37826 / 1.54475 |
| 1604 | 0.00000 / 0.00000 |

The reported zero at station 225 on the eastern ramp is intentional ground following, not a rejected query: negative clearance is clamped into the same DEM-following pavement fit. At the structural ends the two clearance numbers differ because the deck is rigid at +59.9 m and local terrain differs; that is not a step between carriageways. Provider ribbons change width/colour at the outer toes; exact HD lane/paint continuity remains untested. Near/far source and exports are unchanged by the runtime-only correction.
