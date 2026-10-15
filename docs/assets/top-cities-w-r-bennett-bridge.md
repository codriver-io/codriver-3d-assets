# W. R. Bennett Bridge — Highway 97 floating bridge, Kelowna

Original procedural model of the William R. Bennett Bridge (opened 25 May 2008), which carries Highway 97 across Okanagan Lake between West Kelowna and downtown Kelowna, British Columbia. The 1958 Okanagan Lake Bridge it replaced (a lift-span pontoon bridge, decommissioned 2009) is excluded. What a driver sees: a long, low concrete deck riding on a string of pontoons at the water, rising near the west shore over rust-red steel girders on concrete columns to a hump that clears the navigation channel, with tall davit lamps along both parapets.

Build: `pnpm build:top-cities-landmarks w-r-bennett-bridge --no-check`.
Inspect: `/asset-preview.html?asset=w-r-bennett-bridge&view=overview` (also `facade`, `back`, `roof`, `deck`, `hump`, `underside`, `floating`, `landing`, `east`, `detail`).
Files: `src/peregrine/landmarks/top-cities/w-r-bennett-bridge/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `layer.js`, `w-r-bennett-bridge-alignment.js`, `w-r-bennett-bridge-profile.js`, `w-r-bennett-bridge.test.js`), `prototypes/assets3d/catalog.d/w-r-bennett-bridge.json`, exports `public/models/bridges/w-r-bennett-bridge{-near.glb,-far.glb,.json}`.

## Sources

- [Wikipedia, William R. Bennett Bridge](https://en.wikipedia.org/wiki/William_R._Bennett_Bridge) (infobox and "Bridge facts", citing the BC Ministry of Transportation profile board): 1,060 m long; a 690 m string of nine concrete pontoons, each 25 m wide and 60–90 m long, supporting an elevated deck; a 44 m navigation span on the west side with 18 m clearance; three westbound and two eastbound lanes; a pedestrian/cyclist path on the south (eastbound) side.
- OpenStreetMap (ODbL 1.0): bridge outline [way 881372979](https://www.openstreetmap.org/way/881372979) (`bridge:structure=floating`, `length=1060`), carriageways 100604760 (westbound, 3 lanes) and 5011652 (eastbound, 2 lanes), path 478984978, approach ways 100604753 / 228898636 (Okanagan Highway) and 615173507 / 397569498 (Harvey Avenue), lake shoreline ways 481258726 / 219480307. Extracts: `tmp/top-cities/w-r-bennett-bridge/map-{west,east}.json` (OSM API bbox, Overpass was answering 500) and the dossier `osm.json`.
- Reference photographs, compared only, kept in ignored `tmp/` (licences checked on Commons): GoToVan, *William R. Bennett Bridge from Kelowna City Park* (CC BY 2.0); Darren Kirby, *William R. Bennett Bridge* (CC BY-SA 2.0); Stéphane Charette, *WRB bridge road towers on pontoon two*, *WRB bridge west approach pile drive*, *WRB bridge pontoon construction* (CC BY-SA 3.0); Hinto, *2010-08 Bennett Bridge Looking East* (CC BY-SA 3.0, fetched for the deck view). No photo, texture, scan or traced mesh ships.

## Dimensions

| Dimension | Authored | Basis |
| --- | ---: | --- |
| Abutment to abutment | 1062.9 m | OSM outline (tag `length=1060`, sourced 1060 m) |
| Floating string | 690 m, nine pontoons 86/74×7/82 m, 0.5 m joints | Sourced total, count, 60–90 m range; split estimated |
| Pontoon width | 25 m | Sourced; equals the mapped outline width |
| Navigation span | 44 m (stations 373–417) | Sourced; placed next to the floating string at the west end |
| Navigation clearance | 18.5–18.8 m to the girder soffit | Sourced ≥ 18 m |
| Road crown | 21.5 m above the water | Estimate: 18 m clearance + 2.1 m girders + 0.35 m slab + margin |
| Floating road | 3.2 m above the water; pontoon freeboard 1.6 m | Estimate from the photographs |
| Deck width / lanes | 25 m: westbound 11.3 m (3 lanes), 0.8 m median barrier, eastbound 8.0 m (2 lanes), barrier, 3.4 m path, 0.5 m parapets | Lane counts and path side sourced; lateral positions measured from the mapped ways (westbound centre 10.6 m north of eastbound, path 6.2 m south) |
| West fixed spans | 7 × 42.6 m, twin 2 m columns, tapered hammerheads, pile caps | Count/spacing estimated from photographs |
| Ramp bents on pontoons 1–3 | 10 bents, ~19 m apart, three 1.5 m columns under a cap beam | Construction photo of pontoon 2 shows three-column rows; spacing estimated |
| Lower ramp and floating deck | 0.8 m slab on rows of three posts every 9 m | Estimate (the "column forest" at the foot of the hump) |
| Girders | 4 steel plate girders, 2.1 m deep, rust red | Colour from photographs; count and depth estimated |
| Lamps | Davit standards on both parapets every 50 m, 11 m tall | Deck photograph; spacing estimated |

Frame: local metres east/up/south about `[-119.5115794, 49.87946371]`, the midpoint of the mapped outline on its centreline. The alignment is straight (the mapped bridge ways are two-node lines at 74.2°), offset 4.5 m north of the eastbound way to the outline's midline, and continued 75 m west (stopping just short of the Campbell Road off-ramp gore so the provider ramp is never claimed) and 90 m east along the straight part of Harvey Avenue. `y = 0` is the lake surface and flat-map grade; no DEM, Mercator stretch or moving datum is baked.

## Vertical profile and flat-map ramps

Constant grades joined by parabolic vertical curves (PVI station / height / curve length): 0 / 0, 15 / 0 / 30 m, 395 / 24.58 / 180 m (crest solved so the crown is 21.5 m), 690 / 3.2 / 80 m, 1101 / 3.2 / 50 m, 1207.9 / 0 / 36 m, 1227.9 / 0. Grades: 6.47 % west (on the earth ramp and the fixed spans), 7.25 % down the pontoon-borne ramp, flat floating deck, 2.99 % east. Landings are 15 m (west) and 20 m (east). The west ramp from the landing to the abutment (60 m, 3.9 m high) and the east ramp from the abutment to the landing (70 m, 2.1 m) sit on earth embankments with concrete wing walls. In reality the west approach already runs on fill and the abutment is about 8 m above the lake; the flat map starts it at grade.

## Geometry and materials

- **Pontoons**: nine closed concrete boxes, 25 m wide, from 1.6 m above to 3 m below the water (nothing deeper than 3 m below grade), open joints between them. They carry the ramp bents and posts with attachment weight 1, so in Full 3D world the whole floating system rides the lake datum.
- **Hump**: four plate girders from the west abutment to the last ramp bent (station 588), on seven twin-column hammerhead piers with pile caps (attachment weight 0 at the foot) and ten three-column bents on pontoons 1–2; then a 0.8 m slab on round posts down the rest of the ramp and short square posts on the floating string. The 44 m navigation span between the last fixed pier and the first bent is clear to 18.5 m.
- **Deck**: slab tucked inside the parapets; outer parapets carry the fascia down past the slab, so the side elevation reads as the photographs: pale parapet over a rust-red girder band over pale columns. Tall jersey median, jersey barrier between the eastbound lanes and the south path, metal railings on both outer parapets (near), davit lamps whose heads use the self-lit `lamp` material.
- **Paint (near only)**: yellow median-side lines, white edge lines and 3 m dashes as flat quads 10 cm above the pavement.
- **Landings**: pavement narrows to 6 m ribbons centred on the mapped carriageways (the standard-road width at driving zoom, as on Pitt River); median, barrier and parapets shrink to nothing; the path narrows to a 0.8 m ribbon and comes to grade on its mapped connections (west: the path continuing beside Okanagan Highway; east: the turn into the City Park underpass ~30 m past the abutment). Pavement carries `_landingblend`; `layer.js` blends it from the road colour to the HD deck colour per theme (same technique as Pitt River, landmark-local, no shared change).
- Materials: `concrete`, `pontoon`, `girder`, `asphalt`, `paint`, `stripe`, `rail`, `lamp`, `fill`. Far drops paint, railings and the two inner girders, draws posts as boxes and closes the 0.55 m slot over the stub posts by deepening the slab into the pontoons.

## Full 3D world policy

`terrainPolicy: 'bank-fit'` with explicit `groundControls` and the shared opt-in `lateralBankFit: { blendM: 60 }` crossfall at the land ends: the deck datum is the DEM at the west landing, the lake (sampled over the water at stations 395 and 1071) from the navigation pier to the end of the floating string, and the DEM at the east landing. The floating deck and pontoons therefore sit on the lake surface with their authored freeboard, the hump keeps its real 21.5 m above the water, and the ramps blend into the land roads at each end, with each carriageway meeting its own DEM there (a first world capture without the crossfall left −0.15 / +0.44 m at the west landing). `absolute-deck` was rejected: Okanagan Lake is at about 342 m, so it would have pushed the whole structure onto the DEM and flattened the hump. Pier pile caps and embankment toes have attachment weight 0 and meet their local DEM.

## Costs

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 39,602 | 24 | 1,668 KB |
| Far | 12,444 | 7 | 512 KB |

Budgets (bridge): near ≤ 120 k / 40 / 4.5 MB, far ≤ 30 k / 10 / 1.2 MB.

## Verification

Shared checks: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/w-r-bennett-bridge/w-r-bennett-bridge.test.js` 812/812 pass; `node scripts/asset-catalog.mjs` valid; `node scripts/landmark-depth-layers.mjs --ids w-r-bennett-bridge --check` current with zero material cycles (two far/near fill–concrete cycles at the landings and one fill/slab overlap at the west abutment were fixed in geometry); `qa-metrics.mjs` reports no issue. The landmark test (9 tests, about 0.4 s) pins the 1062.9 m / 690 m / nine 25 m pontoons / 44 m span; ≥ 18 m clearance by upward raycasts at five laterals; the 21.5 m crown and 3.2 m floating road by downward raycasts; pontoon walls at the waterline and open joints; twin columns and three-column bents by horizontal rays; named-support contact for every girder, column, bent, post, lamp pole/arm and rail in both LODs, with a girder stopped 8 m short and a lamp pole lifted 1 m both rejected; grades < 8 % with tangent vertical curves; mapped carriageway ownership in both headings and rejection across and off-road; 6 m landing ribbons on the mapped centres; structure inside the outline envelope; a synthetic Full 3D world refit (floating deck on the lake, ends on the land, cross-sloped bank, exact flat restore); and the exported GLBs with the landing-blend shader.

Inspector sheets I looked at, next to the dossier photographs: `tmp/top-cities/shots/w-r-bennett-bridge/r1/w-r-bennett-bridge-procedural-near-light-sheet.jpg` (first look: framing too far, pontoon colour too close to the deck, paint too costly; fixed), `r1/…-near-light-top.png` (plan over the red outline: on it, correct 74.2° rotation), `r1/…-procedural-far-dark-sheet.jpg`, and the exported GLBs `r2/w-r-bennett-bridge-glb-near-light-sheet.jpg` and `r2/w-r-bennett-bridge-glb-far-dark-sheet.jpg`. The side elevation reads like the Kirby and GoToVan photographs: pale parapet over a rust-red girder band on pale columns, the hump close to the west shore, the long low pontoon deck to the east.

### In-app (slot K: Cityscape 3310, Full 3D world 3312, local bundle, Protomaps; world with the Terrarium DEM)

Shots under `tmp/top-cities/shots/w-r-bennett-bridge/` (all opened): `app1/` Cityscape and world, near and forced far, light, at both landings in both directions plus the hump from south and north, the pontoons and an overview (`app1/sheet-cityscape-near.jpg`); `app2/` Cityscape close landings (zoom 19.2) near/far (`app2/sheet-close-near.jpg`); `app3/` world close landings near/far after the crossfall (`app3/sheet-world-close.jpg`) and the Cityscape night set (`app3/sheet-city-dark.jpg`). The pavement narrows and lightens into the provider ribbons at both ends in both directions with no visible step or gap; the provider bridge ribbons are hidden on the deck; the Campbell Road off-ramp is not claimed. The landmark layer was active in every shot with the requested LOD.

`window.__map.landmarks.heightAt(lng, lat, heading)` on the mapped carriageway centres (westbound / eastbound), identical for both travel headings, `null` across the deck (heading + 90°) and 45 m off the deck, identical in near and far:

| Station | Place | Cityscape | Full 3D world (after crossfall) |
| --- | --- | --- | --- |
| 0 | west landing | 0 / 0 | 0 / 0 |
| 10 | west landing | 0.108 / 0.108 | 0.129 / 0.375 |
| 40 | west earth ramp | 1.617 / 1.617 | 1.902 / 2.005 |
| 75 | west abutment | 3.880 / 3.880 | 4.178 / 4.018 |
| 395 | crown, navigation span | 21.490 / 21.490 | 21.490 / 21.491 |
| 900 | floating string | 3.200 / 3.200 | 3.199 / 3.200 |
| 1137.9 | east abutment | 2.096 / 2.096 | 2.138 / 2.138 |
| 1187.9 | east earth ramp | 0.599 / 0.599 | 0.941 / 0.846 |
| 1217.9 | east landing | 0.027 / 0.027 | 0.202 / 0.075 |
| 1227.9 | east landing end | 0 / 0 | 0 / 0 |

In world mode heights are above the queried ground: on the lake they equal the authored height above the water, so the floating deck sits 3.2 m above the lake surface and is not pushed into terrain; the land values differ from Cityscape because the datum blends from the lake to the bank DEM along the ramp.

| Case | Status |
| --- | --- |
| Cityscape, near/far, both approaches and directions | Verified (shots + heightAt) |
| Full 3D world, near/far, both approaches and directions | Verified (shots + heightAt), terrain from Terrarium, not the production DEM |
| Night theme | Cityscape verified; world night not captured |
| HD lane pavement/paint over the deck | Not tested (no local Redis lane service) |
| Paired navigation drive, MCU2 performance | Not tested |

### Review g9c fix (2026-10-15): the west-approach "duplicate path"

The g9c review read the white line beside the west ramp as a duplicate provider path with disconnected ends. It is service road 1055539170 (above); the real path 102419121 lies under the authored walkway and is never drawn. With the lead's agreement the service road stays, and `layer.js` masks only its last three segments (stations 81.7–92.7 m, 14–32.6 m south of the centreline, `SERVICE_HOOK` in the profile), which turned back toward the deck and stopped 5 m short of it under the first span. The mask is a reversible standard-ribbon road mask on while the bridge is active (the Pont de Québec leg-mask pattern), in both modes; nothing else is drawn in that box, and the GLBs are unchanged. The landmark test pins that the hook is masked and the parallel run, carriageways, path and deck edge are not. Shots (slot K, both modes, near and forced far, west approach both directions plus side and hook views): before `tmp/top-cities/shots/w-r-bennett-bridge/fix1/before/`, after `fix1/after/` (`fix1/sheet-cityscape-west.jpg`, `fix1/sheet-world-west.jpg`): the road now ends at grade, parallel, beside the abutment.

## Limitations

- The pontoon split, pier and bent spacing, girder depth, freeboard and crown height are estimates from photographs; the mapped bridge is straight, so the slight curve some photographs suggest at the hump is not modelled.
- The west approach is on a real fill about 8 m above the lake; the flat map starts it at grade, so the west earth ramp is a flat-map compromise (6.5 %).
- The south path runs on the embankment top on both ramps. Its ends sit on the mapped paths at grade (west on path 102419121, east on the 907539401 / 102419105 junction) but end visually in grass: provider paths are never drawn in the app (the near basemap ring builds roads at detail zoom 16, and `path` starts at 18).
- The white line south of the west ramp is OSM service road 1055539170 (`highway=service`, asphalt), a real road from motorway_link 228898652 to a dead end beside the west abutment, not a second path. It is kept; only its hook back toward the deck is masked (see below).
- Lake mooring cables and the underwater pontoon depth (drawn to 2.9 m) are not modelled; Cityscape has no water, so the pontoons show only their 1.6 m freeboard.
