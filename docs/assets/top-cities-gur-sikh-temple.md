# Gur Sikh Temple — Abbotsford

Historic Gur Sikh Temple: white raised-basement vernacular hall with a flat false front, two narrow high windows, concealed front gable, blue central concrete stair, open wraparound veranda, four secondary stair flights, lower rear additions and external brick chimney.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://canadiansikhheritage.ca/designation/)
- [Owned OSM way 274888717](https://www.openstreetmap.org/way/274888717)
- [File:Gur Sikh Temple 02.jpg  —  Jacobsimmonds  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Gur_Sikh_Temple_02.jpg)
- [File:Gur Sikh Temple 01.jpg (southwest exterior)  —  Jacobsimmonds  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Gur_Sikh_Temple_01.jpg)
- [Parks Canada: historic false-front hall, veranda and additions](https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=10044)
- [Operator and City heritage statement: five access stairs and three-sided gallery](https://canadiansikhheritage.ca/designation/)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:Gur Sikh Temple 02.jpg | Jacobsimmonds | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Gur_Sikh_Temple_02.jpg; 2.jpg | File:Gur Sikh Temple 01.jpg (southwest exterior) | Jacobsimmonds | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Gur_Sikh_Temple_01.jpg

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 15.4 | OSM outline envelope with explicit authoring estimate |
| Depth in model axes | 32.5 | OSM outline envelope with explicit authoring estimate |
| Highest point | 11.2 | photo estimate for the flat false-front parapet, above the 9.8 m gable; no surveyed height published |

The original historic temple at mapped way274888717 is modeled, excluding the large modern temple across South Fraser Way. Heritage descriptions identify the false front masking a gabled roof, full raised basement, three-sided veranda, five separate stairs, 1932 lower gable addition and later shed addition. All metre heights, step count and side-flight locations are photo-based estimates. Gallery is 3.0 m above the rigid foundation datum; each stair first tread is at least 0.16 m above local grade. The owned building excludes the separately situated Nishan Sahib flagpole, monuments and garden. No lettering, symbols, emblems, signs or terrain are baked in.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-122.30721825,49.0510444]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-122.3071568,49.0510573],[-122.3071823,49.0509227]]` yield baked yaw -7.0778 degrees; the host must not rotate again. OSM way 274888717 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the mapped building/veranda ring and separate footprint estimates for all five stair feet and landings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3560 | 8 | 58516 |
| far | 2628 | 8 | 48472 |

Deterministic metrics: `tmp/batch/gur-sikh-temple-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/gur-sikh-temple.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/gur-sikh-temple/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Two looks against both restored exterior views: false-front height and narrow upper sash windows, white double entry, real canopy underside, open gallery and blue poured stair retained. Four secondary flights and all veranda posts meet actual landing/canopy triangles in both LODs; lowered-support controls fail. Far/night and footprint overlays read; no application mode claim.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.
