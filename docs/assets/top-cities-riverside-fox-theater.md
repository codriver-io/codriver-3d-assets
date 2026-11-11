# Fox Performing Arts Center — Riverside

Original Riverside Fox theatre: mapped angled auditorium, two-storey Spanish Colonial arcades, terracotta roofs and octagonal corner tower with quatrefoil windows, open belfry and a small roofed cupola.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/Riverside_Fox_Theater)
- [Owned OSM way 232932288](https://www.openstreetmap.org/way/232932288)
- [File:The Fox Theater after its renovations in 2008.jpg  —  Roujiamo87  —  CC0](https://commons.wikimedia.org/wiki/File:The_Fox_Theater_after_its_renovations_in_2008.jpg)
- [File:Fox Performing Arts Center, Riverside.jpg  —  Phoebe  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Fox_Performing_Arts_Center,_Riverside.jpg)
- [File:Fox Theater, Riverside CA.jpg  —  Bahugala  —  CC BY 2.0](https://commons.wikimedia.org/wiki/File:Fox_Theater,_Riverside_CA.jpg)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:The Fox Theater after its renovations in 2008.jpg | Roujiamo87 | CC0 | https://commons.wikimedia.org/wiki/File:The_Fox_Theater_after_its_renovations_in_2008.jpg; 2.jpg | File:Fox Performing Arts Center, Riverside.jpg | Phoebe | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Fox_Performing_Arts_Center,_Riverside.jpg; 3.jpg | File:Fox Theater, Riverside CA.jpg | Bahugala | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Fox_Theater,_Riverside_CA.jpg

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 67.04 | OSM outline envelope |
| Depth in model axes | 44.56 | OSM outline envelope |
| Highest point | 22 | Photo estimate, not a survey |

OSM supplies the approximately 67 by 44.6 m skewed envelope and bevelled entrance corner. The 9.8 m arcade eave, 14.8 m tower shoulder and 22 m cupola tip are photo estimates, not surveyed heights. Ground arcades and belfry openings remain genuine holes in both LODs. Rear roof/service details simplified; no signs, lettering, logos or neighboring Food Lab buildings.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.37527349999999,33.98397195]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.3751494,33.9836676],[-117.3756593,33.9839108]]` yield baked yaw 150.0923 degrees; the host must not rotate again. OSM way 232932288 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 16231 | 4 | 293672 |
| far | 7967 | 4 | 153024 |

Deterministic metrics: `tmp/batch/riverside-fox-theater-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/riverside-fox-theater.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/riverside-fox-theater/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: First sheet confirmed the mapped corner and the 2-storey arcades; reduced the small cupola cap to 2.7 m diameter to match its proportion to the octagonal belfry, and darkened the tile roofs. Final near/far and night export retain open arcades, recessed quatrefoils, upper belfry and small roofed cupola; footprint overlay agrees with the skewed mapped envelope.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Removed the126 upward aperture-bottom threshold triangles at grade in each LOD; jamb feet remain at y=0 and all ground-floor arches stay open. A regression test rejects every upward face below0.10m.

Near: 16231 triangles / 4 draws / 293672 bytes. Far: 7967 triangles / 4 draws / 153024 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: riverside-fox-theater.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.
