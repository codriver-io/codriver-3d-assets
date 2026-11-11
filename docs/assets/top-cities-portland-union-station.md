# Portland Union Station — Portland

Portland Union Station: a red pressed-brick and grey pebbledash depot with hipped red roofs, long iron entrance veranda, two tall chimneys and a narrow four-clock Romanesque tower.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://www.greatamericanstations.com/stations/portland-or-pdx/)
- [Owned OSM way 156423744](https://www.openstreetmap.org/way/156423744)
- [Owned OSM way 421660583](https://www.openstreetmap.org/way/421660583)
- [Owned OSM way 443258323](https://www.openstreetmap.org/way/443258323)
- [File:UnionStationPortland.jpg  —  Cacophony  —  CC BY-SA 2.5](https://commons.wikimedia.org/wiki/File:UnionStationPortland.jpg)
- [A front view of Union Station Portland Oregon,2025 exterior  —  Bobjgalindo  —  CC BY-SA4.0](https://commons.wikimedia.org/wiki/File:A_front_view_of_Union_Station,_Portland_Oregon.jpg)
- [Oregon2026 NRHP nomination, architectural description and mapped historic components](https://www.oregon.gov/oprd/OH/Documents/OR_MultnomahCounty_UnionStation_form.pdf)
- [City2026 historic listing confirms retained multi-storey brick depot and tower](https://www.portland.gov/bps/planning/historic-resources/news/2026/9/24/national-park-service-recognizes-portlands-union)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:UnionStationPortland.jpg | Cacophony | CC BY-SA 2.5 | https://commons.wikimedia.org/wiki/File:UnionStationPortland.jpg; 2.jpg | A front view of Union Station Portland Oregon,2025 exterior | Bobjgalindo | CC BY-SA4.0 | https://commons.wikimedia.org/wiki/File:A_front_view_of_Union_Station,_Portland_Oregon.jpg

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 158 | OSM outline envelope with explicit authoring estimate |
| Depth in model axes | 79 | OSM outline envelope with explicit authoring estimate |
| Highest point | 45.72 | 150ft=45.72m clock tower, primary Amtrak Great American Stations and City/NPS nomination; other levels are photo estimates |

Only mapped main depot, clock tower421660583 and entrance canopy443258323; separate interlocking tower421660586/587, tracks, platforms, vehicles and road excluded. Primary150ft tower height adopted45.72m; roof/wing/storey levels and chimney heights are photo estimates. One rigid foundation plane y=0; canopy supports included in foundation ownership, no surrounding pavement. Windows remain individual masonry/grey infill mosaics in far, four clock faces retain hands and hour marks, and canopy remains physically open. No lettering, neon words, logos, flags or trademark signs; an open roof support frame retains the architectural silhouette.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-122.67676675,45.52901325]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-122.6760422,45.5286398],[-122.6763658,45.5289024]]` yield baked yaw 130.8034 degrees; the host must not rotate again. OSM way 156423744, OSM way 421660583, OSM way 443258323 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11499 | 8 | 136744 |
| far | 5989 | 8 | 81068 |

Deterministic metrics: `tmp/batch/portland-union-station-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/portland-union-station.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/portland-union-station/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Two exterior photos verified:2005 full depot and2025 street detail confirm retained red roof, pebbledash panels and clocks; irrelevant lobby/hallway originals discarded. Exact tower location and mapped canopy checked against the main stepped footprint.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Grouped far window bays at twice the near pitch while preserving all three floors, separate windows, the clock tower and open veranda; retained cardinal clock ticks and hands in far. Omitted sub-pixel windows on short curved/chamfer return edges; the main wing bays remain separate.

Near: 11499 triangles / 8 draws / 136744 bytes. Far: 5749 triangles / 8 draws / 78296 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: portland-union-station.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.

## Curved-bay re-review follow-up

The previous far optimisation suppressed every short-edge window on the small curved frontage. Far now retains 15 separate window quads per storey on all three levels, with glass at y=1.40–3.95, 5.40–7.95 and 9.40–11.95 m. Full-height supporting piers and shared horizontal masonry bands keep the restored curve inexpensive. The mapped curved silhouette, clock tower and open veranda are unchanged; the near GLB is byte-identical.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11499 | 8 | 136744 |
| far | 5989 | 8 | 81068 |

Exported glass in local x=[-68,-52], z=[-12,0], selected by triangle centroid after undoing the baked SPEC.rotation:

| LOD | Glass triangles | Glass area (m²) | Triangles per storey |
| --- | ---: | ---: | --- |
| near (unchanged) | 96 | 86.667582 | 32 / 32 / 32 |
| far | 90 | 71.943240 | 30 / 30 / 30 |

The far curve itself has 15 bays on each of three storeys, exceeding the six-bay minimum. The region also intersects an adjacent long-wing window in near; the coarser long-wing window spacing in far is retained. Glass replaces masonry faces, with no overlapping backing wall. A new regional regression test requires substantial glass and at least six distinct quads on each of all three levels; the existing silhouette, opening and veranda bearing tests remain green.

Evidence: one new exported contact sheet, with matched close near/far views of the curve; `tmp/portland-review/exported-glass.json` records the actual GLB triangle/area audit. Deterministic QA: zero flags. Depth check: current, zero dropped cycles. Cityscape: **not tested**; Full 3D world: **not tested**. No application server or app screenshot was used. The lead specified that passing tests and these exported numbers close the batch review; application verification remains a later stage.

Verification for this correction: all 5 landmark-specific tests and all 3 Portland source/export/catalog conformance tests pass; `pnpm assets:check` validates 470 entries and 928 GLB variants; `pnpm assets:preview` builds the static local catalog. No generated depth-table change was required.
