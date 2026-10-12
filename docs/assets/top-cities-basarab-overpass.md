# Basarab Overpass, Bucharest

Original procedural model of the **2011 cable-stayed railway crossing near Gara de Nord**, with its tram station and long road approaches. Recognition features are the paired pale chamfered shafts, open three-brace portal, two semi-fan stay planes, broad four-lane deck, central twin tram tracks, barrel station canopy and blue edge lighting. No photographs, textures, scans or third-party meshes ship.

## Identity, sources and frame

- [Designer CFC project](https://cfcsl.com/portfolio-items/puente-de-basarab-bucarest-rumania-2012/) and [ACHE engineering paper](https://cfcsl.com/wp-content/uploads/2023/09/articulo-basarab.pdf), inspected pages 1, 2 and 6: actual shaft form, structural spans and deck sections. The designer explicitly calls the shafts **vertical** and gives **80 m above the deck**. Those primary measurements supersede the task description of an inclined pylon and the ambiguous secondary 84 m height.
- [BBR project](https://pf.bbrnetwork.com/installation1537A.html?setcookie=1): 168 m main span, five spans and 361 m bridge. The primary designer span sum is 365.5 m; the illustrated detailed plan shows slightly different construction dimensions. This model uses the written designer nominal spans, without stretching mapped roads to match a project total.
- [FCC project](https://www.ciudadfcc.com/en/-/basarab-viaduct): complete complex, variable deck width, central tram station and published approach grades. Its 1,950 m project total includes the southern river arch and ramps and is not the length of this asset.
- Supplied OSM dossier, retained in ignored `tmp/top-cities/basarab-overpass/osm.json`. Source way IDs and both carriageways are retained in `basarab-overpass-alignment.js`; representative [way 23770172](https://www.openstreetmap.org/way/23770172). A shared-helper support query returned no mapped bridge-support objects. The dossier contains no building/part or bridge-outline polygon over this railway crossing; nearby station buildings are not replaced.
- Visual reference inspected: Mihai Petre, [Pasajul Basarab - Noaptea.jpg](https://commons.wikimedia.org/wiki/File:Pasajul_Basarab_-_Noaptea.jpg), CC BY-SA 4.0 (licence checked on the file page), plus the supplied reference contact sheet. The southern arch photo and old station building photo establish context only. Designer PDF images remain private reference scratch.

Metres, **+X east, +Y up, +Z south**, origin `[26.06785, 44.44945]` at the dossier structural anchor. The twin shafts sit on the averaged mapped road axis 2.95 m from that anchor. Station increases southwest to northeast; orientation is baked into the GLB from the mapped alignment. Local y=0 is flat-map grade, not sea level. Neither DEM heights nor Mercator stretch are baked. Original geometry is Codriver authored; geographic data remains © OpenStreetMap contributors, ODbL 1.0.

`FOOTPRINTS` is a densely sampled authored road envelope for inspection, not a claim of a surveyed bridge outline. `OSM_WAYS` lists the source carriageways; the shared road layer uses station/lateral/heading ownership rather than removing whole ways. The southern Dâmbovița arch and branching lateral road ramps remain provider structures outside this railway-crossing asset.

## Dimensions and approximations

| Quantity | Model | Basis |
| --- | ---: | --- |
| Main span | 168 m | CFC / BBR published |
| Back spans | 56.5 + 75 = 131.5 m | CFC published |
| North continuation spans | 36 + 30 = 66 m | CFC published |
| Shafts | 6 × 4.6 m, chamfered | CFC published |
| Shaft rise above road | 80 m | CFC published |
| Local road / crown datum | 14 / 94 m | Road elevation estimated; rise sourced |
| Main / station deck width | 37.88 / 43.38 m | CFC published; mapped approach envelope widens where necessary |
| Girder depth / slab | 2.5 / 0.35 m | CFC published |
| Stays | 60, 15 forward and back per plane | CFC / BBR published |
| Track gauge | 1.435 m | OSM tram tags |
| Approach-inclusive alignment | 1,260.843 m | Averaged mapped road axes; deliberately excludes southern river crossing |
| Tower / span stations | 714.196 / 582.696–882.196 m | Dossier anchor projected to alignment; tower position is approximate |
| Shaft centre spacing | 16.2 m | Photo estimate; lanes stay clear of shafts |
| Canopy | 95 × 16.8 m; crown 9.65 m above road | Photo / plan estimate |
| Southern / northern rising ramp | 557.696 / 287.647 m | Cityscape convention, including 25 m vertical curves |
| Maximum ramp grades | 2.628% / 5.330% | Computed from authored constant-grade profile |
| Landing lengths | 25 m each | Cityscape convention |

Approach width follows the measured mapped carriageway separation plus 7.4 m carriageway envelopes, with the published structural deck widths retained at the railway crossing. The elevated structure stays rigid even when a live road sample is incomplete. Only the final 40 m at each outer toe fit the connected carriageway widths; standard-road joins also track their zoom-dependent ribbon width. Separate carriageway slab noses release the separator to provider ground, while the tram connection remains in the central gap. This is not a calibrated aerial survey; shoulder, canopy, lamp and pier details are visual estimates. The central tram bed rejects road height queries. The station roof is opaque subdued glass-coloured geometry rather than photographic glass, and lifts, pedestrian stairs, signs and overhead electrical equipment are omitted. Approaches deliberately descend to local grade before this asset ends; they are not a reconstruction of the entire elevated complex.

## Geometry, fitting and LOD

Near retains all 60 stays, shaft chamfers, portal openings, canopy ribs, four track heads, platforms, longitudinal girders, floor beams, approach bents, lamp heads, rail posts and lane paint. Far retains the same shafts, stays, open portal, canopy, tracks, deck and supports, with coarser surface sampling, 20 m floor-beam spacing and reduced canopy ribs. Fine poles, paint and illuminated edge panels are omitted far. Repetition merges by material and three station chunks near; far is one chunk. Both themes use the shared app unlit/vertex-shaded conversion.

All stays enter named pylon and deck-shoe supports. Outer rails feather into grade beside embedded end posts; canopy ribs meet their roof/feet; supports meet caps and footings. Source `userData.supports` stores compact named triangle-index ranges after batching, allowing contact tests against the exact support while excluding the member itself. The negative test deliberately shortens a stay. Longitudinal girder endpoints join named caps; ramp feet terminate below grade. The minimum -2.55 m is a buried approach-girder skirt, not an exposed hanging end.

`bridgeLift` survives GLB export as `_bridgelift`. Foundations have weight zero, shafts blend below deck, and the structure above the deck follows the shared datum. `terrainPolicy: bank-fit` uses the pylon ground sample as a constant datum from the back-span boundary through the northern structural spans, blending to endpoint ground on the ramps. Each support foot samples local ground. No full corridor is flattened. Pavement, road heights and structural meshes all use the same station, width and ramp functions.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 58,416 | 23 | 3,037,320 | 2,966 |
| Far | 26,140 | 7 | 1,104,376 | 1,078 |

All costs are below 120k/40/4.5 MB near and 30k/10/1.2 MB far. Counts are exported GLB default-scene costs, not hardware measurements or total app costs.

## Verification

Nine landmark tests pin observable shaft dimensions, portal openings, 60 actual stay endpoints and spans, named support contacts (with a free-end negative case), source/GLB bounds and attributes, mapped road ownership, ramp grades, crossing/tram rejection, deck containment, girder/cap contacts and planted foundations. The focused combined top-cities test run and catalog/depth checks are recorded below. `assets:preview` built into ignored `tmp/champlain-preview/`; nothing was published.

Geometry QA is clean: zero different-material coplanar overlaps, zero unresolved layered faces, zero depth cycles, zero back-face hits in the deterministic sweep and no member-end candidates.

I inspected the procedural `round1` sheet and the exported `final-reference-sheet.jpg` beside the dossier photo: overview/front, opposite/back, above, underside, deck and canopy detail, near/far and light/dark. The fixes were coarser far deck sampling for budget, continuous canopy sampling along the curved axis, floor-beam/lamp-base contacts, pylon face winding, shaft/footing face separation and approach girders meeting the bent caps. Final exports preserve the portal holes, stay fans and station silhouette. Exact screenshot directories are under `tmp/top-cities/shots/basarab-overpass/{final-near-light,final-far-light,final-near-dark,final-far-dark}`.

### App placement and live heights

Cityscape and Full 3D world are **verified for visible placement, both approach directions, LOD loading, deck height queries and foundation contacts** in this dedicated worktree. Captures used bundle `fb30fd11ecf5`, Protomaps/OSM tiles and the AWS Terrarium DEM (`256`, maximum zoom 15). Both road-fitted layers were active; world had known terrain. The bundle was built for QA and is deliberately excluded from the asset commit.

I looked at the individual `cityscape/near.png` and `world/near.png` plus `approaches-sheet.jpg`, assembled from eight unobstructed full app captures. Each mode retains `far.png`, `near.png`, `street.png`, `south-forward.png`, `south-reverse.png`, `north-forward.png`, `north-reverse.png` under `tmp/top-cities/shots/basarab-overpass/`. Both approach decks meet the provider ground pavement without an exposed step or gap in these captures. The railway-crossing deck is a single visible structure; the railway and surrounding streets remain below. The world landing crossfall mismatch is small: sampled endpoint corrections range within approximately 0.3 m at the measured carriageway centres.

The full numerical report is `tmp/top-cities/basarab-overpass/app-evidence.json`. The API is `window.__map.landmarks.heightAt(lng, lat, heading)`: metres of correction above the terrain sampled at the query, **not absolute elevation**. Forward and reverse agree at every sample; all perpendicular headings return null. All 107 retained mapped vertices were sampled in both directions, with zero rejected vertices inside the model. Samples 10 m beyond either end return null.

| Station (m) | Cityscape heightAt (m) | World heightAt (m) | World query ground (m) |
| --- | ---: | ---: | ---: |
| 0.000 | 0.000000 | -0.114490 | 74.915533 |
| 20.000 | 0.000000 | 0.080885 | 74.949262 |
| 100.000 | 1.642588 | 1.729508 | 75.859645 |
| 582.696 | 14.000000 | 14.743029 | 80.732926 |
| 714.196 | 14.000000 | 13.959861 | 81.516094 |
| 794.196 | 14.000000 | 14.298226 | 81.177729 |
| 882.196 | 14.000000 | 13.324902 | 82.151053 |
| 948.196 | 14.000000 | 11.748330 | 83.727625 |
| 1160.843 | 3.331469 | 4.037093 | 84.046158 |
| 1240.843 | 0.000000 | -0.279532 | 86.263714 |
| 1260.843 | 0.000000 | -0.156673 | 86.448955 |

The footing audit checked 480 zero-height, zero-lift foundation vertices against the active DEM. Cityscape residuals were effectively zero; world minimum/maximum were -0.000003793 / +0.000003766 m. These are renderer contact measurements, not survey accuracy.

| Case | Status | Evidence / limit |
| --- | --- | --- |
| Cityscape and world placement, both approaches/directions | Verified | Seven app images per mode, live height samples, active layer and terrain flags |
| Near/far, source/GLB, light/dark | Verified | Export contact sheets, inspector, loaded app LODs |
| Foundation/deck contacts and crossing/tram rejection | Verified | Contact tests, DEM residuals and height API |
| Actual HD pavement/paint continuity and paint switch | Not tested | Zero fitted HD surface sections in this local run; authored pavement/paint fallback was visible |
| Moving car/route/traffic/halo/camera and picking | Not tested | Shared height API verified; no simulated vehicle drive claimed |
| Missing/late/replaced terrain, failed/late model loads, reanchor, leave/return, 2D mode switches | Not tested | Existing shared factory retained; no exhaustive lifecycle certification |
| Tesla hardware timing | Not tested | Desktop browser evidence only |

Final focused test run: **471/471 passed**, including all nine Basarab tests. `node scripts/asset-catalog.mjs` and `pnpm assets:check` passed (286 entries / 534 GLB variants); `pnpm assets:preview` passed. Depth regeneration/check passed with zero dropped edges, and final `qa-metrics.mjs --ids basarab-overpass` reports no issues. No shared source extension was needed. Both assigned local servers were stopped by their recorded PIDs after capture. No deployment or public publication was performed.

### Review b6b: landing correction (2026-10-12)

The reviewer accepted recognisability (5/5) and requested a fix for square slab/asphalt/barrier joins at both outer toes. The final 40 m now use two independent carriageway slab noses, shrinking outer shoulders and rails into grade, with smooth provider-width fitting restricted to those noses. Pavement colour blends to the actual standard-road theme at the endpoint; HD fitting retains the provider surface colour. `clipStandardEnds` keeps the replacement boundary at the same endpoints. Main spans, stays, pylons, station and deck-height profile remain rigid. Shared station cuts across ribbons prevent chord overlaps; near track/paint overlays are at least 10 cm proud and far tracks are inset.

Final exported contact sheets inspected: `tmp/top-cities/shots/basarab-overpass/review-fix/final-{near,far,far-dark}/`, showing both landing toes, overview and opposite view. Exactly two exported look-fix rounds were used. New app images are in `tmp/top-cities/shots/basarab-overpass/review-fix/{cityscape,world}/`: `south-forward.png`, `south-reverse.png`, `north-forward.png`, `north-reverse.png`, plus near/far/street. They replace the pre-review approach evidence. The noses meet provider roads with no exposed road step or square slab wing; the narrow tram track connection continues in the separator.

`tmp/top-cities/basarab-overpass/review-fix-app-evidence.json` records all 107 mapped carriageway vertices, queried forward/reverse and perpendicular. No in-model mapped vertex is rejected, opposite directions agree, perpendicular queries and points 10 m beyond either end return null. Cityscape toe corrections are 0 m; world corrections at the two carriageway centres are +0.0583/-0.1145 m south and +0.2485/-0.1567 m north. Foundation residuals over 480 vertices are 0 m in Cityscape and within 0.000004 m in world. The table above remains representative of side 1 samples.

Focused regression tests additionally verify landing asphalt containment in both LODs, fitted endpoint edges, repeated-fit stability of the elevated span, standard-road zoom width, and light/dark endpoint colour. Final geometry QA reports no issues, zero material cycles and zero back-face hits. Catalog validation, `assets:check`, `assets:preview`, and the renderer build passed.

Live HD pavement/paint, moving vehicles, exhaustive lifecycle cases and Tesla timing remain **not tested**, because this local provider run has no HD surface sections and no hardware drive. The landing fix is verified with standard roads in both driving modes; these unchanged limits are not claims about the corrected toes.
