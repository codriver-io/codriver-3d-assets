# The STRAT Tower — Las Vegas

The STRAT observation tower: three curving concrete legs and open lower intervals, a flared shaft fan, two sloped observation glazing banks with lower diagrid, bronze roof and tall lattice ride/antenna mast.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://www.skyscrapercenter.com/building/the-strat-tower/9401)
- [Owned OSM way 135457469](https://www.openstreetmap.org/way/135457469)
- [The Strat observation tower2026-09-26 1,current exterior  —  Yelderberry  —  CC BY-SA4.0](https://commons.wikimedia.org/wiki/File:The_Strat_observation_tower_2026-09-26_1.jpg)
- [The Strat observation tower2026-09-26 2,current exterior  —  Yelderberry  —  CC BY-SA4.0](https://commons.wikimedia.org/wiki/File:The_Strat_observation_tower_2026-09-26_2.jpg)
- [Stratosphere tower pod2012, structural comparison only; obsolete rides excluded  —  Sergey Galyonkin  —  CC BY-SA2.0](https://commons.wikimedia.org/wiki/File:Stratosphere_tower_pod,_2012.jpg)
- [Big Shot2026 exterior ride detail, official operator  —  The STRAT publisher; photographer uncredited  —  Copyright/all rights reserved, comparison only](https://thestrat.com/attractions/thrill-rides)
- [Operator tower height1149ft](https://tickets.thestrat.com/eventperformances.asp?coupon=STRAT30&evt=4)
- [Current operator2026 ride listing; Big Shot and X-Scream hardware context](https://thestrat.com/attractions/thrill-rides)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | The Strat observation tower2026-09-26 1,current exterior | Yelderberry | CC BY-SA4.0 | https://commons.wikimedia.org/wiki/File:The_Strat_observation_tower_2026-09-26_1.jpg; 2.jpg | The Strat observation tower2026-09-26 2,current exterior | Yelderberry | CC BY-SA4.0 | https://commons.wikimedia.org/wiki/File:The_Strat_observation_tower_2026-09-26_2.jpg; pod-old.jpg | Stratosphere tower pod2012, structural comparison only; obsolete rides excluded | Sergey Galyonkin | CC BY-SA2.0 | https://commons.wikimedia.org/wiki/File:Stratosphere_tower_pod,_2012.jpg; bigshot-current.jpg | Big Shot2026 exterior ride detail, official operator | The STRAT publisher; photographer uncredited | Copyright/all rights reserved, comparison only | https://thestrat.com/attractions/thrill-rides

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 56 | OSM outline envelope with explicit authoring estimate |
| Depth in model axes | 56 | OSM outline envelope with explicit authoring estimate |
| Highest point | 350.2 | 1149ft=350.215m rounded350.2m, operator and CTBUH; pod levels/diameters and shaft sections are photo estimates |

Observation tower135457469 only; casino/hotel135456188 and attached entertainment facilities are excluded.350.2m adopted from CTBUH and operator1149ft; all intermediate profile elevations, cross sections and ride-mast dimensions are photo estimates. September2026 Yelderberry photos establish current three-legged exterior;2012 pod detail used only for unchanged glazing/fan structure. Current operator lists Big Shot and X-Scream; removed Insanity/High Roller are excluded, and fine X-Scream/SkyJump hardware is omitted at road scale. Big Shot lattice and antenna retain the tall architectural outline without logos, signs, moving riders or lettering. Main legs and compact lift core stand on y=0, with actual lower openings retained in far; no terrain/plaza baked. Tripod angular phase is a photo estimate from the mapped southerly2026 camera positions; the circular OSM perimeter establishes centre/envelope while its two control points provide the baked geographic frame. Above110m the tapered concrete web joins the legs; their upper outer edges meet the241m fan ring. Wide explicit QA bounds prevent automatic street framing from clipping this350m asset; separate full-height and pod-detail presets supplement the contact sheet.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-115.15552055,36.1474087]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-115.1558053,36.1473783],[-115.1557876,36.1473236]]` yield baked yaw -75.3564 degrees; the host must not rotate again. OSM way 135457469 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4892 | 8 | 65004 |
| far | 2360 | 8 | 42080 |

Deterministic metrics: `tmp/batch/strat-tower-las-vegas-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/strat-tower-las-vegas.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/strat-tower-las-vegas/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Two current September2026 street exteriors verified against OSM tower circle, with older structural pod detail and official2026 BigShot photo as supplemental comparison. Removed rides and casino interiors discarded; no app mode tested.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Added named pod/crown inspection presets and close near/far pod plus full crown/mast contact-sheet tiles; geometry/exports remain byte-identical.

Near: 4892 triangles / 8 draws / 65004 bytes. Far: 2360 triangles / 8 draws / 42080 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: strat-tower-las-vegas.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.

## 2026-11-10 application framing follow-up

Retained casino roofs obscure lower legs/footings. Custom center -115.15572,36.1474087; zoom 18.2, pitch 60, bearing 90; no model edits. The closer base frame still has casino roofs across the lower legs; complete ground contact and base provider replacement remain not tested in both modes. Final verdict: Cityscape **not tested**; Full 3D world **not tested**. Before/after evidence, capture diagnostics and exact command arguments are recorded in the follow-up report. No readiness gate was changed from a framing/data gap.
