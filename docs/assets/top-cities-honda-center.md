# Honda Center — Anaheim

Honda Center arena with its mapped stepped granite envelope, two monumental semicircular glazed entrances, subdued terracotta stone courses, corner green glazing and shallow copper roof.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/Honda_Center)
- [Owned OSM way 120623151](https://www.openstreetmap.org/way/120623151)
- [File:Honda Center 2026.jpg  —  Troutfarm27  —  CC BY 4.0](https://commons.wikimedia.org/wiki/File:Honda_Center_2026.jpg)
- [File:Honda-ext-arch.JPG  —  Arnold C (Buchanan-Hermit)  —  Attribution](https://commons.wikimedia.org/wiki/File:Honda-ext-arch.JPG)
- [Structural engineer: 329 by 444 ft roof span](https://www.thorntontomasetti.com/project/honda-center)
- [Operator: current arena and South Edition works](https://www.hondacenter.com/hondacenter/plan-your-visit/arena-info)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:Honda Center 2026.jpg | Troutfarm27 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Honda_Center_2026.jpg; 2.jpg | File:Honda-ext-arch.JPG | Arnold C (Buchanan-Hermit) | Attribution | https://commons.wikimedia.org/wiki/File:Honda-ext-arch.JPG

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 142.22 | OSM outline envelope |
| Depth in model axes | 108.81 | OSM outline envelope |
| Highest point | 33 | exterior overall height estimated; published 80 ft is interior floor-to-ceiling, not the exterior peak |

Mapped 142 by 109 m outer envelope; engineer reports a 329 by 444 ft roof span. Overall 33 m, portal radius 24 m, facade courses and roof curvature are photo estimates. Operator describes an ongoing five-storey South Edition; proposed additions are excluded, modeling the extant photographed main arena, not a future completion. No signs, logos, banners, parking or temporary construction.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.87653495,33.8078251]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.8769366,33.8073364],[-117.8761188,33.8073411]]` yield baked yaw 0.3963 degrees; the host must not rotate again. OSM way 120623151 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4299 | 6 | 46720 |
| far | 2035 | 6 | 30284 |

Deterministic metrics: `tmp/batch/honda-center-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/honda-center.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/honda-center/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Two exterior references including 2026 view checked for the original granite shell and tall arched entrance. Future South Edition excluded; upper roof estimate documented.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Shifted facade stone/courses to darker muted rose-brown; copper roof, arched glazing and geometry are unchanged.

Near: 4299 triangles / 6 draws / 46720 bytes. Far: 2035 triangles / 6 draws / 30284 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: honda-center.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.
