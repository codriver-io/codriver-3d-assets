# Perris Depot — Perris

Original Queen Anne Perris Depot: long red-brown brick station, deep shingled roof, raised central cross roof, projecting bay and an open white belfry under a silver conical turret.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/Perris_Depot)
- [Owned OSM way 87554163](https://www.openstreetmap.org/way/87554163)
- [File:Perris Depot.jpg  —  Ymblanter, 11 March 2012  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Perris_Depot.jpg)
- [Restored depot station dedication, 2009  —  Perris Valley Historical Museum  —  All rights reserved; comparison only](https://www.perrisvalleyhistoricalmuseum.com/)
- [Library of Congress HABS CA-2910, actual depot coordinates and identity](https://www.loc.gov/pictures/item/ca4188/)
- [Museum operator: restored exterior at station dedication](https://www.perrisvalleyhistoricalmuseum.com/)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:Perris Depot.jpg | Ymblanter, 11 March 2012 | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Perris_Depot.jpg; 2.jpg | Restored depot station dedication, 2009 | Perris Valley Historical Museum | All rights reserved; comparison only | https://www.perrisvalleyhistoricalmuseum.com/

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 39.06 | OSM outline envelope with explicit authoring estimate |
| Depth in model axes | 12.33 | OSM outline envelope with explicit authoring estimate |
| Highest point | 14.8 | Photo estimate, not a survey |

The OSM outline measures about 39 by 12 m; 4.3 m eave, 10.8 m cross-roof crown and 14.8 m turret tip are photographic estimates. Library of Congress and OSM locate the restored depot at 120 W Fourth Street; Wikipedia latitude is incorrect. Model depicts the restored 2009 exterior, omits the flag and all lettering.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.22935905,33.7826326]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.2293101,33.7826251],[-117.229321,33.7824553]]` yield baked yaw -93.0541 degrees; the host must not rotate again. OSM way 87554163 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 892 | 5 | 20288 |
| far | 700 | 5 | 18456 |

Deterministic metrics: `tmp/batch/perris-depot-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/perris-depot.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/perris-depot/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: First sheet showed excessive exposed upper brickwork and smoothed hip-roof normals; lowered the central eave to 6.8 m, steepened the cross roof and used flat roof-facet normals. Final exported near/far retain the long low depot, open white turret and pointed silver cone. Mapped plan and raised platform checked; app modes remain not tested.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.
