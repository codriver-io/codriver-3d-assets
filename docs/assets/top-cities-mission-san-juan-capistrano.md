# Mission San Juan Capistrano — San Juan Capistrano

Original exterior study of Mission San Juan Capistrano's Great Stone Church ruins and adjoining four-bell campanario: roofless nave, broken stone walls, surviving monumental arch and vaulted remnant, and four unequal suspended bronze bells.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/Mission_San_Juan_Capistrano)
- [Owned OSM way 758872476](https://www.openstreetmap.org/way/758872476)
- [Owned OSM way 1126056162](https://www.openstreetmap.org/way/1126056162)
- [File:2019 Great Stone Church, Mission San Juan Capistrano 2.jpg  —  Beyond My Ken  —  CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:2019_Great_Stone_Church,_Mission_San_Juan_Capistrano_2.jpg)
- [File:2019 Mission San Juan Capistrano bell wall.jpg  —  Beyond My Ken  —  CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:2019_Mission_San_Juan_Capistrano_bell_wall.jpg)
- [File:Mission San Juan Capistrano - Bell Wall.jpg  —  Bernard Gagnon  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Mission_San_Juan_Capistrano_-_Bell_Wall.jpg)
- [Official mission history: four campanario bells and separate damaged originals](https://www.missionsjc.com/history/)
- [Official preservation: present Great Stone Church remains](https://www.missionsjc.com/preservation/)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:2019 Great Stone Church, Mission San Juan Capistrano 2.jpg | Beyond My Ken | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2019_Great_Stone_Church,_Mission_San_Juan_Capistrano_2.jpg; 2.jpg | File:2019 Mission San Juan Capistrano bell wall.jpg | Beyond My Ken | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2019_Mission_San_Juan_Capistrano_bell_wall.jpg; 3.jpg | File:Mission San Juan Capistrano - Bell Wall.jpg | Bernard Gagnon | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Mission_San_Juan_Capistrano_-_Bell_Wall.jpg

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 56.93 | OSM outline envelope |
| Depth in model axes | 26.94 | OSM outline envelope |
| Highest point | 13.62 | OSM Great Stone Church height tag 13.62 m; current ruin envelope, not the lost original tower |

Current ruin only: no reconstruction of the seven lost domes or collapsed original bell tower. OSM maps the church and exact bell-wall alignment (barrier way 1126056162); wall 6.9 m span, 6.4 m height and arch/bell proportions are estimates from current exterior photographs. The separate two damaged original bells and the rest of the mission compound are excluded. Reusable geometry has a rigid y=0 base; the stone nave surface is at y=0.18 m.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.662117,33.502253249999995]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.6620451,33.5023164],[-117.6620678,33.5021367]]` yield baked yaw -96.0131 degrees; the host must not rotate again. OSM way 758872476, OSM way 1126056162 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4980 | 5 | 72456 |
| far | 3348 | 5 | 55368 |

Deterministic metrics: `tmp/batch/mission-san-juan-capistrano-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/mission-san-juan-capistrano.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/mission-san-juan-capistrano/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: First sheet confirmed the bell-wall geometry, four unequal bells and mapped plan; strengthened the surviving great arch with its engaged paired pilasters and moulded archivolt. The four campanario bells remain clearly unequal and suspended from tested yokes. Final near/far, mapped top and bell detail reviewed; surfaces remain texture-free and masonry detail is abstracted. No lost nave roof or original tower was reconstructed.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.
