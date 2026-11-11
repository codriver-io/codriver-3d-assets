# UC Riverside Bell Tower — Riverside

Original UC Riverside carillon: four tall concrete piers, perforated horizontal grille shaft, square clock faces, open upper bell chamber with fine vertical bars and an overhanging flat crown.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/University_of_California,_Riverside_campus)
- [Owned OSM way 544203788](https://www.openstreetmap.org/way/544203788)
- [File:Ucr-belltower straight.jpg  —  AllyUnion  —  Attribution](https://commons.wikimedia.org/wiki/File:Ucr-belltower_straight.jpg)
- [File:UCR Belltower night.JPG  —  Xsolidsnail  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:UCR_Belltower_night.JPG)
- [UC Riverside: dedication and official 161 ft tower height](https://giving.ucr.edu/giving-societies/bell-tower-society)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:Ucr-belltower straight.jpg | AllyUnion | Attribution | https://commons.wikimedia.org/wiki/File:Ucr-belltower_straight.jpg; 2.jpg | File:UCR Belltower night.JPG | Xsolidsnail | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:UCR_Belltower_night.JPG

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 7.88 | OSM outline envelope |
| Depth in model axes | 7.89 | OSM outline envelope |
| Highest point | 49.07 | Official UC Riverside: 161 ft (49.073 m); OSM height tag 49 m |

Official UCR height is 161 ft, modeled as 49.07 m; mapped plan is approximately 7.9 m square. Clock stage at 32 m, grille pitch, piers, bell-chamber height and crown overhang are photo estimates. Grille slots and upper chamber remain physically open in both LODs. No surrounding campus buildings, landscape, UCR letters or logos.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.3281749,33.97334275]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.3281884,33.9733085],[-117.328161,33.9733085]]` yield baked yaw 0.0000 degrees; the host must not rotate again. OSM way 544203788 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4968 | 3 | 66400 |
| far | 2304 | 3 | 33988 |

Deterministic metrics: `tmp/batch/ucr-bell-tower-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/ucr-bell-tower.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/ucr-bell-tower/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Pier proportions, 161 ft total, dense lower perforated grille, open upper carillon chamber, clock stage and projecting crown checked against straight-on daytime and opposite nighttime references. No terrain placement claim. First automatic framing clipped the tall tower; final sheet uses explicit bounds tmp/batch/ucr-qa-bounds.json and wider view presets, plus a letterboxed reference. Complete crown and footing inspected in the reframed export and far/dark view.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Coarsened repeated shaft grille bars and fine upper rods while retaining open slots, the four clocks and the full open upper chamber.

Near: 4968 triangles / 3 draws / 66400 bytes. Far: 2304 triangles / 3 draws / 33988 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: ucr-bell-tower.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.
