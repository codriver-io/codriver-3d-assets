# Anaheim Regional Transportation Intermodal Center — Anaheim

Original ARTIC terminal: rising parabolic shell with inflated diamond ETFE panels, pale diagrid, curved glass end walls, and the attached mapped pedestrian concourse with grounded platform-access cores.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/Anaheim_Regional_Transportation_Intermodal_Center)
- [Owned OSM way 337030853](https://www.openstreetmap.org/way/337030853)
- [File:ARTIC front façade.jpg  —  EEJCC  —  CC0](https://commons.wikimedia.org/wiki/File:ARTIC_front_fa%C3%A7ade.jpg)
- [File:ARTIC Front.JPG  —  Samuel Bernstein  —  CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:ARTIC_Front.JPG)
- [File:New Anaheim Amtrak Station Outside At Night.JPG  —  ZhengZhou  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:New_Anaheim_Amtrak_Station_Outside_At_Night.JPG)
- [Anaheim operator fact sheet: 120 ft roof](https://anaheim.net/DocumentCenter/View/23803/ARTIC-fact-sheet-fall-2018)
- [Institution of Structural Engineers: 250 by 184 ft roof and diagrid](https://www.istructe.org/structural-awards/projects/2015/anaheim-regional-transportation-intermodal-center/)
- [Architect HOK: parabolic diamond steel arches and ETFE](https://www.hok.com/projects/view/anaheim-regional-transportation-intermodal-center/)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:ARTIC front façade.jpg | EEJCC | CC0 | https://commons.wikimedia.org/wiki/File:ARTIC_front_fa%C3%A7ade.jpg; 2.jpg | File:ARTIC Front.JPG | Samuel Bernstein | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:ARTIC_Front.JPG; 3.jpg | File:New Anaheim Amtrak Station Outside At Night.JPG | ZhengZhou | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:New_Anaheim_Amtrak_Station_Outside_At_Night.JPG

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 169.88 | OSM outline envelope |
| Depth in model axes | 63.08 | OSM outline envelope |
| Highest point | 36.58 | Operator 120 ft overall; OSM tag 37 m; structural account 115 ft at main portal refers to a different height point, so 36.58 m is an adopted overall estimate |

Operator height 120 ft, steel account 115 ft and OSM 37 m do not identify exactly the same outer point; adopted overall 36.58 m is an estimate. Nominal steel roof dimensions 250 by 184 ft differ from the larger mapped building envelope, which includes bowed end walls, access projections and a long pedestrian concourse. Roof plan follows mapped boundary sections; diagrid spacing, pillows, front/back heights and 7.3 m concourse floor are estimated. Concourse access cores simplified; no road layer, tracks, trains, public plaza, lettering or logos. Terrain pads are bounded to the main hall, individual piers and two access-core bases; no rail corridor pad is authored.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.87751445,33.8030335]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.8772971,33.8030603],[-117.8771217,33.8034451]]` yield baked yaw 69.2550 degrees; the host must not rotate again. OSM way 337030853 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses explicit main-hall, access-core and individual-pier rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 10069 | 6 | 166260 |
| far | 4693 | 6 | 84320 |

Deterministic metrics: `tmp/batch/anaheim-artic-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/anaheim-artic.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/anaheim-artic/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Three current exterior views checked: high glazed portal, pale diamond roof and lit shell; footprint includes the mapped skywalk and platform heads. Main hall pad and four pier pads are separate from the railway corridor; all app placement remains not tested.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Darkened the ETFE cell material to a muted blue-grey, increasing contrast with the pale structural diagrid without changing geometry.

Near: 10069 triangles / 6 draws / 166260 bytes. Far: 4693 triangles / 6 draws / 84320 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: anaheim-artic.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.
