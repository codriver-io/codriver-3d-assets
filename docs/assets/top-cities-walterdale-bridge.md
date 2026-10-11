# Walterdale Bridge, Edmonton

Original procedural representation of the current white twin through-arch bridge opened in 2017, carrying 105 Street northbound across the North Saskatchewan River. The demolished green truss in dossier photos 2 and 4 is a different structure and is excluded, along with temporary construction equipment. Driver recognition comes from inward-inclined white arch ribs, an open ladder of cross-braces, two main hanger planes plus the inclined eastern path hangers, and the separate curved shared-use deck.

## Dimensions and provenance

| Feature | Authored value | Basis |
| --- | ---: | --- |
| Main arch span | 206 m | [DIALOG, project designer](https://dialogdesign.ca/projects/walterdale-bridge/) and [Pedelta, erection engineer](https://www.pedelta.com/new-walterdale-bridge-p-66-en) |
| Structural traffic deck | 230 m | Pedelta |
| Main deck width | 22.4 m | Pedelta; three northbound lanes, shoulders, barriers and west sidewalk |
| Crown above thrust-block convention | 56 m | DIALOG and [City of Edmonton](https://www.edmonton.ca/projects_plans/walterdale-bridge) |
| Crown above deck | 43 m | [City spring 2016 project sheet](https://www.edmonton.ca/public-files/assets/document?path=WalterdaleBridge_ProjectUpdate_Spring2016.pdf); visual interpretation of supplied references |
| Flat-map deck datum | 13 m | Difference 56−43; interpreted local convention, not surveyed clearance |
| Hangers | 16 at 10 m pitch in each of 3 planes | Pedelta |
| Rib inclination | Feet ±13.5 m, crowns ±7.8 m lateral | Estimated from transverse construction and finished photos |
| Rib box section | 2.1–2.5 m wide, 2.5–3.6 m deep | Visual estimate |
| SUP width | 4.2 m middle, 8.4 m landings | Estimated; DIALOG confirms ends about twice middle width |
| Alignment / model length | 590 m | OSM controls, including 180 m approach ramps each side |
| Main span bearing | 17.1756° northbound | Mapped OSM way 175326660 |
| World main-deck altitude | 625 m | Initial estimated absolute datum; not a surveyed elevation |

Published arch height conventions vary: Pedelta describes 54 m arches, while DIALOG uses 56 m and the City construction material uses 43 m above deck. The model follows the latter two as a coherent visual convention; it does not claim precision engineering elevations.

OSM controls are retained with ODbL attribution in `walterdale-bridge-alignment.js`. Origin `[-113.5017319,53.5283206]` is the midpoint of the long mapped straight road segment, not the approximate dossier point. Road, geometry, clipping, navigation and camera use one station/lateral frame. The structural deck is centered on this segment; the 206 m feet are 12 m inside each deck end. Approach curves follow the actual mapped roadway, rather than a straight extrapolation. Additional northern controls were obtained once through the lead checkout's shared Overpass helper; ignored extracts are under `tmp/top-cities/walterdale-bridge/`. No mapped building extrusion belongs to this bridge, so `FOOTPRINTS` is empty and `footprintless` is explicit; roadway replacement is owned by the bridge profile.

Reference photographs opened in the dossier sheet: *105st bridge may 2016 (27011756265)*, jasonwoodhead23, CC BY 2.0; *Near finished structure of new Walterdale Bridge … (Sept -2016)*, Kmw2700, CC BY-SA 4.0; *Walterdale bridge over the North Saskatchewan river in winter, Edmonton, Alberta*, Joli Rumi, CC BY-SA 4.0; *Walterdale May 2017*, Kurt Bauschardt, CC BY-SA 2.0. Checked Commons links and full dossier attribution are in the catalog record. These are visual studies only: no photograph, texture, traced mesh or construction asset is in the source or GLBs.

## Geometry and runtime contract

Metres east/up/south, rotation baked into geometry, latitude stretch applied only by the renderer. Two closed swept box ribs taper and lean inward. Forty-eight suspenders connect the ribs to the main longitudinal girders and eastern path. Their attachment plates, transverse floor beams, five longitudinal I-girders, bank thrust blocks, splayed supports, railing posts, west sidewalk, timber wind-screen/bench and lamp fittings distinguish the near model. There is no river pier. Ribs, main deck, braces, all hanger planes, independent curved SUP, support contacts and major rail lines survive far LOD; near adds timber furniture, dense rail posts, girder flange detail and fallback road paint.

The SUP follows mapped way 451293733 in the same station frame. Its center is about 36.45 m east of the road at the southern deck end, 33.20 m at the northern end, and narrows toward midspan. The 90 m profile envelope contains its widest landing (maximum lateral extent 40.65 m); that envelope does not authorize vehicle traffic on the path. The road acceptance band is [-7.1,8.9] m; west sidewalk and eastern SUP are rejected by vehicle height queries.

Warm off-white steel, grey suspenders, concrete, subdued grey-green girders, asphalt and brown timber use named material batches. The dark palette dims structure and retains warm lamp heads. No new decoder, texture, shared renderer change or runtime per-frame geometry generation. Near has three station chunks; far merges each material globally.

`layer.js` uses `createRegistryBridgeLayer` and a local subclass that tags terrain approach arrays to choose the estimated absolute world deck profile. Cityscape ramps are 180 m each with smooth zero-slope ends, maximum grade 10.84%. Full 3D world uses `absolute-deck`: no river valley flattening; ends and fixed supports fit the DEM, while the main deck stays at the estimated absolute elevation. Support attachment weights round-trip as `_BRIDGELIFT`; road overlay/navigation use the same profile. Approach slab toes intentionally embed up to 0.87 m below flat grade. Footing bottoms stay at zero, with interpolated shaft/rib attachment weights.

Approximations: a parabolic arch rather than surveyed segment coordinates, simplified rectangular rib section and bank supports, no bolt heads or joints, estimated brace sizes, lateral pavement/fallback lane widths, SUP furniture and railing pitch, straight longitudinal hanger station assignment, nighttime lighting and world datum. Separate pedestrian path landings stop at the structural ends; the off-bridge path network is left to the provider and its vertical continuity is not certified. Actual HD pavement and paint are not available in this local environment.

## Export costs and visual evidence

| Export | Triangles | Mesh draws | Uncompressed size |
| --- | ---: | ---: | ---: |
| Near | 26,264 | 17 | 1,302,948 bytes / 1,272 KiB |
| Far | 8,272 | 7 | 365,956 bytes / 357 KiB |

Both are comfortably within 120k/40/4.5 MB near and 30k/10/1.2 MB far. These are GLB scene costs, not hardware benchmarks or total map draws.

All evidence below is ignored local tooling under `tmp/top-cities/shots/walterdale-bridge/`. Opened the dossier `refs-sheet.jpg`, first procedural `first/walterdale-bridge-procedural-near-light-sheet.jpg`, then `final-reference-comparison.jpg` containing the references beside exported near/far, light/dark sheets. Each export sheet includes overview, both sides, top, deck, underside and arch close detail. The first look exposed oversized joint plates, which were removed; swept arch winding was corrected and raycast-tested. Final close views keep the crown, tilted hanger planes and open throat; the far model preserves these rather than becoming a solid mass.

Focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/walterdale-bridge/walterdale-bridge.test.js` passed **158/158**. The four specific tests probe outward crown faces and height, arch span, true throat, separate SUP and open gap, unobstructed river space, all 48 hangers, ownership bounds, fixed contact weights, both travel directions, transverse/off-bridge rejection, approach datums/grades, and texture-free GLB attachment round trips. `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview`, and `pnpm build:peregrine` passed. `qa-metrics.json` reports no issues, zero coplanar overlap pairs and zero backface hits in the deterministic sweep. Independent reviewer signoff remains for the coordinator.

## Integration evidence

Cityscape: **verified locally for near/far loading, standard-provider road placement, both approach directions and height queries**. Full 3D world: **verified locally for near/far loading, DEM fitting and the same height queries**, using the estimated 625 m datum; surveyed elevation, HD overlay, live route/car motion and full lifecycle certification remain not tested. Terrain is resident (`ground: true`, `terrainReady: true`) with fitted endpoint datums 628.197714 and 628.472667 m. No product gate was changed and no online staging deployment was made.

Port slot B: app 3274, terrain 3276; Protomaps standard roads from `tiles.codriver.io`, AWS Terrarium 256 px tiles, max zoom 15. Local bundle stamp `97a90b602b60`. Opened `app-modes-sheet.jpg` (far/near/street, both modes) and `approaches-sheet.jpg` (south/north in both directions, both modes). Main pavement is continuous across the authored abutments and ramps, with no visible duplicate provider elevated deck. Standard-provider approach widths are narrower than the full 22.4 m structural deck, and the fallback pavement widens shoulders; HD lane-width/paint continuity is unverified.

Approach cameras are 20 m outside each structural end at stations 160/430, using the mapped northbound bearing 17.1756° and its reverse 197.1756°. Their full coordinates are reproducible from `PROFILE.bridgePoint` and `bridgeLngLat`. The first scratch surface collector looked up a non-public `profile` property and failed after saving all approach screenshots; the corrected independent surface collector uses the layer's group name and succeeded. The earlier ad-hoc reports' `active:false` reflects that lookup, not absent visible geometry. Definitive reports under `app-cityscape/`, `app-world/` and `surface-*/` show active near/far models.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` returns the following metres above rendered ground, identical for both travel directions:

| Station m | Cityscape | Full 3D world |
| --- | ---: | ---: |
| 0 | 0.00000 | 0.00000 |
| 90 | 6.50000 | 2.29181 |
| 180 | 13.00000 | 4.99615 |
| 295 | 13.00000 | 9.00000 |
| 410 | 13.00000 | 4.65419 |
| 500 | 6.50000 | 1.42736 |
| 590 | 0.00000 | 0.00000 |

Lateral 25 m (path area) and 60 m return null in both directions and modes. JSON evidence: `surface-cityscape/surface-check.json` and `surface-world/surface-check.json`. Both road-center toes return exactly zero; transverse endpoint variation across the wider structural shoulders and pedestrian landings has not been surveyed or certified. Terrain main-span clearance is about 9 m with the present approximate datum. The valley banks remain in the DEM rather than being flattened.

Local `/osm-lanes` returns 503 without Redis, so HD paint/overlay integration, paint toggles and Tesla MCU hardware performance remain not tested. Actual route/car motion, missing-load recovery and repeated mode/reanchor toggles are inherited shared capabilities, not claims established by these screenshots. Servers are stopped at handoff; generated shared renderer bundles are restored and excluded from the landmark commit.
