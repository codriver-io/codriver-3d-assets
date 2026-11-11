# San Bernardino County Courthouse — San Bernardino

Original procedural 1927 San Bernardino County Courthouse: long pale classical facade, monumental engaged column order, projecting end pavilions, deep cornice and recessed upper floor.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/San_Bernardino_County_Courthouse)
- [Owned OSM way 205590361](https://www.openstreetmap.org/way/205590361)
- [File:San Bernardino County Courthouse 2.jpg  —  Einbierbitte  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:San_Bernardino_County_Courthouse_2.jpg)
- [File:San Bernardino County Courthouse 1.jpg  —  Einbierbitte  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:San_Bernardino_County_Courthouse_1.jpg)
- [File:San Bernardino Courthouse 3.jpg  —  Einbierbitte  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:San_Bernardino_Courthouse_3.jpg)
- [NPS National Register nomination: 1927 building and removed radio tower](https://npgallery.nps.gov/GetAsset/5af5f0bc-85c0-4723-a88b-dc2f815f0aae)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:San Bernardino County Courthouse 2.jpg | Einbierbitte | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:San_Bernardino_County_Courthouse_2.jpg; 2.jpg | File:San Bernardino County Courthouse 1.jpg | Einbierbitte | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:San_Bernardino_County_Courthouse_1.jpg; 3.jpg | File:San Bernardino Courthouse 3.jpg | Einbierbitte | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:San_Bernardino_Courthouse_3.jpg

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 90 | OSM outline envelope with explicit authoring estimate |
| Depth in model axes | 24.6 | OSM outline envelope with explicit authoring estimate |
| Highest point | 18.3 | NPS nomination approximately 60 ft (18.288 m), rounded to 18.3 m |

NPS nomination describes an approximately 296 ft long, 60 ft high building, 25 ft columns, three visible facade floors, and a fourth floor set 30 ft back. OSM maps 91.4 by 27.3 m; modeled body fits at 90 by 24.6 m. The centre has nine bays, each flank six and each end three. Column placement, parapets and detail are simplified photo estimates. The radio tower removed in 1959 and adjoining structures are excluded; no lettering or flags.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.28903585,34.10550375]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.2891732,34.1055191],[-117.2891709,34.1052015]]` yield baked yaw -89.6564 degrees; the host must not rotate again. OSM way 205590361 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6328 | 4 | 76172 |
| far | 5416 | 4 | 66520 |

Deterministic metrics: `tmp/batch/san-bernardino-county-courthouse-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/san-bernardino-county-courthouse.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/san-bernardino-county-courthouse/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: First sheet showed an over-tall office-like frontage; NPS dimensions corrected total height from 24 m to 18.3 m, columns from 14.3 m to 7.62 m, three visible window rows and the 3/6/9/6/3 bay rhythm. Added the end column groups, dentil cornice and three raised parapets; fourth floor moved 9 m behind frontage. Final exported near/far and footprint top inspected.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.
