# Lions Gate Bridge, Vancouver

Original procedural model of the current three-lane First Narrows Bridge, opened in 1938, with the 2001 replacement deck and north approach viaduct. Geographic frame: local metres, east/up/south, anchor at the mean mapped pylon centre; orientation baked into geometry. No textures or reference meshes shipped.

Sources and dimensions:
- [Parks Canada historic designation](https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=11273): three lanes, thin stiffening trusses, open tapered towers, north viaduct, distinctive decorative lights and the 1999–2001 replacement.
- [Canadian government backgrounder](https://www.canada.ca/en/news/archive/2010/05/lions-gate-bridge-national-historic-site.html): 187 m side spans, 659 m north viaduct, 0.37 m cables. Its 472 m main span and 118 m tower heights use differing rounding/datums; the model follows the dossier's 473 m and OSM's 111 m tower height.
- [Engineering paper](https://www.iitk.ac.in/nicee/wcee/article/6_vol3_2835.pdf): 473 m main span and 187 m side spans.
- [Wikipedia](https://en.wikipedia.org/wiki/Lions_Gate_Bridge): 111 m tower height, 61 m navigation clearance; this is a visual datum, not a survey.
- OSM/ODbL extract through the lead's shared helper on 2026-10-06: roadway 4755915, approaches and pylon outlines 497479010/011, pier 497479012; full list in footprint.js. Scratch extract: tmp/top-cities/lions-gate-bridge/road-osm.json.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Main span | 473 m | published |
| Side spans | 187 m each | published |
| Tower top | 111 m | dossier + mapped height |
| Cable diameter | 0.37 m | government backgrounder |
| Road surface | 64.4 m | estimated from 61 m clearance plus thin deck/truss |
| Truss underside | 61.0 m | clearance target |
| Roadway / deck width | 10.8 / 17.2 m | estimated current three-lane section |
| Cable low point | 68.5 m | photographic estimate |
| Piers, leg taper, portal and member sections | procedural estimates | reference photographs |

The mapped pylon centres are 455.7 m apart. The published main span is preserved by symmetric station adjustment, placing each tower about 8.6 m beyond its mapped centre. This uncertainty remains visible rather than rescaling the bridge. The mapped bridge roadway is a straight two-node way; the north departure and south causeway follow actual mapped vertices, without inventing a large curve absent from this data. A more detailed surveyed north alignment would improve the gentle curve.

Geometry preserves tapered chamfered tower legs, four X-brace panels per tower, arched pierced portal girders, saddle caps, catenary-like parabolic cables, regular suspenders, cable necklace lights, thin open deck trusses, pedestrian/cycle sidewalks, modern barriers and steel trestles on the north viaduct. Near is split into three station chunks; far merges the six materials and drops lamp poles, lane paint, flange detail and alternate suspenders/trestles. The footprint array is empty because the extract contains no building-tagged provider extrusions; road ownership uses the shared bridge profile.

Cityscape deck approaches ease from loaded roads over 900 m south and 730.334 m north; maximum smoothstep grades are 10.73% and 13.23%, respectively. Towers and footings stay fixed; approach shafts have graded attachment weights. Full 3D world uses absolute-deck, avoiding corridor flattening and using the common DEM-fitted approach surface. Cityscape and Full 3D world are verified locally with standard Protomaps roads; HD pavement/paint and actual vehicle driving remain untested (details below).

Omitted: the cast concrete Marega lions (not bronze), rivets, individual wires, detailed anchorage machinery, electronic lane-control signals and precise trestle engineering. No photos are committed. References judged from the supplied refs-sheet.jpg: Visit-World.com (CC BY-SA 3.0), dronepicr (CC BY 2.0), Tom Richards (two views, CC BY-SA 3.0), Penapox (CC BY-SA 4.0), Jack Lindsay (public domain); exact file links and attribution in the catalog.

## Costs and verification

| LOD | Triangles | Draws | Bytes | KB (1024 bytes) |
| --- | ---: | ---: | ---: | ---: |
| Near | 69,854 | 16 | 3,300,872 | 3,224 |
| Far | 25,022 | 5 | 965,560 | 943 |

Both LODs are under the bridge budgets. Near has three material/station chunks; far preserves the tower portals, X bracing, thin truss, cables and night lights. Eight landmark tests plus registry conformance pass: **158/158**; landmark tests alone take about 0.5 seconds. `node scripts/asset-catalog.mjs` validates 178 entries / 318 GLB variants; `pnpm assets:preview` builds the local inspector; `pnpm build:peregrine` succeeds. The deterministic exported-GLB check (`tmp/top-cities/lions-gate-bridge/qa-metrics.json`) reports both LODs **ok**, including no coplanar overlaps or back-face sweep issues.

Images actually read:
- Supplied dossier `refs-sheet.jpg` and `tmp/top-cities/shots/lions-gate-bridge/reference-export-comparison.jpg` (reference photographs next to exported near/far, light/dark views).
- `tmp/top-cities/shots/lions-gate-bridge/initial/lions-gate-bridge-procedural-near-light-sheet.jpg`: overview, both broadsides, above, road, tower detail, underside and north trestles.
- `tmp/top-cities/shots/lions-gate-bridge/final/lions-gate-bridge-glb-near-light-sheet.jpg` and the final near-dark / far-light / far-dark sheets: exported geometry comparison.
- `tmp/top-cities/shots/lions-gate-bridge/app-initial.jpg`, `app-approaches.jpg` and `world-final/` (local app, each LOD, street, each ramp foot viewed both directions).

Changes driven by these checks: raised the lower portal for >4 m traffic clearance; reduced far ribbon sampling to meet the budget; corrected portal extrusion handedness before render; clamped support attachment weights and made tower tops/cables use deck attachment in terrain; buried the ramp slab bottom by at most 0.25 m rather than sharing coplanar y=0 bottom faces with sidewalks. The last change affects buried faces only; the visible approach surfaces remain identical.

## Cityscape — verified locally, standard roads

Slot A server on port 3270, standard Protomaps pavement. Near/far models are active in the app; the provider's generic bridge deck is replaced. Both ramp feet meet provider pavement at zero elevation with no visible height step/gap; pavement colour/width changes at the seam remain visible. The authored fallback width is estimated; HD cross-sections must verify the exact live fit.

`window.__map.landmarks.heightAt(lng,lat,heading)` was probed at all 46 alignment vertices with both travel headings: **92/92 non-null**. It returns null 60 m beside the bridge and for a crossing heading. Shared deck heights:

| Station (m) | Cityscape heightAt (m) | World DEM (m) | World heightAt (m) | World absolute deck (m) |
| --- | ---: | ---: | ---: | ---: |
| 0, south ramp foot | 0 | 31.134 | 0 | 31.134 |
| 100 | 2.209 | 36.095 | 0 | 36.095 |
| 300 | 16.696 | 47.329 | 0 | 47.329 |
| 600 | 47.704 | 59.727 | 0 | 59.727 |
| 900, south anchorage | 64.400 | 52.366 | 12.034 | 64.400 |
| 1087, south tower | 64.400 | 0.203 | 64.197 | 64.400 |
| 1323.5, middle | 64.400 | 0 | 64.400 | 64.400 |
| 1560, north tower | 64.400 | 7.308 | 57.092 | 64.400 |
| 1747, north anchorage | 64.400 | 7.093 | 57.307 | 64.400 |
| 2000 | 46.570 | 8.411 | 43.700 | 52.110 |
| 2300 | 9.547 | 11.427 | 15.166 | 26.593 |
| 2477.334, north ramp foot | 0 | 20.013 | 0 | 20.013 |

Durable raw probes: `tmp/top-cities/lions-gate-bridge/probe-{cityscape,world}.json`. These verify the navigation surface used by route/car/camera; an actual driven route was not exercised. `/osm-lanes` returns 503 locally, so HD lane counts, dash phase and provider cross-section fitting are **not tested**. Local account API CORS/401/503 messages did not prevent static model loading.

## Full 3D world — verified locally, standard roads and Terrarium DEM

Slot A terrain server port 3272, AWS Terrarium z15, exaggeration 1, `--mode world`. The model is active in near/far and street views. Absolute-deck places the structure without a corridor flatten zone; supports follow DEM while the main deck stays at 64.4 m. Tower top remains **111.05 m** (111 m structural cap plus near beacon), as measured on the fitted runtime mesh. The south ramp follows the Stanley Park hillside until it clears the DEM; its absolute surface never falls below sampled ground. All 46 vertices return non-null heights in both directions; both ramp feet return zero relative lift, and off-road/crossing queries return null. Repeated terrain/mode switching, missing-terrain lifecycle and Tesla hardware performance remain separate integration checks.

Independent visual review is left to the coordinator before release. No shared source files were changed, and no online staging deployment was performed.
