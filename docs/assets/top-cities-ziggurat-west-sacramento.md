# The Ziggurat — West Sacramento

The Ziggurat: a pale gold ten-tier stepped office pyramid, continuous dark horizontal glazing, deeply stepped and curved entrance recesses, inset roof terraces and a small top service cap.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://www.loc.gov/resource/highsm.23788/)
- [Owned OSM way 32492101](https://www.openstreetmap.org/way/32492101)
- [Owned OSM way 1420771871](https://www.openstreetmap.org/way/1420771871)
- [Owned OSM way 1420771872](https://www.openstreetmap.org/way/1420771872)
- [Owned OSM way 1420771873](https://www.openstreetmap.org/way/1420771873)
- [Owned OSM way 1420772445](https://www.openstreetmap.org/way/1420772445)
- [Owned OSM way 1420789292](https://www.openstreetmap.org/way/1420789292)
- [Owned OSM way 1420789293](https://www.openstreetmap.org/way/1420789293)
- [Owned OSM way 1420789294](https://www.openstreetmap.org/way/1420789294)
- [Owned OSM way 1420789295](https://www.openstreetmap.org/way/1420789295)
- [Owned OSM way 1420789296](https://www.openstreetmap.org/way/1420789296)
- [Owned OSM way 1420789297](https://www.openstreetmap.org/way/1420789297)
- [File:Ziggurat Building.jpg  —  Coolcaesar at en.wikipedia  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Ziggurat_Building.jpg)
- [File:The Ziggurat West Sacramento 2021-06-22.jpg  —  Mackinacbridge  —  CC0](https://commons.wikimedia.org/wiki/File:The_Ziggurat_West_Sacramento_2021-06-22.jpg)
- [File:The Ziggurat in West Sacramento, CA.jpg  —  J.smith  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:The_Ziggurat_in_West_Sacramento,_CA.jpg)
- [City2022 River II design review site plan labels existing Ziggurat10stories](https://www.cityofwestsacramento.org/home/showpublisheddocument/13733/637903851135800000)
- [Miyamoto structural engineer:11storey convention](https://miyamotointernational.com/projects/the-ziggurat-californiadepartment-of-general-services-headquarters/)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:Ziggurat Building.jpg | Coolcaesar at en.wikipedia | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Ziggurat_Building.jpg; 2.jpg | File:The Ziggurat West Sacramento 2021-06-22.jpg | Mackinacbridge | CC0 | https://commons.wikimedia.org/wiki/File:The_Ziggurat_West_Sacramento_2021-06-22.jpg; 3.jpg | File:The Ziggurat in West Sacramento, CA.jpg | J.smith | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:The_Ziggurat_in_West_Sacramento,_CA.jpg

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 84 | OSM outline envelope with explicit authoring estimate |
| Depth in model axes | 94 | OSM outline envelope with explicit authoring estimate |
| Highest point | 48 | OSM48m; tier elevations mapped6/10.5/15/19.5/24/28.5/33/37.5/42/46.5m and a fitted48m roof service cap, all unsurveyed estimates |

Only the ten occupied stepped office tiers and roof cap; adjacent parking garage, freestanding seal, plaza, flags and signage excluded. LOC and City planning identify ten storeys, while structural consultant Miyamoto calls it11storey; ten mapped floor tiers plus service cap reconcile these conventions but are not a measured count of interior floors.48m is an OSM/photo estimate, not a published survey. Literal ten OSM building-part outlines preserve stepped entrance recesses and the curved second-floor edge. Terraces and overhang soffits use polygon differences so no hidden full roof planes overlap. Ground model meets y=0; no separate pavement surface.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-121.50961964999999,38.58288675]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-121.5092265,38.5824176],[-121.5101748,38.582531]]` yield baked yaw 171.3025 degrees; the host must not rotate again. OSM way 32492101, OSM way 1420771871, OSM way 1420771872, OSM way 1420771873, OSM way 1420772445, OSM way 1420789292, OSM way 1420789293, OSM way 1420789294, OSM way 1420789295, OSM way 1420789296, OSM way 1420789297 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15366 | 5 | 178896 |
| far | 6064 | 4 | 79736 |

Deterministic metrics: `tmp/batch/ziggurat-west-sacramento-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/ziggurat-west-sacramento.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/ziggurat-west-sacramento/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: All three exterior Commons photos verified as this retained stepped pyramid; differing angles confirm continuous bands, gold panels and portal recess. No facade seal/sign is reproduced.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.
