# White House — Executive Residence and West Wing

Original procedural, texture-free geometry, authored 2026-10-12 for Washington, D.C., 1600 Pennsylvania Avenue NW. **East Wing demolished 2025; ballroom not modelled while under construction.** No historic East Wing is reconstructed. Ballroom construction way 1536631257, visitor screening center, detached gatehouses and the external curved stair structures 1425481054/1425481055 remain provider-owned. The latter are not duplicated by the simplified portico platform. The old aerial photographs are architectural reference for the unchanged residence and West Wing only, not a claim that the East Wing remains.

## Sources and dimensions

[White House Historical Association dimensions](https://www.whitehousehistory.org/press-room/press-backgrounders/white-house-dimensions) supply the principal residence measurements. [Official building/history and ballroom page](https://www.whitehouse.gov/About-the-white-house/The-white-house/) identifies the residence and construction project. Geographic controls come from the prepared OSM dossier, supplemented by exact [residence relation 19761182](https://www.openstreetmap.org/relation/19761182) and [West Wing relation 19761232](https://www.openstreetmap.org/relation/19761232). The shared Overpass helper failed with HTTP 500; two single-object OSM API relation/full reads supplied the outer ways, 238241022 and 238241016. All mapped parts and overhangs are listed in footprint.js; unrelated structures are excluded.

| Measure | Model | Evidence |
| --- | ---: | --- |
| Residence east/west length | 51.2064 m / 168 ft | WHHA, published |
| Residence north/south body depth | 26.0604 m / 85 ft 6 in | WHHA, published |
| South grade to main roof | 21.336 m / 70 ft | WHHA, published |
| South grade to parapet | 18.288 m / 60 ft | WHHA, published |
| North grade to roof | 18.3896 m / 60 ft 4 in | WHHA; ground difference is not baked into the rigid model |
| North-to-south portico envelope | approximately 46.7 m | OSM/photo fit; WHHA overall reference 152 ft / 46.33 m |
| Chimney top | 23.12 m near, 23 m far | OSM part height 23 m; small caps estimated |
| Flagpole top / declared SPEC height | 26.4 m | Estimated; pole starts inside roof |
| North columns | six, 13.1 m including base/capital | Count from photos; dimensions estimated |
| South columns | six on elliptical semicircle | Count/photo estimate, not a survey |
| West Wing roof | 10 m | OSM part roof height |

Reference photos, kept only in ignored tmp: [north portico](https://commons.wikimedia.org/wiki/File:1122-WAS-The_White_House.JPG), Ingfbruno, CC BY-SA 3.0; [aerial](https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_White_House.jpg), Carol M. Highsmith, public domain; [south facade](https://commons.wikimedia.org/wiki/File:White_House,_2012.jpg), Photograph by Mike Peel (www.mikepeel.net), CC BY-SA 4.0. File-description pages/licences were checked. The dossier engraving, Latrobe plan and Charleston courthouse image were rejected as present-state photo references. No reference raster ships in the source or GLB.

## Geographic frame and replacement

Origin [-77.0365525, 38.8976673], real metres east/up/south, y=0 at the south-lawn foundation datum. Two OSM body controls at (-77.0368541,38.8977959) and (-77.0362509,38.8977953) give the nearly east/west facade axis and approximately 0.0733° north frontage. The −0.001279 rad yaw is baked into source/exports, once. Published horizontal dimensions are preserved rather than stretched to the slightly larger OSM outer envelope (cornices fit within that envelope).

The model has a rigid base, with a raised north entrance platform. It does not create terrain, lawn, a neighborhood ground slab or roads. Current OSM has no separate surviving East Colonnade outside the construction site, so that east-side area remains entirely provider-owned rather than reconstructing an unsupported frontage.

## Geometry and materials

White-painted sandstone is a subdued warm off-white. Stone facade surfaces have actual window holes, inward returns and recessed glass; separate panes preserve eleven main facade bays and three south rows in both LODs. Near adds mullions, sills and alternating triangular/arched state-floor hoods. Ionic volutes are simplified torus forms in near; far keeps shafts, bases and capitals. The front portico has four frontal columns plus two returns and a closed triangular pediment. The south portico has an elliptical half-plan platform, six shafts, flat entablature and individual curved balusters. Near and far keep open intercolumn spaces.

The roof has a parapet, individual balusters, low third-floor massing, a hipped roof, eight chimneys and an original small flag made from geometry. The West Wing has mapped low connected office masses, mansard roof, window rows, West Colonnade and Oval Office bow. No flag texture or photograph is used. Roof machinery, fine fluting, exact capitals, ornate carving, external curved south stair detail, north lawn landscaping and interior rooms are omitted/approximated. Night changes material palettes and warms selected windows; actual night illumination has not been measured.

## Verification

The first procedural near/light sheet was inspected at tmp/top-cities/shots/white-house/white-house-procedural-near-light-sheet.jpg against the dossier sheet and the additional south photo. This prompted hard planar pediment normals (removing the rounded highlight), pale column material, state-floor window hoods and correction of the shaft-to-base junction. Window tests use an off-mullion ray so they inspect the recess itself.

Final exported contact-sheet paths, metrics and check results are recorded below after validation. Cityscape: **not tested yet**. Full 3D world: **not tested yet**. These exports and local inspector images do not certify provider replacement, runtime shading, DEM refinement, terrain pads, mode/lifecycle transitions or hardware performance.

## Rebuild

```sh
pnpm build:top-cities-landmarks white-house --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/white-house/white-house.test.js
node scripts/asset-catalog.mjs
node scripts/landmark-depth-layers.mjs --ids white-house
node scripts/landmark-depth-layers.mjs --ids white-house --check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids white-house --out tmp/top-cities/white-house/qa-metrics.json
node .agents/skills/build-3d-city/scripts/shot.mjs white-house --source glb --detail far --theme dark --sheet --out tmp/top-cities/shots/white-house
```

## Final measured handoff — 2026-10-12

| Export | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 26,338 | 8 | 1,194,012 | 1,166 |
| Far | 5,890 | 7 | 311,504 | 304 |

Looked at **tmp/top-cities/shots/white-house/white-house-final-reference-contact.jpg**: eight rows (overview, facade, back, roof, entrance, detail, west and plan), reference photographs alongside all four exported near/far and light/dark variants. The underlying final sheets are `white-house-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory. Near preserves Ionic capital hints/mullions; far preserves the porticoes, window bay/row grid, roof balusters, chimneys and flag. A street-height north facade camera (y=6 m) and closer detail camera were selected so the photos and model can be compared at similar angles. The north basement remains exposed on flat ground; landscaping and the north/south site-grade difference are deliberately outside this rigid asset. The far facade is deliberately less ornamented. West Wing roof/service details are simplified.

Depth generation/check passes with **zero material cycles**; partitioning the flag canton/stripes removed the initial flag-only cycles. Export QA reports **zero issues**, zero different-material coplanar pairs, zero unresolved layered face area and **0.4% back-face first hits over 236 deterministic rays** (below the 2% threshold). No removable free-standing bridge attributes remain. Both LODs stay on grade and within the mapped envelope; their bounds differ by under 0.15 m.

The specified combined city conformance/White House test command passes; all **seven landmark-specific tests** pass, including published dimensions, true portico gaps, six north/six south shafts, recessed window rows, named platform/entablature contacts with shortened-end negative controls, low West Wing, construction exclusions and LOD/footprint containment. Float32-boundary contact samples sit 3 cm inside the platform rather than exactly on its straight closing edge. `node scripts/asset-catalog.mjs` passes (266 entries / 488 variants at the final check), and `pnpm assets:preview` generates the local inspector. Westerkerk initially blocked shared checks with a missing doc/over-budget far export; those concurrent issues cleared and the final commands passed.

Only this landmark's files/exports and the permitted generated `depth-layers.js` entry were changed by this worker; no registry, renderer, package or script edits were needed. No commits, app servers, app builds or deployment commands were run.
